import apiClient from "../api/client";
import { buildDownloadUrls, downloadFile } from "../api/download";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray, unwrapData, type ApiResponse } from "./api-response";
import type {
  Assignment,
  AssignmentAttachment,
  AssignmentDetail,
  Submission,
  AssignmentStats,
  AssignmentFormData,
} from "../app/features/assignments/types/assignment.types";

type RawAssignment = Partial<AssignmentDetail> & {
  courseName?: string;
  title?: string;
  totalScore?: number;
};

type RawSubmission = Partial<Submission> & {
  studentCode?: string;
  fileName?: string;
  originalFileName?: string;
  attachmentName?: string;
  score?: number | null;
  url?: string;
};

function toApiDueDate(data: Partial<AssignmentFormData>): string | undefined {
  if (!data.dueDate) return undefined;
  return data.dueTime ? `${data.dueDate}T${data.dueTime}:00` : data.dueDate;
}

function getHoursLeft(dueDate?: string): number {
  if (!dueDate) return 0;
  const dueTime = new Date(dueDate).getTime();
  if (Number.isNaN(dueTime)) return 0;
  return Math.max(0, Math.ceil((dueTime - Date.now()) / 36e5));
}

function getAssignmentStatus(dueDate?: string): string {
  return getHoursLeft(dueDate) > 0 ? "Chưa nộp" : "Quá hạn";
}

function normalizeAttachment(
  attachment: Partial<AssignmentAttachment> & {
    fileName?: string;
    originalFileName?: string;
    fileSize?: number | string;
    fileUrl?: string;
    path?: string;
    downloadUrl?: string;
  },
): AssignmentAttachment {
  const size = attachment.size ?? attachment.fileSize;
  let rawUrl =
    attachment.downloadUrl ||
    attachment.url ||
    attachment.fileUrl ||
    attachment.path ||
    "";

  rawUrl = rawUrl.replace(/^\/?api\//, "");

  return {
    id: Number(attachment.id),
    name:
      attachment.name ||
      attachment.fileName ||
      attachment.originalFileName ||
      "Tệp đính kèm",
    size: size === undefined ? "" : String(size),
    url: rawUrl,
  };
}

function normalizeAssignment(raw: RawAssignment): AssignmentDetail {
  const dueDate = raw.dueDate || "";
  const courseId = raw.courseId || 0;
  return {
    id: Number(raw.id),
    name: raw.name || raw.title || "",
    course:
      raw.course || raw.courseName || (courseId ? `Khóa học #${courseId}` : ""),
    courseId,
    dueDate,
    hoursLeft: raw.hoursLeft ?? getHoursLeft(dueDate),
    description: raw.description || "",
    requirements: raw.requirements || [],
    attachments: (raw.attachments || []).map(normalizeAttachment),
    maxScore: raw.maxScore ?? raw.totalScore ?? 10,
  };
}

function normalizeSubmission(raw: RawSubmission): Submission {
  let rawUrl = raw.fileUrl || raw.url || "";
  rawUrl = rawUrl.replace(/^\/?api\//, "");

  return {
    id: Number(raw.id),
    studentName: raw.studentName || "",
    studentId: String(raw.studentId || raw.studentCode || ""),
    submittedAt: raw.submittedAt || "",
    file:
      raw.file ||
      raw.fileName ||
      raw.originalFileName ||
      raw.attachmentName ||
      "",
    fileUrl: rawUrl,
    grade: raw.grade ?? raw.score ?? null,
    feedback: raw.feedback || "",
    status:
      raw.status ||
      (raw.grade === null || raw.grade === undefined ? "submitted" : "graded"),
  };
}

function buildAssignmentPayload(
  data: Partial<AssignmentFormData> & { courseId?: number },
) {
  return {
    courseId: data.courseId,
    name: data.name,
    description: data.description,
    dueDate: toApiDueDate(data),
    maxScore: data.maxScore,
  };
}

async function uploadAssignmentAttachments(
  assignmentId: number,
  attachments?: File[],
): Promise<void> {
  if (!attachments?.length) return;

  await Promise.all(
    attachments.map((file) => {
      const formData = new FormData();
      formData.append("assignmentId", String(assignmentId));
      formData.append("file", file);
      return apiClient.post(ENDPOINTS.ASSIGNMENT_ATTACHMENTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }),
  );
}

export async function getAssignments(params?: {
  status?: string;
  courseId?: number;
}): Promise<Assignment[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.ASSIGNMENTS.LIST, {
    params,
  });
  return unwrapArray<RawAssignment>(response.data).map((assignment) => {
    const normalized = normalizeAssignment(assignment);
    return {
      ...normalized,
      status: assignment.status || getAssignmentStatus(normalized.dueDate),
    };
  });
}

export async function getAssignmentDetail(
  id: number,
): Promise<AssignmentDetail> {
  const [assignmentResponse, attachmentsResponse] = await Promise.all([
    apiClient.get<unknown>(ENDPOINTS.ASSIGNMENTS.DETAIL(id)),
    apiClient.get<unknown>(ENDPOINTS.ASSIGNMENT_ATTACHMENTS.BY_ASSIGNMENT(id)),
  ]);
  return normalizeAssignment({
    ...unwrapData<RawAssignment>(assignmentResponse.data),
    attachments: unwrapArray<AssignmentAttachment>(attachmentsResponse.data),
  });
}

export async function createAssignment(
  data: AssignmentFormData & { courseId: number },
): Promise<Assignment> {
  const response = await apiClient.post<ApiResponse<RawAssignment>>(
    ENDPOINTS.ASSIGNMENTS.CREATE,
    buildAssignmentPayload(data),
  );
  const assignment = normalizeAssignment(
    unwrapData<RawAssignment>(response.data),
  );
  await uploadAssignmentAttachments(assignment.id, data.attachments);
  return {
    ...assignment,
    status: getAssignmentStatus(assignment.dueDate),
  };
}

export async function updateAssignment(
  id: number,
  data: Partial<AssignmentFormData>,
): Promise<Assignment> {
  const response = await apiClient.put<ApiResponse<RawAssignment>>(
    ENDPOINTS.ASSIGNMENTS.UPDATE(id),
    buildAssignmentPayload(data),
  );
  const assignment = normalizeAssignment(
    unwrapData<RawAssignment>(response.data),
  );
  await uploadAssignmentAttachments(assignment.id, data.attachments);
  return {
    ...assignment,
    status: getAssignmentStatus(assignment.dueDate),
  };
}

export async function deleteAssignment(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.ASSIGNMENTS.DELETE(id));
}

export async function getSubmissions(
  assignmentId: number,
): Promise<Submission[]> {
  const response = await apiClient.get<unknown>(
    ENDPOINTS.SUBMISSIONS.BY_ASSIGNMENT(assignmentId),
  );
  return unwrapArray<RawSubmission>(response.data).map(normalizeSubmission);
}

export async function submitAssignment(
  assignmentId: number,
  data: { file: File; note?: string; studentId: number },
): Promise<void> {
  const formData = new FormData();
  formData.append("assignmentId", String(assignmentId));
  formData.append("studentId", String(data.studentId));
  formData.append("file", data.file);
  if (data.note) formData.append("note", data.note);
  await apiClient.post(ENDPOINTS.SUBMISSIONS.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function gradeSubmission(
  _assignmentId: number,
  payload: { submissionId: number; grade: number | null; feedback?: string },
): Promise<void> {
  await apiClient.put(ENDPOINTS.SUBMISSIONS.GRADE(payload.submissionId), {
    grade: payload.grade,
    feedback: payload.feedback,
  });
}

export async function getAssignmentStats(
  assignmentId: number,
): Promise<AssignmentStats> {
  const response = await apiClient.get<unknown>(
    `${ENDPOINTS.ASSIGNMENTS.DETAIL(assignmentId)}/stats`,
  );
  return unwrapData<AssignmentStats>(response.data);
}

export async function downloadAssignmentAttachment(
  _assignmentId: number,
  attachment: AssignmentAttachment,
): Promise<void> {
  await downloadFile(
    buildDownloadUrls(
      ENDPOINTS.ASSIGNMENT_ATTACHMENTS.DOWNLOAD(attachment.id),
      attachment.url,
    ),
    attachment.name,
  );
}

export async function downloadSubmissionFile(
  _assignmentId: number,
  submission: Submission,
): Promise<void> {
  await downloadFile(
    buildDownloadUrls(
      ENDPOINTS.SUBMISSIONS.DOWNLOAD(submission.id),
      submission.fileUrl,
    ),
    submission.file || `submission-${submission.id}`,
  );
}

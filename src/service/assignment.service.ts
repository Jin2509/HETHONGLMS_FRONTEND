import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { 
  Assignment, 
  AssignmentDetail, 
  Submission, 
  AssignmentStats, 
  AssignmentFormData 
} from "../app/features/assignments/types/assignment.types";

export async function getAssignments(params?: {
  status?: string;
  courseId?: number;
}): Promise<Assignment[]> {
  const response = await apiClient.get<Assignment[]>(ENDPOINTS.ASSIGNMENTS.LIST, { params });
  return response.data;
}

export async function getAssignmentDetail(id: number): Promise<AssignmentDetail> {
  const response = await apiClient.get<AssignmentDetail>(ENDPOINTS.ASSIGNMENTS.DETAIL(id));
  return response.data;
}

export async function createAssignment(data: AssignmentFormData & { courseId: number }): Promise<Assignment> {
  const formData = new FormData();
  formData.append("courseId", String(data.courseId));
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("dueDate", `${data.dueDate}T${data.dueTime}:00`);
  formData.append("maxScore", String(data.maxScore));
  if (data.attachments) {
    data.attachments.forEach((file) => formData.append("attachments", file));
  }
  const response = await apiClient.post<Assignment>(ENDPOINTS.ASSIGNMENTS.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateAssignment(
  id: number,
  data: Partial<AssignmentFormData>
): Promise<Assignment> {
  const response = await apiClient.patch<Assignment>(ENDPOINTS.ASSIGNMENTS.UPDATE(id), data);
  return response.data;
}

export async function deleteAssignment(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.ASSIGNMENTS.DELETE(id));
}

export async function getSubmissions(assignmentId: number): Promise<Submission[]> {
  const response = await apiClient.get<Submission[]>(
    ENDPOINTS.ASSIGNMENTS.SUBMISSIONS(assignmentId)
  );
  return response.data;
}

export async function submitAssignment(
  assignmentId: number,
  data: { file: File; note?: string }
): Promise<void> {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.note) formData.append("note", data.note);
  await apiClient.post(ENDPOINTS.ASSIGNMENTS.SUBMIT(assignmentId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function gradeSubmission(
  assignmentId: number,
  payload: { submissionId: number; grade: number | null; feedback?: string }
): Promise<void> {
  await apiClient.post(ENDPOINTS.ASSIGNMENTS.GRADE(assignmentId), payload);
}

export async function getAssignmentStats(assignmentId: number): Promise<AssignmentStats> {
  const response = await apiClient.get<AssignmentStats>(
    `${ENDPOINTS.ASSIGNMENTS.DETAIL(assignmentId)}/stats`
  );
  return response.data;
}

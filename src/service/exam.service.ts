import apiClient from "../api/client";
import { downloadFile } from "../api/download";
import { ENDPOINTS } from "../api/endpoints";

export interface ExamAttachment {
  id: number;
  name: string;
  size?: string;
  url?: string;
}

export interface Exam {
  id: number;
  name: string;
  courseId: number;
  courseName?: string;
  description?: string;
  date: string;
  duration: number;
  totalPoints: number;
  status: "upcoming" | "active" | "finished";
  attachments?: ExamAttachment[];
}

export interface ExamQuestion {
  id: number;
  text: string;
  type: "single" | "multiple";
  points: number;
  options: ExamOption[];
}

export interface ExamOption {
  id: number;
  text: string;
}

export interface ExamSubmission {
  id: number;
  studentId: number;
  studentName: string;
  studentCode?: string;
  examId: number;
  fileUrl?: string;
  grade: number | null;
  feedback?: string;
  status: "pending" | "submitted" | "graded";
  submittedAt: string;
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentile: number;
  passed: boolean;
  sections: Array<{ name: string; score: number; total: number }>;
  questions: ExamReviewQuestion[];
}

export interface ExamReviewQuestion {
  id: number;
  text: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type ExamPayload = Partial<Exam> & {
  attachments?: File[];
};

function buildExamFormData(data: ExamPayload): FormData {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.courseId) formData.append("courseId", String(data.courseId));
  if (data.description) formData.append("description", data.description);
  if (data.date) formData.append("date", data.date);
  if (data.duration !== undefined) formData.append("duration", String(data.duration));
  if (data.totalPoints !== undefined) formData.append("totalPoints", String(data.totalPoints));
  if (data.status) formData.append("status", data.status);
  data.attachments?.forEach((file) => formData.append("attachments", file));
  return formData;
}

export async function getExams(params?: { courseId?: number }): Promise<Exam[]> {
  const response = await apiClient.get<ApiResponse<Exam[]>>(ENDPOINTS.EXAMS.LIST, { params });
  return response.data.data;
}

export async function getExamDetail(id: number): Promise<Exam & { questions: ExamQuestion[] }> {
  const response = await apiClient.get<ApiResponse<Exam & { questions: ExamQuestion[] }>>(ENDPOINTS.EXAMS.DETAIL(id));
  return response.data.data;
}

export async function createExam(data: ExamPayload): Promise<Exam> {
  const hasFiles = Boolean(data.attachments?.length);
  const payload = hasFiles ? buildExamFormData(data) : data;
  const response = await apiClient.post<ApiResponse<Exam>>(
    ENDPOINTS.EXAMS.CREATE,
    payload,
    payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  );
  return response.data.data;
}

export async function updateExam(id: number, data: ExamPayload): Promise<Exam> {
  const hasFiles = Boolean(data.attachments?.length);
  const payload = hasFiles ? buildExamFormData(data) : data;
  const response = await apiClient.patch<ApiResponse<Exam>>(
    ENDPOINTS.EXAMS.UPDATE(id),
    payload,
    payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  );
  return response.data.data;
}

export async function deleteExam(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.EXAMS.DELETE(id));
}

export async function startExam(id: number): Promise<ExamQuestion[]> {
  const response = await apiClient.get<ApiResponse<ExamQuestion[]>>(ENDPOINTS.EXAMS.TAKE(id));
  return response.data.data;
}

export async function submitExam(id: number, answers: Record<number, number | number[]>): Promise<void> {
  await apiClient.post(ENDPOINTS.EXAMS.SUBMIT(id), { answers });
}

export async function getExamResult(id: number): Promise<ExamResult> {
  const response = await apiClient.get<ApiResponse<ExamResult>>(ENDPOINTS.EXAMS.RESULT(id));
  return response.data.data;
}

export async function getExamSubmissions(id: number): Promise<ExamSubmission[]> {
  const response = await apiClient.get<ApiResponse<ExamSubmission[]>>(ENDPOINTS.EXAMS.SUBMISSIONS(id));
  return response.data.data;
}

export async function gradeExamSubmission(
  examId: number,
  payload: { submissionId: number; grade: number | null; feedback?: string }
): Promise<void> {
  await apiClient.post(ENDPOINTS.EXAMS.GRADE(examId), payload);
}

export async function downloadExamSubmissionFile(examId: number, submission: ExamSubmission): Promise<void> {
  await downloadFile(
    submission.fileUrl || ENDPOINTS.EXAMS.DOWNLOAD_SUBMISSION(examId, submission.id),
    `exam-submission-${submission.id}`
  );
}

export async function downloadExamAttachment(examId: number, attachment: ExamAttachment): Promise<void> {
  await downloadFile(
    attachment.url || ENDPOINTS.EXAMS.DOWNLOAD_ATTACHMENT(examId, attachment.id),
    attachment.name
  );
}

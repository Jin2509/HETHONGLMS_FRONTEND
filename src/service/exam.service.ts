import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

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

export async function getExams(params?: { courseId?: number }): Promise<Exam[]> {
  // TODO: connect to real API
  const response = await apiClient.get<Exam[]>(ENDPOINTS.EXAMS.LIST, { params });
  return response.data;
}

export async function getExamDetail(id: number): Promise<Exam & { questions: ExamQuestion[] }> {
  // TODO: connect to real API
  const response = await apiClient.get(ENDPOINTS.EXAMS.DETAIL(id));
  return response.data;
}

export async function createExam(data: Partial<Exam>): Promise<Exam> {
  // TODO: connect to real API
  const response = await apiClient.post<Exam>(ENDPOINTS.EXAMS.CREATE, data);
  return response.data;
}

export async function updateExam(id: number, data: Partial<Exam>): Promise<Exam> {
  // TODO: connect to real API
  const response = await apiClient.patch<Exam>(ENDPOINTS.EXAMS.UPDATE(id), data);
  return response.data;
}

export async function deleteExam(id: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.delete(ENDPOINTS.EXAMS.DELETE(id));
}

export async function startExam(id: number): Promise<ExamQuestion[]> {
  // TODO: connect to real API
  const response = await apiClient.get<ExamQuestion[]>(ENDPOINTS.EXAMS.TAKE(id));
  return response.data;
}

export async function submitExam(id: number, answers: Record<number, number | number[]>): Promise<void> {
  // TODO: connect to real API
  await apiClient.post(ENDPOINTS.EXAMS.SUBMIT(id), { answers });
}

export async function getExamResult(id: number): Promise<ExamResult> {
  // TODO: connect to real API
  const response = await apiClient.get<ExamResult>(ENDPOINTS.EXAMS.RESULT(id));
  return response.data;
}

export async function getExamSubmissions(id: number): Promise<ExamSubmission[]> {
  // TODO: connect to real API
  const response = await apiClient.get<ExamSubmission[]>(ENDPOINTS.EXAMS.SUBMISSIONS(id));
  return response.data;
}

export async function gradeExamSubmission(
  examId: number,
  payload: { submissionId: number; grade: number | null; feedback?: string }
): Promise<void> {
  // TODO: connect to real API
  await apiClient.post(ENDPOINTS.EXAMS.GRADE(examId), payload);
}

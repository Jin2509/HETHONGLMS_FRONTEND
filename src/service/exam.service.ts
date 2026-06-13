import apiClient from "../api/client";
import { buildDownloadUrls, downloadFile } from "../api/download";
import { ENDPOINTS } from "../api/endpoints";

export interface ExamAttachment {
  id: number;
  name: string;
  size?: string;
  url?: string;
  fileUrl?: string;
  path?: string;
  downloadUrl?: string;
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
  type: "single" | "multiple" | "multiple_choice" | "essay";
  points: number;
  options?: ExamOption[];
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
  url?: string;
  answers?: ExamAnswer[];
  grade: number | null;
  score?: number | null;
  passed?: boolean | null;
  feedback?: string;
  status: "pending" | "submitted" | "graded";
  submittedAt: string;
}

export interface ExamAnswer {
  id: number;
  submissionId: number;
  questionId: number;
  answerText?: string;
  fileUrl?: string;
  score?: number | null;
  feedback?: string;
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

function buildExamPayload(data: ExamPayload) {
  return {
    name: data.name,
    courseId: data.courseId,
    description: data.description,
    date: data.date,
    duration: data.duration,
    totalPoints: data.totalPoints,
  };
}

async function uploadExamAttachments(examId: number, attachments?: File[]): Promise<void> {
  if (!attachments?.length) return;

  await Promise.all(
    attachments.map((file) => {
      const formData = new FormData();
      formData.append("examId", String(examId));
      formData.append("file", file);
      return apiClient.post(ENDPOINTS.EXAM_ATTACHMENTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    })
  );
}

function normalizeQuestion(question: Partial<ExamQuestion> & { type?: string; points?: number | string }): ExamQuestion {
  return {
    id: Number(question.id),
    text: question.text || "",
    type: (question.type || "essay") as ExamQuestion["type"],
    points: Number(question.points ?? 0),
    options: question.options || [],
  };
}

function normalizeExam(raw: Partial<Exam> & { questions?: ExamQuestion[]; totalPoints?: number | string }): Exam & { questions: ExamQuestion[] } {
  return {
    id: Number(raw.id),
    name: raw.name || "",
    courseId: Number(raw.courseId || 0),
    courseName: raw.courseName,
    description: raw.description,
    date: raw.date || "",
    duration: Number(raw.duration || 0),
    totalPoints: Number(raw.totalPoints ?? 10),
    status: (raw.status || "upcoming") as Exam["status"],
    attachments: raw.attachments || [],
    questions: (raw.questions || []).map(normalizeQuestion),
  };
}

function normalizeSubmission(raw: Partial<ExamSubmission> & { score?: number | string | null }): ExamSubmission {
  const answers = raw.answers || [];
  const score = raw.score ?? raw.grade ?? null;
  const grade = score === null || score === undefined ? null : Number(score);
  const fileUrl = raw.fileUrl || raw.url || answers.find((answer) => answer.fileUrl)?.fileUrl;

  return {
    id: Number(raw.id),
    studentId: Number(raw.studentId || 0),
    studentName: raw.studentName || "",
    studentCode: raw.studentCode,
    examId: Number(raw.examId || 0),
    fileUrl,
    url: raw.url,
    answers,
    grade,
    score: grade,
    passed: raw.passed ?? null,
    feedback: raw.feedback || "",
    status: raw.status || (grade === null ? "submitted" : "graded"),
    submittedAt: raw.submittedAt || "",
  };
}

function buildExamResult(submission: ExamSubmission): ExamResult {
  const answers = submission.answers || [];
  const scoredAnswers = answers.filter((answer) => answer.score !== null && answer.score !== undefined);
  const correctAnswers = scoredAnswers.filter((answer) => Number(answer.score) > 0).length;
  return {
    score: submission.grade ?? 0,
    totalQuestions: answers.length,
    correctAnswers,
    percentile: submission.passed ? 100 : 0,
    passed: Boolean(submission.passed),
    sections: [],
    questions: answers.map((answer, index) => ({
      id: answer.id,
      text: `Câu ${index + 1}`,
      yourAnswer: answer.answerText || answer.fileUrl || "Chưa có câu trả lời",
      correctAnswer: "",
      isCorrect: answer.score !== null && answer.score !== undefined ? Number(answer.score) > 0 : false,
      explanation: answer.feedback || "",
    })),
  };
}

export async function getExams(params?: { courseId?: number }): Promise<Exam[]> {
  const response = await apiClient.get<ApiResponse<Exam[]>>(ENDPOINTS.EXAMS.LIST, { params });
  return response.data.data.map((exam) => normalizeExam(exam));
}

export async function getExamDetail(id: number): Promise<Exam & { questions: ExamQuestion[] }> {
  const response = await apiClient.get<ApiResponse<Exam & { questions: ExamQuestion[] }>>(ENDPOINTS.EXAMS.DETAIL(id));
  return normalizeExam(response.data.data);
}

export async function createExam(data: ExamPayload): Promise<Exam> {
  const response = await apiClient.post<ApiResponse<Exam>>(
    ENDPOINTS.EXAMS.CREATE,
    buildExamPayload(data)
  );
  const exam = response.data.data;
  await uploadExamAttachments(exam.id, data.attachments);
  return getExamDetail(exam.id);
}

export async function updateExam(id: number, data: ExamPayload): Promise<Exam> {
  const response = await apiClient.put<ApiResponse<Exam>>(
    ENDPOINTS.EXAMS.UPDATE(id),
    buildExamPayload(data)
  );
  const exam = response.data.data;
  await uploadExamAttachments(exam.id, data.attachments);
  return getExamDetail(exam.id);
}

export async function deleteExam(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.EXAMS.DELETE(id));
}

export async function startExam(id: number): Promise<ExamQuestion[]> {
  const exam = await getExamDetail(id);
  return exam.questions;
}

export async function submitExam(id: number, answers: Record<number, number | number[]>): Promise<void> {
  await apiClient.post(ENDPOINTS.EXAMS.SUBMIT(id), { answers });
}

export async function getExamResult(id: number): Promise<ExamResult> {
  const response = await apiClient.get<ApiResponse<ExamSubmission>>(ENDPOINTS.EXAMS.RESULT(id));
  return buildExamResult(normalizeSubmission(response.data.data));
}

export async function getExamSubmissions(id: number): Promise<ExamSubmission[]> {
  const response = await apiClient.get<ApiResponse<ExamSubmission[]>>(ENDPOINTS.EXAMS.SUBMISSIONS(id));
  return response.data.data.map(normalizeSubmission);
}

export async function gradeExamSubmission(
  examId: number,
  payload: { submissionId: number; grade: number | null; feedback?: string }
): Promise<void> {
  await apiClient.put(ENDPOINTS.EXAMS.GRADE(examId), payload);
}

export async function downloadExamSubmissionFile(examId: number, submission: ExamSubmission): Promise<void> {
  await downloadFile(
    buildDownloadUrls(
      ENDPOINTS.EXAMS.DOWNLOAD_SUBMISSION(examId, submission.id),
      submission.fileUrl || submission.url
    ),
    `exam-submission-${submission.id}`
  );
}

export async function downloadExamAttachment(examId: number, attachment: ExamAttachment): Promise<void> {
  await downloadFile(
    buildDownloadUrls(
      ENDPOINTS.EXAMS.DOWNLOAD_ATTACHMENT(examId, attachment.id),
      attachment.downloadUrl || attachment.url || attachment.fileUrl || attachment.path
    ),
    attachment.name
  );
}

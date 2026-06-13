export interface Assignment {
  id: number;
  name: string;
  course: string;
  courseId?: number;
  dueDate: string;
  status: string;
  hoursLeft: number;
  description?: string;
  maxScore?: number;
}

export interface AssignmentDetail {
  id: number;
  name: string;
  course: string;
  courseId?: number;
  dueDate: string;
  hoursLeft: number;
  description: string;
  requirements: string[];
  attachments: AssignmentAttachment[];
  maxScore: number;
}

export interface AssignmentAttachment {
  id: number;
  name: string;
  size: string;
  url: string;
}

export interface Submission {
  id: number;
  studentName: string;
  studentId: string;
  submittedAt: string;
  file: string;
  fileUrl?: string;
  grade: number | null;
  feedback: string;
  status: string;
}

export interface AssignmentFormData {
  name: string;
  course: string;
  courseId: number;
  dueDate: string;
  dueTime: string;
  description: string;
  maxScore: number;
  attachments: File[];
}

export interface AssignmentStats {
  name: string;
  course: string;
  dueDate: string;
  totalSubmissions: number;
  graded: number;
  pending: number;
  maxScore: number;
}

export interface GradeState {
  [key: number]: number | null;
}

export interface FeedbackState {
  [key: number]: string;
}

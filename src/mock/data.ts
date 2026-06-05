import { Assignment, AssignmentDetail, AssignmentStats, Submission } from "../app/features/assignments/types/assignment.types";
import { Student } from "../app/features/classes/pages/ClassDetail";

// --- ASSIGNMENTS ---
export const mockAssignments: Assignment[] = [
  {
    id: 1,
    name: "React Component Design",
    course: "Web Development",
    dueDate: "2026-06-05",
    status: "Chưa nộp",
    hoursLeft: 72,
    courseId: 1,
    maxScore: 10,
  },
  {
    id: 2,
    name: "Database Schema Design",
    course: "Database Systems",
    dueDate: "2026-06-03",
    status: "Đã nộp",
    hoursLeft: 24,
    courseId: 3,
    maxScore: 10,
  },
  {
    id: 3,
    name: "Algorithm Analysis",
    course: "Data Structures",
    dueDate: "2026-06-02",
    status: "Đã chấm",
    hoursLeft: 6,
    courseId: 2,
    maxScore: 10,
  },
  {
    id: 4,
    name: "CSS Flexbox Practice",
    course: "Web Development",
    dueDate: "2026-06-08",
    status: "Chưa nộp",
    hoursLeft: 144,
    courseId: 1,
    maxScore: 10,
  },
  {
    id: 5,
    name: "SQL Query Optimization",
    course: "Database Systems",
    dueDate: "2026-05-28",
    status: "Đã chấm",
    hoursLeft: -120,
    courseId: 3,
    maxScore: 10,
  },
];

export const mockAssignmentDetail: AssignmentDetail = {
  id: 1,
  name: "React Component Design",
  course: "Web Development",
  courseId: 1,
  dueDate: "2026-06-05",
  hoursLeft: 72,
  description: "Trong bài tập này, bạn sẽ thiết kế và triển khai một component React tái sử dụng theo các yêu cầu sau:",
  requirements: [
    "Tạo một Button component với các variants: primary, secondary, outline",
    "Component phải hỗ trợ các sizes: small, medium, large",
    "Implement loading state với spinner",
    "Viết unit tests với Jest và React Testing Library",
    "Document component với Storybook",
  ],
  attachments: [
    { id: 1, name: "assignment-requirements.pdf", size: "2.4 MB", url: "#" },
  ],
  maxScore: 10,
};

export const mockAssignmentStats: AssignmentStats = {
  name: "React Component Design",
  course: "Web Development",
  dueDate: "2026-06-05",
  totalSubmissions: 5,
  graded: 2,
  pending: 3,
  maxScore: 10,
};

export const mockSubmissions: Submission[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Nguyễn Văn A",
    assignmentId: 1,
    status: "graded",
    submittedAt: "2026-06-04 10:00",
    grade: 9,
    feedback: "Tốt lắm!",
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Trần Thị B",
    assignmentId: 1,
    status: "submitted",
    submittedAt: "2026-06-04 11:30",
    grade: null,
  },
];

// --- CLASSES & STUDENTS ---
export const mockStudents: Student[] = [
  { id: 1, studentId: "20210001", name: "Nguyễn Văn A", email: "nguyenvana@student.edu", department: "Công nghệ thông tin" },
  { id: 2, studentId: "20210002", name: "Trần Thị B", email: "tranthib@student.edu", department: "Công nghệ thông tin" },
  { id: 3, studentId: "20210003", name: "Lê Văn C", email: "levanc@student.edu", department: "Công nghệ thông tin" },
  { id: 4, studentId: "20210004", name: "Phạm Thị D", email: "phamthid@student.edu", department: "Công nghệ thông tin" },
  { id: 5, studentId: "20210005", name: "Hoàng Văn E", email: "hoangvane@student.edu", department: "Công nghệ thông tin" },
  { id: 6, studentId: "20210006", name: "Vũ Thị F", email: "vuthif@student.edu", department: "Kinh tế" },
  { id: 7, studentId: "20210007", name: "Đặng Văn G", email: "dangvang@student.edu", department: "Ngôn ngữ Anh" },
  { id: 8, studentId: "20210008", name: "Lý Văn H", email: "lyvanh@student.edu", department: "Luật" },
  { id: 9, studentId: "20210009", name: "Trương Thị I", email: "truongthii@student.edu", department: "Y đa khoa" },
  { id: 10, studentId: "20210010", name: "Đỗ Văn K", email: "dovank@student.edu", department: "Kiến trúc" },
];

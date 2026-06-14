import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray } from "./api-response";

export interface UserGrade {
  id: number;
  name: string;
  type: "Bài tập" | "Bài thi";
  course: string;
  score: number | null;
  date: string;
}

export interface GradeTrend {
  semester: string;
  gpa: number;
}

export interface CourseGrade {
  courseId: number;
  courseName: string;
  midterm?: number;
  final?: number;
  assignments?: number;
  participation?: number;
  gpa: number;
}

export interface StudentGradeUpdate {
  studentId: number;
  midterm?: number;
  final?: number;
  assignments?: number;
  participation?: number;
}

export async function getMyGrades(params?: { semester?: string; type?: string; query?: string }): Promise<UserGrade[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.GRADES.MY_GRADES, { params });
  return unwrapArray<UserGrade>(response.data);
}

export async function getCourseGrades(courseId: number): Promise<CourseGrade[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.GRADES.COURSE_GRADES(courseId));
  return unwrapArray<CourseGrade>(response.data);
}

export async function getGradesByClass(classId: number): Promise<CourseGrade[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.GRADES.CLASS_GRADES(classId));
  return unwrapArray<CourseGrade>(response.data);
}

export async function updateGrade(classId: number, data: StudentGradeUpdate): Promise<void> {
  await apiClient.patch(ENDPOINTS.GRADES.CLASS_GRADES(classId), data);
}

export async function getGradeTrend(): Promise<GradeTrend[]> {
  const response = await apiClient.get<unknown>(`${ENDPOINTS.GRADES.LIST}/trend`);
  return unwrapArray<GradeTrend>(response.data);
}

export async function exportGrades(semester: string): Promise<Blob> {
  const response = await apiClient.get(ENDPOINTS.GRADES.EXPORT, {
    params: { semester },
    responseType: "blob",
  });
  return response.data;
}

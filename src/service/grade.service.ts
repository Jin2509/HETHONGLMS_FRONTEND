import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface UserGrade {
  course: string;
  midterm: number;
  final: number;
  assignments: number;
  participation: number;
  gpa: number;
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

export async function getMyGrades(semester?: string): Promise<{ grades: UserGrade[]; average: number }> {
  // TODO: connect to real API
  const response = await apiClient.get(ENDPOINTS.GRADES.MY_GRADES, { params: { semester } });
  return response.data;
}

export async function getCourseGrades(courseId: number): Promise<CourseGrade[]> {
  // TODO: connect to real API
  const response = await apiClient.get<CourseGrade[]>(ENDPOINTS.GRADES.COURSE_GRADES(courseId));
  return response.data;
}

export async function getGradeTrend(): Promise<GradeTrend[]> {
  // TODO: connect to real API
  const response = await apiClient.get<GradeTrend[]>(`${ENDPOINTS.GRADES.LIST}/trend`);
  return response.data;
}

export async function exportGrades(semester: string): Promise<Blob> {
  // TODO: connect to real API
  const response = await apiClient.get(ENDPOINTS.GRADES.EXPORT, {
    params: { semester },
    responseType: "blob",
  });
  return response.data;
}

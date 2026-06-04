import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface CourseMaterial {
  id: number;
  name: string;
  type: "pdf" | "folder" | "file" | "video";
  url?: string;
  size?: string;
}

export interface CourseChapter {
  id: number;
  name: string;
  sortOrder: number;
  materials: CourseMaterial[];
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  chapters: CourseChapter[];
}

export async function getCourses(): Promise<Course[]> {
  // TODO: connect to real API
  const response = await apiClient.get<Course[]>(ENDPOINTS.COURSES.LIST);
  return response.data;
}

export async function getCourseDetail(id: number): Promise<Course> {
  // TODO: connect to real API
  const response = await apiClient.get<Course>(ENDPOINTS.COURSES.DETAIL(id));
  return response.data;
}

export async function uploadMaterial(courseId: number, file: File): Promise<CourseMaterial> {
  // TODO: connect to real API
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<CourseMaterial>(
    ENDPOINTS.COURSES.UPLOAD(courseId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface CourseMaterial {
  id: number;
  name: string;
  type: "pdf" | "folder" | "file" | "video" | "zip" | "rar";
  url?: string;
  size?: string;
  date?: string;
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
  instructor?: string;
  chapters: CourseChapter[];
}

export async function getCourses(): Promise<Course[]> {
  const response = await apiClient.get<Course[]>(ENDPOINTS.COURSES.LIST);
  return response.data;
}

export async function getCourseDetail(id: number): Promise<Course> {
  const response = await apiClient.get<Course>(ENDPOINTS.COURSES.DETAIL(id));
  return response.data;
}

export async function createChapter(courseId: number, name: string): Promise<CourseChapter> {
  const response = await apiClient.post<CourseChapter>(ENDPOINTS.COURSES.CHAPTERS(courseId), { name });
  return response.data;
}

export async function uploadMaterial(courseId: number, chapterId: number, file: File, name: string): Promise<CourseMaterial> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("chapterId", chapterId.toString());
  const response = await apiClient.post<CourseMaterial>(
    ENDPOINTS.COURSES.UPLOAD(courseId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function deleteMaterial(courseId: number, materialId: number): Promise<void> {
  await apiClient.delete(`${ENDPOINTS.COURSES.DETAIL(courseId)}/materials/${materialId}`);
}

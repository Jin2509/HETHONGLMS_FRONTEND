import apiClient from "../api/client";
import { downloadFile } from "../api/download";
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

export interface CreateCourseData {
  name: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

function hasData<T>(payload: unknown): payload is ApiResponse<T> {
  return typeof payload === "object" && payload !== null && "data" in payload;
}

function unwrapData<T>(payload: T | ApiResponse<T>): T {
  return hasData<T>(payload) ? payload.data : payload;
}

function unwrapArray<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload as unknown);
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (typeof data === "object" && data !== null && "content" in data && Array.isArray((data as { content?: unknown }).content)) {
    return (data as { content: T[] }).content;
  }
  return [];
}

export async function getCourses(): Promise<Course[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.COURSES.LIST);
  return unwrapArray<Course>(response.data);
}

export async function getCourseDetail(id: number): Promise<Course> {
  const response = await apiClient.get<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.DETAIL(id));
  return unwrapData<Course>(response.data);
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  const response = await apiClient.post<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.CREATE, data);
  return unwrapData<Course>(response.data);
}

export async function updateCourse(id: number, data: UpdateCourseData): Promise<Course> {
  const response = await apiClient.patch<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.UPDATE(id), data);
  return unwrapData<Course>(response.data);
}

export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.COURSES.DELETE(id));
}

export async function createChapter(courseId: number, name: string): Promise<CourseChapter> {
  const response = await apiClient.post<ApiResponse<CourseChapter> | CourseChapter>(ENDPOINTS.COURSES.CHAPTERS(courseId), { name });
  return unwrapData<CourseChapter>(response.data);
}

export async function uploadMaterial(courseId: number, chapterId: number, file: File, name: string): Promise<CourseMaterial> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("chapterId", chapterId.toString());
  const response = await apiClient.post<ApiResponse<CourseMaterial>>(
    ENDPOINTS.COURSES.UPLOAD(courseId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return unwrapData<CourseMaterial>(response.data);
}

export async function deleteMaterial(courseId: number, materialId: number): Promise<void> {
  await apiClient.delete(`${ENDPOINTS.COURSES.DETAIL(courseId)}/materials/${materialId}`);
}

export async function downloadMaterial(courseId: number, material: CourseMaterial): Promise<void> {
  await downloadFile(
    material.url || ENDPOINTS.COURSES.DOWNLOAD_MATERIAL(courseId, material.id),
    material.name
  );
}

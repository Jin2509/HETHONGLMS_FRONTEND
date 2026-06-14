import apiClient from "../api/client";
import { buildDownloadUrls, downloadFile } from "../api/download";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray, unwrapData, type ApiResponse } from "./api-response";

export interface CourseMaterial {
  id: number;
  name: string;
  type: "pdf" | "folder" | "file" | "video" | "zip" | "rar";
  url?: string;
  fileUrl?: string;
  path?: string;
  downloadUrl?: string;
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
  classId?: number;
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
  classId?: number;
  studentIds?: string[];
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
}

function normalizeMaterial(material: Partial<CourseMaterial>): CourseMaterial {
  return {
    id: Number(material.id || 0),
    name: material.name || "Tài liệu",
    type: material.type || "file",
    url: material.url,
    fileUrl: material.fileUrl,
    path: material.path,
    downloadUrl: material.downloadUrl,
    size: material.size,
    date: material.date,
  };
}

function normalizeChapter(chapter: Partial<CourseChapter>): CourseChapter {
  return {
    id: Number(chapter.id || 0),
    name: chapter.name || "Chương học",
    sortOrder: Number(chapter.sortOrder || 0),
    materials: (chapter.materials || []).map(normalizeMaterial),
  };
}

function normalizeCourse(course: Partial<Course> & { class_id?: number }): Course {
  return {
    id: Number(course.id || 0),
    classId: course.classId ?? course.class_id,
    name: course.name || "",
    description: course.description || "",
    thumbnailUrl: course.thumbnailUrl,
    instructor: course.instructor,
    chapters: (course.chapters || []).map(normalizeChapter),
  };
}

export async function getCourses(params?: { classId?: number }): Promise<Course[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.COURSES.LIST, { params });
  return unwrapArray<Partial<Course>>(response.data).map(normalizeCourse);
}

export async function getCourseDetail(id: number): Promise<Course> {
  const response = await apiClient.get<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.DETAIL(id));
  return normalizeCourse(unwrapData<Course>(response.data));
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  const response = await apiClient.post<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.CREATE, data);
  return normalizeCourse(unwrapData<Course>(response.data));
}

export async function updateCourse(id: number, data: UpdateCourseData): Promise<Course> {
  const response = await apiClient.patch<ApiResponse<Course> | Course>(ENDPOINTS.COURSES.UPDATE(id), data);
  return normalizeCourse(unwrapData<Course>(response.data));
}

export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.COURSES.DELETE(id));
}

export async function createChapter(courseId: number, name: string): Promise<CourseChapter> {
  const response = await apiClient.post<ApiResponse<CourseChapter> | CourseChapter>(ENDPOINTS.COURSES.CHAPTERS(courseId), { name });
  return normalizeChapter(unwrapData<CourseChapter>(response.data));
}

export async function uploadMaterial(courseId: number, chapterId: number, file: File, name: string): Promise<CourseMaterial> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("chapterId", chapterId.toString());
  const response = await apiClient.post<ApiResponse<CourseMaterial>>(
    ENDPOINTS.COURSES.UPLOAD(courseId, chapterId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeMaterial(unwrapData<CourseMaterial>(response.data));
}

export async function deleteMaterial(courseId: number, materialId: number): Promise<void> {
  void courseId;
  await apiClient.delete(ENDPOINTS.COURSE_MATERIALS.DELETE(materialId));
}

export async function downloadMaterial(courseId: number, material: CourseMaterial): Promise<void> {
  await downloadFile(
    buildDownloadUrls(
      ENDPOINTS.COURSE_MATERIALS.DETAIL(material.id),
      material.downloadUrl || material.url || material.fileUrl || material.path
    ),
    material.name
  );
}

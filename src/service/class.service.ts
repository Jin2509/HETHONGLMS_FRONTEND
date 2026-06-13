import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface Class {
  id: number;
  name: string;
  semester: string;
  instructorId: number;
  instructorName?: string;
  studentCount?: number;
  courseCount?: number;
  createdAt: string;
}

export interface ClassMember {
  id?: number;
  userId?: number;
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  department?: string;
  enrolledAt: string;
}

export interface CreateClassData {
  name: string;
  instructorId?: number;
  semester: string;
  studentIds?: string[];
}

export interface UpdateClassData {
  name?: string;
  instructorId?: number;
  semester?: string;
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

export async function getClasses(): Promise<Class[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.CLASSES.LIST);
  return unwrapArray<Class>(response.data);
}

export async function getClassDetail(id: number): Promise<Class> {
  const response = await apiClient.get<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.DETAIL(id));
  return unwrapData<Class>(response.data);
}

export async function createClass(data: CreateClassData): Promise<Class> {
  const response = await apiClient.post<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.LIST, data);
  return unwrapData<Class>(response.data);
}

export async function updateClass(id: number, data: UpdateClassData): Promise<Class> {
  const response = await apiClient.put<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.UPDATE(id), data);
  return unwrapData<Class>(response.data);
}

export async function deleteClass(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.CLASSES.DELETE(id));
}

export async function getClassMembers(classId: number): Promise<ClassMember[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.CLASSES.MEMBERS(classId));
  return unwrapArray<ClassMember>(response.data);
}

export async function enrollStudent(classId: number, studentIdOrCode: number | string): Promise<void> {
  const payload = typeof studentIdOrCode === "number"
    ? { studentId: studentIdOrCode }
    : { codeId: studentIdOrCode };
  await apiClient.post(ENDPOINTS.CLASSES.ENROLL(classId), payload);
}

export async function importClassMembers(classId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await apiClient.post(ENDPOINTS.CLASSES.MEMBERS(classId) + "/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

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
  userId: number;
  name: string;
  email: string;
  studentId?: string;
  enrolledAt: string;
}

export interface CreateClassData {
  name: string;
  courseId: number;
  instructorId: number;
  semester: string;
  studentIds: string[];
}

export async function getClasses(): Promise<Class[]> {
  const response = await apiClient.get<Class[]>(ENDPOINTS.CLASSES.LIST);
  return response.data;
}

export async function getClassDetail(id: number): Promise<Class> {
  const response = await apiClient.get<Class>(ENDPOINTS.CLASSES.DETAIL(id));
  return response.data;
}

export async function createClass(data: CreateClassData): Promise<Class> {
  const response = await apiClient.post<Class>(ENDPOINTS.CLASSES.LIST, data);
  return response.data;
}

export async function getClassMembers(classId: number): Promise<ClassMember[]> {
  const response = await apiClient.get<ClassMember[]>(ENDPOINTS.CLASSES.MEMBERS(classId));
  return response.data;
}

export async function enrollStudent(classId: number, studentId: number): Promise<void> {
  await apiClient.post(ENDPOINTS.CLASSES.ENROLL(classId), { studentId });
}

export async function importClassMembers(classId: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await apiClient.post(ENDPOINTS.CLASSES.MEMBERS(classId) + "/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

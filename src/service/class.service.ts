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

export async function getClasses(): Promise<Class[]> {
  // TODO: connect to real API
  const response = await apiClient.get<Class[]>(ENDPOINTS.CLASSES.LIST);
  return response.data;
}

export async function getClassDetail(id: number): Promise<Class> {
  // TODO: connect to real API
  const response = await apiClient.get<Class>(ENDPOINTS.CLASSES.DETAIL(id));
  return response.data;
}

export async function getClassMembers(classId: number): Promise<ClassMember[]> {
  // TODO: connect to real API
  const response = await apiClient.get<ClassMember[]>(ENDPOINTS.CLASSES.MEMBERS(classId));
  return response.data;
}

export async function enrollStudent(classId: number, studentId: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.post(ENDPOINTS.CLASSES.ENROLL(classId), { studentId });
}

import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { getUsers } from "./admin.service";
import { unwrapArray, unwrapData, type ApiResponse } from "./api-response";

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

function normalizeClass(cls: Partial<Class>): Class {
  return {
    id: Number(cls.id || 0),
    name: cls.name || "",
    semester: cls.semester || "",
    instructorId: Number(cls.instructorId || 0),
    instructorName: cls.instructorName,
    studentCount: Number(cls.studentCount || 0),
    courseCount: Number(cls.courseCount || 0),
    createdAt: cls.createdAt || "",
  };
}

function normalizeClassMember(member: Partial<ClassMember>): ClassMember {
  return {
    id: member.id,
    userId: member.userId,
    name: member.name || "",
    email: member.email || "",
    studentId: member.studentId,
    phone: member.phone,
    department: member.department,
    enrolledAt: member.enrolledAt || "",
  };
}

export async function getClasses(): Promise<Class[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.CLASSES.LIST);
  return unwrapArray<Partial<Class>>(response.data).map(normalizeClass);
}

export async function getClassDetail(id: number): Promise<Class> {
  const response = await apiClient.get<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.DETAIL(id));
  return normalizeClass(unwrapData<Class>(response.data));
}

export async function createClass(data: CreateClassData): Promise<Class> {
  const response = await apiClient.post<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.LIST, data);
  return normalizeClass(unwrapData<Class>(response.data));
}

export async function updateClass(id: number, data: UpdateClassData): Promise<Class> {
  const response = await apiClient.put<ApiResponse<Class> | Class>(ENDPOINTS.CLASSES.UPDATE(id), data);
  return normalizeClass(unwrapData<Class>(response.data));
}

export async function deleteClass(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.CLASSES.DELETE(id));
}

export async function getClassMembers(classId: number): Promise<ClassMember[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.CLASSES.MEMBERS(classId));
  return unwrapArray<Partial<ClassMember>>(response.data).map(normalizeClassMember);
}

export async function getAllStudents(): Promise<ClassMember[]> {
  const response = await getUsers({ role: "student", limit: 10000 });
  return response.data.map((user) => normalizeClassMember({
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    phone: user.phone,
    enrolledAt: user.createdAt || "",
  }));
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

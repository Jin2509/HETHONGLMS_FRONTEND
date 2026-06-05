import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  studentId?: string;
  phone?: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: "student" | "teacher" | "admin";
  status?: "active" | "inactive";
  studentId?: string;
  phone?: string;
}

export async function getUsers(params?: {
  query?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: User[]; total: number }> {
  const response = await apiClient.get(ENDPOINTS.USERS.LIST, { params });
  return response.data;
}

export async function getUser(id: number): Promise<User> {
  const response = await apiClient.get(ENDPOINTS.USERS.DETAIL(id));
  return response.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiClient.post(ENDPOINTS.USERS.LIST, data);
  return response.data;
}

export async function updateUser(id: number, data: Partial<CreateUserData>): Promise<User> {
  const response = await apiClient.patch(ENDPOINTS.USERS.UPDATE(id), data);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.USERS.DELETE(id));
}

export async function importUsers(file: File): Promise<{ imported: number; failed: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post(ENDPOINTS.USERS.IMPORT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function exportUsers(): Promise<Blob> {
  const response = await apiClient.get(ENDPOINTS.USERS.EXPORT, {
    responseType: "blob",
  });
  return response.data;
}

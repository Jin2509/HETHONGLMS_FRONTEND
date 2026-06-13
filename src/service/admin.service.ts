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
  avatar?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface ApiResponse<T> {
  message: string;
  data: T;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
}

type UsersResponse =
  | User[]
  | SpringPage<User>
  | {
      data: User[];
      total?: number;
    };

function hasData<T>(payload: unknown): payload is ApiResponse<T> {
  return typeof payload === "object" && payload !== null && "data" in payload;
}

function isSpringPage<T>(payload: unknown): payload is SpringPage<T> {
  return typeof payload === "object" && payload !== null && "content" in payload;
}

function isDataList(payload: unknown): payload is { data: User[]; total?: number } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  );
}

function normalizeUsersResponse(payload: unknown): { data: User[]; total: number } {
  if (Array.isArray(payload)) {
    return { data: payload, total: payload.length };
  }

  if (isSpringPage<User>(payload)) {
    return { data: payload.content, total: payload.totalElements };
  }

  if (isDataList(payload)) {
    return { data: payload.data, total: payload.total ?? payload.data.length };
  }

  if (hasData<UsersResponse>(payload)) {
    return normalizeUsersResponse(payload.data);
  }

  return { data: [], total: 0 };
}

export async function getUsers(params?: {
  query?: string;
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: User[]; total: number }> {
  const { query, search, ...rest } = params ?? {};
  const response = await apiClient.get<unknown>(ENDPOINTS.USERS.LIST, {
    params: {
      ...rest,
      search: search ?? query,
    },
  });
  return normalizeUsersResponse(response.data);
}

export async function getUser(id: number): Promise<User> {
  const response = await apiClient.get<ApiResponse<User> | User>(ENDPOINTS.USERS.DETAIL(id));
  return hasData<User>(response.data) ? response.data.data : response.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiClient.post<ApiResponse<User> | User>(ENDPOINTS.USERS.LIST, data);
  return hasData<User>(response.data) ? response.data.data : response.data;
}

export async function updateUser(id: number, data: Partial<CreateUserData>): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User> | User>(ENDPOINTS.USERS.UPDATE(id), data);
  return hasData<User>(response.data) ? response.data.data : response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.USERS.DELETE(id));
}

export async function importUsers(file: File): Promise<{ imported: number; failed: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<ApiResponse<{ imported: number; failed: number }> | { imported: number; failed: number }>(ENDPOINTS.USERS.IMPORT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return hasData<{ imported: number; failed: number }>(response.data) ? response.data.data : response.data;
}

export async function exportUsers(): Promise<Blob> {
  const response = await apiClient.get(ENDPOINTS.USERS.EXPORT, {
    responseType: "blob",
  });
  return response.data;
}

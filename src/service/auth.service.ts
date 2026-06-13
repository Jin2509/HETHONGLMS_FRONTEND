import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
    avatarUrl?: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  studentId?: string;
  phone?: string;
  avatarUrl?: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.LOGIN, data);
  return response.data.data;
}

export async function logout(): Promise<void> {    
  await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.AUTH.ME);
  return response.data.data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>(ENDPOINTS.USERS.PROFILE, data);
  return response.data.data;
}

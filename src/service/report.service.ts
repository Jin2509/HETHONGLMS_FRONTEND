import { LucideIcon } from "lucide-react";
import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface SystemStats {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

export interface EnrollmentTrend {
  id: number;
  month: string;
  students: number;
}

export interface SubmissionByCourse {
  id: number;
  course: string;
  count: number;
}

export interface TopStudent {
  rank: number;
  name: string;
  gpa: number;
  completion: number;
}

export interface ReportStats {
  totalUsers: number;
  totalCourses: number;
  completionRate: number;
  monthlySubmissions: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export async function getSystemStats(): Promise<ReportStats> {
  const response = await apiClient.get<ApiResponse<ReportStats>>(ENDPOINTS.REPORTS.STATS);
  return response.data.data;
}

export async function getEnrollmentTrend(): Promise<EnrollmentTrend[]> {
  const response = await apiClient.get<ApiResponse<EnrollmentTrend[]>>(ENDPOINTS.REPORTS.ENROLLMENT);
  return response.data.data;
}

export async function getSubmissionByCourse(): Promise<SubmissionByCourse[]> {
  const response = await apiClient.get<ApiResponse<SubmissionByCourse[]>>(ENDPOINTS.REPORTS.SUBMISSIONS);
  return response.data.data;
}

export async function getTopStudents(): Promise<TopStudent[]> {
  const response = await apiClient.get<ApiResponse<TopStudent[]>>(ENDPOINTS.REPORTS.TOP_STUDENTS);
  return response.data.data;
}

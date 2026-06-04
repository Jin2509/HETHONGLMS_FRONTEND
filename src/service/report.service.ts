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

export async function getSystemStats(): Promise<ReportStats> {
  // TODO: connect to real API
  const response = await apiClient.get<ReportStats>(ENDPOINTS.REPORTS.STATS);
  return response.data;
}

export async function getEnrollmentTrend(): Promise<EnrollmentTrend[]> {
  // TODO: connect to real API
  const response = await apiClient.get<EnrollmentTrend[]>(ENDPOINTS.REPORTS.ENROLLMENT);
  return response.data;
}

export async function getSubmissionByCourse(): Promise<SubmissionByCourse[]> {
  // TODO: connect to real API
  const response = await apiClient.get<SubmissionByCourse[]>(ENDPOINTS.REPORTS.SUBMISSIONS);
  return response.data;
}

export async function getTopStudents(): Promise<TopStudent[]> {
  // TODO: connect to real API
  const response = await apiClient.get<TopStudent[]>(ENDPOINTS.REPORTS.TOP_STUDENTS);
  return response.data;
}

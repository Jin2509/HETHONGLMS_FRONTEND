import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray, unwrapData } from "./api-response";

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
  totalClasses?: number;
  totalAssignments?: number;
  totalExams?: number;
  totalDiscussions?: number;
  completionRate: number;
  monthlySubmissions: number;
  activeUsers?: number;
  newUsersToday?: number;
}

export async function getSystemStats(): Promise<ReportStats> {
  const response = await apiClient.get<unknown>(ENDPOINTS.REPORTS.STATS);
  const data = unwrapData<Partial<ReportStats>>(response.data);
  return {
    totalUsers: Number(data.totalUsers || 0),
    totalCourses: Number(data.totalCourses || 0),
    totalClasses: Number(data.totalClasses || 0),
    totalAssignments: Number(data.totalAssignments || 0),
    totalExams: Number(data.totalExams || 0),
    totalDiscussions: Number(data.totalDiscussions || 0),
    completionRate: Number(data.completionRate || 0),
    monthlySubmissions: Number(data.monthlySubmissions || 0),
    activeUsers: data.activeUsers === undefined ? undefined : Number(data.activeUsers),
    newUsersToday: data.newUsersToday === undefined ? undefined : Number(data.newUsersToday),
  };
}

export async function getEnrollmentTrend(): Promise<EnrollmentTrend[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.REPORTS.ENROLLMENT);
  return unwrapArray<EnrollmentTrend>(response.data).map((item, index) => ({
    id: Number(item.id || index + 1),
    month: item.month || "",
    students: Number(item.students || 0),
  }));
}

export async function getSubmissionByCourse(): Promise<SubmissionByCourse[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.REPORTS.SUBMISSIONS);
  return unwrapArray<SubmissionByCourse>(response.data).map((item, index) => ({
    id: Number(item.id || index + 1),
    course: item.course || "",
    count: Number(item.count || 0),
  }));
}

export async function getTopStudents(): Promise<TopStudent[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.REPORTS.TOP_STUDENTS);
  return unwrapArray<TopStudent>(response.data).map((item, index) => ({
    rank: Number(item.rank || index + 1),
    name: item.name || "",
    gpa: Number(item.gpa || 0),
    completion: Number(item.completion || 0),
  }));
}

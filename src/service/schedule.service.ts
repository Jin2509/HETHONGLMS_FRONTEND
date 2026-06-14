import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray, unwrapData, type ApiResponse } from "./api-response";

export interface ScheduleEvent {
  id: number;
  title: string;
  courseId: number;
  courseName?: string;
  type: "lecture" | "lab" | "workshop" | "exam";
  dayOfWeek: number; // 0 = Monday, 6 = Sunday
  startTime: string; // HH:mm
  endTime: string;
  room?: string;
  instructor?: string;
  color: string;
}

export interface CreateEventData {
  courseId: number;
  title: string;
  type: ScheduleEvent["type"];
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  color?: string;
}

export async function getSchedule(params?: {
  week?: number;
  month?: string;
  courseId?: number;
}): Promise<ScheduleEvent[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.SCHEDULE.LIST, { params });
  return unwrapArray<ScheduleEvent>(response.data);
}

export async function createEvent(data: CreateEventData): Promise<ScheduleEvent> {
  const response = await apiClient.post<ApiResponse<ScheduleEvent>>(ENDPOINTS.SCHEDULE.CREATE, data);
  return unwrapData<ScheduleEvent>(response.data);
}

export async function updateEvent(
  id: number,
  data: Partial<CreateEventData>
): Promise<ScheduleEvent> {
  const response = await apiClient.patch<ApiResponse<ScheduleEvent>>(ENDPOINTS.SCHEDULE.UPDATE(id), data);
  return unwrapData<ScheduleEvent>(response.data);
}

export async function deleteEvent(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.SCHEDULE.DELETE(id));
}

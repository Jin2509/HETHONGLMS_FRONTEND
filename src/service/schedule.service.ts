import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

export interface ScheduleEvent {
  id: number;
  title: string;
  courseId: number;
  courseName?: string;
  type: "lecture" | "lab" | "workshop" | "exam";
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // HH:mm
  endTime: string;
  room?: string;
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
  // TODO: connect to real API
  const response = await apiClient.get<ScheduleEvent[]>(ENDPOINTS.SCHEDULE.LIST, { params });
  return response.data;
}

export async function createEvent(data: CreateEventData): Promise<ScheduleEvent> {
  // TODO: connect to real API
  const response = await apiClient.post<ScheduleEvent>(ENDPOINTS.SCHEDULE.CREATE, data);
  return response.data;
}

export async function updateEvent(
  id: number,
  data: Partial<CreateEventData>
): Promise<ScheduleEvent> {
  // TODO: connect to real API
  const response = await apiClient.patch<ScheduleEvent>(ENDPOINTS.SCHEDULE.UPDATE(id), data);
  return response.data;
}

export async function deleteEvent(id: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.delete(ENDPOINTS.SCHEDULE.DELETE(id));
}

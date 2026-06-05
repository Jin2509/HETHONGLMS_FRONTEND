import { useState, useCallback, useEffect } from "react";
import { 
  getSchedule, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  type ScheduleEvent,
  type CreateEventData 
} from "../../../../service/schedule.service";
import { toast } from "sonner";

export function useSchedule() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  const fetchSchedule = useCallback(async (params?: { week?: number; month?: string; courseId?: number }) => {
    setLoading(true);
    try {
      const data = await getSchedule(params);
      setEvents(data);
    } catch (error: any) {
      console.error("Failed to fetch schedule:", error);
      const message = error.response?.data?.message || "Không thể tải lịch học";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateEvent = async (data: CreateEventData) => {
    setLoading(true);
    try {
      const newEvent = await createEvent(data);
      toast.success("Đã thêm sự kiện mới");
      fetchSchedule();
      return newEvent;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể thêm sự kiện";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (id: number, data: Partial<CreateEventData>) => {
    setLoading(true);
    try {
      const updatedEvent = await updateEvent(id, data);
      toast.success("Đã cập nhật sự kiện");
      fetchSchedule();
      return updatedEvent;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể cập nhật sự kiện";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    setLoading(true);
    try {
      await deleteEvent(id);
      toast.success("Đã xóa sự kiện");
      fetchSchedule();
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể xóa sự kiện";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    events,
    fetchSchedule,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
  };
}

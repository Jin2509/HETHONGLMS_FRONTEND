import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, MapPin, Video, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { formatVietnamDate } from "../../../utils/datetime";
import { useSchedule } from "../hooks/useSchedule";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent, normalizeRole } from "../../../utils/permissions";

export function Schedule() {
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role);
  const { events, loading, fetchSchedule } = useSchedule();
  const [view, setView] = useState<"week" | "month" | "list">("week");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  useEffect(() => {
    fetchSchedule({ week: currentWeek });
  }, [currentWeek, fetchSchedule]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getEventStyle = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    
    const top = (startHour - 7) * 64 + (startMin / 60) * 64;
    const durationHours = (endHour - startHour) + (endMin - startMin) / 60;
    const height = durationHours * 64;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lịch học</h1>
          <p className="text-muted-foreground">Quản lý thời khóa biểu và lịch sự kiện</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Giờ Việt Nam</div>
          <div className="text-2xl font-bold text-primary">
            {formatVietnamDate(currentTime, "time")}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatVietnamDate(currentTime, "date")}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {["week", "month", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-input hover:bg-slate-50"
              }`}
            >
              {v === "week" ? "Tuần" : v === "month" ? "Tháng" : "Danh sách"}
            </button>
          ))}
        </div>

        {canManageContent(userRole) && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Plus className="w-4 h-4" />
            <span>Thêm sự kiện</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-card border border-border rounded-xl shadow-sm">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Đang tải lịch trình...</p>
        </div>
      ) : (
        <>
          {view === "week" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-semibold">Tuần hiện tại</h2>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-8">
                  <div className="border-r border-border p-3 bg-slate-50">
                    <div className="text-xs text-muted-foreground">Giờ</div>
                  </div>
                  {days.map((day, idx) => (
                    <div
                      key={day}
                      className={`border-r last:border-r-0 border-border p-3 text-center bg-slate-50`}
                    >
                      <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-8 min-h-[400px]">
                  <div className="border-r border-border">
                    {Array.from({ length: 14 }, (_, i) => 7 + i).map((hour) => (
                      <div
                        key={hour}
                        className="border-t border-border p-2 text-xs text-muted-foreground h-16"
                      >
                        {hour}:00
                      </div>
                    ))}
                  </div>

                  {days.map((_, dayIdx) => (
                    <div key={dayIdx} className="border-r last:border-r-0 border-border relative">
                      {Array.from({ length: 14 }).map((_, hourIdx) => (
                        <div key={hourIdx} className="border-t border-border h-16"></div>
                      ))}

                      {events
                        .filter((e) => e.dayOfWeek === dayIdx)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 p-2 rounded text-white text-xs overflow-hidden"
                            style={{
                              backgroundColor: event.color,
                              ...getEventStyle(event.startTime, event.endTime)
                            }}
                          >
                            <div className="font-medium mb-1 line-clamp-1">{event.title}</div>
                            <div className="opacity-90 text-xs">{event.startTime} - {event.endTime}</div>
                            <div className="opacity-90 text-xs line-clamp-1">{event.room}</div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "list" && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground">Không có sự kiện nào trong danh sách</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-1 h-full rounded min-h-[60px]"
                        style={{ backgroundColor: event.color }}
                      ></div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{event.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.room === "Online" ? (
                              <Video className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                            <span>{event.room}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {event.courseName || "Khóa học"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">
                        Tham gia
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

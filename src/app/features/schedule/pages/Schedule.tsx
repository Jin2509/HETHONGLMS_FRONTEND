import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Video, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { formatVietnamDate } from "../../../utils/datetime";

const events = [
  {
    id: 1,
    title: "Web Development Lecture",
    course: "Web Development",
    type: "lecture",
    time: "09:00 - 11:00",
    room: "Room A101",
    instructor: "Dr. Nguyễn Văn B",
    day: 1,
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "DSA Lab Session",
    course: "Data Structures",
    type: "lab",
    time: "13:00 - 15:00",
    room: "Lab B202",
    instructor: "Prof. Trần Thị C",
    day: 1,
    color: "#10B981",
  },
  {
    id: 3,
    title: "Database Design Workshop",
    course: "Database Systems",
    type: "workshop",
    time: "10:00 - 12:00",
    room: "Online",
    instructor: "Dr. Phạm Thị E",
    day: 3,
    color: "#F59E0B",
  },
];

export function Schedule() {
  const [view, setView] = useState<"week" | "month" | "list">("week");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

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

        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện</span>
        </button>
      </div>

      {view === "week" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-semibold">Tuần 23: 02/06 - 08/06/2026</h2>
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
                  className={`border-r last:border-r-0 border-border p-3 text-center ${
                    idx === 0 ? "bg-primary/5" : "bg-slate-50"
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">{day}</div>
                  <div
                    className={`text-lg font-semibold ${
                      idx === 0 ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {2 + idx}
                  </div>
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
                    .filter((e) => e.day === dayIdx)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 p-2 rounded text-white text-xs overflow-hidden"
                        style={{
                          backgroundColor: event.color,
                          top: `${(9 - 7) * 64}px`,
                          height: "120px",
                        }}
                      >
                        <div className="font-medium mb-1 line-clamp-1">{event.title}</div>
                        <div className="opacity-90 text-xs">{event.time}</div>
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
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm card-hover"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-1 h-full rounded"
                  style={{ backgroundColor: event.color }}
                ></div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
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
                        {event.course}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">
                  Tham gia
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

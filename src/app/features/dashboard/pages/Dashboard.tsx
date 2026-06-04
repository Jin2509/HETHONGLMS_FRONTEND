import { useAuth } from "../../../contexts/AuthContext";
import { BookOpen, FileCheck, Award, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { getVietnamTime } from "../../../utils/datetime";

const stats = [
  { icon: BookOpen, label: "Khóa học đang học", value: "8", color: "text-primary" },
  { icon: FileCheck, label: "Bài thi tuần này", value: "3", color: "text-warning" },
  { icon: Award, label: "Điểm TB", value: "8.5", color: "text-success" },
];

const continueCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    progress: 75,
    lastAccessed: "2 giờ trước",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
    progress: 45,
    lastAccessed: "1 ngày trước",
  },
  {
    id: 3,
    title: "Mobile App Design",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    progress: 90,
    lastAccessed: "3 ngày trước",
  },
];

const recentActivity = [
  { icon: CheckCircle2, action: "Hoàn thành bài tập: React Hooks", time: "2 giờ trước", color: "text-success" },
  { icon: FileCheck, action: "Nộp bài: Database Design", time: "5 giờ trước", color: "text-primary" },
  { icon: Award, action: "Đạt điểm A cho bài kiểm tra Midterm", time: "1 ngày trước", color: "text-warning" },
  { icon: BookOpen, action: "Bắt đầu khóa học mới: Machine Learning", time: "2 ngày trước", color: "text-primary" },
];

const upcomingDeadlines = [
  { name: "Assignment: React Project", course: "Web Dev", due: "2 ngày nữa", urgency: "green" },
  { name: "Quiz: Algorithms", course: "DSA", due: "1 ngày nữa", urgency: "amber" },
  { name: "Final Exam: Database", course: "Database", due: "6 giờ nữa", urgency: "red" },
];

export function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = getVietnamTime().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Hôm nay bạn có 3 bài tập và 1 bài kiểm tra cần hoàn thành
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold text-card-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tiếp tục học</h2>
              <button className="text-sm text-primary hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {continueCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 w-72 bg-card border border-border rounded-xl overflow-hidden shadow-sm card-hover cursor-pointer"
                >
                  <div className="relative h-40">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-card-foreground mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.progress}% hoàn thành</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.lastAccessed}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full animate-progress"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-slate-100 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-card-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium mb-4">Tháng 6, 2026</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <div key={day} className="text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 1;
                const isToday = day === 2;
                const hasEvent = [5, 8, 12, 15, 20].includes(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors ${
                      day < 1 || day > 30
                        ? "text-muted-foreground/30"
                        : isToday
                        ? "bg-primary text-white font-medium"
                        : "hover:bg-slate-100"
                    } ${hasEvent && !isToday ? "relative after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full" : ""}`}
                  >
                    {day > 0 && day <= 30 ? day : ""}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium mb-4">Sắp tới</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, idx) => (
                <div
                  key={idx}
                  className={`pl-3 py-2 border-l-2 ${
                    deadline.urgency === "red"
                      ? "border-destructive"
                      : deadline.urgency === "amber"
                      ? "border-warning"
                      : "border-success"
                  }`}
                >
                  <p className="text-sm font-medium text-card-foreground">
                    {deadline.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {deadline.course}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {deadline.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution Heatmap */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium mb-2">Hoạt động</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chuỗi học liên tiếp: <span className="font-medium text-success">7 ngày</span>
            </p>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 84 }, (_, i) => {
                const level = Math.floor(Math.random() * 5);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${
                      level === 0
                        ? "bg-slate-100"
                        : level === 1
                        ? "bg-primary/20"
                        : level === 2
                        ? "bg-primary/40"
                        : level === 3
                        ? "bg-primary/60"
                        : "bg-primary/80"
                    }`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router";
import { 
  BookOpen, 
  FileCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  Users, 
  ClipboardList, 
  GraduationCap, 
  AlertCircle,
  Calendar,
  ChevronRight
} from "lucide-react";
import { getVietnamTime } from "../../../utils/datetime";

// --- STUDENT MOCK DATA ---
const studentStats = [
  { icon: BookOpen, label: "Khóa học đang học", value: "8", color: "text-primary" },
  { icon: FileCheck, label: "Bài thi tuần này", value: "3", color: "text-warning" },
  { icon: Award, label: "Điểm TB", value: "8.5", color: "text-success" },
];

const studentRecentActivity = [
  { icon: CheckCircle2, action: "Hoàn thành bài tập: React Hooks", time: "2 giờ trước", color: "text-success" },
  { icon: FileCheck, action: "Nộp bài: Database Design", time: "5 giờ trước", color: "text-primary" },
  { icon: Award, action: "Đạt điểm A cho bài kiểm tra Midterm", time: "1 ngày trước", color: "text-warning" },
];

// --- TEACHER MOCK DATA ---
const teacherStats = [
  { icon: GraduationCap, label: "Lớp học đang dạy", value: "4", color: "text-primary" },
  { icon: ClipboardList, label: "Bài tập đã giao", value: "24", color: "text-success" },
  { icon: FileCheck, label: "Kỳ thi sắp tới", value: "2", color: "text-warning" },
];

const teacherRecentActivity = [
  { icon: CheckCircle2, action: "Đã chấm điểm lớp Web Dev - A", time: "1 giờ trước", color: "text-success" },
  { icon: Plus, action: "Tạo bài tập mới: React State Management", time: "3 giờ trước", color: "text-primary" },
  { icon: AlertCircle, action: "15 bài nộp mới cần chấm điểm", time: "5 giờ trước", color: "text-warning" },
];

// --- ADMIN MOCK DATA ---
const adminStats = [
  { icon: Users, label: "Tổng người dùng", value: "1,250", color: "text-primary" },
  { icon: GraduationCap, label: "Tổng lớp học", value: "32", color: "text-success" },
  { icon: BookOpen, label: "Tổng khóa học", value: "48", color: "text-warning" },
];

const adminRecentActivity = [
  { icon: Users, action: "Đã thêm 5 sinh viên mới", time: "30 phút trước", color: "text-primary" },
  { icon: CheckCircle2, action: "Hệ thống đã sao lưu dữ liệu", time: "2 giờ trước", color: "text-success" },
  { icon: AlertCircle, action: "Cảnh báo: Bộ nhớ server đạt 85%", time: "4 giờ trước", color: "text-warning" },
];

const upcomingDeadlines = [
  { name: "Assignment: React Project", course: "Web Dev", due: "2 ngày nữa", urgency: "green" },
  { name: "Quiz: Algorithms", course: "DSA", due: "1 ngày nữa", urgency: "amber" },
  { name: "Final Exam: Database", course: "Database", due: "6 giờ nữa", urgency: "red" },
];

import { Plus } from "lucide-react"; // Re-import to avoid error if missing

// --- ADDITIONAL MOCK DATA ---
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
];

const teacherClasses = [
  { id: 1, name: "Web Development - Class A", students: 45, nextClass: "Thứ 2, 09:00", room: "A101" },
  { id: 2, name: "Data Structures - Class B", students: 38, nextClass: "Thứ 3, 13:00", room: "B202" },
];

const adminSystemHealth = [
  { name: "CPU Usage", value: 45, status: "Normal" },
  { name: "Memory", value: 82, status: "Warning" },
  { name: "Database", value: 12, status: "Normal" },
];

export function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "student";

  const getGreeting = () => {
    const hour = getVietnamTime().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getStats = () => {
    switch (role) {
      case "admin": return adminStats;
      case "teacher": return teacherStats;
      default: return studentStats;
    }
  };

  const getRecentActivity = () => {
    switch (role) {
      case "admin": return adminRecentActivity;
      case "teacher": return teacherRecentActivity;
      default: return studentRecentActivity;
    }
  };

  const currentStats = getStats();
  const currentActivity = getRecentActivity();

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            {role === "student" && "Hôm nay bạn có 3 bài tập và 1 bài kiểm tra cần hoàn thành"}
            {role === "teacher" && "Hôm nay bạn có 2 tiết dạy và 15 bài tập cần chấm điểm"}
            {role === "admin" && "Hệ thống đang hoạt động ổn định. Có 5 người dùng mới đăng ký hôm nay."}
          </p>
        </div>
        {role !== "student" && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>{role === "admin" ? "Thêm người dùng" : "Tạo bài tập"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStats.map((stat) => (
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

          {/* Role specific section */}
          {role === "student" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tiếp tục học</h2>
                <Link to="/courses" className="text-sm text-primary hover:underline">
                  Xem tất cả
                </Link>
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
          )}

          {role === "teacher" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lớp học đang phụ trách</h2>
                <Link to="/classes" className="text-sm text-primary hover:underline">
                  Quản lý lớp
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherClasses.map((cls) => (
                  <div key={cls.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">{cls.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Users className="w-4 h-4" /> Sĩ số
                        </span>
                        <span className="font-medium">{cls.students} sinh viên</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Tiết tới
                        </span>
                        <span className="font-medium text-primary">{cls.nextClass}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Phòng
                        </span>
                        <span className="font-medium">{cls.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "admin" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Sức khỏe hệ thống</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adminSystemHealth.map((item) => (
                  <div key={item.name} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Normal" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold">{item.value}%</span>
                    </div>
                    <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${item.status === "Normal" ? "bg-success" : "bg-warning"}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                {currentActivity.map((activity, idx) => (
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
            <h3 className="font-medium mb-4 flex items-center justify-between">
              Tháng 6, 2026
              <button className="text-muted-foreground hover:text-primary">
                <ChevronRight className="w-4 h-4" />
              </button>
            </h3>
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

          {/* Role specific sidebar section */}
          {role !== "admin" && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-medium mb-4">{role === "student" ? "Sắp tới" : "Lịch dạy sắp tới"}</h3>
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
          )}

          {/* Contribution Heatmap (only for student/teacher) */}
          {role !== "admin" && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-medium mb-2">Hoạt động</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chuỗi {role === "student" ? "học" : "dạy"} liên tiếp: <span className="font-medium text-success">7 ngày</span>
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
          )}

          {role === "admin" && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-medium mb-4 text-warning flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Cảnh báo hệ thống
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs text-red-700 font-medium">Bộ nhớ Server sắp đầy</p>
                  <p className="text-[10px] text-red-600 mt-1">Vui lòng kiểm tra dung lượng ổ đĩa.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium">Cần cập nhật SSL</p>
                  <p className="text-[10px] text-amber-600 mt-1">Chứng chỉ sẽ hết hạn trong 5 ngày.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  BookOpen,
  FileCheck,
  Award,
  Clock,
  Users,
  ClipboardList,
  GraduationCap,
  AlertCircle,
  Calendar,
  ChevronRight,
  Plus,
} from "lucide-react";
import { getVietnamTime } from "../../../utils/datetime";
import { normalizeRole } from "../../../utils/permissions";
import { getSystemStats, type ReportStats } from "../../../../service/report.service";
import { getClasses, type Class } from "../../../../service/class.service";
import { getCourses, type Course } from "../../../../service/course.service";
import { getAssignments } from "../../../../service/assignment.service";
import { getExams } from "../../../../service/exam.service";
import { getDiscussions } from "../../../../service/discussion.service";
import type { Assignment } from "../../assignments/types/assignment.types";
import type { Exam } from "../../../../service/exam.service";

const DEFAULT_COURSE_THUMBNAIL =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400";

function getDaysLeft(date?: string) {
  if (!date) return Number.POSITIVE_INFINITY;
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return Number.POSITIVE_INFINITY;
  return Math.ceil((timestamp - Date.now()) / 864e5);
}

function formatDueText(date?: string) {
  const days = getDaysLeft(date);
  if (!Number.isFinite(days)) return "Chưa có hạn";
  if (days < 0) return "Đã quá hạn";
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Ngày mai";
  return `${days} ngày nữa`;
}

function getUrgency(date?: string) {
  const days = getDaysLeft(date);
  if (days <= 1) return "red";
  if (days <= 3) return "amber";
  return "green";
}

export function Dashboard() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const [systemStats, setSystemStats] = useState<ReportStats | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [discussionCount, setDiscussionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const [
        statsResult,
        classesResult,
        coursesResult,
        assignmentsResult,
        examsResult,
        discussionsResult,
      ] = await Promise.allSettled([
        role === "admin" ? getSystemStats() : Promise.resolve(null),
        getClasses(),
        getCourses(),
        getAssignments(),
        getExams(),
        getDiscussions(),
      ]);

      if (statsResult.status === "fulfilled" && statsResult.value) {
        setSystemStats(statsResult.value);
      }
      if (classesResult.status === "fulfilled") setClasses(classesResult.value);
      if (coursesResult.status === "fulfilled") setCourses(coursesResult.value);
      if (assignmentsResult.status === "fulfilled") setAssignments(assignmentsResult.value);
      if (examsResult.status === "fulfilled") setExams(examsResult.value);
      if (discussionsResult.status === "fulfilled") {
        setDiscussionCount(discussionsResult.value.length);
      }

      const rejected = [statsResult, classesResult, coursesResult, assignmentsResult, examsResult, discussionsResult]
        .filter((result) => result.status === "rejected");
      if (rejected.length > 0) {
        console.error("Failed to fetch some dashboard data:", rejected);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [role]);

  const getGreeting = () => {
    const hour = getVietnamTime().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getStats = () => {
    switch (role) {
      case "admin":
        return [
          { icon: Users, label: "Tổng người dùng", value: systemStats?.totalUsers?.toString() || "0", color: "text-primary" },
          { icon: GraduationCap, label: "Tổng lớp học", value: (systemStats?.totalClasses ?? classes.length).toString(), color: "text-success" },
          { icon: BookOpen, label: "Tổng khóa học", value: (systemStats?.totalCourses ?? courses.length).toString(), color: "text-warning" },
        ];
      case "teacher":
        return [
          { icon: GraduationCap, label: "Lớp học đang dạy", value: classes.length.toString(), color: "text-primary" },
          { icon: ClipboardList, label: "Bài tập đã giao", value: assignments.length.toString(), color: "text-success" },
          { icon: FileCheck, label: "Kỳ thi sắp tới", value: exams.filter((exam) => exam.status !== "finished").length.toString(), color: "text-warning" },
        ];
      default:
        return [
          { icon: BookOpen, label: "Khóa học đang học", value: courses.length.toString(), color: "text-primary" },
          { icon: FileCheck, label: "Bài thi tuần này", value: exams.filter((exam) => getDaysLeft(exam.date) <= 7 && getDaysLeft(exam.date) >= 0).length.toString(), color: "text-warning" },
          { icon: Award, label: "Điểm TB", value: "8.5", color: "text-success" },
        ];
    }
  };

  const getRecentActivity = () => {
    const latestAssignments = assignments.slice(0, 2).map((assignment) => ({
      icon: ClipboardList,
      action: `Bài tập: ${assignment.name}`,
      time: formatDueText(assignment.dueDate),
      color: "text-primary",
    }));
    const latestExams = exams.slice(0, 2).map((exam) => ({
      icon: FileCheck,
      action: `Kỳ thi: ${exam.name}`,
      time: formatDueText(exam.date),
      color: "text-warning",
    }));
    if (role === "admin") {
      return [
        { icon: Users, action: `${systemStats?.totalUsers || 0} người dùng trên hệ thống`, time: `${systemStats?.newUsersToday || 0} mới hôm nay`, color: "text-primary" },
        { icon: BookOpen, action: `${courses.length} khóa học, ${classes.length} lớp học`, time: `${discussionCount} thảo luận`, color: "text-success" },
        { icon: ClipboardList, action: `${assignments.length} bài tập, ${exams.length} kỳ thi`, time: `${systemStats?.monthlySubmissions || 0} bài nộp tháng này`, color: "text-warning" },
      ];
    }
    return [...latestAssignments, ...latestExams].slice(0, 3);
  };

  const currentStats = getStats();
  const currentActivity = getRecentActivity();
  const upcomingDeadlines = [...assignments.map((assignment) => ({
    name: assignment.name,
    course: assignment.course,
    due: formatDueText(assignment.dueDate),
    urgency: getUrgency(assignment.dueDate),
  })), ...exams.map((exam) => ({
    name: exam.name,
    course: exam.courseName || "Khóa học",
    due: formatDueText(exam.date),
    urgency: getUrgency(exam.date),
  }))].slice(0, 3);
  const teacherClasses = classes.slice(0, 4).map((cls) => ({
    id: cls.id,
    name: cls.name,
    students: cls.studentCount || 0,
    nextClass: "Chưa cập nhật",
    room: "Chưa cập nhật",
  }));
  const adminSystemHealth = [
    { name: "Người dùng", value: Math.min(systemStats?.totalUsers || 0, 100), status: "Normal" },
    { name: "Khóa học", value: Math.min(systemStats?.totalCourses || courses.length, 100), status: "Normal" },
    { name: "Tỉ lệ hoàn thành", value: Math.min(systemStats?.completionRate || 0, 100), status: (systemStats?.completionRate || 0) >= 60 ? "Normal" : "Warning" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            {role === "student" && `Bạn có ${upcomingDeadlines.length} mục học tập sắp tới.`}
            {role === "teacher" && `Bạn đang phụ trách ${classes.length} lớp, ${assignments.length} bài tập và ${exams.length} kỳ thi.`}
            {role === "admin" && `Hệ thống có ${systemStats?.totalUsers || 0} người dùng và ${courses.length} khóa học đang được đồng bộ.`}
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
                <Link to="/classes" className="text-sm text-primary hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {courses.length === 0 ? (
                  <div className="w-full py-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    Chưa có khóa học nào. Hãy vào mục Lớp học để xem khóa học được gán.
                  </div>
                ) : (
                  courses.slice(0, 6).map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="flex-shrink-0 w-72 bg-card border border-border rounded-xl overflow-hidden shadow-sm card-hover"
                    >
                      <div className="relative h-40">
                        <img
                          src={course.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-card-foreground mb-2 line-clamp-2">
                          {course.name}
                        </h3>
                        {course.instructor && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {course.instructor}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="w-3 h-3" />
                          <span>{course.chapters?.length || 0} chương</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
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
              {getVietnamTime().toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
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
                const isToday = day === getVietnamTime().getDate();
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

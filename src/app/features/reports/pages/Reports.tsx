import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, BookOpen, ClipboardList, Calendar, History, Filter, FileCheck, MessageSquare } from "lucide-react";
import { Badge } from "../../../components/shared";
import { getUsers, type User } from "../../../../service/admin.service";
import { getClasses, type Class } from "../../../../service/class.service";
import { getAssignments } from "../../../../service/assignment.service";
import { getExams, type Exam } from "../../../../service/exam.service";
import { getCourses } from "../../../../service/course.service";
import { getDiscussions } from "../../../../service/discussion.service";
import { getEnrollmentTrend, getSubmissionByCourse, getSystemStats, getTopStudents, type EnrollmentTrend, type ReportStats, type SubmissionByCourse, type TopStudent } from "../../../../service/report.service";
import type { Assignment } from "../../assignments/types/assignment.types";

function formatDate(date?: string) {
  if (!date) return "Chưa cập nhật";
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return date;
  return new Date(timestamp).toLocaleString("vi-VN");
}

export function Reports() {
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [coursesCount, setCoursesCount] = useState(0);
  const [discussionsCount, setDiscussionsCount] = useState(0);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [enrollmentTrend, setEnrollmentTrend] = useState<EnrollmentTrend[]>([]);
  const [submissionByCourse, setSubmissionByCourse] = useState<SubmissionByCourse[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const [
        usersResult,
        classesResult,
        assignmentsResult,
        examsResult,
        coursesResult,
        discussionsResult,
        statsResult,
        enrollmentResult,
        submissionsResult,
        topStudentsResult,
      ] = await Promise.allSettled([
        getUsers({ limit: 10000 }),
        getClasses(),
        getAssignments(),
        getExams(),
        getCourses(),
        getDiscussions(),
        getSystemStats(),
        getEnrollmentTrend(),
        getSubmissionByCourse(),
        getTopStudents(),
      ]);

      if (usersResult.status === "fulfilled") setUsers(usersResult.value.data);
      if (classesResult.status === "fulfilled") setClasses(classesResult.value);
      if (assignmentsResult.status === "fulfilled") setAssignments(assignmentsResult.value);
      if (examsResult.status === "fulfilled") setExams(examsResult.value);
      if (coursesResult.status === "fulfilled") setCoursesCount(coursesResult.value.length);
      if (discussionsResult.status === "fulfilled") setDiscussionsCount(discussionsResult.value.length);
      if (statsResult.status === "fulfilled") setStats(statsResult.value);
      if (enrollmentResult.status === "fulfilled") setEnrollmentTrend(enrollmentResult.value);
      if (submissionsResult.status === "fulfilled") setSubmissionByCourse(submissionsResult.value);
      if (topStudentsResult.status === "fulfilled") setTopStudents(topStudentsResult.value);

      setLoading(false);
    };

    fetchReports();
  }, []);

  const semesters = useMemo(() => {
    const values = Array.from(new Set(classes.map((item) => item.semester).filter(Boolean)));
    return ["all", ...values];
  }, [classes]);

  const userData = useMemo(() => [
    { name: "Sinh viên", value: users.filter((user) => user.role === "student").length, color: "#2563EB" },
    { name: "Giảng viên", value: users.filter((user) => user.role === "teacher").length, color: "#059669" },
    { name: "Quản trị viên", value: users.filter((user) => user.role === "admin").length, color: "#D97706" },
  ], [users]);

  const filteredClasses = selectedSemester === "all"
    ? classes
    : classes.filter((item) => item.semester === selectedSemester);

  const overviewData = [
    { label: "Người dùng", value: stats?.totalUsers ?? users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Lớp học", value: stats?.totalClasses ?? classes.length, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Khóa học", value: stats?.totalCourses ?? coursesCount, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Bài tập", value: stats?.totalAssignments ?? assignments.length, icon: ClipboardList, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Kỳ thi", value: stats?.totalExams ?? exams.length, icon: FileCheck, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Thảo luận", value: stats?.totalDiscussions ?? discussionsCount, icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  const contentByCourse = submissionByCourse.length > 0
    ? submissionByCourse
    : Array.from(new Map(assignments.map((assignment) => [assignment.course, assignment.course])).values()).map((course, index) => ({
        id: index + 1,
        course: course || "Khóa học",
        count: assignments.filter((assignment) => assignment.course === course).length,
      }));

  const auditLogs = [
    ...users.slice(0, 2).map((item) => ({ id: `user-${item.id}`, action: "Đồng bộ", target: "Người dùng", detail: `${item.name} (${item.role})`, user: "Hệ thống", time: formatDate(item.updatedAt || item.createdAt) })),
    ...classes.slice(0, 2).map((item) => ({ id: `class-${item.id}`, action: "Đồng bộ", target: "Lớp học", detail: item.name, user: item.instructorName || "Hệ thống", time: formatDate(item.createdAt) })),
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header & Global Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">Thống kê hệ thống</h1>
          <p className="text-muted-foreground italic text-sm">Dữ liệu phân tích chuyên sâu cho Quản trị viên</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Học kỳ filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Học kỳ</label>
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              {semesters.map(s => <option key={s} value={s}>{s === "all" ? "Tất cả" : s}</option>)}
            </select>
          </div>

          {/* Thời gian filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Từ ngày</label>
            <input 
              type="date" 
              className="px-4 py-2 bg-background border border-input rounded-xl text-sm outline-none"
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Đến ngày</label>
            <input 
              type="date" 
              className="px-4 py-2 bg-background border border-input rounded-xl text-sm outline-none"
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {overviewData.map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Distribution Chart */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Cơ cấu người dùng
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {userData.map(item => (
              <div key={item.name} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-muted-foreground mb-1">{item.name}</p>
                <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Class & Learning Content Stats */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Thống kê lớp học & Nội dung ({selectedSemester === "all" ? "Tất cả" : selectedSemester})
            </h2>
            <Badge variant="primary">{filteredClasses.length} Lớp học</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tên lớp học</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-center">Sinh viên</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-center">Khóa học</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-right">Học kỳ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-sm">{item.name}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Users className="w-3 h-3" /> {item.studentCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <BookOpen className="w-3 h-3" /> {item.courseCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-700">
                      {item.semester}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Bài nộp theo khóa học
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentByCourse}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Xu hướng ghi danh
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {topStudents.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Sinh viên nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topStudents.slice(0, 6).map((student) => (
              <div key={`${student.rank}-${student.name}`} className="border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground">Hạng #{student.rank}</p>
                <p className="font-semibold mt-1">{student.name}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span>GPA {student.gpa}</span>
                  <span>{student.completion}% hoàn thành</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log / Activity History */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Lịch sử cập nhật hệ thống (Người dùng)
        </h2>
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors">
              <div className={`mt-1 p-2 rounded-lg ${
                log.action === "Thêm mới" ? "bg-green-100 text-green-600" :
                log.action === "Chỉnh sửa" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
              }`}>
                <Filter className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{log.action} {log.target}</span>
                  <span className="text-xs text-muted-foreground font-mono">{log.time}</span>
                </div>
                <p className="text-sm text-slate-600">{log.detail}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Thực hiện bởi:</span>
                  <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">{log.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-3 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-slate-50 transition-colors">
          Xem tất cả lịch sử hoạt động
        </button>
      </div>
    </div>
  );
}

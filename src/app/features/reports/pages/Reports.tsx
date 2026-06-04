import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users, BookOpen, ClipboardList, GraduationCap, Calendar, History, Search, Filter } from "lucide-react";
import { Badge } from "../../../components/shared";

// 1. Dữ liệu mẫu cơ cấu người dùng
const userData = [
  { name: "Sinh viên", value: 850, color: "#3B82F6" },
  { name: "Giảng viên", value: 45, color: "#10B981" },
  { name: "Quản trị viên", value: 5, color: "#F59E0B" },
];

// 2. Dữ liệu mẫu thống kê theo lớp học
const classStatsData = [
  { id: 1, className: "Web Development - Class A", assignments: 12, exams: 2, semester: "HK2 2025" },
  { id: 2, className: "Data Structures - Class B", assignments: 8, exams: 1, semester: "HK2 2025" },
  { id: 3, className: "Database Systems - Class A", assignments: 10, exams: 2, semester: "HK1 2025" },
  { id: 4, className: "Software Engineering", assignments: 15, exams: 3, semester: "HK1 2025" },
];

// 3. Dữ liệu mẫu lịch sử cập nhật (Audit Log)
const auditLogs = [
  { id: 1, action: "Thêm mới", target: "Người dùng", detail: "Tạo tài khoản 'Nguyễn Văn A' (Sinh viên)", user: "Admin", time: "2026-06-05 09:30" },
  { id: 2, action: "Chỉnh sửa", target: "Người dùng", detail: "Cập nhật quyền 'Trần Thị B' thành Giảng viên", user: "Admin", time: "2026-06-05 10:15" },
  { id: 3, action: "Xóa", target: "Người dùng", detail: "Xóa tài khoản 'Lê Văn C'", user: "Admin", time: "2026-06-04 15:45" },
  { id: 4, action: "Thêm mới", target: "Lớp học", detail: "Tạo lớp 'Mobile App Design'", user: "Admin", time: "2026-06-04 14:00" },
];

const semesters = ["HK2 2025", "HK1 2025", "HK2 2024", "HK1 2024"];

export function Reports() {
  const [selectedSemester, setSelectedSemester] = useState("HK2 2025");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredClassStats = classStatsData.filter(item => item.semester === selectedSemester);

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
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
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
              Thống kê lớp học & Nội dung ({selectedSemester})
            </h2>
            <Badge variant="primary">{filteredClassStats.length} Lớp học</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tên lớp học</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-center">Bài tập</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-center">Kỳ thi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase text-right">Tổng nội dung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClassStats.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-sm">{item.className}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <ClipboardList className="w-3 h-3" /> {item.assignments}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3" /> {item.exams}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-700">
                      {item.assignments + item.exams}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

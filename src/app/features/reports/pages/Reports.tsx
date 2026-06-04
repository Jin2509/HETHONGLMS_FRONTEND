import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BookOpen, TrendingUp, FileCheck, Download } from "lucide-react";

const stats = [
  { label: "Tổng người dùng", value: "1,234", icon: Users, change: "+12%" },
  { label: "Khóa học hoạt động", value: "48", icon: BookOpen, change: "+8%" },
  { label: "Tỷ lệ hoàn thành", value: "78%", icon: TrendingUp, change: "+5%" },
  { label: "Bài nộp tháng này", value: "892", icon: FileCheck, change: "+15%" },
];

const enrollmentData = [
  { id: 1, month: "T1", students: 850 },
  { id: 2, month: "T2", students: 920 },
  { id: 3, month: "T3", students: 1050 },
  { id: 4, month: "T4", students: 1120 },
  { id: 5, month: "T5", students: 1180 },
  { id: 6, month: "T6", students: 1234 },
];

const submissionData = [
  { id: 1, course: "Web Dev", count: 245 },
  { id: 2, course: "DSA", count: 198 },
  { id: 3, course: "Database", count: 176 },
  { id: 4, course: "UI/UX", count: 154 },
  { id: 5, course: "ML", count: 119 },
];

export function Reports() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Báo cáo</h1>
        <p className="text-muted-foreground">Thống kê và phân tích dữ liệu hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-success font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Xu hướng đăng ký</h2>
            <button className="text-sm text-primary hover:underline">6 tháng</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={enrollmentData} id="enrollment-chart">
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#enrollmentGradient)"
                name="Sinh viên"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bài nộp theo khóa học</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={submissionData} layout="vertical" id="submission-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="course" type="category" stroke="#6B7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Sinh viên xuất sắc</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Hạng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Sinh viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  GPA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Hoàn thành
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { rank: 1, name: "Nguyễn Văn A", gpa: 9.5, completion: 98 },
                { rank: 2, name: "Trần Thị B", gpa: 9.3, completion: 96 },
                { rank: 3, name: "Lê Văn C", gpa: 9.1, completion: 95 },
              ].map((student) => (
                <tr key={student.rank} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="font-bold text-primary">#{student.rank}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-success">{student.gpa}</span>
                  </td>
                  <td className="px-4 py-3">{student.completion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
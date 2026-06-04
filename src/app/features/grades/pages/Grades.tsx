import { useState } from "react";
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

const gradesData = [
  { course: "Web Development", midterm: 8.5, final: 9.0, assignments: 8.8, participation: 9.5, gpa: 8.95 },
  { course: "Data Structures", midterm: 7.5, final: 8.0, assignments: 8.5, participation: 8.0, gpa: 8.0 },
  { course: "Database Systems", midterm: 9.0, final: 9.5, assignments: 9.2, participation: 9.0, gpa: 9.18 },
  { course: "UI/UX Design", midterm: 8.0, final: 8.5, assignments: 9.0, participation: 9.0, gpa: 8.63 },
];

const trendData = [
  { semester: "HK1 2024", gpa: 7.8 },
  { semester: "HK2 2024", gpa: 8.2 },
  { semester: "HK1 2025", gpa: 8.5 },
  { semester: "HK2 2025", gpa: 8.7 },
];

const radarData = [
  { subject: "Web Dev", score: 8.95 },
  { subject: "DSA", score: 8.0 },
  { subject: "Database", score: 9.18 },
  { subject: "UI/UX", score: 8.63 },
  { subject: "ML", score: 7.5 },
];

export function Grades() {
  const [view, setView] = useState<"table" | "chart">("table");
  const [semester, setSemester] = useState("HK2 2025");

  const avgGPA = (gradesData.reduce((sum, g) => sum + g.gpa, 0) / gradesData.length).toFixed(2);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bảng điểm</h1>
        <p className="text-muted-foreground">Xem điểm và tiến độ học tập của bạn</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-input hover:bg-slate-50"
            }`}
          >
            Bảng điểm
          </button>
          <button
            onClick={() => setView("chart")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === "chart"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-input hover:bg-slate-50"
            }`}
          >
            Biểu đồ
          </button>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>HK1 2024</option>
            <option>HK2 2024</option>
            <option>HK1 2025</option>
            <option>HK2 2025</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50">
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Môn học
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Giữa kỳ
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Cuối kỳ
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Bài tập
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Tham gia
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gradesData.map((grade, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{grade.course}</td>
                  <td className="px-6 py-4 text-center">{grade.midterm}</td>
                  <td className="px-6 py-4 text-center">{grade.final}</td>
                  <td className="px-6 py-4 text-center">{grade.assignments}</td>
                  <td className="px-6 py-4 text-center">{grade.participation}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-success">{grade.gpa}</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-medium">
                <td className="px-6 py-4">Trung bình</td>
                <td className="px-6 py-4 text-center">-</td>
                <td className="px-6 py-4 text-center">-</td>
                <td className="px-6 py-4 text-center">-</td>
                <td className="px-6 py-4 text-center">-</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-primary">{avgGPA}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          {/* GPA Trend */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Xu hướng GPA</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="semester" stroke="#6B7280" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 4 }} id="gpa-line" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Điểm theo môn</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="course" stroke="#6B7280" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#6B7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="gpa" fill="#3B82F6" radius={[4, 4, 0, 0]} id="gpa-bar" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Phân tích năng lực</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" stroke="#6B7280" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 10]} stroke="#6B7280" fontSize={10} />
                  <Radar name="Điểm" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} id="score-radar" />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

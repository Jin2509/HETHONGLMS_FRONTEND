import { useState } from "react";
import { Search, Filter, BookOpen } from "lucide-react";

// Định nghĩa interface cho dữ liệu điểm
interface GradeEntry {
  id: number;
  name: string;
  type: "Bài tập" | "Bài thi";
  course: string;
  score: number | null;
  date: string;
}

const mockGrades: GradeEntry[] = [
  { id: 1, name: "React Component Design", type: "Bài tập", course: "Web Development", score: 8.5, date: "2026-06-05" },
  { id: 2, name: "Midterm Exam - Web Development", type: "Bài thi", course: "Web Development", score: 9.0, date: "2026-06-10" },
  { id: 3, name: "Database Schema Design", type: "Bài tập", course: "Database Systems", score: 8.0, date: "2026-06-03" },
  { id: 4, name: "Algorithm Analysis", type: "Bài tập", course: "Data Structures", score: 7.5, date: "2026-06-02" },
  { id: 5, name: "Final Exam - Data Structures", type: "Bài thi", course: "Data Structures", score: null, date: "2026-06-15" },
  { id: 6, name: "Quiz - CSS Fundamentals", type: "Bài thi", course: "Web Development", score: 9.5, date: "2026-05-28" },
];

export function Grades() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "assignment" | "exam">("all");

  const filteredGrades = mockGrades.filter((grade) => {
    const matchesSearch = 
      grade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      filterType === "all" || 
      (filterType === "assignment" && grade.type === "Bài tập") ||
      (filterType === "exam" && grade.type === "Bài thi");

    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kết quả học tập</h1>
        <p className="text-muted-foreground">Thông báo kết quả các bài tập và bài thi đã thực hiện</p>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập, bài thi hoặc môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-card border border-input rounded-lg p-1">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterType === "all" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType("assignment")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterType === "assignment" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bài tập
            </button>
            <button
              onClick={() => setFilterType("exam")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterType === "exam" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bài thi
            </button>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tên bài làm / Môn học
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Điểm số
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredGrades.map((grade) => (
              <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-foreground">{grade.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3" />
                      {grade.course}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    grade.type === "Bài tập" 
                      ? "bg-blue-50 text-blue-600 border border-blue-100" 
                      : "bg-purple-50 text-purple-600 border border-purple-100"
                  }`}>
                    {grade.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {grade.score !== null ? (
                    <span className="text-lg font-bold text-primary">{grade.score}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Đang chờ chấm</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGrades.length === 0 && (
          <div className="py-20 text-center">
            <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Không tìm thấy kết quả nào</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700 leading-relaxed">
          <strong>Lưu ý:</strong> Trang này chỉ hiển thị kết quả các bài tập và bài kiểm tra trên hệ thống trực tuyến. 
          Kết quả học tập chính thức và điểm tổng kết học kỳ vui lòng xem tại Cổng thông tin sinh viên của trường.
        </p>
      </div>
    </div>
  );
}

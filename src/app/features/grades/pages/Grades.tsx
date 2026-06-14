import { Search, Filter, BookOpen, Loader2 } from "lucide-react";
import { useGrades } from "../hooks/useGrades";
import { useAuth } from "../../../contexts/AuthContext";
import { isStudent, normalizeRole } from "../../../utils/permissions";
import { useState, useEffect } from "react";
import { useClasses } from "../../classes/hooks/useClasses";
import { TeacherGradeManagement } from "../../classes/components/TeacherGradeManagement";

export function Grades() {
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const { classes, fetchClasses } = useClasses();
  const { 
    loading, 
    grades, 
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType 
  } = useGrades();

  // Fetch classes when component mounts (for admin/teacher view)
  useEffect(() => {
    if (!isStudent(userRole)) {
      fetchClasses();
    }
  }, [userRole, fetchClasses]);

  // For student view, show their own grades
  if (isStudent(userRole)) {
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
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Đang tải danh sách điểm...</p>
            </div>
          ) : (
            <>
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
                  {grades.map((grade) => (
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

              {grades.length === 0 && (
                <div className="py-20 text-center">
                  <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Không tìm thấy kết quả nào</p>
                </div>
              )}
            </>
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

  // For admin/teacher view, show class selection and grade management
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý điểm</h1>
        <p className="text-muted-foreground">Chọn lớp để xem và chỉnh sửa điểm của sinh viên</p>
      </div>

      {/* Class Selection */}
      {!selectedClassId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-card border border-border rounded-xl p-6 shadow-sm card-hover cursor-pointer"
              onClick={() => setSelectedClassId(cls.id)}
            >
              <h3 className="font-semibold text-lg mb-2">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {cls.semester} • {cls.studentCount || 0} sinh viên
              </p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Xem điểm lớp này
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedClassId(null)}
            className="mb-6 flex items-center gap-2 text-primary hover:underline"
          >
            ← Quay lại danh sách lớp
          </button>
          <TeacherGradeManagement classId={selectedClassId} />
        </div>
      )}
    </div>
  );
}

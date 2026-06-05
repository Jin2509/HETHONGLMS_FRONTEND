import { useEffect, useState } from "react";
import { Save, Download, Search, Loader2 } from "lucide-react";
import { useTeacherGrades } from "../../grades/hooks/useTeacherGrades";
import { toast } from "sonner";

interface TeacherGradeManagementProps {
  classId: number;
}

export function TeacherGradeManagement({ classId }: TeacherGradeManagementProps) {
  const { grades, loading, fetchClassGrades, handleUpdateGrade } = useTeacherGrades(classId);
  const [localGrades, setLocalGrades] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClassGrades();
  }, [fetchClassGrades]);

  useEffect(() => {
    setLocalGrades(grades);
  }, [grades]);

  const handleInputChange = (studentId: number, field: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setLocalGrades(prev => prev.map(g => 
      g.courseId === studentId ? { ...g, [field]: numValue } : g
    ));
  };

  const onSaveGrade = async (studentId: number) => {
    const studentData = localGrades.find(g => g.courseId === studentId);
    if (!studentData) return;

    try {
      setIsSaving(true);
      await handleUpdateGrade({
        studentId: studentData.courseId,
        midterm: studentData.midterm,
        final: studentData.final,
        assignments: studentData.assignments,
        participation: studentData.participation,
      });
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGrades = localGrades.filter(g => 
    g.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 text-sm font-medium">
          <Download className="w-4 h-4" />
          Xuất bảng điểm
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Sinh viên</th>
                <th className="px-4 py-4 text-center">Chuyên cần (10%)</th>
                <th className="px-4 py-4 text-center">Bài tập (20%)</th>
                <th className="px-4 py-4 text-center">Giữa kỳ (30%)</th>
                <th className="px-4 py-4 text-center">Cuối kỳ (40%)</th>
                <th className="px-4 py-4 text-center">Tổng kết</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Đang tải bảng điểm...</p>
                  </td>
                </tr>
              ) : filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy sinh viên nào
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => (
                  <tr key={grade.courseId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{grade.courseName}</td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={grade.participation ?? ""}
                        onChange={(e) => handleInputChange(grade.courseId, "participation", e.target.value)}
                        className="w-16 mx-auto block px-2 py-1 border border-input rounded focus:ring-1 focus:ring-primary outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={grade.assignments ?? ""}
                        onChange={(e) => handleInputChange(grade.courseId, "assignments", e.target.value)}
                        className="w-16 mx-auto block px-2 py-1 border border-input rounded focus:ring-1 focus:ring-primary outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={grade.midterm ?? ""}
                        onChange={(e) => handleInputChange(grade.courseId, "midterm", e.target.value)}
                        className="w-16 mx-auto block px-2 py-1 border border-input rounded focus:ring-1 focus:ring-primary outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={grade.final ?? ""}
                        onChange={(e) => handleInputChange(grade.courseId, "final", e.target.value)}
                        className="w-16 mx-auto block px-2 py-1 border border-input rounded focus:ring-1 focus:ring-primary outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-primary">
                      {grade.gpa?.toFixed(1) || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSaveGrade(grade.courseId)}
                        disabled={isSaving}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Lưu điểm"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

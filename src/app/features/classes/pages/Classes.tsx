import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, BookOpen, User, Plus, FileUp, X, Loader2, Search } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent, normalizeRole } from "../../../utils/permissions";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";
import { useClasses } from "../hooks/useClasses";
import * as XLSX from "xlsx";

export function Classes() {
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role);
  const { classes, loading, students, fetchClasses, fetchAllStudents, handleCreateClass } = useClasses();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    instructorId: user?.id || 0,
    semester: "HK2 2025",
    studentIds: [] as string[],
  });

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreate = () => {
    if (!canManageContent(userRole)) return;
    setFormData({
      name: "",
      instructorId: user?.id || 0,
      semester: "HK2 2025",
      studentIds: [],
    });
    setCurrentStudentId("");
    setStudentSearch("");
    fetchAllStudents();
    setShowCreateModal(true);
  };

  const handleAddStudent = () => {
    if (currentStudentId.trim()) {
      if (formData.studentIds.includes(currentStudentId.trim())) {
        toast.error("Mã sinh viên đã tồn tại trong danh sách");
        return;
      }
      setFormData({
        ...formData,
        studentIds: [...formData.studentIds, currentStudentId.trim()],
      });
      setCurrentStudentId("");
    }
  };

  const handleRemoveStudent = (id: string) => {
    setFormData({
      ...formData,
      studentIds: formData.studentIds.filter((s) => s !== id),
    });
  };

  const getStudentCode = (student: { id?: number; userId?: number; studentId?: string }) => (
    student.studentId || String(student.userId || student.id || "")
  );

  const handleToggleStudent = (student: { id?: number; userId?: number; studentId?: string }) => {
    const code = getStudentCode(student);
    if (!code) return;
    setFormData((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(code)
        ? prev.studentIds.filter((item) => item !== code)
        : [...prev.studentIds, code],
    }));
  };

  const filteredStudents = students.filter((student) => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      String(student.studentId || "").toLowerCase().includes(query)
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { header: 1 });
        const ids = rows
          .flat()
          .map((value) => String(value || "").trim())
          .filter((value) => /^\d{5,}$/.test(value));

        if (ids.length === 0) {
          toast.error("Không tìm thấy mã sinh viên hợp lệ trong file");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          studentIds: Array.from(new Set([...prev.studentIds, ...ids])),
        }));
        toast.success(`Đã thêm ${ids.length} mã sinh viên từ file`);
      } catch {
        toast.error("Không thể đọc file danh sách sinh viên");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveCreate = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên lớp học");
      return;
    }
    try {
      await handleCreateClass({
        name: formData.name,
        instructorId: formData.instructorId,
        semester: formData.semester,
        studentIds: formData.studentIds,
      });
      setShowCreateModal(false);
      fetchClasses();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lớp học</h1>
          <p className="text-muted-foreground">
            Quản lý lớp học và các khóa học bên trong
          </p>
        </div>
        {canManageContent(userRole) && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Tạo lớp học</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Đang tải danh sách lớp học...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              to={`/classes/${cls.id}`}
              className="bg-card border border-border rounded-xl p-6 shadow-sm card-hover block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  {cls.semester}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{cls.name}</h3>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{cls.instructorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{cls.studentCount || 0} sinh viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{cls.courseCount || 0} khóa học</span>
                </div>
              </div>

              <div className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center">
                Xem chi tiết
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo lớp học mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên lớp học *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="VD: Web Development - Class A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Học kỳ *</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="HK1 2024">HK1 2024</option>
              <option value="HK2 2024">HK2 2024</option>
              <option value="HK1 2025">HK1 2025</option>
              <option value="HK2 2025">HK2 2025</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Danh sách sinh viên ({formData.studentIds.length})
            </h4>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={currentStudentId}
                  onChange={(e) => setCurrentStudentId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStudent())}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nhập mã số sinh viên..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddStudent}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Thêm
              </button>
              <label className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2">
                <FileUp className="w-4 h-4" />
                <span>Excel</span>
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="mb-4">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tìm sinh viên theo tên, email hoặc MSSV..."
                />
              </div>
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                {filteredStudents.slice(0, 80).map((student) => {
                  const code = getStudentCode(student);
                  const checked = formData.studentIds.includes(code);
                  return (
                    <label
                      key={student.id || student.userId || code}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleStudent(student)}
                        className="w-4 h-4"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {code || "Chưa có MSSV"} • {student.email}
                        </p>
                      </div>
                    </label>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Không tìm thấy sinh viên phù hợp
                  </div>
                )}
              </div>
            </div>

            {formData.studentIds.length > 0 && (
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg bg-slate-50/50">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {formData.studentIds.map((id) => (
                    <div 
                      key={id} 
                      className="flex items-center justify-between px-3 py-1.5 bg-white border border-border rounded-md text-sm group"
                    >
                      <span className="font-medium text-slate-600">{id}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formData.studentIds.length === 0 && (
              <div className="py-8 text-center border border-dashed border-border rounded-lg bg-slate-50/50">
                <p className="text-sm text-muted-foreground">Chưa có sinh viên nào trong danh sách</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveCreate}
              disabled={!formData.name || loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Tạo lớp học
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

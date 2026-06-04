import { useState } from "react";
import { Link } from "react-router";
import { Users, BookOpen, User, Plus, FileUp, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent } from "../../../utils/permissions";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";

const initialClasses = [
  {
    id: 1,
    name: "Web Development - Class A",
    course: "Web Development",
    instructor: "Dr. Nguyễn Văn B",
    students: 45,
    courses: 3,
    semester: "HK2 2025",
  },
  {
    id: 2,
    name: "Data Structures - Class B",
    course: "Data Structures",
    instructor: "Prof. Trần Thị C",
    students: 38,
    courses: 2,
    semester: "HK2 2025",
  },
  {
    id: 3,
    name: "Database Systems - Class A",
    course: "Database Systems",
    instructor: "Dr. Phạm Thị E",
    students: 42,
    courses: 4,
    semester: "HK2 2025",
  },
];

export function Classes() {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const [classesList, setClassesList] = useState(initialClasses);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    instructor: user?.name || "",
    semester: "HK2 2025",
    studentIds: [] as string[],
  });

  const handleCreate = () => {
    setFormData({
      name: "",
      course: "",
      instructor: user?.name || "",
      semester: "HK2 2025",
      studentIds: [],
    });
    setCurrentStudentId("");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // MOCK: Giả lập đọc file Excel và lấy danh sách MSSV
      toast.info(`Đang xử lý file: ${file.name}`);
      setTimeout(() => {
        const mockIds = ["20210001", "20210002", "20210003", "20210004", "20210005"];
        setFormData((prev) => ({
          ...prev,
          studentIds: Array.from(new Set([...prev.studentIds, ...mockIds])),
        }));
        toast.success(`Đã thêm ${mockIds.length} sinh viên từ file`);
      }, 1000);
    }
  };

  const handleSaveCreate = () => {
    // MOCK: Logic tạo lớp học mới
    const newClass = {
      id: classesList.length + 1,
      name: formData.name,
      course: formData.course,
      instructor: formData.instructor,
      semester: formData.semester,
      students: formData.studentIds.length,
      courses: 0,
    };
    setClassesList([...classesList, newClass]);
    setShowCreateModal(false);
    toast.success("Tạo lớp học thành công", {
      description: `Lớp học "${formData.name}" đã được tạo với ${formData.studentIds.length} sinh viên`,
    });
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesList.map((cls) => (
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
                <span>{cls.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{cls.students} sinh viên</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{cls.courses} khóa học</span>
              </div>
            </div>

            <div className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center">
              Xem chi tiết
            </div>
          </Link>
        ))}
      </div>

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
            <label className="block text-sm font-medium mb-2">Môn học *</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="VD: Web Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giảng viên *</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tên giảng viên"
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
              disabled={!formData.name || !formData.course}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
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

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, FileCheck, Eye, Play, Plus, Pencil, Trash2, Upload, FileText, X, ClipboardCheck, Search, Loader2 } from "lucide-react";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";
import { getVietnamDateInputValue, getVietnamTimeInputValue } from "../../../utils/datetime";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent, canViewAllSubmissions } from "../../../utils/permissions";
import { useExam } from "../hooks/useExam";

export function ExamsList() {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const { 
    exams, 
    loading, 
    fetchExams, 
    createExam, 
    updateExam, 
    deleteExam 
  } = useExam();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "finished">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    date: "",
    startTime: "",
    duration: 60,
    description: "",
    totalPoints: 10,
    attachments: [] as File[],
  });

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const filteredExams = exams.filter((exam) => {
    // Search filter
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (exam.courseName || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Status filter
    if (activeTab === "all") return true;
    if (activeTab === "pending") return exam.status === "upcoming" || exam.status === "active";
    if (activeTab === "finished") return exam.status === "finished";
    return true;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming": return "Sắp diễn ra";
      case "active": return "Đang diễn ra";
      case "finished": return "Đã kết thúc";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-700";
      case "active": return "bg-green-100 text-green-700 animate-pulse";
      case "finished": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      course: "",
      date: getVietnamDateInputValue(),
      startTime: "08:00",
      duration: 60,
      description: "",
      totalPoints: 10,
      attachments: [],
    });
    setShowCreateModal(true);
  };

  const handleEdit = (exam: any, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedExam(exam);
    setFormData({
      name: exam.name,
      course: exam.course,
      date: exam.date,
      startTime: "08:00",
      duration: exam.duration,
      description: "",
      totalPoints: 10,
      attachments: [],
    });
    setShowEditModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({ ...formData, attachments: [...formData.attachments, ...newFiles] });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const handleDelete = (exam: any, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedExam(exam);
    setShowDeleteModal(true);
  };

  const handleSaveCreate = () => {
    // TODO: Gọi API tạo bài kiểm tra
    setShowCreateModal(false);
    toast.success("Tạo bài kiểm tra thành công", {
      description: `Bài kiểm tra "${formData.name}" đã được thêm vào khóa học`,
    });
  };

  const handleSaveEdit = () => {
    // TODO: Gọi API cập nhật bài kiểm tra
    setShowEditModal(false);
    toast.success("Cập nhật thành công", {
      description: "Thông tin bài kiểm tra đã được lưu",
    });
  };

  const handleConfirmDelete = () => {
    // TODO: Gọi API xóa bài kiểm tra
    const examName = selectedExam?.name;
    setShowDeleteModal(false);
    toast.success("Xóa thành công", {
      description: `Bài kiểm tra "${examName}" đã được xóa`,
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bài kiểm tra</h1>
          <p className="text-muted-foreground">Danh sách các bài kiểm tra và kết quả</p>
        </div>
        {canManageContent(userRole) && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Tạo bài kiểm tra</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bài kiểm tra hoặc môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="border-b border-border w-full md:w-auto">
          <div className="flex gap-6">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chưa làm" },
              { key: "finished", label: "Đã làm" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm card-hover relative group"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {canManageContent(userRole) && (
                <>
                  <button
                    onClick={(e) => handleEdit(exam, e)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(exam, e)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{exam.name}</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {exam.courseName || "Khóa học"}
                </span>
              </div>
              {exam.status === "finished" && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">Đã kết thúc</div>
                  <div className="text-xs text-muted-foreground">điểm</div>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(exam.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{exam.duration} phút</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileCheck className="w-4 h-4" />
                <span
                  className={`font-medium ${getStatusColor(exam.status)} px-2 py-0.5 rounded text-xs`}
                >
                  {getStatusLabel(exam.status)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {userRole === 'student' ? (
                // Student: Hiển thị nút làm bài hoặc xem kết quả
                exam.status === "active" ? (
                  <Link
                    to={`/exams/${exam.id}/take`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                    <span className="font-medium">Bắt đầu làm bài</span>
                  </Link>
                ) : exam.status === "finished" ? (
                  <Link
                    to={`/exams/${exam.id}/result`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">Xem kết quả</span>
                  </Link>
                ) : (
                  <div className="flex-1 text-center text-sm text-muted-foreground py-2 bg-slate-50 rounded-lg">
                    Chưa đến giờ thi
                  </div>
                )
              ) : (
                // Admin/Teacher: Hiển thị nút xem danh sách điểm
                <Link
                  to={`/exams/${exam.id}/submissions`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="font-medium">Danh sách điểm</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo bài kiểm tra mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên bài kiểm tra *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tên bài kiểm tra"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Môn học *</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tên môn học"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày thi *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giờ bắt đầu *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng (phút) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="15"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tổng điểm *</label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                step="0.5"
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đề bài (Văn bản)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              placeholder="Nhập đề bài kiểm tra (tự luận)..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đính kèm file đề bài</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-lg hover:border-primary hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Chọn file đề thi hoặc kéo thả vào đây</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveCreate}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Tạo bài kiểm tra
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

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa bài kiểm tra"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên bài kiểm tra *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Môn học *</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày thi *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giờ bắt đầu *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng (phút) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="15"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tổng điểm *</label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                step="0.5"
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đề bài (Văn bản)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
              placeholder="Nhập đề bài kiểm tra (tự luận)..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đính kèm file đề bài</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-lg hover:border-primary hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Chọn file đề thi hoặc kéo thả vào đây</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="flex-1 text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa bài kiểm tra <strong>{selectedExam?.name}</strong>?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Xóa ngay
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
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
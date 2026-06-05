import { useState } from "react";
import { Plus, CheckCircle2, Search } from "lucide-react";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";
import { getVietnamDateInputValue } from "../../../utils/datetime";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent, canSubmitWork, canViewAllSubmissions } from "../../../utils/permissions";
import { AssignmentTable } from "../components/AssignmentTable";
import { AssignmentFormModal } from "../components/AssignmentFormModal";
import type { Assignment, AssignmentFormData } from "../types/assignment.types";
import { useAssignment } from "../hooks/useAssignment";
import { useEffect } from "react";

export function AssignmentListPage() {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const {
    assignments,
    loading,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignment();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>({
    name: "",
    course: "",
    dueDate: "",
    dueTime: "",
    description: "",
    maxScore: 10,
    attachments: [],
  });

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = assignments.filter((assignment) => {
    // Search filter
    const matchesSearch = assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Status filter
    if (activeTab === "all") return true;
    if (activeTab === "pending") return assignment.status === "Chưa nộp" || assignment.status === "pending";
    if (activeTab === "submitted") return assignment.status === "Đã nộp" || assignment.status === "Đang chấm" || assignment.status === "submitted";
    if (activeTab === "graded") return assignment.status === "Đã chấm" || assignment.status === "graded";
    return true;
  });

  const handleCreate = () => {
    setFormData({
      name: "",
      course: "",
      dueDate: getVietnamDateInputValue(),
      dueTime: "23:59",
      description: "",
      maxScore: 10,
      attachments: [],
    });
    setShowCreateModal(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      name: assignment.name,
      course: assignment.course,
      dueDate: assignment.dueDate,
      dueTime: "23:59",
      description: assignment.description || "",
      maxScore: assignment.maxScore || 10,
      attachments: [],
    });
    setShowEditModal(true);
  };

  const handleDelete = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  const handleSaveCreate = async () => {
    try {
      await createAssignment({ ...formData, courseId: 1 }); // MOCK courseId
      setShowCreateModal(false);
      toast.success("Tạo bài tập thành công", {
        description: `Bài tập "${formData.name}" đã được thêm vào khóa học`,
      });
      fetchAssignments();
    } catch (error) {
      toast.error("Không thể tạo bài tập");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedAssignment) return;
    try {
      await updateAssignment(selectedAssignment.id, formData);
      setShowEditModal(false);
      toast.success("Cập nhật thành công", {
        description: "Thông tin bài tập đã được lưu",
      });
      fetchAssignments();
    } catch (error) {
      toast.error("Không thể cập nhật bài tập");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAssignment) return;
    const assignmentName = selectedAssignment.name;
    try {
      await deleteAssignment(selectedAssignment.id);
      setShowDeleteModal(false);
      toast.success("Xóa thành công", {
        description: `Bài tập "${assignmentName}" đã được xóa`,
      });
      fetchAssignments();
    } catch (error) {
      toast.error("Không thể xóa bài tập");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bài tập</h1>
          <p className="text-muted-foreground">
            Quản lý và nộp bài tập của các khóa học
          </p>
        </div>
        {canManageContent(userRole) && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Tạo bài tập</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập hoặc môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="border-b border-border w-full md:w-auto">
          <div className="flex gap-6">
            {[
              { key: "all", label: "Tất cả", count: assignments.length },
              { key: "pending", label: "Chưa nộp", count: assignments.filter((a) => a.status === "Chưa nộp" || a.status === "pending").length },
              { key: "submitted", label: "Đã nộp", count: assignments.filter((a) => a.status === "Đã nộp" || a.status === "Đang chấm" || a.status === "submitted").length },
              { key: "graded", label: "Đã chấm", count: assignments.filter((a) => a.status === "Đã chấm" || a.status === "graded").length },
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

      {/* Assignments Table */}
      <AssignmentTable
        assignments={filteredAssignments}
        userRole={userRole}
        canManageContent={canManageContent(userRole)}
        canSubmitWork={canSubmitWork(userRole)}
        canViewAllSubmissions={canViewAllSubmissions(userRole)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Không có bài tập nào</p>
        </div>
      )}

      {/* Create Modal */}
      <AssignmentFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo bài tập mới"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSaveCreate}
        submitLabel="Tạo bài tập"
      />

      {/* Edit Modal */}
      <AssignmentFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa bài tập"
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSaveEdit}
        submitLabel="Lưu thay đổi"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa bài tập <strong>{selectedAssignment?.name}</strong>?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Xóa
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

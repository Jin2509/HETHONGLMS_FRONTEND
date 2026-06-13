import { Upload, FileText, X } from "lucide-react";
import { Modal } from "../../../components/shared";
import type { AssignmentFormData } from "../types/assignment.types";
import type { Course } from "../../../../service/course.service";

interface AssignmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: AssignmentFormData;
  onFormDataChange: (data: AssignmentFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
  courses: Course[];
}

export function AssignmentFormModal({
  isOpen,
  onClose,
  title,
  formData,
  onFormDataChange,
  onSubmit,
  submitLabel,
  courses,
}: AssignmentFormModalProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onFormDataChange({ ...formData, attachments: [...formData.attachments, ...newFiles] });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, attachments: newAttachments });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tên bài tập *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Nhập tên bài tập"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Môn học *</label>
          <select
            value={formData.courseId || ""}
            onChange={(e) => {
              const courseId = Number(e.target.value);
              const course = courses.find((item) => item.id === courseId);
              onFormDataChange({ ...formData, courseId, course: course?.name || "" });
            }}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="" disabled>Chọn môn học</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ngày hạn nộp *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => onFormDataChange({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giờ hạn nộp *</label>
            <input
              type="time"
              value={formData.dueTime}
              onChange={(e) => onFormDataChange({ ...formData, dueTime: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Đề bài (Văn bản)</label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            placeholder="Nhập đề bài hoặc yêu cầu bài tập..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Đính kèm file đề bài</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-input rounded-lg hover:border-primary hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Chọn file hoặc kéo thả vào đây</span>
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
        <div>
          <label className="block text-sm font-medium mb-2">Điểm tối đa *</label>
          <input
            type="number"
            value={formData.maxScore}
            onChange={(e) => onFormDataChange({ ...formData, maxScore: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            min="0"
            max="10"
            step="0.5"
            placeholder="10"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSubmit}
            disabled={!formData.name.trim() || !formData.courseId || !formData.dueDate || !formData.dueTime || Number.isNaN(formData.maxScore)}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </Modal>
  );
}

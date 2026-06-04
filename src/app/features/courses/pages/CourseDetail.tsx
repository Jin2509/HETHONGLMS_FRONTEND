import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronLeft,
  FileText,
  Download,
  Upload,
  FolderOpen,
  BookOpen,
  Plus,
  Trash2,
  File,
} from "lucide-react";
import { Modal, FileDropzone } from "../../../components/shared";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent } from "../../../utils/permissions";
import { toast } from "sonner";

// Dữ liệu mẫu đã được lọc bỏ phần thông báo không cần thiết
const courseData = {
  id: 1,
  name: "Web Development Fundamentals",
  instructor: "Dr. Nguyễn Văn B",
  chapters: [
    {
      id: 2,
      name: "Slide bài giảng",
      materials: [
        { id: 3, name: "Chương 1: Tổng quan về Web Development", type: "pdf", size: "2.4 MB", date: "2026-02-05" },
        { id: 5, name: "Chương 2: HTML5 & CSS3 Cơ bản", type: "pdf", size: "3.1 MB", date: "2026-02-12" },
        { id: 6, name: "Chương 3: Responsive Design với Tailwind CSS", type: "pdf", size: "4.5 MB", date: "2026-02-19" },
      ],
    },
    {
      id: 3,
      name: "Tài liệu thực hành",
      materials: [
        { id: 7, name: "Bài tập thực hành tuần 1-4", type: "zip", size: "15.2 MB", date: "2026-02-20" },
        { id: 8, name: "Source code mẫu (React + Vite)", type: "zip", size: "1.2 MB", date: "2026-03-01" },
      ],
    },
  ],
};

export function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [materialName, setMaterialFormData] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<number>(courseData.chapters[0].id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const handleUpload = () => {
    setMaterialFormData("");
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleDeleteClick = (material: any) => {
    setSelectedMaterial(material);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Gọi API xóa tài liệu
    toast.success("Xóa thành công", {
      description: `Tài liệu "${selectedMaterial?.name}" đã được xóa khỏi hệ thống`,
    });
    setShowDeleteModal(false);
  };

  const handleSaveUpload = () => {
    // TODO: Gọi API upload tài liệu
    setShowUploadModal(false);
    toast.success("Tải lên thành công", {
      description: `Tài liệu "${materialName}" đã được lưu vào hệ thống`,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "folder":
        return FolderOpen;
      case "pdf":
        return FileText;
      case "zip":
      case "rar":
        return FolderOpen;
      default:
        return File;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <Link 
          to="/classes" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại danh sách lớp học
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{courseData.name}</h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              Giảng viên: <span className="font-semibold text-foreground">{courseData.instructor}</span>
            </p>
          </div>
          
          {canManageContent(userRole) && (
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20"
            >
              <Upload className="w-5 h-5" />
              <span className="font-semibold">Thêm tài liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Nội dung bài giảng & Tài liệu
          </h2>
          <p className="text-sm text-muted-foreground">
            Tổng số: {courseData.chapters.reduce((acc, c) => acc + c.materials.length, 0)} tài liệu
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {courseData.chapters.map((chapter) => (
            <div key={chapter.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 px-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                {chapter.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapter.materials.map((material) => {
                  const Icon = getFileIcon(material.type);
                  return (
                    <div
                      key={material.id}
                      className="group bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {material.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{material.size}</span>
                            <span>•</span>
                            <span>{material.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 rounded-lg text-sm font-medium transition-all"
                          onClick={() => toast.success(`Đang tải xuống: ${material.name}`)}
                        >
                          <Download className="w-4 h-4" />
                          Tải xuống
                        </button>
                        
                        {canManageContent(userRole) && (
                          <button 
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa tài liệu"
                            onClick={() => handleDeleteClick(material)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Thêm tài liệu bài giảng"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên tài liệu *</label>
            <input
              type="text"
              value={materialName}
              onChange={(e) => setMaterialFormData(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="VD: Slide bài giảng chương 4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chương mục *</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="w-full px-4 py-2 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              {courseData.chapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="new">+ Thêm chương mới</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">File bài giảng *</label>
            <FileDropzone
              onFileSelect={(file) => setUploadFile(file)}
              onFileRemove={() => setUploadFile(null)}
              selectedFile={uploadFile}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
              maxSize={100}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveUpload}
              disabled={!materialName || !uploadFile}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Tải lên ngay
            </button>
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-3 border border-input rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa tài liệu"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa tài liệu <strong>{selectedMaterial?.name}</strong>? 
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

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { Modal, FileDropzone } from "../../../components/shared";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageContent } from "../../../utils/permissions";
import { toast } from "sonner";
import { useCourses } from "../hooks/useCourses";

export function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const { courseDetail, loading, fetchCourseDetail, handleCreateChapter, handleUploadMaterial, handleDeleteMaterial } = useCourses();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [materialName, setMaterialFormData] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterName, setNewChapterName] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail(courseId);
    }
  }, [courseId, fetchCourseDetail]);

  useEffect(() => {
    if (courseDetail?.chapters && courseDetail.chapters.length > 0 && selectedChapter === 0) {
      setSelectedChapter(courseDetail.chapters[0].id);
    }
  }, [courseDetail, selectedChapter]);

  const handleUpload = () => {
    setMaterialFormData("");
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleDeleteClick = (material: any) => {
    setSelectedMaterial(material);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMaterial) return;
    await handleDeleteMaterial(courseId, selectedMaterial.id);
    setShowDeleteModal(false);
  };

  const handleSaveUpload = async () => {
    if (!uploadFile || !materialName || !selectedChapter) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    await handleUploadMaterial(courseId, selectedChapter, uploadFile, materialName);
    setShowUploadModal(false);
  };

  const handleAddChapter = async () => {
    if (!newChapterName) return;
    await handleCreateChapter(courseId, newChapterName);
    setNewChapterName("");
    setShowAddChapterModal(false);
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

  if (loading && !courseDetail) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Đang tải nội dung khóa học...</p>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Không tìm thấy khóa học</p>
        <Link to="/classes" className="text-primary hover:underline mt-4 inline-block">
          Quay lại danh sách lớp học
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/classes" className="hover:text-primary transition-colors">Lớp học</Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-foreground font-medium">{courseDetail.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{courseDetail.name}</h1>
              <p className="text-muted-foreground">Giảng viên: <span className="font-medium text-foreground">{courseDetail.instructor}</span></p>
            </div>
          </div>

          {canManageContent(userRole) && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddChapterModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm chương
              </button>
              <button
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-sm shadow-primary/20 font-medium"
              >
                <Upload className="w-4 h-4" />
                Tải lên tài liệu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chapters & Materials */}
      <div className="space-y-6">
        {courseDetail.chapters.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Khóa học này chưa có nội dung</p>
          </div>
        ) : (
          courseDetail.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">{chapter.name}</h3>
                </div>
                <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                  {chapter.materials.length} tài liệu
                </span>
              </div>

              <div className="divide-y divide-border">
                {chapter.materials.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Chưa có tài liệu trong chương này
                  </div>
                ) : (
                  chapter.materials.map((material) => {
                    const Icon = getFileIcon(material.type);
                    return (
                      <div key={material.id} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{material.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground">{material.size}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-xs text-muted-foreground">{material.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Tải về"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {canManageContent(userRole) && (
                            <button
                              onClick={() => handleDeleteClick(material)}
                              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => !loading && setShowUploadModal(false)}
        title="Tải lên tài liệu"
        maxWidth="md"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowUploadModal(false)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveUpload}
              disabled={loading || !uploadFile || !materialName}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Tải lên</span>
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên tài liệu *</label>
            <input
              type="text"
              value={materialName}
              onChange={(e) => setMaterialFormData(e.target.value)}
              placeholder="VD: Slide bài giảng chương 1"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn chương *</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {courseDetail.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tệp tài liệu *</label>
            <FileDropzone
              onFileSelect={(file) => {
                setUploadFile(file);
                if (!materialName) setMaterialFormData(file.name.split(".")[0]);
              }}
              selectedFile={uploadFile}
              onFileRemove={() => setUploadFile(null)}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
              maxSize={50} // 50MB
            />
          </div>
        </div>
      </Modal>

      {/* Add Chapter Modal */}
      <Modal
        isOpen={showAddChapterModal}
        onClose={() => setShowAddChapterModal(false)}
        title="Thêm chương mới"
        maxWidth="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowAddChapterModal(false)}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAddChapter}
              disabled={!newChapterName}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Thêm
            </button>
          </div>
        }
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Tên chương *</label>
          <input
            type="text"
            value={newChapterName}
            onChange={(e) => setNewChapterName(e.target.value)}
            placeholder="VD: Chương 4: React Hooks"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
        maxWidth="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Xóa tài liệu
            </button>
          </div>
        }
      >
        <p className="text-muted-foreground">
          Bạn có chắc chắn muốn xóa tài liệu <span className="font-bold text-foreground">"{selectedMaterial?.name}"</span>? 
          Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
}

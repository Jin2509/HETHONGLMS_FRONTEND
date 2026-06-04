import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  File,
  Upload,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import { FileDropzone } from "../../../components/shared";

const courseData = {
  id: 1,
  name: "Web Development Fundamentals",
  instructor: "Dr. Nguyễn Văn B",
  chapters: [
    {
      id: 1,
      name: "Các thông báo",
      materials: [
        { id: 1, name: "Thông báo khóa học", type: "pdf", size: "245 KB", completed: true },
        { id: 2, name: "Lịch học và lịch thi", type: "pdf", size: "180 KB", completed: true },
      ],
    },
    {
      id: 2,
      name: "Bài giảng",
      materials: [
        { id: 3, name: "1. Slides bài giảng", type: "folder", size: "", completed: false },
        { id: 4, name: "2. Bài tập thực hành", type: "folder", size: "", completed: false },
        { id: 5, name: "3. Danh sách các chủ đề seminar", type: "pdf", size: "77.7 KB", completed: false },
        { id: 6, name: "4. Danh sách các đồ án môn học gợi ý", type: "pdf", size: "120.7 KB", completed: false },
      ],
    },
    {
      id: 3,
      name: "Bài tập",
      materials: [
        { id: 7, name: "Bài thực hành có hướng dẫn tham khảo", type: "folder", size: "", completed: false },
        { id: 8, name: "Bài tập OOP trong Java", type: "pdf", size: "523 KB", completed: false },
        { id: 9, name: "Lab 1, 2 - Làm và nộp bài thực hành tuần 1, tuần 2", type: "pdf", size: "892 KB", completed: false },
      ],
    },
  ],
};

export function CourseDetail() {
  const { id } = useParams();
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(3);
  const [activeTab, setActiveTab] = useState<"materials" | "assignments" | "exams" | "discussions">("materials");
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1, 2, 3]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const allMaterials = courseData.chapters.flatMap((chapter) => chapter.materials);
  const currentMaterial = allMaterials.find((m) => m.id === selectedMaterial);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return FolderOpen;
      case "pdf":
        return FileText;
      default:
        return File;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/courses" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách khóa học
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Material Viewer */}
          <div className="bg-card border border-border rounded-xl shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {currentMaterial && (
                    (() => {
                      const Icon = getFileIcon(currentMaterial.type);
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">
                    {currentMaterial?.name || "Chọn tài liệu để xem"}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{courseData.instructor}</span>
                    {currentMaterial?.size && (
                      <span className="flex items-center gap-1">
                        <File className="w-4 h-4" />
                        {currentMaterial.size}
                      </span>
                    )}
                  </div>
                </div>
                {currentMaterial && currentMaterial.type !== "folder" && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    <Download className="w-4 h-4" />
                    <span>Tải xuống</span>
                  </button>
                )}
              </div>
            </div>

            {currentMaterial ? (
              currentMaterial.type === "folder" ? (
                <div className="p-6">
                  <div className="text-center py-8">
                    <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Thư mục chứa nhiều tài liệu
                    </p>
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                      Xem tất cả tài liệu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Nhấn "Tải xuống" để xem tài liệu
                  </p>
                </div>
              )
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Chọn một tài liệu từ danh sách bên phải
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div>
            <div className="border-b border-border mb-6">
              <div className="flex gap-6">
                {[
                  { key: "materials", label: "Tài liệu", icon: FileText },
                  { key: "assignments", label: "Bài tập", icon: ClipboardCheck },
                  { key: "discussions", label: "Thảo luận", icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`pb-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                      activeTab === tab.key
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "materials" && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Nộp tài liệu
                </h3>
                <FileDropzone
                  onFileSelect={(file) => setUploadFile(file)}
                  onFileRemove={() => setUploadFile(null)}
                  selectedFile={uploadFile}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  maxSize={50}
                />
                {uploadFile && (
                  <button className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    Tải lên tài liệu
                  </button>
                )}
              </div>
            )}
            {activeTab === "assignments" && (
              <div className="space-y-3">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-medium mb-1">Lab 1, 2 - Bài thực hành</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hạn nộp: 5 ngày nữa
                  </p>
                  <Link
                    to="/assignments/1"
                    className="text-sm text-primary hover:underline"
                  >
                    Xem chi tiết và nộp bài →
                  </Link>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="font-medium mb-1">Bài tập OOP</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hạn nộp: 12 ngày nữa
                  </p>
                  <Link
                    to="/assignments/2"
                    className="text-sm text-primary hover:underline"
                  >
                    Xem chi tiết và nộp bài →
                  </Link>
                </div>
              </div>
            )}
            {activeTab === "discussions" && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có thảo luận nào</p>
                <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Tạo thảo luận mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Material List */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Tài liệu khóa học</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {allMaterials.filter((m) => m.completed).length}/{allMaterials.length} đã xem
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {courseData.chapters.map((chapter) => (
                <div key={chapter.id} className="border-b border-border last:border-0">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-sm">{chapter.name}</span>
                    {expandedChapters.includes(chapter.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedChapters.includes(chapter.id) && (
                    <div className="pb-2">
                      {chapter.materials.map((material) => {
                        const Icon = getFileIcon(material.type);
                        return (
                          <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material.id)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                              selectedMaterial === material.id ? "bg-accent" : ""
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {material.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              ) : (
                                <Icon className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium line-clamp-2">
                                {material.name}
                              </p>
                              {material.size && (
                                <p className="text-xs text-muted-foreground">
                                  {material.size}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

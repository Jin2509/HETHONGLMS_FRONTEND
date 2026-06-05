import { useState } from "react";
import { Search, MessageSquare, ThumbsUp, Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";

const initialThreads = [
  {
    id: 1,
    title: "How to optimize React performance?",
    author: "Nguyễn Văn A",
    course: "Web Development",
    content: "I'm working on a large React application and noticing some performance issues. What are the best practices for optimizing React performance? Any tips on useMemo, useCallback, and React.memo would be appreciated!",
    replies: 12,
    likes: 8,
    time: "2 giờ trước",
    unread: true,
  },
  {
    id: 2,
    title: "Best practices for database normalization",
    author: "Trần Thị B",
    course: "Database Systems",
    content: "When designing a complex database schema, how many normal forms should we ideally target? Is 3NF enough for most production applications or should we aim higher?",
    replies: 5,
    likes: 3,
    time: "5 giờ trước",
    unread: false,
  },
  {
    id: 3,
    title: "Understanding Big O notation",
    author: "Lê Văn C",
    course: "Data Structures",
    content: "Can someone explain the practical difference between O(n log n) and O(n) in real-world scenarios with large datasets? I'm trying to optimize my sorting algorithm.",
    replies: 18,
    likes: 15,
    time: "1 ngày trước",
    unread: false,
  },
];

export function Discussions() {
  const [filter, setFilter] = useState<"all" | "unread" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [threadsList, setThreadsList] = useState(initialThreads);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(initialThreads[0]);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    content: "",
  });
  const [replyContent, setReplyContent] = useState("");

  const filteredThreads = threadsList.filter((thread) => {
    // Search filter
    const matchesSearch = 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      thread.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter
    if (filter === "unread") return thread.unread;
    if (filter === "mine") return thread.author === "Admin"; // Giả lập "Của tôi" cho Admin
    return true;
  });

  const handleCreate = () => {
    setFormData({ title: "", course: "", content: "" });
    setShowCreateModal(true);
  };

  const handleReply = () => {
    setReplyContent("");
    setShowReplyModal(true);
  };

  const handleEdit = (thread: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedThread(thread);
    setFormData({
      title: thread.title,
      course: thread.course,
      content: thread.content || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (thread: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedThread(thread);
    setShowDeleteModal(true);
  };

  const handleSaveCreate = () => {
    const newThread = {
      id: threadsList.length + 1,
      title: formData.title,
      course: formData.course,
      content: formData.content,
      author: "Admin", // Giả lập người tạo là Admin
      replies: 0,
      likes: 0,
      time: "Vừa xong",
      unread: false,
    };
    setThreadsList([newThread, ...threadsList]);
    setSelectedThread(newThread);
    setShowCreateModal(false);
    toast.success("Tạo thảo luận thành công", {
      description: `Chủ đề "${formData.title}" đã được tạo`,
    });
  };

  const handleSaveEdit = () => {
    setThreadsList(threadsList.map(t => 
      t.id === selectedThread.id 
        ? { ...t, title: formData.title, course: formData.course, content: formData.content }
        : t
    ));
    // Cập nhật lại thread đang hiển thị ở bên phải
    setSelectedThread({ 
      ...selectedThread, 
      title: formData.title, 
      course: formData.course, 
      content: formData.content 
    });
    setShowEditModal(false);
    toast.success("Cập nhật thành công", {
      description: "Thông tin thảo luận đã được lưu",
    });
  };

  const handleConfirmDelete = () => {
    const threadTitle = selectedThread?.title;
    const newThreads = threadsList.filter(t => t.id !== selectedThread.id);
    setThreadsList(newThreads);
    
    // Nếu xóa thread đang chọn, chuyển sang thread đầu tiên còn lại
    if (newThreads.length > 0) {
      setSelectedThread(newThreads[0]);
    } else {
      setSelectedThread(null);
    }
    
    setShowDeleteModal(false);
    toast.success("Xóa thành công", {
      description: `Thảo luận "${threadTitle}" đã được xóa`,
    });
  };

  const handleSaveReply = () => {
    // MOCK: Tăng số lượng trả lời
    setThreadsList(threadsList.map(t => 
      t.id === selectedThread.id ? { ...t, replies: t.replies + 1 } : t
    ));
    setSelectedThread({ ...selectedThread, replies: selectedThread.replies + 1 });
    
    setShowReplyModal(false);
    toast.success("Gửi phản hồi thành công", {
      description: "Câu trả lời của bạn đã được thêm vào thảo luận",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Thảo luận</h1>
          <p className="text-muted-foreground">Trao đổi và học hỏi cùng cộng đồng</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Tạo thảo luận</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2">
            {["all", "unread", "mine"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-left transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-input hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Của tôi"}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`relative group ${selectedThread?.id === thread.id ? "bg-slate-50" : ""}`}
              >
                <button
                  onClick={() => setSelectedThread(thread)}
                  className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {thread.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 line-clamp-2">{thread.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {thread.course}
                        </span>
                        <span>{thread.time}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {thread.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEdit(thread, e)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="w-3 h-3 text-slate-700" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(thread, e)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedThread ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedThread.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{selectedThread.author}</span>
                    <span>•</span>
                    <span>{selectedThread.time}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {selectedThread.course}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleReply}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  <span>Trả lời</span>
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-muted-foreground">
                  {selectedThread.content || "Không có nội dung thảo luận."}
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">{selectedThread.replies} trả lời</h3>
                <div className="space-y-4">
                  {selectedThread.id === 1 && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                            GV
                          </div>
                          <div>
                            <p className="font-medium text-sm">Dr. Nguyễn Văn B</p>
                            <p className="text-xs text-muted-foreground">Giảng viên</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">1 giờ trước</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great question! Here are some key optimization techniques: 1) Use React.memo
                        for components that render often with same props, 2) useCallback for function
                        references, 3) useMemo for expensive calculations...
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <ThumbsUp className="w-3 h-3" />
                          <span>5</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedThread.replies === 0 && (
                    <div className="py-8 text-center text-muted-foreground italic">
                      Chưa có phản hồi nào cho thảo luận này.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Chọn một thảo luận để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo thảo luận mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tiêu đề thảo luận"
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
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={6}
              placeholder="Nhập nội dung thảo luận của bạn..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveCreate}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Tạo thảo luận
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
        title="Chỉnh sửa thảo luận"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={6}
              placeholder="Cập nhật nội dung thảo luận..."
            />
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
            Bạn có chắc chắn muốn xóa thảo luận <strong>{selectedThread?.title}</strong>?
            Hành động này sẽ xóa toàn bộ thảo luận và tất cả các trả lời.
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

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title="Trả lời thảo luận"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-border">
            <h4 className="text-sm font-semibold mb-1">Đang trả lời:</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{selectedThread?.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung câu trả lời *</label>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={6}
              placeholder="Nhập nội dung phản hồi của bạn..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveReply}
              disabled={!replyContent.trim()}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi trả lời
            </button>
            <button
              onClick={() => setShowReplyModal(false)}
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

import { useState, useEffect } from "react";
import { Search, MessageSquare, ThumbsUp, Plus, Pencil, Trash2, Loader2, User } from "lucide-react";
import { Modal } from "../../../components/shared";
import { toast } from "sonner";
import { useDiscussion } from "../hooks/useDiscussion";
import { useAuth } from "../../../contexts/AuthContext";

export function Discussions() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    discussions,
    discussionDetail,
    loading,
    fetchDiscussions,
    fetchDiscussionDetail,
    createNewDiscussion,
    updateExistingDiscussion,
    removeDiscussion,
    addReply,
    toggleLikeDiscussion,
  } = useDiscussion();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    courseId: 1, // MOCK default courseId
    content: "",
  });
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchDiscussions({ filter, query: searchQuery });
  }, [fetchDiscussions, filter, searchQuery]);

  useEffect(() => {
    if (discussions.length > 0 && !selectedThread) {
      setSelectedThread(discussions[0]);
    }
  }, [discussions, selectedThread]);

  useEffect(() => {
    if (selectedThread?.id) {
      fetchDiscussionDetail(selectedThread.id);
    }
  }, [selectedThread?.id, fetchDiscussionDetail]);

  const handleCreate = () => {
    setFormData({ title: "", courseId: 1, content: "" });
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
      courseId: thread.courseId || 1,
      content: thread.content || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = (thread: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedThread(thread);
    setShowDeleteModal(true);
  };

  const handleSaveCreate = async () => {
    try {
      await createNewDiscussion(formData);
      setShowCreateModal(false);
      toast.success("Tạo thảo luận thành công");
    } catch (error) {
      toast.error("Không thể tạo thảo luận");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedThread) return;
    try {
      await updateExistingDiscussion(selectedThread.id, formData);
      setShowEditModal(false);
      toast.success("Cập nhật thành công");
    } catch (error) {
      toast.error("Không thể cập nhật thảo luận");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedThread) return;
    try {
      await removeDiscussion(selectedThread.id);
      setSelectedThread(null);
      setShowDeleteModal(false);
      toast.success("Xóa thành công");
    } catch (error) {
      toast.error("Không thể xóa thảo luận");
    }
  };

  const handleSaveReply = async () => {
    if (!selectedThread) return;
    try {
      await addReply(selectedThread.id, { content: replyContent });
      setShowReplyModal(false);
      toast.success("Gửi phản hồi thành công");
    } catch (error) {
      toast.error("Không thể gửi phản hồi");
    }
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await toggleLikeDiscussion(id);
    // Real implementation would refresh or update local state
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

          <div className="bg-card border border-border rounded-xl divide-y divide-border min-h-[200px] flex flex-col">
            {loading && discussions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : discussions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
                <p>Không tìm thấy thảo luận nào.</p>
              </div>
            ) : (
              discussions.map((thread) => (
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
                            {thread.courseName || "Khóa học"}
                          </span>
                          <span>{thread.time}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {thread.repliesCount}
                          </span>
                          <span 
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                            onClick={(e) => handleLike(e, thread.id)}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {thread.likesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                  {user?.role === "admin" && (
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
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedThread ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedThread.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{selectedThread.authorName}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedThread.time}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {selectedThread.courseName || "Khóa học"}
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
                  {discussionDetail?.content || "Không có nội dung thảo luận."}
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">{discussionDetail?.repliesCount || 0} trả lời</h3>
                <div className="space-y-4">
                  {discussionDetail?.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                            {(reply.authorName || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{reply.authorName}</p>
                            <p className="text-xs text-muted-foreground">{reply.authorRole || "Thành viên"}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{reply.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reply.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{reply.likesCount}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {discussionDetail?.replies.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground italic">
                      Chưa có phản hồi nào cho thảo luận này.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
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
            <label className="block text-sm font-medium mb-2">ID Môn học *</label>
            <input
              type="number"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập ID môn học"
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            <label className="block text-sm font-medium mb-2">ID Môn học *</label>
            <input
              type="number"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) || 1 })}
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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
              disabled={!replyContent.trim() || loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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

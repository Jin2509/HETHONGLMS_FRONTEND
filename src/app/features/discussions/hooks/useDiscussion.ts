import { useState, useCallback } from "react";
import * as discussionService from "../../../../service/discussion.service";
import type { 
  Discussion, 
  DiscussionReply, 
  CreateDiscussionData, 
  CreateReplyData 
} from "../../../../service/discussion.service";

export function useDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussionDetail, setDiscussionDetail] = useState<(Discussion & { replies: DiscussionReply[] }) | null>(null);

  const fetchDiscussions = useCallback(async (params?: { filter?: string; query?: string; courseId?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await discussionService.getDiscussions(params);
      setDiscussions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách thảo luận");
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscussionDetail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await discussionService.getDiscussionDetail(id);
      setDiscussionDetail(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải chi tiết thảo luận");
      setDiscussionDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewDiscussion = async (data: CreateDiscussionData) => {
    setLoading(true);
    setError(null);
    try {
      const newDiscussion = await discussionService.createDiscussion(data);
      setDiscussions(prev => [newDiscussion, ...prev]);
      return newDiscussion;
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tạo thảo luận");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingDiscussion = async (id: number, data: Partial<CreateDiscussionData>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await discussionService.updateDiscussion(id, data);
      setDiscussions(prev => prev.map(d => d.id === id ? updated : d));
      if (discussionDetail?.id === id) {
        setDiscussionDetail({ ...discussionDetail, ...updated });
      }
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật thảo luận");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDiscussion = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await discussionService.deleteDiscussion(id);
      setDiscussions(prev => prev.filter(d => d.id !== id));
      if (discussionDetail?.id === id) {
        setDiscussionDetail(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa thảo luận");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (discussionId: number, data: CreateReplyData) => {
    setLoading(true);
    setError(null);
    try {
      const newReply = await discussionService.replyToDiscussion(discussionId, data);
      if (discussionDetail?.id === discussionId) {
        setDiscussionDetail({
          ...discussionDetail,
          replies: [...discussionDetail.replies, newReply],
          repliesCount: discussionDetail.repliesCount + 1
        });
      }
      return newReply;
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể gửi phản hồi");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeDiscussion = async (id: number) => {
    try {
      await discussionService.likeDiscussion(id);
      // In a real app, you might want to fetch the updated count or handle optimistic UI
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thực hiện like");
    }
  };

  const toggleLikeReply = async (discussionId: number, replyId: number) => {
    try {
      await discussionService.likeReply(discussionId, replyId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thực hiện like");
    }
  };

  return {
    discussions,
    discussionDetail,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussionDetail,
    createNewDiscussion,
    updateExistingDiscussion,
    removeDiscussion,
    addReply,
    toggleLikeDiscussion,
    toggleLikeReply
  };
}

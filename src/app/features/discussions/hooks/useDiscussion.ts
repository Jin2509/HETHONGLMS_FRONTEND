import { useState, useCallback } from "react";
import * as discussionService from "../../../../service/discussion.service";
import type {
  Discussion,
  DiscussionReply,
  CreateDiscussionData,
  CreateReplyData,
} from "../../../../service/discussion.service";

export function useDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussionDetail, setDiscussionDetail] = useState<
    (Discussion & { replies: DiscussionReply[] }) | null
  >(null);

  const fetchDiscussions = useCallback(
    async (params?: { filter?: string; query?: string; courseId?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await discussionService.getDiscussions(params);
        setDiscussions(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách thảo luận",
        );
        setDiscussions([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchDiscussionDetail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await discussionService.getDiscussionDetail(id);
      setDiscussionDetail(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải chi tiết thảo luận",
      );
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
      setDiscussions((prev) => [newDiscussion, ...prev]);
      return newDiscussion;
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tạo thảo luận");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingDiscussion = async (
    id: number,
    data: Partial<CreateDiscussionData>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await discussionService.updateDiscussion(id, data);
      setDiscussions((prev) => prev.map((d) => (d.id === id ? updated : d)));
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
      setDiscussions((prev) => prev.filter((d) => d.id !== id));
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
      const newReply = await discussionService.replyToDiscussion(
        discussionId,
        data,
      );

      // 1. Cập nhật state chi tiết thảo luận hiện tại
      if (discussionDetail?.id === discussionId) {
        setDiscussionDetail({
          ...discussionDetail,
          replies: [...discussionDetail.replies, newReply],
          repliesCount: (discussionDetail.repliesCount || 0) + 1,
        });
      }

      // 2. Đồng bộ số lượng phản hồi tăng lên 1 ở danh sách tổng bên ngoài
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId
            ? { ...d, repliesCount: (d.repliesCount || 0) + 1 }
            : d,
        ),
      );

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
      // Cập nhật UI tạm thời (Optimistic UI) cho lượt thích của Discussion
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, likesCount: d.likesCount + 1 } : d,
        ),
      );
      if (discussionDetail?.id === id) {
        setDiscussionDetail((prev) =>
          prev ? { ...prev, likesCount: prev.likesCount + 1 } : null,
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thực hiện like");
    }
  };

  const toggleLikeReply = async (discussionId: number, replyId: number) => {
    try {
      await discussionService.likeReply(discussionId, replyId);
      if (discussionDetail?.id === discussionId) {
        setDiscussionDetail({
          ...discussionDetail,
          replies: discussionDetail.replies.map((r) =>
            r.id === replyId
              ? { ...r, likesCount: (r.likesCount || 0) + 1 }
              : r,
          ),
        });
      }
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
    toggleLikeReply,
  };
}

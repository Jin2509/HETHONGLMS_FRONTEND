import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { unwrapArray, unwrapData, type ApiResponse } from "./api-response";

export interface Discussion {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  courseId: number;
  courseName?: string;
  repliesCount: number;
  likesCount: number;
  time: string;
  unread?: boolean;
  content?: string;
}

export interface DiscussionReply {
  id: number;
  authorId: number;
  authorName: string;
  authorRole?: string;
  content: string;
  likesCount: number;
  time: string;
  createdAt: string;
}

export interface CreateDiscussionData {
  courseId: number;
  title: string;
  content: string;
}

export interface CreateReplyData {
  content: string;
}

type RawDiscussion = Partial<Discussion> & {
  createdAt?: string;
  author?: { id?: number; name?: string };
  course?: { id?: number; name?: string };
};

type RawDiscussionReply = Partial<DiscussionReply> & {
  author?: { id?: number; name?: string; role?: string };
};

function normalizeReply(reply: RawDiscussionReply): DiscussionReply {
  return {
    id: Number(reply.id || 0),
    authorId: Number(reply.authorId || reply.author?.id || 0),
    authorName: reply.authorName || reply.author?.name || "Người dùng",
    authorRole: reply.authorRole || reply.author?.role,
    content: reply.content || "",
    likesCount: Number(reply.likesCount || 0),
    time: reply.time || reply.createdAt || "",
    createdAt: reply.createdAt || reply.time || "",
  };
}

function normalizeDiscussion(discussion: RawDiscussion): Discussion {
  return {
    id: Number(discussion.id || 0),
    title: discussion.title || "",
    authorId: Number(discussion.authorId || discussion.author?.id || 0),
    authorName: discussion.authorName || discussion.author?.name || "Người dùng",
    courseId: Number(discussion.courseId || discussion.course?.id || 0),
    courseName: discussion.courseName || discussion.course?.name,
    repliesCount: Number(discussion.repliesCount || 0),
    likesCount: Number(discussion.likesCount || 0),
    time: discussion.time || discussion.createdAt || "",
    unread: discussion.unread,
    content: discussion.content || "",
  };
}

export async function getDiscussions(params?: {
  filter?: string;
  query?: string;
  courseId?: number;
}): Promise<Discussion[]> {
  const response = await apiClient.get<unknown>(ENDPOINTS.DISCUSSIONS.LIST, { params });
  return unwrapArray<RawDiscussion>(response.data).map(normalizeDiscussion);
}

export async function getDiscussionDetail(
  id: number
): Promise<Discussion & { replies: DiscussionReply[] }> {
  const response = await apiClient.get<unknown>(ENDPOINTS.DISCUSSIONS.DETAIL(id));
  const detail = unwrapData<RawDiscussion & { replies?: RawDiscussionReply[] }>(response.data);
  return {
    ...normalizeDiscussion(detail),
    replies: (detail.replies || []).map(normalizeReply),
  };
}

export async function createDiscussion(data: CreateDiscussionData): Promise<Discussion> {
  const response = await apiClient.post<ApiResponse<Discussion>>(ENDPOINTS.DISCUSSIONS.CREATE, data);
  return normalizeDiscussion(unwrapData<Discussion>(response.data));
}

export async function updateDiscussion(
  id: number,
  data: Partial<CreateDiscussionData>
): Promise<Discussion> {
  const response = await apiClient.patch<ApiResponse<Discussion>>(ENDPOINTS.DISCUSSIONS.UPDATE(id), data);
  return normalizeDiscussion(unwrapData<Discussion>(response.data));
}

export async function deleteDiscussion(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.DISCUSSIONS.DELETE(id));
}

export async function replyToDiscussion(
  discussionId: number,
  data: CreateReplyData
): Promise<DiscussionReply> {
  const response = await apiClient.post<ApiResponse<DiscussionReply>>(
    ENDPOINTS.DISCUSSIONS.REPLIES(discussionId),
    data
  );
  return normalizeReply(unwrapData<DiscussionReply>(response.data));
}

export async function likeDiscussion(id: number): Promise<void> {
  await apiClient.post(ENDPOINTS.DISCUSSIONS.LIKE(id));
}

export async function likeReply(discussionId: number, replyId: number): Promise<void> {
  await apiClient.post(`${ENDPOINTS.DISCUSSIONS.REPLIES(discussionId)}/${replyId}/like`);
}

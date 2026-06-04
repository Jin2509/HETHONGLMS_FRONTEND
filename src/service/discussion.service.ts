import apiClient from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

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

export async function getDiscussions(params?: {
  filter?: string;
  query?: string;
  courseId?: number;
}): Promise<Discussion[]> {
  // TODO: connect to real API
  const response = await apiClient.get<Discussion[]>(ENDPOINTS.DISCUSSIONS.LIST, { params });
  return response.data;
}

export async function getDiscussionDetail(
  id: number
): Promise<Discussion & { replies: DiscussionReply[] }> {
  // TODO: connect to real API
  const response = await apiClient.get(ENDPOINTS.DISCUSSIONS.DETAIL(id));
  return response.data;
}

export async function createDiscussion(data: CreateDiscussionData): Promise<Discussion> {
  // TODO: connect to real API
  const response = await apiClient.post<Discussion>(ENDPOINTS.DISCUSSIONS.CREATE, data);
  return response.data;
}

export async function updateDiscussion(
  id: number,
  data: Partial<CreateDiscussionData>
): Promise<Discussion> {
  // TODO: connect to real API
  const response = await apiClient.patch<Discussion>(ENDPOINTS.DISCUSSIONS.UPDATE(id), data);
  return response.data;
}

export async function deleteDiscussion(id: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.delete(ENDPOINTS.DISCUSSIONS.DELETE(id));
}

export async function replyToDiscussion(
  discussionId: number,
  data: CreateReplyData
): Promise<DiscussionReply> {
  // TODO: connect to real API
  const response = await apiClient.post<DiscussionReply>(
    ENDPOINTS.DISCUSSIONS.REPLIES(discussionId),
    data
  );
  return response.data;
}

export async function likeDiscussion(id: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.post(ENDPOINTS.DISCUSSIONS.LIKE(id));
}

export async function likeReply(discussionId: number, replyId: number): Promise<void> {
  // TODO: connect to real API
  await apiClient.post(`${ENDPOINTS.DISCUSSIONS.REPLIES(discussionId)}/${replyId}/like`);
}

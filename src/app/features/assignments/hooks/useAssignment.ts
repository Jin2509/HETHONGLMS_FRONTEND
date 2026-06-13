import { useState, useCallback, useEffect } from "react";
import type { 
  GradeState, 
  FeedbackState, 
  Submission, 
  Assignment, 
  AssignmentDetail,
  AssignmentFormData 
} from "../types/assignment.types";
import * as assignmentService from "../../../../service/assignment.service";

export function useAssignment(initialSubmissions: Submission[] = []) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentDetail, setAssignmentDetail] = useState<AssignmentDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const [grades, setGrades] = useState<GradeState>({});

  const [feedbacks, setFeedbacks] = useState<FeedbackState>({});

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    if (initialSubmissions.length > 0) {
      setSubmissions(initialSubmissions);
      setGrades(initialSubmissions.reduce((acc: GradeState, s: Submission) => ({ ...acc, [s.id]: s.grade }), {}));
      setFeedbacks(initialSubmissions.reduce((acc: FeedbackState, s: Submission) => ({ ...acc, [s.id]: s.feedback || "" }), {}));
    }
  }, [initialSubmissions]);

  // API calls
  const fetchAssignments = useCallback(async (params?: { status?: string; courseId?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAssignments(params);
      setAssignments(data as unknown as Assignment[]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách bài tập");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignmentDetail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAssignmentDetail(id);
      setAssignmentDetail(data as unknown as AssignmentDetail);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin bài tập");
      setAssignmentDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async (assignmentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getSubmissions(assignmentId);
      const typedData = data as unknown as Submission[];
      setSubmissions(typedData);
      setGrades(typedData.reduce((acc: GradeState, s: Submission) => ({ ...acc, [s.id]: s.grade }), {}));
      setFeedbacks(typedData.reduce((acc: FeedbackState, s: Submission) => ({ ...acc, [s.id]: s.feedback || "" }), {}));
    } catch {
      setError("Không thể tải danh sách bài nộp");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = async (data: AssignmentFormData & { courseId: number }) => {
    setLoading(true);
    setError(null);
    try {
      return await assignmentService.createAssignment(data);
    } catch {
      setError("Không thể tạo bài tập");
      throw new Error("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: number, data: Partial<AssignmentFormData>) => {
    setLoading(true);
    setError(null);
    try {
      return await assignmentService.updateAssignment(id, data);
    } catch {
      setError("Không thể cập nhật bài tập");
      throw new Error("Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await assignmentService.deleteAssignment(id);
    } catch {
      setError("Không thể xóa bài tập");
      throw new Error("Failed to delete assignment");
    } finally {
      setLoading(false);
    }
  };

  const submitAssignmentWork = async (assignmentId: number, data: { file: File; note?: string; studentId: number }) => {
    setLoading(true);
    setError(null);
    try {
      await assignmentService.submitAssignment(assignmentId, data);
    } catch {
      setError("Không thể nộp bài tập");
      throw new Error("Failed to submit assignment");
    } finally {
      setLoading(false);
    }
  };

  const saveGrades = async (assignmentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const promises = Object.keys(grades).map((submissionId) => {
        const id = parseInt(submissionId);
        return assignmentService.gradeSubmission(assignmentId, {
          submissionId: id,
          grade: grades[id] ?? null,
          feedback: feedbacks[id],
        });
      });
      await Promise.all(promises);
    } catch {
      setError("Không thể lưu điểm");
      throw new Error("Failed to save grades");
    } finally {
      setLoading(false);
    }
  };

  // UI state handlers
  const updateGrade = (submissionId: number, grade: number | null) => {
    setGrades((prev) => ({ ...prev, [submissionId]: grade }));
  };

  const updateFeedback = (submissionId: number, feedback: string) => {
    setFeedbacks((prev) => ({ ...prev, [submissionId]: feedback }));
  };

  const toggleExpandedRow = (submissionId: number) => {
    setExpandedRow((prev) => (prev === submissionId ? null : submissionId));
  };

  return {
    // Data
    assignments,
    assignmentDetail,
    submissions,
    // State
    loading,
    error,
    grades,
    feedbacks,
    expandedRow,
    // API methods
    fetchAssignments,
    fetchAssignmentDetail,
    fetchSubmissions,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignmentWork,
    saveGrades,
    // UI handlers
    updateGrade,
    updateFeedback,
    toggleExpandedRow,
  };
}

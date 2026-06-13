import { useState, useCallback } from "react";
import * as examService from "../../../../service/exam.service";
import type { 
  Exam, 
  ExamQuestion, 
  ExamSubmission, 
  ExamResult,
  ExamPayload
} from "../../../../service/exam.service";

export function useExam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDetail, setExamDetail] = useState<(Exam & { questions: ExamQuestion[] }) | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const fetchExams = useCallback(async (params?: { courseId?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await examService.getExams(params);
      setExams(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách bài kiểm tra");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExamDetail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await examService.getExamDetail(id);
      setExamDetail(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải thông tin bài kiểm tra");
      setExamDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubmissions = useCallback(async (examId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await examService.getExamSubmissions(examId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách bài nộp");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExamResult = useCallback(async (examId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await examService.getExamResult(examId);
      setExamResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải kết quả bài kiểm tra");
      setExamResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExam = async (data: ExamPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await examService.createExam(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tạo bài kiểm tra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (id: number, data: ExamPayload) => {
    setLoading(true);
    setError(null);
    try {
      return await examService.updateExam(id, data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể cập nhật bài kiểm tra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await examService.deleteExam(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa bài kiểm tra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitExamAnswers = async (id: number, answers: Record<number, number | number[]>) => {
    setLoading(true);
    setError(null);
    try {
      await examService.submitExam(id, answers);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể nộp bài kiểm tra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (examId: number, submissionId: number, grade: number | null, feedback?: string) => {
    setLoading(true);
    setError(null);
    try {
      await examService.gradeExamSubmission(examId, { submissionId, grade, feedback });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể chấm điểm bài nộp");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    exams,
    examDetail,
    submissions,
    examResult,
    loading,
    error,
    fetchExams,
    fetchExamDetail,
    fetchSubmissions,
    fetchExamResult,
    createExam,
    updateExam,
    deleteExam,
    submitExamAnswers,
    gradeSubmission
  };
}

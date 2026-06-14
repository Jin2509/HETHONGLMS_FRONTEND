import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Download, Eye, Save, FileText, Calendar, Users, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { canGradeSubmissions, normalizeRole } from "../../../utils/permissions";
import { toast } from "sonner";
import { useExam } from "../hooks/useExam";
import { downloadExamSubmissionFile, type ExamSubmission } from "../../../../service/exam.service";

export function ExamSubmissions() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role);
  const { 
    examDetail, 
    submissions, 
    loading, 
    fetchExamDetail, 
    fetchSubmissions, 
    gradeSubmission 
  } = useExam();

  const [grades, setGrades] = useState<{ [key: number]: number | null }>({});
  const [feedbacks, setFeedbacks] = useState<{ [key: number]: string }>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const examId = parseInt(id);
      fetchExamDetail(examId);
      fetchSubmissions(examId);
    }
  }, [id, fetchExamDetail, fetchSubmissions]);

  useEffect(() => {
    if (submissions.length > 0) {
      setGrades(submissions.reduce((acc, s) => ({ ...acc, [s.id]: s.grade }), {}));
      setFeedbacks(submissions.reduce((acc, s) => ({ ...acc, [s.id]: s.feedback || "" }), {}));
    }
  }, [submissions]);

  const handleSaveGrades = async () => {
    if (!canGradeSubmissions(userRole)) {
      toast.error("Không có quyền", {
        description: "Chỉ giáo viên mới có thể chấm điểm",
      });
      return;
    }

    if (!id) return;
    const invalidSubmission = submissions.find((submission) => {
      const grade = grades[submission.id];
      return grade !== null && grade !== undefined && (Number.isNaN(grade) || grade < 0 || grade > examDetail.totalPoints);
    });
    if (invalidSubmission) {
      toast.error("Điểm không hợp lệ", {
        description: `Điểm phải nằm trong khoảng 0-${examDetail.totalPoints}`,
      });
      return;
    }

    try {
      const examId = parseInt(id);
      const promises = Object.keys(grades).map((subId) => {
        const submissionId = parseInt(subId);
        return gradeSubmission(examId, submissionId, grades[submissionId], feedbacks[submissionId]);
      });
      await Promise.all(promises);
      toast.success("Lưu điểm thành công", {
        description: "Điểm đã được cập nhật cho sinh viên",
      });
      fetchSubmissions(examId); // Refresh data
    } catch (error) {
      toast.error("Không thể lưu điểm. Vui lòng thử lại.");
    }
  };

  const handleDownloadSubmission = async (submission: ExamSubmission) => {
    if (!id) return;
    try {
      await downloadExamSubmissionFile(parseInt(id), submission);
    } catch {
      toast.error("Không thể tải file bài làm");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
      case "Đã nộp":
        return "bg-warning/10 text-warning";
      case "graded":
      case "Đã chấm":
        return "bg-success/10 text-success";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted": return "Đã nộp";
      case "graded": return "Đã chấm";
      case "pending": return "Chưa nộp";
      default: return status;
    }
  };

  if (loading && !examDetail) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Đang tải danh sách bài nộp...</p>
      </div>
    );
  }

  if (!examDetail) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">Không tìm thấy thông tin đề thi.</p>
        <Link to="/exams" className="text-primary hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/exams" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách bài kiểm tra
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{examDetail.name}</h1>
        <p className="text-muted-foreground mb-4">Danh sách bài nộp và chấm điểm</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng số bài nộp</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã chấm</p>
                <p className="text-2xl font-bold text-success">{gradedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chưa chấm</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày thi</p>
                <p className="text-lg font-semibold">{new Date(examDetail.date).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  MSSV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Thời gian nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  File bài làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((submission) => (
                <Fragment key={submission.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{submission.studentName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {submission.studentCode || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                        {getStatusLabel(submission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {submission.fileUrl ? (
                        <button
                          onClick={() => handleDownloadSubmission(submission)}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Tải file</span>
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Trắc nghiệm</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {canGradeSubmissions(userRole) ? (
                        <input
                          type="number"
                          min="0"
                          max={examDetail.totalPoints}
                          step="0.5"
                          value={grades[submission.id] ?? ""}
                          onChange={(e) =>
                            setGrades({ ...grades, [submission.id]: e.target.value === "" ? null : Number(e.target.value) })
                          }
                          className="w-20 px-3 py-1.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder={`0-${examDetail.totalPoints}`}
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {submission.grade !== null ? `${submission.grade}/${examDetail.totalPoints}` : "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setExpandedRow(expandedRow === submission.id ? null : submission.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Row for Feedback */}
                  {expandedRow === submission.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">Nhận xét của giảng viên</label>
                            {canGradeSubmissions(userRole) ? (
                              <textarea
                                value={feedbacks[submission.id] || ""}
                                onChange={(e) =>
                                  setFeedbacks({ ...feedbacks, [submission.id]: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                rows={3}
                                placeholder="Nhập nhận xét cho sinh viên..."
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {submission.feedback || "Chưa có nhận xét"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    Chưa có bài nộp nào cho đề thi này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button - Only for Teachers */}
      {canGradeSubmissions(userRole) && submissions.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveGrades}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/20 font-semibold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu tất cả thay đổi
          </button>
        </div>
      )}
    </div>
  );
}

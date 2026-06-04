import { useState, Fragment } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Download, Eye, Save, FileText, Calendar, Users, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { canGradeSubmissions } from "../../../utils/permissions";
import { toast } from "sonner";

const submissions = [
  { id: 1, studentName: "Nguyễn Văn A", studentId: "SV001", submittedAt: "10/06/2026 08:45", file: "exam-1.pdf", grade: null, feedback: "", status: "Đã nộp" },
  { id: 2, studentName: "Trần Thị B", studentId: "SV002", submittedAt: "10/06/2026 08:30", file: "exam-2.pdf", grade: 9.0, feedback: "Bài làm rất tốt, lập luận chặt chẽ.", status: "Đã chấm" },
  { id: 3, studentName: "Lê Văn C", studentId: "SV003", submittedAt: "10/06/2026 09:00", file: "exam-3.pdf", grade: null, feedback: "", status: "Đã nộp" },
  { id: 4, studentName: "Phạm Thị D", studentId: "SV004", submittedAt: "10/06/2026 08:50", file: "exam-4.pdf", grade: 8.5, feedback: "Tốt, nhưng cần chú ý phần câu 3.", status: "Đã chấm" },
  { id: 5, studentName: "Hoàng Văn E", studentId: "SV005", submittedAt: "10/06/2026 09:15", file: "exam-5.pdf", grade: 7.5, feedback: "Cần cải thiện kỹ năng phân tích.", status: "Đã chấm" },
  { id: 6, studentName: "Vũ Thị F", studentId: "SV006", submittedAt: "10/06/2026 08:40", file: "exam-6.pdf", grade: null, feedback: "", status: "Đã nộp" },
];

// Exam info (normally fetched from API)
const examInfo = {
  name: "Midterm Exam - Web Development",
  course: "Web Development",
  examDate: "10/06/2026 08:00",
  duration: 90,
  totalSubmissions: 6,
  graded: 3,
  pending: 3,
  maxScore: 10,
};

export function ExamSubmissions() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const [grades, setGrades] = useState<{ [key: number]: number | null }>(
    submissions.reduce((acc, s) => ({ ...acc, [s.id]: s.grade }), {})
  );
  const [feedbacks, setFeedbacks] = useState<{ [key: number]: string }>(
    submissions.reduce((acc, s) => ({ ...acc, [s.id]: s.feedback }), {})
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleSaveGrades = () => {
    if (!canGradeSubmissions(userRole)) {
      toast.error("Không có quyền", {
        description: "Chỉ giáo viên mới có thể chấm điểm",
      });
      return;
    }
    // TODO: Gọi API lưu điểm
    toast.success("Lưu điểm thành công", {
      description: "Điểm đã được cập nhật cho sinh viên",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Đã nộp":
        return "bg-warning/10 text-warning";
      case "Đã chấm":
        return "bg-success/10 text-success";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">{examInfo.name}</h1>
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
                <p className="text-2xl font-bold">{examInfo.totalSubmissions}</p>
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
                <p className="text-2xl font-bold text-success">{examInfo.graded}</p>
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
                <p className="text-2xl font-bold text-warning">{examInfo.pending}</p>
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
                <p className="text-lg font-semibold">{examInfo.examDate}</p>
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
                      {submission.studentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {submission.submittedAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 text-primary hover:underline">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{submission.file}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {canGradeSubmissions(userRole) ? (
                        <input
                          type="number"
                          min="0"
                          max={examInfo.maxScore}
                          step="0.5"
                          value={grades[submission.id] || ""}
                          onChange={(e) =>
                            setGrades({ ...grades, [submission.id]: parseFloat(e.target.value) || null })
                          }
                          className="w-20 px-3 py-1.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder={`0-${examInfo.maxScore}`}
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {submission.grade !== null ? `${submission.grade}/${examInfo.maxScore}` : "-"}
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
                          {submission.grade !== null && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Điểm:</span>
                              <span className="text-success font-bold">{submission.grade}/{examInfo.maxScore}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button - Only for Teachers */}
      {canGradeSubmissions(userRole) && (
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={handleSaveGrades}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            Lưu tất cả điểm
          </button>
        </div>
      )}
    </div>
  );
}
import { Fragment } from "react";
import { Download, Eye, Save, FileText, Calendar, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAssignment } from "../hooks/useAssignment";
import type { AssignmentStats, Submission } from "../types/assignment.types";

interface TeacherGradingPanelProps {
  assignmentId: number;
  stats: AssignmentStats;
  submissions: Submission[];
}

export function TeacherGradingPanel({ assignmentId, stats, submissions }: TeacherGradingPanelProps) {
  const {
    grades,
    feedbacks,
    expandedRow,
    updateGrade,
    updateFeedback,
    toggleExpandedRow,
    saveGrades,
    loading
  } = useAssignment(submissions);

  const handleSaveGrades = async () => {
    try {
      await saveGrades(assignmentId);
      toast.success("Lưu điểm thành công", {
        description: "Điểm đã được cập nhật cho sinh viên",
      });
    } catch (error) {
      toast.error("Không thể lưu điểm");
    }
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số bài nộp</p>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
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
              <p className="text-2xl font-bold text-success">{stats.graded}</p>
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
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hạn nộp</p>
              <p className="text-lg font-semibold">{stats.dueDate}</p>
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
                      <input
                        type="number"
                        min="0"
                        max={stats.maxScore}
                        step="0.5"
                        value={grades[submission.id] || ""}
                        onChange={(e) =>
                          updateGrade(submission.id, parseFloat(e.target.value) || null)
                        }
                        className="w-20 px-3 py-1.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder={`0-${stats.maxScore}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleExpandedRow(submission.id)}
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
                            <textarea
                              value={feedbacks[submission.id] || ""}
                              onChange={(e) =>
                                updateFeedback(submission.id, e.target.value)
                              }
                              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                              rows={3}
                              placeholder="Nhập nhận xét cho sinh viên..."
                            />
                          </div>
                          {submission.grade !== null && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Điểm:</span>
                              <span className="text-success font-bold">{submission.grade}/{stats.maxScore}</span>
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

      {/* Save Button */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={handleSaveGrades}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" />
          Lưu tất cả điểm
        </button>
      </div>
    </div>
  );
}

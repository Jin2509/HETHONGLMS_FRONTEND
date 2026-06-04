import { Link } from "react-router";
import { Eye, Upload, Clock, Pencil, Trash2, ClipboardCheck } from "lucide-react";
import type { Assignment } from "../types/assignment.types";

interface AssignmentTableProps {
  assignments: Assignment[];
  userRole: string;
  canManageContent: boolean;
  canSubmitWork: boolean;
  canViewAllSubmissions: boolean;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export function AssignmentTable({
  assignments,
  userRole,
  canManageContent,
  canSubmitWork,
  canViewAllSubmissions,
  onEdit,
  onDelete,
}: AssignmentTableProps) {
  const getUrgencyColor = (hoursLeft: number) => {
    if (hoursLeft < 0) return "text-muted-foreground";
    if (hoursLeft < 24) return "text-destructive";
    if (hoursLeft < 72) return "text-warning";
    return "text-success";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Chưa nộp":
        return "bg-slate-100 text-slate-700";
      case "Đã nộp":
        return "bg-primary/10 text-primary";
      case "Đang chấm":
        return "bg-warning/10 text-warning";
      case "Đã chấm":
        return "bg-success/10 text-success";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDueDate = (dateString: string, hoursLeft: number) => {
    if (hoursLeft < 0) return "Đã quá hạn";
    if (hoursLeft < 24) return `${hoursLeft} giờ nữa`;
    const days = Math.floor(hoursLeft / 24);
    return `${days} ngày nữa`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tên bài tập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Môn học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hạn nộp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-card-foreground">
                      {assignment.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {assignment.course}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${getUrgencyColor(assignment.hoursLeft)}`} />
                    <span className={`text-sm ${getUrgencyColor(assignment.hoursLeft)}`}>
                      {formatDueDate(assignment.dueDate, assignment.hoursLeft)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {assignment.status === "Chưa nộp" && assignment.hoursLeft > 0 && canSubmitWork && (
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        title="Nộp bài"
                      >
                        <Upload className="w-4 h-4" />
                      </Link>
                    )}
                    {canManageContent && (
                      <button
                        onClick={() => onEdit(assignment)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {canManageContent && (
                      <button
                        onClick={() => onDelete(assignment)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                    {canViewAllSubmissions && (
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        title="Xem tất cả nộp bài"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

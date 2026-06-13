import { Link, useParams } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { canSubmitWork } from "../../../utils/permissions";
import { AssignmentInfo } from "../components/AssignmentInfo";
import { StudentSubmissionPanel } from "../components/StudentSubmissionPanel";
import { TeacherGradingPanel } from "../components/TeacherGradingPanel";
import { useAssignment } from "../hooks/useAssignment";
import { useEffect } from "react";

export function AssignmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  
  const { 
    assignmentDetail, 
    submissions, 
    loading, 
    fetchAssignmentDetail, 
    fetchSubmissions 
  } = useAssignment();

  useEffect(() => {
    if (id) {
      const assignmentId = parseInt(id);
      fetchAssignmentDetail(assignmentId);
      fetchSubmissions(assignmentId);
    }
  }, [id, fetchAssignmentDetail, fetchSubmissions]);

  if (loading && !assignmentDetail) {
    return <div className="py-20 text-center text-muted-foreground">Đang tải...</div>;
  }

  if (!assignmentDetail) {
    return <div className="py-20 text-center text-muted-foreground">Không tìm thấy bài tập</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/assignments" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách bài tập
        </Link>
      </div>

      {canSubmitWork(userRole) ? (
        /* Student View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AssignmentInfo assignment={assignmentDetail} />
          </div>
          <StudentSubmissionPanel assignmentId={id || ""} submissions={submissions} />
        </div>
      ) : (
        /* Teacher/Admin View */
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{assignmentDetail.name}</h1>
            <p className="text-muted-foreground">Danh sách bài nộp và chấm điểm</p>
          </div>
          <TeacherGradingPanel 
            assignmentId={parseInt(id || "0")}
            stats={{
              name: assignmentDetail.name,
              course: assignmentDetail.course,
              dueDate: assignmentDetail.dueDate,
              totalSubmissions: submissions.length,
              graded: submissions.filter(s => s.status === 'graded').length,
              pending: submissions.filter(s => s.status === 'submitted').length,
              maxScore: assignmentDetail.maxScore
            }} 
            submissions={submissions} 
          />
        </div>
      )}
    </div>
  );
}

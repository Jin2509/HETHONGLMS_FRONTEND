import { Link, useParams } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { canSubmitWork } from "../../../utils/permissions";
import { AssignmentInfo } from "../components/AssignmentInfo";
import { StudentSubmissionPanel } from "../components/StudentSubmissionPanel";
import { TeacherGradingPanel } from "../components/TeacherGradingPanel";
import type { AssignmentDetail, AssignmentStats } from "../types/assignment.types";

// Mock data - normally fetched from API
const mockAssignment: AssignmentDetail = {
  id: 1,
  name: "React Component Design",
  course: "Web Development",
  dueDate: "05/06/2026",
  hoursLeft: 72,
  description: "Trong bài tập này, bạn sẽ thiết kế và triển khai một component React tái sử dụng theo các yêu cầu sau:",
  requirements: [
    "Tạo một Button component với các variants: primary, secondary, outline",
    "Component phải hỗ trợ các sizes: small, medium, large",
    "Implement loading state với spinner",
    "Viết unit tests với Jest và React Testing Library",
    "Document component với Storybook",
  ],
  attachments: [
    { id: 1, name: "assignment-requirements.pdf", size: "2.4 MB", url: "#" },
  ],
  maxScore: 10,
};

const mockStats: AssignmentStats = {
  name: "React Component Design",
  course: "Web Development",
  dueDate: "05/06/2026",
  totalSubmissions: 5,
  graded: 2,
  pending: 3,
  maxScore: 10,
};

export function AssignmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";

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
            <AssignmentInfo assignment={mockAssignment} />
          </div>
          <StudentSubmissionPanel assignmentId={id} />
        </div>
      ) : (
        /* Teacher/Admin View */
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{mockStats.name}</h1>
            <p className="text-muted-foreground">Danh sách bài nộp và chấm điểm</p>
          </div>
          <TeacherGradingPanel stats={mockStats} submissions={[]} />
        </div>
      )}
    </div>
  );
}

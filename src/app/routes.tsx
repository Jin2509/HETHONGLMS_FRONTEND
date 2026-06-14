import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthProvider } from "./contexts/AuthContext"; // Đảm bảo import đúng đường dẫn nhé
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/pages/Login";
import { Dashboard } from "./features/dashboard/pages/Dashboard";
import { CoursesList } from "./features/courses/pages/CoursesList";
import { CourseDetail } from "./features/courses/pages/CourseDetail";
import { AssignmentListPage } from "./features/assignments/pages/AssignmentListPage";
import { AssignmentDetailPage } from "./features/assignments/pages/AssignmentDetailPage";
import { ExamsList } from "./features/exams/pages/ExamsList";
import { ExamTake } from "./features/exams/pages/ExamTake";
import { ExamResult } from "./features/exams/pages/ExamResult";
import { ExamSubmissions } from "./features/exams/pages/ExamSubmissions";
import { Grades } from "./features/grades/pages/Grades";
import { Discussions } from "./features/discussions/pages/Discussions";
import { Schedule } from "./features/schedule/pages/Schedule";
import { Classes } from "./features/classes/pages/Classes";
import { ClassDetail } from "./features/classes/pages/ClassDetail";
import { Reports } from "./features/reports/pages/Reports";
import { AdminUsers } from "./features/admin/pages/AdminUsers";
import { NotFound } from "./components/NotFound";
import { ComponentShowcase } from "./components/demo/ComponentShowcase";

export const router = createBrowserRouter([
  {
    // BỌC ROOT: Mọi route con nằm bên dưới đều sẽ nhận được Auth Context một cách an toàn
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Dashboard },

          // Learning (Courses moved into Classes)
          { path: "courses", element: <Navigate to="/classes" replace /> },
          { path: "courses/:id", Component: CourseDetail },

          // Assessment
          { path: "assignments", Component: AssignmentListPage },
          { path: "assignments/:id", Component: AssignmentDetailPage },
          { path: "exams", Component: ExamsList },
          { path: "exams/:id/take", Component: ExamTake },
          { path: "exams/:id/result", Component: ExamResult },
          {
            path: "exams/:id/submissions",
            element: (
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <ExamSubmissions />
              </ProtectedRoute>
            ),
          },
          {
            path: "grades",
            element: (
              <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                <Grades />
              </ProtectedRoute>
            ),
          },

          // Community
          { path: "discussions", Component: Discussions },
          { path: "classes", Component: Classes },
          { path: "classes/:id", Component: ClassDetail },
          { path: "schedule", Component: Schedule },

          // Manage (Admin only)
          {
            path: "reports",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            ),
          },

          // Demo
          { path: "components", Component: ComponentShowcase },

          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
]);

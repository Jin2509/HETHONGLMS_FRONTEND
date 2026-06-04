/**
 * Utility functions for role-based access control
 */

export type UserRole = "admin" | "teacher" | "student";

/**
 * Check if user can create/edit/delete assignments or exams
 */
export function canManageContent(role: UserRole): boolean {
  return role === "admin" || role === "teacher";
}

/**
 * Check if user can grade submissions
 * Only teachers can grade, admins cannot
 */
export function canGradeSubmissions(role: UserRole): boolean {
  return role === "teacher";
}

/**
 * Check if user can submit assignments/exams
 */
export function canSubmitWork(role: UserRole): boolean {
  return role === "student";
}

/**
 * Check if user can view all submissions
 */
export function canViewAllSubmissions(role: UserRole): boolean {
  return role === "admin" || role === "teacher";
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Check if user is teacher
 */
export function isTeacher(role: UserRole): boolean {
  return role === "teacher";
}

/**
 * Check if user is student
 */
export function isStudent(role: UserRole): boolean {
  return role === "student";
}
/**
 * Utility functions for role-based access control
 */

export type UserRole = "admin" | "teacher" | "student";

const VALID_ROLES: UserRole[] = ["admin", "teacher", "student"];

/**
 * Normalize role strings from API/localStorage to FE role union.
 */
export function normalizeRole(role?: string | null): UserRole {
  const normalized = (role || "student").trim().toLowerCase();
  return VALID_ROLES.includes(normalized as UserRole) ? (normalized as UserRole) : "student";
}

/**
 * Check if user can create/edit/delete assignments or exams
 */
export function canManageContent(role: UserRole): boolean {
  return role === "admin" || role === "teacher";
}

/**
 * Check if user can grade submissions
 * Admins and teachers can grade
 */
export function canGradeSubmissions(role: UserRole): boolean {
  return role === "admin" || role === "teacher";
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
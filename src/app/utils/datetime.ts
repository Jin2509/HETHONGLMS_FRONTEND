/**
 * Utilities for handling Vietnam timezone (ICT - UTC+7)
 */

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Get current date/time in Vietnam timezone
 */
export function getVietnamTime(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: VIETNAM_TIMEZONE }));
}

/**
 * Format date for Vietnam timezone display
 */
export function formatVietnamDate(date: Date | string, format: "full" | "date" | "time" | "datetime" = "full"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: VIETNAM_TIMEZONE,
  };

  if (format === "full" || format === "datetime") {
    options.year = "numeric";
    options.month = "2-digit";
    options.day = "2-digit";
    options.hour = "2-digit";
    options.minute = "2-digit";
  } else if (format === "date") {
    options.year = "numeric";
    options.month = "2-digit";
    options.day = "2-digit";
  } else if (format === "time") {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return dateObj.toLocaleString("vi-VN", options);
}

/**
 * Get current Vietnam date for input[type="date"] (YYYY-MM-DD)
 */
export function getVietnamDateInputValue(): string {
  const now = getVietnamTime();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get current Vietnam time for input[type="time"] (HH:MM)
 */
export function getVietnamTimeInputValue(): string {
  const now = getVietnamTime();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Check if a date/time is in the past (Vietnam timezone)
 */
export function isInPast(dateStr: string, timeStr?: string): boolean {
  const now = getVietnamTime();
  const targetDate = new Date(dateStr + (timeStr ? `T${timeStr}` : ""));
  return targetDate < now;
}

/**
 * Format relative time in Vietnamese (e.g., "2 giờ trước", "3 ngày trước")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = getVietnamTime();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return formatVietnamDate(dateObj, "date");
}

// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

/** Merge tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date as "2 min ago" */
export function timeAgo(date: Date | null): string {
  if (!date) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Format a Date as "May 16, 2025 · 14:32" */
export function formatDateTime(date: Date | null): string {
  if (!date) return "—";
  return format(date, "MMM d, yyyy · HH:mm");
}

/** Format ms latency */
export function formatLatency(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Format uptime percentage */
export function formatUptime(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

/** Interval label map */
export const INTERVAL_LABELS: Record<number, string> = {
  1:    "Every 1 min",
  2:    "Every 2 min",
  5:    "Every 5 min",
  10:   "Every 10 min",
  15:   "Every 15 min",
  30:   "Every 30 min",
  60:   "Every 1 hour",
  120:  "Every 2 hours",
  180:  "Every 3 hours",
  360:  "Every 6 hours",
  720:  "Every 12 hours",
  1440: "Every 24 hours",
};

/** Validate a URL */
export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Get status colour classes */
export function statusColor(status: string): string {
  switch (status) {
    case "up":      return "text-success";
    case "down":    return "text-error";
    case "paused":  return "text-warn";
    default:        return "text-text-muted";
  }
}

export function statusBg(status: string): string {
  switch (status) {
    case "up":      return "bg-success/10 border-success/30";
    case "down":    return "bg-error/10 border-error/30";
    case "paused":  return "bg-warn/10 border-warn/30";
    default:        return "bg-text-dim/10 border-text-dim/30";
  }
}

/** Generate a random ID (for toasts etc.) */
export function randomId(): string {
  return Math.random().toString(36).slice(2);
}

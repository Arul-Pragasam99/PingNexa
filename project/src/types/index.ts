// ── User ──────────────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  provider: string;
  createdAt: Date | null;
  lastLoginAt: Date | null;
  totalPings: number;
  totalMonitors: number;
}

// ── Monitor ───────────────────────────────────────────────────────────────────
export type MonitorStatus = "up" | "down" | "paused" | "unknown";
export type PingInterval =
  | 1
  | 2
  | 5
  | 10
  | 15
  | 30
  | 60
  | 120
  | 180
  | 360
  | 720
  | 1440;

export interface Monitor {
  id: string;
  userId: string;
  name: string;
  url: string;
  intervalMinutes: PingInterval;
  status: MonitorStatus;
  isPaused: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  lastCheckedAt: Date | null;
  lastLatencyMs: number | null;
  uptime7d: number; // percentage 0-100
  uptime30d: number;
  totalPings: number;
  successPings: number;
  failedPings: number;
  alertOnDown: boolean;
  alertEmail: string;
  notesOrTag: string;
}

// ── Ping Log ──────────────────────────────────────────────────────────────────
export type PingResult = "success" | "error" | "timeout";

export interface PingLog {
  id: string;
  monitorId: string;
  userId: string;
  url: string;
  result: PingResult;
  statusCode: number | null;
  latencyMs: number | null;
  errorMessage: string | null;
  timestamp: Date | null;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  totalMonitors: number;
  activeMonitors: number;
  pausedMonitors: number;
  monitorsUp: number;
  monitorsDown: number;
  avgUptime: number;
  avgLatency: number;
  totalPingsToday: number;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warn";
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

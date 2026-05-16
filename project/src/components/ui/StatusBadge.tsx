"use client";
// components/ui/StatusBadge.tsx
import { cn } from "@/lib/utils";
import type { MonitorStatus } from "@/types";

interface Props {
  status:    MonitorStatus;
  showLabel?: boolean;
  size?:     "sm" | "md";
}

const config: Record<MonitorStatus, { dot: string; label: string; ring: string }> = {
  up:      { dot: "bg-success",    label: "UP",      ring: "bg-success/20"  },
  down:    { dot: "bg-error",      label: "DOWN",    ring: "bg-error/20"    },
  paused:  { dot: "bg-warn",       label: "PAUSED",  ring: "bg-warn/20"     },
  unknown: { dot: "bg-text-muted", label: "UNKNOWN", ring: "bg-text-dim/20" },
};

export default function StatusBadge({ status, showLabel = true, size = "md" }: Props) {
  const { dot, label, ring } = config[status];
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2.5 h-2.5";
  const pulse   = status === "up" || status === "down";

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="relative flex items-center justify-center">
        {pulse && (
          <span className={cn("absolute rounded-full animate-ping", dotSize, ring)} />
        )}
        <span className={cn("relative rounded-full", dotSize, dot)} />
      </div>
      {showLabel && (
        <span className={cn(
          "text-[10px] font-mono font-bold tracking-widest",
          status === "up"      && "text-success",
          status === "down"    && "text-error",
          status === "paused"  && "text-warn",
          status === "unknown" && "text-text-muted",
        )}>
          {label}
        </span>
      )}
    </div>
  );
}

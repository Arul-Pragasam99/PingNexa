"use client";
// components/monitor/MonitorCard.tsx
import { useState } from "react";
import { Pause, Play, Trash2, Settings, ChevronRight } from "lucide-react";
import { useMonitors }  from "@/context/MonitorsContext";
import StatusBadge      from "@/components/ui/StatusBadge";
import ConfirmDialog    from "@/components/ui/ConfirmDialog";
import { formatLatency, formatUptime, timeAgo, INTERVAL_LABELS } from "@/lib/utils";
import type { Monitor } from "@/types";

interface Props {
  monitor:      Monitor;
  onOpenDetail: (id: string) => void;
}

export default function MonitorCard({ monitor, onOpenDetail }: Props) {
  const { removeMonitor, pauseMonitor } = useMonitors();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      style={{ fontFamily: "'Lato', sans-serif" }}
      className="glass-card glow-border rounded-2xl px-5 py-4 flex items-center gap-4 group"
    >
      {/* Status */}
      <StatusBadge status={monitor.status} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white truncate">{monitor.name}</span>
          {monitor.notesOrTag && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] font-mono border border-cyan-400/20 flex-shrink-0">
              {monitor.notesOrTag}
            </span>
          )}
        </div>
        <div className="font-mono text-xs text-white/40 truncate mt-0.5">{monitor.url}</div>
        <div className="flex items-center gap-4 mt-1.5 text-[11px] text-white/35">
          <span>{INTERVAL_LABELS[monitor.intervalMinutes]}</span>
          <span>Uptime {formatUptime(monitor.uptime7d)}</span>
          <span className="font-mono">{formatLatency(monitor.lastLatencyMs)}</span>
          <span>{timeAgo(monitor.lastCheckedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => pauseMonitor(monitor.id, !monitor.isPaused)}
          title={monitor.isPaused ? "Resume" : "Pause"}
          className="p-2 rounded-lg text-white/35 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all opacity-0 group-hover:opacity-100"
        >
          {monitor.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onOpenDetail(monitor.id)}
          title="Settings"
          className="p-2 rounded-lg text-white/35 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          title="Delete"
          className="p-2 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onOpenDetail(monitor.id)}
          className="p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete monitor?"
          message={`This will permanently remove "${monitor.name}" and all its ping history.`}
          onConfirm={() => { removeMonitor(monitor.id); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
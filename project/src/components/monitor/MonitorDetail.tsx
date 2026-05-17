"use client";
// components/monitor/MonitorDetail.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, Pause, Play, Trash2, RefreshCw, ExternalLink, Clock } from "lucide-react";
import { useMonitors }    from "@/context/MonitorsContext";
import { getPingLogs }    from "@/lib/firestore";
import { pingUrl }        from "@/lib/pinger";
import { savePingLog, updateMonitorAfterPing } from "@/lib/firestore";
import { useAuth }        from "@/context/AuthContext";
import { useToast }       from "@/context/ToastContext";
import StatusBadge        from "@/components/ui/StatusBadge";
import PingHistoryTable   from "./PingHistoryTable";
import EditMonitorForm    from "./EditMonitorForm";
import ConfirmDialog      from "@/components/ui/ConfirmDialog";
import { formatLatency, formatUptime, formatDateTime, INTERVAL_LABELS, timeAgo } from "@/lib/utils";
import type { PingLog } from "@/types";

interface Props { monitorId: string; onBack: () => void; }

export default function MonitorDetail({ monitorId, onBack }: Props) {
  const { monitors, removeMonitor, pauseMonitor, updateLocal } = useMonitors();
  const { user }     = useAuth();
  const { showToast } = useToast();
  const pageRef      = useRef<HTMLDivElement>(null);

  const [logs,     setLogs]     = useState<PingLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [pinging,  setPinging]  = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const monitor = monitors.find((m) => m.id === monitorId);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current?.querySelectorAll(".detail-item") ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    (async () => {
      setLogsLoading(true);
      const data = await getPingLogs(monitorId, 50);
      setLogs(data);
      setLogsLoading(false);
    })();
  }, [monitorId]);

  const handleManualPing = async () => {
    if (!monitor || !user) return;
    setPinging(true);
    const res = await pingUrl(monitor.url);
    updateLocal(monitor.id, {
      status:        res.success ? "up" : "down",
      lastLatencyMs: res.latencyMs,
      lastCheckedAt: new Date(),
    });
    await Promise.all([
      savePingLog({ monitorId, userId: user.uid, url: monitor.url, result: res.result, statusCode: res.statusCode, latencyMs: res.latencyMs, errorMessage: res.errorMessage }),
      updateMonitorAfterPing(monitorId, user.uid, { success: res.success, latencyMs: res.latencyMs, statusCode: res.statusCode }),
    ]);
    const updated = await getPingLogs(monitorId, 50);
    setLogs(updated);
    showToast(res.success ? `Ping OK — ${res.latencyMs}ms` : `Ping failed: ${res.errorMessage}`, res.success ? "success" : "error");
    setPinging(false);
  };

  if (!monitor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-4xl">🔍</div>
        <p className="text-text-muted">Monitor not found.</p>
        <button onClick={onBack} className="text-accent text-sm underline">Go back</button>
      </div>
    );
  }

  return (
    <div ref={pageRef} style={{ fontFamily: "'Lato', sans-serif" }} className="max-w-4xl mx-auto space-y-6">
      {/* Back + title */}
      <div className="detail-item flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-border text-text-muted hover:text-text hover:border-accent/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <StatusBadge status={monitor.status} />
            <h1 className="text-xl font-extrabold truncate">{monitor.name}</h1>
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted font-mono hover:text-accent transition-colors mt-0.5"
          >
            {monitor.url} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualPing}
            disabled={pinging || monitor.isPaused}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/30 disabled:opacity-40 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? "animate-spin" : ""}`} />
            {pinging ? "Pinging…" : "Ping now"}
          </button>
          <button
            onClick={() => pauseMonitor(monitor.id, !monitor.isPaused)}
            className="p-2 rounded-xl border border-border text-text-muted hover:text-warn hover:border-warn/30 transition-all"
            title={monitor.isPaused ? "Resume" : "Pause"}
          >
            {monitor.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-xl border border-border text-text-muted hover:text-error hover:border-error/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="detail-item grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Uptime (7d)",   value: formatUptime(monitor.uptime7d) },
          { label: "Uptime (30d)",  value: formatUptime(monitor.uptime30d) },
          { label: "Last latency",  value: formatLatency(monitor.lastLatencyMs) },
          { label: "Total pings",   value: monitor.totalPings },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <div className="text-xl font-extrabold font-mono">{value}</div>
            <div className="text-[11px] text-text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="detail-item glass-card rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Interval</span><span className="font-mono font-semibold">{INTERVAL_LABELS[monitor.intervalMinutes]}</span></div>
        <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Last checked</span><span className="font-mono font-semibold">{timeAgo(monitor.lastCheckedAt)}</span></div>
        <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Created</span><span className="font-mono font-semibold">{formatDateTime(monitor.createdAt)}</span></div>
        <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Successful</span><span className="font-mono font-semibold text-success">{monitor.successPings}</span></div>
        <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Failed</span><span className="font-mono font-semibold text-error">{monitor.failedPings}</span></div>
        {monitor.notesOrTag && (
          <div><span className="text-text-muted text-xs uppercase tracking-wider block mb-0.5">Tag</span><span className="font-mono font-semibold text-accent">{monitor.notesOrTag}</span></div>
        )}
      </div>

      {/* Edit form */}
      <div className="detail-item glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowEdit(!showEdit)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-border hover:bg-card/50 transition-colors"
        >
          <span className="font-bold text-sm">Edit Settings</span>
          <Clock className={`w-4 h-4 text-text-muted transition-transform ${showEdit ? "rotate-180" : ""}`} />
        </button>
        {showEdit && <EditMonitorForm monitor={monitor} onDone={() => setShowEdit(false)} />}
      </div>

      {/* Ping history */}
      <div className="detail-item">
        <PingHistoryTable logs={logs} loading={logsLoading} />
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete monitor?"
          message={`Permanently delete "${monitor.name}" and all its history?`}
          onConfirm={() => { removeMonitor(monitor.id); onBack(); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

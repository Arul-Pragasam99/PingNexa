"use client";
// components/monitor/PingHistoryTable.tsx
import { CheckCircle, XCircle, Clock, Wifi } from "lucide-react";
import { formatLatency, formatDateTime } from "@/lib/utils";
import SkeletonCard from "@/components/ui/SkeletonCard";
import type { PingLog } from "@/types";

interface Props { logs: PingLog[]; loading: boolean; }

const ResultIcon = ({ result }: { result: PingLog["result"] }) => {
  if (result === "success") return <CheckCircle className="w-3.5 h-3.5 text-success" />;
  if (result === "timeout") return <Clock className="w-3.5 h-3.5 text-warn" />;
  return <XCircle className="w-3.5 h-3.5 text-error" />;
};

export default function PingHistoryTable({ logs, loading }: Props) {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }} className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Wifi className="w-4 h-4 text-accent" />
        <h2 className="font-bold text-sm">Ping History</h2>
        <span className="ml-auto text-xs text-text-muted font-mono">Last 50 pings</span>
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} height="h-8" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-text-muted text-sm">No ping history yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Status", "Code", "Latency", "Timestamp", "Error"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-text-muted font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <ResultIcon result={log.result} />
                      <span className={log.result === "success" ? "text-success" : log.result === "timeout" ? "text-warn" : "text-error"}>
                        {log.result}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-text-muted">{log.statusCode ?? "—"}</td>
                  <td className="px-4 py-2.5 font-mono">{formatLatency(log.latencyMs)}</td>
                  <td className="px-4 py-2.5 font-mono text-text-muted">{formatDateTime(log.timestamp)}</td>
                  <td className="px-4 py-2.5 text-error max-w-xs truncate">{log.errorMessage ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

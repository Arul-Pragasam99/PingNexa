"use client";
// components/dashboard/DashboardHome.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Activity, ArrowRight, TrendingUp, Wifi, WifiOff, Clock } from "lucide-react";
import { useAuth }      from "@/context/AuthContext";
import { useMonitors }  from "@/context/MonitorsContext";
import { cn, formatLatency, formatUptime, timeAgo } from "@/lib/utils";
import StatusBadge      from "@/components/ui/StatusBadge";

interface Props {
  onViewMonitors: () => void;
  onOpenDetail:   (id: string) => void;
}

export default function DashboardHome({ onViewMonitors, onOpenDetail }: Props) {
  const { profile }  = useAuth();
  const { monitors } = useMonitors();
  const pageRef      = useRef<HTMLDivElement>(null);

  const total      = monitors.length;
  const up         = monitors.filter((m) => m.status === "up").length;
  const down       = monitors.filter((m) => m.status === "down").length;
  const paused     = monitors.filter((m) => m.isPaused).length;
  const avgUptime  = total ? monitors.reduce((s, m) => s + m.uptime7d, 0) / total : 100;
  const avgLatency = monitors.filter((m) => m.lastLatencyMs).length
    ? monitors.filter((m) => m.lastLatencyMs).reduce((s, m) => s + (m.lastLatencyMs ?? 0), 0)
      / monitors.filter((m) => m.lastLatencyMs).length
    : null;

  useEffect(() => {
    if (!pageRef.current) return;
    const items = pageRef.current.querySelectorAll(".dash-item");
    if (items.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gsap.utils.toArray(items),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [monitors.length, profile]);

  const stats = [
    { label: "Total Monitors",  value: total,                     icon: Activity,   color: "text-accent"  },
    { label: "Online",          value: up,                        icon: Wifi,       color: "text-success" },
    { label: "Offline",         value: down,                      icon: WifiOff,    color: "text-error"   },
    { label: "Avg Uptime (7d)", value: formatUptime(avgUptime),   icon: TrendingUp, color: "text-violet"  },
    { label: "Avg Latency",     value: formatLatency(avgLatency), icon: Clock,      color: "text-warn"    },
    { label: "Total Pings",     value: profile?.totalPings ?? 0,  icon: Activity,   color: "text-accent"  },
  ];

  const recent = [...monitors].sort((a, b) =>
    (b.lastCheckedAt?.getTime() ?? 0) - (a.lastCheckedAt?.getTime() ?? 0)
  ).slice(0, 5);

  return (
    <div ref={pageRef} className="max-w-5xl mx-auto space-y-8" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Welcome */}
      <div className="dash-item">
        <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Lato', sans-serif" }}>
          Welcome back, {profile?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-text-muted text-sm mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
          {total === 0
            ? "You have no monitors yet. Add your first site below."
            : `Monitoring ${total} site${total !== 1 ? "s" : ""}. ${down > 0 ? `⚠️ ${down} down.` : "All good ✓"}`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="dash-item grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card glow-border rounded-2xl p-4" style={{ fontFamily: "'Lato', sans-serif" }}>
            <Icon className={cn("w-4 h-4 mb-2", color)} />
            <div className="text-xl font-extrabold font-mono">{value}</div>
            <div className="text-[11px] text-text-muted mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="dash-item glass-card rounded-2xl overflow-hidden" style={{ fontFamily: "'Lato', sans-serif" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-sm">Recent Monitors</h2>
          <button
            onClick={onViewMonitors}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-dim transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="px-5 py-12 text-center text-text-muted text-sm">
            No monitors yet.{" "}
            <button onClick={onViewMonitors} className="text-accent underline underline-offset-2">
              Add one
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((m) => (
              <button
                key={m.id}
                onClick={() => onOpenDetail(m.id)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-card/50 transition-colors text-left group"
              >
                <StatusBadge status={m.status} showLabel={false} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate group-hover:text-accent transition-colors">{m.name}</div>
                  <div className="text-xs text-text-muted truncate font-mono">{m.url}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-text-muted">
                  <span className="font-mono">{formatLatency(m.lastLatencyMs)}</span>
                  <span>{timeAgo(m.lastCheckedAt)}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-accent transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
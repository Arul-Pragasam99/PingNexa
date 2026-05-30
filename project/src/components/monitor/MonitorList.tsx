"use client";
// components/monitor/MonitorList.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useMonitors }   from "@/context/MonitorsContext";
import MonitorCard       from "./MonitorCard";
import AddMonitorModal   from "./AddMonitorModal";
import SkeletonCard      from "@/components/ui/SkeletonCard";

interface Props { onOpenDetail: (id: string) => void; }

export default function MonitorList({ onOpenDetail }: Props) {
  const { monitors, loading, refresh } = useMonitors();
  const [showAdd, setShowAdd] = useState(false);
  const [search,  setSearch]  = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !listRef.current) return;
    const cards = listRef.current.querySelectorAll(".monitor-card");
    if (cards.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gsap.utils.toArray(cards),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }
      );
    }, listRef);
    return () => ctx.revert();
  }, [loading, monitors.length]);

  const filtered = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }} className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Monitors</h1>
          <p className="text-text-muted text-sm mt-0.5">{monitors.length} total · pinging automatically</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-2 rounded-xl border border-border text-text-muted hover:text-text hover:border-accent/30 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-xl text-sm font-bold hover:bg-accent-dim transition-all shadow-glow_sm"
          >
            <Plus className="w-4 h-4" /> Add Monitor
          </button>
        </div>
      </div>

      {/* Search */}
      {monitors.length > 4 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search monitors…"
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>
      )}

      {/* List */}
      <div ref={listRef} className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl py-20 text-center">
            <div className="text-4xl mb-3">📡</div>
            <h3 className="font-bold mb-2">
              {monitors.length === 0 ? "No monitors yet" : "No results found"}
            </h3>
            <p className="text-text-muted text-sm mb-6">
              {monitors.length === 0
                ? "Add your first site to start pinging."
                : "Try a different search term."}
            </p>
            {monitors.length === 0 && (
              <button
                onClick={() => setShowAdd(true)}
                className="px-6 py-2.5 bg-accent text-bg rounded-xl text-sm font-bold hover:bg-accent-dim transition-all"
              >
                Add Monitor
              </button>
            )}
          </div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="monitor-card">
              <MonitorCard monitor={m} onOpenDetail={onOpenDetail} />
            </div>
          ))
        )}
      </div>

      {showAdd && <AddMonitorModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
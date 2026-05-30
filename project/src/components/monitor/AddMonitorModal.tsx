"use client";
// components/monitor/AddMonitorModal.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, Plus, AlertCircle } from "lucide-react";
import { useMonitors }   from "@/context/MonitorsContext";
import { useAuth }       from "@/context/AuthContext";
import { isValidUrl, INTERVAL_LABELS } from "@/lib/utils";
import type { PingInterval } from "@/types";

const INTERVALS: PingInterval[] = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440];

interface Props { onClose: () => void; }

export default function AddMonitorModal({ onClose }: Props) {
  const { addMonitor } = useMonitors();
  const { user }       = useAuth();
  const modalRef       = useRef<HTMLDivElement>(null);

  const [name,       setName]       = useState("");
  const [url,        setUrl]        = useState("https://");
  const [interval,   setInterval]   = useState<PingInterval>(5);
  const [alert,      setAlert]      = useState(false);
  const [alertEmail, setAlertEmail] = useState(user?.email ?? "");
  const [tag,        setTag]        = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1,    y: 0, duration: 0.3, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim())     return setError("Name is required.");
    if (!isValidUrl(url)) return setError("Enter a valid https:// URL.");
    setLoading(true);
    await addMonitor({ name: name.trim(), url: url.trim(), intervalMinutes: interval, alertOnDown: alert, alertEmail, notesOrTag: tag.trim() });
    setLoading(false);
    onClose();
  };

  /* shared input classes — explicit light text for dark bg */
  const inputCls =
    "w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all";

  const labelCls = "block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider";

  return (
    <div
      style={{ fontFamily: "'Lato', sans-serif" }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: "rgba(6, 14, 28, 0.92)", backdropFilter: "blur(24px)" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-white text-sm">Add Monitor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Monitor Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My App"
              className={inputCls}
            />
          </div>

          {/* URL */}
          <div>
            <label className={labelCls}>URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://myapp.onrender.com"
              className={`${inputCls} font-mono`}
            />
          </div>

          {/* Interval */}
          <div>
            <label className={labelCls}>Ping Interval</label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value) as PingInterval)}
              className={`${inputCls} appearance-none cursor-pointer`}
            >
              {INTERVALS.map((v) => (
                <option key={v} value={v} style={{ background: "#060e1c", color: "#fff" }}>
                  {INTERVAL_LABELS[v]}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className={labelCls}>
              Tag / Note{" "}
              <span className="normal-case font-normal text-white/30">(optional)</span>
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="production, staging, api…"
              className={inputCls}
            />
          </div>

          {/* ── Alert toggle ── */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors"
            style={{
              background: alert ? "rgba(0,229,255,0.06)" : "rgba(255,255,255,0.03)",
              borderColor: alert ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <div className="text-sm font-semibold text-white">Alert when down</div>
              <div className="text-xs text-white/40 mt-0.5">
                Get notified when this monitor goes offline
              </div>
            </div>

            {/* Custom toggle pill */}
            <button
              role="switch"
              aria-checked={alert}
              onClick={() => setAlert(!alert)}
              className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              style={{
                background: alert
                  ? "linear-gradient(135deg, #00e5ff, #0ff5d4)"
                  : "rgba(255,255,255,0.12)",
                boxShadow: alert ? "0 0 12px rgba(0,229,255,0.4)" : "none",
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{
                  transform: alert ? "translateX(20px)" : "translateX(0)",
                  boxShadow: alert ? "0 1px 6px rgba(0,229,255,0.3)" : "0 1px 4px rgba(0,0,0,0.4)",
                }}
              />
            </button>
          </div>

          {/* Alert email (shown when toggle is on) */}
          {alert && (
            <div
              style={{
                animation: "slideDown 0.2s ease-out",
              }}
            >
              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <label className={labelCls}>Alert Email</label>
              <input
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: "linear-gradient(135deg, #00e5ff, #0ff5d4)",
              color: "#04070f",
              boxShadow: loading ? "none" : "0 0 16px rgba(0,229,255,0.35)",
            }}
          >
            {loading ? "Creating…" : <><Plus className="w-4 h-4" /> Create Monitor</>}
          </button>
        </div>
      </div>
    </div>
  );
}
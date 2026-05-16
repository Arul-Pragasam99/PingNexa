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

  const [name,     setName]     = useState("");
  const [url,      setUrl]      = useState("https://");
  const [interval, setInterval] = useState<PingInterval>(5);
  const [alert,    setAlert]    = useState(false);
  const [alertEmail, setAlertEmail] = useState(user?.email ?? "");
  const [tag,      setTag]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div ref={modalRef} className="glass-card rounded-2xl w-full max-w-lg border border-border shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent" />
            <h2 className="font-bold">Add Monitor</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-card transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Monitor Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Render App"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://myapp.onrender.com"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent/40 transition-colors font-mono"
            />
          </div>

          {/* Interval */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Ping Interval</label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value) as PingInterval)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text focus:outline-none focus:border-accent/40 transition-colors appearance-none cursor-pointer"
            >
              {INTERVALS.map((v) => (
                <option key={v} value={v}>{INTERVAL_LABELS[v]}</option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Tag / Note <span className="normal-case font-normal">(optional)</span></label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="production, staging, api…"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Alert toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border">
            <div>
              <div className="text-sm font-semibold">Alert when down</div>
              <div className="text-xs text-text-muted">Get notified when this monitor goes offline</div>
            </div>
            <button
              onClick={() => setAlert(!alert)}
              className={`relative w-10 h-5.5 rounded-full transition-colors ${alert ? "bg-accent" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${alert ? "translate-x-[18px]" : ""}`} />
            </button>
          </div>

          {alert && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Alert Email</label>
              <input
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-card transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-accent text-bg rounded-xl text-sm font-bold hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Creating…" : <><Plus className="w-4 h-4" /> Create Monitor</>}
          </button>
        </div>
      </div>
    </div>
  );
}

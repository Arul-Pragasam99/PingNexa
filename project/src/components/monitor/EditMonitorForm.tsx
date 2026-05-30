"use client";
// components/monitor/EditMonitorForm.tsx
import { useState } from "react";
import { Save } from "lucide-react";
import { useMonitors }  from "@/context/MonitorsContext";
import { isValidUrl, INTERVAL_LABELS } from "@/lib/utils";
import type { Monitor, PingInterval } from "@/types";

const INTERVALS: PingInterval[] = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440];

interface Props { monitor: Monitor; onDone: () => void; }

export default function EditMonitorForm({ monitor, onDone }: Props) {
  const { editMonitor } = useMonitors();

  const [name,       setName]       = useState(monitor.name);
  const [url,        setUrl]        = useState(monitor.url);
  const [interval,   setInterval]   = useState<PingInterval>(monitor.intervalMinutes);
  const [alertOn,    setAlertOn]    = useState(monitor.alertOnDown);
  const [alertEmail, setAlertEmail] = useState(monitor.alertEmail);
  const [tag,        setTag]        = useState(monitor.notesOrTag);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSave = async () => {
    setError("");
    if (!name.trim())     return setError("Name required.");
    if (!isValidUrl(url)) return setError("Invalid URL.");
    setLoading(true);
    await editMonitor(monitor.id, {
      name:            name.trim(),
      url:             url.trim(),
      intervalMinutes: interval,
      alertOnDown:     alertOn,
      alertEmail,
      notesOrTag:      tag.trim(),
    });
    setLoading(false);
    onDone();
  };

  const inputCls =
    "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-all";

  const labelCls = "block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider";

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }} className="px-5 py-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={`${inputCls} font-mono`} />
        </div>
        <div>
          <label className={labelCls}>Interval</label>
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
        <div>
          <label className={labelCls}>Tag</label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="production, staging…"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Alert toggle row ── */}
      <div
        className="flex items-center gap-4 p-3.5 rounded-xl border transition-colors"
        style={{
          background: alertOn ? "rgba(0,229,255,0.06)" : "rgba(255,255,255,0.03)",
          borderColor: alertOn ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)",
        }}
      >
        {/* Custom toggle pill */}
        <button
          role="switch"
          aria-checked={alertOn}
          onClick={() => setAlertOn(!alertOn)}
          className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          style={{
            background: alertOn
              ? "linear-gradient(135deg, #00e5ff, #0ff5d4)"
              : "rgba(255,255,255,0.12)",
            boxShadow: alertOn ? "0 0 12px rgba(0,229,255,0.4)" : "none",
          }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
            style={{
              transform: alertOn ? "translateX(20px)" : "translateX(0)",
              boxShadow: alertOn
                ? "0 1px 6px rgba(0,229,255,0.3)"
                : "0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
        </button>

        <span className="text-sm text-white font-medium select-none">Alert when down</span>

        {alertOn && (
          <input
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="alert@email.com"
            className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
          />
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          onClick={onDone}
          className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-all"
          style={{
            background: "linear-gradient(135deg, #00e5ff, #0ff5d4)",
            color: "#04070f",
            boxShadow: loading ? "none" : "0 0 14px rgba(0,229,255,0.3)",
          }}
        >
          <Save className="w-3.5 h-3.5" />
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
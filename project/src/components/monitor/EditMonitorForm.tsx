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

  const [name,      setName]      = useState(monitor.name);
  const [url,       setUrl]       = useState(monitor.url);
  const [interval,  setInterval]  = useState<PingInterval>(monitor.intervalMinutes);
  const [alertOn,   setAlertOn]   = useState(monitor.alertOnDown);
  const [alertEmail, setAlertEmail] = useState(monitor.alertEmail);
  const [tag,       setTag]       = useState(monitor.notesOrTag);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

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

  return (
    <div className="px-5 py-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text focus:outline-none focus:border-accent/40 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text font-mono focus:outline-none focus:border-accent/40 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">Interval</label>
          <select value={interval} onChange={(e) => setInterval(Number(e.target.value) as PingInterval)}
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text focus:outline-none focus:border-accent/40 transition-colors appearance-none cursor-pointer">
            {INTERVALS.map((v) => <option key={v} value={v}>{INTERVAL_LABELS[v]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-1.5">Tag</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="production, staging…"
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text focus:outline-none focus:border-accent/40 transition-colors" />
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
        <input type="checkbox" id="alert" checked={alertOn} onChange={(e) => setAlertOn(e.target.checked)}
          className="accent-accent w-4 h-4" />
        <label htmlFor="alert" className="text-sm">Alert when down</label>
        {alertOn && (
          <input value={alertEmail} onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="alert@email.com"
            className="flex-1 ml-2 px-2.5 py-1.5 bg-bg border border-border rounded-lg text-xs text-text font-mono focus:outline-none focus:border-accent/40 transition-colors" />
        )}
      </div>

      {error && <p className="text-error text-xs">{error}</p>}

      <div className="flex justify-end gap-3">
        <button onClick={onDone} className="px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-card transition-colors">Cancel</button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-bg rounded-xl text-sm font-bold hover:bg-accent-dim disabled:opacity-50 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

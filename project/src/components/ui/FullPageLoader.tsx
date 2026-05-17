"use client";
// components/ui/FullPageLoader.tsx
import { Activity } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }} className="min-h-dvh bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Activity className="w-6 h-6 text-accent animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-ping" />
        </div>
        <p className="text-text-muted text-sm font-mono">Loading PingNexa…</p>
      </div>
    </div>
  );
}

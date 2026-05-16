"use client";
// hooks/usePingScheduler.ts
// ─────────────────────────────────────────────────────────────────────────────
// Manages one setInterval per active monitor.
// On each tick: pings via API route → saves log → updates Firestore → updates UI.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useCallback } from "react";
import { pingUrl } from "@/lib/pinger";
import { savePingLog, updateMonitorAfterPing } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { useMonitors } from "@/context/MonitorsContext";
import type { Monitor } from "@/types";

export function usePingScheduler() {
  const { user }         = useAuth();
  const { monitors, updateLocal } = useMonitors();

  // Map: monitorId → intervalId
  const intervals = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const executePing = useCallback(async (monitor: Monitor) => {
    if (!user) return;

    const res = await pingUrl(monitor.url);

    // Optimistic UI update
    updateLocal(monitor.id, {
      status:        res.success ? "up" : "down",
      lastLatencyMs: res.latencyMs,
      lastCheckedAt: new Date(),
    });

    // Persist to Firestore
    await Promise.all([
      savePingLog({
        monitorId:    monitor.id,
        userId:       user.uid,
        url:          monitor.url,
        result:       res.result,
        statusCode:   res.statusCode,
        latencyMs:    res.latencyMs,
        errorMessage: res.errorMessage,
      }),
      updateMonitorAfterPing(monitor.id, user.uid, {
        success:    res.success,
        latencyMs:  res.latencyMs,
        statusCode: res.statusCode,
      }),
    ]);
  }, [user, updateLocal]);

  useEffect(() => {
    if (!user) return;

    const active = monitors.filter((m) => !m.isPaused);

    // Clear stale intervals
    intervals.current.forEach((id, monId) => {
      if (!active.find((m) => m.id === monId)) {
        clearInterval(id);
        intervals.current.delete(monId);
      }
    });

    // Set up new intervals
    active.forEach((monitor) => {
      if (intervals.current.has(monitor.id)) return; // already scheduled
      const ms = monitor.intervalMinutes * 60 * 1000;

      // Ping immediately on mount (don't wait for first interval)
      executePing(monitor);

      const id = setInterval(() => executePing(monitor), ms);
      intervals.current.set(monitor.id, id);
    });

    return () => {
      intervals.current.forEach((id) => clearInterval(id));
      intervals.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitors, user]);
}

"use client";
// context/MonitorsContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getMonitors, createMonitor, deleteMonitor, toggleMonitorPause, updateMonitor } from "@/lib/firestore";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import type { Monitor, PingInterval } from "@/types";

interface MonitorsContextValue {
  monitors:        Monitor[];
  loading:         boolean;
  refresh:         () => Promise<void>;
  addMonitor:      (data: NewMonitorData) => Promise<string | null>;
  removeMonitor:   (id: string) => Promise<void>;
  pauseMonitor:    (id: string, isPaused: boolean) => Promise<void>;
  editMonitor:     (id: string, data: Partial<Monitor>) => Promise<void>;
  updateLocal:     (id: string, data: Partial<Monitor>) => void;
}

export interface NewMonitorData {
  name:            string;
  url:             string;
  intervalMinutes: PingInterval;
  alertOnDown:     boolean;
  alertEmail:      string;
  notesOrTag:      string;
}

const MonitorsContext = createContext<MonitorsContextValue>({
  monitors:      [],
  loading:       false,
  refresh:       async () => {},
  addMonitor:    async () => null,
  removeMonitor: async () => {},
  pauseMonitor:  async () => {},
  editMonitor:   async () => {},
  updateLocal:   () => {},
});

export function MonitorsProvider({ children }: { children: React.ReactNode }) {
  const { user }  = useAuth();
  const { showToast } = useToast();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading,  setLoading]  = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMonitors(user.uid);
      setMonitors(data);
    } catch (e) {
      showToast("Failed to load monitors", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => { refresh(); }, [refresh]);

  const addMonitor = async (data: NewMonitorData): Promise<string | null> => {
    if (!user) return null;
    try {
      const id = await createMonitor(user.uid, data);
      await refresh();
      showToast("Monitor created!", "success");
      return id;
    } catch (e) {
      showToast("Failed to create monitor", "error");
      console.error(e);
      return null;
    }
  };

  const removeMonitor = async (id: string) => {
    if (!user) return;
    try {
      await deleteMonitor(id, user.uid);
      setMonitors((prev) => prev.filter((m) => m.id !== id));
      showToast("Monitor deleted", "info");
    } catch (e) {
      showToast("Failed to delete monitor", "error");
      console.error(e);
    }
  };

  const pauseMonitor = async (id: string, isPaused: boolean) => {
    try {
      await toggleMonitorPause(id, isPaused);
      setMonitors((prev) =>
        prev.map((m) => m.id === id ? { ...m, isPaused, status: isPaused ? "paused" : "unknown" } : m)
      );
      showToast(isPaused ? "Monitor paused" : "Monitor resumed", "info");
    } catch (e) {
      showToast("Failed to update monitor", "error");
      console.error(e);
    }
  };

  const editMonitor = async (id: string, data: Partial<Monitor>) => {
    try {
      await updateMonitor(id, data);
      setMonitors((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
      showToast("Monitor updated", "success");
    } catch (e) {
      showToast("Failed to update monitor", "error");
      console.error(e);
    }
  };

  const updateLocal = (id: string, data: Partial<Monitor>) => {
    setMonitors((prev) => prev.map((m) => m.id === id ? { ...m, ...data } : m));
  };

  return (
    <MonitorsContext.Provider value={{ monitors, loading, refresh, addMonitor, removeMonitor, pauseMonitor, editMonitor, updateLocal }}>
      {children}
    </MonitorsContext.Provider>
  );
}

export const useMonitors = () => useContext(MonitorsContext);

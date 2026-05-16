"use client";
// context/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import type { Toast, ToastType } from "@/types";
import { randomId } from "@/lib/utils";

interface ToastContextValue {
  toasts:    Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismiss:   (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts:    [],
  showToast: () => {},
  dismiss:   () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = randomId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

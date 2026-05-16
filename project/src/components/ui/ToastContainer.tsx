"use client";
// components/ui/ToastContainer.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn }      from "@/lib/utils";
import type { Toast } from "@/types";

const icons = {
  success: CheckCircle,
  error:   XCircle,
  info:    Info,
  warn:    AlertTriangle,
};

const colors = {
  success: "border-success/30 bg-success/10 text-success",
  error:   "border-error/30 bg-error/10 text-error",
  info:    "border-accent/30 bg-accent/10 text-accent",
  warn:    "border-warn/30 bg-warn/10 text-warn",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const ref    = useRef<HTMLDivElement>(null);
  const Icon   = icons[toast.type];

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, x: 60, scale: 0.9 },
      { opacity: 1, x: 0,  scale: 1,  duration: 0.3, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card backdrop-blur-sm max-w-sm w-full",
        "glass-card",
        colors[toast.type]
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium text-text">{toast.message}</p>
      <button onClick={onDismiss} className="text-text-muted hover:text-text transition-colors p-0.5">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

"use client";
// components/ui/ConfirmDialog.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AlertTriangle } from "lucide-react";

interface Props {
  title:     string;
  message:   string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.4)" }
    );
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div ref={ref} className="glass-card rounded-2xl p-6 max-w-sm w-full border border-error/30 shadow-card">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-error/10 border border-error/20">
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-text-muted text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-card transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-bold bg-error text-white hover:bg-error/80 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

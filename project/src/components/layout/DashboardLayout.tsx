"use client";
// components/layout/DashboardLayout.tsx
import { useState } from "react";
import Navbar        from "@/components/layout/Navbar";
import Sidebar       from "@/components/layout/Sidebar";
import DashboardHome from "@/components/dashboard/DashboardHome";
import MonitorList   from "@/components/monitor/MonitorList";
import MonitorDetail from "@/components/monitor/MonitorDetail";
import ProfilePanel  from "@/components/auth/ProfilePanel";
import { usePingScheduler } from "@/hooks/usePingScheduler";

export type DashView = "home" | "monitors" | "detail" | "profile";

export default function DashboardLayout() {
  const [view,        setView]        = useState<DashView>("home");
  const [detailId,    setDetailId]    = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  usePingScheduler();

  const openDetail = (id: string) => { setDetailId(id); setView("detail"); };
  const backToList = () => { setView("monitors"); setDetailId(null); };

  return (
    <div
      className="min-h-dvh flex flex-col relative overflow-hidden"
      style={{ fontFamily: "'Lato', sans-serif", background: "var(--color-bg, #0d1117)" }}
    >
      {/* ── Animated aurora background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        {/* Orb 1 — teal/cyan, top-left */}
        <div
          className="absolute rounded-full opacity-20 blur-[120px]"
          style={{
            width: "55vw",
            height: "55vw",
            top: "-20%",
            left: "-15%",
            background: "radial-gradient(circle, #0ff5d4 0%, #00bcd4 40%, transparent 70%)",
            animation: "orb1 18s ease-in-out infinite alternate",
          }}
        />
        {/* Orb 2 — violet, bottom-right */}
        <div
          className="absolute rounded-full opacity-15 blur-[140px]"
          style={{
            width: "60vw",
            height: "60vw",
            bottom: "-25%",
            right: "-20%",
            background: "radial-gradient(circle, #7c3aed 0%, #4f46e5 45%, transparent 70%)",
            animation: "orb2 22s ease-in-out infinite alternate",
          }}
        />
        {/* Orb 3 — soft cyan, center */}
        <div
          className="absolute rounded-full opacity-10 blur-[100px]"
          style={{
            width: "35vw",
            height: "35vw",
            top: "35%",
            left: "35%",
            background: "radial-gradient(circle, #00e5ff 0%, #00bcd4 50%, transparent 70%)",
            animation: "orb3 26s ease-in-out infinite alternate",
          }}
        />
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes orb1 {
          0%   { transform: translate(0,    0)    scale(1);    }
          33%  { transform: translate(6vw,  4vh)  scale(1.08); }
          66%  { transform: translate(-4vw, 8vh)  scale(0.95); }
          100% { transform: translate(8vw, -5vh)  scale(1.05); }
        }
        @keyframes orb2 {
          0%   { transform: translate(0,    0)    scale(1);    }
          33%  { transform: translate(-8vw, -6vh) scale(1.1);  }
          66%  { transform: translate(5vw,  4vh)  scale(0.92); }
          100% { transform: translate(-6vw, 8vh)  scale(1.06); }
        }
        @keyframes orb3 {
          0%   { transform: translate(0,    0)    scale(1);    }
          50%  { transform: translate(-6vw, -8vh) scale(1.15); }
          100% { transform: translate(7vw,  6vh)  scale(0.88); }
        }
      `}</style>

      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onProfileClick={() => setView("profile")}
        currentView={view}
        setView={setView}
      />

      <div className="flex flex-1 relative gap-4 p-4">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={view}
          setView={setView}
        />
        <main className="flex-1 min-w-0" style={{ fontFamily: "'Lato', sans-serif" }}>
          {view === "home"     && <DashboardHome onViewMonitors={() => setView("monitors")} onOpenDetail={openDetail} />}
          {view === "monitors" && <MonitorList onOpenDetail={openDetail} />}
          {view === "detail"   && detailId && <MonitorDetail monitorId={detailId} onBack={backToList} />}
          {view === "profile"  && <ProfilePanel onBack={() => setView("home")} />}
        </main>
      </div>
    </div>
  );
}
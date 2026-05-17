"use client";
// components/layout/DashboardLayout.tsx
import { useState } from "react";
import Navbar         from "@/components/layout/Navbar";
import Sidebar        from "@/components/layout/Sidebar";
import DashboardHome  from "@/components/dashboard/DashboardHome";
import MonitorList    from "@/components/monitor/MonitorList";
import MonitorDetail  from "@/components/monitor/MonitorDetail";
import ProfilePanel   from "@/components/auth/ProfilePanel";
import { usePingScheduler } from "@/hooks/usePingScheduler";

export type DashView = "home" | "monitors" | "detail" | "profile";

export default function DashboardLayout() {
  const [view,       setView]       = useState<DashView>("home");
  const [detailId,   setDetailId]   = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  usePingScheduler();

  const openDetail = (id: string) => { setDetailId(id); setView("detail"); };
  const backToList = () => { setView("monitors"); setDetailId(null); };

  return (
    <div className="min-h-dvh bg-bg bg-grid flex flex-col" style={{ fontFamily: "'Lato', sans-serif" }}>
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
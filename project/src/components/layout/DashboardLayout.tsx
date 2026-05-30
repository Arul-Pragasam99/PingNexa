"use client";
// components/layout/DashboardLayout.tsx
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
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

  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  usePingScheduler();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Fade in all orbs on mount ──
      gsap.fromTo(
        [orb1Ref.current, orb2Ref.current, orb3Ref.current],
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 3,
          ease: "power2.out",
          stagger: 0.8,
        }
      );

      // ── Orb 1 — slow breathe, top-left ──
      gsap.to(orb1Ref.current, {
        scale: 1.18,
        opacity: 0.28,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3,
      });

      // ── Orb 2 — offset breathe, bottom-right ──
      gsap.to(orb2Ref.current, {
        scale: 1.14,
        opacity: 0.22,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 4.5,
      });

      // ── Orb 3 — slowest breathe, center ──
      gsap.to(orb3Ref.current, {
        scale: 1.22,
        opacity: 0.20,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 6,
      });

      // ── Subtle random drift for each orb using gsap timeline ──
      const driftOrb = (
        el: HTMLDivElement | null,
        xRange: number,
        yRange: number,
        duration: number
      ) => {
        if (!el) return;
        const tl = gsap.timeline({ repeat: -1 });
        for (let i = 0; i < 6; i++) {
          tl.to(el, {
            x: (Math.random() - 0.5) * xRange,
            y: (Math.random() - 0.5) * yRange,
            duration: duration + Math.random() * 10,
            ease: "sine.inOut",
          });
        }
        // return to origin
        tl.to(el, { x: 0, y: 0, duration: duration, ease: "sine.inOut" });
      };

      driftOrb(orb1Ref.current, 80, 60, 18);
      driftOrb(orb2Ref.current, 70, 80, 22);
      driftOrb(orb3Ref.current, 60, 50, 26);

    }, orbsRef);

    return () => ctx.revert();
  }, []);

  const openDetail = (id: string) => { setDetailId(id); setView("detail"); };
  const backToList = () => { setView("monitors"); setDetailId(null); };

  return (
    <>
      {/* Dark base background */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0,
          background: "#04070f",
          zIndex: -2,
        }}
      />

      {/* Aurora orbs — GSAP controlled */}
      <div
        ref={orbsRef}
        aria-hidden
        style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
      >
        {/* Orb 1 — teal, top-left */}
        <div
          ref={orb1Ref}
          style={{
            position: "absolute",
            width: "65vw", height: "65vw",
            top: "-25%", left: "-20%",
            borderRadius: "50%",
            background: "radial-gradient(circle, #0ff5d4 0%, #00e5ff 35%, transparent 70%)",
            filter: "blur(140px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />

        {/* Orb 2 — cyan, bottom-right */}
        <div
          ref={orb2Ref}
          style={{
            position: "absolute",
            width: "60vw", height: "60vw",
            bottom: "-20%", right: "-15%",
            borderRadius: "50%",
            background: "radial-gradient(circle, #00bcd4 0%, #00e5ff 40%, transparent 70%)",
            filter: "blur(160px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />

        {/* Orb 3 — accent, center */}
        <div
          ref={orb3Ref}
          style={{
            position: "absolute",
            width: "40vw", height: "40vw",
            top: "30%", left: "35%",
            borderRadius: "50%",
            background: "radial-gradient(circle, #00e5ff 0%, #0ff5d4 50%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />

        {/* Noise grain */}
        <div style={{
          position: "absolute", inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
      </div>

      {/* Main layout */}
      <div
        className="min-h-dvh flex flex-col relative"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
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
    </>
  );
}
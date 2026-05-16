"use client";
// components/layout/Navbar.tsx
import { Activity, Menu, Bell, User } from "lucide-react";
import { useAuth }   from "@/context/AuthContext";
import { useMonitors } from "@/context/MonitorsContext";
import Image         from "next/image";
import type { DashView } from "./DashboardLayout";

interface Props {
  onMenuClick:    () => void;
  onProfileClick: () => void;
  currentView:    DashView;
  setView:        (v: DashView) => void;
}

export default function Navbar({ onMenuClick, onProfileClick }: Props) {
  const { user, profile } = useAuth();
  const { monitors }      = useMonitors();

  const downCount = monitors.filter((m) => m.status === "down").length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-surface/80 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-card transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="font-bold text-sm hidden sm:block">RenderPing</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Down alert badge */}
        {downCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 border border-error/30 text-error text-xs font-mono">
            <Bell className="w-3 h-3" />
            {downCount} down
          </div>
        )}

        {/* Profile button */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border hover:border-accent/30 bg-card/50 hover:bg-card transition-all group"
        >
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={profile?.name ?? "User"}
              width={26}
              height={26}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-accent" />
            </div>
          )}
          <span className="text-xs font-medium text-text-muted group-hover:text-text transition-colors hidden sm:block max-w-[120px] truncate">
            {profile?.name ?? user?.email ?? "Account"}
          </span>
        </button>
      </div>
    </header>
  );
}

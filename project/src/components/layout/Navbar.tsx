"use client";
// components/layout/Navbar.tsx
import { Activity, Menu, Bell, User } from "lucide-react";
import { useAuth }     from "@/context/AuthContext";
import { useMonitors } from "@/context/MonitorsContext";
import Image           from "next/image";
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
    <header
      style={{
        fontFamily: "'Lato', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        height: "3.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "rgba(4, 9, 20, 0.97)",
      }}
    >
      {/* ── Left ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Hamburger — mobile only */}
        <div className="lg:hidden">
          <button
            onClick={onMenuClick}
            style={{
              padding: "0.5rem", borderRadius: "0.5rem",
              color: "rgba(255,255,255,0.45)",
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            <Menu style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem",
            background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity style={{ width: "0.875rem", height: "0.875rem", color: "#00e5ff" }} />
          </div>
          <span className="hidden sm:block" style={{ fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>
            PingNexa
          </span>
        </div>
      </div>

      {/* ── Right ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {downCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            padding: "0.25rem 0.625rem", borderRadius: "9999px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171", fontSize: "0.75rem", fontFamily: "monospace",
          }}>
            <Bell style={{ width: "0.75rem", height: "0.75rem" }} />
            {downCount} down
          </div>
        )}

        <button
          onClick={onProfileClick}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            paddingLeft: "0.5rem", paddingRight: "0.75rem",
            paddingTop: "0.375rem", paddingBottom: "0.375rem",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
          }}
        >
          {user?.photoURL ? (
            <Image src={user.photoURL} alt={profile?.name ?? "User"} width={26} height={26} style={{ borderRadius: "9999px" }} />
          ) : (
            <div style={{
              width: "1.5rem", height: "1.5rem", borderRadius: "9999px",
              background: "rgba(0,229,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User style={{ width: "0.875rem", height: "0.875rem", color: "#00e5ff" }} />
            </div>
          )}
          <span className="hidden sm:block" style={{
            fontSize: "0.75rem", fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {profile?.name ?? user?.email ?? "Account"}
          </span>
        </button>
      </div>
    </header>
  );
}
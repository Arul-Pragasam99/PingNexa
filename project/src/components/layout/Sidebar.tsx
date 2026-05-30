"use client";
// components/layout/Sidebar.tsx
import { LayoutDashboard, Radio, User, X, LogOut } from "lucide-react";
import { useAuth }  from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { DashView } from "./DashboardLayout";

interface Props {
  open:        boolean;
  onClose:     () => void;
  currentView: DashView;
  setView:     (v: DashView) => void;
}

const navItems = [
  { id: "home"     as DashView, label: "Dashboard", icon: LayoutDashboard },
  { id: "monitors" as DashView, label: "Monitors",  icon: Radio },
  { id: "profile"  as DashView, label: "Profile",   icon: User },
];

export default function Sidebar({ open, onClose, currentView, setView }: Props) {
  const { signOutUser } = useAuth();
  const { showToast }   = useToast();

  const handleNav = (v: DashView) => { setView(v); onClose(); };
  const handleSignOut = async () => { await signOutUser(); showToast("Signed out", "info"); };

  const isActive = (id: DashView) =>
    currentView === id || (currentView === "detail" && id === "monitors");

  const navBtnStyle = (id: DashView): React.CSSProperties => ({
    width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "0.625rem 0.75rem", borderRadius: "0.75rem",
    fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
    border: isActive(id) ? "1px solid rgba(0,229,255,0.2)" : "1px solid transparent",
    background: isActive(id) ? "rgba(0,229,255,0.08)" : "transparent",
    color: isActive(id) ? "#00e5ff" : "rgba(255,255,255,0.5)",
    transition: "all 0.15s",
    fontFamily: "'Lato', sans-serif",
  });

  const sidebarContent = (
    <aside
      style={{
        width: "13rem",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "rgba(6, 12, 28, 0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1rem",
        fontFamily: "'Lato', sans-serif",
        alignSelf: "flex-start",
        position: "sticky",
        top: "1rem",
      }}
    >
      <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => handleNav(id)} style={navBtnStyle(id)}>
            <Icon style={{ width: "1rem", height: "1rem", flexShrink: 0 }} />
            {label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.625rem 0.75rem", borderRadius: "0.75rem",
            fontSize: "0.875rem", fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            background: "transparent", border: "none", cursor: "pointer",
            fontFamily: "'Lato', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LogOut style={{ width: "1rem", height: "1rem" }} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP: always visible static sidebar ── */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* ── MOBILE: slide-in drawer + backdrop ── */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {open && (
          <div
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {/* Drawer panel */}
        <div
          style={{
            position: "fixed", top: 0, left: 0,
            height: "100%", width: "15rem",
            zIndex: 50,
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            display: "flex", flexDirection: "column",
            background: "rgba(6, 12, 28, 0.98)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Mobile header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#fff", fontFamily: "'Lato', sans-serif" }}>
              Menu
            </span>
            <button
              onClick={onClose}
              style={{
                padding: "0.375rem", borderRadius: "0.5rem", border: "none",
                color: "rgba(255,255,255,0.4)", background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center",
              }}
            >
              <X style={{ width: "1rem", height: "1rem" }} />
            </button>
          </div>

          {/* Mobile nav */}
          <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleNav(id)} style={navBtnStyle(id)}>
                <Icon style={{ width: "1rem", height: "1rem", flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile sign out */}
          <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={handleSignOut}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.625rem 0.75rem", borderRadius: "0.75rem",
                fontSize: "0.875rem", fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              <LogOut style={{ width: "1rem", height: "1rem" }} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
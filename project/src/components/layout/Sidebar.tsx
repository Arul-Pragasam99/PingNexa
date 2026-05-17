"use client";
// components/layout/Sidebar.tsx
import { LayoutDashboard, Radio, User, X, LogOut } from "lucide-react";
import { useAuth }    from "@/context/AuthContext";
import { useToast }   from "@/context/ToastContext";
import { cn }         from "@/lib/utils";
import type { DashView } from "./DashboardLayout";

interface Props {
  open:       boolean;
  onClose:    () => void;
  currentView: DashView;
  setView:    (v: DashView) => void;
}

const navItems = [
  { id: "home"     as DashView, label: "Dashboard",  icon: LayoutDashboard },
  { id: "monitors" as DashView, label: "Monitors",   icon: Radio },
  { id: "profile"  as DashView, label: "Profile",    icon: User },
];

export default function Sidebar({ open, onClose, currentView, setView }: Props) {
  const { signOutUser } = useAuth();
  const { showToast }   = useToast();

  const handleNav = (v: DashView) => { setView(v); onClose(); };

  const handleSignOut = async () => {
    await signOutUser();
    showToast("Signed out", "info");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          style={{ fontFamily: "'Lato', sans-serif" }}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-60 bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0 lg:w-56",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border lg:hidden">
          <span className="font-bold text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-card">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 pt-6">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                currentView === id || (currentView === "detail" && id === "monitors")
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-muted hover:text-text hover:bg-card"
              )}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-error hover:bg-error/5 transition-all"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
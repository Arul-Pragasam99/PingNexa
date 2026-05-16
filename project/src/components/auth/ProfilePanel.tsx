"use client";
// components/auth/ProfilePanel.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ArrowLeft, User, Mail, Activity, Clock, Shield } from "lucide-react";
import { useAuth }    from "@/context/AuthContext";
import { useMonitors } from "@/context/MonitorsContext";
import { formatDateTime } from "@/lib/utils";

interface Props { onBack: () => void; }

export default function ProfilePanel({ onBack }: Props) {
  const { user, profile, signOutUser } = useAuth();
  const { monitors } = useMonitors();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current?.querySelectorAll(".prof-item") ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const up     = monitors.filter((m) => m.status === "up").length;
  const down   = monitors.filter((m) => m.status === "down").length;
  const paused = monitors.filter((m) => m.isPaused).length;

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <div className="prof-item flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-border text-text-muted hover:text-text hover:border-accent/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-extrabold">Profile</h1>
      </div>

      {/* Avatar + name */}
      <div className="prof-item glass-card rounded-2xl p-6 flex items-center gap-5">
        {user?.photoURL ? (
          <Image src={user.photoURL} alt="avatar" width={72} height={72} className="rounded-2xl border-2 border-accent/20" />
        ) : (
          <div className="w-18 h-18 rounded-2xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
            <User className="w-8 h-8 text-accent" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-extrabold">{profile?.name ?? "Anonymous"}</h2>
          <div className="flex items-center gap-1.5 text-text-muted text-sm mt-1">
            <Mail className="w-3.5 h-3.5" />
            {profile?.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
            <Shield className="w-3 h-3" />
            Signed in via Google
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="prof-item glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold text-sm">Account Details</h3>
        </div>
        <div className="divide-y divide-border/50">
          {[
            { label: "User ID",      value: profile?.uid,     icon: Shield },
            { label: "Member since", value: formatDateTime(profile?.createdAt ?? null), icon: Clock },
            { label: "Last login",   value: formatDateTime(profile?.lastLoginAt ?? null), icon: Clock },
            { label: "Total pings",  value: profile?.totalPings?.toString() ?? "0", icon: Activity },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
              <Icon className="w-4 h-4 text-text-muted flex-shrink-0" />
              <span className="text-text-muted text-sm w-32 flex-shrink-0">{label}</span>
              <span className="font-mono text-sm truncate">{value ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monitor stats */}
      <div className="prof-item grid grid-cols-3 gap-3">
        {[
          { label: "Up",     value: up,                  color: "text-success" },
          { label: "Down",   value: down,                color: "text-error" },
          { label: "Paused", value: paused,              color: "text-warn" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <div className={`text-2xl font-extrabold font-mono ${color}`}>{value}</div>
            <div className="text-xs text-text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div className="prof-item">
        <button
          onClick={signOutUser}
          className="w-full py-3 rounded-2xl border border-error/30 text-error text-sm font-bold hover:bg-error/5 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

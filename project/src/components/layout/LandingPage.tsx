"use client";
// components/layout/LandingPage.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Activity, Zap, Shield, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const features = [
  { icon: Zap,      title: "Custom Intervals",   desc: "Ping every minute to every 24 hours. You control the schedule." },
  { icon: Activity, title: "Live Status",        desc: "Real-time latency tracking and uptime percentages per monitor." },
  { icon: Shield,   title: "Secure by Default",  desc: "Google Sign-In via Firebase. Your data belongs to you only." },
  { icon: Clock,    title: "Full History",        desc: "Every ping logged with timestamp, latency, and HTTP status code." },
];

export default function LandingPage() {
  const { signInGoogle } = useAuth();
  const { showToast }    = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const heroRef   = useRef<HTMLDivElement>(null);
  const featRef   = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero stagger
      gsap.fromTo(
        heroRef.current?.querySelectorAll(".hero-item") ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
      // Feature cards
      gsap.fromTo(
        featRef.current?.querySelectorAll(".feat-card") ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.9 }
      );
    });
    
    // Cleanup on unmount
    return () => {
      ctx.revert();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSignIn = async () => {
    // Prevent multiple sign-in attempts
    if (isSigningIn) {
      console.log("Sign in already in progress");
      return;
    }

    setIsSigningIn(true);
    
    // Track if sign in completed
    let signInCompleted = false;
    
    // Simple interval to check and reset after 3 seconds if still signing in
    // This ensures button doesn't stay stuck
    intervalRef.current = setInterval(() => {
      if (isSigningIn && !signInCompleted) {
        console.log("Resetting button after timeout");
        signInCompleted = true;
        setIsSigningIn(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 3000);
    
    try { 
      await signInGoogle();
      // Sign in successful
      signInCompleted = true;
      setIsSigningIn(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      showToast("Welcome to PingNexa! 🎉", "success");
    } catch (error: any) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (error?.code === 'auth/popup-blocked') {
        showToast("Popup blocked! Please allow popups for this site.", "error");
        setIsSigningIn(false);
        signInCompleted = true;
      } else if (error?.code === 'auth/popup-closed-by-user') {
        // Reset immediately when popup is closed
        setIsSigningIn(false);
        signInCompleted = true;
        showToast("Sign in cancelled. Try again!", "info");
      } else if (error?.code === 'auth/cancelled-popup-request') {
        // Reset immediately
        setIsSigningIn(false);
        signInCompleted = true;
        showToast("Sign in cancelled. Try again!", "info");
      } else {
        console.error("Sign in error:", error);
        showToast("Sign-in failed. Try again.", "error");
        setIsSigningIn(false);
        signInCompleted = true;
      }
    }
  };

  return (
    <main className="min-h-dvh bg-bg bg-grid relative overflow-hidden flex flex-col">
      {/* Top radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-violet/5 blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-text">PingNexa</span>
        </div>
        {/* Sign in button removed from here */}
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="hero-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Built for Render free-tier apps
        </div>

        <h1 className="hero-item text-5xl sm:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-3xl">
          Keep your apps{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet">
            alive
          </span>
          .
        </h1>

        <p className="hero-item text-lg text-text-muted max-w-xl mb-10 leading-relaxed">
          PingNexa pings your free-tier sites on a custom schedule — so they never
          go to sleep when you need them most.
        </p>

        <div className="hero-item flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-accent ${
              isSigningIn
                ? "bg-accent/50 text-bg/50 cursor-not-allowed"
                : "bg-accent text-bg hover:bg-accent-dim"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            {isSigningIn ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        {/* Live counter decoration */}
        <div className="hero-item mt-16 grid grid-cols-3 gap-8 text-center">
          {[["∞", "Sites monitored"], ["1min", "Min interval"], ["100%", "Free to use"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-accent font-mono">{val}</div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featRef} className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feat-card glass-card glow-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6 text-center text-xs text-text-muted">
        PingNexa — open & free
      </footer>
    </main>
  );
}
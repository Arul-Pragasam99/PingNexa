"use client";
// components/layout/LandingPage.tsx - Enhanced Motion Effects (No Grid)
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Activity, Zap, Shield, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const features = [
  { icon: Zap,      title: "Custom Intervals",   desc: "Ping every minute to every 24 hours. You control the schedule." },
  { icon: Activity, title: "Live Status",        desc: "Real-time latency tracking and uptime percentages per monitor." },
  { icon: Shield,   title: "Secure by Default",  desc: "Secure authentication. Your data belongs to you only." },
  { icon: Clock,    title: "Full History",        desc: "Every ping logged with timestamp, latency, and HTTP status code." },
];

export default function LandingPage() {
  const { signInGoogle } = useAuth();
  const { showToast }    = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const heroRef   = useRef<HTMLDivElement>(null);
  const featRef   = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ========== ENHANCED MOTION EFFECTS (NO GRID) ==========
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize particles on resize
      particles = [];
      const particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };
    
    const draw = () => {
      if (!ctx || !canvas) return;
      time += 0.005;
      
      const w = canvas.width;
      const h = canvas.height;
      
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "rgba(10, 10, 15, 0.95)");
      gradient.addColorStop(1, "rgba(5, 5, 10, 0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      
      // Draw floating particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity * (0.5 + Math.sin(time * 2 + particle.x) * 0.3)})`;
        ctx.fill();
        
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = w;
        if (particle.x > w) particle.x = 0;
        if (particle.y < 0) particle.y = h;
        if (particle.y > h) particle.y = 0;
      });
      
      // Draw animated floating orbs
      for (let i = 0; i < 5; i++) {
        const angle = time * 0.5 + i * Math.PI * 2 / 5;
        const x = w * 0.5 + Math.sin(angle) * (w * 0.3);
        const y = h * 0.5 + Math.cos(angle * 0.7) * (h * 0.2);
        const radius = Math.sin(time * 0.8 + i) * 30 + 50;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(168, 85, 247, ${0.05 + Math.sin(time + i) * 0.02})`);
        grad.addColorStop(1, "rgba(168, 85, 247, 0)");
        ctx.fillStyle = grad;
        ctx.fill();
      }
      
      // Draw animated wave lines (replacing grid)
      ctx.beginPath();
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yOffset = h * (0.3 + i * 0.2);
        for (let x = 0; x < w; x += 20) {
          const y = yOffset + Math.sin(x * 0.01 + time * 1.5 + i * 2) * 30 + Math.cos(x * 0.02 + time * 0.8) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 + Math.sin(time + i) * 0.03})`;
        ctx.stroke();
      }
      
      // Draw connecting lines between nearby particles
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.03 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(draw);
    };
    
    window.addEventListener("resize", resize);
    resize();
    draw();
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll(".hero-item") ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        featRef.current?.querySelectorAll(".feat-card") ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.9 }
      );
    });
    
    return () => {
      ctx.revert();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    let signInCompleted = false;
    
    intervalRef.current = setInterval(() => {
      if (isSigningIn && !signInCompleted) {
        signInCompleted = true;
        setIsSigningIn(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 3000);
    
    try { 
      await signInGoogle();
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
        setIsSigningIn(false);
        signInCompleted = true;
        showToast("Sign in cancelled. Try again!", "info");
      } else if (error?.code === 'auth/cancelled-popup-request') {
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
    <main className="min-h-dvh bg-bg relative overflow-hidden flex flex-col" style={{ fontFamily: "Lato, sans-serif" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/40 to-bg/90 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-border/50 backdrop-blur-sm bg-bg/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-text">PingNexa</span>
        </div>
      </nav>

      <section ref={heroRef} className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="hero-item inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/5 text-accent text-xs font-mono mb-8 backdrop-blur-sm">
          🚀 99.9% Uptime Guaranteed
        </div>

        <h1 className="hero-item text-5xl sm:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-3xl">
          Keep your apps{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-dim animate-gradient-x">
            alive
          </span>
          .
        </h1>

        <p className="hero-item text-lg text-text-muted max-w-xl mb-10 leading-relaxed">
          PingNexa pings your sites on a custom schedule — so they never
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

        <div className="hero-item mt-16 grid grid-cols-3 gap-8 text-center">
          {[["∞", "Sites monitored"], ["1min", "Min interval"], ["100%", "Free to use"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-accent font-mono">{val}</div>
              <div className="text-xs text-text-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section ref={featRef} className="relative z-10 px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feat-card glass-card glow-border rounded-2xl p-6 backdrop-blur-sm bg-bg/40 hover:bg-bg/60 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/50 py-6 text-center text-xs text-text-muted backdrop-blur-sm bg-bg/20">
        PingNexa — open & free
      </footer>
    </main>
  );
}
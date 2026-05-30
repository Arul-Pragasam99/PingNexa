import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        bg: "#04070f",
        surface: "#080d18",
        card: "#0c1322",
        border: "#162035",
        accent: {
          DEFAULT: "#00e5ff",
          dim: "#00b4cc",
          glow: "rgba(0,229,255,0.15)",
        },
        violet: {
          DEFAULT: "#8b5cf6",
          glow: "rgba(139,92,246,0.15)",
        },
        success: "#22d3a5",
        error: "#f43f5e",
        warn: "#f59e0b",
        text: {
          DEFAULT: "#e1e8f5",
          muted: "#5a7090",
          dim: "#2a3d55",
        },
      },
      animation: {
        pulse_slow: "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        ping_ring: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)"   },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
      boxShadow: {
        accent:  "0 0 30px rgba(0,229,255,0.2), 0 0 60px rgba(0,229,255,0.05)",
        card:    "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        glow_sm: "0 0 12px rgba(0,229,255,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
// app/layout.tsx
import type { Metadata } from "next";
import { Syne, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider }     from "@/context/AuthContext";
import { ToastProvider }    from "@/context/ToastContext";
import { MonitorsProvider } from "@/context/MonitorsContext";
import ToastContainer       from "@/components/ui/ToastContainer";
import RegisterSW           from "@/components/pwa/RegisterSW";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


const syne = Syne({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const geistMono = Geist_Mono({
  subsets:  ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title:       "PingNexa — Keep Your Sites Alive",
  description: "Smart uptime monitoring that pings your Render (and any) free-tier apps so they never sleep.",
  keywords:    ["uptime monitor", "render.com", "ping", "free tier", "site monitor"],
  openGraph: {
    title:       "PingNexa",
    description: "Keep your Render apps awake with intelligent pinging.",
    type:        "website",
  },
  // ✅ Favicon config
  icons: {
    icon:     "/icons/PingNexa.png",
    shortcut: "/icons/PingNexa.png",
    apple:    "/icons/PingNexa.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${syne.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5a4" />
        {/* ✅ Favicon */}
        <link rel="icon" href="/icons/PingNexa.png" type="image/png" />
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/icons/PingNexa.png" />
      </head>
      <body className="font-sans bg-bg text-text antialiased">
        <ToastProvider>
          <AuthProvider>
            <MonitorsProvider>
              {children}
              <RegisterSW />
              <ToastContainer />
            </MonitorsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
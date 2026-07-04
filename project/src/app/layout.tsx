// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Syne, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { MonitorsProvider } from "@/context/MonitorsContext";
import ToastContainer from "@/components/ui/ToastContainer";
import RegisterSW from "@/components/pwa/RegisterSW";
// ❌ REMOVE THIS IMPORT
// import InstallPrompt from "@/components/pwa/InstallPrompt";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PingNexa — Keep Your Sites Alive",
  description: "Smart uptime monitoring that pings your Render (and any) free-tier apps so they never sleep.",
  keywords: ["uptime monitor", "render.com", "ping", "free tier", "site monitor"],
  openGraph: {
    title: "PingNexa",
    description: "Keep your Render apps awake with intelligent pinging.",
    type: "website",
    url: "https://pingnexa.com",
    siteName: "PingNexa",
  },
  icons: {
    icon: "/icons/PingNexa.png",
    shortcut: "/icons/PingNexa.png",
    apple: "/icons/PingNexa.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PingNexa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5a4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="icon" href="/icons/PingNexa.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/PingNexa.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PingNexa" />
        <meta name="msapplication-TileColor" content="#0ea5a4" />
        <meta name="msapplication-TileImage" content="/icons/PingNexa.png" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans bg-bg text-text antialiased">
        <ToastProvider>
          <AuthProvider>
            <MonitorsProvider>
              {children}
              <RegisterSW />
              {/* ❌ REMOVE THIS LINE */}
              {/* <InstallPrompt /> */}
              <ToastContainer />
              <Analytics />
              <SpeedInsights />
            </MonitorsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
// app/layout.tsx
import type { Metadata } from "next";
import { Syne, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider }     from "@/context/AuthContext";
import { ToastProvider }    from "@/context/ToastContext";
import { MonitorsProvider } from "@/context/MonitorsContext";
import ToastContainer       from "@/components/ui/ToastContainer";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${geistMono.variable}`}>
      <body className="font-sans bg-bg text-text antialiased">
        <ToastProvider>
          <AuthProvider>
            <MonitorsProvider>
              {children}
              <ToastContainer />
            </MonitorsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

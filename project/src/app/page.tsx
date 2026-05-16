"use client";
// app/page.tsx
import { useAuth }     from "@/context/AuthContext";
import LandingPage     from "@/components/layout/LandingPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FullPageLoader  from "@/components/ui/FullPageLoader";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user)   return <LandingPage />;
  return <DashboardLayout />;
}

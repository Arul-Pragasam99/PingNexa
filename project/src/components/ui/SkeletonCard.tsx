"use client";
// components/ui/SkeletonCard.tsx
import { cn } from "@/lib/utils";

interface Props { height?: string; }

export default function SkeletonCard({ height = "h-16" }: Props) {
  return (
    <div className={cn("skeleton rounded-2xl w-full", height)} />
  );
}

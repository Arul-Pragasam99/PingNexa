"use client";
// hooks/useGsapReveal.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generic GSAP reveal hook. Attaches a ref to any element and runs
// a staggered fade-up animation on mount.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Options {
  delay?:   number;
  y?:       number;
  stagger?: number;
  selector?: string; // if provided, animates children matching selector
}

export function useGsapReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null);
  const { delay = 0, y = 24, stagger = 0.08, selector } = opts;

  useEffect(() => {
    if (!ref.current) return;
    const targets = selector
      ? ref.current.querySelectorAll(selector)
      : [ref.current];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger, delay }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, y, stagger, selector]);

  return ref;
}

/** Pulse ping ring animation on a DOM element */
export function usePingPulse(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !active) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        scale:    1.4,
        opacity:  0,
        duration: 1.2,
        repeat:   -1,
        ease:     "power1.out",
      });
    });
    return () => ctx.revert();
  }, [active]);

  return ref;
}

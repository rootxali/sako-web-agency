"use client";
import { useEffect, useRef } from "react";

export default function SmoothScroll() {
  const lenisRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenisRef.current = new Lenis({ lerp: 0.08, smoothWheel: true });
      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
    };
  }, []);

  return null;
}

"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
    });
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 1000,
        background: "linear-gradient(90deg,#8b6914,#c9a84c,#e8c56a)",
        transformOrigin: "left", transform: "scaleX(0)",
      }}
    />
  );
}

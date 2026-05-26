"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let isMagnetic = false;
    let magneticTarget: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnter = (e: MouseEvent) => {
      document.body.classList.add("hovering");
      const target = e.currentTarget as HTMLElement;
      if (target.getAttribute("data-cursor") === "magnetic") {
        isMagnetic = true;
        magneticTarget = target;
      }
    };

    const onLeave = () => {
      document.body.classList.remove("hovering");
      isMagnetic = false;
      magneticTarget = null;
    };

    document.addEventListener("mousemove", onMove);

    const updateHoverEvents = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter as EventListener);
        el.addEventListener("mouseleave", onLeave as EventListener);
      });
    };

    updateHoverEvents();
    const observer = new MutationObserver(updateHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    let raf: number;
    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (isMagnetic && magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Pull towards the center of the element
        targetX = centerX + (mouseX - centerX) * 0.35;
        targetY = centerY + (mouseY - centerY) * 0.35;
      }

      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      dotX += (targetX - dotX) * 0.35;
      dotY += (targetY - dotY) * 0.35;

      gsap.set(ring, { x: ringX, y: ringY });
      gsap.set(dot, { x: dotX, y: dotY });
      
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="cursor" aria-hidden>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

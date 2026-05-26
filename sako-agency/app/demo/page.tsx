"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function DemoPage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background text-foreground">
      <main className="relative z-10 flex min-h-[120vh] w-full flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-neutral-400 mb-8 uppercase">
          Scroll down to reveal
        </h1>
        <div className="w-[1px] h-32 bg-gradient-to-b from-neutral-400 to-transparent" />
      </main>

      <CinematicFooter />
    </div>
  );
}

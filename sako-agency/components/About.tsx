"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "./ScrollFloat";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { stat: "100%", label: "Custom Solutions", desc: "No templates. No shortcuts. Every pixel is intentional." },
  { stat: "∞", label: "Results-Driven", desc: "Performance is the only metric we measure ourselves against." },
  { stat: "01", label: "Future-Proof Tech", desc: "Built for the next decade — not the trends of last quarter." },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".pillar-card", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pillars-row", start: "top 80%" },
      });
      gsap.fromTo(headRef.current, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: headRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="grain" style={{ position: "relative", background: "var(--black-3)", overflow: "hidden", width: "100%" }}>
      {/* Diagonal top edge */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "10vh", background: "var(--black)", clipPath: "polygon(0 0,100% 0,100% 0,0 100%)" }} />

      <div className="container section-pad">
        {/* Heading */}
        <div ref={headRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "10vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Why SAKO</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1vh" }}>
            <ScrollFloat
              animationDuration={1.2}
              ease="back.inOut(2)"
              scrollStart="top bottom+=10%"
              scrollEnd="bottom center"
              stagger={0.02}
              textClassName="font-display"
              containerClassName="margin-0"
            >
              Business not growing?
            </ScrollFloat>
            <ScrollFloat
              animationDuration={1.2}
              ease="back.inOut(2)"
              scrollStart="top bottom+=20%"
              scrollEnd="bottom center"
              stagger={0.02}
              textClassName="font-display gradient-gold"
              containerClassName="margin-0"
            >
              We fix that.
            </ScrollFloat>
          </div>
          <p style={{ maxWidth: "min(90vw, 640px)", margin: "3vh auto 0", fontSize: "clamp(0.95rem, 1.1vw, 1.25rem)", lineHeight: 1.8, color: "var(--cream-dim)" }}>
            For founders who&apos;ve been burned before — and want a partner that actually delivers results.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="pillars-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%, 280px),1fr))", gap: "1px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.08)" }}>
          {pillars.map((p, i) => (
            <div
              key={p.label}
              className="pillar-card flex flex-col"
              style={{ background: "var(--black-3)", padding: "clamp(32px, 8vh, 64px) clamp(20px, 4vw, 48px)", textAlign: "center", position: "relative", transition: "background 0.5s", height: "100%" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--black-4)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--black-3)")}
            >
              <div className="top-line" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: "1px", width: "0", background: "var(--gold)", transition: "width 0.7s var(--transition)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(3.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1, minHeight: "10vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "3vh" }}>{p.stat}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(11px, 0.8vw, 14px)", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cream)", marginBottom: "2vh" }}>{p.label}</div>
                <p style={{ fontSize: "clamp(13px, 0.9vw, 16px)", color: "var(--cream-dim)", lineHeight: 1.7 }}>{p.desc}</p>
              </div>
              <div style={{ marginTop: "auto", paddingTop: "4vh" }}>
                <div style={{ height: "1px", background: "rgba(201,168,76,0.15)" }} />
                <div style={{ marginTop: "2vh", fontFamily: "'Outfit',sans-serif", fontSize: "clamp(10px, 0.7vw, 12px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.3)" }}>0{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagonal bottom edge */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "10vh", background: "var(--black)", clipPath: "polygon(0 100%,100% 0,100% 100%)" }} />
    </section>
  );
}

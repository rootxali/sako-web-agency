"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Discover", desc: "Deep audit of your brand, competitors, market position, and growth bottlenecks. We listen before we speak.", duration: "Week 1–2" },
  { n: "02", title: "Strategize", desc: "A custom roadmap built for measurable, compounding wins. No generic playbooks — only what moves the needle.", duration: "Week 2–3" },
  { n: "03", title: "Build", desc: "Engineering, design, and content crafted entirely in-house. Precision-built, performance-tested, client-reviewed.", duration: "Week 3–8" },
  { n: "04", title: "Scale", desc: "Launch, optimize, automate, and expand — without ceiling. We stay on as your strategic partner.", duration: "Ongoing" },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, duration: 1.5, ease: "power3.out",
        scrollTrigger: { trigger: lineRef.current, start: "top 80%" },
      });
      gsap.fromTo(".process-item", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.18, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" style={{ background: "var(--black)", position: "relative", width: "100%" }}>
      <div className="container section-pad">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— The Process</span>
          <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05, maxWidth: "min(90vw, 700px)" }}>
            Four steps. Zero{" "}
            <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              guesswork.
            </em>
          </h2>
        </div>

        {/* Horizontal connector line */}
        <div style={{ position: "relative", marginBottom: "0" }}>
          <div
            ref={lineRef}
            style={{ position: "absolute", top: "0.6vh", left: "0.5vw", right: "0.5vw", height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.4) 20%,rgba(201,168,76,0.4) 80%,transparent)", transformOrigin: "left" }}
          />

          <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%, 200px),1fr))", gap: "clamp(16px, 2vw, 24px)" }}>
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="process-item"
                style={{ padding: "0 clamp(8px, 2vw, 24px) 6vh 0", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                onMouseEnter={e => { const dot = e.currentTarget.querySelector(".process-dot") as HTMLElement; if (dot) { dot.style.background = "var(--gold)"; dot.style.transform = "scale(1.6)"; } }}
                onMouseLeave={e => { const dot = e.currentTarget.querySelector(".process-dot") as HTMLElement; if (dot) { dot.style.background = "var(--black)"; dot.style.transform = "scale(1)"; } }}
              >
                {/* Dot */}
                <div className="process-dot" style={{ width: "0.8vw", height: "0.8vw", minWidth: "8px", minHeight: "8px", borderRadius: "50%", border: "1px solid var(--gold)", background: "var(--black)", marginBottom: "4vh", transition: "background 0.4s, transform 0.4s" }} />

                {/* Number */}
                <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(3rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1, background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "2vh" }}>{s.n}</div>

                <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(20px, 1.8vw, 36px)", fontWeight: 400, marginBottom: "1.5vh" }}>{s.title}</h3>
                <p style={{ fontSize: "clamp(13px, 0.9vw, 16px)", color: "var(--cream-dim)", lineHeight: 1.8, marginBottom: "3vh" }}>{s.desc}</p>

                {/* Duration badge */}
                <span style={{ display: "inline-block", textAlign: "center", minWidth: "clamp(60px, 6vw, 80px)", fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", border: "1px solid rgba(201,168,76,0.2)", padding: "clamp(4px, 0.6vh, 8px) clamp(10px, 1.2vw, 16px)", borderRadius: "100vw" }}>{s.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

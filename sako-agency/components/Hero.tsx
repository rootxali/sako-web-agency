"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown } from "lucide-react";
import DotField from "./DotField";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function AnimatedStat({ value, suffix = "", label, duration = 3000 }: { value: number; suffix?: string; label: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = 0;
    const end = value;
    const ctx = gsap.context(() => {
      gsap.fromTo({ val: start },
        { val: start },
        {
          val: end,
          duration: duration / 1000,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
          onUpdate: function () {
            const v = Math.round(this.targets()[0].val);
            setDisplay(v);
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [value, duration]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(18px, 2.2vw, 32px)", fontWeight: 300, color: "var(--gold)", lineHeight: 1 }}>
        {display}{suffix}
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--cream-dim)", marginTop: "0.5vh" }}>{label}</div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const particlePositions = useMemo(
    () =>
      [...Array(6)].map((_, i) => ({
        left: 20 + i * 15,
        top: 20 + Math.random() * 50,
        size: 2 + (i % 3),
        delay: i * 0.4,
        opacity: 0.2 + i * 0.05,
      })),
    []
  );

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.out" })
      .fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power2.out" }, "-=1.5")
      .fromTo(orb1Ref.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 2, ease: "power3.out" }, "-=1.5")
      .fromTo(orb2Ref.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 2, ease: "power3.out" }, "-=1.8")
      .fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=1")
      .fromTo(".hero-line", { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.1, stagger: 0.12, ease: "power4.out" }, "-=0.5")
      .fromTo(".hero-sub-word", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: "power2.out" }, "-=0.6")
      .fromTo(btnsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
      .fromTo(badgeRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
      .fromTo(scrollRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");

    // Parallax animations
    gsap.to(orb1Ref.current, {
      y: "20vh",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(orb2Ref.current, {
      y: "-15vh",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(ringRef.current, {
      y: "10vh",
      rotate: 90,
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(headRef.current, {
      y: "5vh",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true }
    });
  }, []);

  const scrollToWork = () => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  const stats = [
    { value: 240, suffix: "%", label: "Avg. revenue growth", duration: 3000 },
    { value: 80, suffix: "+", label: "Brands transformed", duration: 2800 },
    { value: 4, suffix: "", label: "Countries served", duration: 2000 },
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="grain"
      style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "var(--black)", width: "100%" }}
    >
      {/* Ambient background */}
      <div ref={bgRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        <div ref={orb1Ref} style={{ position: "absolute", top: "10%", right: "15%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", filter: "blur(4vw)" }} />
        <div ref={orb2Ref} style={{ position: "absolute", bottom: "5%", left: "-5%", width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", filter: "blur(6vw)" }} />
      </div>

      {/* Interactive Dot Grid overlay */}
      <div ref={gridRef} style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "auto" }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={24}
          bulgeStrength={80}
          glowRadius={250}
          sparkle={true}
          waveAmplitude={0.5}
        />
      </div>

      {/* Rotating ring */}
      <div ref={ringRef} className="animate-spin-slow" style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", width: "25vw", height: "25vw", border: "1px solid rgba(201,168,76,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "18vw", height: "18vw", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "12vw", height: "12vw", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "50%" }} />
        </div>
      </div>

      {/* Stats badge — top right */}
      <div ref={badgeRef} style={{ position: "absolute", top: "20vh", right: "4vw", gap: "2vw", opacity: 0 }} className="hidden lg:flex">
        {stats.map(s => (
          <AnimatedStat key={s.label} {...s} />
        ))}
        {/* Floating particles behind stats */}
        <div ref={counterRef} style={{ position: "absolute", inset: "-40px", pointerEvents: "none", zIndex: -1 }}>
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="counter-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `card-float ${3 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "15vh", paddingBottom: "10vh", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div ref={eyebrowRef} style={{ opacity: 0, marginBottom: "4vh" }}>
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(8px, 1vw, 14px)" }}>
            <span style={{ width: "clamp(16px, 2vw, 28px)", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            Future-Forward Digital Agency · Est. 2024
          </span>
        </div>

        <div ref={headRef} style={{ overflow: "hidden", marginBottom: "4vh", width: "100%" }}>
          {[
            { text: "We Don't Just", italic: false },
            { text: "Build.", italic: false },
            { text: "We Evolve.", italic: true, gold: true },
          ].map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <div
                className="hero-line"
                style={{
                  fontFamily: "'Cormorant',serif",
                  fontSize: "clamp(4rem,9vw,9rem)",
                  fontWeight: line.italic ? 400 : 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  fontStyle: line.italic ? "italic" : "normal",
                  ...(line.gold ? {
                    background: "linear-gradient(135deg,#e8c56a 0%,#c9a84c 50%,#8b6914 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  } : { color: "var(--cream)" }),
                }}
              >
                {line.text}
              </div>
            </div>
          ))}
        </div>

        <div
          ref={subRef}
          style={{ maxWidth: "min(90vw, 560px)", fontSize: "clamp(0.95rem, 1.2vw, 1.5rem)", lineHeight: 1.8, color: "var(--cream-dim)", marginBottom: "6vh", fontWeight: 300 }}
        >
          {"Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.".split(" ").map((word, i) => (
            <span key={i} className="hero-sub-word" style={{ display: "inline-block", opacity: 0, marginRight: "0.25em" }}>
              {word}
            </span>
          ))}
        </div>

        <div ref={btnsRef} style={{ display: "flex", gap: "clamp(10px, 1.2vw, 16px)", flexWrap: "wrap", justifyContent: "center", opacity: 0 }}>
          <button
            onClick={scrollToContact}
            data-cursor="magnetic"
            style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 1vw, 12px)", background: "var(--gold)", color: "var(--black)", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "clamp(11px, 0.8vw, 14px)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "clamp(14px, 2.5vh, 20px) clamp(20px, 3vw, 36px)", borderRadius: "100vw", border: "none", cursor: "none", transition: "transform 0.4s var(--transition),box-shadow 0.4s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 20px 60px -10px rgba(201,168,76,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span>Start Growing</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>

          <button
            onClick={scrollToWork}
            data-cursor="magnetic"
            style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 1vw, 12px)", background: "transparent", color: "var(--gold)", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: "clamp(11px, 0.8vw, 14px)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "clamp(13px, 2.4vh, 20px) clamp(18px, 2.8vw, 32px)", borderRadius: "100vw", border: "1px solid rgba(201,168,76,0.3)", cursor: "none", transition: "background 0.4s,border-color 0.4s,transform 0.4s var(--transition)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.07)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <span>See Our Work</span>
          </button>
        </div>

        {/* Horizontal rule + descriptor */}
        <div style={{ marginTop: "10vh", paddingTop: "5vh", borderTop: "1px solid rgba(201,168,76,0.1)", display: "flex", gap: "3vw", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {["Web Design", "UI / UX", "SEO", "Brand Strategy", "AI Automation"].map(tag => (
            <span key={tag} style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.7vw, 11px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{ position: "absolute", bottom: "5vh", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1vh", opacity: 0 }}>
        <ChevronDown size={16} color="rgba(201,168,76,0.5)" className="animate-float" />
        <div style={{ width: "1px", height: "8vh", background: "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)" }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.4)" }}>Scroll</span>
      </div>
    </section>
  );
}

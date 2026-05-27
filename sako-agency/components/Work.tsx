"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const fallbackProjects = [
  { id: 1, num: "001", title: "VALUE TECH", category: "Laptop Store & Electronics", services: "Web · SEO · E-Commerce", year: "2025", tag: "Case Study", url: "https://valuetech.pk", gradient: "linear-gradient(135deg,#1a0e00 0%,#0a0a0a 60%,#2a1500 100%)", accent: "#c9a84c", span: "col-2", result: "+340% sales growth", image: "/assest/valuetech.png" },
  { id: 2, num: "002", title: "ALI AHMED", category: "Personal Brand", services: "UI/UX · Development", year: "2025", tag: "Featured", url: "#", gradient: "linear-gradient(135deg,#0a0a1a 0%,#0a0a0a 60%,#1a0a1a 100%)", accent: "#7c6ac9", span: "", result: "Modern portfolio", image: "/assest/aliahmed.jpg" },
  { id: 3, num: "003", title: "ATIF MUMTAZ", category: "Creative Studio", services: "Brand · Web · Identity", year: "2025", tag: "Featured", url: "#", gradient: "linear-gradient(135deg,#0a1a0a 0%,#0a0a0a 60%,#0a1a0a 100%)", accent: "#6ac97c", span: "", result: "Full brand identity", image: "/assest/atifmumtaz.png" },
];

interface WorkData {
  id?: string;
  title: string;
  category: string | null;
  services: string | null;
  year: string | null;
  url: string | null;
  gradient: string | null;
  accent: string | null;
  result: string | null;
  tag: string | null;
  image?: string | null;
}

interface ProjectItem {
  id: number;
  num: string;
  title: string;
  category: string;
  services: string;
  year: string;
  tag: string;
  url: string;
  gradient: string;
  accent: string;
  result: string;
  image: string;
  layout: { span: string; height: string };
}

const bentoLayouts = [
  { span: "lg:col-span-2", height: "min-h-[50vh] lg:min-h-[55vh]" },
  { span: "col-span-1", height: "min-h-[44vh]" },
  { span: "col-span-1 lg:row-span-2", height: "min-h-[44vh] lg:min-h-[80vh]" },
  { span: "col-span-1", height: "min-h-[44vh]" },
  { span: "lg:col-span-2", height: "min-h-[50vh] lg:min-h-[52vh]" },
  { span: "col-span-1", height: "min-h-[44vh]" },
  { span: "col-span-1", height: "min-h-[44vh]" },
  { span: "col-span-1 lg:row-span-2", height: "min-h-[44vh] lg:min-h-[78vh]" },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const projectImages = ["/assest/valuetech.png", "/assest/aliahmed.jpg", "/assest/atifmumtaz.png", "/Aichat.png", "/ui&ux.png", "/webdevelopment.png"];

  useEffect(() => {
    fetch("/api/work")
      .then((r) => r.json())
      .then((data: WorkData[]) => {
        if (data.length > 0) {
          setProjects(data.map((w, i) => ({
            id: i + 1,
            num: String(i + 1).padStart(3, "0"),
            title: w.title,
            category: w.category || "",
            services: w.services || "",
            year: w.year || "",
            tag: w.tag || "Case Study",
            url: w.url || "#",
            gradient: w.gradient || "linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%)",
            accent: w.accent || "#c9a84c",
            result: w.result || "",
            image: w.image || projectImages[i % projectImages.length],
            layout: bentoLayouts[i % bentoLayouts.length],
          })));
        } else {
          setProjects(fallbackProjects.map((p, i) => ({ ...p, layout: bentoLayouts[i % bentoLayouts.length] })));
        }
      })
      .catch(() => {
        setProjects(fallbackProjects.map((p, i) => ({ ...p, layout: bentoLayouts[i % bentoLayouts.length] })));
      });
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".bento-work-card");
      if (cards) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            stagger: 0.08,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [projects]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <section ref={sectionRef} id="work" className="grain" style={{ position: "relative", background: "var(--black-2)", overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", top: "-15%", left: "30%", width: "50vw", height: "40vh", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", filter: "blur(6vw)", pointerEvents: "none" }} />

      <div className="container section-pad">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh", gap: "2vh" }}
        >
          <div>
            <span className="eyebrow" style={{ display: "block", marginBottom: "2.5vh" }}>— Selected Work</span>
            <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
              Brands we&apos;ve{" "}
              <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>evolved.</em>
            </h2>
          </div>
          <div className="section-divider" style={{ maxWidth: "200px", margin: "1vh auto" }} />
          <p style={{ maxWidth: "560px", fontSize: "clamp(14px, 0.9vw, 17px)", color: "var(--cream-dim)", lineHeight: 1.7 }}>
            Every project is a partnership. Here&apos;s proof of what happens when strategy meets craft.
          </p>
        </motion.div>

        <div ref={gridRef} className="bento-work-grid" style={{ position: "relative" }}>
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bento-work-card ${p.layout.span} ${p.layout.height}`}
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                background: "var(--black-3)",
              }}
              onMouseMove={handleMouseMove}
            >
              {/* Background Image */}
              <div
                className="work-image"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${p.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 0,
                }}
              />

              {/* Gradient Overlay */}
              <div
                className="work-gradient-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                }}
              />

              {/* Glass Overlay */}
              <div
                className="work-glass-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                }}
              />

              {/* Ambient Color Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  right: "-10%",
                  width: "60%",
                  height: "60%",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${p.accent}20 0%, transparent 70%)`,
                  filter: "blur(4vw)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Content */}
              <div className="work-content" style={{ position: "relative", zIndex: 2, padding: "clamp(16px, 2.5vw, 32px)" }}>
                {/* Tag */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1.5vh" }}>
                  <span style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: "clamp(8px, 0.55vw, 10px)",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.5)",
                    border: "1px solid rgba(245,240,232,0.12)",
                    padding: "4px 12px",
                    borderRadius: "100vw",
                    backdropFilter: "blur(8px)",
                    background: "rgba(255,255,255,0.03)",
                  }}>
                    {p.tag}
                  </span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(8px, 0.55vw, 10px)", letterSpacing: "0.2em", color: "rgba(245,240,232,0.3)" }}>
                    {p.year}
                  </span>
                </div>

                {/* Category */}
                <div style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "clamp(9px, 0.6vw, 11px)",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: p.accent,
                  marginBottom: "0.8vh",
                }}>
                  {p.category}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'Cormorant',serif",
                  fontSize: "clamp(1.6rem, 2.8vw, 2.6rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  marginBottom: "0.8vh",
                  color: "#f5f0e8",
                }}>
                  {p.title}
                </h3>

                {/* Services + Result */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}>
                  <span style={{ fontSize: "clamp(11px, 0.75vw, 13px)", color: "rgba(245,240,232,0.5)" }}>
                    {p.services}
                  </span>
                  <span className="work-result" style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: "clamp(10px, 0.65vw, 12px)",
                    fontWeight: 600,
                    color: p.accent,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    letterSpacing: "0.1em",
                  }}>
                    {p.result} <ArrowUpRight size={12} strokeWidth={2} />
                  </span>
                </div>
              </div>

              {/* Decorative Number */}
              <div style={{
                position: "absolute",
                top: "2vh",
                right: "1.5vw",
                fontFamily: "'Cormorant',serif",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                fontWeight: 300,
                color: "rgba(201,168,76,0.08)",
                lineHeight: 1,
                userSelect: "none",
                zIndex: 2,
              }}>
                {p.num}
              </div>
            </a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginTop: "8vh", textAlign: "center" }}
        >
          <p style={{ fontSize: "clamp(13px, 0.8vw, 16px)", color: "var(--cream-dim)", marginBottom: "3vh" }}>
            Curious what we can do for your brand?
          </p>
          <motion.button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            data-cursor="magnetic"
            whileHover={{ scale: 1.04, background: "rgba(201,168,76,0.08)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(6px, 0.8vw, 12px)",
              background: "transparent",
              color: "var(--gold)",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 600,
              fontSize: "clamp(11px, 0.7vw, 13px)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "clamp(12px, 2vh, 18px) clamp(18px, 2.5vw, 32px)",
              borderRadius: "100vw",
              border: "1px solid rgba(201,168,76,0.3)",
              cursor: "none",
              transition: "border-color 0.4s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
          >
            Start a Project <ArrowUpRight size={14} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

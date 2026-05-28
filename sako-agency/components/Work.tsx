"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { initBentoGrids } from "@/bento-grid";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
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
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
  result: string;
  backgroundImage?: string;
  background?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: 1,
    num: "001",
    title: "VALUE TECH",
    category: "Laptop Store & Electronics",
    services: "Web · SEO · E-Commerce",
    year: "2026",
    tag: "Case Study",
    url: "https://valuetech.pk",
    gradient: "linear-gradient(135deg, #1a0e00 0%, #0a0a0a 60%, #2a1500 100%)",
    accent: "#c9a84c",
    col: 0,
    row: 0,
    colSpan: 2,
    rowSpan: 2,
    result: "+340% sales growth",
    backgroundImage: "/assest/valuetech.png",
  },
  {
    id: 2,
    num: "002",
    title: "PROJECT SPARK",
    category: "Creative Brand Refresh",
    services: "Web · Design · Brand",
    year: "2025",
    tag: "Case Study",
    url: "https://example2.com",
    gradient: "linear-gradient(135deg, #001520 0%, #0a0a0a 70%, #001025 100%)",
    accent: "#4c8ec9",
    col: 2,
    row: 0,
    colSpan: 1,
    rowSpan: 1,
    result: "Sample metric",
    backgroundImage: "/webdevelopment.png",
  },
  {
    id: 3,
    num: "003",
    title: "PROJECT ROCKET",
    category: "Web · UX · Motion",
    services: "Web · UX · Motion",
    year: "2024",
    tag: "Concept",
    url: "https://example3.com",
    gradient: "linear-gradient(135deg, #0a1200 0%, #0a0a0a 70%, #121800 100%)",
    accent: "#7ec94c",
    col: 2,
    row: 1,
    colSpan: 1,
    rowSpan: 2,
    result: "Sample achievement",
    backgroundImage: "/Aichat.png",
  },
  {
    id: 4,
    num: "004",
    title: "PROJECT FLARE",
    category: "Design · Web · Branding",
    services: "Design · Web · Branding",
    year: "2024",
    tag: "Case Study",
    url: "https://example4.com",
    gradient: "linear-gradient(135deg, #0a0014 0%, #0a0a0a 70%, #120020 100%)",
    accent: "#9b4cc9",
    col: 0,
    row: 2,
    colSpan: 2,
    rowSpan: 1,
    result: "Sample result",
    backgroundImage: "/ui&ux.png",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CTAButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "ghost" | "outline";
}

function CTAButton({ onClick, children, variant = "ghost" }: CTAButtonProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "clamp(6px, 0.8vw, 12px)",
    background: hovered ? "rgba(201,168,76,0.07)" : "transparent",
    color: "var(--gold, #c9a84c)",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 600,
    fontSize: "clamp(11px, 0.7vw, 13px)",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding:
      variant === "outline"
        ? "clamp(12px, 2vh, 18px) clamp(18px, 2.5vw, 32px)"
        : "0",
    borderRadius: variant === "outline" ? "100vw" : "0",
    border:
      variant === "outline"
        ? `1px solid ${hovered ? "var(--gold, #c9a84c)" : "rgba(201,168,76,0.3)"}`
        : "none",
    cursor: "pointer",
    transition: "background 0.4s, border-color 0.4s",
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={baseStyle}
      aria-label="Navigate to contact section"
    >
      {children}
    </button>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project: p }: ProjectCardProps) {
  const bgStyle: React.CSSProperties = p.backgroundImage
    ? {
        backgroundImage: `url('${p.backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(1.08) saturate(1.1)",
      }
    : { background: p.gradient };

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${p.title} case study`}
      className={[
        "work-card",
        "bento-cell",
        "relative",
        "overflow-hidden",
        "rounded-[4px]",
        "border",
        "border-[rgba(201,168,76,0.1)]",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ textDecoration: "none", display: "block", ...bgStyle }}
      data-bento-cell={JSON.stringify({
        id: `project-${p.id}`,
        label: p.title,
        sublabel: p.category,
        accent: p.accent,
        tag: p.tag,
      })}
      data-bento-col={p.col}
      data-bento-row={p.row}
      data-bento-col-span={p.colSpan}
      data-bento-row-span={p.rowSpan}
      tabIndex={0}
    >
      <div className="bento-cell__glow" aria-hidden="true" />
      <div className="bento-cell__inner">
        <span className="bento-cell__tag">{p.tag}</span>
        <h3 className="bento-cell__label">{p.title}</h3>
        <p className="bento-cell__sublabel">{p.category}</p>
        <div className="bento-cell__rule" aria-hidden="true" />
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Register plugin inside useEffect — safe for SSR/Next.js environments
    gsap.registerPlugin(ScrollTrigger);

    const grids = initBentoGrids(sectionRef.current ?? document);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-card",
        { y: 100, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: {
            each: 0.08,
            from: "start",
          },
          duration: 0.78,
          ease: "expo.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".work-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      grids.forEach((grid) => grid.destroy());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      style={{
        background: "var(--black-2, #0a0a0a)",
        position: "relative",
        width: "100%",
      }}
    >
      <div className="container section-pad">
        {/* ── Section header ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "8vh",
            gap: "3vh",
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{ display: "block", marginBottom: "3vh" }}
            >
              — Selected Work
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
              }}
            >
              Brands we&apos;ve{" "}
              <em
                style={{
                  background:
                    "linear-gradient(135deg, #e8c56a, #c9a84c, #8b6914)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                evolved.
              </em>
            </h2>
          </div>

          <CTAButton onClick={scrollToContact} variant="ghost">
            All Projects <ArrowUpRight size={14} aria-hidden="true" />
          </CTAButton>
        </div>

        {/* ── Project grid ── */}
        <div
          className="work-grid bento-grid"
          data-bento-grid
          data-bento-columns="3"
          data-bento-rows="3"
          data-bento-gap="20"
          data-bento-column-factor="2.4"
          data-bento-row-factor="1.8"
          data-bento-duration="450"
          data-bento-dim-opacity="0.35"
          data-bento-inner-scale="1.04"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ marginTop: "6vh", textAlign: "center" }}>
          <p
            style={{
              fontSize: "clamp(13px, 0.8vw, 16px)",
              color: "var(--cream-dim, rgba(245,240,232,0.5))",
              marginBottom: "3vh",
            }}
          >
            Curious what we can do for your brand?
          </p>
          <CTAButton onClick={scrollToContact} variant="outline">
            Start a Project <ArrowUpRight size={14} aria-hidden="true" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
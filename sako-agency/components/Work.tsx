"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const fallbackProjects = [
  { id: 1, num: "001", title: "VALUE TECH", category: "Laptop Store & Electronics", services: "Web · SEO · E-Commerce", year: "2025", tag: "Case Study", url: "https://valuetech.pk", gradient: "linear-gradient(135deg,#1a0e00 0%,#0a0a0a 60%,#2a1500 100%)", accent: "#c9a84c", span: "col-2", result: "+340% sales growth", image: "/assest/valuetech.png" },
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

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState(fallbackProjects);

  const projectImages = ["/assest/valuetech.png", "/assest/aliahmed.jpg", "/assest/atifmumtaz.png"];

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
            span: i % 3 === 0 ? "col-2" : "",
          })) as typeof fallbackProjects);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".work-card", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".work-grid", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} id="work" style={{ background: "var(--black-2)", position: "relative", width: "100%" }}>
      <div className="container section-pad">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh", gap: "3vh" }}>
          <div>
            <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Selected Work</span>
            <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
              Brands we've{" "}
              <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>evolved.</em>
            </h2>
          </div>
          <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} data-cursor="magnetic" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(4px, 0.5vw, 8px)", background: "none", border: "none", fontFamily: "'Syne',sans-serif", fontSize: "clamp(11px, 0.7vw, 13px)", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", cursor: "none" }}>
            All Projects <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="work-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[40vh] gap-3">
          {projects.map(p => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className={`work-card relative overflow-hidden rounded-[4px] border border-[rgba(201,168,76,0.1)] cursor-none ${p.span === "col-2" ? "md:col-span-2 col-span-1" : "col-span-1"}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: p.gradient }} />
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
              <div className="card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,0.4)" }} />
              <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "20vw", height: "20vw", borderRadius: "50%", background: `radial-gradient(circle, ${p.accent}18 0%, transparent 70%)`, filter: "blur(3vw)" }} />
              <div style={{ position: "absolute", top: "2vh", left: "clamp(10px, 1.5vw, 20px)", display: "flex", gap: "clamp(4px, 0.5vw, 8px)", alignItems: "center", zIndex: 2 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(245,240,232,0.15)", padding: "clamp(4px, 0.6vh, 8px) clamp(8px, 1vw, 14px)", borderRadius: "100vw", backdropFilter: "blur(8px)" }}>{p.tag}</span>
              </div>
              <div style={{ position: "absolute", top: "2vh", right: "clamp(10px, 1.5vw, 20px)", zIndex: 2 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", letterSpacing: "0.2em", color: "rgba(245,240,232,0.3)" }}>{p.year}</span>
              </div>

              <div className="card-content" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(14px, 2vw, 28px)", zIndex: 2, color: "#f5f0e8" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 11px)", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: p.accent, marginBottom: "1vh" }}>{p.category}</div>
                <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1vh", color: "#f5f0e8" }}>{p.title}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "clamp(4px, 0.5vw, 8px)" }}>
                  <span style={{ fontSize: "clamp(11px, 0.8vw, 14px)", color: "rgba(245,240,232,0.6)" }}>{p.services}</span>
                  <span className="card-reveal" style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(10px, 0.7vw, 13px)", fontWeight: 600, color: p.accent, display: "flex", alignItems: "center", gap: "clamp(3px, 0.3vw, 6px)", letterSpacing: "0.1em" }}>
                    {p.result} <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: "2vh", right: "1.5vw", fontFamily: "'Cormorant',serif", fontSize: "6vw", fontWeight: 300, color: "rgba(201,168,76,0.15)", lineHeight: 1, userSelect: "none", zIndex: 1 }}>{p.num}</div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: "6vh", textAlign: "center" }}>
          <p style={{ fontSize: "clamp(13px, 0.8vw, 16px)", color: "var(--cream-dim)", marginBottom: "3vh" }}>Curious what we can do for your brand?</p>
          <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} data-cursor="magnetic" style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 12px)", background: "transparent", color: "var(--gold)", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: "clamp(11px, 0.7vw, 13px)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "clamp(12px, 2vh, 18px) clamp(18px, 2.5vw, 32px)", borderRadius: "100vw", border: "1px solid rgba(201,168,76,0.3)", cursor: "none", transition: "background 0.4s,border-color 0.4s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.07)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}>
            Start a Project <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

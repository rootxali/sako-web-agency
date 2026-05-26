"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Layers, Search, Palette, Sparkles, Brain } from "lucide-react";
import MagicBento from "./MagicBento";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = { Code2, Layers, Search, Palette, Sparkles, Brain };

const fallbackServices = [
  { icon: Code2, num: "01", name: "Web Development", tagline: "No Limits & Fast", desc: "Custom-engineered websites that convert visitors into revenue. Performance-first, pixel-perfect.", backgroundImage: "webdevelopment.png" },
  { icon: Layers, num: "02", name: "UI / UX Design", tagline: "Inevitable Interfaces", desc: "Interfaces that feel designed for the user, not the designer. Clean, considered, conversion-led.", backgroundImage: "ui&ux.png" },
  { icon: Search, num: "03", name: "SEO & Growth", tagline: "Rank Where It Matters", desc: "Compound organic growth that compounds month over month. We play the long game.", backgroundImage: "webdevelopment.png" },
  { icon: Palette, num: "04", name: "AI Integration", tagline: "Identity That Lasts", desc: "Visual identities that command attention and build instant recognition across every touchpoint.", backgroundImage: "Aichat.png" },
  { icon: Sparkles, num: "05", name: "Conversion Strategy", tagline: "Funnels That Convert", desc: "Offer positioning, page flow, and CRO-driven structure designed to turn traffic into qualified leads.", backgroundImage: "webdevelopment.png" },
  { icon: Brain, num: "06", name: "Brand & Graphics", tagline: "Automate at Scale", desc: "Embed AI into your operations to personalize, automate, and ship 10× faster.", backgroundImage: "webdevelopment.png" },
];

interface ServiceData {
  id?: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  backgroundImage: string | null;
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: ServiceData[]) => {
        if (data.length > 0) {
          setServices(data.map((s, i) => ({
            icon: (s.icon && iconMap[s.icon]) || Code2,
            num: String(i + 1).padStart(2, "0"),
            name: s.name,
            tagline: s.tagline || "",
            desc: s.description || "",
            backgroundImage: s.backgroundImage || "webdevelopment.png",
          })) as typeof fallbackServices);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".magic-bento-card", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".bento-section", start: "top 80%" },
      });
      gsap.fromTo(".svc-heading", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-heading", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [services]);

  return (
    <section ref={sectionRef} id="services" style={{ background: "var(--black)", position: "relative", width: "100%" }}>
      <div className="container section-pad">
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div className="svc-heading">
            <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Capabilities</span>
            <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
              What we <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>do</em> — and do better.
            </h2>
          </div>
          <p style={{ width: "min(92vw, 720px)", fontSize: "clamp(0.9rem, 1vw, 1.1rem)", color: "var(--cream-dim)", lineHeight: 1.8 }}>
            Six disciplines. One studio. Everything your brand needs to dominate.
          </p>
        </div>

        <MagicBento
          cards={services.map(s => ({
            title: s.name,
            description: s.desc,
            label: s.tagline,
            icon: <s.icon size={24} strokeWidth={1.5} />,
            ...(s.backgroundImage && { backgroundImage: s.backgroundImage }),
          }))}
          glowColor="201, 168, 76"
          particleCount={15}
          spotlightRadius={400}
        />
      </div>
    </section>
  );
}

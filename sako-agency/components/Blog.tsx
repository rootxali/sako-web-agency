"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const fallbackPosts = [
  {
    image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Color Psychology in UI: How to Choose the Right Palette",
    category: "UI/UX design",
    slug: "color-psychology-ui",
    createdAt: "2026-05-12",
  },
  {
    image: "https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Understanding Typography: Crafting a Visual Voice for Your Brand",
    category: "Branding",
    slug: "typography-visual-voice",
    createdAt: "2026-04-28",
  },
  {
    image: "https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Design Thinking in Practice: How to Solve Real User Problems",
    category: "Product Design",
    slug: "design-thinking-practice",
    createdAt: "2026-04-15",
  },
];

interface Post {
  id?: string;
  title: string;
  slug: string;
  category: string | null;
  image: string | null;
  createdAt: string;
}

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) setPosts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-card", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".blog-grid", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [posts]);

  return (
    <section ref={sectionRef} id="blog" style={{ background: "var(--black-2)", position: "relative", width: "100%" }}>
      <div className="container section-pad">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Knowledge Hub</span>
          <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
            Latest from the{" "}
            <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Studio.</em>
          </h2>
          <p style={{ maxWidth: "min(90vw, 640px)", margin: "3vh auto 0", fontSize: "clamp(0.9rem, 1.1vw, 1.2rem)", color: "var(--cream-dim)", lineHeight: 1.8 }}>
            Stay ahead of the curve with fresh content on code, design, startups, and everything in between.
          </p>
        </div>

        <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(20px, 3vw, 36px)" }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card group" style={{ cursor: "none", textDecoration: "none", color: "inherit" }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "clamp(10px, 1.5vw, 20px)", aspectRatio: "16/10", marginBottom: "3vh", border: "1px solid rgba(201,168,76,0.06)", transition: "border-color 0.4s" }} className="group-hover:border-[rgba(201,168,76,0.2)]">
                <img
                  src={post.image || ""}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                  className="group-hover:scale-105"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)", opacity: 0.6, transition: "opacity 0.4s" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5vh" }}>
                {post.category && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.7vw, 12px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.8 }}>{post.category}</span>}
                <span style={{ fontSize: "clamp(11px, 0.8vw, 14px)", color: "rgba(245,240,232,0.4)", fontFamily: "'Outfit', sans-serif" }}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(20px, 2vw, 36px)", fontWeight: 400, color: "var(--cream)", lineHeight: 1.2, marginBottom: "2.5vh", transition: "color 0.4s" }} className="group-hover:text-[var(--gold)]">
                {post.title}
              </h3>

              <span
                data-cursor="magnetic"
                style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 12px)", background: "none", border: "none", color: "var(--cream-dim)", fontSize: "clamp(10px, 0.7vw, 12px)", fontFamily: "'Syne',sans-serif", textTransform: "uppercase", letterSpacing: "0.15em", transition: "color 0.3s" }}
                className="group-hover:text-white"
              >
                Read Article <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "8vh", textAlign: "center" }}>
          <Link
            href="/blog"
            data-cursor="magnetic"
            style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 12px)", background: "transparent", color: "var(--gold)", fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: "clamp(11px, 0.7vw, 13px)", letterSpacing: "0.15em", textTransform: "uppercase", padding: "clamp(12px, 2vh, 18px) clamp(18px, 2.5vw, 32px)", borderRadius: "100vw", border: "1px solid rgba(201,168,76,0.3)", cursor: "none", transition: "all 0.4s", textDecoration: "none" }}
          >
            Visit the Blog <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

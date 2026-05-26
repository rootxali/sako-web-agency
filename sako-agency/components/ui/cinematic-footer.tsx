"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const STYLES = `
.sako-footer-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@keyframes sako-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
}

@keyframes sako-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes sako-heartbeat {
  0%,  100% { transform: scale(1);   }
  15%, 45%  { transform: scale(1.3); }
  30%        { transform: scale(1);   }
}

@keyframes sako-fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@keyframes sako-slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
}

.sako-aurora {
  position: absolute;
  width: 80vw;
  height: 55vh;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201,168,76,0.12) 0%,
    rgba(120,80,20,0.08) 45%,
    transparent 70%
  );
  animation: sako-breathe 9s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

.sako-grid {
  position: absolute;
  inset: 0;
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right,  rgba(240,236,228,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(240,236,228,0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  pointer-events: none;
  z-index: 0;
}

.sako-bg-text {
  position: absolute;
  bottom: -4vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 22vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgba(201,168,76,0.08);
  background: linear-gradient(180deg, rgba(201,168,76,0.1) 0%, transparent 55%);
  -webkit-background-clip: text;
  background-clip: text;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.sako-marquee-band {
  position: relative;
  z-index: 10;
  border-top:    1px solid rgba(201,168,76,0.15);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  background: rgba(8,7,6,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5vh 0;
  transform: rotate(-1.5deg) scaleX(1.08);
  overflow: hidden;
  margin-top: 6vh;
}

.sako-marquee-track {
  display: flex;
  width: max-content;
  animation: sako-marquee 38s linear infinite;
  font-size: clamp(10px, 0.7vw, 18px);
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(201,168,76,0.55);
}

.sako-marquee-item {
  display: flex;
  align-items: center;
  gap: 3vw;
  padding: 0 1.5vw;
  white-space: nowrap;
}

.sako-headline {
  font-family: 'Cormorant', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(3rem, 9vw, 6rem);
  line-height: 1.05;
  text-align: center;
  letter-spacing: -0.02em;
  background: linear-gradient(160deg, #f0ece4 0%, #c9a84c 60%, rgba(201,168,76,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: sako-fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
}

.sako-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.8vw;
  border-radius: 100vw;
  border: 1px solid rgba(201,168,76,0.2);
  background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  color: rgba(240,236,228,0.75);
  transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
}

.sako-pill:hover {
  border-color: rgba(201,168,76,0.6);
  background: linear-gradient(145deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%);
  color: #f0ece4;
  transform: scale(1.04);
}

.sako-pill-lg { padding: 2vh 2.5vw; font-size: clamp(13px, 0.9vw, 22px); }
.sako-pill-sm {
  padding: 1.2vh 1.5vw;
  font-size: clamp(11px, 0.7vw, 18px);
  letter-spacing: 0.04em;
  color: rgba(240,236,228,0.45);
}
.sako-pill-sm:hover { color: rgba(240,236,228,0.85); }

.sako-pill-icon {
  width: 1.2vw;
  height: 1.2vw;
  min-width: 18px;
  min-height: 18px;
  opacity: 0.6;
  transition: opacity 0.3s;
  flex-shrink: 0;
}
.sako-pill:hover .sako-pill-icon { opacity: 1; }

.sako-glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6vw;
  border-radius: 100vw;
  border: 1px solid rgba(201,168,76,0.18);
  background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
  padding: 1.2vh 1.5vw;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.sako-top-btn {
  width: 3vw;
  height: 3vw;
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(201,168,76,0.2);
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}
.sako-top-btn:hover {
  border-color: rgba(201,168,76,0.5);
  background: rgba(201,168,76,0.1);
  transform: translateY(-0.4vh);
}
.sako-top-btn-icon { transition: transform 0.3s; }
.sako-top-btn:hover .sako-top-btn-icon { transform: translateY(-0.5vh); }

.sako-heartbeat { animation: sako-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; display: inline-block; }

.sako-pills-enter { animation: sako-slideIn 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
.sako-bottom-enter { animation: sako-slideIn 1s 0.4s cubic-bezier(0.16,1,0.3,1) both; }
`;

// ─────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────
type MagneticProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticProps>(
  ({ className, children, as: Tag = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const el = localRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
            ease: "elastic.out(1,0.3)",
            duration: 1.2,
          });
        };
        el.addEventListener("mousemove", onMove as EventListener);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove as EventListener);
          el.removeEventListener("mouseleave", onLeave);
        };
      }, el);

      return () => ctx.revert();
    }, []);

    return (
      <Tag
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        suppressHydrationWarning
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ─────────────────────────────────────────────
// MARQUEE ITEM
// ─────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Web Design", "UI / UX", "SEO & Growth",
  "AI Automation", "Brand Strategy", "Future-Forward",
];

const MarqueeRow = () => (
  <div className="sako-marquee-item">
    {MARQUEE_ITEMS.map((item, i) => (
      <React.Fragment key={i}>
        <span>{item}</span>
        {i < MARQUEE_ITEMS.length - 1 && (
          <span style={{ color: "rgba(201,168,76,0.35)" }}>✦</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────
export interface CinematicFooterProps {
  brandName?: string;
  tagline?: string;
  email?: string;
  copyrightYear?: string;
  primaryLinks?: { label: string; href: string }[];
  secondaryLinks?: { label: string; href: string }[];
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export function CinematicFooter({
  brandName = "SAKO",
  tagline = "Ready to build something extraordinary?",
  email = "hello@sako.agency",
  copyrightYear = "2024–2026",
  primaryLinks = [],
  secondaryLinks = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
  ],
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background text parallax
      gsap.fromTo(
        bgTextRef.current,
        { y: "10vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh", scale: 1, opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      );

      // Headline + pills reveal
      gsap.fromTo(
        [headlineRef.current, pillsRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 45%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank", "noopener noreferrer");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Clip-path curtain so fixed footer only shows inside this block */}
      <div
        ref={wrapperRef}
        className="relative w-full sako-footer-root"
        style={{
          minHeight: "100vh",
          clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        }}
      >
        <footer
          className="sako-footer-root"
          style={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            background: "#080706",
            color: "#f0ece4",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Aurora glow */}
          <div className="sako-aurora" />

          {/* Dot grid */}
          <div className="sako-grid" />

          {/* Giant ghost brand text */}
          <div ref={bgTextRef} className="sako-bg-text" aria-hidden="true">
            {brandName}
          </div>

          {/* ── Marquee band ── */}
          <div className="sako-marquee-band" aria-hidden="true">
            <div className="sako-marquee-track">
              <MarqueeRow />
              <MarqueeRow />
            </div>
          </div>

          {/* ── Center content ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6vh 4vw 4vh",
              gap: "4vh",
            }}
          >
            {/* Headline */}
            <h2
              ref={headlineRef}
              className="sako-headline"
              dangerouslySetInnerHTML={{
                __html: tagline.replace(/\?/, "?<br/>"),
              }}
            />

            {/* Pills */}
            <div
              ref={pillsRef}
              className="sako-pills-enter"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2vh",
                width: "100%",
              }}
            >
              {/* Primary action pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "1.2vw",
                }}
              >
                <MagneticButton
                  as="button"
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="sako-pill sako-pill-lg"
                >
                  <svg
                    className="sako-pill-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Start a Project
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={`mailto:${email}`}
                  className="sako-pill sako-pill-lg"
                >
                  <svg
                    className="sako-pill-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 6l-10 7L2 6"
                    />
                  </svg>
                  {email}
                </MagneticButton>

                {/* Optional extra primary links */}
                {primaryLinks.map((link) => (
                  <MagneticButton
                    key={link.label}
                    as="a"
                    href={link.href}
                    className="sako-pill sako-pill-lg"
                  >
                    {link.label}
                  </MagneticButton>
                ))}
              </div>

              {/* Secondary nav pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.8vw",
                }}
              >
                {secondaryLinks.map((link) => (
                  <MagneticButton
                    key={link.label}
                    as="a"
                    href={link.href}
                    onClick={(e: React.MouseEvent) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        handleNav(link.href);
                      }
                    }}
                    className="sako-pill sako-pill-sm"
                  >
                    {link.label}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            className="sako-bottom-enter"
            style={{
              position: "relative",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5vw",
              padding: "2.5vh 4vw 4.5vh",
              borderTop: "1px solid rgba(201,168,76,0.1)",
            }}
          >
            {/* Copyright */}
            <span
              style={{
                fontSize: "clamp(10px, 0.7vw, 18px)",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(240,236,228,0.3)",
              }}
            >
              © {copyrightYear} {brandName} Agency. All rights reserved.
            </span>

            {/* Crafted-with badge */}
            <div className="sako-glass-badge" aria-label="Made with love">
              <span
                style={{
                  fontSize: "clamp(10px, 0.7vw, 18px)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.35)",
                }}
              >
                Crafted with
              </span>
              <span
                className="sako-heartbeat"
                aria-hidden="true"
                style={{ color: "#c9a84c", fontSize: "clamp(13px, 1vw, 22px)" }}
              >
                ♥
              </span>
              <span
                style={{
                  fontSize: "clamp(10px, 0.7vw, 18px)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(240,236,228,0.35)",
                }}
              >
                by
              </span>
              <span
                style={{
                  fontSize: "clamp(12px, 0.9vw, 20px)",
                  fontWeight: 800,
                  color: "#c9a84c",
                  marginLeft: "0.2vw",
                }}
              >
                {brandName}
              </span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="sako-top-btn"
              aria-label="Back to top"
            >
              <svg
                className="sako-top-btn-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(201,168,76,0.8)"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

"use client";
import { ArrowUpRight } from "lucide-react";
import { SocialHoverCard } from "./SocialHoverCard";

const navGroups = [
  { label: "Studio", links: [{ name: "About", href: "#about" }, { name: "Team", href: "#team" }, { name: "Process", href: "#process" }] },
  { label: "Services", links: [{ name: "Web Design", href: "#services" }, { name: "UI / UX", href: "#services" }, { name: "SEO & Growth", href: "#services" }, { name: "AI Automation", href: "#services" }] },
  { label: "Work", links: [{ name: "Case Studies", href: "#work" }, { name: "Portfolio", href: "#work" }, { name: "Results", href: "#testimonials" }] },
  { label: "Contact", links: [{ name: "Start a Project", href: "#contact" }, { name: "hello@sako.agency", href: "mailto:hello@sako.agency" }] },
];

const socials = [
  { name: "Instagram", href: "#", username: "@sakogen", desc: "Behind the scenes and visual inspiration from our studio.", followers: "124K", following: "42", initials: "IG" },
  { name: "LinkedIn", href: "#", username: "SAKO Agency", desc: "Industry insights, case studies, and career opportunities.", followers: "45K", following: "0", initials: "LI" },
  { name: "Behance", href: "#", username: "SakoStudio", desc: "Deep dives into our branding and UI/UX design processes.", followers: "89K", following: "12", initials: "BH" },
  { name: "Twitter", href: "#", username: "@sako_agency", desc: "Quick thoughts on tech, design, and building the future.", followers: "21K", following: "105", initials: "TW" },
];

export default function Footer() {
  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid rgba(201,168,76,0.2)", position: "relative" }}>
      {/* Top CTA band */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "40px 0", overflow: "hidden" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 300, lineHeight: 1.2, color: "#050505" }}>
            Have a project in mind?{" "}
            <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Let's talk.
            </em>
          </div>
          <button
            onClick={() => handleNav("#contact")}
            data-cursor="magnetic"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "var(--gold)", color: "#ffffff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", padding: "16px 32px", borderRadius: "100px", border: "none", cursor: "none", transition: "transform 0.3s,box-shadow 0.3s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(201,168,76,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            Start a Project <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container" style={{ padding: "clamp(40px, 80px, 80px) clamp(16px, 60px, 60px) clamp(32px, 60px, 60px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "clamp(24px, 48px, 48px)", marginBottom: "clamp(32px, 64px, 64px)" }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ width: 28, height: 28, border: "1px solid var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L11 6L6 11L1 6L6 1Z" stroke="#c9a84c" strokeWidth="1" fill="none" />
                  <circle cx="6" cy="6" r="1.5" fill="#c9a84c" />
                </svg>
              </span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "16px", letterSpacing: "0.25em", color: "var(--gold)" }}>SAKO</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.6)", lineHeight: 1.8, maxWidth: "220px", marginBottom: "24px" }}>
              A future-forward digital agency building brands that outlast trends.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {socials.map(s => (
                <SocialHoverCard
                  key={s.name}
                  platform={s.name}
                  username={s.username}
                  description={s.desc}
                  followers={s.followers}
                  following={s.following}
                  initials={s.initials}
                >
                  <a href={s.href}
                    style={{ fontFamily: "'Outfit',sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", border: "1px solid rgba(201,168,76,0.25)", padding: "6px 12px", borderRadius: "100px", textDecoration: "none", transition: "color 0.3s,border-color 0.3s", cursor: "none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--gold)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.4)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"; }}>
                    {s.name}
                  </a>
                </SocialHoverCard>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map(g => (
            <div key={g.label}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px" }}>{g.label}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {g.links.map(link => (
                  <li key={link.name}>
                    <button onClick={() => handleNav(link.href)}
                      style={{ background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(0,0,0,0.6)", cursor: "none", padding: 0, textAlign: "left", transition: "color 0.3s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#000000")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.6)")}>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "clamp(20px, 32px, 32px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }}>© 2024–2026 SAKO Agency. All rights reserved.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <button key={l} style={{ background: "none", border: "none", fontSize: "12px", color: "rgba(0,0,0,0.4)", cursor: "none", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.4)")}>
                {l}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.3)", fontFamily: "monospace" }}>Lahore, Pakistan ✦ Remote Worldwide</span>
        </div>
      </div>
    </footer>
  );
}

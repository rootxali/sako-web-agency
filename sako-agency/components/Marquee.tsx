"use client";

const items = ["Web Design", "UI / UX", "Brand Identity", "SEO & Growth", "Conversion Strategy", "AI Automation", "Digital Strategy", "Motion Design"];
const sep = "✦";

export default function Marquee() {
  const loop = [...items, ...items, ...items, ...items];
  const loop2 = [...items.slice(4), ...items, ...items, ...items];

  return (
    <div style={{ background: "var(--black-2)", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)", overflow: "hidden", padding: "20px 0" }}>
      {/* Row 1 — left */}
      <div style={{ marginBottom: "12px", overflow: "hidden" }}>
        <div className="marquee-l">
          {loop.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "28px", paddingRight: "28px" }}>
              <span style={{ fontFamily: "'Cormorant',serif", fontStyle: "italic", fontSize: "clamp(1.4rem,2.5vw,2rem)", color: "rgba(201,168,76,0.7)", whiteSpace: "nowrap", fontWeight: 300 }}>{item}</span>
              <span style={{ color: "rgba(201,168,76,0.3)", fontSize: "10px" }}>{sep}</span>
            </span>
          ))}
        </div>
      </div>
      {/* Row 2 — right */}
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-r">
          {loop2.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "28px", paddingRight: "28px" }}>
              <span style={{ fontFamily: "'Syne',serif", fontSize: "clamp(0.65rem,1vw,0.75rem)", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)", whiteSpace: "nowrap" }}>{item}</span>
              <span style={{ color: "rgba(201,168,76,0.2)", fontSize: "8px" }}>{sep}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

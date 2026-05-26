"use client";

export default function SettingsPage() {
  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "12px 16px", color: "#f5f0e8", fontSize: "14px", outline: "none",
  };
  const labelStyle = { display: "block", fontSize: "12px", color: "rgba(245,240,232,0.6)", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.1em" };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Settings</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>Agency configuration</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Agency Name</label>
          <input style={inputStyle} defaultValue="SAKO" placeholder="Agency name" />
        </div>
        <div>
          <label style={labelStyle}>Admin Email</label>
          <input style={inputStyle} defaultValue="hello@sako.agency" placeholder="Email" />
        </div>
        <div>
          <label style={labelStyle}>Site URL</label>
          <input style={inputStyle} defaultValue="https://sako.agency" placeholder="URL" />
        </div>
        <div style={{ paddingTop: "8px" }}>
          <button style={{ padding: "12px 32px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            Save Settings
          </button>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Quick Links</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <a href="/admin" style={{ color: "#c9a84c", textDecoration: "none", fontSize: "14px" }}>← Back to Dashboard</a>
          <a href="/" target="_blank" style={{ color: "#c9a84c", textDecoration: "none", fontSize: "14px" }}>View Website ↗</a>
        </div>
      </div>
    </div>
  );
}

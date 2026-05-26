"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  budget: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact request?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "PENDING": return { bg: "rgba(201,168,76,0.1)", color: "#c9a84c" };
      case "REVIEWED": return { bg: "rgba(76, 142, 201, 0.1)", color: "#4c8ec9" };
      case "COMPLETED": return { bg: "rgba(76, 201, 120, 0.1)", color: "#4cc978" };
      default: return { bg: "rgba(245,240,232,0.05)", color: "rgba(245,240,232,0.4)" };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Contact Inquiries</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>{contacts.length} submissions received</p>
      </div>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p>
      ) : contacts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed rgba(201,168,76,0.2)", borderRadius: "16px" }}>
          <Mail size={32} style={{ color: "rgba(201,168,76,0.3)", marginBottom: "12px" }} />
          <p style={{ color: "rgba(245,240,232,0.4)" }}>No contact submissions yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {contacts.map((c) => {
              const sc = statusColor(c.status);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: selected?.id === c.id ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${selected?.id === c.id ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.08)"}`, borderRadius: "12px", cursor: "pointer" }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#c9a84c", flexShrink: 0 }}>
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>{c.email}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.service}{c.company ? ` · ${c.company}` : ""} · {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "100vw", background: sc.bg, color: sc.color, whiteSpace: "nowrap", flexShrink: 0 }}>{c.status}</span>
                </div>
              );
            })}
          </div>

          {selected && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "16px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} style={{ color: "#c9a84c", textDecoration: "none", fontSize: "14px" }}>{selected.email}</a>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: "18px" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", fontSize: "13px" }}>
                {selected.company && <div><span style={{ color: "rgba(245,240,232,0.4)" }}>Company:</span> {selected.company}</div>}
                <div><span style={{ color: "rgba(245,240,232,0.4)" }}>Service:</span> {selected.service}</div>
                {selected.budget && <div><span style={{ color: "rgba(245,240,232,0.4)" }}>Budget:</span> {selected.budget}</div>}
                <div><span style={{ color: "rgba(245,240,232,0.4)" }}>Date:</span> {new Date(selected.createdAt).toLocaleString()}</div>
                <div><span style={{ color: "rgba(245,240,232,0.4)" }}>Status:</span> <span style={{ color: statusColor(selected.status).color }}>{selected.status}</span></div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(245,240,232,0.8)", whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selected.status !== "PENDING" && (
                  <button onClick={() => updateStatus(selected.id, "PENDING")} style={{ padding: "8px 16px", background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "100vw", fontSize: "12px", cursor: "pointer" }}>Mark Pending</button>
                )}
                {selected.status !== "REVIEWED" && (
                  <button onClick={() => updateStatus(selected.id, "REVIEWED")} style={{ padding: "8px 16px", background: "rgba(76, 142, 201, 0.1)", color: "#4c8ec9", border: "1px solid rgba(76, 142, 201, 0.2)", borderRadius: "100vw", fontSize: "12px", cursor: "pointer" }}>Mark Reviewed</button>
                )}
                {selected.status !== "COMPLETED" && (
                  <button onClick={() => updateStatus(selected.id, "COMPLETED")} style={{ padding: "8px 16px", background: "rgba(76, 201, 120, 0.1)", color: "#4cc978", border: "1px solid rgba(76, 201, 120, 0.2)", borderRadius: "100vw", fontSize: "12px", cursor: "pointer" }}>Mark Completed</button>
                )}
                <button onClick={() => handleDelete(selected.id)} style={{ padding: "8px 16px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "100vw", fontSize: "12px", cursor: "pointer", marginLeft: "auto" }}><Trash2 size={12} style={{ marginRight: "4px", display: "inline" }} /> Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string | null;
  handle: string;
  initials: string | null;
  bio: string | null;
  avatar: string | null;
  category: string | null;
  color: string | null;
  order: number;
}

const defaultForm = { name: "", role: "", handle: "", initials: "", bio: "", avatar: "", category: "", color: "", order: 0 };

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchMembers = () => fetch("/api/team").then((r) => r.json()).then(setMembers).finally(() => setLoading(false));
  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => { setForm(defaultForm); setEditing(null); };

  const handleSave = async () => {
    if (!form.name || !form.handle) return;
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/team/${editing}` : "/api/team";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchMembers(); }
    else { const d = await res.json(); alert(d.error || "Operation failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Delete failed"); return; }
    fetchMembers();
  };

  const startEdit = (m: TeamMemberItem) => {
    setForm({ name: m.name, role: m.role || "", handle: m.handle, initials: m.initials || "", bio: m.bio || "", avatar: m.avatar || "", category: m.category || "", color: m.color || "", order: m.order });
    setEditing(m.id);
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#f5f0e8", fontSize: "13px", outline: "none",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Team</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>Manage team members</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>{editing ? "Edit Member" : "Add Member"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inputStyle} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={inputStyle} placeholder="Handle" value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inputStyle} placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <input style={inputStyle} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inputStyle} placeholder="Initials" value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} />
              <input style={inputStyle} placeholder="Color hex (e.g. #c9a84c)" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <input style={inputStyle} placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleSave} style={{ padding: "10px 24px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{editing ? "Update" : "Add Member"}</button>
              {editing && <button onClick={resetForm} style={{ padding: "10px 24px", background: "transparent", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "100vw", fontSize: "13px", cursor: "pointer" }}>Cancel</button>}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>All Members ({members.length})</h3>
          {loading ? <p style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p> : members.length === 0 ? (
            <p style={{ color: "rgba(245,240,232,0.3)", textAlign: "center", padding: "40px" }}>No team members added yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: m.color || "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#050505", flexShrink: 0 }}>
                    {m.initials || m.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>{m.role}{m.category ? ` · ${m.category}` : ""}</div>
                  </div>
                  <button onClick={() => startEdit(m)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(245,240,232,0.4)", background: "none", border: "none", cursor: "pointer" }}><Edit size={14} /></button>
                  <button onClick={() => handleDelete(m.id)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, EyeOff } from "lucide-react";

interface WorkItemType {
  id: string;
  title: string;
  category: string | null;
  services: string | null;
  year: string | null;
  url: string | null;
  image: string | null;
  gradient: string | null;
  accent: string | null;
  result: string | null;
  tag: string | null;
  published: boolean;
  order: number;
}

const defaultForm = {
  title: "", category: "", services: "", year: "", url: "", image: "", gradient: "", accent: "", result: "", tag: "", published: true, order: 0,
};

export default function WorkPage() {
  const [items, setItems] = useState<WorkItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchItems = () => fetch("/api/work").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm(defaultForm); setEditing(null); };

  const handleSave = async () => {
    if (!form.title) return;
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/work/${editing}` : "/api/work";
    const body = { ...form, published: form.published };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); fetchItems(); }
    else { const d = await res.json(); alert(d.error || "Operation failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this portfolio item?")) return;
    const res = await fetch(`/api/work/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Delete failed"); return; }
    fetchItems();
  };

  const startEdit = (w: WorkItemType) => {
    setForm({ title: w.title, category: w.category || "", services: w.services || "", year: w.year || "", url: w.url || "", image: w.image || "", gradient: w.gradient || "", accent: w.accent || "", result: w.result || "", tag: w.tag || "", published: w.published, order: w.order });
    setEditing(w.id);
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#f5f0e8", fontSize: "13px", outline: "none",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Portfolio</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>Manage your work/portfolio items</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>{editing ? "Edit Project" : "Add Project"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "16px", padding: "24px" }}>
            <input style={inputStyle} placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inputStyle} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input style={inputStyle} placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
            <input style={inputStyle} placeholder="Services (e.g. Web · SEO · E-Commerce)" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
            <input style={inputStyle} placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            <input style={inputStyle} placeholder="Image path (e.g. /assest/valuetech.png)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <input style={inputStyle} placeholder="Tag (e.g. Case Study, Concept)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
            <input style={inputStyle} placeholder="Result (e.g. +340% sales growth)" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input style={inputStyle} placeholder="Gradient CSS" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
              <input style={inputStyle} placeholder="Accent color hex" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "#c9a84c" }} />
              <label htmlFor="published" style={{ fontSize: "13px", color: "rgba(245,240,232,0.6)" }}>Published</label>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleSave} style={{ padding: "10px 24px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{editing ? "Update" : "Add Project"}</button>
              {editing && <button onClick={resetForm} style={{ padding: "10px 24px", background: "transparent", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "100vw", fontSize: "13px", cursor: "pointer" }}>Cancel</button>}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>All Projects ({items.length})</h3>
          {loading ? <p style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p> : items.length === 0 ? (
            <p style={{ color: "rgba(245,240,232,0.3)", textAlign: "center", padding: "40px" }}>No projects added yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((w) => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: "12px" }}>
                  <div style={{ width: "6px", height: "36px", borderRadius: "3px", background: w.accent || "#c9a84c", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>{w.title}</span>
                      {!w.published && <EyeOff size={12} style={{ color: "rgba(245,240,232,0.3)" }} />}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>{[w.category, w.year].filter(Boolean).join(" · ") || w.services}</div>
                  </div>
                  <button onClick={() => startEdit(w)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(245,240,232,0.4)", background: "none", border: "none", cursor: "pointer" }}><Edit size={14} /></button>
                  <button onClick={() => handleDelete(w.id)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

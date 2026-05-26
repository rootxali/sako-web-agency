"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, GripVertical } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  backgroundImage: string | null;
  order: number;
}

const defaultForm = { name: "", tagline: "", description: "", icon: "", backgroundImage: "", order: 0 };

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchServices = () => fetch("/api/services").then((r) => r.json()).then(setServices).finally(() => setLoading(false));
  useEffect(() => { fetchServices(); }, []);

  const resetForm = () => { setForm(defaultForm); setEditing(null); };

  const handleSave = async () => {
    if (!form.name) return;
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/services/${editing}` : "/api/services";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchServices(); }
    else { const d = await res.json(); alert(d.error || "Operation failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Delete failed"); return; }
    fetchServices();
  };

  const startEdit = (s: ServiceItem) => {
    setForm({ name: s.name, tagline: s.tagline || "", description: s.description || "", icon: s.icon || "", backgroundImage: s.backgroundImage || "", order: s.order });
    setEditing(s.id);
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#f5f0e8", fontSize: "13px", outline: "none",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Services</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>Manage your service offerings</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>{editing ? "Edit Service" : "Add Service"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "16px", padding: "24px" }}>
            <input style={inputStyle} placeholder="Service name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input style={inputStyle} placeholder="Icon name (e.g. Code2, Layers)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <input style={inputStyle} placeholder="Background image filename" value={form.backgroundImage} onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleSave} style={{ padding: "10px 24px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{editing ? "Update" : "Add Service"}</button>
              {editing && <button onClick={resetForm} style={{ padding: "10px 24px", background: "transparent", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "100vw", fontSize: "13px", cursor: "pointer" }}>Cancel</button>}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "rgba(245,240,232,0.7)" }}>All Services ({services.length})</h3>
          {loading ? <p style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p> : services.length === 0 ? (
            <p style={{ color: "rgba(245,240,232,0.3)", textAlign: "center", padding: "40px" }}>No services added yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {services.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: "12px" }}>
                  <GripVertical size={14} style={{ color: "rgba(245,240,232,0.2)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{s.name}</div>
                    {s.tagline && <div style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>{s.tagline}</div>}
                  </div>
                  <button onClick={() => startEdit(s)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(245,240,232,0.4)", background: "none", border: "none", cursor: "pointer" }}><Edit size={14} /></button>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: "6px", borderRadius: "6px", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

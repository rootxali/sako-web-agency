"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", category: "", image: "", author: "", published: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const slug = form.slug || generateSlug(form.title);
    if (!slug) { setError("Title is required"); setSaving(false); return; }

    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create post");
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "12px 16px", color: "#f5f0e8", fontSize: "14px", outline: "none",
  };
  const labelStyle = { display: "block", fontSize: "12px", color: "rgba(245,240,232,0.6)", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.1em" };

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>New Blog Post</h1>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px", fontSize: "14px" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value) })} placeholder="Post title" required />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input style={{ ...inputStyle, color: "rgba(201,168,76,0.6)" }} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-slug" />
        </div>
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description" />
        </div>
        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea style={{ ...inputStyle, minHeight: "200px", resize: "vertical", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here..." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="UI/UX Design" />
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input style={inputStyle} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="SAKO Studio" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Featured Image URL</label>
          <input style={inputStyle} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "#c9a84c" }} />
          <label htmlFor="published" style={{ fontSize: "14px", color: "rgba(245,240,232,0.7)" }}>Publish immediately</label>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button type="submit" disabled={saving} style={{ padding: "12px 32px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Create Post"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ padding: "12px 32px", background: "transparent", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "100vw", fontSize: "14px", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  published: boolean;
  createdAt: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?admin=true")
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Failed to delete post");
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)", fontWeight: 400, marginBottom: "8px" }}>Blog Posts</h1>
          <p style={{ color: "rgba(245,240,232,0.5)", fontSize: "14px" }}>Manage your blog content ({posts.length} posts)</p>
        </div>
        <Link
          href="/admin/blog/new"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "#c9a84c", color: "#050505", borderRadius: "100vw", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed rgba(201,168,76,0.2)", borderRadius: "16px" }}>
          <p style={{ color: "rgba(245,240,232,0.4)", marginBottom: "16px" }}>No blog posts yet</p>
          <Link href="/admin/blog/new" style={{ color: "#c9a84c", textDecoration: "none" }}>Create your first post</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.08)", borderRadius: "12px", gap: "16px" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</h3>
                  <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "100vw", background: post.published ? "rgba(76, 201, 120, 0.15)" : "rgba(201,168,76,0.1)", color: post.published ? "#4cc978" : "#c9a84c" }}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>
                  {post.category && <span>{post.category}</span>}
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: "rgba(201,168,76,0.4)" }}>/{post.slug}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link href={"/admin/blog/" + post.id} style={{ padding: "8px", borderRadius: "8px", color: "rgba(245,240,232,0.5)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.1)" }}>
                  <Edit size={14} />
                </Link>
                <button onClick={() => handleDelete(post.id)} style={{ padding: "8px", borderRadius: "8px", color: "rgba(239,68,68,0.6)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

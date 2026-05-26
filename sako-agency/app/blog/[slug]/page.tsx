import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <main style={{ background: "#0a0908", minHeight: "100vh", color: "#f5f0e8" }}>
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "10vh 5vw" }}>
        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(201,168,76,0.6)", textDecoration: "none", fontSize: "13px", fontFamily: "'Syne', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4vh" }}>
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <header style={{ marginBottom: "6vh" }}>
          {post.category && (
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", display: "block", marginBottom: "2vh" }}>
              {post.category}
            </span>
          )}
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "2vh" }}>
            {post.title}
          </h1>
          <div style={{ display: "flex", gap: "24px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "rgba(245,240,232,0.4)" }}>
            <time>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            {post.author && <span>By {post.author}</span>}
          </div>
        </header>

        {post.image && (
          <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "16px", overflow: "hidden", marginBottom: "6vh" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ fontSize: "16px", lineHeight: 1.8, color: "rgba(245,240,232,0.85)", fontFamily: "'Outfit', sans-serif" }}>
          {post.excerpt && <p style={{ fontSize: "18px", lineHeight: 1.7, color: "rgba(245,240,232,0.6)", marginBottom: "32px", fontStyle: "italic" }}>{post.excerpt}</p>}
          {post.content ? (
            <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
          ) : (
            <p style={{ color: "rgba(245,240,232,0.3)" }}>Full content coming soon.</p>
          )}
        </div>
      </article>
    </main>
  );
}

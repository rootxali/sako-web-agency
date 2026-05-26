import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ background: "#0a0908", minHeight: "100vh", color: "#f5f0e8" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12vh 5vw" }}>
        <Link href="/" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none", fontSize: "13px", fontFamily: "'Syne', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4vh", display: "inline-block" }}>
          ← Back to Home
        </Link>

        <header style={{ textAlign: "center", marginBottom: "8vh" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", display: "block", marginBottom: "2vh" }}>
            — Knowledge Hub
          </span>
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 1.05 }}>
            Latest from the{" "}
            <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Studio.</em>
          </h1>
        </header>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <p style={{ color: "rgba(245,240,232,0.4)", fontFamily: "'Outfit', sans-serif" }}>No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "clamp(20px, 3vw, 36px)" }}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(201,168,76,0.08)", background: "rgba(255,255,255,0.02)", transition: "border-color 0.3s" }}
              >
                {post.image && (
                  <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s" }} />
                  </div>
                )}
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    {post.category && <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", opacity: 0.8 }}>{post.category}</span>}
                    <span style={{ fontSize: "12px", color: "rgba(245,240,232,0.3)", fontFamily: "'Outfit', sans-serif" }}>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(18px, 2vw, 28px)", fontWeight: 400, lineHeight: 1.2, margin: 0, color: "#f5f0e8" }}>{post.title}</h2>
                  {post.excerpt && <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.5)", marginTop: "12px", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>{post.excerpt}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", color: "#c9a84c", fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Read Article <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

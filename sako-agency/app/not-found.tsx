import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#f5f0e8", fontFamily: "'Outfit', sans-serif", textAlign: "center", padding: "20px" }}>
      <div>
        <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(6rem, 20vw, 12rem)", fontWeight: 300, color: "rgba(201,168,76,0.15)", lineHeight: 1, marginBottom: "2vh" }}>404</div>
        <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 400, marginBottom: "2vh" }}>Page not found</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", marginBottom: "4vh", maxWidth: "400px", lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#c9a84c", color: "#050505", borderRadius: "100vw", textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em" }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#f5f0e8", fontFamily: "'Outfit', sans-serif", textAlign: "center", padding: "20px" }}>
      <div>
        <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(4rem, 15vw, 8rem)", fontWeight: 300, color: "rgba(239,68,68,0.15)", lineHeight: 1, marginBottom: "2vh" }}>!</div>
        <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 400, marginBottom: "2vh" }}>Something went wrong</h1>
        <p style={{ color: "rgba(245,240,232,0.5)", marginBottom: "4vh", maxWidth: "400px", lineHeight: 1.6 }}>
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          style={{ padding: "14px 32px", background: "#c9a84c", color: "#050505", border: "none", borderRadius: "100vw", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

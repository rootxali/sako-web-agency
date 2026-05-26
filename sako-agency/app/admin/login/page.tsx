"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "4px", padding: "16px 20px", color: "var(--cream)", fontSize: "14px",
    fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: "16px"
  };

  const btnStyle = {
    width: "100%", background: "var(--gold)", color: "var(--black)",
    padding: "16px", borderRadius: "4px", fontWeight: "bold" as const, cursor: "pointer",
    border: "none", marginTop: "10px"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--black)", color: "white" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "40px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "8px", textAlign: "center", fontFamily: "'Playfair Display', serif" }}>
          Admin Login
        </h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--cream-dim)", marginBottom: "24px" }}>
          Sign in to access the dashboard
        </p>

        {error && (
          <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "16px", fontSize: "14px", padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "4px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{ display: "block", fontSize: "12px", color: "var(--cream-dim)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@sako.agency"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />

          <label htmlFor="password" style={{ display: "block", fontSize: "12px", color: "var(--cream-dim)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

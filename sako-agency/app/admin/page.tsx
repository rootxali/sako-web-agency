"use client";
import React from "react";
import MagicBento from "@/components/MagicBento";
import { TrendingUp, Users, DollarSign, Activity, Eye, MousePointerClick } from "lucide-react";

const analyticsData = [
  {
    title: "Total Revenue",
    description: "+14.5% from last month. Recurring MRR is stabilizing.",
    label: "$124,500",
    icon: <DollarSign size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
  {
    title: "Active Users",
    description: "Peak activity observed during 10am-2pm EST.",
    label: "1,245",
    icon: <Users size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
  {
    title: "Conversion Rate",
    description: "Checkout flow optimizations yielded a 2% lift.",
    label: "4.2%",
    icon: <TrendingUp size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
  {
    title: "System Health",
    description: "All services running flawlessly.",
    label: "99.9% Uptime",
    icon: <Activity size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
  {
    title: "Page Views",
    description: "Traffic from social campaigns increased by 30%.",
    label: "84,000",
    icon: <Eye size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
  {
    title: "Click-Throughs",
    description: "Hero CTA is the primary conversion driver.",
    label: "12,400",
    icon: <MousePointerClick size={24} strokeWidth={1.5} />,
    color: "rgba(201, 168, 76, 0.05)",
  },
];

export default function AdminDashboard() {
  return (
    <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "4vh 4vw" }}>
      <header style={{ marginBottom: "6vh", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2vh" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 400, color: "var(--cream)", marginBottom: "1vh" }}>
            Overview
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", color: "var(--cream-dim)", fontSize: "clamp(14px, 0.9vw, 18px)" }}>
            Real-time insights and analytics for your agency.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1vw" }}>
          <button style={{ padding: "1.2vh 1.8vw", borderRadius: "100vw", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--cream)", fontFamily: "'Outfit', sans-serif", fontSize: "clamp(11px, 0.7vw, 14px)", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
            Export PDF
          </button>
          <button style={{ padding: "1.2vh 1.8vw", borderRadius: "100vw", background: "var(--gold)", border: "none", color: "var(--black)", fontFamily: "'Outfit', sans-serif", fontSize: "clamp(11px, 0.7vw, 14px)", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
            Generate Report
          </button>
        </div>
      </header>

      {/* Analytics Grid using MagicBento for premium look */}
      <MagicBento
        cards={analyticsData}
        glowColor="201, 168, 76"
        particleCount={8}
        spotlightRadius={350}
        enableStars={true}
        enableTilt={true}
      />
    </div>
  );
}

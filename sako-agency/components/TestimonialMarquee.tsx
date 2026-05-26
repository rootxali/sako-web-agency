"use client";

import React from "react";
import NewMarquee, { TestimonialCardT } from "@/components/ui/testimonial-marquee";

const SAKO_DATA_1: TestimonialCardT[] = [
  {
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Marcus Vance",
    handle: "CEO, Vance & Co.",
    quote: "SAKO didn't just build us a website — they rebuilt our entire digital identity. Revenue up 340% in 8 months.",
  },
  {
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Sophia Chen",
    handle: "Founder, Heliox Capital",
    quote: "Every agency promised results. SAKO delivered them. Our platform went from concept to $2.4M ARR in under a year.",
  },
  {
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    quote: "The speed and precision of their execution is unmatched. A true partner in our growth journey.",
  },
  {
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Avery Johnson",
    handle: "@averywrites",
    quote: "Their design language is in a league of its own. It's rare to find an agency that gets luxury digital right.",
  },
];

const SAKO_DATA_2: TestimonialCardT[] = [
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    name: "Julien Moreau",
    handle: "Director, Maison Verre",
    quote: "The campaign system they built generated international press coverage we couldn't have bought. Extraordinary work.",
  },
  {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    name: "Elena Rossi",
    handle: "Creative Lead, V-Motors",
    quote: "Bespoke, refined, and data-driven. SAKO is the gold standard for modern brand evolution.",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    name: "Robert Blake",
    handle: "@blake_designs",
    quote: "They don't just follow trends; they set them. Our conversion rate doubled within weeks of the new launch.",
  },
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    name: "Sarah Jenkins",
    handle: "COO, Zenith Ops",
    quote: "Professionalism at its peak. The team at Sako Agency is a joy to work with and incredibly talented.",
  },
];

export default function TestimonialMarquee() {
  return (
    <section id="testimonials" style={{ background: "var(--black)", padding: "10vh 0", width: "100%" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "4vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Testimonials</span>
          <h2 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
            What our clients <em style={{ background: "linear-gradient(135deg,#e8c56a,#c9a84c,#8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>say.</em>
          </h2>
          <p style={{ width: "min(92vw, 700px)", margin: "2vh auto 0", fontSize: "clamp(0.9rem, 1.1vw, 1.25rem)", color: "var(--cream-dim)", lineHeight: 1.8 }}>
            Don't just take our word for it. We let our results — and our clients — do the talking.
          </p>
        </div>

        <NewMarquee row1={SAKO_DATA_1} row2={SAKO_DATA_2} />
      </div>
    </section>
  );
}


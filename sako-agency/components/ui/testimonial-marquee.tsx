"use client";

import React from "react";

export type TestimonialCardT = {
  image: string;
  name: string;
  handle: string;
  quote: string;
};

const VerifyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 48 48"
    className="inline-block"
  >
    <polygon
      fill="#42a5f5"
      points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
    ></polygon>
    <polygon
      fill="#fff"
      points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
    ></polygon>
  </svg>
);

const Card = ({ card }: { card: TestimonialCardT }) => (
  <div
    className="shadow-lg hover:shadow-2xl transition-all duration-300 shrink-0 bg-[rgba(20,18,16,0.88)] border border-[rgba(201,168,76,0.22)] backdrop-blur-md"
    style={{
      width: "min(84vw, 360px)",
      minWidth: "260px",
      padding: "clamp(14px, 1.5vh, 18px)",
      marginInline: "clamp(8px, 1vw, 16px)",
      borderRadius: "clamp(14px, 1.2vw, 24px)",
    }}
  >
    <div className="flex items-center" style={{ gap: "clamp(8px, 0.8vw, 14px)" }}>
      <img
        className="rounded-full object-cover"
        style={{ width: "clamp(42px, 3vw, 54px)", height: "clamp(42px, 3vw, 54px)", minWidth: "42px", minHeight: "42px" }}
        src={card.image}
        alt={card.name}
      />
      <div className="flex flex-col justify-center">
        <div className="flex items-center" style={{ gap: "clamp(4px, 0.4vw, 8px)" }}>
          <p className="font-semibold text-[var(--cream)]" style={{ fontSize: "clamp(14px, 1vw, 18px)", lineHeight: 1.2 }}>{card.name}</p>
          <VerifyIcon />
        </div>
        <span className="text-[var(--cream-dim)]" style={{ fontSize: "clamp(12px, 0.8vw, 15px)", lineHeight: 1.3 }}>{card.handle}</span>
      </div>
    </div>
    <p
      className="text-[rgba(245,240,232,0.8)] leading-relaxed italic"
      style={{ fontSize: "clamp(13px, 0.9vw, 16px)", paddingTop: "clamp(12px, 2vh, 18px)" }}
    >
      "{card.quote}"
    </p>
  </div>
);

function MarqueeRow({
  data,
  reverse = false,
  speed = 40,
}: {
  data: TestimonialCardT[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = React.useMemo(() => [...data, ...data, ...data], [data]);
  return (
    <div className="relative w-full overflow-hidden isolation-isolate" style={{ paddingBlock: "clamp(10px, 2vh, 18px)" }}>
      <div className="pointer-events-none absolute left-0 top-0 h-full z-10 bg-gradient-to-r from-[var(--black)] to-transparent" style={{ width: "clamp(28px, 10vw, 120px)" }} />
      <div
        className={`flex transform-gpu min-w-[300%] ${reverse ? "animate-marquee-reverse" : "animate-marquee"
          }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {doubled.map((c, i) => (
          <Card key={i} card={c} />
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full z-10 bg-gradient-to-l from-[var(--black)] to-transparent" style={{ width: "clamp(28px, 10vw, 120px)" }} />
    </div>
  );
}

export default function TestimonialMarquee({
  row1,
  row2,
}: {
  row1: TestimonialCardT[];
  row2: TestimonialCardT[];
}) {
  return (
    <div className="flex flex-col w-full" style={{ gap: "clamp(10px, 2vh, 18px)", paddingBlock: "clamp(18px, 5vh, 44px)" }}>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marqueeScroll linear infinite;
        }
        .animate-marquee-reverse {
          animation: marqueeScroll linear infinite reverse;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
      <MarqueeRow data={row1} reverse={false} speed={35} />
      <MarqueeRow data={row2} reverse={true} speed={40} />
    </div>
  );
}

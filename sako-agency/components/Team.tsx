"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfileCard from "./ProfileCard";

interface TeamMemberData {
  id?: string;
  name: string;
  role: string | null;
  handle: string;
  initials: string | null;
  bio: string | null;
  avatar: string | null;
  category: string | null;
  color: string | null;
}

const fallbackData: TeamMemberData[] = [
  {
    name: "Ali Ahmed",
    role: "Chief Executive Officer",
    handle: "aliahmed",
    initials: "AA",
    color: "#c9a84c",
    bio: "Cybersecurity Expert | Innovation Enthusiast | Web Designer",
    avatar: "https://i.ibb.co/SDv8KMNx/Whats-App-Image-2026-04-23-at-1-LE-upscale-prime.jpg",
    category: "Designer",
  },
  {
    name: "Atif Mumtaz",
    role: "Chief Technology Officer",
    handle: "atifmumtaz",
    initials: "AM",
    color: "#9b4cc9",
    bio: "Full-stack architect obsessed with performance and scalability.",
    avatar: "/assest/atifmumtaz.png",
    category: "Developer",
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const [members, setMembers] = useState(fallbackData);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data: TeamMemberData[]) => {
        if (data.length > 0) setMembers(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".team-card-wrapper", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: ".team-grid", start: "top 85%", toggleActions: "play none none reverse" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [members]);

  const headerStyles = {
    title: { fontFamily: "'Cormorant', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, lineHeight: 1.05 },
    gradientText: { background: "linear-gradient(135deg, #e8c56a, #c9a84c, #8b6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  };

  return (
    <section ref={sectionRef} id="team" className="relative" style={{ background: "var(--black-3)", padding: "10vh 0", overflow: "hidden", width: "100%" }}>
      <div className="container">
        <header style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— The People</span>
          <h2 style={headerStyles.title}>Meet the <em style={headerStyles.gradientText}>studio.</em></h2>
          <p style={{ maxWidth: "min(90vw, 500px)", margin: "2vh auto 0", fontSize: "clamp(0.9rem, 1vw, 1.1rem)", lineHeight: 1.6, color: "var(--cream-dim)" }}>
            A small, senior team. No middlemen — direct access to the people building your future.
          </p>
        </header>

        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "clamp(16px, 2.5vw, 32px)", maxWidth: "min(100%, 720px)", margin: "0 auto" }}>
          {members.map((member) => (
            <div key={member.handle} className="team-card-wrapper" style={{ width: "100%" }}>
              <ProfileCard
                name={member.name}
                title={member.role || ""}
                bubbleText={member.category || ""}
                handle={member.handle}
                status="Online"
                contactText="Contact"
                avatarUrl={member.avatar || ""}
                miniAvatarUrl={member.avatar || ""}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg, rgba(10, 9, 8, 0.9) 0%, rgba(20, 18, 16, 0.95) 100%)"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

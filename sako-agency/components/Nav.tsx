"use client";
import { useEffect, useState } from "react";
import CardNav, { CardNavItem } from "./CardNav";

const navItems: CardNavItem[] = [
  {
    label: "Explore",
    bgColor: "rgba(10, 9, 8, 0.9)",
    textColor: "var(--cream)",
    links: [
      { label: "Studio", href: "#about", ariaLabel: "About Studio" },
      { label: "Work", href: "#work", ariaLabel: "Our Work" },
      { label: "Services", href: "#services", ariaLabel: "Our Services" },
    ],
  },
  {
    label: "Agency",
    bgColor: "rgba(15, 14, 12, 0.9)",
    textColor: "var(--cream)",
    links: [
      { label: "Process", href: "#process", ariaLabel: "Our Process" },
      { label: "Team", href: "#team", ariaLabel: "Our Team" },
      { label: "Careers", href: "#careers", ariaLabel: "Careers at Sako" },
    ],
  },
  {
    label: "Connect",
    bgColor: "rgba(20, 18, 16, 0.9)",
    textColor: "var(--cream)",
    links: [
      { label: "Contact Us", href: "#contact", ariaLabel: "Contact Form" },
      { label: "Instagram", href: "https://instagram.com", ariaLabel: "Instagram" },
      { label: "LinkedIn", href: "https://linkedin.com", ariaLabel: "LinkedIn" },
    ],
  },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <CardNav
      items={navItems}
      baseColor={scrolled ? "rgba(8, 8, 8, 0.85)" : "rgba(8, 8, 8, 0.45)"}
      menuColor="var(--gold)"
      ease="power3.out"
      className="card-nav-wrapper"
    />
  );
}

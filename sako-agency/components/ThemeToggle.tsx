"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => {
        // Add a class to body for animation if needed
        document.documentElement.classList.add("theme-transitioning");
        setTheme(isDark ? "light" : "dark");
        setTimeout(() => {
          document.documentElement.classList.remove("theme-transitioning");
        }, 500); // Matches the CSS transition duration
      }}
      className="relative flex flex-shrink-0 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--black-3)] border border-[var(--gold-border)] hover:bg-[var(--black-4)] hover:border-[var(--gold)] hover:scale-105 active:scale-95 transition-all duration-300 z-50 overflow-hidden shadow-lg cursor-none"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? -90 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-yellow-500" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-blue-400" />
      </motion.div>
    </button>
  );
}

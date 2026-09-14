"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import { EASE_OUT } from "@/lib/motion";

/*
 * Day / night watch switch. Marine displays ship with exactly this control:
 * a night palette for the bridge, a day palette for daylight. Night is the
 * default; the choice is stored per visitor.
 */

type Watch = "night" | "day";

const THEME_EVENT = "mwt-theme";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getWatch(): Watch {
  return document.documentElement.dataset.theme === "light" ? "day" : "night";
}

export function ThemeToggle() {
  const watch = useSyncExternalStore(subscribe, getWatch, () => "night");
  const reduced = useReducedMotion();

  const toggle = () => {
    const next: Watch = watch === "night" ? "day" : "night";
    const root = document.documentElement;

    if (!reduced) {
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 500);
    }

    if (next === "day") root.dataset.theme = "light";
    else delete root.dataset.theme;

    try {
      localStorage.setItem("mwt-theme", next);
    } catch {}

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "day" ? "#ecf1ea" : "#070c09");

    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        watch === "night" ? "Switch to day display" : "Switch to night display"
      }
      title={watch === "night" ? "Day display" : "Night display"}
      className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-fog/15 text-haze transition-colors duration-300 hover:border-fog/40 hover:text-fog"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={watch}
          className="flex"
          initial={{ rotate: -70, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 70, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          {watch === "night" ? <MoonGlyph /> : <SunGlyph />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* thin-stroke glyphs, drawn in the instrument line weight */

function MoonGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none">
      <path
        d="M13.2 9.9a5.6 5.6 0 0 1-7.1-7.1 5.6 5.6 0 1 0 7.1 7.1Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none">
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.25" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="8"
          y1="1.2"
          x2="8"
          y2="3"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 8 8)`}
        />
      ))}
    </svg>
  );
}

"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useLenis } from "./providers";

const STATUS = ["ACQUIRING SIGNAL", "CALIBRATING INSTRUMENTS", "SIGNAL LOCKED"];

/**
 * Boot sequence: counter to 100 with a name reveal, then a curtain exit.
 * Skipped for reduced motion and for repeat visits within a session.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [skipped, setSkipped] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const progress = useMotionValue(0);
  const barScale = useTransform(progress, (v) => v / 100);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem("mwt-booted", "1");
    } catch {}
    onDone();
  };

  /* decide skip once on mount, from the frame callback */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("mwt-booted") === "1";
      } catch {}
      if (seen || reduced) {
        setSkipped(true);
        finish();
      } else {
        setSkipped(false);
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* run the sequence */
  useEffect(() => {
    if (skipped !== false) return;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const controls = animate(progress, 100, {
      duration: 1.15,
      ease: [0.55, 0.1, 0.3, 1],
      onUpdate: (v) => {
        setCount(Math.round(v));
        setStatusIdx(v < 55 ? 0 : v < 100 ? 1 : 2);
      },
      onComplete: () => {
        window.setTimeout(() => setExiting(true), 250);
      },
    });
    /* fail-safe: a starved frame loop (throttled background tab) must never
       trap the visitor behind the boot screen */
    const failSafe = window.setTimeout(() => setExiting(true), 4000);
    return () => {
      controls.stop();
      window.clearTimeout(failSafe);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [skipped, progress, lenis]);

  /* release scroll when the curtain lifts; finish even if the curtain
     animation itself never reports completion */
  useEffect(() => {
    if (!exiting) return;
    document.body.style.overflow = "";
    lenis?.start();
    const settle = window.setTimeout(finish, 1200);
    return () => window.clearTimeout(settle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting, lenis]);

  if (skipped !== false) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-abyss px-6 py-6 md:px-10 md:py-8"
      initial={{ y: 0 }}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      onAnimationComplete={() => {
        if (exiting) finish();
      }}
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">MWT — PORTFOLIO</span>
        <span className="eyebrow hidden sm:block">BOOT SEQUENCE</span>
      </div>

      <div className="select-none">
        <span className="block overflow-hidden">
          <motion.span
            className="block font-sans text-[11vw] font-black uppercase leading-[0.95] tracking-tight [font-stretch:120%] md:text-[7vw]"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          >
            Mohamed
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="block font-sans text-[11vw] font-black uppercase leading-[0.95] tracking-tight [font-stretch:120%] md:text-[7vw]"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.27 }}
          >
            Waleed&nbsp;Tagy
          </motion.span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="eyebrow flex items-center gap-2.5">
          {/* sweeping scope — the loading spinner, in instrument form */}
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <circle
              cx="10"
              cy="10"
              r="8.25"
              fill="none"
              stroke="color-mix(in srgb, var(--color-fog) 30%, transparent)"
              strokeWidth="1.5"
            />
            <g
              className="animate-sweep [transform-origin:10px_10px]"
              style={{ animationDuration: "1.3s" }}
            >
              <line
                x1="10"
                y1="10"
                x2="10"
                y2="2.5"
                stroke="var(--color-beacon)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
            <circle cx="10" cy="10" r="1.5" fill="var(--color-beacon)" />
          </svg>
          {STATUS[statusIdx]}
        </span>
        <span className="font-mono text-5xl tabular-nums text-fog md:text-6xl">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      {/* progress bar, driven by the same value as the counter */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-beacon"
        style={{ scaleX: barScale }}
      />
    </motion.div>
  );
}

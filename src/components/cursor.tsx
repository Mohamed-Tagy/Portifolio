"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "./primitives";

/** Desktop-only instrument cursor: an exact dot plus a lagging ring. */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"default" | "link">("default");

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 320, damping: 28, mass: 0.35 });
  const ringY = useSpring(dotY, { stiffness: 320, damping: 28, mass: 0.35 });

  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      setMode(
        t?.closest("a, button, [role='button'], input, textarea, [data-cursor='link']")
          ? "link"
          : "default",
      );
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [active, dotX, dotY]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* exact dot */}
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-fog"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      {/* lagging ring */}
      <motion.div
        className="absolute flex h-8 w-8 items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: mode === "link" ? 1.5 : 1,
          borderColor:
            mode === "link"
              ? "color-mix(in srgb, var(--color-beacon) 80%, transparent)"
              : "color-mix(in srgb, var(--color-fog) 35%, transparent)",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* crosshair ticks */}
        <span className="absolute left-1/2 top-[-3px] h-[5px] w-px -translate-x-1/2 bg-fog/40" />
        <span className="absolute bottom-[-3px] left-1/2 h-[5px] w-px -translate-x-1/2 bg-fog/40" />
      </motion.div>
    </div>
  );
}

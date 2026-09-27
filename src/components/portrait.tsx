"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import portrait from "@/assets/mohamed-tagy.jpg";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { TickFrame } from "./primitives";

const SIZES = "(min-width: 1024px) 25rem, 20rem";

/**
 * Hero portrait, framed like the instruments. It arrives as a phosphor
 * monochrome frame; a scan line then sweeps down and resolves it to color.
 */
export function Portrait({ booted }: { booted: boolean }) {
  const reduced = useReducedMotion();
  const scan = useMotionValue(0);
  const clip = useTransform(scan, (v) => `inset(0 0 ${(1 - v) * 100}% 0)`);
  const lineTop = useTransform(scan, (v) => `${v * 100}%`);
  const lineOpacity = useTransform(scan, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (!booted) return;
    if (reduced) {
      scan.set(1);
      return;
    }
    const controls = animate(scan, 1, {
      duration: 1.6,
      ease: EASE_IN_OUT,
      delay: 0.9,
    });
    return () => controls.stop();
  }, [booted, reduced, scan]);

  return (
    <motion.figure
      className="group relative w-full max-w-[20rem] lg:ml-auto lg:max-w-[25rem]"
      initial={{ opacity: 0, y: 24 }}
      animate={booted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-fog/10 bg-panel">
        {/* phosphor monochrome — the frame before the scan resolves it */}
        <Image
          src={portrait}
          alt=""
          aria-hidden
          fill
          sizes={SIZES}
          loading="eager"
          placeholder="blur"
          className="object-cover object-[48%_50%] brightness-110 contrast-125 grayscale transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-beacon mix-blend-multiply"
        />

        {/* resolved color */}
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <Image
            src={portrait}
            alt="Mohamed Waleed Tagy in a dark suit, standing outdoors"
            fill
            sizes={SIZES}
            loading="eager"
            className="object-cover object-[48%_50%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </motion.div>

        {/* scan line */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 h-px bg-beacon"
          style={{
            top: lineTop,
            opacity: lineOpacity,
            boxShadow: "0 0 14px 2px var(--color-beacon)",
          }}
        />

        {/* depth at the foot of the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-abyss) 45%, transparent), transparent)",
          }}
        />
        <TickFrame />
      </div>

      <figcaption className="mt-3 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.16em] text-dim">
        <span>Fig. 01 — The operator</span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-beacon" />
          On watch
        </span>
      </figcaption>
    </motion.figure>
  );
}

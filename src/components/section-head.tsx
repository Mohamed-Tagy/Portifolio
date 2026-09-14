"use client";

import type { ReactNode } from "react";
import { MaskLines, Rise } from "./primitives";

/**
 * Chart-annotation section header: an indexed mono label rule,
 * then the display title revealed line by line.
 */
export function SectionHead({
  index,
  label,
  sub,
  title,
  meta,
}: {
  index: string;
  label: string;
  sub?: string;
  title: ReactNode[];
  meta?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Rise className="mb-8 flex items-center justify-between gap-6 border-t border-fog/10 pt-4 md:mb-10">
        <span className="eyebrow flex items-center gap-3 text-fog">
          <span className="text-dim">[{index}]</span>
          {label}
          {sub && <span className="hidden text-dim sm:inline">— {sub}</span>}
        </span>
        {meta && <span className="eyebrow hidden md:block">{meta}</span>}
      </Rise>
      <h2>
        <MaskLines
          className="font-sans font-black uppercase leading-[0.95] tracking-[-0.01em] [font-stretch:118%] text-[clamp(2.4rem,6vw,4.9rem)]"
          lines={title}
        />
      </h2>
    </div>
  );
}

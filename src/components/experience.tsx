"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { log } from "@/lib/data";
import { Rise } from "./primitives";
import { SectionHead } from "./section-head";

export function Experience() {
  const trackRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 70%"],
  });

  return (
    <section id="experience" aria-label="Experience" className="relative">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-10 md:py-40">
        <SectionHead
          index="04"
          label="Experience"
          sub="Voyage log"
          meta="2023 — PRESENT"
          title={[
            "Four berths,",
            <span key="l2">
              one{" "}
              <span className="accent-serif normal-case text-beacon">
                discipline
              </span>
              .
            </span>,
          ]}
        />

        <ul ref={trackRef} className="relative max-w-5xl space-y-16 md:space-y-20">
          {/* track line + scroll fill */}
          <span
            aria-hidden
            className="absolute bottom-1 left-[5px] top-1 w-px bg-fog/10"
          />
          <motion.span
            aria-hidden
            className="absolute bottom-1 left-[5px] top-1 w-px origin-top bg-beacon"
            style={{ scaleY: scrollYProgress }}
          />

          {log.map((entry) => (
            <li key={`${entry.org}-${entry.period}`} className="relative pl-10 md:pl-16">
              {/* waypoint node */}
              <motion.span
                aria-hidden
                className="absolute left-0 top-1.5 flex h-[11px] w-[11px] items-center justify-center rounded-full border bg-void"
                initial={{ borderColor: "color-mix(in srgb, var(--color-fog) 25%, transparent)" }}
                whileInView={{ borderColor: "var(--color-beacon)" }}
                viewport={{ once: true, amount: 1, margin: "0px 0px -35% 0px" }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="h-[3px] w-[3px] rounded-full bg-beacon"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 1, margin: "0px 0px -35% 0px" }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
              </motion.span>

              <Rise index={0} amount={0.25}>
                <div className="grid gap-x-10 gap-y-3 md:grid-cols-12">
                  <div className="md:col-span-4 lg:col-span-3">
                    <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-beacon">
                      {entry.period}
                    </p>
                    <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-dim">
                      {entry.place.toUpperCase()}
                    </p>
                  </div>
                  <div className="md:col-span-8 lg:col-span-9">
                    <h3 className="font-sans text-xl font-bold uppercase [font-stretch:112%] md:text-2xl">
                      {entry.org}
                    </h3>
                    <p className="mt-1 text-sm text-haze">{entry.title}</p>
                    <ul className="mt-4 max-w-2xl space-y-2.5">
                      {entry.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-pretty text-sm leading-relaxed text-haze"
                        >
                          <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-fog/30" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { projects, type Project } from "@/lib/data";
import { clipReveal } from "@/lib/motion";
import { Instrument } from "./instruments";
import { Rise, TickFrame } from "./primitives";
import { SectionHead } from "./section-head";

export function Work() {
  return (
    <section id="projects" aria-label="Selected work" className="relative">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-10 md:py-40">
        <SectionHead
          index="02"
          label="Selected work"
          sub="Position fixes"
          meta="05 FIXES LOGGED"
          title={[
            "Built, delivered,",
            <span key="l2">
              and{" "}
              <span className="accent-serif normal-case text-beacon">
                verified
              </span>
              .
            </span>,
          ]}
        />

        <div className="space-y-24 md:space-y-36">
          {projects.map((project, i) => (
            <ProjectRow key={project.fix} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, flip }: { project: Project; flip: boolean }) {
  const rowRef = useRef<HTMLElement>(null);
  /* instruments run only near the viewport */
  const inView = useInView(rowRef, { margin: "15% 0px 15% 0px" });
  /* one-shot reveal for the panel */
  const shown = useInView(rowRef, { once: true, amount: 0.25 });

  return (
    <article
      ref={rowRef}
      className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* instrument panel */}
      <motion.div
        className={`relative lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        variants={clipReveal}
        initial="hidden"
        animate={shown ? "visible" : "hidden"}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-fog/10 bg-panel transition-colors duration-500 group-hover:border-fog/25">
          <TickFrame />
          {/* radial well */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 90% at 50% 45%, transparent 40%, color-mix(in srgb, var(--color-abyss) 70%, transparent))",
            }}
          />
          <div className="absolute inset-0 p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] md:p-6">
            <Instrument kind={project.visual} active={inView} />
          </div>
          {/* status line */}
          <div className="absolute right-4 top-3.5 z-10 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-dim">
            FIX {project.fix}
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                inView ? "bg-beacon" : "bg-dim"
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* dossier */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <Rise className="flex items-baseline gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-beacon">
            FIX {project.fix}
          </span>
          <span className="eyebrow">{project.category}</span>
        </Rise>

        <Rise index={1}>
          <h3 className="mt-4 text-balance font-sans text-3xl font-black uppercase leading-[1.02] tracking-[-0.01em] [font-stretch:115%] md:text-4xl">
            {project.title}
          </h3>
        </Rise>

        <Rise index={2}>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-haze">
            {project.description}
          </p>
        </Rise>

        <Rise index={3}>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-[2px] border border-fog/12 px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-haze transition-colors duration-300 hover:border-beacon/50 hover:text-fog"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Rise>

        <Rise index={4}>
          <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-t border-fog/10 pt-5">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-dim">
              Role
            </dt>
            <dd className="text-sm text-fog">{project.role}</dd>
            {project.year && (
              <>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-dim">
                  Year
                </dt>
                <dd className="font-mono text-sm tabular-nums text-fog">
                  {project.year}
                </dd>
              </>
            )}
            {project.status && (
              <>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-dim">
                  Status
                </dt>
                <dd className="text-sm text-fog">{project.status}</dd>
              </>
            )}
          </dl>
        </Rise>
      </div>
    </article>
  );
}

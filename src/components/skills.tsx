"use client";

import { useState } from "react";
import { skillGroups, ticker, type SkillGroup } from "@/lib/data";
import { Rise } from "./primitives";
import { SectionHead } from "./section-head";

export function Skills() {
  return (
    <section id="skills" aria-label="Skills" className="relative">
      <div className="mx-auto max-w-[90rem] px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
        <SectionHead
          index="03"
          label="Skills"
          sub="Instrument rack"
          meta="03 RACKS · 20 MODULES"
          title={[
            "Three racks,",
            <span key="l2">
              one{" "}
              <span className="accent-serif normal-case text-beacon">
                operator
              </span>
              .
            </span>,
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Rise key={group.code} index={i} amount={0.2}>
              <SkillPanel group={group} />
            </Rise>
          ))}
        </div>
      </div>

      {/* tool conveyor */}
      <div className="overflow-hidden border-y border-fog/10 py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-0 hover:[animation-play-state:paused]">
          {[...ticker, ...ticker].map((tool, i) => (
            <span
              key={i}
              className="flex items-center font-mono text-sm uppercase tracking-[0.18em] text-haze"
            >
              {tool}
              <span className="mx-7 text-beacon">+</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillPanel({ group }: { group: SkillGroup }) {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col rounded-[2px] border border-fog/10 bg-panel p-6 transition-colors duration-500 hover:border-fog/20 md:p-7">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="font-sans text-lg font-bold uppercase tracking-[0.02em] [font-stretch:112%]">
          {group.name}
        </h3>
        <span className="font-mono text-[0.625rem] tracking-[0.2em] text-dim">
          {group.code}
        </span>
      </div>

      <ul className="flex flex-wrap gap-2" onMouseLeave={() => setNote(null)}>
        {group.skills.map((skill) => (
          <li key={skill.name}>
            <button
              type="button"
              onMouseEnter={() => setNote(skill.note)}
              onFocus={() => setNote(skill.note)}
              onClick={() => setNote(skill.note)}
              className="rounded-[2px] border border-fog/12 px-3 py-2 text-[0.8125rem] text-fog/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-beacon/60 hover:bg-raised hover:text-fog"
            >
              {skill.name}
            </button>
          </li>
        ))}
      </ul>

      {/* readout line */}
      <p
        aria-live="polite"
        className="mt-auto flex min-h-9 items-end gap-2 border-t border-fog/10 pt-4 font-mono text-[0.6875rem] tracking-[0.08em]"
      >
        <span className="text-beacon">&gt;</span>
        <span className={note ? "text-fog" : "text-dim"}>
          {note ?? "HOVER A MODULE FOR DETAIL"}
        </span>
      </p>
    </div>
  );
}

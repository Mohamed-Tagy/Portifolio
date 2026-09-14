"use client";

import { principles } from "@/lib/data";
import { Rise } from "./primitives";
import { SectionHead } from "./section-head";

export function Principles() {
  return (
    <section aria-label="Principles" className="relative">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-10 md:py-40">
        <SectionHead
          index="05"
          label="Principles"
          sub="Standing orders"
          title={[
            "How the work",
            <span key="l2">
              gets{" "}
              <span className="accent-serif normal-case text-beacon">done</span>.
            </span>,
          ]}
        />

        <div className="border-b border-t border-fog/10">
          {principles.map((principle, i) => (
            <Rise key={principle.n} index={i} amount={0.4}>
              <div className="group grid gap-x-10 gap-y-2 border-t border-fog/10 px-2 py-8 transition-colors duration-500 first:border-t-0 hover:bg-panel md:grid-cols-12 md:items-baseline md:px-5 md:py-10">
                <span className="font-mono text-xs tracking-[0.2em] text-dim transition-colors duration-300 group-hover:text-beacon md:col-span-1">
                  {principle.n}
                </span>
                <h3 className="font-sans text-xl font-bold uppercase tracking-[0.01em] [font-stretch:114%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:col-span-5 md:text-2xl">
                  {principle.title}
                </h3>
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-haze md:col-span-6 md:text-base">
                  {principle.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { about, identity, usp } from "@/lib/data";
import { Counter, Rise, TickFrame } from "./primitives";
import { SectionHead } from "./section-head";

export function About() {
  return (
    <section id="about" aria-label="About" className="relative">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-10 md:py-40">
        <SectionHead
          index="01"
          label="About"
          sub="The operator"
          meta={identity.coordinates}
          title={[
            "Code on one bench,",
            <span key="l2">
              circuitry on the{" "}
              <span className="accent-serif normal-case text-beacon">other</span>
              .
            </span>,
          ]}
        />

        {/* USP — the claim stated plainly, with its evidence beneath */}
        <Rise className="mb-16 md:mb-24" amount={0.25}>
          <div className="relative rounded-[2px] border border-beacon/30 bg-panel px-6 py-9 md:px-12 md:py-12">
            <TickFrame />
            <p className="eyebrow flex items-center gap-3 text-beacon">
              <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-beacon" />
              [USP] — {usp.label}
            </p>
            <p className="mt-6 max-w-5xl text-balance font-sans text-[clamp(1.75rem,3.6vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.01em] text-haze">
              {usp.lead}{" "}
              <span className="text-fog">
                {usp.claim.before}{" "}
                <span className="accent-serif text-beacon">
                  {usp.claim.accent}
                </span>{" "}
                {usp.claim.after}
              </span>
            </p>
            <p className="mt-6 max-w-3xl text-pretty leading-relaxed text-haze md:text-lg">
              {usp.body}
            </p>
            <ul
              aria-label="Evidence"
              className="mt-8 flex flex-wrap gap-2 border-t border-fog/10 pt-6"
            >
              {usp.proofs.map((proof) => (
                <li
                  key={proof}
                  className="flex items-center gap-2 rounded-[2px] border border-fog/12 px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fog"
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 text-beacon"
                    aria-hidden
                  >
                    <path
                      d="M2 6.5 4.8 9 10 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {proof}
                </li>
              ))}
            </ul>
          </div>
        </Rise>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* bio + stats */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl space-y-6">
              {about.bio.map((p, i) => (
                <Rise key={i} index={i}>
                  <p className="text-pretty leading-relaxed text-haze [&>i]:text-fog">
                    {p}
                  </p>
                </Rise>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] border border-fog/10 bg-fog/10 md:mt-16 lg:grid-cols-4">
              {about.stats.map((stat, i) => (
                <Rise
                  key={stat.label}
                  index={i}
                  className="bg-void p-5 md:p-6"
                  amount={0.4}
                >
                  <div className="font-mono text-4xl tabular-nums text-fog md:text-5xl">
                    <Counter
                      value={stat.value}
                      pad={stat.pad}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-3 text-[0.8125rem] leading-snug text-haze">
                    {stat.label}
                  </p>
                </Rise>
              ))}
            </div>
          </div>

          {/* station card */}
          <Rise index={1} className="lg:col-span-4 lg:col-start-9">
            <div className="relative rounded-[2px] border border-fog/10 bg-panel p-7 md:p-8">
              <TickFrame />

              {/* compass rose */}
              <div className="mb-8 flex items-center justify-between">
                <svg
                  viewBox="0 0 96 96"
                  className="h-20 w-20"
                  aria-hidden
                  role="presentation"
                >
                  <g
                    className="origin-center animate-[sweep_70s_linear_infinite]"
                    stroke="color-mix(in srgb, var(--color-fog) 30%, transparent)"
                    fill="none"
                  >
                    <circle cx="48" cy="48" r="44" strokeWidth="1" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line
                        key={i}
                        x1="48"
                        y1="4"
                        x2="48"
                        y2={i % 6 === 0 ? "12" : "8"}
                        transform={`rotate(${i * 15} 48 48)`}
                      />
                    ))}
                  </g>
                  <circle
                    cx="48"
                    cy="48"
                    r="20"
                    fill="none"
                    stroke="color-mix(in srgb, var(--color-fog) 15%, transparent)"
                  />
                  <path
                    d="M48 30 L53 48 L48 66 L43 48 Z"
                    fill="var(--color-beacon)"
                    opacity="0.9"
                  />
                  <circle cx="48" cy="48" r="2.5" fill="var(--color-fog)" />
                </svg>
                <span className="eyebrow text-right leading-relaxed">
                  STATION
                  <br />
                  CARD
                </span>
              </div>

              <dl>
                {about.facts.map((fact) => (
                  <div
                    key={fact.k}
                    className="flex items-baseline justify-between gap-6 border-t border-fog/10 py-3.5 last:pb-0"
                  >
                    <dt className="font-mono text-[0.625rem] tracking-[0.2em] text-dim">
                      {fact.k}
                    </dt>
                    <dd className="text-right text-sm text-fog">{fact.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

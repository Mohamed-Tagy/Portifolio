"use client";

import { contact, identity } from "@/lib/data";
import { Button, MaskLines, PointerGlow, Rise, ULink } from "./primitives";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative flex min-h-[92svh] items-center overflow-hidden border-t border-fog/10"
    >
      <PointerGlow opacity={0.65} />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-6 py-28 text-center md:px-10">
        <Rise>
          <p className="eyebrow mb-10 flex items-center justify-center gap-3">
            <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-beacon" />
            [06] CONTACT — ALL CHANNELS OPEN
          </p>
        </Rise>

        <h2>
          <MaskLines
            className="font-sans font-black uppercase leading-[0.94] tracking-[-0.015em] [font-stretch:120%] text-[clamp(2.6rem,8.5vw,7.5rem)]"
            lines={[
              "Have something",
              <span key="l2">
                worth{" "}
                <span className="accent-serif normal-case text-beacon">
                  building
                </span>
                ?
              </span>,
            ]}
          />
        </h2>

        <Rise index={2}>
          <p className="mx-auto mt-8 max-w-lg text-pretty leading-relaxed text-haze">
            {contact.sub}
          </p>
        </Rise>

        <Rise index={3} className="mt-12">
          <Button href={`mailto:${identity.email}`}>Say hello</Button>
        </Rise>

        <Rise index={4}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-haze">
            <ULink href={identity.github} external>
              GitHub
            </ULink>
            <ULink href={identity.linkedin} external>
              LinkedIn
            </ULink>
            <ULink href={`tel:${identity.phone.replace(/\s/g, "")}`}>
              {identity.phone}
            </ULink>
            <span className="text-dim">{identity.base.toUpperCase()}</span>
          </div>
        </Rise>
      </div>
    </section>
  );
}

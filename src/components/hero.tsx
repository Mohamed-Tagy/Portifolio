"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero, identity, nmea } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";
import { Portrait } from "./portrait";
import { Button, MaskLines, PointerGlow, ULink } from "./primitives";
import { useScrollTo } from "./providers";

export function Hero({ booted }: { booted: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const drift = useTransform(scrollYProgress, [0, 1], [0, -110]);

  const state = booted ? "visible" : "hidden";

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden"
      aria-label="Introduction"
    >
      <PointerGlow opacity={0.55} />

      <motion.div
        style={{ opacity: fade, y: drift }}
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-32"
      >
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
          {/* identity — the two largest voices on the page */}
          <div className="lg:col-span-8">
            <motion.div
              className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:mb-8"
              initial={{ opacity: 0, y: 14 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
            >
              <span className="eyebrow flex items-center gap-2 text-fog">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-beacon" />
                {hero.eyebrowA}
              </span>
              <span aria-hidden className="hidden h-px w-10 bg-fog/20 sm:block" />
              <span className="eyebrow">{hero.eyebrowB}</span>
            </motion.div>

            <h1>
              <MaskLines
                animate={state}
                startIndex={3}
                className="font-sans font-black uppercase leading-[0.9] tracking-[-0.015em] [font-stretch:122%] text-[11.6vw] lg:text-[clamp(4.5rem,7.4vw,7.25rem)]"
                lines={hero.name}
              />
              <MaskLines
                animate={state}
                startIndex={5}
                className="accent-serif mt-3 leading-[1.12] text-beacon text-[clamp(1.75rem,7.2vw,2.6rem)] lg:mt-4 lg:text-[clamp(2.2rem,3.3vw,3.25rem)]"
                lines={[hero.title]}
              />
            </h1>

            <motion.p
              className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-haze md:mt-6"
              initial={{ opacity: 0, y: 14 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.65 }}
            >
              {hero.affiliation}
            </motion.p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:self-center">
            <Portrait booted={booted} />
          </div>

          {/* pitch + actions */}
          <div className="lg:col-span-7">
            <motion.p
              className="max-w-md text-pretty text-base leading-relaxed text-haze"
              initial={{ opacity: 0, y: 18 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.75 }}
            >
              {hero.sub}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={booted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 }}
            >
              <Button
                href={hero.primaryCta.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("projects");
                }}
              >
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
              >
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* instrument strip */}
      <motion.div
        className="relative z-10 border-t border-fog/10"
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.05 }}
      >
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-4 md:px-10">
          <NmeaReadout />
          <div className="flex items-center gap-6">
            <span className="hidden font-mono text-[0.6875rem] tracking-[0.16em] text-haze sm:inline-flex sm:items-center sm:gap-4">
              <ULink href={identity.github} external>
                GITHUB
              </ULink>
              <ULink href={identity.linkedin} external>
                LINKEDIN
              </ULink>
              <ULink href={`mailto:${identity.email}`}>EMAIL</ULink>
            </span>
            <span className="eyebrow flex items-center gap-2">
              SCROLL
              <motion.span
                aria-hidden
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ↓
              </motion.span>
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Live navigation sentence — position fixed, heading follows the scroll. */
function NmeaReadout() {
  const [sentence, setSentence] = useState(() =>
    nmea("MWNAV,3112.01,N,02955.12,E,HDG,000.0,STA,OPEN"),
  );
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      const hdg = (Math.min(1, Math.max(0, p)) * 360).toFixed(1).padStart(5, "0");
      setSentence(nmea(`MWNAV,3112.01,N,02955.12,E,HDG,${hdg},STA,OPEN`));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <span
      className="font-mono text-[0.625rem] tracking-[0.08em] text-dim md:text-[0.6875rem]"
      aria-hidden
    >
      {sentence}
    </span>
  );
}

"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { identity, nmea } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";
import { ULink } from "./primitives";
import { useLenis } from "./providers";

export function Footer() {
  const lenis = useLenis();

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-fog/10">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        {/* instrument row */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <ClockSentence />
          <button
            type="button"
            onClick={backToTop}
            className="group flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-haze transition-colors duration-300 hover:text-fog"
          >
            Return to 000°
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1"
            >
              ↑
            </span>
          </button>
        </div>

        {/* wordmark */}
        <div className="overflow-hidden border-t border-fog/10 pb-2 pt-6 md:pt-10">
          <motion.p
            aria-hidden
            className="text-hollow select-none text-center font-sans font-black uppercase leading-[0.85] tracking-[0.02em] [font-stretch:125%] text-[clamp(4.5rem,19vw,17rem)] transition-colors duration-700 hover:text-fog/10"
            initial={{ y: "45%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            Tagy
          </motion.p>
        </div>

        {/* colophon */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-fog/10 py-6">
          <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-dim">
            © 2026 {identity.name.toUpperCase()}
          </p>
          <p className="hidden font-mono text-[0.6875rem] tracking-[0.14em] text-dim md:block">
            DESIGNED & BUILT FROM A BLANK CHART
          </p>
          <div className="flex items-center gap-8 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-haze">
            <ULink href={identity.github} external>
              GitHub
            </ULink>
            <ULink href={identity.linkedin} external>
              LinkedIn
            </ULink>
            <ULink href={`mailto:${identity.email}`}>Email</ULink>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Live station clock, Alexandria time, spoken in NMEA. */
function ClockSentence() {
  const [sentence, setSentence] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: identity.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () =>
      setSentence(nmea(`MWCLK,${fmt.format(new Date()).replace(/:/g, "")},ALX`));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className="font-mono text-[0.625rem] tracking-[0.08em] text-dim md:text-[0.6875rem]"
      aria-label="Local time in Alexandria"
    >
      {sentence || "$MWCLK,——,ALX"}
    </p>
  );
}

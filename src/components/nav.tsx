"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { identity, nav } from "@/lib/data";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useLenis, useScrollTo } from "./providers";
import { ThemeToggle } from "./theme";

/**
 * Fixed instrument bar. Signature: a live HDG readout that maps scroll
 * progress onto a 0–360° voyage — the page read as a heading.
 */
export function Nav({ booted }: { booted: boolean }) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hdg, setHdg] = useState("000.0");
  const { scrollYProgress, scrollY } = useScroll();
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const deg = Math.min(360, Math.max(0, p * 360));
    setHdg(deg.toFixed(1).padStart(5, "0"));
  });
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  /* active-section tracking */
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* lock scroll behind the mobile menu */
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [open, lenis]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    /* let the menu close before travelling */
    window.setTimeout(() => scrollTo(id), open ? 80 : 0);
  };

  const desktopItems = nav.filter((n) => n.id !== "home");

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !open
            ? "border-fog/10 bg-void/75 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
        initial={{ y: -64, opacity: 0 }}
        animate={booted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-6 md:px-10">
          <a
            href="#home"
            onClick={(e) => go(e, "home")}
            className="font-mono text-xs font-medium tracking-[0.22em] text-fog"
            aria-label="Back to top"
          >
            M.W.TAGY
          </a>

          {/* desktop links */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {desktopItems.map((item) => (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      active === item.id ? "text-fog" : "text-haze hover:text-fog"
                    }`}
                  >
                    {item.label}
                  </a>
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-beacon"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {/* live heading readout */}
            <span
              className="hidden items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-haze sm:flex"
              aria-label={`Scroll progress ${hdg} of 360 degrees`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-beacon" />
              HDG <span className="tabular-nums text-fog">{hdg}°</span>
            </span>

            {/* day / night watch */}
            <ThemeToggle />

            {/* mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span
                className={`absolute h-px w-5 bg-fog transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
              />
              <span
                className={`absolute h-px w-5 bg-fog transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-abyss/95 px-6 pb-10 pt-28 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE_IN_OUT }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      className={`flex items-baseline gap-4 py-2 font-sans text-4xl font-black uppercase tracking-tight [font-stretch:115%] ${
                        active === item.id ? "text-beacon" : "text-fog"
                      }`}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{
                        duration: 0.5,
                        ease: EASE_OUT,
                        delay: 0.04 * i,
                      }}
                    >
                      <span className="font-mono text-[0.625rem] tracking-[0.2em] text-dim">
                        {String(i).padStart(2, "0")}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="eyebrow">{identity.coordinates}</p>
              <a
                href={`mailto:${identity.email}`}
                className="block break-all font-mono text-xs text-haze"
              >
                {identity.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

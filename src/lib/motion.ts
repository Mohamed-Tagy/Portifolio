/* Motion system — one vocabulary for the whole site. */

import type { Transition, Variants } from "motion/react";

/* easing */
export const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1]; // expo-out
export const EASE_IN_OUT: Transition["ease"] = [0.65, 0, 0.35, 1];

/* durations (s) */
export const D = {
  micro: 0.2,
  ui: 0.4,
  section: 0.8,
  cinematic: 1.1,
} as const;

/* standard entrance: fade + rise */
export const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: D.section, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

/* masked line reveal — pair with an overflow-hidden parent */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.09 * i },
  }),
};

/* media clip reveal */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: D.cinematic, ease: EASE_IN_OUT },
  },
};

/* shared viewport config */
export const VIEWPORT = { once: true, amount: 0.3 } as const;
export const VIEWPORT_SOFT = { once: true, amount: 0.15 } as const;

"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { EASE_OUT, maskLine, rise } from "@/lib/motion";

/* ---------------------------------------------------------------- pointers */

function subscribeFinePointer(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function useFinePointer() {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

/* ---------------------------------------------------------------- magnetic */

export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.15 });
  const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.15 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!fine || reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------- reveals */

export function Rise({
  children,
  index = 0,
  className = "",
  amount = 0.3,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      custom={index}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line-by-line reveal. Wrap in the heading element yourself.
 * The viewport observer watches the (unclipped) container — the lines
 * themselves start translated outside an overflow-hidden mask, so
 * observing them directly would never fire.
 */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  startIndex = 0,
  animate: animateState,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  startIndex?: number;
  /** When provided, drives the reveal externally instead of the viewport. */
  animate?: "hidden" | "visible";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const state = animateState ?? (inView ? "visible" : "hidden");
  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            variants={maskLine}
            initial="hidden"
            animate={state}
            custom={i + startIndex}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------- counter */

export function Counter({
  value,
  pad = 0,
  suffix = "",
  className = "",
}: {
  value: number;
  pad?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const reduced = useReducedMotion();
  const [text, setText] = useState("0".padStart(pad, "0"));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: reduced ? 0 : 1.6,
      ease: EASE_OUT,
      onUpdate: (v) => setText(String(Math.round(v)).padStart(pad, "0")),
    });
    return () => controls.stop();
  }, [inView, value, pad, mv, reduced]);

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------- links */

/** Text link with an animated underline. */
export function ULink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={`group relative inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
      {external && (
        <span
          aria-hidden
          className="inline-block text-[0.8em] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      )}
      <span
        aria-hidden
        className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-beacon transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
      />
    </a>
  );
}

/* ----------------------------------------------------------------- buttons */

export function Button({
  href,
  children,
  variant = "primary",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-[2px] px-7 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-fog text-void"
      : "border border-fog/20 text-fog hover:border-fog/50";
  return (
    <Magnetic strength={0.2}>
      <a href={href} onClick={onClick} className={`${base} ${styles}`}>
        {variant === "primary" && (
          <span
            aria-hidden
            className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-beacon transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
          />
        )}
        <span className="relative z-10">{children}</span>
        <span
          aria-hidden
          className="relative z-10 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    </Magnetic>
  );
}

/* ----------------------------------------------------------- corner ticks */

/** Chart-plotting registration marks on a media frame. */
export function TickFrame() {
  const tick = "absolute h-3 w-3 border-fog/30";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span className={`${tick} left-0 top-0 border-l border-t`} />
      <span className={`${tick} right-0 top-0 border-r border-t`} />
      <span className={`${tick} bottom-0 left-0 border-b border-l`} />
      <span className={`${tick} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}

/* ----------------------------------------------------------- pointer glow */

/** A soft beacon-light that follows the pointer inside its parent section. */
export function PointerGlow({ opacity = 0.5 }: { opacity?: number }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 60, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 60, damping: 20, mass: 0.4 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const onMove = (e: globalThis.MouseEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 -z-0 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x,
        y,
        opacity,
        background:
          "radial-gradient(closest-side, color-mix(in srgb, var(--color-beacon) 9%, transparent), transparent 70%)",
      }}
    />
  );
}

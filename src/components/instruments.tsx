"use client";

import { motion } from "motion/react";
import { nmea } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";

/*
 * Bespoke project visuals, drawn as live instruments instead of stock imagery.
 * Each idles at low intensity and powers up on hover (via parent `group`).
 * `active` gates the continuous animations to the viewport.
 */

const FOG_30 = "color-mix(in srgb, var(--color-fog) 30%, transparent)";
const FOG_15 = "color-mix(in srgb, var(--color-fog) 15%, transparent)";
const label =
  "font-mono text-[9px] tracking-[0.14em] uppercase fill-[var(--color-haze)]";
const labelDim =
  "font-mono text-[9px] tracking-[0.14em] uppercase fill-[var(--color-dim)]";

export function Instrument({
  kind,
  active,
}: {
  kind: "vision" | "nmea" | "dataverse" | "radar" | "portal";
  active: boolean;
}) {
  switch (kind) {
    case "vision":
      return <VisionInstrument active={active} />;
    case "nmea":
      return <NmeaInstrument active={active} />;
    case "dataverse":
      return <DataverseInstrument active={active} />;
    case "radar":
      return <RadarInstrument active={active} />;
    case "portal":
      return <PortalInstrument active={active} />;
  }
}

/* ------------------------------------------------ FIX 01 — eye-state scope */

function VisionInstrument({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full transition-opacity duration-700 opacity-70 group-hover:opacity-100"
      aria-hidden
      role="presentation"
    >
      <defs>
        <clipPath id="eye-clip">
          <path d="M80 180 Q240 70 400 180 Q240 290 80 180 Z" />
        </clipPath>
      </defs>

      {/* eye outline */}
      <path
        d="M80 180 Q240 70 400 180 Q240 290 80 180 Z"
        fill="none"
        stroke={FOG_30}
        strokeWidth="1.5"
      />
      {/* iris + pupil */}
      <circle cx="240" cy="180" r="58" fill="none" stroke={FOG_30} strokeWidth="1.5" />
      <circle
        cx="240"
        cy="180"
        r="42"
        fill="none"
        stroke={FOG_15}
        strokeDasharray="3 6"
        className="transition-opacity duration-700 opacity-60 group-hover:opacity-100"
      />
      <circle cx="240" cy="180" r="20" fill="color-mix(in srgb, var(--color-fog) 8%, transparent)" stroke={FOG_30} />
      {/* pupil crosshair */}
      <line x1="240" y1="150" x2="240" y2="164" stroke="var(--color-beacon)" strokeWidth="1" />
      <line x1="240" y1="196" x2="240" y2="210" stroke="var(--color-beacon)" strokeWidth="1" />
      <line x1="210" y1="180" x2="224" y2="180" stroke="var(--color-beacon)" strokeWidth="1" />
      <line x1="256" y1="180" x2="270" y2="180" stroke="var(--color-beacon)" strokeWidth="1" />

      {/* scan line, clipped to the eye */}
      {active && (
        <g clipPath="url(#eye-clip)">
          <g className="animate-scan [transform-origin:240px_180px]">
            <line
              x1="80"
              y1="180"
              x2="400"
              y2="180"
              stroke="var(--color-beacon)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <rect x="80" y="180" width="320" height="26" fill="url(#scan-fade)" opacity="0.5" />
          </g>
        </g>
      )}
      <defs>
        <linearGradient id="scan-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-beacon)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-beacon)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* annotations */}
      <text x="28" y="40" className={label}>CAM 01 — LIVE FEED</text>
      <text x="28" y="336" className={labelDim}>VIT CLASSIFIER · VAL ACC 99.2%</text>
      <text x="452" y="40" textAnchor="end" className={labelDim}>CPU — 15 FPS</text>
      <g className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">
        <circle cx="380" cy="331" r="3" fill="var(--color-beacon)" className={active ? "animate-blink" : ""} />
        <text x="392" y="336" className={label}>STATE: AWAKE</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------- FIX 02 — sentence stream feed */

const SENTENCES = [
  { s: nmea("GPGGA,093824,3112.01,N,02955.12,E,1,08,0.9,12.1,M"), ok: true },
  { s: nmea("GPHDT,127.4,T"), ok: true },
  { s: nmea("GPGGA,093825,3112.02,N,02955.13,E,1,08,0.9,12.0,M"), ok: true },
  { s: "$GPGGA,0938⌁6,31⌁2.0,N,029", ok: false },
  { s: nmea("GPHDT,127.9,T"), ok: true },
  { s: nmea("GPGGA,093827,3112.04,N,02955.15,E,1,09,0.8,11.8,M"), ok: true },
  { s: nmea("GPHDT,128.3,T"), ok: true },
  { s: "$GPHDT,12⌁.EE,T*XX", ok: false },
  { s: nmea("GPGGA,093829,3112.06,N,02955.17,E,1,09,0.8,11.7,M"), ok: true },
  { s: nmea("GPHDT,128.8,T"), ok: true },
];

function NmeaInstrument({ active }: { active: boolean }) {
  const rows = [...SENTENCES, ...SENTENCES]; // duplicated for a seamless loop
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full transition-opacity duration-700 opacity-70 group-hover:opacity-100"
      aria-hidden
      role="presentation"
    >
      <defs>
        <clipPath id="stream-clip">
          <rect x="24" y="58" width="432" height="252" />
        </clipPath>
      </defs>

      <text x="28" y="40" className={label}>SERIAL — 4800 BAUD</text>
      <text x="452" y="40" textAnchor="end" className={labelDim}>GGA · HDT</text>

      <line x1="24" y1="58" x2="456" y2="58" stroke={FOG_15} />
      <line x1="24" y1="310" x2="456" y2="310" stroke={FOG_15} />

      <g clipPath="url(#stream-clip)">
        <g className={active ? "animate-stream" : ""}>
          {rows.map((row, i) => (
            <g key={i} transform={`translate(0 ${76 + i * 25})`}>
              <text x="32" y="0" className={labelDim}>
                {String((i % SENTENCES.length) + 1).padStart(2, "0")}
              </text>
              <text
                x="58"
                y="0"
                className="font-mono text-[9.5px]"
                fill={
                  row.ok
                    ? "color-mix(in srgb, var(--color-fog) 60%, transparent)"
                    : "var(--color-beacon)"
                }
              >
                {row.s.length > 46 ? `${row.s.slice(0, 46)}…` : row.s}
              </text>
              <text
                x="452"
                y="0"
                textAnchor="end"
                className="font-mono text-[9px] tracking-[0.1em]"
                fill={row.ok ? "color-mix(in srgb, var(--color-fog) 35%, transparent)" : "var(--color-beacon)"}
              >
                {row.ok ? "OK" : "REJ"}
              </text>
            </g>
          ))}
        </g>
      </g>

      <g className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">
        <circle cx="32" cy="331" r="3" fill="var(--color-beacon)" className={active ? "animate-blink" : ""} />
        <text x="44" y="336" className={label}>PIPELINE STABLE — MALFORMED FRAMES DROPPED</text>
      </g>
    </svg>
  );
}

/* --------------------------------------- FIX 03 — dataverse constellation */

const NODES = [
  { x: 120, y: 120, r: 26, name: "ACCOUNT" },
  { x: 280, y: 84, r: 18, name: "CONTACT" },
  { x: 396, y: 150, r: 21, name: "CASE" },
  { x: 210, y: 216, r: 23, name: "WORK ORDER" },
  { x: 356, y: 262, r: 16, name: "INVOICE" },
  { x: 84, y: 264, r: 15, name: "TEAM" },
] as const;

const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 2],
  [3, 4],
  [2, 4],
  [0, 5],
  [5, 3],
];

function DataverseInstrument({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full transition-opacity duration-700 opacity-70 group-hover:opacity-100"
      aria-hidden
      role="presentation"
    >
      <text x="28" y="40" className={label}>DATAVERSE — SCHEMA</text>
      <text x="452" y="40" textAnchor="end" className={labelDim}>BRD → FDD → BUILD</text>

      {/* relationships draw themselves in */}
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke={FOG_30}
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.25 + i * 0.09 }}
        />
      ))}

      {NODES.map((node, i) => (
        <motion.g
          key={node.name}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 + i * 0.08 }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="var(--color-panel)"
            stroke={i === 2 ? "var(--color-beacon)" : FOG_30}
            strokeWidth="1.25"
          />
          {i === 2 && (
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 7}
              fill="none"
              stroke="var(--color-beacon)"
              opacity="0.45"
              strokeDasharray="2 5"
              className={active ? "animate-[sweep_14s_linear_infinite]" : ""}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          )}
          <text
            x={node.x}
            y={node.y + node.r + 16}
            textAnchor="middle"
            className={label}
          >
            {node.name}
          </text>
        </motion.g>
      ))}

      <g className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">
        <circle cx="32" cy="331" r="3" fill="var(--color-beacon)" className={active ? "animate-blink" : ""} />
        <text x="44" y="336" className={label}>ACCEPTANCE CRITERIA — VALIDATED</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------- FIX 05 — PO process-flow portal */

const STAGES = ["PO RAISED", "REVIEW", "APPROVE", "ISSUED"] as const;

function PortalInstrument({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full transition-opacity duration-700 opacity-70 group-hover:opacity-100"
      aria-hidden
      role="presentation"
    >
      <text x="28" y="40" className={label}>MARCOM — CLIENT SYSTEMS</text>
      <text x="452" y="40" textAnchor="end" className={labelDim}>FREELANCE DELIVERY</text>

      {/* purchase-order pipeline */}
      <text x="28" y="106" className={labelDim}>PO PORTAL — PROCESS FLOW</text>
      {STAGES.map((stage, i) => {
        const x = 28 + i * 112;
        return (
          <g key={stage}>
            <rect
              x={x}
              y="122"
              width="96"
              height="44"
              rx="2"
              fill="var(--color-panel)"
              stroke={FOG_30}
              strokeWidth="1.25"
            />
            {/* the order pulsing through the stages, in sequence */}
            <rect
              x={x}
              y="122"
              width="96"
              height="44"
              rx="2"
              fill="none"
              stroke="var(--color-beacon)"
              strokeWidth="1.25"
              className={active ? "animate-blink" : ""}
              style={{ animationDuration: "2.8s", animationDelay: `${i * 0.7}s` }}
              opacity="0.9"
            />
            <text x={x + 48} y="148" textAnchor="middle" className={label}>
              {stage}
            </text>
            {i < STAGES.length - 1 && (
              <line
                x1={x + 96}
                y1="144"
                x2={x + 112}
                y2="144"
                stroke="var(--color-beacon)"
                strokeWidth="1.25"
                strokeDasharray="3 5"
                opacity="0.7"
                className={active ? "animate-dash" : ""}
              />
            )}
          </g>
        );
      })}

      {/* service price list — second module, staged */}
      <text x="28" y="216" className={labelDim}>SVC PRICE LIST — STAGED</text>
      <rect x="28" y="228" width="212" height="86" rx="2" fill="var(--color-panel)" stroke={FOG_15} />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <line
            x1="42"
            y1={252 + row * 22}
            x2={128 - row * 14}
            y2={252 + row * 22}
            stroke={FOG_30}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="196"
            y1={252 + row * 22}
            x2="226"
            y2={252 + row * 22}
            stroke="color-mix(in srgb, var(--color-beacon) 55%, transparent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* deployment note */}
      <text x="452" y="252" textAnchor="end" className={labelDim}>STACK</text>
      <text x="452" y="268" textAnchor="end" className={label}>HTML · CSS · JS · PY</text>

      <g className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">
        <circle cx="32" cy="331" r="3" fill="var(--color-beacon)" className={active ? "animate-blink" : ""} />
        <text x="44" y="336" className={label}>PO PORTAL — LIVE ON CLIENT SERVER</text>
      </g>
    </svg>
  );
}

/* ----------------------------------------------- FIX 04 — dual-station PPI */

function RadarInstrument({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full transition-opacity duration-700 opacity-70 group-hover:opacity-100"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-beacon)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--color-beacon)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* station A — main scope */}
      <g>
        {[44, 82, 120].map((r) => (
          <circle key={r} cx="176" cy="192" r={r} fill="none" stroke={FOG_15} />
        ))}
        <circle cx="176" cy="192" r="120" fill="none" stroke={FOG_30} strokeWidth="1.25" />
        {/* bearing ticks every 30° */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="176"
            y1="72"
            x2="176"
            y2={i % 3 === 0 ? "84" : "79"}
            stroke={FOG_30}
            transform={`rotate(${i * 30} 176 192)`}
          />
        ))}
        <text x="176" y="62" textAnchor="middle" className={labelDim}>000</text>
        <text x="310" y="196" className={labelDim}>090</text>

        {/* rotating sweep */}
        {active && (
          <g className="animate-sweep [transform-origin:176px_192px]">
            <path d="M176 192 L296 192 A120 120 0 0 0 280 132 Z" fill="url(#sweep-grad)" />
            <line x1="176" y1="192" x2="296" y2="192" stroke="var(--color-beacon)" strokeWidth="1.25" opacity="0.9" />
          </g>
        )}

        {/* contacts */}
        {[
          { x: 214, y: 138, d: "0s" },
          { x: 128, y: 226, d: "1.7s" },
          { x: 236, y: 232, d: "3.1s" },
        ].map((blip, i) => (
          <circle
            key={i}
            cx={blip.x}
            cy={blip.y}
            r="3"
            fill="var(--color-fog)"
            className={active ? "animate-blink" : ""}
            style={{ animationDelay: blip.d, animationDuration: "2.6s" }}
          />
        ))}
        <circle cx="176" cy="192" r="2.5" fill="var(--color-beacon)" />
      </g>

      {/* station B — remote scope */}
      <g className="transition-opacity duration-700 opacity-80 group-hover:opacity-100">
        <circle cx="392" cy="100" r="48" fill="none" stroke={FOG_30} strokeWidth="1.25" />
        <circle cx="392" cy="100" r="28" fill="none" stroke={FOG_15} />
        {active && (
          <g className="animate-sweep [transform-origin:392px_100px]" style={{ animationDuration: "3.8s" }}>
            <line x1="392" y1="100" x2="440" y2="100" stroke="var(--color-beacon)" opacity="0.8" />
          </g>
        )}
        <circle cx="392" cy="100" r="2" fill="var(--color-beacon)" />
        <text x="392" y="170" textAnchor="middle" className={label}>STA B — SEMI-CTRL</text>
      </g>

      {/* fiber link */}
      <path
        id="fiber"
        d="M262 132 Q310 96 344 100"
        fill="none"
        stroke="var(--color-beacon)"
        strokeWidth="1.25"
        strokeDasharray="4 8"
        opacity="0.8"
        className={active ? "animate-dash" : ""}
      />

      <text x="28" y="40" className={label}>STA A — X-BAND</text>
      <text x="452" y="336" textAnchor="end" className={labelDim}>FIBER LINK — SYNC OK</text>
      <g className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">
        <circle cx="32" cy="331" r="3" fill="var(--color-beacon)" className={active ? "animate-blink" : ""} />
        <text x="44" y="336" className={label}>SIGNAL VERIFIED — HANDED OVER</text>
      </g>
    </svg>
  );
}

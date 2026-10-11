"use client";

import React from "react";

const PILLARS = [
  {
    num: "I",
    code: "SOV-DET",
    title: "Mathematical Determinism",
    desc: "We engineer software that produces identical outputs regardless of cloud availability, runtime context, or calendar year. Every build is reproducible down to the bit.",
    metric: "0% NON-DETERMINISTIC DRIFT",
  },
  {
    num: "II",
    code: "SOV-AIR",
    title: "Zero Vendor Subjugation",
    desc: "Systems built by HENU operate independently of external cloud subscriptions, proprietary licensing servers, or hidden telemetry beacons. You possess total operational autonomy.",
    metric: "ZERO CLOUD DEPENDENCY",
  },
  {
    num: "III",
    code: "SOV-RES",
    title: "Architectural Restraint",
    desc: "We refuse ephemeral frontend churn, bloated consulting theatre, and surveillance-driven nudges. We design software with the timeless sobriety of classical stone architecture.",
    metric: "20+ YEAR HORIZON",
  },
  {
    num: "IV",
    code: "SOV-IP",
    title: "Perpetual IP Sovereignty",
    desc: "Every product license and custom engineering engagement includes immediate, unconditional intellectual property assignment. Your digital capital remains entirely yours.",
    metric: "100% CLEAR TITLE TRANSFER",
  },
];

export function AboutPillarsGrid() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#d4af37]/30 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block">
            Core Creed // Foundational Axioms
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
            The Four Pillars of Sovereign Computing
          </h2>
        </div>
        <span className="font-mono text-[11px] px-3 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#8c6b1b] dark:text-[#e5c468] font-semibold">
          RATIFIED 2026.1
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.code}
            className="group relative rounded-xl border border-[#d4af37]/25 bg-gradient-to-b from-[#faf8f4] to-[#f5efe2] dark:from-[#0d1624] dark:to-[#08101a] p-6 flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-subtle transition-all duration-300"
          >
            {/* Top Row: Roman Numeral & Code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-2xl font-serif text-[#8c6b1b] dark:text-[#dfba5f] font-normal">
                  {pillar.num}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-ink-muted px-2 py-0.5 rounded border border-[#d4af37]/20 bg-[#d4af37]/5">
                  {pillar.code}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#122238] dark:text-[#edf2f7] font-medium leading-snug group-hover:text-[#8c6b1b] dark:group-hover:text-[#dfba5f] transition-colors">
                {pillar.title}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {pillar.desc}
              </p>
            </div>

            {/* Bottom Invariant Metric */}
            <div className="pt-4 border-t border-[#d4af37]/20 mt-4">
              <span className="font-mono text-[10px] font-bold tracking-wider text-[#8c6b1b] dark:text-[#dfba5f] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
                {pillar.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

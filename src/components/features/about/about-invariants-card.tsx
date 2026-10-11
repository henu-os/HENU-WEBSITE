"use client";

import React from "react";

interface AboutInvariantsCardProps {
  visionStatement?: string;
  missionStatement?: string;
}

export function AboutInvariantsCard({
  visionStatement = "To build a sovereign, durable computing ecosystem rooted in engineering craft, architectural dignity, and zero-telemetry operational integrity.",
  missionStatement = "To engineer high-integrity foundational systems, operating environments, and digital infrastructure that empower people and institutions without surveillance or corporate lock-in.",
}: AboutInvariantsCardProps) {
  return (
    <div className="relative rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#faf8f4] to-[#f4eee2] dark:from-[#0d1624] dark:to-[#08101a] p-6 sm:p-10 shadow-elevated overflow-hidden">
      {/* Background Archival Seal Watermark */}
      <div
        className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full border-[1.5px] border-[#d4af37]/10 dark:border-[#d4af37]/10 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-64 h-64 rounded-full border border-[#d4af37]/15 flex items-center justify-center">
          <div className="font-serif text-6xl font-bold text-[#d4af37]/10 select-none">
            HENU
          </div>
        </div>
      </div>

      {/* Archival Corner Filigree Ornaments */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/50" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/50" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/50" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/50" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Vision & Mission Statements */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f]">
            <span className="w-2 h-2 rounded-full bg-[#c59b27]" />
            <span>Founding Mandate // Ratified Invariant</span>
          </div>

          <div className="space-y-4">
            <p className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] text-[#122238] dark:text-[#edf2f7] leading-snug tracking-tight font-normal">
              &ldquo;{visionStatement}&rdquo;
            </p>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed border-l-2 border-[#d4af37]/40 pl-4">
              {missionStatement}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
            <span className="px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#8c6b1b] dark:text-[#e5c468] font-semibold">
              CHARTER: SOV-2026-01
            </span>
            <span>AUDIT HASH: #4A9F2E-VERIFIED</span>
          </div>
        </div>

        {/* Right Column: 4 Sovereign Invariants Ledger */}
        <div className="lg:col-span-5 bg-surface-primary/90 dark:bg-[#111927]/90 rounded-xl border border-[#d4af37]/25 p-5 sm:p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#122238] dark:text-[#93b4e2]">
              SOVEREIGN LEDGER INVARIANTS
            </span>
            <span className="text-[10px] font-mono text-[#8c6b1b] dark:text-[#dfba5f] font-semibold px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
              IMMUTABLE
            </span>
          </div>

          <ul className="space-y-3 font-mono text-xs">
            <li className="flex items-start gap-2.5">
              <span className="text-[#c59b27] font-bold">01.</span>
              <div>
                <span className="text-ink-primary font-semibold block">ZERO-TELEMETRY HARMONY</span>
                <span className="text-[11px] text-ink-muted">Kernel-level air gap; no remote tracking beacons or pingbacks.</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#c59b27] font-bold">02.</span>
              <div>
                <span className="text-ink-primary font-semibold block">OFFLINE-FIRST COMPUTATION</span>
                <span className="text-[11px] text-ink-muted">Full local model weights and deterministic native binaries.</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#c59b27] font-bold">03.</span>
              <div>
                <span className="text-ink-primary font-semibold block">100% UNCONDITIONAL IP TRANSFER</span>
                <span className="text-[11px] text-ink-muted">Immediate bill of sale with complete buyer copyright ownership.</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#c59b27] font-bold">04.</span>
              <div>
                <span className="text-ink-primary font-semibold block">MULTI-DECADE LONGEVITY</span>
                <span className="text-[11px] text-ink-muted">Engineered to execute cleanly for 20+ years without bit-rot.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

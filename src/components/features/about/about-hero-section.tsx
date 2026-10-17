"use client";

import React from "react";
import Image from "next/image";
import { AboutHeroHeadline } from "./about-hero-headline";

interface AboutHeroSectionProps {
  visionStatement?: string;
  missionStatement?: string;
  heroImageUrl?: string | null;
}

export function AboutHeroSection({
  visionStatement = "To build a sovereign, durable computing ecosystem rooted in engineering craft, architectural dignity, and zero-telemetry operational integrity.",
  missionStatement = "To engineer high-integrity foundational systems, operating environments, and digital infrastructure that empower people and institutions without surveillance or corporate lock-in.",
  heroImageUrl,
}: AboutHeroSectionProps) {
  const activeImage = heroImageUrl?.trim() || "/brand/henu-dragon.png";

  return (
    <section
      aria-label="About HENU Hero Section"
      className="relative z-10 pt-4 pb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading & Company Narrative (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block font-semibold">
              About HENU // Independent Technology Collective
            </span>

            {/* Interactive 2-Line Headline */}
            <AboutHeroHeadline />
          </div>

          {/* Prose below the heading */}
          <div className="space-y-4 text-ink-secondary leading-relaxed font-sans text-base sm:text-lg">
            <p>
              HENU is an independent sovereign computing collective. We engineer verifiable operating systems, private air-gapped machine intelligence, bare-metal task automation, and sub-frame developer environments for organizations and creators who demand absolute operational autonomy.
            </p>

            <blockquote className="font-serif text-lg sm:text-xl text-[#122238] dark:text-[#edf2f7] border-l-2 border-[#d4af37]/60 pl-4 py-1 italic leading-snug">
              &ldquo;{visionStatement}&rdquo;
            </blockquote>

            <p className="text-sm sm:text-base text-ink-secondary">
              {missionStatement}
            </p>
          </div>

          {/* Key Company Highlights / Sovereign Guarantees */}
          <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#8c6b1b] dark:text-[#dfba5f] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
              AIR-GAPPED BY DEFAULT
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#8c6b1b] dark:text-[#dfba5f] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
              UNCONDITIONAL IP OWNERSHIP
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#8c6b1b] dark:text-[#dfba5f] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
              ZERO VENDOR TELEMETRY
            </span>
          </div>

          <div className="pt-1 flex items-center gap-4 text-xs font-mono text-ink-muted">
            <span>CHARTER: SOV-2026-01</span>
            <span aria-hidden="true">&bull;</span>
            <span>AUDIT HASH: #4A9F2E-VERIFIED</span>
          </div>
        </div>

        {/* Right Column: Hero Image Configured from Admin Panel (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-square rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#f4eee2] dark:from-[#0d1624] dark:via-[#0b131e] dark:to-[#08101a] p-6 shadow-elevated flex flex-col justify-between overflow-hidden group">
            {/* Archival Corner Filigree Ornaments */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60" />

            {/* Top Telemetry Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c59b27] animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-[#122238] dark:text-[#dfba5f]">
                  COLLECTIVE IDENTITY
                </span>
              </div>
              <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                ARCHIVE // 01
              </span>
            </div>

            {/* Central Illuminated Frame: Admin-Configured Hero Image */}
            <div className="relative w-full flex-1 flex items-center justify-center my-auto p-4 z-10">
              {/* Ethereal background ring halo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-56 h-56 rounded-full border border-dashed border-[#d4af37] animate-[spin_40s_linear_infinite]" />
                <div className="absolute w-40 h-40 rounded-full border border-[#d4af37]/40" />
              </div>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={activeImage}
                  alt="HENU Sovereign Identity"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  priority
                  className="object-contain drop-shadow-md select-none"
                  unoptimized={activeImage.startsWith("http")}
                />
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-[11px] font-mono text-ink-muted z-10">
              <span className="text-[#8c6b1b] dark:text-[#dfba5f] font-semibold">
                VERIFIED ASSET
              </span>
              <span>IMMUTABLE PROVENANCE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

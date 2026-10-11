"use client";

import React, { useState } from "react";

interface ContactHeroHeadlineProps {
  className?: string;
}

export function ContactHeroHeadline({ className = "" }: ContactHeroHeadlineProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group relative inline-block cursor-pointer select-none ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label="Interactive headline: hover or click to toggle communication perspective"
    >
      {/* Dynamic Status / Perspective Badge with Burgundy & Rose-Bronze Accent */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-[#fbf6f6] dark:bg-[#181114] border border-[#9f1239]/25 text-[#9f1239] dark:text-[#fb7185] group-hover:border-[#9f1239]/50 transition-colors duration-200">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              isFlipped ? "bg-[#be5b3a]" : "bg-[#9f1239]"
            }`}
          />
          <span className="text-[10px] font-semibold">
            {isFlipped ? "Direct Routing // Air-Gapped Channel" : "Diplomatic Desk // Sovereign Intake"}
          </span>
          <span className="text-[9px] opacity-60 ml-1 font-mono">
            {isFlipped ? "↺ reset" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* Main Headline Container with Instant Non-Glow Classy Flip */}
      <div className="relative min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[6.25rem]">
        {/* State 1: Direct Architectural Dialogue // Engineering Consultations & Sovereign Retainers */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-0 pointer-events-none absolute inset-0 invisible"
              : "opacity-100 relative visible"
          }`}
        >
          Direct Architectural Dialogue //{" "}
          <span className="text-[#9f1239] dark:text-[#fb7185] italic font-serif">
            Engineering Consultations
          </span>{" "}
          &amp;{" "}
          <span className="text-[#4c0519] dark:text-[#fecdd3] font-normal">
            Sovereign Retainers.
          </span>
        </h1>

        {/* State 2: Confidential Inquiries // Zero-Intermediary Access & Direct Partner Routing */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-100 relative visible"
              : "opacity-0 pointer-events-none absolute inset-0 invisible"
          }`}
          aria-hidden={!isFlipped}
        >
          Confidential Inquiries //{" "}
          <span className="text-[#be5b3a] dark:text-[#fb923c] italic font-serif">
            Zero-Intermediary Access
          </span>{" "}
          &amp;{" "}
          <span className="text-[#4c0519] dark:text-[#fecdd3] font-normal">
            Direct Principal Routing.
          </span>
        </h1>
      </div>
    </div>
  );
}

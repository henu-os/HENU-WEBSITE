"use client";

import React, { useState } from "react";

interface AboutHeroHeadlineProps {
  className?: string;
}

export function AboutHeroHeadline({ className = "" }: AboutHeroHeadlineProps) {
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
      aria-label="Interactive headline: hover or click to toggle architectural charter perspective"
    >
      {/* Dynamic Status / Perspective Badge with Champagne Gold Accent */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-[#f7f4ee] dark:bg-[#111927] border border-[#d4af37]/30 text-[#8c6b1b] dark:text-[#e5c468] group-hover:border-[#d4af37]/60 transition-colors duration-200">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              isFlipped ? "bg-[#9a532e]" : "bg-[#c59b27]"
            }`}
          />
          <span className="text-[10px] font-semibold">
            {isFlipped ? "Charter // Sovereign Principles" : "Institutional Archive // Ratified Specification"}
          </span>
          <span className="text-[9px] opacity-60 ml-1 font-mono">
            {isFlipped ? "↺ reset" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* Main Headline Container with Instant Non-Glow Classy Flip */}
      <div className="relative min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[6.25rem]">
        {/* State 1: Engineered for Durability, Autonomy & Human Agency */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-0 pointer-events-none absolute inset-0 invisible"
              : "opacity-100 relative visible"
          }`}
        >
          Engineered for{" "}
          <span className="text-[#b38322] dark:text-[#e5c468] italic font-serif">
            Durability
          </span>
          , Autonomy &amp;{" "}
          <span className="text-[#132c4a] dark:text-[#93b8e8] font-normal">
            Human Agency.
          </span>
        </h1>

        {/* State 2: Sovereign Foundations for Generational Computing */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-100 relative visible"
              : "opacity-0 pointer-events-none absolute inset-0 invisible"
          }`}
          aria-hidden={!isFlipped}
        >
          Sovereign Foundations for{" "}
          <span className="text-[#9a532e] dark:text-[#e89063] italic font-serif">
            Decoupled Systems
          </span>{" "}
          &amp;{" "}
          <span className="text-[#132c4a] dark:text-[#93b8e8] font-normal">
            Zero Telemetry.
          </span>
        </h1>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface ServicesHeroHeadlineProps {
  className?: string;
}

export function ServicesHeroHeadline({ className = "" }: ServicesHeroHeadlineProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group relative inline-block cursor-pointer select-none transition-all duration-300 ${className}`}
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
      aria-label="Interactive headline: hover or press to toggle architectural perspective"
    >
      {/* Perspective Badge Hint */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-surface-secondary border border-border-default/80 text-ink-muted group-hover:border-primary/40 group-hover:text-ink-primary transition-all duration-300">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isFlipped ? "bg-secondary animate-pulse" : "bg-primary"
            }`}
          />
          <span className="text-[10px]">
            {isFlipped ? "Perspective: Execution" : "Perspective: Architecture"}
          </span>
          <span className="text-[9px] opacity-60 ml-0.5">
            {isFlipped ? "↺" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* Main Headline Container with Smooth Flip / Cross-Morph */}
      <div className="relative min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5.25rem]">
        {/* State 1: Architectural capabilities for high-conviction ventures. */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.12] transition-all duration-500 transform ${
            isFlipped
              ? "opacity-0 -translate-y-3 pointer-events-none absolute inset-0"
              : "opacity-100 translate-y-0 relative"
          }`}
        >
          Architectural capabilities for{" "}
          <span className="relative inline-block font-medium">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-1 underline-offset-8">
              high-conviction ventures.
            </span>
            {/* Subtle luminous accent aura */}
            <span
              className="absolute -inset-1 rounded-lg bg-emerald-500/10 blur-sm -z-10 group-hover:bg-emerald-500/20 transition-all duration-500"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* State 2: Production-grade execution for ambitious founders. */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.12] transition-all duration-500 transform ${
            isFlipped
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 translate-y-3 pointer-events-none absolute inset-0"
          }`}
          aria-hidden={!isFlipped}
        >
          Production-grade execution for{" "}
          <span className="relative inline-block font-medium">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:to-orange-300 bg-clip-text text-transparent underline decoration-orange-500/30 decoration-wavy decoration-1 underline-offset-8">
              ambitious founders.
            </span>
            {/* Warm luminous accent aura */}
            <span
              className="absolute -inset-1 rounded-lg bg-orange-500/10 blur-sm -z-10 group-hover:bg-orange-500/20 transition-all duration-500"
              aria-hidden="true"
            />
          </span>
        </h1>
      </div>
    </div>
  );
}

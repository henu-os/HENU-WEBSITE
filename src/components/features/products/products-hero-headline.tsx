"use client";

import React, { useState } from "react";

interface ProductsHeroHeadlineProps {
  className?: string;
}

export function ProductsHeroHeadline({ className = "" }: ProductsHeroHeadlineProps) {
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
      aria-label="Interactive headline: hover or press to toggle computing perspective"
    >
      {/* Dynamic Status / Perspective Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-surface-secondary border border-border-default/80 text-ink-muted group-hover:border-indigo-500/40 group-hover:text-ink-primary transition-all duration-300">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isFlipped ? "bg-cyan-500 animate-pulse" : "bg-indigo-600 dark:bg-indigo-400"
            }`}
          />
          <span className="text-[10px]">
            {isFlipped ? "Architecture: Autonomous Stack" : "Architecture: Sovereign Ecosystem"}
          </span>
          <span className="text-[9px] opacity-60 ml-0.5">
            {isFlipped ? "↺" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* Main Headline with Cross-Morph Animation */}
      <div className="relative min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5.25rem]">
        {/* State 1: The HENU Computing Ecosystem. */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-all duration-500 transform ${
            isFlipped
              ? "opacity-0 -translate-y-3 pointer-events-none absolute inset-0"
              : "opacity-100 translate-y-0 relative"
          }`}
        >
          The HENU{" "}
          <span className="relative inline-block font-medium">
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-300 dark:to-purple-300 bg-clip-text text-transparent underline decoration-indigo-500/30 decoration-wavy decoration-1 underline-offset-8">
              Computing Ecosystem.
            </span>
            {/* Luminous Iris Aura */}
            <span
              className="absolute -inset-1 rounded-lg bg-indigo-500/10 blur-sm -z-10 group-hover:bg-indigo-500/25 transition-all duration-500"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* State 2: Deterministic software for autonomous systems. */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-all duration-500 transform ${
            isFlipped
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 translate-y-3 pointer-events-none absolute inset-0"
          }`}
          aria-hidden={!isFlipped}
        >
          Deterministic software for{" "}
          <span className="relative inline-block font-medium">
            <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent underline decoration-cyan-500/30 decoration-wavy decoration-1 underline-offset-8">
              autonomous systems.
            </span>
            {/* Luminous Cyan Aura */}
            <span
              className="absolute -inset-1 rounded-lg bg-cyan-500/10 blur-sm -z-10 group-hover:bg-cyan-500/25 transition-all duration-500"
              aria-hidden="true"
            />
          </span>
        </h1>
      </div>
    </div>
  );
}

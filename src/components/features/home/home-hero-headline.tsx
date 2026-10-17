"use client";

import React, { useState } from "react";

interface HomeHeroHeadlineProps {
  heroStatement: string;
  className?: string;
}

export function HomeHeroHeadline({
  heroStatement,
  className = "",
}: HomeHeroHeadlineProps) {
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
      aria-label="Interactive headline: hover or click to toggle architectural ecosystem perspective"
    >
      {/* Interactive Perspective Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-surface-secondary border border-outline-variant/30 text-on-surface-variant group-hover:border-primary/50 group-hover:text-on-surface transition-colors duration-200 shadow-xs">
          <span
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isFlipped ? "bg-secondary" : "bg-primary"
            }`}
          />
          <span className="font-semibold text-[11px]">
            {isFlipped
              ? "Sovereign Mandate // Autonomous Infrastructure"
              : "Technology Ecosystem // V1 Foundation"}
          </span>
          <span className="text-[10px] opacity-60 ml-1 font-mono">
            {isFlipped ? "↺ reset" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* CSS Grid Overlay: Automatic Height with Zero Artificial Gap */}
      <div className="grid grid-cols-1 grid-rows-1 mb-6">
        {/* State 1: Primary Database Hero Statement */}
        <h1
          className={`col-start-1 row-start-1 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink-primary leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-0 pointer-events-none invisible"
              : "opacity-100 visible"
          }`}
        >
          {heroStatement}
        </h1>

        {/* State 2: Sovereign Secondary Perspective */}
        <h1
          className={`col-start-1 row-start-1 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink-primary leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-100 visible"
              : "opacity-0 pointer-events-none invisible"
          }`}
          aria-hidden={!isFlipped}
        >
          Deterministic Software for{" "}
          <span className="italic font-serif text-primary font-normal">
            Autonomous Systems
          </span>{" "}
          &amp; Human Sovereignty.
        </h1>
      </div>
    </div>
  );
}

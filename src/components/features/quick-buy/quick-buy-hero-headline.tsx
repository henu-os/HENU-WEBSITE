"use client";

import React, { useState } from "react";

interface QuickBuyHeroHeadlineProps {
  className?: string;
}

export function QuickBuyHeroHeadline({ className = "" }: QuickBuyHeroHeadlineProps) {
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
      aria-label="Interactive headline: hover or click to toggle procurement perspective"
    >
      {/* Dynamic Status / Perspective Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-surface-secondary border border-border-default/80 text-ink-muted group-hover:border-secondary/40 group-hover:text-ink-primary transition-colors duration-200">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              isFlipped ? "bg-amber-600" : "bg-emerald-600 dark:bg-emerald-400"
            }`}
          />
          <span className="text-[10px]">
            {isFlipped ? "Perspective: Escrow Settlement" : "Perspective: Commercial Catalogue"}
          </span>
          <span className="text-[9px] opacity-60 ml-0.5 font-mono">
            {isFlipped ? "↺ reset" : "⇄ hover to flip"}
          </span>
        </span>
      </div>

      {/* Main Headline Container with Instant/Crisp Non-Glow Flip */}
      <div className="relative min-h-[4.5rem] sm:min-h-[5rem] lg:min-h-[5.5rem]">
        {/* State 1: Quick Buy // Products & Architectural Services */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-0 pointer-events-none absolute inset-0 invisible"
              : "opacity-100 relative visible"
          }`}
        >
          Quick Buy //{" "}
          <span className="text-secondary italic font-serif">Products</span> &amp;{" "}
          <span className="text-emerald-800 dark:text-emerald-300 font-normal">
            Architectural Services.
          </span>
        </h1>

        {/* State 2: Direct Clearance // Commercial Escrow & Verified IP Transfer */}
        <h1
          className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08] transition-opacity duration-300 ${
            isFlipped
              ? "opacity-100 relative visible"
              : "opacity-0 pointer-events-none absolute inset-0 invisible"
          }`}
          aria-hidden={!isFlipped}
        >
          Direct Clearance //{" "}
          <span className="text-secondary italic font-serif">Commercial Escrow</span> &amp;{" "}
          <span className="text-emerald-800 dark:text-emerald-300 font-normal">
            Verified IP Transfer.
          </span>
        </h1>
      </div>
    </div>
  );
}

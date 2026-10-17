import React from "react";

interface ServicesHeroHeadlineProps {
  className?: string;
}

export function ServicesHeroHeadline({ className = "" }: ServicesHeroHeadlineProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.12]">
        Architectural capabilities for{" "}
        <span className="relative inline-block font-medium">
          <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-1 underline-offset-8">
            high-conviction ventures.
          </span>
          <span
            className="absolute -inset-1 rounded-lg bg-emerald-500/10 blur-sm -z-10"
            aria-hidden="true"
          />
        </span>
      </h1>
    </div>
  );
}

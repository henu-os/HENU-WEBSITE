import React from "react";

interface ProductsHeroHeadlineProps {
  className?: string;
}

export function ProductsHeroHeadline({ className = "" }: ProductsHeroHeadlineProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08]">
        The HENU{" "}
        <span className="relative inline-block font-medium">
          <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-300 dark:to-purple-300 bg-clip-text text-transparent underline decoration-indigo-500/30 decoration-wavy decoration-1 underline-offset-8">
            Computing Ecosystem.
          </span>
          <span
            className="absolute -inset-1 rounded-lg bg-indigo-500/10 blur-sm -z-10"
            aria-hidden="true"
          />
        </span>
      </h1>
    </div>
  );
}

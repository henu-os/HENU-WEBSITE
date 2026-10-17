import React from "react";

interface QuickBuyHeroHeadlineProps {
  className?: string;
}

export function QuickBuyHeroHeadline({ className = "" }: QuickBuyHeroHeadlineProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08]">
        Quick Buy //{" "}
        <span className="text-secondary italic font-serif">Products</span> &amp;{" "}
        <span className="text-emerald-800 dark:text-emerald-300 font-normal">
          Architectural Services.
        </span>
      </h1>
    </div>
  );
}

import React from "react";

interface ContactHeroHeadlineProps {
  className?: string;
}

export function ContactHeroHeadline({ className = "" }: ContactHeroHeadlineProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08]">
        Direct Architectural Dialogue //{" "}
        <span className="text-[#9f1239] dark:text-[#fb7185] italic font-serif">
          Engineering Consultations
        </span>{" "}
        &amp;{" "}
        <span className="text-[#4c0519] dark:text-[#fecdd3] font-normal">
          Sovereign Retainers.
        </span>
      </h1>
    </div>
  );
}

import React from "react";

interface AboutHeroHeadlineProps {
  className?: string;
}

export function AboutHeroHeadline({ className = "" }: AboutHeroHeadlineProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.08]">
        Engineered for{" "}
        <span className="text-[#b38322] dark:text-[#e5c468] italic font-serif">
          Durability
        </span>
        , Autonomy &amp;{" "}
        <span className="text-[#132c4a] dark:text-[#93b8e8] font-normal">
          Human Agency.
        </span>
      </h1>
    </div>
  );
}

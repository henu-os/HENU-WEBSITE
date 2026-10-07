"use client";

import React from "react";

interface HenuLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * HENU Sovereign System Formation Loader (MOTION-004)
 * Represents the 4-tier ecosystem convergence (OS, AI, PA, IDE) around the central core.
 * Strictly adheres to truth in interaction: zero fake diagnostics or telemetry.
 */
export function HenuLoader({
  label = "Assembling sovereign system...",
  size = "md",
}: HenuLoaderProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-4 py-8 select-none"
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {/* Subtle Outer Orbital Ring */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-border-default/60 motion-safe:animate-[spin_10s_linear_infinite]"
        />

        {/* 4 Sovereign Tier Nodes (OS: Amber, AI: Emerald, PA: Cyan, IDE: Purple) */}
        <span
          aria-hidden="true"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-spectral motion-safe:animate-pulse"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse delay-100"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500 motion-safe:animate-pulse delay-200"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500 motion-safe:animate-pulse delay-300"
        />

        {/* Central Core Monogram Mark */}
        <div
          aria-hidden="true"
          className="w-8 h-8 rounded-lg bg-surface-primary border border-border-default shadow-xs flex items-center justify-center font-mono font-bold text-xs text-ink-primary"
        >
          H
        </div>
      </div>

      {label && (
        <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}

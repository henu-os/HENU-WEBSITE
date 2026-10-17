"use client";

import React from "react";

interface ParticleAttractorBoxProps {
  className?: string;
}

export function ParticleAttractorBox({ className = "" }: ParticleAttractorBoxProps) {
  return (
    <div
      className={`relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-purple-300/40 dark:border-purple-800/40 shadow-2xl bg-gradient-to-b from-[#f9f5ff]/90 via-[#f4edff]/70 to-[#ede2fe]/90 dark:from-[#130826]/90 dark:via-[#190a33]/80 dark:to-[#0f0520]/95 backdrop-blur-md flex flex-col justify-between p-5 select-none transition-shadow duration-500 hover:shadow-purple-500/10 ${className}`}
    >
      {/* Top Cybernetic Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-200/50 dark:border-purple-900/30 z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600 dark:bg-violet-400" />
          </span>
          <span className="font-mono text-xs font-bold tracking-widest text-violet-800 dark:text-violet-200">
            SYSTEM ACTIVE
          </span>
        </div>
        <span className="font-mono text-[11px] text-purple-700/60 dark:text-purple-300/60 uppercase tracking-wider">
          CYBERNETIC TOURBILLON
        </span>
      </div>

      {/* Central Living Stage: Portal Anchor */}
      <div
        id="hero-dragon-eye-anchor"
        className="relative w-full flex-1 flex items-center justify-center my-auto min-h-[260px] pointer-events-auto cursor-pointer"
        title="HENU Sovereign Void Core — Scroll down to initiate 3D flight"
      >
        {/* Subtle ethereal backdrop rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="w-60 h-60 rounded-full border border-dashed border-violet-400/40 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-44 h-44 rounded-full border border-violet-300/30" />
          <div className="absolute w-28 h-28 rounded-full border border-dotted border-violet-400/20 animate-[spin_18s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-purple-200/50 dark:border-purple-900/30 text-[11px] font-mono text-purple-700/60 dark:text-purple-300/60 z-10">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          CONCENTRIC DEPTH LOCKED
        </span>
        <span className="text-right tracking-tight opacity-80">
          SCROLL DOWN TO INITIATE 3D FLIGHT &darr;
        </span>
      </div>
    </div>
  );
}

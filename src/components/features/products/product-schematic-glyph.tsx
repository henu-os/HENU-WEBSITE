"use client";

import React from "react";

interface ProductSchematicGlyphProps {
  slug: string;
  className?: string;
}

export function ProductSchematicGlyph({ slug, className = "" }: ProductSchematicGlyphProps) {
  const norm = slug.toLowerCase();

  // 1. HENU OS: Kernel & Wayland Compositor Blueprint
  if (norm === "henu-os") {
    return (
      <div className={`relative flex items-center justify-center p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:border-emerald-500/60 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Compositor Screen Matrix */}
          <rect x="8" y="10" width="48" height="34" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
          {/* Tiling Window Panes */}
          <rect x="12" y="16" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          <rect x="34" y="16" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.25" />
          <rect x="34" y="29" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          {/* IPC Local Socket Ring & Core Base */}
          <line x1="16" y1="52" x2="48" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="52" r="2.5" fill="currentColor" className="animate-ping" opacity="0.5" />
          <circle cx="24" cy="52" r="2.5" fill="currentColor" />
          <circle cx="40" cy="52" r="2.5" fill="currentColor" />
          {/* Data conduit lines */}
          <line x1="21" y1="44" x2="24" y2="52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="43" y1="44" x2="40" y2="52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  // 2. HENU AI: Neural Reasoner Lattice & Attention Graph
  if (norm === "henu-ai") {
    return (
      <div className={`relative flex items-center justify-center p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 group-hover:border-indigo-500/60 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Neural Synapse Diamond */}
          <polygon points="32,6 56,32 32,58 8,32" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          {/* Central Reasoning Nucleus */}
          <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" />
          {/* Peripheral Tensor Nodes */}
          <circle cx="32" cy="16" r="3.5" fill="currentColor" />
          <circle cx="48" cy="32" r="3.5" fill="currentColor" />
          <circle cx="32" cy="48" r="3.5" fill="currentColor" />
          <circle cx="16" cy="32" r="3.5" fill="currentColor" />
          {/* Synaptic interconnects */}
          <line x1="32" y1="16" x2="32" y2="26" stroke="currentColor" strokeWidth="1.5" />
          <line x1="48" y1="32" x2="38" y2="32" stroke="currentColor" strokeWidth="1.5" />
          <line x1="32" y1="48" x2="32" y2="38" stroke="currentColor" strokeWidth="1.5" />
          <line x1="16" y1="32" x2="26" y2="32" stroke="currentColor" strokeWidth="1.5" />
          {/* Diagonal Attention Rays */}
          <line x1="20" y1="20" x2="44" y2="44" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <line x1="44" y1="20" x2="20" y2="44" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // 3. HENU PA: Sonic Waveform & Conversational Spectrum
  if (norm === "henu-pa") {
    return (
      <div className={`relative flex items-center justify-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 group-hover:border-amber-500/60 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Acoustic Waveform Outer Shell */}
          <rect x="8" y="12" width="48" height="40" rx="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
          {/* Frequency Spectrum Bars */}
          <line x1="16" y1="32" x2="16" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="26" x2="22" y2="38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="20" x2="28" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="34" y1="16" x2="34" y2="48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="40" y1="22" x2="40" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="46" y1="28" x2="46" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Live voice pulse dot */}
          <circle cx="50" cy="18" r="2.5" fill="currentColor" className="animate-ping" opacity="0.6" />
          <circle cx="50" cy="18" r="2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // 4. HENU IDE: Compiler AST Matrix & Code Syntax Pipeline
  if (norm === "henu-ide") {
    return (
      <div className={`relative flex items-center justify-center p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:border-emerald-500/60 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Code Window / Matrix Frame */}
          <rect x="8" y="10" width="48" height="44" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" />
          {/* Syntax Code Bracket Glyphs */}
          <path d="M22 22 L16 28 L22 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 22 L48 28 L42 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="34" y1="20" x2="30" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* AST Hierarchical Branch Lines below */}
          <line x1="16" y1="42" x2="48" y2="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
          <circle cx="22" cy="47" r="2" fill="currentColor" />
          <circle cx="32" cy="47" r="2" fill="currentColor" />
          <circle cx="42" cy="47" r="2" fill="currentColor" />
          <line x1="22" y1="42" x2="22" y2="45" stroke="currentColor" strokeWidth="1.5" />
          <line x1="32" y1="42" x2="32" y2="45" stroke="currentColor" strokeWidth="1.5" />
          <line x1="42" y1="42" x2="42" y2="45" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // Fallback Quantum Ecosystem Node
  return (
    <div className={`relative flex items-center justify-center p-3.5 rounded-xl bg-surface-secondary border border-border-default group-hover:border-primary/50 transition-all duration-300 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 text-ink-primary transition-transform duration-300 group-hover:scale-105"
      >
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}

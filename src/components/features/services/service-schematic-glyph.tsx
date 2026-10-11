"use client";

import React from "react";

interface ServiceSchematicGlyphProps {
  slug: string;
  categorySlug: string;
  className?: string;
}

export function ServiceSchematicGlyph({ slug, categorySlug, className = "" }: ServiceSchematicGlyphProps) {
  const normalizedSlug = slug.toLowerCase();

  // Visual schematic SVGs tailored to each technical capability
  if (normalizedSlug.includes("mobile")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Device outer frame */}
          <rect x="18" y="8" width="28" height="48" rx="5" stroke="currentColor" strokeWidth="2" strokeDasharray="64" className="stroke-current" />
          {/* Notch / Speaker */}
          <line x1="28" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Screen Content Layers */}
          <rect x="22" y="18" width="20" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
          <line x1="22" y1="35" x2="38" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          {/* Bottom Home Indicator */}
          <line x1="26" y1="51" x2="38" y2="51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Signal Wave */}
          <circle cx="50" cy="14" r="2" fill="currentColor" className="animate-ping" opacity="0.4" />
          <circle cx="50" cy="14" r="2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("web") || normalizedSlug.includes("site")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Browser Window */}
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
          {/* Top Bar with 3 Dots */}
          <line x1="8" y1="22" x2="56" y2="22" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="14" cy="17" r="1.5" fill="currentColor" />
          <circle cx="19" cy="17" r="1.5" fill="currentColor" />
          <circle cx="24" cy="17" r="1.5" fill="currentColor" />
          {/* Semantic Layout Grid */}
          <rect x="14" y="27" width="16" height="18" rx="2" fill="currentColor" fillOpacity="0.15" />
          <rect x="34" y="27" width="16" height="8" rx="2" fill="currentColor" fillOpacity="0.25" />
          <line x1="34" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="34" y1="44" x2="44" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("software") || normalizedSlug.includes("core") || normalizedSlug.includes("backend")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Distributed Cluster Nodes */}
          <circle cx="32" cy="18" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
          <circle cx="18" cy="44" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
          <circle cx="46" cy="44" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
          {/* Connectors */}
          <line x1="28" y1="23" x2="21" y2="39" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="36" y1="23" x2="43" y2="39" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="24" y1="44" x2="40" y2="44" stroke="currentColor" strokeWidth="1.5" />
          {/* Center Hub Indicator */}
          <circle cx="32" cy="34" r="2.5" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("ai") || normalizedSlug.includes("agent") || categorySlug === "intelligence") {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Neural Reasoner Diamond */}
          <polygon points="32,8 54,32 32,56 10,32" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <circle cx="32" cy="20" r="3" fill="currentColor" />
          <circle cx="44" cy="32" r="3" fill="currentColor" />
          <circle cx="32" cy="44" r="3" fill="currentColor" />
          <circle cx="20" cy="32" r="3" fill="currentColor" />
          <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
          {/* Internal Synapse paths */}
          <line x1="32" y1="20" x2="32" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("graphic") || normalizedSlug.includes("brand") || normalizedSlug.includes("design")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Vector Bézier Curve & Anchor Nodes */}
          <path d="M12 46 C 20 18, 44 18, 52 46" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="9" y="43" width="6" height="6" fill="currentColor" />
          <rect x="49" y="43" width="6" height="6" fill="currentColor" />
          {/* Tangent Handles */}
          <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" />
          <circle cx="40" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" />
          <line x1="12" y1="46" x2="24" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <line x1="52" y1="46" x2="40" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("marketing") || normalizedSlug.includes("social") || normalizedSlug.includes("growth")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-amber-500/40 group-hover:bg-amber-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Growth Trajectory Radar */}
          <path d="M14 50 L26 36 L38 42 L52 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Trajectory Arrow */}
          <polyline points="44,16 52,16 52,24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Gradient Fill under graph */}
          <polygon points="14,50 26,36 38,42 52,16 52,50" fill="currentColor" fillOpacity="0.1" />
          {/* Base Axis */}
          <line x1="12" y1="50" x2="54" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("legal") || normalizedSlug.includes("compliance") || normalizedSlug.includes("foundation")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-sky-500/40 group-hover:bg-sky-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Compliance Shield */}
          <path d="M32 10 L48 16 V32 C48 42 41 51 32 54 C23 51 16 42 16 32 V16 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
          {/* Verified Checkmark inside */}
          <path d="M26 32 L30 36 L38 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (normalizedSlug.includes("doc") || normalizedSlug.includes("funding")) {
    return (
      <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-sky-500/40 group-hover:bg-sky-500/5 transition-all duration-300 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Architectural Dossier / Spec Sheet */}
          <rect x="18" y="10" width="28" height="44" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
          <line x1="24" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="28" x2="36" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="24" y1="34" x2="38" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="24" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          {/* Seal badge */}
          <circle cx="38" cy="44" r="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // Fallback Architecture Specimen
  return (
    <div className={`relative flex items-center justify-center p-3 rounded-xl bg-surface-secondary/70 border border-border-default/80 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-ink-primary transition-transform duration-300 group-hover:scale-105"
      >
        <rect x="14" y="14" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <line x1="14" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="32" y1="14" x2="32" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}

"use client";

import React from "react";

interface ClassyArchitecturalVisualProps {
  slug: string;
  categorySlug?: string;
  className?: string;
}

export function ClassyArchitecturalVisual({
  slug,
  categorySlug = "",
  className = "",
}: ClassyArchitecturalVisualProps) {
  const normSlug = slug.toLowerCase();
  const normCat = categorySlug.toLowerCase();

  // 1. HENU Mail & Sovereign Identity: Geometric Origami Wireframe & Kinetic Folding
  if (normSlug.includes("mail") || normCat.includes("cloud")) {
    return (
      <div className={`relative h-36 rounded-xl overflow-hidden bg-[#f7f5f0] dark:bg-[#1a1f1d] border border-border-default/80 p-3.5 flex flex-col justify-between group-hover:border-ink-primary/40 transition-all duration-500 ${className}`}>
        {/* Subtle Architectural Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #1c1c1a 1px, transparent 1px), linear-gradient(to bottom, #1c1c1a 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Minimalist Architectural Header */}
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-ink-muted">
          <span className="flex items-center gap-1.5 font-medium text-ink-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-primary opacity-80" />
            <span>FIG 01 // CRYPTOGRAPHIC GEOMETRY</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border-default bg-surface-primary/80">
            SOVEREIGN ENCLAVE
          </span>
        </div>

        {/* Kinetic Isometric Wireframe Origami */}
        <div className="relative h-20 flex items-center justify-center">
          <svg viewBox="0 0 160 80" className="w-full h-full max-w-[180px] overflow-visible">
            {/* Rotating concentric orbital rings */}
            <g className="origin-center transition-transform duration-700 group-hover:scale-105">
              {/* Outer Orbital Oval */}
              <ellipse
                cx="80"
                cy="40"
                rx="55"
                ry="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="4 3"
                className="text-ink-muted/50"
              />
              {/* Secondary Tilt Ring */}
              <ellipse
                cx="80"
                cy="40"
                rx="38"
                ry="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-ink-secondary/60 -rotate-12 origin-center"
              />
              {/* Isometric Central Diamond Envelope */}
              <polygon
                points="80,18 112,40 80,62 48,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="text-ink-primary"
              />
              {/* Internal Folding Facets */}
              <line x1="80" y1="18" x2="80" y2="62" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-ink-muted" />
              <line x1="48" y1="40" x2="112" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-ink-muted" />
              {/* Central Nucleus Point */}
              <circle cx="80" cy="40" r="3" className="fill-ink-primary" />
              <circle cx="80" cy="40" r="7" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-ink-secondary animate-ping opacity-40" />
            </g>
          </svg>
        </div>

        {/* Minimalist Architectural Footer */}
        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-border-default/60 pt-1.5">
          <span>SPEC: ZERO-TELEMETRY</span>
          <span className="font-semibold text-ink-primary">SHA-256 VAULT</span>
        </div>
      </div>
    );
  }

  // 2. HENU WhatsApp Automation Engine: Kinetic Harmonic Wave & Precision Transit Tracks
  if (normSlug.includes("whatsapp") || normSlug.includes("automation") || normCat.includes("automation")) {
    return (
      <div className={`relative h-36 rounded-xl overflow-hidden bg-[#f6f5f2] dark:bg-[#1a1e20] border border-border-default/80 p-3.5 flex flex-col justify-between group-hover:border-ink-primary/40 transition-all duration-500 ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #1c1c1a 1px, transparent 1px), linear-gradient(to bottom, #1c1c1a 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Minimalist Architectural Header */}
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-ink-muted">
          <span className="flex items-center gap-1.5 font-medium text-ink-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-primary opacity-80" />
            <span>FIG 02 // HARMONIC TRANSIT BUS</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border-default bg-surface-primary/80">
            IDEMPOTENT QUEUE
          </span>
        </div>

        {/* Fluid Kinetic Harmonic Wave Tracks */}
        <div className="relative h-20 flex items-center justify-center">
          <svg viewBox="0 0 160 80" className="w-full h-full max-w-[200px]">
            {/* Guide Horizon Line */}
            <line x1="10" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" className="text-ink-muted/40" />

            {/* Smooth Harmonic Sinusoidal Spline 1 */}
            <path
              d="M 10 40 Q 45 10, 80 40 T 150 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ink-primary"
            />

            {/* Secondary Phase Wave */}
            <path
              d="M 10 40 Q 45 70, 80 40 T 150 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 2"
              className="text-ink-muted/60"
            />

            {/* Kinetic Transit Nodes along the wave */}
            <circle cx="45" cy="25" r="3.5" className="fill-ink-primary" />
            <circle cx="80" cy="40" r="2.5" className="fill-ink-secondary" />
            <circle cx="115" cy="55" r="3.5" className="fill-ink-primary" />
            
            {/* Minimalist Coordinate Axis Ticks */}
            <line x1="45" y1="20" x2="45" y2="30" stroke="currentColor" strokeWidth="1" className="text-ink-muted" />
            <line x1="115" y1="50" x2="115" y2="60" stroke="currentColor" strokeWidth="1" className="text-ink-muted" />
          </svg>
        </div>

        {/* Minimalist Architectural Footer */}
        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-border-default/60 pt-1.5">
          <span>THROUGHPUT: 50K+ MSG</span>
          <span className="font-semibold text-ink-primary">&lt;500MS DISPATCH</span>
        </div>
      </div>
    );
  }

  // 3. HENU Housing Accounting ERP: Isometric Architectural Spatial Grid & Balanced Ledger
  if (normSlug.includes("erp") || normSlug.includes("housing") || normSlug.includes("accounting")) {
    return (
      <div className={`relative h-36 rounded-xl overflow-hidden bg-[#f8f6f2] dark:bg-[#201e1b] border border-border-default/80 p-3.5 flex flex-col justify-between group-hover:border-ink-primary/40 transition-all duration-500 ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #1c1c1a 1px, transparent 1px), linear-gradient(to bottom, #1c1c1a 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Minimalist Architectural Header */}
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-ink-muted">
          <span className="flex items-center gap-1.5 font-medium text-ink-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-primary opacity-80" />
            <span>FIG 03 // MODULAR LEDGER VOID</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-border-default bg-surface-primary/80">
            DOUBLE-ENTRY ACID
          </span>
        </div>

        {/* Isometric Architectural Volume Blocks */}
        <div className="relative h-20 flex items-center justify-center">
          <svg viewBox="0 0 160 80" className="w-full h-full max-w-[180px] overflow-visible">
            <g className="transition-transform duration-700 group-hover:-translate-y-1">
              {/* Base Isometric Grid Plane */}
              <polygon points="80,55 125,72 80,88 35,72" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" className="text-ink-muted/50" />

              {/* Module 1: Left Elevation Block */}
              <g className="text-ink-secondary">
                <polygon points="50,42 70,30 70,55 50,67" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" />
                <polygon points="50,42 70,30 90,42 70,54" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2" />
                <polygon points="70,54 90,42 90,67 70,79" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.2" />
              </g>

              {/* Module 2: Elevated Balanced Keystone Block */}
              <g className="text-ink-primary">
                <polygon points="80,18 102,6 102,28 80,40" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.4" />
                <polygon points="80,18 102,6 124,18 102,30" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.4" />
                <polygon points="102,30 124,18 124,40 102,52" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.4" />
              </g>

              {/* Elevation Dimension Vector */}
              <line x1="30" y1="30" x2="30" y2="65" stroke="currentColor" strokeWidth="0.8" className="text-ink-muted" />
              <line x1="27" y1="30" x2="33" y2="30" stroke="currentColor" strokeWidth="0.8" className="text-ink-muted" />
              <line x1="27" y1="65" x2="33" y2="65" stroke="currentColor" strokeWidth="0.8" className="text-ink-muted" />
            </g>
          </svg>
        </div>

        {/* Minimalist Architectural Footer */}
        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-border-default/60 pt-1.5">
          <span>RECONCILED: 450+ UNITS</span>
          <span className="font-semibold text-ink-primary">100% VARIANCE-FREE</span>
        </div>
      </div>
    );
  }

  // 4. Verified Enterprise Portal / High Performance: Architectural Precision Oscilloscope & Latency Curve
  return (
    <div className={`relative h-36 rounded-xl overflow-hidden bg-[#f5f6f4] dark:bg-[#1b1f20] border border-border-default/80 p-3.5 flex flex-col justify-between group-hover:border-ink-primary/40 transition-all duration-500 ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #1c1c1a 1px, transparent 1px), linear-gradient(to bottom, #1c1c1a 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Minimalist Architectural Header */}
      <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-ink-muted">
        <span className="flex items-center gap-1.5 font-medium text-ink-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-ink-primary opacity-80" />
          <span>FIG 04 // LATENCY DECAY CURVE</span>
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded border border-border-default bg-surface-primary/80 font-bold">
          Δ -95.7%
        </span>
      </div>

      {/* Precision Decay Curve & Benchmark Grid */}
      <div className="relative h-20 flex items-center justify-center">
        <svg viewBox="0 0 160 80" className="w-full h-full max-w-[200px]">
          {/* Coordinate Axes */}
          <line x1="20" y1="12" x2="20" y2="68" stroke="currentColor" strokeWidth="1" className="text-ink-muted/50" />
          <line x1="20" y1="68" x2="150" y2="68" stroke="currentColor" strokeWidth="1" className="text-ink-muted/50" />

          {/* Coordinate Ticks */}
          <line x1="16" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" className="text-ink-muted" />
          <line x1="16" y1="44" x2="20" y2="44" stroke="currentColor" strokeWidth="1" className="text-ink-muted" />
          <text x="5" y="23" className="text-[7px] font-mono fill-ink-muted">420</text>
          <text x="8" y="65" className="text-[7px] font-mono fill-ink-primary font-bold">18</text>

          {/* Exponential Decay Spline from 420ms to 18ms */}
          <path
            d="M 20 20 C 50 20, 70 64, 145 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="text-ink-primary"
          />

          {/* Shaded Area Under the Curve */}
          <path
            d="M 20 20 C 50 20, 70 64, 145 64 L 145 68 L 20 68 Z"
            fill="currentColor"
            fillOpacity="0.05"
            className="text-ink-primary"
          />

          {/* Production Convergence Anchor */}
          <circle cx="145" cy="64" r="3" className="fill-ink-primary" />
          <circle cx="145" cy="64" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-ink-muted" />
        </svg>
      </div>

      {/* Minimalist Architectural Footer */}
      <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-border-default/60 pt-1.5">
        <span>LEGACY: 420MS</span>
        <span className="font-semibold text-ink-primary">PRODUCTION: 18MS TTFB</span>
      </div>
    </div>
  );
}

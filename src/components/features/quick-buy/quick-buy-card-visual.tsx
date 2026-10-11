"use client";

import React from "react";
import Image from "next/image";

interface QuickBuyCardVisualProps {
  id: string;
  type: "service" | "product";
  category: string;
  name: string;
}

export function QuickBuyCardVisual({ id, type, category, name }: QuickBuyCardVisualProps) {
  // ---------------------------------------------------------------------------
  // 1. PRODUCTS: Showcase Official Brand Marks with Restrained Architectural Frames
  // ---------------------------------------------------------------------------
  if (type === "product") {
    // HENU OS
    if (id === "prod-henu-os") {
      return (
        <div className="relative h-36 rounded-xl overflow-hidden bg-[#f4f7f6] dark:bg-[#111718] border border-cyan-500/25 p-3.5 flex flex-col justify-between group-hover:border-cyan-500/50 transition-all">
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-cyan-800 dark:text-cyan-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              SPEC: KERNEL SOVEREIGNTY
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10">
              60FPS COMPOSITOR
            </span>
          </div>

          {/* Isometric Compositor Desktop Schema */}
          <div className="relative h-18 flex items-center justify-center">
            <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
              {/* Main Desktop Window Frame */}
              <rect x="25" y="10" width="110" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-cyan-600/70 dark:text-cyan-400/70" />
              <line x1="25" y1="20" x2="135" y2="20" stroke="currentColor" strokeWidth="0.8" className="text-cyan-500/40" />
              <circle cx="32" cy="15" r="1.5" className="fill-cyan-500/80" />
              <circle cx="38" cy="15" r="1.5" className="fill-cyan-500/60" />
              <circle cx="44" cy="15" r="1.5" className="fill-cyan-500/40" />

              {/* Sub-window tiling */}
              <rect x="30" y="25" width="48" height="30" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.9" className="text-cyan-600 dark:text-cyan-400" />
              <rect x="83" y="25" width="47" height="13" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="0.8" className="text-cyan-600/60 dark:text-cyan-400/60" />
              <rect x="83" y="42" width="47" height="13" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="0.8" className="text-cyan-600/60 dark:text-cyan-400/60" />
              
              {/* IPC Bridge indicator */}
              <line x1="78" y1="35" x2="83" y2="35" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" className="text-cyan-500" />
            </svg>
          </div>

          <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-cyan-500/20 pt-1.5">
            <span>SOCKET: ZERO-TELEMETRY</span>
            <span className="font-semibold text-cyan-700 dark:text-cyan-300">NATIVE X86_64 / ARM64</span>
          </div>
        </div>
      );
    }

    // HENU AI
    if (id === "prod-henu-ai") {
      return (
        <div className="relative h-36 rounded-xl overflow-hidden bg-[#f7f5f9] dark:bg-[#16121f] border border-purple-500/25 p-3.5 flex flex-col justify-between group-hover:border-purple-500/50 transition-all">
          <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-purple-800 dark:text-purple-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              FOUNDATION REASONER
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">
              4.8K TOK/S
            </span>
          </div>

          {/* Natural Transparent Dragon Logo Mark */}
          <div className="relative h-20 flex items-center justify-center">
            <div className="relative w-32 h-16 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/brand/henu-ai.png"
                alt="HENU AI Emblem"
                fill
                sizes="140px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-purple-500/20 pt-1.5">
            <span>CONTEXT: 128K TOKENS</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">LOCAL MODEL WEIGHTS</span>
          </div>
        </div>
      );
    }

    // HENU PA
    if (id === "prod-henu-pa") {
      return (
        <div className="relative h-36 rounded-xl overflow-hidden bg-[#f9f7f4] dark:bg-[#1b1617] border border-amber-500/25 p-3.5 flex flex-col justify-between group-hover:border-amber-500/50 transition-all">
          <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-amber-800 dark:text-amber-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              VOICE PROTOCOL
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10">
              &lt;68MS DISPATCH
            </span>
          </div>

          {/* Natural Transparent PA Monogram Logo Mark */}
          <div className="relative h-20 flex items-center justify-center">
            <div className="relative w-32 h-16 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/brand/henu-pa.png"
                alt="HENU PA Emblem"
                fill
                sizes="140px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-amber-500/20 pt-1.5">
            <span>BUFFER: LOCAL ONLY</span>
            <span className="font-semibold text-amber-700 dark:text-amber-300">48KHZ AUDIO RUNTIME</span>
          </div>
        </div>
      );
    }

    // HENU IDE
    if (id === "prod-henu-ide") {
      return (
        <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f6f9] dark:bg-[#131622] border border-indigo-500/25 p-3.5 flex flex-col justify-between group-hover:border-indigo-500/50 transition-all">
          <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-indigo-800 dark:text-indigo-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              TOOLCHAIN &amp; AST
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10">
              TYPE-SAFE NATIVE
            </span>
          </div>

          {/* Natural Transparent 3D H Logo Mark */}
          <div className="relative h-20 flex items-center justify-center">
            <div className="relative w-28 h-16 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/brand/henu-ide.png"
                alt="HENU IDE Emblem"
                fill
                sizes="140px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-indigo-500/20 pt-1.5">
            <span>VERIFICATION: AUTOMATED</span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">ZERO CLOUD LOCK-IN</span>
          </div>
        </div>
      );
    }
  }

  // ---------------------------------------------------------------------------
  // 2. SERVICES: Clean Swiss Architectural Blueprints / Precision Schematics
  // ---------------------------------------------------------------------------

  // Website Development
  if (id === "srv-website-dev") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f8f6] dark:bg-[#121915] border border-emerald-500/25 p-3.5 flex flex-col justify-between group-hover:border-emerald-500/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-emerald-800 dark:text-emerald-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            FIG // WEB HYDRATION ARCHITECTURE
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
            TTFB &lt;120MS
          </span>
        </div>

        {/* Viewport Wireframe & Component Hydration Node Graph */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Browser Chassis */}
            <rect x="20" y="8" width="120" height="54" rx="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-700/60 dark:text-emerald-400/60" />
            <line x1="20" y1="18" x2="140" y2="18" stroke="currentColor" strokeWidth="0.8" className="text-emerald-500/30" />
            <circle cx="26" cy="13" r="1.5" className="fill-emerald-600/70" />
            <circle cx="31" cy="13" r="1.5" className="fill-emerald-600/50" />
            
            {/* Header Block */}
            <rect x="25" y="22" width="110" height="8" rx="1.5" fill="currentColor" fillOpacity="0.08" className="text-emerald-600" />
            {/* Left Nav Grid */}
            <rect x="25" y="33" width="30" height="24" rx="1.5" fill="currentColor" fillOpacity="0.05" className="text-emerald-600" />
            {/* Main Content Modules */}
            <rect x="60" y="33" width="75" height="10" rx="1.5" fill="currentColor" fillOpacity="0.12" className="text-emerald-600" />
            <rect x="60" y="46" width="35" height="11" rx="1.5" fill="currentColor" fillOpacity="0.06" className="text-emerald-600" />
            <rect x="100" y="46" width="35" height="11" rx="1.5" fill="currentColor" fillOpacity="0.06" className="text-emerald-600" />
            
            {/* 100/100 Lighthouse Benchmark Badge */}
            <circle cx="125" cy="13" r="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500" />
            <text x="125" y="15" textAnchor="middle" className="text-[5px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400">100</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-emerald-500/20 pt-1.5">
          <span>NEXT.JS // STRICT TYPESCRIPT</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">100/100 PERF SCORE</span>
        </div>
      </div>
    );
  }

  // Mobile App Development
  if (id === "srv-mobile-app-dev") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f8f6] dark:bg-[#121915] border border-emerald-500/25 p-3.5 flex flex-col justify-between group-hover:border-emerald-500/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-emerald-800 dark:text-emerald-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            FIG // MOBILE RUNTIME BLUEPRINT
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
            OFFLINE PERSISTENCE
          </span>
        </div>

        {/* Dual Phone Wireframes with Sync Bus */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Device 1: iOS Form Factor */}
            <rect x="42" y="8" width="32" height="54" rx="4" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-emerald-600 dark:text-emerald-400" />
            <rect x="52" y="11" width="12" height="2" rx="1" className="fill-emerald-500/60" />
            <rect x="46" y="16" width="24" height="40" rx="2" fill="currentColor" fillOpacity="0.06" className="text-emerald-600" />
            
            {/* Device 2: Android / Tablet Outline */}
            <rect x="88" y="12" width="30" height="50" rx="3" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-600/70 dark:text-emerald-400/70" />
            <circle cx="103" cy="15" r="1" className="fill-emerald-500/70" />
            <rect x="91" y="19" width="24" height="38" rx="1.5" fill="currentColor" fillOpacity="0.04" className="text-emerald-600" />

            {/* Sync Curve Bus */}
            <path d="M 74 35 C 80 25, 82 25, 88 35" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className="text-emerald-500" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-emerald-500/20 pt-1.5">
          <span>TARGET: REACT NATIVE / FLUTTER</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">60FPS GESTURE ENGINE</span>
        </div>
      </div>
    );
  }

  // Software Solutions
  if (id === "srv-software-solutions") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f8f6] dark:bg-[#121915] border border-emerald-500/25 p-3.5 flex flex-col justify-between group-hover:border-emerald-500/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-emerald-800 dark:text-emerald-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            FIG // DISTRIBUTED ARCHITECTURE
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10">
            ACID CONFORMANT
          </span>
        </div>

        {/* Microservice Distributed Nodes */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* API Gateway Node */}
            <circle cx="35" cy="35" r="14" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400" />
            <text x="35" y="37" textAnchor="middle" className="text-[6px] font-mono fill-emerald-800 dark:fill-emerald-300 font-bold">API GW</text>

            {/* Connecting RPC Pipes */}
            <line x1="49" y1="35" x2="75" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-emerald-500" />
            <line x1="49" y1="35" x2="75" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-emerald-500" />

            {/* Microservice 1 */}
            <rect x="75" y="10" width="34" height="20" rx="3" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1" className="text-emerald-600" />
            <text x="92" y="22" textAnchor="middle" className="text-[6px] font-mono fill-emerald-800 dark:fill-emerald-300">AUTH</text>

            {/* Microservice 2 */}
            <rect x="75" y="40" width="34" height="20" rx="3" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1" className="text-emerald-600" />
            <text x="92" y="52" textAnchor="middle" className="text-[6px] font-mono fill-emerald-800 dark:fill-emerald-300">CORE</text>

            {/* Database Cube */}
            <path d="M 125 22 L 142 22 L 142 48 L 125 48 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600" />
            <line x1="109" y1="20" x2="125" y2="30" stroke="currentColor" strokeWidth="1" className="text-emerald-500" />
            <line x1="109" y1="50" x2="125" y2="40" stroke="currentColor" strokeWidth="1" className="text-emerald-500" />
            <text x="133.5" y="37" textAnchor="middle" className="text-[5px] font-mono fill-emerald-700 dark:fill-emerald-300 font-bold">SQL</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-emerald-500/20 pt-1.5">
          <span>DISPATCH: ZERO DOWNTIME</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">CONTAINERIZED DEPLOY</span>
        </div>
      </div>
    );
  }

  // AI Automation
  if (id === "srv-ai-automation") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f7f5f9] dark:bg-[#16121f] border border-indigo-500/25 p-3.5 flex flex-col justify-between group-hover:border-indigo-500/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-indigo-800 dark:text-indigo-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            FIG // AGENTIC PIPELINE &amp; DAG
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10">
            DETERMINISTIC
          </span>
        </div>

        {/* Agentic DAG Reasoning Graph */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            <rect x="15" y="25" width="28" height="20" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" className="text-indigo-600" />
            <text x="29" y="37" textAnchor="middle" className="text-[5px] font-mono fill-indigo-700 dark:fill-indigo-300 font-bold">PROMPT</text>

            <line x1="43" y1="35" x2="65" y2="22" stroke="currentColor" strokeWidth="1.2" className="text-indigo-500" />
            <line x1="43" y1="35" x2="65" y2="48" stroke="currentColor" strokeWidth="1.2" className="text-indigo-500" />

            <circle cx="75" cy="22" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className="text-indigo-600" />
            <text x="75" y="24" textAnchor="middle" className="text-[5px] font-mono fill-indigo-700 dark:fill-indigo-300">TOOL</text>

            <circle cx="75" cy="48" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className="text-indigo-600" />
            <text x="75" y="50" textAnchor="middle" className="text-[5px] font-mono fill-indigo-700 dark:fill-indigo-300">EVAL</text>

            <line x1="85" y1="22" x2="110" y2="35" stroke="currentColor" strokeWidth="1.2" className="text-indigo-500" />
            <line x1="85" y1="48" x2="110" y2="35" stroke="currentColor" strokeWidth="1.2" className="text-indigo-500" />

            <polygon points="115,35 130,22 145,35 130,48" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" className="text-indigo-600" />
            <text x="130" y="37" textAnchor="middle" className="text-[5px] font-mono fill-indigo-800 dark:fill-indigo-200 font-bold">OUTPUT</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-indigo-500/20 pt-1.5">
          <span>PROTOCOL: LANGGRAPH / DSPY</span>
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">SCHEMA CONSTRAINED</span>
        </div>
      </div>
    );
  }

  // Graphic Design
  if (id === "srv-graphic-design") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#faf7f5] dark:bg-[#1c1614] border border-amber-600/25 p-3.5 flex flex-col justify-between group-hover:border-amber-600/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-amber-800 dark:text-amber-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            FIG // GEOMETRIC IDENTITY &amp; TYPOGRAPHY
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-600/30 bg-amber-600/10">
            VECTOR PERFECTION
          </span>
        </div>

        {/* Vector Bézier Curves & Typographic Grid */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Baseline & Cap Height Construction Guides */}
            <line x1="15" y1="20" x2="145" y2="20" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" className="text-amber-600/40" />
            <line x1="15" y1="52" x2="145" y2="52" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" className="text-amber-600/40" />

            {/* Smooth Harmonic Bézier Spline */}
            <path d="M 25 52 C 45 10, 75 10, 85 52 C 95 15, 125 15, 135 52" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-700 dark:text-amber-400" />

            {/* Bézier Tangent Control Handles */}
            <circle cx="55" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-600" />
            <line x1="55" y1="18" x2="85" y2="52" stroke="currentColor" strokeWidth="0.8" className="text-amber-600/60" />
            <circle cx="105" cy="22" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-600" />
            <line x1="105" y1="22" x2="85" y2="52" stroke="currentColor" strokeWidth="0.8" className="text-amber-600/60" />

            {/* Golden Ratio Spiral Stamp */}
            <circle cx="85" cy="52" r="3.5" className="fill-amber-600" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-amber-600/20 pt-1.5">
          <span>DESIGN SYSTEM: TOKENS + SVG</span>
          <span className="font-semibold text-amber-700 dark:text-amber-300">PRINT &amp; SCREEN MATRIX</span>
        </div>
      </div>
    );
  }

  // Digital Marketing
  if (id === "srv-digital-marketing") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#faf7f5] dark:bg-[#1c1614] border border-amber-600/25 p-3.5 flex flex-col justify-between group-hover:border-amber-600/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-amber-800 dark:text-amber-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            FIG // DISCOVERABILITY &amp; CTR MATRIX
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-600/30 bg-amber-600/10">
            TECHNICAL SEO
          </span>
        </div>

        {/* Growth Curve & Crawl Spider Indexing */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Coordinate Axis */}
            <line x1="25" y1="12" x2="25" y2="58" stroke="currentColor" strokeWidth="1" className="text-amber-600/40" />
            <line x1="25" y1="58" x2="145" y2="58" stroke="currentColor" strokeWidth="1" className="text-amber-600/40" />

            {/* Growth Curve from 12% to 94% */}
            <path d="M 25 54 C 60 50, 90 28, 140 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-amber-700 dark:text-amber-400" />

            {/* Filled Area under curve */}
            <path d="M 25 54 C 60 50, 90 28, 140 16 L 140 58 L 25 58 Z" fill="currentColor" fillOpacity="0.08" className="text-amber-600" />

            {/* Milestone Dots */}
            <circle cx="65" cy="46" r="3" className="fill-amber-600" />
            <circle cx="105" cy="27" r="3" className="fill-amber-600" />
            <circle cx="140" cy="16" r="4" fill="currentColor" className="text-amber-600" />
            <text x="140" y="11" textAnchor="middle" className="text-[6px] font-mono font-bold fill-amber-700 dark:fill-amber-300">#1 RANK</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-amber-600/20 pt-1.5">
          <span>ZERO COOKIE TRACKING</span>
          <span className="font-semibold text-amber-700 dark:text-amber-300">FIRST-PARTY TELEMETRY</span>
        </div>
      </div>
    );
  }

  // Documentation & Startup
  if (id === "srv-doc-startup") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f6f8] dark:bg-[#12151b] border border-sky-600/25 p-3.5 flex flex-col justify-between group-hover:border-sky-600/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-sky-800 dark:text-sky-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            FIG // PRD &amp; SPECIFICATION AST
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-sky-600/30 bg-sky-600/10">
            AUDIT-READY
          </span>
        </div>

        {/* Structured Spec Document Blueprint */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Document Parchment */}
            <rect x="40" y="8" width="80" height="54" rx="3" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-sky-600 dark:text-sky-400" />
            
            {/* Header Lines */}
            <line x1="48" y1="17" x2="80" y2="17" stroke="currentColor" strokeWidth="2" className="text-sky-700 dark:text-sky-300" />
            <line x1="48" y1="24" x2="112" y2="24" stroke="currentColor" strokeWidth="1" className="text-sky-600/60" />
            <line x1="48" y1="30" x2="105" y2="30" stroke="currentColor" strokeWidth="1" className="text-sky-600/60" />
            <line x1="48" y1="36" x2="98" y2="36" stroke="currentColor" strokeWidth="1" className="text-sky-600/60" />

            {/* Checkmark Section */}
            <circle cx="52" cy="46" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-emerald-500" />
            <line x1="58" y1="46" x2="100" y2="46" stroke="currentColor" strokeWidth="1" className="text-sky-600/80" />
            
            <circle cx="52" cy="54" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-emerald-500" />
            <line x1="58" y1="54" x2="90" y2="54" stroke="currentColor" strokeWidth="1" className="text-sky-600/80" />

            {/* Cryptographic Seal Stamp */}
            <circle cx="106" cy="48" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" className="text-sky-600" />
            <text x="106" y="50" textAnchor="middle" className="text-[5px] font-mono fill-sky-800 dark:fill-sky-300 font-bold">PRD</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-sky-600/20 pt-1.5">
          <span>STANDARD: IEEE 830 / ISO 29148</span>
          <span className="font-semibold text-sky-700 dark:text-sky-300">DUE DILIGENCE PASSED</span>
        </div>
      </div>
    );
  }

  // Legal Services
  if (id === "srv-legal-services") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f6f8] dark:bg-[#12151b] border border-sky-600/25 p-3.5 flex flex-col justify-between group-hover:border-sky-600/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-sky-800 dark:text-sky-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            FIG // IP ASSIGNMENT &amp; COVENANTS
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-sky-600/30 bg-sky-600/10">
            JURISDICTIONAL
          </span>
        </div>

        {/* Corporate Legal Seal & Bill of Sale */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Scale of Justice Minimalist Blueprint */}
            <line x1="80" y1="12" x2="80" y2="56" stroke="currentColor" strokeWidth="1.2" className="text-sky-600 dark:text-sky-400" />
            <line x1="50" y1="20" x2="110" y2="20" stroke="currentColor" strokeWidth="1.2" className="text-sky-600 dark:text-sky-400" />

            {/* Left Pan */}
            <line x1="50" y1="20" x2="40" y2="38" stroke="currentColor" strokeWidth="0.8" className="text-sky-500/70" />
            <line x1="50" y1="20" x2="60" y2="38" stroke="currentColor" strokeWidth="0.8" className="text-sky-500/70" />
            <path d="M 36 38 Q 50 48, 64 38 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className="text-sky-600" />

            {/* Right Pan */}
            <line x1="110" y1="20" x2="100" y2="38" stroke="currentColor" strokeWidth="0.8" className="text-sky-500/70" />
            <line x1="110" y1="20" x2="120" y2="38" stroke="currentColor" strokeWidth="0.8" className="text-sky-500/70" />
            <path d="M 96 38 Q 110 48, 124 38 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className="text-sky-600" />

            {/* Base Pedestal */}
            <line x1="68" y1="56" x2="92" y2="56" stroke="currentColor" strokeWidth="2" className="text-sky-700 dark:text-sky-300" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-sky-600/20 pt-1.5">
          <span>IP OWNERSHIP: 100% BUYER</span>
          <span className="font-semibold text-sky-700 dark:text-sky-300">INDEMNITY ASSURED</span>
        </div>
      </div>
    );
  }

  // Funding Solutions
  if (id === "srv-funding-solutions") {
    return (
      <div className="relative h-36 rounded-xl overflow-hidden bg-[#f5f6f8] dark:bg-[#12151b] border border-sky-600/25 p-3.5 flex flex-col justify-between group-hover:border-sky-600/50 transition-all">
        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-sky-800 dark:text-sky-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            FIG // CAPITAL WATERFALL &amp; RUNWAY
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-sky-600/30 bg-sky-600/10">
            SEED TO SERIES A
          </span>
        </div>

        {/* Capital Waterfall Chart */}
        <div className="relative h-18 flex items-center justify-center">
          <svg viewBox="0 0 160 70" className="w-full h-full max-w-[190px]">
            {/* Axis */}
            <line x1="25" y1="58" x2="140" y2="58" stroke="currentColor" strokeWidth="1" className="text-sky-600/40" />

            {/* Waterfall Columns */}
            <rect x="32" y="38" width="16" height="20" rx="1.5" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" className="text-sky-600" />
            <text x="40" y="34" textAnchor="middle" className="text-[5px] font-mono fill-sky-700 dark:fill-sky-300">PRE-SEED</text>

            <rect x="58" y="26" width="16" height="32" rx="1.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1" className="text-sky-600" />
            <text x="66" y="22" textAnchor="middle" className="text-[5px] font-mono fill-sky-700 dark:fill-sky-300">GRANT</text>

            <rect x="84" y="16" width="16" height="42" rx="1.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" className="text-sky-600" />
            <text x="92" y="12" textAnchor="middle" className="text-[5px] font-mono fill-sky-700 dark:fill-sky-300 font-bold">SEED</text>

            <rect x="110" y="8" width="16" height="50" rx="1.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" className="text-sky-600" />
            <text x="118" y="6" textAnchor="middle" className="text-[5px] font-mono fill-sky-800 dark:fill-sky-200 font-bold">SERIES A</text>

            {/* Growth Vector Arrow */}
            <path d="M 40 32 L 66 20 L 92 10 L 118 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className="text-emerald-500" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-ink-muted border-t border-sky-600/20 pt-1.5">
          <span>MODEL: CAP-TABLE SIMULATOR</span>
          <span className="font-semibold text-sky-700 dark:text-sky-300">FINANCIAL DOSSIER</span>
        </div>
      </div>
    );
  }

  // Fallback Generic Architectural Visual
  return (
    <div className="relative h-36 rounded-xl overflow-hidden bg-surface-secondary/40 border border-border-default p-3.5 flex flex-col justify-between">
      <div className="relative flex items-center justify-between text-[10px] font-mono text-ink-muted">
        <span>ARCHITECTURAL SPECIFICATION</span>
        <span>VERIFIED</span>
      </div>
      <div className="h-16 flex items-center justify-center font-mono text-xs text-ink-muted">
        {name}
      </div>
      <div className="relative flex items-center justify-between text-[9px] font-mono text-ink-muted border-t border-border-default/60 pt-1.5">
        <span>DELIVERABLE</span>
        <span className="font-semibold text-ink-primary">PRODUCTION-GRADE</span>
      </div>
    </div>
  );
}

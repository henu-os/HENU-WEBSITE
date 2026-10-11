"use client";

import React from "react";

interface AnimatedProjectCardVisualProps {
  categorySlug?: string;
  slug?: string;
  className?: string;
}

export function AnimatedProjectCardVisual({
  categorySlug = "",
  slug = "",
  className = "",
}: AnimatedProjectCardVisualProps) {
  const normSlug = slug.toLowerCase();
  const normCat = categorySlug.toLowerCase();

  // 1. Cloud Infrastructure / Mail & Sovereign Identity: Electric Sapphire & Cyan
  if (normSlug.includes("mail") || normCat.includes("cloud")) {
    return (
      <div className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 border border-blue-500/30 p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-cyan-400/60 transition-all duration-300 ${className}`}>
        {/* Dynamic Scanline Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex items-center justify-between text-[10px] font-mono text-cyan-300">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider">CRYPTOGRAPHIC VAULT</span>
          </span>
          <span className="text-[9px] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-200">
            TLS 1.3 // ZERO-LEAK
          </span>
        </div>

        {/* Animated Relay Node Graphic */}
        <div className="relative flex items-center justify-around py-1">
          {/* Node 1: Sender Client */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-blue-900/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300 text-xs shadow-md">
              <span>✉</span>
            </div>
            <span className="text-[8px] font-mono text-slate-400">CLIENT</span>
          </div>

          {/* Animated Traveling Packet Line */}
          <div className="flex-1 mx-3 relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
            <span className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
          </div>

          {/* Node 2: Sovereign Enclave */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-300 flex items-center justify-center text-cyan-200 text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <span>🔒</span>
            </div>
            <span className="text-[8px] font-mono text-cyan-300 font-semibold">SOVEREIGN</span>
          </div>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-slate-400 border-t border-cyan-500/20 pt-1.5">
          <span>SHA-256 VERIFIED</span>
          <span className="text-cyan-300 font-bold">&#10003; 100% EGRESS SHIELD</span>
        </div>
      </div>
    );
  }

  // 2. Automation & AI / WhatsApp Engine: Vibrant Emerald & Jade Matrix
  if (normSlug.includes("whatsapp") || normSlug.includes("automation") || normCat.includes("automation")) {
    return (
      <div className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 border border-emerald-500/30 p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-400/60 transition-all duration-300 ${className}`}>
        <div className="relative flex items-center justify-between text-[10px] font-mono text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">ASYNC MESSAGE BROKER</span>
          </span>
          <span className="text-[9px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-200">
            50K+ MSG/MO
          </span>
        </div>

        {/* Live Webhook Pulse Conduits */}
        <div className="relative flex items-center justify-between px-2 py-1">
          <div className="flex gap-1.5 items-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-900/70 border border-emerald-400/50 flex items-center justify-center font-mono text-[9px] text-emerald-200 font-bold">
              API
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="w-8 h-1 bg-emerald-500/80 rounded animate-pulse" />
              <span className="w-6 h-1 bg-emerald-400/80 rounded animate-pulse delay-75" />
            </div>
          </div>

          {/* Central Queue Broker */}
          <div className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)] font-mono text-[9px] text-emerald-100 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>IDEMPOTENT</span>
          </div>

          <div className="flex gap-1.5 items-center">
            <div className="flex flex-col items-end gap-0.5">
              <span className="w-6 h-1 bg-emerald-400/80 rounded animate-pulse delay-100" />
              <span className="w-8 h-1 bg-emerald-500/80 rounded animate-pulse delay-150" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-teal-900/70 border border-teal-400/50 flex items-center justify-center font-mono text-[9px] text-teal-200 font-bold">
              SQL
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-slate-400 border-t border-emerald-500/20 pt-1.5">
          <span>LATENCY: &lt;500MS</span>
          <span className="text-emerald-300 font-bold">&#10003; ZERO MESSAGE LOSS</span>
        </div>
      </div>
    );
  }

  // 3. Enterprise Systems / Financial Accounting ERP: Champagne Gold & Warm Amber
  if (normSlug.includes("erp") || normSlug.includes("accounting") || normSlug.includes("housing")) {
    return (
      <div className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 via-amber-950 to-yellow-950 border border-amber-500/30 p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:border-amber-400/60 transition-all duration-300 ${className}`}>
        <div className="relative flex items-center justify-between text-[10px] font-mono text-amber-300">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">DOUBLE-ENTRY LEDGER CORE</span>
          </span>
          <span className="text-[9px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 text-amber-200">
            ACID ISOLATION
          </span>
        </div>

        {/* Ledger Balance Matrix Graphic */}
        <div className="relative flex items-center justify-around py-1">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/50 font-mono text-center">
            <span className="block text-[8px] text-amber-400">DEBIT JOURNAL</span>
            <span className="text-xs font-bold text-amber-200">₹ 4.2M</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-amber-900 border border-amber-400 flex items-center justify-center text-amber-200 text-xs font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              =
            </span>
            <span className="text-[7px] font-mono text-amber-400 mt-0.5">BALANCED</span>
          </div>

          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/50 font-mono text-center">
            <span className="block text-[8px] text-amber-400">CREDIT JOURNAL</span>
            <span className="text-xs font-bold text-amber-200">₹ 4.2M</span>
          </div>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-slate-400 border-t border-amber-500/20 pt-1.5">
          <span>450+ UNITS AUDITED</span>
          <span className="text-amber-300 font-bold">&#10003; 100% VARIANCE-FREE</span>
        </div>
      </div>
    );
  }

  // 4. Enterprise Portal / High Speed Telemetry: Deep Amethyst & Hyper Indigo
  return (
    <div className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 border border-indigo-500/30 p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:border-indigo-400/60 transition-all duration-300 ${className}`}>
      <div className="relative flex items-center justify-between text-[10px] font-mono text-indigo-300">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          <span className="font-semibold uppercase tracking-wider">LATENCY ACCELERATION</span>
        </span>
        <span className="text-[9px] bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/40 text-indigo-200 font-bold">
          23× SPEEDUP
        </span>
      </div>

      {/* Latency Reduction Curve Graphic */}
      <div className="relative flex items-center justify-between px-3 py-1 font-mono">
        <div className="text-center">
          <span className="text-[9px] text-rose-400 line-through block">420ms</span>
          <span className="text-[8px] text-slate-400">LEGACY TIME</span>
        </div>

        {/* Animated Acceleration Arrow */}
        <div className="flex-1 mx-3 flex flex-col items-center">
          <div className="w-full flex items-center">
            <div className="h-1 flex-1 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full" />
            <span className="text-emerald-400 font-bold text-sm ml-1">&rarr;</span>
          </div>
          <span className="text-[8px] text-indigo-300 font-semibold mt-1">95.7% DROP</span>
        </div>

        <div className="text-center p-1.5 rounded-lg bg-indigo-900/80 border border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]">
          <span className="text-sm font-bold text-emerald-300 block">18ms</span>
          <span className="text-[8px] text-indigo-200 font-semibold">PRODUCTION</span>
        </div>
      </div>

      <div className="relative flex items-center justify-between font-mono text-[9px] text-slate-400 border-t border-indigo-500/20 pt-1.5">
        <span>GLOBAL EDGE CACHE</span>
        <span className="text-indigo-300 font-bold">&#10003; WCAG AA VERIFIED</span>
      </div>
    </div>
  );
}

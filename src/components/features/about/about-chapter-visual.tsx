"use client";

import React from "react";

interface AboutChapterVisualProps {
  chapterIndex: number;
  chapterNumber?: string;
  title: string;
}

export function AboutChapterVisual({ chapterIndex, chapterNumber, title }: AboutChapterVisualProps) {
  // ---------------------------------------------------------------------------
  // Chapter 1: The Sovereign Computing Imperative // Hardware Root of Trust
  // ---------------------------------------------------------------------------
  if (chapterIndex === 0) {
    return (
      <div className="relative h-48 rounded-xl overflow-hidden bg-[#faf8f4] dark:bg-[#0f1722] border border-[#d4af37]/30 p-4 flex flex-col justify-between group-hover:border-[#d4af37]/60 transition-all duration-300">
        {/* Subtle Archival Drafting Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #b38322 1px, transparent 1px), linear-gradient(to bottom, #b38322 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
            FIG 01 // HARDWARE ROOT OF TRUST
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 font-semibold">
            RING 0 ISOLATION
          </span>
        </div>

        {/* Vector Schematic: Secure Boot Boundary & Telemetry Wall */}
        <div className="relative h-24 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="w-full h-full max-w-[240px]">
            {/* TPM Hardware Chip */}
            <rect x="15" y="24" width="36" height="32" rx="3" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <text x="33" y="38" textAnchor="middle" className="text-[6px] font-mono font-bold fill-[#8c6b1b] dark:fill-[#e5c468]">TPM 2.0</text>
            <text x="33" y="47" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">CRYPTO CORE</text>

            {/* Connecting cryptographic bus line */}
            <line x1="51" y1="40" x2="72" y2="40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="text-[#c59b27]" />

            {/* Zero-Telemetry Kernel Boundary Wall */}
            <line x1="72" y1="12" x2="72" y2="68" stroke="currentColor" strokeWidth="1.5" className="text-[#14284b] dark:text-[#6b99d6]" />
            <text x="70" y="74" textAnchor="end" className="text-[4.5px] font-mono fill-[#8c6b1b] dark:fill-[#dfba5f]">GATEWAY</text>

            {/* Sovereign Microkernel Enclave */}
            <rect x="80" y="16" width="60" height="48" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" className="text-[#14284b] dark:text-[#93b4e2]" />
            <line x1="80" y1="28" x2="140" y2="28" stroke="currentColor" strokeWidth="0.8" className="text-[#14284b]/40 dark:text-[#93b4e2]/40" />
            <circle cx="87" cy="22" r="1.5" className="fill-[#c59b27]" />
            <circle cx="93" cy="22" r="1.5" className="fill-[#c59b27]/60" />
            <text x="110" y="40" textAnchor="middle" className="text-[6px] font-mono font-bold fill-[#14284b] dark:fill-[#93b4e2]">HENU KERNEL</text>
            <text x="110" y="49" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">ZERO BLOB VERIFIED</text>

            {/* Verified Signature Badge on Right */}
            <circle cx="168" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <circle cx="168" cy="40" r="11" fill="currentColor" fillOpacity="0.06" className="text-[#c59b27]" />
            <text x="168" y="38" textAnchor="middle" className="text-[5px] font-mono font-bold fill-[#8c6b1b] dark:fill-[#e5c468]">AUDIT</text>
            <text x="168" y="45" textAnchor="middle" className="text-[5px] font-mono font-bold fill-[#8c6b1b] dark:fill-[#e5c468]">PASSED</text>
            <line x1="140" y1="40" x2="154" y2="40" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-[#64748b] border-t border-[#d4af37]/20 pt-2">
          <span>ROOT: ZERO THIRD-PARTY BLOBS</span>
          <span className="font-semibold text-[#8c6b1b] dark:text-[#dfba5f]">MATHEMATICALLY PROVABLE</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Chapter 2: The Ecosystem Model // Concentric Layered Modularity
  // ---------------------------------------------------------------------------
  if (chapterIndex === 1) {
    return (
      <div className="relative h-48 rounded-xl overflow-hidden bg-[#faf8f4] dark:bg-[#0f1722] border border-[#d4af37]/30 p-4 flex flex-col justify-between group-hover:border-[#d4af37]/60 transition-all duration-300">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #b38322 1px, transparent 1px), linear-gradient(to bottom, #b38322 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
            FIG 02 // 4 CONCENTRIC ARCHITECTURAL TIERS
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 font-semibold">
            INDEPENDENT STACK
          </span>
        </div>

        {/* Vector Schematic: Concentric Layered Rings */}
        <div className="relative h-24 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="w-full h-full max-w-[240px]">
            {/* Tier 1: Outer Shell (HENU IDE) */}
            <circle cx="100" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-[#14284b]/40 dark:text-[#93b4e2]/40" />
            <text x="100" y="12" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">IV // WAYLAND SHELL &amp; IDE</text>

            {/* Tier 2: Agent IPC Bus (HENU PA) */}
            <circle cx="100" cy="40" r="26" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-[#9a532e]" />
            <text x="100" y="20" textAnchor="middle" className="text-[5px] font-mono fill-[#9a532e] font-semibold">III // PRIVATE IPC BUS</text>

            {/* Tier 3: Local Neural Engine (HENU AI) */}
            <circle cx="100" cy="40" r="18" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <text x="100" y="28" textAnchor="middle" className="text-[5px] font-mono fill-[#8c6b1b] dark:fill-[#e5c468] font-semibold">II // NEURAL WEIGHTS</text>

            {/* Tier 4: Immutable Center Core (HENU OS) */}
            <circle cx="100" cy="40" r="9" fill="currentColor" className="text-[#14284b] dark:text-[#93b4e2]" />
            <text x="100" y="42" textAnchor="middle" className="text-[5px] font-mono fill-white dark:fill-[#0c1420] font-bold">CORE</text>

            {/* Orbiting Telemetry Point */}
            <circle cx="134" cy="40" r="2" className="fill-[#c59b27]" />
            <circle cx="66" cy="40" r="2" className="fill-[#9a532e]" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-[#64748b] border-t border-[#d4af37]/20 pt-2">
          <span>COUPLING: ZERO CIRCULAR DEPS</span>
          <span className="font-semibold text-[#8c6b1b] dark:text-[#dfba5f]">EACH LAYER IS AUTONOMOUS</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Chapter 3: Engineering Discipline & Craft // Deterministic Reproducible Builds
  // ---------------------------------------------------------------------------
  if (chapterIndex === 2) {
    return (
      <div className="relative h-48 rounded-xl overflow-hidden bg-[#faf8f4] dark:bg-[#0f1722] border border-[#d4af37]/30 p-4 flex flex-col justify-between group-hover:border-[#d4af37]/60 transition-all duration-300">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #b38322 1px, transparent 1px), linear-gradient(to bottom, #b38322 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
            FIG 03 // DETERMINISTIC REPRODUCIBLE PIPELINE
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 font-semibold">
            ACID TRANSACTIONAL
          </span>
        </div>

        {/* Vector Schematic: Directed Acyclic Graph (DAG) with Cryptographic Seal */}
        <div className="relative h-24 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="w-full h-full max-w-[240px]">
            {/* Step 1: Strict Typed Contract */}
            <rect x="15" y="28" width="34" height="24" rx="2" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1" className="text-[#14284b] dark:text-[#93b4e2]" />
            <text x="32" y="42" textAnchor="middle" className="text-[5.5px] font-mono fill-[#14284b] dark:fill-[#93b4e2] font-semibold">TYPES</text>

            {/* Connecting Pipe */}
            <line x1="49" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />

            {/* Step 2: Hermetic Sandbox Build */}
            <polygon points="85,25 105,25 115,40 105,55 85,55 75,40" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <text x="95" y="38" textAnchor="middle" className="text-[5.5px] font-mono fill-[#8c6b1b] dark:fill-[#e5c468] font-bold">HERMETIC</text>
            <text x="95" y="46" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">SANDBOX</text>

            {/* Connecting Pipe */}
            <line x1="115" y1="40" x2="135" y2="40" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />

            {/* Step 3: Immutable Binary Artifact with Multi-Decade Stamp */}
            <rect x="135" y="24" width="50" height="32" rx="3" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.2" className="text-[#8c6b1b] dark:text-[#e5c468]" />
            <text x="160" y="38" textAnchor="middle" className="text-[6px] font-mono fill-[#8c6b1b] dark:fill-[#e5c468] font-bold">BIT-FOR-BIT</text>
            <text x="160" y="46" textAnchor="middle" className="text-[5px] font-mono fill-[#14284b] dark:fill-[#93b4e2]">DECADE PROOF</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-[#64748b] border-t border-[#d4af37]/20 pt-2">
          <span>STANDARD: SHA-256 HERMETIC SEAL</span>
          <span className="font-semibold text-[#8c6b1b] dark:text-[#dfba5f]">IDENTICAL HASHES ON ANY HARDWARE</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Chapter 4: Sovereign Client Implementations // Private Enterprise Ledgers
  // ---------------------------------------------------------------------------
  if (chapterIndex === 3) {
    return (
      <div className="relative h-48 rounded-xl overflow-hidden bg-[#faf8f4] dark:bg-[#0f1722] border border-[#d4af37]/30 p-4 flex flex-col justify-between group-hover:border-[#d4af37]/60 transition-all duration-300">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to right, #b38322 1px, transparent 1px), linear-gradient(to bottom, #b38322 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
            FIG 04 // ENTERPRISE SOVEREIGN DATA LEDGER
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 font-semibold">
            ZERO VENDOR TETHER
          </span>
        </div>

        {/* Vector Schematic: Air-Gapped Private Cluster */}
        <div className="relative h-24 flex items-center justify-center">
          <svg viewBox="0 0 200 80" className="w-full h-full max-w-[240px]">
            {/* Node 1: Private ERP */}
            <circle cx="45" cy="40" r="16" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.2" className="text-[#14284b] dark:text-[#93b4e2]" />
            <text x="45" y="42" textAnchor="middle" className="text-[6px] font-mono fill-[#14284b] dark:fill-[#93b4e2] font-semibold">ERP</text>

            {/* Encrypted Sync Mesh */}
            <line x1="61" y1="40" x2="88" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-[#c59b27]" />
            <line x1="61" y1="40" x2="88" y2="52" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" className="text-[#c59b27]" />

            {/* Central Sovereign Vault */}
            <rect x="88" y="20" width="45" height="40" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <text x="110" y="38" textAnchor="middle" className="text-[6px] font-mono font-bold fill-[#8c6b1b] dark:fill-[#e5c468]">PRIVATE</text>
            <text x="110" y="47" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">LEDGER VAULT</text>

            {/* Node 2: Air-Gapped Key Enclave */}
            <line x1="133" y1="40" x2="155" y2="40" stroke="currentColor" strokeWidth="1.2" className="text-[#c59b27]" />
            <rect x="155" y="28" width="30" height="24" rx="2" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1" className="text-[#9a532e]" />
            <text x="170" y="42" textAnchor="middle" className="text-[5px] font-mono fill-[#9a532e] font-semibold">ZK-KEY</text>
          </svg>
        </div>

        <div className="relative flex items-center justify-between font-mono text-[9px] text-[#64748b] border-t border-[#d4af37]/20 pt-2">
          <span>HOSTING: ON-PREM OR AIR-GAPPED</span>
          <span className="font-semibold text-[#8c6b1b] dark:text-[#dfba5f]">100% CLIENT CODE OWNERSHIP</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Chapter 5: A Sovereign Invitation // Technological Continuum
  // ---------------------------------------------------------------------------
  return (
    <div className="relative h-48 rounded-xl overflow-hidden bg-[#faf8f4] dark:bg-[#0f1722] border border-[#d4af37]/30 p-4 flex flex-col justify-between group-hover:border-[#d4af37]/60 transition-all duration-300">
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #b38322 1px, transparent 1px), linear-gradient(to bottom, #b38322 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative flex items-center justify-between text-[10px] font-mono tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
          FIG 05 // CONTINUUM GATEWAY &amp; PARTNERSHIP
        </span>
        <span className="text-[9px] px-2 py-0.5 rounded border border-[#d4af37]/30 bg-[#d4af37]/10 font-semibold">
          OPEN SPECIFICATION
        </span>
      </div>

      {/* Vector Schematic: Converging Harmonic Vectors */}
      <div className="relative h-24 flex items-center justify-center">
        <svg viewBox="0 0 200 80" className="w-full h-full max-w-[240px]">
          {/* Pathway 1 */}
          <line x1="25" y1="20" x2="85" y2="40" stroke="currentColor" strokeWidth="1" className="text-[#14284b] dark:text-[#93b4e2]" />
          <circle cx="25" cy="20" r="3" className="fill-[#14284b] dark:fill-[#93b4e2]" />
          <text x="25" y="14" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">PRODUCTS</text>

          {/* Pathway 2 */}
          <line x1="25" y1="60" x2="85" y2="40" stroke="currentColor" strokeWidth="1" className="text-[#9a532e]" />
          <circle cx="25" cy="60" r="3" className="fill-[#9a532e]" />
          <text x="25" y="72" textAnchor="middle" className="text-[5px] font-mono fill-[#64748b]">SERVICES</text>

          {/* Convergence Monogram Ring */}
          <circle cx="100" cy="40" r="15" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" className="text-[#c59b27]" />
          <text x="100" y="43" textAnchor="middle" className="text-[7px] font-serif font-bold fill-[#8c6b1b] dark:fill-[#e5c468]">HENU</text>

          {/* Radiating Beacon */}
          <line x1="115" y1="40" x2="175" y2="40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 2" className="text-[#c59b27]" />
          <polygon points="175,37 182,40 175,43" className="fill-[#c59b27]" />
          <text x="160" y="34" textAnchor="middle" className="text-[5px] font-mono fill-[#8c6b1b] dark:fill-[#e5c468] font-bold">SOVEREIGN ECOSYSTEM</text>
        </svg>
      </div>

      <div className="relative flex items-center justify-between font-mono text-[9px] text-[#64748b] border-t border-[#d4af37]/20 pt-2">
        <span>FRAMEWORK: OPEN ARCHITECTURAL DIALOGUE</span>
        <span className="font-semibold text-[#8c6b1b] dark:text-[#dfba5f]">BUILT FOR ENDURANCE</span>
      </div>
    </div>
  );
}

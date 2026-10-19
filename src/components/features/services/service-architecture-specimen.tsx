"use client";

import React from "react";

interface ServiceArchitectureSpecimenProps {
  serviceSlug: string;
  categorySlug?: string;
  serviceName?: string;
}

export function ServiceArchitectureSpecimen({
  serviceSlug,
  categorySlug = "build",
  serviceName = "Architectural Service",
}: ServiceArchitectureSpecimenProps) {
  // ---------------------------------------------------------------------------
  // 1. WEBSITE DEVELOPMENT (Build Pillar)
  // Sub-Second Edge Topology & DOM Specification Frame
  // ---------------------------------------------------------------------------
  if (serviceSlug === "website-development") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border border-slate-700/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        {/* Subtle Engineering Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-wider text-amber-400">
              SPEC // EDGE RUNTIME TOPOLOGY
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            <span className="text-emerald-400 font-bold">TTFB: 22ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">P99: 60FPS</span>
          </div>
        </div>

        {/* Visual Architectural Diagram: Edge Request Flow */}
        <div className="relative py-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between">
            <span>Client &rarr; Edge &rarr; Streamed Component Pipeline</span>
            <span className="text-amber-400 font-bold">SSR STREAMING</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
            {/* Node 1 */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-cyan-500/30 flex flex-col items-center justify-center space-y-1.5 transition-transform group-hover:-translate-y-0.5">
              <span className="font-mono text-[9px] text-cyan-400 font-semibold uppercase">Client Ingress</span>
              <span className="font-serif text-sm font-medium text-white">Browser Hit</span>
              <span className="text-[10px] font-mono text-slate-400">&lt;18KB Gzip Bundle</span>
            </div>

            {/* Node 2 */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/40 flex flex-col items-center justify-center space-y-1.5 shadow-sm shadow-amber-500/10 transition-transform group-hover:-translate-y-0.5">
              <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase">Cloudflare Edge</span>
              <span className="font-serif text-sm font-medium text-white">Worker ISR Cache</span>
              <span className="text-[10px] font-mono text-emerald-400">Zero Cold Start</span>
            </div>

            {/* Node 3 */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-cyan-500/30 flex flex-col items-center justify-center space-y-1.5 transition-transform group-hover:-translate-y-0.5">
              <span className="font-mono text-[9px] text-cyan-400 font-semibold uppercase">Next.js Engine</span>
              <span className="font-serif text-sm font-medium text-white">React Server Comp</span>
              <span className="text-[10px] font-mono text-slate-400">Hydration Zero Tax</span>
            </div>
          </div>
        </div>

        {/* Core Web Vitals Ledger */}
        <div className="relative pt-4 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase">LCP (Paint)</div>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">0.38s</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase">CLS (Layout)</div>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">0.000</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Accessibility</div>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">100/100</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3">
            <span>GOVERNANCE: WCAG 2.2 AA COMPLIANT</span>
            <span className="text-amber-400 font-semibold">100% OWNED SOURCE</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. MOBILE APP DEVELOPMENT (Build Pillar)
  // Dual-Platform Device Blueprint & Offline State Machine
  // ---------------------------------------------------------------------------
  if (serviceSlug === "mobile-app-development") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border border-slate-700/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-amber-400">
              SPEC // DUAL RUNTIME & PERSISTENCE
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            <span className="text-emerald-400 font-bold">60FPS UI THREAD</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">OFFLINE RESILIENT</span>
          </div>
        </div>

        {/* Visual Device Cross-Section */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="w-full max-w-sm p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">TARGET TARGETING</span>
              <span className="text-emerald-400 font-bold">iOS Native + Android NDK</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-700/60 text-xs">
                <span className="text-slate-300 font-mono">Gesture & Layout Engine</span>
                <span className="text-amber-400 font-mono text-[11px] font-bold">JSI Direct Memory Bus</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-emerald-500/40 text-xs shadow-xs shadow-emerald-500/10">
                <span className="text-slate-300 font-mono">Offline Storage Layer</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">Encrypted SQLite DB</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-700/60 text-xs">
                <span className="text-slate-300 font-mono">Sync Reconciliation</span>
                <span className="text-cyan-400 font-mono text-[11px] font-bold">CRDT State Merging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Micro-metrics */}
        <div className="relative pt-4 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Battery Overhead</div>
              <div className="text-sm font-bold text-emerald-400">&lt;1.2% / hr</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Cold Launch</div>
              <div className="text-sm font-bold text-cyan-400">&lt;650ms</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Security</div>
              <div className="text-sm font-bold text-amber-400">Biometric IPC</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3">
            <span>APP STORE & PLAY STORE READY</span>
            <span className="text-amber-400 font-semibold">ZERO RUNTIME TRACKERS</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. SOFTWARE SOLUTIONS (Build Pillar)
  // Sovereign Microservice Topology & Relational Engine
  // ---------------------------------------------------------------------------
  if (serviceSlug === "software-solutions") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border border-slate-700/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f59e0b 1px, transparent 1px), linear-gradient(to bottom, #f59e0b 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-amber-400">
              SPEC // SOVEREIGN ENTERPRISE STACK
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
            <span className="text-amber-400 font-bold">ZERO SAAS TAX</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">ACID TRANSACTIONS</span>
          </div>
        </div>

        {/* Topology Diagram */}
        <div className="relative py-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                Boundary Firewall & Auth
              </span>
              <p className="text-xs font-mono text-slate-300">mTLS Handshake + Granular RBAC</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Zero External Leaks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-cyan-400 font-semibold uppercase">Microservices</span>
              <p className="text-white font-medium text-xs">High-Throughput Go/Node</p>
              <p className="text-[10px] text-slate-400">&gt;20,000 req/sec per node</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">Relational Core</span>
              <p className="text-white font-medium text-xs">PostgreSQL Cluster</p>
              <p className="text-[10px] text-slate-400">Immutable Audit Logs</p>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative pt-4 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Licensing</div>
              <div className="text-sm font-bold text-amber-400">$0 / Seat</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">Deployment</div>
              <div className="text-sm font-bold text-emerald-400">On-Prem / Cloud</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase">IP Ownership</div>
              <div className="text-sm font-bold text-cyan-400">100% Client</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3">
            <span>DOCKER & KUBERNETES CONTAINERIZED</span>
            <span className="text-amber-400 font-semibold">SOVEREIGN ARCHITECTURE</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. AI AUTOMATION (Intelligence Pillar)
  // Deterministic Agent Pipeline & Schema Validation DAG
  // ---------------------------------------------------------------------------
  if (serviceSlug === "ai-automation") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121024] to-[#1c1836] text-slate-100 border border-indigo-500/40 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-indigo-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-wider text-indigo-300">
              SPEC // DETERMINISTIC AGENT DAG
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-700/50">
            <span className="text-emerald-400 font-bold">SCHEMA ENFORCED</span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-300">0% RETENTION</span>
          </div>
        </div>

        {/* Structured DAG Pipeline */}
        <div className="relative py-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-5 h-5 rounded-full bg-indigo-600/60 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">1</span>
            <div className="flex-1 p-2 rounded bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-between">
              <span className="text-slate-300">Context Sanitization</span>
              <span className="text-emerald-400 text-[10px]">Zero PII Leakage</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-5 h-5 rounded-full bg-indigo-600/60 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">2</span>
            <div className="flex-1 p-2 rounded bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-between">
              <span className="text-slate-300">Vector Retrieval (RAG)</span>
              <span className="text-cyan-300 text-[10px]">Local Embeddings</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-5 h-5 rounded-full bg-purple-600/70 border border-purple-400 flex items-center justify-center text-[10px] font-bold text-white">3</span>
            <div className="flex-1 p-2 rounded bg-indigo-900/40 border border-purple-500/50 flex items-center justify-between shadow-xs shadow-purple-500/20">
              <span className="text-amber-200 font-semibold">Strict JSON Schema Gate</span>
              <span className="text-amber-400 text-[10px] font-bold">Auto-Repair Loop</span>
            </div>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="relative pt-4 border-t border-indigo-900/60">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/50">
              <div className="text-[10px] text-slate-400 uppercase">Hallucination SLA</div>
              <div className="text-sm font-bold text-emerald-400">&lt;0.01%</div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/50">
              <div className="text-[10px] text-slate-400 uppercase">Air-Gap Option</div>
              <div className="text-sm font-bold text-cyan-300">Local Weights</div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/50">
              <div className="text-[10px] text-slate-400 uppercase">Audit Trail</div>
              <div className="text-sm font-bold text-indigo-300">100% Traceable</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3">
            <span>MULTI-MODEL AGNOSTIC ORCHESTRATION</span>
            <span className="text-indigo-300 font-semibold">SOVEREIGN AI ENGINE</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. GRAPHIC DESIGN (Brand & Growth Pillar)
  // Typographic Specimen & Tokenized Design Matrix
  // ---------------------------------------------------------------------------
  if (serviceSlug === "graphic-design") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1c1412] to-[#261814] text-amber-50 border border-amber-600/40 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ea580c 1px, transparent 1px), linear-gradient(to bottom, #ea580c 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-amber-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-mono text-xs font-semibold tracking-wider text-amber-400">
              SPEC // TYPOGRAPHIC & TOKEN SYSTEM
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-200/80 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-700/50">
            <span className="text-amber-400 font-bold">RATIO: 1.618 φ</span>
            <span className="text-amber-700">|</span>
            <span className="text-emerald-400">WCAG AAA: 21:1</span>
          </div>
        </div>

        {/* Typographic Specimen & Color Tokens */}
        <div className="relative py-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-700/40 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
              <span>MODULAR SCALE SPECIMEN</span>
              <span>GEORGIA SERIF / INTER / JETBRAINS</span>
            </div>
            <div className="font-serif text-2xl font-normal text-amber-100 tracking-tight">
              Dignity & Architectural Authority
            </div>
            <div className="font-sans text-xs text-amber-200/70 leading-relaxed">
              Geometric hierarchy engineered for enduring institutions, eliminating superficial design trends.
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="h-8 rounded bg-[#1c1412] border border-amber-700/60 flex items-center justify-center font-mono text-[9px] text-amber-300">
              #1C1412
            </div>
            <div className="h-8 rounded bg-[#9A3412] flex items-center justify-center font-mono text-[9px] text-white font-bold">
              #9A3412
            </div>
            <div className="h-8 rounded bg-[#D97706] flex items-center justify-center font-mono text-[9px] text-slate-950 font-bold">
              #D97706
            </div>
            <div className="h-8 rounded bg-[#FEF3C7] flex items-center justify-center font-mono text-[9px] text-amber-950 font-bold">
              #FEF3C7
            </div>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="relative pt-4 border-t border-amber-900/60">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40">
              <div className="text-[10px] text-amber-400/80 uppercase">Asset Delivery</div>
              <div className="text-sm font-bold text-amber-200">100% Vector SVG</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40">
              <div className="text-[10px] text-amber-400/80 uppercase">Brand Manual</div>
              <div className="text-sm font-bold text-emerald-400">Comprehensive</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40">
              <div className="text-[10px] text-amber-400/80 uppercase">Design Tokens</div>
              <div className="text-sm font-bold text-amber-300">W3C Compliant</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-300/80 pt-3">
            <span>FULL COMMERCIAL IP TRANSFER</span>
            <span className="text-amber-400 font-semibold">ZERO TREND DEPRECIATION</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. DIGITAL MARKETING & SEO (Brand & Growth Pillar)
  // First-Party Technical SEO & Intent Attribution Engine
  // ---------------------------------------------------------------------------
  if (serviceSlug === "digital-marketing") {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121624] to-[#161c30] text-slate-100 border border-blue-500/40 shadow-2xl p-5 sm:p-6 flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Header Bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-amber-400">
              SPEC // TECHNICAL SEO & GRAPH
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-700/50">
            <span className="text-emerald-400 font-bold">100% CRAWLABLE</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">FIRST-PARTY</span>
          </div>
        </div>

        {/* Structured Schema Graph Inspector */}
        <div className="relative py-4 space-y-2.5">
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-blue-300">
              <span>JSON-LD SCHEMA ENTITY GRAPH</span>
              <span className="text-emerald-400">Verified by Google Search Console</span>
            </div>
            <p className="font-mono text-xs text-white">
              {"{ \"@type\": \"ProfessionalService\", \"areaServed\": \"Global\" }"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40">
              <span className="text-[10px] text-slate-400 block">Crawl Index Ratio</span>
              <span className="text-emerald-400 font-bold text-sm">99.8% Indexed</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40">
              <span className="text-[10px] text-slate-400 block">Analytics Bus</span>
              <span className="text-cyan-300 font-bold text-sm">Cookie-less Telemetry</span>
            </div>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="relative pt-4 border-t border-blue-900/60">
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/50">
              <div className="text-[10px] text-slate-400 uppercase">Third-Party Cookies</div>
              <div className="text-sm font-bold text-emerald-400">Zero (0)</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/50">
              <div className="text-[10px] text-slate-400 uppercase">Conversion Intent</div>
              <div className="text-sm font-bold text-amber-400">B2B Qualified</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/50">
              <div className="text-[10px] text-slate-400 uppercase">GDPR / CCPA</div>
              <div className="text-sm font-bold text-cyan-300">100% Compliant</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3">
            <span>PERMANENT ORGANIC DISCOVERY ENGINE</span>
            <span className="text-amber-400 font-semibold">ZERO AD-SPEND RENT</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Fallback for any other custom service
  // ---------------------------------------------------------------------------
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border border-slate-700/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="font-mono text-xs font-semibold text-amber-400">
          SPEC // ARCHITECTURAL BLUEPRINT
        </span>
        <span className="text-xs font-mono text-emerald-400">ACTIVE STANDARD</span>
      </div>
      <div className="py-6 text-center space-y-2">
        <h4 className="font-serif text-lg text-white">{serviceName}</h4>
        <p className="font-mono text-xs text-slate-400">
          Tailored engineering specifications with strict SLA, deterministic type safety, and direct IP ownership.
        </p>
      </div>
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
        <span>ENGINEERING ARCHITECTURE</span>
        <span className="text-amber-400">VERIFIED SPEC</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ServicesHeroSettings } from "@/server/repositories/service.repository";

interface ServicesHeroVisualProps {
  media: ServicesHeroSettings;
}

export function ServicesHeroVisual({ media }: ServicesHeroVisualProps) {
  const [activeTab, setActiveTab] = useState<"build" | "intelligence" | "brand">("intelligence");
  const hasCustomMedia = Boolean(media.media_url && media.media_url.trim().length > 0);

  // 1. Custom Admin-Configured Video
  if (hasCustomMedia && media.media_type === "video") {
    return (
      <div className="relative group w-full">
        {/* Living Ambient Glow Backdrop */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-amber-500/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

        <div className="relative rounded-2xl border border-border-default bg-surface-secondary shadow-elevated overflow-hidden">
          {/* Top Telemetry Header */}
          <div className="px-4 py-2.5 bg-surface-primary/90 border-b border-border-default/60 flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-2 text-ink-primary font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{media.badge_label || "ENGINEERING STREAM"}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
              HD MEDIA
            </span>
          </div>

          {/* Responsive Video Container */}
          <div className="relative aspect-video w-full bg-black/90">
            <video
              src={media.media_url}
              poster={media.poster_url || undefined}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          </div>

          {(media.headline || media.description) && (
            <div className="p-3.5 bg-surface-primary/80 border-t border-border-default/40 font-mono text-xs text-ink-secondary">
              {media.headline && <div className="font-semibold text-ink-primary">{media.headline}</div>}
              {media.description && <div className="text-[11px] text-ink-muted mt-0.5">{media.description}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Custom Admin-Configured Image
  if (hasCustomMedia && media.media_type === "image") {
    return (
      <div className="relative group w-full">
        {/* Living Ambient Glow Backdrop */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-amber-500/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

        <div className="relative rounded-2xl border border-border-default bg-surface-secondary shadow-elevated overflow-hidden">
          {/* Top Telemetry Header */}
          <div className="px-4 py-2.5 bg-surface-primary/90 border-b border-border-default/60 flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-2 text-ink-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>{media.badge_label || "CAPABILITY VISUAL"}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
              VERIFIED ASSET
            </span>
          </div>

          {/* Image Container */}
          <div className="relative aspect-video sm:aspect-[16/10] w-full bg-surface-tertiary">
            <Image
              src={media.media_url}
              alt={media.headline || "HENU Services Architecture Visual"}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {(media.headline || media.description) && (
            <div className="p-3.5 bg-surface-primary/80 border-t border-border-default/40 font-mono text-xs text-ink-secondary">
              {media.headline && <div className="font-semibold text-ink-primary">{media.headline}</div>}
              {media.description && <div className="text-[11px] text-ink-muted mt-0.5">{media.description}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Default Interactive Architecture & Systems Lab Module
  return (
    <div className="relative group w-full">
      {/* Ambient Gradient Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-amber-500/20 blur-xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

      <div className="relative rounded-2xl border border-border-default/90 bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-primary p-5 sm:p-6 shadow-elevated font-mono space-y-4 overflow-hidden">
        {/* Subtle Drafting Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Header Telemetry */}
        <div className="relative flex justify-between items-center pb-3 border-b border-border-default/60 text-[11px]">
          <span className="font-bold text-ink-primary flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>ARCHITECTURE // LAB V2.6</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
            ACTIVE KERNEL
          </span>
        </div>

        {/* 3 Interactive Pillar Selectors */}
        <div className="relative grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-surface-tertiary/70 border border-border-default/50 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("build")}
            className={`py-1.5 px-2 rounded font-semibold transition-all ${
              activeTab === "build"
                ? "bg-surface-primary text-emerald-700 dark:text-emerald-400 shadow-xs border border-border-default/80"
                : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            01 BUILD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("intelligence")}
            className={`py-1.5 px-2 rounded font-semibold transition-all ${
              activeTab === "intelligence"
                ? "bg-surface-primary text-indigo-700 dark:text-indigo-400 shadow-xs border border-border-default/80"
                : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            02 INTEL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brand")}
            className={`py-1.5 px-2 rounded font-semibold transition-all ${
              activeTab === "brand"
                ? "bg-surface-primary text-amber-700 dark:text-amber-400 shadow-xs border border-border-default/80"
                : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            03 BRAND
          </button>
        </div>

        {/* Dynamic Pillar Content */}
        <div className="relative rounded-xl border border-border-default/60 bg-surface-primary/90 p-4 space-y-3 min-h-[140px]">
          {activeTab === "build" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">BUILD KERNEL</span>
                <span className="text-[10px] text-ink-muted">TYPE-SAFE ARCHITECTURE</span>
              </div>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Full-stack web engineering, native cross-platform runtimes, and distributed software solutions designed for zero-latency execution.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-default/40">
                <span>STATUS: OPERATIONAL</span>
                <span className="text-emerald-600 font-semibold font-mono">100% AUDITED</span>
              </div>
            </div>
          )}

          {activeTab === "intelligence" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-700 dark:text-indigo-400">SOVEREIGN AI</span>
                <span className="text-[10px] text-ink-muted">MULTI-AGENT PROTOCOL</span>
              </div>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Autonomous agent orchestration, localized inference engines, and enterprise process automation with zero third-party telemetry.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-default/40">
                <span>LATENCY: &lt; 48ms</span>
                <span className="text-indigo-600 font-semibold font-mono">AIR-GAPPED READY</span>
              </div>
            </div>
          )}

          {activeTab === "brand" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">BRAND &amp; DESIGN</span>
                <span className="text-[10px] text-ink-muted">VECTOR PRECISION</span>
              </div>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Technical identity systems, design engineering, and digital growth infrastructure tailored for ambitious engineering ventures.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-ink-muted border-t border-border-default/40">
                <span>SYSTEM: COHESIVE</span>
                <span className="text-amber-600 font-semibold font-mono">DURABLE ASSETS</span>
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Telemetry Ribbon */}
        <div className="relative pt-1 flex items-center justify-between text-[10px] text-ink-muted">
          <span>PILLARS: 3 ACTIVE</span>
          <span className="text-ink-primary font-mono font-semibold">ZERO CONSULTING THEATER</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { AboutChapter } from "@/types/domain";

interface StoryChapterItem {
  id: string;
  number: string;
  tabLabel: string;
  tag: string;
  title: string;
  summary: string;
  ecosystemAnchor: string;
  architecturalPillar: string;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

const DEFAULT_STORY_CHAPTERS: StoryChapterItem[] = [
  {
    id: "henu-os",
    number: "01",
    tabLabel: "HENU OS",
    tag: "FOUNDATION // OPERATING SYSTEM",
    title: "HENU OS — The Sovereign Operating Foundation",
    summary:
      "Engineered from the hardware layer up to eliminate forced vendor surveillance, background telemetry, and fragile cloud dependencies. HENU OS provides an enduring, hardened computing foundation designed for high-agency developers, institutions, and secure workstations.",
    ecosystemAnchor: "HENU OS Base Layer",
    architecturalPillar: "Zero Third-Party Telemetry & Isolated Memory",
    buttonLabel: "Explore HENU OS →",
    buttonUrl: "/products/henu-os",
  },
  {
    id: "henu-ai",
    number: "02",
    tabLabel: "HENU AI",
    tag: "COGNITION // AIR-GAPPED REASONING",
    title: "HENU AI — Private Local Neural Intelligence",
    summary:
      "Machine intelligence that executes entirely on local silicon. Synthesize documents, execute deep neural reasoning, and automate proprietary workflows without sending confidential enterprise prompts to external third-party cloud servers.",
    ecosystemAnchor: "HENU AI Neural Acceleration Engine",
    architecturalPillar: "Air-Gapped Training & Offline Inference",
    buttonLabel: "Discover HENU AI →",
    buttonUrl: "/products/henu-ai",
  },
  {
    id: "henu-pa",
    number: "03",
    tabLabel: "HENU PA",
    tag: "ORCHESTRATION // SYSTEM TASK AGENT",
    title: "HENU PA — Autonomous Personal Assistant",
    summary:
      "An ultra-low latency system daemon that turns operator intent into autonomous execution. Coordinates cross-application workflows, file transformations, and system actions over private Unix domain sockets with zero cloud dependencies.",
    ecosystemAnchor: "HENU PA System Daemon",
    architecturalPillar: "Auditable IPC & Sovereign Permissions",
    buttonLabel: "Meet HENU PA →",
    buttonUrl: "/products/henu-pa",
  },
  {
    id: "henu-ide",
    number: "04",
    tabLabel: "HENU IDE",
    tag: "WORKSPACE // SUB-FRAME LATENCY",
    title: "HENU IDE — Distraction-Free Developer Workspace",
    summary:
      "Built for developers who value speed, precision, and focus. A keyboard-driven, sub-frame latency development environment paired with sovereign language toolchains, designed to run cleanly for decades without subscription lock-in.",
    ecosystemAnchor: "HENU IDE & Wayland Shell",
    architecturalPillar: "Sub-Frame Latency & Sovereign Toolchains",
    buttonLabel: "Explore HENU IDE →",
    buttonUrl: "/products/henu-ide",
  },
];

interface EcosystemStoryVisualizerProps {
  chapters?: AboutChapter[];
}

export function EcosystemStoryVisualizer({ chapters }: EcosystemStoryVisualizerProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);

  // Map incoming database chapters from Admin Panel or fall back to default products
  const displayChapters: StoryChapterItem[] =
    chapters && chapters.length > 0
      ? chapters.map((ch, idx) => {
          let tab = ch.title;
          if (tab.includes("—")) {
            tab = tab.split("—")[0]!.trim();
          } else if (tab.includes("-")) {
            tab = tab.split("-")[0]!.trim();
          }
          return {
            id: ch.id,
            number: ch.chapter_number || `0${idx + 1}`,
            tabLabel: tab,
            tag: ch.subtitle || "SOVEREIGN PRODUCT // ARCHITECTURE",
            title: ch.title,
            summary: ch.content,
            ecosystemAnchor: ch.ecosystem_anchor || "Sovereign Foundation Layer",
            architecturalPillar: ch.architectural_pillar || "Deterministic Integrity & Local Execution",
            buttonLabel: ch.button_label || "Explore Product →",
            buttonUrl: ch.button_url || "/products",
          };
        })
      : DEFAULT_STORY_CHAPTERS;

  const activeChapter = displayChapters[activeChapterIndex] ?? displayChapters[0]!;

  // Detect WebGL capability & reduced motion preferences
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIs3DSupported(false);
      }
    } catch {
      setIs3DSupported(false);
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // 3D Canvas Rendering (Champagne Gold & Deep Prussian Navy Precision Projection)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !is3DSupported) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 360;
    const height = 360;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let isRunning = true;

    // Node layers for isometric octahedral projection
    const layers = [
      { yOffset: -55, radius: 45, rings: 1, color: "#d4af37" },
      { yOffset: -18, radius: 75, rings: 2, color: "#c59b27" },
      { yOffset: 20, radius: 90, rings: 3, color: "#9a7b1c" },
      { yOffset: 60, radius: 50, rings: 2, color: "#6b5413" },
    ];

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Update rotation speed (subtle idle spin, faster on interaction)
      if (!isReducedMotion) {
        rotationRef.current += isInteracting ? 0.025 : 0.008;
      }
      const rot = rotationRef.current;

      // Draw subtle isometric grid foundation
      ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
      ctx.lineWidth = 1;
      const gridSize = 140;
      const gridStep = 28;

      ctx.save();
      ctx.translate(cx, cy + 40);
      for (let x = -gridSize; x <= gridSize; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x * 0.7, x * 0.35 - gridSize * 0.35);
        ctx.lineTo(x * 0.7, x * 0.35 + gridSize * 0.35);
        ctx.stroke();
      }
      for (let y = -gridSize; y <= gridSize; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(-gridSize * 0.7, y * 0.35 - gridSize * 0.35);
        ctx.lineTo(gridSize * 0.7, y * 0.35 + gridSize * 0.35);
        ctx.stroke();
      }
      ctx.restore();

      // Render 3D Sovereign Wireframe Octahedron
      layers.forEach((layer, idx) => {
        const isCurrentActive = idx === activeChapterIndex % 4;
        const yPos = cy + layer.yOffset;

        ctx.save();
        ctx.translate(cx, yPos);

        // Orbital rings
        for (let r = 1; r <= layer.rings; r++) {
          const rx = layer.radius * (r / layer.rings);
          const ry = rx * 0.38;

          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, rot * 0.2, 0, Math.PI * 2);
          ctx.strokeStyle = isCurrentActive
            ? "#c59b27"
            : "rgba(212, 175, 55, 0.22)";
          ctx.lineWidth = isCurrentActive ? 2 : 1;
          ctx.stroke();

          // Satellite tracking node
          if (isCurrentActive && r === layer.rings) {
            const nodeAngle = rot * 1.5;
            const nx = Math.cos(nodeAngle) * rx;
            const ny = Math.sin(nodeAngle) * ry;

            ctx.fillStyle = "#c59b27";
            ctx.beginPath();
            ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      // Central crystalline diamond core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot * 0.5);

      const dSize = 34 + Math.sin(rot * 2) * 2;
      ctx.beginPath();
      ctx.moveTo(0, -dSize);
      ctx.lineTo(dSize * 0.7, 0);
      ctx.lineTo(0, dSize);
      ctx.lineTo(-dSize * 0.7, 0);
      ctx.closePath();

      ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#c59b27";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -dSize);
      ctx.lineTo(0, dSize);
      ctx.moveTo(-dSize * 0.7, 0);
      ctx.lineTo(dSize * 0.7, 0);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.stroke();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeChapterIndex, is3DSupported, isReducedMotion, isInteracting]);

  return (
    <div
      role="region"
      aria-label="HENU Sovereign Product & Architecture Story Visualizer"
      className="relative rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#f4eee2] dark:from-[#0d1624] dark:via-[#0b131e] dark:to-[#08101a] p-6 sm:p-10 shadow-elevated overflow-hidden"
    >
      {/* Decorative Golden Archival Corner Accents */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#d4af37]/25 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] font-semibold px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
              CHRONICLE 2026.1
            </span>
            <span className="font-mono text-xs text-ink-muted">Sovereign Architecture Instrument</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#122238] dark:text-[#edf2f7] font-normal tracking-tight">
            Ecosystem Evolution & Architectural Pillars
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#8c6b1b] dark:text-[#dfba5f] font-semibold px-2.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c59b27] animate-pulse" />
            3D ISOMETRIC PROJECTION
          </span>
        </div>
      </div>

      {/* Main Visualizer Body: Split 5/7 Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Interactive 3D Canvas Projection (5 Cols) */}
        <div
          className="lg:col-span-5 relative flex flex-col items-center justify-center p-4 rounded-xl border border-[#d4af37]/20 bg-surface-secondary/50 dark:bg-[#070d14]/70"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-ink-muted mb-2 px-2">
            <span>PROJECTION // PERSPECTIVE</span>
            <span className="text-[#8c6b1b] dark:text-[#dfba5f]">
              LAYER {activeChapter.number} / 04
            </span>
          </div>

          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
            {is3DSupported ? (
              <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
                style={{ width: "100%", height: "100%" }}
                aria-label={`Visual isometric 3D representation of ${activeChapter.title}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 border border-dashed border-[#d4af37]/40 rounded-lg">
                <span className="font-mono text-xs text-[#8c6b1b]">STATIC SCHEMATIC</span>
                <p className="font-sans text-xs text-ink-muted">
                  3D hardware acceleration unavailable. Fallback vector layer active.
                </p>
              </div>
            )}
          </div>

          <div className="w-full text-center mt-3 pt-2 border-t border-[#d4af37]/15">
            <p className="font-mono text-[10px] text-ink-muted max-w-xs mx-auto">
              Asset Protocol Verification: Zero cloud pingbacks. Deterministic vector mathematics rendering strictly in local memory.
            </p>
          </div>
        </div>

        {/* Right: Chapter Content & Navigation Controls (7 Cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-8 bg-surface-primary/60 dark:bg-[#0f1722]/60 rounded-xl border border-[#d4af37]/20">
          <div className="space-y-6">
            {/* Step Selector Pills with Product Name & Number */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ecosystem Story Chapters">
              {displayChapters.map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                const cleanLabel = ch.tabLabel.replace(/^HENU\s+/i, "");
                return (
                  <button
                    key={ch.id}
                    role="tab"
                    id={`chapter-tab-${idx}`}
                    aria-selected={isSelected}
                    aria-controls={`chapter-panel-${idx}`}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                      isSelected
                        ? "bg-[#c59b27] text-white dark:text-[#0c1420] border-[#c59b27] font-bold shadow-subtle"
                        : "bg-surface-secondary text-ink-secondary border-border-default hover:border-[#d4af37]/50 hover:text-ink-primary"
                    }`}
                  >
                    {`${ch.number} // ${cleanLabel.toUpperCase()}`}
                  </button>
                );
              })}
            </div>

            {/* Active Chapter Details */}
            <div
              id={`chapter-panel-${activeChapterIndex}`}
              role="tabpanel"
              aria-labelledby={`chapter-tab-${activeChapterIndex}`}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block font-semibold">
                  {activeChapter.tag}
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#122238] dark:text-[#edf2f7] font-normal leading-snug">
                  {activeChapter.title}
                </h4>
              </div>

              <p className="font-sans text-base text-ink-secondary leading-relaxed">
                {activeChapter.summary}
              </p>

              <div className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-[#111927] border border-[#d4af37]/20 font-mono text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Ecosystem Anchor:</span>
                  <span className="text-[#122238] dark:text-[#93b4e2] font-semibold">{activeChapter.ecosystemAnchor}</span>
                </div>
                <div className="flex items-center justify-between text-ink-muted pt-1 border-t border-[#d4af37]/15">
                  <span>Architectural Pillar:</span>
                  <span className="text-[#8c6b1b] dark:text-[#dfba5f] font-semibold">{activeChapter.architecturalPillar}</span>
                </div>
              </div>

              {/* Dynamic Action Button Connected to Admin Panel */}
              {activeChapter.buttonUrl && (
                <div className="pt-3">
                  <Link
                    href={activeChapter.buttonUrl}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#dfba5f] text-[#0c1420] hover:brightness-110 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>{activeChapter.buttonLabel || "Explore Product"}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Buttons with Champagne Gold Styling */}
          <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
            <button
              type="button"
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-lg font-mono text-xs border border-[#d4af37]/30 bg-surface-secondary text-ink-primary hover:border-[#d4af37]/60 hover:text-[#8c6b1b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous Product
            </button>

            <span className="font-mono text-xs text-[#8c6b1b] dark:text-[#dfba5f] font-semibold">
              {activeChapterIndex + 1} of {displayChapters.length}
            </span>

            <button
              type="button"
              disabled={activeChapterIndex === displayChapters.length - 1}
              onClick={() => setActiveChapterIndex((prev) => Math.min(displayChapters.length - 1, prev + 1))}
              className="px-4 py-2 rounded-lg font-mono text-xs border border-[#d4af37]/30 bg-surface-secondary text-ink-primary hover:border-[#d4af37]/60 hover:text-[#8c6b1b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next Product &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

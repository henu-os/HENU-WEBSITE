"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface StoryChapter {
  id: string;
  number: string;
  tag: string;
  title: string;
  summary: string;
  ecosystemAnchor: string;
  architecturalPillar: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "kernel",
    number: "01",
    tag: "FOUNDATION // HARDWARE",
    title: "Sovereign Kernel & System Isolation",
    summary:
      "HENU systems originate at the lowest deterministic layer. By eliminating non-auditable blobs and vendor telemetry at boot, the kernel establishes a verifiable trust boundary before userland initialization.",
    ecosystemAnchor: "HENU OS Base Layer",
    architecturalPillar: "Zero Third-Party Telemetry & Isolated Memory",
  },
  {
    id: "intelligence",
    number: "02",
    tag: "COGNITION // LOCAL MODELS",
    title: "Local-First Neural Architectures",
    summary:
      "Machine intelligence must serve the operator, not external surveillance platforms. HENU AI pipelines are engineered for deterministic local execution, strict memory boundaries, and private knowledge synthesis.",
    ecosystemAnchor: "HENU AI Private Engine",
    architecturalPillar: "Air-Gapped Training & Offline Inference",
  },
  {
    id: "orchestration",
    number: "03",
    tag: "PROTOCOL // IPC BUS",
    title: "Deterministic Agent Orchestration",
    summary:
      "Agents operate over private Unix domain sockets rather than cloud relay servers. HENU PA interprets voice, files, and multi-step tasks with instant hardware interrupt latency and auditable access logs.",
    ecosystemAnchor: "HENU PA System Daemon",
    architecturalPillar: "Auditable IPC & Sovereign Permissions",
  },
  {
    id: "workspace",
    number: "04",
    tag: "EXPERIENCE // WAYLAND SHELL",
    title: "Minimalist High-DPI Workspaces",
    summary:
      "The visual interface is an extension of engineering thought. A keyboard-driven, sub-frame latency Wayland compositor pairs with HENU IDE to provide zero-distraction focus for mission-critical software creation.",
    ecosystemAnchor: "HENU IDE & Shell",
    architecturalPillar: "Sub-Frame Latency & Keyboard Flow",
  },
];

export function EcosystemStoryVisualizer() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);

  const activeChapter = STORY_CHAPTERS[activeChapterIndex] ?? STORY_CHAPTERS[0]!;

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

  // 3D Canvas Rendering (Progressive Isometric Vector Projection)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !is3DSupported) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Rotation increment (only if motion is allowed and not actively dragged)
      if (!isReducedMotion && !isInteracting) {
        rotationRef.current += 0.008;
      }

      const rot = rotationRef.current;
      const chapterFactor = (activeChapterIndex + 1) * 0.5;

      // Draw background coordinate grid lines
      ctx.strokeStyle = "rgba(42, 63, 50, 0.12)";
      ctx.lineWidth = 1;
      for (let i = -150; i <= 150; i += 30) {
        ctx.beginPath();
        ctx.moveTo(cx + i, cy - 120);
        ctx.lineTo(cx + i, cy + 120);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 150, cy + i);
        ctx.lineTo(cx + 150, cy + i);
        ctx.stroke();
      }

      // Draw 3D Orbiting Ecosystem Rings
      const ringRadii = [60, 95, 130];
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.45, (rot * 0.5 * (idx % 2 === 0 ? 1 : -1)), 0, Math.PI * 2);
        ctx.strokeStyle =
          idx === activeChapterIndex
            ? "rgba(42, 63, 50, 0.85)"
            : "rgba(42, 63, 50, 0.25)";
        ctx.lineWidth = idx === activeChapterIndex ? 2 : 1;
        ctx.stroke();
      });

      // Central Sovereign Monolith (Isometric Polyhedron)
      const size = 32 + chapterFactor * 4;
      const h = 48 + chapterFactor * 6;

      const pTop = { x: cx, y: cy - h + Math.sin(rot) * 5 };
      const pBottom = { x: cx, y: cy + h * 0.5 };
      const pLeft = { x: cx - size * Math.cos(rot), y: cy - size * 0.3 * Math.sin(rot) };
      const pRight = { x: cx + size * Math.cos(rot), y: cy + size * 0.3 * Math.sin(rot) };

      // Left face
      ctx.fillStyle = "rgba(42, 63, 50, 0.15)";
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pLeft.x, pLeft.y);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(42, 63, 50, 0.6)";
      ctx.stroke();

      // Right face
      ctx.fillStyle = "rgba(42, 63, 50, 0.28)";
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(42, 63, 50, 0.75)";
      ctx.stroke();

      // Orbiting Node indicator for Active Chapter
      const nodeAngle = rot * 1.5 + (activeChapterIndex * Math.PI) / 2;
      const nodeDist = ringRadii[Math.min(activeChapterIndex, ringRadii.length - 1)] ?? 100;
      const nx = cx + nodeDist * Math.cos(nodeAngle);
      const ny = cy + nodeDist * 0.45 * Math.sin(nodeAngle);

      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(42, 63, 50, 1)";
      ctx.fill();

      // Connect node to central apex
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "rgba(42, 63, 50, 0.5)";
      ctx.stroke();
      ctx.setLineDash([]);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [is3DSupported, isReducedMotion, isInteracting, activeChapterIndex]);

  return (
    <div className="rounded-2xl border border-border-default bg-surface-primary overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="p-6 md:p-8 border-b border-border-default bg-surface-secondary/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              ABOUT-003 STORYTELLING
            </Badge>
            <span className="font-mono text-xs text-ink-muted">Ecosystem Architecture Visualizer</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink-primary">
            Ecosystem Evolution &amp; Architectural Pillars
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {is3DSupported ? (
            <Badge variant="success" size="sm" className="font-mono text-[10px]">
              3D Vector Projection
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              Static Blueprint Mode
            </Badge>
          )}
          {isReducedMotion && (
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              Motion Reduced
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border-default">
        {/* Left: Interactive 3D Perspective or Accessible Blueprint Fallback (5 Cols) */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col items-center justify-between bg-surface-secondary/20 relative">
          <div className="w-full flex items-center justify-between font-mono text-[11px] text-ink-muted mb-4">
            <span className="uppercase tracking-wider">Projection // Perspective</span>
            <span>Layer {activeChapter.number} / 04</span>
          </div>

          {/* Interactive / Progressive Canvas */}
          <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
            {is3DSupported ? (
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl bg-surface-primary border border-border-subtle shadow-xs"
                onMouseDown={() => setIsInteracting(true)}
                onMouseUp={() => setIsInteracting(false)}
                onMouseLeave={() => setIsInteracting(false)}
                role="img"
                aria-label={`3D architectural projection for ${activeChapter.title}`}
              />
            ) : (
              /* Accessible Static Blueprint Fallback */
              <div
                role="img"
                aria-label={`Static architectural diagram for ${activeChapter.title}`}
                className="w-full h-full rounded-xl bg-surface-primary border border-border-default p-6 flex flex-col justify-center items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full border-2 border-accent-pine/40 flex items-center justify-center font-mono font-bold text-accent-pine text-lg">
                  {activeChapter.number}
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    Static Blueprint
                  </span>
                  <p className="font-display font-bold text-ink-primary text-sm">
                    {activeChapter.ecosystemAnchor}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 w-full text-center space-y-1">
            <span className="font-mono text-[11px] text-ink-muted block">
              Asset Protocol Disclosure:
            </span>
            <p className="font-mono text-[10px] text-ink-secondary leading-normal">
              GLB asset gateway active. Running deterministic vector projection while hardware CAD assets undergo cryptographic verification.
            </p>
          </div>
        </div>

        {/* Right: Chapter Content & Navigation Controls (7 Cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Step Selector Pills */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ecosystem Story Chapters">
              {STORY_CHAPTERS.map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    role="tab"
                    id={`chapter-tab-${idx}`}
                    aria-selected={isSelected}
                    aria-controls={`chapter-panel-${idx}`}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                      isSelected
                        ? "bg-accent-pine text-surface-primary border-accent-pine font-bold shadow-xs"
                        : "bg-surface-secondary text-ink-secondary border-border-default hover:border-border-strong hover:text-ink-primary"
                    }`}
                  >
                    {`${ch.number} // ${ch.id.toUpperCase()}`}
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
                <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block font-semibold">
                  {activeChapter.tag}
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal leading-snug">
                  {activeChapter.title}
                </h4>
              </div>

              <p className="font-sans text-base text-ink-secondary leading-relaxed">
                {activeChapter.summary}
              </p>

              <div className="p-4 rounded-xl bg-surface-secondary border border-border-subtle font-mono text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Ecosystem Anchor:</span>
                  <span className="text-ink-primary font-semibold">{activeChapter.ecosystemAnchor}</span>
                </div>
                <div className="flex items-center justify-between text-ink-muted pt-1 border-t border-border-subtle">
                  <span>Architectural Pillar:</span>
                  <span className="text-accent-pine font-semibold">{activeChapter.architecturalPillar}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-border-default flex items-center justify-between">
            <button
              type="button"
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-lg font-mono text-xs border border-border-default bg-surface-secondary text-ink-primary hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous Pillar
            </button>

            <span className="font-mono text-xs text-ink-muted">
              {activeChapterIndex + 1} of {STORY_CHAPTERS.length}
            </span>

            <button
              type="button"
              disabled={activeChapterIndex === STORY_CHAPTERS.length - 1}
              onClick={() => setActiveChapterIndex((prev) => Math.min(STORY_CHAPTERS.length - 1, prev + 1))}
              className="px-4 py-2 rounded-lg font-mono text-xs border border-border-default bg-surface-secondary text-ink-primary hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next Pillar &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

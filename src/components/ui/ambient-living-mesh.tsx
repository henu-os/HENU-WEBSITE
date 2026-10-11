"use client";

import React, { useEffect, useRef } from "react";

interface AmbientLivingMeshProps {
  variant?: "pine" | "violet" | "ember" | "slate" | "spectrum" | "gold" | "cordovan";
  className?: string;
  showGrid?: boolean;
}

const PALETTES = {
  pine: {
    glow: "rgba(14, 68, 59, 0.08)",
    glowStrong: "rgba(14, 68, 59, 0.16)",
    grid: "rgba(14, 68, 59, 0.04)",
  },
  violet: {
    glow: "rgba(63, 32, 158, 0.08)",
    glowStrong: "rgba(63, 32, 158, 0.16)",
    grid: "rgba(63, 32, 158, 0.04)",
  },
  ember: {
    glow: "rgba(160, 64, 28, 0.08)",
    glowStrong: "rgba(160, 64, 28, 0.16)",
    grid: "rgba(160, 64, 28, 0.04)",
  },
  slate: {
    glow: "rgba(28, 28, 26, 0.06)",
    glowStrong: "rgba(14, 68, 59, 0.12)",
    grid: "rgba(28, 28, 26, 0.03)",
  },
  spectrum: {
    glow: "rgba(14, 68, 59, 0.09)",
    glowStrong: "rgba(63, 32, 158, 0.12)",
    grid: "rgba(14, 68, 59, 0.04)",
  },
  gold: {
    glow: "rgba(197, 155, 39, 0.07)",
    glowStrong: "rgba(197, 155, 39, 0.15)",
    grid: "rgba(197, 155, 39, 0.04)",
  },
  cordovan: {
    glow: "rgba(159, 18, 57, 0.07)",
    glowStrong: "rgba(159, 18, 57, 0.14)",
    grid: "rgba(159, 18, 57, 0.035)",
  },
};

/**
 * AmbientLivingMesh:
 * A subtle, hardware-accelerated canvas layer that tracks the pointer smoothly
 * and projects a soft chromatic aura across the paper surface, subtly illuminating
 * architectural grid points so the screen feels alive and responsive.
 */
export function AmbientLivingMesh({
  variant = "pine",
  className = "",
  showGrid = true,
}: AmbientLivingMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const palette = PALETTES[variant] || PALETTES.pine;

    const state = {
      mouseX: -1000,
      mouseY: -1000,
      targetX: -1000,
      targetY: -1000,
      time: 0,
      hasMoved: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      state.targetX = e.clientX - rect.left;
      state.targetY = e.clientY - rect.top;
      state.hasMoved = true;
    };

    const handleMouseLeave = () => {
      state.targetX = -1000;
      state.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      // Default ambient position if not moved
      if (!state.hasMoved) {
        state.targetX = width * 0.7;
        state.targetY = height * 0.3;
        state.mouseX = state.targetX;
        state.mouseY = state.targetY;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    let animId: number | null = null;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      state.time += dt;

      // Smooth lerp pointer tracking
      state.mouseX += (state.targetX - state.mouseX) * 0.08;
      state.mouseY += (state.targetY - state.mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Architectural Grid Points
      if (showGrid) {
        const step = 32;
        ctx.fillStyle = palette.grid;
        for (let x = 16; x < width; x += step) {
          for (let y = 16; y < height; y += step) {
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        }
      }

      // 2. Ambient Slow-Breathing Light Aura
      const breath = Math.sin(state.time * 0.8) * 40;
      const baseRadius = Math.max(width, height) * 0.35 + breath;
      const ambientX = width * 0.85 + Math.cos(state.time * 0.5) * 60;
      const ambientY = height * 0.25 + Math.sin(state.time * 0.5) * 40;

      const ambientGradient = ctx.createRadialGradient(
        ambientX,
        ambientY,
        0,
        ambientX,
        ambientY,
        baseRadius
      );
      ambientGradient.addColorStop(0, palette.glowStrong);
      ambientGradient.addColorStop(0.5, palette.glow);
      ambientGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = ambientGradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Interactive Cursor Spotlight (Gentle, low-contrast aura)
      if (state.mouseX > -500 && state.mouseY > -500) {
        const cursorRadius = 260;
        const cursorGradient = ctx.createRadialGradient(
          state.mouseX,
          state.mouseY,
          0,
          state.mouseX,
          state.mouseY,
          cursorRadius
        );
        cursorGradient.addColorStop(0, palette.glowStrong);
        cursorGradient.addColorStop(0.5, palette.glow);
        cursorGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = cursorGradient;
        ctx.fillRect(0, 0, width, height);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      ro.disconnect();
    };
  }, [variant, showGrid]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-90 transition-opacity duration-700"
      />
    </div>
  );
}

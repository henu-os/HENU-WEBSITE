"use client";

import React, { useRef, useEffect } from "react";
import {
  loadEyeParticles,
  loadDragonTexture,
  renderDragonEyeFrame,
  EyeParticle,
  BurstState,
} from "./dragon-eye-core";

export function FooterAmbientDragonEye() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let particles: EyeParticle[] = [];
    let dragonImg: HTMLImageElement | null = null;
    let isReady = false;

    // Load assets
    Promise.all([loadEyeParticles(), loadDragonTexture()]).then(([pList, dImg]) => {
      particles = pList;
      dragonImg = dImg;
      isReady = true;
    });

    let dragonAngle = 0;
    const mouse = { x: -9999, y: -9999, isOver: false };
    const burst: BurstState = {
      active: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      durationMs: 380,
      returnMs: 550,
    };

    let dpr = 1;
    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    function onPointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isOver = true;
    }
    function onPointerLeave() {
      mouse.isOver = false;
    }
    function onPointerDown(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const dist = Math.hypot(clickX - centerX, clickY - centerY);
      const eyeWidth = Math.max(320, Math.min(rect.width * 0.50, 640));
      if (dist < eyeWidth * 0.45) {
        burst.active = true;
        burst.startX = clickX;
        burst.startY = clickY;
        burst.startTime = performance.now();
      }
    }

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    container.addEventListener("pointerdown", onPointerDown, { passive: true });

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      if (!ctx || !canvas || !container || !isReady) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Centered in footer background covering ~half of the footer with soft ambient opacity
      const centerX = w / 2;
      const centerY = h / 2;
      const eyeWidth = Math.max(320, Math.min(w * 0.50, 640));
      const dragonWidth = eyeWidth * 0.44;

      // Fast & continuous energetic rotation (matching home scroll)
      dragonAngle += 0.085;

      renderDragonEyeFrame({
        ctx,
        timeMs: now,
        particles,
        dragonImg,
        eyeX: centerX,
        eyeY: centerY,
        eyeWidth,
        dragonX: centerX,
        dragonY: centerY,
        dragonWidth,
        dragonAngle,
        mouseX: mouse.isOver ? mouse.x : undefined,
        mouseY: mouse.isOver ? mouse.y : undefined,
        burst: burst.active ? burst : null,
        globalOpacity: 0.16, // Soft, non-intrusive watermark strictly in the background behind text
      });

      if (burst.active && now - burst.startTime > burst.durationMs + burst.returnMs) {
        burst.active = false;
      }
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      if (container) {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointerdown", onPointerDown);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="footer-dragon-eye-anchor"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none z-0"
      />
    </div>
  );
}

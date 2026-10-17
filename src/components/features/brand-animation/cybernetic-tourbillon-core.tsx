"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  loadEyeParticles,
  loadDragonTexture,
  EyeParticle,
  BurstState,
} from "./dragon-eye-core";

interface CyberneticTourbillonCoreProps {
  className?: string;
  onBurstStateChange?: (active: boolean) => void;
}

/**
 * CYBERNETIC TOURBILLON CORE (UNIFIED CONCENTRIC DEPTH)
 *
 * Implements a world-class luxury horological / cybernetic aperture:
 * 1. Unified concentric geometry: The Dragon is permanently anchored as the living core iris of the Void Particle Eye.
 * 2. True 3D spatial depth: Multi-layered parallax (Astrolabe telemetry dial -> Dragon core -> Void particle eye -> Sapphire crystal reticle).
 * 3. Interactive kinetic burst: Click anywhere on the stage to trigger a radial particle supernova that snaps back.
 * 4. Precision performance: Pauses automatically when off-screen via IntersectionObserver.
 */
export function CyberneticTourbillonCore({
  className = "",
  onBurstStateChange,
}: CyberneticTourbillonCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

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
    let isVisible = true;

    // Load brand assets
    Promise.all([loadEyeParticles(), loadDragonTexture()]).then(([pList, dImg]) => {
      particles = pList;
      dragonImg = dImg;
      isReady = true;
    });

    // 3D Parallax Tilt state
    const mouse = {
      x: 0,
      y: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      tiltX: 0,
      tiltY: 0,
      isOver: false,
    };

    // Kinetic Supernova Burst State
    const burst: BurstState = {
      active: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      durationMs: 420,
      returnMs: 600,
    };

    let dragonAngle = 0;
    let lastTime = performance.now();
    let dpr = 1;
    let width = container.clientWidth || 380;
    let height = container.clientHeight || 380;

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    // Pause rendering when scrolled out of view to preserve 100% CPU/GPU performance
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    function onPointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      mouse.x = relX;
      mouse.y = relY;
      mouse.isOver = true;

      // Normalized tilt between -1 and 1
      const cx = width / 2;
      const cy = height / 2;
      mouse.targetTiltX = (relX - cx) / cx;
      mouse.targetTiltY = (relY - cy) / cy;
      setIsInteracting(true);
    }

    function onPointerLeave() {
      mouse.isOver = false;
      mouse.targetTiltX = 0;
      mouse.targetTiltY = 0;
      setIsInteracting(false);
    }

    function triggerBurst(clickX?: number, clickY?: number) {
      const cx = width / 2;
      const cy = height / 2;
      burst.active = true;
      burst.startX = clickX ?? cx;
      burst.startY = clickY ?? cy;
      burst.startTime = performance.now();
      if (onBurstStateChange) onBurstStateChange(true);

      setTimeout(() => {
        burst.active = false;
        if (onBurstStateChange) onBurstStateChange(false);
      }, burst.durationMs + burst.returnMs);
    }

    function onPointerDown(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerBurst(clickX, clickY);
    }

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    container.addEventListener("pointerdown", onPointerDown, { passive: true });

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      if (!ctx || !canvas || !isReady || !isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const t = now * 0.001;

      // Smooth spring interpolation for 3D tilt
      const tiltEase = 0.08;
      mouse.tiltX += (mouse.targetTiltX - mouse.tiltX) * tiltEase;
      mouse.tiltY += (mouse.targetTiltY - mouse.tiltY) * tiltEase;

      // Continuous high-velocity dragon rotation (~5 rad/s)
      dragonAngle += 0.075 + (mouse.isOver ? 0.025 : 0);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const eyeSize = Math.max(220, Math.min(width * 0.88, height * 0.88, 380));
      const dragonSize = eyeSize * 0.44;

      // =========================================================================
      // LAYER 0: AMBIENT SINGULARITY CORE GLOW (Underlay)
      // =========================================================================
      const glowX = cx + mouse.tiltX * 6;
      const glowY = cy + mouse.tiltY * 6;
      const glowPulse = 0.85 + 0.15 * Math.sin(t * 2.4);
      const glowGrad = ctx.createRadialGradient(
        glowX,
        glowY,
        dragonSize * 0.15,
        glowX,
        glowY,
        eyeSize * 0.65
      );
      glowGrad.addColorStop(0, `rgba(168, 85, 247, ${0.28 * glowPulse})`);
      glowGrad.addColorStop(0.45, `rgba(139, 92, 246, ${0.12 * glowPulse})`);
      glowGrad.addColorStop(0.85, "rgba(99, 102, 241, 0.03)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(glowX, glowY, eyeSize * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // =========================================================================
      // LAYER 1: CYBERNETIC ASTROLABE & HOROLOGY GAUGES (Depth Parallax: -14px)
      // =========================================================================
      const astroX = cx + mouse.tiltX * 12;
      const astroY = cy + mouse.tiltY * 12;
      const outerRingR = eyeSize * 0.48;
      const innerRingR = dragonSize * 0.58;

      ctx.save();
      ctx.translate(astroX, astroY);

      // Fine concentric rings
      ctx.strokeStyle = "rgba(168, 85, 247, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, outerRingR, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed orbit counter-rotating
      ctx.save();
      ctx.rotate(-t * 0.12);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.28)";
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.arc(0, 0, outerRingR * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner tourbillon cage ring
      ctx.strokeStyle = "rgba(168, 85, 247, 0.22)";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, innerRingR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Precision Chronometer Tick Marks (60 marks like a watch chronometer)
      ctx.save();
      ctx.rotate(t * 0.04);
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI) / 30;
        const isMajor = i % 5 === 0;
        const tickLen = isMajor ? 6 : 3;
        const r1 = outerRingR - tickLen;
        const r2 = outerRingR;

        ctx.strokeStyle = isMajor
          ? "rgba(192, 132, 252, 0.45)"
          : "rgba(168, 85, 247, 0.16)";
        ctx.lineWidth = isMajor ? 1.2 : 0.8;

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.stroke();
      }
      ctx.restore();

      // Telemetry micro-badge markings
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(192, 132, 252, 0.38)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("HENU CORE // 01", 0, -outerRingR - 11);

      ctx.restore();

      // =========================================================================
      // LAYER 2: THE DRAGON CORE (Depth Parallax: +20px)
      // =========================================================================
      // Permanently concentric with the Eye!
      const dragonX = cx + mouse.tiltX * 20;
      const dragonY = cy + mouse.tiltY * 20;

      if (dragonImg && dragonImg.complete && dragonSize > 4) {
        ctx.save();
        ctx.globalAlpha = 0.96;
        ctx.translate(dragonX, dragonY);
        ctx.rotate(dragonAngle);
        const dHalf = dragonSize / 2;
        ctx.drawImage(dragonImg, -dHalf, -dHalf, dragonSize, dragonSize);
        ctx.restore();
      }

      // =========================================================================
      // LAYER 3: THE VOID PARTICLE EYE APERTURE (Depth Parallax: +30px)
      // =========================================================================
      const eyeX = cx + mouse.tiltX * 30;
      const eyeY = cy + mouse.tiltY * 30;

      if (particles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const numParticles = particles.length;
        const isPointerNear = mouse.isOver;
        const mx = mouse.x;
        const my = mouse.y;
        const repelRadius = eyeSize * 0.24;
        const repelRadiusSq = repelRadius * repelRadius;
        const scaleRatio = eyeSize / 600;

        // Burst calculations
        const burstActive = burst.active;
        let burstPhase = "";
        let burstProgress = 0;
        if (burstActive) {
          const elapsed = now - burst.startTime;
          const totalDuration = burst.durationMs + burst.returnMs;
          if (elapsed < burst.durationMs) {
            burstPhase = "out";
            burstProgress = Math.min(1, Math.max(0, elapsed / burst.durationMs));
          } else if (elapsed < totalDuration) {
            burstPhase = "return";
            burstProgress = Math.min(1, Math.max(0, (elapsed - burst.durationMs) / burst.returnMs));
          }
        }

        const step = eyeSize < 240 ? 2 : 1;
        for (let i = 0; i < numParticles; i += step) {
          const p = particles[i];
          if (!p) continue;

          // Scaled position
          const bx = eyeX + p.nx * eyeSize;
          const by = eyeY + p.ny * eyeSize;

          // Brownian orbital shimmer
          const driftX =
            Math.sin(t * 1.6 * p.speed + p.phase) * (eyeSize * 0.008) +
            Math.cos(t * 0.8 + p.phase * 2) * (eyeSize * 0.004);
          const driftY =
            Math.cos(t * 1.7 * p.speed + p.phase) * (eyeSize * 0.008) +
            Math.sin(t * 1.0 + p.phase * 1.6) * (eyeSize * 0.004);

          let px = bx + driftX;
          let py = by + driftY;

          // Interactive fluid pointer repulsion
          if (isPointerNear) {
            const dx = px - mx;
            const dy = py - my;
            const dSq = dx * dx + dy * dy;
            if (dSq < repelRadiusSq && dSq > 1) {
              const d = Math.sqrt(dSq);
              const push = (1 - d / repelRadius) * (eyeSize * 0.07);
              px += (dx / d) * push;
              py += (dy / d) * push;
            }
          }

          // Kinetic Supernova Burst
          if (burstActive) {
            const bdx = bx - burst.startX;
            const bdy = by - burst.startY;
            const angle = Math.atan2(bdy, bdx) + (p.phase - Math.PI);
            const scatterDist = eyeSize * (0.22 + p.speed * 0.45);

            if (burstPhase === "out") {
              const ease = 1 - Math.pow(1 - burstProgress, 3);
              px += Math.cos(angle) * scatterDist * ease;
              py += Math.sin(angle) * scatterDist * ease;
            } else if (burstPhase === "return") {
              const ease = Math.pow(burstProgress, 2);
              const rem = 1 - ease;
              px += Math.cos(angle) * scatterDist * rem;
              py += Math.sin(angle) * scatterDist * rem;
            }
          }

          // Shimmer alpha
          const twinkle = 0.72 + 0.28 * Math.sin(t * 3.6 + p.phase * 4);
          const alpha = Math.min(1, Math.max(0, p.baseAlpha * twinkle));
          const radius = Math.max(0.65, p.r * scaleRatio);

          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // =========================================================================
      // LAYER 4: SAPPHIRE CRYSTAL RETICLE & HORIZON TICKS (Depth Parallax: +42px)
      // =========================================================================
      const retX = cx + mouse.tiltX * 42;
      const retY = cy + mouse.tiltY * 42;
      const retSize = eyeSize * 0.52;

      ctx.save();
      ctx.translate(retX, retY);
      ctx.strokeStyle = "rgba(216, 180, 254, 0.22)";
      ctx.lineWidth = 1;

      // 4 Cardinal Precision Crosshair Ticks
      const crossR1 = retSize * 0.94;
      const crossR2 = retSize * 1.04;
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      for (const a of angles) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * crossR1, Math.sin(a) * crossR1);
        ctx.lineTo(Math.cos(a) * crossR2, Math.sin(a) * crossR2);
        ctx.stroke();
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onBurstStateChange]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none overflow-hidden ${className}`}
      title="HENU Cybernetic Tourbillon — Click core to trigger kinetic shockwave"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
}

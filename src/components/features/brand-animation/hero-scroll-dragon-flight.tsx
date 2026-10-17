"use client";

import React, { useRef, useEffect } from "react";
import {
  loadEyeParticles,
  loadDragonTexture,
  EyeParticle,
  BurstState,
} from "./dragon-eye-core";

interface WakeSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Particle3DVector {
  dirX: number;
  dirY: number;
  dirZ: number;
  speed: number;
}

/**
 * HERO SCROLL DRAGON FLIGHT (3D PERSPECTIVE SPLINE & VOLUMETRIC SCATTER)
 *
 * 1. At Hero (Scroll = 0px): Anchored inside the Hero Stage with precision astrolabe dial and concentric depth.
 * 2. On Scroll Down (15px -> 740px):
 *    - The particles break free from the box and expand across the overall viewport in 3D depth!
 *    - The Dragon surges forward along the Z-axis (towards viewer in 3D), banking and swooping across the page.
 *    - Emits a luminous violet particle contrail wake along its flight path.
 *    - Dives down into the Ecosystem section and seamlessly dissolves.
 * 3. When scroll > 850px: Completely clears and sleeps (0% CPU, 0% GPU).
 * 4. On scroll back up: Smoothly rewinds and re-docks into the Hero Stage.
 */
export function HeroScrollDragonFlight() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let particles: EyeParticle[] = [];
    let particleVectors: Particle3DVector[] = [];
    let dragonImg: HTMLImageElement | null = null;
    let isReady = false;

    // Load assets
    Promise.all([loadEyeParticles(), loadDragonTexture()]).then(([pList, dImg]) => {
      particles = pList;
      dragonImg = dImg;

      // Pre-compute 3D random scatter vectors on a sphere
      particleVectors = pList.map(() => {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random());
        const sinPhi = Math.sin(phi);
        return {
          dirX: r * sinPhi * Math.cos(theta),
          dirY: r * sinPhi * Math.sin(theta),
          dirZ: (r * Math.cos(phi) - 0.25) * 1.3, // forward depth bias
          speed: 0.6 + Math.random() * 0.8,
        };
      });

      isReady = true;
    });

    // Viewport & DPR
    let dpr = 1;
    let winW = window.innerWidth;
    let winH = window.innerHeight;

    function resize() {
      if (!canvas) return;
      winW = window.innerWidth;
      winH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(winW * dpr);
      canvas.height = Math.round(winH * dpr);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Smooth scroll interpolation (inertial spring lerp)
    let currentScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    function onScroll() {
      currentScrollY = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // Interactive pointer for hero hover tilt
    const mouse = {
      x: winW * 0.72,
      y: 350,
      tiltX: 0,
      tiltY: 0,
    };

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Click burst state inside hero anchor
    const burst: BurstState = {
      active: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      durationMs: 380,
      returnMs: 550,
    };

    function onAnchorClick(e: MouseEvent) {
      burst.active = true;
      burst.startX = e.clientX;
      burst.startY = e.clientY;
      burst.startTime = performance.now();
    }

    const heroAnchorEl = document.getElementById("hero-dragon-eye-anchor");
    if (heroAnchorEl) {
      heroAnchorEl.addEventListener("click", onAnchorClick);
    }

    // Dragon wake sparks array
    const wakeSparks: WakeSpark[] = [];
    let dragonAngle = 0;
    let lastTime = performance.now();

    // 3D Cubic Bézier interpolation: [x, y, z]
    function bezier3D(
      p0: [number, number, number],
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      t: number
    ): [number, number, number] {
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;

      const x = mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0];
      const y = mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1];
      const z = mt3 * p0[2] + 3 * mt2 * t * p1[2] + 3 * mt * t2 * p2[2] + t3 * p3[2];
      return [x, y, z];
    }

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      if (!ctx || !canvas || !isReady) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const tSec = now * 0.001;

      // 1. Inertial Smooth Scroll Lerp (fluid 60-120 FPS)
      const rawDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity = scrollVelocity * 0.82 + rawDelta * 0.18;
      smoothScrollY += (currentScrollY - smoothScrollY) * 0.14;

      // SLEEP CHECK: If scrolled well past the hero transition zone (> 860px),
      // sleep with 0 drawing calculations to preserve 100% performance for lower pages.
      if (smoothScrollY > 860 && currentScrollY > 860) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, winW, winH);

      // 2. Locate Hero Anchor
      const heroAnchor = document.getElementById("hero-dragon-eye-anchor");
      const heroRect = heroAnchor ? heroAnchor.getBoundingClientRect() : null;

      const heroCenterX = heroRect ? heroRect.left + heroRect.width / 2 : winW * 0.72;
      const heroCenterY = heroRect ? heroRect.top + heroRect.height / 2 : 350;
      const heroBaseSize = heroRect ? Math.max(220, Math.min(heroRect.width * 0.86, 380)) : 340;

      // Flight Progress T in [0, 1] across scroll 15px -> 740px
      const FLIGHT_START_SCROLL = 15;
      const FLIGHT_END_SCROLL = 720;
      const flightT = Math.min(
        1,
        Math.max(0, (smoothScrollY - FLIGHT_START_SCROLL) / (FLIGHT_END_SCROLL - FLIGHT_START_SCROLL))
      );

      // Mouse tilt calculation when near hero
      if (heroRect && flightT < 0.1) {
        const targetTiltX = Math.max(-1, Math.min(1, (mouse.x - heroCenterX) / 200));
        const targetTiltY = Math.max(-1, Math.min(1, (mouse.y - heroCenterY) / 200));
        mouse.tiltX += (targetTiltX - mouse.tiltX) * 0.08;
        mouse.tiltY += (targetTiltY - mouse.tiltY) * 0.08;
      } else {
        mouse.tiltX += (0 - mouse.tiltX) * 0.08;
        mouse.tiltY += (0 - mouse.tiltY) * 0.08;
      }

      // Fast rotation
      dragonAngle += 0.075 + Math.abs(scrollVelocity) * 0.006;

      // =========================================================================
      // 3D DRAGON FLIGHT TRAJECTORY (Spline path from Hero -> Screen Forward -> Ecosystem)
      // =========================================================================
      const isMobile = winW < 768;

      // 3D Control Points: [X, Y, Z] (Positive Z = closer to camera in 3D perspective)
      const p0: [number, number, number] = [
        heroCenterX + mouse.tiltX * 18,
        heroCenterY + mouse.tiltY * 18,
        0,
      ];
      const p1: [number, number, number] = [
        winW * (isMobile ? 0.6 : 0.58),
        winH * 0.32,
        220, // Surges forward towards camera in 3D
      ];
      const p2: [number, number, number] = [
        winW * (isMobile ? 0.38 : 0.34),
        winH * 0.52,
        140, // Banks across screen
      ];
      const p3: [number, number, number] = [
        winW * 0.5,
        winH * 0.88,
        -180, // Dives down into ecosystem depth
      ];

      const [cur3dX, cur3dY, cur3dZ] = bezier3D(p0, p1, p2, p3, flightT);

      // 3D Perspective Projection Camera
      const FOCAL_LENGTH = 520;
      const projScale = FOCAL_LENGTH / Math.max(80, FOCAL_LENGTH - cur3dZ);
      const screenDragonX = cur3dX;
      const screenDragonY = cur3dY;

      // Size scales with 3D Z-depth
      const baseDragonSize = heroBaseSize * 0.44;
      const renderedDragonWidth = baseDragonSize * projScale;

      // 3D Banking & Roll Angle
      const bankAngle =
        Math.sin(flightT * Math.PI) * (isMobile ? 0.28 : 0.42) +
        Math.max(-0.25, Math.min(0.25, scrollVelocity * 0.015));

      // Global Fade Out at end of transition (0.82 -> 1.0)
      const fadeOut = flightT > 0.82 ? Math.max(0, 1 - (flightT - 0.82) / 0.18) : 1;

      // =========================================================================
      // ASTROLABE HOROLOGY DIAL (Visible in Hero, fades during breakout)
      // =========================================================================
      if (flightT < 0.2 && heroRect) {
        const dialAlpha = (1 - flightT / 0.2) * 0.35;
        const outerR = heroBaseSize * 0.48;

        ctx.save();
        ctx.translate(heroCenterX + mouse.tiltX * 10, heroCenterY + mouse.tiltY * 10);
        ctx.strokeStyle = `rgba(168, 85, 247, ${dialAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, outerR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.rotate(-tSec * 0.12);
        ctx.setLineDash([3, 7]);
        ctx.strokeStyle = `rgba(192, 132, 252, ${dialAlpha * 1.4})`;
        ctx.beginPath();
        ctx.arc(0, 0, outerR * 0.82, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // =========================================================================
      // WAKE SPARK GENERATOR (Contrail behind flying dragon)
      // =========================================================================
      if (flightT > 0.04 && flightT < 0.95 && fadeOut > 0.05) {
        const sparksPerFrame = Math.min(4, Math.max(1, Math.round(1 + Math.abs(scrollVelocity) * 0.2)));
        for (let s = 0; s < sparksPerFrame; s++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkSpeed = 20 + Math.random() * 50;
          wakeSparks.push({
            x: screenDragonX + (Math.random() - 0.5) * renderedDragonWidth * 0.4,
            y: screenDragonY + (Math.random() - 0.5) * renderedDragonWidth * 0.4,
            vx: Math.cos(sparkAngle) * sparkSpeed,
            vy: Math.sin(sparkAngle) * sparkSpeed - scrollVelocity * 2,
            r: 1.2 + Math.random() * 2.2,
            alpha: 0.85,
            life: 0,
            maxLife: 0.35 + Math.random() * 0.3,
            color: Math.random() > 0.3 ? "#c084fc" : "#a855f7",
          });
        }
      }

      // Render wake sparks
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = wakeSparks.length - 1; i >= 0; i--) {
        const sp = wakeSparks[i];
        if (!sp) continue;
        sp.life += dt;
        if (sp.life >= sp.maxLife) {
          wakeSparks.splice(i, 1);
          continue;
        }
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        const sparkAlpha = (1 - sp.life / sp.maxLife) * sp.alpha * fadeOut;
        ctx.globalAlpha = sparkAlpha;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // =========================================================================
      // VOLUMETRIC 3D PARTICLE EYE SCATTER ACROSS OVERALL PAGE
      // =========================================================================
      const numParticles = particles.length;
      if (numParticles > 0 && fadeOut > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Expansion curve: cubic ease-out
        const scatterEase = 1 - Math.pow(1 - flightT, 2.8);
        const maxSpreadX = winW * (isMobile ? 0.65 : 0.85);
        const maxSpreadY = winH * (isMobile ? 0.65 : 0.85);
        const maxSpreadZ = 450;

        const baseEyeSize = heroBaseSize;
        const eyeCenterX = heroCenterX + (cur3dX - heroCenterX) * (flightT * 0.65) + mouse.tiltX * 24;
        const eyeCenterY = heroCenterY + (cur3dY - heroCenterY) * (flightT * 0.65) + mouse.tiltY * 24;

        // Check burst status
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
          } else {
            burst.active = false;
          }
        }

        const step = isMobile ? 3 : flightT > 0.1 ? 2 : 1;

        for (let i = 0; i < numParticles; i += step) {
          const p = particles[i];
          const v = particleVectors[i];
          if (!p || !v) continue;

          // 3D coordinates relative to center
          const bx = p.nx * baseEyeSize;
          const by = p.ny * baseEyeSize;

          // Scatter outward along 3D random vector
          const sx = bx + v.dirX * maxSpreadX * scatterEase * v.speed;
          const sy = by + v.dirY * maxSpreadY * scatterEase * v.speed;
          const sz = v.dirZ * maxSpreadZ * scatterEase * v.speed;

          // Brownian orbital drift
          const driftX = Math.sin(tSec * 1.5 * p.speed + p.phase) * (baseEyeSize * 0.007);
          const driftY = Math.cos(tSec * 1.6 * p.speed + p.phase) * (baseEyeSize * 0.007);

          // Perspective project particle
          const pScale = FOCAL_LENGTH / Math.max(80, FOCAL_LENGTH - sz);
          let px = eyeCenterX + (sx + driftX) * pScale;
          let py = eyeCenterY + (sy + driftY) * pScale;

          // Interactive burst effect (if clicked while at rest in hero)
          if (burstActive) {
            const bdx = px - burst.startX;
            const bdy = py - burst.startY;
            const angle = Math.atan2(bdy, bdx) + (p.phase - Math.PI);
            const scatterDist = baseEyeSize * (0.2 + p.speed * 0.4);

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

          // Alpha fade
          const twinkle = 0.72 + 0.28 * Math.sin(tSec * 3.5 + p.phase * 4);
          const pAlpha = p.baseAlpha * twinkle * fadeOut * (1 - flightT * 0.42);

          if (pAlpha <= 0.02) continue;

          ctx.globalAlpha = Math.min(1, Math.max(0, pAlpha));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, p.r * pScale * (1 + flightT * 0.5)), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // =========================================================================
      // RENDER 3D FLYING DRAGON CORE
      // =========================================================================
      if (dragonImg && dragonImg.complete && renderedDragonWidth > 4 && fadeOut > 0.02) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, Math.max(0, 0.96 * fadeOut));
        ctx.translate(screenDragonX, screenDragonY);

        // Banking in 3D: Combine fast spin + roll angle
        ctx.rotate(dragonAngle + bankAngle);

        // Core glow aura when flying
        if (flightT > 0.05) {
          const auraGrad = ctx.createRadialGradient(
            0,
            0,
            renderedDragonWidth * 0.2,
            0,
            0,
            renderedDragonWidth * 0.95
          );
          auraGrad.addColorStop(0, "rgba(192, 132, 252, 0.35)");
          auraGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.18)");
          auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, renderedDragonWidth * 0.95, 0, Math.PI * 2);
          ctx.fill();
        }

        const dHalf = renderedDragonWidth / 2;
        ctx.drawImage(dragonImg, -dHalf, -dHalf, renderedDragonWidth, renderedDragonWidth);
        ctx.restore();
      }
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (heroAnchorEl) {
        heroAnchorEl.removeEventListener("click", onAnchorClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      aria-hidden="true"
    />
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import {
  loadEyeParticles,
  loadDragonTexture,
  renderDragonEyeFrame,
  EyeParticle,
  BurstState,
} from "./dragon-eye-core";

export function HomeScrollDragonEye() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: EyeParticle[] = [];
    let dragonImg: HTMLImageElement | null = null;
    let isReady = false;

    // Load assets
    Promise.all([loadEyeParticles(), loadDragonTexture()]).then(([pList, dImg]) => {
      particles = pList;
      dragonImg = dImg;
      isReady = true;
    });

    // Initial Positions in Hero
    const eye = { x: window.innerWidth * 0.72, y: 350, width: 390 };
    const dragon = { x: window.innerWidth * 0.72, y: 350, width: 170, angle: 0 };
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, isOver: false };
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
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isOver = true;
    }
    function onPointerLeave() {
      mouse.isOver = false;
    }
    function onPointerDown(e: PointerEvent) {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const distToEye = Math.hypot(clickX - eye.x, clickY - eye.y);
      if (distToEye < Math.max(35, eye.width * 0.45)) {
        burst.active = true;
        burst.startX = clickX;
        burst.startY = clickY;
        burst.startTime = performance.now();
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastTime = performance.now();

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      if (!ctx || !canvas || !isReady) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Track scroll velocity for kinetic lead and dragon lag
      const currentScrollY = window.scrollY;
      const rawScrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity = scrollVelocity * 0.85 + rawScrollDelta * 0.15;

      // Clear viewport canvas
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Locate Anchor Elements
      const heroAnchor = document.getElementById("hero-dragon-eye-anchor");
      const footerAnchor = document.getElementById("footer-dragon-eye-anchor");

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isMobile = winW < 768;

      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docHeight - winH);
      const scrollProgress = Math.min(1, Math.max(0, currentScrollY / maxScroll));

      // Small compact size outside the hero box:
      // "AS LIKE THE SIZE OF LOGO IN NAVBAR.. NOT THAT SMALL LITTLE BIT LARGER THAN THAT BUT STILL THAT KIND OF SMALL."
      // Navbar logo is ~44px. Floating size is ~86px on desktop, ~68px on mobile!
      const compactFloatingSize = isMobile ? 68 : 88;

      let targetX = winW * 0.72;
      let targetY = winH * 0.48;
      let targetEyeWidth = compactFloatingSize;
      let targetOpacity = 0.96;

      const heroRect = heroAnchor ? heroAnchor.getBoundingClientRect() : null;
      const footerRect = footerAnchor ? footerAnchor.getBoundingClientRect() : null;

      // 1. HERO DOCKED STATE (In the hero card under SYSTEM IDLE)
      if (heroRect && currentScrollY < 80) {
        const heroCenterX = heroRect.left + heroRect.width / 2;
        const heroCenterY = heroRect.top + heroRect.height / 2;
        const heroSize = Math.max(260, Math.min(heroRect.width * 0.88, 390));

        // When starting to scroll (0 to 80px), shrink rapidly from heroSize down to compact floating size
        const leaveT = Math.min(1, Math.max(0, currentScrollY / 80));
        targetEyeWidth = heroSize + (compactFloatingSize - heroSize) * leaveT;

        targetX = heroCenterX;
        targetY = heroCenterY;
        targetOpacity = 1;

        if (mouse.isOver && leaveT < 0.2) {
          targetX += (mouse.x - heroCenterX) * 0.08;
          targetY += (mouse.y - heroCenterY) * 0.08;
        }
      }
      // 2. FOOTER APPROACH & DOCKING (When footer enters the viewport)
      else if (footerRect && footerRect.top < winH) {
        // As the footer enters the viewport, immediately fade out the floating canvas!
        // This ensures the floating canvas NEVER overlaps with the footer text or creates a duplicate eye.
        // The dedicated FooterAmbientDragonEye canvas inside the footer at z-0 handles the background watermark!
        const footerEnterDistance = winH - footerRect.top;
        const fadeOutT = Math.min(1, Math.max(0, footerEnterDistance / 180));
        targetOpacity = 0.96 * (1 - fadeOutT);

        const footerCenterX = footerRect.left + footerRect.width / 2;
        const footerCenterY = footerRect.top + footerRect.height / 2;
        targetX = footerCenterX;
        targetY = footerCenterY;
        targetEyeWidth = compactFloatingSize;
      }
      // 3. MID-PAGE SERPENTINE ZIG-ZAG TRAVEL STATE (While scrolling & reading)
      else {
        // ZIG-ZAG MOTION:
        // Sweeps left and right down the page in an S-curve:
        // Hero (Right) -> Ecosystem (Left) -> Stack (Right) -> Services (Left) -> Center
        const waveCycles = 3.2;
        const wave = Math.sin(scrollProgress * Math.PI * waveCycles);

        const maxAmplitude = isMobile ? winW * 0.18 : winW * 0.28;
        const zigZagOffset = wave * maxAmplitude;

        targetX = winW * 0.5 + zigZagOffset;
        targetY = winH * 0.48;
        targetEyeWidth = compactFloatingSize;
        targetOpacity = 0.95;

        // Keep safe margin from viewport edges
        const safeMargin = isMobile ? 55 : 85;
        targetX = Math.max(safeMargin, Math.min(winW - safeMargin, targetX));

        // Interactive cursor steer while reading
        if (mouse.isOver) {
          targetX += (mouse.x - winW / 2) * 0.08;
          targetY += (mouse.y - winH / 2) * 0.06;
        }
      }

      // KINETIC LEAD PHYSICS:
      // The Eye outline is WAY AHEAD of the dragon during scroll!
      // Lead ahead along the scroll velocity vector by up to 90px–130px
      const leadY = Math.max(-120, Math.min(120, scrollVelocity * 5.0));
      const eyeTargetY = targetY + (currentScrollY > 80 ? leadY : 0);

      const eyeEase = 0.14;
      eye.x += (targetX - eye.x) * eyeEase;
      eye.y += (eyeTargetY - eye.y) * eyeEase;
      eye.width += (targetEyeWidth - eye.width) * eyeEase;

      // DRAGON TRAILS BEHIND THE EYE WITH VISIBLE GAP:
      const dx = eye.x - dragon.x;
      const dy = eye.y - dragon.y;
      const dist = Math.hypot(dx, dy);

      // Trailing lag factor:
      // Lower lag (0.034) while moving so the dragon visibly chases behind the eye,
      // accelerating smoothly if distance becomes large so it stays in sight.
      const baseLag = 0.034;
      const catchUpBoost = Math.min(dist * 0.0006, 0.12);
      const dragonLag = baseLag + catchUpBoost;

      dragon.x += dx * dragonLag;
      dragon.y += dy * dragonLag;

      const targetDragonWidth = eye.width * 0.44;
      dragon.width += (targetDragonWidth - dragon.width) * dragonLag;

      // FAST & CONTINUOUS DRAGON ROTATION:
      // High-speed rotation (~0.085 rad/frame, ~5.1 rad/sec, full spin every ~1.2s!)
      // No sluggishness, energetic, fast and continuous!
      const baseRotSpeed = 0.085;
      const kineticRotSpeed = Math.min(dist * 0.00025, 0.04);
      dragon.angle += (baseRotSpeed + kineticRotSpeed);

      // Render only if opacity is above threshold
      if (targetOpacity > 0.01) {
        renderDragonEyeFrame({
          ctx,
          timeMs: now,
          particles,
          dragonImg,
          eyeX: eye.x,
          eyeY: eye.y,
          eyeWidth: eye.width,
          dragonX: dragon.x,
          dragonY: dragon.y,
          dragonWidth: dragon.width,
          dragonAngle: dragon.angle,
          mouseX: mouse.isOver ? mouse.x : undefined,
          mouseY: mouse.isOver ? mouse.y : undefined,
          burst: burst.active ? burst : null,
          globalOpacity: targetOpacity,
        });
      }

      if (burst.active && now - burst.startTime > burst.durationMs + burst.returnMs) {
        burst.active = false;
      }
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 h-full w-full"
    />
  );
}

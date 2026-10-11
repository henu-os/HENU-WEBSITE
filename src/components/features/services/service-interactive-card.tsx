"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Service } from "@/types/domain";
import { Badge } from "@/components/ui/badge";

interface ServiceInteractiveCardProps {
  service: Service;
  className?: string;
}

interface CanvasPointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isHovered: boolean;
  opacity: number;
  time: number;
}

export function ServiceInteractiveCard({ service, className = "" }: ServiceInteractiveCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetry, setTelemetry] = useState<string>("// STANDBY");
  const [isHovered, setIsHovered] = useState(false);

  // Store animation reference & state
  const stateRef = useRef<CanvasPointerState>({
    x: 150,
    y: 100,
    targetX: 150,
    targetY: 100,
    isHovered: false,
    opacity: 0,
    time: 0,
  });

  const animFrameRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    stateRef.current.targetX = x;
    stateRef.current.targetY = y;

    // Update live telemetry readout based on discipline
    const normX = Math.round((x / rect.width) * 100);
    const normY = Math.round((y / rect.height) * 100);

    const slug = service.slug.toLowerCase();
    if (slug.includes("web")) {
      setTelemetry(`VIEWPORT: ${Math.round(x)}×${Math.round(y)}px // DOM: 0.18ms`);
    } else if (slug.includes("ai")) {
      setTelemetry(`INFERENCE: NODE_${(Math.floor(x / 40) % 5) + 1} // 4.8k TOK/s`);
    } else if (slug.includes("graphic")) {
      setTelemetry(`BEZIER: κ 0.552 // TANGENT: ${Math.round((x / rect.width) * 360)}°`);
    } else if (slug.includes("mobile")) {
      setTelemetry(`TOUCH: [${normX}%, ${normY}%] // 60FPS STABLE`);
    } else if (slug.includes("doc")) {
      setTelemetry(`SPEC_TREE // SHA-256:${((Math.round(x * y * 13) % 999999) + 100000).toString(16)}`);
    } else if (slug.includes("marketing")) {
      setTelemetry(`DISCOVERY RADAR // SPECTRUM: +${normX + 200}%`);
    } else {
      setTelemetry(`KERNEL: [X:${Math.round(x)}, Y:${Math.round(y)}] // SLA: 99.99%`);
    }
  }, [service.slug]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    stateRef.current.isHovered = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    stateRef.current.isHovered = false;
    setTelemetry("// STANDBY");
  }, []);

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
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const slug = service.slug.toLowerCase();

    // Specific generative render routines per discipline
    const renderWebsiteDev = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Architectural Browser / DOM Wireframe Engine
      const time = st.time;
      const mx = st.x;
      const my = st.y;

      // 1. Subtle blueprint layout grid
      c.strokeStyle = "rgba(14, 68, 59, 0.08)";
      c.lineWidth = 1;
      const step = 24;
      for (let gx = 0; gx < w; gx += step) {
        c.beginPath();
        c.moveTo(gx, 0);
        c.lineTo(gx, h);
        c.stroke();
      }
      for (let gy = 0; gy < h; gy += step) {
        c.beginPath();
        c.moveTo(0, gy);
        c.lineTo(w, gy);
        c.stroke();
      }

      // 2. Blueprint Window Frame Outline (Top-right corner aesthetic)
      const frameX = w * 0.35;
      const frameY = 16;
      const frameW = w * 0.6;
      const frameH = h * 0.75;

      c.strokeStyle = "rgba(14, 68, 59, 0.22)";
      c.lineWidth = 1.2;
      c.strokeRect(frameX, frameY, frameW, frameH);

      // Window Header Bar with 3 minimal dots
      c.fillStyle = "rgba(14, 68, 59, 0.06)";
      c.fillRect(frameX, frameY, frameW, 16);

      const dotX = frameX + 8;
      const dotY = frameY + 8;
      c.fillStyle = "rgba(14, 68, 59, 0.35)";
      c.beginPath();
      c.arc(dotX, dotY, 2, 0, Math.PI * 2);
      c.arc(dotX + 6, dotY, 2, 0, Math.PI * 2);
      c.arc(dotX + 12, dotY, 2, 0, Math.PI * 2);
      c.fill();

      // Dynamic Flex Columns reacting to mouse X
      const splitRatio = 0.25 + (mx / w) * 0.15; // smooth flex ratio
      const sidebarW = frameW * splitRatio;
      const contentW = frameW - sidebarW;

      // Sidebar wireframe box
      c.fillStyle = "rgba(14, 68, 59, 0.04)";
      c.fillRect(frameX, frameY + 16, sidebarW, frameH - 16);
      c.strokeStyle = "rgba(14, 68, 59, 0.15)";
      c.strokeRect(frameX, frameY + 16, sidebarW, frameH - 16);

      // Content Cards inside window
      const cardY1 = frameY + 24;
      const cardH1 = (frameH - 36) * 0.45;
      c.fillStyle = "rgba(14, 68, 59, 0.07)";
      c.fillRect(frameX + sidebarW + 8, cardY1, contentW - 16, cardH1);
      c.strokeRect(frameX + sidebarW + 8, cardY1, contentW - 16, cardH1);

      // DOM hierarchy tree tag lines
      c.font = "9px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(14, 68, 59, 0.4)";
      c.fillText("<header.hero>", frameX + sidebarW + 12, cardY1 + 14);
      c.fillText(`<main flex: ${splitRatio.toFixed(2)}>`, frameX + 6, frameY + 32);

      // 3. Interactive Inspector Crosshair & Coordinates aligned to Cursor
      c.strokeStyle = "rgba(14, 68, 59, 0.35)";
      c.setLineDash([3, 3]);
      c.beginPath();
      c.moveTo(mx, 0);
      c.lineTo(mx, h);
      c.moveTo(0, my);
      c.lineTo(w, my);
      c.stroke();
      c.setLineDash([]);

      // Inspection Highlight Target Box around cursor
      c.fillStyle = "rgba(14, 68, 59, 0.08)";
      c.fillRect(mx - 18, my - 12, 36, 24);
      c.strokeStyle = "rgba(14, 68, 59, 0.5)";
      c.strokeRect(mx - 18, my - 12, 36, 24);

      // Micro inspection badge
      c.fillStyle = "rgba(14, 68, 59, 0.75)";
      c.fillText(`DIV ${Math.round(mx)}×${Math.round(my)}`, mx + 22, my + 4);

      // Live animated typewriter cursor in corner
      const blink = Math.sin(time * 6) > 0;
      if (blink) {
        c.fillStyle = "#0e443b";
        c.fillRect(frameX + sidebarW + 12, cardY1 + 24, 6, 2);
      }
    };

    const renderAiAutomation = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Reactive Directed Acyclic Graph (DAG) & Neural Data Pipeline
      const time = st.time;
      const mx = st.x;
      const my = st.y;

      // 5 Pipeline Nodes
      const nodes = [
        { label: "INGEST", x: w * 0.18, y: h * 0.35 },
        { label: "EMBED", x: w * 0.42, y: h * 0.22 },
        { label: "REASON", x: w * 0.72, y: h * 0.28 },
        { label: "GUARD", x: w * 0.48, y: h * 0.65 },
        { label: "DISPATCH", x: w * 0.85, y: h * 0.72 },
      ];

      // Connections between nodes (Directed Graph)
      const connections: Array<[number, number]> = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ];

      // Draw connecting bezier curves with magnetic attraction toward mouse
      connections.forEach(([fromIdx, toIdx]) => {
        const from = nodes[fromIdx];
        const to = nodes[toIdx];
        if (!from || !to) return;

        // Midpoint pulled slightly toward cursor
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const pullDist = Math.hypot(mx - midX, my - midY);
        const pullFactor = Math.max(0, 1 - pullDist / 180) * 24;
        const angle = Math.atan2(my - midY, mx - midX);
        const ctrlX = midX + Math.cos(angle) * pullFactor;
        const ctrlY = midY + Math.sin(angle) * pullFactor;

        // Path stroke
        c.strokeStyle = "rgba(63, 32, 158, 0.18)";
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(from.x, from.y);
        c.quadraticCurveTo(ctrlX, ctrlY, to.x, to.y);
        c.stroke();

        // Traveling token packet along the curve
        const t = (time * 0.6 + fromIdx * 0.3) % 1;
        const packetX =
          (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * ctrlX + t * t * to.x;
        const packetY =
          (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * ctrlY + t * t * to.y;

        c.fillStyle = "#3f209e";
        c.beginPath();
        c.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
        c.fill();

        // Subtle glow halo around token
        c.fillStyle = "rgba(63, 32, 158, 0.15)";
        c.beginPath();
        c.arc(packetX, packetY, 5, 0, Math.PI * 2);
        c.fill();
      });

      // Draw nodes and detect proximity
      nodes.forEach((n) => {
        const dist = Math.hypot(mx - n.x, my - n.y);
        const isNear = dist < 70;
        const radius = isNear ? 12 : 9;

        // Radiant halo for nearest node
        if (isNear) {
          c.fillStyle = "rgba(63, 32, 158, 0.12)";
          c.beginPath();
          c.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
          c.fill();
        }

        // Node circle
        c.fillStyle = isNear ? "rgba(63, 32, 158, 0.2)" : "rgba(63, 32, 158, 0.08)";
        c.beginPath();
        c.arc(n.x, n.y, radius, 0, Math.PI * 2);
        c.fill();

        c.strokeStyle = isNear ? "#3f209e" : "rgba(63, 32, 158, 0.4)";
        c.lineWidth = isNear ? 1.5 : 1;
        c.beginPath();
        c.arc(n.x, n.y, radius, 0, Math.PI * 2);
        c.stroke();

        // Inner core
        c.fillStyle = isNear ? "#3f209e" : "rgba(63, 32, 158, 0.6)";
        c.beginPath();
        c.arc(n.x, n.y, 3, 0, Math.PI * 2);
        c.fill();

        // Node label
        c.font = "8px 'JetBrains Mono', monospace";
        c.fillStyle = isNear ? "#3f209e" : "rgba(63, 32, 158, 0.55)";
        c.fillText(n.label, n.x - 14, n.y + radius + 10);
      });
    };

    const renderGraphicDesign = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Kinetic Bezier Vector Pen Tool & Swiss Typographic Matrix
      const mx = st.x;
      const my = st.y;

      // 1. Swiss Baseline Grid & Angle Rays
      c.strokeStyle = "rgba(160, 64, 28, 0.08)";
      c.lineWidth = 1;
      for (let y = 16; y < h; y += 18) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }

      // Golden ratio circle in background
      const cx = w * 0.72;
      const cy = h * 0.45;
      c.strokeStyle = "rgba(160, 64, 28, 0.12)";
      c.beginPath();
      c.arc(cx, cy, 38, 0, Math.PI * 2);
      c.arc(cx, cy, 38 * 1.618, 0, Math.PI * 2);
      c.stroke();

      // 2. Active Bezier Curve with Control Handles (Figma / Illustrator Pen Tool)
      const p0 = { x: w * 0.15, y: h * 0.75 };
      const p3 = { x: w * 0.85, y: h * 0.3 };

      // C1 and C2 respond directly to cursor
      const c1 = { x: mx, y: my };
      const c2 = { x: w * 0.65 - (mx - w * 0.5) * 0.4, y: h * 0.7 - (my - h * 0.5) * 0.4 };

      // Draw Tangent Control Lines (Dashed)
      c.strokeStyle = "rgba(160, 64, 28, 0.35)";
      c.setLineDash([2, 3]);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(p0.x, p0.y);
      c.lineTo(c1.x, c1.y);
      c.moveTo(p3.x, p3.y);
      c.lineTo(c2.x, c2.y);
      c.stroke();
      c.setLineDash([]);

      // Draw Main Bezier Curve (Solid, elegant)
      c.strokeStyle = "#a0401c";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(p0.x, p0.y);
      c.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p3.x, p3.y);
      c.stroke();

      // Draw Anchor Points (Hollow Squares)
      const drawSquareAnchor = (pt: { x: number; y: number }, active = false) => {
        c.fillStyle = active ? "#a0401c" : "#ffffff";
        c.strokeStyle = "#a0401c";
        c.lineWidth = 1.5;
        c.fillRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
        c.strokeRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
      };

      // Draw Tangent Handle Points (Filled Circles)
      const drawHandleCircle = (pt: { x: number; y: number }, label: string) => {
        c.fillStyle = "#a0401c";
        c.beginPath();
        c.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        c.fill();

        c.font = "8px 'JetBrains Mono', monospace";
        c.fillStyle = "rgba(160, 64, 28, 0.75)";
        c.fillText(label, pt.x + 6, pt.y + 3);
      };

      drawSquareAnchor(p0);
      drawSquareAnchor(p3);
      drawHandleCircle(c1, "C1 [CURSOR]");
      drawHandleCircle(c2, "C2");

      // Curvature readout
      c.font = "8px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(160, 64, 28, 0.6)";
      c.fillText(`CURVATURE: κ ${(0.5 + Math.abs(c1.y - p0.y) / 200).toFixed(3)}`, p0.x, p0.y + 16);
      c.fillText("SWISS MATRIX // 8pt BASELINE", w * 0.15, 24);
    };

    const renderDocumentation = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Isometric Architectural Blueprint Ledger & Spec Tree
      const mx = st.x;
      const my = st.y;
      const parallaxX = (mx / w - 0.5) * 12;
      const parallaxY = (my / h - 0.5) * 8;

      // Layered isometric sheets
      const drawSheet = (offsetX: number, offsetY: number, alpha: number) => {
        const sx = w * 0.45 + offsetX + parallaxX;
        const sy = 22 + offsetY + parallaxY;
        const sw = w * 0.48;
        const sh = h * 0.7;

        c.fillStyle = `rgba(14, 68, 59, ${alpha * 0.05})`;
        c.strokeStyle = `rgba(14, 68, 59, ${alpha * 0.25})`;
        c.lineWidth = 1;
        c.fillRect(sx, sy, sw, sh);
        c.strokeRect(sx, sy, sw, sh);
      };

      drawSheet(16, 16, 0.4);
      drawSheet(8, 8, 0.7);
      drawSheet(0, 0, 1.0);

      // Top Sheet content: Spec tree
      const topX = w * 0.45 + parallaxX;
      const topY = 22 + parallaxY;

      c.font = "8px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(14, 68, 59, 0.6)";
      c.fillText("// ARCHITECTURE SPEC", topX + 8, topY + 16);
      c.fillText("├── kernel_v2.rs", topX + 8, topY + 28);
      c.fillText("├── threat_model.sig", topX + 8, topY + 40);
      c.fillText("└── diligence_ready.pdf", topX + 8, topY + 52);

      // Scanning laser line across document driven by cursor Y
      c.strokeStyle = "rgba(14, 68, 59, 0.4)";
      c.setLineDash([4, 2]);
      c.beginPath();
      c.moveTo(topX, my);
      c.lineTo(topX + w * 0.48, my);
      c.stroke();
      c.setLineDash([]);

      // Cryptographic Stamp / Verification Seal
      const stampX = topX + w * 0.28;
      const stampY = topY + h * 0.46;
      c.strokeStyle = "rgba(14, 68, 59, 0.35)";
      c.beginPath();
      c.arc(stampX, stampY, 18, 0, Math.PI * 2);
      c.stroke();

      c.font = "7px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(14, 68, 59, 0.65)";
      c.fillText("VERIFIED", stampX - 16, stampY - 3);
      c.fillText("AUDIT 1.0", stampX - 17, stampY + 7);
    };

    const renderMobileApp = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Haptic Mobile Viewport & 60fps Latency Oscilloscope
      const time = st.time;
      const mx = st.x;
      const my = st.y;

      // 1. Mobile Phone Silhouette Outline
      const phoneW = Math.min(w * 0.5, 140);
      const phoneH = h * 0.8;
      const phoneX = w * 0.45;
      const phoneY = h * 0.1;
      const radius = 14;

      c.strokeStyle = "rgba(14, 68, 59, 0.25)";
      c.lineWidth = 1.2;
      c.beginPath();
      c.roundRect(phoneX, phoneY, phoneW, phoneH, radius);
      c.stroke();

      // Top Island / Notch
      c.fillStyle = "rgba(14, 68, 59, 0.2)";
      c.beginPath();
      c.roundRect(phoneX + phoneW / 2 - 16, phoneY + 5, 32, 6, 3);
      c.fill();

      // Status Bar Text
      c.font = "7px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(14, 68, 59, 0.45)";
      c.fillText("9:41", phoneX + 8, phoneY + 11);
      c.fillText("5G", phoneX + phoneW - 18, phoneY + 11);

      // 2. Interactive Capacitive Touch Ripples around cursor
      c.strokeStyle = "rgba(14, 68, 59, 0.35)";
      c.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        const rippleR = ((time * 25 + r * 15) % 45);
        const rippleAlpha = Math.max(0, 1 - rippleR / 45) * 0.3;
        c.strokeStyle = `rgba(14, 68, 59, ${rippleAlpha})`;
        c.beginPath();
        c.arc(mx, my, rippleR, 0, Math.PI * 2);
        c.stroke();
      }

      // Touch Target Point
      c.fillStyle = "#0e443b";
      c.beginPath();
      c.arc(mx, my, 3.5, 0, Math.PI * 2);
      c.fill();

      // 3. 60fps Frame Latency Oscilloscope (Waveform at bottom)
      c.strokeStyle = "rgba(14, 68, 59, 0.4)";
      c.lineWidth = 1.2;
      c.beginPath();
      const waveY = phoneY + phoneH - 24;
      c.moveTo(phoneX + 6, waveY);
      for (let ox = 6; ox < phoneW - 6; ox += 4) {
        const waveOffset = Math.sin((ox + time * 60) * 0.15) * 3;
        c.lineTo(phoneX + ox, waveY + waveOffset);
      }
      c.stroke();

      c.font = "7px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(14, 68, 59, 0.6)";
      c.fillText("16.6ms // 60FPS", phoneX + 8, phoneY + phoneH - 10);
    };

    const renderDigitalMarketing = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Algorithmic Discovery Radar & Organic Spectrum Curve
      const time = st.time;
      const mx = st.x;
      const my = st.y;

      // 1. Polar Radar Center
      const radarX = w * 0.65;
      const radarY = h * 0.48;
      const maxRadius = Math.min(w * 0.3, 65);

      // Radar rings
      c.strokeStyle = "rgba(160, 64, 28, 0.12)";
      c.lineWidth = 1;
      [0.3, 0.6, 1.0].forEach((ratio) => {
        c.beginPath();
        c.arc(radarX, radarY, maxRadius * ratio, 0, Math.PI * 2);
        c.stroke();
      });

      // Axis crosshairs
      c.beginPath();
      c.moveTo(radarX - maxRadius, radarY);
      c.lineTo(radarX + maxRadius, radarY);
      c.moveTo(radarX, radarY - maxRadius);
      c.lineTo(radarX, radarY + maxRadius);
      c.stroke();

      // Rotating Sweep Beam
      const sweepAngle = (time * 1.8) % (Math.PI * 2);
      c.strokeStyle = "rgba(160, 64, 28, 0.35)";
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(radarX, radarY);
      c.lineTo(
        radarX + Math.cos(sweepAngle) * maxRadius,
        radarY + Math.sin(sweepAngle) * maxRadius
      );
      c.stroke();

      // Radar Sector Arc glow
      c.fillStyle = "rgba(160, 64, 28, 0.04)";
      c.beginPath();
      c.moveTo(radarX, radarY);
      c.arc(radarX, radarY, maxRadius, sweepAngle - 0.4, sweepAngle);
      c.closePath();
      c.fill();

      // Scattered Query Discovery Target Nodes
      const targets = [
        { angle: 0.8, dist: 0.5, label: "INTENT: HIGH" },
        { angle: 2.3, dist: 0.8, label: "ORGANIC" },
        { angle: 4.1, dist: 0.65, label: "AUTHORITY" },
      ];

      targets.forEach((t) => {
        const tx = radarX + Math.cos(t.angle) * (maxRadius * t.dist);
        const ty = radarY + Math.sin(t.angle) * (maxRadius * t.dist);
        const diff = Math.abs(sweepAngle - t.angle);
        const isSwept = diff < 0.3;

        c.fillStyle = isSwept ? "#a0401c" : "rgba(160, 64, 28, 0.4)";
        c.beginPath();
        c.arc(tx, ty, isSwept ? 3.5 : 2, 0, Math.PI * 2);
        c.fill();

        if (isSwept) {
          c.font = "7px 'JetBrains Mono', monospace";
          c.fillStyle = "#a0401c";
          c.fillText(t.label, tx + 6, ty + 2);
        }
      });

      // 2. Real-time organic growth sparkline at bottom reacting to cursor
      c.strokeStyle = "rgba(160, 64, 28, 0.4)";
      c.lineWidth = 1.5;
      c.beginPath();
      const sparkY = h - 22;
      c.moveTo(16, sparkY);
      for (let sx = 16; sx < w - 24; sx += 8) {
        const wave = Math.sin((sx + mx) * 0.05) * 6;
        c.lineTo(sx, sparkY - (sx / w) * 16 + wave);
      }
      c.stroke();

      c.font = "8px 'JetBrains Mono', monospace";
      c.fillStyle = "rgba(160, 64, 28, 0.6)";
      c.fillText("ORGANIC CTR: +340% // TECHNICAL SEO", 16, sparkY + 12);
    };

    const renderGenericTopology = (
      c: CanvasRenderingContext2D,
      st: CanvasPointerState,
      w: number,
      h: number
    ) => {
      // Sovereign Microkernel Node Grid & Packet Ledger
      const mx = st.x;
      const my = st.y;
      c.strokeStyle = "rgba(14, 68, 59, 0.12)";
      c.lineWidth = 1;
      const cols = 5;
      const rows = 4;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const nx = (w / (cols + 1)) * (i + 1);
          const ny = (h / (rows + 1)) * (j + 1);
          const dist = Math.hypot(mx - nx, my - ny);
          const isNear = dist < 45;

          c.fillStyle = isNear ? "#0e443b" : "rgba(14, 68, 59, 0.15)";
          c.beginPath();
          c.arc(nx, ny, isNear ? 3 : 1.5, 0, Math.PI * 2);
          c.fill();

          if (isNear) {
            c.strokeStyle = "rgba(14, 68, 59, 0.25)";
            c.beginPath();
            c.arc(nx, ny, 12, 0, Math.PI * 2);
            c.stroke();
          }
        }
      }
    };

    // Main animation loop
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const st = stateRef.current;
      st.time += dt;

      // Smooth lerp cursor tracking
      st.x += (st.targetX - st.x) * 0.12;
      st.y += (st.targetY - st.y) * 0.12;

      // Opacity fade in/out
      const targetOpacity = st.isHovered ? 1.0 : 0.0;
      st.opacity += (targetOpacity - st.opacity) * 0.1;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Only draw if visible
      if (st.opacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = st.opacity;

        if (slug.includes("web")) {
          renderWebsiteDev(ctx, st, width, height);
        } else if (slug.includes("ai")) {
          renderAiAutomation(ctx, st, width, height);
        } else if (slug.includes("graphic")) {
          renderGraphicDesign(ctx, st, width, height);
        } else if (slug.includes("doc")) {
          renderDocumentation(ctx, st, width, height);
        } else if (slug.includes("mobile")) {
          renderMobileApp(ctx, st, width, height);
        } else if (slug.includes("marketing")) {
          renderDigitalMarketing(ctx, st, width, height);
        } else {
          renderGenericTopology(ctx, st, width, height);
        }

        ctx.restore();
      }

      // If reduced motion is requested, render once and don't loop endlessly
      if (prefersReducedMotion) {
        return;
      }

      // Keep running if hovered or still fading out
      if (st.isHovered || st.opacity > 0.01) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };

    // Trigger loop when hover state changes
    if (isHovered && !animFrameRef.current) {
      lastTimestamp = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [isHovered, service.slug]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-xl border border-border-default bg-surface-primary p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-border-strong hover:shadow-subtle ${className}`}
    >
      {/* 1. Canvas Interactive Visual Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* 2. Ambient Gradient Scrim to ensure crisp typography contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-surface-primary/95 via-surface-primary/75 to-surface-primary/30 opacity-80 group-hover:opacity-60 transition-opacity duration-300"
      />

      {/* 3. Card Content (z-index above canvas) */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            {service.slug}
          </span>
          <Badge variant="outline" size="sm">
            Enterprise
          </Badge>
        </div>

        <h3 className="font-serif text-xl font-normal text-ink-primary transition-colors group-hover:text-primary">
          {service.name}
        </h3>

        <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
          {service.summary}
        </p>
      </div>

      {/* 4. Bottom Specifications Link & Dynamic Telemetry Readout */}
      <div className="relative z-10 mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
        <Link
          href={`/services/${service.slug}`}
          className="text-xs font-mono font-semibold text-accent-pine hover:underline inline-flex items-center gap-1.5 focus-visible:outline-focus-ring"
        >
          <span>Specifications</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </Link>

        {/* Live Engineering Telemetry Readout */}
        <span
          aria-hidden="true"
          className="font-mono text-[10px] tracking-tight text-ink-muted/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none truncate max-w-[170px]"
        >
          {telemetry}
        </span>
      </div>
    </div>
  );
}

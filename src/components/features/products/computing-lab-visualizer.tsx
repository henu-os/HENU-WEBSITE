"use client";

import React, { useRef, useEffect, useState } from "react";
import type { Product } from "@/types/domain";

interface ComputingLabVisualizerProps {
  products: Product[];
  className?: string;
}

export function ComputingLabVisualizer({
  products,
  className = "",
}: ComputingLabVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<string>("henu-os");
  const [telemetry, setTelemetry] = useState<string>("SYSTEM // HARMONIZED KERNEL ACTIVE");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const state = {
      rotX: 0.35,
      rotY: -0.2,
      targetRotX: 0.35,
      targetRotY: -0.2,
      time: 0,
      hoveredIndex: -1,
    };

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
    const ro = new ResizeObserver(resize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      state.targetRotY = x * 0.6;
      state.targetRotX = 0.35 + y * 0.4;
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    let animId: number;
    let lastTime = performance.now();

    const nodes = [
      { id: "henu-os", name: "HENU OS", color: "#0e443b", radius: 0, angle: 0, tier: "TIER 0 [KERNEL]" },
      { id: "henu-ai", name: "HENU AI", color: "#3f209e", radius: 105, angle: 0, tier: "TIER 1 [NEURAL]" },
      { id: "henu-pa", name: "HENU PA", color: "#a0401c", radius: 110, angle: (Math.PI * 2) / 3, tier: "TIER 2 [AGENT]" },
      { id: "henu-ide", name: "HENU IDE", color: "#166534", radius: 115, angle: (Math.PI * 4) / 3, tier: "TIER 3 [STUDIO]" },
    ];

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      state.time += dt;

      state.rotX += (state.targetRotX - state.rotX) * 0.08;
      state.rotY += (state.targetRotY - state.rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 10;

      // 1. Perspective Ring Substrate
      const orbitA = 120;
      const orbitB = 65;

      ctx.save();
      ctx.translate(cx, cy);

      // Grid planes in background
      ctx.strokeStyle = "rgba(14, 68, 59, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 40; r <= 150; r += 35) {
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.52, state.rotY, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Connecting data bus beams from center to orbiting nodes
      nodes.forEach((n, i) => {
        if (i === 0) return; // OS is center
        const dynamicAngle = n.angle + state.time * 0.25;
        const nx = Math.cos(dynamicAngle) * orbitA;
        const ny = Math.sin(dynamicAngle) * orbitB;

        // Glowing pipeline line
        ctx.strokeStyle = "rgba(14, 68, 59, 0.22)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulsing data token traveling along bus
        const t = (state.time * 0.8 + i * 0.33) % 1;
        const px = nx * t;
        const py = ny * t;

        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Node Box / Pod
        const isSelected = activeNode === n.id;
        const boxW = 58;
        const boxH = 24;

        ctx.fillStyle = isSelected ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.85)";
        ctx.strokeStyle = isSelected ? n.color : "rgba(112, 121, 118, 0.4)";
        ctx.lineWidth = isSelected ? 2 : 1;

        ctx.beginPath();
        ctx.roundRect(nx - boxW / 2, ny - boxH / 2, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();

        // Dot indicator
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(nx - boxW / 2 + 7, ny, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = "bold 8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#1c1c1a";
        ctx.fillText(n.name, nx - boxW / 2 + 14, ny + 3);
      });

      // 2. Central Core: HENU OS Foundation
      const coreSize = 36;
      const isOsSelected = activeNode === "henu-os";

      // Core glow aura
      const coreGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
      coreGlow.addColorStop(0, "rgba(14, 68, 59, 0.25)");
      coreGlow.addColorStop(1, "rgba(14, 68, 59, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();

      // Central Isometric Core Plate
      ctx.fillStyle = "#0e443b";
      ctx.beginPath();
      ctx.roundRect(-coreSize, -coreSize * 0.6, coreSize * 2, coreSize * 1.2, 6);
      ctx.fill();

      ctx.strokeStyle = "#9dd1c4";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Core typography
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("HENU OS", 0, 1);
      ctx.font = "7px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#9dd1c4";
      ctx.fillText("MICROKERNEL", 0, 10);
      ctx.textAlign = "left";

      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      if (el) el.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();
    };
  }, [activeNode]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border border-primary/25 bg-gradient-to-b from-surface-primary/95 to-surface-secondary/50 p-6 backdrop-blur-md shadow-elevated overflow-hidden ${className}`}
    >
      {/* Visual Header Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Sovereign Computing Topology // Live
          </span>
        </div>

        <span className="font-mono text-[10px] text-ink-muted bg-surface-secondary px-2 py-0.5 rounded border border-border-subtle">
          4 Interlocking Nodes
        </span>
      </div>

      {/* Interactive 3D/Canvas Display */}
      <div className="relative h-64 sm:h-72 w-full my-2">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* Interactive Node Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-border-default/60">
        {[
          { id: "henu-os", label: "HENU OS", status: "Base Microkernel", color: "border-primary text-primary" },
          { id: "henu-ai", label: "HENU AI", status: "Neural Runtime", color: "border-indigo-600 text-indigo-700 dark:text-indigo-300" },
          { id: "henu-pa", label: "HENU PA", status: "Voice & Dialogue", color: "border-amber-600 text-amber-700 dark:text-amber-300" },
          { id: "henu-ide", label: "HENU IDE", status: "Wayland Studio", color: "border-emerald-600 text-emerald-700 dark:text-emerald-300" },
        ].map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => {
              setActiveNode(node.id);
              setTelemetry(`${node.label.toUpperCase()} // ${node.status.toUpperCase()}`);
            }}
            className={`p-2 rounded-lg border text-left transition-all ${
              activeNode === node.id
                ? "bg-surface-primary shadow-subtle border-primary"
                : "bg-surface-secondary/40 border-border-default/50 hover:bg-surface-primary"
            }`}
          >
            <div className="font-mono text-[11px] font-bold text-ink-primary">
              {node.label}
            </div>
            <div className="font-mono text-[9px] text-ink-muted truncate">
              {node.status}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-ink-muted">
        <span className="text-primary font-semibold truncate">
          &gt; {telemetry}
        </span>
        <span className="hidden sm:inline text-ink-muted">
          HARDWARE ISOLATION: 100%
        </span>
      </div>
    </div>
  );
}

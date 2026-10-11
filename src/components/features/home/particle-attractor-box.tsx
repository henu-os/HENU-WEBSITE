"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface ParticleAttractorBoxProps {
  className?: string;
}

const CONFIG = {
  text: "SYSTEM IDLE",
  hoverText: "AWAKEN HENU OS",
  hoverEnabled: true,
  morphDuration: 0.5,
  fontFamily: "Courier New, monospace",
  fontWeight: 900,
  particleCount: 16000,
  particleSize: 1.8,
  sizeVariation: 3.0,
  interactionMode: "repel",
  interactionRadius: 8.5,
  interactionForce: 3.5,
  friction: 0.75,
  returnSpeed: 0.08,
  turbulence: 0.42,
  driftSpeed: 1,
  sceneScale: 0.84,
  color: "#6d28d9", // Deep spectral violet for crisp contrast
  seed: 31,
};

const VERTEX_SHADER = `
  attribute float aSize;
  uniform float uPixelRatio;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceToCenter = length(point);
    if (distanceToCenter > 0.5) discard;
    float halo = smoothstep(0.5, 0.08, distanceToCenter);
    float core = smoothstep(0.24, 0.0, distanceToCenter);
    gl_FragColor = vec4(uColor, halo * (0.42 + core * 0.58));
  }
`;

function random(seed: number) {
  let value = seed >>> 0;
  return function () {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleAttractorBox({ className = "" }: ParticleAttractorBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 10);
    camera.position.z = 2;

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uPixelRatio: { value: renderer.getPixelRatio() },
        uColor: { value: new THREE.Color(CONFIG.color) },
      },
    });

    scene.add(new THREE.Points(geometry, material));

    let buffers: {
      positions: Float32Array;
      idleHomes: Float32Array;
      hoverHomes: Float32Array;
      velocities: Float32Array;
      phases: Float32Array;
      count: number;
    } | null = null;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;
    let worldWidth = 100;
    let elapsed = 0;
    let lastTime = 0;
    let pointerActive = false;
    let hoverLatched = false;
    let morph = 0;
    const pointer = new THREE.Vector2(9999, 9999);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function sampleText(
      ctx: CanvasRenderingContext2D,
      value: string,
      maskW: number,
      maskH: number
    ) {
      ctx.clearRect(0, 0, maskW, maskH);
      const lines = value.split(/\n/).slice(0, 2);
      const maxTextWidth = maskW * 0.88;
      const maxTextHeight = maskH * 0.72;
      let fontSize = Math.min(560 / Math.max(1, lines.length), 540);

      for (let attempt = 0; attempt < 24; attempt += 1) {
        ctx.font = `${CONFIG.fontWeight} ${fontSize}px ${CONFIG.fontFamily}`;
        const measuredWidth = Math.max(
          ...lines.map((line) => ctx.measureText(line || " ").width)
        );
        if (measuredWidth <= maxTextWidth && fontSize * lines.length * 1.02 <= maxTextHeight) {
          break;
        }
        fontSize *= 0.91;
      }

      ctx.font = `${CONFIG.fontWeight} ${fontSize}px ${CONFIG.fontFamily}`;
      const lineHeight = fontSize * 0.94;
      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          maskW / 2,
          maskH / 2 + (index - (lines.length - 1) / 2) * lineHeight
        );
      });

      const pixels = ctx.getImageData(0, 0, maskW, maskH).data;
      const candidates: number[] = [];
      let minX = maskW;
      let maxX = 0;
      let minY = maskH;
      let maxY = 0;

      for (let y = 1; y < maskH; y += 2) {
        for (let x = 1; x < maskW; x += 2) {
          if (pixels[(y * maskW + x) * 4 + 3]! > 72) {
            candidates.push(y * maskW + x);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      }

      return { candidates, minX, maxX, minY, maxY };
    }

    function buildParticles() {
      if (width < 2 || height < 2) return;
      const maskW = 1200;
      const maskH = 760;
      const mask = document.createElement("canvas");
      mask.width = maskW;
      mask.height = maskH;
      const ctx = mask.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      const idleShape = sampleText(ctx, CONFIG.text.trim().slice(0, 16) || "A", maskW, maskH);
      const hoverShape = sampleText(ctx, CONFIG.hoverText.trim().slice(0, 18) || "PARTICLE", maskW, maskH);
      if (!idleShape.candidates.length || !hoverShape.candidates.length) return;

      const targetCount = width < 500
        ? Math.min(CONFIG.particleCount, Math.round(CONFIG.particleCount * 0.6))
        : CONFIG.particleCount;

      const positions = new Float32Array(targetCount * 3);
      const idleHomes = new Float32Array(targetCount * 3);
      const hoverHomes = new Float32Array(targetCount * 3);
      const velocities = new Float32Array(targetCount * 3);
      const phases = new Float32Array(targetCount);
      const sizes = new Float32Array(targetCount);
      const seeded = random(CONFIG.seed);
      worldWidth = 100 * (width / height);

      function shapeTransform(shape: { minX: number; maxX: number; minY: number; maxY: number }, maxW: number, maxH: number) {
        return {
          centerX: (shape.minX + shape.maxX) / 2,
          centerY: (shape.minY + shape.maxY) / 2,
          scale: Math.min(
            (worldWidth * maxW * CONFIG.sceneScale) / Math.max(1, shape.maxX - shape.minX),
            (100 * maxH * CONFIG.sceneScale) / Math.max(1, shape.maxY - shape.minY)
          ),
        };
      }

      const idleTransform = shapeTransform(idleShape, 0.78, 0.78);
      const hoverTransform = shapeTransform(hoverShape, 0.9, 0.62);

      for (let i = 0; i < targetCount; i += 1) {
        const idleSample = idleShape.candidates[Math.floor(seeded() * idleShape.candidates.length)]!;
        const hoverSample = hoverShape.candidates[Math.floor(seeded() * hoverShape.candidates.length)]!;
        const idleX = idleSample % maskW;
        const idleY = Math.floor(idleSample / maskW);
        const hoverX = hoverSample % maskW;
        const hoverY = Math.floor(hoverSample / maskW);
        const i3 = i * 3;

        idleHomes[i3] = (idleX - idleTransform.centerX) * idleTransform.scale + (seeded() - 0.5) * 0.08;
        idleHomes[i3 + 1] = (idleTransform.centerY - idleY) * idleTransform.scale + (seeded() - 0.5) * 0.08;
        idleHomes[i3 + 2] = (seeded() - 0.5) * 0.8;

        hoverHomes[i3] = (hoverX - hoverTransform.centerX) * hoverTransform.scale + (seeded() - 0.5) * 0.08;
        hoverHomes[i3 + 1] = (hoverTransform.centerY - hoverY) * hoverTransform.scale + (seeded() - 0.5) * 0.08;
        hoverHomes[i3 + 2] = (seeded() - 0.5) * 0.5;

        positions[i3] = (seeded() - 0.5) * worldWidth * 1.35;
        positions[i3 + 1] = (seeded() - 0.5) * 135;
        positions[i3 + 2] = idleHomes[i3 + 2]!;

        phases[i] = seeded() * Math.PI * 2;
        sizes[i] = CONFIG.particleSize * (0.48 + Math.pow(seeded(), 2.4) * CONFIG.sizeVariation);
      }

      buffers = {
        positions,
        idleHomes,
        hoverHomes,
        velocities,
        phases,
        count: targetCount,
      };

      morph = 0;
      hoverLatched = false;

      const positionAttr = new THREE.BufferAttribute(positions, 3);
      positionAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", positionAttr);
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setDrawRange(0, targetCount);
    }

    function resize() {
      if (!container || !renderer) return;
      const rect = container.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const aspectChanged = Math.abs(nextWidth / nextHeight - width / height) > 0.025;

      width = nextWidth;
      height = nextHeight;
      worldWidth = 100 * (width / height);

      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = 50;
      camera.bottom = -50;
      camera.updateProjectionMatrix();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      if (material.uniforms?.uPixelRatio) {
        material.uniforms.uPixelRatio.value = dpr;
      }

      if (!buffers || aspectChanged) {
        buildParticles();
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * worldWidth;
      pointer.y = (0.5 - (e.clientY - rect.top) / rect.height) * 100;
      pointerActive = true;
    }

    function handlePointerLeave() {
      pointerActive = false;
      hoverLatched = false;
      pointer.set(9999, 9999);
    }

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("pointercancel", handlePointerLeave);

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    let animId: number;

    function render(now: number) {
      animId = requestAnimationFrame(render);
      if (document.hidden || !renderer) return;

      const dt = Math.min((now - (lastTime || now)) / 1000, 0.04);
      lastTime = now;

      if (buffers && CONFIG.hoverEnabled && pointerActive && !hoverLatched) {
        let nearIdleShape = false;
        const hoverThresholdSquared = Math.pow(Math.max(4.5, CONFIG.interactionRadius), 2);

        for (let i = 0; i < buffers.count; i += 36) {
          const i3 = i * 3;
          const deltaX = pointer.x - buffers.idleHomes[i3]!;
          const deltaY = pointer.y - buffers.idleHomes[i3 + 1]!;
          if (deltaX * deltaX + deltaY * deltaY < hoverThresholdSquared) {
            nearIdleShape = true;
            break;
          }
        }

        if (nearIdleShape && morph >= 0.96) {
          hoverLatched = true;
        }

        const target = nearIdleShape ? 1 : 0;
        const change = dt / CONFIG.morphDuration;
        morph = target > morph ? Math.min(target, morph + change) : Math.max(target, morph - change);
      } else if (buffers && CONFIG.hoverEnabled && hoverLatched && pointerActive) {
        morph = Math.min(1, morph + dt / CONFIG.morphDuration);
      } else {
        morph = Math.max(0, morph - dt / CONFIG.morphDuration);
      }

      const easedMorph = morph * morph * (3 - 2 * morph);

      if (buffers && !reducedMotion.matches) {
        elapsed += dt * CONFIG.driftSpeed;
        const frameScale = dt * 60;
        const frictionFactor = Math.pow(CONFIG.friction, frameScale);
        const returnFactor = 1 - Math.pow(1 - CONFIG.returnSpeed, frameScale);
        const direction = CONFIG.interactionMode === "attract" ? 1 : -1;

        for (let i = 0; i < buffers.count; i += 1) {
          const i3 = i * 3;
          const phase = buffers.phases[i]!;
          const idleX = buffers.idleHomes[i3]!;
          const idleY = buffers.idleHomes[i3 + 1]!;
          const homeX =
            idleX + (buffers.hoverHomes[i3]! - idleX) * easedMorph + Math.sin(elapsed * 1.2 + phase) * CONFIG.turbulence;
          const homeY =
            idleY + (buffers.hoverHomes[i3 + 1]! - idleY) * easedMorph + Math.cos(elapsed * 1.08 + phase * 1.3) * CONFIG.turbulence;

          let x = buffers.positions[i3]!;
          let y = buffers.positions[i3 + 1]!;
          let velocityX = buffers.velocities[i3]!;
          let velocityY = buffers.velocities[i3 + 1]!;

          if (pointerActive) {
            const deltaX = pointer.x - x;
            const deltaY = pointer.y - y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance < CONFIG.interactionRadius && distance > 0.001) {
              const falloff = 1 - distance / CONFIG.interactionRadius;
              const force = falloff * falloff * CONFIG.interactionForce * 0.14 * frameScale * direction;
              velocityX += (deltaX / distance) * force;
              velocityY += (deltaY / distance) * force;
            }
          }

          velocityX *= frictionFactor;
          velocityY *= frictionFactor;
          x += velocityX * frameScale;
          y += velocityY * frameScale;
          x += (homeX - x) * returnFactor;
          y += (homeY - y) * returnFactor;

          buffers.velocities[i3] = velocityX;
          buffers.velocities[i3 + 1] = velocityY;
          buffers.positions[i3] = x;
          buffers.positions[i3 + 1] = y;
        }

        const positionAttr = geometry.attributes.position;
        if (positionAttr) positionAttr.needsUpdate = true;
      } else if (buffers) {
        buffers.positions.set(buffers.idleHomes);
        const positionAttr = geometry.attributes.position;
        if (positionAttr) positionAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    resize();
    Promise.resolve(document.fonts && document.fonts.ready).then(buildParticles);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("pointercancel", handlePointerLeave);
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-border-default shadow-elevated bg-[#e7dafb]/40 dark:bg-[#120822]/60 cursor-crosshair select-none ${className}`}
    >
      {/* Interactive Three.js Particle Attractor Canvas */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive particle attractor lettering morphing between SYSTEM IDLE and AWAKEN HENU OS"
        className="absolute inset-0 h-full w-full pointer-events-none z-0"
      />
    </div>
  );
}

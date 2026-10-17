"use client";

export interface EyeParticle {
  nx: number; // normalized x offset from center [-0.5, 0.5]
  ny: number; // normalized y offset from center [-0.28, 0.28]
  r: number;  // base radius
  baseAlpha: number;
  color: string;
  phase: number;
  speed: number;
  twinkle: number;
}

export interface BurstState {
  active: boolean;
  startX: number;
  startY: number;
  startTime: number;
  durationMs: number;
  returnMs: number;
}

const BASE_W = 1120;
const BASE_H = 630;
const TARGET_PARTICLES = 14500;

let cachedParticles: EyeParticle[] | null = null;
let cachedDragonImg: HTMLImageElement | null = null;
let particleLoadingPromise: Promise<EyeParticle[]> | null = null;
let dragonLoadingPromise: Promise<HTMLImageElement> | null = null;

/**
 * Loads the dragon emblem texture once and caches it.
 */
export function loadDragonTexture(): Promise<HTMLImageElement> {
  if (cachedDragonImg && cachedDragonImg.complete) {
    return Promise.resolve(cachedDragonImg);
  }
  if (dragonLoadingPromise) {
    return dragonLoadingPromise;
  }

  dragonLoadingPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/brand/henu-dragon-800.png";
    img.onload = () => {
      cachedDragonImg = img;
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn("Failed to load /brand/henu-dragon-800.png, trying fallback", err);
      img.src = "/brand/henu-dragon.png";
      img.onload = () => {
        cachedDragonImg = img;
        resolve(img);
      };
      img.onerror = (e) => reject(e);
    };
  });

  return dragonLoadingPromise;
}

/**
 * Extracts and samples the eye outline particles from /brand/henu-eye-1120.png once and caches them.
 */
export function loadEyeParticles(): Promise<EyeParticle[]> {
  if (cachedParticles && cachedParticles.length > 0) {
    return Promise.resolve(cachedParticles);
  }
  if (particleLoadingPromise) {
    return particleLoadingPromise;
  }

  particleLoadingPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/brand/henu-eye-1120.png";
    img.onload = () => {
      try {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = BASE_W;
        offCanvas.height = BASE_H;
        const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
        if (!offCtx) {
          resolve([]);
          return;
        }

        offCtx.drawImage(img, 0, 0, BASE_W, BASE_H);
        const imgData = offCtx.getImageData(0, 0, BASE_W, BASE_H);
        const data = imgData.data;

        const candidates: { x: number; y: number; r: number; g: number; b: number; a: number }[] = [];
        for (let y = 0; y < BASE_H; y++) {
          for (let x = 0; x < BASE_W; x++) {
            const idx = (y * BASE_W + x) * 4;
            const aVal = data[idx + 3];
            const rVal = data[idx];
            const gVal = data[idx + 1];
            const bVal = data[idx + 2];
            if (aVal !== undefined && aVal > 36 && rVal !== undefined && gVal !== undefined && bVal !== undefined) {
              candidates.push({
                x,
                y,
                r: rVal,
                g: gVal,
                b: bVal,
                a: aVal / 255,
              });
            }
          }
        }

        // Shuffle candidates using Fisher-Yates
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = candidates[i];
          const swap = candidates[j];
          if (temp && swap) {
            candidates[i] = swap;
            candidates[j] = temp;
          }
        }

        const count = Math.min(TARGET_PARTICLES, candidates.length);
        const selected = candidates.slice(0, count);

        const cx = 560;
        const cy = 300;

        cachedParticles = selected.map((p) => {
          const randRadius = 0.5 + Math.random() * 0.95 * (0.65 + p.a * 0.55);
          return {
            nx: (p.x - cx) / BASE_W,
            ny: (p.y - cy) / BASE_W,
            r: randRadius,
            baseAlpha: Math.min(1, Math.max(0.18, p.a * (0.75 + Math.random() * 0.45))),
            color: `rgb(${p.r},${p.g},${p.b})`,
            phase: Math.random() * Math.PI * 2,
            speed: 0.7 + Math.random() * 0.7,
            twinkle: 0.05 + Math.random() * 0.15,
          };
        });

        resolve(cachedParticles);
      } catch (e) {
        console.error("Error building eye particles:", e);
        reject(e);
      }
    };
    img.onerror = (e) => {
      console.error("Failed to load /brand/henu-eye-1120.png", e);
      reject(e);
    };
  });

  return particleLoadingPromise;
}

export interface RenderParams {
  ctx: CanvasRenderingContext2D;
  timeMs: number;
  particles: EyeParticle[];
  dragonImg: HTMLImageElement | null;
  eyeX: number;
  eyeY: number;
  eyeWidth: number;
  dragonX: number;
  dragonY: number;
  dragonWidth: number;
  dragonAngle: number;
  mouseX?: number;
  mouseY?: number;
  burst?: BurstState | null;
  globalOpacity?: number;
}

/**
 * High-performance frame renderer for the dynamic Void Particle Eye + Rotating Dragon.
 */
export function renderDragonEyeFrame({
  ctx,
  timeMs,
  particles,
  dragonImg,
  eyeX,
  eyeY,
  eyeWidth,
  dragonX,
  dragonY,
  dragonWidth,
  dragonAngle,
  mouseX,
  mouseY,
  burst,
  globalOpacity = 1,
}: RenderParams) {
  if (globalOpacity <= 0.01) return;

  const t = timeMs * 0.001;

  // 1. RENDER INNER DRAGON (ROTATING)
  if (dragonImg && dragonImg.complete && dragonWidth > 4) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, globalOpacity * 0.94));
    ctx.translate(dragonX, dragonY);
    ctx.rotate(dragonAngle);
    const dHalf = dragonWidth / 2;
    ctx.drawImage(dragonImg, -dHalf, -dHalf, dragonWidth, dragonWidth);
    ctx.restore();
  }

  // 2. RENDER THE "VOID" PARTICLE EYE OUTLINE
  if (!particles || particles.length === 0) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const numParticles = particles.length;
  const isPointerNear = mouseX !== undefined && mouseY !== undefined;
  const mx = mouseX ?? -9999;
  const my = mouseY ?? -9999;
  const repelRadius = eyeWidth * 0.22;
  const repelRadiusSq = repelRadius * repelRadius;

  // Particle scale relative to standard 600px width
  const scaleRatio = eyeWidth / 600;

  // Check burst status
  const burstActive = burst && burst.active;
  let burstPhase = "";
  let burstProgress = 0;
  if (burstActive) {
    const elapsed = timeMs - burst.startTime;
    const totalDuration = burst.durationMs + burst.returnMs;
    if (elapsed < burst.durationMs) {
      burstPhase = "out";
      burstProgress = Math.min(1, Math.max(0, elapsed / burst.durationMs));
    } else if (elapsed < totalDuration) {
      burstPhase = "return";
      burstProgress = Math.min(1, Math.max(0, (elapsed - burst.durationMs) / burst.returnMs));
    }
  }

  const step = eyeWidth < 120 ? 4 : eyeWidth < 260 ? 2 : 1;
  for (let i = 0; i < numParticles; i += step) {
    const p = particles[i];
    if (!p) continue;

    // Base position scaled to current eye size
    const bx = eyeX + p.nx * eyeWidth;
    const by = eyeY + p.ny * eyeWidth;

    // Fluid Brownian / void motion (sine wave orbital turbulence)
    const driftX =
      Math.sin(t * 1.5 * p.speed + p.phase) * (eyeWidth * 0.009) +
      Math.cos(t * 0.9 + p.phase * 2) * (eyeWidth * 0.005);
    const driftY =
      Math.cos(t * 1.6 * p.speed + p.phase) * (eyeWidth * 0.009) +
      Math.sin(t * 1.1 + p.phase * 1.6) * (eyeWidth * 0.005);

    let px = bx + driftX;
    let py = by + driftY;

    // Interactive pointer repulsion (fluid displacement)
    if (isPointerNear) {
      const dx = px - mx;
      const dy = py - my;
      const dSq = dx * dx + dy * dy;
      if (dSq < repelRadiusSq && dSq > 1) {
        const d = Math.sqrt(dSq);
        const push = (1 - d / repelRadius) * (eyeWidth * 0.08);
        px += (dx / d) * push;
        py += (dy / d) * push;
      }
    }

    // Interactive burst effect (if clicked)
    if (burstActive && burst) {
      const bdx = bx - burst.startX;
      const bdy = by - burst.startY;
      const dist = Math.sqrt(bdx * bdx + bdy * bdy) || 1;
      const angle = Math.atan2(bdy, bdx) + (p.phase - Math.PI);
      const scatterDist = eyeWidth * (0.2 + p.speed * 0.4);

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

    // Dynamic shimmer/twinkle opacity
    const twinkleFactor = 0.7 + 0.3 * Math.sin(t * 3.5 + p.phase * 4);
    const alpha = Math.min(1, Math.max(0, p.baseAlpha * twinkleFactor * globalOpacity));

    const radius = Math.max(0.6, p.r * scaleRatio);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

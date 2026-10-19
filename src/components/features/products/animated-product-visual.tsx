"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";

interface AnimatedProductVisualProps {
  slug: string;
  className?: string;
}

type FormationPhase = "forming" | "formed" | "dissolving";

export function AnimatedProductVisual({ slug, className = "" }: AnimatedProductVisualProps) {
  const norm = slug.toLowerCase();

  // Master formation cycle state machine:
  // - "forming": 0 to 3500ms (3.5s of kinetic code/neural/voice assembly)
  // - "formed":  3500ms to 8500ms (EXACTLY 5 SECONDS HOLD as requested)
  // - "dissolving": 8500ms to 9300ms (0.8s smooth particle dematerialization before next cycle)
  const [phase, setPhase] = useState<FormationPhase>("forming");
  const [formationProgress, setFormationProgress] = useState(0); // 0 to 100
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(5);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [voiceWave, setVoiceWave] = useState([24, 45, 78, 62, 90, 54, 35, 70, 85, 40]);

  useEffect(() => {
    let startTime = Date.now();
    let animFrame: number;

    const FORMING_DURATION = 3500;
    const FORMED_DURATION = 5000;
    const DISSOLVE_DURATION = 800;
    const TOTAL_CYCLE = FORMING_DURATION + FORMED_DURATION + DISSOLVE_DURATION;

    const loop = () => {
      const now = Date.now();
      const elapsed = (now - startTime) % TOTAL_CYCLE;

      if (elapsed < FORMING_DURATION) {
        // Phase 1: Forming (0 to 3.5s)
        setPhase("forming");
        const prog = Math.min(100, Math.floor((elapsed / FORMING_DURATION) * 100));
        setFormationProgress(prog);
        setHoldSecondsLeft(5);
        setActiveCodeLine(Math.floor((prog / 100) * 4));
      } else if (elapsed < FORMING_DURATION + FORMED_DURATION) {
        // Phase 2: Formed - Holds for EXACTLY 5 seconds (3.5s to 8.5s)
        setPhase("formed");
        setFormationProgress(100);
        const holdElapsed = elapsed - FORMING_DURATION;
        const remaining = Math.max(1, Math.ceil((FORMED_DURATION - holdElapsed) / 1000));
        setHoldSecondsLeft(remaining);
      } else {
        // Phase 3: Dissolving (8.5s to 9.3s)
        setPhase("dissolving");
        setFormationProgress(100);
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // PA voice equalizer bounce
  useEffect(() => {
    if (norm !== "henu-pa") return;
    const waveTimer = setInterval(() => {
      setVoiceWave((prev) =>
        prev.map(() => Math.floor(Math.random() * 65) + 20)
      );
    }, 200);
    return () => clearInterval(waveTimer);
  }, [norm]);

  // CSS styles calculated for the logo based on the current phase
  const logoAnimationStyles = useMemo(() => {
    if (phase === "forming") {
      const scale = 0.82 + (formationProgress / 100) * 0.18;
      const opacity = Math.min(1, Math.max(0.08, formationProgress / 90));
      const blur = Math.max(0, (100 - formationProgress) * 0.08);
      const clipY = 100 - formationProgress;
      return {
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px) drop-shadow(0 0 ${10 + (formationProgress / 100) * 20}px currentColor)`,
        clipPath: `inset(${clipY}% 0% 0% 0%)`,
        transition: "none",
      };
    }
    if (phase === "formed") {
      return {
        opacity: 1,
        transform: "scale(1)",
        filter: "blur(0px) drop-shadow(0 0 25px currentColor)",
        clipPath: "inset(0% 0% 0% 0%)",
        transition: "all 0.5s ease-out",
      };
    }
    // dissolving
    return {
      opacity: 0,
      transform: "scale(0.92)",
      filter: "blur(8px) drop-shadow(0 0 5px currentColor)",
      clipPath: "inset(0% 0% 100% 0%)",
      transition: "all 0.7s ease-in",
    };
  }, [phase, formationProgress]);

  // =========================================================================
  // 1. HENU IDE: Coding Action in Bottom-Right Corner -> Logo Formed in Center
  // =========================================================================
  if (norm === "henu-ide") {
    const codeSnippets = [
      { text: "const app = new HenuEngine();", tag: "AST_INIT" },
      { text: "app.mountModule(HENU_IDE);", tag: "CODEGEN" },
      { text: "compiler.link({ optimize: true });", tag: "LINKER" },
      { text: "renderIdeWorkspace(); // 0 errors", tag: "SUCCESS" },
    ];

    const currentSnippet = codeSnippets[activeCodeLine] ?? codeSnippets[0]!;

    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-[#0d1017] to-[#120e24] p-4 sm:p-5 border border-indigo-500/30 shadow-[0_16px_40px_-10px_rgba(99,102,241,0.25)] group ${className}`}
      >
        {/* Subtle Architectural Code Matrix Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Telemetry Header */}
        <div className="relative flex items-center justify-between pb-3 mb-2 border-b border-indigo-500/20 text-[10px] font-mono text-indigo-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full ${phase === "formed" ? "bg-emerald-400" : "bg-indigo-400 animate-ping"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${phase === "formed" ? "bg-emerald-400" : "bg-indigo-400"}`} />
            </span>
            <span className="font-semibold uppercase tracking-wider text-indigo-200">
              HENU IDE // COMPILATION FORGE
            </span>
          </div>

          {/* Phase Badge */}
          <div className="flex items-center gap-2">
            {phase === "formed" ? (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LOGO FORMED &bull; HOLD {holdSecondsLeft}s
              </span>
            ) : phase === "forming" ? (
              <span className="text-indigo-300 bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1">
                <span className="animate-spin inline-block mr-0.5">&#9696;</span>
                COMPILING: {formationProgress}%
              </span>
            ) : (
              <span className="text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded text-[9px]">
                CYCLING...
              </span>
            )}
          </div>
        </div>

        {/* Main Stage: Natural Logo Materializing in Center + Live Coding at Bottom-Right */}
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          {/* Laser Compilation Streams radiating from bottom-right code editor to central logo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="ideBeamGrad" x1="1" y1="1" x2="0.4" y2="0.4">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={phase === "forming" ? "0.9" : "0.3"} />
                <stop offset="50%" stopColor="#c084fc" stopOpacity={phase === "forming" ? "0.6" : "0.15"} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 330 220 Q 230 160, 160 110"
              fill="none"
              stroke="url(#ideBeamGrad)"
              strokeWidth={phase === "forming" ? "2.5" : "1"}
              strokeDasharray="6 4"
              className={phase === "forming" ? "animate-pulse" : ""}
            />
            <path
              d="M 310 240 Q 210 180, 150 130"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.2"
              strokeOpacity={phase === "forming" ? "0.6" : "0.2"}
              strokeDasharray="4 4"
            />
          </svg>

          {/* Pedestal Ambient Cosmic Aura behind the Transparent Logo */}
          <div
            className={`absolute w-52 h-52 -translate-x-4 sm:-translate-x-8 rounded-full bg-gradient-to-tr from-indigo-600/35 via-purple-600/30 to-pink-500/20 blur-3xl pointer-events-none transition-all duration-700 ${
              phase === "formed" ? "opacity-100 scale-110" : "opacity-60 scale-90"
            }`}
          />

          {/* Laser Scanline traveling through the logo during formation */}
          {phase === "forming" && (
            <div
              className="absolute z-20 w-44 sm:w-52 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none -translate-x-4 sm:-translate-x-8"
              style={{
                top: `${20 + (formationProgress / 100) * 55}%`,
              }}
            />
          )}

          {/* CENTER: The Natural Forming HENU-IDE Logo (NO WHITE BOX, PURE TRANSPARENT LOGO) */}
          <div className="relative z-10 flex flex-col items-center justify-center -translate-x-4 sm:-translate-x-8 -translate-y-2 text-indigo-400">
            {/* The Logo Container with Dynamic Materialization Filters */}
            <div
              style={logoAnimationStyles}
              className={`relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center ${
                phase === "formed" ? "animate-[bounce_6s_ease-in-out_infinite]" : ""
              }`}
            >
              <Image
                src="/brand/henu-ide.png"
                alt="HENU IDE Official Transparent Logo"
                fill
                sizes="200px"
                className="object-contain"
                priority
                unoptimized
              />

              {/* Lens flare ping at the logo center when formed */}
              {phase === "formed" && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 blur-sm animate-ping pointer-events-none" />
              )}
            </div>

            {/* Formation Status Tag beneath the Logo */}
            <span
              className={`mt-2 text-[9px] font-mono tracking-widest font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                phase === "formed"
                  ? "text-emerald-300 bg-emerald-950/80 border-emerald-500/40"
                  : "text-indigo-300 bg-indigo-950/80 border-indigo-500/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  phase === "formed" ? "bg-emerald-400" : "bg-indigo-400 animate-ping"
                }`}
              />
              {phase === "formed"
                ? "HENU IDE ESTABLISHED // READY"
                : `COMPILING AST &bull; ${formationProgress}%`}
            </span>
          </div>

          {/* BOTTOM-RIGHT CORNER: Live Coding Visual Workspace */}
          <div className="absolute right-1 bottom-1 sm:right-2 sm:bottom-2 z-20 w-44 sm:w-52 rounded-xl bg-slate-950/95 border border-indigo-500/50 p-2 shadow-2xl backdrop-blur-md">
            {/* Editor Top Bar with Dots */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[8px] font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="ml-1 text-[8px] text-slate-300 font-medium">ide_kernel.ts</span>
              </div>
              <span className="text-[7px] text-indigo-400 bg-indigo-950/80 px-1 rounded border border-indigo-500/30">
                {currentSnippet.tag}
              </span>
            </div>

            {/* Typing Code Lines */}
            <div className="font-mono text-[9px] leading-tight space-y-1 text-slate-300">
              <div className="text-slate-500 text-[8px]">{"// constructing logo via AST..."}</div>
              <div className="text-indigo-300 font-medium truncate">
                <span className="text-pink-400">&gt; </span>
                {currentSnippet.text}
                <span className="animate-ping inline-block w-1 h-2.5 bg-indigo-400 ml-0.5 align-middle" />
              </div>
              <div className="flex items-center justify-between text-[7px] text-emerald-400 font-mono pt-0.5 border-t border-slate-800/80">
                <span>{phase === "formed" ? "&#10003; 0 errors &bull; linked" : `compiling (${formationProgress}%)`}</span>
                <span className="text-indigo-300">target: native</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative pt-2 mt-1 border-t border-indigo-500/20 flex items-center justify-between font-mono text-[9px] text-slate-400">
          <span>PIPELINE: LIVE CODE &rarr; AST &rarr; NATIVE LOGO</span>
          <span className="text-indigo-300 font-bold">&lt;0.08MS LATENCY</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. HENU AI: Neural Token Stream in Corner -> Dragon Emblem Formed in Center
  // =========================================================================
  if (norm === "henu-ai") {
    const aiPrompts = [
      "SYNTHESIZING MULTI-MODAL REASONING GRAPH...",
      "ATTENTION MATRIX: 128K CONTEXT LINKED...",
      "ENERGIZING CIRCUIT TRACES &bull; AWAKENING DRAGON...",
      "SOVEREIGN DRAGON ONLINE // ACTIVE INFERENCE",
    ];

    const currentPrompt = aiPrompts[activeCodeLine] ?? aiPrompts[0]!;

    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-[#100d20] to-[#1c0b2b] p-4 sm:p-5 border border-purple-500/30 shadow-[0_16px_40px_-10px_rgba(168,85,247,0.25)] group ${className}`}
      >
        {/* Subtle Cybernetic Circuit Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c084fc 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Top Telemetry Header */}
        <div className="relative flex items-center justify-between pb-3 mb-2 border-b border-purple-500/20 text-[10px] font-mono text-purple-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full ${phase === "formed" ? "bg-emerald-400" : "bg-purple-400 animate-ping"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${phase === "formed" ? "bg-emerald-400" : "bg-purple-400"}`} />
            </span>
            <span className="font-semibold uppercase tracking-wider text-purple-200">
              HENU AI // NEURAL REASONER
            </span>
          </div>

          <div className="flex items-center gap-2">
            {phase === "formed" ? (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DRAGON ONLINE &bull; HOLD {holdSecondsLeft}s
              </span>
            ) : phase === "forming" ? (
              <span className="text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1">
                <span className="animate-spin inline-block mr-0.5">&#9696;</span>
                SYNTHESIZING: {formationProgress}%
              </span>
            ) : (
              <span className="text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded text-[9px]">
                CYCLING...
              </span>
            )}
          </div>
        </div>

        {/* Main Stage: Natural Dragon Materializing in Center + Neural Inference in Bottom Corner */}
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          {/* Circuit Traces projecting from neural reasoning corner toward the center Dragon */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="aiCircuitGrad" x1="1" y1="1" x2="0.4" y2="0.4">
                <stop offset="0%" stopColor="#c084fc" stopOpacity={phase === "forming" ? "0.9" : "0.3"} />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M 330 220 H 220 L 175 145 H 145"
              fill="none"
              stroke="url(#aiCircuitGrad)"
              strokeWidth={phase === "forming" ? "2" : "1"}
              strokeDasharray="4 3"
              className={phase === "forming" ? "animate-pulse" : ""}
            />
            <path
              d="M 30 50 H 70 L 95 90"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <circle cx="70" cy="50" r="3" fill="#c084fc" />
            <circle cx="220" cy="220" r="3.5" fill="#e879f9" className={phase === "forming" ? "animate-ping" : ""} />
          </svg>

          {/* Center Violet Cosmic Aura */}
          <div
            className={`absolute w-52 h-52 -translate-x-4 sm:-translate-x-8 rounded-full bg-gradient-to-tr from-purple-700/35 via-violet-600/30 to-fuchsia-500/20 blur-3xl pointer-events-none transition-all duration-700 ${
              phase === "formed" ? "opacity-100 scale-110" : "opacity-60 scale-90"
            }`}
          />

          {/* Electric Laser Sweep across the Dragon during formation */}
          {phase === "forming" && (
            <div
              className="absolute z-20 w-44 sm:w-56 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_15px_#e879f9] pointer-events-none -translate-x-4 sm:-translate-x-8"
              style={{
                top: `${20 + (formationProgress / 100) * 55}%`,
              }}
            />
          )}

          {/* CENTER: The Natural Forming HENU-AI Dragon Emblem (NO WHITE BOX) */}
          <div className="relative z-10 flex flex-col items-center justify-center -translate-x-4 sm:-translate-x-8 -translate-y-2 text-purple-400">
            <div
              style={logoAnimationStyles}
              className={`relative w-44 h-36 sm:w-52 sm:h-40 flex items-center justify-center ${
                phase === "formed" ? "animate-[bounce_6s_ease-in-out_infinite]" : ""
              }`}
            >
              <Image
                src="/brand/henu-ai.png"
                alt="HENU AI Official Transparent Logo"
                fill
                sizes="220px"
                className="object-contain"
                priority
                unoptimized
              />

              {phase === "formed" && (
                <span className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-fuchsia-300/80 blur-sm animate-ping pointer-events-none" />
              )}
            </div>

            {/* Formation Status Tag */}
            <span
              className={`mt-2 text-[9px] font-mono tracking-widest font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                phase === "formed"
                  ? "text-emerald-300 bg-emerald-950/80 border-emerald-500/40"
                  : "text-purple-300 bg-purple-950/80 border-purple-500/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  phase === "formed" ? "bg-emerald-400" : "bg-fuchsia-400 animate-ping"
                }`}
              />
              {phase === "formed"
                ? "DRAGON CORE AWAKENED // ONLINE"
                : `NEURAL CONVERGENCE &bull; ${formationProgress}%`}
            </span>
          </div>

          {/* BOTTOM-RIGHT CORNER: Live Neural Token Stream Visual */}
          <div className="absolute right-1 bottom-1 sm:right-2 sm:bottom-2 z-20 w-44 sm:w-52 rounded-xl bg-slate-950/95 border border-purple-500/50 p-2 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[8px] font-mono text-purple-300">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                NEURAL_DAG
              </span>
              <span className="text-[7px] text-purple-400 bg-purple-950/80 px-1 rounded border border-purple-500/30">
                128K TOKENS
              </span>
            </div>

            <div className="font-mono text-[8px] leading-tight space-y-1 text-slate-300">
              <div className="text-purple-400 font-medium truncate">
                {currentPrompt}
              </div>
              <div className="flex items-center gap-1 pt-1">
                <span className="text-[7px] text-slate-400">INFERENCE:</span>
                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-200"
                    style={{ width: `${formationProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative pt-2 mt-1 border-t border-purple-500/20 flex items-center justify-between font-mono text-[9px] text-slate-400">
          <span>DAG: MULTI-HOP PROVENANCE</span>
          <span className="text-purple-300 font-bold">SOVEREIGN ENCLAVE</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. HENU PA: Voice Waveform Stream in Corner -> Monogram Formed in Center
  // =========================================================================
  if (norm === "henu-pa") {
    const voiceCommands = [
      '"Hey HENU, synthesize today\'s workflow."',
      '"Executing sovereign scheduled backup..."',
      '"Binding acoustic speech model &bull; 48kHz"',
      '"Voice stream locked &bull; sub-68ms dispatch"',
    ];

    const currentVoice = voiceCommands[activeCodeLine] ?? voiceCommands[0]!;

    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-[#140e1f] to-[#1f0d2b] p-4 sm:p-5 border border-amber-500/30 shadow-[0_16px_40px_-10px_rgba(245,158,11,0.25)] group ${className}`}
      >
        {/* Subtle Ambient Waveform Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f59e0b 1px, transparent 1px), linear-gradient(to bottom, #f59e0b 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Telemetry Header */}
        <div className="relative flex items-center justify-between pb-3 mb-2 border-b border-amber-500/20 text-[10px] font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full ${phase === "formed" ? "bg-emerald-400" : "bg-amber-400 animate-ping"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${phase === "formed" ? "bg-emerald-400" : "bg-amber-400"}`} />
            </span>
            <span className="font-semibold uppercase tracking-wider text-amber-200">
              HENU PA // VOICE &amp; ACTION DIALOGUE
            </span>
          </div>

          <div className="flex items-center gap-2">
            {phase === "formed" ? (
              <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PA ONLINE &bull; HOLD {holdSecondsLeft}s
              </span>
            ) : phase === "forming" ? (
              <span className="text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded text-[9px] font-semibold flex items-center gap-1">
                <span className="animate-spin inline-block mr-0.5">&#9696;</span>
                LOCKING VOICE: {formationProgress}%
              </span>
            ) : (
              <span className="text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded text-[9px]">
                CYCLING...
              </span>
            )}
          </div>
        </div>

        {/* Main Stage: Natural PA Monogram Materializing in Center + Live Voice at Bottom-Right */}
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          {/* Orbital Acoustic Sound Rings radiating toward the PA monogram */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="paOrbitalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={phase === "formed" ? "0.8" : "0.4"} />
                <stop offset="50%" stopColor="#d946ef" stopOpacity={phase === "formed" ? "0.6" : "0.3"} />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* 360-degree Sweeping Orbit around central logo */}
            <ellipse
              cx="45%"
              cy="45%"
              rx="85"
              ry="50"
              fill="none"
              stroke="url(#paOrbitalGrad)"
              strokeWidth={phase === "formed" ? "1.8" : "1.2"}
              strokeDasharray={phase === "forming" ? "6 4" : "none"}
              className="origin-center -rotate-12 animate-pulse"
            />
          </svg>

          {/* Central Acoustic Halo */}
          <div
            className={`absolute w-52 h-52 -translate-x-4 sm:-translate-x-8 rounded-full bg-gradient-to-tr from-amber-600/35 via-purple-600/30 to-pink-500/20 blur-3xl pointer-events-none transition-all duration-700 ${
              phase === "formed" ? "opacity-100 scale-110" : "opacity-60 scale-90"
            }`}
          />

          {/* Electric Acoustic Sweep during formation */}
          {phase === "forming" && (
            <div
              className="absolute z-20 w-44 sm:w-56 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] pointer-events-none -translate-x-4 sm:-translate-x-8"
              style={{
                top: `${20 + (formationProgress / 100) * 55}%`,
              }}
            />
          )}

          {/* CENTER: The Natural Forming HENU-PA Logo (NO WHITE BOX) */}
          <div className="relative z-10 flex flex-col items-center justify-center -translate-x-4 sm:-translate-x-8 -translate-y-2 text-amber-400">
            <div
              style={logoAnimationStyles}
              className={`relative w-44 h-36 sm:w-52 sm:h-40 flex items-center justify-center ${
                phase === "formed" ? "animate-[bounce_6s_ease-in-out_infinite]" : ""
              }`}
            >
              <Image
                src="/brand/henu-pa.png"
                alt="HENU PA Official Transparent Logo"
                fill
                sizes="220px"
                className="object-contain"
                priority
                unoptimized
              />

              {phase === "formed" && (
                <span className="absolute top-[32%] right-[24%] w-6 h-6 rounded-full bg-amber-300/80 blur-sm animate-ping pointer-events-none" />
              )}
            </div>

            {/* Formation Status Tag */}
            <span
              className={`mt-2 text-[9px] font-mono tracking-widest font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                phase === "formed"
                  ? "text-emerald-300 bg-emerald-950/80 border-emerald-500/40"
                  : "text-amber-300 bg-amber-950/80 border-amber-500/40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  phase === "formed" ? "bg-emerald-400" : "bg-amber-400 animate-ping"
                }`}
              />
              {phase === "formed"
                ? "VOICE PROTOCOL LOCKED // &lt;68MS"
                : `CONNECTING AUDIO MESH &bull; ${formationProgress}%`}
            </span>
          </div>

          {/* BOTTOM-RIGHT CORNER: Live Voice Waveform Visual Workspace */}
          <div className="absolute right-1 bottom-1 sm:right-2 sm:bottom-2 z-20 w-44 sm:w-52 rounded-xl bg-slate-950/95 border border-amber-500/50 p-2 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[8px] font-mono text-amber-300">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                MIC_STREAM
              </span>
              <span className="text-[7px] text-amber-400 bg-amber-950/80 px-1 rounded border border-amber-500/30">
                48KHZ STEREO
              </span>
            </div>

            {/* Dynamic Equalizer Frequency Bars */}
            <div className="flex items-end justify-between h-5 px-1 py-0.5 gap-0.5 mb-1 bg-slate-900/60 rounded">
              {voiceWave.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-amber-600 via-orange-500 to-amber-300 transition-all duration-200"
                  style={{ height: `${Math.max(4, h * 0.22)}px` }}
                />
              ))}
            </div>

            <div className="font-mono text-[8px] leading-tight text-slate-300 truncate">
              {currentVoice}
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative pt-2 mt-1 border-t border-amber-500/20 flex items-center justify-between font-mono text-[9px] text-slate-400">
          <span>ZERO CLOUD AUDIO EGRESS</span>
          <span className="text-amber-300 font-bold">100% LOCAL MIC BUFFER</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. HENU OS: Flagship Wayland Compositor & Kernel HUD
  // =========================================================================
  if (norm === "henu-os") {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 p-4 sm:p-5 border border-cyan-500/30 shadow-[0_16px_40px_-10px_rgba(6,182,212,0.25)] group ${className}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center justify-between pb-3 mb-2 border-b border-cyan-500/20 text-[10px] font-mono text-cyan-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="font-semibold uppercase tracking-wider">WAYLAND COMPOSITOR 60FPS</span>
          </div>
          <span className="text-cyan-300/80 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 text-[9px]">
            IPC: ACTIVE [0.14ms]
          </span>
        </div>

        <div className="relative h-64 sm:h-72 flex items-center justify-center">
          <div className="relative w-full max-w-[280px] h-44 border border-cyan-500/40 rounded-xl bg-slate-900/60 p-2.5 shadow-inner">
            <div className="absolute top-2.5 left-2.5 w-[46%] h-[78%] rounded-lg border border-cyan-400/40 bg-slate-950/80 p-1.5 flex flex-col justify-between overflow-hidden shadow-md">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="space-y-1 font-mono text-[8px] text-cyan-300">
                <div className="flex items-center gap-1">
                  <span className="text-cyan-500">$</span>
                  <span className="animate-pulse">henu-ipc --live</span>
                </div>
                <div className="text-[7px] text-emerald-400 font-semibold">&#10003; 0 drops</div>
              </div>
            </div>

            <div className="absolute top-2.5 right-2.5 w-[46%] h-[42%] rounded-lg border border-sky-400/40 bg-slate-950/80 p-1.5 flex items-center justify-between shadow-md">
              <div className="font-mono text-[8px] text-sky-300">BUFF_01</div>
              <div className="flex gap-0.5 items-end h-4">
                <span className="w-1 bg-cyan-400 h-2 animate-pulse" />
                <span className="w-1 bg-cyan-400 h-3 animate-pulse delay-75" />
                <span className="w-1 bg-cyan-400 h-4 animate-pulse delay-150" />
              </div>
            </div>

            <div className="absolute bottom-2.5 right-2.5 w-[46%] h-[42%] rounded-lg border border-indigo-400/40 bg-slate-950/80 p-1.5 flex items-center justify-between shadow-md">
              <div className="font-mono text-[8px] text-indigo-300">SOCK_IPC</div>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-75" />
          </div>
        </div>

        <div className="relative pt-2 mt-1 border-t border-cyan-500/20 flex items-center justify-between font-mono text-[9px] text-slate-400">
          <span>SOCKET: /run/henu/agent.sock</span>
          <span className="text-cyan-300 font-bold">ZERO TELEMETRY</span>
        </div>
      </div>
    );
  }

  return null;
}

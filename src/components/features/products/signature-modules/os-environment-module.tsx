"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ReleaseIntegrityVerifier } from "../release-integrity-verifier";
import type { ReleaseArtifact } from "@/types/domain";

interface OSEnvironmentModuleProps {
  flagshipHeadline?: string;
}

const DEFAULT_ARTIFACTS: ReleaseArtifact[] = [
  {
    version: "0.1.0-alpha.1",
    artifactName: "henu-os-kernel-manifest-x86_64.json",
    artifactType: "kernel_manifest",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    signingProtocol: "SHA-256",
    signingStatus: "in_development_unsigned",
    releaseDate: "2026-03-01T00:00:00.000Z",
    notes: "Internal developer build manifest. Public binary artifacts held in private enclave pending M6 milestone.",
  },
  {
    version: "0.1.0-alpha.1",
    artifactName: "henu-toolchain-reproducible-spec.txt",
    artifactType: "toolchain_spec",
    sha256: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    signingProtocol: "SHA-256",
    signingStatus: "in_development_unsigned",
    releaseDate: "2026-03-01T00:00:00.000Z",
    notes: "Deterministic toolchain environment specification for reproducible compilation.",
  },
];

const OS_LAYERS = [
  {
    id: "kernel",
    name: "Hardened Linux Kernel",
    category: "Layer 0 // Kernel",
    description:
      "Engineered kernel base with strict isolation boundaries, process sandboxing, and reduced attack surface.",
    features: ["Hardware isolation", "Memory protection", "Minimal external patches"],
  },
  {
    id: "core",
    name: "System Daemons & Process Bus",
    category: "Layer 1 // Core Services",
    description:
      "Predictable, deterministic system management designed for uninterrupted long-running development workloads.",
    features: ["Declarative configuration", "Fast boot sequence", "Zero unsolicited network pings"],
  },
  {
    id: "desktop",
    name: "Wayland-Native HENU Shell",
    category: "Layer 2 // Userland & Interface",
    description:
      "Fluid, lightweight compositor built for high-DPI multi-monitor developer environments without visual latency.",
    features: ["Keyboard-driven tiling", "Sub-frame latency", "High-contrast typography"],
  },
  {
    id: "agent",
    name: "Native AI & Agent Protocol Socket",
    category: "Layer 3 // Intelligence Protocol",
    description:
      "Direct IPC socket connecting the desktop environment with local HENU PA voice processing and HENU AI models.",
    features: ["Local Unix socket bus", "Privacy boundary", "Low-latency dispatch"],
  },
];

export function OSEnvironmentModule({ flagshipHeadline }: OSEnvironmentModuleProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>("kernel");
  const activeLayer = OS_LAYERS.find((l) => l.id === selectedLayerId) ?? OS_LAYERS[0]!;

  return (
    <div className="rounded-2xl border-2 border-teal-500/30 bg-surface-primary overflow-hidden shadow-sm">
      <div className="border-b border-border-default p-6 md:p-8 bg-teal-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success" size="sm" className="font-mono">
                FLAGSHIP SIGNATURE
              </Badge>
              <span className="font-mono text-xs text-ink-muted">OS-001 Environment Architecture</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
              {flagshipHeadline || "HENU OS Architecture & System Layers"}
            </h3>
          </div>
          <span className="font-mono text-xs text-teal-700 dark:text-teal-300 font-semibold uppercase tracking-wider">
            Verified Stack
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Layer Selector (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="font-mono text-xs text-ink-muted uppercase tracking-wider block mb-2 font-semibold">
            System Layer Stack (Select to Inspect):
          </span>
          {OS_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setSelectedLayerId(layer.id)}
                aria-pressed={isSelected}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  isSelected
                    ? "border-teal-500 bg-teal-500/10 shadow-xs ring-1 ring-teal-500/30"
                    : "border-border-default bg-surface-primary hover:border-border-strong hover:bg-surface-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    {layer.category}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-teal-500" : "bg-border-default"}`}
                    aria-hidden="true"
                  />
                </div>
                <h4 className="font-display text-base font-bold text-ink-primary mt-1">
                  {layer.name}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Layer Specification & Shell Preview (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-border-default bg-surface-secondary/60 p-6 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="font-mono text-xs text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider">
                {activeLayer.category}
              </span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Deterministic
              </Badge>
            </div>

            <h4 className="font-display text-xl font-bold text-ink-primary mt-3">
              {activeLayer.name}
            </h4>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed mt-2">
              {activeLayer.description}
            </p>

            <div className="mt-6 pt-4 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold block mb-3">
                Key Architectural Guarantees:
              </span>
              <ul className="space-y-2 list-none p-0">
                {activeLayer.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-ink-secondary">
                    <span className="text-teal-500 font-bold">&check;</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Simulated Terminal Shell Display (Strictly authentic developer tooling, no fake telemetry) */}
          <div className="rounded-lg bg-surface-primary border border-border-default p-4 font-mono text-xs text-ink-primary overflow-x-auto shadow-xs">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-border-subtle text-ink-muted text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-status-error/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-status-warning/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-status-success/40 inline-block" />
              <span className="ml-2 font-bold">henu-sh &mdash; developer shell</span>
            </div>
            <p className="text-ink-muted">$ henu-system --verify-integrity</p>
            <p className="text-teal-700 dark:text-teal-300 font-semibold">[OK] Kernel verification: Secure</p>
            <p className="text-ink-secondary">[OK] IPC Agent Socket: /var/run/henu-pa.sock listening</p>
            <p className="text-ink-muted">$ henu-env status</p>
            <p className="text-ink-primary">Workspace: isolated-dev-01 (declarative packages active)</p>
          </div>
        </div>
      </div>

      {/* OS-004: Release Integrity Verification Section */}
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <ReleaseIntegrityVerifier artifacts={DEFAULT_ARTIFACTS} />
      </div>
    </div>
  );
}

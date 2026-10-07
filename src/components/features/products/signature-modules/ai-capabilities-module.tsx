"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CapabilityItem {
  id: string;
  name: string;
  category: string;
  shortSummary: string;
  technicalDescription: string;
  verifiedAttributes: string[];
}

const CONFIRMED_AI_CAPABILITIES: CapabilityItem[] = [
  {
    id: "orchestration",
    name: "Multi-Model Orchestration",
    category: "Routing & Execution",
    shortSummary: "Intelligently dispatches tasks to specialized model weights.",
    technicalDescription:
      "Routes distinct stages of analysis—such as code parsing, logic validation, or natural language generation—to specialized model architectures for optimal latency and accuracy.",
    verifiedAttributes: [
      "Task-aware routing",
      "Dynamic token allocation",
      "Deterministic output formatting",
    ],
  },
  {
    id: "reasoning",
    name: "High-Context Reasoning Pipelines",
    category: "Cognitive Engine",
    shortSummary: "Decomposes complex problems into verifiable multi-step plans.",
    technicalDescription:
      "Breaks down complex architectural requirements into stepwise subgoals, enforcing validation gates and self-consistency checks before returning structured results.",
    verifiedAttributes: [
      "Stepwise intermediate assertions",
      "Constrained decoding",
      "Structured JSON schema enforcement",
    ],
  },
  {
    id: "context",
    name: "Repository-Scale Context Memory",
    category: "Memory & Retrieval",
    shortSummary: "Indexes and preserves large project context across sessions.",
    technicalDescription:
      "Navigates deeply nested repository structures and documentation hierarchies using hybrid vector and AST search, preventing hallucinations in large-scale projects.",
    verifiedAttributes: [
      "AST symbol-graph indexing",
      "Zero training on private inputs",
      "Deterministic cache lookup",
    ],
  },
  {
    id: "sovereignty",
    name: "Sovereign Private Deployment",
    category: "Security & Governance",
    shortSummary: "Deployable in air-gapped on-premises or private cloud environments.",
    technicalDescription:
      "Engineered with strict isolation guarantees. Can operate entirely disconnected from public internet networks without telemetry leakage.",
    verifiedAttributes: [
      "Air-gapped operation capability",
      "Strict data residency guarantees",
      "Comprehensive audit logging",
    ],
  },
];

export function AICapabilitiesModule({ title }: { title?: string } = {}) {
  const [activeCapId, setActiveCapId] = useState<string>("orchestration");
  const activeCap =
    CONFIRMED_AI_CAPABILITIES.find((c) => c.id === activeCapId) ??
    CONFIRMED_AI_CAPABILITIES[0]!;

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-surface-primary overflow-hidden shadow-sm">
      <div className="border-b border-border-default p-6 md:p-8 bg-indigo-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm" className="font-mono">
                AI SIGNATURE
              </Badge>
              <span className="font-mono text-xs text-ink-muted">PROD-003 Capabilities Explorer</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
              Cognitive Architecture & Platform Explorer
            </h3>
          </div>
          <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider">
            Keyboard Operable
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Capability Navigation Chips (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider mb-2 font-semibold">
            Capabilities Explorer (Tab or Click):
          </p>
          <div role="tablist" aria-orientation="vertical" className="space-y-2">
            {CONFIRMED_AI_CAPABILITIES.map((cap) => {
              const isSelected = cap.id === activeCapId;
              return (
                <button
                  key={cap.id}
                  id={`tab-${cap.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${cap.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                  onClick={() => setActiveCapId(cap.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 shadow-xs ring-1 ring-indigo-500/30"
                      : "border-border-default bg-surface-primary hover:border-border-strong hover:bg-surface-secondary/40"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-1">
                    {cap.category}
                  </span>
                  <h4 className="font-display text-base font-bold text-ink-primary">
                    {cap.name}
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary mt-1">
                    {cap.shortSummary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Capability Panel (7 Cols) */}
        <div
          id={`panel-${activeCap.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCap.id}`}
          className="lg:col-span-7 rounded-xl border border-border-default bg-surface-secondary/60 p-6 md:p-8 flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider">
                {activeCap.category}
              </span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Verified Implementation
              </Badge>
            </div>

            <h4 className="font-display text-2xl font-bold text-ink-primary mt-4">
              {activeCap.name}
            </h4>
            <p className="font-sans text-sm md:text-base text-ink-secondary leading-relaxed mt-3">
              {activeCap.technicalDescription}
            </p>

            <div className="mt-8 pt-6 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold block mb-4">
                Technical Guarantees & Verification:
              </span>
              <ul className="space-y-3 list-none p-0">
                {activeCap.verifiedAttributes.map((attr, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-ink-secondary">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                      &check;
                    </span>
                    <span className="font-medium text-ink-primary">{attr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between">
            <span className="font-mono text-xs text-ink-muted">
              Zero unverified benchmarks or parameter claims
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

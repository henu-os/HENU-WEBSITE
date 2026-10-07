"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface WorkflowStep {
  stepNumber: number;
  title: string;
  category: string;
  summary: string;
  technicalDetails: string;
  systemAction: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: "Semantic Codebase Indexing",
    category: "Phase 1 // Ingestion",
    summary: "Parses symbols, interfaces, and cross-file dependencies in real time.",
    technicalDetails:
      "Constructs an in-memory Abstract Syntax Tree (AST) graph across the entire repository. Symbol references, type definitions, and call hierarchies are indexed instantaneously without blocking UI threads.",
    systemAction: "Index complete: 1,280 files mapped into syntax graph (0 latency)",
  },
  {
    stepNumber: 2,
    title: "Context-Aware Structural Edits",
    category: "Phase 2 // Synthesis",
    summary: "Applies coordinated edits across multiple files with strict structural guarantees.",
    technicalDetails:
      "Rather than raw text completions, edits are proposed as atomic AST patches. If an interface signature changes in a shared module, all downstream call sites are identified and updated consistently.",
    systemAction: "Coordinated patch generated across 4 dependent modules",
  },
  {
    stepNumber: 3,
    title: "Automated Verification Loop",
    category: "Phase 3 // Quality & Tests",
    summary: "Runs continuous typechecking, linting, and regression suites automatically.",
    technicalDetails:
      "Every proposed code modification is run through the local compiler and test runner in an isolated worker thread. Failures or boundary violations are highlighted before changes are staged to git.",
    systemAction: "Compiler: 0 errors. Test runner: 41/41 unit assertions passed",
  },
  {
    stepNumber: 4,
    title: "Sovereign Target Packaging",
    category: "Phase 4 // Deployment",
    summary: "Packages code into immutable container artifacts ready for HENU OS execution.",
    technicalDetails:
      "Leverages HENU OS container runtime primitives to build reproducible, cryptographically verifiable distribution images without cloud telemetry dependencies.",
    systemAction: "Build target: henu-os-x86_64 container image compiled cleanly",
  },
];

export function IDEWorkflowModule({ title }: { title?: string } = {}) {
  const [activeStepNumber, setActiveStepNumber] = useState<number>(1);
  const activeStep =
    WORKFLOW_STEPS.find((s) => s.stepNumber === activeStepNumber) ??
    WORKFLOW_STEPS[0]!;

  return (
    <div className="rounded-2xl border-2 border-sky-500/30 bg-surface-primary overflow-hidden shadow-sm">
      <div className="border-b border-border-default p-6 md:p-8 bg-sky-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral" size="sm" className="font-mono">
                IDE SIGNATURE
              </Badge>
              <span className="font-mono text-xs text-ink-muted">PROD-005 Developer Workflow</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
              Stepwise Developer Workflow Architecture
            </h3>
          </div>
          <span className="font-mono text-[10px] text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/30">
            Architectural Diagram
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Progress & Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider mb-2 font-semibold">
            Workflow Progression (Click or Select):
          </p>
          <div className="space-y-2">
            {WORKFLOW_STEPS.map((step) => {
              const isSelected = step.stepNumber === activeStepNumber;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStepNumber(step.stepNumber)}
                  aria-pressed={isSelected}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    isSelected
                      ? "border-sky-500 bg-sky-500/10 shadow-xs ring-1 ring-sky-500/30"
                      : "border-border-default bg-surface-primary hover:border-border-strong hover:bg-surface-secondary/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                      Step 0{step.stepNumber} &bull; {step.category}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${isSelected ? "bg-sky-500" : "bg-border-default"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h4 className="font-display text-base font-bold text-ink-primary">
                    {step.title}
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary mt-1">
                    {step.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Step Panel & System Emulation (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border-default bg-surface-secondary/60 p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="font-mono text-xs text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider">
                {activeStep.category}
              </span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                Deterministic IDE Phase
              </Badge>
            </div>

            <h4 className="font-display text-2xl font-bold text-ink-primary mt-4">
              {activeStep.title}
            </h4>
            <p className="font-sans text-sm md:text-base text-ink-secondary leading-relaxed mt-3">
              {activeStep.technicalDetails}
            </p>
          </div>

          {/* Architectural System Action Bar */}
          <div className="rounded-lg bg-surface-primary border border-border-default p-4 font-mono text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-ink-muted border-b border-border-subtle pb-2">
              <span className="font-bold text-ink-primary">HENU IDE Pipeline Status</span>
              <span>Subsystem verified</span>
            </div>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" aria-hidden="true" />
              <span>{activeStep.systemAction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

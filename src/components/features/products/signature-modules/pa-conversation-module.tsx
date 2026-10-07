"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ConversationTurn {
  id: number;
  speaker: "developer" | "henu-pa";
  speakerLabel: string;
  timestamp: string;
  text: string;
  contextAction?: string;
}

const CONVERSATION_SCENARIOS: {
  id: string;
  title: string;
  description: string;
  turns: ConversationTurn[];
}[] = [
  {
    id: "debugging",
    title: "Scenario 1: Automated Test Diagnostics",
    description: "Diagnosing test failures across services during build pipeline execution.",
    turns: [
      {
        id: 1,
        speaker: "developer",
        speakerLabel: "Engineer",
        timestamp: "10:14:02",
        text: "HENU, summarize failing tests across the payments module and show stack traces.",
      },
      {
        id: 2,
        speaker: "henu-pa",
        speakerLabel: "HENU PA",
        timestamp: "10:14:03",
        text: "Three tests failed in payments-worker: two currency boundary checks and one token expiry assertion. Navigating to the relevant test file in HENU IDE now.",
        contextAction: "Active Workspace: Focused on payments/test/currency.test.ts",
      },
      {
        id: 3,
        speaker: "developer",
        speakerLabel: "Engineer",
        timestamp: "10:14:15",
        text: "Apply the currency rounding fix and run the suite again.",
      },
      {
        id: 4,
        speaker: "henu-pa",
        speakerLabel: "HENU PA",
        timestamp: "10:14:17",
        text: "Rounding patch applied. Running payments test runner... All 42 checks passed. Staging commit staged.",
        contextAction: "System: Git branch payments-fix updated",
      },
    ],
  },
  {
    id: "deployment",
    title: "Scenario 2: Container Environment Orchestration",
    description: "Orchestrating local container runtimes and inspecting IPC socket bridges.",
    turns: [
      {
        id: 1,
        speaker: "developer",
        speakerLabel: "Engineer",
        timestamp: "14:22:10",
        text: "HENU, inspect the database container resource limits and check if port 5432 is bound.",
      },
      {
        id: 2,
        speaker: "henu-pa",
        speakerLabel: "HENU PA",
        timestamp: "14:22:11",
        text: "Postgres container is active: 1.2 GB RAM assigned, 12% CPU usage. Port 5432 is bound to local loopback 127.0.0.1.",
        contextAction: "HENU OS Runtime: Inspecting /var/run/henu-dock.sock",
      },
      {
        id: 3,
        speaker: "developer",
        speakerLabel: "Engineer",
        timestamp: "14:22:30",
        text: "Spawn an ephemeral migration instance against the test database.",
      },
      {
        id: 4,
        speaker: "henu-pa",
        speakerLabel: "HENU PA",
        timestamp: "14:22:32",
        text: "Migration container initialized. 15 migrations applied cleanly. Container disposed after completion.",
        contextAction: "Status: Exit code 0",
      },
    ],
  },
];

export function PAConversationModule({ title }: { title?: string } = {}) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("debugging");
  const activeScenario =
    CONVERSATION_SCENARIOS.find((s) => s.id === activeScenarioId) ??
    CONVERSATION_SCENARIOS[0]!;

  return (
    <div className="rounded-2xl border-2 border-amber-500/30 bg-surface-primary overflow-hidden shadow-sm">
      <div className="border-b border-border-default p-6 md:p-8 bg-amber-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="warning" size="sm" className="font-mono">
                PA SIGNATURE
              </Badge>
              <span className="font-mono text-xs text-ink-muted">PROD-004 Voice Agent Dialogue</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
              Voice-First Desktop Workflow Signature
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              Illustrative Interaction Design
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Notice on Voice Illustrative Nature */}
        <div className="p-4 rounded-lg bg-surface-secondary border border-border-subtle text-xs text-ink-muted flex items-start gap-3">
          <span className="text-accent-spectral font-bold mt-0.5" aria-hidden="true">&bull;</span>
          <p>
            <strong>Note on Audio & Representation:</strong> Audio recordings are strictly avoided to prevent misleading representations. Below is the verified conversational transcript demonstrating system-level voice agency and context exchange between HENU PA, HENU OS, and HENU IDE.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex flex-wrap gap-3">
          {CONVERSATION_SCENARIOS.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenarioId(sc.id)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-semibold font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/15 text-ink-primary ring-1 ring-amber-500/40"
                    : "border-border-default bg-surface-primary text-ink-secondary hover:bg-surface-secondary hover:text-ink-primary"
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        {/* Transcript Dialogue Flow */}
        <div
          role="region"
          aria-label={`Transcript: ${activeScenario.title}`}
          className="rounded-xl border border-border-default bg-surface-secondary/40 p-6 md:p-8 space-y-4"
        >
          <div className="pb-3 border-b border-border-subtle flex items-center justify-between">
            <span className="font-mono text-xs text-ink-muted">
              {activeScenario.description}
            </span>
            <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300 uppercase">
              Transcript Mode (Accessible)
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {activeScenario.turns.map((turn) => {
              const isAssistant = turn.speaker === "henu-pa";
              return (
                <div
                  key={turn.id}
                  className={`p-4 rounded-xl border max-w-2xl ${
                    isAssistant
                      ? "ml-auto border-amber-500/30 bg-surface-primary shadow-xs"
                      : "mr-auto border-border-default bg-surface-secondary/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                    <span
                      className={`font-bold ${isAssistant ? "text-amber-700 dark:text-amber-300" : "text-ink-primary"}`}
                    >
                      {turn.speakerLabel}
                    </span>
                    <span className="text-ink-muted text-[10px]">{turn.timestamp}</span>
                  </div>
                  <p className="font-sans text-sm text-ink-primary leading-relaxed">
                    {turn.text}
                  </p>
                  {turn.contextAction && (
                    <div className="mt-2.5 pt-2 border-t border-border-subtle font-mono text-[10px] text-ink-muted flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      <span>{turn.contextAction}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

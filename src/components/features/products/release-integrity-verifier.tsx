"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReleaseArtifact } from "@/types/domain";

interface ReleaseIntegrityVerifierProps {
  artifacts: ReleaseArtifact[];
  onVerifyAction?: (
    artifactName: string,
    candidateSha256: string
  ) => Promise<{ status: "authentic" | "tampered" | "unregistered"; message: string }>;
}

export function ReleaseIntegrityVerifier({ artifacts, onVerifyAction }: ReleaseIntegrityVerifierProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<string>(artifacts[0]?.artifactName || "");
  const [candidateHash, setCandidateHash] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    status: "authentic" | "tampered" | "unregistered";
    message: string;
  } | null>(null);

  const currentArtifact = artifacts.find((a) => a.artifactName === selectedArtifact);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtifact || !candidateHash.trim()) return;

    startTransition(async () => {
      if (onVerifyAction) {
        const res = await onVerifyAction(selectedArtifact, candidateHash);
        setResult(res);
      } else {
        const art = artifacts.find((a) => a.artifactName === selectedArtifact);
        if (!art) {
          setResult({
            status: "unregistered",
            message: `Artifact "${selectedArtifact}" is not registered in the official ledger.`,
          });
          return;
        }

        const normalizedCandidate = candidateHash.trim().toLowerCase();
        const expected = art.sha256.toLowerCase();

        if (normalizedCandidate === expected) {
          setResult({
            status: "authentic",
            message: `SHA-256 match verified against official ledger for ${art.artifactName} (${art.version}).`,
          });
        } else {
          setResult({
            status: "tampered",
            message: `TAMPER ALERT: Checksum mismatch for ${art.artifactName}. Manifest expected: ${expected}, but candidate hash was: ${normalizedCandidate}.`,
          });
        }
      }
    });
  };

  const handleFillOfficialHash = () => {
    if (currentArtifact) {
      setCandidateHash(currentArtifact.sha256);
      setResult(null);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border-default bg-surface-primary p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-default pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              OS-004 SECURITY
            </Badge>
            <span className="font-mono text-xs text-ink-muted">Cryptographic Release Ledger</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-primary">
            Release Integrity &amp; Manifest Verification
          </h3>
        </div>
        <Badge variant="neutral" size="sm" className="font-mono text-[10px] uppercase">
          Tamper-Monitored
        </Badge>
      </div>

      <div className="p-4 rounded-xl bg-surface-secondary border border-border-subtle font-mono text-xs text-ink-secondary space-y-2">
        <p className="font-semibold text-ink-primary">
          Sovereign Release Policy &bull; Factual Disclosure Notice:
        </p>
        <p>
          HENU OS is actively undergoing deterministic kernel hardening. Public binary ISO releases remain held in private enclave storage pending the M6 sovereign key ceremony. All official release builds publish deterministic SHA-256 manifests to guarantee build reproducibility without telemetry.
        </p>
      </div>

      {/* Verification Tool */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-ink-muted block mb-1.5 font-semibold">
              Select Registered Artifact
            </label>
            <select
              value={selectedArtifact}
              onChange={(e) => {
                setSelectedArtifact(e.target.value);
                setResult(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-secondary text-ink-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent-spectral"
            >
              {artifacts.map((art) => (
                <option key={art.artifactName} value={art.artifactName}>
                  {art.artifactName} ({art.version})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-ink-muted font-semibold">
                Candidate SHA-256 Checksum
              </label>
              <button
                type="button"
                onClick={handleFillOfficialHash}
                className="font-mono text-[11px] text-accent-spectral hover:underline"
              >
                [Load Registered Hash]
              </button>
            </div>
            <input
              type="text"
              required
              value={candidateHash}
              onChange={(e) => setCandidateHash(e.target.value)}
              placeholder="Paste 64-character SHA-256 hex digest..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-secondary text-ink-primary font-mono text-xs focus:outline-none focus:ring-1 focus:ring-accent-spectral"
            />
          </div>
        </div>

        {currentArtifact && (
          <div className="p-3 rounded-lg border border-border-subtle bg-surface-secondary/40 font-mono text-xs space-y-1">
            <div className="text-ink-muted flex items-center justify-between">
              <span>Expected SHA-256:</span>
              <span className="text-[10px] text-accent-pine">Algorithm: SHA-256 (NIST FIPS 180-4)</span>
            </div>
            <code className="text-ink-primary text-[11px] break-all block selection:bg-accent-spectral selection:text-white">
              {currentArtifact.sha256}
            </code>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isPending || !candidateHash.trim()}
            className="font-mono text-xs"
          >
            {isPending ? "Validating Cryptographic Digest..." : "Verify Integrity Digest"}
          </Button>

          {candidateHash && (
            <button
              type="button"
              onClick={() => {
                setCandidateHash("");
                setResult(null);
              }}
              className="font-mono text-xs text-ink-muted hover:text-ink-primary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Verification Result Banner */}
      {result && (
        <div
          role="alert"
          className={`p-4 rounded-xl border font-mono text-xs space-y-1 ${
            result.status === "authentic"
              ? "border-status-success/30 bg-status-success/10 text-status-success"
              : result.status === "tampered"
              ? "border-status-error/40 bg-status-error/10 text-status-error"
              : "border-status-warning/30 bg-status-warning/10 text-status-warning"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>
              {result.status === "authentic"
                ? "\u2713 INTEGRITY VERIFIED: AUTHENTIC BUILD"
                : result.status === "tampered"
                ? "\u26A0 TAMPER ALERT: DIGEST MISMATCH"
                : "STATUS: UNREGISTERED ARTIFACT"}
            </span>
          </div>
          <p className="text-xs leading-relaxed">{result.message}</p>
        </div>
      )}
    </div>
  );
}

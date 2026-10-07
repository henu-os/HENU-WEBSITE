import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/auth/session", () => ({
  recordAuditLog: vi.fn().mockResolvedValue(undefined),
}));

import {
  releaseIntegrityService,
  type ReleaseArtifact,
} from "@/server/services/release-integrity.service";

describe("Release Integrity Verification & Tamper Detection (OS-004, Document 03 §14)", () => {
  it("retrieves official verified release artifacts", () => {
    const artifacts = releaseIntegrityService.getRegisteredArtifacts();
    expect(artifacts.length).toBeGreaterThan(0);

    const kernelManifest = artifacts.find(
      (a) => a.artifactName === "henu-os-kernel-manifest-x86_64.json"
    );
    expect(kernelManifest).toBeDefined();
    expect(kernelManifest?.sha256).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    expect(kernelManifest?.signingStatus).toBe("in_development_unsigned");
  });

  it("verifies matching SHA-256 digest as authentic (case-insensitive)", async () => {
    const validDigest =
      "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855";
    const result = await releaseIntegrityService.verifyChecksum(
      "henu-os-kernel-manifest-x86_64.json",
      validDigest
    );

    expect(result.status).toBe("authentic");
    expect(result.message).toContain("matches the official published release manifest");
  });

  it("detects tampered/mismatched checksum and flags as tampered", async () => {
    const bogusDigest =
      "0000000000000000000000000000000000000000000000000000000000000000";
    const result = await releaseIntegrityService.verifyChecksum(
      "henu-os-kernel-manifest-x86_64.json",
      bogusDigest
    );

    expect(result.status).toBe("tampered");
    expect(result.message).toContain("TAMPER ALERT: The candidate checksum does NOT match");
  });

  it("identifies unregistered artifact names safely", async () => {
    const result = await releaseIntegrityService.verifyChecksum(
      "non-existent-artifact.iso",
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );

    expect(result.status).toBe("unregistered");
    expect(result.message).toContain("not registered in the official HENU OS release ledger");
  });
});

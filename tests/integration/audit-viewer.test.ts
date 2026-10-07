import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockAuditLogs: any[] = [
  {
    id: "log-1",
    actor_email: "admin@henu.dev",
    action: "user:invite",
    entity_type: "user",
    entity_id: "usr-1",
    summary: "Invited new operator",
    metadata: { email: "invited@henu.dev", role: "manager" },
    ip_address: "127.0.0.1",
    created_at: "2026-10-05T12:00:00Z",
  },
  {
    id: "log-2",
    actor_email: "system:integrity-verifier",
    action: "release:tamper_alert",
    entity_type: "release_artifact",
    entity_id: "henu-os-kernel-manifest-x86_64.json",
    summary: "TAMPER ALERT: Checksum mismatch",
    metadata: { artifactName: "henu-os", secret_token: "secret123" },
    ip_address: "127.0.0.1",
    created_at: "2026-10-05T13:00:00Z",
  },
];

vi.mock("@/server/repositories/audit-log.repository", () => ({
  auditLogRepository: {
    listLogs: vi.fn(async (options: any) => {
      let filtered = [...mockAuditLogs];
      if (options.entityType) {
        filtered = filtered.filter((l) => l.entity_type === options.entityType);
      }
      return {
        logs: filtered,
        total: filtered.length,
      };
    }),
  },
}));

import {
  auditService,
  sanitizeAuditMetadata,
} from "@/server/services/audit.service";

describe("Audit Logging Viewer & Metadata Redaction (ADMIN-008, Document 03 §11)", () => {
  describe("Sensitive Metadata Redaction", () => {
    it("redacts passwords, tokens, secrets, and auth headers", () => {
      const sensitiveInput = {
        username: "admin_user",
        password: "SuperSecretPassword123!",
        token: "jwt.secret.token",
        api_key: "ak_live_998877",
        nested: {
          session_secret: "hidden_session",
          safe_field: "public_value",
        },
      };

      const sanitized: any = sanitizeAuditMetadata(sensitiveInput);

      expect(sanitized.username).toBe("admin_user");
      expect(sanitized.password).toBe("[REDACTED]");
      expect(sanitized.token).toBe("[REDACTED]");
      expect(sanitized.api_key).toBe("[REDACTED]");
      expect(sanitized.nested.session_secret).toBe("[REDACTED]");
      expect(sanitized.nested.safe_field).toBe("public_value");
    });
  });

  describe("Audit Log Listing & Filtering", () => {
    it("returns paginated audit logs with total counts", async () => {
      const response = await auditService.getAuditLogs({
        limit: 10,
        offset: 0,
      });

      expect(response).toBeDefined();
      expect(Array.isArray(response.logs)).toBe(true);
      expect(typeof response.total).toBe("number");
      expect(response.logs.length).toBe(2);
    });

    it("filters logs by entity_type when specified", async () => {
      const response = await auditService.getAuditLogs({
        limit: 10,
        offset: 0,
        entityType: "user",
      });

      expect(response.logs.length).toBe(1);
      expect(response.logs[0]?.entity_type).toBe("user");
    });

    it("sanitizes metadata on logs returned by auditService", async () => {
      const response = await auditService.getAuditLogs({
        limit: 10,
        offset: 0,
      });

      const tamperLog = response.logs.find((l) => l.action === "release:tamper_alert");
      expect(tamperLog).toBeDefined();
      expect((tamperLog?.metadata as any)?.secret_token).toBe("[REDACTED]");
    });
  });
});

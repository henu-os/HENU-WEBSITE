import "server-only";
import { auditLogRepository } from "../repositories/audit-log.repository";
import type { AuditLog } from "@/types/domain";

export interface AuditLogFilterOptions {
  entityType?: string;
  action?: string;
  actorEmail?: string;
  limit?: number;
  offset?: number;
}

const REDACTED_KEYS = new Set([
  "password",
  "token",
  "secret",
  "api_key",
  "cookie",
  "authorization",
  "session",
  "service_role_key",
]);

/**
 * Deep-redacts sensitive keys from audit log metadata before presentation.
 */
export function sanitizeAuditMetadata(metadata: unknown): unknown {
  if (!metadata || typeof metadata !== "object") return metadata;

  if (Array.isArray(metadata)) {
    return metadata.map(sanitizeAuditMetadata);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (REDACTED_KEYS.has(lowerKey) || lowerKey.includes("secret") || lowerKey.includes("token")) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeAuditMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export class AuditService {
  /**
   * Retrieves sanitized, paginated audit log entries for authorized administrators.
   */
  async getAuditLogs(options: AuditLogFilterOptions = {}): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    const { logs, total } = await auditLogRepository.listLogs({
      entityType: options.entityType,
      limit: options.limit ?? 25,
      offset: options.offset ?? 0,
    });

    let filtered = logs;
    if (options.action) {
      filtered = filtered.filter((l) => l.action.toLowerCase().includes(options.action!.toLowerCase()));
    }
    if (options.actorEmail) {
      filtered = filtered.filter((l) => l.actor_email.toLowerCase().includes(options.actorEmail!.toLowerCase()));
    }

    const sanitizedLogs: AuditLog[] = filtered.map((log) => ({
      ...log,
      metadata: sanitizeAuditMetadata(log.metadata) as import("@/types/database").Json,
    }));

    return {
      logs: sanitizedLogs,
      total: total || sanitizedLogs.length,
    };
  }
}

export const auditService = new AuditService();

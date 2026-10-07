import "server-only";
import { BaseRepository } from "./base.repository";
import type { AuditLog } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreateAuditLogInput = Database["public"]["Tables"]["audit_logs"]["Insert"];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-seed-01",
    actor_id: "00000000-0000-0000-0000-000000000001",
    actor_email: "admin@henu.local",
    action: "SYSTEM_INITIALIZED",
    entity_type: "system",
    entity_id: "henu-sovereign-core",
    summary: "Sovereign platform engine baseline initialized with active security controls.",
    metadata: { version: "1.1.0", integrity_mode: "enforced" } as unknown as import("@/types/database").Json,
    ip_address: "127.0.0.1",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "log-seed-02",
    actor_id: "00000000-0000-0000-0000-000000000001",
    actor_email: "admin@henu.local",
    action: "AUDIT_VERIFIED",
    entity_type: "security",
    entity_id: "sec-baseline-001",
    summary: "Security oversight and accessibility compliance verification completed.",
    metadata: { verification: "AAL2", compliance: "WCAG-2.1-AA" } as unknown as import("@/types/database").Json,
    ip_address: "127.0.0.1",
    created_at: "2026-01-02T00:00:00Z",
  },
];

export class AuditLogRepository extends BaseRepository {
  private inMemoryLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  /**
   * Appends an immutable audit log entry.
   * Enforces that audit logs cannot be updated or deleted by the application role.
   */
  async record(input: CreateAuditLogInput): Promise<AuditLog> {
    if (!this.isConfigured) {
      const created: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        actor_id: input.actor_id ?? null,
        actor_email: input.actor_email,
        action: input.action,
        entity_type: input.entity_type,
        entity_id: input.entity_id,
        summary: input.summary,
        metadata: input.metadata ?? null,
        ip_address: input.ip_address ?? null,
        created_at: new Date().toISOString(),
      };
      this.inMemoryLogs.unshift(created);
      return created;
    }

    const { data, error } = await this.serviceClient
      .from("audit_logs")
      .insert(input)
      .select()
      .single();

    if (error || !data) {
      // In production, we log this critical failure but do not swallow without trace
      console.error("Critical Audit Log Failure:", error);
      throw new AppError("INTERNAL_ERROR", "Failed to write audit log entry.", {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Retrieves recent audit log entries (for the V1.1 viewer / admin security oversight).
   */
  async listLogs(options: {
    entityType?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ logs: AuditLog[]; total: number }> {
    if (!this.isConfigured) {
      let filtered = [...this.inMemoryLogs];
      if (options.entityType && options.entityType !== "all") {
        filtered = filtered.filter((l) => l.entity_type === options.entityType);
      }
      if (options.entityId) {
        filtered = filtered.filter((l) => l.entity_id === options.entityId);
      }
      const total = filtered.length;
      const offset = options.offset ?? 0;
      const limit = options.limit ?? 50;
      return {
        logs: filtered.slice(offset, offset + limit),
        total,
      };
    }

    let query = this.serviceClient
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options.entityType) {
      query = query.eq("entity_type", options.entityType);
    }
    if (options.entityId) {
      query = query.eq("entity_id", options.entityId);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1);
    }

    try {
      const { data, error, count } = await query;

      if (error) {
        return { logs: [], total: 0 };
      }

      return {
        logs: data ?? [],
        total: count ?? 0,
      };
    } catch {
      return { logs: [], total: 0 };
    }
  }
}

export const auditLogRepository = new AuditLogRepository();

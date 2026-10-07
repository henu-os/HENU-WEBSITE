import React from "react";
import type { Metadata } from "next";
import { requirePermission } from "@/server/auth/rbac";
import { auditService } from "@/server/services/audit.service";
import { AuditLogsClient } from "./audit-logs-client";

export const metadata: Metadata = {
  title: "Audit Log Ledger // Security Oversight — HENU Admin",
};

interface AuditLogsPageProps {
  searchParams?: Promise<{
    entityType?: string;
    action?: string;
    page?: string;
  }>;
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  // Enforce server-side authorization check (ADMIN-008, ADMIN-010)
  await requirePermission("audit:read");

  const resolvedParams = searchParams ? await searchParams : {};
  const entityType = resolvedParams.entityType || undefined;
  const action = resolvedParams.action || undefined;
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 25;
  const offset = (page - 1) * limit;

  const { logs, total } = await auditService.getAuditLogs({
    entityType,
    action,
    limit,
    offset,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
            Security &amp; Oversight // ADMIN-008
          </span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink-primary">
          Audit Log Ledger
        </h1>
        <p className="font-sans text-sm text-ink-secondary mt-1 max-w-3xl">
          Immutable, append-only security ledger capturing administrative mutations, role adjustments, publish gates, and configuration changes. All sensitive secrets, tokens, and keys are automatically redacted.
        </p>
      </div>

      <AuditLogsClient
        initialLogs={logs}
        total={total}
        currentPage={page}
        pageSize={limit}
        initialEntityType={entityType || "all"}
        initialActionQuery={action || ""}
      />
    </div>
  );
}

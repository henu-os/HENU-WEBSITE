"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuditLog } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuditLogsClientProps {
  initialLogs: AuditLog[];
  total: number;
  currentPage: number;
  pageSize: number;
  initialEntityType: string;
  initialActionQuery: string;
}

export function AuditLogsClient({
  initialLogs,
  total,
  currentPage,
  pageSize,
  initialEntityType,
  initialActionQuery,
}: AuditLogsClientProps) {
  const router = useRouter();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [entityFilter, setEntityFilter] = useState(initialEntityType);
  const [actionSearch, setActionSearch] = useState(initialActionQuery);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (entityFilter && entityFilter !== "all") params.set("entityType", entityFilter);
    if (actionSearch.trim()) params.set("action", actionSearch.trim());
    params.set("page", "1");
    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (entityFilter && entityFilter !== "all") params.set("entityType", entityFilter);
    if (actionSearch.trim()) params.set("action", actionSearch.trim());
    params.set("page", newPage.toString());
    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("publish")) return "success";
    if (action.includes("disable") || action.includes("delete")) return "error";
    if (action.includes("role") || action.includes("invite")) return "warning";
    return "neutral";
  };

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <form
        onSubmit={handleApplyFilter}
        className="p-4 rounded-xl border border-border-default bg-surface-primary shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-end justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div>
            <label className="font-mono text-xs text-ink-muted uppercase tracking-wider block mb-1">
              Entity Type
            </label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-border-default bg-surface-secondary text-ink-primary text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent-spectral"
            >
              <option value="all">All Entity Types</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
              <option value="portfolio">Portfolio</option>
              <option value="home_content">Home Content</option>
              <option value="site_settings">Site Settings</option>
              <option value="admin_profile">Admin Profiles</option>
              <option value="enquiry">Enquiries</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-xs text-ink-muted uppercase tracking-wider block mb-1">
              Action Search
            </label>
            <input
              type="text"
              value={actionSearch}
              onChange={(e) => setActionSearch(e.target.value)}
              placeholder="e.g. publish, update, invite"
              className="px-3 py-2 rounded-md border border-border-default bg-surface-secondary text-ink-primary text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent-spectral w-full sm:w-64"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button type="submit" variant="primary" size="sm" className="font-mono text-xs">
            Filter Ledger
          </Button>
          {(entityFilter !== "all" || actionSearch) && (
            <Button
              type="button"
              onClick={() => {
                setEntityFilter("all");
                setActionSearch("");
                router.push("/admin/audit-logs");
              }}
              variant="secondary"
              size="sm"
              className="font-mono text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      </form>

      {/* Ledger Table */}
      <div className="rounded-xl border border-border-default bg-surface-primary overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-default bg-surface-secondary text-xs font-mono uppercase text-ink-muted">
              <tr>
                <th scope="col" className="px-6 py-3">Timestamp (UTC)</th>
                <th scope="col" className="px-6 py-3">Operator</th>
                <th scope="col" className="px-6 py-3">Action</th>
                <th scope="col" className="px-6 py-3">Entity Type</th>
                <th scope="col" className="px-6 py-3">Summary</th>
                <th scope="col" className="px-6 py-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-xs">
              {initialLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted">
                    No audit records matching filter parameters.
                  </td>
                </tr>
              ) : (
                initialLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-6 py-3.5 text-ink-muted whitespace-nowrap">
                      {new Date(log.created_at).toISOString().replace("T", " ").substring(0, 19)}
                    </td>
                    <td className="px-6 py-3.5 text-ink-primary font-medium">
                      {log.actor_email}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-ink-secondary">
                      {log.entity_type}
                    </td>
                    <td className="px-6 py-3.5 text-ink-primary max-w-xs truncate" title={log.summary}>
                      {log.summary}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="text-accent-spectral hover:underline text-xs"
                      >
                        [Inspect]
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border-default bg-surface-secondary flex items-center justify-between font-mono text-xs">
          <span className="text-ink-muted">
            Showing Page {currentPage} of {totalPages} ({total} entries total)
          </span>

          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              &larr; Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              variant="secondary"
              size="sm"
              className="text-xs"
            >
              Next &rarr;
            </Button>
          </div>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border-default bg-surface-primary p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-ink-primary">
                  Audit Entry: {selectedLog.action}
                </h3>
                <span className="font-mono text-xs text-ink-muted">
                  ID: {selectedLog.id} &bull; Entity ID: {selectedLog.entity_id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-ink-muted hover:text-ink-primary font-mono text-sm"
              >
                &times; Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-secondary">
                <div>
                  <span className="text-ink-muted block">Actor</span>
                  <span className="text-ink-primary font-semibold">{selectedLog.actor_email}</span>
                </div>
                <div>
                  <span className="text-ink-muted block">IP Address</span>
                  <span className="text-ink-primary">{selectedLog.ip_address || "Internal Proxy"}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-border-subtle">
                  <span className="text-ink-muted block">Summary</span>
                  <span className="text-ink-primary">{selectedLog.summary}</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-xs text-ink-muted uppercase tracking-wider block mb-1">
                  Sanitized Metadata Payload
                </span>
                <pre className="p-4 rounded-lg bg-surface-secondary border border-border-default text-ink-secondary overflow-x-auto text-[11px] max-h-64">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedLog(null)} variant="secondary" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

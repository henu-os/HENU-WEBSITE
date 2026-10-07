"use client";

import React, { useState } from "react";
import {
  updateEnquiryStatusAction,
  retryEnquiryNotificationAction,
} from "@/server/actions/enquiry.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import type { Enquiry, EnquiryStatus } from "@/types/domain";

interface EnquiriesListClientProps {
  initialEnquiries: Enquiry[];
  total: number;
}

export function EnquiriesListClient({
  initialEnquiries,
  total,
}: EnquiriesListClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notificationFilter, setNotificationFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Reconciliation: identify failed notifications
  const failedNotifications = enquiries.filter(
    (e) => e.notification_status === "failed"
  );

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (notificationFilter !== "all" && e.notification_status !== notificationFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = e.name.toLowerCase().includes(term);
      const matchEmail = e.email.toLowerCase().includes(term);
      const matchOrg = e.organisation?.toLowerCase().includes(term) ?? false;
      if (!matchName && !matchEmail && !matchOrg) return false;
    }
    return true;
  });

  const handleUpdateStatus = async (
    id: string,
    newStatus: EnquiryStatus,
    notes?: string
  ) => {
    setIsUpdating(true);
    setActionMessage(null);

    const res = await updateEnquiryStatusAction(id, newStatus, notes);
    setIsUpdating(false);

    if (res.success && res.data) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? res.data! : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(res.data);
      }
      setActionMessage(`Updated enquiry status to "${newStatus}".`);
    } else {
      setActionMessage(res.error ?? "Failed to update status.");
    }
  };

  const handleRetryNotification = async (id: string) => {
    setIsUpdating(true);
    setActionMessage(null);

    const res = await retryEnquiryNotificationAction(id);
    setIsUpdating(false);

    if (res.success) {
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, notification_status: "sent", notification_error: null }
            : e
        )
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({
          ...selectedEnquiry,
          notification_status: "sent",
          notification_error: null,
        });
      }
      setActionMessage("Notification successfully retried and dispatched.");
    } else {
      setActionMessage(res.error ?? "Notification retry failed.");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "primary";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      case "spam":
        return "error";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Reconciliation Alert Banner (CONTACT-003, Document 03 §38) */}
      {failedNotifications.length > 0 && (
        <div
          role="region"
          aria-label="Notification Delivery Reconciliation"
          className="border border-amber-500/40 bg-amber-500/10 rounded-xl p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Notification Delivery Reconciliation ({failedNotifications.length} Pending)
              </div>
              <p className="font-sans text-xs text-ink-secondary">
                {failedNotifications.length} enquiry transmission(s) were successfully persisted to the database but encountered gateway delivery errors. Enquiries are preserved and available below for operator review.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setNotificationFilter("failed");
              }}
              className="shrink-0"
            >
              Filter Failed Deliveries
            </Button>
          </div>
        </div>
      )}

      {actionMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg font-mono text-xs bg-surface-secondary border border-border-default text-ink-primary"
        >
          {actionMessage}
        </div>
      )}

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="search"
            placeholder="Search by name, email, org..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-xs w-64 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-accent-pine"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-xs min-h-[40px]"
            aria-label="Filter by enquiry status"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </select>

          <select
            value={notificationFilter}
            onChange={(e) => setNotificationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-xs min-h-[40px]"
            aria-label="Filter by notification state"
          >
            <option value="all">All Notifications</option>
            <option value="sent">Dispatched</option>
            <option value="failed">Failed Delivery</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          Showing {filteredEnquiries.length} of {total} records
        </div>
      </div>

      {/* 3. Enquiries Table */}
      {filteredEnquiries.length === 0 ? (
        <div className="border border-border-default rounded-xl p-12 text-center space-y-2 bg-surface-secondary/20">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            Enquiry Registry // Clean
          </div>
          <h3 className="font-serif text-xl text-ink-primary">No Enquiries Found</h3>
          <p className="font-sans text-xs text-ink-secondary">
            No submissions matched the specified filter criteria.
          </p>
        </div>
      ) : (
        <div className="border border-border-default rounded-xl overflow-hidden bg-surface-primary overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-border-default bg-surface-secondary/40 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                <th className="p-3.5">Sender</th>
                <th className="p-3.5">Scope</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Notification</th>
                <th className="p-3.5">Received</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredEnquiries.map((enq) => (
                <tr
                  key={enq.id}
                  className="hover:bg-surface-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedEnquiry(enq)}
                >
                  <td className="p-3.5 space-y-0.5 max-w-[200px]">
                    {/* Rendered inertly as plain text (SEC-003 XSS prevention) */}
                    <div className="font-medium text-ink-primary truncate">{enq.name}</div>
                    <div className="font-mono text-[11px] text-ink-muted truncate">{enq.email}</div>
                    {enq.organisation && (
                      <div className="text-[11px] text-ink-secondary truncate">{enq.organisation}</div>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-accent-pine uppercase tracking-wider">
                    {enq.interest_type}
                    {enq.interest_ref && (
                      <div className="text-ink-muted lowercase truncate max-w-[120px]">
                        {enq.interest_ref}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={getStatusBadgeVariant(enq.status)} size="sm">
                      {enq.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    {enq.notification_status === "sent" && (
                      <span className="text-emerald-600 dark:text-emerald-400">Dispatched</span>
                    )}
                    {enq.notification_status === "failed" && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Failed</span>
                    )}
                    {enq.notification_status === "pending" && (
                      <span className="text-ink-muted">Pending</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-ink-muted whitespace-nowrap">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enq);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl bg-surface-primary border border-border-default rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                  Enquiry Record // {selectedEnquiry.id}
                </span>
                <h3 className="font-serif text-2xl text-ink-primary font-normal">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 border border-border-default rounded-lg text-sm hover:bg-surface-elevated min-w-[36px] min-h-[36px]"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-secondary/40 border border-border-default font-mono text-xs">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Email</span>
                <span className="text-ink-primary break-all">{selectedEnquiry.email}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Organisation</span>
                <span className="text-ink-primary">{selectedEnquiry.organisation || "N/A"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Scope</span>
                <span className="text-accent-pine uppercase">{selectedEnquiry.interest_type}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase">Received</span>
                <span className="text-ink-primary">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notification Delivery & Reconciliation Detail */}
            <div className="p-4 rounded-xl border border-border-default space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase tracking-wider text-[11px] text-ink-muted">
                  Notification Status
                </span>
                <Badge
                  variant={selectedEnquiry.notification_status === "sent" ? "success" : "warning"}
                  size="sm"
                >
                  {selectedEnquiry.notification_status}
                </Badge>
              </div>
              {selectedEnquiry.notification_error && (
                <div className="font-mono text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2 rounded">
                  Error: {selectedEnquiry.notification_error}
                </div>
              )}
              {selectedEnquiry.notification_status === "failed" && (
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleRetryNotification(selectedEnquiry.id)}
                  >
                    Retry Notification Dispatch
                  </Button>
                </div>
              )}
            </div>

            {/* Message Body (Inert text rendering for stored XSS protection) */}
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
                Transmission Body
              </span>
              <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/20 text-ink-primary font-sans text-sm whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status & Internal Notes Updater */}
            <div className="space-y-4 pt-2 border-t border-border-default">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField id="enq_status" label="Update Status">
                  <select
                    id="enq_status"
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedEnquiry.id,
                        e.target.value as EnquiryStatus,
                        selectedEnquiry.internal_notes || undefined
                      )
                    }
                    disabled={isUpdating}
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="spam">Spam</option>
                  </select>
                </FormField>
              </div>

              <FormField
                id="internal_notes"
                label="Internal Architecture Notes"
                hint="Private notes visible only to administrators."
              >
                <textarea
                  id="internal_notes"
                  rows={3}
                  defaultValue={selectedEnquiry.internal_notes || ""}
                  onBlur={(e) =>
                    handleUpdateStatus(
                      selectedEnquiry.id,
                      selectedEnquiry.status,
                      e.target.value
                    )
                  }
                  placeholder="Record internal routing or followup notes here..."
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

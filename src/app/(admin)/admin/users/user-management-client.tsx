"use client";

import React, { useState, useTransition } from "react";
import type { AdminProfile, AdminRole } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  inviteUserAction,
  updateUserRoleAction,
  toggleUserActiveAction,
} from "@/server/actions/user.actions";

interface UserManagementClientProps {
  initialUsers: AdminProfile[];
  currentUserEmail: string;
  currentUserRole: string;
}

export function UserManagementClient({
  initialUsers,
  currentUserEmail,
  currentUserRole,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<AdminProfile[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("viewer");

  const isAdmin = currentUserRole === "admin";

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.append("email", inviteEmail);
    formData.append("displayName", inviteName);
    formData.append("role", inviteRole);

    startTransition(async () => {
      const res = await inviteUserAction(formData);
      if (res.success && res.user) {
        setUsers([res.user, ...users]);
        setFeedback({ type: "success", message: `Operator ${res.user.email} provisioned successfully.` });
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteName("");
        setInviteRole("viewer");
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to invite operator." });
      }
    });
  };

  const handleRoleChange = (userId: string, newRole: AdminRole) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success && res.user) {
        setUsers(users.map((u) => (u.id === userId ? res.user : u)));
        setFeedback({ type: "success", message: `Role updated to ${newRole} for ${res.user.email}.` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update role." });
      }
    });
  };

  const handleToggleActive = (userId: string, currentStatus: boolean) => {
    setFeedback(null);
    const targetStatus = !currentStatus;
    startTransition(async () => {
      const res = await toggleUserActiveAction(userId, targetStatus);
      if (res.success && res.user) {
        setUsers(users.map((u) => (u.id === userId ? res.user : u)));
        setFeedback({
          type: "success",
          message: `Account ${res.user.email} ${targetStatus ? "activated" : "disabled"}.`,
        });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to toggle status." });
      }
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "manager":
        return "warning";
      case "viewer":
        return "neutral";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border-default bg-surface-primary shadow-sm">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Provisioned Operators
          </span>
          <span className="font-display font-semibold text-lg text-ink-primary">
            {users.length} Authorized Identity{users.length === 1 ? "" : "ies"}
          </span>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            variant="primary"
            size="sm"
            className="font-mono text-xs"
          >
            + Provision New Operator
          </Button>
        )}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-lg border font-mono text-xs ${
            feedback.type === "success"
              ? "border-status-success/30 bg-status-success/10 text-status-success"
              : "border-status-error/30 bg-status-error/10 text-status-error"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Invite Modal / Drawer */}
      {isInviteOpen && (
        <div className="p-6 rounded-xl border border-accent-spectral/30 bg-surface-secondary space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-ink-primary">
              Provision New Administrative Operator
            </h3>
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="text-ink-muted hover:text-ink-primary font-mono text-xs"
            >
              [Close &times;]
            </button>
          </div>

          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-xs text-ink-secondary block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="operator@henu.org"
                className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-ink-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-spectral"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-ink-secondary block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Systems Engineer"
                className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-ink-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-spectral"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-ink-secondary block mb-1">
                Initial Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-ink-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-spectral"
              >
                <option value="viewer">Viewer (Read-Only Oversight)</option>
                <option value="manager">Manager (Content Publishing)</option>
                <option value="admin">Admin (Full Control Plane)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isPending}
              >
                {isPending ? "Provisioning..." : "Confirm Invitation"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-border-default bg-surface-primary overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-default bg-surface-secondary text-xs font-mono uppercase text-ink-muted">
              <tr>
                <th scope="col" className="px-6 py-3">Operator</th>
                <th scope="col" className="px-6 py-3">Role Tier</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Joined</th>
                {isAdmin && <th scope="col" className="px-6 py-3 text-right">Access Controls</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map((user) => {
                const isCurrentUser = user.email === currentUserEmail;

                return (
                  <tr key={user.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink-primary">
                        {user.display_name}
                        {isCurrentUser && (
                          <span className="ml-2 font-mono text-[10px] text-accent-spectral">
                            (You)
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin && !isCurrentUser ? (
                        <select
                          value={user.role}
                          disabled={isPending}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as AdminRole)}
                          className="px-2.5 py-1 rounded text-xs font-mono border border-border-default bg-surface-secondary text-ink-primary"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm" className="font-mono uppercase text-[10px]">
                          {user.role}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.is_active ? "success" : "neutral"}
                        size="sm"
                        className="font-mono text-[10px]"
                      >
                        {user.is_active ? "ACTIVE" : "DISABLED"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {!isCurrentUser ? (
                          <Button
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                            disabled={isPending}
                            variant={user.is_active ? "destructive" : "secondary"}
                            size="sm"
                            className="text-xs font-mono"
                          >
                            {user.is_active ? "Disable" : "Activate"}
                          </Button>
                        ) : (
                          <span className="font-mono text-xs text-ink-muted">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Capability Matrix Reference */}
      <div className="p-6 rounded-xl border border-border-default bg-surface-secondary/50 space-y-4">
        <h4 className="font-display font-semibold text-sm text-ink-primary">
          Role Capability Matrix Reference
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg border border-border-subtle bg-surface-primary space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-primary">Admin</span>
              <Badge variant="error" size="sm">AAL2</Badge>
            </div>
            <ul className="text-ink-secondary space-y-1 list-disc list-inside">
              <li>Full Content CRUD &amp; Publish</li>
              <li>Site Settings Management</li>
              <li>Users &amp; Roles Management</li>
              <li>Cryptographic Release Management</li>
              <li>Audit Ledger Access</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-border-subtle bg-surface-primary space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-primary">Manager</span>
              <Badge variant="warning" size="sm">AAL2</Badge>
            </div>
            <ul className="text-ink-secondary space-y-1 list-disc list-inside">
              <li>Content CRUD &amp; Draft Editing</li>
              <li>Content Publishing</li>
              <li>Enquiry Intake Management</li>
              <li>Cannot mutate users or settings</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-border-subtle bg-surface-primary space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink-primary">Viewer</span>
              <Badge variant="neutral" size="sm">AAL1/2</Badge>
            </div>
            <ul className="text-ink-secondary space-y-1 list-disc list-inside">
              <li>Read-only preview of drafts</li>
              <li>Audit Log Inspection</li>
              <li>Enquiry Review (Read-only)</li>
              <li>Zero mutation capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

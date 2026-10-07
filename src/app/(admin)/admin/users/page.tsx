import React from "react";
import type { Metadata } from "next";
import { requireAdminSession } from "@/server/auth/session";
import { userService } from "@/server/services/user.service";
import { UserManagementClient } from "./user-management-client";

export const metadata: Metadata = {
  title: "Users & Roles // RBAC Foundation — HENU Admin",
};

export default async function UsersAdminPage() {
  const session = await requireAdminSession();
  const users = await userService.listUsers();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
            Governance Control Plane // ADMIN-010
          </span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink-primary">
          Users &amp; Roles Management
        </h1>
        <p className="font-sans text-sm text-ink-secondary mt-1 max-w-3xl">
          Role-Based Access Control (RBAC) governance. Assign least-privilege administrative capabilities across Admin, Manager, and Viewer tiers. All mutations are immutably logged to the audit ledger.
        </p>
      </div>

      <UserManagementClient
        initialUsers={users}
        currentUserEmail={session.email}
        currentUserRole={session.profile.role}
      />
    </div>
  );
}

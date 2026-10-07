import "server-only";
import type { AdminRole } from "@/types/domain";
import { ForbiddenError } from "@/lib/errors";
import { requireAdminSession, type AdminSession } from "./session";

/**
 * Granular Administrative Permission Matrix (ADMIN-010, Document 03 §9)
 * Explicit capability model with least-privilege defaults.
 */
export type PermissionAction =
  | "content:read"
  | "content:write"
  | "content:publish"
  | "enquiry:read"
  | "enquiry:manage"
  | "audit:read"
  | "user:read"
  | "user:manage"
  | "settings:manage"
  | "release:manage";

const ROLE_PERMISSIONS: Record<AdminRole, ReadonlySet<PermissionAction>> = {
  admin: new Set<PermissionAction>([
    "content:read",
    "content:write",
    "content:publish",
    "enquiry:read",
    "enquiry:manage",
    "audit:read",
    "user:read",
    "user:manage",
    "settings:manage",
    "release:manage",
  ]),
  manager: new Set<PermissionAction>([
    "content:read",
    "content:write",
    "content:publish",
    "enquiry:read",
    "enquiry:manage",
  ]),
  viewer: new Set<PermissionAction>([
    "content:read",
    "enquiry:read",
    "audit:read",
    "user:read",
  ]),
};

/**
 * Evaluates whether a role is authorized to perform a permission action.
 */
export function hasPermission(role: AdminRole, action: PermissionAction): boolean {
  const allowedActions = ROLE_PERMISSIONS[role];
  if (!allowedActions) return false;
  return allowedActions.has(action);
}

/**
 * Server-side guard requiring specific permission before executing action.
 */
export async function requirePermission(action: PermissionAction): Promise<AdminSession> {
  const session = await requireAdminSession();
  const role = session.profile.role as AdminRole;

  if (!hasPermission(role, action)) {
    throw new ForbiddenError(
      `Access denied. Role "${role}" lacks permission for action "${action}".`
    );
  }

  return session;
}

/**
 * Server-side guard requiring one of the specified roles.
 */
export async function requireRole(allowedRoles: AdminRole[]): Promise<AdminSession> {
  const session = await requireAdminSession();
  const role = session.profile.role as AdminRole;

  if (!allowedRoles.includes(role)) {
    throw new ForbiddenError(
      `Access denied. Required roles: [${allowedRoles.join(", ")}], but current user has "${role}".`
    );
  }

  return session;
}

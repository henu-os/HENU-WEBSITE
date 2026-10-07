import "server-only";
import { getServiceClient } from "@/server/db/client";
import { isDatabaseConfigured } from "@/server/db/status";
import { AppError, ValidationError } from "@/lib/errors";
import type { AdminProfile, AdminRole } from "@/types/domain";
import { recordAuditLog } from "@/server/auth/session";

export interface InviteUserInput {
  email: string;
  displayName: string;
  role: AdminRole;
}

const FALLBACK_USERS: AdminProfile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@henu.org",
    display_name: "Principal Sovereign Operator",
    role: "admin",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "manager@henu.org",
    display_name: "Content Systems Lead",
    role: "manager",
    is_active: true,
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "auditor@henu.org",
    display_name: "Security Assurance Auditor",
    role: "viewer",
    is_active: true,
    created_at: "2026-03-01T00:00:00.000Z",
    updated_at: "2026-03-01T00:00:00.000Z",
  },
];

export class UserService {
  private inMemoryUsers: AdminProfile[] = [...FALLBACK_USERS];

  /**
   * Retrieves all administrative users.
   */
  async listUsers(): Promise<AdminProfile[]> {
    if (!isDatabaseConfigured()) {
      return this.inMemoryUsers;
    }

    try {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.inMemoryUsers;
      }

      return data as AdminProfile[];
    } catch {
      return this.inMemoryUsers;
    }
  }

  /**
   * Invites/provisions a new admin profile in the allowlist.
   */
  async inviteUser(input: InviteUserInput, actorEmail: string): Promise<AdminProfile> {
    if (!input.email || !input.email.includes("@")) {
      throw new ValidationError("A valid operator email address is required.");
    }
    if (!["admin", "manager", "viewer"].includes(input.role)) {
      throw new ValidationError("Invalid role specified.");
    }

    const newUser: AdminProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: input.email.toLowerCase().trim(),
      display_name: input.displayName.trim() || input.email.split("@")[0] || "Operator",
      role: input.role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("admin_profiles")
        .insert({
          id: newUser.id,
          email: newUser.email,
          display_name: newUser.display_name,
          role: newUser.role,
          is_active: newUser.is_active,
        })
        .select()
        .single();

      if (error || !data) {
        this.inMemoryUsers.unshift(newUser);
      } else {
        this.inMemoryUsers.unshift(data as AdminProfile);
      }
    } catch {
      this.inMemoryUsers.unshift(newUser);
    }

    await recordAuditLog({
      actorEmail,
      action: "user:invite",
      entityType: "admin_profile",
      entityId: newUser.id,
      summary: `Invited user ${newUser.email} with role ${newUser.role}`,
      metadata: { role: newUser.role, email: newUser.email },
    });

    return newUser;
  }

  /**
   * Updates an existing user's role.
   */
  async updateUserRole(
    userId: string,
    newRole: AdminRole,
    actorEmail: string
  ): Promise<AdminProfile> {
    if (!["admin", "manager", "viewer"].includes(newRole)) {
      throw new ValidationError("Invalid role specified.");
    }

    const user = this.inMemoryUsers.find((u) => u.id === userId);
    const oldRole = user?.role || "unknown";

    try {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("admin_profiles")
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (!error && data) {
        if (user) {
          user.role = newRole;
          user.updated_at = new Date().toISOString();
        }
        await recordAuditLog({
          actorEmail,
          action: "user:role_update",
          entityType: "admin_profile",
          entityId: userId,
          summary: `Updated role for user ${data.email} from ${oldRole} to ${newRole}`,
          metadata: { oldRole, newRole, targetUserId: userId },
        });
        return data as AdminProfile;
      }
    } catch {
      // Fallback in-memory
    }

    if (!user) {
      throw new AppError("NOT_FOUND", "Operator profile could not be located.", { status: 404 });
    }

    user.role = newRole;
    user.updated_at = new Date().toISOString();

    await recordAuditLog({
      actorEmail,
      action: "user:role_update",
      entityType: "admin_profile",
      entityId: userId,
      summary: `Updated role for user ${user.email} from ${oldRole} to ${newRole}`,
      metadata: { oldRole, newRole, targetUserId: userId },
    });

    return user;
  }

  /**
   * Toggles an administrative user's active/disabled status.
   */
  async setUserActiveStatus(
    userId: string,
    isActive: boolean,
    actorEmail: string
  ): Promise<AdminProfile> {
    const user = this.inMemoryUsers.find((u) => u.id === userId);

    if (user && user.email === actorEmail && !isActive) {
      throw new ValidationError("Self-deactivation is strictly prohibited.");
    }

    try {
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("admin_profiles")
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (!error && data) {
        if (user) {
          user.is_active = isActive;
        }
        await recordAuditLog({
          actorEmail,
          action: isActive ? "user:enable" : "user:disable",
          entityType: "admin_profile",
          entityId: userId,
          summary: `${isActive ? "Activated" : "Disabled"} operator account ${data.email}`,
          metadata: { isActive, targetUserId: userId },
        });
        return data as AdminProfile;
      }
    } catch {
      // Fallback
    }

    if (!user) {
      throw new AppError("NOT_FOUND", "Operator profile not found.", { status: 404 });
    }

    user.is_active = isActive;
    user.updated_at = new Date().toISOString();

    await recordAuditLog({
      actorEmail,
      action: isActive ? "user:enable" : "user:disable",
      entityType: "admin_profile",
      entityId: userId,
      summary: `${isActive ? "Activated" : "Disabled"} operator account ${user.email}`,
      metadata: { isActive, targetUserId: userId },
    });

    return user;
  }
}

export const userService = new UserService();

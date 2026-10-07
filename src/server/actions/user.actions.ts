"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/server/auth/rbac";
import { userService } from "@/server/services/user.service";
import type { AdminRole } from "@/types/domain";

export async function inviteUserAction(formData: FormData) {
  const session = await requireRole(["admin"]);

  const email = (formData.get("email") as string) || "";
  const displayName = (formData.get("displayName") as string) || "";
  const role = (formData.get("role") as AdminRole) || "viewer";

  try {
    const user = await userService.inviteUser(
      { email, displayName, role },
      session.email
    );
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to invite user." };
  }
}

export async function updateUserRoleAction(userId: string, newRole: AdminRole) {
  const session = await requireRole(["admin"]);

  try {
    const user = await userService.updateUserRole(userId, newRole, session.email);
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user role." };
  }
}

export async function toggleUserActiveAction(userId: string, isActive: boolean) {
  const session = await requireRole(["admin"]);

  try {
    const user = await userService.setUserActiveStatus(userId, isActive, session.email);
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle user status." };
  }
}

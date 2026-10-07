import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRequireAdminSession = vi.fn();
vi.mock("@/server/auth/session", () => ({
  requireAdminSession: () => mockRequireAdminSession(),
}));

import {
  hasPermission,
  requirePermission,
  requireRole,
  type PermissionAction,
} from "@/server/auth/rbac";
import { AppError } from "@/lib/errors";

describe("Role-Based Access Control Matrix (ADMIN-010, Document 03 §9)", () => {
  const allActions: PermissionAction[] = [
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Admin Role Capabilities", () => {
    beforeEach(() => {
      mockRequireAdminSession.mockResolvedValue({
        user: { id: "admin-1", email: "admin@henu.dev" },
        profile: { id: "admin-1", email: "admin@henu.dev", role: "admin", is_active: true },
      });
    });

    it("grants admin full access in matrix mapping", () => {
      allActions.forEach((action) => {
        expect(hasPermission("admin", action)).toBe(true);
      });
    });

    it("allows admin through requirePermission guard", async () => {
      await expect(requirePermission("content:write")).resolves.toBeDefined();
      await expect(requirePermission("user:manage")).resolves.toBeDefined();
      await expect(requirePermission("audit:read")).resolves.toBeDefined();
    });

    it("satisfies requireRole with admin", async () => {
      await expect(requireRole(["admin"])).resolves.toBeDefined();
      await expect(requireRole(["admin", "manager"])).resolves.toBeDefined();
    });
  });

  describe("Manager Role Capabilities", () => {
    beforeEach(() => {
      mockRequireAdminSession.mockResolvedValue({
        user: { id: "mgr-1", email: "manager@henu.dev" },
        profile: { id: "mgr-1", email: "manager@henu.dev", role: "manager", is_active: true },
      });
    });

    it("allows manager to view and manage editorial content and enquiries", async () => {
      const allowedActions: PermissionAction[] = [
        "content:read",
        "content:write",
        "content:publish",
        "enquiry:read",
        "enquiry:manage",
      ];

      for (const action of allowedActions) {
        expect(hasPermission("manager", action)).toBe(true);
        await expect(requirePermission(action)).resolves.toBeDefined();
      }
    });

    it("prohibits manager from managing users, settings, and viewing audit logs", async () => {
      const forbiddenActions: PermissionAction[] = [
        "audit:read",
        "user:read",
        "user:manage",
        "settings:manage",
        "release:manage",
      ];

      for (const action of forbiddenActions) {
        expect(hasPermission("manager", action)).toBe(false);
        await expect(requirePermission(action)).rejects.toThrow("Access denied");
      }
    });
  });

  describe("Viewer Role Capabilities", () => {
    beforeEach(() => {
      mockRequireAdminSession.mockResolvedValue({
        user: { id: "view-1", email: "viewer@henu.dev" },
        profile: { id: "view-1", email: "viewer@henu.dev", role: "viewer", is_active: true },
      });
    });

    it("allows viewer read-only access to content, enquiries, audit logs, and users", async () => {
      const readActions: PermissionAction[] = [
        "content:read",
        "enquiry:read",
        "audit:read",
        "user:read",
      ];

      for (const action of readActions) {
        expect(hasPermission("viewer", action)).toBe(true);
        await expect(requirePermission(action)).resolves.toBeDefined();
      }
    });

    it("prohibits viewer from mutating content or accessing system governance", async () => {
      const forbiddenActions: PermissionAction[] = [
        "content:write",
        "content:publish",
        "enquiry:manage",
        "user:manage",
        "settings:manage",
        "release:manage",
      ];

      for (const action of forbiddenActions) {
        expect(hasPermission("viewer", action)).toBe(false);
        await expect(requirePermission(action)).rejects.toThrow("Access denied");
      }
    });
  });

  describe("Unauthenticated & Session Rejections", () => {
    it("propagates unauthenticated session errors", async () => {
      mockRequireAdminSession.mockRejectedValue(
        new AppError("UNAUTHORIZED", "No active session", { status: 401 })
      );

      await expect(requirePermission("content:read")).rejects.toThrow("No active session");
      await expect(requireRole(["admin"])).rejects.toThrow("No active session");
    });
  });
});

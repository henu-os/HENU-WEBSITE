import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

// Mock Supabase service client
vi.mock("@/server/db/client", () => {
  return {
    getServiceClient: vi.fn(),
  };
});

import { getServiceClient } from "@/server/db/client";
import { verifyAdminSession } from "@/server/auth/session";
import { AuthorizationError, ForbiddenError } from "@/lib/errors";

describe("TEST-003: Administrative Authorization Negative Matrix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing or empty token with AuthorizationError", async () => {
    await expect(verifyAdminSession("")).rejects.toThrow(AuthorizationError);
    await expect(verifyAdminSession("   ")).rejects.toThrow(AuthorizationError);
  });

  it("rejects invalid or expired token when auth provider returns error", async () => {
    vi.mocked(getServiceClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Token expired or signature invalid"),
        }),
      },
    } as any);

    await expect(verifyAdminSession("expired-or-malformed-jwt")).rejects.toThrow(AuthorizationError);
  });

  it("rejects authenticated user who is NOT in the admin_profiles allowlist", async () => {
    vi.mocked(getServiceClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "unauthorized-user-uuid",
              email: "intruder@external.org",
              app_metadata: { aal: "aal2" },
            },
          },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Row not found in admin_profiles"),
        }),
      }),
    } as any);

    await expect(verifyAdminSession("valid-jwt-for-unauthorized-user")).rejects.toThrow(ForbiddenError);
  });

  it("rejects admin whose profile is marked is_active: false (revoked identity)", async () => {
    vi.mocked(getServiceClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "revoked-admin-uuid",
              email: "ex-admin@henu.org",
              app_metadata: { aal: "aal2" },
            },
          },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: new Error("Profile inactive"),
        }),
      }),
    } as any);

    await expect(verifyAdminSession("valid-jwt-for-revoked-admin")).rejects.toThrow(ForbiddenError);
  });

  it("grants access to active, allowlisted admin with AAL2", async () => {
    vi.mocked(getServiceClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "valid-admin-uuid",
              email: "operator@henu.org",
              app_metadata: { aal: "aal2" },
            },
          },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: "valid-admin-uuid",
            email: "operator@henu.org",
            display_name: "HENU Operator",
            role: "admin",
            is_active: true,
          },
          error: null,
        }),
      }),
    } as any);

    const session = await verifyAdminSession("valid-admin-jwt");
    expect(session.userId).toBe("valid-admin-uuid");
    expect(session.isMfaVerified).toBe(true);
    expect(session.profile.role).toBe("admin");
  });
});

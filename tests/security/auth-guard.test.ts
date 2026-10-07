import { describe, it, expect, vi } from "vitest";

// Mock server-only and next/headers for unit testing environment
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map()),
  cookies: vi.fn(async () => ({ get: vi.fn() })),
}));

import { verifyAdminSession } from "@/server/auth/session";

describe("Admin Authorization Guard (ADMIN-002, Document 03 §9)", () => {
  it("rejects empty or whitespace-only tokens with 401 Unauthorized", async () => {
    await expect(verifyAdminSession("")).rejects.toThrow("Missing authentication token.");
    await expect(verifyAdminSession("   ")).rejects.toThrow("Missing authentication token.");
  });

  it("rejects invalid tokens when Supabase auth verification fails", async () => {
    await expect(verifyAdminSession("invalid-untrusted-jwt-token")).rejects.toThrow(
      "Invalid or expired authentication session."
    );
  });
});

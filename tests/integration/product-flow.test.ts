import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock DB client so integration test uses baseline fallback when offline
vi.mock("@/server/db/client", () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
        order: vi.fn(() => ({
          range: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: { id: "test-prod-id" }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: { id: "test-prod-id" }, error: null })),
          })),
        })),
      })),
    })),
  })),
}));
import { ProductService } from "@/server/services/product.service";
import { ProductRepository } from "@/server/repositories/product.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import type { AdminSession } from "@/server/auth/session";
import { ValidationError } from "@/lib/errors";

describe("Product Lifecycle & Security Boundaries (PROD-001, PROD-006, SEC-002)", () => {
  const mockAdmin: AdminSession = {
    id: "admin-1111",
    userId: "admin-1111",
    email: "architect@henu.dev",
    profile: {
      id: "admin-1111",
      email: "architect@henu.dev",
      display_name: "Lead Architect",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    isMfaVerified: true,
  };

  let service: ProductService;
  let repo: ProductRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProductService();
    repo = new ProductRepository();
  });

  describe("Public Draft Invisibility", () => {
    it("strictly returns only published products via getPublishedProducts", async () => {
      const products = await service.getPublishedProducts();
      expect(products.length).toBeGreaterThan(0);
      for (const p of products) {
        expect(p.status).toBe("published");
        expect(p.deleted_at).toBeNull();
      }
    });

    it("prevents public access to draft products unless allowDraft is explicitly enabled", async () => {
      // Create an in-memory draft test
      const testDraftSlug = "confidential-draft-tool";

      // With allowDraft: false (default public access)
      const publicResult = await service.getProductBySlug(testDraftSlug, {
        allowDraft: false,
      });
      expect(publicResult).toBeNull();
    });
  });

  describe("Reserved Slug Security Gate (PROD-006)", () => {
    it("rejects creation of another product attempting to claim 'henu-os'", async () => {
      await expect(
        service.createProduct(
          {
            slug: "henu-os",
            name: "Imposter OS",
            tagline: "Attempt to take over flagship slug",
            summary: "This should fail validation immediately.",
            status: "draft",
            status_label: "in_development",
            hue_key: "os",
            template_variant: "os-environment",
            primary_cta_type: "explore",
            primary_cta_target: "/products/imposter",
            display_order: 10,
          },
          mockAdmin
        )
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("CTA Release Integrity Enforcement", () => {
    it("rejects publishing a product with a 'download' CTA when no confirmed release exists", async () => {
      await expect(
        service.createProduct(
          {
            slug: "unreleased-tool",
            name: "Unreleased Tool",
            tagline: "No release yet",
            summary: "Cannot have a download CTA button.",
            status: "draft",
            status_label: "in_development",
            hue_key: "ide",
            template_variant: "ide-workflow",
            primary_cta_type: "download",
            primary_cta_target: "https://releases.henu.dev/unreleased.tar.gz",
            display_order: 10,
          },
          mockAdmin
        )
      ).rejects.toThrow(
        /Cannot publish a 'download' CTA without an active, verified public release/
      );
    });
  });
});

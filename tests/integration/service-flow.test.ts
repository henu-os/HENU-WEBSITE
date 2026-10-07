import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock DB client for offline resilience
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
          single: vi.fn(async () => ({ data: { id: "test-srv-id", name: "Test Srv", slug: "test-srv", status: "draft" }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: { id: "test-srv-id", name: "Test Srv", slug: "test-srv", status: "published" }, error: null })),
          })),
        })),
      })),
    })),
  })),
}));

import { ServiceService } from "@/server/services/service.service";
import { ServiceRepository, BASELINE_CATEGORIES, BASELINE_SERVICES } from "@/server/repositories/service.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import { ValidationError } from "@/lib/errors";
import type { AdminSession } from "@/server/auth/session";

describe("Service Lifecycle, Governance & Security Boundaries (SERV-001, SERV-002, SERV-003, SERV-004)", () => {
  const mockAdmin: AdminSession = {
    id: "admin-srv-1",
    userId: "admin-srv-1",
    email: "lead-architect@henu.dev",
    profile: {
      id: "admin-srv-1",
      email: "lead-architect@henu.dev",
      display_name: "Principal Architect",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    isMfaVerified: true,
  };

  let serviceService: ServiceService;

  beforeEach(() => {
    vi.clearAllMocks();
    serviceService = new ServiceService();
  });

  it("lists published services grouped by approved categories (SERV-001)", async () => {
    const groups = await serviceService.getPublishedServicesGrouped();

    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(group.category).toBeDefined();
      expect(group.category.name).toBeTruthy();
      expect(group.services.length).toBeGreaterThan(0);
      for (const s of group.services) {
        expect(s.status).toBe("published");
        expect(s.category_id).toBe(group.category.id);
      }
    }
  });

  it("excludes draft and archived services from public queries (SERV-001, SERV-002)", async () => {
    const allPublished = await serviceService.getPublishedServices();
    const hasNonPublished = allPublished.some((s) => s.status !== "published");
    expect(hasNonPublished).toBe(false);

    // Baseline includes published services; fetching with allowDraft: false should return published only
    const websiteDev = await serviceService.getServiceBySlug("website-development", { allowDraft: false });
    expect(websiteDev).not.toBeNull();
    expect(websiteDev?.status).toBe("published");
  });

  it("strictly blocks publication of sensitive service when disclaimer is missing (SERV-004)", async () => {
    await expect(
      serviceService.createService(
        {
          name: "Unregulated Legal Service",
          slug: "unregulated-legal-service",
          category_id: BASELINE_CATEGORIES[3]?.id ?? "c4444444-4444-4444-4444-444444444444",
          summary: "Advisory on corporate structures without required disclaimer.",
          status: "published",
          requires_disclaimer: true,
          disclaimer_block: "", // Empty!
        },
        mockAdmin
      )
    ).rejects.toThrow(ValidationError);
  });

  it("strictly blocks creation of service containing prohibited price figures (Document 04 §14.2)", async () => {
    await expect(
      serviceService.createService(
        {
          name: "Discounted Web App",
          slug: "discounted-web-app",
          category_id: BASELINE_CATEGORIES[0]?.id ?? "c1111111-1111-1111-1111-111111111111",
          summary: "Starting at ₹25,000 for standard websites.",
          status: "draft",
          requires_disclaimer: false,
        },
        mockAdmin
      )
    ).rejects.toThrow(/pricing safety policy/i);
  });

  it("strictly blocks creation of service containing dollar currency pricing in problem block", async () => {
    await expect(
      serviceService.createService(
        {
          name: "SaaS Dev Plan",
          slug: "saas-dev-plan",
          category_id: BASELINE_CATEGORIES[0]?.id ?? "c1111111-1111-1111-1111-111111111111",
          summary: "Full-stack development capabilities.",
          status: "draft",
          requires_disclaimer: false,
          problem_block: {
            headline: "Costly Consulting",
            description: "Traditional agencies charge $500 per hour with zero transparency.",
          },
        },
        mockAdmin
      )
    ).rejects.toThrow(/pricing safety policy/i);
  });

  it("records audit log entry on category creation and updates (SEC-004)", async () => {
    const auditSpy = vi.spyOn(auditLogRepository, "record");

    await serviceService.createCategory(
      {
        name: "Security Engineering",
        slug: "security-engineering",
        description: "Zero-trust hardening and smart contract audits.",
        display_order: 5,
      },
      mockAdmin
    );

    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "SERVICE_CATEGORY_CREATE",
        actor_id: mockAdmin.id,
      })
    );
  });

  it("reorders services with keyboard-accessible order IDs", async () => {
    const auditSpy = vi.spyOn(auditLogRepository, "record");

    const reorderedIds = [
      BASELINE_SERVICES[1]?.id ?? "s2",
      BASELINE_SERVICES[0]?.id ?? "s1",
    ];

    await serviceService.reorderServices(reorderedIds, mockAdmin);

    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "SERVICE_REORDER",
        actor_id: mockAdmin.id,
      })
    );
  });
});

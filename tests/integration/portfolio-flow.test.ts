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
          single: vi.fn(async () => ({
            data: {
              id: "test-proj-id",
              title: "Verified Enterprise Portal",
              slug: "verified-enterprise-portal",
              status: "published",
              client_permission_status: "granted",
            },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({
              data: {
                id: "test-proj-id",
                title: "Verified Enterprise Portal",
                slug: "verified-enterprise-portal",
                status: "archived",
              },
              error: null,
            })),
          })),
        })),
      })),
    })),
  })),
}));

import { PortfolioService } from "@/server/services/portfolio.service";
import { BASELINE_PORTFOLIO_PROJECTS, BASELINE_PROJECT_CATEGORIES } from "@/server/repositories/portfolio.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import { ValidationError } from "@/lib/errors";
import type { AdminSession } from "@/server/auth/session";

describe("Portfolio Lifecycle, Governance & Security Boundaries (PORT-001, PORT-002, PORT-003)", () => {
  const mockAdmin: AdminSession = {
    id: "admin-port-1",
    userId: "admin-port-1",
    email: "lead-architect@henu.dev",
    profile: {
      id: "admin-port-1",
      email: "lead-architect@henu.dev",
      display_name: "Principal Architect",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    isMfaVerified: true,
  };

  let service: PortfolioService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PortfolioService();
  });

  it("public repository never exposes draft, archived, or soft-deleted projects", async () => {
    const publicProjects = await service.getPublishedProjects();

    expect(publicProjects.length).toBeGreaterThan(0);
    for (const project of publicProjects) {
      expect(project.status).toBe("published");
      expect(project.deleted_at).toBeNull();
      expect(project.client_permission_status).toBe("granted");
    }
  });

  it("filters public projects by category slug correctly", async () => {
    const enterpriseProjects = await service.getPublishedProjects("enterprise-systems");
    expect(enterpriseProjects.length).toBeGreaterThan(0);
    for (const p of enterpriseProjects) {
      expect(p.category_slug).toBe("enterprise-systems");
    }

    const aiProjects = await service.getPublishedProjects("automation-ai");
    expect(aiProjects.length).toBeGreaterThan(0);
    for (const p of aiProjects) {
      expect(p.category_slug).toBe("automation-ai");
    }
  });

  it("public detail lookup by slug returns verified published project", async () => {
    const project = await service.getProjectBySlug("henu-housing-erp");
    expect(project).not.toBeNull();
    expect(project?.title).toBe("HENU Housing Accounting ERP");
    expect(project?.status).toBe("published");
    expect(project?.client_permission_status).toBe("granted");
  });

  it("public detail lookup returns null for non-existent slug", async () => {
    const nonExistent = await service.getProjectBySlug("non-existent-project");
    expect(nonExistent).toBeNull();
  });

  it("publishing blocks projects without granted client permission (PORT-001 Hard Gate)", async () => {
    await expect(
      service.createProject(
        {
          title: "FinTech Settlement Ledger",
          slug: "fintech-settlement-ledger",
          summary: "Multi-party settlement layer for private clearing house",
          category_slug: "enterprise-systems",
          technologies: ["Rust", "PostgreSQL"],
          status: "published",
          client_permission_status: "pending", // NOT GRANTED!
          story_blocks: {},
          metrics: [],
          display_order: 10,
        },
        mockAdmin
      )
    ).rejects.toThrow(ValidationError);
  });

  it("publishing blocks projects with unsourced or unowned metrics", async () => {
    await expect(
      service.createProject(
        {
          title: "Claim-Heavy Architecture",
          slug: "claim-heavy-architecture",
          summary: "Case study with marketing claims",
          category_slug: "enterprise-systems",
          technologies: ["Next.js"],
          status: "published",
          client_permission_status: "granted",
          story_blocks: {},
          metrics: [
            {
              label: "Performance Boost",
              value: "10x",
              source: "", // UNSOURCED!
              owner: "",  // UNOWNED!
            },
          ],
          display_order: 11,
        },
        mockAdmin
      )
    ).rejects.toThrow(ValidationError);
  });

  it("publishes verified project and records immutable audit log", async () => {
    const auditSpy = vi.spyOn(auditLogRepository, "record");

    const created = await service.createProject(
      {
        title: "Verified Enterprise Portal",
        slug: "verified-enterprise-portal",
        summary: "Fully permissioned case study with confirmed metrics",
        category_slug: "enterprise-systems",
        technologies: ["Next.js", "Supabase"],
        status: "published",
        client_permission_status: "granted",
        story_blocks: {
          challenge: {
            title: "Fragmented Ledgers",
            content: "Fragmented legacy databases led to reconciliation latency.",
          },
          solution: {
            title: "Unified Pipeline",
            content: "Unified streaming pipeline with event-driven auditing.",
          },
        },
        metrics: [
          {
            label: "Latency Reduction",
            value: "420ms -> 18ms",
            source: "Datadog production trace Q1 2025",
            owner: "Staff Infrastructure Engineer",
          },
        ],
        display_order: 12,
      },
      mockAdmin
    );

    expect(created.status).toBe("published");
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        actor_id: mockAdmin.userId,
        action: "PORTFOLIO_PROJECT_CREATE",
        entity_type: "portfolio_project",
      })
    );
  });

  it("reordering projects updates order and records audit log", async () => {
    const auditSpy = vi.spyOn(auditLogRepository, "record");
    const originalOrder = BASELINE_PORTFOLIO_PROJECTS.map((p) => p.id);
    const reversedOrder = [...originalOrder].reverse();

    await service.reorderProjects(reversedOrder, mockAdmin);

    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        actor_id: mockAdmin.userId,
        action: "PORTFOLIO_PROJECTS_REORDER",
        entity_id: "batch",
      })
    );
  });

  it("lists project categories and vocabulary cleanly", async () => {
    const categories = await service.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.slug === "enterprise-systems")).toBe(true);

    const tech = await service.getTechnologies();
    expect(tech.length).toBeGreaterThan(0);
    expect(tech.some((t) => t.slug === "typescript")).toBe(true);
  });
});

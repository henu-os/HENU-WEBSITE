import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@/server/repositories/audit-log.repository", () => ({
  auditLogRepository: {
    record: vi.fn().mockResolvedValue({ id: "mock-audit-id" }),
  },
}));
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
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
        })),
      })),
    })),
  })),
}));

import { HomeService } from "@/server/services/home.service";
import { homeContentRepository } from "@/server/repositories/home-content.repository";
import { productRepository } from "@/server/repositories/product.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { portfolioRepository } from "@/server/repositories/portfolio.repository";
import type { AdminSession } from "@/server/auth/session";

const mockAdmin: AdminSession = {
  id: "admin-home-test",
  userId: "admin-home-test",
  email: "admin@henu.dev",
  profile: {
    id: "admin-home-test",
    email: "admin@henu.dev",
    display_name: "HENU Operator",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isMfaVerified: true,
};

describe("Home Assembly & Dynamic Slot Governance (HOME-003, ADMIN-005, PRD §6)", () => {
  let homeService: HomeService;

  beforeEach(() => {
    homeService = new HomeService(
      homeContentRepository,
      productRepository,
      serviceRepository,
      portfolioRepository
    );
  });

  describe("Dynamic Slot Assembly & Resilience", () => {
    it("assembles complete Home data including flagship product, services, and evidence", async () => {
      const data = await homeService.getPublicHomeData();

      expect(data.content).toBeDefined();
      expect(data.content.hero_statement).toBeDefined();
      expect(data.publishedProducts.length).toBeGreaterThan(0);
      expect(data.flagshipProduct).toBeDefined();
      expect(data.curatedServices.length).toBeGreaterThan(0);
      expect(data.evidence.length).toBe(3);
    });

    it("adapts gracefully when portfolio projects are sparse (0 or 1 project)", async () => {
      // Mock portfolioRepository returning 0 published projects
      const mockEmptyPortfolioRepo = {
        listPublishedProjects: vi.fn().mockResolvedValue([]),
        listProjects: vi.fn().mockResolvedValue([]),
      } as any;

      const sparseHomeService = new HomeService(
        homeContentRepository,
        productRepository,
        serviceRepository,
        mockEmptyPortfolioRepo
      );

      const sparseData = await sparseHomeService.getPublicHomeData();
      expect(sparseData.featuredProjects).toEqual([]);
      // Must not crash or throw when 0 projects exist
      expect(sparseData.featuredProjects.length).toBe(0);
    });

    it("adapts gracefully when services are sparse (0 services)", async () => {
      const mockEmptyServiceRepo = {
        listPublishedServices: vi.fn().mockResolvedValue([]),
        listServices: vi.fn().mockResolvedValue([]),
      } as any;

      const sparseHomeService = new HomeService(
        homeContentRepository,
        productRepository,
        mockEmptyServiceRepo,
        portfolioRepository
      );

      const sparseData = await sparseHomeService.getPublicHomeData();
      expect(sparseData.curatedServices).toEqual([]);
      expect(sparseData.curatedServices.length).toBe(0);
    });
  });

  describe("Publish Gate & Draft Feature Restrictions (ADMIN-005)", () => {
    it("blocks featuring a draft product on the public home page", async () => {
      // Mock product repo containing one published and one draft product
      const mockProductRepo = {
        listAllProducts: vi.fn().mockResolvedValue({
          products: [
            { id: "prod-pub-1", name: "HENU OS", status: "published" },
            { id: "prod-draft-1", name: "Experimental Engine", status: "draft" },
          ],
          total: 2,
        }),
        listPublishedProducts: vi.fn().mockResolvedValue([
          { id: "prod-pub-1", name: "HENU OS", status: "published" },
        ]),
      } as any;

      const gatedService = new HomeService(
        homeContentRepository,
        mockProductRepo,
        serviceRepository,
        portfolioRepository
      );

      await expect(
        gatedService.updateHomeContent(
          {
            featured_product_ids: ["prod-draft-1"] as any,
          },
          mockAdmin
        )
      ).rejects.toThrow(/draft.*cannot be featured/i);
    });

    it("blocks featuring a draft portfolio project on the public home page", async () => {
      const mockPortfolioRepo = {
        listAllProjects: vi.fn().mockResolvedValue({
          projects: [
            { id: "proj-pub-1", title: "Housing ERP", status: "published" },
            { id: "proj-draft-1", title: "Unreleased Enterprise Solution", status: "draft" },
          ],
          total: 2,
        }),
        listPublishedProjects: vi.fn().mockResolvedValue([
          { id: "proj-pub-1", title: "Housing ERP", status: "published" },
        ]),
      } as any;

      const gatedService = new HomeService(
        homeContentRepository,
        productRepository,
        serviceRepository,
        mockPortfolioRepo
      );

      await expect(
        gatedService.updateHomeContent(
          {
            featured_project_ids: ["proj-draft-1"] as any,
          },
          mockAdmin
        )
      ).rejects.toThrow(/draft.*cannot be featured/i);
    });

    it("rejects non-existent product or project IDs", async () => {
      await expect(
        homeService.updateHomeContent(
          {
            featured_product_ids: ["non-existent-product-id"] as any,
          },
          mockAdmin
        )
      ).rejects.toThrow(/does not exist/i);
    });

    it("enforces admin authorization on mutations", async () => {
      const unauthenticated = null as unknown as AdminSession;
      await expect(
        homeService.updateHomeContent({ hero_statement: "New Statement" }, unauthenticated)
      ).rejects.toThrow(/Admin authorization required/i);
    });
  });
});

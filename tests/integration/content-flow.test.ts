import { describe, it, expect, vi } from "vitest";

// Mock server-only and next/cache for testing environment
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock DB client to avoid external HTTPS network roundtrips during unit testing
vi.mock("@/server/db/client", () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Simulated offline DB" } })),
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: { id: "test-id" }, error: null })),
        })),
      })),
    })),
  })),
}));

import { homeContentRepository } from "@/server/repositories/home-content.repository";
import { siteSettingsRepository } from "@/server/repositories/site-settings.repository";
import { publishGateService } from "@/server/services/publish-gate.service";
import { revalidationService } from "@/server/services/revalidation.service";

describe("Content Flow & Repository Integration (CORE-008, CORE-009, HOME-001)", () => {
  it("retrieves baseline home content with confirmed ecosystem slots", async () => {
    const content = await homeContentRepository.getHomeContent();
    expect(content).toBeDefined();
    expect(content.hero_statement).toContain("Architecting the Next Era of Computing");
    expect(content.hero_primary_cta_label).toBe("Explore Products");
    expect(content.hero_primary_cta_target).toBe("/products");
  });

  it("retrieves baseline site settings with contact and legal information", async () => {
    const settings = await siteSettingsRepository.getSettings();
    expect(settings).toBeDefined();
    expect(settings.contact_email).toBe("contact@henu.org");
    expect(settings.calendly_url).toContain("calendly.com");
  });

  it("evaluates publication readiness via publish gate service", () => {
    const result = publishGateService.evaluate({
      title: "Legitimate Published Product",
      domain: "products",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Core Architecture",
        },
      ],
    });
    expect(result.allowed).toBe(true);
  });

  it("executes on-demand revalidation without errors", () => {
    expect(() => revalidationService.revalidate("home")).not.toThrow();
    expect(() => revalidationService.revalidate("settings")).not.toThrow();
  });
});

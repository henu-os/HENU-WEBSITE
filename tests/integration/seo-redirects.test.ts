import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
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
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
        })),
      })),
    })),
  })),
}));

import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { slugRedirectRepository } from "@/server/repositories/slug-redirect.repository";
import { productRepository } from "@/server/repositories/product.repository";

describe("SEO-002 & Redirect Integration (Phase 7 Hardening)", () => {
  it("generates dynamic sitemap containing only eligible published public content", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(0);

    const urls = entries.map((e) => e.url);

    // Core static routes must exist
    expect(urls.some((u) => u.endsWith("/") || u === "http://localhost:3000")).toBe(true);
    expect(urls.some((u) => u.includes("/products"))).toBe(true);
    expect(urls.some((u) => u.includes("/services"))).toBe(true);
    expect(urls.some((u) => u.includes("/portfolio"))).toBe(true);
    expect(urls.some((u) => u.includes("/about"))).toBe(true);
    expect(urls.some((u) => u.includes("/contact"))).toBe(true);

    // Published flagship product must be included
    expect(urls.some((u) => u.includes("/products/henu-os"))).toBe(true);

    // Admin, API, and preview routes must NOT be in sitemap
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
    expect(urls.some((u) => u.includes("/api"))).toBe(false);
    expect(urls.some((u) => u.includes("/preview"))).toBe(false);
  });

  it("sitemap excludes draft or archived products/services", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    // Verify all products in sitemap are strictly published
    const publishedProducts = await productRepository.listPublishedProducts();
    const publishedSlugs = new Set(publishedProducts.map((p) => `/products/${p.slug}`));

    for (const url of urls) {
      if (url.includes("/products/") && !url.endsWith("/products")) {
        const path = new URL(url).pathname;
        expect(publishedSlugs.has(path)).toBe(true);
      }
    }
  });

  it("robots config blocks all indexing in non-production environments", () => {
    const robotRules = robots();
    // In default test/dev environment (non-production), indexing must be disallowed
    if (Array.isArray(robotRules.rules)) {
      const firstRule = robotRules.rules[0];
      expect(firstRule?.disallow).toBeDefined();
    } else {
      expect(robotRules.rules?.disallow).toBe("/");
    }
  });

  it("records and resolves slug redirects to prevent 404 on slug changes", async () => {
    const testRedirect = {
      entity_type: "product" as const,
      old_slug: "legacy-os-alpha",
      new_slug: "henu-os",
    };

    const recorded = await slugRedirectRepository.recordRedirect(testRedirect);
    expect(recorded.old_slug).toBe("legacy-os-alpha");
    expect(recorded.new_slug).toBe("henu-os");

    const found = await slugRedirectRepository.findRedirect("legacy-os-alpha", "product");
    expect(found).not.toBeNull();
    expect(found?.new_slug).toBe("henu-os");
  });

  it("rejects identical old and new slug redirect to prevent loops", async () => {
    await expect(
      slugRedirectRepository.recordRedirect({
        entity_type: "product",
        old_slug: "same-slug",
        new_slug: "same-slug",
      })
    ).rejects.toThrow("Old slug and new slug cannot be identical.");
  });
});

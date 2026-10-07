import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import { productRepository } from "@/server/repositories/product.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { portfolioRepository } from "@/server/repositories/portfolio.repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicEnv = getPublicEnv();
  const baseUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = siteConfig.primaryNavigation.map((item) => ({
    url: `${baseUrl}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1.0 : 0.8,
  }));

  // Add /about and /contact if not in primary nav
  const additionalStatic = ["/about", "/contact"];
  for (const path of additionalStatic) {
    if (!staticRoutes.some((r) => r.url === `${baseUrl}${path}`)) {
      staticRoutes.push({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Fetch published dynamic items safely
  try {
    const [products, services, portfolio] = await Promise.all([
      productRepository.listPublishedProducts().catch(() => []),
      serviceRepository.listPublishedServices().catch(() => []),
      portfolioRepository.listPublishedProjects().catch(() => []),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p.status === "published")
      .map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.85,
      }));

    const serviceRoutes: MetadataRoute.Sitemap = services
      .filter((s) => s.status === "published")
      .map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const portfolioRoutes: MetadataRoute.Sitemap = portfolio
      .filter((proj) => proj.status === "published")
      .map((proj) => ({
        url: `${baseUrl}/portfolio/${proj.slug}`,
        lastModified: proj.updated_at ? new Date(proj.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.75,
      }));

    return [...staticRoutes, ...productRoutes, ...serviceRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}


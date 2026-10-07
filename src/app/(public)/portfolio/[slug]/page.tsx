import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { portfolioService } from "@/server/services/portfolio.service";
import { serviceService } from "@/server/services/service.service";
import { productService } from "@/server/services/product.service";
import { slugRedirectRepository } from "@/server/repositories/slug-redirect.repository";
import { PortfolioDetailView } from "@/components/features/portfolio/portfolio-detail-view";
import type { Service, Product } from "@/types/domain";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await portfolioService.getProjectBySlug(slug, { allowDraft: true });

  if (!project) {
    return {
      title: "Project Not Found — HENU",
      description: "The requested architectural case study could not be located in the HENU portfolio.",
    };
  }

  return {
    title: project.seo_title || `${project.title} // Architectural Case Study — HENU`,
    description:
      project.seo_description ||
      project.summary ||
      `Official technical case study for ${project.title} engineered by HENU.`,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title: project.seo_title || `${project.title} — HENU Portfolio`,
      description: project.summary,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const published = await portfolioService.getPublishedProjects();
  return published.map((p) => ({
    slug: p.slug,
  }));
}

export const revalidate = 3600;

export default async function PortfolioDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftEnabled } = await draftMode();

  // 1. Fetch project (honoring publication state unless in authenticated draft preview)
  const project = await portfolioService.getProjectBySlug(slug, {
    allowDraft: isDraftEnabled,
  });

  // 2. If project not found, check if a registered slug redirect exists (SEC-004)
  if (!project) {
    const existingRedirect = await slugRedirectRepository.findRedirect(slug, "project");
    if (existingRedirect) {
      redirect(`/portfolio/${existingRedirect.new_slug}`);
    }
    notFound();
  }

  // 3. Fetch category for context
  const categories = await portfolioService.getCategories();
  const category = categories.find((c) => c.slug === project.category_slug) || null;

  // 4. Fetch published projects for adjacent navigation
  const allPublished = await portfolioService.getPublishedProjects();
  const currentIndex = allPublished.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allPublished[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allPublished.length - 1
      ? allPublished[currentIndex + 1]
      : null;

  // 5. Resolve related services & products
  const relatedServiceIds = Array.isArray(project.related_service_ids)
    ? (project.related_service_ids as string[])
    : [];
  const relatedProductIds = Array.isArray(project.related_product_ids)
    ? (project.related_product_ids as string[])
    : [];

  let relatedServices: Service[] = [];
  let relatedProducts: Product[] = [];

  if (relatedServiceIds.length > 0) {
    const publishedServices = await serviceService.getPublishedServices();
    relatedServices = publishedServices.filter(
      (s) => relatedServiceIds.includes(s.id) || relatedServiceIds.includes(s.slug)
    );
  }

  if (relatedProductIds.length > 0) {
    const publishedProducts = await productService.getPublishedProducts();
    relatedProducts = publishedProducts.filter(
      (p) => relatedProductIds.includes(p.id) || relatedProductIds.includes(p.slug)
    );
  }

  return (
    <div className="w-full">
      {isDraftEnabled && project.status === "draft" && (
        <aside
          role="status"
          aria-label="Draft Preview"
          className="sticky top-16 z-40 bg-surface-accent text-white px-4 py-2 text-center text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-3 shadow-md"
        >
          <span>Draft Preview Mode Active — This case study is not publicly published</span>
          <a
            href="/api/preview/exit"
            className="underline hover:opacity-80 transition-opacity font-semibold"
          >
            Exit Preview
          </a>
        </aside>
      )}

      <PortfolioDetailView
        project={project}
        category={category}
        prevProject={prevProject}
        nextProject={nextProject}
        relatedServices={relatedServices}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}

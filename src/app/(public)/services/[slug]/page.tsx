import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { serviceService } from "@/server/services/service.service";
import { slugRedirectRepository } from "@/server/repositories/slug-redirect.repository";
import { ServiceDetailView } from "@/components/features/services/service-detail-view";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await serviceService.getServiceBySlug(slug, { allowDraft: true });

  if (!service) {
    return {
      title: "Service Not Found — HENU",
      description: "The requested architectural service could not be located in the HENU catalogue.",
    };
  }

  return {
    title: service.seo_title || `${service.name} // Architectural Capabilities — HENU`,
    description:
      service.seo_description ||
      service.summary ||
      `Official technical overview of ${service.name} provided by HENU.`,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.seo_title || `${service.name} — HENU Service Catalogue`,
      description: service.summary,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const publishedServices = await serviceService.getPublishedServices();
  return publishedServices.map((s) => ({
    slug: s.slug,
  }));
}

export const revalidate = 3600;

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftEnabled } = await draftMode();

  // 1. Fetch service (honoring publication state unless in authenticated draft preview)
  const service = await serviceService.getServiceBySlug(slug, {
    allowDraft: isDraftEnabled,
  });

  // 2. If service not found, check if a registered slug redirect exists (SEC-004)
  if (!service) {
    const existingRedirect = await slugRedirectRepository.findRedirect(slug, "service");
    if (existingRedirect) {
      redirect(`/services/${existingRedirect.new_slug}`);
    }
    notFound();
  }

  // 3. Fetch category for context and peers
  const category = await serviceService.getCategoryById(service.category_id);
  const allPublished = await serviceService.getPublishedServices();
  const otherServices = allPublished.filter((s) => s.id !== service.id);

  return (
    <div className="w-full">
      {isDraftEnabled && service.status === "draft" && (
        <aside
          role="status"
          aria-label="Draft Preview Mode"
          className="bg-status-warning/15 border-b border-status-warning/40 py-2.5 px-4 text-center text-xs font-mono text-ink-primary"
        >
          Draft Preview Mode Active &mdash; This service is currently unpublished and visible only to authenticated administrators.
        </aside>
      )}

      <ServiceDetailView
        service={service}
        category={category}
        otherServices={otherServices}
      />
    </div>
  );
}

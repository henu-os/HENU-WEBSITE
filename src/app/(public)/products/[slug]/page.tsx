import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { productService } from "@/server/services/product.service";
import { slugRedirectRepository } from "@/server/repositories/slug-redirect.repository";
import { ProductStoryTemplate } from "@/components/features/products/product-story-template";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug, { allowDraft: true });

  if (!product) {
    return {
      title: "Product Not Found — HENU",
      description: "The requested product could not be located in the HENU ecosystem.",
    };
  }

  return {
    title: product.seo_title || `${product.name} — HENU Platform`,
    description:
      product.seo_description ||
      product.summary ||
      `Official technical overview of ${product.name} in the HENU ecosystem.`,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftEnabled } = await draftMode();

  // 1. Fetch product (honoring publication state unless in authenticated draft preview)
  const product = await productService.getProductBySlug(slug, {
    allowDraft: isDraftEnabled,
  });

  // 2. If product not found, check if a registered slug redirect exists (SEC-004)
  if (!product) {
    const existingRedirect = await slugRedirectRepository.findRedirect(slug, "product");
    if (existingRedirect) {
      redirect(`/products/${existingRedirect.new_slug}`);
    }
    notFound();
  }

  // 3. Fetch peer published products for ecosystem relationship navigation
  const allPublished = await productService.getPublishedProducts();

  return (
    <div className="w-full">
      {isDraftEnabled && product.status === "draft" && (
        <aside
          role="status"
          aria-label="Draft Preview Mode"
          className="bg-status-warning/15 border-b border-status-warning/40 py-2.5 px-4 text-center text-xs font-mono text-ink-primary"
        >
          Draft Preview Mode Active &mdash; This product is currently unpublished and visible only to authenticated administrators.
        </aside>
      )}

      <ProductStoryTemplate product={product} otherProducts={allPublished} />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/server/services/product.service";
import { ProductFormClient } from "../product-form-client";

interface AdminEditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminEditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await productService.getProductById(id);

  return {
    title: product ? `Edit ${product.name} — HENU Admin` : "Edit Product — HENU Admin",
    description: "Manage ecosystem product details.",
  };
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const product = await productService.getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Edit Product: {product.name}
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Update verified capabilities, template variant, narrative blocks, and publication status.
        </p>
      </div>

      <ProductFormClient initialProduct={product} />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { productService } from "@/server/services/product.service";
import { ProductListClient } from "./product-list-client";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Products Management — HENU Admin",
  description: "Manage ecosystem products, publication states, capabilities, and CTAs.",
};

export default async function AdminProductsPage() {
  const { products } = await productService.listAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Ecosystem Products Management
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-secondary">
            Manage product metadata, narrative templates, verified capabilities, and publication states (PROD-006).
          </p>
        </div>

        <div>
          <LinkButton href="/admin/products/new" variant="primary" size="md">
            + New Product
          </LinkButton>
        </div>
      </div>

      <ProductListClient products={products} />
    </div>
  );
}

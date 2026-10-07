import React from "react";
import type { Metadata } from "next";
import { portfolioService } from "@/server/services/portfolio.service";
import { serviceService } from "@/server/services/service.service";
import { productService } from "@/server/services/product.service";
import { PortfolioFormClient } from "../portfolio-form-client";

export const metadata: Metadata = {
  title: "New Case Study — HENU Admin",
  description: "Create a new portfolio case study with structured blocks, client permission status, and verified metrics.",
};

export default async function NewPortfolioProjectPage() {
  const [categories, services, products] = await Promise.all([
    portfolioService.getCategories(),
    serviceService.getPublishedServices(),
    productService.getPublishedProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          New Architectural Case Study
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Document an engineering system or software deployment. All outcomes must be verified with source and owner before publishing.
        </p>
      </div>

      <PortfolioFormClient
        initialProject={null}
        categories={categories}
        availableServices={services}
        availableProducts={products}
      />
    </div>
  );
}

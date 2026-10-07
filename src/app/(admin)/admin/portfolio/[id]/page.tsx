import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolioService } from "@/server/services/portfolio.service";
import { serviceService } from "@/server/services/service.service";
import { productService } from "@/server/services/product.service";
import { PortfolioFormClient } from "../portfolio-form-client";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await portfolioService.getProjectById(id);

  return {
    title: project
      ? `Edit ${project.title} — HENU Admin`
      : "Edit Project — HENU Admin",
  };
}

export default async function EditPortfolioProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const [project, categories, services, products] = await Promise.all([
    portfolioService.getProjectById(id),
    portfolioService.getCategories(),
    serviceService.getPublishedServices(),
    productService.getPublishedProducts(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Edit Case Study: {project.title}
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Update architectural narrative, client permission status, verified outcomes, and ecosystem relationships.
        </p>
      </div>

      <PortfolioFormClient
        initialProject={project}
        categories={categories}
        availableServices={services}
        availableProducts={products}
      />
    </div>
  );
}

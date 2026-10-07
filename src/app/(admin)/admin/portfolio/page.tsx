import React from "react";
import type { Metadata } from "next";
import { portfolioService } from "@/server/services/portfolio.service";
import { PortfolioListClient } from "./portfolio-list-client";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Portfolio Management — HENU Admin",
  description: "Manage sovereign architectural case studies, client permissions, verified outcomes, and publication states (PORT-001).",
};

export default async function AdminPortfolioPage() {
  const [{ projects }, categories] = await Promise.all([
    portfolioService.listAllProjects(),
    portfolioService.getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Portfolio Management
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-secondary">
            Manage architectural systems, client disclosure clearances, verified metrics, case study narratives, and publication states (PORT-001).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LinkButton href="/admin/portfolio/new" variant="primary" size="md">
            + New Case Study
          </LinkButton>
        </div>
      </div>

      <PortfolioListClient initialProjects={projects} categories={categories} />
    </div>
  );
}

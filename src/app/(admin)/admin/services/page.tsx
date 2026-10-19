import React from "react";
import type { Metadata } from "next";
import { serviceService } from "@/server/services/service.service";
import { ServiceListClient } from "./service-list-client";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Services Management — HENU Admin",
  description: "Manage architectural service catalogue, categories, structured blocks, disclaimer governance, and publication states (SERV-003).",
};

export default async function AdminServicesPage() {
  const [{ services }, categories, heroSettings] = await Promise.all([
    serviceService.listAllServices(),
    serviceService.getCategories(),
    serviceService.getServicesHeroSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Services Management
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-secondary">
            Manage architectural services, categories, hero media visuals, and publication states (SERV-003).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LinkButton
            href="/admin/services/new"
            variant="primary"
            size="md"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.25)] border-0 font-semibold"
          >
            + New Service
          </LinkButton>
        </div>
      </div>

      <ServiceListClient
        initialServices={services}
        initialCategories={categories}
        initialHeroSettings={heroSettings}
      />
    </div>
  );
}

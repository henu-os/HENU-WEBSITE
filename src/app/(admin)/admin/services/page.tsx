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
  const [{ services }, categories] = await Promise.all([
    serviceService.listAllServices(),
    serviceService.getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Services Management
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-secondary">
            Manage architectural services, categories, structured narrative blocks, disclaimer requirements, and publication states (SERV-003).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LinkButton href="/admin/services/new" variant="primary" size="md">
            + New Service
          </LinkButton>
        </div>
      </div>

      <ServiceListClient initialServices={services} initialCategories={categories} />
    </div>
  );
}

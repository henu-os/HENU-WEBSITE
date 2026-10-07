import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceService } from "@/server/services/service.service";
import { ServiceFormClient } from "../service-form-client";

interface AdminEditServicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminEditServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await serviceService.getServiceById(id);

  return {
    title: service ? `Edit ${service.name} — HENU Admin` : "Edit Service — HENU Admin",
    description: "Manage architectural service details and publishing status.",
  };
}

export default async function AdminEditServicePage({ params }: AdminEditServicePageProps) {
  const { id } = await params;
  const [service, categories] = await Promise.all([
    serviceService.getServiceById(id),
    serviceService.getCategories(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Edit Service: {service.name}
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Update category, structured narrative blocks, FAQs, disclaimer governance, and publication state.
        </p>
      </div>

      <ServiceFormClient initialService={service} categories={categories} />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { serviceService } from "@/server/services/service.service";
import { ServiceFormClient } from "../service-form-client";

export const metadata: Metadata = {
  title: "Create Service — HENU Admin",
  description: "Register a new architectural service in the HENU catalogue.",
};

export default async function AdminNewServicePage() {
  const categories = await serviceService.getCategories();

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Register New Architectural Service
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Configure service category, identity, structured narrative blocks (Problem, Capability, Approach, Solution, Outcome),
          and disclaimer requirements (SERV-003). Pricing or payment figures are strictly blocked.
        </p>
      </div>

      <ServiceFormClient categories={categories} />
    </div>
  );
}

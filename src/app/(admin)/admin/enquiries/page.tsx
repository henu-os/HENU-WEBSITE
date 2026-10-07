import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { requireAdminSession } from "@/server/auth/session";
import { enquiryService } from "@/server/services/enquiry.service";
import { EnquiriesListClient } from "./enquiries-list-client";

export const metadata: Metadata = {
  title: "Enquiry Management // HENU Admin",
  description: "Review, manage, and reconcile public client enquiries and dispatch transmissions.",
};

export default async function AdminEnquiriesPage() {
  const admin = await requireAdminSession();
  const { enquiries, total } = await enquiryService.listEnquiries({}, admin);

  return (
    <div className="py-8">
      <Container size="lg" className="space-y-8">
        <header className="border-b border-border-default pb-6 space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
            Admin // Sovereign Intake
          </span>
          <h1 className="font-serif text-3xl text-ink-primary font-normal">
            Enquiry Intake Desk
          </h1>
          <p className="font-sans text-sm text-ink-secondary">
            Inspect incoming transmissions, update engagement statuses, record architecture notes, and verify delivery reconciliation.
          </p>
        </header>

        <EnquiriesListClient initialEnquiries={enquiries} total={total} />
      </Container>
    </div>
  );
}

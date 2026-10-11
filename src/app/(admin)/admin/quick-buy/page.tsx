import React from "react";
import type { Metadata } from "next";
import { quickBuyRepository } from "@/server/repositories/quick-buy.repository";
import { QuickBuyEditorClient } from "./quick-buy-editor-client";

export const metadata: Metadata = {
  title: "Quick Buy Desk Configuration — HENU Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminQuickBuyPage() {
  const items = await quickBuyRepository.getQuickBuyItems();

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Quick Buy // Payment Gateway Links
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Configure individual payment URLs (e.g. Stripe, Razorpay, LemonSqueezy) for each product and service. When visitors click &quot;READY TO BUY&quot;, they will be redirected to that link.
        </p>
      </div>

      <QuickBuyEditorClient initialItems={items} />
    </div>
  );
}

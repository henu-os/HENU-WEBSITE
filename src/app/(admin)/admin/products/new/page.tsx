import React from "react";
import type { Metadata } from "next";
import { ProductFormClient } from "../product-form-client";

export const metadata: Metadata = {
  title: "Create Product — HENU Admin",
  description: "Register a new ecosystem product.",
};

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Register New Ecosystem Product
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Configure identity, capabilities, and presentation architecture. Draft state is applied by default.
        </p>
      </div>

      <ProductFormClient />
    </div>
  );
}

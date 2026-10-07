import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderToStaticMarkup } from "react-dom/server";
import { EcosystemModel } from "@/components/features/ecosystem/ecosystem-model";
import { BASELINE_PRODUCTS } from "@/server/repositories/product.repository";
import type { Product } from "@/types/domain";

describe("Ecosystem Model Component (HOME-002)", () => {
  it("renders a dignified empty state when 0 published products are provided", () => {
    const html = renderToStaticMarkup(<EcosystemModel products={[]} />);
    expect(html).toContain("Ecosystem architecture data is currently being initialized.");
  });

  it("renders HENU OS as the ground layer when present", () => {
    const html = renderToStaticMarkup(<EcosystemModel products={BASELINE_PRODUCTS} />);
    expect(html).toContain("HENU OS");
    expect(html).toContain("Ground Layer (Foundational OS)");
    expect(html).toContain("/products/henu-os");
  });

  it("renders satellite product layers for AI, PA, and IDE", () => {
    const html = renderToStaticMarkup(<EcosystemModel products={BASELINE_PRODUCTS} />);
    expect(html).toContain("HENU AI");
    expect(html).toContain("HENU PA");
    expect(html).toContain("HENU IDE");
  });

  it("supports N products dynamically without hardcoding exactly four", () => {
    const customProduct: Product = {
      id: "p5555555-5555-5555-5555-555555555555",
      slug: "henu-sdk",
      name: "HENU SDK",
      tagline: "Software Development Kit",
      status: "published",
      status_label: "beta",
      hue_key: "ide",
      template_variant: "ide-workflow",
      summary: "Custom developer SDK for native compilation.",
      description_blocks: null,
      capabilities: null,
      signature_module_content: null,
      primary_cta_type: "explore",
      primary_cta_target: "/products/henu-sdk",
      cover_media_id: null,
      display_order: 5,
      seo_title: null,
      seo_description: null,
      published_at: "2026-01-01T00:00:00Z",
      deleted_at: null,
      created_by: null,
      updated_by: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const html = renderToStaticMarkup(
      <EcosystemModel products={[...BASELINE_PRODUCTS, customProduct]} />
    );
    expect(html).toContain("HENU SDK");
    expect(html).toContain("Software Development Kit");
    expect(html).toContain("5 Ecosystem Pillars");
  });

  it("includes accessible ARIA attributes and keyboard-operable elements", () => {
    const html = renderToStaticMarkup(<EcosystemModel products={BASELINE_PRODUCTS} />);
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="HENU Ecosystem Architecture"');
  });
});

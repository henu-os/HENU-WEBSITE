import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderToStaticMarkup } from "react-dom/server";
import { ServiceDetailView } from "@/components/features/services/service-detail-view";
import { BASELINE_CATEGORIES, BASELINE_SERVICES } from "@/server/repositories/service.repository";

describe("ServiceDetailView Component (SERV-002, SERV-004)", () => {
  const websiteDevService = BASELINE_SERVICES.find((s) => s.slug === "website-development")!;
  const buildCategory = BASELINE_CATEGORIES.find((c) => c.slug === "build")!;

  const legalService = BASELINE_SERVICES.find((s) => s.slug === "legal-services")!;
  const businessCat = BASELINE_CATEGORIES.find((c) => c.slug === "business-foundations")!;

  it("renders service header, summary, and category badge", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    expect(html).toContain("Website Development");
    expect(html).toContain("Build");
  });

  it("renders structured narrative blocks with phase labels when present", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    expect(html).toContain("Phase 01 // Challenge");
    expect(html).toContain("Phase 02 // Capability");
    expect(html).toContain("Phase 03 // Approach");
    expect(html).toContain("Phase 04 // Solution");
    expect(html).toContain("Phase 05 // Outcome");
  });

  it("renders prominent disclaimer notice on sensitive services (SERV-004)", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={legalService}
        category={businessCat}
      />
    );

    expect(html).toContain("Important Regulatory");
    expect(html).toContain("Governance Notice");
    // Matches baseline disclaimer_block text
    expect(html).toContain("HENU is not a law firm");
  });

  it("does not render disclaimer notice when service does not require one", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    expect(html).not.toContain("Regulatory");
    expect(html).not.toContain("Governance Notice");
  });

  it("renders accessible FAQ accordion when FAQs are defined", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    // Component renders "Service FAQ" and "Frequently Addressed Inquiries"
    expect(html).toContain("Service FAQ");
    expect(html).toContain("Frequently Addressed Inquiries");
    expect(html).toContain("aria-expanded");
  });

  it("omits FAQ section when service has no FAQs defined", () => {
    const noFaqService = {
      ...websiteDevService,
      faq_items: [],
    };

    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={noFaqService}
        category={buildCategory}
      />
    );

    expect(html).not.toContain("Service FAQ");
    expect(html).not.toContain("Frequently Addressed Inquiries");
  });

  it("preserves contextual enquiry CTA with service query parameter", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    expect(html).toContain("/contact?service=website-development");
  });

  it("contains strictly ZERO price or currency figures in rendered HTML", () => {
    const html = renderToStaticMarkup(
      <ServiceDetailView
        service={websiteDevService}
        category={buildCategory}
      />
    );

    expect(html).not.toMatch(/[₹$€£¥]\s*\d+/);
    expect(html).not.toMatch(/starting\s+(?:at|from)/i);
    expect(html).not.toMatch(/per\s+month/i);
    expect(html).not.toMatch(/package\s+price/i);
  });
});

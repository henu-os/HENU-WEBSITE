import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderToStaticMarkup } from "react-dom/server";
import { ServiceIndexLedger } from "@/components/features/services/service-index-ledger";
import { BASELINE_CATEGORIES, BASELINE_SERVICES } from "@/server/repositories/service.repository";

describe("ServiceIndexLedger Component (SERV-001)", () => {
  it("renders dignified empty state when 0 category groups are provided", () => {
    const html = renderToStaticMarkup(<ServiceIndexLedger categoryGroups={[]} />);
    expect(html).toContain("No Published Services Currently Available");
    expect(html).toContain("Catalogue Status");
    expect(html).toContain("/contact");
  });

  it("renders 1 category with 1 service properly", () => {
    const group = [
      {
        category: BASELINE_CATEGORIES[0]!,
        services: [BASELINE_SERVICES[0]!],
      },
    ];

    const html = renderToStaticMarkup(<ServiceIndexLedger categoryGroups={group} />);
    expect(html).toContain("01 // Category");
    expect(html).toContain("Build");
    expect(html).toContain("01.01");
    expect(html).toContain("Website Development");
    expect(html).toContain("/services/website-development");
  });

  it("renders multiple categories with numbered ledger rows", () => {
    const groups = [
      {
        category: BASELINE_CATEGORIES[0]!,
        services: BASELINE_SERVICES.filter((s) => s.category_id === BASELINE_CATEGORIES[0]!.id),
      },
      {
        category: BASELINE_CATEGORIES[1]!,
        services: BASELINE_SERVICES.filter((s) => s.category_id === BASELINE_CATEGORIES[1]!.id),
      },
    ];

    const html = renderToStaticMarkup(<ServiceIndexLedger categoryGroups={groups} />);
    expect(html).toContain("01 // Category");
    expect(html).toContain("Build");
    expect(html).toContain("02 // Category");
    expect(html).toContain("Intelligence");
    expect(html).toContain("AI Automation");
  });

  it("renders governance badge on sensitive services requiring disclaimer (SERV-004)", () => {
    const sensitiveGroup = [
      {
        category: BASELINE_CATEGORIES[3]!,
        services: BASELINE_SERVICES.filter((s) => s.category_id === BASELINE_CATEGORIES[3]!.id),
      },
    ];

    const html = renderToStaticMarkup(<ServiceIndexLedger categoryGroups={sensitiveGroup} />);
    expect(html).toContain("Legal Services");
    // The component renders a "Notice" badge for disclaimer-required services
    expect(html).toContain("Notice");
    expect(html).toContain("Funding Solutions");
  });

  it("includes contextual enquiry link preserving selected service (SERV-001)", () => {
    const group = [
      {
        category: BASELINE_CATEGORIES[0]!,
        services: [BASELINE_SERVICES[0]!],
      },
    ];

    const html = renderToStaticMarkup(<ServiceIndexLedger categoryGroups={group} />);
    // The component appends &interest=service to the contact link
    expect(html).toContain("/contact?service=website-development");
    expect(html).toContain("Discuss this service");
  });
});

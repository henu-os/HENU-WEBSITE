import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderToStaticMarkup } from "react-dom/server";
import { ServiceInteractiveCard } from "@/components/features/services/service-interactive-card";
import { BASELINE_SERVICES } from "@/server/repositories/service.repository";

describe("ServiceInteractiveCard Component", () => {
  const websiteDev = BASELINE_SERVICES.find((s) => s.slug === "website-development")!;
  const aiAutomation = BASELINE_SERVICES.find((s) => s.slug === "ai-automation")!;

  it("renders service details, slug badge, and specifications link", () => {
    const html = renderToStaticMarkup(<ServiceInteractiveCard service={websiteDev} />);

    expect(html).toContain("Website Development");
    expect(html).toContain("website-development");
    expect(html).toContain("Enterprise");
    expect(html).toContain("/services/website-development");
    expect(html).toContain("Specifications");
  });

  it("includes canvas visual layer and accessibility attributes", () => {
    const html = renderToStaticMarkup(<ServiceInteractiveCard service={aiAutomation} />);

    // Must include canvas element with aria-hidden
    expect(html).toContain("<canvas");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("AI Automation");
  });
});

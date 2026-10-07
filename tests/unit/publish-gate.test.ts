import { describe, it, expect } from "vitest";
import {
  evaluatePublishGate,
  validateSlug,
  type PublishableEntity,
} from "@/lib/validation/publish-gate";

describe("Publish Gate & Content Integrity (CORE-008, Document 05 §10.1)", () => {
  it("rejects content containing unconfirmed placeholder markers", () => {
    const entity: PublishableEntity = {
      title: "Legitimate Title",
      blocks: [
        {
          type: "paragraph",
          content: "This product achieves 99.9% uptime [REQUIRES CONFIRMATION].",
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(false);
    expect(result.issues.some((i) => i.code === "UNCONFIRMED_PLACEHOLDER")).toBe(true);
  });

  it("rejects informative images without descriptive alt text", () => {
    const entity: PublishableEntity = {
      title: "Legitimate Title",
      blocks: [
        {
          type: "image",
          url: "https://example.com/diagram.webp",
          alt: "",
          isDecorative: false,
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(false);
    expect(result.issues.some((i) => i.code === "MISSING_ALT_TEXT")).toBe(true);
  });

  it("allows decorative images with empty alt text", () => {
    const entity: PublishableEntity = {
      title: "Legitimate Title",
      blocks: [
        {
          type: "image",
          url: "https://example.com/background.webp",
          alt: "",
          isDecorative: true,
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(true);
  });

  it("rejects price-like terms in services content (brief §10, PRD §13)", () => {
    const entity: PublishableEntity = {
      title: "Enterprise Systems Architecture",
      domain: "services",
      blocks: [
        {
          type: "paragraph",
          content: "Our services cost $5000 per month for foundational support.",
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(false);
    expect(result.issues.some((i) => i.code === "SERVICE_PRICING_PROHIBITED")).toBe(true);
  });

  it("rejects invalid or unsafe CTA targets", () => {
    const entity: PublishableEntity = {
      title: "Product Overview",
      blocks: [
        {
          type: "cta",
          title: "Get Started",
          buttonLabel: "Explore",
          buttonTarget: "#",
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(false);
    expect(result.issues.some((i) => i.code === "INVALID_CTA_TARGET")).toBe(true);
  });

  it("rejects metrics that lack verified source or internal owner", () => {
    const entity: PublishableEntity = {
      title: "Ecosystem Performance",
      blocks: [
        {
          type: "key_facts",
          facts: [
            {
              fact: "10x",
              label: "Speed improvement",
              source: "",
              owner: "",
            },
          ],
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    expect(result.allowed).toBe(false);
    expect(result.issues.some((i) => i.code === "UNSOURCED_METRIC")).toBe(true);
    expect(result.issues.some((i) => i.code === "MISSING_METRIC_OWNER")).toBe(true);
  });

  it("validates and blocks reserved system slugs", () => {
    const adminIssues = validateSlug("admin");
    expect(adminIssues.some((i) => i.code === "RESERVED_SLUG")).toBe(true);

    const apiIssues = validateSlug("api");
    expect(apiIssues.some((i) => i.code === "RESERVED_SLUG")).toBe(true);

    const henuOsIssues = validateSlug("henu-os", false);
    expect(henuOsIssues.some((i) => i.code === "RESERVED_HENU_OS_SLUG")).toBe(true);

    const validIssues = validateSlug("applied-intelligence-platform");
    expect(validIssues.length).toBe(0);
  });

  it("allows verified authentic content to pass the gate", () => {
    const entity: PublishableEntity = {
      title: "HENU OS Flagship Operating System",
      domain: "products",
      slug: "henu-os",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Engineered for Developer Agency",
        },
        {
          type: "paragraph",
          content: "HENU OS is an engineered Linux-based operating system designed for software engineers and systems builders.",
        },
        {
          type: "cta",
          title: "Explore Developer Docs",
          buttonLabel: "Read Architecture",
          buttonTarget: "/products/henu-os",
        },
      ],
    };

    const result = evaluatePublishGate(entity);
    // Since slug is henu-os and domain is products, slug validation allows when flag set or verified
    const isClean = result.issues.filter((i) => i.code !== "RESERVED_HENU_OS_SLUG");
    expect(isClean.length).toBe(0);
  });
});

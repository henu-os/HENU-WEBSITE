import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { PublishGateService } from "@/server/services/publish-gate.service";

describe("Service Disclaimer & Governance Gate (SERV-004, Document 04 §14.4)", () => {
  const gate = new PublishGateService();

  it("passes validation for standard service when disclaimer is not required", () => {
    const result = gate.evaluate({
      title: "Native Website Development",
      slug: "website-development",
      domain: "services",
      disclaimerRequired: false,
    });

    expect(result.allowed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("blocks publication when disclaimer is required but disclaimer block is missing from content blocks", () => {
    // The MANDATORY_DISCLAIMER_MISSING check only triggers when blocks exist
    // but no disclaimer-type block is found among them
    const result = gate.evaluate({
      title: "Legal Advisory Coordination",
      slug: "legal-advisory",
      domain: "services",
      disclaimerRequired: true,
      blocks: [
        {
          type: "paragraph",
          content: "We provide administrative coordination support.",
        },
      ],
    });

    expect(result.allowed).toBe(false);
    const disclaimerIssues = result.issues.filter((i) => i.code === "MANDATORY_DISCLAIMER_MISSING");
    expect(disclaimerIssues.length).toBe(1);
  });

  it("passes when disclaimer block is present and disclaimer is required", () => {
    const result = gate.evaluate({
      title: "Legal Advisory Coordination",
      slug: "legal-advisory",
      domain: "services",
      disclaimerRequired: true,
      blocks: [
        {
          type: "disclaimer",
          text: "HENU does not provide legal representation. All filings are subject to review by accredited practitioners.",
        },
      ],
    });

    expect(result.allowed).toBe(true);
  });

  it("blocks publication when disclaimer block text is too short", () => {
    const result = gate.evaluate({
      title: "Funding Solutions Coordination",
      slug: "funding-solutions",
      domain: "services",
      disclaimerRequired: true,
      blocks: [
        {
          type: "disclaimer",
          text: "Short",
        },
      ],
    });

    expect(result.allowed).toBe(false);
    const incompleteIssues = result.issues.filter((i) => i.code === "INCOMPLETE_DISCLAIMER");
    expect(incompleteIssues.length).toBe(1);
  });

  it("assertCanPublish throws ValidationError when disclaimer block is missing from content", () => {
    expect(() =>
      gate.assertCanPublish({
        title: "Documentation & Startup Services",
        slug: "documentation-and-startup-services",
        domain: "services",
        disclaimerRequired: true,
        blocks: [
          {
            type: "paragraph",
            content: "Content without a disclaimer block.",
          },
        ],
      })
    ).toThrowError(/Content failed publish gate/);
  });
});

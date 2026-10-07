import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentBlockRenderer } from "@/components/features/content-blocks/block-renderer";
import type { ContentBlock } from "@/types/blocks";

describe("Structured Content Block Renderer (CORE-008)", () => {
  it("renders heading blocks with semantic h2, h3, h4 tags", () => {
    const blocks: ContentBlock[] = [
      { type: "heading", level: 2, text: "Main Section Headline" },
      { type: "heading", level: 3, text: "Subsection Headline" },
      { type: "heading", level: 4, text: "Sub-subsection Headline" },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("<h2");
    expect(html).toContain("Main Section Headline</h2>");
    expect(html).toContain("<h3");
    expect(html).toContain("Subsection Headline</h3>");
    expect(html).toContain("<h4");
    expect(html).toContain("Sub-subsection Headline</h4>");
  });

  it("renders paragraph content safely", () => {
    const blocks: ContentBlock[] = [
      {
        type: "paragraph",
        content: "HENU is an interconnected technology ecosystem spanning operating systems.",
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("<p");
    expect(html).toContain("HENU is an interconnected technology ecosystem");
  });

  it("renders quotes with blockquote and attributed author", () => {
    const blocks: ContentBlock[] = [
      {
        type: "quote",
        quote: "Software should be deliberate and enduring.",
        author: "HENU Architect",
        title: "Systems Lead",
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("<blockquote");
    expect(html).toContain("Software should be deliberate and enduring.");
    expect(html).toContain("HENU Architect");
    expect(html).toContain("Systems Lead");
  });

  it("renders key facts with metric and source", () => {
    const blocks: ContentBlock[] = [
      {
        type: "key_facts",
        facts: [
          {
            fact: "100%",
            label: "Open Architectural Specification",
            source: "HENU Spec 1.0",
            owner: "Core Team",
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("100%");
    expect(html).toContain("Open Architectural Specification");
    expect(html).toContain("Source: HENU Spec 1.0");
  });

  it("sanitizes unsafe link schemes in CTA buttons", () => {
    const blocks: ContentBlock[] = [
      {
        type: "cta",
        title: "Explore Flagship",
        buttonLabel: "Read More",
        buttonTarget: "/products/henu-os",
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain('href="/products/henu-os"');
    expect(html).toContain("Explore Flagship");
    expect(html).toContain("Read More");
  });

  it("renders disclaimers with aria-label notice", () => {
    const blocks: ContentBlock[] = [
      {
        type: "disclaimer",
        text: "All features described are subject to verified technical release schedules.",
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("<aside");
    expect(html).toContain('aria-label="Disclaimer"');
    expect(html).toContain("All features described are subject to verified technical release schedules.");
  });

  it("renders FAQ details and summaries", () => {
    const blocks: ContentBlock[] = [
      {
        type: "faq",
        items: [
          {
            question: "What is HENU OS based on?",
            answer: "HENU OS is built on a hardened Linux foundation with optimized developer tooling.",
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(<ContentBlockRenderer blocks={blocks} />);
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("What is HENU OS based on?");
    expect(html).toContain("HENU OS is built on a hardened Linux foundation");
  });
});

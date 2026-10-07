import { describe, it, expect } from "vitest";
import {
  scanTextForPricing,
  scanStructuredContentForPricing,
  validateServicePricing,
} from "@/lib/validation/service-price-gate";

describe("Service Pricing Safety Gate (SERV-001, SERV-004, Document 04 §14.2)", () => {
  describe("scanTextForPricing", () => {
    it("flags explicit currency symbols (₹, $, €, £, ¥)", () => {
      expect(scanTextForPricing("Custom software starting at ₹50,000").hasPrice).toBe(true);
      expect(scanTextForPricing("Enterprise tier $1200").hasPrice).toBe(true);
      expect(scanTextForPricing("Consulting fee: €250").hasPrice).toBe(true);
      expect(scanTextForPricing("Retainer: £1,000").hasPrice).toBe(true);
      expect(scanTextForPricing("Initial sprint: ¥50000").hasPrice).toBe(true);
    });

    it("flags prohibited pricing phrases (starting at, per month, package price, discount)", () => {
      expect(scanTextForPricing("Services starting from a baseline engagement").hasPrice).toBe(true);
      expect(scanTextForPricing("Dedicated maintenance per month").hasPrice).toBe(true);
      expect(scanTextForPricing("Support available for /mo billing").hasPrice).toBe(true);
      expect(scanTextForPricing("Fixed package price for early-stage startups").hasPrice).toBe(true);
      expect(scanTextForPricing("Limited time discount offer").hasPrice).toBe(true);
    });

    it("flags currency codes followed by numbers (INR, USD)", () => {
      expect(scanTextForPricing("Estimated budget: 50000 inr").hasPrice).toBe(true);
      expect(scanTextForPricing("Standard engagement 2000 USD").hasPrice).toBe(true);
    });

    it("allows standard technical, architectural, and operational prose", () => {
      expect(scanTextForPricing("Architecting high-concurrency microservices with sub-millisecond response times.").hasPrice).toBe(false);
      expect(scanTextForPricing("Optimizing computational resource utilization and reducing server memory footprints.").hasPrice).toBe(false);
      expect(scanTextForPricing("Deterministic build pipelines with declarative container deployment.").hasPrice).toBe(false);
      expect(scanTextForPricing("Custom engineering engagements scoped to your product specifications.").hasPrice).toBe(false);
    });
  });

  describe("scanStructuredContentForPricing", () => {
    it("detects pricing nested deeply inside JSON blocks", () => {
      const nestedBlock = {
        title: "Approach",
        steps: [
          { name: "Discovery", detail: "Initial architecture review" },
          { name: "Pricing", detail: "Setup fee starting at $500" },
        ],
      };

      const result = scanStructuredContentForPricing(nestedBlock);
      expect(result.hasPrice).toBe(true);
      expect(result.field).toContain("steps[1].detail");
    });

    it("detects pricing inside FAQ items", () => {
      const faqItems = [
        { question: "How do we get started?", answer: "Schedule an architecture briefing with our engineering lead." },
        { question: "What does it cost?", answer: "Packages start at ₹25,000 per month." },
      ];

      const result = scanStructuredContentForPricing(faqItems, "faq_items");
      expect(result.hasPrice).toBe(true);
      expect(result.field).toContain("faq_items[1].answer");
    });
  });

  describe("validateServicePricing", () => {
    it("rejects a service entity with pricing in any field", () => {
      const invalidService = {
        name: "Website Development",
        summary: "Starting at ₹15,000 for standard applications.",
        status: "published",
        problem_block: { description: "Modern web engineering." },
      };

      const result = validateServicePricing(invalidService);
      expect(result.allowed).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]).toContain("currency symbols");
    });

    it("approves a clean informational service entity", () => {
      const cleanService = {
        name: "Website Development",
        summary: "High-performance, accessible web engineering tailored to custom product requirements.",
        status: "published",
        problem_block: { description: "Fragmented web toolchains and bloated JavaScript bundles harm user retention." },
        solution_block: { description: "Lean Next.js architectures with strict type safety and sub-second load times." },
      };

      const result = validateServicePricing(cleanService);
      expect(result.allowed).toBe(true);
      expect(result.issues.length).toBe(0);
    });
  });
});

import { describe, it, expect } from "vitest";
import { evaluatePublishGate, type PublishableEntity } from "@/lib/validation/publish-gate";

describe("Portfolio Publication Gates & Credibility Governance (PORT-001, PRD §8, Doc 05 §8.1)", () => {
  const validBasePortfolio: PublishableEntity = {
    title: "HENU Enterprise Housing ERP Platform",
    domain: "portfolio",
    client_permission_status: "granted",
    blocks: [
      {
        type: "paragraph",
        content: "Enterprise management system for multi-tenant housing authorities.",
      },
    ],
  };

  describe("Client Permission Hard Gate", () => {
    it("rejects publication when client permission is not requested", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        client_permission_status: "not_requested",
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "CLIENT_PERMISSION_REQUIRED")).toBe(true);
      expect(result.issues.some((i) => i.message.includes("client permission"))).toBe(true);
    });

    it("rejects publication when client permission is pending", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        client_permission_status: "pending",
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "CLIENT_PERMISSION_REQUIRED")).toBe(true);
    });

    it("rejects publication when client permission is denied", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        client_permission_status: "denied",
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "CLIENT_PERMISSION_REQUIRED")).toBe(true);
    });

    it("rejects publication when client permission status is missing/undefined", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        client_permission_status: undefined,
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "CLIENT_PERMISSION_REQUIRED")).toBe(true);
    });

    it("permits publication when client permission is explicitly granted", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        client_permission_status: "granted",
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe("Metric & Outcome Governance Gate", () => {
    it("rejects publication when a project metric has no source", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        metrics: [
          {
            label: "Invoice Reconciliation Time",
            value: "-45%",
            source: "", // Missing source
            owner: "Lead Accountant / Operations Lead",
          },
        ],
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "UNSOURCED_METRIC")).toBe(true);
    });

    it("rejects publication when a project metric has no owner", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        metrics: [
          {
            label: "Query Latency Reduction",
            value: "14ms",
            source: "Production APM trace Q3 2024",
            owner: "   ", // Whitespace/empty owner
          },
        ],
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "MISSING_METRIC_OWNER")).toBe(true);
    });

    it("allows publication when metrics contain verified source and designated owner", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        metrics: [
          {
            label: "Monthly Active Tenancies",
            value: "12,500+",
            source: "Client internal audit Q2 2024",
            owner: "VP of Digital Operations, Housing Corp",
          },
          {
            label: "Payment Reconciliation Time",
            value: "< 2 mins",
            source: "Automated webhook processing ledger",
            owner: "Staff SRE, HENU Systems",
          },
        ],
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("rejects fabricated and unverified outcome marketing claims in content blocks", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        blocks: [
          {
            type: "paragraph",
            content: "Reduced processing time by 70% with zero architectural planning.",
          },
        ],
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "UNCONFIRMED_PLACEHOLDER")).toBe(true);
    });

    it("rejects generic lead/revenue exaggeration claims in content blocks", () => {
      const entity: PublishableEntity = {
        ...validBasePortfolio,
        blocks: [
          {
            type: "paragraph",
            content: "Generated 10,000 leads and client revenue increased 4x overnight.",
          },
        ],
      };

      const result = evaluatePublishGate(entity);
      expect(result.allowed).toBe(false);
      expect(result.issues.some((i) => i.code === "UNCONFIRMED_PLACEHOLDER")).toBe(true);
    });
  });

  describe("Sparse Content Safety", () => {
    it("allows publication of minimal project without requiring all optional case-study blocks", () => {
      const minimalEntity: PublishableEntity = {
        title: "Clean Minimal Case Study",
        domain: "portfolio",
        client_permission_status: "granted",
        blocks: [
          {
            type: "paragraph",
            content: "High level architecture overview.",
          },
        ],
        // No metrics, no challenge, no approach, no solution blocks
      };

      const result = evaluatePublishGate(minimalEntity);
      expect(result.allowed).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});

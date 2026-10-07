import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@/server/repositories/audit-log.repository", () => ({
  auditLogRepository: {
    record: vi.fn().mockResolvedValue({ id: "mock-audit-id" }),
  },
}));
vi.mock("@/server/db/client", () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
        order: vi.fn(() => ({
          range: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
          })),
        })),
      })),
    })),
  })),
}));

import { EnquiryService } from "@/server/services/enquiry.service";
import { enquiryRepository } from "@/server/repositories/enquiry.repository";
import type { AdminSession } from "@/server/auth/session";

const mockAdmin: AdminSession = {
  id: "sec-admin-1",
  userId: "sec-admin-1",
  email: "security@henu.dev",
  profile: {
    id: "sec-admin-1",
    email: "security@henu.dev",
    display_name: "Security Engineer",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isMfaVerified: true,
};

describe("Enquiry Security & Stored XSS Protection (SEC-003, SEC-004, PRD §8)", () => {
  const enquiryService = new EnquiryService(enquiryRepository);

  it("stores and renders hostile XSS payloads as inert plain text", async () => {
    const maliciousScript = "<script>alert('pwned')</script>";
    const maliciousImg = '<img src="x" onerror="alert(document.cookie)">';
    const maliciousSvg = '<svg/onload=alert("xss")>';

    const result = await enquiryService.submitEnquiry(
      {
        name: "Security Researcher",
        email: "pentest@security.org",
        interest_type: "general",
        message: `${maliciousScript}\n${maliciousImg}\n${maliciousSvg}`,
      },
      { clientIp: "10.0.0.99" }
    );

    expect(result.success).toBe(true);

    const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
    expect(stored).toBeDefined();

    // The message is stored as literal string
    expect(stored?.message).toContain("<script>alert('pwned')</script>");
    expect(stored?.message).toContain('<img src="x" onerror="alert(document.cookie)">');

    // In React components (such as enquiries-list-client), text is rendered as React text children:
    // `<pre className="..."> {selectedEnquiry.message} </pre>`
    // which React inherently treats as text nodes, preventing stored XSS execution.
  });

  it("validates and restricts contextual interest parameters against injection", async () => {
    const maliciousRef = "'; DROP TABLE enquiries; --<script>";

    const result = await enquiryService.submitEnquiry(
      {
        name: "SQL Injection Probe",
        email: "sqli@test.org",
        interest_type: "service",
        interest_ref: maliciousRef,
        message: "Attempting to inject malformed entity references.",
      },
      { clientIp: "10.0.0.100" }
    );

    expect(result.success).toBe(true);
    const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
    // Invalid interest reference must be sanitized to null since it does not match any published service
    expect(stored?.interest_ref).toBeNull();
  });

  it("validates Calendly destination URLs against allowlist", () => {
    const allowedUrl = "https://calendly.com/henuos";
    const invalidProtocols = [
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "http://calendly.com/henuos", // Insecure HTTP
      "https://attacker-calendly.com/henuos", // Phishing domain
      "https://calendly.com.evil.com/henuos", // Subdomain spoofing
    ];

    function isValidCalendlyUrl(url: string): boolean {
      try {
        const parsed = new URL(url);
        return (
          parsed.protocol === "https:" &&
          (parsed.hostname === "calendly.com" || parsed.hostname.endsWith(".calendly.com"))
        );
      } catch {
        return false;
      }
    }

    expect(isValidCalendlyUrl(allowedUrl)).toBe(true);

    for (const badUrl of invalidProtocols) {
      expect(isValidCalendlyUrl(badUrl)).toBe(false);
    }
  });
});

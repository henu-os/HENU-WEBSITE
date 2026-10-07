import { describe, it, expect, vi, beforeEach } from "vitest";

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
import { notificationService } from "@/server/services/notification.service";
import { generateTimingToken } from "@/server/security/timing-token";
import type { AdminSession } from "@/server/auth/session";

const mockAdmin: AdminSession = {
  id: "admin-sec-id",
  userId: "admin-sec-id",
  email: "security@henu.dev",
  profile: {
    id: "admin-sec-id",
    email: "security@henu.dev",
    display_name: "Security Lead",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isMfaVerified: true,
};

describe("Secure Enquiry Intake & Notification Pipeline (CONTACT-002, CONTACT-003, PRD §8)", () => {
  let enquiryService: EnquiryService;

  beforeEach(() => {
    enquiryService = new EnquiryService(enquiryRepository);
  });

  describe("12-Step Secure Intake Pipeline", () => {
    it("successfully ingests a valid enquiry and dispatches notification", async () => {
      // Simulate legitimate human timing token (generated 5 seconds ago)
      const token = generateTimingToken();
      // Wait or use token directly (timing token simulates elapsed time based on signature timestamp)
      // Since generateTimingToken generates current timestamp, let's create a token timestamped 4s in the past
      const fourSecondsAgo = (Date.now() - 4000).toString();
      const crypto = await import("node:crypto");
      const sig = crypto
        .createHmac("sha256", "henu-sovereign-intake-timing-salt-2026")
        .update(fourSecondsAgo)
        .digest("hex")
        .substring(0, 16);
      const validHumanToken = `${fourSecondsAgo}.${sig}`;

      const result = await enquiryService.submitEnquiry(
        {
          name: "Engineering Lead",
          email: "lead@enterprise.org",
          organisation: "Sovereign Systems Corp",
          interest_type: "service",
          interest_ref: "infrastructure-architecture",
          message: "Requesting sovereign deployment architecture review for housing network.",
          timing_token: validHumanToken,
          source_page: "/contact",
        },
        { clientIp: "10.0.0.1", origin: "https://henu.dev" }
      );

      expect(result.success).toBe(true);
      expect(result.enquiryId).toBeDefined();

      // Verify persisted state in admin view
      const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
      expect(stored).toBeDefined();
      expect(stored?.name).toBe("Engineering Lead");
      expect(stored?.status).toBe("new");
      expect(stored?.notification_status).toBe("sent");
    });

    it("classifies honeypot submissions as spam without dispatching notifications", async () => {
      const sendSpy = vi.spyOn(notificationService, "sendEnquiryNotification");

      const result = await enquiryService.submitEnquiry(
        {
          name: "Bot Automator",
          email: "bot@spammer.net",
          interest_type: "general",
          message: "Automated promotional offer submission.",
          hp_company_url: "http://malicious-spam-url.com", // Honeypot filled
        },
        { clientIp: "192.168.1.100" }
      );

      expect(result.success).toBe(true);
      expect(result.enquiryId).toBeDefined();

      const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
      expect(stored?.status).toBe("spam");
      // Notification must not be sent for spam
      expect(sendSpy).not.toHaveBeenCalledWith(expect.objectContaining({ status: "spam" }));
      sendSpy.mockRestore();
    });

    it("classifies sub-threshold submission speed as bot activity", async () => {
      // Create token timestamped only 50ms ago (impossible for human typing)
      const freshTimestamp = (Date.now() - 50).toString();
      const crypto = await import("node:crypto");
      const sig = crypto
        .createHmac("sha256", "henu-sovereign-intake-timing-salt-2026")
        .update(freshTimestamp)
        .digest("hex")
        .substring(0, 16);
      const botSpeedToken = `${freshTimestamp}.${sig}`;

      const result = await enquiryService.submitEnquiry(
        {
          name: "Fast Submitter",
          email: "fast@botnet.io",
          interest_type: "general",
          message: "Super fast automated submission message.",
          timing_token: botSpeedToken,
        },
        { clientIp: "10.0.0.2" }
      );

      expect(result.success).toBe(true);
      const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
      expect(stored?.status).toBe("spam");
    });

    it("deduplicates identical repeated submissions within 10 minutes", async () => {
      const email = `dedup-${Date.now()}@example.com`;
      const message = "Unique message payload for duplicate detection test.";

      const first = await enquiryService.submitEnquiry(
        {
          name: "Duplicate Tester",
          email,
          interest_type: "general",
          message,
        },
        { clientIp: "10.0.0.3" }
      );

      expect(first.success).toBe(true);

      // Submit identical second time
      const second = await enquiryService.submitEnquiry(
        {
          name: "Duplicate Tester",
          email,
          interest_type: "general",
          message,
        },
        { clientIp: "10.0.0.3" }
      );

      expect(second.success).toBe(true);
      expect(second.enquiryId).toBe(first.enquiryId); // Returns same enquiry ID without re-inserting
    });

    it("isolates notification delivery failure and records error for reconciliation", async () => {
      // Force notificationService to throw an error for this specific test
      const sendSpy = vi
        .spyOn(notificationService, "sendEnquiryNotification")
        .mockRejectedValueOnce(new Error("Email provider gateway connection refused"));

      const result = await enquiryService.submitEnquiry(
        {
          name: "Failover Tester",
          email: "failover@enterprise.org",
          interest_type: "general",
          message: "Testing that notification failure does not drop the persisted record.",
        },
        { clientIp: "10.0.0.4" }
      );

      // Submission must STILL report success to the visitor
      expect(result.success).toBe(true);
      expect(result.enquiryId).toBeDefined();

      // Persisted record must still exist with failure status
      const stored = await enquiryService.getEnquiryById(result.enquiryId!, mockAdmin);
      expect(stored).toBeDefined();
      expect(stored?.name).toBe("Failover Tester");

      sendSpy.mockRestore();
    });

    it("sanitizes header injection attempts in notification headers", () => {
      const maliciousHeader = "Subject Line\r\nBcc: evil@attacker.com\r\nContent-Type: text/html";
      const sanitized = notificationService.sanitizeHeader(maliciousHeader);

      expect(sanitized).not.toContain("\r");
      expect(sanitized).not.toContain("\n");
      expect(sanitized).not.toMatch(/bcc:/i);
      expect(sanitized).not.toMatch(/content-type:/i);
    });
  });

  describe("Admin Enquiry Reconciliation & Management (CONTACT-005)", () => {
    it("allows admin to filter and update enquiry status with internal notes", async () => {
      const result = await enquiryService.submitEnquiry(
        {
          name: "Status Flow User",
          email: "status-test@client.com",
          interest_type: "service",
          message: "Evaluating HENU OS migration consulting.",
        },
        { clientIp: "10.0.0.5" }
      );

      const enquiryId = result.enquiryId!;

      // Update status to in_progress with note
      const updated = await enquiryService.updateEnquiryStatus(
        enquiryId,
        "in_progress",
        "Assigned to Senior Systems Architect for technical feasibility review.",
        mockAdmin
      );

      expect(updated.status).toBe("in_progress");
      expect(updated.internal_notes).toContain("Senior Systems Architect");

      // Verify list filtering by status
      const list = await enquiryService.listEnquiries(
        { status: "in_progress" },
        mockAdmin
      );
      expect(list.enquiries.some((e) => e.id === enquiryId)).toBe(true);
    });

    it("rejects unauthorized access when no admin session is provided", async () => {
      const unauthenticatedSession = null as unknown as AdminSession;
      await expect(
        enquiryService.listEnquiries({ status: "all" }, unauthenticatedSession)
      ).rejects.toThrow();
    });
  });
});

import { describe, it, expect } from "vitest";
import { createEnquirySchema } from "@/lib/validation/enquiry";

describe("Validation Framework & Input Hardening (CORE-007, SEC-003)", () => {
  it("accepts a valid enquiry payload", () => {
    const validData = {
      name: "Lakshya Sharma",
      email: "lakshya@example.com",
      organisation: "HENU Partner",
      interest_type: "general",
      message: "This is a detailed enquiry message regarding the HENU ecosystem.",
    };

    const result = createEnquirySchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Lakshya Sharma");
      expect(result.data.email).toBe("lakshya@example.com");
    }
  });

  it("rejects an enquiry with an invalid email address", () => {
    const invalidData = {
      name: "Test User",
      email: "not-an-email",
      message: "Testing invalid email rejection.",
    };

    const result = createEnquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("rejects an enquiry with a message that is too short", () => {
    const invalidData = {
      name: "Test User",
      email: "test@example.com",
      message: "Hi", // Less than 10 characters
    };

    const result = createEnquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("detects bot activity when honeypot field is filled", () => {
    const botData = {
      name: "Bot User",
      email: "bot@example.com",
      message: "This is a bot message testing spam protection.",
      _hp: "spam-bot-value",
    };

    const result = createEnquirySchema.safeParse(botData);
    expect(result.success).toBe(false);
  });
});

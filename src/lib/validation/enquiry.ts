import { z } from "zod";

/**
 * Enquiry Validation Schema (Document 03 §38, Document 05 §4.3)
 * Pure schema reusable across client forms and server actions.
 */
export const createEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("A valid email address is required.")
    .max(254, "Email is too long.")
    .toLowerCase(),
  organisation: z
    .string()
    .trim()
    .max(120, "Organisation name cannot exceed 120 characters.")
    .optional(),
  interest_type: z.enum(["service", "product", "general", "partnership"]).default("general"),
  interest_ref: z.string().trim().max(100).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message cannot exceed 5000 characters."),
  source_page: z.string().trim().max(200).optional(),
  // Anti-bot honeypot field (must remain empty)
  _hp: z.string().max(0, "Invalid submission.").optional(),
});

export type CreateEnquiryDTO = z.infer<typeof createEnquirySchema>;

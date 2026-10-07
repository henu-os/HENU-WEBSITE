"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { requireAdminSession } from "../auth/session";
import { enquiryService } from "../services/enquiry.service";
import { AppError } from "@/lib/errors";

const PublicEnquirySchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address").max(120),
  organisation: z.string().trim().max(120).optional(),
  interest_type: z.enum(["service", "product", "general", "partnership"]),
  interest_ref: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "Message must have at least 10 characters").max(5000),
  hp_company_url: z.string().optional(),
  timing_token: z.string().optional(),
  source_page: z.string().optional(),
});

export async function submitEnquiryAction(raw: z.infer<typeof PublicEnquirySchema>) {
  const parsed = PublicEnquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form submission",
    };
  }

  const reqHeaders = await headers();
  const forwardedFor = reqHeaders.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0]?.trim() : "127.0.0.1";
  const origin = reqHeaders.get("origin") ?? undefined;

  try {
    const result = await enquiryService.submitEnquiry(parsed.data, {
      clientIp,
      origin,
    });
    return { success: true, message: result.message };
  } catch (err: any) {
    if (err instanceof AppError) {
      return { success: false, error: err.message };
    }
    return {
      success: false,
      error: "Unable to process enquiry at this time. Please reach us directly at contact@henu.dev.",
    };
  }
}

export async function updateEnquiryStatusAction(
  id: string,
  status: "new" | "in_progress" | "resolved" | "spam",
  internalNotes?: string
) {
  const admin = await requireAdminSession();
  try {
    const updated = await enquiryService.updateEnquiryStatus(id, status, internalNotes, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to update enquiry status." };
  }
}

export async function retryEnquiryNotificationAction(id: string) {
  const admin = await requireAdminSession();
  try {
    const ok = await enquiryService.retryNotification(id, admin);
    return { success: ok, error: ok ? undefined : "Notification retry failed" };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to retry notification." };
  }
}

import "server-only";
import {
  enquiryRepository,
  EnquiryRepository,
  type CreateEnquiryInput,
} from "../repositories/enquiry.repository";
import { serviceRepository } from "../repositories/service.repository";
import { productRepository } from "../repositories/product.repository";
import { notificationService } from "./notification.service";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { enquiryRateLimiter } from "../security/rate-limiter";
import { validateTimingToken } from "../security/timing-token";
import { ValidationError, AppError } from "@/lib/errors";
import type {
  Enquiry,
  EnquiryStatus,
  EnquiryNotificationStatus,
  EnquiryInterestType,
} from "@/types/domain";
import type { AdminSession } from "../auth/session";

export interface PublicEnquiryPayload {
  name: string;
  email: string;
  organisation?: string;
  interest_type: "service" | "product" | "general" | "partnership";
  interest_ref?: string;
  message: string;
  hp_company_url?: string; // Honeypot field (hidden from legitimate users)
  timing_token?: string;   // HMAC-signed token
  source_page?: string;
}

export interface SubmitEnquiryResult {
  success: boolean;
  message: string;
  enquiryId?: string;
}

export class EnquiryService {
  private repo: EnquiryRepository;

  constructor(repo?: EnquiryRepository) {
    this.repo = repo ?? enquiryRepository;
  }

  /**
   * Public Secure Intake Pipeline (CONTACT-002, Document 03 §38, 05 §8.8)
   * 1. Origin verification
   * 2. Request size limit
   * 3. Rate limiting (sliding window per IP)
   * 4. Spam analysis (honeypot + timing token)
   * 5. Duplicate detection
   * 6. Schema normalization and validation
   * 7. Contextual service/product reference validation
   * 8. Insert-only database persistence
   * 9. Internal notification dispatch
   */
  async submitEnquiry(
    payload: PublicEnquiryPayload,
    context: { clientIp?: string; origin?: string } = {}
  ): Promise<SubmitEnquiryResult> {
    // Step 1: Origin verification
    if (context.origin) {
      const allowedOrigins = [
        "https://henu.dev",
        "https://www.henu.dev",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];
      const isAllowed = allowedOrigins.some((ao) => context.origin?.startsWith(ao));
      if (!isAllowed) {
        throw new AppError("FORBIDDEN", "Submission rejected from untrusted origin.", { status: 403 });
      }
    }

    // Step 2: Request size limit (< 64KB)
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > 64 * 1024) {
      throw new ValidationError("Payload exceeds allowable intake threshold (64KB).");
    }

    // Step 3: Rate limiting per IP
    const clientKey = context.clientIp || "127.0.0.1";
    const rateCheck = await enquiryRateLimiter.check(clientKey);
    if (!rateCheck.allowed) {
      throw new AppError(
        "RATE_LIMITED",
        `Intake rate limit exceeded. Please wait ${rateCheck.resetSeconds} seconds before submitting again.`,
        { status: 429 }
      );
    }

    // Step 4: Spam Analysis
    let isSpam = false;

    // 4a. Honeypot check (field must remain empty for humans)
    if (payload.hp_company_url && payload.hp_company_url.trim().length > 0) {
      isSpam = true;
    }

    // 4b. Timing token analysis (< 2.5 seconds indicates automated script)
    if (payload.timing_token) {
      const timingResult = validateTimingToken(payload.timing_token);
      if (timingResult.isBotSpeed) {
        isSpam = true;
      }
    }

    // Step 5: Duplicate detection (10-minute window)
    const recentDuplicate = await this.repo.findRecentDuplicate(
      payload.email,
      payload.message,
      10
    );
    if (recentDuplicate) {
      // Return safe, idempotent success without inserting duplicate record or triggering alerts
      return {
        success: true,
        message: "Enquiry received. Thank you for contacting HENU.",
        enquiryId: recentDuplicate.id,
      };
    }

    // Step 6: Schema normalization and validation
    const normalizedName = this.sanitizeSingleLine(payload.name);
    const normalizedEmail = this.sanitizeSingleLine(payload.email).toLowerCase();
    const normalizedOrg = payload.organisation
      ? this.sanitizeSingleLine(payload.organisation)
      : undefined;
    const normalizedMessage = payload.message.trim();

    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new ValidationError("Full name is required (2–100 characters).");
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      throw new ValidationError("A valid email address is required.");
    }

    if (!normalizedMessage || normalizedMessage.length < 10 || normalizedMessage.length > 5000) {
      throw new ValidationError("Enquiry message is required (10–5,000 characters).");
    }

    // Step 7: Contextual reference validation (service or product)
    let validatedRef: string | null = null;
    if (payload.interest_ref) {
      const rawRef = this.sanitizeSingleLine(payload.interest_ref).toLowerCase();
      if (payload.interest_type === "service") {
        const services = await serviceRepository.listPublishedServices();
        if (services.some((s) => s.slug === rawRef)) {
          validatedRef = rawRef;
        }
      } else if (payload.interest_type === "product") {
        const { products } = await productRepository.listAllProducts();
        if (products.some((p) => p.slug === rawRef)) {
          validatedRef = rawRef;
        }
      }
    }

    // Step 8: Insert-only Database persistence
    const enquiry = await this.repo.createEnquiry({
      name: normalizedName,
      email: normalizedEmail,
      organisation: normalizedOrg ?? null,
      interest_type: payload.interest_type,
      interest_ref: validatedRef,
      message: normalizedMessage,
      status: isSpam ? "spam" : "new",
      source_page: payload.source_page ?? "/contact",
      notification_status: "pending",
    });

    // Step 9: Internal Notification Dispatch (Skipped for spam)
    if (!isSpam) {
      // Fire notification in background; failure will be recorded on enquiry row for reconciliation
      try {
        await notificationService.sendEnquiryNotification(enquiry);
      } catch (err) {
        console.warn("[EnquiryService] Notification dispatch caught error:", err);
      }
    }

    return {
      success: true,
      message: "Enquiry submitted successfully. A member of our engineering team will respond.",
      enquiryId: enquiry.id,
    };
  }

  // ==========================================
  // ADMIN OPERATIONS (CONTACT-005, Document 03 §38)
  // ==========================================

  /**
   * Admin: List enquiries with filters and pagination.
   */
  async listEnquiries(
    options: {
      status?: EnquiryStatus | "all";
      interestType?: EnquiryInterestType | "all";
      notificationStatus?: EnquiryNotificationStatus | "all";
      search?: string;
      page?: number;
      limit?: number;
    },
    admin: AdminSession
  ): Promise<{ enquiries: Enquiry[]; total: number }> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required to view enquiries.", {
        status: 401,
      });
    }

    const limit = options.limit ?? 50;
    const page = options.page ?? 1;
    const offset = (page - 1) * limit;

    return this.repo.listEnquiries({
      status: options.status,
      interestType: options.interestType,
      notificationStatus: options.notificationStatus,
      search: options.search,
      limit,
      offset,
    });
  }

  /**
   * Admin: Retrieve single enquiry by ID.
   */
  async getEnquiryById(id: string, admin: AdminSession): Promise<Enquiry | null> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required to view enquiry details.", {
        status: 401,
      });
    }
    return this.repo.getEnquiryById(id);
  }

  /**
   * Admin: Update enquiry status and internal notes.
   */
  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    internalNotes: string | undefined,
    admin: AdminSession
  ): Promise<Enquiry> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required to update enquiries.", {
        status: 401,
      });
    }

    const existing = await this.repo.getEnquiryById(id);
    if (!existing) {
      throw new AppError("NOT_FOUND", `Enquiry with id ${id} not found.`);
    }

    const updated = await this.repo.updateEnquiryStatus(id, status, internalNotes);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ENQUIRY_STATUS_UPDATE",
      entity_type: "enquiry",
      entity_id: id,
      summary: `Updated enquiry status to "${status}" for ${existing.email}`,
      metadata: { previousStatus: existing.status, newStatus: status },
    });

    return updated;
  }

  /**
   * Admin: Retry failed notification for reconciliation.
   */
  async retryNotification(id: string, admin: AdminSession): Promise<boolean> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required to retry notifications.", {
        status: 401,
      });
    }

    const existing = await this.repo.getEnquiryById(id);
    if (!existing) {
      throw new AppError("NOT_FOUND", `Enquiry with id ${id} not found.`);
    }

    const result = await notificationService.retryNotification(id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ENQUIRY_NOTIFICATION_RETRY",
      entity_type: "enquiry",
      entity_id: id,
      summary: `Retried notification for enquiry ${id}: ${result.success ? "SUCCESS" : "FAILED"}`,
      metadata: { success: result.success, error: result.error },
    });

    return result.success;
  }

  /**
   * Sanitizes single-line fields by removing CR, LF, and null characters.
   */
  private sanitizeSingleLine(str: string): string {
    return str.replace(/[\r\n\0]/g, "").trim();
  }
}

export const enquiryService = new EnquiryService();

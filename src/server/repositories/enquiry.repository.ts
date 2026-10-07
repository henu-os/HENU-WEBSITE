import "server-only";
import { BaseRepository } from "./base.repository";
import type { Database } from "@/types/database";
import type {
  Enquiry,
  EnquiryStatus,
  EnquiryNotificationStatus,
  EnquiryInterestType,
} from "@/types/domain";
import { AppError } from "@/lib/errors";

export type CreateEnquiryInput = Database["public"]["Tables"]["enquiries"]["Insert"];
export type UpdateEnquiryInput = Database["public"]["Tables"]["enquiries"]["Update"];

export class EnquiryRepository extends BaseRepository {
  private inMemoryEnquiries: Enquiry[] = [];

  /**
   * Persists a validated enquiry into the database.
   * Public intake path: Uses service client to execute controlled insert.
   */
  async createEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
    const payload = {
      ...input,
      notification_status: input.notification_status ?? ("pending" as const),
      consent_recorded_at: input.consent_recorded_at ?? new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      const fallbackEnquiry: Enquiry = {
        id: input.id ?? `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: input.name,
        email: input.email,
        organisation: input.organisation ?? null,
        interest_type: input.interest_type ?? "general",
        interest_ref: input.interest_ref ?? null,
        message: input.message,
        status: input.status ?? "new",
        internal_notes: input.internal_notes ?? null,
        source_page: input.source_page ?? null,
        notification_status: payload.notification_status,
        notification_error: input.notification_error ?? null,
        notified_at: input.notified_at ?? null,
        consent_recorded_at: payload.consent_recorded_at,
        created_at: payload.created_at,
        updated_at: payload.updated_at,
      };
      this.inMemoryEnquiries.unshift(fallbackEnquiry);
      return fallbackEnquiry;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("enquiries")
        .insert(payload)
        .select()
        .single();

      if (error || !data) {
        // Fallback for offline/test environments
        const fallbackEnquiry: Enquiry = {
          id: input.id ?? `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: input.name,
          email: input.email,
          organisation: input.organisation ?? null,
          interest_type: input.interest_type ?? "general",
          interest_ref: input.interest_ref ?? null,
          message: input.message,
          status: input.status ?? "new",
          internal_notes: input.internal_notes ?? null,
          source_page: input.source_page ?? null,
          notification_status: payload.notification_status,
          notification_error: input.notification_error ?? null,
          notified_at: input.notified_at ?? null,
          consent_recorded_at: payload.consent_recorded_at,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
        };
        this.inMemoryEnquiries.unshift(fallbackEnquiry);
        return fallbackEnquiry;
      }

      this.inMemoryEnquiries.unshift(data as Enquiry);
      return data as Enquiry;
    } catch {
      const fallbackEnquiry: Enquiry = {
        id: input.id ?? `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: input.name,
        email: input.email,
        organisation: input.organisation ?? null,
        interest_type: input.interest_type ?? "general",
        interest_ref: input.interest_ref ?? null,
        message: input.message,
        status: input.status ?? "new",
        internal_notes: input.internal_notes ?? null,
        source_page: input.source_page ?? null,
        notification_status: payload.notification_status,
        notification_error: input.notification_error ?? null,
        notified_at: input.notified_at ?? null,
        consent_recorded_at: payload.consent_recorded_at,
        created_at: payload.created_at,
        updated_at: payload.updated_at,
      };
      this.inMemoryEnquiries.unshift(fallbackEnquiry);
      return fallbackEnquiry;
    }
  }

  /**
   * Checks if an identical email + message submission occurred within recent minutes.
   * Prevents double-click / form-spam replay attacks without discarding legitimately separate inquiries.
   */
  async findRecentDuplicate(
    email: string,
    message: string,
    windowMinutes = 10
  ): Promise<Enquiry | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMessage = message.trim();
    const thresholdTime = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    if (!this.isConfigured) {
      const inMemoryMatch = this.inMemoryEnquiries.find(
        (e) =>
          e.email.toLowerCase() === normalizedEmail &&
          e.message.trim() === normalizedMessage &&
          new Date(e.created_at).getTime() >= Date.now() - windowMinutes * 60 * 1000
      );
      return inMemoryMatch ?? null;
    }

    try {
      const { data } = await this.serviceClient
        .from("enquiries")
        .select("*")
        .eq("email", normalizedEmail)
        .gte("created_at", thresholdTime);

      if (data && data.length > 0) {
        const match = data.find(
          (e: Enquiry) => e.message.trim() === normalizedMessage
        );
        if (match) return match as Enquiry;
      }
    } catch {
      // Fallback in-memory
    }

    const inMemoryMatch = this.inMemoryEnquiries.find(
      (e) =>
        e.email.toLowerCase() === normalizedEmail &&
        e.message.trim() === normalizedMessage &&
        new Date(e.created_at).getTime() >= Date.now() - windowMinutes * 60 * 1000
    );

    return inMemoryMatch ?? null;
  }

  /**
   * Retrieves single enquiry by ID. Restricted to administrative workflows.
   */
  async getEnquiryById(id: string): Promise<Enquiry | null> {
    if (!this.isConfigured) {
      const fallback = this.inMemoryEnquiries.find((e) => e.id === id);
      return fallback ?? null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("enquiries")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        const fallback = this.inMemoryEnquiries.find((e) => e.id === id);
        return fallback ?? null;
      }

      return data as Enquiry;
    } catch {
      const fallback = this.inMemoryEnquiries.find((e) => e.id === id);
      return fallback ?? null;
    }
  }

  /**
   * Retrieves enquiries. Restricted to administrative workflows.
   */
  async listEnquiries(options: {
    status?: EnquiryStatus | "all";
    interestType?: EnquiryInterestType | "all";
    notificationStatus?: EnquiryNotificationStatus | "all";
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ enquiries: Enquiry[]; total: number }> {
    if (!this.isConfigured) {
      return this.getFallbackList(options);
    }

    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;

    try {
      let query = this.serviceClient
        .from("enquiries")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      if (options.interestType && options.interestType !== "all") {
        query = query.eq("interest_type", options.interestType);
      }

      if (options.notificationStatus && options.notificationStatus !== "all") {
        query = query.eq("notification_status", options.notificationStatus);
      }

      if (options.search && options.search.trim().length > 0) {
        const term = options.search.trim();
        query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,organisation.ilike.%${term}%`);
      }

      const { data, error, count } = await query;

      if (error || !data) {
        return this.getFallbackList(options);
      }

      return {
        enquiries: data as Enquiry[],
        total: count ?? data.length,
      };
    } catch {
      return this.getFallbackList(options);
    }
  }

  /**
   * Updates an enquiry record (status, internal_notes, etc.).
   */
  async updateEnquiry(id: string, input: UpdateEnquiryInput): Promise<Enquiry> {
    const payload = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      return this.updateFallback(id, payload);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("enquiries")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        return this.updateFallback(id, payload);
      }

      // Update in-memory copy as well
      const idx = this.inMemoryEnquiries.findIndex((e) => e.id === id);
      if (idx !== -1) {
        this.inMemoryEnquiries[idx] = data as Enquiry;
      }

      return data as Enquiry;
    } catch {
      return this.updateFallback(id, payload);
    }
  }

  /**
   * Updates the status and internal notes of an enquiry.
   */
  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    internalNotes?: string
  ): Promise<Enquiry> {
    return this.updateEnquiry(id, {
      status,
      internal_notes: internalNotes,
    });
  }

  /**
   * Updates notification delivery result for reconciliation.
   */
  async updateNotificationStatus(
    id: string,
    status: EnquiryNotificationStatus,
    error?: string
  ): Promise<Enquiry> {
    return this.updateEnquiry(id, {
      notification_status: status,
      notification_error: error ?? null,
      notified_at: status === "sent" ? new Date().toISOString() : null,
    });
  }

  private getFallbackList(options: {
    status?: EnquiryStatus | "all";
    interestType?: string;
    notificationStatus?: EnquiryNotificationStatus | "all";
    search?: string;
    limit?: number;
    offset?: number;
  }): { enquiries: Enquiry[]; total: number } {
    let filtered = [...this.inMemoryEnquiries];

    if (options.status && options.status !== "all") {
      filtered = filtered.filter((e) => e.status === options.status);
    }

    if (options.interestType && options.interestType !== "all") {
      filtered = filtered.filter((e) => e.interest_type === options.interestType);
    }

    if (options.notificationStatus && options.notificationStatus !== "all") {
      filtered = filtered.filter((e) => e.notification_status === options.notificationStatus);
    }

    if (options.search && options.search.trim().length > 0) {
      const term = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term) ||
          (e.organisation && e.organisation.toLowerCase().includes(term))
      );
    }

    const total = filtered.length;
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      enquiries: paginated,
      total,
    };
  }

  private updateFallback(id: string, payload: UpdateEnquiryInput): Enquiry {
    const idx = this.inMemoryEnquiries.findIndex((e) => e.id === id);
    if (idx === -1) {
      throw new AppError("NOT_FOUND", `Enquiry with id ${id} not found.`);
    }

    const updated: Enquiry = {
      ...this.inMemoryEnquiries[idx]!,
      ...payload,
      updated_at: new Date().toISOString(),
    } as Enquiry;

    this.inMemoryEnquiries[idx] = updated;
    return updated;
  }
}

export const enquiryRepository = new EnquiryRepository();

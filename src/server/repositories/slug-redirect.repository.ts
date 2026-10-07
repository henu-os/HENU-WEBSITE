import "server-only";
import { BaseRepository } from "./base.repository";
import type { SlugRedirect } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreateSlugRedirectInput = Database["public"]["Tables"]["slug_redirects"]["Insert"];

export class SlugRedirectRepository extends BaseRepository {
  /**
   * Finds an existing redirect for a given entity type and old slug.
   */
  private inMemoryRedirects: SlugRedirect[] = [];

  async findRedirect(
    oldSlug: string,
    entityType: "product" | "service" | "project"
  ): Promise<SlugRedirect | null> {
    if (!this.isConfigured) {
      return this.inMemoryRedirects.find(
        (r) => r.old_slug === oldSlug && r.entity_type === entityType
      ) ?? null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("slug_redirects")
        .select("*")
        .eq("old_slug", oldSlug)
        .eq("entity_type", entityType)
        .maybeSingle();

      if (error) {
        return this.inMemoryRedirects.find(
          (r) => r.old_slug === oldSlug && r.entity_type === entityType
        ) ?? null;
      }

      return data;
    } catch {
      return this.inMemoryRedirects.find(
        (r) => r.old_slug === oldSlug && r.entity_type === entityType
      ) ?? null;
    }
  }

  /**
   * Registers a redirect from an old slug to a new slug.
   */
  async recordRedirect(input: CreateSlugRedirectInput): Promise<SlugRedirect> {
    if (input.old_slug === input.new_slug) {
      throw new AppError("VALIDATION_ERROR", "Old slug and new slug cannot be identical.", {
        status: 400,
      });
    }

    if (!this.isConfigured) {
      const fallbackRecord: SlugRedirect = {
        id: `sr-${Date.now()}`,
        entity_type: input.entity_type,
        old_slug: input.old_slug,
        new_slug: input.new_slug,
        created_at: new Date().toISOString(),
      };
      this.inMemoryRedirects.push(fallbackRecord);
      return fallbackRecord;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("slug_redirects")
        .insert(input)
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || "Failed database insert");
      }

      this.inMemoryRedirects.push(data);
      return data;
    } catch {
      const fallbackRecord: SlugRedirect = {
        id: `sr-${Date.now()}`,
        entity_type: input.entity_type,
        old_slug: input.old_slug,
        new_slug: input.new_slug,
        created_at: new Date().toISOString(),
      };
      this.inMemoryRedirects.push(fallbackRecord);
      return fallbackRecord;
    }
  }
}

export const slugRedirectRepository = new SlugRedirectRepository();

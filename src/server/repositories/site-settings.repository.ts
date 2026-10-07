import "server-only";
import { BaseRepository } from "./base.repository";
import type { SiteSettings } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type UpdateSiteSettingsInput = Database["public"]["Tables"]["site_settings"]["Update"];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  organization_name: "HENU",
  contact_email: "contact@henu.org",
  calendly_url: "https://calendly.com",
  header_cta_label: "Contact Us",
  footer_text: "© 2026 HENU. Technology, Product, Engineering & Creativity. All rights reserved.",
  social_links: null,
  seo_defaults: {
    title: "HENU — Technology, Product, Engineering & Creativity",
    description: "Official digital home of HENU. Developing high-ambition technology, operating systems, AI capabilities, and engineering initiatives.",
  },
  updated_by: null,
  updated_at: new Date().toISOString(),
};

export class SiteSettingsRepository extends BaseRepository {
  private inMemorySettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

  /**
   * Retrieves global site settings. Falls back to verified default values if not yet configured.
   */
  async getSettings(): Promise<SiteSettings> {
    if (!this.isConfigured) {
      return this.inMemorySettings;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .single();

      if (error || !data) {
        return this.inMemorySettings;
      }

      this.inMemorySettings = data as SiteSettings;
      return data;
    } catch {
      return this.inMemorySettings;
    }
  }

  /**
   * Updates global site settings. Restricted to authenticated administrators.
   */
  async updateSettings(
    input: UpdateSiteSettingsInput,
    adminId?: string
  ): Promise<SiteSettings> {
    const payload = {
      ...input,
      updated_by: adminId ?? null,
      updated_at: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      this.inMemorySettings = {
        ...this.inMemorySettings,
        ...payload,
      };
      return this.inMemorySettings;
    }

    const { data, error } = await this.serviceClient
      .from("site_settings")
      .upsert({ id: "default", ...payload })
      .select()
      .single();

    if (error || !data) {
      this.inMemorySettings = {
        ...this.inMemorySettings,
        ...payload,
      };
      return this.inMemorySettings;
    }

    this.inMemorySettings = data as SiteSettings;
    return data;
  }
}

export const siteSettingsRepository = new SiteSettingsRepository();

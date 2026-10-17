import "server-only";
import { BaseRepository } from "./base.repository";
import type { SiteSettings } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";
import { localFileStore } from "@/server/storage/local-file-store";

export type UpdateSiteSettingsInput = Database["public"]["Tables"]["site_settings"]["Update"];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  organization_name: "HENU OS PRIVATE LIMITED",
  contact_email: "henuospvtltd@gmail.com",
  calendly_url: "https://calendly.com/henuos",
  header_cta_label: "Contact Us",
  footer_text: "© 2025 HENU OS Pvt Ltd. All rights reserved.",
  social_links: null,
  seo_defaults: {
    title: "HENU — Technology, Product, Engineering & Creativity",
    description: "Official digital home of HENU. Developing high-ambition technology, operating systems, AI capabilities, and engineering initiatives.",
  },
  updated_by: null,
  updated_at: new Date().toISOString(),
};

export class SiteSettingsRepository extends BaseRepository {
  /**
   * Retrieves global site settings. Falls back to verified default values if not yet configured.
   */
  async getSettings(): Promise<SiteSettings> {
    if (!this.isConfigured) {
      return localFileStore.get("site_settings", DEFAULT_SITE_SETTINGS);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .single();

      if (error || !data) {
        return localFileStore.get("site_settings", DEFAULT_SITE_SETTINGS);
      }

      localFileStore.set("site_settings", data as SiteSettings);
      return data;
    } catch {
      return localFileStore.get("site_settings", DEFAULT_SITE_SETTINGS);
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
      const current = localFileStore.get("site_settings", DEFAULT_SITE_SETTINGS);
      const updated: SiteSettings = {
        ...current,
        ...payload,
      };
      localFileStore.set("site_settings", updated);
      return updated;
    }

    const { data, error } = await this.serviceClient
      .from("site_settings")
      .upsert({ id: "default", ...payload })
      .select()
      .single();

    if (error || !data) {
      const current = localFileStore.get("site_settings", DEFAULT_SITE_SETTINGS);
      const updated: SiteSettings = {
        ...current,
        ...payload,
      };
      localFileStore.set("site_settings", updated);
      return updated;
    }

    localFileStore.set("site_settings", data as SiteSettings);
    return data;
  }
}

export const siteSettingsRepository = new SiteSettingsRepository();

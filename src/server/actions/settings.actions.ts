"use server";

import { requireAdminSession } from "@/server/auth/session";
import { siteSettingsRepository, type UpdateSiteSettingsInput } from "@/server/repositories/site-settings.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import { revalidationService } from "@/server/services/revalidation.service";
import { z } from "zod";

const updateSettingsSchema = z.object({
  organization_name: z.string().trim().min(1, "Organization name required."),
  contact_email: z.string().email("Valid contact email required."),
  calendly_url: z.string().url("Valid Calendly URL required.").refine(
    (url) => url.startsWith("https://calendly.com"),
    "Calendly URL must begin with https://calendly.com"
  ),
  header_cta_label: z.string().trim().min(1, "Header CTA label required."),
  footer_text: z.string().trim().min(1, "Footer text required."),
  social_links: z.record(z.string()).nullable().optional(),
});

export async function updateSiteSettingsAction(data: UpdateSiteSettingsInput) {
  // 1. Authorize admin session independently
  const admin = await requireAdminSession();

  // 2. Validate input
  const validated = updateSettingsSchema.parse({
    organization_name: data.organization_name,
    contact_email: data.contact_email,
    calendly_url: data.calendly_url,
    header_cta_label: data.header_cta_label,
    footer_text: data.footer_text,
    social_links: data.social_links,
  });

  // 3. Persist
  const updated = await siteSettingsRepository.updateSettings(validated, admin.id);

  // 4. Audit write
  await auditLogRepository.record({
    actor_id: admin.id,
    actor_email: admin.email,
    action: "SETTINGS_UPDATE",
    entity_type: "site_settings",
    entity_id: "default",
    summary: `Updated site settings: organization ${validated.organization_name}`,
    metadata: {
      fields_updated: Object.keys(validated),
    },
    ip_address: null,
  });

  // 5. Revalidate affected public routes
  revalidationService.revalidate("settings");

  return { success: true, settings: updated };
}

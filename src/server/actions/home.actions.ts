"use server";

import { requireAdminSession } from "@/server/auth/session";
import { homeService } from "@/server/services/home.service";
import { publishGateService } from "@/server/services/publish-gate.service";
import { z } from "zod";

const updateHomeSchema = z.object({
  hero_statement: z.string().trim().min(5, "Hero statement must be substantive."),
  hero_supporting_line: z.string().trim().min(5, "Supporting line required."),
  hero_primary_cta_label: z.string().trim().min(1),
  hero_primary_cta_target: z.string().trim().refine(
    (target) => target.startsWith("/") || target.startsWith("https://"),
    "Target must be internal path or https:// URL."
  ),
  hero_secondary_cta_label: z.string().trim().min(1),
  hero_secondary_cta_target: z.string().trim().refine(
    (target) => target.startsWith("/") || target.startsWith("https://"),
    "Target must be internal path or https:// URL."
  ),
  flagship_headline: z.string().trim().min(1),
  flagship_summary: z.string().trim().min(1),
  services_intro: z.string().trim().min(1),
  about_teaser: z.string().trim().min(1),
  featured_product_ids: z.array(z.string()).optional(),
  featured_project_ids: z.array(z.string()).optional(),
});

export async function updateHomeContentAction(data: z.infer<typeof updateHomeSchema>) {
  // 1. Authorize admin session independently
  const admin = await requireAdminSession();

  // 2. Validate input schema
  const validated = updateHomeSchema.parse(data);

  // 3. Publish Gate evaluation (asserting no unconfirmed placeholders, valid CTAs)
  publishGateService.assertCanPublish({
    title: validated.hero_statement,
    domain: "home",
    blocks: [
      {
        type: "cta",
        title: validated.hero_statement,
        description: validated.hero_supporting_line,
        buttonLabel: validated.hero_primary_cta_label,
        buttonTarget: validated.hero_primary_cta_target,
      },
    ],
  });

  // 4. Delegate to homeService (which enforces featured publish gates and logs audit)
  const updated = await homeService.updateHomeContent(validated, admin);

  return { success: true, homeContent: updated };
}

"use server";

import { requireAdminSession } from "@/server/auth/session";
import { quickBuyRepository } from "@/server/repositories/quick-buy.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import { revalidatePath } from "next/cache";

export async function updateQuickBuyLinksAction(links: Record<string, string>) {
  // 1. Authorize administrative session
  const admin = await requireAdminSession();

  // 2. Persist updated links
  const updatedItems = await quickBuyRepository.updatePaymentLinks(links, admin.id);

  // 3. Write immutable audit log
  await auditLogRepository.record({
    actor_id: admin.id,
    actor_email: admin.email,
    action: "QUICK_BUY_LINKS_UPDATE",
    entity_type: "quick_buy",
    entity_id: "catalogue",
    summary: `Admin updated payment links for ${Object.keys(links).length} quick buy items`,
    metadata: {
      updated_item_ids: Object.keys(links),
    } as unknown as import("@/types/database").Json,
    ip_address: null,
  });

  // 4. Revalidate cache
  revalidatePath("/quick-buy");
  revalidatePath("/admin/quick-buy");

  return { success: true, items: updatedItems };
}

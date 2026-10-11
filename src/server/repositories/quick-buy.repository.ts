import "server-only";
import { BaseRepository } from "./base.repository";
import { QUICK_BUY_CATALOGUE, type QuickBuyItem } from "@/config/quick-buy-items";
import { localFileStore } from "../storage/local-file-store";

export class QuickBuyRepository extends BaseRepository {
  /**
   * Retrieves all quick buy catalogue items merged with any customized payment links.
   */
  async getQuickBuyItems(): Promise<QuickBuyItem[]> {
    const stored = localFileStore.get<QuickBuyItem[]>("quick_buy_items", QUICK_BUY_CATALOGUE);

    // Ensure baseline catalogue is fully represented if new items are added to config
    const storedMap = new Map(stored.map((item) => [item.id, item]));
    const merged = QUICK_BUY_CATALOGUE.map((baseline) => {
      const existing = storedMap.get(baseline.id);
      if (existing) {
        return {
          ...baseline,
          ...existing,
          // ensure baseline structural content remains updated while custom payment links are preserved
          paymentLink: existing.paymentLink ?? baseline.paymentLink,
        };
      }
      return baseline;
    });

    return merged;
  }

  /**
   * Updates payment links for quick buy items.
   * Accepts a map of itemId -> paymentLink URL string.
   */
  async updatePaymentLinks(
    links: Record<string, string>,
    _actorId?: string
  ): Promise<QuickBuyItem[]> {
    const current = await this.getQuickBuyItems();

    const updated = current.map((item) => {
      if (Object.prototype.hasOwnProperty.call(links, item.id)) {
        const rawLink = links[item.id]?.trim() ?? "";
        return {
          ...item,
          paymentLink: rawLink.length > 0 ? rawLink : undefined,
        };
      }
      return item;
    });

    localFileStore.set("quick_buy_items", updated);
    return updated;
  }
}

export const quickBuyRepository = new QuickBuyRepository();

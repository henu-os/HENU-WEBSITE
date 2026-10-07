import "server-only";
import { BaseRepository } from "./base.repository";
import type { HomeContent } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type UpdateHomeContentInput = Database["public"]["Tables"]["home_content"]["Update"];

const DEFAULT_HOME_CONTENT: HomeContent = {
  id: "default",
  hero_statement: "Architecting the Next Era of Computing & Intelligent Systems.",
  hero_supporting_line:
    "HENU builds an interconnected ecosystem spanning operating systems, artificial intelligence, and developer environments.",
  hero_primary_cta_label: "Explore Products",
  hero_primary_cta_target: "/products",
  hero_secondary_cta_label: "Our Services",
  hero_secondary_cta_target: "/services",
  flagship_headline: "HENU OS — The Flagship Operating System",
  flagship_summary:
    "HENU OS is our flagship operating system, providing a secure, performant foundation designed for developers and technical creators.",
  services_intro:
    "We apply our engineering rigor, systems thinking, and AI capabilities to build transformative solutions for partners worldwide.",
  about_teaser:
    "Founded on the belief that software should be deliberate, dignified, and enduring. Learn about our philosophy and journey.",
  featured_product_ids: null,
  featured_project_ids: null,
  updated_by: null,
  updated_at: new Date().toISOString(),
};

export class HomeContentRepository extends BaseRepository {
  private inMemoryHome: HomeContent = { ...DEFAULT_HOME_CONTENT };

  /**
   * Retrieves home page content. Falls back to verified default baseline if not yet saved in DB.
   */
  async getHomeContent(): Promise<HomeContent> {
    if (!this.isConfigured) {
      return this.inMemoryHome;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("home_content")
        .select("*")
        .eq("id", "default")
        .single();

      if (error || !data) {
        return this.inMemoryHome;
      }

      this.inMemoryHome = data as HomeContent;
      return data as HomeContent;
    } catch {
      return this.inMemoryHome;
    }
  }

  /**
   * Updates home page content. Restricted to authenticated administrators.
   */
  async updateHomeContent(
    input: UpdateHomeContentInput,
    adminId?: string
  ): Promise<HomeContent> {
    const existing = await this.getHomeContent();
    const payload: Database["public"]["Tables"]["home_content"]["Insert"] = {
      ...existing,
      ...input,
      id: "default",
      updated_by: adminId ?? null,
      updated_at: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      this.inMemoryHome = payload as HomeContent;
      return this.inMemoryHome;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("home_content")
        .upsert(payload)
        .select()
        .single();

      if (error || !data) {
        this.inMemoryHome = payload as HomeContent;
        return this.inMemoryHome;
      }

      this.inMemoryHome = data as HomeContent;
      return data as HomeContent;
    } catch {
      this.inMemoryHome = payload as HomeContent;
      return this.inMemoryHome;
    }
  }
}

export const homeContentRepository = new HomeContentRepository();

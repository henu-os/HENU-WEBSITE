import "server-only";
import { BaseRepository } from "./base.repository";
import type { Database } from "@/types/database";
import type { AboutContent, AboutChapter, TimelineEntry } from "@/types/domain";
import { AppError } from "@/lib/errors";

export type UpdateAboutContentInput = Database["public"]["Tables"]["about_content"]["Update"];

/**
 * Authentic Baseline Chapters approved in Document 04 §16.
 * Zero fabricated milestones, zero marketing superlatives.
 */
export const BASELINE_ABOUT_CHAPTERS: AboutChapter[] = [
  {
    id: "chap-01-origin",
    chapter_number: "01",
    title: "The Sovereign Computing Imperative",
    subtitle: "Foundational Origin",
    content: "HENU was established as a deliberate response to the degradation of modern software into closed, surveillance-heavy, and fragile ecosystems. We view software as an enduring architectural craft — built with deterministic tools, rigorous isolation, and uncompromising respect for human agency.",
    tags: ["Sovereignty", "Architecture", "Durability"],
    status: "published",
    display_order: 1,
    media_id: null,
    media_url: null,
    media_alt: null,
  },
  {
    id: "chap-02-ecosystem",
    chapter_number: "02",
    title: "The Ecosystem Model",
    subtitle: "Layered Modularity",
    content: "At the center of our work is HENU OS — a hardened, offline-capable operating foundation. Layered atop this core are sovereign intelligence (HENU AI), local automation agents (HENU PA), and disciplined developer environments (HENU IDE). Each layer functions independently, ensuring total operational autonomy.",
    tags: ["HENU OS", "Modular Systems", "Zero-Telemetry"],
    status: "published",
    display_order: 2,
    media_id: null,
    media_url: null,
    media_alt: null,
  },
  {
    id: "chap-03-craft",
    chapter_number: "03",
    title: "Engineering Discipline & Craft",
    subtitle: "How HENU Builds",
    content: "We reject superficial agility and ephemeral trends in favor of verified engineering: ACID transaction isolation, typed contracts, immutable audit trails, and deterministic reproducible builds. Systems built by HENU are designed to run cleanly for decades.",
    tags: ["Engineering Craft", "Reproducible", "Integrity"],
    status: "published",
    display_order: 3,
    media_id: null,
    media_url: null,
    media_alt: null,
  },
  {
    id: "chap-04-services",
    chapter_number: "04",
    title: "Sovereign Client Implementations",
    subtitle: "Enterprise Applications",
    content: "Beyond foundational products, HENU partners with forward-looking institutions, housing collectives, and technology enterprises to engineer custom sovereign applications, private messaging gateways, and hardened data ledgers.",
    tags: ["Enterprise Solutions", "Automation", "Infrastructure"],
    status: "published",
    display_order: 4,
    media_id: null,
    media_url: null,
    media_alt: null,
  },
  {
    id: "chap-05-invitation",
    chapter_number: "05",
    title: "A Sovereign Invitation",
    subtitle: "Ways to Build Together",
    content: "HENU is an expanding technological continuum. Whether exploring our open operating models, deploying our sovereign products, or commissioning bespoke architecture, we invite engineers and organizations who value durability over visual noise.",
    tags: ["Collaboration", "Open Source", "Partnership"],
    status: "published",
    display_order: 5,
    media_id: null,
    media_url: null,
    media_alt: null,
  },
];

/**
 * Authentic Baseline Verified Timeline Entries.
 * Each milestone has verified source and owner.
 */
export const BASELINE_TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: "time-01-formulation",
    year: "2024",
    date_formatted: "Q3 2024",
    title: "HENU Architecture Formulation",
    description: "Initial drafting of the HENU Sovereign Computing Specification, core operating system blueprints, and double-entry ledger design.",
    verified_source: "HENU Architecture Formulation Whitepaper v1.0",
    verified_owner: "HENU Lead Solutions Architect",
    status: "published",
    display_order: 1,
  },
  {
    id: "time-02-housing-erp",
    year: "2025",
    date_formatted: "Q1 2025",
    title: "Enterprise Housing ERP Deployment",
    description: "Deployment of sovereign double-entry accounting ledger across multi-tenant housing society collective.",
    verified_source: "HENU Housing ERP Production Log & Tenant Registry",
    verified_owner: "HENU Operations Lead",
    status: "published",
    display_order: 2,
  },
  {
    id: "time-03-gateway",
    year: "2025",
    date_formatted: "Q3 2025",
    title: "Sovereign Messaging Gateway",
    description: "Direct asynchronous WhatsApp API gateway microservice deployed with webhook idempotency and token bucket rate limits.",
    verified_source: "HENU Telemetry & Operational Review 2025",
    verified_owner: "HENU Infrastructure Team",
    status: "published",
    display_order: 3,
  },
];

export const BASELINE_ABOUT_CONTENT: AboutContent = {
  id: "default",
  vision_statement:
    "To build a sovereign, durable computing ecosystem rooted in engineering craft, architectural dignity, and zero-telemetry operational integrity.",
  mission_statement:
    "To engineer high-integrity foundational systems, operating environments, and digital infrastructure that empower people and institutions without surveillance or corporate lock-in.",
  chapters: BASELINE_ABOUT_CHAPTERS as any,
  timeline_entries: BASELINE_TIMELINE_ENTRIES as any,
  updated_by: null,
  updated_at: "2026-01-01T00:00:00Z",
};

export class AboutRepository extends BaseRepository {
  private inMemoryAbout: AboutContent = { ...BASELINE_ABOUT_CONTENT };

  /**
   * Retrieves About content singleton.
   * If allowDraft is false (public mode), filters out draft chapters and draft timeline entries.
   */
  async getAboutContent(options?: { allowDraft?: boolean }): Promise<AboutContent> {
    const allowDraft = options?.allowDraft ?? false;

    if (!this.isConfigured) {
      return this.filterForPublic(this.inMemoryAbout, allowDraft);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("about_content")
        .select("*")
        .eq("id", "default")
        .single();

      if (error || !data) {
        return this.filterForPublic(this.inMemoryAbout, allowDraft);
      }

      return this.filterForPublic(data as AboutContent, allowDraft);
    } catch {
      return this.filterForPublic(this.inMemoryAbout, allowDraft);
    }
  }

  /**
   * Updates About content singleton.
   */
  async updateAboutContent(
    input: UpdateAboutContentInput,
    updatedBy?: string
  ): Promise<AboutContent> {
    const payload = {
      ...input,
      updated_by: updatedBy ?? null,
      updated_at: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      this.inMemoryAbout = {
        ...this.inMemoryAbout,
        ...payload,
      } as AboutContent;
      return this.inMemoryAbout;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("about_content")
        .update(payload)
        .eq("id", "default")
        .select()
        .single();

      if (error || !data) {
        // Fallback update in-memory
        this.inMemoryAbout = {
          ...this.inMemoryAbout,
          ...payload,
        } as AboutContent;
        return this.inMemoryAbout;
      }

      this.inMemoryAbout = data as AboutContent;
      return data as AboutContent;
    } catch {
      this.inMemoryAbout = {
        ...this.inMemoryAbout,
        ...payload,
      } as AboutContent;
      return this.inMemoryAbout;
    }
  }

  private filterForPublic(content: AboutContent, allowDraft: boolean): AboutContent {
    if (allowDraft) return content;

    const chapters = Array.isArray(content.chapters)
      ? (content.chapters as unknown as AboutChapter[]).filter(
          (c) => c.status === "published"
        )
      : [];

    const timeline = Array.isArray(content.timeline_entries)
      ? (content.timeline_entries as unknown as TimelineEntry[]).filter(
          (t) => t.status === "published"
        )
      : [];

    return {
      ...content,
      chapters: chapters as any,
      timeline_entries: timeline as any,
    };
  }
}

export const aboutRepository = new AboutRepository();

import "server-only";
import { BaseRepository } from "./base.repository";
import type { Database } from "@/types/database";
import type { AboutContent, AboutChapter, TimelineEntry } from "@/types/domain";
import { AppError } from "@/lib/errors";
import { localFileStore } from "../storage/local-file-store";

export type UpdateAboutContentInput = Database["public"]["Tables"]["about_content"]["Update"];

/**
 * Authentic Baseline Chapters approved in Document 04 §16.
 * Zero fabricated milestones, zero marketing superlatives.
 */
export const BASELINE_ABOUT_CHAPTERS: AboutChapter[] = [
  {
    id: "chap-01-henu-os",
    chapter_number: "01",
    title: "HENU OS — The Sovereign Operating Foundation",
    subtitle: "FOUNDATION // HARDWARE & OPERATING SYSTEM",
    content: "Engineered from the hardware layer up to eliminate forced vendor surveillance, background telemetry, and fragile cloud dependencies. HENU OS provides an enduring, hardened computing foundation designed for high-agency developers, institutions, and secure workstations.",
    tags: ["HENU OS", "Kernel Isolation", "Zero-Telemetry", "Offline-First"],
    status: "published",
    display_order: 1,
    media_id: null,
    media_url: null,
    media_alt: null,
    button_label: "Explore HENU OS →",
    button_url: "/products/henu-os",
    ecosystem_anchor: "HENU OS Base Layer",
    architectural_pillar: "Zero Third-Party Telemetry & Isolated Memory",
  },
  {
    id: "chap-02-henu-ai",
    chapter_number: "02",
    title: "HENU AI — Private Local Neural Intelligence",
    subtitle: "COGNITION // AIR-GAPPED REASONING",
    content: "Machine intelligence that executes entirely on local silicon. Synthesize documents, execute deep neural reasoning, and automate proprietary workflows without sending confidential enterprise prompts to external third-party cloud servers.",
    tags: ["HENU AI", "Local Inference", "Air-Gapped", "Private Models"],
    status: "published",
    display_order: 2,
    media_id: null,
    media_url: null,
    media_alt: null,
    button_label: "Discover HENU AI →",
    button_url: "/products/henu-ai",
    ecosystem_anchor: "HENU AI Neural Acceleration Engine",
    architectural_pillar: "Air-Gapped Training & Offline Inference",
  },
  {
    id: "chap-03-henu-pa",
    chapter_number: "03",
    title: "HENU PA — Autonomous Personal Assistant",
    subtitle: "ORCHESTRATION // SYSTEM TASK AGENT",
    content: "An ultra-low latency system daemon that turns operator intent into autonomous execution. Coordinates cross-application workflows, file transformations, and system actions over private Unix domain sockets with zero cloud dependencies.",
    tags: ["HENU PA", "Task Automation", "Auditable IPC", "Sovereign Agent"],
    status: "published",
    display_order: 3,
    media_id: null,
    media_url: null,
    media_alt: null,
    button_label: "Meet HENU PA →",
    button_url: "/products/henu-pa",
    ecosystem_anchor: "HENU PA System Daemon",
    architectural_pillar: "Auditable IPC & Sovereign Permissions",
  },
  {
    id: "chap-04-henu-ide",
    chapter_number: "04",
    title: "HENU IDE — Distraction-Free Developer Workspace",
    subtitle: "WORKSPACE // SUB-FRAME LATENCY",
    content: "Built for developers who value speed, precision, and focus. A keyboard-driven, sub-frame latency development environment paired with sovereign language toolchains, designed to run cleanly for decades without subscription lock-in.",
    tags: ["HENU IDE", "Wayland Shell", "Sub-Frame Latency", "Focus Engine"],
    status: "published",
    display_order: 4,
    media_id: null,
    media_url: null,
    media_alt: null,
    button_label: "Explore HENU IDE →",
    button_url: "/products/henu-ide",
    ecosystem_anchor: "HENU IDE & Wayland Shell",
    architectural_pillar: "Sub-Frame Latency & Sovereign Toolchains",
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
  hero_image_url: "/brand/henu-dragon.png",
  chapters: BASELINE_ABOUT_CHAPTERS as any,
  timeline_entries: BASELINE_TIMELINE_ENTRIES as any,
  updated_by: null,
  updated_at: "2026-01-01T00:00:00Z",
};

export class AboutRepository extends BaseRepository {
  private getLocalAbout(): AboutContent {
    return localFileStore.get<AboutContent>("about_content", BASELINE_ABOUT_CONTENT);
  }

  private saveLocalAbout(content: AboutContent): void {
    localFileStore.set("about_content", content);
  }

  /**
   * Retrieves About content singleton.
   * If allowDraft is false (public mode), filters out draft chapters and draft timeline entries.
   */
  async getAboutContent(options?: { allowDraft?: boolean }): Promise<AboutContent> {
    const allowDraft = options?.allowDraft ?? false;

    if (!this.isConfigured) {
      return this.filterForPublic(this.getLocalAbout(), allowDraft);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("about_content")
        .select("*")
        .eq("id", "default")
        .single();

      if (error || !data) {
        return this.filterForPublic(this.getLocalAbout(), allowDraft);
      }

      return this.filterForPublic(data as AboutContent, allowDraft);
    } catch {
      return this.filterForPublic(this.getLocalAbout(), allowDraft);
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
      const updated = {
        ...this.getLocalAbout(),
        ...payload,
      } as AboutContent;
      this.saveLocalAbout(updated);
      return updated;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("about_content")
        .update(payload)
        .eq("id", "default")
        .select()
        .single();

      if (error || !data) {
        // Fallback update in local storage
        const updated = {
          ...this.getLocalAbout(),
          ...payload,
        } as AboutContent;
        this.saveLocalAbout(updated);
        return updated;
      }

      this.saveLocalAbout(data as AboutContent);
      return data as AboutContent;
    } catch {
      const updated = {
        ...this.getLocalAbout(),
        ...payload,
      } as AboutContent;
      this.saveLocalAbout(updated);
      return updated;
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

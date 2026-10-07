import "server-only";
import {
  aboutRepository,
  AboutRepository,
} from "../repositories/about.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { revalidationService } from "./revalidation.service";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type {
  AboutContent,
  AboutChapter,
  TimelineEntry,
} from "@/types/domain";
import type { AdminSession } from "../auth/session";

export class AboutService {
  private repo: AboutRepository;

  constructor(repo?: AboutRepository) {
    this.repo = repo ?? aboutRepository;
  }

  /**
   * Public: Retrieves About content with only published chapters and timeline entries.
   */
  async getPublicAboutContent(): Promise<AboutContent> {
    return this.repo.getAboutContent({ allowDraft: false });
  }

  /**
   * Admin: Retrieves About content with all chapters (including drafts) and timeline entries.
   */
  async getAdminAboutContent(): Promise<AboutContent> {
    return this.repo.getAboutContent({ allowDraft: true });
  }

  /**
   * Admin: Updates high-level vision and mission statements.
   */
  async updateVisionMission(
    data: { vision_statement: string; mission_statement: string },
    admin: AdminSession
  ): Promise<AboutContent> {
    if (!data.vision_statement || data.vision_statement.trim().length === 0) {
      throw new ValidationError("Vision statement is required.");
    }
    if (!data.mission_statement || data.mission_statement.trim().length === 0) {
      throw new ValidationError("Mission statement is required.");
    }

    const updated = await this.repo.updateAboutContent(
      {
        vision_statement: data.vision_statement.trim(),
        mission_statement: data.mission_statement.trim(),
      },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_VISION_MISSION_UPDATE",
      entity_type: "about_content",
      entity_id: "default",
      summary: "Updated About vision and mission statements",
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Adds a new chapter.
   */
  async addChapter(
    chapter: Omit<AboutChapter, "id">,
    admin: AdminSession
  ): Promise<AboutContent> {
    if (!chapter.title || chapter.title.trim().length === 0) {
      throw new ValidationError("Chapter title is required.");
    }
    if (!chapter.content || chapter.content.trim().length === 0) {
      throw new ValidationError("Chapter content is required.");
    }

    const current = await this.repo.getAboutContent({ allowDraft: true });
    const chapters = (Array.isArray(current.chapters)
      ? current.chapters
      : []) as unknown as AboutChapter[];

    const newChapter: AboutChapter = {
      ...chapter,
      id: `chap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      display_order: chapter.display_order ?? chapters.length + 1,
    };

    const updatedChapters = [...chapters, newChapter].sort(
      (a, b) => a.display_order - b.display_order
    );

    const updated = await this.repo.updateAboutContent(
      { chapters: updatedChapters as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_CHAPTER_CREATE",
      entity_type: "about_content",
      entity_id: newChapter.id,
      summary: `Created About chapter "${newChapter.title}" (${newChapter.chapter_number})`,
      metadata: { chapterId: newChapter.id, status: newChapter.status },
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Updates an existing chapter.
   */
  async updateChapter(
    id: string,
    updates: Partial<AboutChapter>,
    admin: AdminSession
  ): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const chapters = (Array.isArray(current.chapters)
      ? current.chapters
      : []) as unknown as AboutChapter[];

    const index = chapters.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundError(`Chapter with id ${id} not found.`);
    }

    const updatedChapter: AboutChapter = {
      ...chapters[index]!,
      ...updates,
    };

    if (!updatedChapter.title || updatedChapter.title.trim().length === 0) {
      throw new ValidationError("Chapter title is required.");
    }
    if (!updatedChapter.content || updatedChapter.content.trim().length === 0) {
      throw new ValidationError("Chapter content is required.");
    }

    const newChapters = [...chapters];
    newChapters[index] = updatedChapter;
    newChapters.sort((a, b) => a.display_order - b.display_order);

    const updated = await this.repo.updateAboutContent(
      { chapters: newChapters as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_CHAPTER_UPDATE",
      entity_type: "about_content",
      entity_id: id,
      summary: `Updated About chapter "${updatedChapter.title}"`,
      metadata: { chapterId: id, status: updatedChapter.status },
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Deletes a chapter.
   */
  async deleteChapter(id: string, admin: AdminSession): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const chapters = (Array.isArray(current.chapters)
      ? current.chapters
      : []) as unknown as AboutChapter[];

    const existing = chapters.find((c) => c.id === id);
    if (!existing) {
      throw new NotFoundError(`Chapter with id ${id} not found.`);
    }

    const filtered = chapters.filter((c) => c.id !== id);

    const updated = await this.repo.updateAboutContent(
      { chapters: filtered as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_CHAPTER_DELETE",
      entity_type: "about_content",
      entity_id: id,
      summary: `Deleted About chapter "${existing.title}"`,
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Reorders chapters by array of IDs.
   */
  async reorderChapters(orderedIds: string[], admin: AdminSession): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const chapters = (Array.isArray(current.chapters)
      ? current.chapters
      : []) as unknown as AboutChapter[];

    const chapterMap = new Map(chapters.map((c) => [c.id, c]));
    const reordered: AboutChapter[] = [];

    orderedIds.forEach((id, idx) => {
      const chapter = chapterMap.get(id);
      if (chapter) {
        reordered.push({
          ...chapter,
          display_order: idx + 1,
        });
        chapterMap.delete(id);
      }
    });

    // Append any unmentioned chapters at the end
    chapterMap.forEach((chapter) => {
      reordered.push({
        ...chapter,
        display_order: reordered.length + 1,
      });
    });

    const updated = await this.repo.updateAboutContent(
      { chapters: reordered as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_CHAPTERS_REORDER",
      entity_type: "about_content",
      entity_id: "batch",
      summary: `Reordered ${orderedIds.length} About chapters`,
      metadata: { orderedIds },
    });

    revalidationService.revalidate("about");
    return updated;
  }

  // ==========================================
  // TIMELINE GOVERNANCE (ABOUT-001, PRD §8)
  // ==========================================

  /**
   * Admin: Adds a verified timeline entry.
   * Hard Rule: Timeline entries require verified source and owner before creation.
   */
  async addTimelineEntry(
    entry: Omit<TimelineEntry, "id">,
    admin: AdminSession
  ): Promise<AboutContent> {
    if (!entry.year || entry.year.trim().length === 0) {
      throw new ValidationError("Timeline year/date is required.");
    }
    if (!entry.title || entry.title.trim().length === 0) {
      throw new ValidationError("Timeline title is required.");
    }
    if (!entry.description || entry.description.trim().length === 0) {
      throw new ValidationError("Timeline description is required.");
    }

    // Timeline governance verification
    if (!entry.verified_source || entry.verified_source.trim().length === 0) {
      throw new ValidationError(
        "Timeline entries must cite a verified source document or operational record before saving."
      );
    }
    if (!entry.verified_owner || entry.verified_owner.trim().length === 0) {
      throw new ValidationError(
        "Timeline entries must have an assigned internal verified owner."
      );
    }

    const current = await this.repo.getAboutContent({ allowDraft: true });
    const timeline = (Array.isArray(current.timeline_entries)
      ? current.timeline_entries
      : []) as unknown as TimelineEntry[];

    const newEntry: TimelineEntry = {
      ...entry,
      id: `time-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      display_order: entry.display_order ?? timeline.length + 1,
    };

    const updatedTimeline = [...timeline, newEntry].sort(
      (a, b) => a.display_order - b.display_order
    );

    const updated = await this.repo.updateAboutContent(
      { timeline_entries: updatedTimeline as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_TIMELINE_CREATE",
      entity_type: "about_content",
      entity_id: newEntry.id,
      summary: `Created verified timeline milestone "${newEntry.title}" (${newEntry.year})`,
      metadata: {
        entry_id: newEntry.id,
        year: newEntry.year,
        source: newEntry.verified_source,
        owner: newEntry.verified_owner,
      },
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Updates an existing timeline entry.
   */
  async updateTimelineEntry(
    id: string,
    updates: Partial<TimelineEntry>,
    admin: AdminSession
  ): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const timeline = (Array.isArray(current.timeline_entries)
      ? current.timeline_entries
      : []) as unknown as TimelineEntry[];

    const index = timeline.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundError(`Timeline entry with id ${id} not found.`);
    }

    const updatedEntry: TimelineEntry = {
      ...timeline[index]!,
      ...updates,
    };

    if (!updatedEntry.year || updatedEntry.year.trim().length === 0) {
      throw new ValidationError("Timeline year/date is required.");
    }
    if (!updatedEntry.title || updatedEntry.title.trim().length === 0) {
      throw new ValidationError("Timeline title is required.");
    }
    if (!updatedEntry.description || updatedEntry.description.trim().length === 0) {
      throw new ValidationError("Timeline description is required.");
    }
    if (!updatedEntry.verified_source || updatedEntry.verified_source.trim().length === 0) {
      throw new ValidationError(
        "Timeline entries must cite a verified source document or operational record."
      );
    }
    if (!updatedEntry.verified_owner || updatedEntry.verified_owner.trim().length === 0) {
      throw new ValidationError(
        "Timeline entries must have an assigned internal verified owner."
      );
    }

    const newTimeline = [...timeline];
    newTimeline[index] = updatedEntry;
    newTimeline.sort((a, b) => a.display_order - b.display_order);

    const updated = await this.repo.updateAboutContent(
      { timeline_entries: newTimeline as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_TIMELINE_UPDATE",
      entity_type: "about_content",
      entity_id: id,
      summary: `Updated verified timeline milestone "${updatedEntry.title}"`,
      metadata: {
        entry_id: id,
        source: updatedEntry.verified_source,
        owner: updatedEntry.verified_owner,
      },
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Deletes a timeline entry.
   */
  async deleteTimelineEntry(id: string, admin: AdminSession): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const timeline = (Array.isArray(current.timeline_entries)
      ? current.timeline_entries
      : []) as unknown as TimelineEntry[];

    const existing = timeline.find((t) => t.id === id);
    if (!existing) {
      throw new NotFoundError(`Timeline entry with id ${id} not found.`);
    }

    const filtered = timeline.filter((t) => t.id !== id);

    const updated = await this.repo.updateAboutContent(
      { timeline_entries: filtered as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_TIMELINE_DELETE",
      entity_type: "about_content",
      entity_id: id,
      summary: `Deleted timeline milestone "${existing.title}"`,
    });

    revalidationService.revalidate("about");
    return updated;
  }

  /**
   * Admin: Reorders timeline entries.
   */
  async reorderTimelineEntries(orderedIds: string[], admin: AdminSession): Promise<AboutContent> {
    const current = await this.repo.getAboutContent({ allowDraft: true });
    const timeline = (Array.isArray(current.timeline_entries)
      ? current.timeline_entries
      : []) as unknown as TimelineEntry[];

    const entryMap = new Map(timeline.map((t) => [t.id, t]));
    const reordered: TimelineEntry[] = [];

    orderedIds.forEach((id, idx) => {
      const entry = entryMap.get(id);
      if (entry) {
        reordered.push({
          ...entry,
          display_order: idx + 1,
        });
        entryMap.delete(id);
      }
    });

    entryMap.forEach((entry) => {
      reordered.push({
        ...entry,
        display_order: reordered.length + 1,
      });
    });

    const updated = await this.repo.updateAboutContent(
      { timeline_entries: reordered as any },
      admin.id
    );

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "ABOUT_TIMELINE_REORDER",
      entity_type: "about_content",
      entity_id: "batch",
      summary: `Reordered ${orderedIds.length} timeline milestones`,
      metadata: { orderedIds },
    });

    revalidationService.revalidate("about");
    return updated;
  }
}

export const aboutService = new AboutService();

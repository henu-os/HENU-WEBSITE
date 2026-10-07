import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@/server/repositories/audit-log.repository", () => ({
  auditLogRepository: {
    record: vi.fn().mockResolvedValue({ id: "mock-audit-id" }),
  },
}));
vi.mock("@/server/db/client", () => ({
  getServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: null, error: { message: "Offline DB" } })),
          })),
        })),
      })),
    })),
  })),
}));

import { aboutService } from "@/server/services/about.service";
import type { AdminSession } from "@/server/auth/session";
import type { AboutChapter, TimelineEntry } from "@/types/domain";

const mockAdmin: AdminSession = {
  id: "test-admin-id",
  userId: "test-admin-id",
  email: "admin@henu.dev",
  profile: {
    id: "test-admin-id",
    email: "admin@henu.dev",
    display_name: "Admin User",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  isMfaVerified: true,
};

function asChapters(raw: any): AboutChapter[] {
  return (Array.isArray(raw) ? raw : []) as AboutChapter[];
}

function asTimeline(raw: any): TimelineEntry[] {
  return (Array.isArray(raw) ? raw : []) as TimelineEntry[];
}

describe("About Storytelling & Timeline Governance (ABOUT-001, ABOUT-002, PRD §7)", () => {
  describe("Chapter Storytelling Architecture", () => {
    it("returns only published chapters on the public path", async () => {
      // Create a draft chapter
      const afterCreate = await aboutService.addChapter(
        {
          chapter_number: "04",
          title: "Experimental Ecosystem Research",
          subtitle: "Internal Exploration Only",
          content: "Explorations in sovereign computing architectures.",
          status: "draft",
          display_order: 99,
        },
        mockAdmin
      );

      const createdChapters = asChapters(afterCreate.chapters);
      const draftChapter = createdChapters.find(
        (c) => c.title === "Experimental Ecosystem Research"
      );
      expect(draftChapter).toBeDefined();
      expect(draftChapter?.status).toBe("draft");

      // Verify public content DOES NOT contain draft chapter
      const publicContent = await aboutService.getPublicAboutContent();
      const publicChapters = asChapters(publicContent.chapters);
      const inPublic = publicChapters.some((c) => c.id === draftChapter?.id);
      expect(inPublic).toBe(false);

      // Verify admin content DOES contain draft chapter
      const adminContent = await aboutService.getAdminAboutContent();
      const adminChapters = asChapters(adminContent.chapters);
      const inAdmin = adminChapters.some((c) => c.id === draftChapter?.id);
      expect(inAdmin).toBe(true);

      // Cleanup
      if (draftChapter) {
        await aboutService.deleteChapter(draftChapter.id, mockAdmin);
      }
    });

    it("publishes chapters through the admin module with audit trail", async () => {
      const created = await aboutService.addChapter(
        {
          chapter_number: "05",
          title: "Autonomous Toolchains",
          subtitle: "Sovereign Engineering Methodologies",
          content: "HENU builds systems where each layer is deterministically verified.",
          status: "draft",
          display_order: 90,
        },
        mockAdmin
      );

      const createdChapters = asChapters(created.chapters);
      const target = createdChapters.find((c) => c.title === "Autonomous Toolchains");
      expect(target).toBeDefined();

      const afterUpdate = await aboutService.updateChapter(
        target!.id,
        { status: "published" },
        mockAdmin
      );

      const updatedChapters = asChapters(afterUpdate.chapters);
      const updatedChapter = updatedChapters.find((c) => c.id === target!.id);
      expect(updatedChapter?.status).toBe("published");

      // Now verify public content includes the published chapter
      const publicContent = await aboutService.getPublicAboutContent();
      const publicChapters = asChapters(publicContent.chapters);
      const inPublic = publicChapters.some((c) => c.id === target!.id);
      expect(inPublic).toBe(true);

      // Cleanup
      await aboutService.deleteChapter(target!.id, mockAdmin);
    });

    it("reorders chapters deterministically", async () => {
      const current = await aboutService.getAdminAboutContent();
      const chapters = asChapters(current.chapters);
      if (chapters.length >= 2 && chapters[0] && chapters[1]) {
        const first = chapters[0];
        const second = chapters[1];
        const reversedIds = [second.id, first.id, ...chapters.slice(2).map((c) => c.id)];

        const reordered = await aboutService.reorderChapters(reversedIds, mockAdmin);
        const reorderedChapters = asChapters(reordered.chapters);
        expect(reorderedChapters[0]?.id).toBe(second.id);
        expect(reorderedChapters[1]?.id).toBe(first.id);

        // Restore original order
        await aboutService.reorderChapters(chapters.map((c) => c.id), mockAdmin);
      }
    });
  });

  describe("Timeline Governance & Verification Gates", () => {
    it("ensures public timeline renders only published, verified milestones", async () => {
      const publicContent = await aboutService.getPublicAboutContent();
      const timeline = asTimeline(publicContent.timeline_entries);
      expect(timeline.length).toBeGreaterThan(0);

      // Every timeline entry on public page must have status === 'published'
      for (const entry of timeline) {
        expect(entry.status).toBe("published");
        expect(entry.verified_source).toBeDefined();
        expect(entry.verified_source.length).toBeGreaterThan(0);
        expect(entry.verified_owner).toBeDefined();
        expect(entry.verified_owner.length).toBeGreaterThan(0);
      }
    });

    it("prevents unverified milestones without verified source from being created", async () => {
      await expect(
        aboutService.addTimelineEntry(
          {
            year: "2026",
            title: "Hypothetical Hypergrowth Milestone",
            description: "Unverified speculative claim without documentation.",
            status: "published",
            verified_source: "", // Missing verified source
            verified_owner: "Lead Architect",
            display_order: 10,
          },
          mockAdmin
        )
      ).rejects.toThrow(/verified source/i);
    });

    it("prevents unverified milestones without verified owner from being created", async () => {
      await expect(
        aboutService.addTimelineEntry(
          {
            year: "2026",
            title: "Anonymous Milestone Claim",
            description: "Unverified claim without accountability.",
            status: "published",
            verified_source: "Executive Charter Doc 2026",
            verified_owner: "", // Missing verified owner
            display_order: 10,
          },
          mockAdmin
        )
      ).rejects.toThrow(/verified owner/i);
    });

    it("allows draft timeline entry when fully documented, but keeps it private until published", async () => {
      const created = await aboutService.addTimelineEntry(
        {
          year: "2027",
          title: "Next Generation Sovereign Kernel Release",
          description: "Formal specification of ecosystem kernel architecture.",
          status: "draft",
          verified_source: "Ecosystem Specification v3.0, Section 4",
          verified_owner: "Systems Architecture Council",
          display_order: 99,
        },
        mockAdmin
      );

      const createdEntries = asTimeline(created.timeline_entries);
      const target = createdEntries.find(
        (t) => t.title === "Next Generation Sovereign Kernel Release"
      );
      expect(target).toBeDefined();
      expect(target?.status).toBe("draft");

      // Verify draft is NOT in public view
      const publicContent = await aboutService.getPublicAboutContent();
      const publicTimeline = asTimeline(publicContent.timeline_entries);
      expect(publicTimeline.some((t) => t.id === target!.id)).toBe(false);

      // Verify admin view DOES see the draft
      const adminContent = await aboutService.getAdminAboutContent();
      const adminTimeline = asTimeline(adminContent.timeline_entries);
      expect(adminTimeline.some((t) => t.id === target!.id)).toBe(true);

      // Cleanup
      await aboutService.deleteTimelineEntry(target!.id, mockAdmin);
    });
  });
});

"use server";

import { z } from "zod";
import { requireAdminSession } from "../auth/session";
import { aboutService } from "../services/about.service";
import { AppError } from "@/lib/errors";

const ChapterSchema = z.object({
  chapter_number: z.string().trim().min(1, "Chapter number is required"),
  title: z.string().trim().min(2, "Title is required"),
  subtitle: z.string().trim().optional(),
  content: z.string().trim().min(10, "Content must have at least 10 characters"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["published", "draft"]),
  display_order: z.number().int().optional(),
  media_id: z.string().nullable().optional(),
  media_url: z.string().nullable().optional(),
  media_alt: z.string().nullable().optional(),
});

const TimelineEntrySchema = z.object({
  year: z.string().trim().min(2, "Year/Period is required"),
  date_formatted: z.string().trim().optional(),
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().min(10, "Description is required"),
  verified_source: z.string().trim().min(2, "Verified source document is required"),
  verified_owner: z.string().trim().min(2, "Verified owner is required"),
  status: z.enum(["published", "draft"]),
  display_order: z.number().int().optional(),
});

export async function updateVisionMissionAction(data: {
  vision_statement: string;
  mission_statement: string;
}) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.updateVisionMission(data, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to update vision and mission." };
  }
}

export async function addChapterAction(raw: z.infer<typeof ChapterSchema>) {
  const admin = await requireAdminSession();
  const parsed = ChapterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid chapter data" };
  }

  try {
    const updated = await aboutService.addChapter(parsed.data as any, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to add chapter." };
  }
}

export async function updateChapterAction(id: string, raw: Partial<z.infer<typeof ChapterSchema>>) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.updateChapter(id, raw as any, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to update chapter." };
  }
}

export async function deleteChapterAction(id: string) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.deleteChapter(id, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to delete chapter." };
  }
}

export async function reorderChaptersAction(orderedIds: string[]) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.reorderChapters(orderedIds, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to reorder chapters." };
  }
}

export async function addTimelineEntryAction(raw: z.infer<typeof TimelineEntrySchema>) {
  const admin = await requireAdminSession();
  const parsed = TimelineEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid timeline entry data" };
  }

  try {
    const updated = await aboutService.addTimelineEntry(parsed.data as any, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to add timeline entry." };
  }
}

export async function updateTimelineEntryAction(
  id: string,
  raw: Partial<z.infer<typeof TimelineEntrySchema>>
) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.updateTimelineEntry(id, raw as any, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to update timeline entry." };
  }
}

export async function deleteTimelineEntryAction(id: string) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.deleteTimelineEntry(id, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to delete timeline entry." };
  }
}

export async function reorderTimelineEntriesAction(orderedIds: string[]) {
  const admin = await requireAdminSession();
  try {
    const updated = await aboutService.reorderTimelineEntries(orderedIds, admin);
    return { success: true, data: updated };
  } catch (err: any) {
    if (err instanceof AppError) return { success: false, error: err.message };
    return { success: false, error: "Failed to reorder timeline entries." };
  }
}

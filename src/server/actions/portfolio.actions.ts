"use server";

import { requireAdminSession } from "@/server/auth/session";
import { portfolioService } from "@/server/services/portfolio.service";
import type {
  CreatePortfolioProjectInput,
  UpdatePortfolioProjectInput,
} from "@/server/repositories/portfolio.repository";
import { z } from "zod";

const metricItemSchema = z.object({
  value: z.string().trim().min(1, "Metric value is required."),
  label: z.string().trim().min(1, "Metric label is required."),
  source: z.string().trim().min(1, "Metric source is required for verification."),
  owner: z.string().trim().min(1, "Metric owner is required for verification."),
});

const projectSchema = z.object({
  title: z.string().trim().min(2, "Project title must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Project slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with single hyphens."),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters."),
  category_slug: z.string().trim().nullable().optional(),
  technologies: z.array(z.string().trim()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  project_status: z.enum(["live", "in_development", "internal"]).default("live"),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  period_year: z.string().trim().nullable().optional(),
  external_url: z.string().trim().url("Invalid external URL format.").nullable().optional().or(z.literal("")),
  client_permission_status: z.enum(["granted", "internal_review", "pending", "denied"]).default("internal_review"),
  story_blocks: z.record(z.unknown()).nullable().optional(),
  metrics: z.array(metricItemSchema).default([]),
  related_service_ids: z.array(z.string().trim()).default([]),
  related_product_ids: z.array(z.string().trim()).default([]),
  cover_media_id: z.string().uuid("Invalid media ID").nullable().optional(),
  seo_title: z.string().trim().nullable().optional(),
  seo_description: z.string().trim().nullable().optional(),
});

export async function createProjectAction(data: CreatePortfolioProjectInput) {
  const admin = await requireAdminSession();
  const validated = projectSchema.parse(data);

  const cleanData: CreatePortfolioProjectInput = {
    ...validated,
    external_url: validated.external_url === "" ? null : validated.external_url,
    story_blocks: (validated.story_blocks || null) as any,
    metrics: (validated.metrics || null) as any,
    technologies: (validated.technologies || null) as any,
    related_service_ids: (validated.related_service_ids || null) as any,
    related_product_ids: (validated.related_product_ids || null) as any,
  };

  const project = await portfolioService.createProject(cleanData, admin);
  return { success: true, project };
}

export async function updateProjectAction(id: string, data: UpdatePortfolioProjectInput) {
  const admin = await requireAdminSession();
  const project = await portfolioService.updateProject(id, data, admin);
  return { success: true, project };
}

export async function archiveProjectAction(id: string) {
  const admin = await requireAdminSession();
  const project = await portfolioService.archiveProject(id, admin);
  return { success: true, project };
}

export async function deleteProjectAction(id: string) {
  const admin = await requireAdminSession();
  await portfolioService.softDeleteProject(id, admin);
  return { success: true };
}

export async function reorderProjectsAction(orderedIds: string[]) {
  const admin = await requireAdminSession();
  await portfolioService.reorderProjects(orderedIds, admin);
  return { success: true };
}

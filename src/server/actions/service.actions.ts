"use server";

import { requireAdminSession } from "@/server/auth/session";
import { serviceService } from "@/server/services/service.service";
import type {
  CreateServiceInput,
  UpdateServiceInput,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from "@/server/repositories/service.repository";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Category slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with single hyphens."),
  description: z.string().trim().nullable().optional(),
  display_order: z.number().int().default(0),
});

const serviceSchema = z.object({
  category_id: z.string().uuid("Invalid category ID."),
  name: z.string().trim().min(1, "Service name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Service slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with single hyphens."),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters."),
  status: z.enum(["draft", "published", "archived"]),
  requires_disclaimer: z.boolean().default(false),
  disclaimer_block: z.string().trim().nullable().optional(),
  display_order: z.number().int().default(0),
  seo_title: z.string().trim().nullable().optional(),
  seo_description: z.string().trim().nullable().optional(),
});

// ==========================================
// CATEGORY ACTIONS
// ==========================================

export async function createCategoryAction(data: CreateServiceCategoryInput) {
  const admin = await requireAdminSession();
  const validated = categorySchema.parse(data);
  const category = await serviceService.createCategory(validated, admin);
  return { success: true, category };
}

export async function updateCategoryAction(id: string, data: UpdateServiceCategoryInput) {
  const admin = await requireAdminSession();
  const category = await serviceService.updateCategory(id, data, admin);
  return { success: true, category };
}

export async function deleteCategoryAction(id: string) {
  const admin = await requireAdminSession();
  await serviceService.deleteCategory(id, admin);
  return { success: true };
}

export async function reorderCategoriesAction(orderedIds: string[]) {
  const admin = await requireAdminSession();
  await serviceService.reorderCategories(orderedIds, admin);
  return { success: true };
}

// ==========================================
// SERVICE ACTIONS
// ==========================================

export async function createServiceAction(data: CreateServiceInput) {
  const admin = await requireAdminSession();
  const validated = serviceSchema.parse(data);

  const service = await serviceService.createService(
    {
      ...validated,
      problem_block: data.problem_block ?? null,
      capability_block: data.capability_block ?? null,
      approach_block: data.approach_block ?? null,
      solution_block: data.solution_block ?? null,
      outcome_block: data.outcome_block ?? null,
      faq_items: data.faq_items ?? [],
    },
    admin
  );

  return { success: true, service };
}

export async function updateServiceAction(id: string, data: UpdateServiceInput) {
  const admin = await requireAdminSession();
  const service = await serviceService.updateService(id, data, admin);
  return { success: true, service };
}

export async function publishServiceAction(id: string) {
  const admin = await requireAdminSession();
  const service = await serviceService.updateService(id, { status: "published" }, admin);
  return { success: true, service };
}

export async function archiveServiceAction(id: string) {
  const admin = await requireAdminSession();
  const service = await serviceService.archiveService(id, admin);
  return { success: true, service };
}

export async function deleteServiceAction(id: string) {
  const admin = await requireAdminSession();
  await serviceService.deleteService(id, admin);
  return { success: true };
}

export async function reorderServicesAction(orderedIds: string[]) {
  const admin = await requireAdminSession();
  await serviceService.reorderServices(orderedIds, admin);
  return { success: true };
}

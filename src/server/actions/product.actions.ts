"use server";

import { requireAdminSession } from "@/server/auth/session";
import { productService } from "@/server/services/product.service";
import type { CreateProductInput, UpdateProductInput } from "@/server/repositories/product.repository";
import { z } from "zod";

const productInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with single hyphens."),
  name: z.string().trim().min(1, "Product name is required."),
  tagline: z.string().trim().min(1, "Tagline is required."),
  status: z.enum(["draft", "published", "archived"]),
  status_label: z.enum(["available", "beta", "in_development", "coming_soon"]),
  hue_key: z.enum(["os", "ai", "pa", "ide"]),
  template_variant: z.string().trim().min(1),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters."),
  primary_cta_type: z.enum(["explore", "download", "waitlist", "demo", "enquire"]),
  primary_cta_target: z
    .string()
    .trim()
    .refine(
      (target) => target.startsWith("/") || target.startsWith("https://"),
      "CTA target must be an internal path or https:// URL."
    ),
  display_order: z.number().int().default(1),
  seo_title: z.string().trim().nullable().optional(),
  seo_description: z.string().trim().nullable().optional(),
});

export async function createProductAction(data: CreateProductInput) {
  const admin = await requireAdminSession();
  const validated = productInputSchema.parse(data);

  const product = await productService.createProduct(
    {
      ...validated,
      description_blocks: data.description_blocks ?? null,
      capabilities: data.capabilities ?? null,
      signature_module_content: data.signature_module_content ?? null,
      cover_media_id: data.cover_media_id ?? null,
    },
    admin
  );

  return { success: true, product };
}

export async function updateProductAction(id: string, data: UpdateProductInput) {
  const admin = await requireAdminSession();

  const product = await productService.updateProduct(id, data, admin);
  return { success: true, product };
}

export async function archiveProductAction(id: string) {
  const admin = await requireAdminSession();
  const product = await productService.archiveProduct(id, admin);
  return { success: true, product };
}

export async function deleteProductAction(id: string) {
  const admin = await requireAdminSession();
  await productService.deleteProduct(id, admin);
  return { success: true };
}

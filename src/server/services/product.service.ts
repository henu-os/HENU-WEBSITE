import "server-only";
import { productRepository, type CreateProductInput, type UpdateProductInput } from "../repositories/product.repository";
import { slugRedirectRepository } from "../repositories/slug-redirect.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { publishGateService } from "./publish-gate.service";
import { revalidationService } from "./revalidation.service";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type { Product } from "@/types/domain";
import type { AdminSession } from "../auth/session";

/**
 * Validates product CTA configuration against release status (PROD-006, Document 05 lines 719-721).
 * Critical constraint: A 'download' CTA cannot be published unless a confirmed public release exists.
 */
export function validateProductCTA(ctaType: string, isPublicReleaseAvailable = false): void {
  if (ctaType === "download" && !isPublicReleaseAvailable) {
    throw new ValidationError(
      "Cannot publish a 'download' CTA without an active, verified public release. Use 'explore' or 'waitlist' instead."
    );
  }
}

/**
 * Validates that only the flagship HENU OS product can use the reserved slug 'henu-os' (PROD-006).
 */
export function validateReservedProductSlug(slug: string, existingProductId?: string): void {
  const normalized = slug.trim().toLowerCase();
  const HENU_OS_CANONICAL_ID = "p1111111-1111-1111-1111-111111111111";

  if (normalized === "henu-os") {
    if (!existingProductId || existingProductId !== HENU_OS_CANONICAL_ID) {
      throw new ValidationError(
        "The slug 'henu-os' is strictly reserved for the flagship HENU OS product."
      );
    }
  }
}

export class ProductService {
  /**
   * Public retrieval of all published products (PROD-001).
   */
  async getPublishedProducts(): Promise<Product[]> {
    return await productRepository.listPublishedProducts();
  }

  /**
   * Retrieves a single product by slug, strictly enforcing publication state unless in draft preview.
   */
  async getProductBySlug(
    slug: string,
    options: { allowDraft?: boolean } = {}
  ): Promise<Product | null> {
    return await productRepository.getProductBySlug(slug, options);
  }

  /**
   * Admin: List all products.
   */
  async listAllProducts(options: { limit?: number; offset?: number } = {}) {
    return await productRepository.listAllProducts(options);
  }

  /**
   * Admin: Get product by ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    return await productRepository.getProductById(id);
  }

  /**
   * Admin: Create a new product.
   */
  async createProduct(
    input: CreateProductInput,
    admin: AdminSession
  ): Promise<Product> {
    // 1. Reserved slug validation
    validateReservedProductSlug(input.slug);

    // 2. CTA validation
    validateProductCTA(input.primary_cta_type || "explore", false);

    // 3. Publish gate if status is published
    if (input.status === "published") {
      publishGateService.assertCanPublish({
        title: input.name,
        slug: input.slug,
        domain: "products",
      });
    }

    // 4. Persist
    const product = await productRepository.createProduct(input, admin.id);

    // 5. Audit Log
    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PRODUCT_CREATE",
      entity_type: "product",
      entity_id: product.id,
      summary: `Created product "${product.name}" (${product.status})`,
      metadata: {
        slug: product.slug,
        status: product.status,
      },
    });

    // 6. Revalidate
    revalidationService.revalidate("products");

    return product;
  }

  /**
   * Admin: Update an existing product.
   */
  async updateProduct(
    id: string,
    input: UpdateProductInput,
    admin: AdminSession
  ): Promise<Product> {
    const existing = await productRepository.getProductById(id);
    if (!existing) {
      throw new NotFoundError(`Product with id ${id} not found.`);
    }

    // 1. Reserved slug validation
    if (input.slug) {
      validateReservedProductSlug(input.slug, id);

      // Record redirect if published slug changed (CORE-009)
      if (
        existing.status === "published" &&
        existing.slug !== input.slug.trim().toLowerCase()
      ) {
        await slugRedirectRepository.recordRedirect({
          entity_type: "product",
          old_slug: existing.slug,
          new_slug: input.slug.trim().toLowerCase(),
        });
      }
    }

    // 2. CTA validation
    if (input.primary_cta_type) {
      validateProductCTA(input.primary_cta_type, false);
    }

    // 3. Publish gate if publishing
    const targetStatus = input.status || existing.status;
    if (targetStatus === "published") {
      publishGateService.assertCanPublish({
        title: input.name || existing.name,
        slug: input.slug || existing.slug,
        domain: "products",
      });
    }

    // 4. Persist
    const updated = await productRepository.updateProduct(id, input, admin.id);

    // 5. Audit Log
    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PRODUCT_UPDATE",
      entity_type: "product",
      entity_id: updated.id,
      summary: `Updated product "${updated.name}" (${updated.status})`,
      metadata: {
        slug: updated.slug,
        status: updated.status,
      },
    });

    // 6. Revalidate
    revalidationService.revalidate("products");

    return updated;
  }

  /**
   * Admin: Archive a product.
   */
  async archiveProduct(id: string, admin: AdminSession): Promise<Product> {
    return await this.updateProduct(id, { status: "archived" }, admin);
  }

  /**
   * Admin: Delete a product (soft delete).
   */
  async deleteProduct(id: string, admin: AdminSession): Promise<void> {
    const existing = await productRepository.getProductById(id);
    if (!existing) {
      throw new NotFoundError(`Product with id ${id} not found.`);
    }

    await productRepository.deleteProduct(id, admin.id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PRODUCT_DELETE",
      entity_type: "product",
      entity_id: id,
      summary: `Deleted product "${existing.name}"`,
      metadata: {
        slug: existing.slug,
      },
    });

    revalidationService.revalidate("products");
  }
}

export const productService = new ProductService();

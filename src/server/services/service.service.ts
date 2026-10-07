import "server-only";
import {
  serviceRepository,
  type CreateServiceInput,
  type UpdateServiceInput,
  type CreateServiceCategoryInput,
  type UpdateServiceCategoryInput,
} from "../repositories/service.repository";
import { slugRedirectRepository } from "../repositories/slug-redirect.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { publishGateService } from "./publish-gate.service";
import { revalidationService } from "./revalidation.service";
import { validateServicePricing } from "@/lib/validation/service-price-gate";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type { Service, ServiceCategory } from "@/types/domain";
import type { AdminSession } from "../auth/session";

export class ServiceService {
  // ==========================================
  // CATEGORIES
  // ==========================================

  async getCategories(): Promise<ServiceCategory[]> {
    return serviceRepository.listCategories();
  }

  async getCategoryById(id: string): Promise<ServiceCategory | null> {
    return serviceRepository.getCategoryById(id);
  }

  async createCategory(
    input: CreateServiceCategoryInput,
    admin: AdminSession
  ): Promise<ServiceCategory> {
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError("Category name is required.");
    }
    if (!input.slug || input.slug.trim().length === 0) {
      throw new ValidationError("Category slug is required.");
    }

    const category = await serviceRepository.createCategory(input);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_CATEGORY_CREATE",
      entity_type: "service_category",
      entity_id: category.id,
      summary: `Created service category "${category.name}" (${category.slug})`,
      metadata: { slug: category.slug },
    });

    revalidationService.revalidate("services");
    return category;
  }

  async updateCategory(
    id: string,
    input: UpdateServiceCategoryInput,
    admin: AdminSession
  ): Promise<ServiceCategory> {
    const existing = await serviceRepository.getCategoryById(id);
    if (!existing) {
      throw new NotFoundError(`Category with id ${id} not found.`);
    }

    const category = await serviceRepository.updateCategory(id, input);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_CATEGORY_UPDATE",
      entity_type: "service_category",
      entity_id: category.id,
      summary: `Updated service category "${category.name}" (${category.slug})`,
      metadata: { slug: category.slug },
    });

    revalidationService.revalidate("services");
    return category;
  }

  async deleteCategory(id: string, admin: AdminSession): Promise<void> {
    const existing = await serviceRepository.getCategoryById(id);
    if (!existing) {
      throw new NotFoundError(`Category with id ${id} not found.`);
    }

    await serviceRepository.deleteCategory(id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_CATEGORY_DELETE",
      entity_type: "service_category",
      entity_id: id,
      summary: `Deleted service category "${existing.name}" (${existing.slug})`,
      metadata: { slug: existing.slug },
    });

    revalidationService.revalidate("services");
  }

  async reorderCategories(orderedIds: string[], admin: AdminSession): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (id) {
        await serviceRepository.updateCategory(id, { display_order: i + 1 });
      }
    }

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_CATEGORY_REORDER",
      entity_type: "service_category",
      entity_id: "batch",
      summary: `Reordered ${orderedIds.length} service categories`,
      metadata: { orderedIds },
    });

    revalidationService.revalidate("services");
  }

  // ==========================================
  // SERVICES
  // ==========================================

  /**
   * Public: List all published services (SERV-001).
   */
  async getPublishedServices(): Promise<Service[]> {
    return serviceRepository.listPublishedServices();
  }

  /**
   * Public: List published services grouped by category for the editorial index (SERV-001).
   */
  async getPublishedServicesGrouped(): Promise<
    Array<{ category: ServiceCategory; services: Service[] }>
  > {
    return serviceRepository.listPublishedServicesWithCategories();
  }

  /**
   * Public/Admin: Retrieves a single service by slug.
   */
  async getServiceBySlug(
    slug: string,
    options: { allowDraft?: boolean } = {}
  ): Promise<Service | null> {
    return serviceRepository.getServiceBySlug(slug, options);
  }

  /**
   * Admin: List all services.
   */
  async listAllServices(options: { categoryId?: string; limit?: number; offset?: number } = {}) {
    return serviceRepository.listAllServices(options);
  }

  /**
   * Admin: Get service by ID.
   */
  async getServiceById(id: string): Promise<Service | null> {
    return serviceRepository.getServiceById(id);
  }

  /**
   * Admin: Create a new service.
   */
  async createService(input: CreateServiceInput, admin: AdminSession): Promise<Service> {
    // 1. Mandatory Identity validation
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError("Service name is required.");
    }
    if (!input.slug || input.slug.trim().length === 0) {
      throw new ValidationError("Service slug is required.");
    }
    if (!input.category_id) {
      throw new ValidationError("Service category is required.");
    }

    // 2. Pricing Safety Gate (Document 04 §14.2)
    const priceScan = validateServicePricing(input as Record<string, unknown>);
    if (!priceScan.allowed) {
      throw new ValidationError(
        `Service content violates pricing safety policy: ${priceScan.issues.join("; ")}`
      );
    }

    // 3. Disclaimer Gate (Document 04 §14.4)
    if (input.requires_disclaimer) {
      if (!input.disclaimer_block || input.disclaimer_block.trim().length < 10) {
        throw new ValidationError(
          "Sensitive services flagged with 'requires_disclaimer' must provide complete legal disclaimer text before saving."
        );
      }
    }

    // 4. Publish gate if published
    if (input.status === "published") {
      publishGateService.assertCanPublish({
        title: input.name,
        slug: input.slug,
        domain: "services",
        disclaimerRequired: Boolean(input.requires_disclaimer),
      });
    }

    // 5. Persist
    const service = await serviceRepository.createService(input, admin.id);

    // 6. Audit Log
    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_CREATE",
      entity_type: "service",
      entity_id: service.id,
      summary: `Created service "${service.name}" (${service.status})`,
      metadata: {
        slug: service.slug,
        status: service.status,
        requires_disclaimer: service.requires_disclaimer,
      },
    });

    // 7. Revalidate
    revalidationService.revalidate("services");

    return service;
  }

  /**
   * Admin: Update an existing service.
   */
  async updateService(
    id: string,
    input: UpdateServiceInput,
    admin: AdminSession
  ): Promise<Service> {
    const existing = await serviceRepository.getServiceById(id);
    if (!existing) {
      throw new NotFoundError(`Service with id ${id} not found.`);
    }

    // 1. Pricing Safety Gate
    const priceScan = validateServicePricing(input as Record<string, unknown>);
    if (!priceScan.allowed) {
      throw new ValidationError(
        `Service content violates pricing safety policy: ${priceScan.issues.join("; ")}`
      );
    }

    // 2. Disclaimer Gate
    const requiresDisclaimer =
      input.requires_disclaimer !== undefined
        ? input.requires_disclaimer
        : existing.requires_disclaimer;
    const disclaimerBlock =
      input.disclaimer_block !== undefined ? input.disclaimer_block : existing.disclaimer_block;

    if (requiresDisclaimer) {
      if (!disclaimerBlock || disclaimerBlock.trim().length < 10) {
        throw new ValidationError(
          "Sensitive services flagged with 'requires_disclaimer' must provide complete legal disclaimer text."
        );
      }
    }

    // 3. Slug Redirect Check
    if (input.slug && existing.status === "published" && existing.slug !== input.slug.trim().toLowerCase()) {
      await slugRedirectRepository.recordRedirect({
        entity_type: "service",
        old_slug: existing.slug,
        new_slug: input.slug.trim().toLowerCase(),
      });
    }

    // 4. Publish Gate
    const targetStatus = input.status || existing.status;
    if (targetStatus === "published") {
      publishGateService.assertCanPublish({
        title: input.name || existing.name,
        slug: input.slug || existing.slug,
        domain: "services",
        disclaimerRequired: Boolean(requiresDisclaimer),
      });
    }

    // 5. Persist
    const service = await serviceRepository.updateService(id, input, admin.id);

    // 6. Audit Log
    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_UPDATE",
      entity_type: "service",
      entity_id: service.id,
      summary: `Updated service "${service.name}" (${service.status})`,
      metadata: {
        slug: service.slug,
        status: service.status,
      },
    });

    // 7. Revalidate
    revalidationService.revalidate("services");

    return service;
  }

  /**
   * Admin: Archive a service.
   */
  async archiveService(id: string, admin: AdminSession): Promise<Service> {
    const existing = await serviceRepository.getServiceById(id);
    if (!existing) {
      throw new NotFoundError(`Service with id ${id} not found.`);
    }

    const service = await serviceRepository.archiveService(id, admin.id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_ARCHIVE",
      entity_type: "service",
      entity_id: service.id,
      summary: `Archived service "${service.name}"`,
      metadata: { slug: service.slug },
    });

    revalidationService.revalidate("services");
    return service;
  }

  /**
   * Admin: Soft-delete a service.
   */
  async deleteService(id: string, admin: AdminSession): Promise<void> {
    const existing = await serviceRepository.getServiceById(id);
    if (!existing) {
      throw new NotFoundError(`Service with id ${id} not found.`);
    }

    await serviceRepository.deleteService(id, admin.id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_DELETE",
      entity_type: "service",
      entity_id: id,
      summary: `Deleted service "${existing.name}"`,
      metadata: { slug: existing.slug },
    });

    revalidationService.revalidate("services");
  }

  /**
   * Admin: Reorder services.
   */
  async reorderServices(orderedIds: string[], admin: AdminSession): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (id) {
        await serviceRepository.updateService(id, { display_order: i + 1 }, admin.id);
      }
    }

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "SERVICE_REORDER",
      entity_type: "service",
      entity_id: "batch",
      summary: `Reordered ${orderedIds.length} services`,
      metadata: { orderedIds },
    });

    revalidationService.revalidate("services");
  }
}

export const serviceService = new ServiceService();

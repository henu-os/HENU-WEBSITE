import "server-only";
import {
  portfolioRepository,
  PortfolioRepository,
  type CreatePortfolioProjectInput,
  type UpdatePortfolioProjectInput,
} from "../repositories/portfolio.repository";
import { slugRedirectRepository } from "../repositories/slug-redirect.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { publishGateService } from "./publish-gate.service";
import { revalidationService } from "./revalidation.service";
import { ValidationError, NotFoundError } from "@/lib/errors";
import type {
  PortfolioProject,
  ProjectCategory,
  Technology,
  ProjectMetric,
} from "@/types/domain";
import type { AdminSession } from "../auth/session";

export class PortfolioService {
  private repo: PortfolioRepository;

  constructor(repo?: PortfolioRepository) {
    this.repo = repo ?? portfolioRepository;
  }

  /**
   * Retrieves all published, client-permissioned projects for public catalog.
   */
  async getPublishedProjects(categorySlug?: string): Promise<PortfolioProject[]> {
    return this.repo.listPublishedProjects(categorySlug);
  }

  /**
   * Alias for getPublishedProjects.
   */
  async getPublicProjects(categorySlug?: string): Promise<PortfolioProject[]> {
    return this.getPublishedProjects(categorySlug);
  }

  /**
   * Retrieves a single project by slug.
   * If allowDraft is true and user is authenticated admin, returns draft for preview.
   */
  async getProjectBySlug(
    slug: string,
    options?: { allowDraft?: boolean }
  ): Promise<PortfolioProject | null> {
    return this.repo.getProjectBySlug(slug, options);
  }

  /**
   * Alias for getProjectBySlug.
   */
  async getPublicProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    return this.getProjectBySlug(slug);
  }

  /**
   * Retrieves a project by ID (admin operations).
   */
  async getProjectById(id: string): Promise<PortfolioProject | null> {
    return this.repo.getProjectById(id);
  }

  /**
   * Lists all projects with admin filters and pagination.
   */
  async listAllProjects(options?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ projects: PortfolioProject[]; total: number }> {
    return this.repo.listAllProjects(options);
  }

  /**
   * Creates a new portfolio project.
   */
  async createProject(
    input: CreatePortfolioProjectInput,
    admin: AdminSession
  ): Promise<PortfolioProject> {
    this.validateProjectInput(input);

    const status = input.status || "draft";
    const clientPermissionStatus = input.client_permission_status || "internal_review";

    // If publishing, run publish gate assertions
    if (status === "published") {
      publishGateService.assertCanPublish({
        title: input.title,
        slug: input.slug,
        domain: "portfolio",
        clientPermissionStatus,
        metrics: Array.isArray(input.metrics) ? (input.metrics as unknown as ProjectMetric[]) : undefined,
        storyBlocks: typeof input.story_blocks === "object" ? (input.story_blocks as Record<string, unknown>) : null,
        metaDescription: input.seo_description || undefined,
      });
    }

    const project = await this.repo.createProject({
      ...input,
      status,
      client_permission_status: clientPermissionStatus,
      created_by: admin.id,
      updated_by: admin.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECT_CREATE",
      entity_type: "portfolio_project",
      entity_id: project.id,
      summary: `Created portfolio project "${project.title}" (${project.slug}) in status ${status}`,
      metadata: { slug: project.slug, status, permission: clientPermissionStatus },
    });

    revalidationService.revalidate("portfolio");
    return project;
  }

  /**
   * Updates an existing portfolio project.
   */
  async updateProject(
    id: string,
    input: UpdatePortfolioProjectInput,
    admin: AdminSession
  ): Promise<PortfolioProject> {
    const existing = await this.repo.getProjectById(id);
    if (!existing) {
      throw new NotFoundError(`Portfolio project with id ${id} not found.`);
    }

    const title = input.title !== undefined ? input.title : existing.title;
    const slug = input.slug !== undefined ? input.slug : existing.slug;
    const status = input.status !== undefined ? input.status : existing.status;
    const clientPermissionStatus =
      input.client_permission_status !== undefined
        ? input.client_permission_status
        : existing.client_permission_status;
    const metrics =
      input.metrics !== undefined ? input.metrics : existing.metrics;
    const storyBlocks =
      input.story_blocks !== undefined ? input.story_blocks : existing.story_blocks;
    const seoDescription =
      input.seo_description !== undefined ? input.seo_description : existing.seo_description;

    // Validate if publishing
    if (status === "published") {
      publishGateService.assertCanPublish({
        title,
        slug,
        domain: "portfolio",
        clientPermissionStatus,
        metrics: Array.isArray(metrics) ? (metrics as unknown as ProjectMetric[]) : undefined,
        storyBlocks: typeof storyBlocks === "object" ? (storyBlocks as Record<string, unknown>) : null,
        metaDescription: seoDescription || undefined,
      });
    }

    // Slug redirect handling if slug changed
    if (slug && slug !== existing.slug) {
      try {
        await slugRedirectRepository.recordRedirect({
          entity_type: "project",
          old_slug: existing.slug,
          new_slug: slug,
        });
      } catch (err) {
        console.warn("Could not register slug redirect:", err);
      }
    }

    const publishedAt =
      status === "published" && !existing.published_at
        ? new Date().toISOString()
        : existing.published_at;

    const updated = await this.repo.updateProject(id, {
      ...input,
      updated_by: admin.id,
      published_at: publishedAt,
    });

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECT_UPDATE",
      entity_type: "portfolio_project",
      entity_id: updated.id,
      summary: `Updated portfolio project "${updated.title}" (${updated.slug})`,
      metadata: {
        slug: updated.slug,
        status: updated.status,
        permission: updated.client_permission_status,
      },
    });

    revalidationService.revalidate("portfolio", `/portfolio/${updated.slug}`);
    if (existing.slug !== updated.slug) {
      revalidationService.revalidate("portfolio", `/portfolio/${existing.slug}`);
    }

    return updated;
  }

  /**
   * Publishes a portfolio project with strict governance checks.
   */
  async publishProject(id: string, admin: AdminSession): Promise<PortfolioProject> {
    const existing = await this.repo.getProjectById(id);
    if (!existing) {
      throw new NotFoundError(`Portfolio project with id ${id} not found.`);
    }

    publishGateService.assertCanPublish({
      title: existing.title,
      slug: existing.slug,
      domain: "portfolio",
      clientPermissionStatus: existing.client_permission_status,
      metrics: Array.isArray(existing.metrics)
        ? (existing.metrics as unknown as ProjectMetric[])
        : undefined,
      storyBlocks: existing.story_blocks as unknown as Record<string, unknown>,
      metaDescription: existing.seo_description || undefined,
    });

    const updated = await this.repo.updateProject(id, {
      status: "published",
      published_at: new Date().toISOString(),
      updated_by: admin.id,
    });

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECT_PUBLISH",
      entity_type: "portfolio_project",
      entity_id: updated.id,
      summary: `Published portfolio project "${updated.title}" (${updated.slug})`,
      metadata: {
        slug: updated.slug,
        client_permission: updated.client_permission_status,
      },
    });

    revalidationService.revalidate("portfolio", `/portfolio/${updated.slug}`);
    return updated;
  }

  /**
   * Archives a portfolio project.
   */
  async archiveProject(id: string, admin: AdminSession): Promise<PortfolioProject> {
    const existing = await this.repo.getProjectById(id);
    if (!existing) {
      throw new NotFoundError(`Portfolio project with id ${id} not found.`);
    }

    const updated = await this.repo.updateProject(id, {
      status: "archived",
      updated_by: admin.id,
    });

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECT_ARCHIVE",
      entity_type: "portfolio_project",
      entity_id: id,
      summary: `Archived portfolio project "${existing.title}" (${existing.slug})`,
      metadata: { slug: existing.slug },
    });

    revalidationService.revalidate("portfolio", `/portfolio/${existing.slug}`);
    return updated;
  }

  /**
   * Soft deletes a portfolio project.
   */
  async softDeleteProject(id: string, admin: AdminSession): Promise<void> {
    const existing = await this.repo.getProjectById(id);
    if (!existing) {
      throw new NotFoundError(`Portfolio project with id ${id} not found.`);
    }

    await this.repo.softDeleteProject(id, admin.id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECT_DELETE",
      entity_type: "portfolio_project",
      entity_id: id,
      summary: `Soft-deleted portfolio project "${existing.title}" (${existing.slug})`,
      metadata: { slug: existing.slug },
    });

    revalidationService.revalidate("portfolio", `/portfolio/${existing.slug}`);
  }

  /**
   * Alias for softDeleteProject.
   */
  async deleteProject(id: string, admin: AdminSession): Promise<void> {
    return this.softDeleteProject(id, admin);
  }

  /**
   * Reorders multiple projects.
   */
  async reorderProjects(orderedIds: string[], admin: AdminSession): Promise<void> {
    await this.repo.reorderProjects(orderedIds);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "PORTFOLIO_PROJECTS_REORDER",
      entity_type: "portfolio_project",
      entity_id: "batch",
      summary: `Reordered ${orderedIds.length} portfolio projects`,
      metadata: { orderedIds },
    });

    revalidationService.revalidate("portfolio");
  }

  /**
   * Lists project categories.
   */
  async getCategories(): Promise<ProjectCategory[]> {
    return this.repo.listCategories();
  }

  /**
   * Lists technologies vocabulary.
   */
  async getTechnologies(): Promise<Technology[]> {
    return this.repo.listTechnologies();
  }

  private validateProjectInput(input: CreatePortfolioProjectInput): void {
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError("Project title is required.");
    }
    if (!input.slug || input.slug.trim().length === 0) {
      throw new ValidationError("Project slug is required.");
    }
  }
}

export const portfolioService = new PortfolioService();

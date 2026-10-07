import "server-only";
import { BaseRepository } from "./base.repository";
import type {
  PortfolioProject,
  ProjectCategory,
  Technology,
} from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreatePortfolioProjectInput = Database["public"]["Tables"]["portfolio_projects"]["Insert"];
export type UpdatePortfolioProjectInput = Database["public"]["Tables"]["portfolio_projects"]["Update"];

export type CreateProjectCategoryInput = Database["public"]["Tables"]["project_categories"]["Insert"];
export type UpdateProjectCategoryInput = Database["public"]["Tables"]["project_categories"]["Update"];

export type CreateTechnologyInput = Database["public"]["Tables"]["technologies"]["Insert"];
export type UpdateTechnologyInput = Database["public"]["Tables"]["technologies"]["Update"];

/**
 * Authentic Baseline Project Categories (Document 04 §15.2, 05 §8.7).
 */
export const BASELINE_PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: "pc111111-1111-1111-1111-111111111111",
    slug: "enterprise-systems",
    name: "Enterprise Systems",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "pc222222-2222-2222-2222-222222222222",
    slug: "automation-ai",
    name: "Automation & AI",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "pc333333-3333-3333-3333-333333333333",
    slug: "cloud-infrastructure",
    name: "Cloud Infrastructure",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "pc444444-4444-4444-4444-444444444444",
    slug: "developer-tooling",
    name: "Developer Tooling",
    created_at: "2026-01-01T00:00:00Z",
  },
];

/**
 * Authentic Baseline Technologies Vocabulary (Document 04 §15.2).
 */
export const BASELINE_TECHNOLOGIES: Technology[] = [
  { id: "t1111111-1111-1111-1111-111111111111", slug: "typescript", name: "TypeScript", created_at: "2026-01-01T00:00:00Z" },
  { id: "t2222222-2222-2222-2222-222222222222", slug: "nextjs", name: "Next.js", created_at: "2026-01-01T00:00:00Z" },
  { id: "t3333333-3333-3333-3333-333333333333", slug: "postgresql", name: "PostgreSQL", created_at: "2026-01-01T00:00:00Z" },
  { id: "t4444444-4444-4444-4444-444444444444", slug: "python", name: "Python", created_at: "2026-01-01T00:00:00Z" },
  { id: "t5555555-5555-5555-5555-555555555555", slug: "fastapi", name: "FastAPI", created_at: "2026-01-01T00:00:00Z" },
  { id: "t6666666-6666-6666-6666-666666666666", slug: "docker", name: "Docker", created_at: "2026-01-01T00:00:00Z" },
  { id: "t7777777-7777-7777-7777-777777777777", slug: "rust", name: "Rust", created_at: "2026-01-01T00:00:00Z" },
  { id: "t8888888-8888-8888-8888-888888888888", slug: "linux-kernel", name: "Linux Kernel", created_at: "2026-01-01T00:00:00Z" },
];

/**
 * Authentic Baseline Portfolio Projects approved in Document 04 §15.1.
 * Every metric has verified source and owner. Client permission is granted.
 */
export const BASELINE_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj1111-1111-1111-1111-111111111111",
    slug: "henu-housing-erp",
    title: "HENU Housing Accounting ERP",
    summary: "A sovereign, multi-entity financial accounting and ledger engine engineered for real estate collectives and residential housing societies.",
    status: "published",
    project_status: "live",
    is_featured: true,
    display_order: 1,
    period_year: "2025",
    external_url: null,
    client_permission_status: "granted",
    category_slug: "enterprise-systems",
    technologies: ["PostgreSQL", "TypeScript", "Next.js", "Docker"],
    related_service_ids: ["website-development", "app-development"],
    related_product_ids: ["henu-os"],
    story_blocks: {
      challenge: {
        title: "Operational Friction & Fragmented Ledgers",
        content: "Traditional housing society accounting relies on error-prone spreadsheets or legacy closed-source software with zero data export transparency, causing reconciliation bottlenecks and audit friction.",
      },
      approach: {
        title: "Double-Entry Architecture & Immutable Journals",
        content: "Architected a double-entry ledger core with immutable transaction journals, automated resident billing pipelines, and granular role-based access control.",
      },
      solution: {
        title: "Sovereign Financial Platform",
        content: "Deployed an on-premise/hybrid sovereign ERP platform featuring automated bank reconciliation, multi-entity sub-ledgers, and transparent resident portals.",
      },
      technology: {
        title: "High-Integrity Tech Stack",
        content: "Implemented with PostgreSQL ACID transaction isolation, TypeScript typed schemas, and containerized sovereign deployment.",
        tags: ["PostgreSQL", "TypeScript", "Next.js", "Docker"],
      },
      outcome: {
        title: "Reconciliation Automation",
        content: "Automated monthly ledger reconciliation across 450 residential units, cutting close cycle duration with zero record discrepancies.",
        source: "HENU Internal Audit & Operations Report Q4 2025",
        owner: "HENU Lead Solutions Architect",
      },
      evidence: {
        title: "Operational Verification",
        content: "Operating in active production with verifiable zero-variance double-entry audit trials.",
        source: "HENU Verification Review 2025",
        owner: "HENU Systems Engineering",
      },
    },
    metrics: [
      {
        value: "100%",
        label: "Double-Entry Ledger Integrity",
        source: "Production Journal Reconciliation Log",
        owner: "HENU Core Engineering",
      },
      {
        value: "450+",
        label: "Residential Units Reconciled",
        source: "Tenant Registry Q4 2025",
        owner: "HENU Operations",
      },
    ],
    cover_media_id: null,
    seo_title: "HENU Housing Accounting ERP — Architectural Case Study",
    seo_description: "Explore the architectural implementation of the HENU Housing Accounting ERP: sovereign double-entry ledger engine.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "proj2222-2222-2222-2222-222222222222",
    slug: "henu-whatsapp-automation",
    title: "HENU WhatsApp Automation Engine",
    summary: "High-throughput sovereign conversational gateway and notification pipeline interfacing enterprise databases with WhatsApp Business API.",
    status: "published",
    project_status: "live",
    is_featured: false,
    display_order: 2,
    period_year: "2025",
    external_url: null,
    client_permission_status: "granted",
    category_slug: "automation-ai",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    related_service_ids: ["ai-automation"],
    related_product_ids: ["henu-ai", "henu-pa"],
    story_blocks: {
      challenge: {
        title: "Aggregator Latency & Vendor Lock-in",
        content: "High-volume transactional customer notifications suffered from delivery latency and vendor lock-in when routing through brittle third-party aggregators.",
      },
      approach: {
        title: "Direct Gateway Architecture",
        content: "Engineered an asynchronous message broker directly communicating with WhatsApp Cloud API with webhook idempotency and token bucket rate-limiting.",
      },
      solution: {
        title: "Idempotent Messaging Microservice",
        content: "Implemented a sovereign microservice handling end-to-end encryption, automated document delivery, and interactive response routing.",
      },
      technology: {
        title: "Asynchronous Python & Redis Core",
        content: "FastAPI asynchronous coroutine runtime backed by Redis message queues and PostgreSQL event sourcing.",
        tags: ["Python", "FastAPI", "PostgreSQL", "Docker"],
      },
      outcome: {
        title: "Low-Latency Message Delivery",
        content: "Achieved sub-500ms webhook response handling and reliable delivery for 50,000+ monthly transactional messages.",
        source: "Operational Telemetry Report 2025",
        owner: "HENU Infrastructure Team",
      },
    },
    metrics: [
      {
        value: "<500ms",
        label: "Webhook Delivery Latency",
        source: "System Telemetry Q3 2025",
        owner: "HENU Infrastructure Team",
      },
      {
        value: "99.98%",
        label: "Message Dispatch Reliability",
        source: "Cloud API Dispatch Logs",
        owner: "HENU Infrastructure Team",
      },
    ],
    cover_media_id: null,
    seo_title: "HENU WhatsApp Automation Engine — Case Study",
    seo_description: "Deep dive into the architecture of HENU's high-throughput WhatsApp automation microservice.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "proj3333-3333-3333-3333-333333333333",
    slug: "henu-mail",
    title: "HENU Mail & Sovereign Identity",
    summary: "Zero-telemetry sovereign mail server and cryptographic identity gateway engineered for developer privacy and domain sovereignty.",
    status: "published",
    project_status: "in_development",
    is_featured: false,
    display_order: 3,
    period_year: "2026",
    external_url: null,
    client_permission_status: "granted",
    category_slug: "cloud-infrastructure",
    technologies: ["Rust", "Linux Kernel", "Docker", "PostgreSQL"],
    related_service_ids: ["website-development"],
    related_product_ids: ["henu-os"],
    story_blocks: {
      challenge: {
        title: "Surveillance Telemetry in Standard Mail",
        content: "Standard cloud email platforms inspect user communications, enforce proprietary lock-in, and compromise developer sovereign communication.",
      },
      approach: {
        title: "Cryptographic Mail Pipeline",
        content: "Designed a lightweight, memory-safe mail transfer agent (MTA) protocol with native DKIM/SPF/DMARC cryptographic validation and local storage encryption.",
      },
      solution: {
        title: "Sovereign Mail Appliance",
        content: "A containerized mail appliance natively compatible with HENU OS desktop integration and encrypted local indexing.",
      },
      technology: {
        title: "Rust Core Implementation",
        content: "Engineered in Rust with memory safety guarantees, zero telemetry daemons, and sovereign data residency.",
        tags: ["Rust", "Linux Kernel", "Docker", "PostgreSQL"],
      },
    },
    metrics: [],
    cover_media_id: null,
    seo_title: "HENU Mail & Sovereign Identity — Case Study",
    seo_description: "Architectural overview of the HENU Mail sovereign cryptographic communication system.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export class PortfolioRepository extends BaseRepository {
  private inMemoryProjects: PortfolioProject[] = [...BASELINE_PORTFOLIO_PROJECTS];

  /**
   * Retrieves all published, non-deleted portfolio projects with granted client permission.
   * Optionally filtered by category slug.
   */
  async listPublishedProjects(categorySlug?: string): Promise<PortfolioProject[]> {
    if (!this.isConfigured) {
      return this.getFallbackPublishedProjects(categorySlug);
    }

    try {
      let query = this.serviceClient
        .from("portfolio_projects")
        .select("*")
        .eq("status", "published")
        .eq("client_permission_status", "granted")
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (categorySlug && categorySlug !== "all") {
        query = query.eq("category_slug", categorySlug);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return this.getFallbackPublishedProjects(categorySlug);
      }

      return data as PortfolioProject[];
    } catch {
      return this.getFallbackPublishedProjects(categorySlug);
    }
  }

  private getFallbackPublishedProjects(categorySlug?: string): PortfolioProject[] {
    let filtered = this.inMemoryProjects.filter(
      (p) =>
        p.status === "published" &&
        !p.deleted_at &&
        p.client_permission_status === "granted"
    );

    if (categorySlug && categorySlug !== "all") {
      filtered = filtered.filter((p) => p.category_slug === categorySlug);
    }

    return filtered.sort((a, b) => a.display_order - b.display_order);
  }

  /**
   * Retrieves a project by slug.
   * If allowDraft is false (default), only returns published, non-deleted projects with granted permission.
   * If allowDraft is true, returns any non-deleted project for authenticated preview.
   */
  async getProjectBySlug(
    slug: string,
    options?: { allowDraft?: boolean }
  ): Promise<PortfolioProject | null> {
    const allowDraft = options?.allowDraft ?? false;

    if (!this.isConfigured) {
      return this.getFallbackProjectBySlug(slug, allowDraft);
    }

    try {
      let query = this.serviceClient
        .from("portfolio_projects")
        .select("*")
        .eq("slug", slug)
        .is("deleted_at", null);

      if (!allowDraft) {
        query = query
          .eq("status", "published")
          .eq("client_permission_status", "granted");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        return this.getFallbackProjectBySlug(slug, allowDraft);
      }

      return data as PortfolioProject;
    } catch {
      return this.getFallbackProjectBySlug(slug, allowDraft);
    }
  }

  private getFallbackProjectBySlug(
    slug: string,
    allowDraft: boolean
  ): PortfolioProject | null {
    const project = this.inMemoryProjects.find(
      (p) => p.slug === slug && !p.deleted_at
    );

    if (!project) return null;

    if (!allowDraft) {
      if (project.status !== "published" || project.client_permission_status !== "granted") {
        return null;
      }
    }

    return project;
  }

  /**
   * Retrieves a project by ID (for admin operations).
   */
  async getProjectById(id: string): Promise<PortfolioProject | null> {
    if (!this.isConfigured) {
      const fallback = this.inMemoryProjects.find((p) => p.id === id);
      return fallback || null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("portfolio_projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        const fallback = this.inMemoryProjects.find((p) => p.id === id);
        return fallback || null;
      }

      return data as PortfolioProject;
    } catch {
      const fallback = this.inMemoryProjects.find((p) => p.id === id);
      return fallback || null;
    }
  }

  /**
   * Lists all projects with administrative filters and pagination.
   */
  async listAllProjects(options?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ projects: PortfolioProject[]; total: number }> {
    if (!this.isConfigured) {
      return this.getFallbackAllProjects(options);
    }

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const offset = (page - 1) * limit;

    try {
      let query = this.serviceClient
        .from("portfolio_projects")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("display_order", { ascending: true })
        .range(offset, offset + limit - 1);

      if (options?.status && options.status !== "all") {
        query = query.eq("status", options.status as "draft" | "published" | "archived");
      }

      if (options?.category && options.category !== "all") {
        query = query.eq("category_slug", options.category);
      }

      if (options?.search && options.search.trim().length > 0) {
        query = query.ilike("title", `%${options.search.trim()}%`);
      }

      const { data, count, error } = await query;

      if (error || !data) {
        return this.getFallbackAllProjects(options);
      }

      return {
        projects: data as PortfolioProject[],
        total: count || data.length,
      };
    } catch {
      return this.getFallbackAllProjects(options);
    }
  }

  private getFallbackAllProjects(options?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): { projects: PortfolioProject[]; total: number } {
    let filtered = this.inMemoryProjects.filter((p) => !p.deleted_at);

    if (options?.status && options.status !== "all") {
      filtered = filtered.filter((p) => p.status === options.status);
    }

    if (options?.category && options.category !== "all") {
      filtered = filtered.filter((p) => p.category_slug === options.category);
    }

    if (options?.search && options.search.trim().length > 0) {
      const term = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.summary.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => a.display_order - b.display_order);

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const offset = (page - 1) * limit;

    return {
      projects: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  }

  /**
   * Creates a new portfolio project.
   */
  async createProject(data: CreatePortfolioProjectInput): Promise<PortfolioProject> {
    if (!this.isConfigured) {
      const created: PortfolioProject = {
        ...data,
        id: `prj-${Date.now()}`,
        status: data.status || "draft",
        project_status: data.project_status || "in_development",
        is_featured: data.is_featured || false,
        client_permission_status: data.client_permission_status || "pending",
        display_order: data.display_order || this.inMemoryProjects.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as PortfolioProject;
      this.inMemoryProjects.push(created);
      return created;
    }

    try {
      const { data: created, error } = await this.serviceClient
        .from("portfolio_projects")
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new AppError("INTERNAL_ERROR", `Failed to create portfolio project: ${error.message}`, { status: 500 });
      }

      return created as PortfolioProject;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("INTERNAL_ERROR", "Database operation failed while creating portfolio project.", { status: 500 });
    }
  }

  /**
   * Updates an existing portfolio project.
   */
  async updateProject(
    id: string,
    data: UpdatePortfolioProjectInput
  ): Promise<PortfolioProject> {
    if (!this.isConfigured) {
      const idx = this.inMemoryProjects.findIndex((p) => p.id === id);
      if (idx === -1) {
        throw new AppError("NOT_FOUND", `Portfolio project ${id} not found`, { status: 404 });
      }
      const existing = this.inMemoryProjects[idx]!;
      const updated: PortfolioProject = {
        ...existing,
        ...data,
        updated_at: new Date().toISOString(),
      } as PortfolioProject;
      this.inMemoryProjects[idx] = updated;
      return updated;
    }

    try {
      const { data: updated, error } = await this.serviceClient
        .from("portfolio_projects")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new AppError("INTERNAL_ERROR", `Failed to update portfolio project: ${error.message}`, { status: 500 });
      }

      return updated as PortfolioProject;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("INTERNAL_ERROR", "Database operation failed while updating portfolio project.", { status: 500 });
    }
  }

  /**
   * Soft deletes a portfolio project.
   */
  async softDeleteProject(id: string, updatedBy?: string): Promise<void> {
    if (!this.isConfigured) {
      const idx = this.inMemoryProjects.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const existing = this.inMemoryProjects[idx]!;
        this.inMemoryProjects[idx] = {
          ...existing,
          deleted_at: new Date().toISOString(),
          status: "archived",
          updated_by: updatedBy || null,
          updated_at: new Date().toISOString(),
        };
      }
      return;
    }

    try {
      const { error } = await this.serviceClient
        .from("portfolio_projects")
        .update({
          deleted_at: new Date().toISOString(),
          status: "archived",
          updated_by: updatedBy || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        throw new AppError("INTERNAL_ERROR", `Failed to delete portfolio project: ${error.message}`, { status: 500 });
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("INTERNAL_ERROR", "Database operation failed while deleting portfolio project.", { status: 500 });
    }
  }

  /**
   * Reorders multiple projects in a single operation.
   */
  async reorderProjects(orderedIds: string[]): Promise<void> {
    if (!this.isConfigured) {
      orderedIds.forEach((id, index) => {
        const p = this.inMemoryProjects.find((item) => item.id === id);
        if (p) p.display_order = index + 1;
      });
      return;
    }

    try {
      const updates = orderedIds.map((id, index) =>
        this.serviceClient
          .from("portfolio_projects")
          .update({ display_order: index + 1, updated_at: new Date().toISOString() })
          .eq("id", id)
      );

      await Promise.all(updates);
    } catch {
      // Graceful fallback for in-memory / testing
    }
  }

  /**
   * Lists all project categories.
   */
  async listCategories(): Promise<ProjectCategory[]> {
    if (!this.isConfigured) {
      return BASELINE_PROJECT_CATEGORIES;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("project_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data || data.length === 0) {
        return BASELINE_PROJECT_CATEGORIES;
      }

      return data as ProjectCategory[];
    } catch {
      return BASELINE_PROJECT_CATEGORIES;
    }
  }

  /**
   * Lists all technologies from vocabulary.
   */
  async listTechnologies(): Promise<Technology[]> {
    if (!this.isConfigured) {
      return BASELINE_TECHNOLOGIES;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("technologies")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data || data.length === 0) {
        return BASELINE_TECHNOLOGIES;
      }

      return data as Technology[];
    } catch {
      return BASELINE_TECHNOLOGIES;
    }
  }
}

export const portfolioRepository = new PortfolioRepository();

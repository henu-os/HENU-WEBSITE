import "server-only";
import { BaseRepository } from "./base.repository";
import type { Product } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreateProductInput = Database["public"]["Tables"]["products"]["Insert"];
export type UpdateProductInput = Database["public"]["Tables"]["products"]["Update"];

/**
 * Authentic baseline products from approved project documents (Document 01 §1, 04 §11, 05 §4.3).
 * Used as verified fallback if database table has not yet been seeded.
 */
export const BASELINE_PRODUCTS: Product[] = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    slug: "henu-os",
    name: "HENU OS",
    tagline: "The Flagship Developer-Centric Operating System",
    status: "published",
    status_label: "in_development",
    hue_key: "os",
    template_variant: "os-environment",
    summary:
      "A refined, high-performance Linux-based operating system engineered for builders, engineers, and researchers.",
    description_blocks: [
      {
        type: "paragraph",
        content:
          "HENU OS is engineered from the ground up as a resilient, dignified computing environment. It eliminates telemetry noise, prioritizes deterministic package management, and integrates intelligent agent protocols directly at the desktop level.",
      },
      {
        type: "heading",
        level: 2,
        text: "Architectural Foundations",
      },
      {
        type: "paragraph",
        content:
          "Built on an engineered Linux kernel base with security hardening, HENU OS balances cutting-edge developer toolchains with rock-solid system stability.",
      },
    ],
    capabilities: [
      {
        title: "Developer Sovereignty",
        description:
          "Zero telemetry, zero forced background services, and complete user ownership of system resources.",
      },
      {
        title: "Deterministic Environment",
        description:
          "Reproducible development environments and declarative toolchains designed for software engineers.",
      },
      {
        title: "Deep AI & Voice Integration",
        description:
          "Natively host and connect with HENU AI reasoning layers and the HENU PA personal assistant.",
      },
      {
        title: "System-Grade Hardening",
        description:
          "Strict isolation boundaries, process sandboxing, and secure cryptographic storage primitives.",
      },
    ],
    signature_module_content: {
      type: "os-environment",
      kernel_version: "Hardened Linux Kernel",
      desktop_environment: "HENU Shell (Wayland-Native)",
      init_system: "Optimized System Core",
      package_model: "Declarative, Immutable Base Layers",
    },
    primary_cta_type: "explore",
    primary_cta_target: "/products/henu-os",
    cover_media_id: null,
    display_order: 1,
    seo_title: "HENU OS — The Flagship Developer Operating System",
    seo_description:
      "Official overview of HENU OS, a developer-centric Linux-based operating system built for privacy, performance, and engineering sovereignty.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    slug: "henu-ai",
    name: "HENU AI",
    tagline: "Foundation & Multimodal Reasoning Platform",
    status: "published",
    status_label: "in_development",
    hue_key: "ai",
    template_variant: "ai-capabilities",
    summary:
      "High-context multimodal reasoning and intelligent platform infrastructure built for enterprise and system workloads.",
    description_blocks: [
      {
        type: "paragraph",
        content:
          "HENU AI provides the cognitive infrastructure for the HENU ecosystem. Designed around multi-LLM orchestration, contextual retrieval, and rigorous verification, it powers developer productivity and systems-grade reasoning.",
      },
    ],
    capabilities: [
      {
        title: "Multimodal Reasoning",
        description:
          "Synthesizes complex inputs across text, code, documentation, and system telemetry simultaneously.",
      },
      {
        title: "Multi-Model Orchestration",
        description:
          "Dynamically routes specialized tasks to the most efficient reasoning models and specialized weights.",
      },
      {
        title: "Contextual Long-Range Memory",
        description:
          "Maintains high-fidelity repository and project context across prolonged engineering workflows.",
      },
      {
        title: "Sovereign Deployability",
        description:
          "Designed to run in cloud clusters or air-gapped on-premises systems with strict data protection.",
      },
    ],
    signature_module_content: {
      type: "ai-capabilities",
      capabilities_list: [
        {
          key: "reasoning",
          name: "Structured Reasoning",
          detail:
            "Decomposes complex multi-stage engineering problems into step-by-step verifiable subtasks.",
        },
        {
          key: "synthesis",
          name: "Code & Architecture Synthesis",
          detail:
            "Generates type-safe, lint-compliant code adhering to strict project architectural boundaries.",
        },
        {
          key: "context",
          name: "Large-Context Indexing",
          detail:
            "Efficiently navigates multi-gigabyte codebases and technical documentation without hallucinations.",
        },
        {
          key: "governance",
          name: "Sovereign Safety & Audit",
          detail:
            "Enforces strict input sanitization, token budgeting, and zero unauthorized third-party telemetry.",
        },
      ],
    },
    primary_cta_type: "explore",
    primary_cta_target: "/products/henu-ai",
    cover_media_id: null,
    display_order: 2,
    seo_title: "HENU AI — Foundation & Multimodal Reasoning Platform",
    seo_description:
      "Explore HENU AI: High-context multimodal reasoning, multi-model orchestration, and sovereign enterprise intelligence.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    slug: "henu-pa",
    name: "HENU PA",
    tagline: "Voice-Powered Personal Assistant",
    status: "published",
    status_label: "in_development",
    hue_key: "pa",
    template_variant: "pa-conversation",
    summary:
      "Voice-first personal assistant integrated deeply into HENU OS for streamlined workflows and developer productivity.",
    description_blocks: [
      {
        type: "paragraph",
        content:
          "HENU PA reimagines desktop interaction through clear, conversational voice agency. Connected directly to the operating system shell and developer environment, it executes workflows without taking hands off the keyboard.",
      },
    ],
    capabilities: [
      {
        title: "Hands-Free Desktop Control",
        description:
          "Trigger system tasks, switch developer workspaces, and manipulate windows via fluid voice commands.",
      },
      {
        title: "Local Acoustic Processing",
        description:
          "Privacy-first speech-to-text processing designed to operate locally without transmitting raw audio.",
      },
      {
        title: "Context-Aware Assistance",
        description:
          "Understands active files, build logs, and open terminal sessions to provide contextual answers.",
      },
      {
        title: "Developer Workflow Automation",
        description:
          "Execute script pipelines, run automated test suites, and summarize git changes conversationally.",
      },
    ],
    signature_module_content: {
      type: "pa-conversation",
      transcript: [
        {
          speaker: "user",
          text: "HENU, summarize failing tests across the payments module and show stack traces.",
        },
        {
          speaker: "assistant",
          text: "Three tests failed in payments-worker: two currency boundary checks and one token expiry assertion. Navigating to the relevant test file in HENU IDE now.",
        },
        {
          speaker: "user",
          text: "Run the fix branch and deploy to staging preview once verified.",
        },
        {
          speaker: "assistant",
          text: "Executing test suite on fix branch. All 42 checks passed. Staging deployment initiated with build tag v1.0.4.",
        },
      ],
    },
    primary_cta_type: "explore",
    primary_cta_target: "/products/henu-pa",
    cover_media_id: null,
    display_order: 3,
    seo_title: "HENU PA — Voice-Powered Personal Assistant",
    seo_description:
      "Discover HENU PA: Voice-first personal assistant deeply integrated into HENU OS for hands-free developer workflows.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    slug: "henu-ide",
    name: "HENU IDE",
    tagline: "AI-Augmented Developer Environment",
    status: "published",
    status_label: "in_development",
    hue_key: "ide",
    template_variant: "ide-workflow",
    summary:
      "An intelligent, context-aware development environment natively aligned with HENU OS and HENU AI.",
    description_blocks: [
      {
        type: "paragraph",
        content:
          "HENU IDE bridges the gap between systems engineering and artificial intelligence. Built for performance, it delivers instantaneous repository indexing, multi-file architectural edits, and seamless terminal synchronization.",
      },
    ],
    capabilities: [
      {
        title: "Holistic Codebase Indexing",
        description:
          "Indexes syntax graphs and type hierarchies in real-time, providing immediate context to local AI models.",
      },
      {
        title: "Multi-File Architectural Edits",
        description:
          "Refactor entire modules and update interconnected interfaces consistently with verified diff previews.",
      },
      {
        title: "Native OS Integration",
        description:
          "Deep alignment with HENU OS process sandboxes, container runtimes, and local debugging tools.",
      },
      {
        title: "Sub-Millisecond Responsiveness",
        description:
          "High-performance native editor core built to handle million-line codebases without UI latency.",
      },
    ],
    signature_module_content: {
      type: "ide-workflow",
      workflow_steps: [
        {
          step: 1,
          title: "Intelligent Ingestion",
          detail: "Real-time semantic indexing of codebase symbols, dependencies, and git history.",
        },
        {
          step: 2,
          title: "Architectural Synthesis",
          detail: "AI-assisted multi-file refactoring with precise structural guarantees.",
        },
        {
          step: 3,
          title: "Deterministic Verification",
          detail: "Automated linting, typechecking, and unit test execution prior to commit staging.",
        },
        {
          step: 4,
          title: "Sovereign Build",
          detail: "Sandboxed container execution aligned with target HENU OS production environments.",
        },
      ],
    },
    primary_cta_type: "explore",
    primary_cta_target: "/products/henu-ide",
    cover_media_id: null,
    display_order: 4,
    seo_title: "HENU IDE — AI-Augmented Developer Environment",
    seo_description:
      "Explore HENU IDE: Next-generation development environment featuring intelligent codebase indexing and native HENU OS integration.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export class ProductRepository extends BaseRepository {
  private inMemoryProducts: Product[] = [...BASELINE_PRODUCTS];

  /**
   * Retrieves all publicly visible products (status = 'published' AND deleted_at IS NULL).
   * Falls back to verified baseline products if the database is offline or not yet seeded.
   */
  async listPublishedProducts(): Promise<Product[]> {
    if (!this.isConfigured) {
      return this.inMemoryProducts
        .filter((p) => p.status === "published" && !p.deleted_at)
        .sort((a, b) => a.display_order - b.display_order);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("products")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return this.inMemoryProducts
          .filter((p) => p.status === "published" && !p.deleted_at)
          .sort((a, b) => a.display_order - b.display_order);
      }

      return data;
    } catch {
      return this.inMemoryProducts
        .filter((p) => p.status === "published" && !p.deleted_at)
        .sort((a, b) => a.display_order - b.display_order);
    }
  }

  /**
   * Retrieves a single product by its slug.
   * If allowDraft is true, drafts and archived items can be loaded (preview mode only).
   */
  async getProductBySlug(
    slug: string,
    options: { allowDraft?: boolean } = {}
  ): Promise<Product | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!this.isConfigured) {
      const match = this.inMemoryProducts.find(
        (p) => p.slug === normalizedSlug && !p.deleted_at
      );
      if (!match) return null;
      if (!options.allowDraft && match.status !== "published") return null;
      return match;
    }

    try {
      let query = this.serviceClient
        .from("products")
        .select("*")
        .eq("slug", normalizedSlug)
        .is("deleted_at", null);

      if (!options.allowDraft) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        // Fallback to baseline
        const match = this.inMemoryProducts.find(
          (p) => p.slug === normalizedSlug && !p.deleted_at
        );
        if (!match) return null;
        if (!options.allowDraft && match.status !== "published") return null;
        return match;
      }

      return data;
    } catch {
      const match = this.inMemoryProducts.find(
        (p) => p.slug === normalizedSlug && !p.deleted_at
      );
      if (!match) return null;
      if (!options.allowDraft && match.status !== "published") return null;
      return match;
    }
  }

  /**
   * Retrieves a product by ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    if (!this.isConfigured) {
      return this.inMemoryProducts.find((p) => p.id === id && !p.deleted_at) ?? null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return this.inMemoryProducts.find((p) => p.id === id) ?? null;
      }

      return data;
    } catch {
      return this.inMemoryProducts.find((p) => p.id === id) ?? null;
    }
  }

  /**
   * Lists all products for administrative management (includes drafts, archived).
   */
  async listAllProducts(options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: Product[]; total: number }> {
    if (!this.isConfigured) {
      const active = this.inMemoryProducts.filter((p) => !p.deleted_at);
      const sorted = active.sort((a, b) => a.display_order - b.display_order);
      const total = sorted.length;
      const offset = options.offset ?? 0;
      const limit = options.limit ?? 50;
      return {
        products: sorted.slice(offset, offset + limit),
        total,
      };
    }

    try {
      const query = this.serviceClient
        .from("products")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (options.limit) {
        query.limit(options.limit);
      }
      if (options.offset) {
        query.range(options.offset, options.offset + (options.limit ?? 50) - 1);
      }

      const { data, error, count } = await query;

      if (error || !data || data.length === 0) {
        const active = this.inMemoryProducts.filter((p) => !p.deleted_at);
        return { products: active, total: active.length };
      }

      return {
        products: data,
        total: count ?? data.length,
      };
    } catch {
      const active = this.inMemoryProducts.filter((p) => !p.deleted_at);
      return { products: active, total: active.length };
    }
  }

  /**
   * Persists a new product record.
   */
  async createProduct(
    input: CreateProductInput,
    adminId: string
  ): Promise<Product> {
    if (!this.isConfigured) {
      const created: Product = {
        ...input,
        id: `prod-${Date.now()}`,
        status: input.status ?? "draft",
        status_label: input.status_label ?? "in_development",
        summary: input.summary ?? "",
        description_blocks: input.description_blocks ?? [],
        capabilities: input.capabilities ?? [],
        signature_module_content: input.signature_module_content ?? null,
        display_order: input.display_order ?? this.inMemoryProducts.length + 1,
        created_by: adminId,
        updated_by: adminId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Product;
      this.inMemoryProducts.push(created);
      return created;
    }

    const payload = {
      ...input,
      created_by: adminId,
      updated_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.serviceClient
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", "Failed to create product record.", {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Updates an existing product record.
   */
  async updateProduct(
    id: string,
    input: UpdateProductInput,
    adminId: string
  ): Promise<Product> {
    if (!this.isConfigured) {
      const idx = this.inMemoryProducts.findIndex((p) => p.id === id);
      if (idx === -1) {
        throw new AppError("NOT_FOUND", "Product not found or update failed.", {
          status: 404,
        });
      }
      const existing = this.inMemoryProducts[idx]!;
      const updated: Product = {
        ...existing,
        ...input,
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      };
      this.inMemoryProducts[idx] = updated;
      return updated;
    }

    const payload = {
      ...input,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.serviceClient
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("NOT_FOUND", "Product not found or update failed.", {
        status: 404,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Soft-deletes a product by setting deleted_at.
   */
  async deleteProduct(id: string, adminId: string): Promise<void> {
    if (!this.isConfigured) {
      const idx = this.inMemoryProducts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const existing = this.inMemoryProducts[idx]!;
        this.inMemoryProducts[idx] = {
          ...existing,
          deleted_at: new Date().toISOString(),
          updated_by: adminId,
        };
      }
      return;
    }

    const { error } = await this.serviceClient
      .from("products")
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: adminId,
      })
      .eq("id", id);

    if (error) {
      throw new AppError("INTERNAL_ERROR", "Failed to delete product.", {
        status: 500,
        details: error.message,
      });
    }
  }
}

export const productRepository = new ProductRepository();

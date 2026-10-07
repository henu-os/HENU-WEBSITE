import "server-only";
import { BaseRepository } from "./base.repository";
import type { Service, ServiceCategory } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreateServiceCategoryInput = Database["public"]["Tables"]["service_categories"]["Insert"];
export type UpdateServiceCategoryInput = Database["public"]["Tables"]["service_categories"]["Update"];

export type CreateServiceInput = Database["public"]["Tables"]["services"]["Insert"];
export type UpdateServiceInput = Database["public"]["Tables"]["services"]["Update"];

/**
 * Authentic Baseline Categories approved in Document 04 §14.3.
 */
export const BASELINE_CATEGORIES: ServiceCategory[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    slug: "build",
    name: "Build",
    description: "Core engineering for high-performance web, mobile, and distributed systems.",
    display_order: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    slug: "intelligence",
    name: "Intelligence",
    description: "Sovereign AI reasoning, multi-model agent protocols, and automated pipelines.",
    display_order: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    slug: "brand-and-growth",
    name: "Brand & Growth",
    description: "Cohesive technical identity, interface precision, and data-driven client acquisition.",
    display_order: 3,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    slug: "business-foundations",
    name: "Business Foundations",
    description: "Structural documentation, legal compliance assistance, and capital readiness coordination.",
    display_order: 4,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

/**
 * Authentic Baseline Services approved in Document 04 §14.1 & §14.3.
 * Strictly zero pricing information. Mandatory disclaimers on sensitive services.
 */
export const BASELINE_SERVICES: Service[] = [
  // --- BUILD ---
  {
    id: "s1111111-1111-1111-1111-111111111111",
    category_id: "c1111111-1111-1111-1111-111111111111",
    slug: "website-development",
    name: "Website Development",
    summary: "High-performance, accessible digital surfaces built with lean type-safe architectures and zero bloat.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Architecture Challenge",
      description: "Legacy web applications suffer from fragmented toolchains, severe JavaScript bundle bloat, sluggish time-to-interactive, and poor SEO accessibility.",
      points: [
        "Excessive client-side bundle payloads degrading initial page render.",
        "Unvalidated third-party scripts introducing privacy leaks and latency.",
        "Inaccessible markup failing modern regulatory and WCAG compliance standards.",
      ],
    },
    capability_block: {
      headline: "Engineered Capabilities",
      description: "Next.js server-driven architectures, strict TypeScript typing, sub-second TTFB, and accessible component hierarchies.",
      attributes: ["Server Component architecture", "Sub-second load times", "WCAG AA accessibility", "Edge cache optimization"],
    },
    approach_block: {
      headline: "Engineering Approach",
      description: "We decouple visual presentation from backend business logic using semantic tokens, headless repository services, and deterministic continuous integration harnesses.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "A fast, resilient, and responsive public web presence engineered to convey authority, retain prospective users, and scale without architectural degradation.",
    },
    outcome_block: {
      headline: "Operational Outcomes",
      description: "Measurable improvements in Core Web Vitals, organic search discoverability, and substantially reduced maintenance friction.",
    },
    faq_items: [
      {
        question: "What frameworks do you build public websites with?",
        answer: "We primarily engineer with Next.js (App Router), React, strict TypeScript, and semantic Tailwind CSS design systems.",
      },
      {
        question: "How do you handle ongoing content administration?",
        answer: "Every application is wired to a secure, role-restricted Admin Panel supporting draft previews, on-demand cache revalidation, and audit logging.",
      },
    ],
    display_order: 1,
    seo_title: "Website Development — High-Performance Web Engineering | HENU",
    seo_description: "Custom web development services engineered with Next.js, TypeScript, and modern headless architecture.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "s1111111-1111-1111-1111-111111111112",
    category_id: "c1111111-1111-1111-1111-111111111111",
    slug: "mobile-app-development",
    name: "Mobile App Development",
    summary: "Fluid, native-grade iOS and Android applications engineered for resilient offline-first operation.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Architecture Challenge",
      description: "Cross-platform mobile applications frequently suffer from sluggish frame rates, brittle hardware integrations, and rapid device battery depletion.",
      points: [
        "Unresponsive touch handling causing user frustration.",
        "Data loss during intermittent mobile connectivity.",
        "Inadequate background synchronization strategies.",
      ],
    },
    capability_block: {
      headline: "Engineered Capabilities",
      description: "Declarative mobile architectures, native bridge optimization, encrypted SQLite local persistence, and background sync queues.",
      attributes: ["60fps fluid UI execution", "Offline-first data syncing", "Biometric authentication", "Deterministic state machines"],
    },
    approach_block: {
      headline: "Engineering Approach",
      description: "We treat mobile applications as decentralized nodes capable of full offline execution, reconciling state deterministically when connectivity resumes.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Resilient mobile clients deployed to the App Store and Google Play that operate reliably under adverse network constraints.",
    },
    outcome_block: {
      headline: "Operational Outcomes",
      description: "Sub-millisecond UI responsiveness, high crash-free session rates, and predictable cross-platform behavior.",
    },
    faq_items: [
      {
        question: "Do you support both iOS and Android platforms?",
        answer: "Yes, our mobile engineering pipeline builds and validates for both iOS and Android from unified, audited codebases.",
      },
    ],
    display_order: 2,
    seo_title: "Mobile App Development — Native & Cross-Platform Engineering | HENU",
    seo_description: "Offline-first, high-performance mobile application development for iOS and Android.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "s1111111-1111-1111-1111-111111111113",
    category_id: "c1111111-1111-1111-1111-111111111111",
    slug: "software-solutions",
    name: "Software Solutions",
    summary: "Custom backend architectures, distributed services, and enterprise workflow automation engines.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Architecture Challenge",
      description: "Off-the-shelf SaaS tools impose recurring seat taxes, opaque data governance boundaries, and rigid workflows that limit enterprise autonomy.",
      points: [
        "Uncontrolled recurring subscription expenditure.",
        "Critical corporate data stored in multi-tenant shared silos.",
        "Inability to customize core business algorithms.",
      ],
    },
    capability_block: {
      headline: "Engineered Capabilities",
      description: "Custom PostgreSQL relational modeling, high-throughput microservices, cryptographic audit trails, and sovereign deployment topologies.",
      attributes: ["Zero third-party telemetry", "Self-hosted containerization", "Domain-driven architecture", "Granular role-based access"],
    },
    approach_block: {
      headline: "Engineering Approach",
      description: "We architect software as sovereign assets owned entirely by your organization, providing complete source code access and independent deployment capabilities.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Tailored enterprise software environments that mirror your operational requirements with zero licensing lock-in.",
    },
    outcome_block: {
      headline: "Operational Outcomes",
      description: "Direct ownership of intellectual property, total data sovereignty, and streamlined operational velocity.",
    },
    faq_items: [
      {
        question: "Who owns the code and intellectual property?",
        answer: "Your organization owns 100% of the custom software code, data schemas, and deployment artifacts.",
      },
    ],
    display_order: 3,
    seo_title: "Software Solutions — Sovereign Enterprise Systems Engineering | HENU",
    seo_description: "Custom software development delivering sovereign backend systems, databases, and workflow automation.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },

  // --- INTELLIGENCE ---
  {
    id: "s2222222-2222-2222-2222-222222222221",
    category_id: "c2222222-2222-2222-2222-222222222222",
    slug: "ai-automation",
    name: "AI Automation",
    summary: "Deterministic agent workflows, local model integration, and sovereign document intelligence pipelines.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Architecture Challenge",
      description: "Unsupervised commercial AI APIs expose proprietary business context to external retraining, while suffering from hallucinations and unpredictable latency.",
      points: [
        "Corporate data exfiltration to third-party model providers.",
        "Unreliable, non-deterministic structured output generation.",
        "Lack of verifiable human oversight controls.",
      ],
    },
    capability_block: {
      headline: "Engineered Capabilities",
      description: "Multi-model orchestration, schema-enforced JSON validation, localized vector retrieval, and automated verification loops.",
      attributes: ["Sovereign on-premise execution", "Schema-constrained generation", "Verifiable audit logging", "Task-aware model routing"],
    },
    approach_block: {
      headline: "Engineering Approach",
      description: "We build AI systems with rigorous boundary enforcement: models propose mutations, while deterministic software harnesses validate type safety before execution.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Production intelligence pipelines that automate document extraction, analytical synthesis, and conversational dispatch with complete data privacy.",
    },
    outcome_block: {
      headline: "Operational Outcomes",
      description: "Accelerated process throughput, eliminated data exfiltration risk, and absolute determinism in structured workflows.",
    },
    faq_items: [
      {
        question: "Can AI automation pipelines run on private servers?",
        answer: "Yes, we support private deployment architectures using local model runtimes or dedicated private endpoints with zero data sharing.",
      },
    ],
    display_order: 1,
    seo_title: "AI Automation — Sovereign Intelligence & Model Orchestration | HENU",
    seo_description: "Private, deterministic AI automation and multimodal reasoning systems engineered for enterprise workloads.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },

  // --- BRAND & GROWTH ---
  {
    id: "s3333333-3333-3333-3333-333333333331",
    category_id: "c3333333-3333-3333-3333-333333333333",
    slug: "graphic-design",
    name: "Graphic Design",
    summary: "Dignified visual identities, typographic design systems, and cohesive technical product collateral.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Visual Identity Problem",
      description: "Generic startup branding templates fail to convey architectural authority, engineering discipline, and enduring institutional credibility.",
      points: [
        "Superficial trendy aesthetic tropes aging rapidly.",
        "Fragmented brand collateral across web, product, and physical media.",
        "Absence of systematic typographic and color rules.",
      ],
    },
    capability_block: {
      headline: "Design Capabilities",
      description: "Editorial layout design, custom vector iconography, typographic scale systems, and cohesive multi-surface visual guidelines.",
      attributes: ["Typographic precision", "Cohesive brand manuals", "Vector asset production", "High-contrast accessibility"],
    },
    approach_block: {
      headline: "Design Philosophy",
      description: "Our approach draws on timeless international typography, functional minimalism, and architectural dignity rather than fleeting visual noise.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "A cohesive brand identity system that positions your technology with clarity, seriousness, and visual distinction.",
    },
    outcome_block: {
      headline: "Brand Outcomes",
      description: "Commanding visual presence, immediate stakeholder recognition, and consistent representation across all interfaces.",
    },
    faq_items: [
      {
        question: "What deliverable assets are included in brand design?",
        answer: "We deliver full vector asset suites (SVG), typographic specifications, tokenized color palettes, and comprehensive brand guidelines.",
      },
    ],
    display_order: 1,
    seo_title: "Graphic Design — Typographic & Technical Identity Systems | HENU",
    seo_description: "Dignified brand design and visual identity systems engineered for technology companies.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "s3333333-3333-3333-3333-333333333332",
    category_id: "c3333333-3333-3333-3333-333333333333",
    slug: "digital-marketing",
    name: "Digital Marketing",
    summary: "Ethical, data-informed audience acquisition, technical SEO strategy, and search discoverability.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Growth Challenge",
      description: "Invasive tracking networks and opaque ad platforms consume marketing resources while delivering low-intent, non-converting traffic.",
      points: [
        "High customer acquisition costs driven by bidding wars.",
        "Fragile growth channels vulnerable to third-party platform algorithm changes.",
        "Privacy-invasive tracking harming brand reputation.",
      ],
    },
    capability_block: {
      headline: "Marketing Capabilities",
      description: "Technical SEO architecture, programmatic content structuring, privacy-compliant conversion tracking, and high-intent campaign management.",
      attributes: ["First-party telemetry", "Technical SEO audits", "Search intent modeling", "Organic discovery acceleration"],
    },
    approach_block: {
      headline: "Marketing Approach",
      description: "We focus on compounding organic discoverability and clear technical authority, driving high-intent business enquiries without invasive surveillance.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Sustainable growth engines that connect your products and services with authentic corporate demand.",
    },
    outcome_block: {
      headline: "Growth Outcomes",
      description: "Compounding inbound enquiry volume, improved organic search positioning, and durable audience acquisition channels.",
    },
    faq_items: [
      {
        question: "Do your marketing implementations respect user privacy?",
        answer: "Yes, we strictly implement first-party, cookie-less conversion analytics adhering to global data protection regulations.",
      },
    ],
    display_order: 2,
    seo_title: "Digital Marketing & Technical SEO Strategy | HENU",
    seo_description: "Data-driven technical SEO, ethical digital marketing, and organic audience acquisition for technology enterprises.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },

  // --- BUSINESS FOUNDATIONS ---
  {
    id: "s4444444-4444-4444-4444-444444444441",
    category_id: "c4444444-4444-4444-4444-444444444444",
    slug: "documentation-and-startup-services",
    name: "Documentation & Startup Services",
    summary: "Structured technical documentation, architecture specifications, and investor-ready operational artifacts.",
    status: "published",
    requires_disclaimer: false,
    disclaimer_block: null,
    problem_block: {
      headline: "The Documentation Gap",
      description: "Early-stage technology ventures often struggle with undocumented architectures, ambiguous technical roadmaps, and inadequate institutional diligence materials.",
      points: [
        "Knowledge silos preventing efficient team scaling.",
        "Failed institutional technical due diligence.",
        "Unclear system boundaries delaying development milestones.",
      ],
    },
    capability_block: {
      headline: "Documentation Capabilities",
      description: "PRD authoring, technical architecture blueprints, security policy documentation, and developer portal engineering.",
      attributes: ["Architectural clarity", "Diligence readiness", "Systematic version control", "Standard-compliant formatting"],
    },
    approach_block: {
      headline: "Documentation Approach",
      description: "We treat documentation as an engineered product: structured, version-controlled Markdown artifacts with clear ownership and explicit verification criteria.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Audit-grade technical collateral that satisfies enterprise clients, institutional partners, and technical leadership.",
    },
    outcome_block: {
      headline: "Operational Outcomes",
      description: "Frictionless developer onboarding, seamless technical diligence, and durable institutional knowledge retention.",
    },
    faq_items: [
      {
        question: "What types of technical documentation do you deliver?",
        answer: "We synthesize Product Requirement Documents (PRDs), Technical Architecture Blueprints, Security Architecture Specifications, and API Reference Guides.",
      },
    ],
    display_order: 1,
    seo_title: "Documentation & Startup Services — Technical Specifications | HENU",
    seo_description: "Audit-ready technical documentation, architectural specifications, and diligence materials for technology ventures.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "s4444444-4444-4444-4444-444444444442",
    category_id: "c4444444-4444-4444-4444-444444444444",
    slug: "legal-services",
    name: "Legal Services",
    summary: "Corporate documentation coordination, intellectual property filing assistance, and compliance framework alignment.",
    status: "published",
    requires_disclaimer: true,
    disclaimer_block:
      "HENU provides corporate documentation coordination, technology compliance assistance, and administrative synthesis. HENU is not a law firm and does not provide legal representation, formal legal opinions, or guaranteed regulatory outcomes. All corporate filings, statutory contracts, and binding legal terms are subject to independent review by accredited legal practitioners.",
    problem_block: {
      headline: "Compliance & Governance Coordination",
      description: "Emerging technology initiatives operate in complex regulatory environments where misaligned documentation risks administrative delay and intellectual property ambiguity.",
      points: [
        "Unclear intellectual property assignment across contributors.",
        "Uncoordinated corporate records and compliance documentation.",
        "Complex regulatory filings requiring structured administrative preparation.",
      ],
    },
    capability_block: {
      headline: "Coordination Capabilities",
      description: "Corporate document organization, IP assignment tracking matrices, open-source license audits, and administrative coordination support.",
      attributes: ["Document tracking", "IP assignment matrices", "License compliance audits", "Administrative coordination"],
    },
    approach_block: {
      headline: "Operational Approach",
      description: "We work alongside designated accredited legal counsel to assemble, organize, and structure technical and operational records required for compliance filings.",
    },
    solution_block: {
      headline: "The Coordinated Solution",
      description: "A methodical administrative governance trail that organizes corporate records and facilitates orderly legal review.",
    },
    outcome_block: {
      headline: "Governance Outcomes",
      description: "Clean administrative audit trails, organized corporate registers, and structured documentation ready for legal sign-off.",
    },
    faq_items: [
      {
        question: "Is HENU a legal advisory firm?",
        answer: "No. HENU provides administrative, technical, and operational documentation coordination. All formal legal advice is provided by independent licensed legal practitioners.",
      },
    ],
    display_order: 2,
    seo_title: "Legal Services & Corporate Compliance Coordination | HENU",
    seo_description: "Administrative coordination and documentation support for corporate governance and intellectual property tracking.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "s4444444-4444-4444-4444-444444444443",
    category_id: "c4444444-4444-4444-4444-444444444444",
    slug: "funding-solutions",
    name: "Funding Solutions",
    summary: "Grant proposal architecture, financial model engineering, and non-dilutive capital readiness coordination.",
    status: "published",
    requires_disclaimer: true,
    disclaimer_block:
      "HENU assists organizations with technical documentation, milestone structuring, and proposal preparation for institutional grants and research capital readiness. HENU is not an investment broker, registered financial advisor, or capital guarantor, and makes no claims or guarantees of funding approvals, investment sums, or investor commitments. Funding decisions remain solely at the discretion of respective granting authorities and investors.",
    problem_block: {
      headline: "Capital Readiness Challenges",
      description: "Technology ventures frequently miss institutional grant and research funding opportunities due to poorly articulated technical specifications and non-compliant milestone projections.",
      points: [
        "Inadequately structured technical merit narratives.",
        "Non-compliant research expenditure frameworks.",
        "Lack of verifiable engineering milestone roadmaps.",
      ],
    },
    capability_block: {
      headline: "Readiness Capabilities",
      description: "Grant proposal technical architecture, R&D milestone roadmap structuring, budget expenditure modeling, and institutional diligence synthesis.",
      attributes: ["Technical grant drafting", "Milestone roadmapping", "Budget framework modeling", "Diligence dossier assembly"],
    },
    approach_block: {
      headline: "Readiness Approach",
      description: "We align genuine technical capabilities with institutional grant evaluation rubrics, structuring proposals with scientific clarity and verifiable milestones.",
    },
    solution_block: {
      headline: "The Delivered Solution",
      description: "Comprehensive institutional grant dossiers and capital readiness materials that articulate technical ambition with absolute precision.",
    },
    outcome_block: {
      headline: "Readiness Outcomes",
      description: "High-clarity institutional submissions with structured milestone governance and transparent expenditure frameworks.",
    },
    faq_items: [
      {
        question: "Does HENU guarantee grant funding approvals?",
        answer: "No. Funding decisions are made independently by granting authorities. HENU assists solely with technical documentation, proposal structure, and diligence preparation.",
      },
    ],
    display_order: 3,
    seo_title: "Funding Solutions — Grant Architecture & Capital Readiness | HENU",
    seo_description: "Technical proposal architecture and institutional grant readiness coordination for technology ventures.",
    published_at: "2026-01-01T00:00:00Z",
    deleted_at: null,
    created_by: null,
    updated_by: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export class ServiceRepository extends BaseRepository {
  private inMemoryCategories: ServiceCategory[] = [...BASELINE_CATEGORIES];
  private inMemoryServices: Service[] = [...BASELINE_SERVICES];

  // ==========================================
  // CATEGORIES
  // ==========================================

  /**
   * Retrieves all service categories ordered by display_order.
   */
  async listCategories(): Promise<ServiceCategory[]> {
    if (!this.isConfigured) {
      return [...this.inMemoryCategories].sort((a, b) => a.display_order - b.display_order);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("service_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return [...this.inMemoryCategories].sort((a, b) => a.display_order - b.display_order);
      }

      return data;
    } catch {
      return [...this.inMemoryCategories].sort((a, b) => a.display_order - b.display_order);
    }
  }

  /**
   * Retrieves a single category by slug.
   */
  async getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
    const normalized = slug.trim().toLowerCase();

    if (!this.isConfigured) {
      return this.inMemoryCategories.find((c) => c.slug === normalized) || null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("service_categories")
        .select("*")
        .eq("slug", normalized)
        .maybeSingle();

      if (error || !data) {
        return this.inMemoryCategories.find((c) => c.slug === normalized) || null;
      }

      return data;
    } catch {
      return this.inMemoryCategories.find((c) => c.slug === normalized) || null;
    }
  }

  /**
   * Retrieves a single category by ID.
   */
  async getCategoryById(id: string): Promise<ServiceCategory | null> {
    if (!this.isConfigured) {
      return this.inMemoryCategories.find((c) => c.id === id) || null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("service_categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return this.inMemoryCategories.find((c) => c.id === id) || null;
      }

      return data;
    } catch {
      return this.inMemoryCategories.find((c) => c.id === id) || null;
    }
  }

  /**
   * Admin: Creates a new service category.
   */
  async createCategory(input: CreateServiceCategoryInput): Promise<ServiceCategory> {
    if (!this.isConfigured) {
      const created: ServiceCategory = {
        id: `cat-${Date.now()}`,
        slug: input.slug,
        name: input.name,
        description: input.description ?? null,
        display_order: input.display_order ?? this.inMemoryCategories.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.inMemoryCategories.push(created);
      return created;
    }

    const { data, error } = await this.serviceClient
      .from("service_categories")
      .insert(input)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", "Failed to create service category.", {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Admin: Updates an existing service category.
   */
  async updateCategory(id: string, input: UpdateServiceCategoryInput): Promise<ServiceCategory> {
    if (!this.isConfigured) {
      const idx = this.inMemoryCategories.findIndex((c) => c.id === id);
      if (idx === -1) {
        throw new AppError("NOT_FOUND", `Failed to update service category ${id}.`, {
          status: 404,
        });
      }
      const existing = this.inMemoryCategories[idx]!;
      const updated: ServiceCategory = {
        ...existing,
        ...input,
        updated_at: new Date().toISOString(),
      };
      this.inMemoryCategories[idx] = updated;
      return updated;
    }

    const { data, error } = await this.serviceClient
      .from("service_categories")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", `Failed to update service category ${id}.`, {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Admin: Deletes a service category.
   */
  async deleteCategory(id: string): Promise<void> {
    if (!this.isConfigured) {
      this.inMemoryCategories = this.inMemoryCategories.filter((c) => c.id !== id);
      return;
    }

    const { error } = await this.serviceClient
      .from("service_categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw new AppError("INTERNAL_ERROR", `Failed to delete service category ${id}.`, {
        status: 500,
        details: error.message,
      });
    }
  }

  // ==========================================
  // SERVICES
  // ==========================================

  /**
   * Public: List all published services (SERV-001).
   * Strictly filters status = 'published' and deleted_at IS NULL.
   */
  async listPublishedServices(): Promise<Service[]> {
    if (!this.isConfigured) {
      return this.inMemoryServices
        .filter((s) => s.status === "published" && !s.deleted_at)
        .sort((a, b) => a.display_order - b.display_order);
    }

    try {
      const { data, error } = await this.serviceClient
        .from("services")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return this.inMemoryServices
          .filter((s) => s.status === "published" && !s.deleted_at)
          .sort((a, b) => a.display_order - b.display_order);
      }

      return data;
    } catch {
      return this.inMemoryServices
        .filter((s) => s.status === "published" && !s.deleted_at)
        .sort((a, b) => a.display_order - b.display_order);
    }
  }

  /**
   * Public: List published services grouped by category for the editorial index (SERV-001).
   */
  async listPublishedServicesWithCategories(): Promise<
    Array<{ category: ServiceCategory; services: Service[] }>
  > {
    const [categories, services] = await Promise.all([
      this.listCategories(),
      this.listPublishedServices(),
    ]);

    return categories
      .map((cat) => ({
        category: cat,
        services: services
          .filter((s) => s.category_id === cat.id)
          .sort((a, b) => a.display_order - b.display_order),
      }))
      .filter((group) => group.services.length > 0);
  }

  /**
   * Public/Admin: Retrieves a service by its slug.
   * If allowDraft is false (default), strictly returns published non-deleted records.
   */
  async getServiceBySlug(
    slug: string,
    options: { allowDraft?: boolean } = {}
  ): Promise<Service | null> {
    const normalized = slug.trim().toLowerCase();

    if (!this.isConfigured) {
      const match = this.inMemoryServices.find(
        (s) => s.slug === normalized && !s.deleted_at
      );
      if (!match) return null;
      if (!options.allowDraft && match.status !== "published") return null;
      return match;
    }

    try {
      let query = this.serviceClient
        .from("services")
        .select("*")
        .eq("slug", normalized)
        .is("deleted_at", null);

      if (!options.allowDraft) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        const match = this.inMemoryServices.find(
          (s) => s.slug === normalized && !s.deleted_at
        );
        if (!match) return null;
        if (!options.allowDraft && match.status !== "published") return null;
        return match;
      }

      return data;
    } catch {
      const match = this.inMemoryServices.find(
        (s) => s.slug === normalized && !s.deleted_at
      );
      if (!match) return null;
      if (!options.allowDraft && match.status !== "published") return null;
      return match;
    }
  }

  /**
   * Admin: Retrieves a service by its ID.
   */
  async getServiceById(id: string): Promise<Service | null> {
    if (!this.isConfigured) {
      return this.inMemoryServices.find((s) => s.id === id && !s.deleted_at) || null;
    }

    try {
      const { data, error } = await this.serviceClient
        .from("services")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .maybeSingle();

      if (error || !data) {
        return this.inMemoryServices.find((s) => s.id === id && !s.deleted_at) || null;
      }

      return data;
    } catch {
      return this.inMemoryServices.find((s) => s.id === id && !s.deleted_at) || null;
    }
  }

  /**
   * Admin: Lists all services with pagination and optional category filter (SERV-003).
   */
  async listAllServices(options: { categoryId?: string; limit?: number; offset?: number } = {}) {
    if (!this.isConfigured) {
      let filtered = this.inMemoryServices.filter((s) => !s.deleted_at);
      if (options.categoryId) {
        filtered = filtered.filter((s) => s.category_id === options.categoryId);
      }
      const sorted = filtered.sort((a, b) => a.display_order - b.display_order);
      const total = sorted.length;
      const offset = options.offset ?? 0;
      const limit = options.limit ?? 50;
      return {
        services: sorted.slice(offset, offset + limit),
        total,
      };
    }

    try {
      let query = this.serviceClient
        .from("services")
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (options.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }

      if (options.limit !== undefined && options.offset !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      }

      const { data, error, count } = await query;

      if (error || !data) {
        let filtered = this.inMemoryServices.filter((s) => !s.deleted_at);
        if (options.categoryId) {
          filtered = filtered.filter((s) => s.category_id === options.categoryId);
        }
        return {
          services: filtered.sort((a, b) => a.display_order - b.display_order),
          total: filtered.length,
        };
      }

      return {
        services: data,
        total: count ?? data.length,
      };
    } catch {
      let filtered = this.inMemoryServices.filter((s) => !s.deleted_at);
      if (options.categoryId) {
        filtered = filtered.filter((s) => s.category_id === options.categoryId);
      }
      return {
        services: filtered.sort((a, b) => a.display_order - b.display_order),
        total: filtered.length,
      };
    }
  }

  /**
   * Admin: Creates a new service.
   */
  async createService(input: CreateServiceInput, actorId?: string): Promise<Service> {
    if (!this.isConfigured) {
      const created: Service = {
        ...input,
        id: `srv-${Date.now()}`,
        status: input.status ?? "draft",
        requires_disclaimer: input.requires_disclaimer ?? false,
        disclaimer_block: input.disclaimer_block ?? null,
        problem_block: input.problem_block ?? null,
        capability_block: input.capability_block ?? null,
        approach_block: input.approach_block ?? null,
        solution_block: input.solution_block ?? null,
        outcome_block: input.outcome_block ?? null,
        faq_items: input.faq_items ?? [],
        display_order: input.display_order ?? this.inMemoryServices.length + 1,
        created_by: actorId ?? null,
        updated_by: actorId ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Service;
      this.inMemoryServices.push(created);
      return created;
    }

    const { data, error } = await this.serviceClient
      .from("services")
      .insert({
        ...input,
        created_by: actorId ?? null,
        updated_by: actorId ?? null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", "Failed to create service.", {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Admin: Updates an existing service.
   */
  async updateService(
    id: string,
    input: UpdateServiceInput,
    actorId?: string
  ): Promise<Service> {
    if (!this.isConfigured) {
      const idx = this.inMemoryServices.findIndex((s) => s.id === id);
      if (idx === -1) {
        throw new AppError("NOT_FOUND", `Failed to update service ${id}.`, {
          status: 404,
        });
      }
      const existing = this.inMemoryServices[idx]!;
      const updated: Service = {
        ...existing,
        ...input,
        updated_by: actorId ?? null,
        updated_at: new Date().toISOString(),
      };
      this.inMemoryServices[idx] = updated;
      return updated;
    }

    const { data, error } = await this.serviceClient
      .from("services")
      .update({
        ...input,
        updated_by: actorId ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", `Failed to update service ${id}.`, {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Admin: Archives a service.
   */
  async archiveService(id: string, actorId?: string): Promise<Service> {
    return this.updateService(id, { status: "archived" }, actorId);
  }

  /**
   * Admin: Soft-deletes a service.
   */
  async deleteService(id: string, actorId?: string): Promise<void> {
    if (!this.isConfigured) {
      const idx = this.inMemoryServices.findIndex((s) => s.id === id);
      if (idx !== -1) {
        const existing = this.inMemoryServices[idx]!;
        this.inMemoryServices[idx] = {
          ...existing,
          deleted_at: new Date().toISOString(),
          updated_by: actorId ?? null,
        };
      }
      return;
    }

    const { error } = await this.serviceClient
      .from("services")
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: actorId ?? null,
      })
      .eq("id", id);

    if (error) {
      throw new AppError("INTERNAL_ERROR", `Failed to delete service ${id}.`, {
        status: 500,
        details: error.message,
      });
    }
  }
}

export const serviceRepository = new ServiceRepository();

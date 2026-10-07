import "server-only";
import { homeContentRepository, HomeContentRepository } from "../repositories/home-content.repository";
import { productRepository, ProductRepository } from "../repositories/product.repository";
import { serviceRepository, ServiceRepository } from "../repositories/service.repository";
import { portfolioRepository, PortfolioRepository } from "../repositories/portfolio.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { revalidationService } from "./revalidation.service";
import { ValidationError, AppError } from "@/lib/errors";
import type {
  HomeContent,
  Product,
  Service,
  PortfolioProject,
} from "@/types/domain";
import type { AdminSession } from "../auth/session";

export interface VerifiedEvidenceItem {
  tag: string;
  headline: string;
  description: string;
  provenance: string;
}

export const VERIFIED_ECOSYSTEM_EVIDENCE: VerifiedEvidenceItem[] = [
  {
    tag: "Integrity",
    headline: "ACID Isolation & Immutable Audit",
    description: "Every operational state transition across services and content management is verified through transaction isolation and append-only cryptographic logging.",
    provenance: "Architecture Spec v1.0 §3.2",
  },
  {
    tag: "Autonomy",
    headline: "Zero-Telemetry Operational Core",
    description: "HENU products and client infrastructure contain zero surveillance instrumentation, third-party analytics pixels, or external tracking dependencies.",
    provenance: "Security Architecture §5.1",
  },
  {
    tag: "Durability",
    headline: "Deterministic Offline Toolchains",
    description: "Foundational software layers operate independently of cloud infrastructure, supporting air-gapped deployment and sovereign self-hosting.",
    provenance: "Foundational Charter §2.4",
  },
];

export interface PublicHomeData {
  content: HomeContent;
  publishedProducts: Product[];
  flagshipProduct: Product | null;
  curatedServices: Service[];
  featuredProjects: PortfolioProject[];
  evidence: VerifiedEvidenceItem[];
}

export interface AdminHomeData {
  content: HomeContent;
  availableProducts: Product[];
  availableProjects: PortfolioProject[];
}

export class HomeService {
  private homeRepo: HomeContentRepository;
  private productRepo: ProductRepository;
  private serviceRepo: ServiceRepository;
  private portfolioRepo: PortfolioRepository;

  constructor(
    homeRepo?: HomeContentRepository,
    productRepo?: ProductRepository,
    serviceRepo?: ServiceRepository,
    portfolioRepo?: PortfolioRepository
  ) {
    this.homeRepo = homeRepo ?? homeContentRepository;
    this.productRepo = productRepo ?? productRepository;
    this.serviceRepo = serviceRepo ?? serviceRepository;
    this.portfolioRepo = portfolioRepo ?? portfolioRepository;
  }

  /**
   * Retrieves all verified data required for assembling the Public Home page.
   * Guarantees that only published entities are featured.
   */
  async getPublicHomeData(): Promise<PublicHomeData> {
    const [content, publishedProducts, publishedServices, allPublishedProjects] = await Promise.all([
      this.homeRepo.getHomeContent(),
      this.productRepo.listPublishedProducts(),
      this.serviceRepo.listPublishedServices(),
      this.portfolioRepo.listPublishedProjects(),
    ]);

    // Flagship: Find HENU OS, or fallback to first product
    const flagshipProduct =
      publishedProducts.find((p) => p.slug === "henu-os") ??
      publishedProducts[0] ??
      null;

    // Curated services (top 6 published services)
    const curatedServices = publishedServices.slice(0, 6);

    // Featured portfolio projects
    let featuredProjects: PortfolioProject[] = [];
    const featuredIds = Array.isArray(content.featured_project_ids)
      ? (content.featured_project_ids as string[])
      : [];

    if (featuredIds.length > 0) {
      // Filter published projects by configured IDs
      featuredProjects = allPublishedProjects.filter((p) => featuredIds.includes(p.id));
    }

    // Fallback: If no explicit IDs or configured ones were unpublished, take top 2 published projects
    if (featuredProjects.length === 0 && allPublishedProjects.length > 0) {
      featuredProjects = allPublishedProjects.slice(0, 2);
    }

    return {
      content,
      publishedProducts,
      flagshipProduct,
      curatedServices,
      featuredProjects,
      evidence: VERIFIED_ECOSYSTEM_EVIDENCE,
    };
  }

  /**
   * Retrieves Home configuration along with published options for Admin management.
   */
  async getAdminHomeData(admin: AdminSession): Promise<AdminHomeData> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required.", { status: 401 });
    }

    const [content, { products: allProducts }, { projects: allProjects }] = await Promise.all([
      this.homeRepo.getHomeContent(),
      this.productRepo.listAllProducts(),
      this.portfolioRepo.listAllProjects(),
    ]);

    return {
      content,
      availableProducts: allProducts.filter((p: Product) => p.status === "published"),
      availableProjects: allProjects.filter((p: PortfolioProject) => p.status === "published"),
    };
  }

  /**
   * Updates Home Content with Publish Gates enforcement (ADMIN-005, HOME-003).
   * Strict Rule: Cannot feature draft or unpublished products or projects.
   */
  async updateHomeContent(
    input: Partial<HomeContent>,
    admin: AdminSession
  ): Promise<HomeContent> {
    if (!admin || !admin.id || admin.profile?.role !== "admin") {
      throw new AppError("UNAUTHORIZED", "Admin authorization required.", { status: 401 });
    }

    // Validation 1: Required text slots
    if (input.hero_statement !== undefined && input.hero_statement.trim().length === 0) {
      throw new ValidationError("Hero statement is required.");
    }
    if (input.hero_supporting_line !== undefined && input.hero_supporting_line.trim().length === 0) {
      throw new ValidationError("Hero supporting line is required.");
    }
    if (input.flagship_summary !== undefined && input.flagship_summary.trim().length === 0) {
      throw new ValidationError("Flagship summary is required.");
    }
    if (input.services_intro !== undefined && input.services_intro.trim().length === 0) {
      throw new ValidationError("Services intro is required.");
    }
    if (input.about_teaser !== undefined && input.about_teaser.trim().length === 0) {
      throw new ValidationError("About teaser is required.");
    }

    // Validation 2: Publish Gate — Featured Products
    if (input.featured_product_ids && Array.isArray(input.featured_product_ids)) {
      const productIds = input.featured_product_ids as string[];
      if (productIds.length > 0) {
        const { products: allProducts } = await this.productRepo.listAllProducts();
        for (const id of productIds) {
          const product = allProducts.find((p) => p.id === id);
          if (!product) {
            throw new ValidationError(`Featured product ID "${id}" does not exist.`);
          }
          if (product.status !== "published") {
            throw new ValidationError(
              `Product "${product.name}" is currently in "${product.status}" status and cannot be featured publicly.`
            );
          }
        }
      }
    }

    // Validation 3: Publish Gate — Featured Projects
    if (input.featured_project_ids && Array.isArray(input.featured_project_ids)) {
      const projectIds = input.featured_project_ids as string[];
      if (projectIds.length > 0) {
        const { projects: allProjects } = await this.portfolioRepo.listAllProjects();
        for (const id of projectIds) {
          const project = allProjects.find((p: PortfolioProject) => p.id === id);
          if (!project) {
            throw new ValidationError(`Featured project ID "${id}" does not exist.`);
          }
          if (project.status !== "published") {
            throw new ValidationError(
              `Project "${project.title}" is currently in "${project.status}" status and cannot be featured publicly.`
            );
          }
        }
      }
    }

    const updated = await this.homeRepo.updateHomeContent(input as any, admin.id);

    await auditLogRepository.record({
      actor_id: admin.id,
      actor_email: admin.email,
      action: "HOME_CONTENT_UPDATE",
      entity_type: "home_content",
      entity_id: "default",
      summary: "Updated Home page dynamic slots and featured selections",
      metadata: {
        featured_product_ids: updated.featured_product_ids,
        featured_project_ids: updated.featured_project_ids,
      },
    });

    revalidationService.revalidate("home");
    return updated;
  }
}

export const homeService = new HomeService();

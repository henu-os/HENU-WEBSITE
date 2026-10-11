/**
 * Navigation Catalogue Configuration for Services Dropdown & Mega-Menu
 * Mirrors verified authentic categories & services from Document 04 §14 & service repository.
 */

export interface ServiceNavItem {
  slug: string;
  name: string;
  summary: string;
}

export interface ServiceCategoryNav {
  num: string;
  name: string;
  slug: string;
  services: ServiceNavItem[];
}

export const SERVICES_NAV_CATEGORIES: ServiceCategoryNav[] = [
  {
    num: "01",
    name: "Build",
    slug: "build",
    services: [
      {
        slug: "website-development",
        name: "Website Development",
        summary: "Type-safe, sub-second web architectures with zero bundle bloat.",
      },
      {
        slug: "mobile-app-development",
        name: "Mobile App Development",
        summary: "Fluid, native-grade iOS & Android applications with offline persistence.",
      },
      {
        slug: "software-solutions",
        name: "Software Solutions",
        summary: "Custom backend architectures, microservices, and sovereign workflow engines.",
      },
    ],
  },
  {
    num: "02",
    name: "Intelligence",
    slug: "intelligence",
    services: [
      {
        slug: "ai-automation",
        name: "AI Automation",
        summary: "Deterministic agent protocols, localized models & document intelligence pipelines.",
      },
    ],
  },
  {
    num: "03",
    name: "Brand & Growth",
    slug: "brand-and-growth",
    services: [
      {
        slug: "graphic-design",
        name: "Graphic Design",
        summary: "Dignified visual identities, typographic systems, and technical product collateral.",
      },
      {
        slug: "digital-marketing",
        name: "Digital Marketing",
        summary: "First-party technical SEO, privacy-compliant telemetry, and search discoverability.",
      },
    ],
  },
  {
    num: "04",
    name: "Foundations",
    slug: "business-foundations",
    services: [
      {
        slug: "documentation-and-startup-services",
        name: "Documentation & Startup",
        summary: "Audit-ready architectural specifications, PRDs, and technical diligence dossiers.",
      },
      {
        slug: "legal-services",
        name: "Legal Services",
        summary: "Corporate records coordination, IP tracking matrices, and compliance support.",
      },
      {
        slug: "funding-solutions",
        name: "Funding Solutions",
        summary: "Grant proposal architecture, financial model engineering, and capital readiness.",
      },
    ],
  },
];

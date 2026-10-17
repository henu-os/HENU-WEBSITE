/**
 * Quick Buy Catalogue Configuration
 * Unified purchasing inventory spanning all 9 authentic services and 4 flagship products.
 * Payment links can be directly updated here once generated.
 */

export interface QuickBuyItem {
  id: string;
  name: string;
  type: "service" | "product";
  category: "Build" | "Intelligence" | "Brand & Growth" | "Foundations" | "Core Computing";
  categoryCode: string;
  tagline: string;
  description: string;
  deliverables: string[];
  startingTier?: string;
  detailUrl: string;
  /**
   * Target payment gateway URL (e.g. Stripe, Razorpay, or payment link).
   * Leave as "#" or empty string until the live link is provided.
   */
  paymentLink?: string;
}

export const QUICK_BUY_CATALOGUE: QuickBuyItem[] = [
  // --- 4 PRODUCTS ---
  {
    id: "prod-henu-os",
    name: "HENU OS",
    type: "product",
    category: "Core Computing",
    categoryCode: "SYS-01",
    tagline: "Developer-Centric Sovereign Operating System",
    description: "Lean, deterministic operating system engineered for sub-millisecond task dispatch and sovereign local hardware control.",
    deliverables: [
      "Full OS ISO / binary images with verified cryptographic hashes",
      "Sovereign kernel architecture with zero third-party telemetry",
      "Direct hardware-level developer toolchain and documentation",
    ],
    startingTier: "Sovereign Tier",
    detailUrl: "/products/henu-os",
    paymentLink: "#",
  },
  {
    id: "prod-henu-ai",
    name: "HENU AI",
    type: "product",
    category: "Core Computing",
    categoryCode: "SYS-02",
    tagline: "Multimodal Foundation & Reasoning Platform",
    description: "Private foundation intelligence platform providing deterministic reasoning, schema-constrained generation, and local weights.",
    deliverables: [
      "On-premise / private cluster deployment configuration",
      "Structured JSON schema enforcement engine",
      "Full model weight access with verifiable audit logging",
    ],
    startingTier: "Enterprise Node",
    detailUrl: "/products/henu-ai",
    paymentLink: "#",
  },
  {
    id: "prod-henu-pa",
    name: "HENU PA",
    type: "product",
    category: "Core Computing",
    categoryCode: "SYS-03",
    tagline: "Voice-Powered Personal Assistant System",
    description: "Sub-50ms latency voice dialogue interface deeply integrated with system-level commands and sovereign encryption.",
    deliverables: [
      "Local audio streaming & voice dialogue runtime",
      "Full offline command synthesis engine",
      "Privacy-first biometric voice authentication module",
    ],
    startingTier: "Core License",
    detailUrl: "/products/henu-pa",
    paymentLink: "#",
  },
  {
    id: "prod-henu-ide",
    name: "HENU IDE",
    type: "product",
    category: "Core Computing",
    categoryCode: "SYS-04",
    tagline: "AI-Augmented Developer Environment",
    description: "High-performance systems programming IDE built for architectural clarity, AST reasoning, and automated verification harnesses.",
    deliverables: [
      "Full native IDE installer with integrated AST engine",
      "Automated code verification and boundary testing harnesses",
      "Multi-workspace configuration with zero cloud lock-in",
    ],
    startingTier: "Developer Seat",
    detailUrl: "/products/henu-ide",
    paymentLink: "#",
  },

  // --- 9 SERVICES ---
  {
    id: "srv-website-dev",
    name: "Website Development",
    type: "service",
    category: "Build",
    categoryCode: "01 // BUILD",
    tagline: "High-Performance Type-Safe Web Surfaces",
    description: "Lean Next.js server component web presences engineered for sub-second TTFB, 100/100 Core Web Vitals, and WCAG AA accessibility.",
    deliverables: [
      "Full production Next.js & TypeScript codebase with 100% IP ownership",
      "Integrated secure Admin Panel with automated audit logging",
      "Sub-second load times and production CI/CD deployment pipeline",
    ],
    startingTier: "Production Build",
    detailUrl: "/services/website-development",
    paymentLink: "#",
  },
  {
    id: "srv-mobile-app",
    name: "Mobile App Development",
    type: "service",
    category: "Build",
    categoryCode: "01 // BUILD",
    tagline: "Native-Grade iOS & Android Engineering",
    description: "Fluid 60fps cross-platform mobile clients engineered for resilient offline-first persistence and secure hardware telemetry.",
    deliverables: [
      "Unified iOS & Android audited source code repository",
      "Encrypted SQLite local persistence and background sync queues",
      "App Store & Google Play production submission packages",
    ],
    startingTier: "Mobile Sprint",
    detailUrl: "/services/mobile-app-development",
    paymentLink: "#",
  },
  {
    id: "srv-software-solutions",
    name: "Software Solutions",
    type: "service",
    category: "Build",
    categoryCode: "01 // BUILD",
    tagline: "Custom Enterprise Backend Architectures",
    description: "Sovereign backend microservices, distributed PostgreSQL databases, and enterprise automated workflows with zero licensing lock-in.",
    deliverables: [
      "Domain-driven custom backend architecture and relational schemas",
      "Dockerized sovereign deployment topologies with zero telemetry",
      "Comprehensive API documentation and cryptographic audit logs",
    ],
    startingTier: "Architecture Retainer",
    detailUrl: "/services/software-solutions",
    paymentLink: "#",
  },
  {
    id: "srv-ai-automation",
    name: "AI Automation",
    type: "service",
    category: "Intelligence",
    categoryCode: "02 // INTEL",
    tagline: "Deterministic Agent Protocols & Private Pipelines",
    description: "Private document extraction, task-aware model routing, and verification harnesses that automate complex business processes.",
    deliverables: [
      "End-to-end autonomous agent workflow orchestration",
      "Zero data leakage on-premise model execution setup",
      "Schema-enforced JSON validation harness with test suites",
    ],
    startingTier: "Pipeline Package",
    detailUrl: "/services/ai-automation",
    paymentLink: "#",
  },
  {
    id: "srv-graphic-design",
    name: "Graphic Design",
    type: "service",
    category: "Brand & Growth",
    categoryCode: "03 // BRAND",
    tagline: "Dignified Technical Brand Identities",
    description: "Architectural visual design systems, international typographic scale rules, and vector asset suites that convey technical authority.",
    deliverables: [
      "Complete SVG vector brand collateral and icon suites",
      "Tokenized color palettes and typographic design manual",
      "High-contrast accessible digital and print specification guides",
    ],
    startingTier: "Identity System",
    detailUrl: "/services/graphic-design",
    paymentLink: "#",
  },
  {
    id: "srv-digital-marketing",
    name: "Digital Marketing",
    type: "service",
    category: "Brand & Growth",
    categoryCode: "03 // BRAND",
    tagline: "Ethical Technical SEO & Audience Acquisition",
    description: "Data-informed audience acquisition, cookie-less first-party telemetry, and high-intent organic search discoverability engines.",
    deliverables: [
      "Exhaustive technical SEO code and markup architecture overhaul",
      "First-party privacy-compliant conversion tracking setup",
      "Compounding organic search content strategy dossier",
    ],
    startingTier: "Growth Sprint",
    detailUrl: "/services/digital-marketing",
    paymentLink: "#",
  },
];

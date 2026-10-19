export interface ServiceAdvantageItem {
  title: string;
  desc: string;
}

export interface ServiceImpactMetric {
  metric: string;
  label: string;
  desc: string;
}

export interface ServiceAdvantageProfile {
  headline: string;
  tagline: string;
  henuProvides: ServiceAdvantageItem[];
  commercialImpact: ServiceImpactMetric[];
  coreAdvantages: string[];
}

export const SERVICE_ADVANTAGES: Record<string, ServiceAdvantageProfile> = {
  "website-development": {
    headline: "Why Buy HENU Website Engineering",
    tagline: "Move away from bloated WordPress or brittle template builders to an enduring, edge-deployed digital surface.",
    henuProvides: [
      {
        title: "Clean Next.js 15 App Router Codebase",
        desc: "Strict TypeScript typing with zero client hydration tax and sub-25ms edge time-to-first-byte.",
      },
      {
        title: "Role-Restricted Administration Console",
        desc: "Integrated Admin Panel supporting draft previews, instant cache revalidation, and audit logging.",
      },
      {
        title: "100% Intellectual Property Deed",
        desc: "Full Git repository ownership, reproducible CI/CD pipelines, and semantic tokens with zero platform rent.",
      },
      {
        title: "Deterministic Accessibility & Technical SEO",
        desc: "Automated JSON-LD schemas, dynamic sitemaps, and WCAG 2.2 AA accessibility baked into the component tree.",
      },
    ],
    commercialImpact: [
      {
        metric: "0.38s",
        label: "Sub-Second Paint",
        desc: "Eliminates bounce rates caused by sluggish 3+ second page loads common in template sites.",
      },
      {
        metric: "+42%",
        label: "Organic Discovery Lift",
        desc: "Clean semantic markup and fast mobile indexing directly improve competitive search rankings.",
      },
      {
        metric: "$0",
        label: "Recurring Platform Tax",
        desc: "No $500+/mo SaaS builder subscriptions or brittle third-party plugin dependency updates.",
      },
      {
        metric: "5+ Years",
        label: "Architectural Lifespan",
        desc: "Engineered on modern web standards designed to endure without premature rebuilds.",
      },
    ],
    coreAdvantages: [
      "Zero client-side bundle bloat",
      "Full source code ownership transfer",
      "Sub-second global edge response",
      "Automated SEO & AEO discoverability",
    ],
  },
  "mobile-app-development": {
    headline: "Why Buy HENU Mobile Engineering",
    tagline: "Native-grade fluid execution engineered for mission-critical workflows with resilient offline persistence.",
    henuProvides: [
      {
        title: "Cross-Platform Unified Codebase",
        desc: "Single high-performance codebase targeting iOS and Android with platform-specific native bridge bindings.",
      },
      {
        title: "Offline-First SQLite Storage Engine",
        desc: "Local encrypted database with automatic background conflict resolution when connectivity recovers.",
      },
      {
        title: "Fluid 60fps UI Gesture Pipeline",
        desc: "Zero-lag touch handlers and hardware-accelerated animations running on native compositor threads.",
      },
      {
        title: "Biometric Hardware Enclave Security",
        desc: "Native FaceID, TouchID, and Android BiometricPrompt integrations with zero external telemetry.",
      },
    ],
    commercialImpact: [
      {
        metric: "60 FPS",
        label: "Locked Frame Rate",
        desc: "Smooth native interactions eliminating user drop-off from stutter and frame drops.",
      },
      {
        metric: "100%",
        label: "Offline Data Integrity",
        desc: "Users can complete full field workflows on airplanes or subway transit with zero data loss.",
      },
      {
        metric: "<1.2%",
        label: "Battery Overhead / Hr",
        desc: "Optimized background execution prevents rapid battery depletion that triggers app uninstalls.",
      },
      {
        metric: "Store-Ready",
        label: "App Store Compliance",
        desc: "Pre-configured deployment pipelines passing Apple App Store and Google Play reviews on first submission.",
      },
    ],
    coreAdvantages: [
      "Offline-first operational resilience",
      "Hardware-accelerated 60fps execution",
      "Zero third-party analytics telemetry",
      "Direct code ownership with zero SDK lock-in",
    ],
  },
  "software-solutions": {
    headline: "Why Buy HENU Sovereign Software",
    tagline: "Replace fragile third-party SaaS sprawl with custom, sovereign backend systems owned entirely by your enterprise.",
    henuProvides: [
      {
        title: "ACID-Conformant PostgreSQL Core",
        desc: "Strictly normalized relational schemas with immutable cryptographic audit logging for financial and operational records.",
      },
      {
        title: "Containerized Sovereign Topologies",
        desc: "Docker and Kubernetes manifests ready for self-hosted bare metal or private cloud with zero vendor lock-in.",
      },
      {
        title: "Granular Role-Based Access Control",
        desc: "Custom identity and permission gates enforcing least-privilege security boundaries across internal departments.",
      },
      {
        title: "High-Throughput Microservice Bus",
        desc: "Distributed event streaming and background job queues capable of handling tens of thousands of requests per second.",
      },
    ],
    commercialImpact: [
      {
        metric: "$30k+",
        label: "Annual SaaS Savings",
        desc: "Eliminates compounding per-user monthly subscription fees charged by generic enterprise tools.",
      },
      {
        metric: "100%",
        label: "Data Sovereignty",
        desc: "Zero multi-tenant risk. Your corporate intelligence and user transactions never sit in a shared database.",
      },
      {
        metric: "20k+",
        label: "Req/Sec Node Throughput",
        desc: "Engineered in compiled languages with connection pooling, ready for high-concurrency enterprise workloads.",
      },
      {
        metric: "Full IP",
        label: "Balance Sheet Asset",
        desc: "Software code is legally assigned to your company, transforming IT expenditure into proprietary equity.",
      },
    ],
    coreAdvantages: [
      "Elimination of recurring per-seat fees",
      "Total intellectual property ownership",
      "Self-hosted air-gapped deployment option",
      "Immutable cryptographic audit trails",
    ],
  },
  "ai-automation": {
    headline: "Why Buy HENU Deterministic AI",
    tagline: "Deploy reliable sovereign AI agent protocols that guarantee accuracy and protect proprietary trade secrets.",
    henuProvides: [
      {
        title: "Strict JSON Schema Enforcement",
        desc: "Guaranteed structured outputs validated at compile-time with automatic self-repair loops for malformed tokens.",
      },
      {
        title: "Air-Gapped Local Model Weights",
        desc: "Support for self-hosted open-weights models running on private hardware with zero outbound training telemetry.",
      },
      {
        title: "Localized Vector Knowledge Base",
        desc: "Private RAG pipelines indexing internal PDFs, spreadsheets, and databases with sub-50ms retrieval latency.",
      },
      {
        title: "Human-in-the-Loop Verification Gate",
        desc: "Automated audit logs and administrative override consoles before any sensitive system action is dispatched.",
      },
    ],
    commercialImpact: [
      {
        metric: "<0.01%",
        label: "Hallucination Risk",
        desc: "Deterministic schema validation rejects invalid LLM outputs before they touch production databases.",
      },
      {
        metric: "0%",
        label: "Data Retraining Exposure",
        desc: "Corporate intellectual property and client files are never used to train public commercial AI models.",
      },
      {
        metric: "10x",
        label: "Process Throughput",
        desc: "Automate complex document review, data synthesis, and workflow dispatch in seconds instead of manual hours.",
      },
      {
        metric: "Model Agnostic",
        label: "Zero Provider Lock-In",
        desc: "Swap underlying LLM providers (Anthropic, OpenAI, or local Llama) with a single environment flag.",
      },
    ],
    coreAdvantages: [
      "Deterministic schema validation guarantees",
      "Zero customer data leakage or model training",
      "Air-gapped private model deployment",
      "Human oversight audit logging",
    ],
  },
  "graphic-design": {
    headline: "Why Buy HENU Typographic Identity",
    tagline: "Build an enduring visual identity rooted in architectural dignity, typographic hierarchy, and permanent brand equity.",
    henuProvides: [
      {
        title: "Mathematical Typographic System",
        desc: "Golden-ratio baseline grid ($1.618$) and modular font pairings engineered for institutional seriousness.",
      },
      {
        title: "100% Vector Asset Suites",
        desc: "Resolution-independent SVG logomarks, technical iconography, and UI component assets ready for code integration.",
      },
      {
        title: "Tokenized Design System Specs",
        desc: "W3C-compliant semantic color palettes, spacing variables, and typographic tokens for instant engineering handoff.",
      },
      {
        title: "Comprehensive Brand Manual",
        desc: "Full PDF brand governance book specifying clear usage rules, minimum clear space, and forbidden applications.",
      },
    ],
    commercialImpact: [
      {
        metric: "21:1 AAA",
        label: "Contrast Compliance",
        desc: "Flawless legibility across digital screens and printed stationery meeting federal accessibility guidelines.",
      },
      {
        metric: "Zero Churn",
        label: "Trend Resistance",
        desc: "Timeless international style avoids superficial visual tropes that age out and require rebranding in 12 months.",
      },
      {
        metric: "100% SVG",
        label: "Crisp Infinite Scaling",
        desc: "Looks equally flawless on a 16px mobile browser favicon as on a 20-foot outdoor billboard.",
      },
      {
        metric: "Instant",
        label: "Developer Handoff",
        desc: "Assets pre-tokenized for Tailwind CSS and React components, reducing engineering turnaround by 60%.",
      },
    ],
    coreAdvantages: [
      "Timeless typographic architecture",
      "Complete vector SVG master files",
      "Semantic design token export",
      "100% full commercial copyright assignment",
    ],
  },
  "digital-marketing": {
    headline: "Why Buy HENU Technical Growth",
    tagline: "Compound high-intent corporate customer acquisition through first-party technical SEO and zero-surveillance discovery.",
    henuProvides: [
      {
        title: "First-Party Technical SEO Architecture",
        desc: "Complete JSON-LD entity linking, clean URL hierarchies, and sub-200ms page response times favored by search algorithms.",
      },
      {
        title: "Automated Schema & Sitemap Pipelines",
        desc: "Continuous XML sitemap synchronization and structured rich-result markup on every published surface.",
      },
      {
        title: "Privacy-Compliant Analytics Bus",
        desc: "Cookieless first-party event tracking measuring genuine business conversions with zero third-party tracking pixels.",
      },
      {
        title: "Search Intent Keyword Matrix",
        desc: "Strategic mapping of high-conversion corporate keywords targeting ready-to-buy enterprise decision-makers.",
      },
    ],
    commercialImpact: [
      {
        metric: "99.8%",
        label: "Crawl Indexation Ratio",
        desc: "Search engine bots discover and index fresh architectural pages without orphan-page crawl waste.",
      },
      {
        metric: "$0",
        label: "Recurring Ad-Spend Waste",
        desc: "Grow durable organic inbound pipelines instead of constantly competing in predatory PPC bidding auctions.",
      },
      {
        metric: "100%",
        label: "GDPR / CCPA Compliant",
        desc: "Never risk regulatory fines or annoy visitors with intrusive cookie-consent banners.",
      },
      {
        metric: "Compounding",
        label: "Asset Equity",
        desc: "Every published technical case brief continues attracting prospective buyers for years into the future.",
      },
    ],
    coreAdvantages: [
      "First-party search indexation superiority",
      "Zero-surveillance cookie-free analytics",
      "Compounding long-term organic traffic",
      "Full ownership of telemetry and conversion data",
    ],
  },
};

export function getServiceAdvantage(slug: string, fallbackName = "Service"): ServiceAdvantageProfile {
  if (SERVICE_ADVANTAGES[slug]) {
    return SERVICE_ADVANTAGES[slug];
  }

  return {
    headline: `Why Invest in HENU ${fallbackName}`,
    tagline: "Engineered under strict architectural boundaries, total IP ownership, and zero recurring platform tax.",
    henuProvides: [
      {
        title: "Complete Production Codebase",
        desc: "Full Git repository ownership with clean architecture, strict schemas, and zero third-party telemetry.",
      },
      {
        title: "Automated Deployment Pipeline",
        desc: "Reproducible CI/CD configurations, containerization, and zero-downtime release procedures.",
      },
      {
        title: "Dedicated Administration Interface",
        desc: "Secure role-restricted control surface for operational updates and real-time cache invalidation.",
      },
      {
        title: "100% Commercial IP Assignment",
        desc: "All source code, schemas, and design tokens become your organization's sovereign intellectual property.",
      },
    ],
    commercialImpact: [
      {
        metric: "$0",
        label: "SaaS Tax",
        desc: "No recurring seat licensing fees or platform lock-in fees.",
      },
      {
        metric: "100%",
        label: "IP Sovereignty",
        desc: "Complete legal copyright and code ownership transferred to your balance sheet.",
      },
      {
        metric: "Sub-Second",
        label: "Runtime SLA",
        desc: "High-performance execution optimized for conversion velocity and user retention.",
      },
      {
        metric: "5+ Years",
        label: "Durability",
        desc: "Built on resilient, type-safe foundations designed to eliminate rewrite cycles.",
      },
    ],
    coreAdvantages: [
      "100% intellectual property transfer",
      "Zero third-party vendor lock-in",
      "Strict type safety and schema validation",
      "Direct engineering engagement",
    ],
  };
}

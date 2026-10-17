import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { productService } from "@/server/services/product.service";
import { portfolioService } from "@/server/services/portfolio.service";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { EcosystemModel } from "@/components/features/ecosystem/ecosystem-model";
import { AmbientLivingMesh } from "@/components/ui/ambient-living-mesh";
import { ComputingLabVisualizer } from "@/components/features/products/computing-lab-visualizer";
import { ProductsHeroHeadline } from "@/components/features/products/products-hero-headline";
import { ProductSchematicGlyph } from "@/components/features/products/product-schematic-glyph";
import { AnimatedProductVisual } from "@/components/features/products/animated-product-visual";
import { ClassyArchitecturalVisual } from "@/components/features/products/classy-architectural-case-study-visual";
import type { Product, ProductStatusLabel } from "@/types/domain";

export const metadata: Metadata = {
  title: "Ecosystem & Products — HENU",
  description:
    "Explore the interconnected HENU computing ecosystem: HENU OS, HENU AI, HENU PA, and HENU IDE.",
  alternates: {
    canonical: "/products",
  },
};

function formatStatus(status: ProductStatusLabel): {
  label: string;
  variant: "default" | "primary" | "warning" | "success";
} {
  switch (status) {
    case "available":
      return { label: "Available", variant: "success" };
    case "beta":
      return { label: "Beta", variant: "primary" };
    case "in_development":
      return { label: "In Development", variant: "warning" };
    case "coming_soon":
      return { label: "Coming Soon", variant: "default" };
    default:
      return { label: status, variant: "default" };
  }
}

export default async function ProductsHubPage() {
  const [products, rawPortfolioProjects] = await Promise.all([
    productService.getPublishedProducts(),
    portfolioService.getPublishedProjects("all").catch(() => []),
  ]);

  // Deduplicate portfolio projects by slug so each case study is unique
  const portfolioProjects = Array.from(
    new Map(rawPortfolioProjects.map((p) => [p.slug, p])).values()
  );

  const flagshipOs = products.find((p) => p.slug === "henu-os");
  const henuAi = products.find((p) => p.slug === "henu-ai");
  const henuPa = products.find((p) => p.slug === "henu-pa");
  const henuIde = products.find((p) => p.slug === "henu-ide");

  // Any additional published products dynamically rendered (PROD-001)
  const additionalProducts = products.filter(
    (p) => !["henu-os", "henu-ai", "henu-pa", "henu-ide"].includes(p.slug)
  );

  return (
    <div className="w-full relative">
      {/* 1. HERO WITH AMBIENT MESH & INTERACTIVE LAB VISUALIZER */}
      <header className="relative pt-12 pb-8 sm:pb-12 lg:pt-16 lg:pb-12 border-b border-border-default bg-surface-primary overflow-hidden">
        {/* Living Ambient Cursor Mesh */}
        <AmbientLivingMesh variant="pine" />

        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Authoritative Editorial Typography & Indicators */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                  Ecosystem Architecture // Active Kernel
                </span>
              </div>

              {/* Interactive Hero Headline with Iris/Violet Accent & Hover Flip */}
              <ProductsHeroHeadline />

              <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-sans max-w-2xl">
                A cohesive, dignified computing platform engineered for builders. Operating systems,
                foundation intelligence, voice dialogue agents, and developer environments built to work as
                one sovereign system.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
                <span className="flex items-center gap-1.5 text-ink-primary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {products.length} Ecosystem Nodes Published
                </span>
                <span aria-hidden="true">&bull;</span>
                <span>Zero Forced Telemetry</span>
                <span aria-hidden="true">&bull;</span>
                <span>Deterministic Toolchains</span>
              </div>
            </div>

            {/* Right Column: Interactive Computing Node Lab Visualizer */}
            <div className="lg:col-span-5">
              <ComputingLabVisualizer products={products} />
            </div>
          </div>
        </Container>
      </header>

      {/* 2. ECOSYSTEM MODEL (HOME-002) */}
      <Section id="ecosystem" spacing="md" className="border-b border-border-default bg-surface-secondary/20">
        <Container size="lg">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Layer Topology
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
              Interconnected System Layers
            </h2>
            <p className="text-sm text-ink-secondary">
              Select any tier below to inspect its role, architectural boundaries, and direct
              inter-process connections.
            </p>
          </div>

          <EcosystemModel products={products} />
        </Container>
      </Section>

      {/* 3. FLAGSHIP PRESENTATION: HENU OS (Liquid Cyber Cyan & Titanium Slate) */}
      {flagshipOs && (
        <Section spacing="md" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="p-8 sm:p-10 lg:p-12 rounded-3xl border-2 border-cyan-500/35 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white hover:border-cyan-400/60 hover:shadow-[0_24px_64px_-16px_rgba(6,182,212,0.25)] transition-all duration-300 relative overflow-hidden group">
              {/* Subtle Ambient Radial Light */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                        Flagship Platform
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-cyan-500/30 bg-slate-900/80 text-cyan-200">
                        {formatStatus(flagshipOs.status_label as ProductStatusLabel).label}
                      </span>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-400">
                        Tier 0 // OS Foundation
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white group-hover:text-cyan-300 transition-colors pt-1 font-normal tracking-tight">
                      {flagshipOs.name}
                    </h2>
                  </div>

                  <p className="font-sans text-lg text-cyan-100/90 font-medium">
                    {flagshipOs.tagline}
                  </p>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                    {flagshipOs.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-cyan-500/25 bg-slate-900/70 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="font-mono text-xs text-cyan-300 font-semibold">Wayland-Native Shell</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">High-DPI tiling compositor engineered for low latency & frame-perfect workflows.</p>
                    </div>
                    <div className="p-4 rounded-xl border border-cyan-500/25 bg-slate-900/70 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="font-mono text-xs text-cyan-300 font-semibold">IPC Agent Sockets</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">Native local socket connection to HENU AI & PA models with zero cloud egress.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <LinkButton
                      href={`/products/${flagshipOs.slug}`}
                      variant="primary"
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.4)] border-0"
                    >
                      Explore Flagship OS &rarr;
                    </LinkButton>
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Status: Active Engineering Validation
                    </span>
                  </div>
                </div>

                {/* Animated Compositor HUD Motion Visual */}
                <div className="lg:col-span-5">
                  <AnimatedProductVisual slug="henu-os" />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. ASYMMETRIC DISTINCT PRESENTATIONS FOR PEER PRODUCTS */}
      <Section spacing="md" className="border-b border-border-default bg-surface-secondary/20">
        <Container size="lg">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Specialized Systems
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
              Intelligence, Interaction & Synthesis
            </h2>
            <p className="text-sm text-ink-secondary">
              Each product fulfills a specialized architectural tier with dedicated interfaces.
            </p>
          </div>

          <div className="space-y-12">
            {/* HENU AI — Capabilities Presentation */}
            {henuAi && (
              <div className="p-8 sm:p-10 rounded-2xl border-2 border-indigo-500/30 dark:border-indigo-400/30 bg-surface-primary hover:border-indigo-500/60 hover:shadow-[0_16px_48px_-12px_rgba(99,102,241,0.2)] transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 font-semibold">
                          Tier 1 // Reasoning Platform
                        </span>
                        <Badge variant={formatStatus(henuAi.status_label as ProductStatusLabel).variant} size="sm">
                          {formatStatus(henuAi.status_label as ProductStatusLabel).label}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pt-1">
                        {henuAi.name}
                      </h3>
                    </div>

                    <p className="font-sans text-base text-ink-secondary">
                      {henuAi.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuAi.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuAi.slug}`} variant="outline" size="md" className="group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
                        Explore Reasoning Matrix &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <AnimatedProductVisual slug="henu-ai" />
                  </div>
                </div>
              </div>
            )}

            {/* HENU PA — Conversation Presentation */}
            {henuPa && (
              <div className="p-8 sm:p-10 rounded-2xl border-2 border-amber-500/30 dark:border-amber-400/30 bg-surface-primary hover:border-amber-500/60 hover:shadow-[0_16px_48px_-12px_rgba(245,158,11,0.2)] transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold">
                          Tier 2 // Personal Assistant
                        </span>
                        <Badge variant={formatStatus(henuPa.status_label as ProductStatusLabel).variant} size="sm">
                          {formatStatus(henuPa.status_label as ProductStatusLabel).label}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors pt-1">
                        {henuPa.name}
                      </h3>
                    </div>

                    <p className="font-sans text-base text-ink-secondary">
                      {henuPa.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuPa.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuPa.slug}`} variant="outline" size="md" className="group-hover:border-amber-500/50 group-hover:bg-amber-500/5 transition-all">
                        Inspect Dialogue Protocol &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <AnimatedProductVisual slug="henu-pa" />
                  </div>
                </div>
              </div>
            )}

            {/* HENU IDE — Workflow Presentation */}
            {henuIde && (
              <div className="p-8 sm:p-10 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-400/30 bg-surface-primary hover:border-emerald-500/60 hover:shadow-[0_16px_48px_-12px_rgba(16,185,129,0.2)] transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold">
                          Tier 3 // Engineering Toolchain
                        </span>
                        <Badge variant={formatStatus(henuIde.status_label as ProductStatusLabel).variant} size="sm">
                          {formatStatus(henuIde.status_label as ProductStatusLabel).label}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-1">
                        {henuIde.name}
                      </h3>
                    </div>

                    <p className="font-sans text-base text-ink-secondary">
                      {henuIde.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuIde.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuIde.slug}`} variant="outline" size="md" className="group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 transition-all">
                        Review Engineering Workflow &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <AnimatedProductVisual slug="henu-ide" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. DYNAMIC EXTENSION: ADDITIONAL PUBLISHED PRODUCTS */}
      {additionalProducts.length > 0 && (
        <Section spacing="md" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="max-w-3xl mb-8 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Ecosystem Expansion
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                Additional Ecosystem Nodes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-6 rounded-lg border border-border-default bg-surface-secondary/30 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm">
                        {prod.hue_key.toUpperCase()}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {prod.status_label}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-xl text-ink-primary">{prod.name}</h3>
                    <p className="text-xs text-ink-muted">{prod.tagline}</p>
                    <p className="text-sm text-ink-secondary line-clamp-3">{prod.summary}</p>
                  </div>

                  <LinkButton href={`/products/${prod.slug}`} variant="outline" size="sm">
                    View Details &rarr;
                  </LinkButton>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. DEPLOYED SYSTEMS & CASE STUDIES (PORTFOLIO INTEGRATION) */}
      {portfolioProjects.length > 0 && (
        <Section id="deployed-solutions" spacing="md" className="border-t border-border-default bg-surface-secondary/20">
          <Container size="lg">
            <div className="max-w-3xl mb-10 space-y-3">
              <div className="inline-flex items-center gap-2">
                <Badge variant="primary">Verified Deployments</Badge>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Case Studies & Proven Architectures
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
                Deployed Solutions & Case Studies
              </h2>
              <p className="font-sans text-base text-ink-secondary leading-relaxed">
                Production computing platforms, automated reasoning engines, and custom enterprise software built and actively deployed by HENU across sovereign infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {portfolioProjects.map((project, idx) => {
                const projectMetrics = Array.isArray(project.metrics) ? (project.metrics as any[]) : [];
                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-border-default bg-surface-primary hover:border-ink-primary/40 p-5 sm:p-6 shadow-subtle hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 group overflow-hidden"
                  >
                    {/* Classy Architectural Kinetic Drawing (Light, Non-Glowy Editorial Graphic) */}
                    <ClassyArchitecturalVisual
                      slug={project.slug}
                      categorySlug={project.category_slug || ""}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border-default bg-surface-secondary/70 text-ink-secondary">
                          {String(idx + 1).padStart(2, "0")} // {project.category_slug?.replace(/-/g, " ") || "Enterprise System"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-secondary font-medium px-2 py-0.5 rounded border border-border-default/80 bg-surface-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Verified
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl text-ink-primary font-normal group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>

                      <p className="font-sans text-xs text-ink-secondary leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Clean Editorial Metric Tile */}
                      {projectMetrics.length > 0 && (
                        <div className="pt-1">
                          <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border-default/80 font-mono text-xs flex items-center justify-between group-hover:border-ink-primary/20 transition-colors">
                            <div>
                              <span className="text-[10px] text-ink-muted uppercase tracking-wider block">
                                {projectMetrics[0]?.label}
                              </span>
                              <span className="font-serif text-ink-primary text-base pt-0.5 block font-medium">
                                {projectMetrics[0]?.value}
                              </span>
                            </div>
                            <span className="text-xs text-ink-muted font-mono">&#8594;</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border-default/70">
                      <LinkButton
                        href={`/portfolio/${project.slug}`}
                        variant="outline"
                        size="sm"
                        className="w-full justify-center group-hover:bg-ink-primary group-hover:text-surface-primary group-hover:border-ink-primary transition-all duration-200"
                      >
                        Read Architectural Case Study &rarr;
                      </LinkButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* 7. ETHICAL / TECHNICAL INTEGRITY NOTICE */}
      <Section spacing="none" className="py-8 sm:py-10 border-t border-border-default bg-surface-secondary/40">
        <Container size="lg">
          <div className="mx-auto max-w-2xl flex flex-col items-center text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary bg-surface-primary px-3 py-1 rounded-full border border-border-default shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-muted" />
              Technical Integrity Commitment
            </span>
            <p className="text-xs text-ink-muted leading-relaxed font-sans">
              HENU adheres strictly to factual product documentation (Document 01 §1). All products in
              active development undergo systematic architecture verification before public release.
              Unpublished or draft capabilities are sequestered until verified.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

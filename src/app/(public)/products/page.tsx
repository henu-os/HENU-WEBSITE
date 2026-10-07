import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { productService } from "@/server/services/product.service";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { EcosystemModel } from "@/components/features/ecosystem/ecosystem-model";
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
  const products = await productService.getPublishedProducts();

  const flagshipOs = products.find((p) => p.slug === "henu-os");
  const henuAi = products.find((p) => p.slug === "henu-ai");
  const henuPa = products.find((p) => p.slug === "henu-pa");
  const henuIde = products.find((p) => p.slug === "henu-ide");

  // Any additional published products dynamically rendered (PROD-001)
  const additionalProducts = products.filter(
    (p) => !["henu-os", "henu-ai", "henu-pa", "henu-ide"].includes(p.slug)
  );

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <header className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border-default bg-surface-primary overflow-hidden">
        <Container size="lg">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Ecosystem Architecture // V1
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-ink-primary">
              The HENU Computing Ecosystem
            </h1>

            <p className="font-sans text-lg sm:text-xl text-ink-secondary leading-relaxed">
              A cohesive, dignified computing platform engineered for builders. Operating systems,
              foundation intelligence, voice dialogue agents, and developer environments built to work as
              one sovereign system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-ink-muted">
              <span>{products.length} Ecosystem Nodes Published</span>
              <span aria-hidden="true">&bull;</span>
              <span>Zero Forced Telemetry</span>
              <span aria-hidden="true">&bull;</span>
              <span>Deterministic Toolchains</span>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. ECOSYSTEM MODEL (HOME-002) */}
      <Section id="ecosystem" spacing="lg" className="border-b border-border-default bg-surface-secondary/20">
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

      {/* 3. FLAGSHIP PRESENTATION: HENU OS */}
      {flagshipOs && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="p-8 sm:p-10 lg:p-12 rounded-xl border-2 border-[#0e443b]/40 dark:border-[#9dd1c4]/40 bg-surface-secondary/30 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-primary text-primary-on">
                      Flagship Platform
                    </span>
                    <Badge variant={formatStatus(flagshipOs.status_label as ProductStatusLabel).variant} size="md">
                      {formatStatus(flagshipOs.status_label as ProductStatusLabel).label}
                    </Badge>
                    <span className="font-mono text-xs text-ink-muted">Tier 0 // OS Foundation</span>
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary">
                      {flagshipOs.name}
                    </h2>
                    <p className="font-sans text-lg text-ink-secondary mt-2">
                      {flagshipOs.tagline}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
                    {flagshipOs.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded border border-border-default bg-surface-primary/70 space-y-1">
                      <span className="font-mono text-xs text-primary font-medium">Wayland-Native Shell</span>
                      <p className="text-xs text-ink-muted">High-DPI tiling compositor engineered for low latency.</p>
                    </div>
                    <div className="p-3.5 rounded border border-border-default bg-surface-primary/70 space-y-1">
                      <span className="font-mono text-xs text-primary font-medium">IPC Agent Sockets</span>
                      <p className="text-xs text-ink-muted">Native local socket connection to HENU AI & PA models.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <LinkButton href={`/products/${flagshipOs.slug}`} variant="primary" size="lg">
                      Explore Flagship OS &rarr;
                    </LinkButton>
                    <span className="font-mono text-xs text-ink-muted">
                      Status: Active Engineering Validation
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-5 rounded-lg border border-border-default bg-surface-container-lowest font-mono text-xs text-ink-primary shadow-elevated space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border-default text-ink-muted text-[11px]">
                      <span>henu-kernel-builder // status</span>
                      <span>deterministic</span>
                    </div>
                    <div className="space-y-1 text-ink-secondary">
                      <p><span className="text-primary font-semibold">$</span> henu-ctl env verify</p>
                      <p className="text-status-success">&#10003; Kernel isolation: active</p>
                      <p className="text-status-success">&#10003; Telemetry daemons: disabled [0 present]</p>
                      <p className="text-status-success">&#10003; Local socket IPC: /run/henu/agent.sock ready</p>
                      <p className="text-ink-muted">&#8594; Ready for deterministic developer workflows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. ASYMMETRIC DISTINCT PRESENTATIONS FOR PEER PRODUCTS */}
      <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/20">
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
              <div className="p-8 sm:p-10 rounded-xl border border-[#3f209e]/30 dark:border-[#cbbeff]/30 bg-surface-primary shadow-subtle">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#3f209e] dark:text-[#cbbeff] font-semibold">
                        Tier 1 // Reasoning Platform
                      </span>
                      <Badge variant={formatStatus(henuAi.status_label as ProductStatusLabel).variant} size="sm">
                        {formatStatus(henuAi.status_label as ProductStatusLabel).label}
                      </Badge>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                      {henuAi.name}
                    </h3>
                    <p className="font-sans text-base text-ink-secondary">
                      {henuAi.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuAi.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuAi.slug}`} variant="outline" size="md">
                        Explore Reasoning Matrix &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 rounded-lg border border-border-default bg-surface-secondary/50 font-mono text-xs space-y-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-[#3f209e] dark:text-[#cbbeff] font-semibold">
                      Reasoning Architecture
                    </div>
                    <div className="text-ink-secondary space-y-1 text-[11px]">
                      <div>&bull; Multi-model task routing</div>
                      <div>&bull; Long-range architectural context</div>
                      <div>&bull; Sovereign on-premise execution</div>
                      <div>&bull; Zero data exfiltration to third parties</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HENU PA — Conversation Presentation */}
            {henuPa && (
              <div className="p-8 sm:p-10 rounded-xl border border-[#a0401c]/30 dark:border-[#ffb59c]/30 bg-surface-primary shadow-subtle">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#a0401c] dark:text-[#ffb59c] font-semibold">
                        Tier 2 // Personal Assistant
                      </span>
                      <Badge variant={formatStatus(henuPa.status_label as ProductStatusLabel).variant} size="sm">
                        {formatStatus(henuPa.status_label as ProductStatusLabel).label}
                      </Badge>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                      {henuPa.name}
                    </h3>
                    <p className="font-sans text-base text-ink-secondary">
                      {henuPa.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuPa.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuPa.slug}`} variant="outline" size="md">
                        Inspect Dialogue Protocol &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 rounded-lg border border-border-default bg-surface-secondary/50 font-sans text-xs space-y-2.5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#a0401c] dark:text-[#ffb59c] font-semibold">
                      Conversational Interface Excerpt
                    </div>
                    <div className="p-3 bg-surface-primary rounded border border-border-default text-ink-secondary text-xs italic">
                      &ldquo;Analyzing recent test execution: 12 tests passed, 0 failures. Workspace state is clean.&rdquo;
                    </div>
                    <span className="block font-mono text-[10px] text-ink-muted">
                      [Note: Illustrative dialogue scenario. No autoplay audio.]
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* HENU IDE — Workflow Presentation */}
            {henuIde && (
              <div className="p-8 sm:p-10 rounded-xl border border-[#1b5e20]/30 dark:border-[#81c784]/30 bg-surface-primary shadow-subtle">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#1b5e20] dark:text-[#81c784] font-semibold">
                        Tier 3 // Engineering Toolchain
                      </span>
                      <Badge variant={formatStatus(henuIde.status_label as ProductStatusLabel).variant} size="sm">
                        {formatStatus(henuIde.status_label as ProductStatusLabel).label}
                      </Badge>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                      {henuIde.name}
                    </h3>
                    <p className="font-sans text-base text-ink-secondary">
                      {henuIde.tagline}
                    </p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {henuIde.summary}
                    </p>

                    <div className="pt-2">
                      <LinkButton href={`/products/${henuIde.slug}`} variant="outline" size="md">
                        Review Engineering Workflow &rarr;
                      </LinkButton>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 rounded-lg border border-border-default bg-surface-secondary/50 font-mono text-xs space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-[#1b5e20] dark:text-[#81c784] font-semibold">
                      Synthesis Pipeline
                    </div>
                    <div className="space-y-1.5 text-ink-secondary text-[11px]">
                      <div>01 // Real-time AST Ingestion</div>
                      <div>02 // Architecture Reasoning & Constraints</div>
                      <div>03 // Automated Verification Harness</div>
                      <div>04 // Deterministic Target Artifacts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. DYNAMIC EXTENSION: ADDITIONAL PUBLISHED PRODUCTS */}
      {additionalProducts.length > 0 && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
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

      {/* 6. ETHICAL / TECHNICAL INTEGRITY NOTICE */}
      <Section spacing="md" className="bg-surface-primary">
        <Container size="lg">
          <div className="p-6 rounded-lg border border-border-default bg-surface-secondary/30 text-xs text-ink-muted space-y-2">
            <span className="font-mono uppercase tracking-wider text-ink-secondary font-medium">
              Technical Integrity Commitment
            </span>
            <p>
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

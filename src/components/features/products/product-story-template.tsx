import React from "react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { ContentBlockRenderer } from "@/components/features/content-blocks/block-renderer";
import { OSEnvironmentModule } from "./signature-modules/os-environment-module";
import { AICapabilitiesModule } from "./signature-modules/ai-capabilities-module";
import { PAConversationModule } from "./signature-modules/pa-conversation-module";
import { IDEWorkflowModule } from "./signature-modules/ide-workflow-module";
import type { Product, ProductHueKey, ProductStatusLabel } from "@/types/domain";
import type { ContentBlock } from "@/types/blocks";

interface ProductStoryTemplateProps {
  product: Product;
  otherProducts?: Product[];
}

const HUE_CONFIG: Record<
  ProductHueKey,
  {
    accentBorder: string;
    accentBg: string;
    accentText: string;
    glow: string;
    tierBadge: string;
    tierLabel: string;
  }
> = {
  os: {
    accentBorder: "border-[#0e443b]/40 dark:border-[#9dd1c4]/40",
    accentBg: "bg-[#0e443b]/5 dark:bg-[#9dd1c4]/10",
    accentText: "text-[#0e443b] dark:text-[#9dd1c4]",
    glow: "rgba(14, 68, 59, 0.08)",
    tierBadge: "Tier 0 // Flagship Foundation",
    tierLabel: "Ground Layer Computing",
  },
  ai: {
    accentBorder: "border-[#3f209e]/40 dark:border-[#cbbeff]/40",
    accentBg: "bg-[#3f209e]/5 dark:bg-[#cbbeff]/10",
    accentText: "text-[#3f209e] dark:text-[#cbbeff]",
    glow: "rgba(63, 32, 158, 0.08)",
    tierBadge: "Tier 1 // Intelligence Engine",
    tierLabel: "Foundation Reasoning Layer",
  },
  pa: {
    accentBorder: "border-[#a0401c]/40 dark:border-[#ffb59c]/40",
    accentBg: "bg-[#a0401c]/5 dark:bg-[#ffb59c]/10",
    accentText: "text-[#a0401c] dark:text-[#ffb59c]",
    glow: "rgba(160, 64, 28, 0.08)",
    tierBadge: "Tier 2 // Personal Assistant",
    tierLabel: "Conversational Interface",
  },
  ide: {
    accentBorder: "border-[#1b5e20]/40 dark:border-[#81c784]/40",
    accentBg: "bg-[#1b5e20]/5 dark:bg-[#81c784]/10",
    accentText: "text-[#1b5e20] dark:text-[#81c784]",
    glow: "rgba(27, 94, 32, 0.08)",
    tierBadge: "Tier 3 // Engineering Toolchain",
    tierLabel: "Developer Synthesis Suite",
  },
};

function formatStatus(status: ProductStatusLabel): { label: string; variant: "default" | "primary" | "warning" | "success" } {
  switch (status) {
    case "available":
      return { label: "Publicly Available", variant: "success" };
    case "beta":
      return { label: "Beta Testing", variant: "primary" };
    case "in_development":
      return { label: "Active Development", variant: "warning" };
    case "coming_soon":
      return { label: "Coming Soon", variant: "default" };
    default:
      return { label: status, variant: "default" };
  }
}

export const ProductStoryTemplate: React.FC<ProductStoryTemplateProps> = ({
  product,
  otherProducts = [],
}) => {
  const isFlagship = product.slug === "henu-os";
  const hueKey = (product.hue_key as ProductHueKey) || "os";
  const hue = HUE_CONFIG[hueKey] || HUE_CONFIG.os;
  const statusInfo = formatStatus(product.status_label as ProductStatusLabel);

  // Cast JSON blocks if valid
  const narrativeBlocks = Array.isArray(product.description_blocks)
    ? (product.description_blocks as unknown as ContentBlock[])
    : null;

  const capabilities = Array.isArray(product.capabilities)
    ? (product.capabilities as Array<{ title?: string; description?: string }>)
    : null;

  return (
    <article
      className="w-full relative"
      data-product-slug={product.slug}
      data-product-hue={hueKey}
    >
      {/* 1. PRODUCT HEAD */}
      <header
        className={`relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border-default overflow-hidden ${
          isFlagship ? "bg-surface-secondary/40" : ""
        }`}
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 0%, ${hue.glow} 0%, transparent 70%)`,
        }}
      >
        <Container size="lg">
          <nav aria-label="Breadcrumbs" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-mono text-ink-muted">
              <li>
                <Link
                  href="/"
                  className="hover:text-ink-primary transition-colors focus-visible:outline-focus-ring"
                >
                  HENU
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-ink-primary transition-colors focus-visible:outline-focus-ring"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-primary font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={statusInfo.variant} size="md">
                {statusInfo.label}
              </Badge>
              <Badge variant="outline" size="md">
                {hue.tierBadge}
              </Badge>
              {isFlagship && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider bg-primary text-primary-on rounded">
                  Flagship Platform
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink-primary">
              {product.name}
            </h1>

            <p className="font-sans text-xl sm:text-2xl text-ink-secondary leading-snug font-normal">
              {product.tagline}
            </p>

            {product.summary && (
              <p className="font-sans text-base sm:text-lg text-ink-secondary/90 max-w-3xl leading-relaxed">
                {product.summary}
              </p>
            )}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <LinkButton
                href={product.primary_cta_target || "/products"}
                variant="primary"
                size="lg"
                id={`cta-product-${product.slug}`}
              >
                {product.primary_cta_type === "explore"
                  ? "Explore Architecture"
                  : product.primary_cta_type === "waitlist"
                  ? "Join Updates"
                  : product.primary_cta_type === "download"
                  ? "Download Release"
                  : "View Ecosystem"}
              </LinkButton>

              <LinkButton href="/products" variant="outline" size="lg">
                View All Ecosystem Products
              </LinkButton>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. WHY IT EXISTS / ARCHITECTURAL PURPOSE */}
      {narrativeBlocks && narrativeBlocks.length > 0 && (
        <Section spacing="lg" className="border-b border-border-default">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    Architectural Intent
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                    Why {product.name} Exists
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Designed to fulfill a specific sovereign role within the HENU computing stack.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <ContentBlockRenderer blocks={narrativeBlocks} />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 3. SIGNATURE EXPERIENCE MODULE */}
      <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/20">
        <Container size="lg">
          <div className="mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Interactive System Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
              Experience {product.name}
            </h2>
          </div>

          {product.template_variant === "os-environment" && (
            <OSEnvironmentModule flagshipHeadline={product.tagline} />
          )}

          {product.template_variant === "ai-capabilities" && (
            <AICapabilitiesModule title={`${product.name} Capabilities Matrix`} />
          )}

          {product.template_variant === "pa-conversation" && (
            <PAConversationModule title={`${product.name} Dialogue Interaction`} />
          )}

          {product.template_variant === "ide-workflow" && (
            <IDEWorkflowModule title={`${product.name} Engineering Workflow`} />
          )}

          {!["os-environment", "ai-capabilities", "pa-conversation", "ide-workflow"].includes(
            product.template_variant
          ) && (
            <div className="p-8 border border-border-default rounded-lg bg-surface-primary">
              <p className="text-ink-secondary">
                Signature experience for {product.name} is configured under variant:{" "}
                <code className="font-mono text-sm">{product.template_variant}</code>.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* 4. CONFIRMED CAPABILITIES */}
      {capabilities && capabilities.length > 0 && (
        <Section spacing="lg" className="border-b border-border-default">
          <Container size="lg">
            <div className="max-w-3xl mb-10">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Functional Verification
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                Engineered Capabilities
              </h2>
              <p className="text-sm text-ink-muted mt-2">
                Documented capabilities confirmed in technical specifications (Document 01 §1).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border-default bg-surface-primary flex flex-col justify-between hover:border-border-strong transition-colors"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      Cap // 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-ink-primary">
                      {cap.title || `Capability ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-ink-secondary leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 5. ECOSYSTEM RELATIONSHIP */}
      <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/30">
        <Container size="lg">
          <div className="max-w-3xl mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Interconnected Systems
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
              Role in the HENU Ecosystem
            </h2>
            <p className="text-sm text-ink-secondary mt-2">
              HENU products operate as unified, interoperable nodes rather than isolated standalone tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                System Placement
              </span>
              <h3 className="font-serif text-xl text-ink-primary">{hue.tierLabel}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Operating at {hue.tierBadge.toLowerCase()}, {product.name} integrates with peer HENU layers
                via direct socket protocols and verified deterministic execution pipelines.
              </p>
              <div className="pt-2">
                <Link
                  href="/products#ecosystem"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline focus-visible:outline-focus-ring"
                >
                  Explore Ecosystem Visualization &rarr;
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Peer Systems
              </span>
              <h3 className="font-serif text-xl text-ink-primary">Ecosystem Peers</h3>
              <div className="space-y-2">
                {otherProducts
                  .filter((p) => p.slug !== product.slug)
                  .map((peer) => (
                    <div
                      key={peer.slug}
                      className="flex items-center justify-between py-2 border-b border-border-default/60 last:border-b-0 text-sm"
                    >
                      <span className="font-medium text-ink-primary">{peer.name}</span>
                      <Link
                        href={`/products/${peer.slug}`}
                        className="font-mono text-xs text-primary hover:underline focus-visible:outline-focus-ring"
                      >
                        Inspect &rarr;
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. EVIDENCE & HONEST INTEGRITY STATEMENT */}
      <Section spacing="md" className="border-b border-border-default bg-surface-primary">
        <Container size="lg">
          <div className="p-6 rounded-lg border border-border-default bg-surface-secondary/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-warning inline-block" />
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted font-medium">
                Engineering Status & Integrity Verification
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-4xl">
              HENU strictly observes technical documentation integrity (Document 01 §1). All architectural
              descriptions, layer contracts, and capabilities presented on this page are actively undergoing
              engineering validation. In compliance with project policies, no synthetic benchmarks, premature
              compatibility claims, or unconfirmed public download binaries are published prior to formal
              verification.
            </p>
          </div>
        </Container>
      </Section>

      {/* 7. NEXT ACTION / STATUS-DRIVEN CTA */}
      <Section spacing="lg" className="bg-surface-primary">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Next Architectural Step
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
              Engage with {product.name}
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed">
              Discover how {product.name} integrates with the broader HENU technology architecture and
              upcoming developer releases.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <LinkButton
                href={product.primary_cta_target || "/products"}
                variant="primary"
                size="lg"
                id={`cta-bottom-${product.slug}`}
              >
                {product.primary_cta_type === "explore"
                  ? "Explore Ecosystem Architecture"
                  : product.primary_cta_type === "waitlist"
                  ? "Join Updates"
                  : "View Products"}
              </LinkButton>
              <LinkButton href="/products" variant="outline" size="lg">
                Back to All Products
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  );
};

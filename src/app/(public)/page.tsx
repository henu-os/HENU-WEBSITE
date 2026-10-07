import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { homeService } from "@/server/services/home.service";
import { HomeHero } from "@/components/features/home/home-hero";
import { EcosystemModel } from "@/components/features/ecosystem/ecosystem-model";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "HENU — Sovereign Technology & Computing Ecosystem",
  description:
    "Official digital home of HENU. Developing sovereign operating systems, intelligent automation, private intelligence, and hardened engineering infrastructure.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HENU — Sovereign Technology & Computing Ecosystem",
    description:
      "Official digital home of HENU. Developing sovereign operating systems, intelligent automation, private intelligence, and hardened engineering infrastructure.",
    url: "https://henu.dev",
    siteName: "HENU",
    locale: "en_US",
    type: "website",
  },
};

export default async function HomePage() {
  const {
    content,
    publishedProducts,
    flagshipProduct,
    curatedServices,
    featuredProjects,
    evidence,
  } = await homeService.getPublicHomeData();

  // SEO-003: Structured data schemas for Organization and Flagship SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://henu.dev/#organization",
        name: "HENU",
        url: "https://henu.dev",
        description:
          "Sovereign technology collective engineering durable operating systems, local intelligence, and private computing infrastructure.",
        sameAs: ["https://github.com/henu-os"],
      },
      {
        "@type": "WebSite",
        "@id": "https://henu.dev/#website",
        url: "https://henu.dev",
        name: "HENU Official Website",
        publisher: { "@id": "https://henu.dev/#organization" },
      },
      ...(flagshipProduct
        ? [
            {
              "@type": "SoftwareApplication",
              name: flagshipProduct.name,
              description: flagshipProduct.tagline || flagshipProduct.summary,
              operatingSystem: "Sovereign Microkernel",
              applicationCategory: "OperatingSystem",
              url: `https://henu.dev/products/${flagshipProduct.slug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Opening / Hero (HOME-001) */}
      <HomeHero content={content} />

      {/* 2. Ecosystem Model (HOME-002) */}
      <Section id="ecosystem" spacing="lg" className="border-t border-border-default bg-surface-secondary/20">
        <Container size="wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
                Architecture // Layered Modularity
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
                The HENU Computing Ecosystem
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                An integrated stack designed for sovereign autonomy. From base operating system
                primitives to local intelligence, autonomous agents, and disciplined toolchains.
              </p>
            </div>
            <div>
              <LinkButton href="/products" variant="outline" size="md">
                Explore Products &rarr;
              </LinkButton>
            </div>
          </div>

          <EcosystemModel products={publishedProducts} />
        </Container>
      </Section>

      {/* 3. Flagship HENU OS Band */}
      <Section id="flagship-os" spacing="lg" className="border-t border-border-default bg-surface-primary">
        <Container size="wide">
          <div className="rounded-2xl border border-border-default bg-surface-secondary/30 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" size="sm" className="font-mono">
                    Flagship Foundation
                  </Badge>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Core OS // Layer 0
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-primary font-normal tracking-tight">
                  {content.flagship_headline}
                </h2>

                <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
                  {content.flagship_summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase text-ink-muted block">Telemetry</span>
                    <p className="font-mono text-sm font-semibold text-ink-primary">Zero / Absolute</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase text-ink-muted block">Architecture</span>
                    <p className="font-mono text-sm font-semibold text-ink-primary">Microkernel</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase text-ink-muted block">Execution</span>
                    <p className="font-mono text-sm font-semibold text-ink-primary">Deterministic</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase text-ink-muted block">Deployment</span>
                    <p className="font-mono text-sm font-semibold text-ink-primary">Air-Gap Ready</p>
                  </div>
                </div>

                <div className="pt-4">
                  <LinkButton
                    href={flagshipProduct ? `/products/${flagshipProduct.slug}` : "/products/henu-os"}
                    variant="primary"
                    size="lg"
                  >
                    Inspect OS Architecture &rarr;
                  </LinkButton>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="rounded-xl border border-border-default bg-surface-primary p-6 space-y-4 shadow-xs font-mono text-xs text-ink-secondary">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <span className="text-ink-primary font-semibold">KERNEL SPECIFICATION</span>
                    <span className="text-accent-pine">VERIFIED</span>
                  </div>
                  <div className="space-y-2 leading-relaxed">
                    <p className="text-ink-muted">{"// Sovereign Core Invariants"}</p>
                    <p><span className="text-accent-pine">const</span> ISOLATION_LEVEL = &quot;HARDWARE_ENFORCED&quot;;</p>
                    <p><span className="text-accent-pine">const</span> NETWORK_CALLS = &quot;EXPLICIT_USER_CONSENT&quot;;</p>
                    <p><span className="text-accent-pine">const</span> AUDIT_STORAGE = &quot;APPEND_ONLY_LEDGER&quot;;</p>
                    <p className="pt-2 text-ink-muted">{"// Ready for mission-critical & private systems"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Curated Services Index */}
      <Section id="services" spacing="lg" className="border-t border-border-default bg-surface-secondary/20">
        <Container size="wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
                Capabilities // Services Ledger
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
                Engineering Disciplines & Deployments
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                {content.services_intro}
              </p>
            </div>
            <div>
              <LinkButton href="/services" variant="outline" size="md">
                All Disciplines &rarr;
              </LinkButton>
            </div>
          </div>

          {curatedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-border-default bg-surface-primary p-6 flex flex-col justify-between hover:border-border-strong transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                        {service.slug}
                      </span>
                      <Badge variant="outline" size="sm">
                        Enterprise
                      </Badge>
                    </div>

                    <h3 className="font-serif text-xl font-normal text-ink-primary">
                      {service.name}
                    </h3>

                    <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
                      {service.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-mono font-semibold text-accent-pine hover:underline inline-flex items-center gap-1.5"
                    >
                      Specifications &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-xl border border-border-default bg-surface-primary text-center max-w-xl mx-auto space-y-3">
              <p className="font-serif text-lg text-ink-primary">Disciplines Ledger</p>
              <p className="text-sm text-ink-secondary">
                Service capabilities are currently undergoing formal capacity and governance review.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* 5. Featured Portfolio Showcase */}
      <Section id="portfolio" spacing="lg" className="border-t border-border-default bg-surface-primary">
        <Container size="wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
                Implementational Record // Selected Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
                Hardened Production Deployments
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                Case studies and architectural implementations executed under strict privacy and verification standards.
              </p>
            </div>
            <div>
              <LinkButton href="/portfolio" variant="outline" size="md">
                Full Portfolio &rarr;
              </LinkButton>
            </div>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border-default bg-surface-secondary/20 p-8 flex flex-col justify-between hover:border-border-strong transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                        Case Study // {project.slug}
                      </span>
                      <Badge variant="outline" size="sm" className="font-mono">
                        {project.client_permission_status === "granted" ? "Verified Clearance" : "Sanitized"}
                      </Badge>
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-ink-primary">
                      {project.title}
                    </h3>

                    <p className="text-sm text-ink-secondary leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between">
                    <span className="text-xs font-mono text-ink-muted">
                      Confidentiality: Enforced
                    </span>
                    <LinkButton href={`/portfolio/${project.slug}`} variant="outline" size="sm">
                      Examine Architecture &rarr;
                    </LinkButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-border-default bg-surface-secondary/20 text-center max-w-2xl mx-auto space-y-3">
              <svg className="w-8 h-8 text-accent-pine mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="font-serif text-xl text-ink-primary font-normal">Verified Ledger Governance</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Client implementations are subjected to formal verification, architectural review, and nondisclosure clearance prior to public ledger archival.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* 6. Verified Evidence Section */}
      <Section id="evidence" spacing="lg" className="border-t border-border-default bg-surface-secondary/30">
        <Container size="wide">
          <div className="max-w-2xl space-y-2 mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
              Credibility // Architectural Evidence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
              Engineering Invariants, Not Marketing Numbers
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed">
              We present verifiable technical architectures instead of ephemeral counters or unverified client logos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evidence.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border-default bg-surface-primary p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" size="sm" className="font-mono">
                    {item.tag}
                  </Badge>
                  <span className="text-xs font-mono text-ink-muted">0{idx + 1}</span>
                </div>

                <h3 className="font-serif text-lg font-normal text-ink-primary">
                  {item.headline}
                </h3>

                <p className="text-sm text-ink-secondary leading-relaxed">
                  {item.description}
                </p>

                <p className="pt-2 text-xs font-mono text-ink-muted border-t border-border-subtle">
                  Ref: {item.provenance}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7. About Teaser */}
      <Section id="about-teaser" spacing="lg" className="border-t border-border-default bg-surface-primary">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
                Company Narrative // Institutional Archive
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-primary font-normal leading-tight">
                An Evolving Technology Ecosystem
              </h2>
              <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
                {content.about_teaser}
              </p>
              <div>
                <LinkButton href="/about" variant="outline" size="md">
                  Read the Institutional Narrative &rarr;
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-xl border border-border-default bg-surface-secondary/30 p-6 space-y-4 font-mono text-xs text-ink-secondary">
              <span className="text-ink-primary font-semibold block border-b border-border-subtle pb-2">
                ECOSYSTEM TIMELINE
              </span>
              <div className="space-y-3">
                <div>
                  <span className="text-accent-pine block">2024 — Founding</span>
                  <p className="text-ink-muted text-[11px]">Sovereign computing mandate established.</p>
                </div>
                <div>
                  <span className="text-accent-pine block">2025 — HENU OS Kernel</span>
                  <p className="text-ink-muted text-[11px]">Zero-telemetry foundation architectural release.</p>
                </div>
                <div>
                  <span className="text-accent-pine block">2026 — Client Implementations</span>
                  <p className="text-ink-muted text-[11px]">Custom housing networks & private gateways.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. Closing Dual-Path CTA */}
      <Section id="contact-cta" spacing="xl" className="border-t border-border-default bg-surface-secondary/40">
        <Container size="wide">
          <div className="rounded-2xl border border-border-default bg-surface-primary p-8 sm:p-14 lg:p-18 text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
                Initialize Dialogue
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-primary font-normal tracking-tight">
                Two Sovereign Pathways to Engage
              </h2>
              <p className="text-base sm:text-lg text-ink-secondary max-w-xl mx-auto leading-relaxed">
                Choose the communication channel suited to your timeline and organizational requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
              {/* Path A */}
              <div className="p-6 rounded-xl border border-border-default bg-surface-secondary/20 flex flex-col justify-between space-y-4 hover:border-border-strong transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ink-primary">
                    <svg className="w-5 h-5 text-accent-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="font-serif text-xl font-normal">Start an Enquiry</h3>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Submit detailed technical specifications, project goals, or sovereign deployment requirements asynchronously.
                  </p>
                </div>
                <div className="pt-2">
                  <LinkButton href="/contact" variant="primary" size="md" className="w-full">
                    Transmit Requirements &rarr;
                  </LinkButton>
                </div>
              </div>

              {/* Path B */}
              <div className="p-6 rounded-xl border border-border-default bg-surface-secondary/20 flex flex-col justify-between space-y-4 hover:border-border-strong transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ink-primary">
                    <svg className="w-5 h-5 text-accent-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-serif text-xl font-normal">Schedule a Meeting</h3>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Book an engineering consultation directly with our systems leads via our verified scheduling desk.
                  </p>
                </div>
                <div className="pt-2">
                  <LinkButton
                    href="https://calendly.com/henuos"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md"
                    className="w-full"
                  >
                    Open Calendly Desk &rarr;
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

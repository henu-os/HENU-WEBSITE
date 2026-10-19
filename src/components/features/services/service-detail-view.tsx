"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Service, ServiceCategory } from "@/types/domain";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { ServiceArchitectureSpecimen } from "./service-architecture-specimen";
import { getServiceAdvantage } from "@/config/service-advantages";

interface ServiceDetailViewProps {
  service: Service;
  category?: ServiceCategory | null;
  otherServices?: Service[];
}

export function ServiceDetailView({
  service,
  category,
  otherServices = [],
}: ServiceDetailViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Safely extract structured blocks
  const problem = service.problem_block as {
    headline?: string;
    description?: string;
    points?: string[];
  } | null;

  const capability = service.capability_block as {
    headline?: string;
    description?: string;
    attributes?: string[];
  } | null;

  const approach = service.approach_block as {
    headline?: string;
    description?: string;
  } | null;

  const solution = service.solution_block as {
    headline?: string;
    description?: string;
  } | null;

  const outcome = service.outcome_block as {
    headline?: string;
    description?: string;
  } | null;

  const faqItems = Array.isArray(service.faq_items)
    ? (service.faq_items as Array<{ question?: string; answer?: string }>)
    : [];

  // Determine pillar color accents
  const isIntelligence = category?.slug === "intelligence";
  const isBrand = category?.slug === "brand-and-growth";
  const pillarColor = isIntelligence ? "indigo" : isBrand ? "amber" : "cyan";

  const advProfile = getServiceAdvantage(service.slug, service.name);

  return (
    <article className="w-full relative" data-service-slug={service.slug}>
      {/* 1. HEADER & HERO WITH ARCHITECTURAL SPECIMEN */}
      <header className="relative pt-10 pb-16 lg:pt-16 lg:pb-20 border-b border-border-default bg-surface-primary">
        <Container size="lg">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-mono text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink-primary transition-colors focus-visible:outline-focus-ring">
                  HENU
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-ink-primary transition-colors focus-visible:outline-focus-ring">
                  Services
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/services#category-${category.slug}`}
                      className="hover:text-ink-primary transition-colors focus-visible:outline-focus-ring"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-ink-primary font-medium" aria-current="page">
                {service.name}
              </li>
            </ol>
          </nav>

          {/* 2-Column Responsive Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Metadata, Title, Summary & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                {category && (
                  <Badge variant="outline" size="md" className="font-mono text-xs uppercase tracking-wider">
                    {category.name}
                  </Badge>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  ARCHITECTURAL CAPABILITY
                </span>
                {service.requires_disclaimer && (
                  <Badge variant="warning" size="md">
                    Sensitive Service Governance
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink-primary">
                {service.name}
              </h1>

              <p className="font-sans text-lg sm:text-xl text-ink-secondary leading-relaxed">
                {service.summary}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <LinkButton
                  href={`/contact?service=${service.slug}&interest=service`}
                  variant="primary"
                  size="lg"
                  id={`cta-service-discuss-${service.slug}`}
                  className="shadow-sm"
                >
                  Discuss This Service &rarr;
                </LinkButton>

                <LinkButton
                  href="/services"
                  variant="outline"
                  size="lg"
                  className="border-amber-400/60 hover:border-amber-600 hover:bg-amber-500/10 text-ink-primary"
                >
                  View All Services
                </LinkButton>
              </div>

              {/* Fast Architectural Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border-default">
                <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-default/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">IP Ownership</span>
                  <span className="font-mono text-xs font-bold text-ink-primary">100% Client Deed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-default/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Architecture SLA</span>
                  <span className="font-mono text-xs font-bold text-ink-primary">Zero Telemetry</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-secondary/70 border border-border-default/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Runtime Standard</span>
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">Strict Type Safety</span>
                </div>
              </div>
            </div>

            {/* Right: Architectural Visual Specimen */}
            <div className="lg:col-span-5 w-full">
              <ServiceArchitectureSpecimen
                serviceSlug={service.slug}
                categorySlug={category?.slug}
                serviceName={service.name}
              />
            </div>
          </div>
        </Container>
      </header>

      {/* 2. SENSITIVE SERVICE MANDATORY DISCLAIMER */}
      {service.requires_disclaimer && service.disclaimer_block && (
        <Section spacing="md" className="border-b border-border-default bg-status-warning/5">
          <Container size="lg">
            <div
              role="note"
              aria-label="Regulatory Notice & Service Scope"
              className="p-6 rounded-lg border-2 border-status-warning/40 bg-surface-primary space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-warning inline-block" />
                <span className="font-mono text-xs uppercase tracking-wider text-status-warning font-bold">
                  Important Regulatory & Governance Notice
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {service.disclaimer_block}
              </p>
            </div>
          </Container>
        </Section>
      )}

      {/* 3. PROBLEM & CHALLENGE */}
      {problem && problem.description && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  Phase 01 // Challenge
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {problem.headline || "The Problem We Address"}
                </h2>
                <p className="text-xs font-mono text-ink-muted mt-2">
                  Structural flaws inherent to standard market implementations.
                </p>
              </div>
              <div className="lg:col-span-8 space-y-6">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {problem.description}
                </p>
                {problem.points && problem.points.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-800 dark:text-rose-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      SYSTEMIC RISK PROFILE OBSERVED IN LEGACY APPROACHES
                    </div>
                    <ul className="space-y-2 pt-1 list-none p-0">
                      {problem.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                          <span className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">&bull;</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. HENU CAPABILITY */}
      {capability && capability.description && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  Phase 02 // Capability
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {capability.headline || "Our Engineered Capability"}
                </h2>
                <p className="text-xs font-mono text-ink-muted mt-2">
                  Precision counter-measures delivering verifiable operational autonomy.
                </p>
              </div>
              <div className="lg:col-span-8 space-y-6">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {capability.description}
                </p>
                {capability.attributes && capability.attributes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {capability.attributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-emerald-300/60 dark:border-emerald-800/60 bg-surface-primary flex items-center gap-3 text-xs font-mono text-ink-primary shadow-xs hover:border-emerald-500 transition-colors"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                          &#10003;
                        </span>
                        <span>{attr}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 5. ARCHITECTURAL SPECIFICATION LEDGER */}
      <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
        <Container size="lg">
          <div className="max-w-3xl mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              Technical Ledger
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
              Architecture Delivery Specifications
            </h2>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Every HENU engagement is executed under deterministic engineering boundaries and complete ownership transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Deliverable Form</span>
              <p className="font-mono text-sm font-bold text-ink-primary">Production Git Repository</p>
              <p className="text-xs text-ink-secondary">Complete repository access with reproducible CI/CD pipelines.</p>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Infrastructure Sovereignty</span>
              <p className="font-mono text-sm font-bold text-ink-primary">Zero Telemetry Leaks</p>
              <p className="text-xs text-ink-secondary">Air-gap deployable; zero third-party behavioural ad networks.</p>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Typing & Verification</span>
              <p className="font-mono text-sm font-bold text-ink-primary">Strict Domain Schemas</p>
              <p className="text-xs text-ink-secondary">Zod schema validation, strict TypeScript, and automated unit tests.</p>
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">Intellectual Property</span>
              <p className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">100% Client Transfer</p>
              <p className="text-xs text-ink-secondary">No recurring seat licensing tax; clean copyright assignment.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. APPROACH & EXECUTION METHODOLOGY */}
      {approach && approach.description && (
        <Section spacing="md" className="border-b border-border-default bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  Phase 03 // Approach
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                  {approach.headline || "Execution Methodology"}
                </h2>
                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  {approach.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {advProfile.coreAdvantages.map((adv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-primary border border-border-default text-ink-secondary"
                    >
                      &bull; {adv}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Stage Architectural Delivery Lifecycle */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl border border-border-default bg-surface-primary space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px]">01</span>
                    Specification & Boundary Framing
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Formal schema definition, state machine boundaries, and strict type contract agreements prior to implementation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border-default bg-surface-primary space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px]">02</span>
                    Sovereign Implementation
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Lean engineering with zero third-party telemetry, self-hosted deployment models, and immutable schemas.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border-default bg-surface-primary space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px]">03</span>
                    Verification & Stress Testing
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Core Web Vitals certification, sub-second latency profiling, automated unit testing, and WCAG AA verification.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border-default bg-surface-primary space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px]">04</span>
                    Production Handover & Deed
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Full Git repository transfer, role-based admin console configuration, and clean copyright assignment.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 7. WHAT HENU OS PROVIDES (DELIVERED SOLUTION) */}
      <Section spacing="md" className="border-b border-border-default bg-surface-primary">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Phase 04 // What HENU OS Provides
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                {solution?.headline || "The Delivered Solution"}
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {solution?.description || advProfile.tagline}
              </p>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-900 dark:text-emerald-300">
                100% Client Ownership &bull; Zero Recurring SaaS Tax &bull; Production Ready
              </div>
            </div>

            {/* 4 Concrete Deliverable Specification Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {advProfile.henuProvides.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border-default bg-surface-secondary/40 space-y-2 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink-primary">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px]">
                      &#10003;
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. MEASURABLE BUSINESS IMPACT & ROI */}
      <Section spacing="md" className="border-b border-border-default bg-surface-secondary/20">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                Phase 05 // Business Impact & ROI
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary">
                {outcome?.headline || "Verifiable Commercial Impact"}
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {outcome?.description || "How investing in sovereign architecture delivers compounding returns and competitive autonomy."}
              </p>
              <p className="text-xs font-mono text-ink-muted">
                Engineered to eliminate ongoing software maintenance overhead and establish immediate market distinction.
              </p>
            </div>

            {/* 4 Quantified Impact Metric Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {advProfile.commercialImpact.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-amber-300/60 dark:border-amber-700/60 bg-surface-primary space-y-2 shadow-xs hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400">
                      {metric.metric}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold">
                      {metric.label}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {metric.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. ACCESSIBLE FAQ ACCORDION */}
      {faqItems.length > 0 && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="max-w-3xl mb-8">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Frequently Addressed Inquiries
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                Service FAQ
              </h2>
            </div>

            <div className="max-w-3xl divide-y divide-border-default border-y border-border-default">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                const questionId = `faq-q-${idx}`;
                const answerId = `faq-a-${idx}`;

                return (
                  <div key={idx} className="py-4">
                    <h3>
                      <button
                        type="button"
                        id={questionId}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between text-left font-serif text-lg text-ink-primary hover:text-primary transition-colors focus-visible:outline-focus-ring py-1"
                      >
                        <span>{item.question}</span>
                        <span className="font-mono text-sm ml-4 text-ink-muted" aria-hidden="true">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                    </h3>
                    {isOpen && (
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="pt-2 pb-1 text-sm text-ink-secondary leading-relaxed font-sans"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* 10. CONTEXTUAL BOTTOM CTA */}
      <Section spacing="lg" className="bg-surface-secondary/30">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              Engagement Initiation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
              Architect Your {service.name} Initiative
            </h2>
            <p className="text-base text-ink-secondary leading-relaxed">
              Engage directly with our engineering team to review system boundaries, define operational
              specifications, and scope your implementation.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <LinkButton
                href={`/contact?service=${service.slug}&interest=service`}
                variant="primary"
                size="lg"
                id={`cta-bottom-service-${service.slug}`}
                className="shadow-sm"
              >
                Discuss {service.name} &rarr;
              </LinkButton>
              <LinkButton
                href="/services"
                variant="outline"
                size="lg"
                className="border-amber-400/60 hover:border-amber-600 hover:bg-amber-500/10"
              >
                Back to All Services
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  );
}

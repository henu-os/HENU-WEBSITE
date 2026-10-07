"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Service, ServiceCategory } from "@/types/domain";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

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

  return (
    <article className="w-full relative" data-service-slug={service.slug}>
      {/* 1. HEADER & BREADCRUMBS */}
      <header className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border-default bg-surface-primary">
        <Container size="lg">
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

          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {category && (
                <Badge variant="outline" size="md">
                  {category.name}
                </Badge>
              )}
              {service.requires_disclaimer && (
                <Badge variant="warning" size="md">
                  Sensitive Service Governance
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-ink-primary">
              {service.name}
            </h1>

            <p className="font-sans text-lg sm:text-xl text-ink-secondary leading-relaxed max-w-3xl">
              {service.summary}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <LinkButton
                href={`/contact?service=${service.slug}&interest=service`}
                variant="primary"
                size="lg"
                id={`cta-service-discuss-${service.slug}`}
              >
                Discuss This Service &rarr;
              </LinkButton>

              <LinkButton href="/services" variant="outline" size="lg">
                View All Services
              </LinkButton>
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
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 01 // Challenge
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {problem.headline || "The Problem We Address"}
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {problem.description}
                </p>
                {problem.points && problem.points.length > 0 && (
                  <ul className="space-y-2 pt-2 list-none p-0">
                    {problem.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                        <span className="text-secondary font-bold mt-0.5">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
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
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 02 // Capability
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {capability.headline || "Our Engineered Capability"}
                </h2>
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
                        className="p-3.5 rounded border border-border-default bg-surface-primary flex items-center gap-2 text-xs font-mono text-ink-primary"
                      >
                        <span className="text-primary font-bold">&#10003;</span>
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

      {/* 5. APPROACH & METHODOLOGY */}
      {approach && approach.description && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 03 // Approach
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {approach.headline || "Execution Methodology"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {approach.description}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 6. SOLUTION ARCHITECTURE */}
      {solution && solution.description && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 04 // Solution
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {solution.headline || "The Delivered Solution"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {solution.description}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 7. OPERATIONAL OUTCOME (Omitted if missing per Document 04 §14.5) */}
      {outcome && outcome.description && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-primary">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 05 // Outcome
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1">
                  {outcome.headline || "Verifiable Outcomes"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 8. ACCESSIBLE FAQ ACCORDION */}
      {faqItems.length > 0 && (
        <Section spacing="lg" className="border-b border-border-default bg-surface-secondary/30">
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

      {/* 9. CONTEXTUAL BOTTOM CTA */}
      <Section spacing="lg" className="bg-surface-primary">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
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
              >
                Discuss {service.name} &rarr;
              </LinkButton>
              <LinkButton href="/services" variant="outline" size="lg">
                Back to All Services
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </article>
  );
}

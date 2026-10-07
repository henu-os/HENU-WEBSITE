import React from "react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PortfolioGallery, type GalleryItem } from "./portfolio-gallery";
import type {
  PortfolioProject,
  ProjectCategory,
  ProjectMetric,
  ProjectStoryBlocks,
  Service,
  Product,
} from "@/types/domain";

interface PortfolioDetailViewProps {
  project: PortfolioProject;
  category?: ProjectCategory | null;
  prevProject?: PortfolioProject | null;
  nextProject?: PortfolioProject | null;
  relatedServices?: Service[];
  relatedProducts?: Product[];
}

export function PortfolioDetailView({
  project,
  category,
  prevProject,
  nextProject,
  relatedServices = [],
  relatedProducts = [],
}: PortfolioDetailViewProps) {
  const storyBlocks = (project.story_blocks || {}) as ProjectStoryBlocks;
  const metrics = Array.isArray(project.metrics)
    ? (project.metrics as unknown as ProjectMetric[])
    : [];
  const technologies = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];

  const galleryItems = (storyBlocks.gallery || []) as GalleryItem[];

  return (
    <div className="space-y-0 divide-y divide-border-default">
      {/* 1. COVER / HERO */}
      <Section spacing="lg" className="bg-surface-secondary/30 pt-8 sm:pt-16">
        <Container size="lg">
          <div className="space-y-6 max-w-4xl">
            {/* Breadcrumb / Back link */}
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
              <Link
                href="/portfolio"
                className="hover:text-ink-primary hover:underline transition-colors min-h-[44px] inline-flex items-center"
              >
                &larr; Architectural Portfolio
              </Link>
              {category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={`/portfolio?category=${category.slug}`}
                    className="hover:text-ink-primary hover:underline transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {category.name}
                  </Link>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {category && (
                <Badge variant="outline" className="font-mono text-xs uppercase">
                  {category.name}
                </Badge>
              )}
              <Badge
                variant={project.project_status === "live" ? "default" : "secondary"}
                className="font-mono text-xs uppercase"
              >
                Status: {project.project_status}
              </Badge>
              {project.period_year && (
                <Badge variant="secondary" className="font-mono text-xs uppercase">
                  Timeline: {project.period_year}
                </Badge>
              )}
              {project.is_featured && (
                <Badge variant="warning" className="font-mono text-xs uppercase">
                  Flagship Case Study
                </Badge>
              )}
            </div>

            {/* Title & Summary */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink-primary font-normal leading-tight">
              {project.title}
            </h1>

            <p className="font-sans text-lg sm:text-xl text-ink-secondary leading-relaxed">
              {project.summary}
            </p>

            {/* External URL if provided */}
            {project.external_url && (
              <div className="pt-2">
                <a
                  href={project.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border-default bg-surface-primary text-ink-primary font-mono text-xs uppercase tracking-wider hover:bg-surface-elevated transition-colors min-h-[44px]"
                >
                  <span>Launch Live Deployment</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* 2. CHALLENGE (Omitted if absent) */}
      {storyBlocks.challenge && storyBlocks.challenge.content && (
        <Section spacing="lg" className="bg-surface-primary">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 01 // Challenge
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1 font-normal">
                  {storyBlocks.challenge.title || "The Operational Problem"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                  {storyBlocks.challenge.content}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 3. APPROACH (Omitted if absent) */}
      {storyBlocks.approach && storyBlocks.approach.content && (
        <Section spacing="lg" className="bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 02 // Approach
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1 font-normal">
                  {storyBlocks.approach.title || "Engineering Architecture"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                  {storyBlocks.approach.content}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. SOLUTION (Omitted if absent) */}
      {storyBlocks.solution && storyBlocks.solution.content && (
        <Section spacing="lg" className="bg-surface-primary">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 03 // Solution
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1 font-normal">
                  {storyBlocks.solution.title || "Deployed Implementation"}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                  {storyBlocks.solution.content}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 5. TECHNOLOGY (Omitted if absent) */}
      {(technologies.length > 0 || (storyBlocks.technology && storyBlocks.technology.content)) && (
        <Section spacing="lg" className="bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 04 // Toolchain
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1 font-normal">
                  {storyBlocks.technology?.title || "Technical Stack & Infrastructure"}
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6">
                {storyBlocks.technology?.content && (
                  <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                    {storyBlocks.technology.content}
                  </p>
                )}

                {technologies.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
                      Confirmed Technologies
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-3 py-1 rounded bg-surface-primary text-ink-primary border border-border-default shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 6. CONFIRMED OUTCOMES & METRICS (Omitted if absent) */}
      {(metrics.length > 0 || (storyBlocks.outcome && storyBlocks.outcome.content)) && (
        <Section spacing="lg" className="bg-surface-primary">
          <Container size="lg">
            <div className="space-y-8">
              <div className="border-b border-border-default pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 05 // Verified Outcomes
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-ink-primary font-normal mt-1">
                  {storyBlocks.outcome?.title || "Operational Impact & Verified Metrics"}
                </h2>
              </div>

              {storyBlocks.outcome?.content && (
                <p className="font-sans text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed whitespace-pre-line">
                  {storyBlocks.outcome.content}
                </p>
              )}

              {metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="border border-border-default rounded-lg p-6 bg-surface-secondary/40 space-y-3"
                    >
                      <span className="font-serif text-3xl sm:text-4xl font-semibold text-accent-pine block">
                        {metric.value}
                      </span>
                      <span className="font-sans text-sm font-medium text-ink-primary block">
                        {metric.label}
                      </span>
                      <div className="pt-3 border-t border-border-default/60 space-y-1 font-mono text-[10px] text-ink-muted">
                        <div>
                          <span className="uppercase tracking-wider">Source: </span>
                          <span>{metric.source}</span>
                        </div>
                        <div>
                          <span className="uppercase tracking-wider">Audit Owner: </span>
                          <span>{metric.owner}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="font-mono text-xs text-ink-muted border-l-2 border-accent-pine pl-3 py-1">
                HENU Governance Guarantee: All operational outcomes cite verifiable evidence repositories and internal engineering owners. No fabricated synthetic metrics are published.
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 7. EVIDENCE (Omitted if absent) */}
      {storyBlocks.evidence && storyBlocks.evidence.content && (
        <Section spacing="lg" className="bg-surface-secondary/20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Phase 06 // Evidence
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary mt-1 font-normal">
                  {storyBlocks.evidence.title || "Audit & Verification"}
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-3">
                <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                  {storyBlocks.evidence.content}
                </p>
                {storyBlocks.evidence.source && (
                  <div className="font-mono text-xs text-ink-muted">
                    Reference: {storyBlocks.evidence.source}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 8. ARTIFACT GALLERY (Omitted if empty) */}
      {galleryItems.length > 0 && (
        <Section spacing="lg" className="bg-surface-primary">
          <Container size="lg">
            <PortfolioGallery items={galleryItems} projectTitle={project.title} />
          </Container>
        </Section>
      )}

      {/* 9. RELATED ECOSYSTEM LINKS */}
      {(relatedServices.length > 0 || relatedProducts.length > 0) && (
        <Section spacing="lg" className="bg-surface-secondary/30">
          <Container size="lg">
            <div className="space-y-6">
              <div className="border-b border-border-default pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Ecosystem Context
                </span>
                <h2 className="font-serif text-2xl text-ink-primary font-normal mt-1">
                  Related Services & Products
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="p-5 rounded-lg border border-border-default bg-surface-primary hover:border-ink-primary/50 transition-colors block group"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
                      Professional Service
                    </span>
                    <h3 className="font-serif text-lg text-ink-primary group-hover:text-accent-pine transition-colors font-medium">
                      {service.name} &rarr;
                    </h3>
                    <p className="font-sans text-xs text-ink-secondary mt-1 line-clamp-2">
                      {service.summary}
                    </p>
                  </Link>
                ))}

                {relatedProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    className="p-5 rounded-lg border border-border-default bg-surface-primary hover:border-ink-primary/50 transition-colors block group"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
                      Computing Product
                    </span>
                    <h3 className="font-serif text-lg text-ink-primary group-hover:text-accent-pine transition-colors font-medium">
                      {prod.name} &rarr;
                    </h3>
                    <p className="font-sans text-xs text-ink-secondary mt-1 line-clamp-2">
                      {prod.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 10. PREVIOUS / NEXT NAVIGATION */}
      {(prevProject || nextProject) && (
        <Section spacing="md" className="bg-surface-primary border-t border-border-default">
          <Container size="lg">
            <nav aria-label="Adjacent project navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevProject ? (
                <Link
                  href={`/portfolio/${prevProject.slug}`}
                  className="p-4 rounded-lg border border-border-default hover:bg-surface-secondary/40 transition-colors block group min-h-[44px]"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
                    &larr; Previous Case Study
                  </span>
                  <span className="font-serif text-base text-ink-primary group-hover:text-accent-pine transition-colors font-normal">
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextProject && (
                <Link
                  href={`/portfolio/${nextProject.slug}`}
                  className="p-4 rounded-lg border border-border-default hover:bg-surface-secondary/40 transition-colors block text-right group min-h-[44px]"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
                    Next Case Study &rarr;
                  </span>
                  <span className="font-serif text-base text-ink-primary group-hover:text-accent-pine transition-colors font-normal">
                    {nextProject.title}
                  </span>
                </Link>
              )}
            </nav>
          </Container>
        </Section>
      )}

      {/* 11. INQUIRY ACTION BANNER */}
      <Section spacing="lg" className="bg-surface-secondary text-center">
        <Container size="md">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
              Architectural Readiness // Enterprise Engagements
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal">
              Engage HENU for High-Integrity Systems
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-xl mx-auto">
              Whether architecting sovereign financial ERP ledgers, intelligent automated pipelines, or developer platforms, HENU delivers verified technical execution.
            </p>
            <div className="pt-4">
              <Link
                href={`/contact?interest=service&ref=${project.slug}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-ink-primary text-surface-primary font-mono text-xs uppercase tracking-wider hover:bg-ink-primary/90 transition-colors min-h-[44px]"
              >
                Initiate Architecture Scoping Inquiry &rarr;
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

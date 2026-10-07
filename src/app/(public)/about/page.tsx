import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EcosystemStoryVisualizer } from "@/components/features/about/ecosystem-story-visualizer";
import { aboutService } from "@/server/services/about.service";
import type { AboutChapter, TimelineEntry } from "@/types/domain";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await aboutService.getPublicAboutContent();

  return {
    title: "About // Sovereign Computing Ecosystem — HENU",
    description:
      content.mission_statement ||
      "HENU is an independent sovereign computing collective engineering durable, zero-telemetry foundational operating systems and high-integrity digital platforms.",
    alternates: {
      canonical: "/about",
    },
  };
}

export default async function AboutPage() {
  const content = await aboutService.getPublicAboutContent();

  const chapters = (Array.isArray(content.chapters)
    ? content.chapters
    : []) as unknown as AboutChapter[];

  const timelineEntries = (Array.isArray(content.timeline_entries)
    ? content.timeline_entries
    : []) as unknown as TimelineEntry[];

  return (
    <div className="py-12 sm:py-20">
      <Container size="lg" className="space-y-24 sm:space-y-32">
        {/* 1. Header & Sovereign Vision Statement */}
        <header className="space-y-8 max-w-4xl">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
              Company // Institutional Archive
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1]">
              Engineered for Durability, Autonomy & Human Agency
            </h1>
          </div>

          <div className="border-l-2 border-accent-pine pl-6 sm:pl-8 space-y-4 py-2">
            <p className="font-sans text-lg sm:text-xl text-ink-primary font-medium leading-relaxed">
              {content.vision_statement}
            </p>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed max-w-3xl">
              {content.mission_statement}
            </p>
          </div>
        </header>

        {/* 2. Chapters Storytelling Grid */}
        <section aria-label="About Story Chapters" className="space-y-16">
          <div className="border-b border-border-default pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              Chapter Index // Narrative Architecture
            </span>
          </div>

          {chapters.length === 0 ? (
            <div
              role="region"
              aria-label="No published chapters"
              className="border border-border-default rounded-xl p-8 sm:p-12 text-center space-y-3 bg-surface-secondary/40"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Archive Status // Confidential
              </span>
              <h2 className="font-serif text-2xl text-ink-primary">Narrative Chapters In Review</h2>
              <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
                Detailed institutional disclosures are currently undergoing review. Check back for verified publication releases.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {chapters.map((chapter, idx) => (
                <article
                  key={chapter.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-border-default pt-12 first:border-t-0 first:pt-0"
                >
                  {/* Left Column: Number & Subtitle */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="font-mono text-3xl sm:text-4xl text-ink-muted/50 font-light">
                      {chapter.chapter_number || `0${idx + 1}`}
                    </div>
                    {chapter.subtitle && (
                      <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                        {chapter.subtitle}
                      </span>
                    )}
                    <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal leading-snug">
                      {chapter.title}
                    </h2>
                    {chapter.tags && chapter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {chapter.tags.map((tag) => (
                          <Badge key={tag} variant="neutral" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Content Body */}
                  <div className="lg:col-span-8 space-y-6">
                    <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed whitespace-pre-line">
                      {chapter.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 2.5 Ecosystem Visualizer & 3D Architectural Storytelling (ABOUT-003) */}
        <section aria-label="Ecosystem Architectural Storytelling">
          <EcosystemStoryVisualizer />
        </section>

        {/* 3. Verified Timeline Section (Sparse-safe: rendered ONLY if verified milestones exist) */}
        {timelineEntries.length > 0 && (
          <section aria-label="Verified Institutional Timeline" className="space-y-12">
            <div className="border-b border-border-default pb-4 space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted block">
                Chronology // Verified Milestones
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                Operational Timeline
              </h2>
            </div>

            <div className="relative border-l border-border-default ml-4 sm:ml-6 space-y-12 pl-6 sm:pl-10">
              {timelineEntries.map((entry) => (
                <div key={entry.id} className="relative group">
                  {/* Timeline Node Indicator */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface-primary bg-accent-pine" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-accent-pine">
                        {entry.date_formatted || entry.year}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted px-2 py-0.5 rounded bg-surface-secondary border border-border-default">
                        Verified Event
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
                      {entry.title}
                    </h3>

                    <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-2xl leading-relaxed">
                      {entry.description}
                    </p>

                    {/* Verified Evidence Footer */}
                    <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-ink-muted">
                      <span>Source: {entry.verified_source}</span>
                      <span>Owner: {entry.verified_owner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Sovereign Invitation & Ecosystem Pathways */}
        <section
          aria-label="Ways to work with HENU"
          className="border border-border-default rounded-2xl p-8 sm:p-14 bg-surface-secondary/30 space-y-8"
        >
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
              Engagement // Sovereign Pathways
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
              Engage With The Sovereign Ecosystem
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
              HENU collaborates with institutions and engineering teams committed to lasting software durability, privacy sovereignty, and high-performance system design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link
              href="/products"
              className="p-6 rounded-xl border border-border-default bg-surface-primary hover:border-accent-pine transition-colors group block space-y-2"
            >
              <span className="font-mono text-xs text-accent-pine uppercase tracking-wider block">01 // Products</span>
              <h3 className="font-serif text-lg text-ink-primary group-hover:text-accent-pine transition-colors">
                Explore HENU OS &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Inspect our sovereign operating system, local agents, and tools.
              </p>
            </Link>

            <Link
              href="/services"
              className="p-6 rounded-xl border border-border-default bg-surface-primary hover:border-accent-pine transition-colors group block space-y-2"
            >
              <span className="font-mono text-xs text-accent-pine uppercase tracking-wider block">02 // Services</span>
              <h3 className="font-serif text-lg text-ink-primary group-hover:text-accent-pine transition-colors">
                Commission Architecture &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Retain HENU engineering craft for enterprise platforms and private ledgers.
              </p>
            </Link>

            <Link
              href="/contact"
              className="p-6 rounded-xl border border-border-default bg-surface-primary hover:border-accent-pine transition-colors group block space-y-2"
            >
              <span className="font-mono text-xs text-accent-pine uppercase tracking-wider block">03 // Dialogue</span>
              <h3 className="font-serif text-lg text-ink-primary group-hover:text-accent-pine transition-colors">
                Start An Enquiry &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Initiate a project dialogue or schedule an architectural discussion.
              </p>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

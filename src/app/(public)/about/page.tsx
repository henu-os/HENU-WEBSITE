import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EcosystemStoryVisualizer } from "@/components/features/about/ecosystem-story-visualizer";
import { AboutHeroSection } from "@/components/features/about/about-hero-section";
import { AboutPillarsGrid } from "@/components/features/about/about-pillars-grid";
import { AboutChapterVisual } from "@/components/features/about/about-chapter-visual";
import { AboutTestimonials } from "@/components/features/about/about-testimonials";
import { AmbientLivingMesh } from "@/components/ui/ambient-living-mesh";
import { aboutService } from "@/server/services/about.service";
import type { AboutChapter, TimelineEntry } from "@/types/domain";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await aboutService.getPublicAboutContent();

  return {
    title: "About The Company // Sovereign Computing Ecosystem — HENU",
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
    <div className="relative py-12 sm:py-20 overflow-hidden">
      {/* Living Ambient Warm Champagne Gold Mesh */}
      <AmbientLivingMesh variant="gold" />

      <Container size="lg" className="relative z-10 space-y-20 sm:space-y-28">
        {/* 1. Hero Section (Split 2-Column: Left Prose + Right Admin-Configured Image) */}
        <AboutHeroSection
          visionStatement={content.vision_statement}
          missionStatement={content.mission_statement}
          heroImageUrl={content.hero_image_url}
        />

        {/* 2. The Company Story & Origin */}
        <section
          aria-label="The Story Behind HENU"
          className="rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#f4eee2] dark:from-[#0d1624] dark:via-[#0b131e] dark:to-[#08101a] p-8 sm:p-12 shadow-elevated relative overflow-hidden space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d4af37]/25 gap-2">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] font-semibold block">
                The Company Story // Sovereign Mandate
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#122238] dark:text-[#edf2f7] font-normal">
                Why We Built HENU
              </h2>
            </div>
            <span className="font-mono text-xs text-ink-muted px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/20 self-start sm:self-auto">
              EST. 2024 &bull; ZERO DEBT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-ink-secondary leading-relaxed font-sans text-base">
            <div className="space-y-4">
              <p>
                Computing was originally conceived as an intellectual bicycle for the human mind—an empowering, private instrument of sovereign agency. Over the last two decades, however, mainstream software was quietly transformed into an extraction economy: endless subscription rents, pervasive cloud tracking, and forced corporate lock-in.
              </p>
              <p>
                HENU was founded by a collective of systems architects, security researchers, and software engineers who asked a fundamental question: <span className="text-ink-primary font-medium">What if computing tools were once again built to be owned forever, execute offline without cloud leashes, and treat human operators with absolute dignity?</span>
              </p>
            </div>
            <div className="space-y-4">
              <p>
                From this imperative, the HENU product continuum was born. We did not build an isolated utility—we engineered an interconnected sovereign stack: a verifiable operating foundation (<strong className="text-ink-primary">HENU OS</strong>), local air-gapped machine intelligence (<strong className="text-ink-primary">HENU AI</strong>), a bare-metal automation agent (<strong className="text-ink-primary">HENU PA</strong>), and a sub-frame latency developer environment (<strong className="text-ink-primary">HENU IDE</strong>).
              </p>
              <p>
                Today, HENU operates as a sovereign software house and enterprise engineering partner. We deliver production systems that execute cleanly on bare metal, protected by double-entry audit ledgers and unconditional IP ownership.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The Four Pillars of Sovereign Architecture */}
        <section aria-label="Core Foundational Pillars">
          <AboutPillarsGrid />
        </section>

        {/* 4. Interactive 3D Product & Architecture Visualizer Instrument (Image 2) */}
        <section aria-label="Ecosystem Story Visualizer">
          <EcosystemStoryVisualizer chapters={chapters} />
        </section>

        {/* 5. Institutional Trust & Client Testimonials */}
        <AboutTestimonials />

        {/* 4. Chapters Storytelling Grid (Narrative Architecture) */}
        <section aria-label="About Story Chapters" className="space-y-12">
          <div className="border-b border-[#d4af37]/30 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block">
                Chapter Index // Narrative Architecture
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                Sovereign Technical Chronicle
              </h2>
            </div>
            <span className="font-mono text-[11px] text-ink-muted">
              {chapters.length} PUBLISHED FOLIOS
            </span>
          </div>

          {chapters.length === 0 ? (
            <div
              role="region"
              aria-label="No published chapters"
              className="border border-[#d4af37]/30 rounded-xl p-8 sm:p-12 text-center space-y-3 bg-[#faf8f4] dark:bg-[#0d1624]"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-[#8c6b1b] dark:text-[#dfba5f]">
                Archive Status // Confidential
              </span>
              <h2 className="font-serif text-2xl text-ink-primary">Narrative Chapters In Review</h2>
              <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
                Detailed institutional disclosures are currently undergoing review. Check back for verified publication releases.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {chapters.map((chapter, idx) => (
                <article
                  key={chapter.id}
                  className="group rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#f4eee2] dark:from-[#0d1624] dark:via-[#0b131e] dark:to-[#08101a] p-6 sm:p-10 shadow-subtle hover:border-[#d4af37]/50 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Number, Title, Metadata & Prose */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] px-2.5 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                          FOLIO {chapter.chapter_number || `0${idx + 1}`}
                        </span>
                        {chapter.subtitle && (
                          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                            {chapter.subtitle}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl text-[#122238] dark:text-[#edf2f7] font-normal leading-snug">
                        {chapter.title}
                      </h3>

                      <p className="font-sans text-base text-ink-secondary leading-relaxed whitespace-pre-line">
                        {chapter.content}
                      </p>

                      {chapter.tags && chapter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#d4af37]/15">
                          {chapter.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="neutral"
                              size="sm"
                              className="font-mono text-[10px] bg-surface-primary/70 dark:bg-[#111927] border-[#d4af37]/20 text-ink-secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Bespoke Architectural Vector Schematic */}
                    <div className="lg:col-span-5">
                      <AboutChapterVisual
                        chapterIndex={idx}
                        chapterNumber={chapter.chapter_number}
                        title={chapter.title}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 5. Verified Operational Timeline */}
        {timelineEntries.length > 0 && (
          <section aria-label="Verified Institutional Timeline" className="space-y-12">
            <div className="border-b border-[#d4af37]/30 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block">
                  Chronology // Verified Milestones
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                  Operational Timeline
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[#8c6b1b] dark:text-[#dfba5f] font-semibold px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                AUDITED PROVENANCE
              </span>
            </div>

            <div className="relative border-l-2 border-[#d4af37]/40 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-10">
              {timelineEntries.map((entry) => (
                <div key={entry.id} className="relative group">
                  {/* Timeline Gold Node Indicator */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-primary bg-[#c59b27] shadow-xs group-hover:scale-125 transition-transform" />

                  <div className="rounded-xl border border-[#d4af37]/25 bg-gradient-to-br from-[#faf8f4] to-[#f4eee2] dark:from-[#0d1624] dark:to-[#08101a] p-5 sm:p-6 space-y-3 shadow-subtle group-hover:border-[#d4af37]/50 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#8c6b1b] dark:text-[#dfba5f]">
                        {entry.date_formatted || entry.year}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted px-2 py-0.5 rounded bg-surface-primary border border-border-default">
                        Witnessed Milestone
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#122238] dark:text-[#edf2f7] font-normal">
                      {entry.title}
                    </h3>

                    <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-2xl leading-relaxed">
                      {entry.description}
                    </p>

                    {/* Verified Evidence Footer */}
                    <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#64748b] border-t border-[#d4af37]/15">
                      <span>Source: {entry.verified_source}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Witness: {entry.verified_owner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Sovereign Dialogue & Institutional Engagement */}
        <section
          aria-label="Engage With The Collective"
          className="rounded-2xl border border-[#d4af37]/35 bg-gradient-to-br from-[#faf8f4] via-[#f7f2e6] to-[#f3ebd8] dark:from-[#0d1624] dark:to-[#08101a] p-8 sm:p-12 shadow-elevated relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] font-semibold block">
              Engagement // Dialogue
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#122238] dark:text-[#edf2f7] font-normal">
              Partner With The Sovereign Collective
            </h2>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed">
              HENU collaborates with institutions and engineering teams committed to lasting software durability, privacy sovereignty, and high-performance system design.
            </p>
          </div>
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#c59b27] via-[#d4af37] to-[#dfba5f] text-[#0c1420] hover:brightness-110 shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <span>Initiate Dialogue</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

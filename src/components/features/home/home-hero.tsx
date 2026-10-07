import React from "react";
import type { HomeContent } from "@/types/domain";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";

interface HomeHeroProps {
  content: HomeContent;
}

/**
 * HOME-001: Home Opening & Page Shell.
 * Asymmetric display-xl headline, static chromatic Spectrum field, dual CTAs.
 * Works with or without JavaScript, fast LCP, real h1, strict contrast.
 */
export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section
      aria-label="Welcome to HENU"
      className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Asymmetric Statement (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-accent-spectral font-semibold">
                Technology Ecosystem
              </span>
              <span className="h-px w-8 bg-border-default" aria-hidden="true" />
              <Badge variant="outline" size="sm">
                V1 Foundation
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ink-primary leading-[1.05] mb-6">
              {content.hero_statement}
            </h1>

            <p className="font-sans text-lg sm:text-xl text-ink-secondary leading-relaxed mb-8 max-w-2xl">
              {content.hero_supporting_line}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <LinkButton
                href={content.hero_primary_cta_target}
                variant="primary"
                size="lg"
                id="hero-primary-cta"
              >
                {content.hero_primary_cta_label}
              </LinkButton>

              <LinkButton
                href={content.hero_secondary_cta_target}
                variant="secondary"
                size="lg"
                id="hero-secondary-cta"
              >
                {content.hero_secondary_cta_label}
              </LinkButton>
            </div>
          </div>

          {/* Right Column: Static Chromatic Spectrum Field (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              aria-hidden="true"
              className="relative w-full max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-border-default shadow-sm bg-surface-secondary flex flex-col justify-between p-6"
            >
              {/* CSS Chromatic Mesh Background */}
              <div className="absolute inset-0 spectrum-field opacity-85" />

              {/* Architectural Framing Elements */}
              <div className="relative z-10 flex justify-between items-start font-mono text-[10px] text-ink-muted uppercase tracking-wider select-none">
                <span>SPEC-SYS.V1</span>
                <span>4-HUE SPECTRUM</span>
              </div>

              <div className="relative z-10 p-5 rounded-lg bg-surface-primary/75 backdrop-blur-md border border-border-subtle shadow-xs">
                <span className="font-mono text-xs font-semibold text-ink-primary block mb-1">
                  HENU Architecture
                </span>
                <p className="font-sans text-xs text-ink-secondary leading-normal">
                  OS &bull; Artificial Intelligence &bull; Personal Assistant &bull; Integrated Dev Environment
                </p>
              </div>

              <div className="relative z-10 flex justify-between items-end font-mono text-[10px] text-ink-muted uppercase tracking-wider select-none">
                <span>01 // OS</span>
                <span>04 // IDE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Foundational Pillars Section (Database-Connected Teasers) */}
        <div className="mt-20 md:mt-28 pt-12 border-t border-border-default grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-accent-spectral font-bold uppercase tracking-wider">
                  Flagship
                </span>
                <Badge variant="warning" size="sm">
                  In Development
                </Badge>
              </div>
              <h2 className="font-display text-xl font-bold text-ink-primary mb-2">
                {content.flagship_headline}
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {content.flagship_summary}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <LinkButton href="/products/henu-os" variant="ghost" size="sm">
                Explore HENU OS &rarr;
              </LinkButton>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-accent-spectral font-bold uppercase tracking-wider">
                  Capabilities
                </span>
                <Badge variant="outline" size="sm">
                  Catalogue
                </Badge>
              </div>
              <h2 className="font-display text-xl font-bold text-ink-primary mb-2">
                Engineering Services
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {content.services_intro}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <LinkButton href="/services" variant="ghost" size="sm">
                View Services &rarr;
              </LinkButton>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-accent-spectral font-bold uppercase tracking-wider">
                  Principles
                </span>
                <Badge variant="outline" size="sm">
                  Mission
                </Badge>
              </div>
              <h2 className="font-display text-xl font-bold text-ink-primary mb-2">
                Our Philosophy
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {content.about_teaser}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <LinkButton href="/about-us" variant="ghost" size="sm">
                Read About Us &rarr;
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

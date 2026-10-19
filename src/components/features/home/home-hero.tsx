import Image from "next/image";
import type { HomeContent } from "@/types/domain";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { HomeHeroHeadline } from "./home-hero-headline";

interface HomeHeroProps {
  content: HomeContent;
}

/**
 * HOME-001: Home Opening & Page Shell.
 * Asymmetric display-xl headline, static chromatic Spectrum field, dual CTAs.
 * Right column displays the admin-configured hero visual asset (defaults to HENU OS).
 */
export function HomeHero({ content }: HomeHeroProps) {
  const activeHeroImage = content.hero_image_url?.trim() || "/brand/henu-os.png";

  return (
    <section
      aria-label="Welcome to HENU"
      className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Asymmetric Statement (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <HomeHeroHeadline heroStatement={content.hero_statement} />

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

          {/* Right Column: Hero Visual Asset (Admin configurable, defaults to HENU OS) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-border-default shadow-elevated bg-gradient-to-b from-[#f9f5ff]/90 via-[#f4edff]/70 to-[#ede2fe]/90 dark:from-[#130826]/90 dark:via-[#190a33]/80 dark:to-[#0f0520]/95 backdrop-blur-md flex items-center justify-center p-6 group transition-all duration-300 hover:shadow-2xl">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={activeHeroImage}
                  alt="HENU Sovereign Computing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                  className="object-contain drop-shadow-md select-none transition-transform duration-500 group-hover:scale-[1.02]"
                  unoptimized={activeHeroImage.startsWith("http")}
                />
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

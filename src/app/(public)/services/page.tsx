import type { Metadata } from "next";
import { serviceService } from "@/server/services/service.service";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ServiceIndexLedger } from "@/components/features/services/service-index-ledger";
import { ServicesHeroHeadline } from "@/components/features/services/services-hero-headline";
import { ServicesHeroVisual } from "@/components/features/services/services-hero-visual";

export const metadata: Metadata = {
  title: "Services // Architectural Catalogue — HENU",
  description:
    "Engineering, intelligence, and brand growth capabilities built for ambitious technical enterprises.",
  openGraph: {
    title: "HENU Services — Engineering & Technical Capabilities",
    description:
      "Explore HENU's disciplined service capabilities across Build, Intelligence, and Brand & Growth.",
    type: "website",
  },
};

export const revalidate = 3600; // 1 hour ISR, revalidated on mutation

export default async function ServicesPage() {
  const [categoryGroups, heroSettings] = await Promise.all([
    serviceService.getPublishedServicesGrouped(),
    serviceService.getServicesHeroSettings(),
  ]);

  return (
    <div className="w-full relative">
      {/* Editorial Intro Hero */}
      <Section className="pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 border-b border-border-default bg-surface-primary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & Navigation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="neutral">System Capability</Badge>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Catalogue 2026.1
                </span>
              </div>

              {/* Interactive Hero Headline with Colored Focal Phrase */}
              <ServicesHeroHeadline />

              <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-sans max-w-2xl">
                We operate across deep software engineering, sovereign AI agent architectures,
                and technical brand design. Every service is delivered with engineering discipline,
                zero bloated consulting theater, and strict regulatory awareness.
              </p>

              {/* Quick Category Anchors if categories exist with distinctive color highlights */}
              {categoryGroups.length > 0 && (
                <nav aria-label="Service categories navigation" className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted self-center mr-2">
                    Jump to:
                  </span>
                  {categoryGroups.map((group, index) => {
                    const slug = group.category.slug.toLowerCase();
                    let hoverClass = "hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300";
                    let dotColor = "bg-emerald-500";
                    if (slug.includes("intelligence") || index === 1) {
                      hoverClass = "hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300";
                      dotColor = "bg-indigo-500";
                    } else if (slug.includes("brand") || index === 2) {
                      hoverClass = "hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300";
                      dotColor = "bg-amber-500";
                    }

                    return (
                      <a
                        key={group.category.id}
                        href={`#category-${group.category.slug}`}
                        className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-border-default/80 bg-surface-secondary/70 text-ink-secondary transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${hoverClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <span>{String(index + 1).padStart(2, "0")} {group.category.name}</span>
                      </a>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Right Column: Admin-Configurable Image/Video Hero Visual */}
            <div className="lg:col-span-5">
              <ServicesHeroVisual media={heroSettings} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Ledger Section — Compacted spacing */}
      <Section className="pt-8 sm:pt-10 pb-8 sm:pb-12">
        <Container>
          <ServiceIndexLedger categoryGroups={categoryGroups} />
        </Container>
      </Section>

      {/* Governance & Integrity Note — Centered, balanced spacing, and framed */}
      <Section className="py-8 sm:py-10 border-t border-border-default bg-surface-secondary/40">
        <Container>
          <div className="mx-auto max-w-2xl flex flex-col items-center text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary bg-surface-primary px-3 py-1 rounded-full border border-border-default shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-ink-muted" />
              Engagement Integrity &amp; Compliance
            </span>
            <p className="text-xs text-ink-muted leading-relaxed font-sans">
              HENU provides architectural, design, technological, and startup coordination services.
              Services marked with regulatory disclaimers (including Legal Services and Funding Solutions)
              function solely as advisory coordination and technical documentation assistance; HENU does not
              act as a licensed law firm or registered financial broker-dealer. All public engagements are
              scoped strictly under custom bilateral contracts.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

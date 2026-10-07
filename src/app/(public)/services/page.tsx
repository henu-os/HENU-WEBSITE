import type { Metadata } from "next";
import { serviceService } from "@/server/services/service.service";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ServiceIndexLedger } from "@/components/features/services/service-index-ledger";

export const metadata: Metadata = {
  title: "Services // Architectural Catalogue — HENU",
  description:
    "Engineering, intelligence, and business foundational capabilities built for ambitious technical enterprises.",
  openGraph: {
    title: "HENU Services — Engineering & Foundational Capabilities",
    description:
      "Explore HENU's disciplined service capabilities across Build, Intelligence, Brand & Growth, and Business Foundations.",
    type: "website",
  },
};

export const revalidate = 3600; // 1 hour ISR, revalidated on mutation

export default async function ServicesPage() {
  const categoryGroups = await serviceService.getPublishedServicesGrouped();

  return (
    <div className="w-full relative">
      {/* Editorial Intro Hero */}
      <Section className="pt-32 pb-16 border-b border-border-default bg-surface-primary">
        <Container>
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="neutral">System Capability</Badge>
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                Catalogue 2026.1
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1]">
              Architectural capabilities for high-conviction ventures.
            </h1>

            <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-sans max-w-3xl">
              We operate across deep software engineering, sovereign AI agent architectures,
              technical brand design, and structured startup governance. Every service is delivered
              with engineering discipline, zero bloated consulting theater, and strict regulatory
              awareness.
            </p>

            {/* Quick Category Anchors if categories exist */}
            {categoryGroups.length > 0 && (
              <nav aria-label="Service categories navigation" className="pt-4 flex flex-wrap gap-2 sm:gap-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted self-center mr-2">
                  Jump to:
                </span>
                {categoryGroups.map((group, index) => (
                  <a
                    key={group.category.id}
                    href={`#category-${group.category.slug}`}
                    className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-border-default hover:border-ink-primary/40 bg-surface-secondary text-ink-secondary hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {String(index + 1).padStart(2, "0")} {group.category.name}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </Container>
      </Section>

      {/* Main Ledger Section */}
      <Section className="py-20 lg:py-28">
        <Container>
          <ServiceIndexLedger categoryGroups={categoryGroups} />
        </Container>
      </Section>

      {/* Governance & Integrity Note */}
      <Section className="py-16 border-t border-border-default bg-surface-secondary">
        <Container>
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Engagement Integrity & Compliance
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

import type { Metadata } from "next";
import { portfolioService } from "@/server/services/portfolio.service";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PortfolioIndexView } from "@/components/features/portfolio/portfolio-index-view";

export const metadata: Metadata = {
  title: "Portfolio // Architectural Proof & Case Studies — HENU",
  description:
    "Explore sovereign software systems, enterprise ledgers, and intelligent automation platforms engineered by HENU.",
  openGraph: {
    title: "HENU Portfolio — Sovereign Architectural Systems & Case Studies",
    description:
      "Verified engineering artifacts, system case studies, and confirmed technical outcomes from the HENU ecosystem.",
    type: "website",
  },
};

export const revalidate = 3600; // 1 hour ISR, revalidated on mutation

interface PortfolioPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const activeCategorySlug = resolvedParams.category || "all";

  const [projects, categories] = await Promise.all([
    portfolioService.getPublishedProjects(activeCategorySlug),
    portfolioService.getCategories(),
  ]);

  return (
    <div className="w-full relative">
      {/* Editorial Intro Hero */}
      <Section className="pt-32 pb-12 border-b border-border-default bg-surface-primary">
        <Container>
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="neutral">Verified Deployments</Badge>
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                System Portfolio // V1
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1]">
              Architectural proof and deployed sovereign systems.
            </h1>

            <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-sans max-w-3xl">
              A curated index of production software, automated reasoning pipelines, and computing platforms built by HENU. Every published project adheres to rigorous disclosure boundaries, verified metrics, and sovereign architectural integrity.
            </p>
          </div>
        </Container>
      </Section>

      {/* Portfolio Asymmetric Grid Section */}
      <Section spacing="lg" className="bg-surface-primary">
        <Container>
          <PortfolioIndexView
            projects={projects}
            categories={categories}
            activeCategorySlug={activeCategorySlug}
          />
        </Container>
      </Section>
    </div>
  );
}

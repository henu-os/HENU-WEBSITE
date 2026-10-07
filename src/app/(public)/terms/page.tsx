import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Engagement // Sovereign System Charter — HENU",
  description:
    "HENU sovereign computing terms of service, engagement conditions, licensing boundaries, and intellectual property terms.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-12">
        <header className="space-y-4 border-b border-border-default pb-8">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              LEGAL // GOVERNANCE
            </Badge>
            <span className="font-mono text-xs text-ink-muted">Effective Date: October 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-primary font-normal tracking-tight">
            Terms of System Engagement
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
            These terms govern your access to the HENU digital portal, architectural publications, software manifests, and advisory services.
          </p>
        </header>

        <article className="space-y-10 font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              1. Informational &amp; Research Access
            </h2>
            <p>
              The material published across this portal—including product specifications, whitepapers, architectural schematics, and timeline archives—is provided for engineering inspection, prospective client qualification, and research review. Reproduction or scraping for unauthorized commercial re-licensing without written consent is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              2. Sovereign Software &amp; Artifact Licensing
            </h2>
            <p>
              Open software artifacts, kernel manifests, and toolchains published by HENU are licensed under their respective distributed licenses (e.g., MIT, Apache 2.0, or specific enclave agreements). Cryptographic release manifests provided on the <Link href="/products/henu-os" className="text-accent-pine underline hover:text-accent-pine/80">HENU OS specification</Link> are provided to ensure build reproducibility.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              3. Professional Engineering Advisory (Services)
            </h2>
            <p>
              Engagement with HENU for bespoke system architecture, private cloud development, or kernel consulting is conducted exclusively under formal, bilateral Statements of Work (SOW). Public website interactions do not constitute a binding architectural retainer or contract.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              4. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p>
              While all specifications published on this platform represent our truthful architectural state, public portal information is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. HENU disclaims all express or implied warranties to the maximum extent permitted by applicable law.
            </p>
          </section>
        </article>

        <footer className="pt-8 border-t border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-xs text-ink-muted">
          <span>HENU Sovereign Technologies</span>
          <Link href="/privacy" className="text-accent-pine hover:underline">
            View Privacy Policy &rarr;
          </Link>
        </footer>
      </Container>
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy // Sovereign Zero-Telemetry Charter — HENU",
  description:
    "HENU sovereign computing privacy policy: Zero unsolicited telemetry, cookieless operation, and minimal data retention.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-12">
        <header className="space-y-4 border-b border-border-default pb-8">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              LEGAL // DISCLOSURE
            </Badge>
            <span className="font-mono text-xs text-ink-muted">Effective Date: October 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-primary font-normal tracking-tight">
            Sovereign Privacy &amp; Zero-Telemetry Policy
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
            HENU is founded upon the principle that technological infrastructure should respect operator autonomy. We build operating systems and digital platforms designed to function without surveillance.
          </p>
        </header>

        <article className="space-y-10 font-sans text-sm sm:text-base text-ink-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              1. Cookieless &amp; Zero-Telemetry Architecture
            </h2>
            <p>
              The public HENU website does not deploy third-party advertising cookies, cross-site trackers, session replay scripts, or external analytics beacons. Browsing our published research, product manifests, and portfolio ledger generates zero tracking identifiers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              2. Voluntary Enquiry Data Collection
            </h2>
            <p>
              When you submit a project enquiry through our <Link href="/contact" className="text-accent-pine underline hover:text-accent-pine/80">Contact interface</Link>, we collect only the information you explicitly provide:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink-secondary">
              <li>Full Name and Professional Title</li>
              <li>Organizational Affiliation</li>
              <li>Verified Contact Email</li>
              <li>Project Intent and Architectural Brief</li>
            </ul>
            <p>
              This data is retained exclusively for the purpose of architectural dialogue and client qualification. It is never sold, leased, or transmitted to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              3. Server Logs &amp; Operational Security
            </h2>
            <p>
              To maintain system availability and mitigate distributed denial-of-service (DDoS) attempts, our hosting infrastructure processes standard HTTP connection metadata (IP address, user-agent, request timestamp). These ephemeral logs are retained only for security analysis and rotated automatically according to least-retention protocols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-primary font-normal">
              4. Data Subject Rights &amp; Contact
            </h2>
            <p>
              You have the right to inspect, correct, or request deletion of any enquiry information submitted to HENU. To exercise these rights, direct verified communication to our privacy officers via <Link href="/contact" className="text-accent-pine underline hover:text-accent-pine/80">our secure enquiry channel</Link>.
            </p>
          </section>
        </article>

        <footer className="pt-8 border-t border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-xs text-ink-muted">
          <span>HENU Sovereign Technologies</span>
          <Link href="/terms" className="text-accent-pine hover:underline">
            View Terms of Engagement &rarr;
          </Link>
        </footer>
      </Container>
    </div>
  );
}

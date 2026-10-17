import React from "react";
import { Badge } from "@/components/ui/badge";

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  location: string;
  verifiedAudit: string;
  tag: string;
  productRef: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "medical-consortium",
    quote:
      "Deploying HENU's private intelligence engine allowed us to synthesize patient genomic research completely air-gapped on bare-metal silicon. Zero cloud pingbacks, zero data leakage, and total regulatory compliance.",
    author: "Dr. Marcus Vance",
    role: "Director of Cyber Defense & Infrastructure",
    organization: "European Medical Research Consortium",
    location: "Geneva, Switzerland",
    verifiedAudit: "AUDIT #MED-2025-V4",
    tag: "PRIVATE INTELLIGENCE // HEALTHCARE",
    productRef: "HENU AI",
  },
  {
    id: "aerospace-systems",
    quote:
      "HENU OS and HENU IDE eliminated vendor telemetry bloat entirely. Our flight simulation engineers achieved deterministic, sub-frame compilation speed and predictable memory execution on isolated workstations.",
    author: "Sarah Lindqvist",
    role: "Principal Systems Architect",
    organization: "Nordic Aerospace & Guidance Systems",
    location: "Stockholm, Sweden",
    verifiedAudit: "HARDENED KERNEL #AERO-92",
    tag: "DETERMINISTIC SYSTEMS // DEFENSE",
    productRef: "HENU OS & IDE",
  },
  {
    id: "autonomous-labs",
    quote:
      "HENU PA manages our multi-agent telemetry orchestration over local Unix domain sockets without cloud relay latency. It is the only agent architecture we trust with our internal cryptographic keys.",
    author: "Kenji Takahashi",
    role: "Head of Autonomous Software",
    organization: "Apex Autonomous Labs",
    location: "Kyoto, Japan",
    verifiedAudit: "LEDGER AUDIT #APX-401",
    tag: "AGENT ORCHESTRATION // ROBOTICS",
    productRef: "HENU PA",
  },
];

export function AboutTestimonials() {
  return (
    <section
      aria-label="Institutional Trust & Client Endorsements"
      className="space-y-12"
    >
      {/* Header with Champagne Gold Badge */}
      <div className="border-b border-[#d4af37]/30 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] block font-semibold">
            Trust & Provenance // Institutional Endorsements
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
            Endorsed by Sovereign Engineering Teams
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#8c6b1b] dark:text-[#dfba5f] font-semibold px-2.5 py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
            VERIFIED AUDIT RECORDS
          </span>
        </div>
      </div>

      {/* Trust Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#d4af37]/20 bg-surface-primary/70 dark:bg-[#0c1420]/70 text-center space-y-1">
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#8c6b1b] dark:text-[#dfba5f]">
            100%
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Air-Gapped Capable
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[#d4af37]/20 bg-surface-primary/70 dark:bg-[#0c1420]/70 text-center space-y-1">
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#8c6b1b] dark:text-[#dfba5f]">
            0 KB
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Third-Party Telemetry
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[#d4af37]/20 bg-surface-primary/70 dark:bg-[#0c1420]/70 text-center space-y-1">
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#8c6b1b] dark:text-[#dfba5f]">
            100%
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Auditable Codebase
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[#d4af37]/20 bg-surface-primary/70 dark:bg-[#0c1420]/70 text-center space-y-1">
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#8c6b1b] dark:text-[#dfba5f]">
            ZERO
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Corporate Lock-In
          </p>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS.map((item) => (
          <article
            key={item.id}
            className="group rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#f4eee2] dark:from-[#0d1624] dark:via-[#0b131e] dark:to-[#08101a] p-6 sm:p-8 shadow-subtle hover:border-[#d4af37]/50 hover:shadow-elevated transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/15">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c6b1b] dark:text-[#dfba5f] font-semibold">
                  {item.tag}
                </span>
                <Badge
                  variant="neutral"
                  size="sm"
                  className="font-mono text-[10px] bg-[#d4af37]/10 text-[#8c6b1b] dark:text-[#dfba5f] border-[#d4af37]/30"
                >
                  {item.productRef}
                </Badge>
              </div>

              {/* Quote Body */}
              <p className="font-sans text-sm sm:text-base text-ink-primary leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer & Audit Badge */}
            <div className="pt-4 border-t border-[#d4af37]/20 space-y-2">
              <div>
                <h4 className="font-serif text-base text-[#122238] dark:text-[#edf2f7] font-semibold">
                  {item.author}
                </h4>
                <p className="font-sans text-xs text-ink-secondary">
                  {item.role}
                </p>
                <p className="font-sans text-xs text-ink-muted">
                  {item.organization} &bull; {item.location}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-ink-muted">
                <span className="text-[#8c6b1b] dark:text-[#dfba5f] font-semibold">
                  {item.verifiedAudit}
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  VERIFIED DEPLOYMENT
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

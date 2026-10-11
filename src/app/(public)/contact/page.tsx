import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteSettingsRepository } from "@/server/repositories/site-settings.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { productRepository } from "@/server/repositories/product.repository";
import { generateTimingToken } from "@/server/security/timing-token";
import { ContactFormClient } from "./contact-form-client";
import { ContactHeroHeadline } from "@/components/features/contact/contact-hero-headline";
import { AmbientLivingMesh } from "@/components/ui/ambient-living-mesh";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Dialogue // Sovereign Dispatch — HENU",
  description:
    "Initiate an architectural project enquiry or schedule an engineering consultation with the HENU team.",
  alternates: {
    canonical: "/contact",
  },
};

interface ContactPageProps {
  searchParams: Promise<{
    service?: string;
    product?: string;
    interest?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const settings = await siteSettingsRepository.getSettings();

  // Validate contextual preselection against real database catalogs
  let initialInterestType: "service" | "product" | "general" | "partnership" = "general";
  let initialInterestRef = "";

  if (params.service) {
    const services = await serviceRepository.listPublishedServices();
    const match = services.find((s) => s.slug === params.service?.toLowerCase());
    if (match) {
      initialInterestType = "service";
      initialInterestRef = match.name;
    }
  } else if (params.product) {
    const { products } = await productRepository.listAllProducts();
    const match = products.find((p) => p.slug === params.product?.toLowerCase());
    if (match) {
      initialInterestType = "product";
      initialInterestRef = match.name;
    }
  } else if (
    params.interest &&
    ["service", "product", "general", "partnership"].includes(params.interest)
  ) {
    initialInterestType = params.interest as any;
  }

  // Generate a fresh timing token on the server
  const timingToken = generateTimingToken();

  const calendlyUrl =
    settings.calendly_url && settings.calendly_url.trim() !== "https://calendly.com"
      ? settings.calendly_url
      : "https://calendly.com/henuos";
  const contactEmail = settings.contact_email || "contact@henu.dev";

  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      {/* Living Ambient Warm Cordovan / Rose-Bronze Mesh */}
      <AmbientLivingMesh variant="cordovan" />

      <Container size="lg" className="relative z-10 space-y-16 sm:space-y-24">
        {/* 1. Header Framing Statement with Live Dispatch Telemetry */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9f1239]/10 border border-[#9f1239]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9f1239] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#881337]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#9f1239] dark:text-[#fb7185] font-semibold">
                Channel // Sovereign Dispatch Desk Active
              </span>
            </div>

            {/* Interactive Classy 2-Line Headline with Hover Perspective Flip */}
            <ContactHeroHeadline />

            <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Initiate a confidential project transmission or reserve focused consultation time directly on our systems architecture calendar. Transmissions bypass marketing intermediaries and route directly to principal technical leads.
            </p>

            {/* Sovereign Intake Guarantees Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted border-t border-[#9f1239]/15">
              <span className="flex items-center gap-1.5 text-ink-primary font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239]" />
                Zero Sales Intermediaries
              </span>
              <span aria-hidden="true" className="text-border-default">&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#be5b3a]" />
                &lt; 48h Technical Evaluation
              </span>
              <span aria-hidden="true" className="text-border-default">&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                Air-Gapped Sovereign Intake
              </span>
            </div>
          </div>

          {/* Right Column: Diplomatic Telemetry Instrument */}
          <div className="lg:col-span-4">
            <div className="p-5 sm:p-6 rounded-2xl border border-[#9f1239]/25 bg-gradient-to-br from-[#faf7f6]/95 to-[#f7f0ef]/70 dark:from-[#160f13]/95 dark:to-[#0e0a0d]/70 backdrop-blur-md font-mono text-xs text-ink-secondary space-y-3.5 shadow-elevated relative overflow-hidden">
              {/* Subtle Drafting Grid */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to right, #9f1239 1px, transparent 1px), linear-gradient(to bottom, #9f1239 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative flex justify-between items-center pb-2.5 border-b border-[#9f1239]/20 text-[10px]">
                <span className="font-bold text-[#9f1239] dark:text-[#fb7185] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239]" />
                  CHANCERY // PROTOCOL V1.2
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  DESK ACTIVE
                </span>
              </div>

              <div className="relative space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">SECURITY:</span>
                  <span className="text-ink-primary font-semibold">AIR-GAPPED ROUTE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">TELEMETRY:</span>
                  <span className="text-[#9f1239] dark:text-[#fb7185] font-semibold">ZERO COOKIES / NO CRM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">PEER STATUS:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">PRINCIPALS ON DESK</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted">CIPHER TOKEN:</span>
                  <span className="text-ink-muted font-mono text-[10px]">ED25519 VERIFIED</span>
                </div>
              </div>

              <div className="relative pt-2 border-t border-[#9f1239]/15 flex items-center justify-between text-[10px] text-ink-muted">
                <span>HASH: #4A9F2E-DISP</span>
                <span className="text-emerald-600 font-semibold">✓ CIPHER VALID</span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Dual Conversion Paths Grid (Comprehensive Dossier vs Synchronous Calendar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* PATH A (Primary): Enquiry Form — 7 Cols */}
          <section
            aria-labelledby="enquiry-heading"
            className="lg:col-span-7 rounded-2xl border border-[#9f1239]/25 bg-gradient-to-br from-[#faf7f6] via-[#f9f3f3] to-[#f6efef] dark:from-[#150f12] dark:via-[#110c0f] dark:to-[#0d090b] p-6 sm:p-10 space-y-6 shadow-elevated relative overflow-hidden"
          >
            {/* Corner Filigree Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#9f1239]/40" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#9f1239]/40" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#9f1239]/40" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#9f1239]/40" />

            <div className="border-b border-[#9f1239]/20 pb-4 space-y-1 relative z-10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] block font-semibold">
                Path A // Comprehensive Transmission
              </span>
              <h2 id="enquiry-heading" className="font-serif text-2xl sm:text-3xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
                Start An Enquiry
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Provide architectural parameters, operational timelines, and system scopes.
              </p>
            </div>

            <div className="relative z-10">
              <ContactFormClient
                initialInterestType={initialInterestType}
                initialInterestRef={initialInterestRef}
                timingToken={timingToken}
                contactEmail={contactEmail}
              />
            </div>
          </section>

          {/* PATH B (Secondary): Calendly Meeting Panel + Response Policy — 5 Cols */}
          <div className="lg:col-span-5 space-y-8">
            <section
              aria-labelledby="calendly-heading"
              className="rounded-2xl border border-[#9f1239]/25 bg-gradient-to-br from-[#faf7f6] to-[#f5eeee] dark:from-[#150f12] dark:to-[#0e0a0c] p-6 sm:p-8 space-y-6 shadow-subtle relative overflow-hidden"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] block font-semibold">
                  Path B // Synchronous Consultation
                </span>
                <h2 id="calendly-heading" className="font-serif text-2xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
                  Schedule A Meeting
                </h2>
                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  Reserve a focused 30-minute architectural discussion directly with our systems engineering team.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#9f1239]/20 bg-surface-primary/80 dark:bg-[#120b0e] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#9f1239] dark:text-[#fb7185] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Engineering Calendar Active
                </div>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  Direct calendar synchronization via our verified sovereign scheduling endpoint. Zero third-party tracker scripts are loaded on this page.
                </p>
              </div>

              <div>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#9f1239] to-[#881337] hover:from-[#881337] hover:to-[#700d2b] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-subtle hover:shadow-elevated transition-all min-h-[46px]"
                >
                  <span>Open HENU Calendly Desk</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>

            {/* Direct Channel & Response Policy Card */}
            <div className="rounded-2xl border border-[#9f1239]/20 bg-surface-primary dark:bg-[#120b0e] p-6 sm:p-8 space-y-4 shadow-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] block font-semibold">
                Protocol // Response Windows &amp; Guarantees
              </span>
              <h3 className="font-serif text-xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
                What Happens When You Contact HENU
              </h3>
              <ul className="font-sans text-xs sm:text-sm text-ink-secondary space-y-3.5 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#9f1239] font-bold">&bull;</span>
                  <span><strong>Zero Sales Pipeline:</strong> You communicate directly with systems architects and product engineers, not aggressive marketing SDRs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#9f1239] font-bold">&bull;</span>
                  <span><strong>Two Business Days SLA:</strong> Detailed technical submissions receive an initial architectural evaluation within 48 business hours.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-[#9f1239] font-bold">&bull;</span>
                  <span><strong>Data Sovereignty:</strong> Submitted requirements are never shared with advertising broker networks, CRMs, or third parties.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#9f1239]/15 text-xs font-mono text-ink-muted flex items-center justify-between">
                <span>Direct inquiries:</span>
                <a href={`mailto:${contactEmail}`} className="text-[#9f1239] dark:text-[#fb7185] font-semibold underline">
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Alternative Diplomatic Transmission Channels */}
        <section
          aria-label="Alternative Sovereign Transmission Channels"
          className="border border-[#9f1239]/25 rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-[#faf7f6] to-[#f4ebeb] dark:from-[#140e11] dark:to-[#0d090b] space-y-6"
        >
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] block font-semibold">
              Channels // Alternative Sovereign Routes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
              Specialized Dispatch Endpoints
            </h2>
            <p className="font-sans text-sm text-ink-secondary leading-relaxed">
              For commercial software purchases, PGP communications, or urgent procurement needs, utilize our designated endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <Link
              href="/quick-buy"
              className="p-5 rounded-xl border border-[#9f1239]/20 bg-surface-primary dark:bg-[#120b0e] hover:border-[#9f1239]/60 hover:shadow-subtle transition-all group block space-y-2"
            >
              <span className="font-mono text-[10px] text-[#9f1239] dark:text-[#fb7185] uppercase tracking-wider block font-semibold">
                01 // INSTANT PROCURE
              </span>
              <h3 className="font-serif text-base text-ink-primary group-hover:text-[#9f1239] dark:group-hover:text-[#fb7185] transition-colors">
                Quick Buy Desk &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Direct Stripe checkout for verified products, retainers, and ecosystem licenses.
              </p>
            </Link>

            <Link
              href="/services"
              className="p-5 rounded-xl border border-[#9f1239]/20 bg-surface-primary dark:bg-[#120b0e] hover:border-[#9f1239]/60 hover:shadow-subtle transition-all group block space-y-2"
            >
              <span className="font-mono text-[10px] text-[#9f1239] dark:text-[#fb7185] uppercase tracking-wider block font-semibold">
                02 // CATALOGUE
              </span>
              <h3 className="font-serif text-base text-ink-primary group-hover:text-[#9f1239] dark:group-hover:text-[#fb7185] transition-colors">
                Services Directory &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Explore capabilities across Build, Intelligence, Brand &amp; Growth, and Foundations.
              </p>
            </Link>

            <a
              href={`mailto:${contactEmail}`}
              className="p-5 rounded-xl border border-[#9f1239]/20 bg-surface-primary dark:bg-[#120b0e] hover:border-[#9f1239]/60 hover:shadow-subtle transition-all group block space-y-2"
            >
              <span className="font-mono text-[10px] text-[#9f1239] dark:text-[#fb7185] uppercase tracking-wider block font-semibold">
                03 // DIRECT EMAIL
              </span>
              <h3 className="font-serif text-base text-ink-primary group-hover:text-[#9f1239] dark:group-hover:text-[#fb7185] transition-colors">
                Write To Principals &rarr;
              </h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                Send confidential documentation directly to {contactEmail}.
              </p>
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteSettingsRepository } from "@/server/repositories/site-settings.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { productRepository } from "@/server/repositories/product.repository";
import { generateTimingToken } from "@/server/security/timing-token";
import { ContactFormClient } from "./contact-form-client";

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

  const calendlyUrl = settings.calendly_url || "https://calendly.com/henuos";
  const contactEmail = settings.contact_email || "contact@henu.dev";

  return (
    <div className="py-12 sm:py-20">
      <Container size="lg" className="space-y-16 sm:space-y-24">
        {/* 1. Header Framing Statement */}
        <header className="space-y-4 max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-pine block">
            Channel // Sovereign Dispatch Desk
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-primary font-normal tracking-tight leading-[1.1]">
            Direct Architectural Dialogue
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
            Choose between initiating a detailed project enquiry or reserving time on our engineering calendar. All transmissions are received directly by our technical leads.
          </p>
        </header>

        {/* 2. Dual Conversion Paths Grid (CONTACT-001) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* PATH A (Primary): Enquiry Form — 7 Cols */}
          <section
            aria-labelledby="enquiry-heading"
            className="lg:col-span-7 border border-border-default rounded-2xl p-6 sm:p-10 bg-surface-primary space-y-6 shadow-sm"
          >
            <div className="border-b border-border-default pb-4 space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                Path A // Comprehensive Transmission
              </span>
              <h2 id="enquiry-heading" className="font-serif text-2xl text-ink-primary font-normal">
                Start An Enquiry
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Provide architectural parameters, operational timelines, and system scopes.
              </p>
            </div>

            <ContactFormClient
              initialInterestType={initialInterestType}
              initialInterestRef={initialInterestRef}
              timingToken={timingToken}
              contactEmail={contactEmail}
            />
          </section>

          {/* PATH B (Secondary): Calendly Meeting Panel + Details — 5 Cols */}
          <div className="lg:col-span-5 space-y-8">
            <section
              aria-labelledby="calendly-heading"
              className="border border-border-default rounded-2xl p-6 sm:p-8 bg-surface-secondary/40 space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                  Path B // Synchronous Consultation
                </span>
                <h2 id="calendly-heading" className="font-serif text-2xl text-ink-primary font-normal">
                  Schedule A Meeting
                </h2>
                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  Reserve a focused 30-minute architectural discussion directly with our systems engineering team.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border-default bg-surface-primary space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-ink-primary font-medium">
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
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-ink-primary text-surface-primary font-mono text-xs uppercase tracking-wider font-semibold hover:bg-ink-secondary transition-colors min-h-[44px]"
                >
                  <span>Open HENU Calendly Desk</span>
                  <span aria-hidden="true">&nearr;</span>
                </a>
              </div>
            </section>

            {/* Direct Channel & Response Policy Card */}
            <div className="border border-border-default rounded-2xl p-6 sm:p-8 bg-surface-primary space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
                Protocol // Response Windows
              </span>
              <h3 className="font-serif text-lg text-ink-primary font-normal">
                What Happens When You Contact HENU
              </h3>
              <ul className="font-sans text-xs sm:text-sm text-ink-secondary space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-accent-pine font-bold">&bull;</span>
                  <span><strong>Zero Sales Pipeline:</strong> You communicate directly with systems architects and product engineers, not aggressive marketing SDRs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-accent-pine font-bold">&bull;</span>
                  <span><strong>Two Business Days:</strong> Detailed technical submissions receive an initial evaluation within 48 business hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-accent-pine font-bold">&bull;</span>
                  <span><strong>Data Sovereignty:</strong> Submitted requirements are never shared with advertising broker networks or third parties.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-border-default text-xs font-mono text-ink-muted">
                Direct inquiries: <a href={`mailto:${contactEmail}`} className="text-accent-pine underline">{contactEmail}</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

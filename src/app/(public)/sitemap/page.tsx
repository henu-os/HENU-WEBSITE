import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { SERVICES_NAV_CATEGORIES } from "@/config/services-nav";

export const metadata: Metadata = {
  title: "Site Map // Structural Index — HENU",
  description:
    "Comprehensive site index for the HENU ecosystem. Access all core pages, engineering services, products, and direct channels.",
  alternates: {
    canonical: "/sitemap",
  },
};

export default function SitemapPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="lg" className="space-y-12 sm:space-y-16">
        {/* Page Header */}
        <header className="space-y-4 border-b border-border-default pb-8">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="font-mono text-[10px]">
              INDEX // SITE MAP
            </Badge>
            <span className="font-mono text-xs text-ink-muted">Human-Readable Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-primary font-normal tracking-tight">
            Complete Website Directory
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl">
            A comprehensive index of all published architectural pages, engineering service tracks, product manifests, and institutional contact channels across the HENU digital ecosystem.
          </p>
        </header>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section 1: Core Navigation */}
          <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-4 shadow-xs">
            <div className="border-b border-border-default pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                01 // Primary
              </span>
              <h2 className="font-serif text-xl text-ink-primary font-medium mt-1">
                Core Navigation
              </h2>
            </div>
            <ul className="space-y-3.5 text-sm list-none p-0">
              <li>
                <Link
                  href="/"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Home &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  The sovereign computing homepage and engineering overview.
                </p>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  About Us &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Founding mission, leadership ethos, and engineering standards.
                </p>
              </li>
              <li>
                <Link
                  href="/quick-buy"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Quick Buy Catalogue &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Commercial procurement catalogue with instant readiness buttons.
                </p>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Contact &amp; Dialogue Desk &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Direct architectural enquiry intake and Calendly calendar consultation.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 2: Products */}
          <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-4 shadow-xs">
            <div className="border-b border-border-default pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                02 // Systems
              </span>
              <h2 className="font-serif text-xl text-ink-primary font-medium mt-1">
                Products &amp; Ecosystem
              </h2>
            </div>
            <div className="text-xs">
              <Link
                href="/products"
                className="font-semibold text-accent-pine hover:underline inline-flex items-center gap-1 mb-3"
              >
                All Products &amp; Case Studies &rarr;
              </Link>
            </div>
            <ul className="space-y-3.5 text-sm list-none p-0">
              {siteConfig.products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                  >
                    {product.name} &rarr;
                  </Link>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    {product.tagline}
                  </p>
                </li>
              ))}
              <li>
                <Link
                  href="/products#portfolio"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Deployed Solutions &amp; Case Studies &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Verified deployments: Housing ERP, WhatsApp Automation, and HENU Mail.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 3: Legal & Technical */}
          <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-4 shadow-xs">
            <div className="border-b border-border-default pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                03 // Compliance
              </span>
              <h2 className="font-serif text-xl text-ink-primary font-medium mt-1">
                Policies &amp; Machine Feeds
              </h2>
            </div>
            <ul className="space-y-3.5 text-sm list-none p-0">
              <li>
                <Link
                  href="/privacy"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Privacy Policy &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Zero unsolicited telemetry, cookieless operation, and client privacy charter.
                </p>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                >
                  Terms of Service &rarr;
                </Link>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Standard engagement provisions, licensing, and client covenants.
                </p>
              </li>
              <li className="pt-2 border-t border-border-default">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-semibold text-accent-pine hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Raw XML Feed (sitemap.xml)</span>
                  <span aria-hidden="true">&nearr;</span>
                </a>
                <p className="text-xs text-ink-muted mt-1">
                  Standard Sitemaps Protocol XML feed formatted for automated search engine crawlers.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 4: All Services (Spanning 3 columns) */}
          <section className="md:col-span-2 lg:col-span-3 border border-border-default rounded-xl p-6 sm:p-8 bg-surface-primary space-y-6 shadow-xs">
            <div className="border-b border-border-default pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
                  04 // Engineering
                </span>
                <h2 className="font-serif text-2xl text-ink-primary font-medium mt-1">
                  Full Services Catalogue
                </h2>
              </div>
              <Link
                href="/services"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-pine hover:underline"
              >
                View Services Index &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES_NAV_CATEGORIES.map((category) => (
                <div key={category.slug} className="space-y-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary border-b border-border-default pb-1">
                    {category.num} // {category.name}
                  </h3>
                  <ul className="space-y-3 text-xs list-none p-0">
                    {category.services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="font-medium text-ink-primary hover:text-accent-pine transition-colors block"
                        >
                          {service.name} &rarr;
                        </Link>
                        <p className="text-[11px] text-ink-secondary mt-0.5 line-clamp-2">
                          {service.summary}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

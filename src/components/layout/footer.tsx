"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { FooterAmbientDragonEye } from "@/components/features/brand-animation/footer-ambient-dragon-eye";

interface FooterProps {
  footerText?: string;
  organizationName?: string;
}

const FOOTER_SERVICES = [
  { name: "Website Development", href: "/services/website-development" },
  { name: "Mobile App Development", href: "/services/mobile-app-development" },
  { name: "Software Solutions", href: "/services/software-solutions" },
  { name: "AI Automation", href: "/services/ai-automation" },
  { name: "Graphic Design", href: "/services/graphic-design" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Documentation & Startup", href: "/services/documentation-and-startup-services" },
];

export const Footer: React.FC<FooterProps> = ({
  footerText,
  organizationName = siteConfig.legalName,
}) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Ensure the copyright explicitly states 2025 as requested
  const copyrightStatement =
    footerText && !footerText.includes("2026")
      ? footerText
      : `© 2025 ${organizationName}. All rights reserved.`;

  return (
    <footer className="relative overflow-hidden border-t border-border-default bg-surface-secondary text-ink-secondary">
      {/* Ambient Void Particle Eye & Rotating Dragon Background across all pages (at z-0) */}
      <FooterAmbientDragonEye />

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1: Identity & Vision */}
          <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink-primary hover:opacity-90 transition-opacity"
            >
              <span className="relative flex h-7 w-11 shrink-0 items-center justify-center">
                <Image
                  src="/brand/henu-os.png"
                  alt="HENU OS"
                  fill
                  sizes="44px"
                  className="object-contain"
                  unoptimized
                />
              </span>
              <span>HENU OS</span>
            </Link>
            <p className="text-xs leading-relaxed text-ink-secondary max-w-sm sm:max-w-none">
              {siteConfig.description}
            </p>
            <div className="pt-1 flex justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Systems Operational
              </span>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            {/* Desktop Header */}
            <h3 className="hidden sm:block font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Services
            </h3>

            {/* Mobile Dropdown Button */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setIsServicesOpen((prev) => !prev)}
                aria-expanded={isServicesOpen}
                aria-controls="footer-services-menu"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-primary/80 backdrop-blur-xs text-ink-primary font-mono text-xs font-semibold uppercase tracking-wider hover:border-primary/50 hover:bg-surface-primary transition-all shadow-2xs group"
              >
                <span className="group-hover:text-primary transition-colors">Services</span>
                <svg
                  className={`h-4 w-4 text-ink-muted group-hover:text-primary transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180 text-primary" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Services List: Collapsible on mobile, static on desktop */}
            <div
              id="footer-services-menu"
              className={`${isServicesOpen ? "block" : "hidden"} sm:block`}
            >
              <ul className="mt-2.5 sm:mt-4 space-y-1 sm:space-y-2.5 text-xs list-none p-2 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-border-default bg-surface-primary/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none animate-in fade-in slide-in-from-top-1 duration-150">
                {FOOTER_SERVICES.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      onClick={() => setIsServicesOpen(false)}
                      className="block sm:inline-block px-3 py-1.5 sm:px-0 sm:py-0 rounded-md sm:rounded-none text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary sm:hover:bg-transparent transition-colors font-medium sm:font-normal"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Products */}
          <div>
            {/* Desktop Header */}
            <h3 className="hidden sm:block font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Products
            </h3>

            {/* Mobile Dropdown Button */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setIsProductsOpen((prev) => !prev)}
                aria-expanded={isProductsOpen}
                aria-controls="footer-products-menu"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-primary/80 backdrop-blur-xs text-ink-primary font-mono text-xs font-semibold uppercase tracking-wider hover:border-primary/50 hover:bg-surface-primary transition-all shadow-2xs group"
              >
                <span className="group-hover:text-primary transition-colors">Products</span>
                <svg
                  className={`h-4 w-4 text-ink-muted group-hover:text-primary transition-transform duration-200 ${
                    isProductsOpen ? "rotate-180 text-primary" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Products List: Collapsible on mobile, static on desktop */}
            <div
              id="footer-products-menu"
              className={`${isProductsOpen ? "block" : "hidden"} sm:block`}
            >
              <ul className="mt-2.5 sm:mt-4 space-y-1 sm:space-y-2.5 text-xs list-none p-2 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-border-default bg-surface-primary/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none animate-in fade-in slide-in-from-top-1 duration-150">
                {siteConfig.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setIsProductsOpen(false)}
                      className="block sm:inline-block px-3 py-1.5 sm:px-0 sm:py-0 rounded-md sm:rounded-none text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary sm:hover:bg-transparent transition-colors font-medium sm:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/quick-buy"
                    onClick={() => setIsProductsOpen(false)}
                    className="block sm:inline-block px-3 py-1.5 sm:px-0 sm:py-0 rounded-md sm:rounded-none text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary sm:hover:bg-transparent transition-colors font-medium sm:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    Quick Buy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsProductsOpen(false)}
                    className="block sm:inline-block px-3 py-1.5 sm:px-0 sm:py-0 rounded-md sm:rounded-none text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary sm:hover:bg-transparent transition-colors font-medium sm:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    XML Site Map
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3.5 text-xs list-none p-0">
              {/* Name */}
              <li className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 text-ink-muted shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium text-ink-primary">{siteConfig.contact.name}</span>
              </li>

              {/* Number */}
              <li className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 text-ink-muted shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                  className="hover:text-ink-primary hover:underline transition-colors font-mono"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>

              {/* Mail */}
              <li className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 text-ink-muted shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-ink-primary hover:underline transition-colors font-mono break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </li>

              {/* Address */}
              <li className="flex items-start gap-2.5">
                <svg
                  className="h-4 w-4 text-ink-muted shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="space-y-1.5">
                  <span className="text-ink-secondary leading-snug block">
                    {siteConfig.contact.address}
                  </span>
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-primary dark:bg-surface-secondary text-ink-primary border border-border-default hover:border-primary/50 hover:text-primary font-mono text-[11px] font-medium transition-colors shadow-xs"
                    title="Open address in Google Maps"
                  >
                    <span>View on Google Maps</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={siteConfig.links.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-primary text-surface-primary font-mono text-[11px] font-semibold uppercase tracking-wider hover:bg-ink-secondary transition-colors"
              >
                <span>Book Meeting</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border-default pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <p>
            {copyrightStatement}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-ink-primary hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-ink-primary hover:underline transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-ink-primary hover:underline transition-colors"
            >
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

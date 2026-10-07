import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface FooterProps {
  footerText?: string;
  organizationName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  footerText,
  organizationName = siteConfig.legalName,
}) => {
  return (
    <footer className="border-t border-border-default bg-surface-secondary text-ink-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Identity & Vision Statement */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink-primary"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-surface-primary text-ink-primary font-mono text-xs font-bold border border-border-default">
                H
              </span>
              <span>HENU</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-xs font-mono text-ink-muted">
              {organizationName}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm list-none p-0">
              {siteConfig.primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Column */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Ecosystem
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm list-none p-0">
              {siteConfig.products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="hover:text-ink-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-xs"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border-default pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <p>
            {footerText || `© ${new Date().getFullYear()} ${organizationName}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ink-primary hover:underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ink-primary hover:underline transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

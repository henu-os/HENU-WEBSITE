"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "./theme-switch";
import { LinkButton } from "@/components/ui/link-button";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        isScrolled
          ? "border-outline-variant/30 bg-surface/95 backdrop-blur-md shadow-subtle py-2.5"
          : "border-transparent bg-surface/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brandmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl font-bold tracking-tight text-on-surface hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-md p-1"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-on font-mono text-sm font-bold shadow-subtle group-hover:scale-105 transition-transform">
            H
          </span>
          <span className="font-display tracking-wider text-lg font-bold">HENU</span>
        </Link>

        {/* Desktop Primary Navigation — Exactly 6 items (Document 04 §9.1) */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary Navigation">
          {siteConfig.primaryNavigation.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary rounded-sm ${
                  active ? "text-on-surface font-semibold" : "text-on-surface-variant"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitch />
          <LinkButton
            href="/contact"
            variant="secondary"
            size="sm"
            className="font-semibold shadow-subtle"
          >
            Start an enquiry
          </LinkButton>
        </div>

        {/* Mobile / Tablet Header Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeSwitch />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-outline-variant/40 bg-surface p-2 text-on-surface hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-primary"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay Panel (Document 04 §9.3.2) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="fixed inset-0 top-[65px] z-50 flex flex-col bg-surface px-6 py-8 overflow-y-auto lg:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
            {siteConfig.primaryNavigation.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between py-3 text-xl font-display font-medium border-b border-outline-variant/20 transition-colors ${
                    active ? "text-primary font-bold" : "text-on-surface hover:text-primary"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-4">
            <LinkButton
              href="/contact"
              variant="secondary"
              size="lg"
              className="w-full justify-center text-center font-semibold"
            >
              Start an enquiry
            </LinkButton>
            <p className="text-xs text-on-surface-muted text-center pt-2">
              Official HENU Ecosystem · Systems-grade engineering
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

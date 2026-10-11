"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { SERVICES_NAV_CATEGORIES } from "@/config/services-nav";
import { LinkButton } from "@/components/ui/link-button";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
    };
  }, []);

  // Lock scroll and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isServicesMenuOpen) {
          setIsServicesMenuOpen(false);
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, isServicesMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [pathname]);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesMenuOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesMenuOpen(false);
    }, 180);
  };

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
          <span className="relative flex h-8 w-12 shrink-0 items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/brand/henu-os.png"
              alt="HENU OS"
              fill
              sizes="48px"
              className="object-contain"
              priority
              unoptimized
            />
          </span>
          <span className="font-display tracking-wider text-lg font-bold">HENU OS</span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary Navigation">
          {siteConfig.primaryNavigation.map((item) => {
            const active = isActiveLink(item.href);
            const isServices = item.label === "Services";

            if (isServices) {
              return (
                <div
                  key={item.href}
                  className="relative group/nav"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={isServicesMenuOpen}
                    aria-haspopup="true"
                    onFocus={handleServicesMouseEnter}
                    className={`relative inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary rounded-sm ${
                      active ? "text-on-surface font-semibold" : "text-on-surface-variant"
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isServicesMenuOpen ? "rotate-180 text-primary" : "text-on-surface-muted group-hover/nav:text-on-surface"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {active && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Mega-Menu Dropdown on Hover (Refined Mid-Tone Sovereign Purple Palette) */}
                  {isServicesMenuOpen && (
                    <div
                      className="absolute top-full -left-28 xl:-left-24 pt-3.5 z-50 w-[780px] xl:w-[840px] max-w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-top-2 duration-150"
                      role="menu"
                      aria-label="Services Catalogue"
                    >
                      <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-[#452779] via-[#3a2068] to-[#311858] text-white p-6 lg:p-7 shadow-[0_25px_60px_-12px_rgba(35,12,70,0.55)] relative overflow-hidden">
                        {/* Subtle ambient light sheen */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-300/[0.08] to-transparent pointer-events-none" />

                        {/* Header bar */}
                        <div className="relative flex items-center justify-between pb-4 mb-5 border-b border-purple-300/20">
                          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(216,180,254,0.9)]" aria-hidden="true" />
                            Architectural Capabilities Catalogue
                          </span>
                          <Link
                            href="/services"
                            onClick={() => setIsServicesMenuOpen(false)}
                            className="group/all inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-purple-200 hover:text-white transition-colors"
                          >
                            <span>Browse All 9 Services</span>
                            <span className="group-hover/all:translate-x-0.5 transition-transform" aria-hidden="true">
                              &rarr;
                            </span>
                          </Link>
                        </div>

                        {/* 4 Category Columns */}
                        <div className="relative grid grid-cols-4 gap-5">
                          {SERVICES_NAV_CATEGORIES.map((category) => (
                            <div key={category.slug} className="space-y-3">
                              <div className="font-mono text-xs font-bold uppercase tracking-wider pb-2 border-b border-purple-300/20 flex items-center gap-1.5">
                                <span className="text-purple-300">{category.num}</span>
                                <span className="text-purple-100">{category.name}</span>
                              </div>
                              <div className="space-y-1.5">
                                {category.services.map((service) => (
                                  <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    onClick={() => setIsServicesMenuOpen(false)}
                                    className="group/item block p-2.5 -mx-2 rounded-xl hover:bg-purple-900/50 hover:border-purple-300/30 border border-transparent transition-all"
                                  >
                                    <div className="text-xs font-bold text-white group-hover/item:text-purple-100 transition-colors flex items-center justify-between">
                                      <span>{service.name}</span>
                                      <span className="opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-purple-300 text-[10px] font-mono">
                                        &rarr;
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-purple-200/80 leading-snug line-clamp-2 mt-1 font-sans group-hover/item:text-purple-100 transition-colors">
                                      {service.summary}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer bar */}
                        <div className="relative mt-6 pt-3.5 border-t border-purple-300/20 flex items-center justify-between text-xs bg-[#281347] -mx-6 -mb-6 lg:-mx-7 lg:-mb-7 px-6 lg:px-7 py-3.5">
                          <div className="flex items-center gap-2 text-purple-200/85 text-[11px] font-mono">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_6px_rgba(216,180,254,0.7)]" aria-hidden="true" />
                            <span>Zero consulting theater · Sovereign engineering & IP ownership</span>
                          </div>
                          <Link
                            href="/contact"
                            onClick={() => setIsServicesMenuOpen(false)}
                            className="font-mono text-xs font-semibold text-purple-200 hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
                          >
                            <span>Initiate project dialogue</span>
                            <span aria-hidden="true">&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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

      {/* Mobile Navigation Overlay Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="fixed inset-0 top-[65px] z-50 flex flex-col bg-surface px-6 py-8 overflow-y-auto lg:hidden animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {siteConfig.primaryNavigation.map((item) => {
              const active = isActiveLink(item.href);
              const isServices = item.label === "Services";

              if (isServices) {
                return (
                  <div key={item.href} className="border-b border-outline-variant/20 py-1">
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-xl font-display font-medium transition-colors ${
                          active ? "text-primary font-bold" : "text-on-surface hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        aria-expanded={isMobileServicesOpen}
                        aria-label={isMobileServicesOpen ? "Collapse services catalogue" : "Expand services catalogue"}
                        className="p-2 text-on-surface-variant hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary rounded-md"
                      >
                        <svg
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isMobileServicesOpen ? "rotate-180 text-primary" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expandable services list in mobile drawer */}
                    {isMobileServicesOpen && (
                      <div className="mt-2 pl-3 space-y-4 pb-3 border-l-2 border-primary/20 ml-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {SERVICES_NAV_CATEGORIES.map((category) => (
                          <div key={category.slug} className="space-y-1.5 pl-2">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-primary">
                              {category.num} {"//"} {category.name}
                            </span>
                            <div className="space-y-1">
                              {category.services.map((srv) => (
                                <Link
                                  key={srv.slug}
                                  href={`/services/${srv.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-1 text-sm text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  {srv.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <Link
                            href="/services"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-mono text-xs font-semibold text-secondary hover:underline block"
                          >
                            View All 9 Services &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
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

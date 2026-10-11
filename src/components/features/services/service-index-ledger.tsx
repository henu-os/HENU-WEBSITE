"use client";

import React from "react";
import Link from "next/link";
import type { Service, ServiceCategory } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { ServiceSchematicGlyph } from "./service-schematic-glyph";

interface ServiceIndexLedgerProps {
  categoryGroups: Array<{
    category: ServiceCategory;
    services: Service[];
  }>;
}

// Helpers for distinctive category palette accents
function getCategoryColorConfig(slug: string, index: number) {
  const norm = slug.toLowerCase();
  if (norm.includes("build") || index === 0) {
    return {
      dot: "bg-emerald-500",
      borderAccent: "group-hover:border-emerald-500/50",
      bgHover: "hover:bg-emerald-500/[0.03]",
      numberBadge: "bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300",
      titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      headerBar: "border-emerald-500/40",
      tagBorder: "border-emerald-500/30",
      glow: "group-hover:shadow-[0_8px_30px_-6px_rgba(16,185,129,0.12)]",
    };
  }
  if (norm.includes("intelligence") || index === 1) {
    return {
      dot: "bg-indigo-500",
      borderAccent: "group-hover:border-indigo-500/50",
      bgHover: "hover:bg-indigo-500/[0.03]",
      numberBadge: "bg-indigo-500/10 border-indigo-500/25 text-indigo-800 dark:text-indigo-300",
      titleHover: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
      headerBar: "border-indigo-500/40",
      tagBorder: "border-indigo-500/30",
      glow: "group-hover:shadow-[0_8px_30px_-6px_rgba(99,102,241,0.12)]",
    };
  }
  if (norm.includes("brand") || index === 2) {
    return {
      dot: "bg-amber-500",
      borderAccent: "group-hover:border-amber-500/50",
      bgHover: "hover:bg-amber-500/[0.03]",
      numberBadge: "bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300",
      titleHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
      headerBar: "border-amber-500/40",
      tagBorder: "border-amber-500/30",
      glow: "group-hover:shadow-[0_8px_30px_-6px_rgba(245,158,11,0.12)]",
    };
  }
  // Business foundations / default
  return {
    dot: "bg-sky-500",
    borderAccent: "group-hover:border-sky-500/50",
    bgHover: "hover:bg-sky-500/[0.03]",
    numberBadge: "bg-sky-500/10 border-sky-500/25 text-sky-800 dark:text-sky-300",
    titleHover: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
    headerBar: "border-sky-500/40",
    tagBorder: "border-sky-500/30",
    glow: "group-hover:shadow-[0_8px_30px_-6px_rgba(14,165,233,0.12)]",
  };
}

export function ServiceIndexLedger({ categoryGroups }: ServiceIndexLedgerProps) {
  if (!categoryGroups || categoryGroups.length === 0) {
    return (
      <div className="p-12 rounded-xl border border-border-default bg-surface-primary text-center space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Catalogue Status
        </span>
        <h3 className="font-serif text-2xl text-ink-primary">
          No Published Services Currently Available
        </h3>
        <p className="text-sm text-ink-secondary max-w-md mx-auto">
          The official HENU service catalogue is actively undergoing editorial onboarding. Please
          check back shortly or contact our team directly for custom architectural engagements.
        </p>
        <div className="pt-2">
          <LinkButton href="/contact" variant="primary" size="md">
            Direct Enquiry &rarr;
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 lg:space-y-28" aria-label="HENU Services Ledger">
      {categoryGroups.map((group, groupIndex) => {
        const groupNum = String(groupIndex + 1).padStart(2, "0");
        const color = getCategoryColorConfig(group.category.slug, groupIndex);

        return (
          <section
            key={group.category.id}
            id={`category-${group.category.slug}`}
            className="space-y-8 scroll-mt-28"
            aria-labelledby={`heading-cat-${group.category.slug}`}
          >
            {/* Elevated Category Header */}
            <div className={`border-b-2 ${color.headerBar} pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
                  <span className={`inline-block w-2 h-2 rounded-full ${color.dot}`} />
                  <span className="font-semibold text-ink-primary">{`${groupNum} // CATEGORY`}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-secondary text-[11px] border border-border-default">
                    {group.services.length} {group.services.length === 1 ? "Service" : "Services"}
                  </span>
                </div>
                <h2
                  id={`heading-cat-${group.category.slug}`}
                  className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal"
                >
                  {group.category.name}
                </h2>
              </div>

              {group.category.description && (
                <p className="font-sans text-sm text-ink-secondary max-w-md leading-relaxed">
                  {group.category.description}
                </p>
              )}
            </div>

            {/* Visual Numbered Ledger Cards */}
            <ol className="space-y-4 list-none p-0 m-0">
              {group.services.map((service, serviceIndex) => {
                const serviceNum = `${groupNum}.${String(serviceIndex + 1).padStart(2, "0")}`;

                // Extract any capability attributes if available
                const attributes: string[] =
                  service.capability_block &&
                  typeof service.capability_block === "object" &&
                  "attributes" in service.capability_block &&
                  Array.isArray((service.capability_block as { attributes: string[] }).attributes)
                    ? (service.capability_block as { attributes: string[] }).attributes
                    : [];

                return (
                  <li
                    key={service.id}
                    className={`group relative rounded-xl border border-border-default/80 bg-surface-primary/70 ${color.bgHover} ${color.borderAccent} ${color.glow} transition-all duration-300 p-5 sm:p-7 hover:-translate-y-0.5`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Column 1: Visual Schematic Icon & Serial Number */}
                      <div className="lg:col-span-3 flex sm:flex-row lg:flex-col items-start gap-4">
                        <ServiceSchematicGlyph
                          slug={service.slug}
                          categorySlug={group.category.slug}
                        />

                        <div className="space-y-2">
                          <span className={`inline-block font-mono text-xs font-semibold px-2 py-0.5 rounded-md border tracking-wider ${color.numberBadge}`}>
                            {serviceNum}
                          </span>
                          {service.requires_disclaimer && (
                            <div className="pt-0.5">
                              <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                                Notice
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Title, Summary & Visual Capability Tags */}
                      <div className="lg:col-span-6 space-y-3.5">
                        <h3 className={`font-serif text-2xl sm:text-3xl text-ink-primary font-normal ${color.titleHover} transition-colors duration-200`}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="focus-visible:outline-focus-ring flex items-center gap-2 group/link"
                          >
                            <span>{service.name}</span>
                            <span className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 text-base">
                              &rarr;
                            </span>
                          </Link>
                        </h3>

                        <p className="font-sans text-base text-ink-secondary leading-relaxed max-w-2xl">
                          {service.summary}
                        </p>

                        {/* Visual Technical Tags / Attributes */}
                        {attributes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {attributes.slice(0, 3).map((attr) => (
                              <span
                                key={attr}
                                className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-surface-secondary/80 text-ink-secondary border border-border-default/60"
                              >
                                {attr}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Structural Pipeline Checklist */}
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          {service.problem_block && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Problem Framed
                            </span>
                          )}
                          {service.capability_block && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-800 dark:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              Capability Documented
                            </span>
                          )}
                          {service.solution_block && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Solution Architecture
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Contextual Action */}
                      <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 h-full pt-1">
                        <LinkButton
                          href={`/services/${service.slug}`}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto lg:w-full justify-center group-hover:border-ink-primary/50 group-hover:bg-surface-secondary transition-all"
                        >
                          Architecture Details &rarr;
                        </LinkButton>

                        <Link
                          href={`/contact?service=${service.slug}&interest=service`}
                          className="text-xs font-mono text-ink-muted hover:text-ink-primary hover:underline focus-visible:outline-focus-ring flex items-center gap-1 transition-colors"
                        >
                          <span>Discuss this service</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

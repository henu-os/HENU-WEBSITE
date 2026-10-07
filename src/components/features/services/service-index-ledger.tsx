import React from "react";
import Link from "next/link";
import type { Service, ServiceCategory } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

interface ServiceIndexLedgerProps {
  categoryGroups: Array<{
    category: ServiceCategory;
    services: Service[];
  }>;
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
    <div className="space-y-16 lg:space-y-24" aria-label="HENU Services Ledger">
      {categoryGroups.map((group, groupIndex) => {
        const groupNum = String(groupIndex + 1).padStart(2, "0");

        return (
          <section
            key={group.category.id}
            id={`category-${group.category.slug}`}
            className="space-y-8"
            aria-labelledby={`heading-cat-${group.category.slug}`}
          >
            {/* Category Header */}
            <div className="border-b-2 border-ink-primary/20 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
                  <span>{`${groupNum} // Category`}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{group.services.length} {group.services.length === 1 ? "Service" : "Services"}</span>
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

            {/* Numbered Ledger Rows */}
            <ol className="divide-y divide-border-default list-none p-0 m-0">
              {group.services.map((service, serviceIndex) => {
                const serviceNum = `${groupNum}.${String(serviceIndex + 1).padStart(2, "0")}`;

                return (
                  <li
                    key={service.id}
                    className="py-8 group hover:bg-surface-secondary/30 transition-colors rounded-lg px-4 sm:px-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Column 1: Number & Badges (2 Cols) */}
                      <div className="lg:col-span-2 space-y-2">
                        <span className="font-mono text-xs text-ink-muted block font-semibold tracking-wider">
                          {serviceNum}
                        </span>
                        {service.requires_disclaimer && (
                          <Badge variant="warning" size="sm" className="font-mono text-[10px]">
                            Notice
                          </Badge>
                        )}
                      </div>

                      {/* Column 2: Title & Summary (7 Cols) */}
                      <div className="lg:col-span-7 space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal group-hover:text-primary transition-colors">
                          <Link
                            href={`/services/${service.slug}`}
                            className="focus-visible:outline-focus-ring"
                          >
                            {service.name}
                          </Link>
                        </h3>

                        <p className="font-sans text-base text-ink-secondary leading-relaxed max-w-2xl">
                          {service.summary}
                        </p>

                        {/* Quick Structural Checklist */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {service.problem_block && (
                            <span className="inline-flex items-center text-xs font-mono text-ink-muted bg-surface-secondary/70 px-2 py-0.5 rounded border border-border-default/60">
                              Problem Framed
                            </span>
                          )}
                          {service.capability_block && (
                            <span className="inline-flex items-center text-xs font-mono text-ink-muted bg-surface-secondary/70 px-2 py-0.5 rounded border border-border-default/60">
                              Capability Documented
                            </span>
                          )}
                          {service.solution_block && (
                            <span className="inline-flex items-center text-xs font-mono text-ink-muted bg-surface-secondary/70 px-2 py-0.5 rounded border border-border-default/60">
                              Solution Architecture
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Contextual Action (3 Cols) */}
                      <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 h-full">
                        <LinkButton
                          href={`/services/${service.slug}`}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto lg:w-full justify-center"
                        >
                          Architecture Details &rarr;
                        </LinkButton>

                        <Link
                          href={`/contact?service=${service.slug}&interest=service`}
                          className="text-xs font-mono text-ink-muted hover:text-ink-primary hover:underline focus-visible:outline-focus-ring"
                        >
                          Discuss this service &rarr;
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioProject, ProjectCategory, ProjectMetric } from "@/types/domain";

interface PortfolioIndexViewProps {
  projects: PortfolioProject[];
  categories: ProjectCategory[];
  activeCategorySlug?: string;
}

export function PortfolioIndexView({
  projects,
  categories,
  activeCategorySlug = "all",
}: PortfolioIndexViewProps) {
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const isFiltered = activeCategorySlug !== "all";
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  // Group counts for category pills
  const totalCount = projects.length;

  return (
    <div className="space-y-12">
      {/* 1. Category Filter Navigation (PORT-002) */}
      <nav
        aria-label="Portfolio category filter"
        className="border-b border-border-default pb-4 overflow-x-auto"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/portfolio"
            aria-current={!isFiltered ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 min-h-[44px] ${
              !isFiltered
                ? "bg-ink-primary text-surface-primary font-semibold"
                : "border border-border-default bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-elevated"
            }`}
          >
            <span>All Projects</span>
            {!isFiltered && (
              <span className="opacity-75 text-[10px]">({totalCount})</span>
            )}
          </Link>

          {categories.map((cat) => {
            const isSelected = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/portfolio?category=${cat.slug}`}
                aria-current={isSelected ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 min-h-[44px] ${
                  isSelected
                    ? "bg-ink-primary text-surface-primary font-semibold"
                    : "border border-border-default bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-elevated"
                }`}
              >
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Portfolio Project Content Matrix (PORT-001, PORT-002) */}
      {projects.length === 0 ? (
        // A. Intentional Empty State
        <div
          role="region"
          aria-label="Empty portfolio state"
          className="border border-border-default rounded-xl p-8 sm:p-16 text-center space-y-4 bg-surface-secondary/40"
        >
          <div className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            {isFiltered ? "Filter Scope // Empty" : "Ledger Notice // 00"}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
            {isFiltered
              ? `No Case Studies in ${activeCategory?.name || "Selected Category"}`
              : "No Public Case Studies Currently Released"}
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-xl mx-auto leading-relaxed">
            {isFiltered
              ? "There are currently no confirmed case studies published under this taxonomy. Check back as new systems are approved for disclosure."
              : "HENU strictly observes client disclosure boundaries and proprietary governance protocols. Technical case studies and system documentation are published only under verified client consent and security clearance."}
          </p>
          {isFiltered && (
            <div className="pt-2">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent-pine hover:underline min-h-[44px]"
              >
                &larr; View All Projects
              </Link>
            </div>
          )}
        </div>
      ) : projects.length === 1 && projects[0] ? (
        // B. Single Project: Commanding Hero Layout
        <div className="grid grid-cols-1 gap-8">
          <ProjectHeroCard
            project={projects[0]}
            categoryName={getCategoryName(projects[0], categories)}
            onPreview={setPreviewProject}
          />
        </div>
      ) : (
        // C. Asymmetric Layout Grid (Deterministic slot rhythm)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {projects.map((project, index) => {
            const catName = getCategoryName(project, categories);
            const slot = index % 5;

            switch (slot) {
              case 0:
                // Slot 0: Prominent 12-col card with horizontal split
                return (
                  <div key={project.id} className="lg:col-span-12">
                    <ProjectHeroCard
                      project={project}
                      categoryName={catName}
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
              case 1:
                // Slot 1: 7-col wide card
                return (
                  <div key={project.id} className="lg:col-span-7">
                    <ProjectStandardCard
                      project={project}
                      categoryName={catName}
                      aspectRatio="aspect-[16/10]"
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
              case 2:
                // Slot 2: 5-col tall card
                return (
                  <div key={project.id} className="lg:col-span-5">
                    <ProjectStandardCard
                      project={project}
                      categoryName={catName}
                      aspectRatio="aspect-[4/5]"
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
              case 3:
                // Slot 3: 5-col compact card
                return (
                  <div key={project.id} className="lg:col-span-5">
                    <ProjectStandardCard
                      project={project}
                      categoryName={catName}
                      aspectRatio="aspect-[4/3]"
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
              case 4:
                // Slot 4: 7-col widescreen card
                return (
                  <div key={project.id} className="lg:col-span-7">
                    <ProjectStandardCard
                      project={project}
                      categoryName={catName}
                      aspectRatio="aspect-[16/9]"
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
              default:
                return (
                  <div key={project.id} className="lg:col-span-6">
                    <ProjectStandardCard
                      project={project}
                      categoryName={catName}
                      onPreview={setPreviewProject}
                    />
                  </div>
                );
            }
          })}
        </div>
      )}

      {/* PORT-004: Accessible Quick Preview Modal */}
      {previewProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-border-default bg-surface-primary p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-border-default pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {getCategoryName(previewProject, categories)}
                  </Badge>
                  <span className="font-mono text-xs text-ink-muted">
                    {previewProject.period_year || "Production"}
                  </span>
                </div>
                <h3 id="preview-title" className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                  {previewProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="text-ink-muted hover:text-ink-primary font-mono text-sm p-1"
                aria-label="Close Preview"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm text-ink-secondary leading-relaxed">
              <p className="text-base text-ink-primary font-medium">
                {previewProject.summary}
              </p>

              {previewProject.client_permission_status && (
                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle font-mono text-xs text-ink-muted flex items-center justify-between">
                  <span>Client Clearance Status</span>
                  <span className="text-accent-pine uppercase text-[10px]">Permission: {previewProject.client_permission_status}</span>
                </div>
              )}

              {Array.isArray(previewProject.technologies) && previewProject.technologies.length > 0 && (
                <div>
                  <span className="font-mono text-xs text-ink-muted uppercase tracking-wider block mb-1.5 font-semibold">
                    Verified Technical Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(previewProject.technologies as string[]).map((t) => (
                      <span key={t} className="font-mono text-xs px-2.5 py-1 rounded bg-surface-secondary text-ink-primary border border-border-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-default">
              <Button onClick={() => setPreviewProject(null)} variant="secondary" size="sm">
                Dismiss
              </Button>
              <Link
                href={`/portfolio/${previewProject.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink-primary text-surface-primary font-mono text-xs font-semibold hover:bg-accent-pine transition-colors min-h-[44px]"
              >
                <span>Open Full Case Study</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryName(
  project: PortfolioProject,
  categories: ProjectCategory[]
): string {
  if (!project.category_slug) return "General Architecture";
  const found = categories.find((c) => c.slug === project.category_slug);
  return found ? found.name : project.category_slug;
}

/**
 * 12-Column Hero Card for Featured or Index 0 projects
 */
function ProjectHeroCard({
  project,
  categoryName,
  onPreview,
}: {
  project: PortfolioProject;
  categoryName: string;
  onPreview?: (project: PortfolioProject) => void;
}) {
  const technologies = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];
  const metrics = Array.isArray(project.metrics)
    ? (project.metrics as unknown as ProjectMetric[])
    : [];
  const primaryMetric = metrics.length > 0 ? metrics[0] : null;

  return (
    <article
      aria-labelledby={`project-title-${project.slug}`}
      className="group relative border border-border-default rounded-xl bg-surface-primary overflow-hidden hover:border-ink-primary/40 transition-all duration-300 shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Visual Showcase Panel */}
        <div className="lg:col-span-7 relative bg-surface-secondary border-b lg:border-b-0 lg:border-r border-border-default flex items-center justify-center p-8 sm:p-12 overflow-hidden">
          {/* Subtle architectural schematic background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 text-center space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted block">
              Architectural Case Study
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal block">
              {project.title}
            </span>
            {project.period_year && (
              <span className="font-mono text-xs text-ink-muted block">
                Release Timeline // {project.period_year}
              </span>
            )}
          </div>
        </div>

        {/* Content & Metadata Panel */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {categoryName}
              </Badge>
              <Badge
                variant={project.project_status === "live" ? "default" : "secondary"}
                className="font-mono text-[10px] uppercase"
              >
                {project.project_status}
              </Badge>
              {project.is_featured && (
                <Badge variant="warning" className="font-mono text-[10px] uppercase">
                  Featured
                </Badge>
              )}
            </div>

            <h3
              id={`project-title-${project.slug}`}
              className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal group-hover:text-accent-pine transition-colors"
            >
              <Link
                href={`/portfolio/${project.slug}`}
                className="focus:outline-none focus:ring-2 focus:ring-accent-spectral rounded"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {project.title}
              </Link>
            </h3>

            <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed line-clamp-3">
              {project.summary}
            </p>

            {/* Verified Metric highlight if available */}
            {primaryMetric && (
              <div className="border-l-2 border-accent-pine pl-3 py-1 bg-surface-secondary/50 rounded-r">
                <span className="font-serif text-lg font-semibold text-ink-primary block">
                  {primaryMetric.value}
                </span>
                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider block">
                  {primaryMetric.label}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-border-default/60">
            {technologies.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-secondary text-ink-secondary border border-border-default"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="font-mono text-[10px] text-ink-muted">
                    +{technologies.length - 4} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-accent-pine font-semibold pt-1">
              <span>Read Architectural Case Study &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Standard Card for Asymmetrical Slots
 */
function ProjectStandardCard({
  project,
  categoryName,
  aspectRatio = "aspect-[16/10]",
  onPreview,
}: {
  project: PortfolioProject;
  categoryName: string;
  aspectRatio?: string;
  onPreview?: (project: PortfolioProject) => void;
}) {
  const technologies = Array.isArray(project.technologies)
    ? (project.technologies as string[])
    : [];
  const metrics = Array.isArray(project.metrics)
    ? (project.metrics as unknown as ProjectMetric[])
    : [];
  const primaryMetric = metrics.length > 0 ? metrics[0] : null;

  return (
    <article
      aria-labelledby={`project-card-${project.slug}`}
      className="group relative border border-border-default rounded-xl bg-surface-primary overflow-hidden hover:border-ink-primary/40 transition-all duration-300 shadow-sm flex flex-col justify-between h-full"
    >
      <div>
        {/* Media Frame */}
        <div
          className={`relative ${aspectRatio} w-full bg-surface-secondary border-b border-border-default flex items-center justify-center p-6 overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative z-10 text-center space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              Case Study // {project.period_year || "Production"}
            </span>
            <span className="font-serif text-xl sm:text-2xl text-ink-primary font-normal block px-4">
              {project.title}
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {categoryName}
            </Badge>
            <Badge
              variant={project.project_status === "live" ? "default" : "secondary"}
              className="font-mono text-[10px] uppercase"
            >
              {project.project_status}
            </Badge>
          </div>

          <h3
            id={`project-card-${project.slug}`}
            className="font-serif text-xl sm:text-2xl text-ink-primary font-normal group-hover:text-accent-pine transition-colors"
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="focus:outline-none focus:ring-2 focus:ring-accent-spectral rounded"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {project.title}
            </Link>
          </h3>

          <p className="font-sans text-sm text-ink-secondary leading-relaxed line-clamp-3">
            {project.summary}
          </p>

          {primaryMetric && (
            <div className="border-l-2 border-accent-pine pl-2.5 py-0.5 bg-surface-secondary/40 rounded-r">
              <span className="font-serif text-base font-semibold text-ink-primary block">
                {primaryMetric.value}
              </span>
              <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider block">
                {primaryMetric.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 pt-0 space-y-3">
        {technologies.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-ink-secondary border border-border-default"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="font-mono text-[10px] text-ink-muted">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="text-xs font-mono uppercase tracking-wider text-accent-pine font-semibold pt-1">
          Explore Architecture &rarr;
        </div>
      </div>
    </article>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PortfolioProject, ProjectCategory } from "@/types/domain";
import {
  updateProjectAction,
  archiveProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "@/server/actions/portfolio.actions";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PortfolioListClientProps {
  initialProjects: PortfolioProject[];
  categories: ProjectCategory[];
}

export function PortfolioListClient({
  initialProjects,
  categories,
}: PortfolioListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredProjects = initialProjects.filter((p) => {
    if (selectedCategoryFilter !== "all" && p.category_slug !== selectedCategoryFilter) {
      return false;
    }
    if (selectedStatusFilter !== "all" && p.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

  const handlePublish = (project: PortfolioProject) => {
    setErrorMessage(null);
    if (project.client_permission_status !== "granted") {
      setErrorMessage(
        `Cannot publish "${project.title}": Client permission status is "${project.client_permission_status}". Permission must be 'granted' before public release.`
      );
      return;
    }

    startTransition(async () => {
      try {
        await updateProjectAction(project.id, { status: "published" });
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to publish project.");
      }
    });
  };

  const handleArchive = (project: PortfolioProject) => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await archiveProjectAction(project.id);
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to archive project.");
      }
    });
  };

  const handleDelete = (project: PortfolioProject) => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id);
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to delete project.");
      }
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;

    const newOrder = [...filteredProjects];
    const [moved] = newOrder.splice(index, 1);
    if (!moved) return;
    newOrder.splice(targetIndex, 0, moved);

    const orderedIds = newOrder.map((p) => p.id);

    startTransition(async () => {
      try {
        await reorderProjectsAction(orderedIds);
        router.refresh();
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to reorder projects.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 text-sm font-sans flex items-start justify-between gap-3"
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 font-bold hover:opacity-80"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-surface-secondary/40 p-4 rounded-lg border border-border-default">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search projects by title, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-primary"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-ink-muted">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-surface-primary border border-border-default rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-ink-muted">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-surface-primary border border-border-default rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Data Table */}
      <div className="border border-border-default rounded-lg overflow-hidden bg-surface-primary shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-default bg-surface-secondary/60 text-xs font-mono uppercase tracking-wider text-ink-muted">
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Publication</th>
                <th className="py-3 px-4">Client Permission</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink-muted">
                    No portfolio projects match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => {
                  const catName = project.category_slug
                    ? categoryMap.get(project.category_slug) || project.category_slug
                    : "—";

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-surface-secondary/30 transition-colors"
                    >
                      {/* Keyboard Accessible Order Reordering */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-xs font-semibold text-ink-muted mr-1">
                            {project.display_order}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMove(index, "up")}
                              disabled={index === 0 || isPending}
                              aria-label={`Move ${project.title} up`}
                              className="p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-surface-elevated disabled:opacity-20 focus:outline-none focus:ring-1 focus:ring-accent-spectral"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, "down")}
                              disabled={index === filteredProjects.length - 1 || isPending}
                              aria-label={`Move ${project.title} down`}
                              className="p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-surface-elevated disabled:opacity-20 focus:outline-none focus:ring-1 focus:ring-accent-spectral"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Project Title & Slug */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-ink-primary flex items-center gap-2">
                            <span>{project.title}</span>
                            {project.is_featured && (
                              <Badge variant="warning" className="font-mono text-[9px] uppercase">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="font-mono text-xs text-ink-muted">
                            /{project.slug}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-mono text-xs text-ink-secondary">
                        {catName}
                      </td>

                      {/* Publication Status */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            project.status === "published"
                              ? "default"
                              : project.status === "draft"
                              ? "secondary"
                              : "neutral"
                          }
                          className="font-mono text-[10px] uppercase"
                        >
                          {project.status}
                        </Badge>
                      </td>

                      {/* Client Permission Status (PORT-001 Hard Gate) */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            project.client_permission_status === "granted"
                              ? "default"
                              : "warning"
                          }
                          className="font-mono text-[10px] uppercase"
                        >
                          {project.client_permission_status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Preview Link */}
                          <Link
                            href={`/api/preview?path=/portfolio/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs px-2 py-1 rounded border border-border-default hover:bg-surface-secondary text-ink-secondary hover:text-ink-primary"
                          >
                            Preview
                          </Link>

                          {/* Edit Link */}
                          <LinkButton
                            href={`/admin/portfolio/${project.id}`}
                            variant="secondary"
                            size="sm"
                          >
                            Edit
                          </LinkButton>

                          {/* Quick Publish / Archive */}
                          {project.status !== "published" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublish(project)}
                              disabled={isPending}
                            >
                              Publish
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArchive(project)}
                              disabled={isPending}
                            >
                              Archive
                            </Button>
                          )}

                          {/* Delete */}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(project)}
                            disabled={isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

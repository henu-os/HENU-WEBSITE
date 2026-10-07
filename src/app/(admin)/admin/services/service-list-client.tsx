"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Service, ServiceCategory } from "@/types/domain";
import {
  publishServiceAction,
  archiveServiceAction,
  deleteServiceAction,
  reorderServicesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/server/actions/service.actions";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface ServiceListClientProps {
  initialServices: Service[];
  initialCategories: ServiceCategory[];
}

export function ServiceListClient({
  initialServices,
  initialCategories,
}: ServiceListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category creation form state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catError, setCatError] = useState<string | null>(null);

  // Category editing state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");

  // Services filtering
  const filteredServices = initialServices.filter((s) => {
    if (selectedCategoryFilter !== "all" && s.category_id !== selectedCategoryFilter) {
      return false;
    }
    if (selectedStatusFilter !== "all" && s.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Category map for quick lookup
  const categoryMap = new Map(initialCategories.map((c) => [c.id, c]));

  // ==========================================
  // SERVICE ACTIONS
  // ==========================================

  const handlePublish = (service: Service) => {
    startTransition(async () => {
      try {
        await publishServiceAction(service.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to publish service.");
      }
    });
  };

  const handleArchive = (service: Service) => {
    if (!confirm(`Archive '${service.name}'? It will no longer be visible on public routes.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await archiveServiceAction(service.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to archive service.");
      }
    });
  };

  const handleDelete = (service: Service) => {
    if (!confirm(`PERMANENT ACTION: Delete '${service.name}'? This cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteServiceAction(service.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete service.");
      }
    });
  };

  const handleMoveService = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredServices.length) return;

    // Create new array with swapped items
    const reordered = [...filteredServices];
    const temp = reordered[index];
    const target = reordered[targetIndex];
    if (!temp || !target) return;

    reordered[index] = target;
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map((s) => s.id);

    startTransition(async () => {
      try {
        await reorderServicesAction(orderedIds);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to reorder services.");
      }
    });
  };

  // ==========================================
  // CATEGORY ACTIONS
  // ==========================================

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError(null);

    if (!newCatName.trim()) {
      setCatError("Category name is required.");
      return;
    }

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    startTransition(async () => {
      try {
        await createCategoryAction({
          name: newCatName.trim(),
          slug,
          description: newCatDesc.trim() || null,
          display_order: initialCategories.length + 1,
        });
        setNewCatName("");
        setNewCatSlug("");
        setNewCatDesc("");
        setShowAddCategory(false);
        router.refresh();
      } catch (err: unknown) {
        setCatError(err instanceof Error ? err.message : "Failed to create category.");
      }
    });
  };

  const handleStartEditCategory = (cat: ServiceCategory) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDesc(cat.description || "");
  };

  const handleSaveEditCategory = (id: string) => {
    startTransition(async () => {
      try {
        await updateCategoryAction(id, {
          name: editCatName.trim(),
          slug: editCatSlug.trim(),
          description: editCatDesc.trim() || null,
        });
        setEditingCatId(null);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to update category.");
      }
    });
  };

  const handleDeleteCategory = (cat: ServiceCategory) => {
    const attachedServices = initialServices.filter((s) => s.category_id === cat.id);
    if (attachedServices.length > 0) {
      alert(`Cannot delete category "${cat.name}" because it still has ${attachedServices.length} service(s) attached. Please reassign or delete those services first.`);
      return;
    }

    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategoryAction(cat.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete category.");
      }
    });
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= initialCategories.length) return;

    const reordered = [...initialCategories];
    const temp = reordered[index];
    const target = reordered[targetIndex];
    if (!temp || !target) return;

    reordered[index] = target;
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map((c) => c.id);

    startTransition(async () => {
      try {
        await reorderCategoriesAction(orderedIds);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to reorder categories.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs Switcher */}
      <div className="flex border-b border-border-default gap-6 font-mono text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`pb-3 font-medium transition-colors border-b-2 -mb-[2px] ${
            activeTab === "services"
              ? "border-accent-spectral text-ink-primary font-bold"
              : "border-transparent text-ink-muted hover:text-ink-primary"
          }`}
        >
          Services ({initialServices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`pb-3 font-medium transition-colors border-b-2 -mb-[2px] ${
            activeTab === "categories"
              ? "border-accent-spectral text-ink-primary font-bold"
              : "border-transparent text-ink-muted hover:text-ink-primary"
          }`}
        >
          Categories ({initialCategories.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: SERVICES CATALOGUE                                       */}
      {/* ============================================================== */}
      {activeTab === "services" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-secondary/40 p-4 rounded-lg border border-border-default">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="filter-cat" className="text-xs font-mono text-ink-muted uppercase">
                  Category:
                </label>
                <select
                  id="filter-cat"
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 rounded border border-border-default bg-surface-primary text-ink-primary"
                >
                  <option value="all">All Categories ({initialServices.length})</option>
                  {initialCategories.map((c) => {
                    const count = initialServices.filter((s) => s.category_id === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="filter-status" className="text-xs font-mono text-ink-muted uppercase">
                  Status:
                </label>
                <select
                  id="filter-status"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="text-xs font-mono px-3 py-1.5 rounded border border-border-default bg-surface-primary text-ink-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-64">
              <input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-sans px-3 py-1.5 rounded border border-border-default bg-surface-primary text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent-spectral"
                aria-label="Search services"
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto border border-border-default rounded-lg bg-surface-primary shadow-subtle">
            <table className="w-full text-left text-sm" aria-label="Services Catalogue Table">
              <thead className="bg-surface-secondary/60 text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border-default">
                <tr>
                  <th scope="col" className="px-4 py-3 w-16 text-center">Order</th>
                  <th scope="col" className="px-6 py-3">Service</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Governance</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-sans">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-ink-muted font-mono text-xs">
                      No services match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => {
                    const cat = categoryMap.get(service.category_id);

                    return (
                      <tr key={service.id} className="hover:bg-surface-secondary/30 transition-colors">
                        {/* Order Controls (Keyboard Accessible) */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveService(index, "up")}
                              disabled={isPending || index === 0}
                              aria-label={`Move ${service.name} up in catalogue order`}
                              className="px-1.5 py-0.5 rounded text-[10px] text-ink-muted hover:text-ink-primary hover:bg-surface-secondary disabled:opacity-20 transition-colors"
                            >
                              ▲
                            </button>
                            <span className="font-mono text-xs text-ink-muted">
                              {service.display_order}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMoveService(index, "down")}
                              disabled={isPending || index === filteredServices.length - 1}
                              aria-label={`Move ${service.name} down in catalogue order`}
                              className="px-1.5 py-0.5 rounded text-[10px] text-ink-muted hover:text-ink-primary hover:bg-surface-secondary disabled:opacity-20 transition-colors"
                            >
                              ▼
                            </button>
                          </div>
                        </td>

                        {/* Service Name & Slug */}
                        <td className="px-6 py-3">
                          <div className="font-medium text-ink-primary font-sans">
                            {service.name}
                          </div>
                          <div className="font-mono text-xs text-ink-muted">
                            /services/{service.slug}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant="neutral">
                            {cat ? cat.name : "Uncategorized"}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {service.status === "published" && (
                            <Badge variant="success">Published</Badge>
                          )}
                          {service.status === "draft" && (
                            <Badge variant="warning">Draft</Badge>
                          )}
                          {service.status === "archived" && (
                            <Badge variant="neutral">Archived</Badge>
                          )}
                        </td>

                        {/* Governance */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {service.requires_disclaimer ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <span aria-hidden="true">⚖</span> Disclaimer Req.
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-ink-muted">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* Preview Draft */}
                            <a
                              href={`/api/preview?path=/services/${service.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono text-ink-muted hover:text-ink-primary px-2 py-1 rounded hover:bg-surface-secondary transition-colors"
                            >
                              Preview ↗
                            </a>

                            {/* Edit */}
                            <LinkButton
                              href={`/admin/services/${service.id}`}
                              variant="secondary"
                              size="sm"
                            >
                              Edit
                            </LinkButton>

                            {/* Status Toggles */}
                            {service.status !== "published" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handlePublish(service)}
                              >
                                Publish
                              </Button>
                            )}

                            {service.status === "published" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleArchive(service)}
                              >
                                Archive
                              </Button>
                            )}

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleDelete(service)}
                              className="text-status-error hover:bg-status-error/10"
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
      )}

      {/* ============================================================== */}
      {/* TAB 2: CATEGORIES & ORDERING                                   */}
      {/* ============================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink-primary font-display">
                Service Categories
              </h2>
              <p className="text-xs text-ink-secondary font-sans mt-0.5">
                Categories group architectural services on the public ledger. Category order dictates page section order.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddCategory(!showAddCategory)}
            >
              {showAddCategory ? "Cancel" : "+ Add Category"}
            </Button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="p-4 rounded-lg border border-border-default bg-surface-secondary/40 space-y-4 max-w-xl"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-primary font-semibold">
                Create New Category
              </h3>
              {catError && (
                <div className="text-xs font-mono text-status-error bg-status-error/10 p-2 rounded">
                  {catError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="new-cat-name" label="Category Name" required>
                  <Input
                    id="new-cat-name"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (!newCatSlug) {
                        setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    placeholder="e.g. System Security"
                    required
                  />
                </FormField>
                <FormField id="new-cat-slug" label="Slug" required>
                  <Input
                    id="new-cat-slug"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    placeholder="e.g. system-security"
                    required
                  />
                </FormField>
              </div>
              <FormField id="new-cat-desc" label="Description (Optional)">
                <Input
                  id="new-cat-desc"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short editorial summary of capabilities in this area..."
                />
              </FormField>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddCategory(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isPending}>
                  Save Category
                </Button>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="overflow-x-auto border border-border-default rounded-lg bg-surface-primary shadow-subtle">
            <table className="w-full text-left text-sm" aria-label="Service Categories Table">
              <thead className="bg-surface-secondary/60 text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border-default">
                <tr>
                  <th scope="col" className="px-4 py-3 w-16 text-center">Order</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Slug</th>
                  <th scope="col" className="px-4 py-3">Services</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-sans">
                {initialCategories.map((cat, index) => {
                  const isEditing = editingCatId === cat.id;
                  const serviceCount = initialServices.filter((s) => s.category_id === cat.id).length;

                  return (
                    <tr key={cat.id} className="hover:bg-surface-secondary/30 transition-colors">
                      {/* Order Controls */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, "up")}
                            disabled={isPending || index === 0}
                            aria-label={`Move ${cat.name} category up`}
                            className="px-1.5 py-0.5 rounded text-[10px] text-ink-muted hover:text-ink-primary hover:bg-surface-secondary disabled:opacity-20 transition-colors"
                          >
                            ▲
                          </button>
                          <span className="font-mono text-xs text-ink-muted">
                            {cat.display_order}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, "down")}
                            disabled={isPending || index === initialCategories.length - 1}
                            aria-label={`Move ${cat.name} category down`}
                            className="px-1.5 py-0.5 rounded text-[10px] text-ink-muted hover:text-ink-primary hover:bg-surface-secondary disabled:opacity-20 transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                      </td>

                      {/* Name & Description */}
                      <td className="px-6 py-3">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              className="text-xs"
                            />
                            <Input
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                              placeholder="Description"
                              className="text-xs"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-ink-primary font-sans">{cat.name}</div>
                            {cat.description && (
                              <div className="text-xs text-ink-muted line-clamp-1">{cat.description}</div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-3 font-mono text-xs text-ink-muted">
                        {isEditing ? (
                          <Input
                            value={editCatSlug}
                            onChange={(e) => setEditCatSlug(e.target.value)}
                            className="text-xs font-mono"
                          />
                        ) : (
                          cat.slug
                        )}
                      </td>

                      {/* Services Count */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="neutral">
                          {serviceCount} {serviceCount === 1 ? "service" : "services"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleSaveEditCategory(cat.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCatId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleStartEditCategory(cat)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isPending || serviceCount > 0}
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-status-error hover:bg-status-error/10 disabled:opacity-30"
                              title={serviceCount > 0 ? "Cannot delete category with services" : undefined}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

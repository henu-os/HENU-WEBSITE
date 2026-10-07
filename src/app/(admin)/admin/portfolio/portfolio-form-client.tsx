"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProjectAction,
  updateProjectAction,
  archiveProjectAction,
  deleteProjectAction,
} from "@/server/actions/portfolio.actions";
import type {
  PortfolioProject,
  ProjectCategory,
  Service,
  Product,
  ProjectMetric,
  ProjectStoryBlocks,
} from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface PortfolioFormClientProps {
  initialProject?: PortfolioProject | null;
  categories: ProjectCategory[];
  availableServices: Service[];
  availableProducts: Product[];
}

export function PortfolioFormClient({
  initialProject,
  categories,
  availableServices,
  availableProducts,
}: PortfolioFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialProject);

  // Form State
  const [title, setTitle] = useState(initialProject?.title || "");
  const [slug, setSlug] = useState(initialProject?.slug || "");
  const [summary, setSummary] = useState(initialProject?.summary || "");
  const [categorySlug, setCategorySlug] = useState(initialProject?.category_slug || "");
  const [projectStatus, setProjectStatus] = useState<"live" | "in_development" | "internal">(
    initialProject?.project_status || "live"
  );
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialProject?.status || "draft"
  );
  const [clientPermissionStatus, setClientPermissionStatus] = useState<
    "granted" | "internal_review" | "pending" | "denied"
  >(initialProject?.client_permission_status || "internal_review");
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProject?.is_featured));
  const [displayOrder, setDisplayOrder] = useState(initialProject?.display_order || 1);
  const [periodYear, setPeriodYear] = useState(initialProject?.period_year || "2026");
  const [externalUrl, setExternalUrl] = useState(initialProject?.external_url || "");

  // Technologies
  const initialTechs = Array.isArray(initialProject?.technologies)
    ? (initialProject?.technologies as string[])
    : [];
  const [technologiesInput, setTechnologiesInput] = useState(initialTechs.join(", "));

  // Relationships
  const initialRelServices = Array.isArray(initialProject?.related_service_ids)
    ? (initialProject?.related_service_ids as string[])
    : [];
  const [selectedServices, setSelectedServices] = useState<string[]>(initialRelServices);

  const initialRelProducts = Array.isArray(initialProject?.related_product_ids)
    ? (initialProject?.related_product_ids as string[])
    : [];
  const [selectedProducts, setSelectedProducts] = useState<string[]>(initialRelProducts);

  // Confirmed Outcomes / Metrics
  const initialMetrics = Array.isArray(initialProject?.metrics)
    ? (initialProject?.metrics as unknown as ProjectMetric[])
    : [];
  const [metrics, setMetrics] = useState<ProjectMetric[]>(initialMetrics);

  // Narrative Story Blocks
  const storyBlocks = (initialProject?.story_blocks || {}) as ProjectStoryBlocks;
  const [challengeTitle, setChallengeTitle] = useState(storyBlocks.challenge?.title || "");
  const [challengeContent, setChallengeContent] = useState(storyBlocks.challenge?.content || "");

  const [approachTitle, setApproachTitle] = useState(storyBlocks.approach?.title || "");
  const [approachContent, setApproachContent] = useState(storyBlocks.approach?.content || "");

  const [solutionTitle, setSolutionTitle] = useState(storyBlocks.solution?.title || "");
  const [solutionContent, setSolutionContent] = useState(storyBlocks.solution?.content || "");

  const [techTitle, setTechTitle] = useState(storyBlocks.technology?.title || "");
  const [techContent, setTechContent] = useState(storyBlocks.technology?.content || "");

  const [outcomeTitle, setOutcomeTitle] = useState(storyBlocks.outcome?.title || "");
  const [outcomeContent, setOutcomeContent] = useState(storyBlocks.outcome?.content || "");
  const [outcomeSource, setOutcomeSource] = useState(storyBlocks.outcome?.source || "");
  const [outcomeOwner, setOutcomeOwner] = useState(storyBlocks.outcome?.owner || "");

  const [evidenceTitle, setEvidenceTitle] = useState(storyBlocks.evidence?.title || "");
  const [evidenceContent, setEvidenceContent] = useState(storyBlocks.evidence?.content || "");
  const [evidenceSource, setEvidenceSource] = useState(storyBlocks.evidence?.source || "");

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProject?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(initialProject?.seo_description || "");

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug from title if empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  // Add / Remove metrics
  const addMetric = () => {
    setMetrics((prev) => [
      ...prev,
      { value: "", label: "", source: "", owner: "" },
    ]);
  };

  const updateMetric = (idx: number, field: keyof ProjectMetric, val: string) => {
    setMetrics((prev) => {
      const next = [...prev];
      const item = next[idx];
      if (!item) return prev;
      next[idx] = { ...item, [field]: val };
      return next;
    });
  };

  const removeMetric = (idx: number) => {
    setMetrics((prev) => prev.filter((_, i) => i !== idx));
  };

  // Toggle relationships
  const toggleService = (slugOrId: string) => {
    setSelectedServices((prev) =>
      prev.includes(slugOrId) ? prev.filter((s) => s !== slugOrId) : [...prev, slugOrId]
    );
  };

  const toggleProduct = (slugOrId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(slugOrId) ? prev.filter((p) => p !== slugOrId) : [...prev, slugOrId]
    );
  };

  // Submit Handler
  const handleSubmit = (targetStatus: "draft" | "published" | "archived") => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side hard gate preview check
    if (targetStatus === "published") {
      if (clientPermissionStatus !== "granted") {
        setErrorMessage(
          `Publication Blocked: Client permission status is "${clientPermissionStatus}". Explicit client permission ('granted') is required before publishing.`
        );
        return;
      }

      // Check metrics for source & owner
      for (let i = 0; i < metrics.length; i++) {
        const m = metrics[i];
        if (!m) continue;
        if (!m.source || m.source.trim().length === 0) {
          setErrorMessage(
            `Publication Blocked: Metric #${i + 1} ("${m.label || m.value}") is missing a verifiable source.`
          );
          return;
        }
        if (!m.owner || m.owner.trim().length === 0) {
          setErrorMessage(
            `Publication Blocked: Metric #${i + 1} ("${m.label || m.value}") is missing an assigned internal owner.`
          );
          return;
        }
      }
    }

    const techs = technologiesInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const compiledStoryBlocks: ProjectStoryBlocks = {};
    if (challengeContent.trim()) {
      compiledStoryBlocks.challenge = {
        title: challengeTitle.trim() || undefined,
        content: challengeContent.trim(),
      };
    }
    if (approachContent.trim()) {
      compiledStoryBlocks.approach = {
        title: approachTitle.trim() || undefined,
        content: approachContent.trim(),
      };
    }
    if (solutionContent.trim()) {
      compiledStoryBlocks.solution = {
        title: solutionTitle.trim() || undefined,
        content: solutionContent.trim(),
      };
    }
    if (techContent.trim() || techs.length > 0) {
      compiledStoryBlocks.technology = {
        title: techTitle.trim() || undefined,
        content: techContent.trim(),
        tags: techs,
      };
    }
    if (outcomeContent.trim()) {
      compiledStoryBlocks.outcome = {
        title: outcomeTitle.trim() || undefined,
        content: outcomeContent.trim(),
        source: outcomeSource.trim() || undefined,
        owner: outcomeOwner.trim() || undefined,
      };
    }
    if (evidenceContent.trim()) {
      compiledStoryBlocks.evidence = {
        title: evidenceTitle.trim() || undefined,
        content: evidenceContent.trim(),
        source: evidenceSource.trim() || undefined,
      };
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      category_slug: categorySlug || null,
      technologies: techs,
      project_status: projectStatus,
      status: targetStatus,
      client_permission_status: clientPermissionStatus,
      is_featured: isFeatured,
      display_order: Number(displayOrder) || 1,
      period_year: periodYear.trim() || null,
      external_url: externalUrl.trim() || null,
      metrics,
      story_blocks: compiledStoryBlocks as unknown as Record<string, unknown>,
      related_service_ids: selectedServices,
      related_product_ids: selectedProducts,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    startTransition(async () => {
      try {
        if (isEditing && initialProject) {
          const res = await updateProjectAction(initialProject.id, payload as any);
          if (res.success) {
            setSuccessMessage("Case study updated successfully.");
            setStatus(targetStatus);
            router.refresh();
          }
        } else {
          const res = await createProjectAction(payload as any);
          if (res.success && res.project) {
            router.push(`/admin/portfolio/${res.project.id}`);
          }
        }
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to save portfolio project."
        );
      }
    });
  };

  const handleArchive = () => {
    if (!initialProject) return;
    handleSubmit("archived");
  };

  const handleDelete = () => {
    if (!initialProject) return;
    if (!window.confirm(`Are you sure you want to delete "${initialProject.title}"?`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteProjectAction(initialProject.id);
        router.push("/admin/portfolio");
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to delete project.");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Alert Messages */}
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

      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 text-sm font-sans flex items-start justify-between gap-3"
        >
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 font-bold hover:opacity-80"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-surface-secondary border border-border-default sticky top-20 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/portfolio"
            className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink-primary"
          >
            &larr; Portfolio
          </Link>
          <span className="text-ink-muted">&bull;</span>
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink-primary">
            Status: {status}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditing && slug && (
            <Link
              href={`/api/preview?path=/portfolio/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded border border-border-default bg-surface-primary text-xs font-mono uppercase tracking-wider hover:bg-surface-elevated text-ink-secondary hover:text-ink-primary"
            >
              Draft Preview
            </Link>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSubmit("draft")}
            disabled={isPending}
          >
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSubmit("published")}
            disabled={isPending}
          >
            Publish Live
          </Button>

          {isEditing && status === "published" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
              disabled={isPending}
            >
              Archive
            </Button>
          )}

          {isEditing && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* SECTION 1: IDENTITY */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <h2 className="font-serif text-xl text-ink-primary border-b border-border-default pb-2">
          01. Project Identity & Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Project Title *" id="title">
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. HENU Housing Accounting ERP"
              required
            />
          </FormField>

          <FormField
            label="URL Slug *"
            id="slug"
            hint="Lowercase letters, numbers, hyphens only. e.g. henu-housing-erp"
          >
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="henu-housing-erp"
              required
            />
          </FormField>
        </div>

        <FormField label="Short Summary *" id="summary" hint="High-impact 1-3 sentence summary">
          <textarea
            id="summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="A sovereign, multi-entity financial accounting and ledger engine engineered for real estate collectives..."
            required
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Timeline / Year" id="periodYear">
            <Input
              id="periodYear"
              value={periodYear}
              onChange={(e) => setPeriodYear(e.target.value)}
              placeholder="2025"
            />
          </FormField>

          <FormField label="Project Status" id="projectStatus">
            <select
              id="projectStatus"
              value={projectStatus}
              onChange={(e) =>
                setProjectStatus(e.target.value as "live" | "in_development" | "internal")
              }
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            >
              <option value="live">Live in Production</option>
              <option value="in_development">In Active Development</option>
              <option value="internal">Internal Sovereign System</option>
            </select>
          </FormField>

          <FormField label="Display Order" id="displayOrder">
            <Input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
              min={1}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FormField label="External Deployment URL (Optional)" id="externalUrl">
            <Input
              id="externalUrl"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://app.henu.org"
            />
          </FormField>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border-default text-accent-pine focus:ring-accent-spectral"
            />
            <label htmlFor="isFeatured" className="text-sm font-sans text-ink-primary font-medium">
              Featured Flagship Case Study
            </label>
          </div>
        </div>
      </section>

      {/* SECTION 2: CLASSIFICATION & VOCABULARY */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <h2 className="font-serif text-xl text-ink-primary border-b border-border-default pb-2">
          02. Classification & Technologies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Primary Category" id="categorySlug">
            <select
              id="categorySlug"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Technologies (Comma-separated)"
            id="technologiesInput"
            hint="e.g. TypeScript, Next.js, PostgreSQL, Docker"
          >
            <Input
              id="technologiesInput"
              value={technologiesInput}
              onChange={(e) => setTechnologiesInput(e.target.value)}
              placeholder="TypeScript, Next.js, PostgreSQL, Docker"
            />
          </FormField>
        </div>
      </section>

      {/* SECTION 3: GOVERNANCE & CLIENT PERMISSION (PORT-001 HARD GATE) */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <div className="border-b border-border-default pb-2 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink-primary">
            03. Client Permission & Disclosure Clearance
          </h2>
          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/30">
            Publish Gate Hard Gate
          </span>
        </div>

        <p className="font-sans text-xs text-ink-secondary leading-relaxed">
          In strict compliance with Document 05 §8.7, a case study cannot be published publicly unless client permission is explicitly set to &ldquo;Granted&rdquo;. Do not assume project details or artifacts are public without confirmed consent.
        </p>

        <FormField label="Client Permission Status *" id="clientPermissionStatus">
          <select
            id="clientPermissionStatus"
            value={clientPermissionStatus}
            onChange={(e) =>
              setClientPermissionStatus(
                e.target.value as "granted" | "internal_review" | "pending" | "denied"
              )
            }
            className={`w-full px-3 py-2 rounded-md border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral ${
              clientPermissionStatus === "granted"
                ? "border-green-500/50 bg-green-500/5 text-green-900"
                : "border-amber-500/50 bg-amber-500/5 text-amber-900"
            }`}
          >
            <option value="internal_review">Internal Review (Blocked from Public)</option>
            <option value="pending">Pending Client Consent (Blocked from Public)</option>
            <option value="denied">Consent Denied / Confidential (Blocked from Public)</option>
            <option value="granted">Granted — Authorized for Public Release</option>
          </select>
        </FormField>
      </section>

      {/* SECTION 4: CONFIRMED OUTCOMES & METRICS GOVERNANCE */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <div className="border-b border-border-default pb-2 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-ink-primary">
              04. Confirmed Outcomes & Metrics
            </h2>
            <p className="font-sans text-xs text-ink-secondary mt-1">
              Every published metric requires a verifiable evidence source and internal owner. Never publish unverified or fabricated figures.
            </p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addMetric}>
            + Add Metric
          </Button>
        </div>

        {metrics.length === 0 ? (
          <p className="font-sans text-xs text-ink-muted italic py-2">
            No quantitative metrics configured. Qualitative case-study narrative will be rendered without filler figures.
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border-default bg-surface-secondary/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    Metric #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="text-xs text-red-600 hover:underline font-mono"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Metric Value *" id={`metric-val-${idx}`}>
                    <Input
                      id={`metric-val-${idx}`}
                      value={metric.value}
                      onChange={(e) => updateMetric(idx, "value", e.target.value)}
                      placeholder="e.g. 100% or <500ms"
                      required
                    />
                  </FormField>

                  <FormField label="Metric Label *" id={`metric-lbl-${idx}`}>
                    <Input
                      id={`metric-lbl-${idx}`}
                      value={metric.label}
                      onChange={(e) => updateMetric(idx, "label", e.target.value)}
                      placeholder="e.g. Double-Entry Ledger Integrity"
                      required
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="Verifiable Source *"
                    id={`metric-src-${idx}`}
                    hint="Audit trail, telemetry log, or signed report"
                  >
                    <Input
                      id={`metric-src-${idx}`}
                      value={metric.source}
                      onChange={(e) => updateMetric(idx, "source", e.target.value)}
                      placeholder="e.g. Production Journal Reconciliation Log"
                      required
                    />
                  </FormField>

                  <FormField
                    label="Audit Owner *"
                    id={`metric-own-${idx}`}
                    hint="Internal engineering or solutions owner"
                  >
                    <Input
                      id={`metric-own-${idx}`}
                      value={metric.owner}
                      onChange={(e) => updateMetric(idx, "owner", e.target.value)}
                      placeholder="e.g. HENU Core Engineering"
                      required
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5: SPARSE-CONTENT NARRATIVE BLOCKS */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <div>
          <h2 className="font-serif text-xl text-ink-primary">
            05. Case Study Storytelling Blocks
          </h2>
          <p className="font-sans text-xs text-ink-secondary mt-1">
            All blocks are optional. Sections without content are automatically omitted from the public presentation to prevent empty placeholder boxes.
          </p>
        </div>

        {/* Challenge */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 01 // Challenge
          </span>
          <Input
            value={challengeTitle}
            onChange={(e) => setChallengeTitle(e.target.value)}
            placeholder="Custom Challenge Headline (optional)"
          />
          <textarea
            rows={3}
            value={challengeContent}
            onChange={(e) => setChallengeContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Describe the operational problem, friction, and industry bottlenecks..."
          />
        </div>

        {/* Approach */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 02 // Approach
          </span>
          <Input
            value={approachTitle}
            onChange={(e) => setApproachTitle(e.target.value)}
            placeholder="Custom Approach Headline (optional)"
          />
          <textarea
            rows={3}
            value={approachContent}
            onChange={(e) => setApproachContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Describe the architectural design, security modeling, and engineering phasing..."
          />
        </div>

        {/* Solution */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 03 // Solution
          </span>
          <Input
            value={solutionTitle}
            onChange={(e) => setSolutionTitle(e.target.value)}
            placeholder="Custom Solution Headline (optional)"
          />
          <textarea
            rows={3}
            value={solutionContent}
            onChange={(e) => setSolutionContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Describe the deployed implementation, components, and user interfaces..."
          />
        </div>

        {/* Technology */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 04 // Technology Narrative
          </span>
          <Input
            value={techTitle}
            onChange={(e) => setTechTitle(e.target.value)}
            placeholder="Custom Technology Headline (optional)"
          />
          <textarea
            rows={3}
            value={techContent}
            onChange={(e) => setTechContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Technical details of database isolation, runtime performance, containerization..."
          />
        </div>

        {/* Qualitative Outcome */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 05 // Qualitative Outcome Narrative
          </span>
          <Input
            value={outcomeTitle}
            onChange={(e) => setOutcomeTitle(e.target.value)}
            placeholder="Outcome Headline (optional)"
          />
          <textarea
            rows={3}
            value={outcomeContent}
            onChange={(e) => setOutcomeContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Narrative explanation of operational outcomes and client impact..."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={outcomeSource}
              onChange={(e) => setOutcomeSource(e.target.value)}
              placeholder="Outcome Source (required if publishing claim)"
            />
            <Input
              value={outcomeOwner}
              onChange={(e) => setOutcomeOwner(e.target.value)}
              placeholder="Outcome Internal Owner (required if publishing claim)"
            />
          </div>
        </div>

        {/* Evidence */}
        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Phase 06 // Evidence & Verification
          </span>
          <Input
            value={evidenceTitle}
            onChange={(e) => setEvidenceTitle(e.target.value)}
            placeholder="Evidence Headline (optional)"
          />
          <textarea
            rows={2}
            value={evidenceContent}
            onChange={(e) => setEvidenceContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral"
            placeholder="Details of verification, audit trials, or code inspections..."
          />
          <Input
            value={evidenceSource}
            onChange={(e) => setEvidenceSource(e.target.value)}
            placeholder="Evidence Reference / Citation (optional)"
          />
        </div>
      </section>

      {/* SECTION 6: ECOSYSTEM RELATIONSHIPS */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <h2 className="font-serif text-xl text-ink-primary border-b border-border-default pb-2">
          06. Ecosystem Relationships
        </h2>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Related Professional Services
          </span>
          <div className="flex flex-wrap gap-2">
            {availableServices.map((service) => {
              const isSelected =
                selectedServices.includes(service.id) ||
                selectedServices.includes(service.slug);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.slug)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    isSelected
                      ? "bg-ink-primary text-surface-primary font-semibold"
                      : "border border-border-default bg-surface-secondary text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {service.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-border-default/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
            Related Computing Products
          </span>
          <div className="flex flex-wrap gap-2">
            {availableProducts.map((prod) => {
              const isSelected =
                selectedProducts.includes(prod.id) ||
                selectedProducts.includes(prod.slug);
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => toggleProduct(prod.slug)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    isSelected
                      ? "bg-ink-primary text-surface-primary font-semibold"
                      : "border border-border-default bg-surface-secondary text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {prod.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: SEO */}
      <section className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-4">
        <h2 className="font-serif text-xl text-ink-primary border-b border-border-default pb-2">
          07. SEO & OpenGraph Overrides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="SEO Title Override" id="seoTitle">
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Architectural Case Study — HENU Housing Accounting ERP"
            />
          </FormField>

          <FormField label="SEO Description Override" id="seoDescription">
            <Input
              id="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Search engine summary..."
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}

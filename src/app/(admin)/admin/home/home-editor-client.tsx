"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import type { HomeContent, Product, PortfolioProject } from "@/types/domain";
import { updateHomeContentAction } from "@/server/actions/home.actions";
import { uploadMediaAction } from "@/server/actions/media.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";

interface HomeEditorClientProps {
  initialContent: HomeContent;
  availableProducts: Product[];
  availableProjects: PortfolioProject[];
}

export function HomeEditorClient({
  initialContent,
  availableProducts,
  availableProjects,
}: HomeEditorClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  const initialFeaturedProjects = Array.isArray(initialContent.featured_project_ids)
    ? (initialContent.featured_project_ids as string[])
    : [];

  const initialFeaturedProducts = Array.isArray(initialContent.featured_product_ids)
    ? (initialContent.featured_product_ids as string[])
    : [];

  const [formData, setFormData] = useState({
    hero_statement: initialContent.hero_statement,
    hero_supporting_line: initialContent.hero_supporting_line,
    hero_primary_cta_label: initialContent.hero_primary_cta_label,
    hero_primary_cta_target: initialContent.hero_primary_cta_target,
    hero_secondary_cta_label: initialContent.hero_secondary_cta_label,
    hero_secondary_cta_target: initialContent.hero_secondary_cta_target,
    hero_image_url: initialContent.hero_image_url || "/brand/henu-os.png",
    flagship_headline: initialContent.flagship_headline,
    flagship_summary: initialContent.flagship_summary,
    services_intro: initialContent.services_intro,
    about_teaser: initialContent.about_teaser,
    featured_project_ids: initialFeaturedProjects,
    featured_product_ids: initialFeaturedProducts,
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("altText", "HENU Home Hero Visual Asset");
    fd.append("isDecorative", "false");

    startUploadTransition(async () => {
      try {
        const result = await uploadMediaAction(fd);
        if (result.success && result.asset) {
          const uploadedUrl = result.publicUrl || `/${result.asset.storage_key}`;
          setFormData((prev) => ({ ...prev, hero_image_url: uploadedUrl }));
          setStatusMessage({
            type: "success",
            text: `Hero image "${result.asset.original_filename}" uploaded successfully. Click "Save & Publish Changes" below to apply.`,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to upload image.";
        setStatusMessage({ type: "error", text: msg });
      }
    });
  };

  const toggleFeaturedProject = (projectId: string) => {
    setFormData((prev) => {
      const exists = prev.featured_project_ids.includes(projectId);
      const updated = exists
        ? prev.featured_project_ids.filter((id) => id !== projectId)
        : [...prev.featured_project_ids, projectId];
      return { ...prev, featured_project_ids: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      try {
        await updateHomeContentAction(formData);
        setStatusMessage({
          type: "success",
          text: "Home content updated and published successfully. Public cache revalidated.",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update home content.";
        setStatusMessage({
          type: "error",
          text: msg,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "default" : "destructive"}
          title={statusMessage.type === "success" ? "Saved & Published" : "Publish Gate Rejection"}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* Opening Statement & Spectrum Card Section */}
      <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs space-y-6">
        <h2 className="font-display text-lg font-bold text-ink-primary border-b border-border-subtle pb-3">
          1. Hero Opening & Spectrum Field (HOME-001)
        </h2>

        <FormField
          id="hero_statement"
          label="Display Statement (h1)"
          hint="The primary statement rendered on the home opening."
        >
          <Textarea
            id="hero_statement"
            name="hero_statement"
            rows={2}
            value={formData.hero_statement}
            onChange={(e) => setFormData({ ...formData, hero_statement: e.target.value })}
            required
          />
        </FormField>

        <FormField
          id="hero_supporting_line"
          label="Supporting Subtitle"
          hint="Clear explanatory narrative beneath the primary statement."
        >
          <Textarea
            id="hero_supporting_line"
            name="hero_supporting_line"
            rows={3}
            value={formData.hero_supporting_line}
            onChange={(e) => setFormData({ ...formData, hero_supporting_line: e.target.value })}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FormField id="hero_primary_cta_label" label="Primary CTA Label">
            <Input
              id="hero_primary_cta_label"
              value={formData.hero_primary_cta_label}
              onChange={(e) => setFormData({ ...formData, hero_primary_cta_label: e.target.value })}
              required
            />
          </FormField>

          <FormField id="hero_primary_cta_target" label="Primary CTA Target Path">
            <Input
              id="hero_primary_cta_target"
              value={formData.hero_primary_cta_target}
              onChange={(e) => setFormData({ ...formData, hero_primary_cta_target: e.target.value })}
              required
            />
          </FormField>

          <FormField id="hero_secondary_cta_label" label="Secondary CTA Label">
            <Input
              id="hero_secondary_cta_label"
              value={formData.hero_secondary_cta_label}
              onChange={(e) => setFormData({ ...formData, hero_secondary_cta_label: e.target.value })}
              required
            />
          </FormField>

          <FormField id="hero_secondary_cta_target" label="Secondary CTA Target Path">
            <Input
              id="hero_secondary_cta_target"
              value={formData.hero_secondary_cta_target}
              onChange={(e) => setFormData({ ...formData, hero_secondary_cta_target: e.target.value })}
              required
            />
          </FormField>
        </div>

        {/* Hero Visual Asset (Right-Side Hero Image) */}
        <div className="pt-6 border-t border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-ink-primary">
                Hero Visual Asset (Right-Side Image)
              </h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Displays on the right side of the Home opening. Upload an image, choose a preset, or specify an image URL.
              </p>
            </div>
            {formData.hero_image_url && (
              <Badge variant="success" size="sm">
                Custom Asset Active
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-4">
              {/* Direct File Upload */}
              <div className="p-4 rounded-lg border border-border-default bg-surface-secondary/40 space-y-3">
                <label
                  htmlFor="hero-file-upload"
                  className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-primary"
                >
                  Upload New Image Asset
                </label>
                <input
                  id="hero-file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="block w-full text-xs text-ink-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-surface-primary file:text-ink-primary hover:file:bg-surface-secondary file:cursor-pointer cursor-pointer border border-border-default rounded-md p-1"
                />
                {isUploading && (
                  <p className="font-mono text-xs text-accent-spectral animate-pulse">
                    Uploading image asset to media storage...
                  </p>
                )}
              </div>

              {/* URL or Path Input */}
              <FormField
                id="hero_image_url"
                label="Image Path / Public URL"
                hint="Relative path (e.g. /brand/henu-os.png) or HTTPS URL"
              >
                <Input
                  id="hero_image_url"
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                  placeholder="/brand/henu-os.png"
                />
              </FormField>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="block font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                  Quick Brand Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hero_image_url: "/brand/henu-os.png" })}
                    className="px-2.5 py-1 text-xs rounded border border-border-default bg-surface-secondary/60 hover:bg-surface-secondary text-ink-primary transition-colors cursor-pointer"
                  >
                    HENU OS Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hero_image_url: "/brand/henu-dragon.png" })}
                    className="px-2.5 py-1 text-xs rounded border border-border-default bg-surface-secondary/60 hover:bg-surface-secondary text-ink-primary transition-colors cursor-pointer"
                  >
                    HENU Dragon
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hero_image_url: "/brand/henu-ai.png" })}
                    className="px-2.5 py-1 text-xs rounded border border-border-default bg-surface-secondary/60 hover:bg-surface-secondary text-ink-primary transition-colors cursor-pointer"
                  >
                    HENU AI
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <span className="block font-mono text-[11px] text-ink-muted uppercase tracking-wider mb-2 self-start">
                Hero Image Preview:
              </span>
              <div className="relative w-full aspect-square max-w-[220px] rounded-xl border border-border-default bg-surface-primary/80 overflow-hidden flex items-center justify-center p-3 shadow-sm">
                {formData.hero_image_url ? (
                  <Image
                    src={formData.hero_image_url}
                    alt="Hero Preview"
                    fill
                    sizes="220px"
                    className="object-contain p-2"
                    unoptimized={formData.hero_image_url.startsWith("http")}
                  />
                ) : (
                  <span className="font-mono text-xs text-ink-muted text-center px-4">
                    No image configured
                  </span>
                )}
              </div>
              <span className="mt-2 text-[11px] font-mono text-ink-muted text-center break-all max-w-[220px]">
                {formData.hero_image_url || "Using fallback default"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Foundational Pillars Section */}
      <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs space-y-6">
        <h2 className="font-display text-lg font-bold text-ink-primary border-b border-border-subtle pb-3">
          2. Pillar Summaries & Flagship Band (HOME-003)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="flagship_headline" label="Flagship Headline">
            <Input
              id="flagship_headline"
              value={formData.flagship_headline}
              onChange={(e) => setFormData({ ...formData, flagship_headline: e.target.value })}
              required
            />
          </FormField>

          <FormField id="flagship_summary" label="Flagship Summary">
            <Textarea
              id="flagship_summary"
              rows={2}
              value={formData.flagship_summary}
              onChange={(e) => setFormData({ ...formData, flagship_summary: e.target.value })}
              required
            />
          </FormField>
        </div>

        <FormField id="services_intro" label="Services Intro Summary">
          <Textarea
            id="services_intro"
            rows={2}
            value={formData.services_intro}
            onChange={(e) => setFormData({ ...formData, services_intro: e.target.value })}
            required
          />
        </FormField>

        <FormField id="about_teaser" label="About Teaser Summary">
          <Textarea
            id="about_teaser"
            rows={2}
            value={formData.about_teaser}
            onChange={(e) => setFormData({ ...formData, about_teaser: e.target.value })}
            required
          />
        </FormField>
      </div>

      {/* Featured Portfolio Selections (Publish Gated — ADMIN-005) */}
      <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs space-y-6">
        <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-primary">
              3. Featured Portfolio Selections (ADMIN-005)
            </h2>
            <p className="text-xs text-ink-secondary mt-1">
              Select verified published case studies to showcase on the home page. Draft or archived projects are blocked by publish gates.
            </p>
          </div>
          <Badge variant="outline" size="sm" className="font-mono">
            {formData.featured_project_ids.length} Selected
          </Badge>
        </div>

        {availableProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableProjects.map((project) => {
              const isSelected = formData.featured_project_ids.includes(project.id);
              return (
                <label
                  key={project.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-accent-pine bg-accent-pine/5"
                      : "border-border-default hover:border-border-strong bg-surface-secondary/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFeaturedProject(project.id)}
                    className="mt-1 rounded text-accent-pine focus:ring-accent-pine"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-ink-primary">{project.title}</p>
                    <p className="text-xs text-ink-muted line-clamp-1">{project.summary}</p>
                    <Badge variant="outline" size="sm" className="text-[10px] uppercase font-mono">
                      {project.status}
                    </Badge>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-border-subtle bg-surface-secondary/10 text-center text-xs text-ink-muted">
            No published portfolio case studies available. Publish projects first in Admin &rarr; Portfolio.
          </div>
        )}
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="lg" isLoading={isPending}>
            Publish Home Changes
          </Button>
          <LinkButton
            href="/api/preview?path=/"
            variant="outline"
            size="lg"
            target="_blank"
          >
            Launch Draft Preview &rarr;
          </LinkButton>
        </div>
        <span className="font-mono text-xs text-ink-muted">
          Revalidates on publish // Audit logged
        </span>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/domain";
import { createProductAction, updateProductAction } from "@/server/actions/product.actions";
import { uploadMediaAction } from "@/server/actions/media.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";

interface ProductFormClientProps {
  initialProduct?: Product | null;
}

export function ProductFormClient({ initialProduct }: ProductFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  const isEditing = Boolean(initialProduct);

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    tagline: initialProduct?.tagline || "",
    summary: initialProduct?.summary || "",
    image_url: (initialProduct as any)?.image_url || "",
    status: initialProduct?.status || "draft",
    status_label: initialProduct?.status_label || "in_development",
    hue_key: initialProduct?.hue_key || "os",
    template_variant: initialProduct?.template_variant || "os-environment",
    primary_cta_type: initialProduct?.primary_cta_type || "explore",
    primary_cta_target: initialProduct?.primary_cta_target || "/products",
    display_order: initialProduct?.display_order ?? 1,
    seo_title: initialProduct?.seo_title || "",
    seo_description: initialProduct?.seo_description || "",
  });

  // Dynamic capabilities list
  const [capabilities, setCapabilities] = useState<Array<{ title: string; description: string }>>(
    Array.isArray(initialProduct?.capabilities)
      ? (initialProduct?.capabilities as Array<{ title: string; description: string }>)
      : [
          { title: "Deterministic Core", description: "Engineered without runtime telemetry or background polling." },
          { title: "Direct IPC Integration", description: "Connects natively to local agent protocol sockets." },
        ]
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("altText", `${formData.name || "HENU Product"} Image Asset`);
    fd.append("isDecorative", "false");

    startUploadTransition(async () => {
      try {
        const result = await uploadMediaAction(fd);
        if (result.success && result.asset) {
          const uploadedUrl = result.publicUrl || `/${result.asset.storage_key}`;
          setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
          setStatusMessage({
            type: "success",
            text: `Image "${result.asset.original_filename}" uploaded successfully.`,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to upload image.";
        setStatusMessage({ type: "error", text: msg });
      }
    });
  };

  const addCapability = () => {
    setCapabilities([...capabilities, { title: "", description: "" }]);
  };

  const updateCapability = (index: number, field: "title" | "description", value: string) => {
    const updated = [...capabilities];
    const item = updated[index];
    if (item) {
      item[field] = value;
      setCapabilities(updated);
    }
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Front-line validation for download CTA
    if (formData.primary_cta_type === "download") {
      setStatusMessage({
        type: "error",
        text: "CTA Validation: A 'download' CTA cannot be published without an active, verified public release. Use 'explore' or 'waitlist' instead.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formData,
          image_url: formData.image_url.trim() ? formData.image_url.trim() : null,
          capabilities: capabilities.filter((c) => c.title.trim().length > 0),
          seo_title: formData.seo_title.trim() ? formData.seo_title : null,
          seo_description: formData.seo_description.trim() ? formData.seo_description : null,
        };

        if (isEditing && initialProduct) {
          await updateProductAction(initialProduct.id, payload);
          setStatusMessage({
            type: "success",
            text: `Product '${formData.name}' successfully updated and cache revalidated.`,
          });
          router.refresh();
        } else {
          const res = await createProductAction(payload as any);
          setStatusMessage({
            type: "success",
            text: `Product '${formData.name}' successfully created.`,
          });
          router.push(`/admin/products/${res.product.id}`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to persist product.";
        setStatusMessage({
          type: "error",
          text: msg,
        });
      }
    });
  };

  const isHenusOsReservedSlug =
    formData.slug.trim().toLowerCase() === "henu-os" &&
    isEditing &&
    initialProduct?.id !== "p1111111-1111-1111-1111-111111111111";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "default" : "destructive"}
          title={statusMessage.type === "success" ? "Operation Successful" : "Validation Error"}
        >
          {statusMessage.text}
        </Alert>
      )}

      {isHenusOsReservedSlug && (
        <Alert variant="destructive" title="Reserved Slug Warning">
          The slug <code>henu-os</code> is strictly reserved for the flagship HENU OS product. Another product cannot claim this slug.
        </Alert>
      )}

      {/* 1. IDENTITY & TAXONOMY */}
      <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <h2 className="font-serif text-lg text-ink-primary font-medium border-b border-border-default pb-3">
          Product Identity & Taxonomy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="name" label="Product Name" required>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. HENU OS"
              required
            />
          </FormField>

          <FormField
            id="slug"
            label="URL Slug"
            required
            hint="Lowercase alphanumeric with hyphens (e.g. henu-os, henu-ai)."
          >
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
              placeholder="e.g. henu-os"
              required
            />
          </FormField>
        </div>

        <FormField id="tagline" label="Tagline" required>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. The Flagship Developer-Centric Operating System"
            required
          />
        </FormField>

        <FormField
          id="summary"
          label="Architectural Summary"
          required
          hint="Editorial overview rendered on product head and card previews."
        >
          <Textarea
            id="summary"
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="A refined, high-performance computing environment engineered for builders..."
            required
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <FormField id="status" label="Publication Status">
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm text-ink-primary"
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public)</option>
              <option value="archived">Archived (Hidden)</option>
            </select>
          </FormField>

          <FormField id="status_label" label="Development Label">
            <select
              id="status_label"
              value={formData.status_label}
              onChange={(e) => setFormData({ ...formData, status_label: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm text-ink-primary"
            >
              <option value="in_development">In Development</option>
              <option value="beta">Beta Testing</option>
              <option value="available">Publicly Available</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </FormField>

          <FormField id="hue_key" label="Hue Accent">
            <select
              id="hue_key"
              value={formData.hue_key}
              onChange={(e) => setFormData({ ...formData, hue_key: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm text-ink-primary"
            >
              <option value="os">OS (Deep Pine)</option>
              <option value="ai">AI (Deep Violet)</option>
              <option value="pa">PA (Ember)</option>
              <option value="ide">IDE (Forest Green)</option>
            </select>
          </FormField>

          <FormField id="template_variant" label="Template Variant">
            <select
              id="template_variant"
              value={formData.template_variant}
              onChange={(e) => setFormData({ ...formData, template_variant: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm text-ink-primary"
            >
              <option value="os-environment">OS Environment</option>
              <option value="ai-capabilities">AI Capabilities</option>
              <option value="pa-conversation">PA Conversation</option>
              <option value="ide-workflow">IDE Workflow</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* 2. PRODUCT VISUAL ASSET & IMAGE */}
      <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div>
            <h2 className="font-serif text-lg text-ink-primary font-medium">
              Product Visual Asset / Card Image
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Replaces simulated animations with an authentic product screenshot, brand visual, or architectural graphic.
            </p>
          </div>
          <Badge variant="outline" size="sm">
            Public Card Media
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {/* File Upload Button */}
            <FormField
              id="product_image_file"
              label="Upload Image File"
              hint="Upload PNG, WebP, JPG, or SVG directly to local storage / CDN."
            >
              <div className="flex items-center gap-3">
                <input
                  id="product_image_file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="block w-full text-xs text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border-default file:text-xs file:font-mono file:bg-surface-secondary file:text-ink-primary hover:file:bg-surface-tertiary cursor-pointer disabled:opacity-50"
                />
              </div>
              {isUploading && (
                <p className="text-xs text-brand-pine animate-pulse font-mono mt-1">
                  Uploading image to media library...
                </p>
              )}
            </FormField>

            {/* Direct Image URL input */}
            <FormField
              id="image_url"
              label="Or Direct Image Path / URL"
              hint="Enter an absolute URL or local path (e.g. /brand/henu-ai.png)"
            >
              <div className="flex items-center gap-2">
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/brand/henu-os.png or https://..."
                />
                {formData.image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="text-xs text-ink-muted hover:text-red-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </FormField>

            {/* Quick Brand Presets */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">
                Quick Brand Presets:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "HENU OS", path: "/brand/henu-os.png" },
                  { label: "HENU AI", path: "/brand/henu-ai.png" },
                  { label: "HENU PA", path: "/brand/henu-pa.png" },
                  { label: "HENU IDE", path: "/brand/henu-ide.png" },
                  { label: "Dragon Emblem", path: "/brand/henu-dragon.png" },
                  { label: "Ocular Eye", path: "/brand/henu-eye-1120.png" },
                ].map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: preset.path })}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors font-mono ${
                      formData.image_url === preset.path
                        ? "border-brand-pine bg-brand-pine/10 text-brand-pine font-medium"
                        : "border-border-default bg-surface-secondary text-ink-secondary hover:bg-surface-tertiary"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-border-default bg-surface-secondary/40 min-h-[220px]">
            {formData.image_url ? (
              <div className="w-full space-y-2">
                <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-black/40 border border-border-default shadow-sm flex items-center justify-center">
                  <Image
                    src={formData.image_url}
                    alt={formData.name || "Product preview"}
                    fill
                    className="object-contain p-4"
                    unoptimized={formData.image_url.startsWith("http") || formData.image_url.endsWith(".svg")}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-muted font-mono truncate px-1">
                  <span className="truncate">{formData.image_url}</span>
                  <span className="text-brand-pine shrink-0">Live Active</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full border border-border-default bg-surface-tertiary/60 mx-auto flex items-center justify-center text-ink-muted">
                  <svg
                    className="w-6 h-6 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-mono text-ink-muted">No image uploaded yet</p>
                <p className="text-[11px] text-ink-muted max-w-[200px] mx-auto">
                  Upload an image or pick a preset to display on product cards.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. CALL-TO-ACTION & INTEGRITY VALIDATION */}
      <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <h2 className="font-serif text-lg text-ink-primary font-medium">
            Call-to-Action & State Enforcement
          </h2>
          <Badge variant="outline" size="sm">
            PROD-006 Validated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="primary_cta_type"
            label="Primary CTA Type"
            hint="A 'download' CTA cannot be published unless a verified public release exists."
          >
            <select
              id="primary_cta_type"
              value={formData.primary_cta_type}
              onChange={(e) => setFormData({ ...formData, primary_cta_type: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md border border-border-default bg-surface-primary text-sm text-ink-primary"
            >
              <option value="explore">Explore Architecture</option>
              <option value="waitlist">Join Waitlist / Updates</option>
              <option value="demo">Request Briefing</option>
              <option value="enquire">General Enquiry</option>
              <option value="download">Download (Requires Active Public Release)</option>
            </select>
          </FormField>

          <FormField
            id="primary_cta_target"
            label="Primary CTA Target Path"
            required
            hint="Internal path (e.g. /products/henu-os) or verified URL."
          >
            <Input
              id="primary_cta_target"
              value={formData.primary_cta_target}
              onChange={(e) => setFormData({ ...formData, primary_cta_target: e.target.value })}
              required
            />
          </FormField>
        </div>
      </div>

      {/* 3. CAPABILITIES EDITOR */}
      <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <div>
            <h2 className="font-serif text-lg text-ink-primary font-medium">
              Confirmed Capabilities
            </h2>
            <p className="text-xs text-ink-muted">
              Documented technical capabilities confirmed by project specifications.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addCapability}>
            + Add Capability
          </Button>
        </div>

        <div className="space-y-4">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className="p-4 rounded border border-border-default bg-surface-secondary/30 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-muted">Capability 0{index + 1}</span>
                {capabilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCapability(index)}
                    className="text-xs text-status-error hover:underline focus-visible:outline-focus-ring"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Input
                placeholder="Capability Title (e.g. Sovereign Execution)"
                value={cap.title}
                onChange={(e) => updateCapability(index, "title", e.target.value)}
              />
              <Textarea
                placeholder="Technical description of verified capability..."
                rows={2}
                value={cap.description}
                onChange={(e) => updateCapability(index, "description", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEO METADATA */}
      <div className="p-6 rounded-lg border border-border-default bg-surface-primary space-y-6">
        <h2 className="font-serif text-lg text-ink-primary font-medium border-b border-border-default pb-3">
          SEO & OpenGraph Configuration
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            id="seo_title"
            label="SEO Title Override"
            hint="Leave empty to use automatic '{Product Name} — HENU Platform'."
          >
            <Input
              id="seo_title"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder="e.g. HENU OS — Flagship Developer Operating System"
            />
          </FormField>

          <FormField
            id="seo_description"
            label="SEO Description Override"
            hint="Search snippet and social share description."
          >
            <Textarea
              id="seo_description"
              rows={2}
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder="e.g. Official technical architecture and developer overview of HENU OS."
            />
          </FormField>
        </div>
      </div>

      {/* 5. ACTIONS & PREVIEW */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-default">
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="lg" disabled={isPending}>
            {isPending ? "Persisting..." : isEditing ? "Update Product" : "Create Product"}
          </Button>

          {isEditing && initialProduct && (
            <LinkButton
              href={`/api/preview?path=/products/${initialProduct.slug}`}
              variant="outline"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview in Draft Mode &rarr;
            </LinkButton>
          )}
        </div>

        <LinkButton href="/admin/products" variant="ghost" size="md">
          Cancel & Return to List
        </LinkButton>
      </div>
    </form>
  );
}

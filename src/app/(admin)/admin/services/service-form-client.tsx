"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Service, ServiceCategory } from "@/types/domain";
import { createServiceAction, updateServiceAction } from "@/server/actions/service.actions";
import { validateServicePricing } from "@/lib/validation/service-price-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";

interface ServiceFormClientProps {
  initialService?: Service | null;
  categories: ServiceCategory[];
}

export function ServiceFormClient({ initialService, categories }: ServiceFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialService);

  // Extract initial structured blocks
  const initProblem = (initialService?.problem_block as {
    headline?: string;
    description?: string;
    points?: string[];
  }) || { headline: "", description: "", points: [] };

  const initCapability = (initialService?.capability_block as {
    headline?: string;
    description?: string;
    attributes?: string[];
  }) || { headline: "", description: "", attributes: [] };

  const initApproach = (initialService?.approach_block as {
    headline?: string;
    description?: string;
  }) || { headline: "", description: "" };

  const initSolution = (initialService?.solution_block as {
    headline?: string;
    description?: string;
  }) || { headline: "", description: "" };

  const initOutcome = (initialService?.outcome_block as {
    headline?: string;
    description?: string;
  }) || { headline: "", description: "" };

  const initFaqs = Array.isArray(initialService?.faq_items)
    ? (initialService?.faq_items as Array<{ question: string; answer: string }>)
    : [];

  // Form State
  const [formData, setFormData] = useState({
    name: initialService?.name || "",
    slug: initialService?.slug || "",
    category_id: initialService?.category_id || (categories[0]?.id ?? ""),
    summary: initialService?.summary || "",
    status: (initialService?.status || "draft") as "draft" | "published" | "archived",
    requires_disclaimer: initialService?.requires_disclaimer || false,
    disclaimer_block: initialService?.disclaimer_block || "",
    display_order: initialService?.display_order ?? 1,
    seo_title: initialService?.seo_title || "",
    seo_description: initialService?.seo_description || "",
  });

  // Structured Block State
  const [problem, setProblem] = useState(initProblem);
  const [capability, setCapability] = useState(initCapability);
  const [approach, setApproach] = useState(initApproach);
  const [solution, setSolution] = useState(initSolution);
  const [outcome, setOutcome] = useState(initOutcome);
  const [faqItems, setFaqItems] = useState(initFaqs);

  // Points / Attributes helper text
  const [problemPointsRaw, setProblemPointsRaw] = useState(
    initProblem.points ? initProblem.points.join("\n") : ""
  );
  const [capabilityAttrsRaw, setCapabilityAttrsRaw] = useState(
    initCapability.attributes ? initCapability.attributes.join("\n") : ""
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const priceScanResult = validateServicePricing({
    name: formData.name,
    summary: formData.summary,
    disclaimer_block: formData.disclaimer_block,
    seo_title: formData.seo_title,
    seo_description: formData.seo_description,
    problem_block: { headline: problem.headline, description: problem.description, points: problemPointsRaw },
    capability_block: { headline: capability.headline, description: capability.description, attributes: capabilityAttrsRaw },
    approach_block: approach,
    solution_block: solution,
    outcome_block: outcome,
    faq_items: faqItems,
  });

  // FAQ Handlers
  const addFaq = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqItems];
    const item = updated[index];
    if (item) {
      item[field] = value;
      setFaqItems(updated);
    }
  };

  const removeFaq = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Front-line pricing validation
    if (!priceScanResult.allowed) {
      setStatusMessage({
        type: "error",
        text: `Pricing Policy Violation: ${priceScanResult.issues.join("; ")}. Public services must contain zero prices, packages, or payment figures.`,
      });
      return;
    }

    // Disclaimer validation
    if (formData.requires_disclaimer && (!formData.disclaimer_block || formData.disclaimer_block.trim().length < 10)) {
      setStatusMessage({
        type: "error",
        text: "This service requires a disclaimer. Please provide a complete, verified disclaimer before saving.",
      });
      return;
    }

    // Parse points and attributes
    const parsedProblemPoints = problemPointsRaw
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const parsedCapabilityAttrs = capabilityAttrsRaw
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const problemPayload =
      problem.headline || problem.description || parsedProblemPoints.length > 0
        ? {
            headline: problem.headline?.trim() || null,
            description: problem.description?.trim() || null,
            points: parsedProblemPoints,
          }
        : null;

    const capabilityPayload =
      capability.headline || capability.description || parsedCapabilityAttrs.length > 0
        ? {
            headline: capability.headline?.trim() || null,
            description: capability.description?.trim() || null,
            attributes: parsedCapabilityAttrs,
          }
        : null;

    const approachPayload =
      approach.headline || approach.description
        ? {
            headline: approach.headline?.trim() || null,
            description: approach.description?.trim() || null,
          }
        : null;

    const solutionPayload =
      solution.headline || solution.description
        ? {
            headline: solution.headline?.trim() || null,
            description: solution.description?.trim() || null,
          }
        : null;

    const outcomePayload =
      outcome.headline || outcome.description
        ? {
            headline: outcome.headline?.trim() || null,
            description: outcome.description?.trim() || null,
          }
        : null;

    const validFaqs = faqItems
      .filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0)
      .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));

    startTransition(async () => {
      try {
        if (isEditing && initialService) {
          await updateServiceAction(initialService.id, {
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            category_id: formData.category_id,
            summary: formData.summary.trim(),
            status: formData.status,
            requires_disclaimer: formData.requires_disclaimer,
            disclaimer_block: formData.disclaimer_block.trim() || null,
            display_order: Number(formData.display_order),
            seo_title: formData.seo_title.trim() || null,
            seo_description: formData.seo_description.trim() || null,
            problem_block: problemPayload,
            capability_block: capabilityPayload,
            approach_block: approachPayload,
            solution_block: solutionPayload,
            outcome_block: outcomePayload,
            faq_items: validFaqs,
          });

          setStatusMessage({
            type: "success",
            text: `Service '${formData.name}' successfully updated and cache revalidated.`,
          });
          router.refresh();
        } else {
          const res = await createServiceAction({
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            category_id: formData.category_id,
            summary: formData.summary.trim(),
            status: formData.status,
            requires_disclaimer: formData.requires_disclaimer,
            disclaimer_block: formData.disclaimer_block.trim() || null,
            display_order: Number(formData.display_order),
            seo_title: formData.seo_title.trim() || null,
            seo_description: formData.seo_description.trim() || null,
            problem_block: problemPayload,
            capability_block: capabilityPayload,
            approach_block: approachPayload,
            solution_block: solutionPayload,
            outcome_block: outcomePayload,
            faq_items: validFaqs,
          });

          setStatusMessage({
            type: "success",
            text: `Service '${formData.name}' registered successfully.`,
          });
          router.push(`/admin/services/${res.service.id}`);
        }
      } catch (err: unknown) {
        setStatusMessage({
          type: "error",
          text: err instanceof Error ? err.message : "An unexpected error occurred while saving.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl" noValidate>
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "info" : "error"}
          title={statusMessage.type === "success" ? "Operation Successful" : "Publish Gate / Validation Error"}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* Prohibited Price Alert */}
      {!priceScanResult.allowed && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-status-error/10 border border-status-error/40 text-status-error text-xs font-mono space-y-1"
        >
          <div className="font-bold flex items-center gap-2">
            <span>⛔ Hard Gate Triggered: Prohibited Price Content Detected</span>
          </div>
          <div>{priceScanResult.issues.join("; ")}</div>
          <div className="text-ink-muted">
            The HENU roadmap strictly forbids any pricing figures, package costs, or payment UI on the public website.
          </div>
        </div>
      )}

      {/* Top Bar with Status and Preview */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-surface-secondary/50 border border-border-default">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            Publication Status:
          </span>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "draft" | "published" | "archived",
              })
            }
            className="text-xs font-mono px-3 py-1.5 rounded border border-border-default bg-surface-primary text-ink-primary"
          >
            <option value="draft">Draft (Private)</option>
            <option value="published">Published (Public)</option>
            <option value="archived">Archived (Unreachable)</option>
          </select>

          {formData.status === "published" && <Badge variant="success">Will be Live</Badge>}
          {formData.status === "draft" && <Badge variant="warning">Draft Preview Only</Badge>}
          {formData.status === "archived" && <Badge variant="neutral">Archived</Badge>}
        </div>

        {isEditing && formData.slug && (
          <div className="flex items-center gap-2">
            <a
              href={`/api/preview?path=/services/${formData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-ink-primary hover:underline px-3 py-1.5 rounded border border-border-default bg-surface-primary hover:bg-surface-secondary transition-colors"
            >
              Draft Preview ↗
            </a>
          </div>
        )}
      </div>

      {/* Section 1: Core Identity */}
      <div className="space-y-4 p-6 rounded-lg border border-border-default bg-surface-primary shadow-subtle">
        <h2 className="font-display text-lg font-bold text-ink-primary border-b border-border-default pb-2">
          1. Service Identity & Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="service-name" label="Service Name" required>
            <Input
              id="service-name"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  name,
                  slug: isEditing
                    ? prev.slug
                    : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                }));
              }}
              placeholder="e.g. Sovereign AI Automation"
              required
            />
          </FormField>

          <FormField id="service-slug" label="URL Slug" required hint="Used in public route: /services/[slug]">
            <Input
              id="service-slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                })
              }
              placeholder="e.g. ai-automation"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="service-category" label="Category" required hint="Groups this service on the public index ledger">
            <select
              id="service-category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full text-sm font-sans px-3 py-2 rounded-md border border-border-default bg-surface-primary text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-spectral"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="service-order" label="Display Order" hint="Determines placement within category">
            <Input
              id="service-order"
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })
              }
              min={1}
            />
          </FormField>
        </div>

        <FormField
          id="service-summary"
          label="Short Introduction / Summary"
          required
          hint="Concise editorial summary shown on index ledger and detail hero (min 10 characters)."
        >
          <Textarea
            id="service-summary"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="High-level description of this architectural discipline..."
            rows={3}
            required
          />
        </FormField>
      </div>

      {/* Section 2: Sensitive-Service Governance & Disclaimer */}
      <div className="space-y-4 p-6 rounded-lg border border-border-default bg-surface-primary shadow-subtle">
        <div className="flex items-center justify-between border-b border-border-default pb-2">
          <h2 className="font-display text-lg font-bold text-ink-primary">
            2. Sensitive-Service Governance & Disclaimer
          </h2>
          {formData.requires_disclaimer && (
            <Badge variant="warning">Mandatory Disclaimer Active</Badge>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_disclaimer}
              onChange={(e) =>
                setFormData({ ...formData, requires_disclaimer: e.target.checked })
              }
              className="mt-1 rounded border-border-default text-accent-spectral focus:ring-accent-spectral"
            />
            <div>
              <span className="text-sm font-medium text-ink-primary font-sans">
                Requires Regulatory Disclaimer Block (Document 04 §14.4)
              </span>
              <p className="text-xs text-ink-secondary">
                Mandatory for Legal Services, Funding Solutions, and Startup Documentation. Service CANNOT be published without an approved disclaimer.
              </p>
            </div>
          </label>

          {formData.requires_disclaimer && (
            <FormField
              id="service-disclaimer"
              label="Legal Disclaimer Text"
              required={formData.requires_disclaimer}
              hint="Exact verified disclaimer text displayed prominently in header and footer of detail page."
            >
              <Textarea
                id="service-disclaimer"
                value={formData.disclaimer_block}
                onChange={(e) => setFormData({ ...formData, disclaimer_block: e.target.value })}
                placeholder="HENU provides advisory coordination and technical documentation assistance; HENU is not a licensed law firm or registered broker-dealer..."
                rows={4}
                required={formData.requires_disclaimer}
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Section 3: Structured Narrative Architecture */}
      <div className="space-y-6 p-6 rounded-lg border border-border-default bg-surface-primary shadow-subtle">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-primary">
            3. Structured Narrative Blocks (Optional / As Approved)
          </h2>
          <p className="text-xs text-ink-secondary mt-1 font-sans">
            Only fill sections for which verified catalogue content exists. Do not invent marketing copy.
          </p>
        </div>

        {/* Problem Block */}
        <div className="p-4 rounded-md border border-border-default/60 bg-surface-secondary/20 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold">
            Section: Problem
          </div>
          <Input
            value={problem.headline || ""}
            onChange={(e) => setProblem({ ...problem, headline: e.target.value })}
            placeholder="Headline (e.g. Fragile SaaS Monoliths & Uncontrolled Bloat)"
            className="text-xs"
          />
          <Textarea
            value={problem.description || ""}
            onChange={(e) => setProblem({ ...problem, description: e.target.value })}
            placeholder="Editorial description of the operational or technical failure state..."
            rows={2}
            className="text-xs"
          />
          <Textarea
            value={problemPointsRaw}
            onChange={(e) => setProblemPointsRaw(e.target.value)}
            placeholder="Specific failure bullet points (one per line)..."
            rows={3}
            className="text-xs font-mono"
          />
        </div>

        {/* Capability Block */}
        <div className="p-4 rounded-md border border-border-default/60 bg-surface-secondary/20 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold">
            Section: Capability
          </div>
          <Input
            value={capability.headline || ""}
            onChange={(e) => setCapability({ ...capability, headline: e.target.value })}
            placeholder="Headline (e.g. Native Next.js 15 Full-Stack Architecture)"
            className="text-xs"
          />
          <Textarea
            value={capability.description || ""}
            onChange={(e) => setCapability({ ...capability, description: e.target.value })}
            placeholder="Core technical capabilities provided..."
            rows={2}
            className="text-xs"
          />
          <Textarea
            value={capabilityAttrsRaw}
            onChange={(e) => setCapabilityAttrsRaw(e.target.value)}
            placeholder="Capability attribute tags (one per line, e.g. Edge SSR / Zero Telemetry)..."
            rows={3}
            className="text-xs font-mono"
          />
        </div>

        {/* Approach Block */}
        <div className="p-4 rounded-md border border-border-default/60 bg-surface-secondary/20 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold">
            Section: Approach
          </div>
          <Input
            value={approach.headline || ""}
            onChange={(e) => setApproach({ ...approach, headline: e.target.value })}
            placeholder="Headline (e.g. Deterministic Sprint Delivery Protocol)"
            className="text-xs"
          />
          <Textarea
            value={approach.description || ""}
            onChange={(e) => setApproach({ ...approach, description: e.target.value })}
            placeholder="Methodology and engineering phases..."
            rows={2}
            className="text-xs"
          />
        </div>

        {/* Solution Block */}
        <div className="p-4 rounded-md border border-border-default/60 bg-surface-secondary/20 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold">
            Section: Solution
          </div>
          <Input
            value={solution.headline || ""}
            onChange={(e) => setSolution({ ...solution, headline: e.target.value })}
            placeholder="Headline (e.g. Turnkey Codebase & Audited Deployments)"
            className="text-xs"
          />
          <Textarea
            value={solution.description || ""}
            onChange={(e) => setSolution({ ...solution, description: e.target.value })}
            placeholder="What gets handed over and integrated..."
            rows={2}
            className="text-xs"
          />
        </div>

        {/* Outcome Block */}
        <div className="p-4 rounded-md border border-border-default/60 bg-surface-secondary/20 space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold">
            Section: Outcome
          </div>
          <Input
            value={outcome.headline || ""}
            onChange={(e) => setOutcome({ ...outcome, headline: e.target.value })}
            placeholder="Headline (e.g. 100/100 Lighthouse Performance & Zero Infrastructure Drift)"
            className="text-xs"
          />
          <Textarea
            value={outcome.description || ""}
            onChange={(e) => setOutcome({ ...outcome, description: e.target.value })}
            placeholder="Verifiable technical and operational outcomes..."
            rows={2}
            className="text-xs"
          />
        </div>
      </div>

      {/* Section 4: Verified FAQs */}
      <div className="space-y-4 p-6 rounded-lg border border-border-default bg-surface-primary shadow-subtle">
        <div className="flex items-center justify-between border-b border-border-default pb-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-primary">
              4. Verified Service FAQs
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Only include factual, catalogue-verified answers. Rendered as accessible accordions.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addFaq}>
            + Add FAQ
          </Button>
        </div>

        {faqItems.length === 0 ? (
          <p className="text-xs font-mono text-ink-muted py-2">
            No FAQs defined. (FAQ section will be omitted on detail page).
          </p>
        ) : (
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="p-3 rounded border border-border-default bg-surface-secondary/30 space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] text-ink-muted">
                    FAQ #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-status-error text-xs font-mono hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder="Question (e.g. How do you handle client codebase confidentiality?)"
                  className="text-xs"
                />
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder="Verified answer..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 5: SEO Metadata */}
      <div className="space-y-4 p-6 rounded-lg border border-border-default bg-surface-primary shadow-subtle">
        <h2 className="font-display text-lg font-bold text-ink-primary border-b border-border-default pb-2">
          5. Search & OpenGraph Metadata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="service-seo-title" label="SEO Title" hint="Default: [Service Name] // Architectural Capabilities — HENU">
            <Input
              id="service-seo-title"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder="Custom browser title..."
            />
          </FormField>

          <FormField id="service-seo-desc" label="SEO Meta Description" hint="Default: Service summary">
            <Input
              id="service-seo-desc"
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder="Search engine summary..."
            />
          </FormField>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border-default">
        <LinkButton href="/admin/services" variant="ghost" size="md">
          &larr; Back to Services
        </LinkButton>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending || !priceScanResult.allowed}
          >
            {isPending
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Register Service"}
          </Button>
        </div>
      </div>
    </form>
  );
}

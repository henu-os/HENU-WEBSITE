"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

interface EcosystemModelProps {
  products: Product[];
  className?: string;
}

const HUE_ACCENT_MAP: Record<
  string,
  {
    border: string;
    bg: string;
    text: string;
    accent: string;
    badgeVariant: "primary" | "secondary" | "success" | "warning" | "neutral" | "outline";
  }
> = {
  os: {
    border: "border-teal-500/40 hover:border-teal-500",
    bg: "bg-teal-500/5",
    text: "text-teal-700 dark:text-teal-300",
    accent: "bg-teal-500",
    badgeVariant: "success",
  },
  ai: {
    border: "border-indigo-500/40 hover:border-indigo-500",
    bg: "bg-indigo-500/5",
    text: "text-indigo-700 dark:text-indigo-300",
    accent: "bg-indigo-500",
    badgeVariant: "primary",
  },
  pa: {
    border: "border-amber-500/40 hover:border-amber-500",
    bg: "bg-amber-500/5",
    text: "text-amber-700 dark:text-amber-300",
    accent: "bg-amber-500",
    badgeVariant: "warning",
  },
  ide: {
    border: "border-sky-500/40 hover:border-sky-500",
    bg: "bg-sky-500/5",
    text: "text-sky-700 dark:text-sky-300",
    accent: "bg-sky-500",
    badgeVariant: "neutral",
  },
};

/**
 * HOME-002: Data-Driven Ecosystem Model Component.
 * Visualizes HENU OS as the foundational base layer with AI, PA, and IDE as cohesive layers.
 * Keyboard operable, touch-friendly, accessible semantics, responsive mobile vertical stack.
 */
export function EcosystemModel({ products, className = "" }: EcosystemModelProps) {
  const initialSelectedId =
    products && products.length > 0
      ? products.find((p) => p.slug === "henu-os")?.id ?? products[0]?.id ?? ""
      : "";
  const [selectedProductId, setSelectedProductId] = useState<string>(initialSelectedId);

  // If no published products, render clean empty fallback
  if (!products || products.length === 0) {
    return (
      <div className={`p-8 rounded-xl border border-border-default bg-surface-primary text-center ${className}`}>
        <p className="font-sans text-sm text-ink-muted">
          Ecosystem architecture data is currently being initialized.
        </p>
      </div>
    );
  }

  // Find flagship (HENU OS) or default to first item
  const flagshipCandidate = products.find((p) => p.slug === "henu-os") || products[0];
  if (!flagshipCandidate) {
    return null;
  }
  const flagship = flagshipCandidate;
  const satelliteProducts = products.filter((p) => p.id !== flagship.id);

  const activeProduct =
    products.find((p) => p.id === selectedProductId) || flagship;
  const defaultHue = HUE_ACCENT_MAP.os!;
  const activeHue = HUE_ACCENT_MAP[activeProduct.hue_key] || defaultHue;

  return (
    <div
      role="region"
      aria-label="HENU Ecosystem Architecture"
      className={`rounded-2xl border border-border-default bg-surface-primary overflow-hidden shadow-xs ${className}`}
    >
      {/* Header Banner */}
      <div className="border-b border-border-default p-6 md:p-8 bg-surface-secondary/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-spectral font-bold">
                Interconnected Systems
              </span>
              <span className="text-ink-muted">&bull;</span>
              <span className="font-mono text-xs text-ink-muted">HOME-002 Layered View</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
              The HENU Computing Stack
            </h2>
          </div>
          <Badge variant="outline" size="sm" className="self-start sm:self-auto font-mono">
            {products.length} Ecosystem Pillars
          </Badge>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Diagram (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider mb-2">
            Select a layer to inspect its system integration:
          </p>

          {/* Upper Application / Workflow Layers (Satellite Products) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {satelliteProducts.map((product) => {
              const isSelected = product.id === selectedProductId;
              const hue = (product.hue_key && HUE_ACCENT_MAP[product.hue_key]) || defaultHue;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    isSelected
                      ? `${hue.border} ${hue.bg} shadow-xs ring-1 ring-border-strong`
                      : "border-border-default bg-surface-primary hover:border-border-strong hover:bg-surface-secondary/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                      {product.hue_key.toUpperCase()} Layer
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${isSelected ? hue.accent : "bg-border-default"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-base font-bold text-ink-primary">
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs text-ink-secondary mt-1 line-clamp-2">
                    {product.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Connection Bridge (Visual Connector) */}
          <div className="relative py-2 flex items-center justify-center" aria-hidden="true">
            <div className="h-6 w-px bg-border-default" />
            <div className="absolute font-mono text-[10px] text-ink-muted bg-surface-primary px-3 uppercase tracking-widest border border-border-subtle rounded-full">
              Kernel & IPC Protocol Bus
            </div>
          </div>

          {/* Ground Layer: Flagship HENU OS */}
          <button
            type="button"
            onClick={() => setSelectedProductId(flagship.id)}
            aria-pressed={flagship.id === selectedProductId}
            className={`w-full p-6 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              flagship.id === selectedProductId
                ? "border-teal-500 bg-teal-500/10 shadow-xs ring-1 ring-teal-500/30"
                : "border-border-default bg-surface-secondary/60 hover:border-border-strong"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Ground Layer (Foundational OS)
                </span>
                <Badge variant="success" size="sm">
                  Flagship
                </Badge>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${flagship.id === selectedProductId ? "bg-teal-500" : "bg-border-default"}`}
                aria-hidden="true"
              />
            </div>
            <h3 className="font-display text-xl font-bold text-ink-primary">
              {flagship.name}
            </h3>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              {flagship.summary}
            </p>
          </button>
        </div>

        {/* Right Column: Selected Layer Detail Panel (5 Cols on Desktop) */}
        <div className="lg:col-span-5 rounded-xl border border-border-default bg-surface-secondary/40 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
              <span className="font-mono text-xs text-ink-muted uppercase tracking-wider font-semibold">
                Architecture Detail
              </span>
              <Badge variant={activeHue.badgeVariant} size="sm" className="font-mono text-[10px]">
                {activeProduct.status_label.replace("_", " ")}
              </Badge>
            </div>

            <h3 className="font-display text-2xl font-bold text-ink-primary">
              {activeProduct.name}
            </h3>
            <p className="font-sans text-sm font-medium text-accent-spectral mt-1">
              {activeProduct.tagline}
            </p>

            <p className="font-sans text-sm text-ink-secondary leading-relaxed mt-4">
              {activeProduct.summary}
            </p>

            {/* Confirmed Capabilities Preview */}
            {Array.isArray(activeProduct.capabilities) && activeProduct.capabilities.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-primary font-semibold block mb-3">
                  Key Capabilities:
                </span>
                <ul className="space-y-2 list-none p-0">
                  {(activeProduct.capabilities as Array<{ title: string; description: string }>)
                    .slice(0, 3)
                    .map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-ink-secondary">
                        <span className="text-accent-spectral font-bold mt-0.5">&bull;</span>
                        <span>
                          <strong className="text-ink-primary">{cap.title}:</strong> {cap.description}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between">
            <LinkButton
              href={`/products/${activeProduct.slug}`}
              variant="primary"
              size="md"
            >
              Explore {activeProduct.name} &rarr;
            </LinkButton>
            <span className="font-mono text-xs text-ink-muted">
              Display Order: #{activeProduct.display_order}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

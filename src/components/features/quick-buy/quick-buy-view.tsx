"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { QUICK_BUY_CATALOGUE, type QuickBuyItem } from "@/config/quick-buy-items";
import { Badge } from "@/components/ui/badge";
import { QuickBuyCardVisual } from "./quick-buy-card-visual";

export interface QuickBuyViewProps {
  initialItems?: QuickBuyItem[];
}

// Category palette styling helper
function getCategoryColor(category: string) {
  switch (category) {
    case "Build":
      return {
        badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25",
        dot: "bg-emerald-500",
        borderHover: "group-hover:border-emerald-500/40",
        accentText: "text-emerald-700 dark:text-emerald-400",
        strip: "from-emerald-600 to-teal-500",
      };
    case "Intelligence":
      return {
        badge: "bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/25",
        dot: "bg-indigo-500",
        borderHover: "group-hover:border-indigo-500/40",
        accentText: "text-indigo-700 dark:text-indigo-400",
        strip: "from-indigo-600 to-purple-500",
      };
    case "Brand & Growth":
      return {
        badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
        dot: "bg-amber-500",
        borderHover: "group-hover:border-amber-500/40",
        accentText: "text-amber-700 dark:text-amber-400",
        strip: "from-amber-600 to-orange-500",
      };
    case "Foundations":
      return {
        badge: "bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/25",
        dot: "bg-sky-500",
        borderHover: "group-hover:border-sky-500/40",
        accentText: "text-sky-700 dark:text-sky-400",
        strip: "from-sky-600 to-blue-500",
      };
    case "Core Computing":
    default:
      return {
        badge: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/25",
        dot: "bg-cyan-500",
        borderHover: "group-hover:border-cyan-500/40",
        accentText: "text-cyan-700 dark:text-cyan-400",
        strip: "from-cyan-600 to-indigo-500",
      };
  }
}

export function QuickBuyView({ initialItems }: QuickBuyViewProps = {}) {
  const allItems = initialItems && initialItems.length > 0 ? initialItems : QUICK_BUY_CATALOGUE;

  const [selectedType, setSelectedType] = useState<"all" | "service" | "product">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState<QuickBuyItem | null>(null);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesTagline || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [allItems, selectedType, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    const set = new Set(allItems.map((item) => item.category));
    return Array.from(set);
  }, [allItems]);

  const handleBuyClick = (item: QuickBuyItem) => {
    if (item.paymentLink && item.paymentLink !== "#" && item.paymentLink.trim().length > 0) {
      const link = item.paymentLink.trim();
      const url = link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Open instant checkout dialog
      setActiveModalItem(item);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Filtering & Control Bar */}
      <div className="space-y-4">
        {/* Main Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-default">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedType("all");
                setSelectedCategory("all");
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                selectedType === "all"
                  ? "bg-primary text-primary-on shadow-subtle"
                  : "bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-container"
              }`}
            >
              <span>All Items</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === "all" ? "bg-white/20" : "bg-black/10 dark:bg-white/10"}`}>
                {allItems.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType("service");
                setSelectedCategory("all");
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                selectedType === "service"
                  ? "bg-primary text-primary-on shadow-subtle"
                  : "bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-container"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Services</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === "service" ? "bg-white/20" : "bg-black/10 dark:bg-white/10"}`}>
                9
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType("product");
                setSelectedCategory("all");
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                selectedType === "product"
                  ? "bg-primary text-primary-on shadow-subtle"
                  : "bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-container"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Products</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === "product" ? "bg-white/20" : "bg-black/10 dark:bg-white/10"}`}>
                4
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <div className="relative">
              <input
                type="text"
                placeholder="Search solutions by keyword, tier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 text-xs font-mono rounded-lg border border-border-default bg-surface-primary text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter Pills with Disciplined Colors */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mr-1">
            Category Track:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedCategory === "all"
                ? "bg-ink-primary text-surface-primary font-semibold shadow-xs"
                : "bg-surface-secondary/80 text-ink-secondary hover:text-ink-primary border border-border-default/60"
            }`}
          >
            All Tracks ({allItems.length})
          </button>
          {categories.map((cat) => {
            const colors = getCategoryColor(cat);
            const count = allItems.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-ink-primary text-surface-primary font-semibold shadow-xs"
                    : "bg-surface-secondary/80 text-ink-secondary hover:text-ink-primary border border-border-default/60"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                <span>{cat}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border-default space-y-3 bg-surface-secondary/20">
          <p className="font-mono text-sm text-ink-secondary">
            No solutions match the specified filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType("all");
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-mono text-primary underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item) => {
            const colors = getCategoryColor(item.category);
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border border-border-default bg-surface-primary p-5 sm:p-6 shadow-subtle hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${colors.borderHover}`}
              >
                {/* Top Subtle Category Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.strip}`} />

                <div className="space-y-4">
                  {/* Top Meta Strip: Category Code & Type Tag */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                      {item.categoryCode} {"//"} {item.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${colors.badge} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      <span>{item.type === "product" ? "Sovereign Product" : "Engineering Service"}</span>
                    </span>
                  </div>

                  {/* Visual Blueprint / Logo Schema */}
                  <div className="pt-0.5">
                    <QuickBuyCardVisual
                      id={item.id}
                      type={item.type}
                      category={item.category}
                      name={item.name}
                    />
                  </div>

                  {/* Title & Tagline */}
                  <div className="pt-1">
                    <h3 className="font-serif text-2xl text-ink-primary font-normal tracking-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className={`font-mono text-xs mt-1 font-medium ${colors.accentText}`}>
                      {item.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-ink-secondary leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Deliverables / Scope list */}
                  <div className="pt-2 border-t border-border-default/60 space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                      Verified Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {item.deliverables.map((del, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-ink-secondary leading-tight">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 text-[10px]" aria-hidden="true">
                            &#10003;
                          </span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-5 mt-5 border-t border-border-default/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
                    <span>Target Deployment:</span>
                    <span className="font-semibold text-ink-primary bg-surface-secondary px-2 py-0.5 rounded border border-border-default/60 text-[11px]">
                      {item.startingTier}
                    </span>
                  </div>

                  {/* Ready to Buy Button */}
                  <button
                    type="button"
                    onClick={() => handleBuyClick(item)}
                    className="w-full py-3 px-4 rounded-xl bg-ink-primary text-surface-primary font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink-secondary active:scale-[0.98] shadow-subtle hover:shadow-elevated transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Instant Procurement</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform font-sans" aria-hidden="true">
                      &rarr;
                    </span>
                  </button>

                  <div className="text-center">
                    <Link
                      href={item.detailUrl}
                      className="font-mono text-[11px] text-ink-muted hover:text-ink-primary underline transition-colors"
                    >
                      Inspect full technical specifications &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Checkout Modal Placeholder / Procurement Sheet */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border-default bg-surface-primary p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-border-default/80">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Commercial Procurement Desk // Direct Order
                </span>
                <h3 className="font-serif text-2xl text-ink-primary font-normal mt-1">
                  Ready to Buy: {activeModalItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-surface-secondary transition-colors"
                aria-label="Close dialog"
              >
                &#10005;
              </button>
            </div>

            {/* Visual Preview inside the Modal */}
            <div className="p-1 rounded-xl bg-surface-secondary/40 border border-border-default/60">
              <QuickBuyCardVisual
                id={activeModalItem.id}
                type={activeModalItem.type}
                category={activeModalItem.category}
                name={activeModalItem.name}
              />
            </div>

            <div className="p-4 rounded-xl border border-border-default bg-surface-secondary/50 space-y-2 text-xs font-sans text-ink-secondary">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-ink-primary uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Escrow &amp; Sovereign Transfer</span>
              </div>
              <p className="leading-relaxed">
                Direct procurement for <strong>{activeModalItem.name}</strong> grants immediate commercial ownership, zero recurring royalty lock-in, and full architectural deliverables.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                href={`/contact?interest=${activeModalItem.type === "product" ? "product" : "service"}&subject=Ready+to+Buy+${encodeURIComponent(activeModalItem.name)}`}
                onClick={() => setActiveModalItem(null)}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-on font-mono text-xs uppercase tracking-wider font-bold hover:bg-primary-container text-center block transition-colors shadow-subtle"
              >
                Proceed with Instant Intake &amp; Invoice &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="w-full py-2 text-xs font-mono text-ink-muted hover:text-ink-primary text-center block"
              >
                Return to Catalogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

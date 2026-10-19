"use client";

import React, { useState, useTransition } from "react";
import type { QuickBuyItem } from "@/config/quick-buy-items";
import { updateQuickBuyLinksAction } from "@/server/actions/quick-buy.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface QuickBuyEditorClientProps {
  initialItems: QuickBuyItem[];
}

export function QuickBuyEditorClient({ initialItems }: QuickBuyEditorClientProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"all" | "product" | "service">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize links mapping
  const [links, setLinks] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const item of initialItems) {
      map[item.id] = item.paymentLink && item.paymentLink !== "#" ? item.paymentLink : "";
    }
    return map;
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLinkChange = (id: string, value: string) => {
    setLinks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveAll = () => {
    setStatusMessage(null);
    startTransition(async () => {
      try {
        await updateQuickBuyLinksAction(links);
        setStatusMessage({
          type: "success",
          text: "Payment links updated and live across the Quick Buy checkout surface.",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update payment links.";
        setStatusMessage({ type: "error", text: msg });
      }
    });
  };

  // Filter items
  const filteredItems = initialItems.filter((item) => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchCode = item.categoryCode.toLowerCase().includes(q);
      return matchName || matchCat || matchCode;
    }
    return true;
  });

  // Calculate stats
  const totalConfigured = Object.values(links).filter(
    (l) => l.trim().length > 0 && l.trim() !== "#"
  ).length;

  return (
    <div className="space-y-8 max-w-5xl">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "default" : "destructive"}
          title={statusMessage.type === "success" ? "Saved Successfully" : "Update Failed"}
        >
          {statusMessage.text}
        </Alert>
      )}

      {/* Control / Status Summary Bar */}
      <div className="p-5 sm:p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted font-semibold">
              Checkout Gateway Links
            </span>
            <Badge variant="outline" className="font-mono text-[11px]">
              {totalConfigured} of {initialItems.length} Configured
            </Badge>
          </div>
          <p className="text-xs text-ink-secondary">
            Provide direct payment URLs (e.g. Stripe, Razorpay, or custom checkout link) for each service and product. When set, users clicking &quot;READY TO BUY&quot; are instantly redirected.
          </p>
        </div>

        <Button
          onClick={handleSaveAll}
          isLoading={isPending}
          className="shrink-0 font-mono text-xs uppercase tracking-wider px-6"
        >
          {isPending ? "Saving Changes..." : "Save All Links"}
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            All Items ({initialItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("product")}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "product"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Products (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("service")}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "service"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Services (9)
          </button>
        </div>

        <div className="w-full sm:w-64">
          <Input
            type="search"
            placeholder="Search service or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs h-9"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const currentLink = links[item.id] ?? "";
          const hasValidLink =
            currentLink.trim().length > 0 &&
            currentLink.trim() !== "#" &&
            (currentLink.startsWith("http://") || currentLink.startsWith("https://"));

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.categoryCode}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink-primary">
                      {item.name}
                    </h3>
                    <p className="text-xs text-ink-secondary">{item.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="font-mono text-[11px] text-ink-muted">
                    {item.category}
                  </span>
                  <span aria-hidden="true">&bull;</span>
                  {hasValidLink ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Redirect Link Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Inquiry Modal Default
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Link Input Group */}
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor={`link-${item.id}`}
                  className="font-mono text-[11px] uppercase tracking-wider text-ink-muted font-semibold block"
                >
                  Payment / Checkout Gateway URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={`link-${item.id}`}
                      type="url"
                      placeholder="e.g. https://buy.stripe.com/abc... or https://rzp.io/l/xyz"
                      value={currentLink}
                      onChange={(e) => handleLinkChange(item.id, e.target.value)}
                      className="font-mono text-xs pr-8"
                    />
                    {currentLink && (
                      <button
                        type="button"
                        onClick={() => handleLinkChange(item.id, "")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary text-xs"
                        title="Clear link"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {hasValidLink && (
                    <a
                      href={currentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg border border-border-default hover:bg-surface-secondary text-xs font-mono text-ink-secondary hover:text-ink-primary transition-colors shrink-0"
                      title="Test payment link in new tab"
                    >
                      Test Link &rarr;
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-ink-muted">
                  When a customer clicks &quot;READY TO BUY&quot; on the {item.name} card, they will be redirected to this link.
                </p>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border-default rounded-xl">
            <p className="text-sm text-ink-muted">No items matched your filter query.</p>
          </div>
        )}
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="p-4 rounded-xl border border-border-default bg-surface-primary shadow-xs flex items-center justify-between">
        <span className="text-xs font-mono text-ink-secondary">
          {totalConfigured} of {initialItems.length} payment links configured
        </span>
        <Button
          onClick={handleSaveAll}
          isLoading={isPending}
          className="font-mono text-xs uppercase tracking-wider px-6"
        >
          {isPending ? "Saving Changes..." : "Save All Links"}
        </Button>
      </div>
    </div>
  );
}

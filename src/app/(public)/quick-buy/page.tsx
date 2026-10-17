import React from "react";
import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { QuickBuyView } from "@/components/features/quick-buy/quick-buy-view";
import { QuickBuyHeroHeadline } from "@/components/features/quick-buy/quick-buy-hero-headline";
import { AmbientLivingMesh } from "@/components/ui/ambient-living-mesh";
import { quickBuyRepository } from "@/server/repositories/quick-buy.repository";

export const metadata: Metadata = {
  title: "Quick Buy // Products & Architectural Services — HENU",
  description:
    "Direct procurement desk for enterprise software solutions, dedicated engineering retainers, and sovereign computing ecosystem licenses.",
  alternates: {
    canonical: "/quick-buy",
  },
};

export default async function QuickBuyPage() {
  const items = await quickBuyRepository.getQuickBuyItems();
  return (
    <div className="w-full relative">
      {/* Editorial Intro Hero with Ambient Ember Mesh */}
      <Section className="relative pt-20 sm:pt-28 pb-12 sm:pb-16 border-b border-border-default bg-surface-primary overflow-hidden">
        {/* Living Ambient Warm Ember Light */}
        <AmbientLivingMesh variant="ember" />

        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-secondary font-semibold">
                  Commercial Procurement Desk // Direct Checkout
                </span>
              </div>

              {/* Interactive Hero Headline with 2 Lines / Hover Flip */}
              <QuickBuyHeroHeadline />

              <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-sans max-w-2xl">
                Direct checkout desk for enterprise software solutions, dedicated engineering retainers, and computing ecosystem licenses. Select any solution and proceed with verified payment.
              </p>

              {/* Single Sleek Institutional Clearance Ribbon */}
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted border-t border-border-default/60">
                <span className="flex items-center gap-1.5 text-ink-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {items.length} Verified Solutions
                </span>
                <span aria-hidden="true" className="text-border-default">&bull;</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Direct Stripe Escrow
                </span>
                <span aria-hidden="true" className="text-border-default">&bull;</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  100% IP Assignment
                </span>
                <span aria-hidden="true" className="text-border-default">&bull;</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  &lt; 2h Dispatch SLA
                </span>
              </div>
            </div>

            {/* Right Column: Live Procurement Cockpit Telemetry Badge */}
            <div className="lg:col-span-4">
              <div className="p-5 sm:p-6 rounded-2xl border border-secondary/25 bg-gradient-to-br from-surface-primary/95 to-surface-secondary/70 backdrop-blur-md shadow-elevated space-y-4 relative overflow-hidden">
                {/* Subtle Grid Lines */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative flex items-center justify-between pb-3 border-b border-border-default/60">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    PROCUREMENT // SPEC
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/25">
                    ESCROW ACTIVE
                  </span>
                </div>

                {/* 3-Step Clearance Protocol */}
                <div className="relative space-y-2 text-xs font-mono text-ink-secondary">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-ink-muted">01 // SETTLEMENT:</span>
                    <span className="text-ink-primary font-semibold bg-surface-primary px-1.5 py-0.5 rounded border border-border-default/60 text-[11px]">DIRECT STRIPE</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-ink-muted">02 // IP TRANSFER:</span>
                    <span className="text-ink-primary font-semibold bg-surface-primary px-1.5 py-0.5 rounded border border-border-default/60 text-[11px]">IMMEDIATE BILL OF SALE</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-ink-muted">03 // DISPATCH:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">&lt; 2 BUSINESS HOURS</span>
                  </div>
                </div>

                {/* Verification Stamp Footer */}
                <div className="relative pt-3 border-t border-border-default/60 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span className="flex items-center gap-1">
                    <span>HASH:</span>
                    <span className="text-ink-primary font-medium">#4A9F2E</span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span>&#10003;</span>
                    <span>CRYPTOGRAPHICALLY VERIFIED</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Quick Buy Catalogue Section */}
      <Section spacing="lg" className="bg-surface-secondary/20">
        <Container size="lg">
          <QuickBuyView initialItems={items} />
        </Container>
      </Section>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { productRepository } from "@/server/repositories/product.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { portfolioRepository } from "@/server/repositories/portfolio.repository";
import { quickBuyRepository } from "@/server/repositories/quick-buy.repository";
import { enquiryRepository } from "@/server/repositories/enquiry.repository";
import { auditLogRepository } from "@/server/repositories/audit-log.repository";
import type { Product, Service, PortfolioProject, Enquiry, AuditLog } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    { products },
    { services },
    { projects },
    quickBuyItems,
    { enquiries },
    auditData,
  ] = await Promise.all([
    productRepository.listAllProducts(),
    serviceRepository.listAllServices(),
    portfolioRepository.listAllProjects(),
    quickBuyRepository.getQuickBuyItems(),
    enquiryRepository.listEnquiries({ limit: 100 }),
    auditLogRepository.listLogs({ limit: 6 }),
  ]);

  // Real Counts & Status Breakdown (ADMIN-004)
  const publishedProducts = products.filter((p: Product) => p.status === "published");
  const draftProducts = products.filter((p: Product) => p.status === "draft");

  const publishedServices = services.filter((s: Service) => s.status === "published");
  const draftServices = services.filter((s: Service) => s.status === "draft");

  const publishedProjects = projects.filter((p: PortfolioProject) => p.status === "published");
  const draftProjects = projects.filter((p: PortfolioProject) => p.status === "draft");

  const activeQuickBuyLinks = quickBuyItems.filter(
    (i) => i.paymentLink && i.paymentLink !== "#" && i.paymentLink.trim().length > 0
  ).length;

  const newEnquiries = enquiries.filter((e: Enquiry) => e.status === "new");
  const inProgressEnquiries = enquiries.filter((e: Enquiry) => e.status === "in_progress");
  const failedNotifications = enquiries.filter((e: Enquiry) => e.notification_status === "failed");

  // Draft items requiring editorial attention
  const draftItems = [
    ...draftProducts.map((p: Product) => ({ title: p.name, type: "Product", href: `/admin/products/${p.id}`, status: "draft" })),
    ...draftServices.map((s: Service) => ({ title: s.name, type: "Service", href: `/admin/services/${s.id}`, status: "draft" })),
    ...draftProjects.map((p: PortfolioProject) => ({ title: p.title, type: "Portfolio", href: `/admin/portfolio/${p.id}`, status: "draft" })),
  ];

  const totalContentItems = products.length + services.length + projects.length + quickBuyItems.length;
  const publishedCount = publishedProducts.length + publishedServices.length + publishedProjects.length;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Greeting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Good day, <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">ADMIN</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              HENU OS CLM v4.2
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Sovereign systems. Real progress. Here is what is happening across the HENU ecosystem today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 text-xs font-mono shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-800">Real-time Sync Active</span>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs hover:shadow-xs"
            title="Reload metrics"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Action Toolbar (Vibrant, high-contrast actions) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mt-2">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-[0_4px_14px_rgba(5,150,105,0.25)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.35)] shrink-0 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>+ New Product</span>
        </Link>

        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 transition-all shadow-2xs shrink-0 active:scale-95"
        >
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Discipline</span>
        </Link>

        <Link
          href="/admin/quick-buy"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 transition-all shadow-2xs shrink-0 active:scale-95"
        >
          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Quick Buy Items</span>
        </Link>

        <Link
          href="/admin/enquiries"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-950 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-all shadow-2xs shrink-0 active:scale-95"
        >
          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Enquiry Inbox ({enquiries.length})</span>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs shrink-0 ml-auto"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Audit Trail</span>
        </Link>
      </div>

      {/* 3. Reconciliation Alert Banner (if any notification failures) */}
      {failedNotifications.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-rose-900">
              Notification Reconciliation Alert ({failedNotifications.length})
            </h2>
            <p className="text-xs text-rose-700 leading-relaxed">
              Client transmissions were safely saved in the database, but email notification dispatch failed.
            </p>
            <div className="pt-1">
              <Link href="/admin/enquiries?notification=failed" className="text-xs font-mono font-semibold text-rose-800 hover:underline inline-flex items-center gap-1">
                Resolve Dispatches in Enquiries &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Vibrant Luminous Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Products (Emerald / Cyan Accent) */}
        <div className="relative p-5 rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.2)] hover:border-emerald-300 transition-all duration-300 group overflow-hidden">
          {/* Top glowing gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-900 group-hover:text-emerald-700 transition-colors">
              Products
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              100% Live
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {publishedProducts.length}
            </p>
            {/* Sparkline wave visual */}
            <svg className="w-16 h-7 text-emerald-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_6px_rgba(16,185,129,0.35)]" viewBox="0 0 64 24" fill="none">
              <path d="M2 18 Q 16 2, 32 12 T 62 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {draftProducts.length === 0 ? "All 4 published" : `${draftProducts.length} in draft`}
            </span>
            <Link href="/admin/products" className="font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 transition-colors">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Disciplines & Services (Indigo / Violet Accent) */}
        <div className="relative p-5 rounded-2xl border border-indigo-200/70 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(99,102,241,0.2)] hover:border-indigo-300 transition-all duration-300 group overflow-hidden">
          {/* Top glowing gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-900 group-hover:text-indigo-700 transition-colors">
              Disciplines
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-100 text-indigo-800 border border-indigo-300/80 shadow-2xs">
              Active Tier
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {publishedServices.length}
            </p>
            {/* Sparkline wave visual */}
            <svg className="w-16 h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_6px_rgba(99,102,241,0.35)]" viewBox="0 0 64 24" fill="none">
              <path d="M2 12 Q 20 20, 36 6 T 62 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {draftServices.length === 0 ? "6 in catalogue" : `${draftServices.length} in draft`}
            </span>
            <Link href="/admin/services" className="font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 transition-colors">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Quick Buy (Amber / Orange Accent) */}
        <div className="relative p-5 rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50/40 via-white to-white shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.2)] hover:border-amber-300 transition-all duration-300 group overflow-hidden">
          {/* Top glowing gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-900 group-hover:text-amber-700 transition-colors">
              Quick Buy
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs">
              {activeQuickBuyLinks} Live Link
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {quickBuyItems.length}
            </p>
            {/* Sparkline wave visual */}
            <svg className="w-16 h-7 text-amber-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_6px_rgba(245,158,11,0.35)]" viewBox="0 0 64 24" fill="none">
              <path d="M2 16 Q 18 4, 34 16 T 62 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {activeQuickBuyLinks} link configured
            </span>
            <Link href="/admin/quick-buy" className="font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 transition-colors">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Enquiries (Rose / Pink Accent) */}
        <div className="relative p-5 rounded-2xl border border-rose-200/70 bg-gradient-to-b from-rose-50/40 via-white to-white shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(244,63,94,0.2)] hover:border-rose-300 transition-all duration-300 group overflow-hidden">
          {/* Top glowing gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500" />

          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-rose-900 group-hover:text-rose-700 transition-colors">
              Enquiries
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
              {inProgressEnquiries.length} In Progress
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
              {enquiries.length}
            </p>
            {/* Sparkline wave visual */}
            <svg className="w-16 h-7 text-rose-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_6px_rgba(244,63,94,0.35)]" viewBox="0 0 64 24" fill="none">
              <path d="M2 8 Q 20 18, 38 4 T 62 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {newEnquiries.length} new • {inProgressEnquiries.length} active
            </span>
            <Link href="/admin/enquiries" className="font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-1 transition-colors">
              Review &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Operations & Health Overview (Two-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ecosystem Health & Publishing Status (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Ecosystem Publishing Health
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Operational
            </span>
          </div>

          {/* Catalog Distribution Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Products (HENU OS, IDE, AI, PA)</span>
                <span className="font-mono text-emerald-700 font-semibold">{publishedProducts.length} / {products.length} Published</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Disciplines & Services</span>
                <span className="font-mono text-indigo-700 font-semibold">{publishedServices.length} / {services.length} Published</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Portfolio Case Studies</span>
                <span className="font-mono text-blue-700 font-semibold">{publishedProjects.length} / {projects.length} Published</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Quick Buy Live Links</span>
                <span className="font-mono text-amber-700 font-semibold">{activeQuickBuyLinks} / {quickBuyItems.length} Linked</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${(activeQuickBuyLinks / quickBuyItems.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Draft Items Attention or All-Clear graphic */}
          {draftItems.length > 0 ? (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pending Editorial Review</p>
              <div className="divide-y divide-slate-100">
                {draftItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <span className="text-[11px] font-mono text-slate-400">{item.type}</span>
                    </div>
                    <Link
                      href={item.href}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      Edit &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">All ecosystem content is synchronized</p>
                <p className="text-slate-500">No pending drafts. All public views are currently serving live verified content.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Control Plane Audit Log (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent Control Plane Audit Log
              </h2>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Append-Only
            </span>
          </div>

          {auditData.logs.length > 0 ? (
            <div className="space-y-3">
              {auditData.logs.map((log: AuditLog) => {
                const badgeStyle = log.action.includes("DELETE")
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : log.action.includes("PRODUCT")
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : log.action.includes("SERVICE")
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : log.action.includes("ENQUIRY")
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-1.5 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${badgeStyle}`}>
                        {log.action}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{log.summary}</p>
                    <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-mono text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Actor: {log.actor_email}</span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 text-right">
                <Link
                  href="/admin/audit-logs"
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                >
                  View Complete Audit Trail &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Audit log empty. All administrative events will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { productRepository } from "@/server/repositories/product.repository";
import { serviceRepository } from "@/server/repositories/service.repository";
import { portfolioRepository } from "@/server/repositories/portfolio.repository";
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
    { enquiries },
    auditData,
  ] = await Promise.all([
    productRepository.listAllProducts(),
    serviceRepository.listAllServices(),
    portfolioRepository.listAllProjects(),
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

  const newEnquiries = enquiries.filter((e: Enquiry) => e.status === "new");
  const inProgressEnquiries = enquiries.filter((e: Enquiry) => e.status === "in_progress");
  const failedNotifications = enquiries.filter((e: Enquiry) => e.notification_status === "failed");

  // Draft items requiring editorial attention
  const draftItems = [
    ...draftProducts.map((p: Product) => ({ title: p.name, type: "Product", href: `/admin/products/${p.id}`, status: "draft" })),
    ...draftServices.map((s: Service) => ({ title: s.name, type: "Service", href: `/admin/services/${s.id}`, status: "draft" })),
    ...draftProjects.map((p: PortfolioProject) => ({ title: p.title, type: "Portfolio", href: `/admin/portfolio/${p.id}`, status: "draft" })),
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="border-b border-border-default pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-primary">
            Admin Overview & Control Plane
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-secondary">
            Verified operational status of ecosystem content, sovereign pipelines, and client transmissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton href="/api/preview?path=/" variant="outline" size="sm" target="_blank">
            Preview Public Site &rarr;
          </LinkButton>
        </div>
      </div>

      {/* 2. Reconciliation Alert Banner (if any failures) */}
      {failedNotifications.length > 0 && (
        <div className="rounded-xl border border-accent-ember/30 bg-accent-ember/10 p-4 sm:p-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-accent-ember shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-ink-primary">
              Notification Reconciliation Alert ({failedNotifications.length})
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              One or more client transmissions were safely persisted in the database, but internal notification dispatch failed.
              Review the Enquiries ledger to inspect and trigger manual reconciliation.
            </p>
            <div className="pt-2">
              <Link href="/admin/enquiries?notification=failed" className="text-xs font-mono font-semibold text-accent-ember hover:underline inline-flex items-center gap-1">
                Resolve Dispatches in Enquiries &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Operational Real Count Metrics (No fake telemetry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products */}
        <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Products
            </span>
            <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-mono text-3xl font-bold text-ink-primary">
            {publishedProducts.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-secondary">
            <span>{draftProducts.length} in draft</span>
            <Link href="/admin/products" className="font-semibold text-accent-pine hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Services */}
        <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Disciplines
            </span>
            <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-mono text-3xl font-bold text-ink-primary">
            {publishedServices.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-secondary">
            <span>{draftServices.length} in draft</span>
            <Link href="/admin/services" className="font-semibold text-accent-pine hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Portfolio */}
        <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Portfolio
            </span>
            <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-mono text-3xl font-bold text-ink-primary">
            {publishedProjects.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-secondary">
            <span>{draftProjects.length} in draft</span>
            <Link href="/admin/portfolio" className="font-semibold text-accent-pine hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Enquiries */}
        <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Enquiries
            </span>
            <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="font-mono text-3xl font-bold text-ink-primary">
            {newEnquiries.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-secondary">
            <span>{inProgressEnquiries.length} in progress</span>
            <Link href="/admin/enquiries" className="font-semibold text-accent-pine hover:underline">
              Review &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Attention Ledger & Content Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Draft Items Requiring Editorial Review (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-border-default bg-surface-primary p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-base font-semibold text-ink-primary flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Content Pending Publication
            </h2>
            <Badge variant="outline" size="sm">
              {draftItems.length} Drafts
            </Badge>
          </div>

          {draftItems.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {draftItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-ink-primary">{item.title}</p>
                    <span className="text-xs font-mono text-ink-muted">{item.type}</span>
                  </div>
                  <Link
                    href={item.href}
                    className="text-xs font-mono text-accent-pine hover:underline inline-flex items-center gap-1"
                  >
                    Edit &rarr;
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-ink-muted">
              All ecosystem content items are currently published. No pending drafts.
            </div>
          )}
        </div>

        {/* Right Column: Immutable Audit Ledger Activity (6 Cols) */}
        <div className="lg:col-span-6 rounded-xl border border-border-default bg-surface-primary p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-base font-semibold text-ink-primary flex items-center gap-2">
              <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Control Plane Audit Log
            </h2>
            <span className="font-mono text-xs text-ink-muted">Append-Only</span>
          </div>

          {auditData.logs.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {auditData.logs.map((log: AuditLog) => (
                <div key={log.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-ink-primary">{log.action}</span>
                    <span className="font-mono text-ink-muted">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary truncate">{log.summary}</p>
                  <p className="text-[11px] font-mono text-ink-muted">Actor: {log.actor_email}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-ink-muted">
              Audit log empty. All administrative events will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

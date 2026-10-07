import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { adminSignInAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Sign-In // Sovereign Control Plane — HENU",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSignInPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-border-default bg-surface-primary p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent-spectral/30 bg-accent-spectral/10 text-[11px] font-mono font-semibold text-accent-spectral">
            <span>RESTRICTED ACCESS // ADMIN-001</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Sovereign Control Plane
          </h1>
          <p className="font-sans text-xs text-ink-secondary leading-relaxed">
            Enter authorized operator credentials to authenticate with Multi-Factor (AAL2) verification.
          </p>
        </div>

        <form action={adminSignInAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs font-semibold text-ink-primary uppercase tracking-wider mb-1.5"
            >
              Operator Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="admin@henu.org"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-secondary text-ink-primary text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent-spectral/40 focus:border-accent-spectral transition-colors"
              placeholder="operator@henu.org"
            />
          </div>

          <div className="rounded-lg border border-border-subtle bg-surface-secondary/60 p-3 space-y-1">
            <span className="font-mono text-[11px] font-semibold text-ink-primary block">
              Authentication Assurance: AAL2
            </span>
            <p className="font-sans text-[11px] text-ink-muted leading-relaxed">
              Sessions require device-bound hardware credentials or sovereign allowlist approval. No third-party social trackers.
            </p>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full justify-center">
            Authenticate &amp; Enter Console &rarr;
          </Button>
        </form>

        <div className="border-t border-border-subtle pt-4 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-ink-muted hover:text-ink-primary transition-colors inline-flex items-center gap-1"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

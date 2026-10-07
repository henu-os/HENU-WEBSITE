"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [correlationId, setCorrelationId] = useState<string>("");

  useEffect(() => {
    const id = error.digest || Math.random().toString(36).substring(2, 10).toUpperCase();
    setCorrelationId(id);
    console.error("Admin Control Plane Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-2xl border border-border-default bg-surface-primary p-8 shadow-sm space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-status-warning/30 bg-status-warning/10 text-xs font-mono font-semibold text-status-warning">
          <span>CONTROL PLANE ADVISORY</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary">
          Admin Operation Interrupted
        </h1>

        <p className="font-sans text-sm text-ink-secondary leading-relaxed max-w-md mx-auto">
          The administrative control plane encountered an authentication or data operation boundary. Your privileged credentials remain protected.
        </p>

        {correlationId && (
          <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-default inline-block">
            <span className="font-mono text-xs text-ink-muted">
              Reference ID: <code className="font-bold text-ink-primary select-all">{correlationId}</code>
            </span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary" size="md">
            Retry Operation
          </Button>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-lg border border-border-default text-sm font-medium text-ink-primary hover:bg-surface-secondary transition-colors"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-transparent text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Return Home &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [correlationId, setCorrelationId] = useState<string>("");

  useEffect(() => {
    // Generate safe client-side correlation ID if server digest is absent
    const id = error.digest || Math.random().toString(36).substring(2, 10).toUpperCase();
    setCorrelationId(id);
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-status-error/30 bg-status-error/10 text-xs font-mono font-semibold text-status-error">
            <span>UNEXPECTED APPLICATION FAULT</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary">
            An execution fault interrupted this operation.
          </h1>

          <p className="font-sans text-base text-ink-secondary leading-relaxed max-w-lg mx-auto">
            Our systems encountered an unrecoverable condition while processing your request. No internal state or credentials have been exposed.
          </p>

          {correlationId && (
            <div className="p-3 rounded-md bg-surface-secondary border border-border-default inline-block">
              <span className="font-mono text-xs text-ink-muted">
                Reference ID: <code className="font-bold text-ink-primary select-all">{correlationId}</code>
              </span>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => reset()} variant="primary" size="md">
              Retry Operation
            </Button>
            <LinkButton href="/" variant="secondary" size="md">
              Return Home
            </LinkButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

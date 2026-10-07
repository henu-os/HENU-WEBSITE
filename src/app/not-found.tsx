import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-default bg-surface-secondary text-xs font-mono font-semibold text-ink-muted">
            <span>HTTP 404</span>
            <span aria-hidden="true">&bull;</span>
            <span>PAGE NOT FOUND</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink-primary">
            The requested destination could not be located.
          </h1>

          <p className="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-lg mx-auto">
            The page you are looking for may have been relocated, unlisted, or does not exist within the current HENU architecture.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/" variant="primary" size="md">
              Return to Homepage
            </LinkButton>
            <LinkButton href="/contact" variant="secondary" size="md">
              Contact Systems
            </LinkButton>
          </div>
        </div>
      </Container>
    </div>
  );
}

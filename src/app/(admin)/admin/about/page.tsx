import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { requireAdminSession } from "@/server/auth/session";
import { aboutService } from "@/server/services/about.service";
import { AboutEditorClient } from "./about-editor-client";

export const metadata: Metadata = {
  title: "About Management // HENU Admin",
  description: "Manage institutional narrative chapters and verified timeline entries.",
};

export default async function AdminAboutPage() {
  await requireAdminSession();
  const content = await aboutService.getAdminAboutContent();

  return (
    <div className="py-8">
      <Container size="lg" className="space-y-8">
        <header className="border-b border-border-default pb-6 space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-pine block">
            Admin // Content Engine
          </span>
          <h1 className="font-serif text-3xl text-ink-primary font-normal">
            About & Chronology Management
          </h1>
          <p className="font-sans text-sm text-ink-secondary">
            Manage public institutional narrative chapters, vision/mission statements, and verified milestones.
          </p>
        </header>

        <AboutEditorClient initialContent={content} />
      </Container>
    </div>
  );
}

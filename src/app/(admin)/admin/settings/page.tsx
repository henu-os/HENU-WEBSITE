import React from "react";
import { siteSettingsRepository } from "@/server/repositories/site-settings.repository";
import { SettingsEditorClient } from "./settings-editor-client";

export default async function AdminSettingsPage() {
  const settings = await siteSettingsRepository.getSettings();

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Site Settings
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Configure global site contact information, scheduling endpoints, header CTA labels, and legal footer content.
        </p>
      </div>

      <SettingsEditorClient initialSettings={settings} />
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import type { SiteSettings } from "@/types/domain";
import { updateSiteSettingsAction } from "@/server/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";

export function SettingsEditorClient({ initialSettings }: { initialSettings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    organization_name: initialSettings.organization_name,
    contact_email: initialSettings.contact_email,
    calendly_url: initialSettings.calendly_url,
    header_cta_label: initialSettings.header_cta_label,
    footer_text: initialSettings.footer_text,
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      try {
        await updateSiteSettingsAction(formData);
        setStatusMessage({
          type: "success",
          text: "Site settings updated and applied across layout headers and footers.",
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update settings.";
        setStatusMessage({ type: "error", text: msg });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "success" ? "default" : "destructive"}
          title={statusMessage.type === "success" ? "Saved" : "Error"}
        >
          {statusMessage.text}
        </Alert>
      )}

      <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs space-y-6">
        <h2 className="font-display text-lg font-bold text-ink-primary border-b border-border-subtle pb-3">
          Global Organization & Brand (ADMIN-007)
        </h2>

        <FormField id="organization_name" label="Organization Name">
          <Input
            id="organization_name"
            value={formData.organization_name}
            onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
            required
          />
        </FormField>

        <FormField
          id="contact_email"
          label="Official Contact Email"
          hint="Destination for contact inquiries and general inquiries."
        >
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            required
          />
        </FormField>

        <FormField
          id="calendly_url"
          label="Calendly Scheduling URL"
          hint="Must begin with https://calendly.com (validated)."
        >
          <Input
            id="calendly_url"
            type="url"
            value={formData.calendly_url}
            onChange={(e) => setFormData({ ...formData, calendly_url: e.target.value })}
            required
          />
        </FormField>

        <FormField
          id="header_cta_label"
          label="Global Header CTA Label"
          hint="Button label rendered in the persistent desktop header."
        >
          <Input
            id="header_cta_label"
            value={formData.header_cta_label}
            onChange={(e) => setFormData({ ...formData, header_cta_label: e.target.value })}
            required
          />
        </FormField>

        <FormField
          id="footer_text"
          label="Global Footer Legal Notice"
          hint="Copyright and legal disclaimer displayed site-wide."
        >
          <Textarea
            id="footer_text"
            rows={3}
            value={formData.footer_text}
            onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            required
          />
        </FormField>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="submit" variant="primary" size="lg" isLoading={isPending}>
          Save Settings
        </Button>
        <span className="font-mono text-xs text-ink-muted">
          All mutations audited under ADMIN-008
        </span>
      </div>
    </form>
  );
}

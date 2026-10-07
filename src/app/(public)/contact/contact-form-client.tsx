"use client";

import React, { useState } from "react";
import { submitEnquiryAction } from "@/server/actions/enquiry.actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

interface ContactFormClientProps {
  initialInterestType?: "service" | "product" | "general" | "partnership";
  initialInterestRef?: string;
  timingToken: string;
  contactEmail: string;
}

export function ContactFormClient({
  initialInterestType = "general",
  initialInterestRef = "",
  timingToken,
  contactEmail,
}: ContactFormClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    interest_type: initialInterestType,
    interest_ref: initialInterestRef,
    message: "",
    hp_company_url: "", // Honeypot
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateClient = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Full name is required (minimum 2 characters).";
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "A valid corporate or personal email address is required.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Please describe your project or enquiry (minimum 10 characters).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClient()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitEnquiryAction({
        name: formData.name,
        email: formData.email,
        organisation: formData.organisation || undefined,
        interest_type: formData.interest_type,
        interest_ref: formData.interest_ref || undefined,
        message: formData.message,
        hp_company_url: formData.hp_company_url || undefined,
        timing_token: timingToken,
        source_page: "/contact",
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setGeneralError(result.error ?? "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setGeneralError(
        `Unable to reach the intake service. You may write to us directly at ${contactEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        role="region"
        aria-live="polite"
        className="rounded-2xl border border-accent-pine/40 bg-accent-pine/5 p-8 sm:p-12 space-y-4"
      >
        <div className="font-mono text-xs uppercase tracking-wider text-accent-pine font-semibold">
          Dispatch Status // Logged
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
          Enquiry Transmitted Successfully
        </h3>
        <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed max-w-lg">
          Your transmission has been validated and persisted in our dispatch registry. An engineer from our architecture desk will review the requirements and respond directly.
        </p>
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: "",
                email: "",
                organisation: "",
                interest_type: "general",
                interest_ref: "",
                message: "",
                hp_company_url: "",
              });
            }}
          >
            Submit Another Transmission
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label="Sovereign Project Enquiry Form"
    >
      {generalError && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-600 dark:text-red-400 space-y-1"
        >
          <div className="font-semibold uppercase tracking-wider">Submission Error</div>
          <div>{generalError}</div>
          <div className="text-[11px] opacity-80 pt-1">
            Direct channel fallback: <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>
          </div>
        </div>
      )}

      {/* Accessible Honeypot Field (Hidden from real users, traps automated scrapers) */}
      <div
        className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="hp_company_url">Leave this field blank</label>
        <input
          id="hp_company_url"
          name="hp_company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.hp_company_url}
          onChange={(e) => setFormData({ ...formData, hp_company_url: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          id="name"
          label="Your Full Name *"
          error={fieldErrors.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
            }}
            placeholder="Ada Lovelace"
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
          />
        </FormField>

        <FormField
          id="email"
          label="Work / Personal Email *"
          error={fieldErrors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
            }}
            placeholder="ada@collective.org"
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          id="organisation"
          label="Organisation / Entity (Optional)"
        >
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={formData.organisation}
            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
            placeholder="Acme Foundation"
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
          />
        </FormField>

        <FormField
          id="interest_type"
          label="Inquiry Scope *"
        >
          <select
            id="interest_type"
            name="interest_type"
            value={formData.interest_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                interest_type: e.target.value as any,
              })
            }
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
          >
            <option value="service">Architectural Services (Custom Build)</option>
            <option value="product">Sovereign Products (HENU OS Ecosystem)</option>
            <option value="partnership">Institutional Partnership</option>
            <option value="general">General Transmission</option>
          </select>
        </FormField>
      </div>

      {formData.interest_ref && (
        <FormField
          id="interest_ref"
          label="Contextual Target Reference"
          hint="Pre-selected from your previous browsing context."
        >
          <input
            id="interest_ref"
            name="interest_ref"
            type="text"
            readOnly
            value={formData.interest_ref}
            className="w-full px-4 py-2.5 rounded-lg border border-border-default bg-surface-secondary text-ink-secondary font-mono text-xs cursor-not-allowed"
          />
        </FormField>
      )}

      <FormField
        id="message"
        label="Project Overview or Technical Transmission *"
        error={fieldErrors.message}
        hint="Please specify operational constraints, timelines, or architecture goals."
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: "" });
          }}
          placeholder="Outline the operational requirements or technology stack for your planned project..."
          className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine resize-y min-h-[120px]"
        />
      </FormField>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-muted">
          Transmission is encrypted and subject to sovereign data minimisation.
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="min-h-[44px] px-8"
        >
          {isSubmitting ? "Transmitting..." : "Submit Transmission"}
        </Button>
      </div>
    </form>
  );
}

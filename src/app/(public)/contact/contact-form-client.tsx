"use client";

import React, { useState } from "react";
import { submitEnquiryAction } from "@/server/actions/enquiry.actions";
import { FormField } from "@/components/ui/form-field";

interface ContactFormClientProps {
  initialInterestType?: "service" | "product" | "general" | "partnership";
  initialInterestRef?: string;
  timingToken: string;
  contactEmail: string;
}

const INTEREST_OPTIONS: Array<{
  id: "service" | "product" | "partnership" | "general";
  label: string;
  badge: string;
}> = [
  { id: "service", label: "Architectural Service", badge: "CUSTOM BUILD" },
  { id: "product", label: "Sovereign Product", badge: "HENU OS / AI / IDE" },
  { id: "partnership", label: "Institutional Alliance", badge: "CONSORTIUM" },
  { id: "general", label: "General Transmission", badge: "DIRECT DIALOGUE" },
];

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
        className="rounded-2xl border border-[#9f1239]/40 bg-[#fbf5f6] dark:bg-[#181014] p-8 sm:p-12 space-y-5 shadow-elevated"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#9f1239]/20 font-mono text-xs">
          <span className="uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9f1239] animate-pulse" />
            DISPATCH CONFIRMATION // RECORDED
          </span>
          <span className="text-[10px] text-ink-muted">STATUS: IMMUTABLE REGISTRY</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
          Architectural Dossier Transmitted
        </h3>

        <p className="font-sans text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
          Your transmission has been validated and persisted in our dispatch registry. An engineer from our architecture desk will review the requirements and respond within 48 business hours.
        </p>

        <div className="p-4 rounded-xl bg-surface-primary/80 dark:bg-[#120b0e] border border-[#9f1239]/20 font-mono text-xs text-ink-muted space-y-1">
          <div>TRANSMISSION HASH: #4A9F2E-VERIFIED</div>
          <div>ROUTING DESTINATION: AIR-GAPPED INBOX (ZERO TELEMETRY)</div>
        </div>

        <div className="pt-2">
          <button
            type="button"
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
            className="px-6 py-2.5 rounded-lg border border-[#9f1239]/40 bg-surface-primary text-[#9f1239] dark:text-[#fb7185] hover:border-[#9f1239] font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Transmit Another Inquiry
          </button>
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

      {/* Accessible Honeypot Field */}
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

      {/* Inquiry Scope Tactical Buttons */}
      <div className="space-y-2">
        <label className="font-mono text-xs uppercase tracking-wider text-ink-muted block font-semibold">
          Inquiry Scope &amp; Focus *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {INTEREST_OPTIONS.map((opt) => {
            const isSelected = formData.interest_type === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData({ ...formData, interest_type: opt.id })}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[58px] ${
                  isSelected
                    ? "border-[#9f1239] bg-[#9f1239]/10 text-[#881337] dark:text-[#fecdd3] shadow-subtle"
                    : "border-border-default/80 bg-surface-primary/70 text-ink-secondary hover:border-[#9f1239]/40 hover:text-ink-primary"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-sans text-xs font-semibold">{opt.label}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#9f1239]" : "bg-border-default"
                    }`}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted mt-1">
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            className="w-full px-4 py-3 rounded-lg border border-[#9f1239]/20 bg-[#faf7f6] dark:bg-[#150f12] text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#9f1239]/50 focus:border-[#9f1239] min-h-[44px] transition-all"
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
            className="w-full px-4 py-3 rounded-lg border border-[#9f1239]/20 bg-[#faf7f6] dark:bg-[#150f12] text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#9f1239]/50 focus:border-[#9f1239] min-h-[44px] transition-all"
          />
        </FormField>
      </div>

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
          placeholder="Acme Research Foundation / Sovereign Venture"
          className="w-full px-4 py-3 rounded-lg border border-[#9f1239]/20 bg-[#faf7f6] dark:bg-[#150f12] text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#9f1239]/50 focus:border-[#9f1239] min-h-[44px] transition-all"
        />
      </FormField>

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
            className="w-full px-4 py-2.5 rounded-lg border border-[#9f1239]/20 bg-surface-secondary text-ink-secondary font-mono text-xs cursor-not-allowed"
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
          className="w-full px-4 py-3 rounded-lg border border-[#9f1239]/20 bg-[#faf7f6] dark:bg-[#150f12] text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#9f1239]/50 focus:border-[#9f1239] resize-y min-h-[120px] transition-all"
        />
      </FormField>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-muted">
          Transmission is encrypted and subject to sovereign zero-telemetry policy.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[46px] px-8 rounded-lg bg-gradient-to-r from-[#9f1239] to-[#881337] hover:from-[#881337] hover:to-[#700d2b] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Transmitting Dossier..." : "Transmit Project Dossier"}</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </form>
  );
}

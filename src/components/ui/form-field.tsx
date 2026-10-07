import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}) => {
  return (
    <div className={twMerge("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-on-surface"
        >
          {label} {required && <span className="text-secondary" aria-hidden="true">*</span>}
        </label>
        {required && <span className="sr-only">(required)</span>}
      </div>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-on-surface-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-error flex items-center gap-1" role="alert">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

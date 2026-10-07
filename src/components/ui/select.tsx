import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={hasError ? "true" : undefined}
          className={twMerge(
            clsx(
              "w-full appearance-none rounded-md border bg-surface px-3.5 py-2.5 pr-10 text-sm text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-50 disabled:bg-surface-container-low",
              hasError
                ? "border-error focus-visible:outline-error"
                : "border-outline/30 hover:border-outline/50 focus-visible:outline-primary",
              className
            )
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-muted">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

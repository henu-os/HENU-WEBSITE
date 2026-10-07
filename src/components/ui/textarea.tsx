import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={hasError ? "true" : undefined}
        className={twMerge(
          clsx(
            "w-full rounded-md border bg-surface px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-muted/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-50 disabled:bg-surface-container-low",
            hasError
              ? "border-error focus-visible:outline-error"
              : "border-outline/30 hover:border-outline/50 focus-visible:outline-primary",
            className
          )
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

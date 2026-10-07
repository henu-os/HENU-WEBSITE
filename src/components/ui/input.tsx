import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
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

Input.displayName = "Input";

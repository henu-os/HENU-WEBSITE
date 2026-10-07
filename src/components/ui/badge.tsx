import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "neutral"
    | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-mono font-medium uppercase tracking-wider rounded border";

  const variantStyles = {
    default: "border-border-default bg-surface-secondary text-ink-secondary",
    primary: "border-accent-spectral/30 bg-accent-spectral/10 text-accent-spectral",
    secondary: "border-border-default bg-surface-primary text-ink-primary",
    success: "border-status-success/30 bg-status-success/10 text-status-success",
    warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
    error: "border-status-error/30 bg-status-error/10 text-status-error",
    neutral: "border-border-subtle bg-surface-tertiary text-ink-muted",
    outline: "border-border-default bg-transparent text-ink-primary",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      {...props}
    >
      {children}
    </span>
  );
};

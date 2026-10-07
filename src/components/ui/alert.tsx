import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error" | "default" | "destructive";
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    info: "border-border-default bg-surface-secondary text-ink-primary",
    default: "border-border-default bg-surface-secondary text-ink-primary",
    success: "border-status-success/30 bg-status-success/10 text-status-success",
    warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
    error: "border-status-error/30 bg-status-error/10 text-status-error",
    destructive: "border-status-error/30 bg-status-error/10 text-status-error",
  };

  return (
    <div
      role="alert"
      className={twMerge(
        clsx("rounded-md border p-4 text-sm leading-relaxed", variantStyles[variant], className)
      )}
      {...props}
    >
      {title && <h5 className="font-semibold mb-1 text-sm">{title}</h5>}
      <div>{children}</div>
    </div>
  );
};

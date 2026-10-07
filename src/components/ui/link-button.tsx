import React from "react";
import Link, { type LinkProps } from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-primary text-primary-on hover:opacity-95 shadow-subtle focus-visible:outline-primary",
    secondary:
      "bg-secondary text-secondary-on hover:opacity-95 shadow-subtle focus-visible:outline-secondary",
    outline:
      "border border-border-default bg-surface-primary text-ink-primary hover:bg-surface-secondary focus-visible:outline-primary",
    ghost:
      "text-ink-primary hover:bg-surface-secondary focus-visible:outline-primary",
    danger:
      "bg-status-error text-white hover:opacity-95 shadow-subtle focus-visible:outline-status-error",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
  };

  return (
    <Link
      className={twMerge(
        clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

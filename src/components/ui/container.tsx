import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full" | "narrow" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  size = "lg",
  className,
  children,
  ...props
}) => {
  const sizeStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
    sm: "max-w-3xl",
    narrow: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1440px]",
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <div
      className={twMerge(
        clsx("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeStyles[size], className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
  surface?: "default" | "container" | "low" | "high";
}

export const Section: React.FC<SectionProps> = ({
  spacing = "lg",
  surface = "default",
  className,
  children,
  ...props
}) => {
  const spacingStyles = {
    none: "py-0",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-24",
    xl: "py-24 sm:py-32",
  };

  const surfaceStyles = {
    default: "bg-canvas-base",
    container: "bg-surface-primary",
    low: "bg-surface-secondary",
    high: "bg-surface-tertiary",
  };

  return (
    <section
      className={twMerge(clsx(spacingStyles[spacing], surfaceStyles[surface], className))}
      {...props}
    >
      {children}
    </section>
  );
};

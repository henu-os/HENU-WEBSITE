import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  className,
  ...props
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          "animate-pulse bg-surface-container-high/60",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    />
  );
};

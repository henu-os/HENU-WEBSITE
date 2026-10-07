import React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ResponsiveImageProps extends Omit<NextImageProps, "alt"> {
  alt: string;
  isDecorative?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9" | "auto";
  wrapperClassName?: string;
}

/**
 * Reusable Image Primitive (CORE-010, PERF-001)
 * Enforces stable aspect ratios, layout-shift prevention, and alt text accessibility.
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  alt,
  isDecorative = false,
  aspectRatio = "auto",
  wrapperClassName,
  className,
  priority = false,
  ...props
}) => {
  const aspectStyles = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
    auto: "",
  };

  const safeAlt = isDecorative ? "" : alt;

  return (
    <div
      className={twMerge(
        clsx(
          "relative overflow-hidden bg-surface-secondary",
          aspectStyles[aspectRatio],
          wrapperClassName
        )
      )}
    >
      <NextImage
        alt={safeAlt}
        aria-hidden={isDecorative ? "true" : undefined}
        priority={priority}
        className={twMerge(
          clsx("object-cover transition-opacity duration-300", className)
        )}
        {...props}
      />
    </div>
  );
};

export const SafeImage = ResponsiveImage;

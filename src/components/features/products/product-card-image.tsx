import React from "react";
import Image from "next/image";
import type { Product } from "@/types/domain";

interface ProductCardImageProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCardImage({
  product,
  className = "",
  priority = false,
}: ProductCardImageProps) {
  // Determine image source: custom uploaded image or canonical brand asset
  const defaultFallback = `/brand/${product.slug}.png`;
  const imageSrc = product.image_url?.trim() || defaultFallback;

  return (
    <div
      className={`relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-border-default/80 bg-slate-900/90 dark:bg-slate-950/90 shadow-sm hover:shadow-md transition-all duration-300 group/img flex items-center justify-center p-4 sm:p-6 ${className}`}
    >
      {/* Subtle ambient glowing backdrop based on product hue */}
      <div className="absolute inset-0 bg-radial from-brand-pine/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover/img:opacity-80 transition-opacity" />

      {/* Product Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={`${product.name} Official Product Graphic`}
          fill
          priority={priority}
          className="object-contain p-2 group-hover/img:scale-105 transition-transform duration-500 ease-out drop-shadow-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          unoptimized={imageSrc.startsWith("http") || imageSrc.endsWith(".svg")}
        />
      </div>
    </div>
  );
}

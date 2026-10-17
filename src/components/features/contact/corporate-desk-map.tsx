"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";

interface CorporateDeskMapProps {
  className?: string;
}

export const CorporateDeskMap: React.FC<CorporateDeskMapProps> = ({ className = "" }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Exact coordinates for HENU OS Private Limited, Narolgam, Ahmedabad
  const lat = 22.9774577;
  const lon = 72.5855018;
  const bbox = `${lon - 0.012},${lat - 0.008},${lon + 0.012},${lat + 0.008}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <section
      aria-label="Registered Corporate Desk & Geographic Location"
      className={`rounded-2xl border border-[#9f1239]/25 bg-gradient-to-br from-[#faf7f6] via-[#f9f3f3] to-[#f6efef] dark:from-[#150f12] dark:via-[#110c0f] dark:to-[#0d090b] p-6 sm:p-8 space-y-6 shadow-elevated relative overflow-hidden ${className}`}
    >
      {/* Corner Filigree Brackets */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#9f1239]/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#9f1239]/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#9f1239]/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#9f1239]/40 pointer-events-none" />

      {/* Header telemetry and address details */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#9f1239]/20 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9f1239] dark:text-[#fb7185] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9f1239] dark:bg-[#fb7185] animate-pulse" />
              Office // Registered Corporate Desk
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#9f1239]/20 bg-[#9f1239]/5 text-ink-secondary">
              LAT: 22.9775° N &bull; LON: 72.5855° E
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#4c0519] dark:text-[#fecdd3] font-normal">
            {siteConfig.contact.name}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
            {siteConfig.contact.address}
          </p>
        </div>

        {/* Action Controls & Contact Details */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#9f1239]/20 bg-surface-primary dark:bg-[#120b0e] text-ink-primary hover:border-[#9f1239]/50 hover:text-[#9f1239] dark:hover:text-[#fb7185] font-mono text-xs transition-colors shadow-xs"
          >
            <svg
              className="h-3.5 w-3.5 text-[#9f1239] dark:text-[#fb7185]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{siteConfig.contact.phone}</span>
          </a>

          <a
            href={siteConfig.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#9f1239] to-[#881337] hover:from-[#881337] hover:to-[#700d2b] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:shadow-subtle transition-all"
          >
            <span>Open Google Maps</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Palette-Styled Interactive Map Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] rounded-xl overflow-hidden border border-[#9f1239]/25 bg-surface-primary shadow-inner group">
        {/* Loading state skeleton */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-secondary/50 font-mono text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9f1239] animate-pulse" />
              <span>Calibrating Geographic Coordinates...</span>
            </div>
          </div>
        )}

        {/* Embedded Map with Brand Palette Filters */}
        <iframe
          title="HENU OS Corporate Headquarters Geographic Map"
          src={embedUrl}
          className="w-full h-full border-0 transition-opacity duration-500 [filter:contrast(1.05)_saturate(0.85)_sepia(0.18)_hue-rotate(315deg)] dark:[filter:invert(0.92)_hue-rotate(145deg)_contrast(1.15)_saturate(0.85)]"
          loading="lazy"
          onLoad={() => setMapLoaded(true)}
        />

        {/* Floating Telemetry Location Pin HUD */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <div className="p-3 rounded-lg border border-[#9f1239]/30 bg-surface-primary/95 dark:bg-[#150f12]/95 backdrop-blur-md shadow-elevated space-y-1 max-w-xs">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9f1239] dark:text-[#fb7185] font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9f1239] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9f1239]" />
              </span>
              <span>HENU OS HQ // AHMEDABAD</span>
            </div>
            <p className="font-mono text-[11px] text-ink-primary font-semibold truncate">
              B-1204, Shree Ram Residency
            </p>
            <p className="font-mono text-[10px] text-ink-muted">
              Narolgam, Ahmedabad, Gujarat 382405
            </p>
          </div>
        </div>

        {/* Corner HUD accent watermark */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="px-2 py-1 rounded bg-[#9f1239]/10 dark:bg-[#9f1239]/20 text-[#9f1239] dark:text-[#fb7185] font-mono text-[10px] font-bold border border-[#9f1239]/20 backdrop-blur-xs">
            VERIFIED HEADQUARTERS
          </span>
        </div>
      </div>
    </section>
  );
};

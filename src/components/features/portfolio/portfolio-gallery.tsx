"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface GalleryItem {
  media_id?: string;
  url: string;
  caption?: string;
  alt?: string;
}

interface PortfolioGalleryProps {
  items: GalleryItem[];
  projectTitle: string;
}

export function PortfolioGallery({ items, projectTitle }: PortfolioGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = items.length;

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentIndex(total - 1);
      }
    },
    [goToPrev, goToNext, total]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !e.changedTouches[0]) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];
  if (!currentItem) {
    return null;
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${projectTitle} Media Gallery`}
      className="space-y-4 my-8"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Artifact Gallery // Slide {currentIndex + 1} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="p-2 rounded border border-border-default bg-surface-secondary text-ink-primary hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-accent-spectral transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="p-2 rounded border border-border-default bg-surface-secondary text-ink-primary hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-accent-spectral transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-border-default bg-surface-secondary"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentItem.url}
          alt={currentItem.alt || `${projectTitle} gallery slide ${currentIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-contain p-2 sm:p-4"
          priority={currentIndex === 0}
        />
      </div>

      {currentItem.caption && (
        <p className="font-sans text-xs sm:text-sm text-ink-muted italic text-center">
          {currentItem.caption}
        </p>
      )}

      {/* Pagination indicators */}
      {total > 1 && (
        <div className="flex justify-center gap-2 pt-2" role="tablist" aria-label="Slides">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent-spectral ${
                idx === currentIndex
                  ? "w-8 bg-ink-primary"
                  : "w-2 bg-ink-muted/30 hover:bg-ink-muted/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

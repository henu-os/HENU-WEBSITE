import React from "react";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { HenuLoader } from "@/components/ui/henu-loader";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page content"
      className="py-12 md:py-20"
    >
      <Container size="wide" className="space-y-12">
        <HenuLoader label="Loading HENU Systems..." size="md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Hero Left Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-16 w-full max-w-xl rounded-lg" />
            <Skeleton className="h-12 w-4/5 rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-40 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>

          {/* Hero Right Field Skeleton */}
          <div className="lg:col-span-5 flex justify-center">
            <Skeleton className="w-full max-w-[460px] aspect-square rounded-2xl" />
          </div>
        </div>

        {/* Pillar Skeletons */}
        <div className="mt-20 pt-12 border-t border-border-default grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </Container>
    </div>
  );
}

import React from "react";
import { mediaRepository } from "@/server/repositories/media.repository";
import { MediaLibraryClient } from "./media-library-client";

export default async function AdminMediaPage() {
  const { assets } = await mediaRepository.listMediaAssets({ limit: 50 });

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Media Library
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Upload and manage verified image assets. Disallowed MIME types and active script vectors are rejected automatically.
        </p>
      </div>

      <MediaLibraryClient initialAssets={assets} />
    </div>
  );
}

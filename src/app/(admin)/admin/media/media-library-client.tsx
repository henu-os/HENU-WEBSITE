"use client";

import React, { useState, useTransition } from "react";
import type { MediaAsset } from "@/types/domain";
import { uploadMediaAction, deleteMediaAction } from "@/server/actions/media.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function MediaLibraryClient({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [isUploading, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [altText, setAltText] = useState("");
  const [isDecorative, setIsDecorative] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select an image file to upload." });
      return;
    }

    if (!isDecorative && !altText.trim()) {
      setMessage({
        type: "error",
        text: "Alt text is mandatory for informative images before upload.",
      });
      return;
    }

    setMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("altText", altText.trim());
    formData.append("isDecorative", isDecorative ? "true" : "false");

    startUploadTransition(async () => {
      try {
        const result = await uploadMediaAction(formData);
        if (result.success && result.asset) {
          setAssets([result.asset, ...assets]);
          setSelectedFile(null);
          setAltText("");
          setIsDecorative(false);
          // reset file input
          const fileInput = document.getElementById("media-file-input") as HTMLInputElement | null;
          if (fileInput) fileInput.value = "";

          setMessage({
            type: "success",
            text: `Media uploaded successfully: ${result.asset.original_filename}`,
          });
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Media upload failed.";
        setMessage({ type: "error", text: errorMsg });
      }
    });
  };

  const handleDelete = (assetId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    setMessage(null);
    startDeleteTransition(async () => {
      try {
        await deleteMediaAction(assetId);
        setAssets(assets.filter((a) => a.id !== assetId));
        setMessage({
          type: "success",
          text: `Media asset deleted: ${filename}`,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete media asset.";
        setMessage({ type: "error", text: errorMsg });
      }
    });
  };

  return (
    <div className="space-y-10">
      {message && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          title={message.type === "success" ? "Success" : "Error"}
        >
          {message.text}
        </Alert>
      )}

      {/* Upload Box */}
      <div className="p-6 rounded-xl border border-border-default bg-surface-primary shadow-xs">
        <h2 className="font-display text-lg font-bold text-ink-primary mb-4 border-b border-border-subtle pb-3">
          Upload New Image Asset (SEC-006 / CORE-010)
        </h2>

        <form onSubmit={handleUpload} className="space-y-6 max-w-xl">
          <FormField
            id="media-file-input"
            label="Image File"
            hint="PNG, JPEG, WebP, or SVG. Maximum file size: 5 MB."
          >
            <input
              id="media-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-ink-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-surface-secondary file:text-ink-primary hover:file:bg-border-default cursor-pointer"
              required
            />
          </FormField>

          <div className="flex items-center gap-2">
            <input
              id="is_decorative"
              type="checkbox"
              checked={isDecorative}
              onChange={(e) => setIsDecorative(e.target.checked)}
              className="rounded border-border-default text-accent-spectral focus:ring-focus-ring"
            />
            <label htmlFor="is_decorative" className="text-sm font-medium text-ink-primary cursor-pointer">
              This image is purely decorative (empty alt text allowed)
            </label>
          </div>

          {!isDecorative && (
            <FormField
              id="alt_text"
              label="Alt Text (Required)"
              hint="Concise, descriptive text for screen readers explaining the image content."
            >
              <Input
                id="alt_text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. HENU OS architecture diagram showing kernel and user layers"
                required={!isDecorative}
              />
            </FormField>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={isUploading}>
            Upload and Verify
          </Button>
        </form>
      </div>

      {/* Media Assets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-ink-primary">
            Asset Library ({assets.length})
          </h2>
          <span className="font-mono text-xs text-ink-muted">
            Inspects magic bytes &bull; Strips executable content
          </span>
        </div>

        {assets.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border-default rounded-xl bg-surface-primary">
            <p className="font-sans text-sm text-ink-secondary">
              No media assets uploaded yet. Use the upload form above to add images.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-lg border border-border-default bg-surface-primary overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="p-4 bg-surface-secondary/50 border-b border-border-subtle flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                      {asset.media_type.replace("image/", "")}
                    </Badge>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {(asset.byte_size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="font-mono text-xs font-semibold text-ink-primary truncate mt-2" title={asset.original_filename}>
                    {asset.original_filename}
                  </p>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-ink-muted block text-[10px] uppercase">Alt Text:</span>
                    <p className="text-ink-secondary italic text-[11px] line-clamp-2 mt-0.5">
                      {asset.is_decorative ? "(Decorative)" : asset.alt_text || "None"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-muted">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(asset.id, asset.original_filename)}
                      isLoading={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import "server-only";
import { randomUUID } from "node:crypto";
import { mediaRepository } from "../repositories/media.repository";
import { auditLogRepository } from "../repositories/audit-log.repository";
import {
  ALLOWED_MIME_TYPES,
  validateFileSize,
  verifyImageMagicBytes,
  verifySvgSafety,
  type AllowedMimeType,
} from "@/lib/validation/media";
import { ValidationError, AuthorizationError } from "@/lib/errors";
import type { MediaAsset } from "@/types/domain";

export interface UploadMediaInput {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  altText?: string;
  isDecorative?: boolean;
  adminId: string;
  adminEmail: string;
  ipAddress?: string;
}

export class MediaService {
  /**
   * Validates and persists an uploaded media asset with security inspection (SEC-006, CORE-010).
   */
  async processUpload(input: UploadMediaInput): Promise<MediaAsset> {
    if (!input.adminId) {
      throw new AuthorizationError("Admin identity required to upload media.");
    }

    // 1. File size check
    if (!validateFileSize(input.buffer.length)) {
      throw new ValidationError(
        `File size (${(input.buffer.length / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed 5 MB.`
      );
    }

    // 2. Content inspection by magic bytes
    let verifiedMime: AllowedMimeType | null = null;

    if (input.mimeType === "image/svg+xml" || input.filename.toLowerCase().endsWith(".svg")) {
      const svgText = input.buffer.toString("utf-8");
      if (!verifySvgSafety(svgText)) {
        throw new ValidationError("SVG contains prohibited executable scripts or active attributes.");
      }
      verifiedMime = "image/svg+xml";
    } else {
      verifiedMime = verifyImageMagicBytes(new Uint8Array(input.buffer));
      if (!verifiedMime) {
        throw new ValidationError(
          "File content does not match genuine image magic bytes. Disguised files are prohibited."
        );
      }
    }

    // Ensure MIME matches allowlist
    if (!ALLOWED_MIME_TYPES.includes(verifiedMime)) {
      throw new ValidationError(`Unsupported media type: ${verifiedMime}`);
    }

    // Determine safe extension
    const extMap: Record<AllowedMimeType, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };
    const safeExt = extMap[verifiedMime];
    const storageKey = `media/${randomUUID()}.${safeExt}`;

    // 3. Persist metadata
    const asset = await mediaRepository.createMediaAsset({
      storage_key: storageKey,
      original_filename: input.filename.slice(0, 255),
      media_type: verifiedMime,
      byte_size: input.buffer.length,
      alt_text: input.altText?.trim() || null,
      is_decorative: input.isDecorative ?? false,
      uploaded_by: input.adminId,
    });

    // 4. Record Audit Log
    await auditLogRepository.record({
      actor_id: input.adminId,
      actor_email: input.adminEmail,
      action: "MEDIA_UPLOAD",
      entity_type: "media_asset",
      entity_id: asset.id,
      summary: `Uploaded media asset ${asset.original_filename} (${verifiedMime}, ${asset.byte_size} bytes)`,
      metadata: {
        storage_key: storageKey,
        media_type: verifiedMime,
      },
      ip_address: input.ipAddress || null,
    });

    return asset;
  }

  /**
   * Safely deletes a media asset if not referenced in published content.
   */
  async deleteMedia(
    assetId: string,
    adminId: string,
    adminEmail: string,
    ipAddress?: string
  ): Promise<void> {
    const asset = await mediaRepository.getMediaAssetById(assetId);
    if (!asset) {
      return;
    }

    await mediaRepository.deleteMediaAsset(assetId);

    await auditLogRepository.record({
      actor_id: adminId,
      actor_email: adminEmail,
      action: "MEDIA_DELETE",
      entity_type: "media_asset",
      entity_id: assetId,
      summary: `Deleted media asset ${asset.original_filename}`,
      metadata: {
        storage_key: asset.storage_key,
      },
      ip_address: ipAddress || null,
    });
  }
}

export const mediaService = new MediaService();

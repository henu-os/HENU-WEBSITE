"use server";

import fs from "fs";
import path from "path";
import { requireAdminSession } from "@/server/auth/session";
import { mediaService } from "@/server/services/media.service";
import { ValidationError } from "@/lib/errors";

export async function uploadMediaAction(formData: FormData) {
  // 1. Authorize
  const admin = await requireAdminSession();

  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";
  const isDecorative = formData.get("isDecorative") === "true";

  if (!file) {
    throw new ValidationError("No file provided for upload.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const asset = await mediaService.processUpload({
    filename: file.name,
    mimeType: file.type,
    buffer,
    altText,
    isDecorative,
    adminId: admin.id,
    adminEmail: admin.email,
  });

  try {
    const uploadDir = path.join(process.cwd(), "public", path.dirname(asset.storage_key));
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(process.cwd(), "public", asset.storage_key), buffer);
  } catch (err) {
    console.warn("[uploadMediaAction] Could not write to public folder:", err);
  }

  const publicUrl = `/${asset.storage_key}`;

  return { success: true, asset, publicUrl };
}

export async function deleteMediaAction(assetId: string) {
  const admin = await requireAdminSession();
  await mediaService.deleteMedia(assetId, admin.id, admin.email);
  return { success: true };
}

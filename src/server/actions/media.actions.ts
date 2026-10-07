"use server";

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

  return { success: true, asset };
}

export async function deleteMediaAction(assetId: string) {
  const admin = await requireAdminSession();
  await mediaService.deleteMedia(assetId, admin.id, admin.email);
  return { success: true };
}

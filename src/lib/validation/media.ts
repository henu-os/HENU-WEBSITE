export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates that file size does not exceed the 5MB limit.
 */
export function validateFileSize(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
}

/**
 * Inspects binary magic numbers to verify genuine image content (SEC-006).
 */
export function verifyImageMagicBytes(buffer: Uint8Array): AllowedMimeType | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

/**
 * Inspects SVG content to verify absence of script vectors (SEC-006).
 */
export function verifySvgSafety(svgText: string): boolean {
  const lower = svgText.toLowerCase();

  // Prohibited executable tags and handlers
  const dangerousPatterns = [
    "<script",
    "javascript:",
    "onload=",
    "onerror=",
    "onclick=",
    "onmouseover=",
    "onfocus=",
    "onblur=",
    "<foreignobject",
    "<iframe",
    "<embed",
    "<object",
    "xlink:href=\"javascript:",
    "href=\"javascript:",
  ];

  for (const pattern of dangerousPatterns) {
    if (lower.includes(pattern)) {
      return false;
    }
  }

  // Must contain valid svg tag
  return lower.includes("<svg") && lower.includes("</svg>");
}

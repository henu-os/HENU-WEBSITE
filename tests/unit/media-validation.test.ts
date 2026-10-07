import { describe, it, expect } from "vitest";
import {
  validateFileSize,
  verifyImageMagicBytes,
  verifySvgSafety,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/validation/media";

describe("Media Validation & Security (SEC-006, CORE-010)", () => {
  it("enforces 5MB file size limit", () => {
    expect(validateFileSize(1024)).toBe(true);
    expect(validateFileSize(MAX_FILE_SIZE_BYTES)).toBe(true);
    expect(validateFileSize(MAX_FILE_SIZE_BYTES + 1)).toBe(false);
    expect(validateFileSize(0)).toBe(false);
  });

  it("detects genuine PNG magic bytes", () => {
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    expect(verifyImageMagicBytes(pngHeader)).toBe("image/png");
  });

  it("detects genuine JPEG magic bytes", () => {
    const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    expect(verifyImageMagicBytes(jpegHeader)).toBe("image/jpeg");
  });

  it("detects genuine WebP magic bytes", () => {
    const webpHeader = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x24, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50, // WEBP
    ]);
    expect(verifyImageMagicBytes(webpHeader)).toBe("image/webp");
  });

  it("rejects disguised executables with fake extensions", () => {
    // Windows PE executable header: "MZ"
    const exeHeader = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
    expect(verifyImageMagicBytes(exeHeader)).toBeNull();

    // ELF executable header: 0x7F 'E' 'L' 'F'
    const elfHeader = new Uint8Array([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);
    expect(verifyImageMagicBytes(elfHeader)).toBeNull();
  });

  it("verifies safe SVG and rejects script injection vectors", () => {
    const safeSvg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';
    expect(verifySvgSafety(safeSvg)).toBe(true);

    const scriptSvg = '<svg><script>alert("XSS")</script><circle cx="50" cy="50" r="40"/></svg>';
    expect(verifySvgSafety(scriptSvg)).toBe(false);

    const onloadSvg = '<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>';
    expect(verifySvgSafety(onloadSvg)).toBe(false);

    const jsHrefSvg = '<svg><a href="javascript:alert(1)"><circle cx="50" cy="50" r="40"/></a></svg>';
    expect(verifySvgSafety(jsHrefSvg)).toBe(false);

    const foreignObjectSvg = '<svg><foreignObject><iframe src="evil.com"></iframe></foreignObject></svg>';
    expect(verifySvgSafety(foreignObjectSvg)).toBe(false);
  });
});

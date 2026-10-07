import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("Security Headers & CSP Verification (SEC-002)", () => {
  it("defines security headers for all routes", async () => {
    expect(typeof nextConfig.headers).toBe("function");
    if (!nextConfig.headers) return;

    const headersList = await nextConfig.headers();
    expect(headersList.length).toBeGreaterThan(0);

    const globalHeadersEntry = headersList.find(
      (h) => h.source === "/:path*" || h.source === "/(.*)"
    );
    expect(globalHeadersEntry).toBeDefined();

    const headerMap = new Map(
      globalHeadersEntry?.headers.map((h) => [h.key.toLowerCase(), h.value])
    );

    // 1. Frame protection
    expect(headerMap.get("x-frame-options")).toBe("DENY");

    // 2. MIME sniffing protection
    expect(headerMap.get("x-content-type-options")).toBe("nosniff");

    // 3. Referrer Policy
    expect(headerMap.get("referrer-policy")).toBe("strict-origin-when-cross-origin");

    // 4. Permissions Policy
    expect(headerMap.get("permissions-policy")).toBeDefined();
    expect(headerMap.get("permissions-policy")).toContain("camera=()");
    expect(headerMap.get("permissions-policy")).toContain("microphone=()");

    // 5. Content Security Policy
    const csp = headerMap.get("content-security-policy");
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");

    // 6. Strict-Transport-Security (HSTS)
    expect(headerMap.get("strict-transport-security")).toBeDefined();
    expect(headerMap.get("strict-transport-security")).toContain("max-age=63072000");
  });
});

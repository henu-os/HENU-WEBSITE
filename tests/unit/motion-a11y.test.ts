import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Restrained V1 Motion Set & Reduced Motion (MOTION-001, Document 04 §7)", () => {
  const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("enforces prefers-reduced-motion media query to remove animations", () => {
    expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssContent).toContain("animation-duration: 0.01ms !important");
    expect(cssContent).toContain("transition-duration: 0.01ms !important");
    expect(cssContent).toContain("scroll-behavior: auto !important");
  });

  it("ensures motion utilities animate only transform and opacity (no layout shifting properties)", () => {
    expect(cssContent).toContain(".motion-fade-in");
    expect(cssContent).toContain(".motion-slide-up");
    expect(cssContent).toContain(".motion-lift");

    // Extract the V1 Motion Set section
    const motionSectionMatch = cssContent.match(/\/\* V1 Motion Set[\s\S]*?(?=\n\n|$)/);
    const motionSection = motionSectionMatch ? motionSectionMatch[0] : cssContent;

    // Check that layout properties (width, height, top, left, margin, padding) are not animated
    expect(motionSection).not.toMatch(/transition:[^;]*(?:width|height|margin|padding|top|left)\b/);
  });
});

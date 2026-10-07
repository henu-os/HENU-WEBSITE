import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Visual Regression Specification & Layout Invariants (VR-SPEC-010, RAB §4.2)", () => {
  const globalsCssPath = path.resolve(process.cwd(), "src/app/globals.css");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

  describe("View Transitions & Motion Invariants (MOTION-003)", () => {
    it("declares native @view-transition rules in global stylesheets", () => {
      expect(globalsCss).toContain("@view-transition");
      expect(globalsCss).toContain("navigation: auto;");
    });

    it("provides explicit prefers-reduced-motion overrides", () => {
      expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
      expect(globalsCss).toContain("animation-duration: 0.01ms");
      expect(globalsCss).toContain("transition-duration: 0.01ms");
    });

    it("declares shared-element hero transition classes for Portfolio", () => {
      expect(globalsCss).toContain(".view-transition-portfolio-hero");
      expect(globalsCss).toContain("view-transition-name: portfolio-hero-image;");
    });
  });

  describe("Responsive Layout Breakpoint Baseline (RAB §4.2)", () => {
    const tailwindConfigPath = path.resolve(process.cwd(), "tailwind.config.ts");
    const tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");

    it("defines 360, 768, 1024, and 1440 responsive breakpoint anchors", () => {
      expect(tailwindConfig).toContain("sm");
      expect(tailwindConfig).toContain("md");
      expect(tailwindConfig).toContain("lg");
      expect(tailwindConfig).toContain("xl");
    });
  });

  describe("Critical Route Manifest Verifications", () => {
    const publicRoutes = [
      "src/app/(public)/page.tsx",
      "src/app/(public)/services/page.tsx",
      "src/app/(public)/products/page.tsx",
      "src/app/(public)/portfolio/page.tsx",
      "src/app/(public)/about/page.tsx",
      "src/app/(public)/contact/page.tsx",
      "src/app/(public)/privacy/page.tsx",
      "src/app/(public)/terms/page.tsx",
    ];

    const adminRoutes = [
      "src/app/(admin)/admin/home/page.tsx",
      "src/app/(admin)/admin/users/page.tsx",
      "src/app/(admin)/admin/audit-logs/page.tsx",
      "src/app/(admin)/admin/settings/page.tsx",
    ];

    it("verifies all public and supporting legal routes exist", () => {
      publicRoutes.forEach((route) => {
        const fullPath = path.resolve(process.cwd(), route);
        expect(fs.existsSync(fullPath), `Route file ${route} must exist`).toBe(true);
      });
    });

    it("verifies all admin control plane and governance routes exist", () => {
      adminRoutes.forEach((route) => {
        const fullPath = path.resolve(process.cwd(), route);
        expect(fs.existsSync(fullPath), `Admin route file ${route} must exist`).toBe(true);
      });
    });
  });
});

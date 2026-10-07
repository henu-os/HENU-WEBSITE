import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import {
  validateProductCTA,
  validateReservedProductSlug,
} from "@/server/services/product.service";
import { ValidationError } from "@/lib/errors";

describe("Product CTA & Reserved Slug Validation (PROD-006, SEC-002)", () => {
  describe("validateProductCTA", () => {
    it("blocks 'download' CTA when no confirmed public release is available", () => {
      expect(() => {
        validateProductCTA("download", false);
      }).toThrow(ValidationError);
      expect(() => {
        validateProductCTA("download", false);
      }).toThrow(
        /Cannot publish a 'download' CTA without an active, verified public release/
      );
    });

    it("allows 'download' CTA if an active verified public release is confirmed", () => {
      expect(() => {
        validateProductCTA("download", true);
      }).not.toThrow();
    });

    it("allows non-release CTAs like 'explore', 'waitlist', 'demo', 'enquire' without release", () => {
      expect(() => validateProductCTA("explore", false)).not.toThrow();
      expect(() => validateProductCTA("waitlist", false)).not.toThrow();
      expect(() => validateProductCTA("demo", false)).not.toThrow();
      expect(() => validateProductCTA("enquire", false)).not.toThrow();
    });
  });

  describe("validateReservedProductSlug", () => {
    const HENU_OS_CANONICAL_ID = "p1111111-1111-1111-1111-111111111111";
    const OTHER_PRODUCT_ID = "p9999999-9999-9999-9999-999999999999";

    it("prevents any other product from claiming the reserved 'henu-os' slug", () => {
      expect(() => {
        validateReservedProductSlug("henu-os", OTHER_PRODUCT_ID);
      }).toThrow(ValidationError);

      expect(() => {
        validateReservedProductSlug("henu-os", OTHER_PRODUCT_ID);
      }).toThrow(/The slug 'henu-os' is strictly reserved/);
    });

    it("allows the canonical flagship HENU OS product to use 'henu-os'", () => {
      expect(() => {
        validateReservedProductSlug("henu-os", HENU_OS_CANONICAL_ID);
      }).not.toThrow();
    });

    it("allows valid non-reserved slugs for any product", () => {
      expect(() => validateReservedProductSlug("henu-ai", OTHER_PRODUCT_ID)).not.toThrow();
      expect(() => validateReservedProductSlug("henu-pa", OTHER_PRODUCT_ID)).not.toThrow();
      expect(() => validateReservedProductSlug("henu-ide", OTHER_PRODUCT_ID)).not.toThrow();
      expect(() => validateReservedProductSlug("henu-compiler", OTHER_PRODUCT_ID)).not.toThrow();
    });
  });
});

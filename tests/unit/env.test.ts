import { describe, it, expect } from "vitest";
import { getPublicEnv, getServerEnv } from "@/config/env";

describe("Environment & Configuration Baseline (CORE-002, SEC-001)", () => {
  it("exposes public environment configuration with default safe values", () => {
    const publicEnv = getPublicEnv();
    expect(publicEnv).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_APP_ENV).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();

    // Verify no server secrets leaked to public object
    expect((publicEnv as Record<string, unknown>).SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect((publicEnv as Record<string, unknown>).ADMIN_SESSION_SECRET).toBeUndefined();
  });

  it("exposes server environment variables only when running on server", () => {
    const serverEnv = getServerEnv();
    expect(serverEnv).toBeDefined();
    expect(serverEnv.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    expect(serverEnv.ADMIN_SESSION_SECRET).toBeDefined();
  });
});

import "server-only";
import { getServerEnv, getPublicEnv } from "@/config/env";

/**
 * Evaluates whether Supabase database connectivity is genuinely configured
 * with non-placeholder endpoints and active credentials.
 * When false, the application immediately resolves to verified domain baselines
 * without incurring DNS resolution timeouts or hanging network calls.
 */
export function isDatabaseConfigured(): boolean {
  try {
    const publicEnv = getPublicEnv();
    const serverEnv = getServerEnv();
    const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || url.includes("placeholder.supabase.co") || !url.startsWith("http")) {
      return false;
    }
    if (!anonKey || anonKey.includes("placeholder-anon-key")) {
      return false;
    }
    if (!serviceKey || serviceKey.includes("placeholder-service-role-key")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

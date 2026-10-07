import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv, getPublicEnv } from "@/config/env";
import type { Database } from "@/types/database";

let serviceClientInstance: SupabaseClient<Database> | null = null;
let publicServerClientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns a Supabase client configured with the elevated Service Role Key.
 * STRICTLY SERVER-ONLY. Confined to trusted server services and repositories.
 * Never expose or return this client to public or client-side callers.
 */
export function getServiceClient(): SupabaseClient<Database> {
  if (serviceClientInstance) {
    return serviceClientInstance;
  }

  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  serviceClientInstance = createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return serviceClientInstance;
}

/**
 * Returns a Supabase client configured with the Anon Key for server-side
 * unauthenticated queries subject to public RLS policies.
 */
export function getPublicServerClient(): SupabaseClient<Database> {
  if (publicServerClientInstance) {
    return publicServerClientInstance;
  }

  const publicEnv = getPublicEnv();

  publicServerClientInstance = createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return publicServerClientInstance;
}

export { isDatabaseConfigured } from "./status";

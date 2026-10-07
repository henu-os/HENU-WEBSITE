import "server-only";
import { getServiceClient, getPublicServerClient } from "@/server/db/client";
import { isDatabaseConfigured } from "@/server/db/status";

/**
 * Base Repository providing typed access to Supabase database clients.
 * The ONLY layer in the entire application allowed to perform database queries.
 */
export abstract class BaseRepository {
  protected get serviceClient() {
    return getServiceClient();
  }

  protected get publicClient() {
    return getPublicServerClient();
  }

  protected get isConfigured(): boolean {
    return isDatabaseConfigured();
  }
}

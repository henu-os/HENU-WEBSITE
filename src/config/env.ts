import { z } from "zod";

/**
 * Public Environment Schema
 * Variables accessible in the browser (must be prefixed with NEXT_PUBLIC_)
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("placeholder-anon-key"),
  NEXT_PUBLIC_CALENDLY_URL: z.string().url().default("https://calendly.com/henuos"),
});

/**
 * Server-Only Environment Schema
 * Strictly inaccessible to the client. Must NEVER use NEXT_PUBLIC_ prefix.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("placeholder-service-role-key"),
  ADMIN_SESSION_SECRET: z.string().min(16).default("placeholder-session-secret-min-32-chars-length"),
  ADMIN_ALLOWED_EMAILS: z.string().default("admin@henu.local"),
  RATE_LIMIT_KV_REST_API_URL: z.string().optional(),
  RATE_LIMIT_KV_REST_API_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  ENQUIRY_NOTIFICATION_EMAIL: z.string().email().optional().default("admin@henu.local"),
  TIMING_TOKEN_SECRET: z.string().default("henu-sovereign-intake-timing-salt-2026"),
  SIMULATE_NOTIFICATION_FAILURE: z.enum(["true", "false"]).default("false"),
});

const isServer = typeof window === "undefined";

function validateEnv() {
  const publicResult = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
  });

  if (!publicResult.success) {
    const errorDetails = publicResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`[CONFIG_ERROR] Invalid public environment configuration: ${errorDetails}`);
  }

  if (!isServer) {
    return {
      public: publicResult.data,
      server: null,
    };
  }

  const serverResult = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    ADMIN_ALLOWED_EMAILS: process.env.ADMIN_ALLOWED_EMAILS,
    RATE_LIMIT_KV_REST_API_URL: process.env.RATE_LIMIT_KV_REST_API_URL,
    RATE_LIMIT_KV_REST_API_TOKEN: process.env.RATE_LIMIT_KV_REST_API_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ENQUIRY_NOTIFICATION_EMAIL: process.env.ENQUIRY_NOTIFICATION_EMAIL,
    TIMING_TOKEN_SECRET: process.env.TIMING_TOKEN_SECRET,
    SIMULATE_NOTIFICATION_FAILURE: process.env.SIMULATE_NOTIFICATION_FAILURE,
  });

  if (!serverResult.success) {
    const errorDetails = serverResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`[CONFIG_ERROR] Invalid server environment configuration: ${errorDetails}`);
  }

  return {
    public: publicResult.data,
    server: serverResult.data,
  };
}

export const env = validateEnv();

export function getServerEnv() {
  if (!isServer) {
    throw new Error("[SECURITY_VIOLATION] Attempted to access server environment variables from the client.");
  }
  if (!env.server) {
    throw new Error("[CONFIG_ERROR] Server environment is not initialized.");
  }
  return env.server;
}

export function getPublicEnv() {
  return env.public;
}

export const getClientEnv = getPublicEnv;

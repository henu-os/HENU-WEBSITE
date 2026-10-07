import "server-only";
import crypto from "node:crypto";
import { getServerEnv } from "@/config/env";

function getTokenSecret(): string {
  try {
    return getServerEnv().TIMING_TOKEN_SECRET;
  } catch {
    return "henu-sovereign-intake-timing-salt-2026";
  }
}
const MIN_SUBMISSION_TIME_MS = 2500; // 2.5 seconds minimum for human completion
const MAX_SUBMISSION_TIME_MS = 2 * 60 * 60 * 1000; // 2 hours maximum window

/**
 * Generates an HMAC-signed timing token embedded in form payloads.
 */
export function generateTimingToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(timestamp)
    .digest("hex")
    .substring(0, 16);

  return `${timestamp}.${signature}`;
}

export interface TimingValidationResult {
  valid: boolean;
  isBotSpeed: boolean;
  elapsedMs: number;
}

/**
 * Validates a timing token against minimum human submission duration and server signature.
 */
export function validateTimingToken(token: string | null | undefined): TimingValidationResult {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, isBotSpeed: true, elapsedMs: 0 };
  }

  const [timestampStr, signature] = token.split(".");
  if (!timestampStr || !signature) {
    return { valid: false, isBotSpeed: true, elapsedMs: 0 };
  }

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, isBotSpeed: true, elapsedMs: 0 };
  }

  // Recreate signature
  const expectedSignature = crypto
    .createHmac("sha256", getTokenSecret())
    .update(timestampStr)
    .digest("hex")
    .substring(0, 16);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return { valid: false, isBotSpeed: true, elapsedMs: 0 };
  }

  const now = Date.now();
  const elapsedMs = now - timestamp;

  // Too fast (< 2.5 seconds)
  if (elapsedMs < MIN_SUBMISSION_TIME_MS) {
    return { valid: true, isBotSpeed: true, elapsedMs };
  }

  // Expired (> 2 hours)
  if (elapsedMs > MAX_SUBMISSION_TIME_MS) {
    return { valid: false, isBotSpeed: false, elapsedMs };
  }

  return { valid: true, isBotSpeed: false, elapsedMs };
}

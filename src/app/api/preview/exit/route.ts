import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Exit Preview Endpoint (CORE-009).
 * Disables draft mode and returns to normal public cache mode.
 */
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get("path") || "/";

  // Prevent open redirect
  const safePath = targetPath.startsWith("/") && !targetPath.startsWith("//") ? targetPath : "/";

  const response = NextResponse.redirect(new URL(safePath, request.url));
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

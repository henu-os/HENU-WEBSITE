import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/server/auth/session";

/**
 * Draft Preview Endpoint (CORE-009, ADMIN-002).
 * Enables draft mode strictly for authenticated administrators.
 * Sets no-store, noindex, and prevents open redirects.
 */
export async function GET(request: NextRequest) {
  // 1. Authorize: strictly require an authenticated admin session
  try {
    await requireAdminSession();
  } catch {
    return new NextResponse("Unauthorized preview request. Admin authentication required.", {
      status: 401,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // 2. Validate redirect destination
  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get("path") || "/";

  // Prevent open redirect: must be relative path starting with single slash
  if (!targetPath.startsWith("/") || targetPath.startsWith("//")) {
    return new NextResponse("Invalid preview destination path.", {
      status: 400,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // 3. Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // 4. Redirect with security headers
  const response = NextResponse.redirect(new URL(targetPath, request.url));
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

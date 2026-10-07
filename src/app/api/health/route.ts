import { NextResponse } from "next/server";

/**
 * Health check route handler for uptime and synthetic monitoring.
 * Outputs minimal status without exposing server internals or environment details.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

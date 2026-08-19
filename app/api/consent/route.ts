import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ANALYTICS_CONSENT_COOKIE, type AnalyticsConsent } from "@/lib/analytics/events";

export async function POST(request: Request) {
  let value: AnalyticsConsent | null = null;
  try {
    const body = (await request.json()) as { analytics?: string };
    if (body.analytics === "granted" || body.analytics === "denied") {
      value = body.analytics;
    }
  } catch {
    value = null;
  }
  if (!value) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const jar = await cookies();
  jar.set(ANALYTICS_CONSENT_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ ok: true });
}

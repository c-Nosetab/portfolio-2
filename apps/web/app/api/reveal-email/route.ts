import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const revealSchema = z.object({
  token: z.string().min(1),
});

/**
 * Turnstile-gated email reveal (CBA-633). The address lives only in the
 * CONTACT_EMAIL env var and is returned exclusively after a server-verified
 * Turnstile pass - never rendered in markup or the RSC payload.
 */
export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!process.env.TURNSTILE_SECRET_KEY || !contactEmail) {
    return NextResponse.json(
      { error: "Email reveal not configured" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = revealSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const verified = await verifyTurnstileToken(parsed.data.token, clientIp(request));
  if (!verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
  }

  return NextResponse.json({ email: contactEmail });
}

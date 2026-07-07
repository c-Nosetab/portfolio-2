import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  projectType: z.enum(["Contract project", "Full-time role", "Something else"]),
  message: z.string().trim().min(1).max(5000),
  token: z.string().min(1),
});

/**
 * Turnstile-verified contact form handler (CBA-633).
 * Fail-closed: no Turnstile secret or no delivery config -> 503, invalid or
 * unverified token -> 403. Message contents are never logged.
 */
export async function POST(request: Request) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Contact form not configured" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }
  const { name, email, projectType, message, token } = parsed.data;

  const verified = await verifyTurnstileToken(token, clientIp(request));
  if (!verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!resendApiKey || !contactEmail) {
    return NextResponse.json(
      { error: "Contact form not configured" },
      { status: 503 },
    );
  }

  // Plain Resend REST call, no SDK. From address is env-driven; set
  // CONTACT_FROM after verifying a sending domain in Resend
  // (e.g. "Chris Bateson <portfolio@send.cbateson.com>").
  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [contactEmail],
      reply_to: email,
      subject: `Portfolio contact: ${projectType} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`,
    }),
  });

  if (!delivery.ok) {
    // Status only - never log message contents.
    console.error(`Contact delivery failed with status ${delivery.status}`);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";

// TODO(CBA-633): verify Turnstile token, then return contact email. Never render contact info in markup.
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

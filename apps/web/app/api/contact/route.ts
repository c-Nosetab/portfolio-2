import { NextResponse } from "next/server";

// TODO(CBA-633): verify Cloudflare Turnstile token (siteverify) then deliver message
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

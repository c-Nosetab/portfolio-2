import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export const runtime = "nodejs";

/**
 * Sanity webhook target (CBA-630): verifies the request signature against
 * SANITY_REVALIDATE_SECRET, then busts every fetch tagged "project".
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "revalidation not configured" },
      { status: 503 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  const valid = await isValidSignature(body, signature, secret);
  if (!valid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  revalidateTag("project");
  return NextResponse.json({ revalidated: true });
}

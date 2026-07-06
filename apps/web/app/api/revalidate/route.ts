import { NextResponse } from "next/server";

// TODO(CBA-630): verify SANITY_REVALIDATE_SECRET, revalidate affected paths
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

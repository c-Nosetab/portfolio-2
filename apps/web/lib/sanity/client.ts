import { createClient, type QueryParams } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-07-01",
  useCdn: false,
  perspective: "published",
});

/**
 * Cached fetch for RSC. Results are tagged "project" so the Sanity webhook
 * (app/api/revalidate) can bust everything with a single revalidateTag call.
 * The hourly revalidate is a safety net in case a webhook is missed.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: "force-cache",
    next: { revalidate: 3600, tags: ["project"] },
  });
}

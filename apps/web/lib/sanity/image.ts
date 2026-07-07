import imageUrlBuilder from "@sanity/image-url";

import { client } from "./client";

const builder = imageUrlBuilder(client);

type ImageSource = Parameters<typeof builder.image>[0];

/** Build a Sanity CDN URL for an image source (hotspot/crop aware). */
export function urlFor(source: ImageSource) {
  return builder.image(source);
}

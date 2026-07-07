import type { PortableTextBlock } from "@portabletext/react";

/** Sanity image field: asset reference plus optional hotspot/crop metadata. */
export interface SanityImage {
  _type?: "image";
  asset?: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  /** Optional alt text authored in the Studio. */
  alt?: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface ProjectLinks {
  live?: string | null;
  source?: string | null;
  writeup?: string | null;
}

export type ProjectType = "client" | "product" | "experiment";

/** Card shape returned by the list queries (CARD_PROJECTION). */
export interface ProjectCard {
  _id: string;
  title: string;
  slug: string;
  type: ProjectType;
  featured?: boolean | null;
  summary?: string | null;
  stack?: string[] | null;
  tags?: string[] | null;
  links?: ProjectLinks | null;
  cover?: SanityImage | null;
  publishedAt?: string | null;
  timeline?: string | null;
}

/** Full case study shape returned by PROJECT_BY_SLUG_QUERY. */
export interface ProjectFull extends ProjectCard {
  role?: string | null;
  outcome?: string | null;
  metrics?: Metric[] | null;
  demo?: string | null;
  body?: PortableTextBlock[] | null;
  client?: string | null;
}

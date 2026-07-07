import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

interface CoverImageProps {
  cover?: SanityImage | null;
  title: string;
  className?: string;
  /** next/image sizes hint; defaults to full viewport width. */
  sizes?: string;
}

/**
 * Typographic fallback treatments (Kinetic Editorial). A project without a
 * cover gets a deliberate editorial object: its title set large on one of
 * four plates, picked deterministically from the title so it never shifts
 * between renders. Every treatment uses theme-flipping tokens so the plate
 * stays visible against the page background in BOTH light and dark schemes
 * (raw `bg-ink` plates disappear on the dark `#16161A` background).
 */
const FALLBACK_TREATMENTS = [
  "bg-foreground text-background",
  "bg-accent text-paper",
  "bg-foreground/5 text-foreground",
  "bg-accent/10 text-accent",
] as const;

function titleHash(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function CoverImage({ cover, title, className, sizes }: CoverImageProps) {
  if (cover?.asset) {
    return (
      <Image
        src={urlFor(cover).width(1200).height(675).fit("crop").url()}
        width={1200}
        height={675}
        sizes={sizes ?? "100vw"}
        alt={`${title} cover image`}
        className={["w-full h-auto rounded-none", className]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  const treatment = FALLBACK_TREATMENTS[titleHash(title) % 4];

  return (
    <div
      className={["aspect-video flex items-end p-8 rounded-none", treatment, className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-3xl md:text-4xl tracking-tighter leading-none text-balance">
        {title}
      </span>
    </div>
  );
}

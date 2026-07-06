import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

/**
 * Server-rendered Portable Text for case study bodies (Kinetic Editorial:
 * sharp corners, paper+ink, cobalt accent, measure-capped prose).
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl tracking-tight mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl tracking-tight mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="leading-relaxed text-foreground/80 max-w-[65ch] my-4">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 text-foreground/70 my-6 max-w-[65ch]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="font-mono text-sm bg-foreground/5 px-1.5 py-0.5">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 my-4 space-y-2 max-w-[65ch]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2 max-w-[65ch]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed text-foreground/80">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed text-foreground/80">{children}</li>
    ),
  },
  types: {
    image: ({ value }) => {
      const image = value as SanityImage;
      if (!image?.asset) return null;
      return (
        <Image
          src={urlFor(image).width(1200).height(675).fit("crop").url()}
          width={1200}
          height={675}
          alt={image.alt ?? ""}
          className="my-8 w-full h-auto rounded-none"
        />
      );
    },
  },
};

export function CustomPortableText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}

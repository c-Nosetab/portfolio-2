import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/client";
import { PRODUCT_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { ProjectCard as ProjectCardData } from "@/lib/sanity/types";
import { stripBannedDashes } from "@/lib/text";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Apps Chris Bateson has shipped and runs. Live, maintained, in real use.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BUTTON_BASE = `inline-flex items-center justify-center whitespace-nowrap bg-foreground font-medium tracking-tight text-background transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.98] ${FOCUS_RING}`;

const TEXT_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

/**
 * Products hub. Deliberately typographic (no cover images - those live on
 * /work): full-width stacked entries on hairlines, asymmetric 5/7 split.
 * Distinct from both the /work card grid and the home products strip.
 */
export default async function ProductsPage() {
  const products = await sanityFetch<ProjectCardData[]>(PRODUCT_PROJECTS_QUERY);

  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
        <h1 className="text-5xl leading-none tracking-tighter md:text-7xl">
          Products
        </h1>
        <p className="mt-6 max-w-[65ch] leading-relaxed text-foreground/70 md:text-lg">
          Apps I&apos;ve shipped and run. Live, maintained, in real use.
        </p>

        {products.length > 0 ? (
          <div className="mt-16 border-t border-foreground/15 md:mt-20">
            {products.map((product, i) => (
              <Reveal
                key={product._id}
                delay={i * 0.06}
                y={16}
                className="border-b border-foreground/15"
              >
                <article className="grid grid-cols-1 gap-6 py-16 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-5">
                    <h2 className="text-3xl tracking-tight">
                      {stripBannedDashes(product.title)}
                    </h2>
                    {product.stack?.[0] && (
                      <p className="mt-3 font-mono text-xs text-foreground/50">
                        {stripBannedDashes(product.stack[0])}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-6 md:col-start-7">
                    {product.summary && (
                      <p className="max-w-[55ch] leading-relaxed text-foreground/70">
                        {stripBannedDashes(product.summary)}
                      </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <p className="mt-3 text-sm text-foreground/50">
                        {product.tags.map(stripBannedDashes).join(", ")}
                      </p>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                      {product.links?.live ? (
                        <a
                          href={product.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${BUTTON_BASE} px-6 py-3 text-sm`}
                        >
                          Try it
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-foreground/50">
                          In development
                        </span>
                      )}
                      {product.links?.source && (
                        <a
                          href={product.links.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${TEXT_LINK} text-sm`}
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-20 max-w-[45ch] border-t border-foreground/15 pt-12">
            <p className="text-3xl tracking-tighter md:text-4xl">
              Nothing here yet.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/70">
              No products are published right now.
            </p>
          </div>
        )}

        <Reveal className="mt-16 md:mt-20">
          <Link href="/work" className={`${TEXT_LINK} text-sm`}>
            See how they&apos;re built
          </Link>
        </Reveal>
      </div>
    </main>
  );
}

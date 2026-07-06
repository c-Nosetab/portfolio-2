import type { Metadata } from "next";
import Link from "next/link";

import { KineticHeadline } from "@/components/kinetic-headline";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/client";
import {
  FEATURED_PROJECTS_QUERY,
  PRODUCT_PROJECTS_QUERY,
} from "@/lib/sanity/queries";
import type { ProjectCard as ProjectCardData } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: { absolute: "Chris Bateson" },
  description:
    "Design, animation, and APIs from one developer. Micro-SaaS products and production frontends, shipped and maintained.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BUTTON_BASE = `inline-flex items-center justify-center whitespace-nowrap bg-foreground font-medium tracking-tight text-background transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.98] ${FOCUS_RING}`;

const TEXT_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

const ACCENT_LINK = `inline-block text-sm font-medium text-accent underline-offset-4 hover:underline ${FOCUS_RING}`;

const CAPABILITIES = [
  {
    title: "Design & UI",
    proof:
      "Deliberate type, spacing, and hierarchy, with this site as the working sample.",
    href: "/work",
    label: "See the work",
  },
  {
    title: "Animation & Interaction",
    proof:
      "Motion that explains the interface, built on transforms and tuned for reduced motion.",
    href: "/lab",
    label: "Visit the lab",
  },
  {
    title: "APIs & Backend",
    proof:
      "Typed Node services and Postgres schemas that keep shipping long after launch.",
    href: "/products",
    label: "See the products",
  },
] as const;

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Node",
  "NestJS",
  "PostgreSQL",
  "Sanity",
  "Tailwind CSS",
  "Motion",
  "Vercel",
] as const;

export default async function Home() {
  const [featured, products] = await Promise.all([
    sanityFetch<ProjectCardData[]>(FEATURED_PROJECTS_QUERY),
    sanityFetch<ProjectCardData[]>(PRODUCT_PROJECTS_QUERY),
  ]);
  const [flagship, ...remaining] = featured;

  return (
    <main>
      {/* 1. Hero: asymmetric editorial, signature kinetic type reveal.
          Copy is DRAFT - flag with Chris before launch. */}
      <section className="flex min-h-[calc(100dvh-4rem)] items-center pb-16 pt-16 md:pt-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <KineticHeadline
            className="max-w-[10ch] font-medium leading-[1.1] tracking-tighter text-[clamp(3rem,10.5vw,8.5rem)]"
            lines={[
              <>
                Fast, <em className="text-accent">polished</em>
              </>,
              "web apps.",
            ]}
          />
          <div className="mt-10 grid grid-cols-1 md:mt-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
              <Reveal delay={0.5} y={16}>
                <p className="max-w-[40ch] leading-relaxed text-foreground/70 md:text-lg">
                  Design, animation, and APIs from one developer. Micro-SaaS
                  products and production frontends, shipped and maintained.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href="/work"
                    className={`${BUTTON_BASE} px-6 py-3 text-sm`}
                  >
                    See the work
                  </Link>
                  <Link href="/contact" className={`${TEXT_LINK} text-sm`}>
                    Work with me
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured work: flagship card full-width, rest in offset 7/5 grid. */}
      {featured.length > 0 && (
        <section className="py-24 md:py-36">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-4xl leading-none tracking-tighter md:text-6xl">
                Selected work
              </h2>
            </Reveal>
            <div className="mt-12 md:mt-20">
              {flagship && (
                <Reveal>
                  <ProjectCard
                    project={flagship}
                    feature
                    sizes="(min-width: 1400px) 1336px, 100vw"
                  />
                </Reveal>
              )}
              {remaining.length > 0 && (
                <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12">
                  {remaining.map((project, i) => (
                    <Reveal
                      key={project._id}
                      delay={i * 0.08}
                      className={
                        i % 2 === 0
                          ? "md:col-span-7"
                          : "md:col-span-5 md:mt-24"
                      }
                    >
                      <ProjectCard
                        project={project}
                        sizes={
                          i % 2 === 0
                            ? "(min-width: 768px) 55vw, 100vw"
                            : "(min-width: 768px) 40vw, 100vw"
                        }
                      />
                    </Reveal>
                  ))}
                </div>
              )}
              <Reveal className="mt-16 md:mt-20">
                <Link href="/work" className={`${TEXT_LINK} text-sm`}>
                  See the work
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* 3. Products strip: hairline rows, scroll-snap on mobile.
          The single eyebrow allowed on this page lives here. */}
      {products.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
                Live products
              </p>
              <h2 className="mt-4 text-4xl leading-none tracking-tighter md:text-6xl">
                Running right now.
              </h2>
            </Reveal>
            <div className="mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:pb-0">
              {products.map((product, i) => (
                <Reveal
                  key={product._id}
                  delay={i * 0.08}
                  className="min-w-[78%] snap-start border-t border-foreground/20 pt-6 sm:min-w-[46%] md:min-w-0"
                >
                  <h3 className="text-xl tracking-tight md:text-2xl">
                    {product.title}
                  </h3>
                  {product.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                      {product.summary}
                    </p>
                  )}
                  {product.links?.live && (
                    <a
                      href={product.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 ${ACCENT_LINK}`}
                    >
                      Try it
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Capabilities: editorial stacked rows, hairline divided. */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl leading-none tracking-tighter md:text-6xl">
              What I do
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-foreground/15 md:mt-16">
            {CAPABILITIES.map((capability, i) => (
              <Reveal key={capability.title} delay={i * 0.06}>
                <div className="grid grid-cols-1 gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-14">
                  <h3 className="text-3xl tracking-tight md:col-span-5 md:text-4xl">
                    {capability.title}
                  </h3>
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="max-w-[55ch] leading-relaxed text-foreground/70">
                      {capability.proof}
                    </p>
                    <Link
                      href={capability.href}
                      className={`mt-4 ${ACCENT_LINK}`}
                    >
                      {capability.label}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Stack: compact mono inline flow. */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <h2 className="text-xl tracking-tight md:col-span-3">
                The stack
              </h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-foreground/60 md:col-span-8 md:col-start-5">
                {STACK.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. CTA band: large type on background, cobalt accent. */}
      <section className="py-32 md:py-40">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-[12ch] text-5xl leading-[1.1] tracking-tighter md:text-7xl">
              Have something to <em className="text-accent">build</em>?
            </h2>
            <div className="mt-10">
              <Link
                href="/contact"
                className={`${BUTTON_BASE} px-8 py-4 text-base`}
              >
                Work with me
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

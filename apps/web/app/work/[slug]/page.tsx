import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CoverImage } from "@/components/cover-image";
import { CustomPortableText } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/client";
import {
  PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import type {
  ProjectCard as ProjectCardData,
  ProjectFull,
} from "@/lib/sanity/types";
import { stripBannedDashes } from "@/lib/text";

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

const CONTAINER = "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const EXTERNAL_LINK = `text-sm font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(PROJECT_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<ProjectFull | null>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
  );
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary ? stripBannedDashes(project.summary) : undefined,
  };
}

export default async function CaseStudy({ params }: CaseStudyProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    sanityFetch<ProjectFull | null>(PROJECT_BY_SLUG_QUERY, { slug }),
    sanityFetch<ProjectCardData[]>(PROJECTS_QUERY),
  ]);

  if (!project) notFound();

  // Prev/next follow the same manual ordering as the index. No wrap-around:
  // a missing side simply hides.
  const index = allProjects.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? allProjects[index - 1] : null;
  const next =
    index >= 0 && index < allProjects.length - 1
      ? allProjects[index + 1]
      : null;

  const metaItems = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.timeline },
    { label: "Client", value: project.client },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value),
  );

  const linkItems = [
    { label: "View live", href: project.links?.live },
    { label: "Source code", href: project.links?.source },
    { label: "Writeup", href: project.links?.writeup },
  ].filter((item): item is { label: string; href: string } =>
    Boolean(item.href),
  );

  const metrics = project.metrics ?? [];
  const hasOutcome = Boolean(project.outcome) || metrics.length > 0;
  const body = project.body ?? [];

  return (
    <main
      className={`min-h-[100dvh]${prev || next ? "" : " pb-24 md:pb-32"}`}
    >
      {/* 1. Case-study hero: static render, no motion (budget goes to the
          outcome block). Meta uses a gap layout, no middot chains. */}
      <header className={`${CONTAINER} pt-24 md:pt-32`}>
        <h1 className="max-w-[16ch] text-4xl leading-[1.05] tracking-tighter md:text-6xl">
          {stripBannedDashes(project.title)}
        </h1>
        {project.summary && (
          <p className="mt-6 max-w-[65ch] leading-relaxed text-foreground/70 md:text-lg">
            {stripBannedDashes(project.summary)}
          </p>
        )}
        {metaItems.length > 0 && (
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt className="text-xs text-foreground/50">{item.label}</dt>
                <dd className="mt-1 font-mono text-sm">
                  {stripBannedDashes(item.value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {linkItems.length > 0 && (
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {linkItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={EXTERNAL_LINK}
              >
                {item.label}
              </a>
            ))}
          </p>
        )}
      </header>

      {/* 2. Outcome + metrics: the one animated moment on this page. */}
      {hasOutcome && (
        <section className={`${CONTAINER} mt-16 md:mt-24`}>
          <Reveal>
            {project.outcome && (
              <p className="max-w-[40ch] text-xl font-medium leading-snug tracking-tight md:text-2xl">
                {stripBannedDashes(project.outcome)}
              </p>
            )}
            {metrics.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-x-12 gap-y-8">
                {metrics.map((metric) => (
                  <li key={metric.label}>
                    <span className="block font-mono text-3xl tracking-tight text-accent md:text-4xl">
                      {stripBannedDashes(metric.value)}
                    </span>
                    <span className="mt-2 block text-sm text-foreground/60">
                      {stripBannedDashes(metric.label)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </section>
      )}

      {/* 3. Cover: only when a real asset exists. The typographic fallback
          plate would duplicate the h1 directly above, so it stays a card-only
          treatment. */}
      {project.cover?.asset && (
        <div className={`${CONTAINER} my-12 md:my-16`}>
          <CoverImage
            cover={project.cover}
            title={project.title}
            sizes="(min-width: 1400px) 1336px, 100vw"
          />
        </div>
      )}

      {/* 4. Body: static measure-capped prose, h2s act as section anchors. */}
      {body.length > 0 && (
        <section className={`${CONTAINER} mt-16 md:mt-24`}>
          <div className="max-w-[65ch]">
            <CustomPortableText value={body} />
          </div>
        </section>
      )}

      {/* 5. Prev/next: same manual order as the index, no wrap-around. */}
      {(prev || next) && (
        <nav
          aria-label="More case studies"
          className="mt-24 border-t border-foreground/15 md:mt-32"
        >
          <div
            className={`${CONTAINER} grid grid-cols-2 gap-4 py-12 sm:gap-8 md:py-16`}
          >
            <div>
              {prev && (
                <Link
                  href={`/work/${prev.slug}`}
                  className={`group inline-block ${FOCUS_RING}`}
                >
                  <span className="font-mono text-xs text-foreground/50">
                    Previous
                  </span>
                  <span className="mt-2 block text-lg tracking-tight transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {stripBannedDashes(prev.title)}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className={`group inline-block ${FOCUS_RING}`}
                >
                  <span className="font-mono text-xs text-foreground/50">
                    Next
                  </span>
                  <span className="mt-2 block text-lg tracking-tight transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {stripBannedDashes(next.title)}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </main>
  );
}

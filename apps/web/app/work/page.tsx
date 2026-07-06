import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/client";
import { PROJECTS_QUERY } from "@/lib/sanity/queries";
import type {
  ProjectCard as ProjectCardData,
  ProjectType,
} from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from client projects, live products, and experiments by Chris Bateson.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const CHIP_BASE = `inline-flex items-center whitespace-nowrap border px-4 py-2 text-sm tracking-tight transition-colors duration-200 active:scale-[0.98] ${FOCUS_RING}`;

const TEXT_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

const FILTERS: ReadonlyArray<{ label: string; value: ProjectType | null }> = [
  { label: "All", value: null },
  { label: "Client", value: "client" },
  { label: "Product", value: "product" },
  { label: "Experiment", value: "experiment" },
];

const EMPTY_COPY: Record<ProjectType, string> = {
  client: "No client case studies are published right now.",
  product: "No product case studies are published right now.",
  experiment: "No experiments are published right now.",
};

function parseType(value: string | string[] | undefined): ProjectType | null {
  return value === "client" || value === "product" || value === "experiment"
    ? value
    : null;
}

// TODO(CBA-635): tag filtering (v2) - add ?tag= chips once the tag set settles.

/**
 * RSC work index. Filtering is plain links + searchParams, no client JS.
 * Reading searchParams makes the route render dynamically, but the Sanity
 * fetch stays in the data cache (tagged "project"), so every filter view is
 * a cheap re-render of cached data; the grid is filtered in-process.
 */
export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type } = await searchParams;
  const activeType = parseType(type);

  const projects = await sanityFetch<ProjectCardData[]>(PROJECTS_QUERY);
  const visible = activeType
    ? projects.filter((project) => project.type === activeType)
    : projects;

  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
        {/* Header: vertical editorial stack, no eyebrow. Static so filter
            clicks repaint instantly; motion budget goes to the grid. */}
        <h1 className="text-5xl leading-none tracking-tighter md:text-7xl">
          Work
        </h1>
        <p className="mt-6 max-w-[65ch] leading-relaxed text-foreground/70 md:text-lg">
          Client projects, live products, and experiments, written up as case
          studies.
        </p>

        <nav
          aria-label="Filter projects by type"
          className="mt-12 flex flex-wrap gap-3"
        >
          {FILTERS.map((filter) => {
            const active = filter.value === activeType;
            return (
              <Link
                key={filter.label}
                href={filter.value ? `/work?type=${filter.value}` : "/work"}
                aria-current={active ? "page" : undefined}
                className={`${CHIP_BASE} ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/25 text-foreground/70 hover:border-foreground/60 hover:text-foreground"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>

        {visible.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-20 md:grid-cols-2">
            {visible.map((project, i) => (
              <Reveal key={project._id} delay={(i % 2) * 0.08} y={16}>
                <ProjectCard
                  project={project}
                  meta
                  titleAs="h2"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-20 max-w-[45ch] border-t border-foreground/15 pt-12">
            <p className="text-3xl tracking-tighter md:text-4xl">
              Nothing here yet.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/70">
              {activeType
                ? EMPTY_COPY[activeType]
                : "No case studies are published right now."}
            </p>
            <p className="mt-8">
              <Link href="/work" className={`${TEXT_LINK} text-sm`}>
                See the work
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

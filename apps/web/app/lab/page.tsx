import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { sanityFetch } from "@/lib/sanity/client";
import { EXPERIMENT_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { ProjectCard as ProjectCardData } from "@/lib/sanity/types";
import { stripBannedDashes } from "@/lib/text";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Experiments, studies, and things Chris Bateson built to learn something. Lower stakes, higher play.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const TEXT_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

/**
 * Lab index. One experiment today, so the page stays short and honest:
 * card-less entry rows plus a designed "More soon" block instead of a fake
 * coming-soon grid.
 */
export default async function LabPage() {
  const experiments = await sanityFetch<ProjectCardData[]>(
    EXPERIMENT_PROJECTS_QUERY,
  );

  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
        <h1 className="text-5xl leading-none tracking-tighter md:text-7xl">
          Lab
        </h1>
        <p className="mt-6 max-w-[65ch] leading-relaxed text-foreground/70 md:text-lg">
          Experiments, studies, and things built to learn something. Lower
          stakes, higher play.
        </p>

        {experiments.length > 0 && (
          <div className="mt-16 border-t border-foreground/15 md:mt-20">
            {experiments.map((experiment, i) => (
              <Reveal
                key={experiment._id}
                delay={i * 0.06}
                y={16}
                className="border-b border-foreground/15"
              >
                <article className="py-14 md:py-16">
                  <h2 className="text-3xl tracking-tight md:text-4xl">
                    {stripBannedDashes(experiment.title)}
                  </h2>
                  {experiment.summary && (
                    <p className="mt-4 max-w-[65ch] leading-relaxed text-foreground/70">
                      {stripBannedDashes(experiment.summary)}
                    </p>
                  )}
                  {experiment.stack && experiment.stack.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-foreground/50">
                      {experiment.stack.map(stripBannedDashes).join(" / ")}
                    </p>
                  )}
                  {(experiment.links?.live || experiment.links?.source) && (
                    <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                      {experiment.links?.live && (
                        <a
                          href={experiment.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${TEXT_LINK} text-sm`}
                        >
                          Try it
                        </a>
                      )}
                      {experiment.links?.source && (
                        <a
                          href={experiment.links.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${TEXT_LINK} text-sm`}
                        >
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {experiments.length === 0 && (
          <div className="mt-16 max-w-[45ch] border-t border-foreground/15 pt-12 md:mt-20">
            <p className="text-3xl tracking-tighter md:text-4xl">
              Nothing here yet.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/70">
              No experiments are published right now.
            </p>
          </div>
        )}

        {/* Honest growth note, offset right so a one-entry page still has an
            intentional composition instead of a fake coming-soon grid. */}
        <div className="mt-20 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-6 md:col-start-7">
            <h2 className="text-4xl leading-[1.1] tracking-tighter md:text-5xl">
              More <em className="text-accent">soon</em>.
            </h2>
            <p className="mt-4 max-w-[45ch] leading-relaxed text-foreground/70">
              The lab grows as experiments ship. Next up lives on GitHub.
            </p>
            <p className="mt-6">
              <a
                href="https://github.com/c-Nosetab"
                target="_blank"
                rel="noopener noreferrer"
                className={`${TEXT_LINK} text-sm`}
              >
                Follow along on GitHub
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

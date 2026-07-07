import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import type {
  ProjectCard as ProjectCardData,
  ProjectType,
} from "@/lib/sanity/types";
import { stripBannedDashes } from "@/lib/text";

const TYPE_LABELS: Record<ProjectType, string> = {
  client: "Client",
  product: "Product",
  experiment: "Experiment",
};

interface ProjectCardProps {
  project: ProjectCardData;
  /** Full-width flagship treatment (first featured card on home). */
  feature?: boolean;
  /** next/image sizes hint, forwarded to CoverImage. */
  sizes?: string;
  /**
   * Work-index variant: swaps the stack list for a mono meta row
   * (type + timeline).
   */
  meta?: boolean;
  /**
   * Heading level for the card title. Use "h2" when cards sit directly
   * under a page h1 (work index) to keep heading order strict.
   */
  titleAs?: "h2" | "h3";
}

/**
 * Server component. Whole card is one link; hover choreography (image scale,
 * title to accent) is pure CSS transitions on transform/color.
 */
export function ProjectCard({
  project,
  feature = false,
  sizes,
  meta = false,
  titleAs: Heading = "h3",
}: ProjectCardProps) {
  const stack = project.stack?.slice(0, 4) ?? [];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="overflow-hidden">
        <CoverImage
          cover={project.cover}
          title={project.title}
          sizes={sizes}
          className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>
      <div className={feature ? "mt-6 md:mt-8" : "mt-5"}>
        <Heading
          className={`tracking-tight transition-colors duration-300 group-hover:text-accent ${
            feature ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          {stripBannedDashes(project.title)}
        </Heading>
        {project.summary && (
          <p
            className={`mt-2 leading-relaxed text-foreground/70 ${
              feature ? "max-w-[55ch] md:text-lg" : "max-w-[45ch]"
            }`}
          >
            {stripBannedDashes(project.summary)}
          </p>
        )}
        {meta ? (
          <p className="mt-4 font-mono text-xs text-foreground/50">
            {TYPE_LABELS[project.type]}
            {project.timeline ? ` · ${stripBannedDashes(project.timeline)}` : null}
          </p>
        ) : (
          stack.length > 0 && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-foreground/50">
              {stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          )
        )}
      </div>
    </Link>
  );
}

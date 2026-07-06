import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import type { ProjectCard as ProjectCardData } from "@/lib/sanity/types";

interface ProjectCardProps {
  project: ProjectCardData;
  /** Full-width flagship treatment (first featured card on home). */
  feature?: boolean;
  /** next/image sizes hint, forwarded to CoverImage. */
  sizes?: string;
}

/**
 * Server component. Whole card is one link; hover choreography (image scale,
 * title to accent) is pure CSS transitions on transform/color.
 */
export function ProjectCard({ project, feature = false, sizes }: ProjectCardProps) {
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
        <h3
          className={`tracking-tight transition-colors duration-300 group-hover:text-accent ${
            feature ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        {project.summary && (
          <p
            className={`mt-2 leading-relaxed text-foreground/70 ${
              feature ? "max-w-[55ch] md:text-lg" : "max-w-[45ch]"
            }`}
          >
            {project.summary}
          </p>
        )}
        {stack.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-foreground/50">
            {stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        )}
      </div>
    </Link>
  );
}

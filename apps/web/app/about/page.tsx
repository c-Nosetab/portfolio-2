import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chris Bateson is a full-stack developer building micro-SaaS products and production frontends. TypeScript end to end, design taken seriously.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BUTTON_BASE = `inline-flex items-center justify-center whitespace-nowrap bg-foreground font-medium tracking-tight text-background transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.98] ${FOCUS_RING}`;

const TEXT_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

/** Echoes the home capabilities as a light inline list (full rows live on /). */
const CAPABILITIES = [
  "Design & UI",
  "Animation & Interaction",
  "APIs & Backend",
] as const;

/**
 * About page. No photo (nothing fake), no email/phone anywhere (hard
 * security constraint) - contact intent routes to /contact.
 */
export default function AboutPage() {
  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
        <h1 className="text-5xl leading-none tracking-tighter md:text-7xl">
          About
        </h1>

        {/* Narrative: offset right on desktop for editorial asymmetry.
            TODO(chris): draft copy - verify all three paragraphs (especially
            the barbershop line) before launch. */}
        <div className="mt-12 grid grid-cols-1 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className="space-y-6 md:col-span-7 md:col-start-5">
            <Reveal y={16}>
              <p className="max-w-[65ch] text-lg leading-relaxed md:text-xl">
                I&apos;m Chris Bateson, a full-stack developer who cares as
                much about how software feels as how it runs. TypeScript end
                to end, design taken seriously, animation with a purpose.
              </p>
            </Reveal>
            <Reveal y={16} delay={0.08}>
              <p className="max-w-[65ch] leading-relaxed text-foreground/70">
                I build micro-SaaS products of my own and production frontends
                for clients. The throughline: fast, polished, maintained.
                I&apos;ve been shipping since 2020, from static sites to full
                platforms.
              </p>
            </Reveal>
            <Reveal y={16} delay={0.16}>
              <p className="max-w-[65ch] leading-relaxed text-foreground/70">
                Away from the editor I sing barbershop harmony, which taught
                me more about iteration and ensemble work than any sprint
                retro.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Capabilities: intentionally lighter than the home stacked rows. */}
        <Reveal className="mt-24 md:mt-32">
          <div className="grid grid-cols-1 gap-6 border-t border-foreground/15 pt-10 md:grid-cols-12 md:pt-12">
            <h2 className="text-xl tracking-tight md:col-span-3">
              What I work on
            </h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-foreground/70 md:col-span-8 md:col-start-5">
              {CAPABILITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Resume + elsewhere. TODO(chris): drop resume.pdf into public/ and
            swap the mono note for a real download link. No dead links until
            then. */}
        <Reveal className="mt-16 md:mt-20">
          <div className="border-t border-foreground/15">
            <div className="grid grid-cols-1 gap-2 py-8 md:grid-cols-12 md:gap-8">
              <h2 className="text-xl tracking-tight md:col-span-3">Resume</h2>
              <p className="font-mono text-xs text-foreground/50 md:col-span-8 md:col-start-5 md:self-center">
                PDF coming soon
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 border-t border-foreground/15 py-8 md:grid-cols-12 md:gap-8">
              <h2 className="text-xl tracking-tight md:col-span-3">
                Elsewhere
              </h2>
              {/* TODO(chris): add LinkedIn here once the real profile URL is
                  in hand - omitted for now so the page ships no dead links. */}
              <p className="md:col-span-8 md:col-start-5 md:self-center">
                <a
                  href="https://github.com/c-Nosetab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${TEXT_LINK} text-sm`}
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Contact intent: single CTA, same label as everywhere else. */}
        <Reveal className="mt-24 md:mt-32">
          <h2 className="max-w-[14ch] text-4xl leading-[1.1] tracking-tighter md:text-6xl">
            Sound like a <em className="text-accent">fit</em>?
          </h2>
          <div className="mt-8">
            <Link href="/contact" className={`${BUTTON_BASE} px-8 py-4 text-base`}>
              Work with me
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

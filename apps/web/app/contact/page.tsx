import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { RevealEmail } from "@/components/reveal-email";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a contract project, talk about a role, or ask a question. Chris Bateson replies within a day.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const EXTERNAL_LINK = `font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${FOCUS_RING}`;

/**
 * Contact page (CBA-633). RSC shell; the form and email reveal are client
 * islands. Contact info is never rendered here - the email only exists
 * behind the Turnstile-verified /api/reveal-email route.
 */
export default function ContactPage() {
  const turnstileConfigured = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );

  return (
    <main className="min-h-[100dvh]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
        {/* Header: vertical editorial stack, both audiences in one line. */}
        <h1 className="text-5xl leading-none tracking-tighter md:text-7xl">
          Contact
        </h1>
        <p className="mt-6 max-w-[65ch] leading-relaxed text-foreground/70 md:text-lg">
          Have a project, a role, or a question? Send it over. I reply within a
          day.
        </p>

        {/* Asymmetric 12-col split: form left, ungated public links right. */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <Reveal y={16}>
              <ContactForm />
            </Reveal>

            {/* Email reveal: hidden entirely until Turnstile keys exist
                (fail-closed - the address is unreachable without them). */}
            {turnstileConfigured && (
              <Reveal y={16} className="mt-16 border-t border-foreground/15 pt-10">
                <section aria-labelledby="prefer-email">
                  <h2
                    id="prefer-email"
                    className="text-2xl tracking-tight md:text-3xl"
                  >
                    Prefer email?
                  </h2>
                  <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-foreground/60">
                    One quick check keeps the scrapers out, then the address is
                    yours.
                  </p>
                  <div className="mt-6">
                    <RevealEmail />
                  </div>
                </section>
              </Reveal>
            )}
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <Reveal y={16} delay={0.1}>
              <h2 className="text-2xl tracking-tight md:text-3xl">Elsewhere</h2>
              <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-foreground/60">
                Public profiles, no gate.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <a
                    href="https://github.com/c-Nosetab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={EXTERNAL_LINK}
                  >
                    GitHub
                  </a>
                </li>
                {/* TODO(chris): add LinkedIn here once the real profile URL
                    is in hand - omitted for now so the page ships no dead
                    links (same approach as /about). */}
              </ul>
            </Reveal>
          </aside>
        </div>
      </div>
    </main>
  );
}

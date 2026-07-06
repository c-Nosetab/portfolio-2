import Link from "next/link";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Editorial minimal footer. Public links only (GitHub; LinkedIn once the
 * real profile URL exists); contact
 * info is never rendered here (hard security constraint - email is gated
 * behind Turnstile on /contact).
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg font-medium tracking-tight">Chris Bateson</p>
            <p className="mt-1 text-sm text-foreground/60">
              Design-minded full-stack developer.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm"
          >
            <a
              href="https://github.com/c-Nosetab"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-foreground/70 transition-colors hover:text-foreground ${FOCUS_RING}`}
            >
              GitHub
            </a>
            {/* TODO(chris): add LinkedIn here once the real profile URL is
                in hand - omitted for now so the site ships no dead links
                (same approach as /about). */}
            <Link
              href="/contact"
              className={`font-medium text-accent underline-offset-4 hover:underline ${FOCUS_RING}`}
            >
              Work with me
            </Link>
          </nav>
        </div>
        <p className="mt-12 font-mono text-xs text-foreground/40">
          © 2026 Chris Bateson
        </p>
      </div>
    </footer>
  );
}

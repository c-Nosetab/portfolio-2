"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/products", label: "Products" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
] as const;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const menuList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const menuItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Sticky site nav. The backdrop (blur + hairline) fades in over the first
 * ~96px of scroll via a motion value, so no scroll listeners and no re-renders.
 * Mobile: hamburger opens a full-screen editorial menu (staggered reveal,
 * Escape closes, focus trapped, body scroll locked). The overlay sits BELOW
 * the header (z-30 < z-40) so the wordmark and the X toggle stay usable.
 */
export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  const backdropOpacity = useTransform(scrollY, [0, 96], [0, 1]);

  // Close the mobile menu on route change (state adjustment during render,
  // per react.dev "You Might Not Need an Effect").
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Escape to close, Tab focus trap, body scroll lock while open.
  useEffect(() => {
    if (!open) return;

    const focusables = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
    ).filter((el) => el.getClientRects().length > 0);

    focusables.find((el) => el.dataset.menuLink === "true")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div ref={rootRef}>
      <header className="sticky top-0 z-40 h-16">
        <motion.div
          aria-hidden
          className="absolute inset-0 border-b border-foreground/10 bg-background/90 backdrop-blur-md"
          style={{ opacity: reduce ? 1 : backdropOpacity }}
        />
        <nav
          aria-label="Main"
          className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            href="/"
            className={`text-base font-medium tracking-tight ${FOCUS_RING}`}
          >
            Chris Bateson
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors hover:text-foreground ${FOCUS_RING} ${
                  isActive(link.href) ? "text-accent" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`text-sm font-medium text-accent underline-offset-4 hover:underline ${FOCUS_RING}`}
            >
              Work with me
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`relative flex h-11 w-11 items-center justify-center md:hidden ${FOCUS_RING}`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={`absolute h-px w-6 bg-foreground transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-6 bg-foreground transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 bg-background md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.2 } }}
            transition={{ duration: 0.25 }}
          >
            <motion.ul
              className="flex h-full flex-col justify-center gap-2 px-6 pt-16"
              variants={reduce ? undefined : menuList}
              initial={reduce ? undefined : "hidden"}
              animate={reduce ? undefined : "show"}
            >
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={reduce ? undefined : menuItem}>
                  <Link
                    href={link.href}
                    data-menu-link="true"
                    className={`block py-2 text-5xl tracking-tighter ${FOCUS_RING} ${
                      isActive(link.href) ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={reduce ? undefined : menuItem}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  data-menu-link="true"
                  className={`inline-block text-2xl tracking-tight text-accent ${FOCUS_RING}`}
                >
                  Work with me
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

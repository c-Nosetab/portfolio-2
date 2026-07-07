"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface KineticHeadlineProps {
  /** One entry per visual line. Each line reveals with a staggered clip-up. */
  lines: ReactNode[];
  className?: string;
}

/**
 * Signature hero moment (Kinetic Editorial): headline lines stagger up out of
 * an overflow clip on load. Runs once, ~0.8s total, ease [0.16,1,0.3,1].
 * Reduced motion collapses to a static render.
 *
 * Each clip wrapper reserves 0.12em of bottom padding (compensated with a
 * negative margin) so italic descenders are never cut by the overflow-hidden.
 */
export function KineticHeadline({ lines, className }: KineticHeadlineProps) {
  const reduce = useReducedMotion();

  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden">
          <motion.span
            className="block pb-[0.12em]"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.8,
              delay: 0.12 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

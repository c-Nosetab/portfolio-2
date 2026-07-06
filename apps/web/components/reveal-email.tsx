"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BUTTON = `inline-flex items-center justify-center whitespace-nowrap border border-foreground/25 px-6 py-3 text-sm font-medium tracking-tight text-foreground transition-colors duration-200 hover:border-foreground/60 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`;

type Status = "idle" | "verifying" | "revealed" | "error";

/**
 * Turnstile-gated email reveal (CBA-633). The address only ever exists
 * client-side, after an interaction-only Turnstile pass verified by
 * /api/reveal-email - it never appears in markup or the RSC payload.
 * Renders nothing at all when the site key is unset (fail-closed).
 */
export function RevealEmail() {
  if (!SITE_KEY) return null;
  return <RevealEmailInner siteKey={SITE_KEY} />;
}

function RevealEmailInner({ siteKey }: { siteKey: string }) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleReveal() {
    setStatus("verifying");
    // Tokens are single-use; reset before re-executing after a failure.
    turnstileRef.current?.reset();
    turnstileRef.current?.execute();
  }

  async function handleToken(token: string) {
    try {
      const response = await fetch("/api/reveal-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      const body = (await response.json()) as { email?: string };
      if (!body.email) {
        setStatus("error");
        return;
      }
      setEmail(body.email);
      setStatus("revealed");
    } catch {
      setStatus("error");
    }
  }

  async function handleCopy() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the mailto link still works, do nothing.
    }
  }

  if (status === "revealed" && email) {
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={`mailto:${email}`}
          className={`text-lg font-medium tracking-tight text-accent underline-offset-4 hover:underline ${FOCUS_RING}`}
        >
          {email}
        </a>
        <button type="button" onClick={handleCopy} className={BUTTON}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{ execution: "execute", appearance: "interaction-only" }}
        onSuccess={handleToken}
        onError={() => setStatus("error")}
      />
      <button
        type="button"
        onClick={handleReveal}
        disabled={status === "verifying"}
        className={BUTTON}
      >
        {status === "verifying" ? "Verifying" : "Reveal email"}
      </button>
      {status === "error" && (
        <p
          role="alert"
          className="mt-4 max-w-[45ch] text-sm leading-relaxed text-foreground/70"
        >
          Verification did not go through. Try again, or use the form above.
        </p>
      )}
    </div>
  );
}

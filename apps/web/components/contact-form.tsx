"use client";

import { useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const FIELD = `w-full border border-foreground/20 bg-transparent px-4 py-3 text-base leading-relaxed text-foreground transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`;

const LABEL = "text-sm font-medium tracking-tight text-foreground";

const BUTTON = `inline-flex items-center justify-center whitespace-nowrap bg-foreground px-6 py-3 text-sm font-medium tracking-tight text-background transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40 ${FOCUS_RING}`;

const PROJECT_TYPES = [
  "Contract project",
  "Full-time role",
  "Something else",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Contact form client island (CBA-633). Uncontrolled fields so values
 * survive an error state untouched; the server is the validation authority.
 * Without a Turnstile site key the form renders disabled with an honest
 * note - no fake success paths.
 */
export function ContactForm() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    if (!token) {
      setStatus("error");
      setErrorMessage(
        "Verification has not finished yet. Give it a second, then try again.",
      );
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          projectType: data.get("projectType"),
          message: data.get("message"),
          token,
        }),
      });

      if (response.ok) {
        setStatus("success");
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setStatus("error");
      setErrorMessage(
        body?.error ?? "Something went wrong. Your message was not sent.",
      );
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Your message was not sent.");
    } finally {
      // Turnstile tokens are single-use: get a fresh one for any retry.
      setToken(null);
      turnstileRef.current?.reset();
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border-t-2 border-accent pt-8">
        <p className="text-3xl tracking-tighter md:text-4xl">Message sent.</p>
        <p className="mt-4 max-w-[45ch] leading-relaxed text-foreground/70">
          Thanks for reaching out. I read everything myself and will reply
          within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <fieldset
        disabled={!SITE_KEY || status === "submitting"}
        className="grid grid-cols-1 gap-8"
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className={LABEL}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={200}
              autoComplete="name"
              className={FIELD}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className={LABEL}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={320}
              autoComplete="email"
              className={FIELD}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-project-type" className={LABEL}>
            Project type
          </label>
          <select
            id="contact-project-type"
            name="projectType"
            required
            defaultValue={PROJECT_TYPES[0]}
            className={`${FIELD} appearance-none`}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <p className="text-sm leading-relaxed text-foreground/50">
            Helps me route the reply, nothing more.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={LABEL}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            maxLength={5000}
            className={`${FIELD} resize-y`}
          />
        </div>

        {SITE_KEY && (
          <Turnstile
            ref={turnstileRef}
            siteKey={SITE_KEY}
            options={{ theme: "auto" }}
            onSuccess={setToken}
            onExpire={() => setToken(null)}
            onError={() => setToken(null)}
          />
        )}

        {status === "error" && errorMessage && (
          <p
            id="contact-form-error"
            role="alert"
            className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-foreground"
          >
            {errorMessage}
          </p>
        )}

        <div>
          <button
            type="submit"
            aria-describedby={
              status === "error" && errorMessage
                ? "contact-form-error"
                : undefined
            }
            className={BUTTON}
          >
            {status === "submitting" ? "Sending" : "Send message"}
          </button>
        </div>
      </fieldset>

      {!SITE_KEY && (
        <p className="mt-4 max-w-[45ch] text-sm leading-relaxed text-foreground/60">
          Form activation pending. Meanwhile, find me on{" "}
          <a
            href="https://github.com/c-Nosetab"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium text-accent underline-offset-4 hover:underline ${FOCUS_RING}`}
          >
            GitHub
          </a>
          .
        </p>
      )}
    </form>
  );
}

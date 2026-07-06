import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Chris Bateson" } };

export default function Home() {
  return (
    <main className="min-h-[100dvh] px-6 py-24">
      <h1 className="text-4xl tracking-tight">Home</h1>
      <p className="mt-4 max-w-[65ch] text-foreground/70">
        This is a placeholder for the home page.
      </p>
    </main>
  );
}

export const metadata = {
  title: "Case Study",
};

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-[100dvh] px-6 py-24">
      <h1 className="text-4xl tracking-tight">{slug}</h1>
      <p className="mt-4 max-w-[65ch] text-foreground/70">
        This is a placeholder for a case study page.
      </p>
    </main>
  );
}

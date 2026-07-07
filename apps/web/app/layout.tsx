import type { Metadata } from "next";
import { switzer, jetbrainsMono } from "./fonts";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chrisbateson.dev"),
  title: {
    default: "Chris Bateson",
    template: "%s · Chris Bateson",
  },
  description:
    "Design-minded full-stack developer. Fast, polished web apps from micro-SaaS to production frontends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${switzer.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <SiteNav />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}

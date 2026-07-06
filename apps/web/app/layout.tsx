import type { Metadata } from "next";
import { switzer, jetbrainsMono } from "./fonts";
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
        {children}
      </body>
    </html>
  );
}

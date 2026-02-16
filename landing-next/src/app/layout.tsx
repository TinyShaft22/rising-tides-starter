import type { Metadata } from "next";
import { Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rising Tides Skills Pack — 187 Skills for Claude Code",
  description: "187 curated skills, 38 plugins, 18 MCPs for Claude Code. One install. ~7% context cost. Ship faster with the most comprehensive Claude Code enhancement pack.",
  keywords: ["Claude Code", "AI coding", "skills pack", "MCP plugins", "developer tools"],
  authors: [{ name: "Rising Tides" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Rising Tides Skills Pack — 187 Skills for Claude Code",
    description: "187 curated skills, 38 plugins, 18 MCPs. One install. Ship faster.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rising Tides Skills Pack",
    description: "187 curated skills for Claude Code. One install. Ship faster.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceMono.variable} ${dmSans.variable} antialiased min-h-screen`}>
        <div className="sun-rays" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

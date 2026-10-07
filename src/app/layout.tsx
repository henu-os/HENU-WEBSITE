import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const fontText = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | HENU",
    default: "HENU — Technology, Operating System & AI Ecosystem",
  },
  description:
    "Official HENU Ecosystem — Architecting developer-centric computing, intelligent systems, and systems-grade software engineering.",
  metadataBase: new URL("https://henu.org"),
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcf9f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/*
          Theme initialization script:
          Default is strictly LIGHT THEME (Document 04 §3, master instruction §6).
          Only applies 'dark' if the user explicitly stored a 'dark' preference in localStorage.
        */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('henu-theme');
                if (stored === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            `,
          }}
        />
      </head>
      <body className={`${fontDisplay.variable} ${fontText.variable} ${fontMono.variable} min-h-screen bg-surface text-on-surface antialiased selection:bg-secondary/20 selection:text-secondary`}>
        {/* Accessible Skip Link (Document 04 §9.4, AB Baseline) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-on focus:rounded-md focus:shadow-elevated"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

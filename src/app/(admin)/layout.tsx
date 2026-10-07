import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/layout/admin-nav";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "HENU Admin Control Plane",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-secondary text-ink-primary font-sans antialiased">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border-default bg-surface-primary/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-lg tracking-tight text-ink-primary">
              HENU<span className="text-accent-spectral">.</span>
            </span>
            <span className="font-mono text-xs uppercase text-ink-muted group-hover:text-ink-primary transition-colors">
              ADMIN
            </span>
          </Link>
          <Badge variant="error" size="sm" className="font-mono text-[10px]">
            RESTRICTED
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/"
            className="text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Public Site</span>
            <span aria-hidden="true">&nearr;</span>
          </Link>
          <span className="text-border-default">|</span>
          <span className="text-ink-muted">AAL2 Verified</span>
        </div>
      </header>

      {/* Admin Two-Column Shell */}
      <div className="flex-1 flex flex-col md:flex-row">
        <AdminNav />
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

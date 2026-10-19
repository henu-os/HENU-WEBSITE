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
    <div className="flex min-h-screen flex-col bg-slate-50/70 text-ink-primary font-sans antialiased">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-lg tracking-tight text-slate-900 flex items-center">
              HENU<span className="text-emerald-500 font-black animate-pulse">.</span>
            </span>
            <span className="font-mono text-xs uppercase text-slate-500 group-hover:text-emerald-600 transition-colors font-semibold tracking-wider">
              ADMIN
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            HENU OS CLM v4.2
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
            RESTRICTED
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-sans font-semibold">Real-time Sync Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 text-[11px]">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-sans text-slate-700 font-medium">AAL2 Verified</span>
          </div>

          <span className="hidden sm:inline text-slate-200">|</span>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 transition-all shadow-2xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Public Site</span>
            <span aria-hidden="true" className="font-mono text-sm leading-none">↗</span>
          </Link>
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

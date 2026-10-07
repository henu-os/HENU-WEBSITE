import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas-base text-ink-primary font-sans antialiased">
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import { homeContentRepository } from "@/server/repositories/home-content.repository";
import { productRepository } from "@/server/repositories/product.repository";
import { portfolioRepository } from "@/server/repositories/portfolio.repository";
import { HomeEditorClient } from "./home-editor-client";

export default async function AdminHomePage() {
  const [homeContent, publishedProducts, publishedProjects] = await Promise.all([
    homeContentRepository.getHomeContent(),
    productRepository.listPublishedProducts(),
    portfolioRepository.listPublishedProjects(),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-border-default pb-4">
        <h1 className="font-display text-2xl font-bold text-ink-primary">
          Home Dynamic Slots & Featured Content
        </h1>
        <p className="mt-1 font-sans text-sm text-ink-secondary">
          Configure public home opening statements, flagship OS messaging, and select featured published products and projects.
        </p>
      </div>

      <HomeEditorClient
        initialContent={homeContent}
        availableProducts={publishedProducts}
        availableProjects={publishedProjects}
      />
    </div>
  );
}

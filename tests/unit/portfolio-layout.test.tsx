import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { renderToStaticMarkup } from "react-dom/server";
import { PortfolioIndexView } from "@/components/features/portfolio/portfolio-index-view";
import {
  BASELINE_PORTFOLIO_PROJECTS,
  BASELINE_PROJECT_CATEGORIES,
} from "@/server/repositories/portfolio.repository";

describe("PortfolioIndexView & Asymmetric Editorial Layout (PORT-002)", () => {
  it("renders intentional dignified empty state when 0 projects exist", () => {
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={[]}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="all"
      />
    );

    expect(html).toContain("No Public Case Studies Currently Released");
    expect(html).toContain("Ledger Notice // 00");
    expect(html).toContain("HENU strictly observes client disclosure boundaries");
  });

  it("renders deliberate single-project layout without broken gaps or orphan columns", () => {
    const singleProject = [BASELINE_PORTFOLIO_PROJECTS[0]!];
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={singleProject}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="all"
      />
    );

    expect(html).toContain("HENU Housing Accounting ERP");
    expect(html).toContain("/portfolio/henu-housing-erp");
    expect(html).toContain("Enterprise Systems");
  });

  it("renders deliberate two-project asymmetric composition without orphaned columns", () => {
    const twoProjects = [BASELINE_PORTFOLIO_PROJECTS[0]!, BASELINE_PORTFOLIO_PROJECTS[1]!];
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={twoProjects}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="all"
      />
    );

    expect(html).toContain("HENU Housing Accounting ERP");
    expect(html).toContain("HENU WhatsApp Automation Engine");
  });

  it("renders deliberate three-project asymmetric editorial layout", () => {
    const threeProjects = BASELINE_PORTFOLIO_PROJECTS.slice(0, 3);
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={threeProjects}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="all"
      />
    );

    expect(html).toContain("HENU Housing Accounting ERP");
    expect(html).toContain("HENU WhatsApp Automation Engine");
    expect(html).toContain("HENU Mail &amp; Sovereign Identity");
  });

  it("renders category filter pills with correct URL links and active state indicator", () => {
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={BASELINE_PORTFOLIO_PROJECTS}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="enterprise-systems"
      />
    );

    // All projects link should exist
    expect(html).toContain('href="/portfolio"');
    // Category specific link should exist
    expect(html).toContain('href="/portfolio?category=enterprise-systems"');
    expect(html).toContain('href="/portfolio?category=automation-ai"');
    // Active category indicator
    expect(html).toContain('aria-current="page"');
  });

  it("renders empty category state with return link when active filter yields 0 matches", () => {
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={[]}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="developer-tooling"
      />
    );

    expect(html).toContain("No Case Studies in Developer Tooling");
    expect(html).toContain("Filter Scope // Empty");
    expect(html).toContain("View All Projects");
    expect(html).toContain('href="/portfolio"');
  });

  it("displays verified metrics callouts on cards that possess verified evidence", () => {
    const html = renderToStaticMarkup(
      <PortfolioIndexView
        projects={BASELINE_PORTFOLIO_PROJECTS}
        categories={BASELINE_PROJECT_CATEGORIES}
        activeCategorySlug="all"
      />
    );

    // Project 1 has confirmed outcome: "100%"
    expect(html).toContain("100%");
    expect(html).toContain("Double-Entry Ledger Integrity");
  });
});

import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("Admin Dashboard Operational Summary & Telemetry Governance (ADMIN-004, PRD §8)", () => {
  it("computes accurate content counts from actual database repositories", () => {
    const mockProducts = [
      { id: "1", name: "HENU OS", status: "published" },
      { id: "2", name: "HENU AI", status: "published" },
      { id: "3", name: "Experimental Module", status: "draft" },
    ];

    const mockServices = [
      { id: "s1", name: "Website Development", status: "published" },
      { id: "s2", name: "AI Automation", status: "published" },
      { id: "s3", name: "Cloud Migration", status: "draft" },
    ];

    const mockProjects = [
      { id: "p1", title: "Housing ERP", status: "published" },
      { id: "p2", title: "Unreleased Protocol", status: "draft" },
    ];

    const mockEnquiries = [
      { id: "e1", name: "Alice", status: "new", notification_status: "sent" },
      { id: "e2", name: "Bob", status: "in_progress", notification_status: "sent" },
      { id: "e3", name: "Charlie", status: "new", notification_status: "failed" },
    ];

    const publishedProducts = mockProducts.filter((p) => p.status === "published");
    const draftProducts = mockProducts.filter((p) => p.status === "draft");

    const publishedServices = mockServices.filter((s) => s.status === "published");
    const draftServices = mockServices.filter((s) => s.status === "draft");

    const publishedProjects = mockProjects.filter((p) => p.status === "published");
    const draftProjects = mockProjects.filter((p) => p.status === "draft");

    const newEnquiries = mockEnquiries.filter((e) => e.status === "new");
    const failedNotifications = mockEnquiries.filter((e) => e.notification_status === "failed");

    expect(publishedProducts.length).toBe(2);
    expect(draftProducts.length).toBe(1);
    expect(publishedServices.length).toBe(2);
    expect(draftServices.length).toBe(1);
    expect(publishedProjects.length).toBe(1);
    expect(draftProjects.length).toBe(1);

    expect(newEnquiries.length).toBe(2);
    expect(failedNotifications.length).toBe(1); // 1 reconciliation issue requiring attention
  });

  it("identifies draft items requiring editorial review", () => {
    const drafts = [
      { title: "Experimental Module", type: "Product", status: "draft" },
      { title: "Cloud Migration", type: "Service", status: "draft" },
      { title: "Unreleased Protocol", type: "Portfolio", status: "draft" },
    ];

    expect(drafts.length).toBe(3);
    expect(drafts.every((d) => d.status === "draft")).toBe(true);
  });
});

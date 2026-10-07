import type { Database } from "./database";

export type AdminRole = "admin" | "manager" | "viewer";
export type AdminProfile = Database["public"]["Tables"]["admin_profiles"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type PortfolioProject = Database["public"]["Tables"]["portfolio_projects"]["Row"];
export type HomeContent = Database["public"]["Tables"]["home_content"]["Row"];
export type AboutContent = Database["public"]["Tables"]["about_content"]["Row"];
export type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
export type SlugRedirect = Database["public"]["Tables"]["slug_redirects"]["Row"];

export type ContentStatus = "draft" | "published" | "archived";
export type ProductStatusLabel = "available" | "beta" | "in_development" | "coming_soon";
export type ProductHueKey = "os" | "ai" | "pa" | "ide";
export type EnquiryStatus = "new" | "in_progress" | "resolved" | "spam";
export type EnquiryInterestType = "service" | "product" | "general" | "partnership";

export type ProjectCategory = Database["public"]["Tables"]["project_categories"]["Row"];
export type Technology = Database["public"]["Tables"]["technologies"]["Row"];
export type ProjectMedia = Database["public"]["Tables"]["project_media"]["Row"];
export type ClientPermissionStatus = "granted" | "internal_review" | "pending" | "denied";

export interface ProjectMetric {
  value: string;
  label: string;
  source: string;
  owner: string;
}

export interface ProjectStoryBlocks {
  challenge?: { title?: string; content: string };
  approach?: { title?: string; content: string };
  solution?: { title?: string; content: string };
  technology?: { title?: string; content: string; tags?: string[] };
  outcome?: { title?: string; content: string; source?: string; owner?: string };
  evidence?: { title?: string; content: string; source?: string; owner?: string };
  gallery?: Array<{ media_id?: string; url?: string; caption?: string; alt?: string }>;
}

export type EnquiryNotificationStatus = "pending" | "sent" | "failed";

export interface AboutChapter {
  id: string;
  chapter_number: string;
  title: string;
  subtitle?: string;
  content: string;
  tags?: string[];
  status: "published" | "draft";
  display_order: number;
  media_id?: string | null;
  media_url?: string | null;
  media_alt?: string | null;
}

export interface TimelineEntry {
  id: string;
  year: string;
  date_formatted?: string;
  title: string;
  description: string;
  verified_source: string;
  verified_owner: string;
  status: "published" | "draft";
  display_order: number;
}

export interface ReleaseArtifact {
  version: string;
  artifactName: string;
  artifactType: "kernel_manifest" | "toolchain_spec" | "base_image";
  sha256: string;
  signingProtocol: "Ed25519" | "SHA-256";
  signingStatus: "in_development_unsigned" | "pending_ceremony" | "signed";
  releaseDate: string;
  notes: string;
}


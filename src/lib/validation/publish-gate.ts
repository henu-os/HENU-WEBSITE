import { z } from "zod";
import type { ContentBlock } from "@/types/blocks";
import { scanTextForPricing } from "./service-price-gate";

export interface PublishGateIssue {
  code: string;
  field?: string;
  message: string;
  severity: "error" | "warning";
}

export interface PublishGateResult {
  allowed: boolean;
  issues: PublishGateIssue[];
}

export interface PublishableEntity {
  id?: string;
  title: string;
  slug?: string;
  domain?: "home" | "services" | "products" | "portfolio" | "about";
  blocks?: ContentBlock[];
  metaDescription?: string;
  disclaimerRequired?: boolean;
  clientPermissionStatus?: string;
  client_permission_status?: string;
  metrics?: Array<{ value?: string; label?: string; source?: string; owner?: string }>;
  storyBlocks?: Record<string, any> | null;
  story_blocks?: Record<string, any> | null;
}

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "preview",
  "login",
  "sign-in",
  "settings",
  "dashboard",
  "health",
  "sitemap",
  "robots",
  "home",
  "services",
  "products",
  "portfolio",
  "about-us",
  "about",
  "contact-us",
  "contact",
]);

const PROHIBITED_PLACEHOLDERS = [
  "[TBD]",
  "[CONFIRM]",
  "[PLACEHOLDER]",
  "[REQUIRES CONFIRMATION]",
  "TODO",
  "FIXME",
  "Lorem ipsum",
  "dolor sit amet",
  "reduced processing time by 70%",
  "generated 10,000 leads",
  "client revenue increased 4x",
  "revenue increased 4x",
];

const PROHIBITED_SERVICE_PRICE_TERMS = [
  "$",
  "€",
  "£",
  "pricing",
  "cost",
  "per month",
  "/mo",
  "per hour",
  "/hr",
  "tier",
  "pricing plan",
  "monthly fee",
];

/**
 * Validates a slug against format rules and reserved words.
 */
export function validateSlug(slug: string, isFlagshipHENUOS = false): PublishGateIssue[] {
  const issues: PublishGateIssue[] = [];
  const normalized = slug.trim().toLowerCase();

  if (!normalized) {
    issues.push({
      code: "EMPTY_SLUG",
      field: "slug",
      message: "Slug cannot be empty.",
      severity: "error",
    });
    return issues;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    issues.push({
      code: "INVALID_SLUG_FORMAT",
      field: "slug",
      message: "Slug must be lowercase alphanumeric with single hyphens between words.",
      severity: "error",
    });
  }

  if (RESERVED_SLUGS.has(normalized)) {
    issues.push({
      code: "RESERVED_SLUG",
      field: "slug",
      message: `The slug "${normalized}" is a reserved system path and cannot be used.`,
      severity: "error",
    });
  }

  // henu-os is reserved strictly for HENU OS flagship product
  if (normalized === "henu-os" && !isFlagshipHENUOS) {
    issues.push({
      code: "RESERVED_HENU_OS_SLUG",
      field: "slug",
      message: `The slug "henu-os" is reserved exclusively for the HENU OS flagship product.`,
      severity: "error",
    });
  }

  return issues;
}

/**
 * Recursively scans text for prohibited unconfirmed placeholders.
 */
function checkTextForPlaceholders(text: string, path: string): PublishGateIssue[] {
  const issues: PublishGateIssue[] = [];
  for (const placeholder of PROHIBITED_PLACEHOLDERS) {
    if (text.toLowerCase().includes(placeholder.toLowerCase())) {
      issues.push({
        code: "UNCONFIRMED_PLACEHOLDER",
        field: path,
        message: `Content contains unconfirmed placeholder or draft text: "${placeholder}".`,
        severity: "error",
      });
    }
  }
  return issues;
}

/**
 * Checks for prohibited pricing references in Services domain content.
 */
function checkServicesPricing(text: string, path: string): PublishGateIssue[] {
  const issues: PublishGateIssue[] = [];
  const scan = scanTextForPricing(text, path);
  if (scan.hasPrice && scan.message) {
    issues.push({
      code: "SERVICE_PRICING_PROHIBITED",
      field: path,
      message: scan.message,
      severity: "error",
    });
  }
  return issues;
}

/**
 * Evaluates whether an entity meets all Publish Gate criteria (CORE-008, Document 05 §10.1).
 */
export function evaluatePublishGate(entity: PublishableEntity): PublishGateResult {
  const issues: PublishGateIssue[] = [];

  // 1. Mandatory Title
  if (!entity.title || entity.title.trim().length === 0) {
    issues.push({
      code: "MISSING_TITLE",
      field: "title",
      message: "A title is required to publish.",
      severity: "error",
    });
  } else {
    issues.push(...checkTextForPlaceholders(entity.title, "title"));
  }

  // 2. Slug validation if provided
  if (entity.slug !== undefined) {
    issues.push(...validateSlug(entity.slug));
  }

  // 3. Meta description for SEO (SEO-001)
  if (entity.metaDescription) {
    issues.push(...checkTextForPlaceholders(entity.metaDescription, "metaDescription"));
  }

  // 4. Content Blocks Inspection
  if (entity.blocks && entity.blocks.length > 0) {
    let hasDisclaimer = false;

    entity.blocks.forEach((block, index) => {
      const blockPath = `blocks[${index}] (${block.type})`;

      switch (block.type) {
        case "heading": {
          issues.push(...checkTextForPlaceholders(block.text, `${blockPath}.text`));
          if (entity.domain === "services") {
            issues.push(...checkServicesPricing(block.text, `${blockPath}.text`));
          }
          break;
        }

        case "paragraph": {
          issues.push(...checkTextForPlaceholders(block.content, `${blockPath}.content`));
          if (entity.domain === "services") {
            issues.push(...checkServicesPricing(block.content, `${blockPath}.content`));
          }
          break;
        }

        case "image": {
          // Rule: informative images MUST have alt text
          if (!block.isDecorative && (!block.alt || block.alt.trim().length === 0)) {
            issues.push({
              code: "MISSING_ALT_TEXT",
              field: `${blockPath}.alt`,
              message: "Informative images must have descriptive alt text before publishing.",
              severity: "error",
            });
          }
          if (block.caption) {
            issues.push(...checkTextForPlaceholders(block.caption, `${blockPath}.caption`));
          }
          break;
        }

        case "quote": {
          issues.push(...checkTextForPlaceholders(block.quote, `${blockPath}.quote`));
          issues.push(...checkTextForPlaceholders(block.author, `${blockPath}.author`));
          break;
        }

        case "key_facts": {
          block.facts.forEach((fact, fIdx) => {
            const factPath = `${blockPath}.facts[${fIdx}]`;
            issues.push(...checkTextForPlaceholders(fact.fact, `${factPath}.fact`));
            issues.push(...checkTextForPlaceholders(fact.label, `${factPath}.label`));

            // Metric must have non-empty source and owner
            if (!fact.source || fact.source.trim().length === 0) {
              issues.push({
                code: "UNSOURCED_METRIC",
                field: `${factPath}.source`,
                message: "Every published metric must cite a verifiable source.",
                severity: "error",
              });
            }
            if (!fact.owner || fact.owner.trim().length === 0) {
              issues.push({
                code: "MISSING_METRIC_OWNER",
                field: `${factPath}.owner`,
                message: "Every published metric must have an assigned internal owner.",
                severity: "error",
              });
            }
          });
          break;
        }

        case "capabilities": {
          block.items.forEach((item, cIdx) => {
            const itemPath = `${blockPath}.items[${cIdx}]`;
            issues.push(...checkTextForPlaceholders(item.title, `${itemPath}.title`));
            issues.push(...checkTextForPlaceholders(item.description, `${itemPath}.description`));
          });
          break;
        }

        case "process_steps": {
          block.steps.forEach((step, sIdx) => {
            const stepPath = `${blockPath}.steps[${sIdx}]`;
            issues.push(...checkTextForPlaceholders(step.title, `${stepPath}.title`));
            issues.push(...checkTextForPlaceholders(step.description, `${stepPath}.description`));
          });
          break;
        }

        case "cta": {
          issues.push(...checkTextForPlaceholders(block.title, `${blockPath}.title`));
          if (block.description) {
            issues.push(...checkTextForPlaceholders(block.description, `${blockPath}.description`));
          }

          // CTA Target validation
          const target = block.buttonTarget.trim();
          if (
            target === "" ||
            target === "#" ||
            (!target.startsWith("/") && !target.startsWith("https://") && !target.startsWith("mailto:"))
          ) {
            issues.push({
              code: "INVALID_CTA_TARGET",
              field: `${blockPath}.buttonTarget`,
              message: `CTA button target "${target}" is invalid. Must be an internal path, https:// URL, or mailto: link.`,
              severity: "error",
            });
          }
          break;
        }

        case "faq": {
          block.items.forEach((faqItem, fIdx) => {
            const faqPath = `${blockPath}.items[${fIdx}]`;
            issues.push(...checkTextForPlaceholders(faqItem.question, `${faqPath}.question`));
            issues.push(...checkTextForPlaceholders(faqItem.answer, `${faqPath}.answer`));
          });
          break;
        }

        case "disclaimer": {
          hasDisclaimer = true;
          issues.push(...checkTextForPlaceholders(block.text, `${blockPath}.text`));
          if (block.text.length < 10) {
            issues.push({
              code: "INCOMPLETE_DISCLAIMER",
              field: `${blockPath}.text`,
              message: "Disclaimer text is too short. Complete legal wording is required.",
              severity: "error",
            });
          }
          break;
        }
      }
    });

    // Check mandatory disclaimer if required
    if (entity.disclaimerRequired && !hasDisclaimer) {
      issues.push({
        code: "MANDATORY_DISCLAIMER_MISSING",
        field: "blocks",
        message: "This content requires a mandatory disclaimer block before publication.",
        severity: "error",
      });
    }
  }

  // 5. Portfolio Client Permission Hard Gate (PORT-001, Document 05 §8.7)
  if (entity.domain === "portfolio") {
    const permissionStatus = entity.clientPermissionStatus || entity.client_permission_status;
    if (permissionStatus !== "granted") {
      issues.push({
        code: "CLIENT_PERMISSION_REQUIRED",
        field: "client_permission_status",
        message: `Portfolio project publication requires explicit client permission ('granted'). Current permission status is '${permissionStatus || "unspecified"}'.`,
        severity: "error",
      });
    }
  }

  // 6. Portfolio Metrics & Confirmed Outcomes Governance (PORT-001, Document 04 §15.2, 05 §8.7)
  if (entity.metrics && Array.isArray(entity.metrics) && entity.metrics.length > 0) {
    entity.metrics.forEach((metric, mIdx) => {
      const metricPath = `metrics[${mIdx}]`;
      if (metric.value) issues.push(...checkTextForPlaceholders(metric.value, `${metricPath}.value`));
      if (metric.label) issues.push(...checkTextForPlaceholders(metric.label, `${metricPath}.label`));

      if (!metric.source || metric.source.trim().length === 0) {
        issues.push({
          code: "UNSOURCED_METRIC",
          field: `${metricPath}.source`,
          message: "Every published metric must cite a verifiable source.",
          severity: "error",
        });
      }
      if (!metric.owner || metric.owner.trim().length === 0) {
        issues.push({
          code: "MISSING_METRIC_OWNER",
          field: `${metricPath}.owner`,
          message: "Every published metric must have an assigned internal owner.",
          severity: "error",
        });
      }
    });
  }

  // 7. Portfolio Story Blocks Inspection (sparse blocks: challenge, approach, solution, technology, outcome, evidence)
  if (entity.storyBlocks && typeof entity.storyBlocks === "object") {
    for (const [key, section] of Object.entries(entity.storyBlocks)) {
      if (section && typeof section === "object") {
        if ("title" in section && typeof section.title === "string") {
          issues.push(...checkTextForPlaceholders(section.title, `storyBlocks.${key}.title`));
        }
        if ("content" in section && typeof section.content === "string") {
          issues.push(...checkTextForPlaceholders(section.content, `storyBlocks.${key}.content`));
        }
        if ("source" in section && typeof section.source === "string") {
          issues.push(...checkTextForPlaceholders(section.source, `storyBlocks.${key}.source`));
        }
        if ("owner" in section && typeof section.owner === "string") {
          issues.push(...checkTextForPlaceholders(section.owner, `storyBlocks.${key}.owner`));
        }
        if (key === "outcome" || key === "evidence") {
          if (section.content && section.content.trim().length > 0) {
            if (!section.source || section.source.trim().length === 0) {
              issues.push({
                code: "UNSOURCED_METRIC",
                field: `storyBlocks.${key}.source`,
                message: `Published ${key} claim must cite a verifiable source.`,
                severity: "error",
              });
            }
            if (!section.owner || section.owner.trim().length === 0) {
              issues.push({
                code: "MISSING_METRIC_OWNER",
                field: `storyBlocks.${key}.owner`,
                message: `Published ${key} claim must have an assigned internal owner.`,
                severity: "error",
              });
            }
          }
        }
      }
    }
  }

  const errors = issues.filter((i) => i.severity === "error");

  return {
    allowed: errors.length === 0,
    issues,
  };
}

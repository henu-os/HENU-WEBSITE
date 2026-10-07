/**
 * SERVICE PRICING SAFETY GATE (SERV-001, SERV-003, Document 04 §14.2, Document 05 §10.6)
 *
 * Hard rule: The public Services experience must contain NO pricing, package prices,
 * currency amounts, discount offers, payment UI, checkout, or pricing tables.
 *
 * This scanner detects prohibited price patterns across structured service fields
 * while allowing normal technical and operational prose.
 */

export interface PriceScanResult {
  hasPrice: boolean;
  matchedPattern?: string;
  field?: string;
  message?: string;
}

// Explicit currency symbols
const CURRENCY_SYMBOLS = ["₹", "$", "€", "£", "¥"];

// Prohibited pricing and package phrases (case-insensitive)
const PROHIBITED_PRICE_PHRASES = [
  "starting at",
  "starting from",
  "starts at",
  "starts from",
  "per month",
  "/month",
  "per mo",
  "/mo",
  "per hour",
  "/hour",
  "per hr",
  "/hr",
  "per project",
  "/project",
  "package price",
  "package pricing",
  "pricing plan",
  "pricing plans",
  "monthly fee",
  "hourly rate",
  "hourly fee",
  "fixed price",
  "flat rate",
  "flat fee",
  "discount offer",
  "discounted price",
  "special discount",
  "only ₹",
  "only $",
  "only €",
  "only £",
  "price list",
  "price table",
  "subscription fee",
];

// Regex to detect currency symbols followed or preceded by numbers: e.g. ₹500, $99, 1000 INR, 50 USD
const CURRENCY_AMOUNT_REGEX = /(?:[₹$€£¥]\s*\d+)|(?:\d+\s*(?:inr|usd|eur|gbp)\b)/i;

/**
 * Scans a single text string for prohibited price patterns.
 */
export function scanTextForPricing(text: string, fieldName = "content"): PriceScanResult {
  if (!text || typeof text !== "string") {
    return { hasPrice: false };
  }

  const normalized = text.toLowerCase();

  // 1. Check for currency symbols with numbers or standalone currency symbols
  for (const symbol of CURRENCY_SYMBOLS) {
    if (text.includes(symbol)) {
      return {
        hasPrice: true,
        matchedPattern: symbol,
        field: fieldName,
        message: `Services content must not contain currency symbols: "${symbol}". Services are informational and enquiry-scoped.`,
      };
    }
  }

  // 2. Check for numeric amounts with currency codes (e.g., 5000 INR, 100 USD)
  const amountMatch = normalized.match(CURRENCY_AMOUNT_REGEX);
  if (amountMatch) {
    return {
      hasPrice: true,
      matchedPattern: amountMatch[0],
      field: fieldName,
      message: `Services content must not contain monetary amounts: "${amountMatch[0]}".`,
    };
  }

  // 3. Check for prohibited pricing phrases
  for (const phrase of PROHIBITED_PRICE_PHRASES) {
    if (normalized.includes(phrase)) {
      return {
        hasPrice: true,
        matchedPattern: phrase,
        field: fieldName,
        message: `Services content must not contain pricing phrases: "${phrase}". Services are custom-scoped.`,
      };
    }
  }

  return { hasPrice: false };
}

/**
 * Recursively scans arbitrary structured objects (such as JSON blocks, FAQ items, etc.) for pricing content.
 */
export function scanStructuredContentForPricing(
  content: unknown,
  basePath = "service"
): PriceScanResult {
  if (!content) {
    return { hasPrice: false };
  }

  if (typeof content === "string") {
    return scanTextForPricing(content, basePath);
  }

  if (Array.isArray(content)) {
    for (let i = 0; i < content.length; i++) {
      const result = scanStructuredContentForPricing(content[i], `${basePath}[${i}]`);
      if (result.hasPrice) {
        return result;
      }
    }
  } else if (typeof content === "object") {
    for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
      const result = scanStructuredContentForPricing(value, `${basePath}.${key}`);
      if (result.hasPrice) {
        return result;
      }
    }
  }

  return { hasPrice: false };
}

/**
 * Validates an entire service entity against the price-content safety gate.
 */
export function validateServicePricing(service: Record<string, unknown>): {
  allowed: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  const textFields = ["name", "summary", "seo_title", "seo_description", "disclaimer_block"];
  for (const field of textFields) {
    if (typeof service[field] === "string") {
      const res = scanTextForPricing(service[field] as string, field);
      if (res.hasPrice && res.message) {
        issues.push(res.message);
      }
    }
  }

  const structuredFields = [
    "problem_block",
    "capability_block",
    "approach_block",
    "solution_block",
    "outcome_block",
    "faq_items",
  ];

  for (const field of structuredFields) {
    if (service[field]) {
      const res = scanStructuredContentForPricing(service[field], field);
      if (res.hasPrice && res.message) {
        issues.push(res.message);
      }
    }
  }

  return {
    allowed: issues.length === 0,
    issues,
  };
}

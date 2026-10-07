import { z } from "zod";

/**
 * Structured Content Block Types & Schemas (CORE-008, Document 04 §22.5)
 * Disallows arbitrary HTML or script injection.
 */

export const headingBlockSchema = z.object({
  type: z.literal("heading"),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string().trim().min(1, "Heading text cannot be empty."),
});

export const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  content: z.string().trim().min(1, "Paragraph content cannot be empty."),
});

export const imageBlockSchema = z.object({
  type: z.literal("image"),
  url: z.string().url("Valid image URL required."),
  alt: z.string().trim(),
  caption: z.string().trim().optional(),
  isDecorative: z.boolean().default(false),
  mediaId: z.string().uuid().optional(),
});

export const quoteBlockSchema = z.object({
  type: z.literal("quote"),
  quote: z.string().trim().min(1),
  author: z.string().trim().min(1),
  title: z.string().trim().optional(),
});

export const keyFactsBlockSchema = z.object({
  type: z.literal("key_facts"),
  facts: z.array(
    z.object({
      fact: z.string().trim().min(1),
      label: z.string().trim().min(1),
      source: z.string().trim().min(1, "Every metric requires a verified source."),
      owner: z.string().trim().min(1, "Every metric requires an internal owner."),
    })
  ).min(1),
});

export const capabilityListBlockSchema = z.object({
  type: z.literal("capabilities"),
  items: z.array(
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
    })
  ).min(1),
});

export const processStepsBlockSchema = z.object({
  type: z.literal("process_steps"),
  steps: z.array(
    z.object({
      stepNumber: z.number().int().positive(),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
    })
  ).min(1),
});

export const ctaBlockSchema = z.object({
  type: z.literal("cta"),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  buttonLabel: z.string().trim().min(1),
  buttonTarget: z.string().trim().refine(
    (target) => target.startsWith("/") || target.startsWith("https://") || target.startsWith("mailto:"),
    "CTA target must be a relative path, https:// URL, or mailto:"
  ),
});

export const faqBlockSchema = z.object({
  type: z.literal("faq"),
  items: z.array(
    z.object({
      question: z.string().trim().min(1),
      answer: z.string().trim().min(1),
    })
  ).min(1),
});

export const disclaimerBlockSchema = z.object({
  type: z.literal("disclaimer"),
  text: z.string().trim().min(10, "Disclaimer must contain complete legal wording."),
});

export const contentBlockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  imageBlockSchema,
  quoteBlockSchema,
  keyFactsBlockSchema,
  capabilityListBlockSchema,
  processStepsBlockSchema,
  ctaBlockSchema,
  faqBlockSchema,
  disclaimerBlockSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type QuoteBlock = z.infer<typeof quoteBlockSchema>;
export type KeyFactsBlock = z.infer<typeof keyFactsBlockSchema>;
export type CapabilityListBlock = z.infer<typeof capabilityListBlockSchema>;
export type ProcessStepsBlock = z.infer<typeof processStepsBlockSchema>;
export type CTABlock = z.infer<typeof ctaBlockSchema>;
export type FAQBlock = z.infer<typeof faqBlockSchema>;
export type DisclaimerBlock = z.infer<typeof disclaimerBlockSchema>;

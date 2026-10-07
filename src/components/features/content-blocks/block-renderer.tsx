import React from "react";
import type {
  ContentBlock,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  QuoteBlock,
  KeyFactsBlock,
  CapabilityListBlock,
  ProcessStepsBlock,
  CTABlock,
  FAQBlock,
  DisclaimerBlock,
} from "@/types/blocks";
import { SafeImage } from "@/components/ui/image";
import { LinkButton } from "@/components/ui/link-button";

/**
 * Sanitizes CTA links to ensure only safe schemes (https:, mailto:, or relative paths) are rendered.
 */
function isSafeUrl(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  if (url.startsWith("https://")) return true;
  if (url.startsWith("mailto:")) return true;
  return false;
}

export function RenderHeadingBlock({ block }: { block: HeadingBlock }) {
  const Tag = `h${block.level}` as "h2" | "h3" | "h4";
  const sizeClasses = {
    2: "text-2xl md:text-3xl font-display font-bold tracking-tight text-ink-primary mt-8 mb-4",
    3: "text-xl md:text-2xl font-display font-semibold tracking-tight text-ink-primary mt-6 mb-3",
    4: "text-lg md:text-xl font-display font-semibold text-ink-primary mt-4 mb-2",
  }[block.level];

  return <Tag className={sizeClasses}>{block.text}</Tag>;
}

export function RenderParagraphBlock({ block }: { block: ParagraphBlock }) {
  return (
    <p className="font-sans text-base md:text-lg text-ink-secondary leading-relaxed mb-6">
      {block.content}
    </p>
  );
}

export function RenderImageBlock({ block }: { block: ImageBlock }) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border-default bg-surface-secondary">
      <SafeImage
        src={block.url}
        alt={block.alt}
        isDecorative={block.isDecorative}
        width={1200}
        height={675}
        className="w-full object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      {block.caption && (
        <figcaption className="p-3 text-center text-xs text-ink-muted border-t border-border-default">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function RenderQuoteBlock({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="my-8 border-l-2 border-accent-spectral pl-6 py-2 italic text-ink-primary bg-surface-secondary/40 rounded-r-lg">
      <p className="font-display text-lg md:text-xl leading-snug">“{block.quote}”</p>
      <footer className="mt-3 text-sm font-sans not-italic text-ink-secondary font-medium">
        — {block.author}
        {block.title && <span className="text-ink-muted">, {block.title}</span>}
      </footer>
    </blockquote>
  );
}

export function RenderKeyFactsBlock({ block }: { block: KeyFactsBlock }) {
  return (
    <section aria-label="Key Facts" className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {block.facts.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border border-border-default bg-surface-primary shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-3xl md:text-4xl font-bold text-accent-spectral">
                {item.fact}
              </span>
              <p className="mt-2 text-sm font-semibold text-ink-primary">{item.label}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-ink-muted">
              <span>Source: {item.source}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RenderCapabilityListBlock({ block }: { block: CapabilityListBlock }) {
  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {block.items.map((item, idx) => (
        <div
          key={idx}
          className="p-6 rounded-lg border border-border-default bg-surface-primary hover:border-border-strong transition-colors"
        >
          <h3 className="font-display text-lg font-semibold text-ink-primary mb-2">
            {item.title}
          </h3>
          <p className="font-sans text-sm text-ink-secondary leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function RenderProcessStepsBlock({ block }: { block: ProcessStepsBlock }) {
  return (
    <ol className="my-10 space-y-6 list-none p-0">
      {block.steps.map((step) => (
        <li
          key={step.stepNumber}
          className="flex gap-4 p-6 rounded-lg border border-border-default bg-surface-primary items-start"
        >
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-surface-secondary text-ink-primary font-mono text-sm font-bold border border-border-default">
            {step.stepNumber}
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-ink-primary">
              {step.title}
            </h3>
            <p className="mt-1 font-sans text-sm text-ink-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function RenderCTABlock({ block }: { block: CTABlock }) {
  const safeTarget = isSafeUrl(block.buttonTarget) ? block.buttonTarget : "#";

  return (
    <div className="my-12 p-8 rounded-xl bg-surface-secondary border border-border-default flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="max-w-xl">
        <h3 className="font-display text-xl md:text-2xl font-bold text-ink-primary">
          {block.title}
        </h3>
        {block.description && (
          <p className="mt-2 font-sans text-sm md:text-base text-ink-secondary">
            {block.description}
          </p>
        )}
      </div>
      <div>
        <LinkButton href={safeTarget} variant="primary" size="lg">
          {block.buttonLabel}
        </LinkButton>
      </div>
    </div>
  );
}

export function RenderFAQBlock({ block }: { block: FAQBlock }) {
  return (
    <div className="my-10 divide-y divide-border-default border-y border-border-default">
      {block.items.map((item, idx) => (
        <details key={idx} className="group py-4">
          <summary className="font-display font-semibold text-ink-primary cursor-pointer list-none flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded py-1">
            <span>{item.question}</span>
            <span className="text-ink-muted transition-transform group-open:rotate-180 ml-4">
              ▾
            </span>
          </summary>
          <p className="mt-3 font-sans text-sm md:text-base text-ink-secondary leading-relaxed pl-2">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function RenderDisclaimerBlock({ block }: { block: DisclaimerBlock }) {
  return (
    <aside
      aria-label="Disclaimer"
      className="my-8 p-4 rounded-md bg-surface-tertiary border border-border-subtle text-xs text-ink-muted leading-relaxed"
    >
      <strong className="font-semibold uppercase tracking-wider block mb-1">
        Notice / Disclaimer
      </strong>
      {block.text}
    </aside>
  );
}

/**
 * Universal Content Block Renderer.
 * Disallows raw HTML or unescaped script execution.
 */
export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="content-blocks-flow">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "heading":
            return <RenderHeadingBlock key={idx} block={block} />;
          case "paragraph":
            return <RenderParagraphBlock key={idx} block={block} />;
          case "image":
            return <RenderImageBlock key={idx} block={block} />;
          case "quote":
            return <RenderQuoteBlock key={idx} block={block} />;
          case "key_facts":
            return <RenderKeyFactsBlock key={idx} block={block} />;
          case "capabilities":
            return <RenderCapabilityListBlock key={idx} block={block} />;
          case "process_steps":
            return <RenderProcessStepsBlock key={idx} block={block} />;
          case "cta":
            return <RenderCTABlock key={idx} block={block} />;
          case "faq":
            return <RenderFAQBlock key={idx} block={block} />;
          case "disclaimer":
            return <RenderDisclaimerBlock key={idx} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

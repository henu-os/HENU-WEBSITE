# HENU Website — Frontend, UI/UX & Design System Specification

| | |
|---|---|
| **Document** | `04-FRONTEND-UI-UX-DESIGN-SYSTEM.md` |
| **Status** | Draft v1 for design and engineering review |
| **Depends on** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md`, `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md`, `03-SECURITY-ARCHITECTURE.md` |
| **Audience** | Designers, frontend engineers, content owners, AI coding agents |

**Conventions**

- `[REQUIRES CONFIRMATION]` marks any fact, asset, wording or decision that HENU has not confirmed. No technical specification, benchmark, metric, customer figure, certification, award, partnership, price or project outcome is invented in this document.
- Hex values, type sizes and durations are **recommended starting values** for the design foundation. Colour contrast ratios are stated as approximate and **must be verified with tooling before the tokens are frozen**.
- This document defines the **design language, structure, behaviour and component architecture**. It contains no implementation code and no final copywriting. Example copy is illustrative only and is marked as such.
- The document is a foundation, not a prison (see §38): foundational decisions are fixed; visual details may be refined during the build.

---

## 0. Reconciliation with Documents 01–03

This document introduces confirmed requirements that refine earlier assumptions. Where they conflict, **this document governs for navigation, visual design and admin content scope**; the affected earlier decisions are listed so the teams can update them deliberately rather than discover the conflict during the build.

| Topic | Earlier assumption | This specification | Consequence |
|-------|-------------------|--------------------|-------------|
| **Primary navigation** | Docs 01/02 proposed a wider route set (Technology, Downloads, Documentation, Blog) | **Six primary items only:** Home, Services, Products, Portfolio, About Us, Contact Us. No documentation-first or download-first structure | Downloads, release information and documentation links live **inside the HENU OS page** and the footer (supporting content, V1.1 where not ready). Doc 02's release/download data architecture still applies; it simply surfaces on `/products/henu-os` rather than as top-level navigation |
| **Services/Products/Portfolio content** | Doc 02: static, source-controlled content in V1; admin UI at V1.1 | **Content is dynamic and Admin-managed**, including Portfolio add/edit/delete, and editable Home/Services/Products/About content | Doc 02's data classification changes for these domains: **database-backed and admin-managed in V1** (Section 22). The repository-interface approach in doc 02 still holds, which makes this change an implementation of the planned V1.1 path, brought forward |
| **Admin at launch** | Doc 02/03: admin UI default V1.1 | **Admin web foundation is V1** | Doc 03 §8, §9, §29, §39 controls (MFA, server-side authorisation, audit, step-up, strict admin CSP) become **V1-mandatory for the application**, not only for the operator surface |
| **File uploads** | Doc 03 §20: out of scope in V1 | **Media management is required** (portfolio/product/service images) | Doc 03 §20 upload controls become **mandatory V1 requirements** for admin media uploads (type allowlist, content inspection, random identifiers, size limits, cookieless media origin, authorisation) |
| **Admin-authored content** | Doc 03 §30: admin-authored content is not automatically trusted | Applies directly | Admin content uses **structured blocks**, not raw HTML (Section 22.5) |
| **Pricing** | PRD allowed "Request a Proposal" flows | **No prices anywhere on the public site** | Services are informational and enquiry-driven (Section 14) |
| **Contact** | Doc 01: intent-based forms | Two paths: **Enquiry/Quote** and **Schedule a meeting (Calendly)** | Doc 01 intent routing collapses into these two primary paths plus a type selector (Section 18) |
| **Services scope** | Doc 01 questioned Legal/Funding services | Catalogue now explicitly includes **Legal Services, Funding Solutions, Documentation & Startup Services** | Retained as supplied, but with specific wording care (Section 14.4) `[REQUIRES CONFIRMATION]` |

---

## 1. Design Mandate

### 1.1 What the design must achieve

HENU's website must feel like **HENU has its own visual language**, not "a modern template with a HENU logo." It must be simultaneously:

- **Original** — recognisable as HENU without the logo.
- **Clear** — a visitor understands what HENU is within seconds.
- **Credible** — evidence over adjectives; only confirmed content.
- **Usable and accessible** — WCAG 2.2 AA where practical.
- **Fast** — compatible with a static-first Next.js implementation.
- **Scalable** — new products, services and projects are added through the Admin Panel without redesign.

### 1.2 Foundational, non-negotiable decisions

1. **Light theme is the default.** A first-time visitor always sees light, regardless of operating-system preference.
2. Dark theme is an **independently art-directed** alternate, switched by the visitor.
3. Primary navigation is exactly: **Home · Services · Products · Portfolio · About Us · Contact Us**.
4. The site presents **HENU as a company and ecosystem**, not only HENU OS.
5. The public site is **fully responsive** (desktop, tablet, mobile). **There is no mobile Admin app.**
6. The Admin Panel is a **web application only**.
7. Content is **dynamic and Admin-managed**; visuals are **centrally controlled**.
8. **No service prices** are shown publicly.
9. **Products, Services and Portfolio remain separate** concepts and sections.
10. **Accessibility and performance** are design constraints, not afterthoughts.

### 1.3 Originality guardrails

The design must not reproduce recognisable layouts, copy, card structures, animations, typography treatments, colour combinations or section sequencing from any reference or competitor website (consistent with the PRD originality requirement). It must also not carry forward the previously explored dark infrastructure/dashboard aesthetic (Section 5).

---

## 2. Experience Principles

| # | Principle | Practical meaning |
|---|-----------|-------------------|
| 1 | **Authored, not templated** | Each page has a composition designed for its content, not a repeated card grid |
| 2 | **Hierarchy over uniform loudness** | One loud moment per screen; supporting content is quieter |
| 3 | **Evidence over assertion** | Real products, real projects, real screenshots; no superlatives |
| 4 | **Warmth with precision** | Human, editorial warmth combined with engineering exactness |
| 5 | **One memorable device, used with restraint** | The chromatic field (Section 6.3) recurs sparingly, never as wallpaper |
| 6 | **Motion explains** | Motion shows relationships, state and cause; it never fills silence |
| 7 | **Light is a first-class design, not an inversion** | Palette, imagery and contrast are designed for light, then separately for dark |
| 8 | **Technical depth on demand** | Plain language first; technical layers available when wanted |
| 9 | **Mobile is designed, not shrunk** | Every page has an explicit mobile composition |
| 10 | **Fixed design system, flexible content** | Admins control content; they cannot break the design |
| 11 | **Every CTA has an intent** | No generic "Learn more" repeated everywhere |
| 12 | **Honest placeholders** | Unconfirmed content is flagged and cannot be published (Section 22.6) |

---

## 3. Light Mode — Default Theme

### 3.1 Requirement

Light mode is the first and primary experience. It is **designed independently**, with its own palette logic, surface hierarchy, imagery treatment and atmosphere. Dark mode is derived *from the brand system*, not by inverting light.

### 3.2 Character of the light theme

The light theme should feel **premium, sophisticated, warm, technologically modern, distinctive and unmistakably intentional.** The recommended direction is **"paper and ink with a living spectrum"**:

- **Paper**: warm, slightly yellow-white canvases rather than sterile `#FFFFFF`. This immediately separates HENU from the blue-white SaaS norm and gives long-form reading comfort.
- **Ink**: a warm near-black for text and key shapes, giving editorial authority.
- **Signal**: one confident warm accent (Ember) used decisively for primary actions and key moments.
- **Spectrum**: a small family of secondary hues, each tied to a HENU product, appearing as soft, grainy, organic colour fields (Section 6.3), not as gradients on UI chrome.

### 3.3 What "premium" means here

Generous whitespace, strong typographic scale contrast, restrained use of colour, precise alignment, hairline rules, meaningful asymmetry, tactile (grain) texture, and quality of detail in states and transitions, not decoration density.

### 3.4 Light-mode rules

- Use tonal steps (paper → raised → sunken) and hairline borders for structure; use shadow sparingly.
- Reserve saturated colour for action, status and the chromatic field.
- Pure white is used only for raised surfaces that need to lift off paper (forms, dialogs).
- Never use pure black text; use Ink.

---

## 4. Dark Mode — Optional Alternate Theme

### 4.1 Requirement

Dark mode is supported through a theme switch. It preserves HENU identity (typography, composition, hue relationships, the chromatic field) while adapting surfaces, text, borders, imagery and contrast.

### 4.2 Direction: "warm graphite"

Dark mode uses **warm graphite surfaces**, not black, so the paper-and-ink warmth carries over as "lamp-lit" rather than "terminal."

| Avoid | Reason |
|-------|--------|
| Cyberpunk/neon glows | Off-brand; reduces credibility |
| Hacker/terminal aesthetic (green-on-black, scanlines, fake consoles) | Cliché; contradicts HENU's human warmth |
| Purple-on-black gradients | Generic AI/crypto signal |
| Dashboard/telemetry decoration | Explicitly excluded (Section 5) |
| Pure `#000` backgrounds with `#FFF` text | Harsh contrast, halation |

### 4.3 Dark-mode adaptation rules

| Aspect | Rule |
|--------|------|
| **Surfaces** | Elevation expressed by *lightness steps* and borders, not shadows |
| **Text** | Warm off-white; secondary text is lowered but still ≥ AA contrast |
| **Accent** | Ember is **re-tuned lighter** to hold contrast on dark surfaces; it is not simply reused |
| **Chromatic field** | Re-mixed with deeper, lower-luminance hues and stronger grain; remains atmospheric, never glowing |
| **Imagery** | Illustrations and diagrams ship **with dark variants** where needed. Screenshots are not recoloured. Backgrounds are not auto-inverted |
| **Borders** | Slightly more visible than in light, to preserve structure |
| **Focus** | A theme-specific focus ring that meets contrast against the dark surface |

### 4.4 Switching behaviour

- **Default on first visit: light**, even if the OS prefers dark. OS preference is **not** used to choose the initial theme.
- The switch is a visible control in the header, with an accessible name and state announcement (Section 20.4).
- The choice is remembered (non-sensitive preference) and applied before first paint to avoid a flash (Section 27.4).
- Optional "System" setting is **not** offered in V1 to keep the model simple `[REQUIRES CONFIRMATION]`.

---

## 5. What Not to Carry Forward from the Earlier Dark Exploration

The earlier dark technical/infrastructure exploration is **not** the HENU design. Do not carry forward:

- Dark-first structure and composition.
- Technical-dashboard aesthetic.
- Excess infrastructure terminology in headlines and labels.
- Telemetry-style decoration (fake readouts, counters, status tickers).
- Heavy blueprint/grid treatment.
- Artificial technical metadata or fabricated technical specifications.

Principles that **may** be preserved: clarity of product-ecosystem relationships, disciplined grid, credible technical seriousness where real information exists. Everything is re-expressed in HENU's own language.

---

## 6. Visual Language

### 6.1 Personality

**Technology + Product + Engineering + Creativity + Human ambition.** Premium, original, intelligent, confident, modern, memorable, technologically credible, human, scalable.

It must **not** read as: generic SaaS, generic digital agency, generic Linux distribution, generic AI startup, cybersecurity dashboard, crypto site, cyberpunk site, architecture portfolio, or generic design studio.

### 6.2 The HENU visual system — five recurring devices

| Device | Description | Where used | Guardrail |
|--------|-------------|-----------|-----------|
| **1. Chromatic field** | A soft, grainy, organic blend of the four product hues on paper (or graphite). Edges dissolve; no hard blobs, no glow | Home opening, section transitions, About, product page heads (tinted to the product hue) | Maximum **one dominant field per viewport**; never behind body text without a calm overlay; implemented as optimised static imagery or CSS gradients, **not** a continuously animated canvas |
| **2. Editorial type** | Large display serif with controlled contrast against a precise grotesque | Headlines everywhere | Large type is the primary "image" of many sections |
| **3. Ledger rules** | Hairline rules and numbered indices that organise content (e.g., "01 / 02 / 03") | Service index, process, section heads | Numbering is **structural only**; never fake data, never fake metadata |
| **4. Layered ecosystem** | A visual model in which HENU OS is the ground and HENU AI, PA and IDE are layered, interlocking fields | Home ecosystem section, product heads | Must reflect confirmed relationships only |
| **5. Tactile grain** | A very fine paper-grain texture over fields and select imagery | Fields, hero backdrops | Tiny tiled asset; negligible weight; disabled if it harms contrast or performance |

**Explicit non-devices:** glassmorphism, neon glows, particle fields, floating glowing spheres, terminal backgrounds, generic geometric blobs, stock technology imagery.

### 6.3 The chromatic field — art direction brief

- **Idea:** HENU is an ecosystem of distinct but related products. The field expresses that: four hues that blend into one another the way the products connect.
- **Influence:** a subtle tie-dye / organic / diffused-dye sensibility, resolved with sophistication: soft diffusion, restrained saturation, grain, and generous paper space around it. **No literal psychedelic patterns, swirls, or rainbow gradients.**
- **Composition:** asymmetric, bleeding off an edge, occupying a minority of the viewport; often paired with a large block of type.
- **Variants:**
  - *Spectrum* (all four hues) for the home opening and About.
  - *Product tints* (dominant product hue with traces of neighbours) for product pages, expressing "related but not identical."
  - *Quiet* (low-contrast, single hue) for section dividers.
- **Production:** authored as vector/raster art (optimised AVIF/WebP) with CSS-gradient fallbacks; static by default; any motion is a very slow, optional drift that is disabled under reduced motion.
- **Accessibility:** purely decorative (`aria-hidden`); never conveys information; text over it must meet contrast against the *worst* local colour.
- **Originality check:** the final art must look like HENU's, not like a generic "mesh gradient." Art-direction review required `[REQUIRES CONFIRMATION]`.

### 6.4 Composition principles

- **Asymmetry with a strong underlying grid.** 12-column grid; content often occupies 5–8 columns with deliberate empty columns.
- **Scale contrast.** Very large display type against small, precise supporting text.
- **Overlap and bleed** (controlled) for fields and imagery; never overlapping text and interactive elements.
- **Rhythm.** Alternate dense and airy sections; alternate full-bleed and contained.
- **Alignment.** A small number of consistent alignment axes per page.

---

## 7. Colour System

### 7.1 Strategy

HENU's existing logo/brand colours `[REQUIRES CONFIRMATION: current logo colours]` should **inform** the palette without dominating every page. The recommended palette is built around: a warm **Paper** neutral family, a warm **Ink**, a decisive **Ember** primary, and a product **Spectrum** of secondary hues (**Tidal**, **Saffron**, **Mulberry**). If HENU's logo uses a colour that conflicts with this direction, the logo remains unaltered and sits on the neutral surfaces; the palette is adjusted around it rather than recolouring the logo.

### 7.2 Brand and spectrum colours

| Role | Name | Light value | Dark value | Primary use | Notes |
|------|------|------------|-----------|-------------|-------|
| **Primary / brand action** | **Ember** | `#C93A16` | `#FF7A4D` | Primary buttons, key links, flagship (HENU OS) | ≈ 5.1:1 with white text in light; ≈ 4.6:1 as text on Paper. Dark value ≈ 7:1 on graphite |
| **Secondary / intelligence** | **Tidal** (deep teal) | `#0F5C63` | `#5FC4C9` | HENU AI, informational accents, secondary actions | ≈ 7:1 on Paper in light |
| **Accent / voice** | **Saffron** | `#E8A317` | `#F2B84B` | HENU PA, highlights, fills and illustration | **Fill only**: Saffron on Paper is too low-contrast for text. Text on Saffron fills uses Ink |
| **Accent / craft** | **Mulberry** | `#8A2D52` | `#E58AB0` | HENU IDE, tertiary emphasis | ≈ 7.4:1 on Paper |

**Product hue assignment (working recommendation `[REQUIRES CONFIRMATION]`):**

| Product | Hue | Rationale |
|---------|-----|-----------|
| HENU OS | **Ember** | Flagship; the brand's primary signal colour |
| HENU AI | **Tidal** | Calm, analytical counterweight to Ember |
| HENU PA | **Saffron** | Warm, human, voice-related |
| HENU IDE | **Mulberry** | Distinct, crafted, developer-oriented without resorting to blue/purple clichés |

Product hues are **accents and atmosphere**, not replacements for the brand primary. Product pages remain unmistakably HENU through shared type, structure and the Ember action colour.

### 7.3 Neutrals

| Token role | Light | Dark | Use |
|-----------|-------|------|-----|
| **Canvas** (page background) | `#F7F3EC` | `#14120F` | Page background |
| **Surface** (cards/panels) | `#FCFAF6` | `#1D1A16` | Panels on canvas |
| **Surface raised** (forms, dialogs) | `#FFFFFF` | `#26221D` | Elevated elements |
| **Surface sunken** (inset areas, code, alt bands) | `#EEE8DC` | `#0F0D0B` | Inset/alternate bands |
| **Ink / text primary** | `#1B1A17` | `#F2ECE1` | Body and headings (≈ 16:1 on Canvas in light) |
| **Text secondary** | `#55514A` | `#B8B0A2` | Supporting text (≈ 7:1 on Canvas in light) |
| **Text tertiary** | `#6F6A61` | `#8F887B` | Captions (verify ≥ 4.5:1 for text sizes used; otherwise do not use for essential text) |
| **Border subtle** | `#E2DACB` | `#2E2A24` | Dividers, ledger rules |
| **Border strong** | `#BDB3A0` | `#4A443B` | Inputs, emphasised rules |
| **Inverse** (on-dark panels within light theme) | `#1B1A17` bg / `#F7F3EC` text | n/a | Occasional dark bands within light pages for rhythm |

*Warm neutrals only; cool greys are not used.*

### 7.4 Semantic colours

| Meaning | Light | Dark | Notes |
|---------|-------|------|-------|
| **Success** | `#1F6F43` | `#6CCB92` | Always paired with icon + text |
| **Warning** | text `#8A5A00` / fill Saffron | text `#F2B84B` | Fill uses Saffron with Ink text |
| **Error** | `#B3261E` | `#FF8A80` | Always paired with icon + message |
| **Info** | Tidal | Tidal (dark value) | |
| **Focus ring** | Ink with Paper offset (two-tone) | Warm off-white with graphite offset | Must meet contrast against adjacent colours (WCAG 2.2) |
| **Selection** | Ember at low alpha | Ember (dark) at low alpha | Text remains legible |

### 7.5 Colour usage rules

1. **Raw colour values appear only in the token definitions.** Components consume semantic tokens (Section 27).
2. **One primary action colour** (Ember). Do not introduce additional button colours.
3. **Product hues colour atmosphere and small markers**, not large flat areas of UI.
4. **No gradient on UI chrome** (buttons, inputs, nav). Gradients live in the chromatic field only.
5. **Never use colour alone** to communicate state (Section 29).
6. **All text/background pairs are checked** against WCAG 2.2 AA (4.5:1 normal text, 3:1 large text and UI components) in both themes. The ratios above are approximate and must be confirmed in tooling before freeze.
7. **Admin uses the same tokens** with a restrained subset (no chromatic field).

### 7.6 Rationale

- **Warm paper + ink** differentiates HENU from blue/white or black/neon technology conventions and supports comfortable reading.
- **Ember** is bold and unusual in infrastructure/technology branding yet strongly legible and action-oriented.
- **Spectrum hues tied to products** let colour carry *meaning* (which product) instead of decoration, and make the ecosystem visualisation intuitive.
- **Avoids** the blue/purple gradient default, neon, and monochrome-black technical look.
- **Validation required:** the palette must be tested against real HENU logos, product screenshots and photography `[REQUIRES CONFIRMATION]`, and against colour-vision-deficiency simulation.

---

## 8. Typography

### 8.1 Direction

**Editorial serif display + precise grotesque text + minimal monospace.** The pairing combines human, editorial warmth (headlines) with engineering precision (interface and body), which matches "Technology + Product + Engineering + Creativity + Human ambition." It deliberately avoids the standard SaaS defaults (Inter, Roboto, Geist) `[as previously noted in the PRD]`.

### 8.2 Recommendation

| Role | Recommended family | Why | Alternatives evaluated |
|------|--------------------|-----|------------------------|
| **Display (headlines, large statements)** | **Fraunces** (variable, with optical-size axis; used at a restrained, low-"wonk" setting) | Characterful, warm, highly legible at display sizes; optical sizing keeps it refined at large scale; open-licence and self-hostable | *Instrument Serif* (elegant but a single weight, less flexible); *Newsreader* (more bookish, less distinctive); a grotesque display (*Bricolage Grotesque*) was considered but overlaps more with current tech/agency trends |
| **Text & UI (body, navigation, forms, admin)** | **Instrument Sans** (variable) | Clean, contemporary, slightly humanist, distinct from Inter, good small-size legibility | *Hanken Grotesk*, *Manrope* (acceptable); Inter/Roboto/Geist (rejected as generic defaults) |
| **Technical / monospace** | **IBM Plex Mono** | Credible and neutral for real code, commands, version labels | *DM Mono* (softer); *JetBrains Mono* (very common) |

`[REQUIRES CONFIRMATION]` — Final selection should be validated visually against the real HENU logo and product screenshots, and the font licences re-verified at adoption. All three recommended families are distributed under open licences at time of writing `[VERIFY]`.

### 8.3 Usage rules

| Rule | Detail |
|------|--------|
| **Display serif** is for headlines and key statements only (H1–H3, pull quotes, large numerals used structurally). **Never for body copy, UI labels, buttons, or form text** |
| **Monospace** appears **only where meaningful**: real code, commands, file names, version identifiers. **Not** as a decorative "tech" texture, and not for fabricated metadata |
| **Weights/styles loaded are limited** (e.g., display variable file; text variable file; one or two mono weights) to protect performance |
| **Self-hosted** through the framework's font optimisation; no render-blocking third-party font requests (consistent with doc 02) |
| **Fallback stacks** are defined and tuned to minimise layout shift (size-adjust metrics) |
| **Line length** 60–75 characters for body; headings may be shorter |
| **Italic display** may be used for emphasis in headlines sparingly (a signature editorial gesture) |
| **Numerals** in the ledger device use the display or text family, not mono, unless the content is literally technical |
| **Multilingual readiness** `[REQUIRES CONFIRMATION]`: if Hindi/Devanagari or other scripts are required, matched fallback families must be selected (the recommended display face does not cover Devanagari); line-height and size tokens must accommodate taller scripts |

### 8.4 Type roles and scale

Fluid sizing (smoothly interpolated between breakpoints) is recommended; values below are recommended ranges.

| Token (role) | Family | Mobile → Large desktop | Weight/Style | Line height | Use |
|-------------|--------|------------------------|--------------|-------------|-----|
| `display-xl` | Display | ~44px → ~120px | Light–Regular, tight tracking | ~1.0 | Home opening statement only |
| `display-lg` | Display | ~36px → ~84px | Regular | ~1.05 | Section statements, product page heads |
| `heading-1` | Display | ~32px → ~60px | Regular | ~1.1 | Page titles |
| `heading-2` | Display | ~26px → ~44px | Regular | ~1.15 | Section titles |
| `heading-3` | Text | ~20px → ~28px | Semibold | ~1.25 | Sub-sections |
| `heading-4` | Text | ~17px → ~20px | Semibold | ~1.3 | Component titles |
| `body-lg` | Text | ~18px → ~21px | Regular | ~1.55 | Lead paragraphs |
| `body` | Text | 16px → 18px | Regular | ~1.6 | Default body |
| `body-sm` | Text | 14px → 15px | Regular | ~1.5 | Secondary text, captions |
| `label` | Text | 13px → 14px | Medium, slight tracking | ~1.3 | Form labels, badges, nav |
| `overline` | Text | 12px → 13px | Medium, uppercase, wider tracking | ~1.3 | Section overlines (use sparingly) |
| `code` | Mono | 14px → 15px | Regular | ~1.5 | Real code/commands only |

**Minimum sizes:** body text never below 16px on mobile; interactive text never below 14px.

---

## 9. Navigation

### 9.1 Structure

Primary navigation, fixed: **Home · Services · Products · Portfolio · About Us · Contact Us**.

Header also contains: **HENU logo**, **theme switch**, and a **primary CTA** (see below).

### 9.2 Primary CTA in header

A single persistent CTA, **"Contact Us"-aligned**: recommended label is an action such as **"Start an enquiry"** `[REQUIRES CONFIRMATION: final label]` that routes to the enquiry path. The "Contact Us" item remains in the primary list; to avoid duplication on desktop, the CTA is visually distinct (filled Ember) while "Contact Us" is the text link. On mobile, the CTA lives in the menu panel and as a persistent, unobtrusive bottom action only on pages where conversion is the intent (Section 21).

### 9.3 Desktop (≥ 1024px)

- Horizontal bar: logo left, nav centred or right-aligned, theme switch and CTA at far right.
- **Sticky** header that **reduces height on scroll** and does not obscure content under focus (WCAG 2.2 *Focus Not Obscured*; use scroll-padding).
- **Active state:** current section indicated by an underline/rule **plus** `aria-current="page"` (not colour alone).
- **Products menu:** the Products item may offer a **lightweight panel** listing the four products (HENU OS, HENU AI, HENU PA, HENU IDE), each with its hue marker and a one-line descriptor. It must be keyboard- and touch-operable, open on click (not hover-only), close on Escape, and never trap focus. `[Optional V1; direct link to /products is the baseline]`.
- **Services** likewise may expose a panel of service categories; baseline is a direct link.

### 9.3.1 Tablet (640–1023px)

- Condensed bar: logo, theme switch, CTA, and a **menu button**. Navigation opens as a **full-height side/overlay panel** with large touch targets, product and service sub-lists as expandable groups.

### 9.3.2 Mobile (< 640px)

- Compact bar: logo left; theme switch and **menu button** right.
- **Menu panel:** full-screen overlay with large display-type links (editorial treatment), the CTA, and secondary links (footer-level items). Focus is moved into the panel, trapped while open, returned to the trigger on close; Escape closes; background scroll locked; reduced-motion respected.
- Thumb-reachable: primary actions in the lower half of the panel.

### 9.4 Keyboard, focus and active states

| Aspect | Requirement |
|--------|------------|
| **Tab order** | Logical: skip link → logo → nav items → theme switch → CTA |
| **Skip link** | "Skip to main content" visible on focus |
| **Focus style** | Two-tone focus ring (Section 7.4) on every interactive element; never removed |
| **Disclosure panels** | `aria-expanded`/`aria-controls`; Escape closes; arrow-key support optional; no hover-only |
| **Active state** | `aria-current`, underline/rule and weight change |
| **Hover state** | Subtle, never the only affordance |
| **Touch targets** | ≥ 44×44px recommended (WCAG 2.2 minimum 24×24px) |
| **Scroll behaviour** | Header remains usable on long pages; no content hidden beneath it on anchor jumps |

### 9.5 Footer

A designed footer, not a link dump: HENU positioning line, the six primary links, product links, service categories, contact details (from Admin site settings), legal links (Privacy, Terms), and — when confirmed — supporting links such as documentation or security contact. Includes the theme switch as a duplicate on mobile if needed. Footer structure collapses on mobile into a stacked, expandable arrangement.

---

## 10. Homepage

### 10.1 Job of the homepage

Establish HENU's overall identity and route visitors. It must quickly answer:

1. What is HENU?
2. What does HENU build?
3. What products exist?
4. What services does HENU provide?
5. What has HENU built?
6. Why trust/explore HENU?
7. What should I do next?

It has a **strong visual presence without being overloaded.** Not every section is equally loud.

### 10.2 Loudness map (hierarchy)

| Section | Loudness | Reason |
|---------|---------|--------|
| 1. Opening statement | **Loudest** | Identity; the one big moment |
| 2. Ecosystem | **Loud** | The core idea; interactive visual |
| 3. HENU OS flagship | **Loud (different mode)** | Product visualisation moment |
| 4. Services index | Quiet, typographic | Dense, scannable, editorial list |
| 5. Portfolio feature | Medium (image-led) | Proof of work |
| 6. Why HENU / evidence | Quiet | Confirmed facts only |
| 7. About teaser | Medium | Invitation into story |
| 8. Closing paths | Medium, calm | Dual conversion |

### 10.3 Recommended composition (sequence with reasoning)

The sequence balances the PRD's product-led positioning with the fixed nav order (Services before Products): the **homepage leads with identity and ecosystem**, then products, then services, then proof.

| # | Section | Composition | Content | CTA |
|---|---------|------------|---------|-----|
| **1** | **Opening statement** | Asymmetric: very large `display-xl` statement occupying ~7 columns; a chromatic *Spectrum* field bleeding from the right/bottom edge; a short supporting line; no carousel | A specific statement of what HENU is and builds `[REQUIRES CONFIRMATION: final wording]` | Primary: **Explore the ecosystem** (to Products); Secondary: **Start an enquiry** |
| **2** | **Ecosystem** | Full-width visual model: HENU OS as the ground layer with HENU AI, PA and IDE as layered fields; hover/tap/keyboard selects a product to reveal a one-line role and link; mobile uses a stacked, tappable version | Only confirmed relationships `[REQUIRES CONFIRMATION]` | Per-product links |
| **3** | **HENU OS flagship band** | Large product visualisation (real screenshots/recordings if available, otherwise art-directed illustration marked as illustrative); display-type headline; two or three confirmed capability statements; calm background | Confirmed information only (Section 13) | **Explore HENU OS** |
| **4** | **Services index** | **Editorial list**, not a card grid: numbered rows with service name in display type, one-line descriptor, and a hover/focus reveal of related capability; grouped by category | Services from the catalogue; **no prices** | **View services**; each row links to its section |
| **5** | **Portfolio feature** | One large featured project plus two offset smaller projects (dynamic, from Admin "featured" flag); asymmetric | Real projects; no fabricated outcomes | **View portfolio** |
| **6** | **Why HENU / evidence** | A calm typographic section: what HENU has built, how it works (real process if confirmed), what is available now vs. in development | Only confirmed facts; no numbers unless verified and sourced | None or **About HENU** |
| **7** | **About teaser** | Scroll-reactive or static image treatment linking to the About storytelling experience; optional lightweight 3D (lazy; see §31) | Brief narrative hook | **Read the HENU story** |
| **8** | **Closing paths** | Two clear paths side by side (stacked on mobile): **Send an enquiry / request a quote** and **Schedule a meeting** | Short framing text | The two primary conversion actions |

### 10.4 Homepage rules

- **No** "hero + three cards + six cards + testimonials + CTA" structure.
- **No testimonials** unless real, permissioned and confirmed `[REQUIRES CONFIRMATION]`.
- **No fabricated counters** (customers, downloads, years, projects).
- **Content order is data-driven where dynamic** (e.g., featured portfolio), **layout is fixed**.
- **Above the fold** must work without JavaScript and without WebGL; the largest element is type plus a static field, ensuring a fast Largest Contentful Paint.

---

## 11. Products

### 11.1 Products hub (`/products`)

Not a uniform card grid. An **ecosystem-first layout**: the layered ecosystem model (as on Home, expanded), then **four distinct product presentations** that share a structure but not a template skin:

| Product | Hub treatment |
|---------|--------------|
| **HENU OS** | Largest, flagship band with product visualisation |
| **HENU AI** | Medium, capability-led composition (Tidal) |
| **HENU PA** | Medium, voice/conversation-led composition (Saffron) |
| **HENU IDE** | Medium, workflow-led composition (Mulberry) |

Each presentation answers: **what it is, who it is for, what problem it addresses, capabilities, experience, relationship to HENU/other products, relevant CTA.** All facts `[REQUIRES CONFIRMATION]`.

### 11.2 Product page template ("Product Story")

A shared narrative backbone with a **signature module per product** so pages feel related, not identical.

| Block | Purpose |
|-------|--------|
| **Head** | Product name, one-line definition, status label (Available / Beta / In development / Coming soon), product-tinted field, primary CTA |
| **Why it exists** | The problem it addresses (confirmed) |
| **Experience** | The signature module (below) |
| **Capabilities** | A small set of confirmed capabilities, presented as structured explanations, not a bullet dump |
| **Ecosystem relationship** | Where this product sits relative to the others (reuses the ecosystem model, highlighted) |
| **Evidence** | Real screenshots, recordings, releases, related portfolio items; no metrics unless sourced |
| **Next action** | Product-specific CTA (Explore, Download, Join waitlist, Request demo, Enquire) |

| Product | Signature module (illustrative; subject to confirmed content) |
|---------|------------------------------------------------------------|
| **HENU OS** | "The environment": real interface imagery/recording; voice and developer-workflow narrative; relationship to PA/AI/IDE |
| **HENU AI** | "Capabilities explorer": an interactive, accessible selector of confirmed capabilities (no invented model specs) |
| **HENU PA** | "A conversation": a scripted, clearly-illustrative voice-interaction depiction (must be labelled as illustration unless it is a real recording) |
| **HENU IDE** | "A workflow": a stepwise depiction of a developer's flow with AI assistance, using real screenshots where available |

### 11.3 Status labelling

Every product carries an honest status label (data-driven from Admin). Statuses must never be implied through imagery (e.g., a download button for an unreleased product).

### 11.4 Pages

`/products`, `/products/henu-os`, `/products/henu-ai`, `/products/henu-pa`, `/products/henu-ide`, and a generic `/products/[slug]` template for future products. Product *content* is Admin-managed; the *template and signature module types* are code-defined (Section 22).

---

## 12. Flagship Product — HENU OS

### 12.1 Prominence

HENU OS receives stronger visual weight: more space on Home, a dedicated flagship band, and the richest product page.

### 12.2 Presentation (only where confirmed)

| Topic | Presentation | Confirmation |
|-------|-------------|--------------|
| OS interface / desktop environment | Real screenshots or recordings; if none exist, **art-directed illustration clearly not claiming to be the real UI** | `[REQUIRES CONFIRMATION]` |
| Developer workflow | Narrative section tied to HENU IDE | `[REQUIRES CONFIRMATION]` |
| Voice interaction | Story section tied to HENU PA | `[REQUIRES CONFIRMATION]` |
| AI relationship | Relationship diagram with HENU AI | `[REQUIRES CONFIRMATION]` |
| Ecosystem | Reuses the ecosystem model, HENU OS highlighted | `[REQUIRES CONFIRMATION]` |
| Get / explore | State-driven CTA: Download, Join waitlist, or Explore, depending on release status | `[REQUIRES CONFIRMATION: release status]` |
| Release information | If a release exists, a compact release block (version, date, architecture, SHA-256) driven by release metadata per doc 02 | `[REQUIRES CONFIRMATION]` |

### 12.3 Content authenticity rule for HENU OS

**Do not invent**: performance benchmarks, RAM or hardware requirements, latency, boot time, kernel information, supported hardware lists, download counts, user counts, certifications, or any technical metric. If it is not confirmed, it is not displayed, and the page must remain compelling without it.

### 12.4 Separation of layers

HENU OS marketing lives on the product page. **Documentation and detailed download/installation content are separate** (supporting pages, V1.1 where not ready), linked from the product page and footer but **not** primary navigation, consistent with Section 2.

---

## 13. HENU AI, HENU PA, HENU IDE

Each follows the Product Story template (Section 11.2) with its own signature module and hue. Common requirements:

- Facts only from confirmed source material.
- A clear "relationship to HENU OS and the others" block.
- A status label and a CTA that matches reality.
- No capability claims that are not confirmed (e.g., model counts, supported languages, accuracy, speed).
- Distinct composition per product: **related, not visually identical** (different signature module, hue tint of the field, and layout rhythm), while sharing type, grid, components and the Ember action colour.

---

## 14. Services

### 14.1 Source of truth and scope

The **service catalogue supplied by HENU** is the source for categories, descriptions, capabilities, benefits, outcomes and supporting information `[REQUIRES CONFIRMATION: catalogue content to be supplied and transcribed]`. This document does not restate or invent that content.

Catalogue services identified so far: **Website Development, Graphic Design, AI Automation, Mobile App Development, Digital Marketing, Documentation & Startup Services, Legal Services, Funding Solutions, Software Solutions.**

### 14.2 No pricing — hard rule

The public site displays **no** prices of any kind: no package prices, price ranges, tax-inclusive/exclusive figures, add-on pricing, payment package tables, "starting at" values, or discount language. Services are **informational and enquiry-driven**. A future payment gateway may be introduced later; **it is not in the current UI scope** and must not be hinted at with placeholder pricing UI.

### 14.3 Proposed grouping (for the Services index)

Proposed categories to make the catalogue legible and scalable `[REQUIRES CONFIRMATION]`:

| Category | Services |
|----------|---------|
| **Build** | Website Development · Mobile App Development · Software Solutions |
| **Intelligence** | AI Automation |
| **Brand & Growth** | Graphic Design · Digital Marketing |
| **Business Foundations** | Documentation & Startup Services · Legal Services · Funding Solutions |

Categories are Admin-managed data so HENU can add or rename them.

### 14.4 Sensitive services — wording care

**Legal Services** and **Funding Solutions** carry regulatory, professional-conduct and expectation-setting risks. Requirements `[REQUIRES CONFIRMATION]`:

- Describe the **nature of assistance** accurately and who delivers it; avoid implying regulated professional status unless true.
- **Never promise outcomes** (for example approvals, funding amounts or timelines).
- Include any required disclaimers in the service content; they are mandatory fields that block publication if empty.
- Legal review of final wording before publication.

### 14.5 Services page experience (`/services`)

Not a large grid of cards. A **typographic, editorial index** that expands into per-service sections.

| Layer | Treatment |
|-------|-----------|
| **Intro** | A short statement framing HENU's services as part of a technology company (not freelance listings) |
| **Index** | Numbered ledger rows grouped by category; each row: service name (display type), one-line descriptor, link/anchor |
| **Service sections** | One editorial section per service following **Problem → HENU capability → Approach → Solution → Outcome**, using catalogue content. Where the catalogue lacks a part, the section omits it rather than inventing it |
| **Capability visualisation** | Service-specific, simple visual (diagram or illustration) tied to real capability; no generic icons-in-circles |
| **Process** | A shared, **real** HENU process strip if confirmed `[REQUIRES CONFIRMATION]`; otherwise omitted |
| **Related work** | Linked portfolio items relevant to each service (from Admin relationships) |
| **CTA** | Contextual: **Discuss this service** (opens the enquiry path with the service pre-selected); secondary **Schedule a meeting** |

### 14.6 Service detail pages (`/services/[slug]`)

Provided for scalability and SEO: the same content structure as the section but with room for deeper content and related projects. The index can display all services in V1; detail pages are populated where catalogue content is sufficient.

### 14.7 Scalability

Adding a service is an Admin action (create service → assign category → fill structured blocks → publish). No design or code change is required; the template adapts.

---

## 15. Portfolio

### 15.1 Role and data

Portfolio presents **projects and products built by HENU**, e.g. HENU Housing Accounting ERP, HENU WhatsApp Automation, HENU Mail, and future projects `[REQUIRES CONFIRMATION: which items are public and in what form]`. It is **dynamic**: the Admin Panel can add, edit, delete, reorder, feature, and re-categorise projects. **Nothing is hardcoded.**

### 15.2 Project data model (UI-level; schema detail belongs to implementation)

| Field group | Fields |
|-------------|--------|
| **Identity** | Title, slug, short summary, category(ies) |
| **Status** | Live / In development / Internal / Archived `[REQUIRES CONFIRMATION: taxonomy]` |
| **Media** | Cover image, gallery (images/video), alt text (required), focal point |
| **Story** | Structured content blocks: Challenge, Approach, Solution, Technology, Outcome, Evidence (all optional; omitted if unknown) |
| **Technology** | Technology tags (managed vocabulary) |
| **Links** | Live URL, related product, related service(s) |
| **Metadata** | Year/period, client/permission status `[REQUIRES CONFIRMATION]`, featured flag, display order, visibility, SEO title/description, Open Graph image |
| **Lifecycle** | Draft / Published; created/updated; soft-delete |

**Outcomes and metrics:** only if verified and sourced; the content schema requires `source` and `owner` for any metric. If no metric exists, use qualitative evidence. **Never fabricate outcomes.**

### 15.3 Portfolio index experience (`/portfolio`)

Avoid a generic three-column card grid.

| Element | Treatment |
|---------|-----------|
| **Featured area** | One or more featured projects shown large and image-led, with an editorial caption |
| **Index composition** | **Asymmetric rhythm** driven by a fixed pattern of layout "slots" (large, tall, wide, small) assigned *automatically by order*, so growth in the number of projects does not require redesign and admins do not hand-place pixels |
| **Filtering** | Category filter (and technology filter in V1.1) as accessible toggle buttons; filter state reflected in the URL; works with progressive enhancement |
| **Project preview** | Hover/focus reveals a short descriptor; touch shows it by default; cards are fully keyboard-operable |
| **Empty state** | Designed message when a category has no projects |
| **Pagination/loading** | "Load more" or paginated for large sets; no infinite scroll without keyboard/screen-reader consideration |
| **Single project** | Graceful layout (the composition handles 1, 2, 3… N projects without looking broken) |

### 15.4 Portfolio detail (`/portfolio/[slug]`)

A **case-study storytelling** page: cover/hero media, project summary, then optional structured blocks (Challenge → Approach → Solution → Technology → Outcome → Evidence), gallery, related service/product, next/previous project. Sections with no content are omitted. Transition from index to detail may use a shared-element transition in V1.1.

---

## 16. About Us

### 16.1 Not a generic page

About Us must **not** be a Mission/Vision/Team template. It is a **distinctive HENU storytelling experience** that explains what HENU is, how its products relate, and how it works.

### 16.2 Narrative structure (content `[REQUIRES CONFIRMATION]`)

| Chapter | Intent | Visual treatment |
|---------|--------|------------------|
| **1. Origin / why HENU exists** | The motivation behind HENU | Large type; chromatic field |
| **2. The ecosystem** | How OS, AI, PA, IDE connect | Interactive ecosystem model; possibly the 3D asset |
| **3. How HENU builds** | Product thinking and engineering approach (real) | Process/ledger composition |
| **4. What HENU does for others** | Services as the applied side of the company | Link to Services and Portfolio |
| **5. Evolution / timeline** | Only verified milestones | Timeline with real dates; omitted if unverifiable |
| **6. People & values (if appropriate)** | Real team information if HENU wants it public | Restrained; values expressed through real behaviours |
| **7. Invitation** | Next steps | Dual CTA (enquiry / meeting) |

### 16.3 Scroll storytelling and 3D (see §31)

- **Scroll-driven chapters** with restrained motion; each chapter is fully readable without motion.
- The **provided HENU 3D (GLB) assets** `[REQUIRES CONFIRMATION: assets, their meaning, size, licence]` may be used where they **explain** something (e.g., product relationship, brand object), not as decoration.
- **V1 foundation:** a complete, static, well-designed About page (type, fields, imagery, ecosystem model), with the structure ready for the 3D/scroll layer.
- **V1.1:** richer scroll storytelling and the interactive 3D scene.
- **No critical content exists only inside the 3D canvas.** A static fallback is always present.

### 16.4 Admin-editable

About content (chapters' text, images, timeline entries) is editable as structured blocks. The scene logic and animation choreography are code-defined.

---

## 17. Contact Us

### 17.1 Two clear conversion paths

The page presents **two paths**, understandable at a glance and never competing:

| | **Option 1 — Send an enquiry / request a quote** | **Option 2 — Schedule a meeting** |
|---|---|---|
| **For** | People who want to describe a need in writing | People who prefer a conversation |
| **Mechanism** | Structured enquiry form | Opens the configured HENU Calendly destination |
| **Visual weight** | Primary panel (larger) | Secondary panel (clear, distinct) |

**Do not build a custom calendar system.**

### 17.2 Page composition

- **Desktop:** two columns, enquiry form (wider) and meeting panel (narrower), with HENU contact details beneath. A short framing statement above.
- **Tablet/mobile:** stacked; a **path selector** at the top lets the visitor jump to either path; the form is first, the meeting CTA second (or reversed via the selector).
- Contact details (email, location, social) come from Admin **Site Settings** `[REQUIRES CONFIRMATION]`.

### 17.3 Enquiry form (UX specification; security per doc 03 §38)

| Field | Required | Notes |
|-------|:--------:|-------|
| Name | Yes | |
| Email | Yes | Validated format |
| Organisation / company | Optional | |
| What are you interested in? | Optional select | Options generated from the dynamic services/products list (including "General") |
| Message / project description | Yes | Length limit shown (character counter) |
| Phone | **Not by default** | Add only if the business process requires it `[REQUIRES CONFIRMATION]` (data minimisation) |
| Consent/notice | As required | Wording from legal review `[REQUIRES CONFIRMATION]` |

**No pricing/budget fields** that imply price packages. A "timeline" or "budget range" field is **not** included unless explicitly requested `[REQUIRES CONFIRMATION]`.

**Behaviour:** progressive enhancement; inline, accessible validation (errors identified in text and programmatically linked); preserved input on error; clear pending state; success state with next steps; failure state with an alternative contact method; honeypot/timing/rate-limit protections are invisible to users (doc 03 §19); no CAPTCHA by default.

### 17.4 Schedule a meeting (Calendly)

- A prominent button opens the **configured Calendly destination** (URL stored in Admin Site Settings `[REQUIRES CONFIRMATION: URL]`).
- Recommended baseline: **link-out** (new tab) with clear labelling. Optional enhancement: an on-demand embedded popup that loads Calendly's script **only after the user clicks**, never on page load, to protect performance and privacy.
- Third-party script allowances must be reflected in CSP (doc 03 §31); a failure to load must degrade to the plain link.
- No Calendly script on any page other than where the user chooses to open it.

### 17.5 Service pre-selection

Entering the contact page from a service or product page pre-selects the relevant interest (via URL parameter, validated against the allowlist of known services/products).

---

## 18. Responsive Design System

### 18.1 Breakpoints and design widths

| Class | Range | Design focus width |
|-------|-------|-------------------|
| **Mobile** | < 640px | 360–430px |
| **Tablet** | 640–1023px | 768px (portrait), 1024px (landscape handled as small desktop) |
| **Desktop** | 1024–1439px | 1280px |
| **Large desktop** | ≥ 1440px | 1440–1680px; content capped (max container ≈ 1440px); ultra-wide adds margin, not stretch |

### 18.2 Layout change matrix (real changes, not scaling)

| Element | Mobile | Tablet | Desktop | Large desktop |
|---------|--------|--------|---------|---------------|
| **Grid** | 4 columns, 16–20px gutters/margins | 8 columns | 12 columns | 12 columns, capped width |
| **Navigation** | Compact bar + full-screen menu | Bar + overlay panel | Full horizontal bar, optional product/service panels | Same, more breathing room |
| **Header** | Logo + theme + menu button | Logo + theme + CTA + menu | Logo + nav + theme + CTA | Same |
| **Typography** | Smaller fluid sizes; `display-xl` ~44px; tighter measure | Mid sizes | Full scale | Max scale (`display-xl` ~120px) |
| **Spacing** | Section spacing ~64–80px | ~88–112px | ~120–160px | ~160–200px |
| **Home opening** | Statement stacked above a cropped field; CTAs full-width stacked | Statement + field side-by-side in 7/5 | Asymmetric 7/5 with field bleed | Wider field, more white space |
| **Ecosystem model** | **Vertical stack of tappable layers** with expanding details | Condensed diagram with tap targets | Full interactive diagram | Same, larger |
| **Products hub** | Single column; flagship first; each product a distinct block | Two-column with flagship full-width | Asymmetric multi-column | Same |
| **Services** | Index rows full-width; sections single column; expandable details | Two-column sections | Index + section side-by-side or alternating | Same |
| **Portfolio** | Single column list, large images, filter as horizontally scrollable chips or a select | Two-column asymmetric | Asymmetric slot pattern (3–4 visual columns) | Wider slots |
| **Portfolio detail** | Stacked blocks; gallery as swipeable carousel with controls and counters | Two-column blocks | Editorial two-axis layout | Same |
| **About** | Chapters as full-width vertical sections; **3D replaced by static image or a simplified viewer on interaction** | Chapters with optional light 3D | Full scroll storytelling with 3D | Same |
| **Contact** | Path selector + stacked panels; large inputs; sticky submit area not required | Stacked or 2-col | Two columns | Same |
| **Forms** | Single column, large targets, native input types (email, tel), autocomplete attributes | Single or two column | Two columns where it helps | Same |
| **Images** | Art-directed crops; smaller sizes; lazy-loaded | Mid | Full | Larger variants (still optimised) |
| **3D** | Static fallback by default; load only on user action (§31) | Optional, lazy | Lazy-loaded in view | Same |
| **Footer** | Stacked/accordion groups | Two columns | Multi-column | Same |
| **Interactions** | Tap, swipe; no hover-dependent features | Tap + hover | Hover + focus + keyboard | Same |
| **Content order** | Conversion actions earlier in the flow; supporting visuals after text | Hybrid | Visual-first allowed | Same |
| **CTA placement** | Inline, thumb-reachable; optional persistent bottom action on conversion pages | Inline | Inline + header | Inline + header |

### 18.3 Responsive rules

- **No horizontal scrolling** of the page body at any width (technical content scrolls within its own container).
- **Orientation changes** are handled without layout breakage.
- **Text scaling and 200% zoom** do not break layouts or hide content.
- **Content never depends on hover.**
- **Safe-area insets** are respected on devices with notches/system bars.
- **Container queries** may be used for components that must adapt to their container rather than the viewport.
- **Visual regression** checks at all four classes are part of QA.

---

## 19. Mobile Website (Public Site on Mobile Devices)

> "Mobile" means **visitors opening the public HENU website on a phone**. There is **no mobile Admin app**.

Mobile is a **deliberately designed experience**, not a shrunken desktop.

| Area | Mobile design decision |
|------|----------------------|
| **Navigation** | Compact bar; full-screen editorial menu; thumb-friendly links; CTA in the menu; focus management for accessibility |
| **Hero/opening** | Statement leads; field is cropped and quieter; CTAs stacked, full-width, ≥ 48px high; no autoplaying video |
| **Typography** | Fluid scale; `display-xl` reduced; line lengths shortened; body ≥ 16px; avoid orphaned single words in headlines |
| **Ecosystem** | Vertical stack of four tappable product layers; expand-in-place details; no hover requirement |
| **Products** | Flagship first and largest; each product block distinct; signature modules simplified (for example, scripted conversation as stepwise cards) |
| **Services** | Index rows large and tappable; sections collapse to concise views with "read more"; CTA repeated after each service group |
| **Portfolio** | Single-column list with large imagery; category chips scrollable or select control; project detail with swipeable gallery and visible controls |
| **About** | Chapter-by-chapter vertical story; **3D deferred behind an explicit "View in 3D" interaction** or replaced by a poster; scroll effects simplified |
| **Contact** | Path selector, large inputs, correct mobile keyboards and autofill, clear error messages, large submit button, Calendly as an obvious secondary action |
| **Forms** | Single column; labels always visible (no placeholder-only labels); input types and `autocomplete`; avoid modal-heavy flows |
| **Imagery/3D** | Smaller, art-directed crops; lazy loading; strict byte budgets; WebGL not required |
| **CTA placement** | Within reach; not hidden behind sticky overlays; no intrusive pop-ups |
| **Footer** | Collapsible groups; contact details tappable (`tel:`/`mailto:` only for confirmed contacts) |
| **Interactions** | Tap targets ≥ 44px; swipe gestures always have visible button alternatives; no gesture-only functionality |
| **Performance** | Mobile is the **primary performance reference** (Section 33) |

**Mobile must avoid:** overlap, horizontal overflow, broken grids, tiny text, cramped spacing, inaccessible controls, and awkward desktop remnants.

---

## 20. Accessibility

### 20.1 Target

**WCAG 2.2 Level AA** where practical `[REQUIRES CONFIRMATION: formal target]`, for both public site and Admin.

### 20.2 Requirements

| Area | Requirement |
|------|------------|
| **Semantic HTML** | Correct landmarks, one `main`, logical heading hierarchy; native elements before ARIA |
| **Keyboard** | Every function operable by keyboard; no traps; logical order; skip link |
| **Visible focus** | Two-tone focus ring on all interactive elements, meeting contrast against adjacent colours; focus never hidden behind sticky headers (**WCAG 2.2: Focus Not Obscured**) |
| **Contrast** | Text 4.5:1 (3:1 large); UI components and graphical objects 3:1; verified in both themes |
| **Forms** | Persistent visible labels; programmatically associated hints and errors; error summary; clear required/optional; no placeholder-only labelling; autocomplete attributes (WCAG 1.3.5); **Redundant Entry** avoided (don't ask for the same info twice) |
| **Target size** | Interactive targets ≥ 24×24px minimum (WCAG 2.2), **44×44px recommended** for touch |
| **Dragging** | Any drag interaction (including Admin reordering) has a **non-drag alternative** (WCAG 2.2: Dragging Movements) |
| **Authentication** | Admin sign-in avoids cognitive-function tests; supports password managers and paste (WCAG 2.2: Accessible Authentication) |
| **Consistent help** | Contact/help location consistent across pages (WCAG 2.2) |
| **Screen readers** | Accessible names, roles and states; live regions for async status (form results, theme change); decorative art `aria-hidden` |
| **Alt text** | Required for informative images (Admin enforces); decorative images use empty alt |
| **Media** | Captions/transcripts for video; no autoplaying audio; pausable motion |
| **Reduced motion** | `prefers-reduced-motion` honoured: parallax, scroll-linked motion, drifting fields and 3D auto-rotation are disabled or replaced with static equivalents; essential information is never conveyed only through motion |
| **Motion safety** | No flashing content above thresholds |
| **Dialogs & menus** | Proper focus management, Escape to close, return focus, labelled |
| **Theme switch** | Accessible name, current state announced (e.g., "Theme: Light", pressed/selected state), keyboard operable, persisted |
| **3D/Canvas** | Text alternative and static fallback; canvas does not trap focus; controls reachable via keyboard where interactive |
| **Zoom/reflow** | Usable at 200% zoom and 320px width without two-dimensional scrolling (except data tables/code) |
| **Language** | `lang` set; changes in language marked |
| **Admin** | Same standards; tables with proper headers; complex widgets (rich-text, media picker) keyboard accessible |
| **Testing** | Automated checks in CI + manual keyboard and screen-reader passes on critical journeys (home, product, enquiry, admin sign-in, portfolio management) |

### 20.3 Colour-independence

State and meaning are always communicated by at least one non-colour cue (icon, text, shape, underline, weight, position). See Section 29.

---

## 21. Admin Panel — Scope and Philosophy

### 21.1 Scope

The Admin Panel is a **web application only**. There is no mobile Admin app. It should be usable on laptop/desktop and remain functional on tablets, but optimisation is for desktop-class screens.

### 21.2 Philosophy

| Public site | Admin |
|-------------|-------|
| **Brand + Emotion + Storytelling + Conversion** | **Efficiency + Clarity + Control + Accuracy** |

The Admin may be **information-dense**: tables, forms, media management, editing, statuses, validation, confirmations, search/filter. It **must not** look like the public site, and the public site must not look like a dashboard.

### 21.3 Admin visual language

- Same **design tokens** (colour, type, radius, motion), used in a **utilitarian subset**: no chromatic field, no display-serif decoration (headings may use `heading-3/4` text family; the display serif is optional for page titles only).
- Higher density spacing scale, compact controls, clear tables.
- Light and dark themes both supported (light default).
- Strong state clarity (draft / published / archived / error).

### 21.4 Admin structure

| Area | Contents |
|------|---------|
| **App shell** | Left sidebar navigation (collapsible), top bar (search, user menu, environment indicator, theme switch), content area with breadcrumbs |
| **Dashboard** | Overview: new enquiries, drafts awaiting publish, recent changes, content health (missing alt text, unpublished items, unconfirmed placeholders). **No vanity metrics** unless real analytics exist `[REQUIRES CONFIRMATION]` |
| **Home Management** | Edit home content blocks (opening statement, section content, featured selections, CTA text), media; preview |
| **Service Management** | List/create/edit/delete services and categories; structured blocks; media; ordering |
| **Product Management** | List/create/edit/delete products; status labels; capabilities; media; relationship settings; **signature module content slots** |
| **Portfolio Management** | List/create/edit/delete projects; categories; technologies; media; featured flag; ordering; visibility |
| **About Management** | Edit chapters, timeline entries, media; preview |
| **Enquiry Management** | List with filters (status, type, date), detail view, status changes, notes; plain-text rendering of enquiry content (doc 03 §14) |
| **Media Library** | Upload, browse, search, alt text, usage references, deletion safeguards |
| **Site Settings** | Contact details, social links, Calendly URL, SEO defaults, header CTA label, footer content, announcement banner `[REQUIRES CONFIRMATION]` |
| **Users & access** | V1: admin identity management via the auth system and allowlist; V1.1+: roles (RBAC, doc 03 §10) |
| **Audit log** | Admin writes and publishes (doc 03 §28/§39) |

### 21.5 Admin UI patterns

| Pattern | Requirements |
|---------|-------------|
| **Data tables** | Sortable columns, filters, search, row selection, pagination, empty/loading/error states, keyboard navigation, accessible headers |
| **Forms** | Sectioned, inline validation, required indicators, autosave drafts optional, unsaved-changes warning, accessible errors |
| **Rich content editing** | **Constrained structured editor** (Section 22.5); no raw HTML input |
| **Media picker** | Search, upload, preview, alt-text prompt, usage warnings |
| **Status model** | Draft → Published → Archived (soft delete), with clear badges (icon + text) |
| **Preview** | "Preview as visitor" for every content type before publishing |
| **Confirmations** | Destructive actions (delete, unpublish) require explicit confirmation; **soft delete with recovery window**; critical actions per doc 03 §39 |
| **Validation** | Publish gate rejects unconfirmed placeholders, missing alt text, missing required disclaimers (Section 22.6) |
| **Search/filter** | Where lists can grow (portfolio, enquiries, media) |
| **Reordering** | Drag **and** keyboard alternatives |
| **Notifications** | Non-blocking toasts for success; persistent messages for errors |
| **Concurrency** | Last-write-wins is risky for multiple admins; show "edited by X" and warn on conflicts (V1.1) |

---

## 22. Content Management Model

### 22.1 Principle: "Everything editable" interpreted intelligently

The Admin controls **meaningful business content**; the **visual design system stays centrally controlled** to prevent inconsistency. There is **no free-form page builder**.

### 22.2 Editable vs. fixed

| Admins can edit | Admins cannot edit (design/code-controlled) |
|----------------|--------------------------------------------|
| Text content within defined fields and blocks | Colours, fonts, spacing, radii, shadows, motion |
| Images and media (within the media pipeline) | Layout grids, section structure and ordering of fixed templates |
| Service, product and portfolio records | Component design and behaviour |
| Category and technology vocabularies | Navigation structure (primary six items) |
| Featured selections and ordering | Template selection beyond defined variants |
| CTA labels and destinations (validated) | Raw HTML, scripts, or custom CSS |
| SEO titles, descriptions, Open Graph images | Security-sensitive configuration |
| Contact details, social links, Calendly URL | Theme tokens |
| Home and About content blocks | 3D scene choreography and animation logic |
| Visibility (draft/publish) | Product signature-module logic (content slots are editable; module types are not) |

### 22.3 Content domains and models

| Domain | Model | Editing scope |
|--------|-------|---------------|
| **Home** | Fixed template with named content slots (opening statement, ecosystem captions, flagship text, services intro, evidence block, closing paths) + featured selection (portfolio, products) | Slot text, media, CTAs, featured items |
| **Services** | Collection: categories + services; each service = structured blocks (Problem, Capability, Approach, Solution, Outcome, FAQs, disclaimers), media, related projects | Full CRUD |
| **Products** | Collection: products with status, definition, capabilities, ecosystem relationships, evidence, CTA configuration, signature-module content slots | Full CRUD (template and module type fixed) |
| **Portfolio** | Collection: projects (Section 15.2) | Full CRUD, ordering, featuring |
| **About** | Fixed template with chapters as ordered structured blocks; timeline entries | Text, media, timeline entries |
| **Contact** | Site Settings + Enquiry management | Settings, enquiry statuses |
| **Footer / header CTA / global** | Site Settings | Text, links |

### 22.4 Content blocks (allow-list)

Pages are composed of **predefined block types** within fixed templates, each with a strict schema:

`Heading + text` · `Rich paragraph (constrained)` · `Image (with alt text and caption)` · `Gallery` · `Video (hosted/embed with facade)` · `Quote (real, attributed, permissioned)` · `Key facts list (sourced)` · `Process steps` · `Capability list` · `Related items` · `CTA` · `FAQ item` · `Disclaimer`.

Adding a new block type is a **development task** (it requires design and accessibility review), not an Admin action.

### 22.5 Rich text and safety

- Rich text is **structured** (a constrained set of marks: bold, italic, link, ordered/unordered list, heading levels within limits), stored as **structured data (not raw HTML)**, rendered by trusted components.
- Links validated (allowed schemes; `rel` attributes); no scripts, iframes or arbitrary embeds; embeds limited to allowlisted providers via facades.
- This implements doc 03 §14 and §30: **admin-authored content is not automatically trusted.**

### 22.6 Publish gate (content authenticity enforcement)

Admins cannot publish an item that contains:

- an unconfirmed-placeholder marker such as `[REQUIRES CONFIRMATION]`;
- missing alt text for informative images;
- price-like content in service records (a simple pattern warning/blocker; services are non-priced);
- an unverified metric (metrics require `source` and `owner`);
- missing required disclaimers (Legal/Funding services).

Staging environments display unconfirmed placeholders visibly so content owners can see what remains.

### 22.7 Media pipeline (design-level)

Uploads are validated and processed per doc 03 §20 (type allowlist by content inspection, size limits, random identifiers, metadata stripping, cookieless media origin). Processing generates **responsive variants and modern formats** automatically; admins never choose pixel dimensions. Alt text is required; focal point selection supports art-directed crops. Large videos are stored in object storage/CDN or a managed video platform (doc 02), not in the application bundle. `[REQUIRES CONFIRMATION: media storage provider]`

### 22.8 Performance interaction

Admin-managed content is **statically generated and revalidated on publish** (tag-based), so dynamic content does not turn the public site into a slow dynamic application (doc 02 §16–§17). Draft previews are dynamic and private.

---

## 23. Design Tokens

All visual values are defined once as **semantic CSS custom properties**, mapped into **Tailwind's theme** so utilities resolve to semantic roles. Components never contain raw colours or arbitrary values. Tokens are named by **role**, not appearance.

### 23.1 Colour tokens

| Group | Tokens |
|-------|--------|
| **Surface** | `surface-canvas`, `surface-default`, `surface-raised`, `surface-sunken`, `surface-inverse` |
| **Text** | `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse`, `text-on-accent`, `text-link` |
| **Border** | `border-subtle`, `border-strong`, `border-focus` |
| **Action** | `action-primary`, `action-primary-hover`, `action-primary-active`, `action-primary-text`, `action-secondary-*`, `action-disabled-*` |
| **Product** | `product-os`, `product-ai`, `product-pa`, `product-ide` (+ `-soft` tints for backgrounds) |
| **Semantic** | `status-success`, `status-warning`, `status-error`, `status-info` (each with `-bg` and `-text` pairs) |
| **Field (art)** | `field-spectrum`, `field-os`, `field-ai`, `field-pa`, `field-ide` (asset references, not flat colours) |
| **Utility** | `selection`, `overlay-scrim`, `grain-opacity` |

Each token has **light and dark** definitions. Theme switching changes the variable set at the root, not the components.

### 23.2 Typography tokens

`font-display`, `font-text`, `font-mono`; size/line-height/tracking/weight tokens per role in §8.4 (`display-xl` … `code`); fluid scale steps defined once.

### 23.3 Spacing tokens

Base unit **4px**. Scale: `space-0.5` (2) · `1` (4) · `2` (8) · `3` (12) · `4` (16) · `5` (20) · `6` (24) · `8` (32) · `10` (40) · `12` (48) · `16` (64) · `20` (80) · `24` (96) · `32` (128) · `40` (160) · `48` (192).
Semantic layout tokens: `gutter`, `page-margin`, `section-space-sm/md/lg`, `stack-*`, `container-max`, `container-narrow`, `container-reading`. These vary by breakpoint (Section 18.2).

### 23.4 Radius tokens

Restrained, not bubbly: `radius-none` 0 · `radius-sm` 4 · `radius-md` 8 · `radius-lg` 14 · `radius-xl` 24 (rare, imagery) · `radius-pill` (badges, theme switch, chips). Default controls use `radius-md`; cards use `radius-lg` at most; excessive rounding is avoided.

### 23.5 Border tokens

`border-hairline` 1px · `border-regular` 1.5px · `border-strong` 2px (focus and emphasis). Ledger rules use hairline in `border-subtle`. Focus ring: 2px offset ring using the two-tone scheme.

### 23.6 Elevation tokens

Minimal: `elevation-0` (none), `elevation-1` (warm, low-opacity, short blur: raised inputs/dialogs), `elevation-2` (menus, popovers), `elevation-3` (modals). Shadows are **warm-tinted** in light; in dark, elevation is conveyed by lighter surfaces and borders, with shadows nearly invisible.

### 23.7 Motion tokens

| Token | Value (recommended) | Use |
|-------|--------------------|-----|
| `duration-instant` | 80ms | Press feedback |
| `duration-fast` | 150ms | Hover, small state changes |
| `duration-base` | 240ms | Menus, toggles, reveals |
| `duration-slow` | 400ms | Panel and section transitions |
| `duration-slower` | 700ms | Rare, large editorial moments |
| `ease-standard` | smooth ease-in-out | General |
| `ease-emphasis` | decelerating (ease-out expo-like) | Entrances |
| `ease-exit` | accelerating | Exits |
| `motion-scale` | 1 (default) / 0 (reduced) | A single multiplier that reduced-motion mode sets to zero |

### 23.8 Other tokens

`z-index` scale (header, menu, dialog, toast), `breakpoint-*`, `aspect-*` (media ratios), `opacity-*`.

### 23.9 Token governance

- Tokens are defined in one place and documented; changes go through review.
- A token audit (automated lint) forbids raw hex values, arbitrary spacing values and ad hoc shadows in components.
- Admin and public use the same token set.

---

## 24. Component Architecture

### 24.1 Layering

```text
Design Tokens
    ↓
Primitives
    ↓
Patterns
    ↓
Sections
    ↓
Page Templates
    ↓
Pages
```

Mapping to the repository structure in document 02: **Primitives** → `components/ui`; **Patterns/Sections** → `components/features` and `components/layout`; **Templates/Pages** → `app/`. Primitives and patterns are **data-agnostic**; sections receive typed data via props from server components.

### 24.2 Primitives

| Primitive | Notes |
|-----------|-------|
| **Button** | Variants: primary (Ember), secondary (outline), tertiary (text), destructive (admin); sizes; icon support; loading state |
| **Link** | Inline and standalone; clear underline; external-link indication |
| **Input / Textarea / Select / Checkbox / Radio / Switch** | Consistent label/hint/error structure |
| **Badge / Status label** | Icon + text; product status variants |
| **Icon** | One consistent icon set; sized via tokens; decorative vs. meaningful handling |
| **Typography** | Heading, Text, Overline, Code components bound to type roles |
| **Container / Stack / Grid / Section** | Layout primitives bound to spacing tokens |
| **Dialog** | Accessible modal with focus management |
| **Tabs** | Accessible tabs |
| **Accordion / Disclosure** | Accessible expand/collapse |
| **Tooltip / Popover** | Used sparingly; never essential info |
| **Toast / Alert** | Status messaging |
| **Skeleton** | Loading placeholder |
| **Media** | Image, Video (facade), Poster, 3D viewer wrapper |
| **Theme switch** | Accessible toggle |
| **Visually hidden / Skip link** | Accessibility utilities |

Where complex accessible behaviour is needed (dialogs, menus, tabs, comboboxes), use a **vetted headless primitive library** rather than hand-rolling (doc 02 §20) `[REQUIRES CONFIRMATION: library]`.

### 24.3 Patterns

| Pattern | Purpose |
|---------|--------|
| **Product block** | Presents a product with status, definition, hue marker, CTA (variants: flagship, standard) |
| **Service row / Service block** | Ledger-style row; expanded editorial block |
| **Portfolio item** | Image-led item with slot variants (large, tall, wide, small) |
| **Project preview** | Hover/focus/tap preview |
| **CTA band** | Contextual call to action (single or dual path) |
| **Form group / Enquiry form** | Fields with validation, success/failure states |
| **Path chooser** | Contact path selector |
| **Ecosystem model** | The interactive product relationship visual |
| **Process strip** | Real process presentation |
| **Key facts list** | Sourced facts only |
| **Navigation panels** | Product/service panels |
| **Release block** | Compact release information (when available) |
| **Empty/error/loading states** | Consistent messaging |
| **Admin: data table, filter bar, media picker, structured editor, status badge, confirm dialog, audit entry** | Admin-specific patterns |

### 24.4 Sections

**Hero (Opening)**, **Ecosystem**, **Products**, **Services**, **Portfolio (featured and index)**, **About (chapters)**, **Evidence**, **Contact**, **Closing paths**, **Footer**, **Header**. Sections own layout composition and responsive behaviour; they are not configurable by Admin beyond content slots.

### 24.5 Page templates

| Template | Used by |
|----------|--------|
| **Home template** | Home |
| **Collection template** | Products hub, Services index, Portfolio index |
| **Product Story template** (with product variant) | Product pages |
| **Service detail template** | Service pages |
| **Case study template** | Portfolio detail |
| **Story/chapters template** | About |
| **Contact template** | Contact |
| **Content page template** | Privacy, Terms, simple pages |
| **System templates** | 404, error, maintenance |
| **Admin templates** | Dashboard, list/table, editor form, settings |

### 24.6 Component rules

- **Avoid unnecessary fragmentation:** a component exists when it has at least two uses or a clear accessibility/behavioural reason.
- **Server Components by default;** client islands only for interaction (theme switch, mobile menu, filters, form, ecosystem interactivity, optional viewer).
- **Composition over configuration:** prefer composing patterns to adding props that change appearance wholesale.
- **Reusable without identical pages:** variants (product hue, slot size) provide diversity.
- **Documentation:** each component documented with purpose, variants, states, accessibility notes, and do/don't examples (a living component catalogue, e.g., an internal route or workspace tool).
- **Testing:** component tests include accessibility assertions (doc 02 §26).

---

## 25. States

All interactive elements define the following states. **No state is communicated by colour alone.**

| State | Visual treatment | Non-colour cue |
|-------|-----------------|----------------|
| **Default** | Base appearance | n/a |
| **Hover** | Subtle tone/underline/shift; never the sole affordance | Underline, shift, cursor |
| **Active / pressed** | Slight depress/darken | Position/scale change |
| **Selected / current** | Fill or underline plus weight | `aria-selected`/`aria-current`, check icon or underline |
| **Focus** | Two-tone ring, always visible, ≥ 3:1 vs adjacent | Ring shape and offset |
| **Disabled** | Reduced emphasis | `disabled`/`aria-disabled`, not-allowed cursor, optionally explanatory text; still meets minimum legibility |
| **Loading** | Inline progress indicator inside the control; control remains stable in size; announced to assistive tech | Text change ("Sending…"), `aria-busy`, no layout shift |
| **Success** | Positive message with icon | Icon + text + live-region announcement |
| **Error** | Error message with icon; field border emphasised | Icon + text, linked via `aria-describedby`; summary at top of form; focus moved to summary or first invalid field |
| **Empty** | Designed empty state with explanation and next action | Illustration/text; for Admin lists, a "Create" action |
| **Skeleton** | Paper-tone placeholders matching final layout | `aria-busy`; shimmer disabled under reduced motion |
| **Offline/failed media** | Safe fallback image/poster and message | Text alternative |

Specific high-priority states: **enquiry form** (idle, validating, submitting, success, validation error, server failure with fallback contact), **theme switch**, **mobile menu**, **portfolio filter** (no results), **media loading**, **3D loading/failure/unsupported**, **Admin save/publish** (saving, saved, conflict, publish blocked with reasons).

---

## 26. Motion

### 26.1 Role

Motion is part of HENU's identity but is introduced **deliberately**. It must **explain** relationships, state and cause, and never decorate for its own sake. **Do not animate every component.**

### 26.2 V1 motion (restrained)

| Motion | Purpose |
|--------|--------|
| Subtle entrance reveals for key sections (opacity/translate, short) | Orientation, pacing |
| Hover/focus feedback on interactive elements | Affordance |
| Menu and panel open/close | Spatial continuity |
| Theme switch cross-fade | Smooth change |
| Ecosystem model selection transitions | Explain relationships |
| Basic route/loading transitions via framework boundaries | Perceived performance |
| Optional very slow field drift (CSS) on the opening only | Atmosphere; disabled under reduced motion |

### 26.3 V1.1 / completion-phase motion

Scroll storytelling (About), product-to-product transitions, image reveals, **shared-element portfolio transitions**, richer ecosystem animations, 3D interaction, HENU-specific loading experience, page transitions (View Transitions API or equivalent where supported `[VERIFY]`).

### 26.4 Rules

| Rule | Detail |
|------|--------|
| **Reduced motion** | `prefers-reduced-motion` sets `motion-scale` to 0: no parallax, drift, scroll-linked animation or auto-rotation; replaced by instant or opacity-only changes |
| **Performance** | Animate `transform`/`opacity` only; avoid layout-affecting animation; no continuous animation off-screen |
| **Library policy** | CSS-first; native browser APIs where possible; an animation library is added only with a documented need and measured cost (doc 02 §27) |
| **Duration discipline** | Use motion tokens; most transitions 150–400ms |
| **No motion-only information** | Everything conveyed by motion is also available statically |
| **User control** | Auto-playing or looping motion longer than 5 seconds can be paused (WCAG 2.2.2) |
| **Consistency** | Same easing and timing logic across the site |

---

## 27. Theming and Frontend Implementation Notes

### 27.1 Theme mechanism

A root-level attribute (for example, a `data-theme` value) selects the token set. Light is the **default in CSS**; dark overrides the semantic tokens. Components never branch on theme.

### 27.2 Default behaviour

First visit = light always. OS `prefers-color-scheme` is deliberately **not** consulted for the initial theme.

### 27.3 Persistence

The visitor's explicit choice is stored as a non-sensitive preference (first-party cookie or local storage). Choose the mechanism so that the **correct theme is applied before first paint** without defeating static caching: because light is the CSS default, only returning dark-mode visitors need a tiny pre-paint script to set the attribute. That inline script must be accounted for in the Content Security Policy (via a hash or nonce, doc 03 §16) `[REQUIRES CONFIRMATION: mechanism]`.

### 27.4 Imagery and theme

Assets that depend on theme (illustrations, field art, logo variants) provide light and dark versions chosen via CSS/`<picture>`, not JavaScript. The **HENU logo** requires light and dark variants `[REQUIRES CONFIRMATION: logo files]`.

### 27.5 Tailwind integration

Tailwind's theme maps semantic names (e.g., text, surface, border, action, product hues) to the CSS variables; arbitrary values and raw colours are lint-blocked. Dark variants are variable-driven, so most components need no `dark:` overrides.

---

## 28. Page Loading and Transitions

### 28.1 Principle

Lay a **foundation** for a future **HENU-specific loading experience**, without forcing a final loader into the base system. Avoid generic spinners wherever a more appropriate HENU treatment can be designed later.

### 28.2 System support (V1)

| Need | V1 foundation |
|------|---------------|
| **Initial page load** | Fast static HTML; no blocking loader for the public site; critical content visible immediately |
| **Route transitions** | Framework loading boundaries with skeletons matching final layouts |
| **Media loading** | Reserved aspect ratios (no layout shift), low-quality placeholders or tonal blocks, poster images |
| **3D loading** | Poster → on-demand load → progress indicator slot → fallback on failure |
| **Skeleton states** | Paper-tone, token-driven, motion-disabled under reduced motion |
| **Loader slot** | A defined, token-driven "loader" component slot (with `aria-busy` semantics and reduced-motion handling) where the HENU loading treatment will later be inserted |

### 28.3 V1.1 direction

A HENU-specific loading and transition experience (for example, the chromatic field resolving into the page, or a brand-specific progress motif), designed once the core site is stable. It must never block content or delay interaction, and must have a reduced-motion variant.

---

## 29. Media and Imagery System

### 29.1 Principles

- **Real over stock.** Use actual HENU product screenshots, recordings, project visuals and photography wherever available. **Do not use generic stock technology imagery** when real material exists.
- **Honest depiction.** Illustrations are labelled/treated as illustrations when they stand in for real UI.
- **Optimised always.** No unoptimised media reaches production.

### 29.2 Image classes

| Class | Source | Treatment |
|-------|--------|-----------|
| **Product imagery / screenshots** | Real product captures `[REQUIRES CONFIRMATION: availability]` | Shown without distortion; optional minimal frame; light/dark awareness; alt text describing real content |
| **Portfolio images** | Admin-uploaded project visuals | Art-directed crops via focal point; consistent aspect ratios per slot; responsive variants auto-generated |
| **Illustrations / diagrams** | HENU-authored (SVG preferred) | Light/dark variants; accessible text alternatives; consistent line/shape language |
| **Chromatic fields** | Authored art (Section 6.3) | Optimised raster/gradient; decorative |
| **Brand marks** | Logo files | SVG; light/dark variants |
| **Video** | Product recordings, project demos | Hosted on object storage/CDN or a managed video platform; facade loading; poster; captions; no autoplay with sound; short muted loops only if they pass the performance test |
| **3D (GLB)** | Provided assets | See Section 31 |
| **Photography (team/place)** | Real, permissioned `[REQUIRES CONFIRMATION]` | Consistent treatment; no stock substitutions presented as real people |

### 29.3 Technical standards

| Concern | Standard |
|---------|----------|
| **Formats** | Modern formats (AVIF/WebP) with fallbacks via the framework pipeline; SVG for vector; MP4/WebM for video |
| **Responsive** | Multiple widths, correct `sizes`; art direction via `<picture>` where crops differ |
| **Dimensions** | Always declared; reserved aspect ratios prevent layout shift |
| **Loading** | Above-the-fold priority for the single LCP image only; everything else lazy |
| **Compression** | Compressed before upload (and by the pipeline); size budgets per class `[REQUIRES CONFIRMATION: thresholds]` |
| **Alt text** | Required in Admin for informative images; decorative flagged |
| **Metadata** | Rights/source recorded for permissioned assets |
| **Aspect ratio tokens** | `aspect-hero`, `aspect-card`, `aspect-wide`, `aspect-tall`, `aspect-square`, `aspect-video` |
| **Placeholders** | Tonal placeholder (average colour) or blur-up until loaded |
| **CDN** | Served from the optimised image pipeline/CDN with long-lived caching |

---

## 30. Performance Alignment

The visual system must remain compatible with a high-performance Next.js implementation (doc 02 §17).

| Rule | Detail |
|------|--------|
| **Static-first** | Public pages statically generated; admin-published content revalidated on publish |
| **Server Components default** | Client JavaScript restricted to listed islands |
| **Client islands (expected V1)** | Theme switch, mobile menu, product/service panels, portfolio filter, enquiry form, ecosystem interactivity, optional on-demand Calendly/3D loaders |
| **LCP discipline** | The opening's largest element is type and an optimised field image, never WebGL or video |
| **Fonts** | Three families max, limited weights, self-hosted, metric-adjusted fallbacks |
| **Chromatic fields** | Static optimised assets or CSS, not live canvases |
| **3D** | Lazy, optional, with strict byte budgets and fallbacks (Section 31) |
| **Video backgrounds** | Not used in the base design; any hero motion must pass performance review |
| **Animation** | Transform/opacity only; no animation library in the baseline |
| **Images** | Optimised pipeline, responsive, lazy |
| **Third parties** | Minimal; Calendly only on user action |
| **Budgets** | Per-route JavaScript, image weight and Core Web Vitals thresholds **to be established** from a measured baseline and published standards `[REQUIRES CONFIRMATION]`; enforced in CI once defined |
| **Mobile first for performance** | Mobile mid-range device is the reference for measurement |

---

## 31. 3D / GLB

### 31.1 Where 3D may be used

About (primary), optional hero or product storytelling moments, and select brand moments `[REQUIRES CONFIRMATION: provided GLB assets, their subject and licensing]`. **3D must explain or express something; it is not decoration.**

### 31.2 Principles

| Principle | Requirement |
|-----------|------------|
| **Never required** | The website never depends on WebGL. Every 3D moment has a static fallback carrying the same content |
| **Lazy and on-demand** | Load only when in/near viewport (desktop) or after explicit user action (mobile); never part of initial page weight |
| **Feature detection** | Detect WebGL support and capability; fall back gracefully |
| **Reduced motion** | No auto-rotation or scroll-driven camera movement; static pose or user-controlled interaction only |
| **Accessibility** | Text alternative; keyboard-operable controls if interactive; no focus trap; content not exclusive to the canvas |
| **Performance** | Asset byte budget and polygon/texture budgets `[REQUIRES CONFIRMATION]`; compressed GLB (e.g., mesh and texture compression) `[VERIFY]`; pause rendering off-screen; cap pixel ratio |
| **Mobile** | Static poster by default with a "View in 3D" interaction, or a simplified model; battery/thermal awareness |
| **Fallback & failure** | Poster image, graceful error state, retry |
| **Security/CSP** | Library and model files self-hosted/same-origin or allowlisted (doc 03 §16, §31); no third-party model hosts by default |
| **Dark/light** | Lighting and environment adapt to theme; the model remains legible in both |

### 31.3 Implementation direction (to be decided at build)

| Option | Fit |
|--------|-----|
| **Web component model viewer** | Good for simple, interactive GLB display with built-in poster/lazy loading and reasonable accessibility affordances; low engineering effort |
| **WebGL scene library (custom scenes)** | Needed for bespoke scroll-driven storytelling; higher complexity and weight; V1.1 candidate |
| **Pre-rendered video/image sequences** | Lower-risk alternative where interactivity is unnecessary |

Recommendation: **V1** — static About foundation with an optional lazily loaded simple viewer if assets are ready. **V1.1** — custom scroll-driven scene if justified by performance review. Any 3D library is a dependency requiring justification per doc 02 §27 `[REQUIRES CONFIRMATION]`.

---

## 32. SEO and Content Presentation (Design-Level)

| Concern | Design/Content implication |
|---------|----------------------------|
| **Headings** | Display-type statements remain real headings in the DOM; visual scale never dictates semantics |
| **Metadata** | Admin forms provide SEO title/description/OG image for services, products, projects and pages; defaults provided |
| **Structured data** | Organisation, SoftwareApplication (products), CreativeWork/Project (portfolio), Service where accurate |
| **Crawlable content** | All meaningful text is in HTML (not in images or canvas); accordions and tabs keep content accessible in the DOM |
| **URLs** | Human-readable slugs derived from titles; redirects maintained when slugs change |
| **Open Graph** | Per-page share images can use the chromatic fields |
| **Admin** | Not indexed (doc 03) |

---

## 33. Page Inventory

### 33.1 Public

| Page | Route | Purpose | Key modules | Primary CTA | Phase |
|------|-------|---------|-------------|------------|-------|
| **Home** | `/` | Identity and routing | Opening, Ecosystem, HENU OS band, Services index, Portfolio feature, Evidence, About teaser, Closing paths | Explore the ecosystem / Start an enquiry | V1 |
| **Services** | `/services` | Present the service catalogue | Intro, Index, service sections, process (if real), related work | Discuss this service | V1 |
| **Service detail** | `/services/[slug]` | Deep service page | Problem → Capability → Approach → Solution → Outcome, related projects | Discuss this service | V1 (where content exists) |
| **Products** | `/products` | Ecosystem and products | Ecosystem model, four product presentations | Explore product | V1 |
| **HENU OS** | `/products/henu-os` | Flagship | Product Story + OS signature module, release block when available | State-driven (Download / Join waitlist / Explore) | V1 |
| **HENU AI** | `/products/henu-ai` | Product | Product Story + capabilities explorer | State-driven | V1 `[REQUIRES CONFIRMATION: readiness]` |
| **HENU PA** | `/products/henu-pa` | Product | Product Story + conversation module | State-driven | V1 `[REQUIRES CONFIRMATION]` |
| **HENU IDE** | `/products/henu-ide` | Product | Product Story + workflow module | State-driven | V1 `[REQUIRES CONFIRMATION]` |
| **Portfolio** | `/portfolio` | Projects built by HENU | Featured area, filter, asymmetric index | View project | V1 |
| **Portfolio detail** | `/portfolio/[slug]` | Case-study storytelling | Cover, structured story blocks, gallery, related service/product, next/previous | Start an enquiry | V1 |
| **About Us** | `/about` | HENU story | Chapters; static foundation; 3D/scroll layer later | Start an enquiry / Schedule a meeting | V1 foundation; V1.1 full |
| **Contact Us** | `/contact` | Conversion | Path chooser, enquiry form, Calendly CTA, contact details | Send enquiry / Schedule a meeting | V1 |
| **Legal** | `/privacy`, `/terms` | Required legal pages | Content page template | None | V1 `[REQUIRES CONFIRMATION: legal review]` |
| **System** | 404, error, maintenance | Safe states | System templates | Home | V1 |
| **Supporting (not primary nav)** | Documentation, release/download detail, security/disclosure | Linked from HENU OS page and footer when ready | Content page / docs templates | Context-specific | V1.1 `[REQUIRES CONFIRMATION]` |

### 33.2 Admin web

| Page | Route (illustrative) | Purpose | Phase |
|------|----------------------|---------|-------|
| **Sign-in** | `/admin/sign-in` | Authenticated entry (MFA per doc 03) | V1 |
| **Dashboard** | `/admin` | Overview, tasks, content health | V1 |
| **Home Management** | `/admin/home` | Edit home slots and featured items | V1 |
| **Service Management** | `/admin/services` | CRUD for services and categories | V1 |
| **Product Management** | `/admin/products` | CRUD for products and slots | V1 |
| **Portfolio Management** | `/admin/portfolio` | CRUD for projects, categories, technologies | V1 |
| **About Management** | `/admin/about` | Edit chapters and timeline | V1 |
| **Enquiry Management** | `/admin/enquiries` | List, view, update status | V1 |
| **Media Library** | `/admin/media` | Upload and manage media | V1 |
| **Site Settings** | `/admin/settings` | Contact, social, Calendly, SEO defaults | V1 |
| **Users & Roles** | `/admin/users` | Admin allowlist; RBAC later | V1 (minimal) / V1.1+ |
| **Audit log** | `/admin/audit` | Review changes | V1.1 (basic logging V1) |

*The exact admin scope may evolve once implementation requirements are validated.*

---

## 34. V1 vs. Future

### 34.1 V1 — prioritise

| Area | V1 scope |
|------|---------|
| **Theme** | Light default (fully designed) + dark theme support (designed independently) with a switch |
| **Public pages** | Home, Services (+ detail where content exists), Products hub + four product pages, Portfolio + detail, About foundation, Contact |
| **Responsiveness** | Fully designed mobile, tablet, desktop, large desktop |
| **Contact** | Enquiry form (secure, accessible) + Calendly path |
| **Admin web foundation** | Auth + MFA, dashboard, Home/Services/Products/Portfolio/About management, enquiries, media library, site settings |
| **Dynamic content** | Structured blocks, publish gate, revalidation on publish |
| **Quality** | Accessibility (WCAG 2.2 AA where practical), SEO foundation, performance budgets |
| **Motion** | Restrained set (Section 26.2) |
| **Visual system** | Tokens, primitives, patterns, chromatic field art, ecosystem model |
| **Loading** | Foundation (skeletons, loader slot, reserved media space) |
| **3D** | Optional simple viewer if assets are ready; otherwise static |

### 34.2 V1.1 / completion refinement

Richer animation; advanced 3D and scroll storytelling (About); page and shared-element transitions; HENU-specific loading experience; advanced portfolio interactions (technology filters, deeper previews); deeper About storytelling; advanced product visualisation; supporting content (documentation entry, release/download detail pages, security/disclosure page); RBAC roles; edit-conflict handling; content revision history.

### 34.3 Rule

**Do not allow advanced visual effects to delay a strong core website.** Core clarity, content, accessibility, performance and conversion come first.

---

## 35. Design Refinement Principle

This document is the **design foundation, not a prison.** After implementation, visual decisions (spacing, type scale values, field art, motion details, component refinements) may be improved based on real usage and testing.

### 35.1 Foundational and should not casually change

1. Light-first default theme (with an independently designed dark theme).
2. Primary navigation of six items.
3. HENU ecosystem positioning (company and ecosystem, not only HENU OS).
4. Fully responsive public website.
5. Web-only Admin Panel (no mobile Admin app).
6. Dynamic content architecture with centrally controlled visual design.
7. No public service pricing.
8. Separation of Products, Services and Portfolio.
9. Accessibility and performance as constraints.
10. Content authenticity (no invented facts).

### 35.2 Open to refinement

Exact hues and values (after real-asset testing), type scale values, field artwork, section composition details, motion choreography, component details, admin layout details, supporting-page structure.

---

## 36. Content Authenticity

### 36.1 Never invent

Technical specifications, benchmarks, customer numbers, download counts, revenue, awards, certifications, partnerships, user counts, project metrics, testimonials, team members, client names, timelines, or capability claims.

### 36.2 Placeholder protocol

- Unknown information is marked `[REQUIRES CONFIRMATION]` in working content.
- Placeholders display visibly in staging and **block publishing** in the Admin (Section 22.6).
- Illustrative visuals stand in only when labelled/treated as illustrative.
- Every metric requires a source and an owner field.
- The Legal and Funding services require explicit expectation-setting wording (Section 14.4).

### 36.3 Source material needed from HENU

| Item | Needed for |
|------|-----------|
| Service catalogue (descriptions, capabilities, benefits, outcomes) | Services |
| Product facts for HENU OS, AI, PA, IDE; status; relationships | Products |
| Project information for Portfolio (public/permissioned; images; descriptions) | Portfolio |
| HENU brand assets (logo files, colours, light/dark variants) | Brand and palette |
| GLB assets (files, subject, licence) | About/3D |
| Company story facts (origin, milestones, team) | About |
| Calendly URL | Contact |
| Contact details and social links | Footer/Contact |
| Legal copy (Privacy, Terms, service disclaimers) | Legal/Services |
| Screenshots/recordings of real products | Product pages |

---

## 37. Open Design Decisions

| # | Decision | Impact |
|---|----------|--------|
| 1 | Existing logo/brand colours and whether the proposed Ember/Tidal/Saffron/Mulberry palette is accepted | Entire palette (Section 7) |
| 2 | Product hue assignments | Product pages, ecosystem model |
| 3 | Typeface selection after visual testing; multilingual (Devanagari or others) requirement | Typography, fonts, fallbacks |
| 4 | Final homepage opening statement and header CTA label | Home, header |
| 5 | Readiness and status of HENU AI, PA and IDE; what can be shown (screenshots, recordings) | Product pages, signature modules |
| 6 | HENU OS release status at launch (Download / waitlist / explore) | OS CTA and release block |
| 7 | Service catalogue content; category grouping; handling of Legal/Funding services and disclaimers | Services |
| 8 | Which projects are public; permissions; image availability; status taxonomy | Portfolio |
| 9 | GLB assets: subject, size, licence; V1 vs V1.1 use | About, 3D |
| 10 | About narrative content and verified timeline | About |
| 11 | Calendly URL; link-out vs on-click popup embed | Contact |
| 12 | Phone field and any extra form fields; consent wording | Enquiry form |
| 13 | Theme persistence mechanism and CSP handling of the pre-paint script | Theming, security |
| 14 | Media storage/CDN provider; video hosting approach | Media pipeline |
| 15 | Structured editor approach and headless UI primitive library | Admin, components |
| 16 | Admin density and scope at launch given the web-only requirement; users/roles in V1 | Admin |
| 17 | Performance budgets and Core Web Vitals thresholds | CI, design constraints |
| 18 | Whether real analytics exist to power any Admin dashboard metrics | Dashboard |
| 19 | Whether testimonials, awards or partnerships exist and are permitted to be shown | Evidence section |
| 20 | Formal accessibility target and supported browser matrix | QA |

---

## 38. Final Design Standard

The website should feel like **HENU has its own visual language** — a warm, editorial, evidence-led, spectrum-coloured identity, led by light, with a dark counterpart of its own — not a modern template with a HENU logo.

It balances: **Originality + clarity + usability + performance + accessibility + technology + emotion.**

**In one sentence:** *A paper-and-ink, product-coloured, editorially composed HENU, where content is dynamic, design is centrally controlled, every claim is real, and every visitor knows what to do next.*

---

*End of document. All items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner before dependent design or content is finalised. Colour values, type scales and motion values are recommended starting points to be validated in design tooling and testing.*

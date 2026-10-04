# HENU Website — Frontend, UI/UX Design System & Component Architecture

| | |
|---|---|
| **Document** | `04-FRONTEND-UI-UX-DESIGN-SYSTEM.md` |
| **Status** | Draft v1 for design and engineering review |
| **Depends on** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md`, `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md`, `03-SECURITY-ARCHITECTURE.md` |
| **Feeds** | Content/copy strategy, visual design in the design tool, component build, QA plan, delivery plan |
| **Audience** | UI/UX designers, frontend developers, product designers, QA engineers, future maintainers |

**Conventions used in this document**

- `[REQUIRES CONFIRMATION]` marks anything about HENU (product status, logo, legal entity, content, claims, assets) that a HENU owner must verify before it is designed against, built or published.
- **Recommendation** marks a choice made by this document. Recommendations are proposals for review, not approved HENU brand guidelines. Nothing here is an approved brand guideline until HENU signs it off.
- **Inherited** marks a requirement taken from documents 01–03. Inherited items are constraints, not choices.
- This document contains **no implementation code**: no React, CSS, HTML or configuration files. Token names and values are specification, not code.
- Contrast ratios quoted in this document were **calculated** with the WCAG 2.x relative-luminance formula for the exact values listed. They must be re-verified in the design tool and in CI whenever a token changes.
- No metrics, customer results, certifications, product specifications or user counts appear in this document. Where an example needs a value, a placeholder such as `<version>` is used.

---

## Table of Contents

1. Design direction in one page
2. Inherited constraints and how this document aligns with 01–03
3. Positioning analysis and design research
4. HENU visual language
5. Colour system
6. Light and dark themes (implementation and flash prevention)
7. Typography system
8. Design tokens (spacing, radius, elevation, motion, layers, layout)
9. Layout system
10. Responsive design
11. Visual hierarchy
12. Homepage design
13. Navigation and footer
14. Product experience
15. HENU OS experience
16. Services experience
17. Projects and case studies
18. Download and release UI
19. Documentation UI
20. Contact and enquiry components
21. Admin UI
22. Component architecture
23. Component states
24. Accessibility
25. Motion and interaction design
26. Iconography, illustration, 3D and visualisation strategy
27. Image and media system
28. Performance-aware design
29. Next.js frontend architecture
30. Folder and component organisation
31. Data and API integration
32. Design token implementation (Tailwind and CSS variables)
33. Optional visual motifs
34. What to avoid
35. Design system decision record
36. Page-level design inventory
37. Component inventory
38. Testing and quality checklist
39. Design implementation priority
40. Final design principle
41. Register of items requiring confirmation

---

## 1. Design direction in one page

**The idea.** HENU is not a single product and not an agency; it is a *stack*: an operating system, a voice interface, an AI layer and a developer environment that are meant to work together, plus an engineering practice that builds for clients. The visual language is therefore built on one structural idea: **layers that visibly connect**. The site is typographically led, restrained in colour, and uses a small number of recurring *structural* devices (an ecosystem locator, evidence labels, status chips, a two-register content model) rather than decoration.

**Working name for the direction (Recommendation): "Layered Signal."** *Layered* because the ecosystem is a stack with the OS as the foundation. *Signal* because every visual element must carry information (status, relationship, evidence, state) rather than decorate.

**What makes it recognisably HENU even with all decoration removed:**

1. A **single type voice**: one superfamily (IBM Plex Sans, with Plex Mono for technical metadata), large tightly-set left-aligned statements, and a plain-language-first / technical-detail-on-demand rhythm.
2. An **Ecosystem Locator** that appears on every product page and the homepage and shows where a product sits in the stack, what it depends on and what is shipped versus planned.
3. **Evidence labelling** on every product visual (*Screenshot*, *Recording*, *Illustration*, *Concept*), operationalising the PRD rule that representative illustration must never be passed off as real product footage.
4. **Status chips** with shape and text (never colour alone) on every product, release and roadmap item.
5. A **warm, restrained colour identity**: a single vermilion-ember primary on cool ink neutrals, in a market dominated by indigo, violet and cyan.
6. **Square-leaning geometry** (small radii, hairlines, registered edges) so surfaces feel engineered rather than bubbly.

**What it deliberately is not:** a glassmorphism/neon/cyberpunk Linux site; a generic SaaS card grid; an agency template; a terminal-everywhere developer cliché.

**Scope reminder (Inherited from 01):** V1 is a focused launch. This document specifies the full system so it can grow, but section 39 separates what V1 must build from what can wait. Nothing marked V1.1 or Future should delay launch.

---

## 2. Inherited constraints and how this document aligns with 01–03

### 2.1 Constraints this design system must honour

| # | Source | Constraint | Design consequence |
|---|--------|-----------|--------------------|
| 1 | 01 §8, §19 | Evidence before claims; no invented numbers, logos, testimonials, certifications | Metric components cannot render without source, owner and as-of date. Evidence labels on visuals. No "logo wall" components. |
| 2 | 01 §12, §19.5 | Honest status labels (Available, Beta, In development, Coming soon) on every product | Status chip is a mandatory part of product cards, heroes, ecosystem map and roadmap. |
| 3 | 01 §12.3 | Products must not appear as an unrelated uniform card grid; relationships must be shown | Ecosystem map and locator are the primary product-overview devices; product index is not a card grid. |
| 4 | 01 §12.4 | Product pages avoid "Logo → Name → 3 bullets → Learn more" | Product page template (section 14) follows Why → Problem → Solution → Experience → Capabilities → Ecosystem → Evidence → Next action. |
| 5 | 01 §13.4 | Service pages are not technology lists | Service template (section 16) is problem-led; technology is a supporting module with "why" context. |
| 6 | 01 §14 | Work = case studies, not a portfolio grid; zero or one strong case study beats a padded grid | Case study index is designed to look complete with one entry or zero (empty state defers to V1.1). |
| 7 | 01 §17, 02 §9, 03 §21 | Release data is a single source of truth; checksums described honestly; honest "no release" state | Download UI is fully data-driven; copy rule: "SHA-256 checksum for integrity verification", never "verified/authentic/signed" unless signing exists. |
| 8 | 01 §18 | Contact is intent-based, light forms, one primary action per page | Intent selector plus separate forms (section 20). |
| 9 | 01 §23 | WCAG 2.2 AA target `[REQUIRES CONFIRMATION]` | Entire system specified against WCAG 2.2 AA (section 24). |
| 10 | 01 §25, 02 §5.4 | Performance is design; zero client JS by default; no animation library in baseline | CSS-first motion; native elements first; client islands only (section 28–29). |
| 11 | 02 §5.3 | Tailwind consumes semantic tokens named by role, not value | Token architecture in sections 5, 8, 32. |
| 12 | 02 §18 | One priority media element per view; hero never lazy; width/height always set; background video constrained; 3D not in V1 | Media rules in section 27; 3D is Future. |
| 13 | 02 §10 | Single Next.js app, `src/` layout, components never import `server/*` | Folder structure in section 30 extends 02 §10 rather than replacing it. |
| 14 | 02 §21 | Single locale in V1; layouts must tolerate text expansion and other scripts | Logical CSS properties, no fixed-width text containers, font choice includes a Devanagari companion (see section 7). |
| 15 | 03 §16 | CSP is nonce-based for admin, pragmatic/hash-based for public static pages; third-party scripts minimal; fonts self-hosted | Theme-flash script strategy (section 6) must be CSP-compatible; fonts are self-hosted; no third-party scripts on admin. |
| 16 | 03 §19 | Honeypot hidden accessibly; time-to-submit token; adaptive challenge only on risk | Form spec (section 20) includes accessible honeypot and a challenge slot that is empty by default. |
| 17 | 03 §30 | MDX rendered via allowlisted components; raw HTML disabled; embeds as facades | Documentation and article components are an explicit allowlist (section 19). |
| 18 | 03 §16 | Microphone disabled by Permissions-Policy unless a route needs it | Any HENU PA browser voice demo is Future and requires a route-scoped exception. V1 voice visuals are non-interactive. |
| 19 | 03 §31, §37 | Public site sets no non-essential cookies; analytics privacy-preserving | Theme preference is stored client-side (not a cookie) and is treated as a functional preference `[REQUIRES CONFIRMATION: legal view on disclosure]`. |
| 20 | 02 §12, 03 | No custom admin UI in V1; V1.1 enquiries module; releases module only if releases move to the database | Admin design (section 21) is deliberately minimal and V1.1. |

### 2.2 Where this document extends or deviates from 02 (to be reconciled by engineering)

| # | Topic | 02 says | This document recommends | Why |
|---|-------|---------|--------------------------|-----|
| D1 | Component tiers | `ui`, `layout`, `features` | Add `patterns` and `sections` between `ui` and `features`, matching the layered model requested for this document; `layout` stays | Gives designers a vocabulary for reusable multi-primitive blocks (CTA block, feature row) that are not domain-specific. |
| D2 | Styles directory | Not listed | Add `src/styles/` for token and global CSS | Tokens need one authoritative home outside components. |
| D3 | Theme flash vs CSP | Static generation by default; CSP policy in 03 is "nonce/hash where feasible" | The theme-initialisation script must be allowed by hash (static pages) or nonce (admin). Do **not** adopt cookie-based server theme detection | A cookie-read theme forces dynamic rendering of every page and defeats static generation and CDN caching. |
| D4 | Headless primitives | "Vetted headless library if needed `[REQUIRES CONFIRMATION]`" | Native elements first (details/summary, dialog, popover where supported); a headless primitive library only for tabs, select, tooltip and popover | Minimises client JavaScript while avoiding hand-rolled accessibility mistakes. Library choice remains open. |
| D5 | Icons | Not decided | One tree-shakable SVG icon set plus a small custom set for product marks | Consistency and bundle control. |
| D6 | Fonts | "Self-host" (03) | Self-hosted via the framework font loader, one family plus mono | Matches 03 §31 and Core Web Vitals goals. |

---

## 3. Positioning analysis and design research

### 3.1 What HENU's positioning demands from the design

| Positioning fact (Inherited from 01) | Design implication |
|---|---|
| A technology company and ecosystem, led by a flagship OS | Product-led visual language; HENU OS gets a distinct "stage" treatment but within the same system |
| P1 audiences: product users and developers; P2: business clients | Homepage tone is product/technical-first; services have a clearly different, calmer register reachable from the top navigation |
| Credibility through evidence, honesty about stage | Visual restraint; labelled visuals; no inflated "futuristic" styling that implies shipped capability |
| Voice + AI + developer tooling | Interaction visuals (transcripts, editor frames, model maps) must be labelled and real where claimed |
| Services must not look like unrelated freelance offers | Services share type, grid and tokens, but use a structured "ledger" language that reads as engineering practice |
| Original identity; not a reskinned template | Distinct palette, geometry, and structural devices (locator, evidence labels) rather than a distinct decoration |
| Possible future Hindi/other-script content `[REQUIRES CONFIRMATION]` | Typeface family with a matching Devanagari companion |

### 3.2 The common category look, and why HENU should avoid it

| Common pattern in OS / AI / dev-tool sites | Problem for HENU | Alternative taken |
|---|---|---|
| Near-black background, indigo/violet glow, gradient headlines | Indistinguishable from most AI products; implies hype | Light theme is a full first-class design; dark theme is ink-based with warm primary; no glow |
| Glass cards with blur | Weak contrast, GPU cost, template feel | Flat surfaces separated by hairlines and surface steps |
| Terminal/code rain backgrounds | Decorative, noisy, misleading about the product | Real, labelled interface previews; technical metadata in mono only where informative |
| Everything is a rounded card grid | Hides relationships between products | Ecosystem map, ledger rows, editorial splits, spec tables |
| Floating 3D orbs/logos | Heavy; says nothing | No 3D in V1; 3D reserved for a future interactive OS preview |
| Generic Linux distribution "penguin and wallpaper" page | Collapses HENU to a distro | HENU OS is the flagship *inside* a company/ecosystem frame |

### 3.3 Brand architecture on screen (supports Open Product Decision #2 in 01)

To avoid the "is this the OS site or the company site?" confusion, the **global header always carries the HENU company wordmark**. Product pages add a **product sub-navigation bar** beneath it (product name, status chip, Overview · Capabilities · Documentation · Releases · Download). Product accent colour appears only in that bar, the locator and small markers. This keeps HENU OS prominent without making the whole site read as an OS microsite. `[REQUIRES CONFIRMATION: final brand architecture]`

### 3.4 Logo and wordmark

The logo files and their colours were **not provided**. This document does not assume the logo's colour dominates the site. Required before design lock `[REQUIRES CONFIRMATION]`:

- Vector logo (SVG) in full-colour, single-colour dark, single-colour light.
- Minimum size and clear-space rules (proposed: clear space equals the cap height of the wordmark; minimum digital size to be set once the file exists).
- A **logo harmony check**: if the existing logo conflicts with the vermilion-ember primary, adopt the fallback palette in section 5.8 rather than recolouring the logo.
- Whether any mascot or illustrative mark exists. If one does, it is a *supporting* asset, never the identity.

---

## 4. HENU visual language

### 4.1 System of recurring structural devices

These are the identity. Decoration is secondary.

| Device | What it is | Where it appears | Why it is distinctive and useful |
|---|---|---|---|
| **Ecosystem Locator** | A compact stack diagram (OS base, PA, AI, IDE) with the current product highlighted, dependency lines, and status chips | Homepage hero, products hub, every product page, docs product pages | Makes the ecosystem concrete (PRD differentiator #1) and answers "how does this fit with other HENU products?" on every page |
| **Evidence Label** | Small tag on any visual: *Screenshot*, *Recording*, *Illustration*, *Concept* | Every product visual, diagram, video poster | Enforces the PRD evidence principle visually; also a trust signal |
| **Status Chip** | Shape + text indicator for Available / Beta / In development / Coming soon / Withdrawn | Products, releases, roadmap, navigation panel | Honest staging; never colour alone |
| **Two-register content** | Plain-language summary first; "Technical detail" disclosure with mono metadata second | Product pages, technology page, release notes | Serves non-technical and technical visitors without splitting the site |
| **Registered frames** | Interface previews sit in a thin frame with small corner ticks and a caption line | Screenshots, editor previews, voice panels | Gives product visuals a consistent, engineered presentation |
| **Ledger rows** | Full-width rows with a leading label, a statement and a trailing action, separated by hairlines | Services hub, release lists, FAQ, spec lists | A non-card alternative for lists; reads as structured practice |
| **Stack rail** | Narrow vertical rail on wide screens showing section position within a long page | Long product pages and docs | Wayfinding that doubles as visual rhythm; absent on mobile |

### 4.2 Composition principles

1. **Left-aligned statements, generous asymmetry.** Headlines occupy 7 of 12 columns on desktop; supporting media or diagrams take the remainder. Centred hero stacks are avoided except for short closing CTAs.
2. **One idea per viewport.** Each section makes one point with one dominant element.
3. **Alternate density.** A dense technical block (spec table, diagram) is followed by a spacious statement block. Pages should breathe in a rhythm, not repeat one pattern.
4. **Surfaces step, shadows rarely.** Hierarchy is made with background steps and hairlines; shadows are reserved for overlays.
5. **Colour is rationed.** Roughly nine-tenths of any page is neutral. The primary appears on one primary action per view, links, focus-adjacent accents and the locator highlight.
6. **Shape language:** small radii (section 8.3), hairline borders, optional corner ticks on frames only. No pills except status dots, toggles and avatars.

### 4.3 Product vs services vs documentation register

| | Marketing / product | Services | Documentation | Downloads |
|---|---|---|---|---|
| Density | Medium, spacious statements | Medium, structured | High, reading-optimised | Medium-high, utility |
| Dominant device | Locator, framed previews | Ledger rows, process flow | Prose, code, callouts | Panel, rows, checksum |
| Colour | Product accent at small scale | Graphite and ember | Neutral, link colour | Neutral, status colours |
| Motion | Light reveal, one diagram animation | Minimal | None beyond focus/hover | Minimal |
| Type | Display + body | Heading + body | Body-optimised, mono for code | Body + mono for data |

---

## 5. Colour system

### 5.1 Strategy (Recommendation)

- **Primary: "Ember"** — a deep vermilion. A warm, saturated primary is rare among OS/AI/developer brands (which cluster around blue, indigo, violet, cyan and terminal green), so it gives HENU immediate distinctiveness, and it contrasts naturally with the cool ink neutrals.
- **Neutrals: "Ink and Paper"** — a very slightly warm off-white background in light theme and a blue-black ink in dark theme. Neutrals carry nearly all of the interface.
- **Accent strategy: product accents, used at small scale.** Four hues, spaced around the colour wheel, identify products in the locator, status-adjacent markers and sub-navigation. They are **never** used as page-wide backgrounds or large gradients.
- **Semantic colours** (success, warning, danger, info) are separate from brand and product accents so that a "danger" state is never confused with Ember.
- **Gradients: none by default.** A single, optional, very low-contrast tonal wash (primary at a few percent opacity over background) may be used behind one hero or product stage. It must carry no meaning and be removable.

### 5.2 Why Ember (and what was rejected)

| Option | Verdict | Reason |
|---|---|---|
| Indigo / violet | Rejected as primary | The dominant AI-product association; undermines "original". Retained only as a possible cool accent if needed later. |
| Electric blue | Rejected | Most common technology colour; indistinguishable and reads corporate. |
| Cyan / teal as primary | Rejected as primary | Common "developer" signal; low natural contrast on light backgrounds. Used as the HENU PA accent. |
| Terminal green | Rejected | Linux/hacker cliché; implies terminal-everywhere styling the PRD warns against. Desaturated moss is used as the HENU IDE accent. |
| Pure black/white high-contrast monochrome | Rejected as sole identity | Elegant but loses product differentiation; risks reading as a generic minimalist template. |
| Orange (bright) | Rejected | Fails white-text contrast and resembles an existing distribution's identity. |
| **Deep vermilion (Ember)** | **Selected** | Distinct in category; reaches AA with white text on fills (5.46:1) and AA as text on the page background (5.22:1 for the fill; darker link variant 6.60:1). |

Fallback if the logo conflicts (section 3.4): see section 5.8.

### 5.3 Primitive palette (Recommendation)

Primitives are raw values. **Components never reference primitives; only semantic tokens.** Values below are the light-theme and dark-theme foundations.

| Primitive | Value | Notes |
|---|---|---|
| `paper-50` | `#FAFAF7` | Light page background |
| `paper-0` | `#FFFFFF` | Light raised surface |
| `paper-100` | `#F1F1EC` | Light muted surface |
| `paper-200` | `#E6E6DE` | Light subtle border |
| `paper-300` | `#D4D4CB` | Light decorative border |
| `stone-500` | `#868B94` | Light/dark UI-control border (see 5.6) |
| `stone-600` | `#555B65` | Light muted text |
| `ink-900` | `#14161A` | Light foreground; dark primary foreground |
| `ink-950` | `#0E1013` | Dark page background |
| `ink-900s` | `#15181D` | Dark raised surface |
| `ink-800` | `#1C2027` | Dark elevated surface |
| `ink-850` | `#1A1D23` | Dark muted surface |
| `ink-700` | `#2C313A` | Dark border |
| `ink-750` | `#21252C` | Dark subtle border |
| `bone-100` | `#ECECE6` | Dark foreground |
| `ash-400` | `#A3A8B1` | Dark muted text |
| `ember-600` | `#C2370F` | Primary (light) |
| `ember-700` | `#A82D09` | Primary hover / link (light) |
| `ember-300` | `#FF7448` | Primary (dark) |
| `ember-200` | `#FF8A64` | Primary hover (dark) |
| `ember-150` | `#FF9B7A` | Link (dark) |
| `ember-tint-l` | `#FBE9E3` | Light primary-tinted surface |
| `ember-tint-d` | `#2A1812` | Dark primary-tinted surface |

### 5.4 Semantic tokens — Light theme (Recommendation)

| Token | Value | Role |
|---|---|---|
| `--color-background` | `#FAFAF7` | Page background |
| `--color-foreground` | `#14161A` | Default text |
| `--color-surface` | `#FFFFFF` | Raised content surface (panels, inputs, popovers) |
| `--color-surface-elevated` | `#FFFFFF` | Overlay surface (menus, dialogs); distinguished by border and shadow in light |
| `--color-surface-muted` | `#F1F1EC` | Quiet bands, code blocks, table headers |
| `--color-primary` | `#C2370F` | Primary actions, key accents |
| `--color-primary-hover` | `#A82D09` | Hover/pressed primary |
| `--color-primary-foreground` | `#FFFFFF` | Text/icon on primary |
| `--color-primary-tint` | `#FBE9E3` | Selected rows, highlighted callouts |
| `--color-secondary` | `#EDEDE6` | Secondary button fill |
| `--color-secondary-foreground` | `#14161A` | Text on secondary |
| `--color-border` | `#D4D4CB` | Decorative dividers, card edges |
| `--color-border-subtle` | `#E6E6DE` | Quiet separators inside components |
| `--color-border-strong` | `#868B94` | Form-control boundaries, required UI boundaries (≥3:1) |
| `--color-text-strong` | `#14161A` | Headings |
| `--color-text-muted` | `#555B65` | Secondary text |
| `--color-text-faint` | `#6B717B` | Metadata only (never for essential instructions) |
| `--color-link` | `#A82D09` | Inline links (always underlined) |
| `--color-focus-ring` | `#14161A` | Focus indicator (paired with a 2px background-coloured offset) |
| `--color-success` | `#16794A` | Success text/icon |
| `--color-warning` | `#8A5A00` | Warning text/icon |
| `--color-danger` | `#C0262D` | Error text/icon |
| `--color-info` | `#1F5FBF` | Informational text/icon |

Each semantic status also has a `-surface` token (a very light tint of the same hue) for callout and banner backgrounds; the tint values are derived in the design tool and must each be contrast-checked against the foreground used on them.

### 5.5 Semantic tokens — Dark theme (Recommendation)

The dark theme is **designed independently**, not inverted. Surfaces are blue-black; lightness steps replace shadows; the primary shifts to a lighter, slightly less saturated ember so it keeps its character without vibrating on dark surfaces; large areas of pure white and pure black are avoided to reduce glare.

| Token | Value | Notes |
|---|---|---|
| `--color-background` | `#0E1013` | Page |
| `--color-foreground` | `#ECECE6` | Default text (off-white, not pure white) |
| `--color-surface` | `#15181D` | Panels, inputs |
| `--color-surface-elevated` | `#1C2027` | Menus, dialogs, popovers |
| `--color-surface-muted` | `#1A1D23` | Quiet bands, code blocks |
| `--color-primary` | `#FF7448` | Primary actions |
| `--color-primary-hover` | `#FF8A64` | Hover |
| `--color-primary-foreground` | `#14161A` | Ink text on the light primary |
| `--color-primary-tint` | `#2A1812` | Selected rows |
| `--color-secondary` | `#232830` | Secondary button fill |
| `--color-secondary-foreground` | `#ECECE6` | |
| `--color-border` | `#2C313A` | Dividers |
| `--color-border-subtle` | `#21252C` | Quiet separators |
| `--color-border-strong` | `#7A808A` | Form-control boundaries |
| `--color-text-strong` | `#F5F5F0` | Headings |
| `--color-text-muted` | `#A3A8B1` | Secondary text |
| `--color-text-faint` | `#8C919A` | Metadata only |
| `--color-link` | `#FF9B7A` | Inline links (always underlined) |
| `--color-focus-ring` | `#ECECE6` | Focus indicator with background offset |
| `--color-success` | `#4CC38A` | |
| `--color-warning` | `#E6B040` | |
| `--color-danger` | `#FF7B7F` | |
| `--color-info` | `#7AA7FF` | |

### 5.6 Calculated contrast (WCAG 2.x relative luminance)

| Pairing | Light | Dark | Requirement | Pass |
|---|---|---|---|---|
| Foreground on background | 17.32:1 | 16.07:1 | 4.5:1 text | Yes |
| Foreground on surface | 18.11:1 | 15.00:1 | 4.5:1 | Yes |
| Foreground on elevated surface | — | 13.78:1 | 4.5:1 | Yes |
| Muted text on background | 6.54:1 | 7.98:1 | 4.5:1 | Yes |
| Muted text on muted surface | 6.04:1 | 7.45:1 (on surface) | 4.5:1 | Yes |
| Faint text on background | 4.70:1 | 6.02:1 | 4.5:1 | Yes (metadata only; margin is thin in light) |
| Primary-foreground on primary | 5.46:1 | 6.77:1 | 4.5:1 | Yes |
| Primary-foreground on primary hover | 6.90:1 | 7.82:1 | 4.5:1 | Yes |
| Link on background | 6.60:1 | 9.27:1 | 4.5:1 | Yes |
| Primary (as UI/graphic) on background | 5.22:1 | 7.12:1 | 3:1 | Yes |
| Decorative border on background | 1.43:1 | 1.46:1 | Not required (decorative only) | n/a |
| **Strong border on background** | 3.27:1 | 4.79:1 | 3:1 for control boundaries | Yes |
| Success / warning / danger / info text on background | 5.19 / 5.67 / 5.65 / 5.83 | 8.60 / 9.66 / 7.61 / 7.98 | 4.5:1 | Yes |
| Product accents (moss, teal, cobalt) on background | 4.99 / 4.77 / 5.91 | 9.06 / 8.93 / 7.25 | 3:1 graphic / 4.5:1 text | Yes |
| Focus ring on background | 17.32:1 | 16.07:1 | 3:1 | Yes |

**Rules that follow from the numbers**

1. **Decorative hairlines (`--color-border`) must never be the only boundary of an input, checkbox, radio or any control whose boundary is needed to identify it** (WCAG 1.4.11). Controls use `--color-border-strong`.
2. `--color-text-faint` is limited to non-essential metadata (timestamps, file-type tags). Instructions, errors, labels and legal text use muted or foreground text.
3. Primary text on tinted surfaces must be re-checked: link (`#A82D09`) on the light primary tint reaches 5.87:1; link (`#FF9B7A`) on the dark primary tint reaches 8.26:1.
4. Text must **never** be placed on the primary fill in a colour other than `--color-primary-foreground`.
5. Any new colour introduced later must be added with both themes' contrast calculated in the same review.

### 5.7 Product accents and status (Recommendation)

Accents are small-scale identifiers. Assignments are placeholders until product list and status are confirmed `[REQUIRES CONFIRMATION]`.

| Entity | Accent name | Light | Dark | Use |
|---|---|---|---|---|
| HENU OS (flagship = brand) | Ember | `#C2370F` | `#FF7448` | Same as primary: the flagship *is* the brand colour |
| HENU PA | Teal | `#0B7C80` | `#3FC3C7` | Locator node, sub-nav marker, transcript highlight |
| HENU AI | Cobalt | `#2A56D6` | `#7C9BFF` | Locator node, sub-nav marker |
| HENU IDE | Moss | `#3C7A32` | `#7CC46F` | Locator node, sub-nav marker |
| HENU Services | Graphite | `#3A3F47` | `#C9CDD4` | Services accent: structural rather than chromatic |
| Future product | Reserved hue slot | — | — | A new product receives a new hue only after a contrast check in both themes |

Hues are spaced roughly around the wheel (ember, moss, teal, cobalt) so adjacent nodes in the locator are distinguishable **without** relying on colour: every node also carries a text label and a glyph.

**Status chips (shape + text; colour is secondary):**

| Status | Glyph | Treatment |
|---|---|---|
| Available | Filled dot | Neutral chip with success-coloured dot |
| Beta | Half-filled dot | Neutral chip with info-coloured dot |
| In development | Dashed-outline dot | Neutral chip, muted dot |
| Coming soon | Hollow dot | Neutral chip, muted dot |
| Withdrawn | Struck dot | Neutral chip with danger-coloured dot, used only in release history |

### 5.8 Fallback palette (if the logo or brand owner rejects Ember)

Swap only the `ember-*` primitives and the primary semantic tokens; no component changes. Candidate: a deep **cobalt-ink** primary with a warm paper background, which retains the Ink-and-Paper identity but loses the warm distinctiveness. Any replacement must reach: primary-foreground on primary ≥ 4.5:1, primary on background ≥ 3:1, link on background ≥ 4.5:1, in both themes.

### 5.9 Using colour

| Rule | Detail |
|---|---|
| One primary action per view | Ember fill appears on one button per viewport |
| Links are underlined | Colour is not the only signal |
| Status never relies on colour alone | Glyph + text always |
| Large coloured fills | Not used, apart from the primary button and an optional ember-tint callout |
| Dark sections inside the light theme | Permitted only as a deliberate "stage" panel (e.g., HENU OS stage) using dark-theme tokens scoped to that container |
| Data visualisation | Max four hues; each series also has a pattern or label |

---

## 6. Light and dark themes (implementation and flash prevention)

### 6.1 Principles

1. **Two first-class themes.** Light and dark are independently designed token sets (sections 5.4 and 5.5). Components use only semantic tokens, so a theme is a token remap, never duplicated component styling (Inherited from 02 §5.3).
2. **Three user choices:** *System* (default), *Light*, *Dark*. Respecting the operating-system preference by default avoids forcing a theme on first visit.
3. **Both themes ship in V1** (Recommendation). 02 left this as a design decision; because tokens are semantic and the work is in the token set, shipping both is low-cost and both must be tested.
4. **Images and diagrams adapt.** Diagrams are inline SVG that consume tokens. Raster product screenshots are shown as captured; where the product itself has light and dark UI modes, provide both captures and select by theme. Never filter-invert a screenshot.
5. **Native UI follows theme.** The declared colour scheme must match the active theme so scrollbars, form controls and system chrome do not clash.

### 6.2 Mechanism

| Concern | Recommendation |
|---|---|
| Where the theme lives | A single attribute on the root element drives token selection (for example a `data-theme` attribute with values `light` and `dark`). When the user chooses *System*, the attribute is resolved from the OS preference. |
| Library | **`next-themes`** is justified: it solves the hardest part (a blocking pre-paint initialiser and system-preference tracking) in very small code, avoiding a bespoke script and its edge cases. It requires a dependency note under the 02 §27 policy: *reason — correct, tested flash prevention and system sync; alternative — a hand-written initialiser of roughly ten lines*. If engineering prefers zero dependencies, the hand-written initialiser is acceptable provided it follows 6.3. |
| Storage | The choice is stored in browser local storage as a functional preference. **No cookie** is set (Inherited: no non-essential cookies, 03 §37). Whether this needs disclosure in the Privacy Policy is `[REQUIRES CONFIRMATION: legal review]`. |
| Server rendering | Because the choice lives on the client, the server cannot know it. All pages therefore render the same HTML for every visitor; the initialiser corrects the attribute before first paint. This keeps pages **statically generated and CDN-cacheable** (Deviation D3). |
| Theme toggle | A small client island (section 29). It is a three-option control (System, Light, Dark) with an accessible name and a visible current state; it announces nothing on change beyond the control state. |

### 6.3 Preventing theme flash (flash of incorrect theme)

- The initialiser runs **synchronously in the document head before first paint**, reads the stored choice or the OS preference, and sets the root attribute.
- The page's initial paint must not depend on JavaScript for layout, only for theme resolution.
- **CSP compatibility (Inherited from 03 §16):** an inline initialiser is blocked by a strict script policy. Allow it using a **hash** of the exact initialiser on static pages (hash-based policy is explicitly permitted by 03 for static pages) and a **nonce** on dynamically rendered pages (admin). Any change to the initialiser changes its hash and must update the policy; this is verified in the CSP Report-Only rollout. `[VERIFY: current framework and library CSP guidance]`
- Disable transitions during the theme swap so tokens do not animate across the whole page (a perceived flash). Re-enable immediately after.
- Fallback with no JavaScript: the OS preference applies through a media query on the token layer, so a script-blocked visitor still gets a correct, if non-persistent, theme.
- Declare the colour scheme in both the stylesheet and the page metadata so the browser's own canvas colour matches before CSS loads.

### 6.4 Contrast considerations specific to dark theme

- Pure white text on pure black causes halation; the foreground is an off-white (`#ECECE6`) on blue-black (`#0E1013`).
- The primary is **lighter** in dark theme (`#FF7448`) and carries **ink** text (`#14161A`), preserving AA (6.77:1) rather than keeping white text on a dark ember (which would fail or look muddy).
- Elevation is expressed by lighter surfaces plus a border, not by shadows, which are invisible on dark backgrounds.
- Status colours are lightened for dark surfaces (table in 5.5) and re-verified.
- Large saturated fills are avoided in dark theme; saturated colour is kept to small elements.

---

## 7. Typography system

### 7.1 Recommendation

| Role | Family | Why |
|---|---|---|
| **Primary (display, headings, body, UI)** | **IBM Plex Sans** | Engineered, slightly industrial letterforms with clear distinction between similar glyphs (important for versions, checksums and filenames); open licence; broad weight range; strong at both display and small sizes; **has a matching Devanagari design in the same family** for any future Hindi content, avoiding a mismatched fallback `[REQUIRES CONFIRMATION: multilingual need — 01 Open Decision #16]`. Distinctive relative to the near-ubiquitous Inter/Geist-class defaults, without being a novelty face. |
| **Supporting** | None | A second text family is not needed. Distinction is created through weight, size, tracking and composition. |
| **Monospace (technical)** | **IBM Plex Mono** | Same superfamily, matched x-height and stroke contrast, so code and data sit comfortably next to Plex Sans. Used for code, filenames, versions, checksums and short technical metadata only. |

**Total: two font files from one design family (Plex Sans and Plex Mono).** This meets the "maximum one primary, one supporting, one mono" constraint with room to spare.

**Rejected alternatives**

| Candidate | Reason rejected |
|---|---|
| Inter / Geist | Named in earlier planning only as examples; ubiquitous in the category, which works against distinctiveness. |
| A display serif paired with Plex/Inter | Distinctive, but adds a second family, a heavier font budget, and weaker small-size/technical legibility; risks looking editorial rather than product-led. Could be reconsidered for About/Insights only, post-launch. |
| Space Grotesk / futuristic or geometric display faces | Quirky letterforms hurt long-form and technical reading; very common in crypto/AI templates. |
| System font stack only | Fastest, but removes typographic identity; reserved as the **fallback stack** for resilience. |
| Condensed or wide display faces | Poor internationalisation and accessibility; gimmick risk. |

**Loading plan (Inherited: self-host, 03 §31; performance, 01 §25)**

- Self-host through the framework font loader; no third-party font requests.
- Sans weights: **400, 500, 600** (700 only if a real need appears). Prefer the variable font if available for the chosen subset `[VERIFY: variable availability and licensing file for the Plex family]`; otherwise static files for those three weights.
- Mono weights: **400 and 500** only. Loaded on routes that use code/data (docs, downloads, product technical sections); the homepage avoids loading it unless a technical metadata element appears above the fold.
- No italics loaded by default; emphasis uses weight. Italic is added only if long-form editorial content requires it.
- Latin subset at launch; Devanagari subset added only when Hindi content exists.
- A metrics-matched fallback system font is declared so the swap causes minimal layout shift.
- Preload only the primary body/heading file for the above-the-fold text.

### 7.2 Type scale and tokens

Sizes use fluid values bounded by minimum and maximum; the table gives mobile → tablet → desktop targets. Line-heights are unitless.

| Token | Family | Size (mobile → tablet → desktop) | Weight | Line height | Letter spacing | Responsive note |
|---|---|---|---|---|---|---|
| `type-display` | Sans | 40 → 56 → 72 px | 600 | 1.04 | −0.03em | Homepage hero and flagship statements only; max ~12 words; wraps naturally, never forced line breaks |
| `type-h1` | Sans | 34 → 44 → 56 px | 600 | 1.1 | −0.025em | One per page |
| `type-h2` | Sans | 28 → 34 → 40 px | 600 | 1.15 | −0.02em | Section titles |
| `type-h3` | Sans | 22 → 24 → 28 px | 600 | 1.25 | −0.01em | Subsections |
| `type-h4` | Sans | 18 → 20 → 20 px | 600 | 1.35 | 0 | Component titles |
| `type-body-lg` | Sans | 18 → 19 → 20 px | 400 | 1.55 | 0 | Lead paragraphs, hero support text |
| `type-body` | Sans | 16 px (all) | 400 | 1.6 | 0 | Default; never smaller on mobile |
| `type-body-sm` | Sans | 14 px | 400 | 1.5 | 0 | Secondary descriptions, table cells |
| `type-caption` | Sans | 13 px | 400 | 1.4 | 0.005em | Captions, helper text; **no text below 12 px anywhere** |
| `type-label` | Sans | 14 px | 500 | 1.3 | 0.01em | Form labels, button text, nav items |
| `type-eyebrow` | Mono | 12 px | 500 | 1.3 | 0.08em, uppercase | Used sparingly (section 33); never for essential content |
| `type-code-inline` | Mono | 0.9em of surrounding | 400 | inherit | 0 | Inline code, filenames |
| `type-code-block` | Mono | 14 px (13 px minimum on very small screens) | 400 | 1.65 | 0 | Code blocks, checksums |
| `type-data` | Sans, tabular figures | 20–32 px | 500 | 1.2 | −0.01em | Version numbers, sizes, dates in panels |
| `type-data-small` | Mono | 13 px | 400 | 1.5 | 0 | Checksums, hashes (wrap rules in section 18) |

### 7.3 Typographic rules

1. **Plain language first.** Display and H1 statements are descriptive (what HENU is/builds); taglines appear in supporting roles, per 01 §4.5.
2. **Measure.** Body text max line length 65–72 characters (~68ch). Docs prose uses the same measure; wide tables/code may exceed it inside their own scroll container.
3. **Heading order is semantic.** Visual size is independent of heading level; a component never changes heading level to change size. A component accepts a heading-level prop and a size prop separately.
4. **No ALL CAPS for sentences.** Uppercase is limited to the eyebrow token.
5. **Numbers.** Versions, sizes and dates use tabular figures so columns align.
6. **Text expansion.** Containers use flexible widths; no fixed-width text boxes; logical properties (start/end rather than left/right) are used so a right-to-left or longer-script future does not require a rewrite (Inherited 02 §21).
7. **Zoom and text spacing.** Layout must survive 200% text zoom and WCAG 1.4.12 text-spacing overrides without clipping.
8. **Links** are underlined by default, with a thicker underline on hover and a visible focus indicator; link text describes the destination (no generic "learn more", per 01 §8 principle 6).

---

## 8. Design tokens (spacing, radius, elevation, motion, layers, layout)

### 8.1 Token architecture

Three tiers; only the middle tier is used by components.

```text
Primitive tokens   (raw values: palette, scale steps)          — design-tool and token files only
        ↓
Semantic tokens    (roles: --color-surface, --space-section)    — the contract used by components
        ↓
Component tokens   (optional; --button-radius, --callout-border) — only where a component needs a local alias
```

Naming: `--color-*`, `--type-*` (with `-size`, `-weight`, `-leading`, `-tracking` suffixes), `--space-*`, `--radius-*`, `--shadow-*` (elevation), `--duration-*`, `--ease-*`, `--z-*`, `--layout-*`. Tokens are named by **role**, not value (Inherited from 02 §5.3).

### 8.2 Spacing scale (4 px base)

| Token | Value | Typical use |
|---|---|---|
| `--space-0` | 0 | |
| `--space-0-5` | 2 px | Hairline offsets |
| `--space-1` | 4 px | Icon gaps |
| `--space-2` | 8 px | Tight inline gaps |
| `--space-3` | 12 px | Control padding (vertical) |
| `--space-4` | 16 px | Default gap; mobile gutter |
| `--space-5` | 20 px | |
| `--space-6` | 24 px | Card padding; tablet gutter |
| `--space-8` | 32 px | Laptop gutter; group separation |
| `--space-10` | 40 px | Large-screen gutter |
| `--space-12` | 48 px | |
| `--space-16` | 64 px | |
| `--space-20` | 80 px | |
| `--space-24` | 96 px | |
| `--space-32` | 128 px | |

**Section rhythm tokens** (responsive; one token, three values):

| Token | Mobile | Tablet | Desktop+ | Use |
|---|---|---|---|---|
| `--space-section-sm` | 40 px | 48 px | 64 px | Dense utility sections (download, docs index) |
| `--space-section-md` | 56 px | 72 px | 96 px | Standard sections |
| `--space-section-lg` | 72 px | 104 px | 144 px | Hero separation, flagship stages |

Rule: **spacing between related items is smaller than spacing between groups**; designers choose from the scale and do not invent in-between values. Arbitrary pixel values in code are prohibited (section 32).

### 8.3 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Full-bleed bands, table cells |
| `--radius-sm` | 4 px | Badges, status chips, code blocks, tags, checkboxes |
| `--radius-md` | 8 px | Buttons, inputs, panels, cards, callouts |
| `--radius-lg` | 12 px | Media frames, dialogs, large stage panels |
| `--radius-full` | 9999 px | Status dots, toggles, avatars only |

Rule: nested radii step down (an inner element has a smaller radius than its container). Pills are not used for buttons or cards. No radius above 12 px except `full`.

### 8.4 Elevation

Hierarchy comes from borders and surface steps first. Shadows are rare and soft.

| Level | Name | Light | Dark | Use |
|---|---|---|---|---|
| 0 | Flat | No shadow | No shadow | Default for everything in the page flow |
| 1 | Raised | Border + very light, tight shadow | Border only (surface one step lighter) | Hovered interactive panels |
| 2 | Overlay | Border + soft medium shadow | Elevated surface + border | Menus, popovers, tooltips, mobile nav sheet |
| 3 | Modal | Border + larger soft shadow + scrim | Elevated surface + border + stronger scrim | Dialogs |

Shadow colour is a low-opacity ink, never coloured and never a glow. Concrete shadow values are finalised in the design tool; the constraint is that no shadow exceeds a soft, low-opacity ambient spread.

### 8.5 Motion tokens

| Token | Duration | Use |
|---|---|---|
| `--duration-instant` | 0 ms | State swaps, theme change, everything under reduced motion |
| `--duration-press` | 80 ms | Press feedback (button active) |
| `--duration-fast` | 120 ms | Hover, focus, colour change, small icon shifts |
| `--duration-standard` | 200 ms | Disclosure open/close, menu enter, tab change |
| `--duration-slow` | 360 ms | Section reveal, diagram line draw |
| `--duration-page` | 240 ms | Route-level transition (fade) |
| `--duration-interaction` | 200–280 ms | Component transitions that move more than a few pixels |

| Easing token | Curve (cubic-bezier) | Use |
|---|---|---|
| `--ease-standard` | (0.2, 0, 0, 1) | Default |
| `--ease-enter` | (0.05, 0.7, 0.1, 1) | Elements entering |
| `--ease-exit` | (0.3, 0, 0.8, 0.15) | Elements leaving (shorter duration) |
| `--ease-linear` | linear | Progress and spinners only |

Under `prefers-reduced-motion: reduce`, all durations resolve to `instant` except opacity cross-fades under 120 ms; transforms and scroll-linked effects are removed (section 25).

### 8.6 Layering (z-index)

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Page content |
| `--z-sticky` | 100 | Sticky header, docs sub-bar |
| `--z-dropdown` | 200 | Navigation panels, popovers |
| `--z-overlay` | 300 | Scrims |
| `--z-modal` | 400 | Dialogs |
| `--z-toast` | 500 | Transient status messages |
| `--z-skip` | 1000 | Skip-to-content link when focused |

### 8.7 Layout tokens

| Token | Value |
|---|---|
| `--layout-header-height` | 56 px mobile, 64 px desktop |
| `--layout-page-max` | 1280 px |
| `--layout-wide-max` | 1440 px (media frames and stages only) |
| `--layout-prose-max` | 68ch (~720 px) |
| `--layout-narrow-max` | 640 px (forms, legal text) |
| `--layout-docs-max` | 1360 px |
| `--layout-gutter` | 16 px (<640), 24 px (640–1023), 32 px (1024–1535), 40 px (≥1536) |
| `--layout-grid-gap` | 16 px mobile, 24 px tablet/laptop, 32 px large |
| `--layout-touch-target` | 44 px minimum on touch layouts (24 px absolute floor, WCAG 2.5.8) |

---

## 9. Layout system

### 9.1 Containers

| Container | Max width | Use |
|---|---|---|
| Page | 1280 px | Default content width for marketing sections |
| Wide | 1440 px | Product stages, large interface frames, full-width diagrams |
| Prose | 68ch | Articles, documentation, legal pages, long descriptions |
| Narrow | 640 px | Forms, waitlist, success states |
| Docs | 1360 px | Three-column documentation shell |
| Full-bleed | Viewport | Section backgrounds only; **content inside is always constrained by a container** |

On ultra-wide screens (≥1920 px) the page container remains 1280 px centred; section background bands continue to the viewport edge; media frames never exceed the wide container. The layout must never feel empty or lose hierarchy at large widths (Inherited 01 §24).

### 9.2 Grid

| Device class | Columns | Gap | Notes |
|---|---|---|---|
| Mobile (<640) | 4 | 16 | Single-column content; two-column only for small, fixed-size items |
| Small tablet (640–767) | 8 | 24 | |
| Tablet (768–1023) | 8 | 24 | Two-column compositions begin |
| Laptop (1024–1279) | 12 | 24 | Full compositions, side rails appear |
| Desktop (1280–1535) | 12 | 24 | Baseline desktop |
| Large (≥1536) | 12 | 32 | Container capped; extra space becomes margins |

### 9.3 Breakpoints

Use the framework defaults so the system stays aligned with Tailwind: **sm 640, md 768, lg 1024, xl 1280, 2xl 1536**. The supported minimum viewport is **320 CSS px**, and layouts must reflow without horizontal scrolling at **400% zoom** (WCAG 1.4.10).

### 9.4 Layout archetypes

| Archetype | Use | Structure |
|---|---|---|
| **Statement + media** | Heroes, flagship stages | 7/5 column split on laptop+; stacked on mobile with statement first |
| **Editorial split** | Why-it-exists, problem/solution | 5/7 text/media, alternating rarely (not zebra-striped by default) |
| **Ledger** | Services, FAQ, releases, specs | Full-width rows: label, statement, trailing action |
| **Map** | Ecosystem, architecture | Diagram container with legend and text alternative |
| **Spec table** | Requirements, comparisons | Table on ≥768; definition-list blocks below (section 10.3) |
| **Prose** | Docs, articles, legal | Single measure column, optional TOC |
| **Docs shell** | Documentation | Sidebar 280 px · content ≤760 px · "On this page" 240 px |
| **Utility panel** | Downloads, forms | Narrow container, strong hierarchy, minimal decoration |

### 9.5 Page shell

- Skip link → header (sticky) → `main` (one per page) → footer.
- Header is solid (no blur/transparency), shows a hairline only after scrolling (CSS-only where possible).
- `scroll-padding-top` equals header height plus space so anchored headings and focused elements are never hidden behind the sticky header (WCAG 2.4.11).

---

## 10. Responsive design

### 10.1 Principle

Responsive behaviour is **designed per device class**, not shrunk from desktop. Mobile is the reference experience for the homepage, downloads and forms (Inherited 01 §10.4, §24).

### 10.2 What changes at each class

| Aspect | Mobile (<768) | Tablet (768–1023) | Laptop/Desktop (1024–1535) | Large/Ultra (≥1536) |
|---|---|---|---|---|
| Navigation | Menu button opens full-height sheet; groups as accordions; CTA pinned at sheet bottom | Same sheet pattern or compact inline nav if all items fit without wrapping | Inline nav with disclosure panels | Same, container capped |
| Hero | Statement first, locator below as simplified vertical stack, CTA full-width | Statement and locator side-by-side at 6/6 if both remain legible, otherwise stacked | 7/5 statement + locator | Same; more margin |
| Ecosystem map | Vertical stack with product rows and dependency notes in text | Compact stack diagram | Full diagram with labelled edges | Full diagram, contained |
| Product showcase | Single framed preview, captions below; steps stacked | Preview + text stacked or 2-col | Stage with preview and floating annotations | Stage contained |
| Feature sections | Feature rows stacked, media first or text first per content; no zebra | 2 columns | 2 columns, alternating only where it aids reading | Same |
| Service lists | Ledger rows collapse to label over statement, action beneath | Ledger rows with action at trailing edge | Ledger with trailing metadata | Same |
| Project/case study | Single column; outcome panel after solution | Single column with side meta | Prose + side meta rail | Same |
| Tables | Convert to stacked blocks (10.3) | Scroll container only if essential | Native table | Native table |
| Forms | Single column; labels above; full-width controls and submit | Single column ≤640 px | Single column ≤640 px; side explanatory panel optional | Same |
| Downloads | Artifact rows as stacked cards; checksum wraps; sticky "Download" not used | Rows with two columns | Rows with columns | Same |
| Documentation | Top bar with "Menu" and "On this page" disclosures | Sidebar collapsible | Three-column shell | Contained |
| Footer | Groups as accordions or stacked single column; legal bar last | Two columns | Four to five columns | Same |
| Images/screenshots | Full-bleed within gutters, intrinsic ratio kept, pinch-zoom allowed | Contained | Contained, max wide container | Contained |
| Video | Poster + play button; never autoplay | Same | Same | Same |
| Diagrams | Redrawn simplified version for narrow viewports (not just scaled) | Scaled | Full | Full |

### 10.3 Table strategy (technical data)

1. **Spec tables (system requirements, comparisons)** with ≤4 columns: on mobile become a **definition list** (term then value) in the same DOM order, using semantic list/description markup via the component, not duplicated markup shipped twice.
2. **Wide data tables (release history, docs tables)**: remain tables inside a labelled, keyboard-focusable scroll container with a visible scroll affordance and a sticky first column where it aids reading. Scrolling occurs inside the container; the page itself does not scroll sideways.
3. **Checksums and filenames**: monospace, wrap anywhere (no truncation), with a copy button; never ellipsised.
4. **Never hide data on mobile** that is shown on desktop. Reorder or collapse into a disclosure instead.
5. Every table has a caption or accessible name; header cells are marked correctly.

### 10.4 Touch and input

- Touch targets ≥ 44×44 px on touch layouts (24 px floor with spacing for dense desktop controls).
- No interaction depends on hover alone; hover previews are enhancements to click/tap behaviour.
- Orientation changes preserve state and reflow without loss.
- Sticky UI is limited to the header (and docs sub-bar) so that on small screens vertical space is not consumed.

---

## 11. Visual hierarchy

### 11.1 The seven things a visitor must understand (Inherited from 01 §3.2 / this brief)

| # | Understanding | Where | Visual mechanism |
|---|---|---|---|
| 1 | What HENU is | Hero statement | Display type, descriptive sentence, no decoration competing |
| 2 | What HENU builds | Hero locator + ecosystem section | Locator diagram names the four products and services |
| 3 | What the flagship is | HENU OS stage | Largest framed real visual on the homepage |
| 4 | Why it matters | Ecosystem statement + flagship narrative | One-sentence differentiator, then the evidence |
| 5 | What HENU builds for businesses | Services band | Calmer ledger register, clearly after product story |
| 6 | What evidence exists | Proof strip, releases, docs, work | Evidence labels, status chips, dated facts |
| 7 | What to do next | Primary CTA + route strip + closing intent router | One ember action per viewport |

### 11.2 Levels of emphasis

| Level | Treatment | Examples |
|---|---|---|
| **Primary** | Display/H1 type, ember button, largest framed visual, locator highlight | Hero statement, primary CTA, HENU OS stage |
| **Secondary** | H2/H3, strong neutral buttons, spec tables, feature rows | Section titles, secondary CTAs |
| **Supporting** | Body, captions, muted text, hairlines, small icons | Descriptions, evidence captions |
| **Utility** | Eyebrow/mono metadata, breadcrumbs, footers, legal | Version metadata, breadcrumbs |

### 11.3 Rules

1. **Never more than one primary-level element competing in a viewport.** If two want primacy, one is demoted.
2. **Not every section is equally loud.** Alternate a high-emphasis section (stage, statement) with a low-emphasis one (ledger, text).
3. **Hierarchy is carried by size, weight and space before colour.** Greyscale rendering of any page must still show the correct order of importance (a QA check, section 38).
4. **CTAs map to intent** (Inherited 01 §18.4): product pages use Explore/Download/Read documentation; services use Discuss a project/Start an enquiry; technical pages use Documentation/GitHub; general uses Contact HENU. Exactly one primary action per major page.

---

## 12. Homepage design

### 12.1 Recommended order (and where it departs from 01 §10.3)

01 recommends eleven blocks. This document keeps the logic and makes three refinements, each a recommendation for review:

| Refinement | Reason |
|---|---|
| **Merge "core differentiator" and "product ecosystem" into one Ecosystem section** that opens with the one-sentence differentiator and then shows the map | The ecosystem *is* the differentiator; separating them makes the visitor read an abstract claim and then, later, its evidence |
| **Place the flagship (HENU OS) stage directly after the ecosystem** | Moves from system to a concrete, evidenced product in one scroll |
| **Merge "process" into the Services band as a brief signal; keep insights conditional** | Per 01: process belongs mainly on Services; Insights only with real content (V1.1) |

**Resulting homepage sequence**

| # | Section | Emphasis | Phase |
|---|---|---|---|
| 1 | Hero: identity, locator, route strip | Primary | V1 |
| 2 | Ecosystem: the connected-system idea and map | Secondary-high | V1 |
| 3 | Flagship: HENU OS stage | Primary (second peak) | V1 |
| 4 | Proof strip (first pass, real evidence only) | Supporting | V1 |
| 5 | Technology and developer entry | Secondary | V1 |
| 6 | Services band (with process signal) | Secondary, calmer register | V1 |
| 7 | Work (case studies) | Secondary | V1 only if real/permitted, else V1.1 |
| 8 | Insights | Supporting | V1.1, only with real content and an owner |
| 9 | Closing intent router | Primary (closing) | V1 |
| — | Footer | Utility | V1 |

The order must be validated in design review and, after launch, against observed behaviour (Inherited 01 §10.3). It is not a locked layout.

### 12.2 Section specifications

#### 1. Hero — identity, locator, route strip

| Attribute | Specification |
|---|---|
| Purpose | State what HENU is and builds; give a first action; route the three journeys |
| Content type | One descriptive statement (display type); one supporting sentence; Ecosystem Locator; route strip. Copy is a content-workstream deliverable `[COPY: descriptive, no superlatives]` |
| Visual treatment | Statement left (7 columns), locator right (5 columns). No background media, no glow. The locator is an inline SVG using tokens, so the hero's largest element is text (fast LCP) |
| Interaction | Locator nodes are links to product pages; hover/focus reveals a short descriptor and status; no auto-animation on load other than a single, short line-draw in the locator (reduced-motion: static) |
| CTA | **Primary:** state-aware, e.g. Explore HENU OS (or Download / Join waitlist per release state). **Secondary (text link):** Documentation. Route strip below carries the client path |
| Route strip | Three ledger-style rows: product intent → HENU OS; developer intent → Technology/Documentation; client intent → Services/Discuss a project. Each row names the visitor's intent in plain language and the destination. (Serves 01's audience-aware routing without giving all audiences equal space.) |
| Responsive | Mobile: statement, supporting line, primary CTA (full width), locator as vertical stack, route strip as stacked rows. Tablet: stacked or 6/6. Desktop: split. Hero height is content-driven, not forced to viewport height |

#### 2. Ecosystem

| Attribute | Specification |
|---|---|
| Purpose | Make the connected-ecosystem idea concrete and honest about maturity |
| Content type | One-sentence differentiator; the Ecosystem Map; per-product one-line role with status chip; relationship legend |
| Visual treatment | Larger version of the locator: OS as base layer; PA, AI, IDE as connected layers; solid line = confirmed integration, dashed line = planned direction; legend always visible. Edge semantics `[REQUIRES CONFIRMATION]` |
| Interaction | Focus/hover on a node highlights its connections and shows a short panel; clicking navigates. All information also exists as a text list beneath the diagram (not hover-dependent) |
| CTA | "Explore the ecosystem" → Products hub (text link, secondary) |
| Responsive | Mobile uses a purpose-redrawn vertical diagram and the text list as the primary reading path |

#### 3. Flagship — HENU OS stage

| Attribute | Specification |
|---|---|
| Purpose | Anchor the ecosystem in one tangible product |
| Content type | Short plain-language statement; one real framed interface preview (Evidence Label: Screenshot or Recording); three evidenced supporting points (not generic features); state-aware download/status panel |
| Visual treatment | A "stage": a contained wide panel using dark-theme tokens in light mode (and standard surfaces in dark), holding the preview in a registered frame. The only deliberately dark-on-light block on the page |
| Interaction | Optional poster-to-video facade (user-initiated, captioned). No parallax. If multiple states are shown, an accessible tab control swaps screenshots |
| CTA | State-aware primary (Download / Join waitlist / Explore); secondary Read documentation |
| Responsive | Mobile: statement, preview full width, supporting points stacked, CTA last. The stage panel loses its inner padding and becomes a framed block |

#### 4. Proof strip (first pass)

| Attribute | Specification |
|---|---|
| Purpose | Early evidence that this is real, placed before asking attention for services |
| Content type | A short row of **real, dated facts** only: current release version and date, documentation availability, repository links where public, product status labels, demo availability. No counts, logos or testimonials unless confirmed. If fewer than two real facts exist, the section is **omitted** (not padded) |
| Visual treatment | Ledger-like row of data items using `type-data` and a mono metadata line (source, as-of date) |
| Interaction | Each fact links to its source (release, docs, repository) |
| CTA | None; each item is itself a link |
| Responsive | Row on laptop+; 2-column grid tablet; stacked list mobile |

#### 5. Technology and developer entry

| Attribute | Specification |
|---|---|
| Purpose | Technical credibility and a path into documentation for developers |
| Content type | Plain-language summary; two-register layout with a "Technical detail" disclosure; a small architecture diagram if accurate; links to documentation, repositories (where public), releases |
| Visual treatment | Editorial split with an SVG diagram using mono labels; **no logo wall** (Inherited) |
| Interaction | Disclosure for technical depth (native details element) |
| CTA | **Documentation** (primary text/secondary button), GitHub where public `[REQUIRES CONFIRMATION]` |
| Responsive | Diagram simplified on mobile; disclosure default closed |

#### 6. Services band

| Attribute | Specification |
|---|---|
| Purpose | Signpost applied engineering without letting it dominate the product story |
| Content type | Category-grouped ledger of validated services, each row: problem-led label, one-line statement, link. A one-line "built on the same engineering as HENU's products" cross-reference; a brief process signal only if HENU's real process is confirmed `[REQUIRES CONFIRMATION]` |
| Visual treatment | Calmer register: graphite accent, hairline ledger rows, no product accents, no icons required |
| Interaction | Row hover/focus underlines the label; whole row is the link target |
| CTA | **Discuss a project** (primary within the section) and "All services" text link |
| Responsive | Rows stack label over statement; action beneath |
| Note | Legal Service and Funding Solution are **not** shown here unless confirmed for public listing; the ledger is data-driven so categories can be omitted without layout change (01 §13.2) |

#### 7. Work

| Attribute | Specification |
|---|---|
| Purpose | Evidence for the services claim |
| Content type | 1–3 real case studies maximum on the homepage, each with challenge, approach and outcome (qualitative if no verified metric) |
| Visual treatment | Editorial row(s) with a framed visual and a short outcome statement; not a thumbnail grid |
| Interaction | Link to the full case study |
| CTA | Start an enquiry (linked to the relevant service) |
| Responsive | Stacked |
| Rule | If no real, permitted case study exists, **omit the section** (Inherited 01 §14.4). |

#### 8. Insights (V1.1)

Appears only with real content and an owner. Presented as a ledger of the latest items (title, type, date), not cards with stock imagery.

#### 9. Closing intent router

| Attribute | Specification |
|---|---|
| Purpose | End with intent-based paths rather than one generic CTA (Inherited 01 §10.3) |
| Content type | Three to four rows: "Try HENU OS", "Read the documentation", "Discuss a project", "Talk to us about a partnership" |
| Visual treatment | Large ledger rows on a muted surface; primary ember fill only on the single most relevant action |
| Interaction | Rows link; no forms inline |
| Responsive | Stacked rows with full-width targets |

---

## 13. Navigation and footer

### 13.1 Information architecture of the header (Recommendation)

01 lists many destinations. The header must not become overloaded, so it groups them.

| Position | Item | Behaviour | Phase |
|---|---|---|---|
| Left | **HENU wordmark** | Link to home | V1 |
| Primary | **Products** | Disclosure panel (ecosystem list with status chips; HENU OS feature entry) | V1 |
| Primary | **Services** | Disclosure panel (category list) or simple link if only one category at launch | V1 |
| Primary | **Technology** | Link | V1 |
| Primary | **Work** | Link; **shown only if case studies exist** | V1 conditional |
| Primary | **Documentation** | Link (entry page) | V1 |
| Primary | **Company** | Disclosure: About, Insights (V1.1), Security (V1.1), FAQ, Contact | V1 |
| Utility | **Downloads** | Text link with state-aware label (e.g., "Downloads" or "HENU OS: join waitlist") | V1 |
| Utility | Theme toggle | Three-state control | V1 |
| Utility | Search | Documentation search entry | Future |
| Action | **Primary CTA button** | Context-aware label (below) | V1 |

Six primary items maximum at any time. "Contact" lives under Company *and* is the header's primary action, so no separate top-level Contact item is needed.

**Context-aware primary CTA (Recommendation, intent-labelled per 01 §8 principle 6):**

| Page context | CTA label (intent) |
|---|---|
| Home, About, Technology, generic | Contact HENU |
| HENU OS and product pages with a public release | Download (or Join waitlist when no release) |
| Services pages | Discuss a project |
| Documentation | Download (or Join waitlist) |

Context awareness is determined from the route and requires a tiny client island in the header; if engineering prefers zero client logic, the header may render a single static CTA ("Contact HENU") and rely on in-page CTAs.

### 13.2 Desktop behaviour

- **Disclosure pattern, not ARIA menu.** Each dropdown trigger is a button with an expanded/collapsed state that controls a panel; panels are not marked as application menus. This is the recommended pattern for site navigation because it preserves normal Tab order and screen-reader semantics.
- **Open on click and Enter/Space**; hover may open after a short intent delay as an enhancement but is never the only way.
- **Escape** closes the panel and returns focus to the trigger; opening another panel closes the first.
- **Focus leaving the panel** closes it. Panels do not trap focus.
- **Products panel:** left column lists the four products plus Products hub with status chips; right column highlights HENU OS (statement, state-aware action). Text only; no imagery required.
- **Active state:** current section shown with an underline and `aria-current` on the matching link; never colour alone.
- **Sticky:** header is sticky and does **not** auto-hide on scroll (auto-hiding headers complicate keyboard focus and screen-magnifier use). Height is constant; a hairline appears after scroll.

### 13.3 Mobile behaviour

- A single **Menu** button (text label plus icon) opens a full-height sheet using the modal pattern: focus is moved into it, background is inert, Escape closes it, focus returns to the button.
- Groups appear as accordions; each leaf link has a ≥44 px target.
- The primary CTA is pinned at the sheet's bottom.
- Theme control sits inside the sheet.
- The sheet's open state locks background scroll without shifting layout.

### 13.4 Product sub-navigation

On product pages a second bar sits below the global header: product name + status chip at left; anchors/links **Overview · Capabilities · Documentation · Releases · Download** (only those that exist) at right. It is sticky on laptop+, static on mobile (collapses into a horizontally scrollable tab list **or** a "On this page" disclosure; the disclosure is preferred to avoid hidden horizontal scrolling).

### 13.5 Breadcrumbs

Used on documentation, releases, case studies, service detail and product sub-pages. Not shown on the homepage or top-level hubs. Provided as a semantic breadcrumb landmark with the current page as plain text; structured data is generated from the same model (02 §19).

### 13.6 Footer (Recommendation)

The footer is structured and short, not a sitemap.

| Zone | Content |
|---|---|
| Brand block | Wordmark; a **descriptive** one-sentence statement of what HENU is (the secondary tagline may appear here pending 01 Open Decision #17); legal entity name `[REQUIRES CONFIRMATION: "HENU OS Pvt Ltd" and registered details]` |
| Products | HENU OS, HENU PA, HENU AI, HENU IDE (only those published) |
| Services | Category links (only validated services) |
| Resources | Documentation, Downloads, Releases, FAQ; Insights and Security when they exist |
| Company | About, Work (if present), Contact |
| Legal bar | Privacy, Terms, copyright line; social/community links `[REQUIRES CONFIRMATION]` |

Rules: maximum five link groups; no empty groups; no link to a page that is not live; footer links never duplicate more than the top two levels of the IA. On mobile, groups collapse into disclosures except the legal bar. A "Status of each product" link is **not** included unless a status page exists.

---

## 14. Product experience

### 14.1 Why products need their own visual system

Products are not services and are not generic cards. A product page must communicate **Why it exists → Problem → Solution → Experience → Capabilities → Ecosystem relationship → Evidence → Next action** (Inherited 01 §12.4). The visual system for products centres on real interface evidence, the locator, and structured technical facts.

### 14.2 Product page template

| # | Module | Content | Visual device |
|---|---|---|---|
| 1 | **Product sub-navigation** | Product name, status chip, section links | Sticky bar with product accent marker |
| 2 | **Product hero** | Name, descriptor, status, state-aware primary CTA, one framed visual with Evidence Label | Statement + framed preview |
| 3 | **Why it exists** | The problem in plain language; the HENU answer | Editorial split, no media required |
| 4 | **Experience** | What using it is like: interface preview or narrative sequence | Registered frames + captions; sequence of 3–5 steps where real |
| 5 | **Capabilities** | Specific, verified capabilities | **Feature rows** (text + optional media), each ending in a link to docs or a release where it exists; two-register disclosure for technical detail |
| 6 | **Ecosystem relationship** | The locator with this product highlighted; one sentence on dependencies and independence | Locator, dependency list |
| 7 | **Evidence** | Release version/date, documentation links, repositories, demos | Proof row (data type + source) |
| 8 | **Specs and requirements** | Requirements, supported platforms | Spec table / definition list |
| 9 | **Roadmap (optional)** | Honest direction | Status-chip list (not dates unless confirmed) |
| 10 | **Related products and services** | Lateral navigation without returning to the hub (Inherited 01 §12.3) | Ledger rows |
| 11 | **Next action** | State-aware CTA block | CTA block |

Pages may omit a module only when there is nothing real to put in it; the order is stable so the product family feels coherent.

### 14.3 Shared components and product-specific "signature modules"

All products share the sub-nav, locator, status chip, evidence label, spec table, feature row, CTA block, grid, type and radius. Each product has **one signature module** and a distinct hero composition, so the family is related but not identical:

| Product | Hero composition | Signature module (all content `[REQUIRES CONFIRMATION]` and labelled by evidence type) | Accent |
|---|---|---|---|
| HENU OS | Wide stage with desktop/environment preview | Environment gallery and "using it" narrative (section 15) | Ember |
| HENU PA | Centred conversation panel | **Voice interaction panel**: a transcript-style interface preview showing a command, the assistant's response, and the resulting action. Labelled *Illustration* unless it is a real recording. A text transcript accompanies any audio/video | Teal |
| HENU AI | Diagram-led hero | **Capability map**: how inputs, models and outputs relate, only to the extent real; otherwise a text capability list. No pseudo-neural-network art | Cobalt |
| HENU IDE | Split editor frame | **Editor preview**: real screenshot of editor with assistant panel; code in mono only where it is real | Moss |

### 14.4 Product components (patterns)

| Component | Purpose | Variants | Notes |
|---|---|---|---|
| Product hero | Establish identity and primary action | Stage (OS), conversation (PA), diagram (AI), split (IDE) | State-aware CTA from release/status data |
| Product overview | Plain-language explanation | With/without media | Two-register |
| Feature row | One capability with evidence | Text only, text + media, text + diagram | Not a card |
| Interface preview / frame | Show real UI | Browser-like, desktop, editor, terminal (only where real) | Corner ticks, caption, Evidence Label |
| Architecture diagram | Show structure | Layered, flow | SVG, themed, text alternative |
| Feature comparison | Compare editions/channels only if real | Table → definition list on mobile | No competitor comparison without evidence |
| System requirements | Minimum/recommended | Table / list | `[REQUIRES CONFIRMATION]` values |
| Release information | Summarise current release | Compact / full | Data from release service |
| Downloads | See section 18 | | |
| Documentation links | Route to docs | Inline / card-free list | |
| Roadmap | Direction | Status-chip list | Dates only when confirmed |
| Changelog | Release history | Ledger | |
| Related products / services | Lateral navigation | Ledger rows | |

### 14.5 Products hub

The hub's primary device is the **Ecosystem Map** (full size), followed by a ledger of products: name, role in the ecosystem, audience, status chip, independence/dependency note, and link. It is not a card grid. Products that are not launch-ready appear only if they carry an honest status and enough content to be useful (01 §9.2); otherwise they are omitted until V1.1.

---

## 15. HENU OS experience

### 15.1 Goal

Communicate **what using HENU OS actually feels like** rather than listing features, while keeping marketing, technical documentation and download information as separate layers that link to one another (Inherited 01 §11.3).

### 15.2 Page structure (Recommendation)

| # | Module | Purpose | Evidence rule |
|---|--------|---------|---------------|
| 1 | **OS hero stage** | Statement, state-aware primary action, wide framed environment preview | Real screenshot or recording; if none exists, show a clearly labelled *Concept* and a plain "In development" status |
| 2 | **Who it is for** | Concise audience statement | `[REQUIRES CONFIRMATION]` |
| 3 | **A day with HENU OS (experience sequence)** | Three to five framed moments (e.g., first boot, finding things, working, using voice, shipping a project) showing real screens in order | Each frame labelled; omitted frames are not faked |
| 4 | **Voice interaction** | How voice works in the OS, shown not claimed | Voice panel (see 14.3); real recording with transcript or an *Illustration* label |
| 5 | **Developer workflow** | What developers can do | Real terminal/editor captures; mono only where real; link to HENU IDE |
| 6 | **Privacy and security messaging** | Only supportable statements | Each statement links to its basis (documentation, repository, release notes) or is omitted; no certification badges unless real |
| 7 | **Application and tool ecosystem** | What ships with or runs on it | Ledger list of real items `[REQUIRES CONFIRMATION]` |
| 8 | **Architecture** | Layered diagram of the foundation and how PA/AI/IDE connect | SVG diagram with a Technical-detail disclosure |
| 9 | **System requirements** | Minimum/recommended | Table → definition list |
| 10 | **Release and download panel** | Current stable release, status | Section 18 component |
| 11 | **Documentation and installation guidance** | Short 3-step overview + links | Static summary; full guide lives in docs |
| 12 | **Release notes excerpt** | Latest release highlights | From release data |
| 13 | **Community and support** | Where to get help | `[REQUIRES CONFIRMATION: support model]` |

### 15.3 OS-specific components

| Component | Description | Notes |
|---|---|---|
| **OS Stage** | Wide container (dark-token scope in light theme) holding an environment preview, caption and Evidence Label | Priority image only if this is the LCP element for the OS page; otherwise lazy |
| **Environment gallery** | Accessible tab/list control swapping screenshots with captions | Keyboard operable; each image has meaningful alt text; no auto-advance |
| **Experience sequence** | Vertical list of steps; each step has a framed visual and a one-line caption | Replaces a "feature card grid"; scroll-linked effects not required |
| **Voice interaction panel** | Command → response → effect, in transcript format | Static by default; any looping animation is under 5 seconds or has a pause control (WCAG 2.2.2) |
| **Privacy statement block** | Short statement + "Basis" link per claim | Content is gated by the confirmation workflow |
| **Requirements table** | Minimum and recommended | `[REQUIRES CONFIRMATION]` |
| **Install overview** | Three short steps, linking to full docs | Does not duplicate the installation guide |

### 15.4 Fallback when no public release exists

The page keeps its structure; the primary CTA becomes **Join waitlist** (or **Explore**), the status chip reads *In development* or *Coming soon*, the download panel renders the status state defined in section 18, and any module that depends on non-existent evidence is omitted rather than filled with illustration presented as fact (Inherited 01 §11.4, 02 §9.6).

---

## 16. Services experience

### 16.1 Register

Services share tokens, type and grid with products but use a **calmer, structured register**: graphite accent, ledger rows, process flow lines, system-sketch diagrams, no device frames, no product accents. The narrative is **Problem → HENU approach → Solution → Technology → Outcome** (Inherited 01 §13.4).

### 16.2 Services hub

- Opens with a problem-led statement ("what HENU can build for you"), not a service list.
- Services are grouped by the categories recommended in 01 §13.2 (Software & Product Engineering, AI & Automation, Brand & Growth, Business Solutions). **The category list is data-driven**, so Legal Service and Funding Solution can be omitted, separated or shown with a distinct label without redesign `[REQUIRES CONFIRMATION: public listing]`.
- Each category is a block of ledger rows: problem-led service label, a one-line statement, a trailing link.
- A single shared "How HENU works" signal appears only if HENU's real process is confirmed (01 §13.5).
- Primary CTA: **Discuss a project**. Secondary: View relevant work (only when work exists).

### 16.3 Service detail template

| # | Module | Content | Visual device |
|---|---|---|---|
| 1 | Service hero | Problem-led statement, one-line scope, **Start an enquiry** | Statement left; small structured sketch right (optional) |
| 2 | Customer problem | The situation and its cost, in plain language, no sweeping claims | Editorial text |
| 3 | HENU approach | How HENU thinks about it | Short statement + 3 principles as ledger rows |
| 4 | Solution and deliverables | What the client receives | Deliverables list with a one-line definition each |
| 5 | Technology and capabilities | The expertise behind it, **with a "why"** per item | Capability list (name, why, link to related product/doc); never a logo wall |
| 6 | Process | HENU's actual stages, if confirmed | Process flow: horizontal on laptop+, vertical on mobile; stage count follows data |
| 7 | Evidence | Linked case study or product proof | Evidence row; omitted if none |
| 8 | FAQ | Real questions only | Native disclosure list |
| 9 | Enquiry CTA | Prefilled project enquiry for this service | CTA block + form entry |

### 16.4 Services components

| Component | Purpose | Variants |
|---|---|---|
| Service ledger | List services by category | Compact / expanded |
| Service hero | Open a service page | With / without sketch |
| Deliverable list | Define what is delivered | Ordered / unordered |
| Capability list | Technology in context | With related-product link |
| Process flow | Show stages | Horizontal / vertical; stage data-driven |
| Service FAQ | Remove objections | Disclosure list |
| Service CTA | Start enquiry | Prefilled with service |

---

## 17. Projects and case studies

### 17.1 Principles (Inherited from 01 §14)

The Work area presents **evidence that HENU can solve meaningful problems**, not a gallery. It launches with the number of case studies HENU can substantiate. Outcomes are measured only when verified; otherwise qualitative and labelled as such. No metric is ever invented.

### 17.2 Case study template

| # | Module | Content |
|---|---|---|
| 1 | **Project identity** | Title; client name **only if permitted** (otherwise a descriptive label such as "a regional healthcare provider" if approved); sector; services used; technology summary; year only if verified |
| 2 | **Challenge** | The problem |
| 3 | **Context** | Situation and constraints |
| 4 | **Approach** | How HENU worked |
| 5 | **Solution** | What was built |
| 6 | **Technology** | Technologies used, each with why |
| 7 | **Outcome** | Measured or qualitative (see 17.3) |
| 8 | **Evidence** | Framed screenshots with Evidence Labels; permitted quotes |
| 9 | **Related** | Related service(s) and product(s) |

### 17.3 Outcome panel states (honest by construction)

| State | Presentation |
|---|---|
| **Measured** | Each figure shown with value, unit, **source, owner and as-of date** (Inherited 01 §19.4). The panel cannot render a figure missing any of the three |
| **Qualitative** | Statement of what changed, labelled "Qualitative outcome", optionally approved by the client |
| **Pending** | Panel hidden; the case study stands without it |
| **Withheld** | A neutral note ("Details withheld at the client's request") when confirmed by HENU |

### 17.4 Components

| Component | Purpose | Notes |
|---|---|---|
| Project header | Identity and meta | Layout with side meta rail on laptop+ |
| Case study section | Challenge/Context/Approach/Solution blocks | Consistent heading levels; prose measure |
| Outcome panel | Measured/qualitative outcome | Enforces source/owner/as-of for figures |
| Evidence figure | Framed image + caption + Evidence Label | Alt text required for informative images |
| Quote | Permissioned testimonial | Requires attribution and permission `[REQUIRES CONFIRMATION]` |
| Related work | Lateral navigation | Ledger rows |
| Case study index | List | Ledger of entries; empty state when none (defers Work to V1.1) |

---

## 18. Download and release UI

### 18.1 Design goal

The user must reach the correct current stable download **without hunting**, understand exactly what they are getting, and be able to verify it. The experience is a trust-and-verification utility, not a link to an unexplained file (Inherited 01 §17.1).

### 18.2 Data-driven rule (Inherited 02 §9.2)

No component contains a literal version, URL, size or checksum. Every download surface (home, product page, downloads page, docs references) reads the same release data. The UI states are derived from data; the UI never disagrees with itself.

### 18.3 Downloads page structure

| # | Module | Content |
|---|---|---|
| 1 | **Status banner** | Present only when relevant: beta notice, no-public-release status, withdrawn release |
| 2 | **Current stable panel** (above the fold) | Product name; version (`type-data`); release date; channel chip; artifact rows; primary Download action |
| 3 | **Artifact rows** | One per architecture/artifact (type, architecture, file name in mono, size, Download action) |
| 4 | **Checksum block** | SHA-256 for each artifact, mono, selectable, wrapping, with a copy control |
| 5 | **Verify your download** | Short steps for checking the checksum, linking to the full guide |
| 6 | **System requirements** | Minimum/recommended |
| 7 | **Install and upgrade** | Short pointer plus links to documentation |
| 8 | **Release notes (latest)** | Summary with link to full notes |
| 9 | **Previous releases** | Ledger/table of older versions |
| 10 | **Other channels** | Beta/nightly (if any) collapsed and labelled "Not for production use" |
| 11 | **Download didn't start?** | Recovery guidance: retry, check connection and free space, compare file size, alternative source if one exists |

### 18.4 Download panel anatomy

| Element | Specification |
|---|---|
| Product + version | Version in `type-data`; product name `type-h3` |
| Release date | Formatted by the locale-aware date helper |
| Channel chip | Stable / Beta / Nightly with glyph + text |
| Artifact row | `[Type] [Architecture] [File name — mono, wraps] [Size] [Download button]` |
| Primary action | One ember button for the recommended artifact; others use the secondary style |
| Checksum | Label "SHA-256 checksum for integrity verification" (see wording rule below); value in `type-data-small`, wraps at any character, selectable; a labelled copy button; copy confirmation announced via a polite live region |
| Signature | Row only if signing exists `[REQUIRES CONFIRMATION: 01 §17.2, 03 §21]` |

**Wording rule (Inherited 03 §21.3):** the page must **not** say "verified", "authentic", "secure download" or "signed" unless the corresponding control actually exists. A checksum shown beside the link on the same website protects against corruption and some partial compromises, not against a compromised website. Approved wording: *"SHA-256 checksum for integrity verification."* If detached signatures are introduced, the panel adds a separate signature row and a public-key guide.

### 18.5 States

| State | Presentation |
|---|---|
| **Available (stable)** | Standard panel |
| **Beta** | Panel plus visible beta notice; stable remains the primary if it exists |
| **No public release** | Status panel: status chip (In development / Coming soon), a plain statement, a **Join waitlist** form (email only, with privacy note) or a notification link, links to documentation and the roadmap. **No dead download button** (Inherited 01 §17.4) |
| **Withdrawn release** | Banner stating the release was withdrawn with a reason if one exists; download action removed; link to the current release; remains in history with the withdrawn chip |
| **Release data unavailable** | Safe fallback message with a contact path; no empty panel; error logged server-side |
| **Artifact host unreachable / download failed** | Recovery panel (above) and an alternative source if available |
| **Loading** | Not applicable on the static page; any client enhancement shows no spinner for static data |
| **Empty history** | "No previous releases" |

### 18.6 Download behaviour constraints

- The download link points **directly** to the separate download origin (02 §9.5); the app does not proxy the file.
- Cross-origin links cannot rely on a browser "save as" attribute; the design does not promise a download dialog, a progress indicator or a "your download has started" toast that the app cannot observe. Instead, the page shows static guidance about what to expect.
- A large file size is shown **before** the click.
- No download-gating forms (no email wall).

### 18.7 Responsive behaviour

| Class | Behaviour |
|---|---|
| Mobile | Artifact rows become stacked cards (type/architecture/size over file name over actions); the checksum block takes full width with wrapping; copy button ≥44 px; requirements as definition list; previous releases as stacked cards |
| Tablet | Two-column artifact rows; requirements table |
| Desktop | Row layout; previous releases as table |

### 18.8 Release details (`/releases/[version]`, V1.1; V1 if history exists)

Header (product, version, date, channel, status chip); links to download and documentation; release notes as prose with categorised lists (e.g., Added, Changed, Fixed, Security `[REQUIRES CONFIRMATION: taxonomy]`); artifacts and checksums reproduced from the same data; previous/next release navigation.

---

## 19. Documentation UI

### 19.1 Register

Documentation feels related to HENU (same tokens, type and links) but is **optimised for reading, not marketing**: no hero imagery, no promotional CTAs, no motion beyond focus and hover, high information density, stable navigation (Inherited 01 §16.4).

### 19.2 Layout

| Area | Desktop | Tablet | Mobile |
|---|---|---|---|
| Header | Standard header (sticky) | Same | Same |
| Left sidebar (docs tree) | 280 px, sticky, scrolls independently | Collapsible disclosure | Inside a "Menu" disclosure |
| Content | Prose measure (≤760 px) | Full width within gutters | Full width |
| Right rail ("On this page") | 240 px, sticky, current heading marked | Hidden; moved above content as disclosure | "On this page" disclosure at top |
| Breadcrumbs | Above title | Same | Same |
| Previous/Next | Bottom of article | Same | Stacked |

### 19.3 Components

| Component | Specification |
|---|---|
| **Sidebar navigation** | Nested list with section headings; current page marked with `aria-current` and a text/weight change as well as colour; sections only for categories with real content (01 §16.3); keyboard-accessible disclosure groups |
| **Breadcrumbs** | As section 13.5 |
| **Headings** | Linkable anchors that appear on hover **and** keyboard focus; heading hierarchy strictly sequential |
| **Version applicability** | A line at top: "Applies to HENU OS `<version range>`" (Inherited: docs must state which version they apply to, 01 §16.4); links to the relevant release |
| **Inline code** | Mono, subtle muted-surface background, small radius; wraps; ≥4.5:1 contrast |
| **Code blocks** | Syntax highlighted at **build/server time** (no client highlighting runtime); optional filename header; optional language label; copy button (labelled, with live-region confirmation); long lines scroll horizontally inside a focusable region with an accessible name; wrap toggle optional (Future); line numbers off by default |
| **Tabs** | For platform/variant alternatives; keyboard operable; panel content in DOM order; deep-linkable selection optional (Future) |
| **Callouts** | Four types: **Note**, **Tip**, **Warning**, **Danger**. Each has an icon **and** a visible text label; background uses the semantic surface tint; never colour alone. Warning/Danger content is not collapsed |
| **Tables** | Per section 10.3; header cells scoped; caption; sticky first column optional |
| **Copy buttons** | 44 px target on touch layouts, labelled by content ("Copy command"), announces "Copied" politely, never copies decorative prompts unintentionally (command blocks copy the command without a leading prompt character) |
| **Previous/Next** | Titles shown; order from the content tree |
| **Search** | Not V1. When introduced, prefer a static, build-time index requiring no third-party service; design reserves a header slot and a dialog pattern. Only when content volume justifies it (Inherited: Future) |
| **Mobile navigation** | "Menu" and "On this page" disclosures in a compact bar beneath the header; no off-screen horizontal tab strips |

### 19.4 Content safety constraints (Inherited from 03 §30)

Documentation is rendered through an **allowlisted set of components**; raw HTML is disabled; links are validated; external links use appropriate relationship attributes; images come only from allowed origins; any embed is a facade. The component set in this document is the allowlist: Prose, Heading, Callout, CodeBlock, Tabs, Table, Figure, Link, List, VersionApplicability, Kbd, Steps.

### 19.5 Release notes in docs

Release notes use the same category lists as `/releases/[version]` and link to the matching documentation; documentation pages link back to the release they apply to (Inherited 01 §16.4).

---

## 20. Contact and enquiry components

### 20.1 Approach

There is no single "Contact us" form (Inherited 01 §18.1). The Contact page opens with an **intent selector**; each intent leads to the lightest appropriate interaction. Forms ask only for what is needed to respond (01 §18.3).

### 20.2 Intent set (Recommendation)

The brief lists six contexts. Against 01 §18.2 this document recommends four forms plus two non-form routes, to avoid near-duplicate forms:

| Context in brief | Treatment | Reason |
|---|---|---|
| General contact | **Form: General enquiry** | Required (V1) |
| Service enquiry + project enquiry + business enquiry | **One form: Project enquiry**, with the service pre-selected from page context | These three share the same information needs; separate forms would duplicate fields and confuse visitors. "Business enquiry" is reflected as the *organisation* field and a "type of organisation" option inside this form |
| Partnership enquiry | **Form: Partnership enquiry** (short; may share the General form's shell with a type selector) | Required (V1, simple) |
| Technical support | **Guidance panel: documentation and community first, with a fallback email**; dedicated form is V1.1 | Inherited: support form deferred to V1.1; route to docs first `[REQUIRES CONFIRMATION: support model]` |
| Media | Contact address only, no form | 01 §18.2 |
| Waitlist (when no release) | Minimal email form on the HENU OS/Downloads page | Section 18.5 |

### 20.3 Fields by form

| Form | Required | Optional (clearly marked) | Notes |
|---|---|---|---|
| General enquiry | Name, email, message | Organisation | |
| **Project enquiry** | Name, email, short description of the need, service of interest (pre-selected, changeable) | Organisation, type of organisation, timeline | No budget field by default (`[REQUIRES CONFIRMATION]` if the business wants it); no more than seven fields total |
| Partnership enquiry | Name, email, organisation, short description of the proposed partnership | Website | |
| Waitlist | Email | Product of interest if multiple | One field and one button |

### 20.4 Field and form behaviour

| Aspect | Specification |
|---|---|
| **Labels** | Visible text label above every control; placeholder is never a label substitute; placeholders are examples only and meet contrast |
| **Required/optional** | Optional fields marked "(optional)"; required fields are the default so no asterisk legend is needed; stated once at the form's top |
| **Help text** | Associated programmatically with the control; used for format hints and privacy cues |
| **Validation timing** | On submit; after first submit or after blur of a field the user has touched, errors update as they correct; never validate on first focus. **Server-side validation is authoritative** (Inherited 02 §15) |
| **Error presentation** | An **error summary** at the top of the form (moves focus there on failed submit) listing each problem as a link to its field; each field shows an inline message beside the control, associated through the control's description; messages state the fix ("Enter an email address like name@example.com") not just the fault; **icon + text** accompany the danger colour |
| **Loading state** | The submit button changes its label to a pending phrase and signals busy state; it does not rely on a spinner alone; input values are preserved; double-submit is prevented |
| **Success state** | Replaces the form with a confirmation panel that moves focus to its heading; states what happens next; states a response-time expectation **only if HENU can honour it** `[REQUIRES CONFIRMATION]`; offers a next step (read documentation, return home); never clears into an empty page |
| **Error (server/network)** | Preserves all input; explains in plain language; gives a retry action and a fallback contact method (email address) |
| **Rate-limited** | A specific message ("Too many attempts. Please wait and try again.") with no technical detail; input preserved |
| **No lost input** | Failed submissions never clear fields (Inherited 01 §18.3) |
| **Redundant entry** | Information provided earlier in the same flow is not requested again (WCAG 3.3.7) |
| **Autocomplete** | Appropriate autofill hints on name, email and organisation fields |
| **Privacy messaging** | One-sentence notice beside the submit button stating what the data is used for, with a link to the Privacy Policy; consistent with actual handling `[REQUIRES CONFIRMATION: legal review]`. A consent checkbox is used only if legal review requires it; if used, it is **unchecked** by default |
| **Plain-text only** | The message field is plain text; the UI does not offer rich formatting (Inherited 03 §30: enquiry content is escaped plain text) |

### 20.5 Spam protection integration (Inherited 03 §19)

| Control | UI treatment |
|---|---|
| **Honeypot field** | Rendered off-screen, removed from the tab order and hidden from assistive technology; never visually perceivable. A QA test confirms keyboard and screen-reader users cannot reach it |
| **Time-to-submit token** | Hidden field, generated server-side; no visible UI |
| **Adaptive challenge** | The challenge slot is **empty by default**. If risk signals appear, it renders inline beneath the message field with its own label and error handling. The chosen provider must offer an accessible alternative and must not rely on a visual-only puzzle as the sole method (WCAG 3.3.8 accessible authentication) `[REQUIRES CONFIRMATION: provider]` |
| **Rate limiting** | Surfaces only through the "rate-limited" message |
| **Client-side only checks** | Never trusted; they exist for feedback only |

### 20.6 Contact page layout

Intent selector (radio-style rows, not cards) → chosen form in the Narrow container → alternative channels (email, documentation, community) → expectations about response `[REQUIRES CONFIRMATION]`. On mobile the selector stacks and the form is single-column with full-width controls.

---

## 21. Admin UI

### 21.1 Scope reality (Inherited 02 §12, 03)

- **V1: there is no custom admin UI.** Enquiries are stored and emailed; operators review through the managed database dashboard.
- **V1.1:** a minimal admin with an **Enquiries module**, and a **Releases module only if** releases move to the database.
- **Future:** other modules only when a concrete need appears.

This document therefore defines the admin design system as a **small, dense variant of the public system**, not a dashboard platform. It does not design modules for content types that 02 keeps in source control (products, services, projects, blog, documentation, media) because there is no requirement for an interface to manage them; designing them now would be speculative.

### 21.2 Principles

| Principle | Detail |
|---|---|
| Same foundations | Same tokens, type, focus and form primitives; admin supports light and dark |
| Density variant | A compact density option (smaller vertical padding, `type-body-sm` in tables) while keeping 24 px minimum targets and 44 px where touch is plausible |
| No marketing styling | No display type, no decorative motion, no product accents |
| Strict content safety | Enquiry content is displayed as **escaped plain text only**, never as HTML or Markdown (Inherited 03 §14/§30) |
| No third-party scripts | None on admin pages (Inherited 03 §16, §31) |
| Isolated layout | Admin has its own layout and shell; public chrome never renders in admin and vice versa |
| Accessible authentication | Sign-in avoids cognitive-test challenges; supports password managers and paste (WCAG 3.3.8) |
| Destructive and critical actions | Confirmation dialog for destructive actions; **step-up re-authentication** dialog before publish/withdraw release or changing artifact URL/checksum (Inherited 03 §24) |

### 21.3 V1.1 admin components

| Component | Purpose | States |
|---|---|---|
| Admin shell | Header, side navigation, content area | Collapsed/expanded side nav on small screens |
| Data table | List enquiries with filters, sort, pagination | Loading skeleton, empty, error, no-results |
| Filter bar | Filter by status, type, date | Applied, cleared |
| Status select | Change enquiry status (e.g., new, in progress, resolved, spam) `[REQUIRES CONFIRMATION: workflow states]` | Pending, success, error |
| Detail panel | View one enquiry as plain text with metadata | |
| Confirm dialog | Destructive/irreversible actions | |
| Step-up dialog | Re-authentication before critical actions | |
| Release form (only if DB-managed) | Create/edit a release in draft; publish/withdraw | Validation per schema, draft/published/withdrawn |
| Toast/inline status | Result of actions | Success, error |

**Future (not designed now):** content management, product/service/project management, blog management, media management, dashboards, RBAC management.

---

## 22. Component architecture

### 22.1 Layered model

```text
Design Tokens
    ↓
Primitives      (ui/)        generic, accessible, product-agnostic
    ↓
Patterns        (patterns/)  reusable compositions of primitives, domain-agnostic
    ↓
Sections        (sections/)  page-level blocks composed of patterns (hero, ecosystem, CTA band)
    ↓
Page Templates  (templates)  product page, service page, docs page, release page, case-study page
    ↓
Pages           (app/)       thin: fetch via services, choose template, pass typed props
```

Feature components (`features/`) are domain-aware compositions (ProductSummary, ReleaseTable, EnquiryForm, DocsSidebar) that receive typed props. They sit alongside patterns and sections as the mechanism for domain knowledge (Inherited 02 §5.2).

### 22.2 Layer rules

| Layer | May contain | Must not |
|---|---|---|
| **Tokens** | Colour, type, spacing, radius, elevation, motion, layers | Reference components |
| **Primitives** | Button, Link, Input, Select, Checkbox, Radio, Textarea, Badge, Icon, Tooltip, Dialog, Tabs, Disclosure, Separator, Heading, Text, Container, VisuallyHidden | Domain knowledge, data fetching, hard-coded colours or sizes |
| **Patterns** | Field (label + help + error), CTA block, Feature row, Ledger row, Status chip with label, Evidence label, Copy button, Search input, Callout, Figure | Page-specific copy or product names |
| **Sections** | Hero, Ecosystem, Product stage, Services band, Proof strip, Intent router, Technology section | Fetching data (they receive props) |
| **Templates** | Compose sections for a page type | Business logic |
| **Pages** | Route, metadata, calling services, choosing a template | Direct database/content-file access (Inherited 02 §10.2) |

### 22.3 Reuse discipline

- **Do not create a component for a single page** unless a second use is planned within the V1 scope. A repeated pattern is extracted on its **second** use.
- **Variants over new components:** a Button has variants (primary, secondary, tertiary, destructive) and sizes, not four components.
- **Composition over configuration explosion:** a component with more than roughly six visual props is split.
- Section and page components receive **typed, already-fetched props**; they never fetch themselves.

---

## 23. Component states

### 23.1 State model

Every interactive component defines the states it supports from this set. A component that omits a state states why.

| State | Requirement |
|---|---|
| **Default** | Resting appearance |
| **Hover** | A visible change (colour, underline, surface step); never the only way to discover an action |
| **Focus** | Always visible (see 23.2) |
| **Active/pressed** | Visible change within `--duration-press`; no layout shift |
| **Selected/current** | Communicated by more than colour (weight, marker, underline, check) and exposed programmatically |
| **Disabled** | Reduced emphasis **and** removed from interaction; where a reason helps (e.g., "Select a service first"), it is stated in text. Disabled controls are avoided for submit buttons: prefer enabled buttons that explain the error on submit |
| **Loading** | Text change plus busy state; no spinner-only communication; interaction blocked where double-submit would be harmful |
| **Success** | Text confirmation with an icon, programmatically announced |
| **Error** | Text message with an icon, associated to the field/region and announced |
| **Empty** | Explains what would appear and what to do next; never a blank area |

### 23.2 Focus indicator specification

- Two-part indicator: **2 px solid ring in `--color-focus-ring`**, separated from the element by a **2 px offset in the background colour**, so it remains visible on any fill (including the ember primary).
- Applies to every focusable element, with keyboard-focus (focus-visible) styling; mouse clicks do not show the ring on buttons, but text inputs always do.
- Minimum 3:1 contrast against adjacent colours (see 5.6: 17.32:1 light, 16.07:1 dark).
- Focus is never removed without a replacement. The focus ring is not clipped by overflow containers; where a container would clip it, padding is added.
- Focused elements are never hidden beneath the sticky header (WCAG 2.4.11) through scroll padding.

### 23.3 Specific state matrices

| Component | Default | Hover | Focus | Active | Selected | Disabled | Loading | Success | Error | Empty |
|---|---|---|---|---|---|---|---|---|---|---|
| Button | ✓ | ✓ | ✓ | ✓ | — | ✓ (rare) | ✓ | — | — | — |
| Link | ✓ (underlined) | ✓ (thicker underline) | ✓ | ✓ | current page | — | — | — | — | — |
| Input/Textarea | ✓ | ✓ | ✓ | — | — | ✓ | — | ✓ (rare) | ✓ | — |
| Select/Radio/Checkbox | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | — |
| Nav trigger | ✓ | ✓ | ✓ | ✓ | expanded + current | — | — | — | — | — |
| Tab | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| Disclosure | ✓ | ✓ | ✓ | ✓ | open | — | — | — | — | — |
| Copy button | ✓ | ✓ | ✓ | ✓ | — | — | — | "Copied" | "Copy failed — select and copy" | — |
| Download button | ✓ | ✓ | ✓ | ✓ | — | — | — | — | recovery guidance panel | status state (no release) |
| Form | ✓ | — | — | — | — | — | submitting | confirmation panel | summary + inline | — |
| Data/list region | ✓ | — | — | — | — | — | skeleton | — | error state | empty state |

---

## 24. Accessibility

Target: **WCAG 2.2 Level AA** where practical (Inherited 01 §23 `[REQUIRES CONFIRMATION: target level]`). **No claim of formal conformance or certification is made until independently audited.** Accessibility is part of component definition, not a final audit.

### 24.1 Requirements

| Area | Requirement |
|---|---|
| **Semantic HTML** | One `main`; landmarks (header, nav, main, footer); native buttons, links, lists, tables and form controls; headings sequential; no clickable divs |
| **Keyboard** | Everything operable by keyboard; logical order; no keyboard traps; skip-to-content link visible on focus; disclosures, tabs and dialogs follow established patterns |
| **Visible focus** | Per 23.2 |
| **Contrast** | Per 5.6; verified for every theme and state; focus, borders for controls and non-text graphics ≥3:1 |
| **Forms** | Programmatic labels; associated help and errors; error summary; clear required/optional; autocomplete hints; no time limits |
| **Errors** | Identified in text, announced, and offering a fix; not colour only |
| **Dialogs** | Focus moves in on open, is contained while open, returns to the trigger on close; Escape closes; background inert; accessible name |
| **Navigation** | Disclosure pattern, current page marked, consistent order across pages, same relative order for help/contact (WCAG 3.2.6) |
| **Images and alt text** | Informative images have meaningful alt text describing purpose, not "screenshot of…" boilerplate; decorative images have empty alt; complex diagrams have a text alternative adjacent (not only alt text); Evidence Label text is part of the figure caption |
| **Diagrams** | SVG with accessible title and description; the same information also appears as text (the ecosystem list) |
| **Reduced motion** | Honour the user setting (section 25); essential information never conveyed only by animation |
| **Motion over 5 seconds** | Auto-playing, looping motion either stops within five seconds or provides a pause control (WCAG 2.2.2) |
| **Screen readers** | Meaningful link text; live regions for asynchronous status (copy confirmation, form result); status chips expose their text; icons that carry meaning have accessible names, decorative ones are hidden |
| **Touch targets** | 44×44 px on touch layouts; 24×24 px floor everywhere (WCAG 2.5.8) with adequate spacing |
| **Dragging** | No functionality requires dragging (WCAG 2.5.7) |
| **Pointer/hover** | Content revealed on hover or focus is dismissible, hoverable and persistent (WCAG 1.4.13) |
| **Text resizing and spacing** | Content survives 200% text size and text-spacing overrides; reflows at 320 px width |
| **Language** | `lang` set on the page; future-language fragments marked |
| **Media** | Captions and transcripts for video demonstrations; no autoplay with sound |
| **Authentication** | Admin sign-in avoids cognitive function tests (WCAG 3.3.8) |
| **Documents** | Legal and docs pages use real headings, lists and tables; PDFs, if ever offered, are secondary and accessible |

### 24.2 Accessible patterns required before launch

Disclosure navigation; mobile nav sheet (modal); tabs; native details for FAQ; copy buttons with live regions; code-block scroll regions; scrollable table regions; form error summary; status chips; media facade with accessible play control.

### 24.3 Process

Automated checks in component and end-to-end tests (Inherited 02 §20), plus manual keyboard and screen-reader spot checks on critical journeys (home → product → download; home → services → enquiry; docs navigation), plus contrast verification tied to token changes.

---

## 25. Motion and interaction design

### 25.1 Philosophy (Inherited 01 §8 principle 4)

**Motion communicates, not distracts**: it clarifies structure, state or cause and effect. HENU's motion is short, quiet and mostly CSS. Nothing moves constantly.

### 25.2 Motion specification

| Motion | Behaviour | Tokens |
|---|---|---|
| **Page entrance** | None for content. A fade of the main region on route change is optional and short; content is never delayed | `duration-page` |
| **Section reveal** | A section's contents may fade in with a very small upward offset (single pass) as they enter the viewport. Content must be visible without JavaScript and without the animation completing; reveal never hides content from screen readers or print | `duration-slow`, `ease-enter`; max travel 8–12 px |
| **Hover** | Colour/underline/surface changes only; no scale or bounce | `duration-fast` |
| **Button feedback** | Press: slight darkening and 1 px translate (or none); no ripple | `duration-press` |
| **Navigation panels** | Fade and a few pixels of vertical offset on open; faster on close | `duration-standard`, enter/exit curves |
| **Disclosure** | Height change through native behaviour or short transition | `duration-standard` |
| **Product visualisation** | The locator and ecosystem map draw their connecting lines once on first view (single pass, final state static); highlight transitions on focus/hover | `duration-slow` |
| **Image transitions** | Cross-fade between environment-gallery frames; no sliding carousels; no auto-advance | `duration-standard` |
| **Loading** | Skeleton shapes for content regions that actually load asynchronously (rare in this static-first site); a subtle spinner only for pending submissions | `ease-linear` for spinner |
| **Scroll-linked effects** | Only functional ones: the docs "On this page" active-heading marker; the stack-rail position indicator. **No parallax**, no pinned scroll-jacking, no scroll-driven transformations of content | — |
| **Theme change** | Instant (transitions suppressed) | `duration-instant` |

### 25.3 Reduced motion

With `prefers-reduced-motion: reduce`: reveal animations become instant; line-drawing is replaced by the final static state; no transforms; cross-fades shorter than 120 ms or instant; any looping animation is removed; scroll-linked indicators remain (they are state, not motion) but update without easing.

### 25.4 Mechanism and library decision

**No animation library in V1** (Inherited 02 §5.4). CSS transitions, native details/dialog behaviour and, for scroll-triggered reveal, either CSS scroll-driven animation with a safe fallback or one tiny shared intersection-observer island. A library such as Framer Motion or GSAP would be justified **only** for the Future interactive OS preview or a complex sequence that CSS cannot express, after a performance review and with reduced-motion support; adoption requires a documented reason under 02 §27.

### 25.5 Motion budget

No animation may cause layout shift, run on the main thread for long periods, or reduce INP/LCP. Animations use transforms and opacity only. A page with more than a few simultaneous animated regions is rejected in review.

---

## 26. Iconography, illustration, 3D and visualisation strategy

### 26.1 Iconography (Recommendation)

- **One icon style:** outline, 24 px grid, 1.5 px stroke, rounded joins, square-leaning terminals consistent with the geometry; no filled/outline mixing within a set; no duotone.
- **Source:** one tree-shakable SVG icon library as the base for UI icons (functional icons such as arrow, copy, check, external link, menu, close, chevron), imported **per-icon** so unused icons never ship; library choice confirmed at implementation `[REQUIRES CONFIRMATION]`.
- **Custom set (small):** product marks (OS, PA, AI, IDE), status glyphs, locator node glyphs. Designed on the same grid and stroke. Product marks are `[REQUIRES CONFIRMATION]` (brand owner approval).
- **Rules:** icons never replace text for meaning; icon-only buttons have an accessible name and a tooltip; decorative icons are hidden from assistive tech; sizes 16/20/24 px only.

### 26.2 Illustration

- Prefer **technical diagrams**: layered stacks, flows, simple system sketches in the token palette, line weight consistent with iconography. They explain; they do not decorate.
- No mascots, characters or stock illustrations as identity. If a brand mascot exists `[REQUIRES CONFIRMATION]`, it appears only on About or in rare editorial moments.
- Diagrams are inline SVG (themeable) with text alternatives; simplified redraws for mobile.

### 26.3 What visual to use when

| Need | Use | Avoid |
|---|---|---|
| Show what the product looks like | **Real screenshot** in a registered frame, Evidence Label: *Screenshot* | Fabricated UI passed off as real |
| Show a behaviour over time | **Recording** with poster, captions, transcript; label: *Recording* | Silent autoplay loops |
| Explain structure or relationships | **Technical diagram** (SVG); label: *Illustration* | Abstract "tech" art |
| Show a future/planned capability | Labelled *Concept* visual with an *In development* chip | Presenting concepts as shipped |
| Express brand mood | Typography, colour and composition | Glow, particles, code rain |
| Hardware/device context | Minimal device frame **only** when it adds meaning | Stock laptop photography |
| Team/company (About) | Real photography of real people, if provided `[REQUIRES CONFIRMATION]` | Stock people |

### 26.4 3D strategy

- **V1: no 3D.** The design is complete without WebGL, and the PRD defers an interactive OS preview to Future.
- **Future (strong candidate): interactive HENU OS preview**, loaded lazily on explicit interaction or viewport trigger, behind a performance review (Inherited 02 §18.1).
- 3D must communicate something (e.g., how the layers relate, an interactive environment tour) rather than decorate.
- **Fallbacks:** a static poster/screenshot for no-JavaScript, low-power, saved-data and reduced-motion contexts; and on small screens by default. The page must be fully understandable without the 3D.
- No 3D asset blocks LCP; no site section depends on WebGL.

---

## 27. Image and media system

### 27.1 Standards by media type (Inherited from 02 §18; extended)

| Media | Standard |
|---|---|
| **Product screenshots** | Real states only; captured at 2× the maximum display size; delivered through the image optimisation pipeline in modern formats with fallbacks; framed with Evidence Label and caption; light/dark variants only when the product supports both |
| **Marketing imagery** | Used sparingly; must communicate something; no stock photography in V1 unless confirmed |
| **Project screenshots** | Only with client permission; redacted of sensitive data `[REQUIRES CONFIRMATION]`; labelled |
| **Video** | Hosted on object storage + CDN or a managed platform `[REQUIRES CONFIRMATION]`; never committed to the repository; multiple encodes; poster image; captions + transcript; user-initiated play; no autoplay with sound; heavy embeds as facades |
| **Background video** | Allowed only if short, muted, looped, compressed, disabled under reduced motion and constrained on small/low-power connections, never blocking LCP, never carrying information. **Not used in V1 designs** |
| **GIFs** | Avoided; use short MP4/WebM with controls or a static frame |
| **Diagrams** | Inline SVG (small or themed) or optimised external SVG; text alternative adjacent |
| **Illustrations** | Vector first |
| **Logos** | SVG, theme variants; third-party/customer logos only with permission and provenance `[REQUIRES CONFIRMATION]` |
| **Avatars** | Real photos only if people are shown; fixed square ratio; alt text with the person's name |

### 27.2 Aspect-ratio system

| Ratio | Use |
|---|---|
| 16:9 | Video, wide desktop screenshots |
| 16:10 | Laptop/desktop environment screenshots (default frame) |
| 3:2 | Editorial and case-study images |
| 4:3 | Smaller interface panels |
| 1:1 | Avatars, icons in lists |
| Intrinsic | Documentation images, diagrams (width and height always specified to prevent layout shift) |

All media reserve space through explicit width/height or aspect-ratio so nothing shifts on load.

### 27.3 Loading and optimisation

- **The single largest above-the-fold image is prioritised; nothing else above the fold is.** Below-the-fold media is lazy-loaded (Inherited 02 §18).
- Responsive sizing: multiple widths and formats via the framework pipeline with correct size hints.
- Compression before commit; per-asset size budgets enforced in CI where feasible `[REQUIRES CONFIRMATION: thresholds]`.
- Loading placeholder: a neutral surface-muted block with the reserved ratio (no animated shimmer required); optional blur-up only if it does not add weight.
- No image larger than its largest rendered size × 2.
- Alt text rules in section 24; captions carry the Evidence Label.
- Provenance (source, rights, date) tracked for assets that need permission (Inherited 02 §18.2).

---

## 28. Performance-aware design

Performance is a design requirement (Inherited 01 §25). A page that fails agreed thresholds is not complete.

### 28.1 Targets

Core Web Vitals "good" thresholds as published by Google, measured on field data at the 75th percentile: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. HENU-specific numeric budgets (JavaScript per route, image weight per page, font weight) are **to be established against a baseline** `[REQUIRES CONFIRMATION]` rather than invented here (01 §25, 02 §17).

### 28.2 Design decisions that protect performance

| Area | Decision |
|---|---|
| **LCP** | The homepage hero's largest element is text plus an inline SVG, not a photograph or video. Product pages have exactly one prioritised media element |
| **CLS** | Every image/video reserves its ratio; fonts use metric-matched fallbacks; late-loading UI (banners, panels) reserves space; no layout-changing client-side insertions above the fold |
| **INP** | Few interactive islands; no heavy client state; no long main-thread tasks on interaction; no animation library |
| **JavaScript** | Server Components by default; islands limited to the list in 29.3; third-party scripts only with justification and measured cost (Inherited 02 §5.4, 03 §31) |
| **Fonts** | One family plus mono, self-hosted, three Sans weights, mono loaded only where used, Latin subset first |
| **Images** | Optimised pipeline, correct size hints, modern formats, lazy below the fold |
| **Animation** | CSS, transforms/opacity only; no scroll-jacking; reduced-motion honoured |
| **Hydration** | Static content ships as HTML; islands hydrate independently; no wrapping a whole page in a Client Component |
| **CDN** | Static pages and assets served from the CDN with long-lived caching for fingerprinted assets; downloads from the separate artifact origin |
| **Progressive enhancement** | Navigation links, forms, disclosures and downloads work without JavaScript; JavaScript enhances (validation feedback, copy buttons, theme control, mobile sheet) |
| **Third parties** | No chat widgets, heatmaps or social embeds in V1; embeds only as facades |

### 28.3 Performance review gates

A design cannot ship if it: adds a second prioritised above-the-fold media element; autoplays video; introduces a new third-party script without a recorded justification; adds a client library without a documented reason; or measurably regresses LCP/CLS/INP on the mid-range mobile baseline.

---

## 29. Next.js frontend architecture

### 29.1 Rendering model (Inherited from 02 §5.1)

| Page type | Rendering |
|---|---|
| Home, About, Technology, Products, Services, FAQ, legal, case studies, product/service detail | Static generation |
| Documentation | Static generation from MDX |
| Downloads and releases | Static generation with on-demand revalidation |
| Blog (V1.1) | Static with revalidation |
| Contact | Static shell; mutation via Server Action |
| Admin (V1.1) | Dynamic, uncached, per-user |

### 29.2 Server Components (default)

Use for: all page content, product and service pages, documentation prose, release data display, the ecosystem map and locator markup, metadata generation, anything SEO-sensitive, and any data access through the service layer. Server Components receive no browser state and ship no JavaScript.

### 29.3 Client Components (islands, only where necessary)

| Island | Why client | Notes |
|---|---|---|
| Theme control (and the initialiser) | Browser storage and OS preference | Section 6 |
| Mobile navigation sheet | State, focus management | Small |
| Navigation disclosure panels (desktop) | State, keyboard handling | May share one small module with the mobile sheet |
| Context-aware header CTA | Reads the current route | Optional; see 13.1 |
| Copy button | Clipboard API, live region | Tiny, reused for checksums and code |
| Tabs (docs, environment gallery) | Selection state | Native elements where possible |
| Form enhancement | Pending state, error summary focus | Forms work without JavaScript; enhancement only |
| Docs sidebar disclosure and "On this page" active marker | State, observer | |
| Scroll-reveal observer (if used) | Observer | One shared island, not per component |
| Media facade (video play) | Loads player on interaction | |
| Search (Future) | Index and input | |

Rules: push client boundaries to leaves; never mark a page, section or layout as client to support one control; client islands receive serialisable props only; they never import from server-only modules (Inherited 02 §10.3).

### 29.4 Server Actions

Use for first-party mutations that are only consumed by this site: **project/general/partnership enquiries and waitlist submission**, and (V1.1) admin edits. Actions are thin adapters over the service layer (Inherited 02 §29.4). They return structured results the form can render (field errors, success, rate-limited, failure). All validation is schema-driven and server-authoritative.

### 29.5 API routes / Route Handlers

Only where an explicit API boundary or machine-readable endpoint is needed: webhooks, sitemap/robots/OG generation, and a future public read-only releases endpoint if a consumer exists (Inherited 02 §29). The UI does not fetch its own pages' data over the client; data reaches components as props.

### 29.6 Error, loading and not-found boundaries

Each route group defines loading, error and not-found boundaries using the system's EmptyState/ErrorState patterns. Error pages offer a way back (home, relevant hub) and a contact route; they never show stack traces or internal detail (Inherited 03 §22).

---

## 30. Folder and component organisation

### 30.1 Recommended structure (extends 02 §10.1; Deviations D1, D2)

```text
src/
├── app/
│   ├── (public)/               # marketing, product, service, docs, downloads, legal routes
│   ├── (admin)/                # V1.1; separate layout, guard, strict CSP
│   └── api/                    # route handlers (webhooks, machine-readable endpoints)
├── components/
│   ├── ui/                     # PRIMITIVES: button, link, input, dialog, tabs, disclosure, ...
│   ├── patterns/               # PATTERNS: field, cta-block, feature-row, ledger-row, callout, status-chip, evidence-label
│   ├── layout/                 # shell, header, footer, container, section, product-subnav
│   ├── sections/               # SECTIONS: hero, ecosystem, product-stage, services-band, proof-strip, intent-router
│   ├── features/               # DOMAIN components, grouped by domain
│   │   ├── products/           # ecosystem-map, locator, product-hero, spec-table, ...
│   │   ├── services/           # service-ledger, process-flow, deliverable-list, ...
│   │   ├── downloads/          # download-panel, artifact-row, checksum-block, release-list, ...
│   │   ├── docs/               # docs-sidebar, docs-toc, code-block, version-applicability, ...
│   │   ├── projects/           # project-header, outcome-panel, evidence-figure, ...
│   │   └── enquiry/            # intent-selector, enquiry forms, form status, ...
│   └── admin/                  # V1.1 admin components (never imported by public code)
├── templates/                  # PAGE TEMPLATES: product, service, case-study, docs, release, article, contact
├── styles/
│   ├── tokens.css              # primitive + semantic tokens, both themes
│   └── globals.css             # base, typography defaults, utilities
├── content/                    # as 02 (products, services, projects, docs, releases, blog)
├── server/                     # as 02 (services, repositories, db, auth, integrations)
├── lib/                        # pure utilities (formatting, slugs, version sorting)
├── config/                     # site config, navigation model, feature flags, env schema
├── types/                      # shared domain types
└── hooks/                      # client hooks, only if genuinely needed
public/                         # verbatim static assets only
```

### 30.2 Decisions on the structure

| Decision | Reason |
|---|---|
| `components/ui` stays the name for primitives | Aligns with 02 and common practice; avoids a second "primitives" folder |
| `templates/` at `src/` level (not under `components/`) | Templates are page compositions, not reusable components |
| `features/` grouped by domain | Prevents a flat folder of hundreds of components; mirrors content entities |
| Navigation model in `config/` | One source for header, footer, sitemap and breadcrumbs (02 §10) |
| `styles/tokens.css` is the only place raw colour values appear | Enforces "no random hex values" |
| `admin` components are separated | Public bundles never include admin code; supports the import-boundary rules (02 §10.3) |
| No generic `utils/` or `helpers/` | Pure utilities live in `lib/` with a clear responsibility (02 §10.2) |

### 30.3 Naming conventions

| Item | Convention |
|---|---|
| Files and folders | kebab-case (`download-panel.tsx`) |
| Components | PascalCase export, one primary component per file |
| Props types | `<Component>Props` |
| Variants | Named by role (`primary`, `secondary`, `quiet`), not value (`red`, `big`) |
| Tokens | Role-based (`--color-surface-muted`, never `--color-grey-100` in components) |
| Content slugs | Lowercase, hyphenated, human-readable (02 §11.3) |
| Tests | Colocated or mirrored under `tests/` per 02 §26 |
| Client components | Marked at the file top; file name unchanged; only leaf-level components carry the marker |
| Imports | Absolute alias for `src/`; import-boundary lint rules enforced (02 §10.3) |

---

## 31. Data and API integration

```text
UI (components)                    receive typed props
   ↑
Page / Template (Server Component) fetches through services
   ↑
Server Action / Route Handler      thin adapter (mutations, endpoints)
   ↑
Service layer (server/services)    business rules
   ↑
Repository / data access           files (V1 content) or database
   ↑
Content files / PostgreSQL / storage
```

Rules (Inherited 02 §13, §16):

- Components never import repositories, database clients or content files.
- Presentation components never fetch; pages and templates fetch and pass props.
- Release and download data always flows through the release service so every surface agrees.
- **Loading:** static pages have no loading state for content; dynamic regions use skeletons shaped like the final content.
- **Empty:** every list/region has an EmptyState that says what would appear and what to do (e.g., "No previous releases").
- **Error:** component-level and route-level error states offer a retry/back route and a contact path.
- **Success:** mutations return explicit success results that the UI renders (confirmation panel, live-region message).
- Status labels, versions and metrics come from data fields; they are never typed into component markup (Inherited 02 §28.3).
- A metric component refuses to render without value, source, owner and as-of date.

---

## 32. Design token implementation (Tailwind and CSS variables)

### 32.1 Goals

Support light/dark themes, future brand evolution, semantic colour changes, consistent spacing and typography, and component-level variants, **without scattering design values through JSX**.

### 32.2 Approach (Recommendation)

| Concern | Approach |
|---|---|
| **Source of truth** | `styles/tokens.css` defines primitives and semantic tokens as CSS custom properties; the light set is the default scope; the dark set is scoped to the theme attribute and (for the no-JS fallback) the OS-preference media query |
| **Tailwind consumption** | Tailwind's theme is configured so its colour, spacing, radius, shadow, font-size, line-height, tracking, duration and easing scales **resolve to the semantic tokens**; utility class names carry roles (e.g., a surface utility, a muted-text utility), not raw palette steps. The method differs by Tailwind generation (token-mapping theme block in the newer CSS-first configuration; theme extension in the configuration file in older versions); adopt the current stable version at kickoff (02 §3) and keep the *contract* identical |
| **Palette primitives** | Not exposed to components through Tailwind. Only semantic tokens are mapped, so components cannot reach for a primitive |
| **Arbitrary values** | Prohibited in component code by lint (arbitrary pixel/hex utilities); exceptions require a design-review note |
| **Variants** | A single variant helper per primitive (e.g., Button: variant × size × state), colocated with the component; variant names are roles |
| **Theme switching** | A token remap under the theme attribute; no `dark:`-prefixed utilities in components (a `dark:` utility indicates a missing semantic token). Exceptions: image/illustration selection and rare bespoke cases |
| **Dark-stage scope** | The HENU OS stage applies the dark token set to its container, so components inside use ordinary semantic utilities |
| **Typography** | Type roles defined as composite tokens (family, size, weight, leading, tracking) and exposed as role utilities (display, h1…h4, body-lg, body, body-sm, caption, label, eyebrow, code, data); responsive sizing lives in the token (fluid values), not at each use site |
| **Spacing** | Tailwind spacing scale restricted to the section 8.2 steps; section rhythm tokens exposed as section-padding utilities |
| **Radius, shadow** | Four radii and four elevation levels only |
| **Motion** | Duration and easing tokens exposed as utilities; a global rule resolves them to instant under reduced motion |
| **Brand evolution** | Changing a primitive (e.g., primary hue) or remapping a semantic token updates the entire site; Plan B palette (5.8) is exactly this operation |
| **Validation** | A token-contrast check in CI recalculates the pairings in 5.6 on every token change and fails the build below threshold |
| **Documentation** | A living token reference page (internal) renders every token in both themes, and is the review surface for token changes |

### 32.3 Token governance

- New tokens require: a role description, light and dark values, contrast results and an example use.
- Tokens are never deleted without a deprecation window and a search for usages.
- Product accents are added only after both-theme contrast verification and a locator legibility check.

---

## 33. Optional visual motifs

Used selectively; each must **reinforce hierarchy**, not repeat as decoration (this brief, §33).

| Motif | Where it is allowed | Where it is not |
|---|---|---|
| **Numeric labels** | Only for genuinely sequential content: process stages, installation steps, the experience sequence | As section labels on every section |
| **Monospace metadata** | Versions, filenames, checksums, release dates, short technical metadata; the eyebrow token sparingly (no more than one per page section group) | Body copy, headings, decorative "code-like" labels |
| **Hairline dividers** | Ledger rows, table rules, panel edges | Between every block on a page |
| **Grid/registration marks (corner ticks)** | Interface frames and diagrams only | Page backgrounds, cards, buttons |
| **Technical diagrams** | Ecosystem, architecture, process | As filler imagery |
| **Subtle technical markers** (e.g., a stack-rail position tick) | Long product pages and docs | Pages without long scroll |

Test: remove the motif; if comprehension or wayfinding is unchanged, the motif is decoration and should be removed.

---

## 34. What to avoid

| Anti-pattern | Why it harms HENU | Instead |
|---|---|---|
| Generic SaaS or agency template compositions | Makes HENU forgettable; mistakes it for an agency | Locator, ledger, evidence-labelled frames |
| Glassmorphism, blur panels | Weak contrast, cost, cliché | Flat surfaces and hairlines |
| Neon, glow, cyberpunk styling | Implies hype and a distro-site aesthetic | Restrained palette, ink neutrals |
| Gradients as identity | Interchangeable with AI products | Flat colour; optional faint tonal wash |
| Excessive rounded cards | Reads childlike; hides relationships | Small radii; ledger/map layouts |
| Every section a card grid | Visual monotony; products appear unrelated (PRD) | Vary archetypes per section 9.4 |
| Walls of text | Overload (PRD problem #8) | Progressive disclosure; two-register content |
| Tiny or low-contrast text | Accessibility failure | Type scale minimums; contrast rules |
| Decorative code and terminal everywhere | Misleads; undermines credibility | Real, labelled technical content only |
| Fabricated UI passed off as real | Violates evidence principle | Evidence Labels; omit what doesn't exist |
| Excessive 3D | Performance, distraction | None in V1; purposeful 3D later |
| Excessive animation, parallax, scroll-jacking | Distraction, accessibility, performance | Quiet CSS motion; reduced-motion |
| Random colours, random type, inconsistent spacing | Erodes the system | Semantic tokens; lint |
| Inconsistent icon styles | Looks assembled | One icon style |
| Technology logo walls | No context; excluded by PRD | Capability lists with "why" |
| Invented metrics, logos, testimonials | Credibility harm; prohibited | Metric component with enforced source/owner/date |
| Colour-only status | Accessibility failure | Glyph + text |
| Dead download buttons | Trust damage | Honest status state |
| Auto-playing carousels | Accessibility, attention theft | User-controlled galleries |
| Mobile as an afterthought | Primary reference experience | Per-class design (section 10) |
| Hiding information on mobile that desktop shows | Inequity of access | Reorder/collapse, never remove |
| Generic "Learn more" CTAs | Violates intent principle | Intent-specific labels |

---

## 35. Design system decision record

| Category | Final recommendation | Reason |
|---|---|---|
| Primary font | **IBM Plex Sans** (weights 400, 500, 600; self-hosted) | Engineered, legible for technical strings, distinctive vs Inter/Geist defaults, open licence, has a matching Devanagari design for a possible future |
| Secondary font | **None** | Hierarchy via weight/size/tracking; fewer font bytes; fewer inconsistencies |
| Monospace font | **IBM Plex Mono** (400, 500) | Same superfamily; used only for code, filenames, versions, checksums, short metadata |
| Primary colour | **Ember** `#C2370F` (light) / `#FF7448` (dark) | Distinctive in category; AA with white text (light) and ink text (dark); flagship = brand colour |
| Accent strategy | Four product accents (ember, teal, cobalt, moss) at **small scale**; graphite for services; semantic colours separate | Identifies products without page-wide theming; avoids confusing status with brand |
| Light theme | Paper `#FAFAF7`, white surfaces, ink text `#14161A`, strong border `#868B94` for controls | Warm, readable, premium; independent design |
| Dark theme | Ink `#0E1013`, surfaces `#15181D`/`#1C2027`, off-white text, lightened primary | Independently designed; elevation by surface step; avoids halation |
| Border strategy | Decorative hairlines + a **separate strong border** for control boundaries | Meets WCAG 1.4.11 while keeping a light visual touch |
| Radius strategy | 4 / 8 / 12 px and full only for dots, toggles, avatars | Engineered feel; avoids bubbly cards |
| Shadow strategy | Border and surface-step first; shadows only on overlays | Restraint; works in dark theme |
| Motion strategy | CSS-first; 5 duration tokens; no animation library in V1; reduced motion honoured; no parallax | Meets 02 §5.4; protects performance and accessibility |
| Icon style | Outline, 24 px grid, 1.5 px stroke, one library + small custom set | Consistency; per-icon imports |
| Illustration style | Technical diagrams in token palette (inline SVG); no mascots/stock | Explanatory, themeable, credible |
| 3D strategy | None in V1; lazy, purposeful interactive OS preview in Future with static fallback | Performance and honesty |
| Theme tooling | `next-themes` (or equivalent ~10-line initialiser), hash/nonce-allowed, localStorage | No flash, static pages preserved, CSP-compatible |
| Layout | 1280 px page container, 12-col grid, 68ch prose, docs shell 280/760/240 | Controlled widths; readable |
| Identity devices | Ecosystem Locator, Evidence Labels, Status Chips, ledger rows, registered frames | Recognisable without decoration; enforces PRD honesty |

All entries are **recommendations** for HENU review, not approved brand guidelines.

---

## 36. Page-level design inventory

| Page | Purpose | Primary components | Special UX requirements | Priority |
|---|---|---|---|---|
| **Home** | Establish identity; route journeys | Hero, Locator, Route strip, Ecosystem, OS stage, Proof strip, Technology section, Services band, Work (conditional), Intent router | One primary action per viewport; LCP is text + SVG; ecosystem list as text fallback | **V1** |
| **HENU OS** | Flagship product page | Product sub-nav, OS stage, Environment gallery, Experience sequence, Voice panel, Architecture diagram, Requirements table, Download panel | State-aware CTA; real evidence only; modules omitted rather than faked | **V1** |
| **Products overview** | Ecosystem and relationships | Ecosystem Map, Product ledger, Status chips | Not a card grid; dependency/independence notes | **V1** |
| **Product pages** (PA, AI, IDE, others) | Explain one product | Product template, signature module, Locator, Spec table | Launch-ready products only; honest status | **V1** (launch-ready) / **V1.1** (others) |
| **Services overview** | Present applied engineering | Services ledger by category, process signal, Discuss a project CTA | Data-driven categories (Legal/Funding conditional) | **V1** |
| **Service detail** | One service as a solution | Service template, deliverables, capability list, process flow, FAQ, enquiry CTA | Problem-led; prefilled enquiry | **V1** (validated) / **V1.1** |
| **Technology** | Engineering credibility | Two-register sections, architecture diagram, documentation links | No logo wall; plain-language summary first | **V1** |
| **Projects (index)** | Evidence overview | Case study ledger | Empty state; omit if none | **V1 conditional** / **V1.1** |
| **Case study** | Evidence of problem solving | Project header, sections, outcome panel, evidence figures | Honest outcome states; permission-gated | **V1 conditional** / **V1.1** |
| **Downloads** | Get and verify HENU OS | Download panel, artifact rows, checksum block, verify guide, requirements, history, recovery | Mobile-tested; honest no-release state; no dead buttons | **V1** (or status state) |
| **Release details** | One release's notes | Release header, notes, artifacts, prev/next | Same data source as downloads | **V1.1** (V1 if history exists) |
| **Documentation** | Learn, install, build | Docs shell, sidebar, TOC, code blocks, callouts, version applicability | Reading-optimised; allowlisted components | **V1** (entry + essentials) / **V1.1** expand |
| **Blog / Insights** | Publish useful content | Article layout, ledger index | Only with real content and an owner | **V1.1** |
| **About** | Company credibility | Statement, verified timeline, team/expertise (if confirmed), contact CTA | Only verified facts | **V1** |
| **Contact** | Intent-based routing | Intent selector, forms, alternative channels | Accessible errors; spam protection; mobile-tested | **V1** |
| **FAQ** | Remove genuine objections | Native disclosure list | Real questions only; may be embedded | **V1** |
| **Privacy** | Legal clarity | Legal document layout | Matches actual behaviour `[REQUIRES CONFIRMATION: legal review]` | **V1** |
| **Terms** | Legal clarity | Legal document layout | `[REQUIRES CONFIRMATION: legal review]` | **V1** |
| **Security / disclosure** | Responsible reporting | Prose, report contact, supported versions | Only genuine practices | **V1.1** (V1 if OS publicly distributed) |
| **Waitlist** | Notify when a release exists | Minimal email form | One field; privacy note | **V1 conditional** |
| **Not found / error** | Recover | Empty/Error state, search/links | Helpful way back | **V1** |
| **Admin** | Operate enquiries (and releases if DB) | Admin shell, data table, detail panel, step-up dialog | Plain-text rendering; strict CSP; no third parties | **V1.1** (Future for other modules) |

---

## 37. Component inventory

Legend: **Reuse** = reusable beyond one page. **Phase** = V1 / V1.1 / Future.

### Global
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Container | Constrain width | Yes | Page, wide, prose, narrow, docs | — | Gutters per class | V1 |
| Section | Vertical rhythm + background band | Yes | sm/md/lg spacing; plain/muted/stage | — | Rhythm tokens | V1 |
| Header | Global nav shell | Yes | Default, docs | Scrolled hairline | Inline → sheet | V1 |
| Footer | Structured footer | Yes | Default | — | Groups collapse | V1 |
| Skip link | Bypass to main | Yes | — | Focus visible | All | V1 |
| Theme toggle | Choose theme | Yes | Header, sheet | Current, focus | Inline / in sheet | V1 |
| Logo | Wordmark | Yes | Full, mark, light/dark | — | Min sizes | V1 |
| Page header | Title + intro | Yes | With/without breadcrumbs | — | Stacks | V1 |

### Navigation
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Primary nav | Top-level destinations | Yes | — | Current, expanded, focus | Sheet on mobile | V1 |
| Disclosure panel | Products/Services/Company panels | Yes | Products (flagship), simple list | Open/closed | Accordion in sheet | V1 |
| Mobile nav sheet | Full-height menu | Yes | — | Open, closing | Mobile/tablet only | V1 |
| Product sub-nav | Product-level anchors | Yes | — | Current anchor | Disclosure on mobile | V1 |
| Breadcrumbs | Location | Yes | — | Current | Wrap | V1 |
| Previous/next | Sequential navigation | Yes | Docs, releases | Focus | Stack | V1 |
| Table of contents | In-page nav | Yes | Docs rail / disclosure | Active heading | Disclosure on small | V1 |

### Typography
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Heading | Semantic heading with independent size | Yes | h1–h4 level × display–h4 size | — | Fluid | V1 |
| Text | Body copy | Yes | lg, base, sm, caption | — | Fluid | V1 |
| Prose | Long-form content renderer (allowlisted) | Yes | Docs, article, legal | — | Measure 68ch | V1 |
| Eyebrow/label | Small mono/utility label | Yes | — | — | — | V1 |
| Link | Inline/standalone link | Yes | Inline, standalone, external | Hover, focus, visited | — | V1 |
| Inline code / Kbd | Technical tokens | Yes | — | — | Wrap | V1 |
| Data figure | Version/size/metric with source | Yes | Plain, with source line | Missing-source = not rendered | Stacks | V1 |

### Forms
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Field | Label + control + help + error | Yes | — | Default, error, disabled | Full width | V1 |
| Input / Textarea | Text entry | Yes | Text, email, multiline | Focus, error, disabled | 44 px height touch | V1 |
| Select | Choose one | Yes | Native-first | Focus, error | Native on mobile | V1 |
| Checkbox / Radio group | Choices | Yes | — | Selected, focus, error | Large targets | V1 |
| Intent selector | Choose contact intent | Yes | — | Selected | Stacked rows | V1 |
| Submit button | Submit with pending state | Yes | — | Pending, error | Full width on mobile | V1 |
| Form status | Error summary / success panel | Yes | Summary, success, failure, rate-limited | Focus moves | — | V1 |
| Honeypot field | Spam trap | Yes | — | Hidden from AT | — | V1 |
| Challenge slot | Adaptive challenge | Yes | Empty by default | Shown on risk | Inline | V1 |
| Consent note | Privacy sentence | Yes | With/without checkbox | — | — | V1 |
| Waitlist form | Email capture | Yes | — | Same as form | Inline | V1 conditional |

### Product
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Ecosystem Locator | Show position in stack | Yes | Compact (hero/product), full (hub) | Highlighted node, focus | Vertical on mobile | V1 |
| Ecosystem Map | Full relationships | Yes | — | Focus/hover highlight | Redrawn for mobile | V1 |
| Status chip | Honest status | Yes | Available, Beta, In dev, Coming soon, Withdrawn | — | — | V1 |
| Evidence label | Visual provenance | Yes | Screenshot, Recording, Illustration, Concept | — | — | V1 |
| Product hero | Open a product page | Yes | Stage, conversation, diagram, split | — | Stacks | V1 |
| Interface frame | Framed preview | Yes | Browser, desktop, editor, terminal | — | Full width | V1 |
| Feature row | One capability | Yes | Text, text+media, text+diagram | — | Stacks | V1 |
| Spec table | Requirements/specs | Yes | Table / definition list | — | List on mobile | V1 |
| Environment gallery | Swap screenshots | Yes | — | Selected, focus | Tabs → list | V1 |
| Experience sequence | Ordered real moments | Yes | — | — | Vertical | V1 |
| Voice interaction panel | Transcript visual | Yes | Static / recording | Playing, paused | Full width | V1 |
| Roadmap list | Direction | Yes | — | — | Stacks | V1.1 |
| Related products | Lateral nav | Yes | Ledger | — | Stacks | V1 |

### Services
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Service ledger | List by category | Yes | Compact/expanded | Hover/focus | Stacks | V1 |
| Service hero | Problem-led opener | Yes | With/without sketch | — | Stacks | V1 |
| Deliverable list | What client receives | Yes | — | — | Stacks | V1 |
| Capability list | Technology in context | Yes | With related link | — | Stacks | V1 |
| Process flow | Stages | Yes | Horizontal/vertical | — | Vertical mobile | V1 conditional |
| Service FAQ | Objections | Yes | — | Open/closed | — | V1 |
| Service CTA | Prefilled enquiry entry | Yes | — | — | Full width | V1 |

### Downloads
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Download panel | Current release | Yes | Stable, beta, no-release, withdrawn | All state matrix | Stacks | V1 |
| Artifact row | One artifact | Yes | Primary/secondary | Hover, focus | Card on mobile | V1 |
| Checksum block | Hash + copy | Yes | — | Copied, copy-failed | Wraps | V1 |
| Verify guide | How to check | Yes | Short / full | Open/closed | — | V1 |
| Requirements table | Min/recommended | Yes | — | — | List on mobile | V1 |
| Release list | History | Yes | Table / cards | Empty | Cards on mobile | V1 |
| Release notes view | Notes | Yes | Summary / full | — | — | V1.1 |
| Channel chip | Stable/beta/nightly | Yes | — | — | — | V1 |
| Withdrawn banner | Withdrawn release | Yes | — | — | — | V1 |
| Download recovery | Failure help | Yes | — | — | — | V1 |

### Documentation
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Docs shell | Three-column layout | Yes | — | — | Collapses | V1 |
| Docs sidebar | Tree | Yes | — | Current, expanded | Disclosure | V1 |
| Code block | Highlighted code | Yes | Plain, filename, tabs | Copied | Scroll region | V1 |
| Callout | Note/Tip/Warning/Danger | Yes | 4 types | — | — | V1 |
| Docs tabs | Alternatives | Yes | — | Selected | — | V1 |
| Version applicability | Version line | Yes | — | — | — | V1 |
| Steps | Numbered procedure | Yes | — | — | — | V1 |
| Docs search | Find content | Yes | — | Loading, empty, no results | Dialog | Future |

### Projects
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Project header | Identity | Yes | — | — | Meta rail → stack | V1 conditional |
| Case study section | Narrative blocks | Yes | — | — | Prose | V1 conditional |
| Outcome panel | Outcome | Yes | Measured/qualitative/withheld | Pending = hidden | Stacks | V1 conditional |
| Evidence figure | Image + caption + label | Yes | — | — | Full width | V1 |
| Case study index | List | Yes | — | Empty | Stacks | V1 conditional |

### Content
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| FAQ list | Real questions | Yes | — | Open/closed | — | V1 |
| Article layout | Insights | Yes | — | — | Prose | V1.1 |
| Legal layout | Privacy/Terms | Yes | — | — | Narrow | V1 |
| Timeline | Verified history | Yes | — | — | Vertical | V1 conditional |
| Quote | Permissioned testimonial | Yes | — | — | — | V1 conditional |
| Ledger row | List item | Yes | With action/meta | Hover, focus | Stacks | V1 |

### Marketing
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| CTA block | One focused action | Yes | Primary, quiet | Focus | Stacks | V1 |
| Route strip | Audience-aware routing | Yes | — | Focus | Stacks | V1 |
| Intent router | Closing paths | Yes | — | Focus | Stacks | V1 |
| Proof strip | Dated facts | Yes | — | Omitted if <2 facts | Stacks | V1 |
| Statement block | Large text section | Yes | — | — | Fluid | V1 |
| Stage panel | Dark-scope container | Yes | — | — | Full width | V1 |

### Admin
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Admin shell | Layout | Yes | — | Nav collapsed | Collapsible nav | V1.1 |
| Data table | Lists | Yes | Compact | Loading, empty, error | Scroll region | V1.1 |
| Filter bar | Filters | Yes | — | Applied | Stacks | V1.1 |
| Detail panel | One record | Yes | — | — | Full page on small | V1.1 |
| Confirm / step-up dialog | Critical actions | Yes | — | Pending, error | Full-width on small | V1.1 |
| Release form | Manage releases (if DB) | Yes | — | Draft/published/withdrawn | Single column | V1.1 conditional |

### Feedback / States
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Alert/banner | Page-level messages | Yes | Info, success, warning, danger | Dismissible optional | Full width | V1 |
| Skeleton | Loading shape | Yes | Text, panel, table | — | Matches content | V1 |
| Spinner | Pending | Yes | Inline | — | — | V1 |
| Empty state | Nothing yet | Yes | With action | — | — | V1 |
| Error state | Recoverable error | Yes | Route, component | Retry | — | V1 |
| Not found | 404 | Yes | — | — | — | V1 |
| Toast/live message | Transient confirmation | Yes | Copy, saved | Auto-dismiss ≥ readable time | Bottom/inline | V1 |

### Accessibility
| Component | Purpose | Reuse | Notes | Phase |
|---|---|---|---|---|
| Visually hidden | Screen-reader-only text | Yes | Never used to hide focusable items | V1 |
| Focus ring utility | Consistent focus | Yes | Section 23.2 | V1 |
| Live region | Announce async status | Yes | Polite by default | V1 |
| Landmark wrappers | Correct landmarks | Yes | One `main` | V1 |
| Reduced-motion gate | Motion control | Yes | Token-level | V1 |
| Scroll region | Focusable overflow | Yes | Accessible name | V1 |

### Media
| Component | Purpose | Reuse | Variants | Key states | Responsive | Phase |
|---|---|---|---|---|---|---|
| Image | Optimised, ratio-reserved image | Yes | Priority, lazy | Placeholder | Size hints | V1 |
| Video facade | Poster + play | Yes | Hosted / embed | Loading, playing, error | Full width | V1.1 |
| Diagram wrapper | SVG + text alternative | Yes | Responsive redraws | — | Mobile variant | V1 |
| Icon | Themed SVG icon | Yes | 16/20/24 | — | — | V1 |
| Avatar | Person image | Yes | — | — | Fixed square | V1.1 |

---

## 38. Testing and quality checklist

### Visual
- [ ] Spacing uses only scale tokens; no arbitrary pixel values
- [ ] Type uses role tokens; no text below 12 px; measure ≤ ~72ch for prose
- [ ] Colours come only from semantic tokens; both themes reviewed side by side
- [ ] Alignment to grid; consistent gutters; sections follow rhythm tokens
- [ ] Greyscale check: hierarchy still reads correctly without colour
- [ ] Radii, shadows and borders follow the token sets; no decorative glow/blur
- [ ] Icons consistent in style, size and stroke
- [ ] Status chips, Evidence Labels and locator render identically everywhere
- [ ] Every product visual carries an Evidence Label

### Responsive
- [ ] **Very small (320 px):** no horizontal scroll; text legible; targets ≥ 44 px; forms usable
- [ ] **Mobile (360–639):** nav sheet works; hero order correct; checksums wrap; tables convert
- [ ] **Tablet (768–1023):** layouts are intentional (not stretched mobile or squeezed desktop); orientation change preserved
- [ ] **Laptop/desktop (1024–1535):** full compositions; side rails and mega panels behave
- [ ] **Large/ultra (≥1536 and ≥1920):** content contained; backgrounds scale; no emptiness
- [ ] 200% text zoom and 400% page zoom reflow without loss
- [ ] Download page and enquiry forms explicitly tested on real mobile devices
- [ ] No information present on desktop is missing on mobile

### Accessibility
- [ ] Full keyboard pass on every template (including nav panels, sheet, tabs, copy buttons, forms)
- [ ] Focus visible everywhere; never hidden under the sticky header
- [ ] Screen-reader pass on critical journeys (home → product → download; home → services → enquiry; docs)
- [ ] Contrast automated and manual for all tokens/states in both themes
- [ ] Reduced motion honoured (OS setting toggled in testing)
- [ ] Forms: labels, descriptions, error summary, focus management, success announcement
- [ ] Honeypot unreachable by keyboard and assistive tech
- [ ] Heading order, landmarks, one `main`, link text meaningful
- [ ] Images: meaningful alt or empty alt; diagrams have text alternatives
- [ ] Looping motion ≤ 5 seconds or pausable; video captions and transcripts present
- [ ] Touch target sizes verified

### Interaction
- [ ] Loading, success, error, disabled and empty states exist and are exercised for every interactive component and data region
- [ ] Failed form submission preserves input; rate-limited and server-error states tested
- [ ] Download states tested: available, beta, no release, withdrawn, data unavailable, host unreachable
- [ ] Copy buttons announce success and handle failure
- [ ] Theme: system, light, dark; persists; no flash on reload; works with scripts blocked (OS preference)
- [ ] Navigation: Escape, focus return, active states, no hover-only access

### Performance
- [ ] LCP element identified per template; only one priority media element above the fold
- [ ] No layout shift from images, fonts, banners or panels (CLS)
- [ ] INP checked on nav, forms, copy, gallery
- [ ] Client JavaScript per route reviewed against the (to-be-established) budget; no animation library
- [ ] Fonts: self-hosted, weights limited, mono only where used
- [ ] Images: formats, sizes and lazy loading verified; no oversized assets
- [ ] No unexpected third-party requests (verify network panel)
- [ ] Field Core Web Vitals monitored after launch; mid-range mobile baseline recorded

### Browser
- [ ] Chrome, Firefox, Safari (desktop and iOS), Edge — latest versions; support matrix `[REQUIRES CONFIRMATION]`
- [ ] Android browser spot-check
- [ ] Features with fallbacks (scroll-driven animation, view transitions, native dialog/popover) verified in browsers lacking them
- [ ] Print styles for documentation and legal pages sanity-checked

### Security-adjacent (UI)
- [ ] CSP Report-Only run with the real pages: theme initialiser, fonts, media, embeds all allowed or hashed
- [ ] No inline event handlers or inline scripts beyond the allowlisted initialiser
- [ ] MDX renders only allowlisted components; raw HTML disabled
- [ ] Admin: no third-party scripts; enquiry content shown as escaped plain text

---

## 39. Design implementation priority

### V1 — Required for a strong production launch

| Area | Includes |
|---|---|
| Foundations | Tokens (both themes), type system, spacing/radius/elevation/motion tokens, focus system, theme control with no flash, self-hosted fonts |
| Primitives | Button, Link, Input, Textarea, Select, Checkbox/Radio, Badge/Status chip, Disclosure (native), Tabs, Dialog (for mobile nav), Tooltip (if needed), Heading, Text, Container, Icon, Visually hidden |
| Patterns | Field, Form status, CTA block, Feature row, Ledger row, Callout, Evidence label, Copy button, Figure |
| Layout | Header (inline + sheet), Footer, Section, Container, Product sub-nav, Breadcrumbs |
| Sections | Hero (with Locator and route strip), Ecosystem, OS stage, Proof strip, Technology, Services band, Intent router, Work (conditional) |
| Product | Product template, Ecosystem Map, Status chip, Interface frame, Spec table, Environment gallery (if multiple real images), Experience sequence (if real) |
| Services | Services hub (ledger), Service template, Process flow (if real process confirmed), FAQ |
| Downloads | Download panel with all states, Artifact row, Checksum block, Verify guide, Requirements, History, Recovery, Waitlist form |
| Docs | Docs shell, sidebar, TOC, code block, callout, tabs, version applicability, previous/next |
| Contact | Intent selector, General, Project, Partnership forms, technical-support guidance panel, honeypot and time token, empty challenge slot |
| Content pages | About, FAQ, Privacy, Terms, Not found, Error |
| Quality | Automated accessibility and contrast checks, token-contrast CI check, responsive QA, performance baseline |

### V1.1 — Important enhancements

- Additional product and service pages as content is confirmed
- Insights/Blog layout and index (with a publishing owner)
- Release details pages and expanded release history
- Security / responsible-disclosure page (V1 if OS is publicly distributed)
- Video facade and captioned demonstrations
- Roadmap component
- Admin: Enquiries module, and Releases module only if releases move to the database
- Dedicated support form
- Basic, privacy-preserving download measurement UI hooks (no UI change expected)
- Documentation expansion; docs code-wrap toggle
- Team/About photography (if provided)

### Future

- Documentation search; versioned documentation; dedicated documentation platform
- Interactive HENU OS preview (lazy, purposeful 3D or video-driven) with animation library only if justified
- Product configurator; personalised dashboards; AI website assistant (only if it adds genuine value)
- Client/community/developer-API portals; RBAC management UI; broader admin modules
- Multilingual layout, locale switcher, RTL support `[REQUIRES CONFIRMATION]`
- Fact sheet / media kit
- Expanded accent set as new products appear

Rule (Inherited 01 §26.2): a Future idea does not enter V1 because it is attractive; V1 must ship without any Future item.

---

## 40. Final design principle

HENU should look like **HENU**, not like "a standard technology website with a HENU logo". The identity comes from the combination of: the ecosystem made visible (locator and map), evidence made visible (labels, status, dated facts), strong typography with a single honest type voice, a rationed warm colour on cool ink neutrals, square-leaning geometry, restrained motion, and a performance-first, accessibility-first build. The result is visually ambitious but technically responsible, distinctive without gimmicks, and credible because nothing is shown that does not exist.

---

## 41. Register of items requiring confirmation

| # | Item | Affects | Owner (proposed) |
|---|------|---------|------------------|
| 1 | Logo files, colours, clear-space/minimum-size rules, any mascot | Palette harmony check (3.4, 5.8), wordmark use | HENU brand owner |
| 2 | Approval of this document's recommended palette, typeface and visual devices as HENU brand direction | Everything | HENU brand owner |
| 3 | Final brand architecture (HENU vs HENU OS) | Header, sub-nav, naming (3.3) | HENU leadership |
| 4 | Product list, statuses and launch-readiness | Product pages, locator, ecosystem map, hero CTA | Product owner |
| 5 | Actual integration/dependency relationships between OS, PA, AI, IDE | Locator edges, ecosystem map | Product/engineering |
| 6 | Real screenshots, recordings and demo assets; light/dark variants | Stage, galleries, evidence | Product owner |
| 7 | Whether a public release exists at launch; release channels, architectures, signing | Download panel states, signature row | Release/engineering owner |
| 8 | System requirements and versioning scheme | Spec tables, release lists | Engineering |
| 9 | Services to list publicly (esp. Legal Service, Funding Solution, Graphic Design, Digital Marketing & Ads) | Services hub categories | Business owner |
| 10 | HENU's real delivery process | Process flow | Delivery lead |
| 11 | Case studies, client permissions, NDAs | Work area, outcome panel | Business owner |
| 12 | Metrics: sources, owners, review dates | Proof strip, outcome panel | Content owner |
| 13 | Legal entity name, address, copyright line, social/community links | Footer, About, legal pages | HENU leadership |
| 14 | Legal review of Privacy, Terms, consent approach, and disclosure of theme-preference storage | Forms, footer, legal | Legal advisor |
| 15 | Support model and response-time commitments | Contact page, success states | Operations owner |
| 16 | Open-source status and public repositories | Technology, docs, GitHub CTAs | Engineering |
| 17 | Multilingual requirement (affects font subset and layout) | Typography, content model | Product owner |
| 18 | Tagline roles (01 Open Decision #17) | Footer, About, CTAs | Brand owner |
| 19 | Anti-bot provider and its accessibility alternative | Form challenge slot | Engineering |
| 20 | Icon library and headless primitive library choices | Dependency policy (02 §27) | Engineering |
| 21 | Font files: confirm variable availability and licence files for the chosen family | Typography loading | Engineering |
| 22 | Performance budgets (JS per route, image weight, font weight) and browser support matrix | Section 28, section 38 | Engineering |
| 23 | Whether a dedicated admin UI is needed at launch (01 Open Decision #11) | Section 21 | Product/engineering |
| 24 | Documentation hosting decision (route vs separate app) | Docs shell, URLs | Engineering |
| 25 | Current Next.js / Tailwind / CSP guidance for the exact versions adopted | Sections 6, 29, 32 | Engineering |

---

*End of document. All items marked `[REQUIRES CONFIRMATION]` or `[VERIFY]` must be resolved by an accountable owner before the dependent design is locked or the dependent feature is built.*

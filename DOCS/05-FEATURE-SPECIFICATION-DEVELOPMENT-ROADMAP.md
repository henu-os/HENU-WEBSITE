# HENU Website — Feature Specification, Development Roadmap & Acceptance Criteria

| | |
|---|---|
| **Document** | `05-FEATURE-SPECIFICATION-DEVELOPMENT-ROADMAP.md` |
| **Status** | Draft v1 for engineering and product review |
| **Sources** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md` (PRD), `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md` (TA), `03-SECURITY-ARCHITECTURE.md` (SEC), `04-FRONTEND-UI-UX-DESIGN-SYSTEM.md` (DS) |
| **Purpose** | Convert decisions in 01–04 into buildable, trackable, testable work |

**Conventions**

- `[REQUIRES CONFIRMATION]` marks a decision or fact that must be confirmed by an accountable HENU owner before dependent work is finalised. Nothing marked so has been silently decided here.
- References such as "TA §9" mean section 9 of document 02; "SEC §21" means section 21 of document 03; "DS §18" means section 18 of document 04; "PRD §17" means section 17 of document 01.
- Versions: **V1** (launch critical), **V1.1** (important enhancement, does not block launch), **Future** (designed for, not built). Priorities: **P0** critical, **P1** high, **P2** medium, **P3** low.
- A ticket marked "V1 (conditional)" ships in V1 only if its stated condition is confirmed; otherwise it moves to V1.1.
- This document contains no implementation code, SQL, CSS or marketing copy. It never invents product facts, metrics, clients or capabilities; where content is missing it is listed in Section 26 as a HENU deliverable.

---

## 1. Source Reconciliation

### 1.1 How the four documents depend on each other

```text
PRD (what / who / why / what not)
  ├─► TA   (how it is built: Next.js, static-first content, Supabase for enquiries, release data as single source of truth)
  ├─► SEC  (how it is protected: depends on TA's trust boundaries, data classes, release/download model)
  └─► DS   (how it looks and behaves: depends on PRD page definitions, TA rendering model, SEC CSP/content rules)

This document (05) sits on top of all four and decides sequence, scope and acceptance.
```

Key dependency chains that shape the roadmap:

| Chain | Why it matters |
|---|---|
| PRD "release data is the single source of truth" → TA release repository interface → DS data-driven download UI → SEC checksum/immutability controls | The release model must exist before any surface that shows a version, size, checksum or download link (Home, HENU OS, Downloads, Docs). |
| PRD "honest status labels" → TA status labels are data → DS mandatory status chip | A status model is a foundation task, not a per-page task. |
| TA static-first + DS theme with no flash → SEC hash/nonce CSP | The theme-initialisation script and the CSP policy must be designed together. |
| PRD intent-based contact → TA enquiries table → SEC rate limiting/spam/RLS → DS form components | Enquiry capture touches all four documents and has the longest vendor lead time (email domain, rate-limit store, bot challenge). It starts early and in parallel. |
| PRD content gates (`[REQUIRES CONFIRMATION]`) → every content-bearing page | Content, not code, is the most likely launch blocker. |

### 1.2 Contradictions and gaps found, and how this document resolves them

| ID | Finding | Documents | Resolution adopted here | Still needs confirmation? |
|---|---|---|---|---|
| R-01 | Naming: PRD calls the area "Work / Case studies"; TA routes it `/projects`; the planning brief calls it "Projects". | PRD §9/14, TA §11, DS §36 | Route stays `/projects` (TA). Navigation label is "Work" until brand owner decides. Routes never change when the label changes. | Label only (OQ-12) |
| R-02 | The no-release state needs a waitlist form (DS §18.5, §36 "Waitlist" page), but TA's `enquiries.type` enum has no waitlist type and TA lists no waitlist store. | DS vs TA | Waitlist is **not** a separate route. It is a state of `/downloads/henu-os` and the HENU OS page. It reuses the `enquiries` table with `type = waitlist`, email-only, message not required for that type. Requires a TA schema amendment (ADR). | Whether HENU wants a waitlist at all (OQ-02) |
| R-03 | Enquiry types: TA enum includes `technical` and `support`; PRD defers a dedicated support form to V1.1; DS V1 ships General, Project and Partnership forms plus a technical-support guidance panel. | PRD §18, TA §7.3, DS §39 | V1 forms: **general, project (also used for service enquiries), partnership**, plus waitlist when applicable. `technical` and `support` remain in the enum but have no V1 form; technical questions are routed to docs/community/email by a guidance panel. | Support model (OQ-11) |
| R-04 | TA §33.1 says V1 has a "revalidation mechanism for data-driven pages", but V1 release data is Git-tracked files, so publishing a release in V1 requires a merge and deploy, not revalidation. | TA §9.3 vs §33.1 | In V1, **publishing a release = merging a reviewed pull request and deploying**. On-demand revalidation is built when releases move to the database (V1.1). V1 only needs a cached/static page that is rebuilt on deploy. | No |
| R-05 | PRD scope matrix shows download analytics as "✔ / ✔" in V1.1 and Future columns; PRD success metrics (§27) require analytics from launch; TA/SEC forbid a custom telemetry platform and keep the provider undecided. | PRD §26–27, TA §34, SEC §31 | V1: privacy-preserving, off-the-shelf, cookieless measurement **if** a provider is chosen before staging (OPS-008); events limited to page views, form outcomes and outbound doc/download clicks only if privacy review allows. Download measurement via CDN/storage logs is V1.1. | Provider (OQ-09) |
| R-06 | SEC §18 says serverless rate limiting needs a **shared store**; TA's stack lists none. | SEC vs TA | Adds a required infrastructure decision: platform rate-limit feature or a managed key-value store. Without it, enquiry rate limiting and admin sign-in limiting are not real controls. Treated as a V1 blocker for FORM-004 (OQ-07). | Yes |
| R-07 | Planning brief lists admin modules (products, services, media, documentation, etc.); TA/DS/SEC say V1 has **no** custom admin and V1.1 has only an Enquiries module (plus Releases only if releases move to the database). | Brief vs TA §12, DS §21 | Follow TA/DS/SEC. Only Enquiries, Audit log and (conditional) Releases are specified. All other modules are explicitly excluded (Section 12). | Whether admin is mandatory at launch (OQ-04) |
| R-08 | TA proposes Supabase Storage for admin-uploaded assets (V1.1) while SEC §44.1 mandates **no file uploads** in V1 and DS defines no media admin. | TA §8 vs SEC §20, DS §21 | No upload feature in V1 or V1.1 unless a concrete need appears. Supabase Storage is not provisioned for uploads. Images and media are source-controlled or served from the artifact/media origin. | No |
| R-09 | DS §2 proposes extra component tiers (`patterns`, `sections`) and a `styles` directory beyond TA §10 layout. | TA §10 vs DS D1/D2 | Adopt DS structure; record an ADR amending TA §10. | No |
| R-10 | DS D3 rejects cookie-based theme detection (would force dynamic rendering); SEC §16 uses hash-based CSP for public static pages. | DS vs TA/SEC | Consistent when combined: theme initialisation is a single small inline script allowed by CSP hash; theme stored client-side. Ticket dependency CORE-001 ↔ SEC-002. Legal view on disclosing theme preference storage is open. | Legal view (OQ-10) |
| R-11 | DS §7 selects a font with a Devanagari companion "for text expansion and other scripts", but TA §21 and PRD §26 keep V1 single-locale and multilingual is unconfirmed. | DS vs PRD/TA | Do not load any additional script subset in V1. Layouts remain logical-property based. The companion font is added only if multilingual or such content is confirmed. | Yes (OQ-13) |
| R-12 | Security/disclosure page is V1.1 in PRD/TA/DS but V1 "if HENU OS is publicly distributed"; SEC makes download-integrity controls V1-mandatory when a release is public. | PRD, TA, DS, SEC | Treat as one switch: **public HENU OS release at launch ⇒ SEC-010 (disclosure page and `security.txt`), DOWN-005, OPS-006 and REL-002 move into V1.** | Release readiness (OQ-01) |
| R-13 | "Documentation" is named `/documentation` (TA) but is described as "dedicated route" or "separate application" in PRD options. | PRD §16 vs TA §11 | `/documentation` on the main site in V1, URL tree mirrors content tree, redirects preserved if later extracted. | Yes (OQ-08) |
| R-14 | Planning brief lists "Software Solutions / Portfolio" items; PRD identifies only HENU OS, PA, AI, IDE and "other HENU software" without naming them. | Brief vs PRD §12 | No pages are planned for unnamed software. The product content model accepts additional products by adding a content file once HENU supplies verified details. | Product list (OQ-03) |

### 1.3 Duplicated requirements consolidated

Several rules appear in all four documents. To avoid four inconsistent implementations, each rule has **one owning ticket**; other tickets reference it.

| Rule | Owning ticket |
|---|---|
| Honest status labels (Available / Beta / In development / Coming soon), shape + text, never colour alone | CORE-005 |
| Evidence labels and "no metric without source and owner" | CORE-003 (component) + CORE-004 (schema) |
| Checksum wording: "SHA-256 checksum for integrity verification"; never "verified/authentic/signed" without signing | DOWN-003 |
| No literal version/URL/size/checksum in any component | DOWN-001 |
| Raw HTML disabled; MDX component allowlist | DOC-001 |
| Honeypot hidden accessibly; time token; challenge only on risk | FORM-004 |
| Theme with no flash | CORE-001 |
| One primary CTA per page; CTA copy has a specific intent | CORE-003 (CTA block) and each page ticket |

### 1.4 Missing implementation requirements identified (not stated in 01–04)

| Gap | Handled by |
|---|---|
| Waitlist storage (R-02) | FORM-007 |
| Rate-limit store (R-06) | SEC-004 |
| Enquiry inbox owner, response process and spam purge schedule | FORM-008 |
| Operator access to the Supabase dashboard as the V1 "admin" (who, MFA, least privilege) | SEC-001, FORM-008 |
| Health-check endpoint is listed (TA §29) but no uptime/alert owner is defined | OPS-005 |
| Content-claim review gate before merge (PRD §19, §8) | OPS-003 (PR template and CODEOWNERS), Section 14 |
| Production-like seed/fixture content so templates can be built before real HENU content arrives | CORE-004 (clearly labelled fixtures never deployed to production) |
| Release-artifact failure handling (broken link, mismatched checksum) | DOWN-002, REL-002, Section 13 |

---

## 2. Primary Objective Restated

> **What exactly needs to be built, in what order, with what dependencies, and how do we know it is complete?**

The answer in one paragraph: a single Next.js application with a validated, source-controlled content layer; a release/download system driven by one data model; intent-based enquiry capture persisted in PostgreSQL with a hardened intake path; documentation essentials under `/documentation`; and a foundation of accessibility, security, performance and SEO built in from the start. There is no custom CMS, no V1 admin UI, and no standalone API. Anything that depends on unconfirmed HENU facts is gated and has an honest fallback state.

---

## 3. Product Scope (as confirmed by the source documents)

### Products

| Product | Confirmed in PRD? | Page in V1? |
|---|---|---|
| HENU OS | Yes (flagship) | **Yes** — `/products/henu-os` |
| HENU PA | Yes | V1 (conditional) — only if owner confirms description and status |
| HENU AI | Yes | V1 (conditional) — same condition |
| HENU IDE | Yes | V1 (conditional) — same condition |
| Other / future HENU products | "Where appropriate" only | **No** — content model accepts them; no pages until verified details exist |

### Services

| Service | PRD category | Fit | V1 stance |
|---|---|---|---|
| Website Development | Software & Product Engineering | Strong | V1 (conditional on validation) |
| Backend Development | Software & Product Engineering | Strong | V1 (conditional on validation) |
| Mobile App Development | Software & Product Engineering | Strong | V1 (conditional on validation) |
| AI Automation | AI & Automation | Strong | V1 (conditional on validation) |
| Graphic Design | Brand & Growth | Moderate | V1.1 (supporting; low prominence) |
| Digital Marketing & Ads | Brand & Growth | Moderate | V1.1 (supporting; low prominence) |
| Legal Service | Business Solutions | Weak | **Not built** until a deliberate decision (who delivers, regulation, whether listed) |
| Funding Solution | Business Solutions | Weak | **Not built** until a deliberate decision |

All service listings are `[REQUIRES CONFIRMATION]` per PRD §13.2. The service content model supports categories as data, so the decision changes content, not code.

### Software solutions / portfolio

PRD §12 does not name specific software beyond the four products. No individual software pages are planned. Case studies (PRD §14) cover evidence of delivered work and are conditional on real, permitted work.

---

## 4. Scope Classification Summary

| Class | What it contains |
|---|---|
| **V1 — Launch critical** | Foundation, shell, Home, Products hub, HENU OS, Downloads (or honest status state), Services hub + validated service pages, Technology, About, Documentation entry + essentials, Contact with general/project/partnership forms, FAQ, Privacy, Terms, SEO/A11Y/PERF/SEC baselines, CI/CD, monitoring |
| **V1 (conditional)** | PA/AI/IDE pages, case studies, waitlist, artifact pipeline and download origin, security disclosure page |
| **V1.1** | Admin (enquiries, audit log, releases if DB), release history pages, blog/insights, expanded docs, additional product/service pages, support intake, download measurement, integrity monitoring |
| **Future** | Docs search/versioning, signing (V1.1 if feasible), public releases API, CMS, RBAC, portals, telemetry, i18n, interactive previews, AI assistant, configurator, personalisation |

---

## 5. Sitemap Implementation Matrix

| Route / Page | Purpose | Audience | Version | Priority | Main Components | Data Source | Dependencies |
|---|---|---|---|---|---|---|---|
| `/` Home | Establish identity; route to journeys | All (product/technical first, then clients) | V1 | P0 | Hero, Ecosystem Locator, route strip, Ecosystem, OS stage, proof strip, Technology, Services band, intent router | Static content + release data (current version) + status data | CORE-001..005, PROD-001, DOWN-001 |
| `/products` | Ecosystem hub, relationships | Product users, partners | V1 | P0 | Ecosystem Map, product ledger, status chips | Static product content | PROD-001, CORE-005 |
| `/products/henu-os` | Flagship page | Product users, developers | V1 | P0 | Product sub-nav, OS stage, requirements table, download panel/status panel, docs links | Static product content + release data | OS-001, DOWN-001 |
| `/products/[slug]` — HENU PA, HENU AI, HENU IDE | Explain one product | Product users, developers | V1 (conditional) | P1 | Product template, Locator, spec table | Static product content | PROD-002, PROD-003 |
| `/products/[slug]` — other future products | Add product without redesign | Product users | Future | P3 | Same template | Static content | PROD-002 |
| `/services` | Present applied engineering by customer problem | Business clients | V1 | P0 | Services ledger by category, process signal, project CTA | Static service content | SERV-001 |
| `/services/[service]` — Website, Backend, Mobile, AI Automation | One validated service | Business clients | V1 (conditional on validation) | P1 | Service template, deliverables, process flow (if real), FAQ, enquiry CTA | Static service content | SERV-002, FORM-006 |
| `/services/[service]` — Graphic Design, Digital Marketing & Ads | Supporting capability | Business clients | V1.1 | P2 | Same template | Static content | SERV-002 |
| `/services/[service]` — Legal, Funding | Business solutions | Business clients | Not scheduled | — | — | — | OQ-05 |
| `/technology` | Engineering credibility | Developers, partners | V1 | P1 | Two-register sections, architecture diagram, docs/repo links | Static content | PAGE-001 |
| `/projects` | Case-study index | Business clients, partners | V1 (conditional) / V1.1 | P2 | Case-study ledger, empty state | MDX | PROJ-001 |
| `/projects/[project]` | One case study with evidence | Business clients | V1 (conditional) / V1.1 | P2 | Header, sections, outcome panel, evidence figures | MDX + frontmatter | PROJ-001 |
| `/downloads` | Downloads hub | Product users, developers | V1 | P0 | Product list with state, links | Release data | DOWN-002 |
| `/downloads/henu-os` | Get and verify HENU OS (or honest status) | Product users, developers, existing users | V1 | P0 | Download panel, artifact rows, checksum block, verify guide, requirements, history, recovery, waitlist/status panel | Release data | DOWN-001..005 |
| `/releases` | Release history | Developers, existing users | V1.1 (V1 if history exists) | P2 | Release ledger | Release data | REL-001 |
| `/releases/[version]` | One release's notes | Developers | V1.1 (V1 if history exists) | P2 | Release header, categorised notes, artifacts, prev/next | Release data | REL-001 |
| `/documentation` | Docs entry and category map | Developers, users, students | V1 | P0 | Docs shell, category map, Getting Started CTA | MDX tree | DOC-001, DOC-002 |
| `/documentation/[...slug]` | Article rendering | Developers, users | V1 (essentials) / V1.1 (expansion) | P0 / P2 | Sidebar, TOC, breadcrumbs, code blocks, callouts, version applicability, prev/next | MDX | DOC-001..005 |
| `/blog`, `/blog/[slug]` | Publish useful content | Developers, clients, media | V1.1 | P2 | Article layout, ledger index | MDX | BLOG-001 |
| `/about` | Company credibility | Clients, partners, investors, media | V1 | P1 | Statement, verified timeline (if any), contact CTA | Static content | PAGE-002 |
| `/contact` | Intent-based routing | All | V1 | P0 | Intent selector, General/Project/Partnership forms, technical-support guidance panel, alternative channels | Static shell + Server Action → PostgreSQL | FORM-001..005 |
| `/faq` | Remove genuine objections | All | V1 (may be embedded) | P2 | Native disclosure list | Static content | PAGE-003 |
| `/privacy`, `/terms` | Legal clarity | All | V1 | P0 | Legal document layout | Static content (legally reviewed) | PAGE-004 |
| `/security` | Responsible disclosure | Developers, researchers | V1.1 (V1 if public OS release) | P1 / P2 | Prose, report contact, supported versions | Static content | SEC-010 |
| `/.well-known/security.txt` | Machine-readable disclosure contact | Researchers | With `/security` | P2 | — | Static | SEC-010 |
| `/admin` sign-in and guard | Operator access | HENU operators | V1.1 (V1 only if required) | P1 | Admin shell, sign-in | Supabase Auth | ADMIN-001 |
| `/admin/enquiries` | Review and update enquiries | HENU operators | V1.1 | P1 | Data table, filters, status select, detail panel | PostgreSQL | ADMIN-002 |
| `/admin/releases` | Manage releases in database | HENU operators | V1.1 (conditional) | P2 | Release form, publish/withdraw, step-up dialog | PostgreSQL | ADMIN-004 |
| Public authentication pages (sign-up, account) | — | — | **Not planned** | — | — | — | No public accounts exist in any source document |
| Not found / error | Recover | All | V1 | P0 | Error and empty states | Framework conventions | CORE-006 |
| `/sitemap.xml`, `/robots.txt` | Search hygiene | Crawlers | V1 | P0 | — | Generated from content | SEO-002 |
| `/api/health` | Uptime monitoring | Monitoring | V1 | P1 | — | — | OPS-005 |

**Recommended smallest credible launch scope** (everything else waits): Home, Products hub, HENU OS, Downloads (real or honest status), Services hub + validated service pages, Technology, About, Documentation entry + essentials (Getting Started, Installation, Verify download, Troubleshooting), Contact (3 forms), FAQ, Privacy, Terms, error pages, sitemap/robots. Add PA/AI/IDE pages and case studies **only** if their content gates are cleared. This is enough to read as a complete, serious technology ecosystem without padding.

---

## 6. Feature Breakdown

Each functional group lists what is built in V1, what is deferred, and which tickets deliver it. Groups that the source documents do not justify are marked as such.

| Group | V1 includes | V1.1 / Future | Tickets |
|---|---|---|---|
| **Core website** | Global layout, header (inline + mobile sheet), footer, responsive behaviour, light/dark theme with no flash, metadata framework, sitemap, robots, 404/error pages, route-level loading states | Visual regression tests (Future) | CORE-001..007, NAV-001..003, SEO-001..002, A11Y-001 |
| **Products** | Product content model, hub with Ecosystem Map, product template, status chips, state-aware CTAs, "ecosystem relationship" element, lateral links between products | Pages for remaining products (V1.1) | CORE-005, PROD-001..003 |
| **HENU OS** | Flagship page, capabilities and voice/ecosystem modules (only with real evidence), system requirements, download or status panel, docs and release links, evidence labels | Interactive preview (Future) | OS-001, OS-002, DOWN-002 |
| **Services** | Hub by category, service template (problem → approach → solution → technology → deliverables → process → evidence → CTA), enquiry entry with prefill, FAQs per service | Supporting services (V1.1); process component only when HENU's real process is confirmed | SERV-001..003, FORM-006 |
| **Projects / case studies** | Index with empty state, case-study template with evidence and permission gate | Product stories (V1.1) | PROJ-001 |
| **Downloads / releases** | Release data model and validation, derived "latest", current stable panel, artifacts with architecture/size/checksum, verify guide, recovery guidance, previous-releases ledger, no-release status, withdrawal handling, separate download origin | Release detail pages (V1.1 unless history exists), integrity monitoring, DB-managed releases, signing, public releases endpoint | DOWN-001..005, REL-001..003, OPS-006 |
| **Documentation** | MDX pipeline, allowlisted components, sidebar, on-this-page, breadcrumbs, code blocks, callouts, tabs, prev/next, version applicability, mobile navigation, essential articles | Search, versioning, dedicated platform (Future) | DOC-001..005 |
| **Content** | FAQ, About, Technology, legal pages | Blog/insights (V1.1; only with an owner and real content); categories/tags and author pages only if blog volume justifies them (Future) | PAGE-001..004, BLOG-001 |
| **Contact / enquiries** | General, project, partnership, waitlist (conditional); validation; spam protection; rate limits; persistence; notification; accessible success/error states | Support intake (V1.1) | FORM-001..009 |
| **Admin** | None (operators use the managed database dashboard under MFA; email notifications) | Enquiries module, audit log, releases module (conditional) in V1.1 | ADMIN-001..004, SEC-001 |
| **Cross-cutting** | SEO, accessibility, performance, security, observability, testing, CI/CD, backups | Pen-test, SBOM, WAF tuning (V1.1) | SEO-, A11Y-, PERF-, SEC-, TEST-, OPS- |

---

## 7. Feature Tickets

Each ticket uses one format. IDs are unique and stable. "Dependencies" lists tickets that must be complete (or sufficiently stubbed) first. Every acceptance criterion is observable and testable. Where a criterion depends on unconfirmed facts it says so.

**Cross-cutting acceptance criteria applying to every UI ticket** (not repeated in each ticket): works at 320 px width without horizontal scrolling; operable by keyboard with visible focus; passes the automated accessibility check in CI; renders correctly in light and dark themes; no layout shift when content loads; no console errors.

---

### 7.1 OPS — Foundation and operations

### OPS-001 — Repository, tooling and engineering documentation

Priority: P0
Phase: V1
Area: Platform
Dependencies: None

Objective:
Create the single Next.js application repository with enforced architecture rules and a short engineering handbook.

Requirements:
- single application with the `src/` layout from TA §10 as amended by DS (patterns, sections, styles)
- strict TypeScript, linting, formatting, import-boundary rules (components never import server code; public code never imports admin)
- package manager and Git host chosen `[REQUIRES CONFIRMATION: OQ-14]`
- protected main branch, required reviews, CODEOWNERS covering `content/` and release data
- README (setup, scripts, environment, release publishing procedure) and ADR folder with ADRs for TA decisions plus the amendments in Section 1.2

Acceptance Criteria:
- a new developer can run the site locally from the README alone in one session
- a violating import (component → server code) fails lint in CI
- direct pushes to main are rejected
- release data and legal content changes require a CODEOWNERS reviewer

Testing:
- lint rule tests for boundaries; manual README walkthrough by someone who did not write it.

### OPS-002 — Environments and configuration validation

Priority: P0
Phase: V1
Area: Platform
Dependencies: OPS-001

Objective:
Isolated development, staging and production with validated configuration.

Requirements:
- separate Supabase project and secrets per environment; no production data elsewhere
- environment variables validated at build/start; public vs server-only separation
- staging is non-indexable and access-restricted

Acceptance Criteria:
- the build fails with a clear message if a required variable is missing or malformed
- no server-only variable appears in the client bundle (verified by bundle inspection)
- staging responses carry a noindex directive and robots disallow
- production credentials do not exist in staging or development

Testing:
- unit tests for the env schema; CI bundle scan; staging robots/header check.

### OPS-003 — CI pipeline and pull-request checks

Priority: P0
Phase: V1
Area: Platform
Dependencies: OPS-001

Objective:
Automated quality gate on every pull request.

Requirements:
- type check, lint, unit tests, content/schema validation, build, automated accessibility checks on key templates, dependency and secret scanning
- preview deployment per pull request; E2E against the preview
- pull-request template with a "claims and evidence" checklist (no unsupported superlatives; metrics have source and owner)

Acceptance Criteria:
- a pull request cannot merge unless all required checks pass
- invalid content (missing checksum, malformed version, missing SEO field, metric without source/owner) fails the build
- each pull request produces a preview URL
- secrets committed to a branch are detected and block merge

Testing:
- deliberately broken fixtures for each failure class are run in CI once.

### OPS-004 — Hosting, deployment and rollback

Priority: P0
Phase: V1
Area: Platform
Dependencies: OPS-002, OPS-003

Objective:
Repeatable deployment to staging and production with a rehearsed rollback.

Requirements:
- managed Next.js-compatible host `[REQUIRES CONFIRMATION: OQ-14, TA recommends Vercel]`
- automatic staging deployment from main; manual, protected production promotion
- domain, HTTPS, redirects (HTTP→HTTPS, canonical host) configured
- rollback procedure documented and rehearsed once before launch

Acceptance Criteria:
- production promotion requires an authorised approver
- rolling back to the previous deployment is completed in a rehearsal using only the documented steps
- HTTP requests redirect to HTTPS; the non-canonical host redirects to the canonical host

Testing:
- rehearsal log attached to the launch checklist; redirect checks in E2E.

### OPS-005 — Monitoring, error tracking and health check

Priority: P1
Phase: V1
Area: Platform
Dependencies: OPS-004

Objective:
Know when the site is down or broken, and who is responsible.

Requirements:
- hosted error tracking with PII scrubbing `[REQUIRES CONFIRMATION: OQ-14 provider]`
- uptime monitor on the home page, `/api/health` and the download origin
- field Core Web Vitals reporting for Home, HENU OS and Downloads
- named alert owner and escalation contact (SEC §28)

Acceptance Criteria:
- a forced server error appears in error tracking within minutes, with no email address or message body from any form
- taking the health endpoint down triggers an alert to the named owner in a staging drill
- field data is viewable per template

Testing:
- staging drill for error and uptime alerts.

### OPS-006 — Release artifact pipeline

Priority: P0
Phase: V1 (conditional on public HENU OS release)
Area: Platform / Release
Dependencies: OQ-01, OQ-06, DOWN-001

Objective:
A controlled path from built artifact to published, verifiable download.

Requirements:
- artifact origin: object storage + CDN on a separate hostname `[REQUIRES CONFIRMATION: OQ-06]`
- release workflow: build → compute SHA-256 → upload to immutable path → download-and-compare verification → create draft metadata → review → publish (TA §9.4)
- release credential is scoped to the release prefix, short-lived where possible, and **not** available to the website runtime
- draft artifacts stored in a non-public location

Acceptance Criteria:
- a published artifact path is never overwritten; attempting to overwrite fails
- the website runtime cannot write to artifact storage (verified by attempting with runtime credentials)
- the workflow aborts and publishes nothing if the post-upload checksum does not match
- the metadata checksum equals the independently recomputed checksum of the file served from the CDN

Testing:
- dry-run release with a dummy file in staging; negative test with a corrupted upload.

### OPS-007 — Backups and restore test

Priority: P1
Phase: V1
Area: Platform / Data
Dependencies: FORM-001

Objective:
Enquiry data is recoverable.

Requirements:
- backup configuration on the chosen Supabase plan `[REQUIRES CONFIRMATION: OQ-15 plan/retention]`
- one restore test into a non-production project
- documented backup access control

Acceptance Criteria:
- a restore into a scratch project reproduces the enquiries table including row counts
- only named operators can access backups

Testing:
- restore drill recorded in the launch checklist.

### OPS-008 — Privacy-preserving measurement baseline

Priority: P2
Phase: V1 (decision and minimal baseline) / V1.1 (download measurement)
Area: Platform
Dependencies: OQ-09, PAGE-004

Objective:
Measure only what PRD §27 needs, without excessive tracking.

Requirements:
- provider decision before staging `[REQUIRES CONFIRMATION: OQ-09]`; cookieless where possible; no unconsented third-party scripts
- V1 events limited to: page views, enquiry submitted/failed (type only, no content), documentation Getting Started reached, outbound download click (only if privacy review allows)
- download completion measured from CDN/storage logs in V1.1, not by proxying files

Acceptance Criteria:
- the privacy policy lists exactly the measurement actually running
- no event payload contains name, email, message text or IP address
- disabling the provider does not break any page

Testing:
- network inspection in E2E for payload contents; test with provider blocked.

---

### 7.2 CORE — Design foundation and shell

### CORE-001 — Design tokens and theme engine

Priority: P0
Phase: V1
Area: Frontend
Dependencies: OPS-001

Objective:
Implement semantic tokens and a light/dark theme with system preference, manual toggle, persistence and no flash.

Requirements:
- semantic tokens (colour, spacing, radius, elevation, motion, layers, layout) per DS §5–8, consumed by Tailwind by role not value
- both themes meet contrast requirements; token-contrast check in CI
- theme choice stored client-side (not a cookie); initialisation via one small script permitted by CSP hash; no cookie-based server detection (DS D3)
- self-hosted fonts via the framework font loader, one family plus mono; no additional script subset (R-11)

Acceptance Criteria:
- first paint matches the chosen or system theme on a hard reload; no visible flash in light or dark
- toggling the theme persists across reloads and tabs
- all text/background token pairs meet WCAG 2.2 AA contrast in both themes (automated check)
- the page is still served as static/CDN-cached (theme does not force dynamic rendering)
- with scripts disabled, the page renders in the system-preferred theme

Testing:
- E2E flash check with screenshot comparison at first paint; contrast check in CI; static-rendering assertion in the build output.

### CORE-002 — UI primitives

Priority: P0
Phase: V1
Area: Frontend
Dependencies: CORE-001

Objective:
Accessible base components.

Requirements:
- Button, Link, Input, Textarea, Select, Checkbox/Radio, Badge, Disclosure (native), Tabs, Dialog (mobile nav), Heading, Text, Container, Icon, Visually hidden, per DS §39
- native elements first; one vetted headless library only for tabs, select, tooltip, popover `[REQUIRES CONFIRMATION: OQ-14]`
- one tree-shakable icon set

Acceptance Criteria:
- every primitive documents and renders default, hover, focus, active, disabled, loading (where relevant) and error (where relevant) states
- interactive primitives work by keyboard alone; focus ring is visible on every theme
- touch targets are at least 44 px where touch is plausible, never less than 24 px
- no primitive depends on hover alone

Testing:
- component tests with accessibility assertions per primitive.

### CORE-003 — Patterns, layout and section components

Priority: P0
Phase: V1
Area: Frontend
Dependencies: CORE-002

Objective:
Reusable multi-primitive blocks used by pages.

Requirements:
- patterns: Field, Form status, CTA block, Feature row, Ledger row, Callout, Evidence label, Copy button, Figure, Metric (renders only with source, owner and as-of date)
- layout: Section, Container, Breadcrumbs
- sections: only those pages need (hero, ecosystem, proof strip, services band, intent router)

Acceptance Criteria:
- the Metric component fails type-check and build if source, owner or as-of date is missing
- the Evidence label renders one of Screenshot, Recording, Illustration, Concept as visible text
- Copy button announces "Copied" through a polite live region and is labelled by what it copies
- no component exists that is not used by at least one V1 page (no speculative components)

Testing:
- component tests; negative type test for Metric.

### CORE-004 — Content layer and schema validation

Priority: P0
Phase: V1
Area: Platform / Content
Dependencies: OPS-001

Objective:
Validated, source-controlled content behind repository interfaces so storage can change later.

Requirements:
- schemas for Product, Release/Artifact, Service, Project, Process definition, Documentation page, Site config/navigation, FAQ
- repositories expose read functions; components never read files directly
- relationships explicit (product ↔ release ↔ docs ↔ service ↔ project); cross-links generated
- status labels, metrics (source + owner) and permission status are schema fields
- labelled fixture content for development; fixtures are excluded from production builds

Acceptance Criteria:
- adding a content file adds its route without code changes
- build fails on invalid, incomplete or orphaned references
- a production build containing fixture content fails
- changing a product's status label in one file updates every surface that displays it

Testing:
- unit tests for mappers; negative fixtures for each validation rule.

### CORE-005 — Site configuration and status-label model

Priority: P0
Phase: V1
Area: Platform / Frontend
Dependencies: CORE-004, CORE-002

Objective:
One source for site identity, navigation, social/community links and product status.

Requirements:
- site config module; navigation model; status labels as data (Available, Beta, In development, Coming soon)
- Status chip uses shape + text; state-aware CTA logic (Download, Join waitlist, Explore) derived from status and release data
- unknown external links (GitHub, community) absent from output unless confirmed

Acceptance Criteria:
- a product's CTA changes from "Join waitlist" to "Download" solely because its release data changes
- every product surface shows its status chip with visible text
- no placeholder social link renders in production

Testing:
- unit tests for CTA derivation across all states.

### CORE-006 — Error, not-found and loading states

Priority: P1
Phase: V1
Area: Frontend
Dependencies: CORE-003

Objective:
No blank or broken screens.

Requirements:
- 404 and 500 pages with a helpful way back; route-level error boundaries; skeletons only for genuinely async parts
- errors never expose stack traces or internals (SEC §27)

Acceptance Criteria:
- an unknown URL returns HTTP 404 with navigation back to Home, Products, Services, Documentation and Contact
- a forced server error renders the error page with no technical detail and is logged
- a failing optional module degrades without breaking the page

Testing:
- E2E for 404; component test for error boundary.

### CORE-007 — Media and font pipeline

Priority: P1
Phase: V1
Area: Frontend / Performance
Dependencies: CORE-001

Objective:
Enforce the media rules from TA §18 and DS §27.

Requirements:
- image component with required alt text (empty alt only for decorative), width and height, responsive sizes
- hero/LCP image never lazy; at most one priority media element per view
- video as a facade; no auto-playing audio; hosting approach `[REQUIRES CONFIRMATION: OQ-16]`
- large files never in the repository or `public/`

Acceptance Criteria:
- an image without alt text fails the build
- a file larger than the agreed threshold in `public/` or the repository fails CI `[REQUIRES CONFIRMATION: threshold set from baseline]`
- no layout shift is introduced by any image

Testing:
- lint/CI rules; Lighthouse lab CLS check on key templates.

---

### 7.3 NAV — Navigation

### NAV-001 — Header and mobile navigation

Priority: P0
Phase: V1
Area: Frontend
Dependencies: CORE-003, CORE-005

Objective:
Expose all journeys on every viewport.

Requirements:
- inline header on desktop; accessible dialog/sheet on mobile; no off-screen hidden tabs
- entries per navigation model (Products, Services, Technology, Work if enabled, Documentation, Downloads, About, Contact); Work shown only if enabled
- theme toggle; skip link; current page indicated by text/weight, not colour alone

Acceptance Criteria:
- a keyboard user can reach every link, open and close the mobile menu, and focus returns to the menu button on close
- the mobile menu traps focus while open and closes with Escape
- the skip link is the first focusable element and jumps to main content
- navigation entries for disabled areas (e.g., no case studies) do not render

Testing:
- E2E keyboard journey; component test for dialog focus management.

### NAV-002 — Footer

Priority: P1
Phase: V1
Area: Frontend
Dependencies: CORE-005

Objective:
Persistent secondary navigation and legal/identity information.

Requirements:
- links to legal pages, contact, documentation, downloads, social/community links only if confirmed
- legal entity name and copyright line from site config `[REQUIRES CONFIRMATION: OQ-10]`
- taglines used only in the role decided by brand owner

Acceptance Criteria:
- footer is identical on all public pages and absent from admin
- no link in the footer returns 404 or points to a placeholder

Testing:
- automated link check on the built site.

### NAV-003 — Breadcrumbs and product sub-navigation

Priority: P1
Phase: V1
Area: Frontend
Dependencies: CORE-003

Objective:
Lateral and hierarchical movement without returning to hubs.

Requirements:
- breadcrumbs on docs, product, service, project and release pages with structured data (see SEO-003)
- product sub-nav on product pages and lateral links to related products

Acceptance Criteria:
- from any product page, links to every other displayed product are reachable without visiting the hub
- breadcrumb trail matches the URL hierarchy and the current item is marked `aria-current`

Testing:
- E2E product exploration journey.

---

### 7.4 HOME — Homepage

### HOME-001 — Homepage opening: identity, locator and routes

Priority: P0
Phase: V1
Area: Frontend
Dependencies: CORE-003, CORE-005, NAV-001

Objective:
Within the first viewport a visitor knows what HENU is, what it builds and what to do next.

Requirements:
- specific, descriptive identity statement (final wording from content workstream, not a tagline)
- Ecosystem Locator with text fallback; one primary action; visible route for developers and for clients
- LCP element is text or inline SVG, not video

Acceptance Criteria:
- at 390 px and 1440 px width, the identity statement, primary action and developer and client routes are visible without scrolling
- the locator is readable as a text list when graphics are unavailable
- the primary CTA copy states a specific intent (not "Learn more")
- the LCP element is not an image or video that requires a network round trip beyond the document and fonts

Testing:
- E2E viewport assertions; lab LCP check.

### HOME-002 — Homepage body sections

Priority: P0
Phase: V1
Area: Frontend
Dependencies: HOME-001, PROD-001, OS-001, SERV-001

Objective:
Carry the ecosystem story in the order PRD §10.3 recommends, linking out rather than reproducing depth.

Requirements:
- order: differentiator, HENU OS stage, ecosystem, proof, technology, services, work (only if enabled), intent router
- proof strip contains only items with source, owner and date; hidden entirely if none exist
- insights section omitted until blog exists

Acceptance Criteria:
- no number, logo, testimonial or certification renders unless backed by a content entry with source and owner
- the intent router offers product, developer, client and contact paths with distinct CTA labels
- any current-version label on Home reads the release repository (no literal version in markup)

Testing:
- content-validation test for proof items; E2E home → products, services, documentation, contact.

---

### 7.5 PROD — Products

### PROD-001 — Products hub and Ecosystem Map

Priority: P0
Phase: V1
Area: Frontend / Content
Dependencies: CORE-004, CORE-005, NAV-001

Objective:
Show the HENU ecosystem as relationships, not an unrelated card grid.

Requirements:
- Ecosystem Map and product ledger driven by product content (status, relationships, independence/dependency notes)
- relationships shown only where confirmed `[REQUIRES CONFIRMATION: OQ-03]`; unconfirmed relationships are labelled "planned" or omitted
- text alternative for the map

Acceptance Criteria:
- each product row shows name, status chip with text, audience, one-line purpose and its relationship to other products
- the map's information is available as text to a screen reader and with images disabled
- a relationship edge cannot be rendered without a `confirmed` flag in the content
- adding a product content file adds a ledger row and map node without code changes

Testing:
- content-validation test for edges; component accessibility test; E2E hub → product.

### PROD-002 — Product page template

Priority: P0
Phase: V1
Area: Frontend
Dependencies: PROD-001, NAV-003, CORE-007

Objective:
Reusable template: why it exists → problem → solution → experience → capabilities → ecosystem relationship → evidence → next action.

Requirements:
- sections omitted (not faked) when evidence does not exist; every visual carries an evidence label
- "Ecosystem relationship" element on every product page; lateral links to related products
- one primary CTA derived from status and release data; secondary CTA to documentation where docs exist
- spec table for requirements/capabilities with accessible table markup

Acceptance Criteria:
- a product page with only a name, summary, status and one capability still renders a coherent page (no empty headings)
- no product page uses the "logo → name → 3 bullets → learn more" structure
- every image or recording shows its evidence label; illustrations are never labelled as screenshots
- CTA label and destination change correctly across all four status values

Testing:
- component tests for each status; content-validation for evidence labels.

### PROD-003 — Launch-ready product pages: HENU PA, HENU AI, HENU IDE

Priority: P1
Phase: V1 (conditional on OQ-03)
Area: Content / Frontend
Dependencies: PROD-002, HENU-supplied content (Section 26)

Objective:
Publish honest pages for the products HENU confirms as launch-ready.

Requirements:
- one content file per product; honest status chip; relationships limited to confirmed ones
- products without verified content are not published and are not shown as "coming soon" unless the owner approves that statement

Acceptance Criteria:
- every claim on each page has an owner recorded in the content metadata
- no page contains a superlative from the PRD prohibited list unless substantiated
- the hub and Home only link to published product pages

Testing:
- content review checklist signed by the product owner; link check.

---

### 7.6 OS — HENU OS

### OS-001 — HENU OS flagship page

Priority: P0
Phase: V1
Area: Frontend / Content
Dependencies: PROD-002, DOWN-001, OS-002

Objective:
A flagship page that is clearly one product within the ecosystem, with a trustworthy next action.

Requirements:
- sections per PRD §11.2, each rendered only if verified: what it is, who it is for, capabilities, voice interaction, relationships to PA/AI/IDE, developer experience, privacy/security philosophy (supportable statements only), requirements summary, docs/community/support links
- three layers kept separate: marketing (this page), documentation (links), download/release (links and panel)
- voice visuals are non-interactive in V1; browser microphone stays disabled (SEC §16)

Acceptance Criteria:
- the primary CTA is "Download" only when a published stable release exists; otherwise it reflects the real state (waitlist or explore) — never a dead button
- links to Downloads, Installation docs and Release information resolve
- any statement about privacy/security has a named owner in content metadata
- demonstration media is labelled Screenshot, Recording, Illustration or Concept truthfully

Testing:
- E2E in both states (release exists / no release); content review by product owner.

### OS-002 — System requirements and capability modules

Priority: P1
Phase: V1
Area: Content / Frontend
Dependencies: CORE-003, OQ-18

Objective:
Accurate, data-driven requirements shared across OS page, Downloads and docs.

Requirements:
- requirements stored with release data (minimum/recommended), not typed separately on each page
- table is accessible and readable on small screens

Acceptance Criteria:
- requirements shown on the OS page, Downloads page and Installation doc come from the same record
- on mobile, requirements render as a definition list with no horizontal scroll
- empty requirements hide the module rather than showing placeholders

Testing:
- unit test that all surfaces read one source; responsive E2E.

---

### 7.7 SERV — Services

### SERV-001 — Services content model and hub

Priority: P0
Phase: V1
Area: Frontend / Content
Dependencies: CORE-004, CORE-003

Objective:
Present services as applied engineering, framed by customer problem.

Requirements:
- categories as data; Software & Product Engineering and AI & Automation lead; Brand & Growth supporting; Business Solutions not rendered until OQ-05
- service definition template (customer problem, solution, deliverables, ideal customer, technology, process, proof, CTA) enforced by schema
- product and service CTAs and navigation remain distinct

Acceptance Criteria:
- a service missing required definition fields fails the build
- the hub shows only services with status "published" in content
- the primary CTA reads as a project action ("Discuss a project"), not generic
- Legal and Funding appear nowhere in navigation, hub or sitemap unless explicitly enabled by content

Testing:
- content-validation; E2E hub → service → enquiry.

### SERV-002 — Service detail template and validated pages

Priority: P1
Phase: V1 (conditional on OQ-05) for core engineering services; V1.1 for supporting services
Area: Frontend / Content
Dependencies: SERV-001, FORM-006

Objective:
Problem-led service pages with evidence and an enquiry path.

Requirements:
- order: customer problem → approach → solution → technology (with why) → deliverables → process → evidence → CTA
- technology shown with context, never as a bare list or logo wall
- FAQ block with real questions only; related case study link when one exists

Acceptance Criteria:
- a page that contains only a technology list is rejected by schema validation (technology cannot be the only populated section)
- the enquiry CTA opens the project form with the service preselected
- a service with no related case study omits that module without leaving a gap

Testing:
- schema negative test; E2E service enquiry.

### SERV-003 — Process component

Priority: P2
Phase: V1 (conditional on OQ-20)
Area: Frontend
Dependencies: SERV-002

Objective:
Show HENU's real delivery process.

Requirements:
- structured process data; no default "Understand → Plan → Design → Build → Test → Launch → Improve" is supplied

Acceptance Criteria:
- if no process data exists, no process section renders on any page
- Home carries at most a one-line process signal sourced from the same data

Testing:
- test with and without process data.

---

### 7.8 PROJ — Projects / case studies

### PROJ-001 — Case-study index and template

Priority: P2
Phase: V1 (conditional on OQ-19) / otherwise V1.1
Area: Frontend / Content
Dependencies: CORE-004, CORE-003

Objective:
Evidence of solving real problems, not a portfolio grid.

Requirements:
- structure: challenge → context → approach → solution → technology → outcome → evidence
- schema fields: permission status, client-approved flag, evidence source for each outcome
- index renders correctly with zero or one entry; with zero entries the Work area is not linked anywhere

Acceptance Criteria:
- a case study without permission status "approved" cannot be built in production
- outcomes are either sourced-and-owned metrics or clearly qualitative statements
- with one case study the index looks intentional (no empty grid cells)
- with none, `/projects` is excluded from navigation, sitemap and Home

Testing:
- build tests with 0, 1 and N entries.

---

### 7.9 PAGE — Static content pages

### PAGE-001 — Technology page

Priority: P1
Phase: V1
Area: Frontend / Content
Dependencies: CORE-003, OQ-21

Objective:
Demonstrate engineering depth without logo walls.

Requirements:
- plain-language summary first, then technical register; capabilities shared across products only where true
- technologies listed only with context; engineering practice (testing, release, security) only where real
- links to docs, releases, and repositories only if public and confirmed

Acceptance Criteria:
- no benchmark or performance figure appears without source, method and owner
- the page reads coherently with all optional modules absent
- repository/GitHub links are absent unless confirmed

Testing:
- content review; link check.

### PAGE-002 — About page

Priority: P1
Phase: V1
Area: Frontend / Content
Dependencies: CORE-003

Objective:
Company credibility from verified facts only.

Requirements:
- company statement; timeline, team and location only if confirmed; contact CTA

Acceptance Criteria:
- every dated milestone has a source and owner in content metadata
- no team, location or history section renders unless confirmed

Testing:
- content review.

### PAGE-003 — FAQ

Priority: P2
Phase: V1
Area: Frontend / Content
Dependencies: CORE-002

Objective:
Remove real objections; optionally embedded in relevant pages.

Requirements:
- native disclosure components; FAQ structured data only when the questions are visible on the page
- questions drawn from PRD §9.3 list; answers requiring unconfirmed facts are not published

Acceptance Criteria:
- each answer is reachable by keyboard and expands without layout jumps
- FAQ structured data matches visible content exactly

Testing:
- structured-data validation in CI; keyboard test.

### PAGE-004 — Privacy Policy and Terms

Priority: P0
Phase: V1
Area: Content / Legal
Dependencies: FORM-001, OPS-008, OQ-10

Objective:
Legal pages that match what the site actually does.

Requirements:
- text supplied after legal review; layout only is built here
- policy accurately lists enquiry data collected, purposes, retention (SEC-008 decision), processors in use (hosting, database, email, measurement, bot challenge) and theme-preference storage

Acceptance Criteria:
- legal text is approved by the named legal reviewer before launch
- the list of processors in the policy equals the list of third parties in production (checked at launch)
- forms link to the privacy notice and the consent wording matches the policy

Testing:
- launch-checklist comparison of processors vs policy.

---

### 7.10 DOWN — Downloads

### DOWN-001 — Release data model, repository and "latest" derivation

Priority: P0
Phase: V1
Area: Platform / Data
Dependencies: CORE-004, OQ-18

Objective:
One source of truth for version, channel, date, status, requirements, artifacts and checksums.

Requirements:
- entities: Release (product, version, channel, date, status draft/published/withdrawn, notes reference, requirements, docs links) and Artifact (architecture, file name, size, storage key, SHA-256, optional signature reference, media type)
- repository interface: `getLatestRelease`, `listReleases`, `getRelease`, `getArtifacts` (same interface for V1 files and V1.1 database)
- "latest per product per channel" is derived from published releases by documented version rules; never hand-set
- build fails on malformed version, duplicate (product, version, channel), missing/invalid SHA-256, negative size, or artifact URL on a non-download origin
- versioning scheme and channels per `[REQUIRES CONFIRMATION: OQ-18]`

Acceptance Criteria:
- no component, page or doc contains a literal version string, download URL, size or checksum (verified by a repository-wide check)
- publishing a new release by data change alone updates Home, HENU OS, Downloads and docs "latest version" references consistently
- a withdrawn release disappears from download actions and "latest" derivation but remains in history
- draft releases never appear in any build output for production

Testing:
- unit tests for version sorting, latest derivation across channels, withdrawal, and every validation rule.

### DOWN-002 — Downloads hub and HENU OS download page

Priority: P0
Phase: V1
Area: Frontend
Dependencies: DOWN-001, CORE-003, OS-002

Objective:
Reach the correct current stable download without hunting, and understand what is being downloaded.

Requirements:
- structure per DS §18.3: status banner, current stable panel above the fold, artifact rows, checksum block, verify steps, requirements, install and upgrade pointers, latest notes, previous releases, other channels collapsed and labelled "Not for production use", "download didn't start" guidance
- download links point directly to the artifact origin; the application does not proxy files
- file size visible before the click; no email wall or login
- responsive: mobile artifact rows become stacked cards; previous releases as cards on mobile, table on desktop

Acceptance Criteria:
- the current stable release is visually identifiable without scrolling through previous releases
- a release entry displays version, release date, channel, architecture, artifact name, file size, SHA-256 checksum and a download action
- the download action's href targets the artifact origin hostname, never the application
- beta and nightly never replace stable as the primary action when a stable release exists
- if release data cannot be read, a safe message with a contact path replaces the panel and the error is logged server-side
- no copy claims "verified", "authentic", "secure download" or "signed" unless the matching control exists (DOWN-003)
- tested usable on a 360 px mobile viewport

Testing:
- E2E: latest release shown, link targets origin, previous releases listed; component tests for each state (available, beta, no release, withdrawn, data unavailable, empty history).

### DOWN-003 — Checksum block, verification guide and recovery

Priority: P0
Phase: V1
Area: Frontend / Content
Dependencies: DOWN-002, DOC-005

Objective:
Let users verify a file honestly and recover from a failed download.

Requirements:
- checksum label reads "SHA-256 checksum for integrity verification"; value is monospaced, selectable, wraps at any character, with a labelled copy control
- verify guide per operating system the audience uses, linked to documentation `[REQUIRES CONFIRMATION: commands per platform from engineering]`
- recovery panel: retry, check connection and free space, compare file size, alternative source if one exists
- the page does not promise a download dialog, progress indicator or "download started" message

Acceptance Criteria:
- the checksum value can be copied with one action and the copy is announced to assistive technology
- checksum text never overflows its container at 320 px
- the verify guide's commands are tested on a real artifact before launch
- the signature row is absent unless signing exists

Testing:
- component and accessibility tests; manual verification of the guide against a staging artifact.

### DOWN-004 — No-release status and waitlist state

Priority: P0
Phase: V1 (state always built; waitlist conditional on OQ-02)
Area: Frontend
Dependencies: DOWN-001, FORM-007

Objective:
An honest page when nothing can be downloaded.

Requirements:
- status chip (In development / Coming soon), a plain statement, waitlist form or notification link, links to documentation and roadmap if they exist
- no download button, no disabled download button, no fake version

Acceptance Criteria:
- with zero published releases, no element anywhere suggests a file can be downloaded
- if the waitlist is disabled, the page offers a contact route instead of a form
- the same state appears consistently on Home, HENU OS and Downloads

Testing:
- E2E with release data empty.

### DOWN-005 — Download origin configuration and hardening

Priority: P0
Phase: V1 (conditional on OQ-01)
Area: Platform / Security
Dependencies: OPS-006, SEC-002

Objective:
The download origin is separate and hardened.

Requirements:
- separate hostname; no cookies; `nosniff`; attachment disposition; HTTPS only; no directory listing; restricted cross-origin access; abuse and hotlink controls at the CDN (SEC §21.2)
- object versioning and retention/immutability where the provider supports it `[VERIFY: provider capability]`

Acceptance Criteria:
- the origin sets no cookies and serves files as attachments with `nosniff`
- directory listing returns an error
- overwriting a published object is rejected or preserved as a new version
- a cost/abuse alert is configured on egress

Testing:
- header checks against staging origin; negative write test.

---

### 7.11 REL — Release pages and lifecycle extensions

### REL-001 — Release history and release detail pages

Priority: P2
Phase: V1.1 (V1 if release history exists at launch)
Area: Frontend
Dependencies: DOWN-001

Objective:
Per-release notes and a browsable history.

Requirements:
- `/releases` ledger and `/releases/[version]` with categorised notes (taxonomy `[REQUIRES CONFIRMATION]`), artifacts and checksums from the same data, previous/next navigation, links to docs

Acceptance Criteria:
- artifact and checksum values on a release page equal those on Downloads (same source)
- withdrawn releases show a banner and no download action
- notes categories render with a text label, not colour alone

Testing:
- E2E release browsing; withdrawn-release component test.

### REL-002 — Release integrity monitoring

Priority: P2
Phase: V1.1 (V1 if public release at launch and feasible)
Area: Platform / Security
Dependencies: OPS-006

Objective:
Detect silent artifact change.

Requirements:
- scheduled job recomputes or compares provider checksums against metadata and alerts on mismatch

Acceptance Criteria:
- an intentionally altered test artifact triggers an alert to the named owner
- the job runs without write access to storage

Testing:
- staging drill.

### REL-003 — Database-managed releases

Priority: P2
Phase: V1.1 (conditional on release cadence)
Area: Platform / Data
Dependencies: DOWN-001, ADMIN-001, ADMIN-004

Objective:
Publish releases without a code deploy when cadence justifies it.

Requirements:
- tables with constraints (unique product/version/channel, valid SHA-256, non-negative size); database implementation of the same repository interface; on-demand revalidation when a release is published or withdrawn

Acceptance Criteria:
- switching the data source changes no component or route
- publishing a release revalidates Home, product, downloads and release pages
- constraint violations are rejected by the database even if validation is bypassed

Testing:
- integration tests against an ephemeral database.

---

### 7.12 DOC — Documentation

### DOC-001 — MDX pipeline and component allowlist

Priority: P0
Phase: V1
Area: Platform / Frontend
Dependencies: CORE-004

Objective:
Safe, structured documentation rendering.

Requirements:
- MDX with frontmatter schema (title, product, version applicability, order); raw HTML disabled; allowlist: Prose, Heading, Callout, CodeBlock, Tabs, Table, Figure, Link, List, VersionApplicability, Kbd, Steps
- links validated; external links with appropriate relationship attributes; images only from allowed origins; embeds as facades
- syntax highlighting at build time

Acceptance Criteria:
- a document containing raw HTML or a non-allowlisted component fails the build
- an internal link to a missing page fails the build
- no client-side syntax-highlighting runtime ships

Testing:
- unit tests and negative fixtures.

### DOC-002 — Documentation shell and navigation

Priority: P0
Phase: V1
Area: Frontend
Dependencies: DOC-001, NAV-003

Objective:
A reading-optimised layout with stable navigation.

Requirements:
- sidebar from the content tree (only categories with real content), "On this page" rail, breadcrumbs, previous/next, linkable headings reachable by keyboard
- mobile: "Menu" and "On this page" disclosures beneath the header; no off-screen tab strips
- no hero imagery or promotional CTAs inside docs

Acceptance Criteria:
- an empty category never appears in the sidebar
- the current page is marked with `aria-current` and a non-colour cue
- on mobile every documentation page can be navigated using only the disclosures
- previous/next order follows the content tree

Testing:
- E2E documentation navigation on desktop and mobile.

### DOC-003 — Code blocks, callouts and tabs

Priority: P1
Phase: V1
Area: Frontend
Dependencies: DOC-001, CORE-003

Objective:
Accessible technical content components.

Requirements:
- code blocks: optional filename and language label, labelled copy button with live-region confirmation, long lines scroll in a focusable region with an accessible name, command blocks copy without prompt characters
- callouts: Note, Tip, Warning, Danger with icon and visible text label; warnings never collapsed
- tabs for platform alternatives, keyboard operable

Acceptance Criteria:
- a keyboard user can focus, scroll and copy a long code block
- copying a command block does not include a leading `$` or similar prompt
- each callout type is distinguishable without colour
- inline code and code blocks meet 4.5:1 contrast in both themes

Testing:
- component and accessibility tests.

### DOC-004 — Version applicability and cross-links

Priority: P1
Phase: V1
Area: Frontend / Content
Dependencies: DOC-002, DOWN-001, PROD-002

Objective:
Docs, products and releases link to each other.

Requirements:
- each document declares the product version range it applies to and links to the relevant release
- each product page links to its documentation; each doc section links back to the product

Acceptance Criteria:
- a documentation page without a version-applicability declaration (where required by its type) fails validation
- every product with documentation shows a link to it, and every such document links back
- version references in docs read the release repository, not literals

Testing:
- link-graph test in CI.

### DOC-005 — Essential documentation content

Priority: P0
Phase: V1
Area: Content
Dependencies: DOC-002, HENU-supplied content

Objective:
Publish only real, owned documentation: Getting Started, Installation, Verify your download, Troubleshooting, plus HENU OS basics, FAQ and Release Notes entry where content exists.

Requirements:
- every article has an owner and a version applicability; empty categories are not published
- written by HENU engineering; this ticket covers integration, review and publication

Acceptance Criteria:
- Getting Started, Installation and Verify your download exist before launch if a public release exists; if not, a documented "coming with first release" entry point is shown instead
- installation steps have been executed by a reviewer who did not write them `[REQUIRES CONFIRMATION: engineering reviewer]`
- no article contains unverified commands or capabilities

Testing:
- documentation walk-through on a clean machine or VM before launch.

---

### 7.13 BLOG — Insights

### BLOG-001 — Insights (blog / news / release notes index)

Priority: P2
Phase: V1.1 (launches only with real content and a named publishing owner)
Area: Frontend / Content
Dependencies: CORE-004, DOC-001, OQ-22

Objective:
Publish useful content from MDX without CMS infrastructure.

Requirements:
- file-based MDX articles with frontmatter (title, date, author, type, related products); categories/tags and author pages only if volume justifies them
- same content-safety rules as docs

Acceptance Criteria:
- the blog is absent from navigation and sitemap until at least the agreed minimum number of real articles exist `[REQUIRES CONFIRMATION: OQ-22]`
- every article has a named author or owner and a publish date
- draft articles never appear in production output

Testing:
- build tests with zero and several articles.

---

### 7.14 FORM — Contact and enquiries

### FORM-001 — Enquiry data model and database access path

Priority: P0
Phase: V1
Area: Backend / Data
Dependencies: OPS-002, SEC-003

Objective:
Persist enquiries reliably with a least-privilege intake path.

Requirements:
- `enquiries` table per TA §7.3: type (general, project, partnership, waitlist; technical and support reserved), name, email, organisation (optional), message (length-bounded; not required for waitlist), service interest (optional slug), status (new, in progress, resolved, spam), source page, created time, consent-recorded time `[REQUIRES CONFIRMATION: legal wording]`
- only technical metadata that is necessary; no unnecessary personal data
- row-level security deny-by-default; browser has no direct database access; intake through an insert-only role or tightly confined server credential `[REQUIRES CONFIRMATION: SEC decision 5]`
- forward-only, reviewed migrations; generated types

Acceptance Criteria:
- a request using the public client key cannot read, update or delete any enquiry
- the intake path can insert but cannot read other enquiries
- an invalid `type` or oversized message is rejected by the database as well as by application validation
- migrations apply cleanly to an empty database and roll forward in staging

Testing:
- integration tests against an ephemeral database for constraints and row-level security (positive and negative).

### FORM-002 — Enquiry form framework (validation, submission, states)

Priority: P0
Phase: V1
Area: Frontend / Backend
Dependencies: FORM-001, CORE-003

Objective:
One accessible, server-validated submission mechanism for all forms.

Requirements:
- schema-first validation shared by client hints and server; the server is authoritative
- first-party Server Action; origin verification; no secrets in the client
- states: idle, submitting, success, validation error, server error, rate-limited, offline/network failure
- user input preserved on every failure; visible fallback contact method

Acceptance Criteria:
- every field has a programmatically associated label; errors are identified in text, linked to the field and announced; focus moves to the error summary on failed submit
- double-clicking submit creates one enquiry
- a submission that fails server-side shows a safe message, preserves all input and offers the alternative contact route
- with network disabled, the form explains the failure and keeps the input
- success replaces the form with a confirmation that states what happens next, with a response-time promise only if HENU confirmed one `[REQUIRES CONFIRMATION: OQ-11]`
- server rejects bodies exceeding limits and unknown fields

Testing:
- component tests per state; E2E for success, validation failure, simulated backend failure; accessibility checks on error states.

### FORM-003 — Contact page, intent selector and forms

Priority: P0
Phase: V1
Area: Frontend
Dependencies: FORM-002

Objective:
Route enquiries by intent with the lightest form for each.

Requirements:
- intent selector: start a project, partnership, general, technical question (guidance panel pointing to docs/community/email, no form), media (address only), support (channel only until V1.1)
- project form: name, email, short description required; organisation and service interest optional and marked optional
- partnership and general forms short; each form links to the privacy notice

Acceptance Criteria:
- choosing "technical question" shows guidance first and no database write path
- the project form needs no more than name, email and description to submit
- each form has exactly one primary action
- the page works with the intent preselected from a query parameter or link (used by service pages)
- tested on a 360 px mobile viewport

Testing:
- E2E for each intent; mobile E2E.

### FORM-004 — Spam protection and rate limiting

Priority: P0
Phase: V1
Area: Backend / Security
Dependencies: FORM-002, SEC-004

Objective:
Protect the inbox and the email quota without punishing real users.

Requirements:
- layers in order (SEC §19): server validation, accessibly-hidden honeypot, signed time-to-submit token, rate limiting, duplicate detection, content heuristics routing to `spam` status, adaptive challenge only when risk signals appear, email-side global ceiling
- challenge provider `[REQUIRES CONFIRMATION: OQ-17]`; the challenge slot is empty by default
- limiter fails open to a degraded safe path for public enquiries (stricter checks, review queue) and fails closed for admin sign-in `[REQUIRES CONFIRMATION: SEC §18]`
- numeric limits defined from observed behaviour after launch; initial values documented as provisional `[REQUIRES CONFIRMATION]`

Acceptance Criteria:
- a submission with the honeypot filled is not delivered as a normal enquiry and the bot receives no distinguishing signal
- a submission completed implausibly fast is marked suspect
- exceeding the rate limit returns HTTP 429 semantics with a generic message and a retry hint
- the honeypot is invisible to screen readers and keyboard users
- identical repeat submissions within the dedupe window create one notification
- the rate limiter works across multiple server instances (demonstrated in staging)

Testing:
- automated abuse scenarios in staging; accessibility test that the honeypot is not focusable or announced.

### FORM-005 — Notification workflow

Priority: P0
Phase: V1
Area: Backend
Dependencies: FORM-001, OQ-17

Objective:
A defined human is told about every real enquiry.

Requirements:
- notification to an internal recipient only; header-injection-safe; plain text content with no HTML rendering of user input
- sender domain with SPF, DKIM and DMARC; provider and auto-reply policy `[REQUIRES CONFIRMATION: OQ-17]`
- global email ceiling; failure to send does not lose the stored enquiry and is logged

Acceptance Criteria:
- every stored non-spam enquiry results in a notification to the named recipient in staging
- a failed email send leaves the enquiry stored with a recoverable indication and an alert
- newline or header characters in name or email fields cannot alter email headers
- authentication records pass in an external mail-header check

Testing:
- integration test with sandboxed email provider; header-injection fixtures.

### FORM-006 — Service enquiry entry

Priority: P1
Phase: V1
Area: Frontend
Dependencies: SERV-002, FORM-003

Objective:
A visitor arrives at the project form with the service already selected.

Requirements:
- service CTA links to the project form with a validated service slug; unknown slugs are ignored

Acceptance Criteria:
- the service selector shows the chosen service on arrival and the stored record carries that slug
- an invalid slug does not break the form or store arbitrary text

Testing:
- E2E service → enquiry → persisted record; negative test with an invalid slug.

### FORM-007 — Waitlist capture

Priority: P1
Phase: V1 (conditional on OQ-01/OQ-02)
Area: Frontend / Backend
Dependencies: FORM-002, DOWN-004

Objective:
Let interested users be notified when a release exists.

Requirements:
- email only plus a privacy note; same protections as other forms; stored with `type = waitlist`
- the way notifications are eventually sent is a separate decision `[REQUIRES CONFIRMATION]`; this ticket only captures

Acceptance Criteria:
- the form asks for one field and links to the privacy notice
- duplicate emails do not create repeated notifications or errors visible to the visitor
- the form never appears when a stable release exists

Testing:
- E2E in no-release state; duplicate submission test.

### FORM-008 — Enquiry handling runbook

Priority: P1
Phase: V1
Area: Operations
Dependencies: FORM-005, SEC-001

Objective:
Unmonitored forms are worse than no form.

Requirements:
- named owner and backup; how operators review via the managed database dashboard under MFA; status meanings; spam review and purge schedule; what is sent as a response and by whom

Acceptance Criteria:
- the runbook names an owner and a backup before launch
- a test enquiry has been triaged end to end by the owner in staging
- the purge schedule for spam and retention is documented and matches the privacy policy

Testing:
- tabletop walk-through recorded in the launch checklist.

### FORM-009 — Dedicated support intake

Priority: P3
Phase: V1.1
Area: Frontend / Backend
Dependencies: FORM-002, OQ-11

Objective:
Add a support form if the support model requires it.

Requirements:
- reuse form framework; type `support`; security review per SEC §38

Acceptance Criteria:
- the form exists only after the support model and owner are confirmed; response expectations are published only if achievable

Testing:
- as FORM-003.

---

### 7.15 ADMIN — Operator interface

### ADMIN-001 — Admin authentication and authorisation guard

Priority: P1
Phase: V1.1 (V1 only if OQ-04 requires admin at launch)
Area: Backend / Security
Dependencies: FORM-001, SEC-004

Objective:
A minimal, isolated, authenticated admin shell.

Requirements:
- managed authentication only; public sign-up disabled; mandatory MFA; sign-in method and factor policy `[REQUIRES CONFIRMATION: SEC decisions 2–3]`
- a single `admin` role stored in an application profile table; deny-by-default server-side authorisation on every admin page and action
- isolated route group and layout; `noindex`; not linked publicly; no third-party scripts
- accessible sign-in that supports password managers and paste

Acceptance Criteria:
- an unauthenticated request to any admin URL is rejected and redirected
- an authenticated user without an admin profile cannot read or change anything, including by calling the underlying actions directly
- admin responses carry non-cacheable headers
- sign-in is rate limited; the limiter fails closed
- admin pages are absent from the sitemap and carry noindex

Testing:
- integration and E2E for the three user classes (anonymous, authenticated non-admin, admin).

### ADMIN-002 — Enquiries module

Priority: P1
Phase: V1.1
Area: Frontend / Backend
Dependencies: ADMIN-001

Objective:
Replace dashboard-based review with a purpose-built list.

Requirements:
- list with filters (status, type, date), sort, pagination; detail view as escaped plain text; status change (new, in progress, resolved, spam)
- no create or delete of enquiries from the UI; deletion only via retention process unless OQ-15 says otherwise
- audit entry for every status change

Acceptance Criteria:
- enquiry content containing HTML or script characters is displayed as inert text
- changing a status records actor, time and previous/new value
- the module has loading, empty, no-results and error states
- a non-admin cannot change a status through a direct call

Testing:
- component, integration and E2E tests including injection fixtures.

### ADMIN-003 — Audit log

Priority: P1
Phase: V1.1
Area: Backend
Dependencies: ADMIN-001

Objective:
Traceability for admin writes.

Requirements:
- append-only record of actor, action, entity, entity id, timestamp and summary; no secrets or full message bodies

Acceptance Criteria:
- every admin mutation produces exactly one audit entry
- audit entries cannot be edited or deleted through the application

Testing:
- integration tests.

### ADMIN-004 — Releases module

Priority: P2
Phase: V1.1 (conditional on REL-003)
Area: Frontend / Backend
Dependencies: REL-003, ADMIN-001, ADMIN-003

Objective:
Manage releases in the database with draft, publish and withdraw.

Requirements:
- create/edit draft, attach artifact metadata (artifact upload itself stays in the release pipeline, not the admin UI), publish, withdraw
- step-up re-authentication before publish, withdraw or changing an artifact URL or checksum; two-person approval is Future `[REQUIRES CONFIRMATION: SEC decision 12]`

Acceptance Criteria:
- a release cannot be published with a missing or malformed checksum or an artifact URL outside the download origin
- publish and withdraw require re-authentication and create audit entries
- withdrawing removes the download action on the public site after revalidation

Testing:
- integration and E2E for publish/withdraw; negative validation tests.

---

### 7.16 SEO

### SEO-001 — Metadata framework

Priority: P0
Phase: V1
Area: Frontend
Dependencies: CORE-004

Objective:
Unique, accurate metadata on every indexable page.

Requirements:
- title template, description, canonical URL, Open Graph and X/Twitter card tags driven by content fields
- schema requires title and description for all content types

Acceptance Criteria:
- no two indexable pages share a title or description
- every indexable page has a self-referencing canonical URL on the canonical host
- shared links to Home, HENU OS and Downloads render a meaningful preview image and text

Testing:
- CI crawl of the built site for missing or duplicate metadata.

### SEO-002 — Sitemap, robots and indexing policy

Priority: P0
Phase: V1
Area: Frontend / Platform
Dependencies: SEO-001, CORE-004

Objective:
Search engines see the right pages in the right environments.

Requirements:
- sitemap generated from content; robots environment-aware (production allow; staging/preview disallow plus noindex)
- indexing rules in Section 16

Acceptance Criteria:
- the production sitemap lists exactly the indexable routes, with no admin, error or placeholder pages
- staging and preview return noindex and a disallow-all robots response
- unpublished or fixture content appears in no sitemap

Testing:
- automated checks per environment.

### SEO-003 — Structured data and internal linking

Priority: P1
Phase: V1
Area: Frontend
Dependencies: SEO-001, NAV-003

Objective:
Structured data that matches visible content, and a coherent internal link graph.

Requirements:
- Organization, SoftwareApplication (only for products with accurate facts), BreadcrumbList, Article (V1.1), FAQPage only where the questions are visible
- no ratings, reviews or award markup unless real and displayed

Acceptance Criteria:
- structured data validates with no errors and every value is present on the visible page
- no orphan indexable page exists in the link graph
- brand disambiguation for "HENU" is reviewed against current search results before launch `[REQUIRES CONFIRMATION: PRD §22]`

Testing:
- structured-data validation in CI; link-graph test.

---

### 7.17 SEC — Security tasks derived from the Security Architecture

### SEC-001 — Platform and operator account hardening

Priority: P0
Phase: V1
Area: Security / Operations
Dependencies: OPS-002

Objective:
Protect every account that can change the site, data or DNS.

Requirements:
- MFA on hosting, database platform, Git host, CI, registrar/DNS, email provider and storage; no shared accounts; minimal membership; DNS/registrar lock
- named list of operators with access to the database dashboard; least privilege

Acceptance Criteria:
- an access inventory exists and every listed account has MFA enforced
- no shared credentials exist
- the registrar and DNS are locked and have limited access

Testing:
- access review recorded in the launch checklist.

### SEC-002 — Security headers and Content Security Policy

Priority: P0
Phase: V1
Area: Security / Frontend
Dependencies: CORE-001, OPS-004

Objective:
Baseline headers with a CSP compatible with static rendering and the theme script.

Requirements:
- HTTPS redirect, HSTS (staged), `nosniff`, referrer policy, permissions policy (microphone disabled), frame protection
- public CSP hash-based and Report-Only first, then enforced; admin CSP nonce-based; download origin variant
- rollout approach for CSP and HSTS `includeSubDomains`/`preload` `[REQUIRES CONFIRMATION: SEC decision 21]`

Acceptance Criteria:
- an external header scan shows all baseline headers on public pages, admin and the download origin
- the theme-initialisation script runs under the enforced CSP
- CSP violations are reported to a reviewed destination during the Report-Only period
- no inline script exists without a hash or nonce

Testing:
- header and CSP checks in CI against preview; manual browser console review.

### SEC-003 — Database and Supabase configuration

Priority: P0
Phase: V1
Area: Security / Data
Dependencies: FORM-001

Objective:
Safe database exposure.

Requirements:
- row-level security enabled on every exposed table; default grants revoked; limited exposed schemas; elevated credentials server-only; public sign-up disabled
- completed Supabase configuration review (SEC §23, §47)

Acceptance Criteria:
- the review checklist is completed and signed before launch
- an attempt to read any table with the public key returns nothing
- server-only credentials are not present in any client bundle or repository history

Testing:
- automated RLS tests; manual review sign-off.

### SEC-004 — Rate-limiting infrastructure

Priority: P0
Phase: V1
Area: Security / Platform
Dependencies: OQ-07

Objective:
Provide a limiter that actually works across serverless instances.

Requirements:
- platform feature or managed key-value store; client IP read only from the platform's trusted header; limiter events logged with hashed keys; 429 with generic message

Acceptance Criteria:
- requests distributed across instances are counted together (demonstrated in staging)
- spoofing a forwarded-for header from the client does not change the limit key
- limiter-store outage behaves as specified in FORM-004 and is alerted

Testing:
- load test from multiple clients in staging.

### SEC-005 — Secrets management and scanning

Priority: P0
Phase: V1
Area: Security / Platform
Dependencies: OPS-002

Objective:
No secret in code, Git history, bundles or logs.

Requirements:
- per-environment secrets; secret scanning in CI and push protection; inventory with owner and rotation procedure rehearsed once

Acceptance Criteria:
- a seeded dummy secret is blocked in a test pull request
- rotation of one real credential is completed per the written procedure before launch
- the secret inventory lists each secret, owner and environment

Testing:
- seeded-secret test; rotation rehearsal.

### SEC-006 — Dependency and supply-chain controls

Priority: P1
Phase: V1
Area: Security / Platform
Dependencies: OPS-003

Objective:
Controlled third-party code.

Requirements:
- lockfile enforced; dependency scanning in CI and on a schedule; update process; new-dependency review (TA §27); SBOM is V1.1

Acceptance Criteria:
- a known-vulnerable dependency fails the pull request check or raises a tracked alert per policy
- adding a dependency requires a recorded reason in the pull request

Testing:
- seeded vulnerable-package test.

### SEC-007 — Safe error handling and logging

Priority: P1
Phase: V1
Area: Security / Platform
Dependencies: OPS-005, CORE-006

Objective:
Useful logs without leaking data.

Requirements:
- structured logs with correlation identifiers; no secrets, message bodies or unnecessary personal data; PII scrubbing in error tracking; generic user-facing errors

Acceptance Criteria:
- reviewing logs from a full enquiry test shows no email address, message text or secret
- user-visible errors never include stack traces or internal identifiers beyond a support reference

Testing:
- log review during staging drills.

### SEC-008 — Privacy, retention and data handling

Priority: P1
Phase: V1
Area: Security / Legal
Dependencies: PAGE-004, FORM-001

Objective:
Implement the retention and deletion decisions.

Requirements:
- retention periods for enquiries, spam, logs and backups decided `[REQUIRES CONFIRMATION: SEC decision 14]`; scheduled purge of spam; process for correction/deletion requests

Acceptance Criteria:
- retention values are documented, match the privacy policy and are enforced by a scheduled task or documented manual procedure with an owner
- a deletion request can be executed by an authorised operator within the documented procedure

Testing:
- purge dry-run in staging.

### SEC-009 — Pre-launch security testing

Priority: P0
Phase: V1
Area: Security / QA
Dependencies: FORM-004, SEC-002, SEC-003, SEC-004

Objective:
Verify controls before public traffic.

Requirements:
- tests from SEC §41: injection, XSS, CSRF/origin, rate limiting, authorisation (when admin exists), header/TLS checks, download-origin checks, Supabase review

Acceptance Criteria:
- every test case has a recorded result; no high-severity finding remains open
- findings and fixes are traceable to tickets

Testing:
- this ticket is the test activity; penetration test is V1.1 `[REQUIRES CONFIRMATION: SEC decision 25]`.

### SEC-010 — Security disclosure page and `security.txt`

Priority: P1
Phase: V1.1 (V1 if public HENU OS release at launch)
Area: Content / Security
Dependencies: OQ-01, SEC-009

Objective:
A responsible way to report vulnerabilities.

Requirements:
- disclosure process, contact, supported versions, practices that genuinely exist; no claims of certification or compliance

Acceptance Criteria:
- the reporting contact is monitored and a tested message reaches the named owner
- every security statement has a named owner
- `security.txt` is served and valid

Testing:
- test report sent to the contact; content review.

---

### 7.18 PERF — Performance

### PERF-001 — Performance budgets and automated checks

Priority: P0
Phase: V1
Area: Performance
Dependencies: OPS-003, HOME-001

Objective:
Make performance an acceptance criterion.

Requirements:
- targets: Core Web Vitals "good" thresholds as published by Google (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile) as the field goal; JavaScript-per-route, image-weight and font-weight budgets `[REQUIRES CONFIRMATION: set from baseline, OQ-23]`
- Server Components by default; client islands only where interaction requires it; no animation library or third-party script without a recorded justification and measurement
- lab checks on Home, HENU OS, Downloads, a product page and a documentation page in CI

Acceptance Criteria:
- a pull request that exceeds an agreed budget fails or requires an explicit waiver
- mid-range-mobile lab results for the five templates are recorded before launch
- no page ships client JavaScript that its interactions do not need

Testing:
- lab audits in CI; bundle analysis report per release.

### PERF-002 — Caching, revalidation and CDN behaviour

Priority: P1
Phase: V1
Area: Performance / Platform
Dependencies: OPS-004, DOWN-001

Objective:
Fast delivery and predictable freshness.

Requirements:
- static assets immutably cached; content pages statically generated; release-driven pages rebuilt on deploy in V1 (R-04) and revalidated on demand in V1.1
- download origin caching and large-file delivery through the CDN

Acceptance Criteria:
- a content change is visible in production after deploy without manual cache steps
- static assets return long-lived cache headers; HTML follows the documented policy
- the download origin serves large files with range requests supported `[VERIFY: provider]`

Testing:
- header assertions; deploy-and-verify drill.

---

### 7.19 A11Y — Accessibility

### A11Y-001 — Accessibility foundation, automated checks and motion rules

Priority: P0
Phase: V1
Area: Frontend / QA
Dependencies: CORE-002

Objective:
Accessibility built in; WCAG 2.2 AA as the practical target `[REQUIRES CONFIRMATION: OQ-23]`. No certification is claimed.

Requirements:
- landmarks, heading order, skip link, focus management for dialogs, accessible names, status-not-by-colour, reduced-motion support, accessible tables, accessible code blocks, form accessibility, sufficient touch targets
- automated checks in CI on key templates
- CSS-first motion; motion only communicates structure or state; essential information never conveyed by animation alone

Acceptance Criteria:
- automated checks report zero serious or critical violations on Home, HENU OS, Downloads, a service page, a documentation page and Contact
- with reduced-motion enabled, no non-essential animation plays
- every dialog, menu and disclosure is operable by keyboard with logical focus return
- colour is never the sole carrier of status, error or selected state

Testing:
- automated engine in CI; component assertions.

### A11Y-002 — Manual accessibility audit

Priority: P1
Phase: V1
Area: QA
Dependencies: A11Y-001, all V1 page tickets

Objective:
Catch what automation cannot.

Requirements:
- keyboard-only walkthrough of every V1 template; screen-reader review on at least one desktop and one mobile combination; 200% zoom and text-spacing checks; contrast review of status chips and focus states

Acceptance Criteria:
- the download page, contact forms, navigation and documentation are completable by keyboard and with a screen reader
- findings are logged; all blocking findings fixed before launch

Testing:
- recorded checklist per template.

---

### 7.20 TEST — Testing

### TEST-001 — Unit and content-validation suite

Priority: P0
Phase: V1
Area: QA
Dependencies: OPS-003, CORE-004

Objective:
Protect logic with the highest risk.

Requirements:
- unit tests for validation schemas, release version/channel sorting and "latest" derivation, checksum formatting, CTA derivation, content mappers
- negative fixtures for every content-validation rule

Acceptance Criteria:
- each listed logic area has tests including failure cases
- there is no arbitrary coverage percentage; a reviewer confirms risk areas are covered `[REQUIRES CONFIRMATION: team policy]`

Testing:
- the suite itself runs in CI on every pull request.

### TEST-002 — Integration tests

Priority: P0
Phase: V1
Area: QA
Dependencies: FORM-001, FORM-005, DOWN-001

Objective:
Verify service, repository and database together.

Requirements:
- run against a local/ephemeral database; enquiry creation, constraint enforcement, row-level security (positive and negative), spam routing, email notification with a sandboxed provider; admin guard when admin exists

Acceptance Criteria:
- a deliberately broken policy (e.g., public read allowed) causes a test failure
- test data is synthetic; no production data is used in any test environment

Testing:
- CI integration job.

### TEST-003 — End-to-end critical journeys

Priority: P0
Phase: V1
Area: QA
Dependencies: all V1 page tickets

Objective:
Prove the journeys that matter in a real browser.

Requirements:
- journeys listed in Section 21; third-party services mocked or sandboxed

Acceptance Criteria:
- all journeys pass against the preview before each production promotion
- flaky tests are fixed or removed, not skipped

Testing:
- browser E2E in CI.

### TEST-004 — Cross-browser and device pass

Priority: P1
Phase: V1
Area: QA
Dependencies: TEST-003

Objective:
Practical verification on the support matrix in Section 22.

Requirements:
- manual pass of Home, HENU OS, Downloads, Contact, a documentation page on the matrix; automated E2E on at least Chromium, Firefox and WebKit

Acceptance Criteria:
- no blocking defect on any matrix entry; known minor issues are logged
- download, theme toggle, mobile navigation and form submission work on real iOS and Android browsers

Testing:
- recorded matrix results.

---

## 8. Acceptance Criteria Standards

Acceptance criteria in this document follow these rules so QA can test them without interpretation.

| Rule | Example |
|---|---|
| Describe observable behaviour | "The current stable release is visually identifiable without scrolling through previous releases." |
| Name the data shown | "A release entry displays version, release date, architecture, artifact name, file size, checksum and download action." |
| Include the failure path | "If release data cannot be read, a safe message with a contact path replaces the panel." |
| State the breakpoint or assistive path where relevant | "Usable at 360 px", "announced by assistive technology" |
| Avoid vague words | "user-friendly", "modern", "fast" are not acceptable without a number or observable test |
| Mark unknown thresholds | `[REQUIRES CONFIRMATION]` rather than inventing a number |

Coverage matrix for each significant UI feature:

| Dimension | Where it is defined |
|---|---|
| Functional behaviour | Ticket Requirements and Acceptance Criteria |
| Visual behaviour | DS sections referenced by the ticket; design review |
| Responsive behaviour | Cross-cutting criteria (320 px) plus ticket-specific criteria |
| Accessibility | Cross-cutting criteria, A11Y-001/002 |
| Security | SEC tickets, plus ticket-specific criteria (e.g., plain-text rendering) |
| Error / loading / empty | Section 20 |

---

## 9. User Stories

Used where they clarify intent; not a story for every ticket.

| Persona | Story | Tickets |
|---|---|---|
| Developer | As a developer, I want to identify the latest HENU OS release quickly so that I can download and install it. | DOWN-002, DOC-005 |
| Developer | As a developer, I want to verify the checksum of a download so that I know the file was not corrupted. | DOWN-003 |
| Developer | As a developer, I want documentation that says which HENU OS version it applies to so that I follow the right steps. | DOC-004 |
| Product visitor | As a product visitor, I want to understand what HENU builds and how the products relate so that I can explore the relevant product. | HOME-001, PROD-001 |
| Product visitor | As a product visitor, I want an honest status for each product so that I know what I can use today. | CORE-005, PROD-002 |
| Business client | As a business client, I want to understand HENU's services and previous work so that I can decide whether to contact HENU. | SERV-001, SERV-002, PROJ-001 |
| Business client | As a business client, I want to start a project enquiry with the service already selected so that I do not repeat myself. | FORM-006 |
| Existing user | As an existing HENU OS user, I want to find release notes and the current version so that I can decide whether to upgrade. | DOWN-002, REL-001 |
| Partner | As a potential partner, I want a short, specific way to reach HENU so that my enquiry reaches the right person. | FORM-003 |
| HENU operator | As a HENU operator, I want every real enquiry delivered to a named owner so that no lead is lost. | FORM-005, FORM-008 |
| HENU release owner | As a release owner, I want a published release to update every page from one record so that the site never disagrees with itself. | DOWN-001 |

---

## 10. Data and Database Requirements

### 10.1 Content classes

| Class | Meaning | HENU V1 members |
|---|---|---|
| **Static content** | Source-controlled, schema-validated, changed by pull request | Products, services, process definition, case studies, documentation, FAQ, legal pages, site config and navigation, testimonials (if any), release data (V1) |
| **Database content** | Needs persistence or querying at runtime | Enquiries (including waitlist) |
| **Admin-managed content** | Needs a CRUD interface so non-developers or no-deploy changes are possible | None in V1. V1.1: enquiry status, admin profile, audit log; releases only if REL-003 |
| **Future content** | Not implemented now | Blog in database, CMS-managed content, analytics store, client/community data, search index |

### 10.2 Entity table

| Entity | Purpose | Key fields | Relationships | Database? | Static? | Admin-managed? |
|---|---|---|---|---|---|---|
| Product | Describe one HENU product | slug, name, summary, status label, audience, capabilities, ecosystem relations (with `confirmed`), evidence references, CTA type, SEO fields | has releases, docs, related products, related case studies | No | **Yes** | No |
| Product feature / capability | Capabilities shown on product and Technology pages | text, evidence reference, owner | belongs to a product | No | **Yes** (embedded in product content) | No |
| Release | A published version | product, version, channel, date, status (draft/published/withdrawn), notes reference, requirements, docs links | belongs to product; has artifacts | V1.1 (conditional) | **Yes in V1** | V1.1 (conditional) |
| Release artifact | One downloadable file | architecture, file name, size, storage key, SHA-256, signature reference (optional), media type | belongs to release | V1.1 (conditional) | **Yes in V1** | V1.1 (conditional) |
| Service | Describe one service | slug, category, customer problem, approach, deliverables, ideal customer, technology with rationale, process reference, proof references, CTA, status | related case studies | No | **Yes** | No |
| Process definition | HENU's real delivery process | stages, descriptions | referenced by services | No | **Yes** (only when confirmed) | No |
| Project / case study | Evidence of solved problems | slug, challenge, context, approach, solution, technology, outcome, evidence with source/owner, permission status | related services/products | No | **Yes** (MDX) | No |
| Blog post | Insight/news article | slug, title, date, author, type, body, related products | related product/docs | No | **Yes** (MDX, V1.1) | No (Future) |
| Documentation page | Article in the docs tree | path (derived), title, product, version applicability, order, body | related product/release | No | **Yes** (MDX) | No |
| FAQ | Real objection answers | question, answer, owner, scope | embedded in pages or `/faq` | No | **Yes** | No |
| Contact enquiry | Visitor message | type, name, email, organisation, message, service interest, status, source page, created time, consent time | references a static service slug | **Yes** | No | V1.1 (status only) |
| Waitlist signup | Release notification interest | email, created time, consent time (stored as an enquiry with type waitlist) | — | **Yes** (same table) | No | V1.1 (view only) |
| Media asset | Images/video used by content | file, alt text, evidence label, dimensions | referenced by content | No (no entity) | **Yes** (repo/media origin by size) | No |
| Admin user | Operator identity | managed by auth provider; application profile with role | — | V1.1 | No | No (managed in auth provider) |
| Audit log | Admin write history | actor, action, entity, entity id, time, summary | — | V1.1 | No | No (append-only) |
| Site config / navigation | Identity, links, nav | names, links, legal entity, social links (confirmed only) | used by layouts, sitemap | No | **Yes** | No |
| Testimonial | Permissioned quote | text, person, permission, source | related services/projects | No | **Yes** (conditional) | No |
| Download event | Count downloads | — | — | **No** | No | — Future/external (CDN logs) |

### 10.3 Data principles carried into tickets

- No entity is added to the database until a feature requires runtime persistence or no-deploy editing.
- Status labels, metrics and permission flags are schema fields so they cannot be bypassed in markup.
- Environments never share data; fixtures never reach production.

---

## 11. API Requirements

| API / Action | Purpose | Method | Auth Required? | Consumer | Data | Priority |
|---|---|---|---|---|---|---|
| `submitEnquiry` (Server Action) | Create enquiry (general, project, partnership, waitlist) | POST (framework-managed) | No (public) with origin verification, rate limit, spam checks | Contact page, service pages, waitlist form | Validated form fields; returns success/field errors/generic failure | P0 |
| Product, service, project, documentation retrieval | Page rendering | None (Server Components call the service layer) | n/a | The site itself | Static content | P0 |
| Release retrieval | Downloads, OS page, Home, docs | None (service layer; no API) | n/a | The site itself | Release data | P0 |
| Download of artifact | Obtain file | HTTP GET to the **artifact origin** (not the application) | No | Browser | Binary | P0 |
| `/api/health` | Uptime and basic readiness | GET | No (returns minimal non-sensitive status) | Uptime monitor | Status only | P1 |
| `/sitemap.xml`, `/robots.txt` | Search hygiene | GET (file conventions) | No | Crawlers | Generated | P0 |
| Revalidation trigger | Refresh pages after release publish/withdraw | POST (route handler or server action) | **Yes** (secret or admin session) | Admin / release workflow | Page tags/paths | P2 (V1.1, with REL-003) |
| Admin: list/read enquiries | Review enquiries | Server Component + guarded service | **Yes** (admin) | Admin UI | Enquiries | P1 (V1.1) |
| Admin: update enquiry status | Triage | Server Action | **Yes** (admin, server-side check, audited) | Admin UI | Status | P1 (V1.1) |
| Admin: manage releases | Create/publish/withdraw | Server Action | **Yes** (admin + step-up) | Admin UI | Release data | P2 (V1.1, conditional) |
| `/api/webhooks/*` | Inbound callbacks | POST | Signature verification | External service | Provider payload | As needed — none identified; not built |
| `/api/v1/releases`, `/api/v1/releases/latest` | Machine-readable release metadata | GET | No (public read-only) | HENU OS components, scripts, partners | Release metadata | Future / V1.1 **only when a consumer exists** |
| Search, media, content APIs | — | — | — | — | — | **Not built** |

Distinctions: **public** = enquiry action, health, sitemap/robots, artifact origin. **Authenticated** = none in V1. **Admin** = V1.1 server actions and routes. **Internal** = all content/release reads and the enquiry Server Action (not a stable public contract; TA §29.4).

---

## 12. Admin Requirements

**Decision:** V1 has no custom admin. Operators review enquiries via the managed database dashboard (MFA, least privilege) and email notifications. V1.1 introduces a minimal admin only because enquiries are persisted data that need triage. This is the smallest admin that is justified.

### 12.1 Modules specified

| Module | Purpose | CRUD | Fields | Permissions | Validation | Audit | Dependencies | Priority / Version |
|---|---|---|---|---|---|---|---|---|
| Authentication shell | Sign-in, session, guard | — | email/credential via auth provider, MFA | Single `admin` role | Rate limit; MFA required | Sign-in events logged | FORM-001, SEC-004 | P1 / V1.1 (V1 if OQ-04) |
| Enquiries | Triage visitor messages | **R**ead list/detail; **U**pdate status only; no create; no delete in UI | type, name, email, organisation, message (plain text), service interest, status, source page, created time | admin | status from closed set | Every status change | ADMIN-001, ADMIN-003 | P1 / V1.1 |
| Audit log | Traceability | Append-only; read-only view | actor, action, entity, id, time, summary | admin | n/a | Self | ADMIN-001 | P1 / V1.1 |
| Releases | Manage releases in database | C, R, U (draft), publish, withdraw; no hard delete | per release/artifact model | admin + step-up for critical actions | checksum format, size, version uniqueness, origin of URL | Every write | REL-003 | P2 / V1.1 (conditional) |

### 12.2 Modules explicitly not built

| Module | Reason |
|---|---|
| Dashboard / analytics | No requirement; PRD defers broad admin |
| Products, Services, Projects, Case studies, FAQs | Static, source-controlled, low change rate |
| Blog | Static MDX in V1.1; CMS only when frequency and non-developer publishing justify it (OQ-22) |
| Documentation | MDX in Git; derived metadata |
| Media | No upload feature (R-08) |
| Users / roles | Managed in the auth provider; full RBAC is Future |
| Settings | Static site config |

---

## 13. Release and Download Workflow

### 13.1 Entity lifecycle

```text
Product
  ↓
Release (version, channel, date, status)
  ↓
Architecture (attribute of an artifact)
  ↓
Artifact (file name, size, storage key)
  ↓
Checksum (SHA-256; signature optional, later)
  ↓
Download (direct from artifact origin)
  ↓
Release notes
  ↓
Documentation (installation, verification, upgrade)
```

### 13.2 Publishing flow

```text
Build artifact (controlled workflow)
   ↓
Compute SHA-256
   ↓
Upload to immutable path (draft location, non-public)
   ↓
Verify: download and compare size + checksum
   ↓
Create release metadata (status: draft) via pull request
   ↓
Review (CODEOWNERS; checksum, links, notes, requirements, docs)
   ↓
Publish: promote artifact to public path; merge PR; deploy (V1) / publish action (V1.1)
   ↓
Pages update: Home, HENU OS, Downloads, docs references
```

### 13.3 Questions answered

| Question | V1 | V1.1 (if DB-managed) |
|---|---|---|
| How is a release created? | A release metadata file is added in a pull request after the pipeline verifies the artifact | Draft created in admin |
| How does it become draft? | `status: draft` in the file; draft artifacts are in a non-public location; drafts are excluded from production builds | `draft` row status |
| How is it reviewed? | Pull request with required CODEOWNERS review; checks verify schema, checksum format, origin; reviewer confirms release notes, requirements and docs links `[REQUIRES CONFIRMATION: single vs two-person approval, SEC decision 12]` | Review in admin; step-up re-authentication to publish |
| How does it become published? | Merge to main and deploy; artifact promoted to public path | Publish action; automatic revalidation |
| How is current stable identified? | Derived: highest published, non-withdrawn version in channel `stable` by documented rules; never hand-set | Same rule in database |
| How are older releases retained? | Remain as published records; shown in previous-releases ledger; artifacts retained unless withdrawn | Same |
| How are artifacts attached? | Listed in the release record with architecture, file name, size, storage key | Same, entered in admin; upload stays in pipeline |
| How are checksums stored? | SHA-256 in the artifact record; schema validated; recomputed after upload | Same, plus database check constraint |
| How are download links managed? | Derived from storage key and the download origin; never typed into components | Same |
| How are broken artifacts handled? | See 13.4 | See 13.4 |

### 13.4 Broken artifact or mismatch procedure

1. Alert from integrity monitor, user report or uptime check (REL-002, OPS-005).
2. Release owner marks the affected release or artifact **withdrawn** (V1: pull request and emergency deploy; V1.1: admin action).
3. Downloads page removes the download action, shows a banner pointing to the current good release or alternative source, and keeps the record in history.
4. Root cause investigated; new artifact published as a **new** version or an explicitly audited republish with a public note — never a silent overwrite.
5. Incident recorded; secrets rotated if release credentials may be involved.

### 13.5 States the UI must cover

Available stable; beta present; no public release; withdrawn release; release data unavailable; artifact host unreachable; empty history (see DOWN-002, DOWN-004).

---

## 14. Content Workflow

```text
Draft  →  Review  →  Publish  →  Update  →  Archive
```

Applied only where it earns its place.

| Content type | Workflow | Mechanism | Gate |
|---|---|---|---|
| Release (metadata) | Full: draft → review → publish → update/withdraw → archive (kept in history) | PR (V1) / admin (V1.1) | Checksum, notes, requirements, docs links; CODEOWNERS |
| Documentation | Draft → review → publish → update | Pull request; version applicability required | Technical reviewer who executed the steps; owner named |
| Case study | Draft → review → permission check → publish | Pull request | Client permission status "approved"; evidence has source and owner |
| Product and service copy | Draft → review → publish → update | Pull request | Claims checklist; named owner of each claim; no prohibited superlatives |
| Blog / insights (V1.1) | Draft → review → publish → update → archive | Pull request | Named author and publishing owner |
| Metrics / proof items | Draft → verify → publish → scheduled review | Content field requires source, owner, as-of date | Review cadence set by content owner `[REQUIRES CONFIRMATION: OQ-22]` |
| Legal pages (Privacy, Terms) | Legal review → publish → update on change | Pull request with legal approver | Approval recorded; **no editorial workflow beyond this** |
| FAQ, About, Technology | Review → publish | Pull request | Owner confirmation of facts |
| Site config / navigation | Review → publish | Pull request | — |

Unpublished content never appears in production output (schema `status` field, CI check).

---

## 15. Contact and Lead Workflow

```text
Visitor
  ↓
Form (selected by intent)
  ↓
Client-side hints (labels, required, length)
  ↓
Server validation (authoritative)
  ↓
Spam protection (honeypot, time token, rate limit, duplicate check, heuristics; challenge only on risk)
  ↓
Server-side processing (normalise; consent timestamp)
  ↓
Database (enquiries)
  ↓
Notification to internal recipient
  ↓
Operator review (managed dashboard in V1; admin in V1.1)
  ↓
Status: new → in progress → resolved   (or spam)
  ↓
Follow-up by the named owner (no CRM integration)
```

| Item | Specification |
|---|---|
| Enquiry types (V1) | General, project (also for service enquiries), partnership, waitlist (conditional). Reserved: technical, support. Media: email address only |
| Required fields | General: name, email, message. Project: name, email, short description. Partnership: name, email, message. Waitlist: email |
| Optional fields | Organisation; service interest (project) |
| Validation | Length limits, email format, closed enums, unknown fields rejected; server authoritative |
| Rate limits | Layered: platform edge, application limiter on a shared store; numeric values provisional until observed `[REQUIRES CONFIRMATION: OQ-07]` |
| Spam protection | As FORM-004; no CAPTCHA for every visitor |
| Storage | PostgreSQL via the insert-only/confined path (FORM-001); spam retained briefly then purged (SEC-008) |
| Notification | Email to internal recipient only; global ceiling; failure logged and alerted |
| Admin status | new, in progress, resolved, spam |
| Error handling | Preserved input; safe message; alternative email shown; no stack traces |
| Privacy | Data minimisation; consent timestamp stored; privacy notice linked; retention enforced; no third-party processors beyond those listed in the policy |
| CRM | **Not promised.** No CRM integration is planned or implied |

---

## 16. SEO Implementation

### 16.1 Checklist

| Area | Requirement | Ticket |
|---|---|---|
| Metadata | Unique title and description per page; title template | SEO-001 |
| Canonical | Self-referencing canonical on the canonical host; no duplicates between `www` and non-`www` or trailing-slash variants | SEO-001 |
| Open Graph / X cards | Meaningful preview for Home, HENU OS, Downloads, Products, Services | SEO-001 |
| Structured data | Organization; SoftwareApplication for accurate product pages; BreadcrumbList; Article (V1.1); FAQPage only where visible | SEO-003 |
| Sitemap / robots | Generated; environment-aware | SEO-002 |
| Semantic HTML | One `h1` per page, sequential headings, landmarks | A11Y-001 |
| Image alt text | Required by the image component | CORE-007 |
| Internal linking | Product ↔ docs ↔ release ↔ service ↔ case study generated from relationships | CORE-004, SEO-003 |
| Breadcrumbs | Docs, product, service, project, release pages | NAV-003 |
| Product pages | Real questions targeted ("what is HENU OS", "HENU OS download") without keyword stuffing | PROD-002 |
| Documentation indexing | Indexable articles; no thin placeholders | DOC-005 |
| Release pages | Indexable current release and per-release pages; withdrawn releases remain with a notice | REL-001 |
| Performance | Core Web Vitals goals | PERF-001 |
| Brand disambiguation | Review search landscape for "HENU" before launch | SEO-003 |

### 16.2 Indexing policy

| Page type | Policy |
|---|---|
| Home, Products, product pages with real content, Services, service pages, Technology, About, Contact, Downloads, HENU OS download page, Documentation articles, Privacy, Terms, FAQ | **Indexable** |
| Case studies | Indexable once approved |
| Release pages | Indexable; withdrawn pages kept indexable with a clear notice (or noindex per OQ review) |
| Waitlist state, placeholder or "coming soon" product pages with no substantive content | **Thin content: do not publish as separate pages; if published, noindex** |
| Admin, sign-in | **noindex, excluded from sitemap**, not linked |
| 404 / error pages | Not in sitemap; correct status codes |
| Staging and preview deployments | **noindex + robots disallow**, access restricted |
| Query-parameter variants (e.g., pre-selected intent or service) | **Canonicalised** to the base page |
| Fixture content | Never deployed to production |

---

## 17. Accessibility Implementation

Practical target: **WCAG 2.2 AA** where applicable. No accessibility certification is claimed.

| Task | Ticket |
|---|---|
| Semantic HTML, landmarks, heading order, skip link | A11Y-001, NAV-001 |
| Keyboard navigation and visible focus on every control | CORE-002, A11Y-001 |
| Focus management: dialogs, mobile menu, disclosure, error summary | CORE-002, NAV-001, FORM-002 |
| Screen-reader labels and live regions (copy confirmation, form status) | CORE-003, FORM-002 |
| Form accessibility: labels, error text linked to fields, instructions, no placeholder-only labels | FORM-002 |
| Error messaging identified in text and announced | FORM-002 |
| Colour contrast in both themes, including status chips and focus states | CORE-001 |
| Touch targets (44 px where touch plausible; never below 24 px) | CORE-002 |
| Modal accessibility (mobile menu dialog, step-up dialog) | CORE-002, ADMIN-004 |
| Dropdown/disclosure accessibility | CORE-002, PAGE-003 |
| Reduced motion | A11Y-001 |
| Accessible tables (caption, scoped headers) incl. requirements and release ledgers | CORE-003, DOWN-002 |
| Accessible code blocks (focusable scroll region, labelled copy) | DOC-003 |
| Accessible authentication (no cognitive tests, paste allowed) | ADMIN-001 |
| Honeypot not exposed to assistive technology | FORM-004 |
| Manual audit before launch | A11Y-002 |

---

## 18. Performance Implementation

| Task | Detail | Ticket |
|---|---|---|
| Image optimisation and responsive images | Image component with sizes, modern formats, explicit dimensions | CORE-007 |
| Font optimisation | Self-hosted, one family plus mono, limited weights, no extra script subset unless confirmed | CORE-001 |
| Lazy loading | Everything below the fold except the LCP element; the hero is never lazy | CORE-007 |
| Code splitting / client component minimisation | Server Components default; client islands only for tabs, copy, theme, mobile menu, forms | PERF-001 |
| Caching and CDN | Immutable static assets; documented HTML policy; artifacts via CDN | PERF-002 |
| Static generation vs server rendering | Static for all content pages; no per-request rendering for informational pages | CORE-004, PERF-002 |
| Bundle analysis | Report per pull request/release | PERF-001 |
| Third-party script control | None by default; each addition requires justification and measurement | PERF-001, OPS-008 |
| Animation performance | CSS-first, transform/opacity only for essential motion; reduced motion honoured | A11Y-001 |
| Video | Facade, loaded on demand | CORE-007 |

Targets:

| Metric | Goal | Status |
|---|---|---|
| LCP | ≤ 2.5 s (field, 75th percentile; Google's published "good" threshold) | Adopted as goal; validated against baseline |
| INP | ≤ 200 ms | Same |
| CLS | ≤ 0.1 | Same |
| JavaScript per route, image weight per page, font weight | `[REQUIRES CONFIRMATION: set from baseline measurement, OQ-23]` | Open |
| Mid-range mobile lab profile and network throttling | `[REQUIRES CONFIRMATION: OQ-23]` | Open |

---

## 19. Security Implementation Tasks

Derived from the Security Architecture §44.1. Not a restatement of the document.

| SEC §44.1 requirement | Implementing ticket(s) |
|---|---|
| HTTPS, HSTS, certificate monitoring | OPS-004, SEC-002, OPS-005 |
| Managed auth, MFA, deny-by-default authorisation, secure session cookies | ADMIN-001 (V1.1), SEC-001 (operators in V1) |
| Server-side input validation | FORM-002, CORE-004 |
| SQL injection protection | FORM-001 (parameterised access, repositories), TEST-002 |
| XSS protection, CSP | SEC-002, DOC-001, ADMIN-002 (plain-text) |
| CSRF protection | FORM-002 (origin verification), ADMIN-001 |
| Rate limiting | SEC-004, FORM-004 |
| Spam protection | FORM-004 |
| Secrets management | SEC-005, OPS-002 |
| Security headers | SEC-002 |
| Secure database access, RLS, Supabase review | FORM-001, SEC-003 |
| Operator/platform MFA | SEC-001 |
| Download integrity | OPS-006, DOWN-001, DOWN-003, DOWN-005, REL-002 |
| Dependency scanning | SEC-006, OPS-003 |
| Source/CI security | OPS-001, OPS-003, OPS-004 |
| Safe error handling, logging, alerting | CORE-006, SEC-007, OPS-005 |
| Backups and restore test | OPS-007 |
| Privacy basics and retention | SEC-008, PAGE-004 |
| Incident response basics | FORM-008, Section 28 checklist |
| Email security | FORM-005 |
| Security testing | SEC-009 |
| No file uploads in V1 | R-08; no upload feature exists |
| Environment isolation | OPS-002 |
| DNS/registrar hardening | SEC-001 |
| Audit events | ADMIN-003 (V1.1) |

Secure cookies and CSRF controls for admin are ticketed under ADMIN-001 and take effect when the admin ships; the public site sets no non-essential cookies.

---

## 20. Loading, Empty, Error, Success and Offline States

Defined per dynamic feature before building; none are deferred.

| Feature | Loading | Empty | Error | Success | Offline / network failure |
|---|---|---|---|---|---|
| Downloads page | None needed (static); any client enhancement shows no spinner | "No previous releases"; no public release → status panel, no download button | Release data unavailable: safe message with contact path, logged; artifact host unreachable: recovery panel and alternative source if any | Not applicable (no observable completion); static guidance describes what to expect | Page loads from CDN cache; download failure is covered by recovery panel |
| Release pages | Static | No release notes: "Notes not available" with link to downloads | As above | — | As above |
| Products hub / product page | Static | Section omitted when evidence is absent | Error boundary page | — | Static assets cached |
| Documentation | Static | Empty categories hidden | 404 with link to docs home | Copy button: "Copied" announced politely | Cached pages remain readable; copy works offline |
| Contact forms | Submit button shows busy state; button disabled; focus remains | n/a | Field errors with summary and focus; server error preserves input and shows alternative email; rate-limited message with retry hint | Confirmation replaces the form: what happens next; response time only if confirmed | Message that the network failed; input preserved; retry available |
| Waitlist | As above | — | As above | "You are on the list" confirmation; duplicates look the same | As above |
| Case studies | Static | Zero entries → area absent; one entry → intentional layout | Error boundary | — | Static |
| Admin enquiries (V1.1) | Skeleton table | "No enquiries yet" and "No results for these filters" | Inline error with retry; unauthorised redirects to sign-in | Inline confirmation of status change | Disabled actions with explanation |
| Admin releases (V1.1) | Skeleton | "No releases yet" | Validation errors per field; step-up failure message | Published/withdrawn confirmation | Disabled actions |
| Theme toggle | n/a | n/a | Falls back to system preference if storage is blocked | State change visible immediately | Works offline |
| Search (Future) | — | — | — | — | — |

---

## 21. Testing Strategy

| Layer | Scope | Priority targets |
|---|---|---|
| Unit | Logic and utilities | Validation schemas, release sorting and latest derivation, checksum formatting, CTA derivation, content mappers (TEST-001) |
| Content validation | Build-time schema checks | Products, services, releases, docs frontmatter, SEO fields, metrics (source+owner), evidence labels |
| Component | Reusable UI with accessibility assertions | Form components, navigation and mobile dialog, disclosure/tabs, release/artifact rows, status chip, copy button |
| Integration | Service + repository + database | Enquiry creation, constraints, row-level security, spam routing, notifications, admin guard when it exists (TEST-002) |
| End-to-end | Critical journeys in a real browser (TEST-003) | Table below |
| Accessibility | Automated in CI + manual | A11Y-001/002 |
| Performance | Lab checks in CI/preview + field monitoring | Home, HENU OS, Downloads, a product page, a docs page |
| Security | Test cases from SEC §41 | SEC-009 |
| Visual regression | Deferred | Future, once the design system is stable |

### Critical end-to-end journeys

| # | Journey | Key assertions |
|---|---|---|
| 1 | Homepage navigation | Home loads; primary CTA and route links work; navigation reaches Products, Services, Documentation, Contact |
| 2 | Product discovery | Home → Products → HENU OS → related product links; status chips visible; no dead ends |
| 3 | HENU OS download | Downloads page shows correct current stable version, size, checksum; link targets the artifact origin; docs links resolve. In no-release state: status panel with no download control |
| 4 | Release browsing | Previous releases listed; withdrawn release shows banner and no download action; (release detail pages in V1.1) |
| 5 | Documentation navigation | Sidebar, "On this page", prev/next, mobile menu; code copy works |
| 6 | Service enquiry | Service page → project form with service preselected → persisted record with the slug |
| 7 | Contact submission | Valid success; invalid shows accessible errors; simulated backend failure preserves input; rate-limit behaviour |
| 8 | Theme switching | Toggle persists; no flash on reload; both themes legible |
| 9 | Admin authentication (V1.1, when admin exists) | Anonymous rejected; non-admin rejected; admin allowed |
| 10 | Admin content management (V1.1) | Update enquiry status and see audit entry; releases module if built |
| 11 | SEO/technical hygiene | Sitemap and robots correct per environment; canonical and metadata present |
| 12 | Error pages | 404 and error boundary render safely |

Principles: tests run on every pull request; E2E runs against the preview; synthetic data only; third-party services mocked or sandboxed; flaky tests are fixed or removed; no exhaustive E2E of every visual component.

---

## 22. Browser and Device Test Matrix

Recommended practical matrix. Final support policy `[REQUIRES CONFIRMATION: OQ-23]`. No obsolete-browser support in V1 without a confirmed requirement.

| Browser | Desktop | Tablet | Mobile | Policy |
|---|---|---|---|---|
| Chrome | Latest two stable versions | Android | Android | Full support; automated E2E |
| Edge | Latest two stable versions | — | — | Full support; smoke test |
| Firefox | Latest two stable versions | — | Android (smoke) | Full support; automated E2E |
| Safari | Latest two stable versions (macOS) | iPadOS | iOS | Full support; automated E2E (WebKit) plus real-device manual pass |

| Viewport class | Test widths (examples) | Notes |
|---|---|---|
| Small mobile | 320–360 px | Download page, forms, mobile navigation, documentation menus |
| Mobile | 390–430 px | Reference mobile experience |
| Tablet | 768–1024 px | Portrait and landscape; docs sidebar behaviour |
| Laptop | 1280–1440 px | Baseline desktop |
| Large / ultra-wide | 1920 px and above | Contained widths; backgrounds scale sensibly |

Additional checks: 200% zoom, text-spacing override, reduced-motion on, dark and light themes, orientation change, JavaScript disabled for core content and navigation, slow network.

---

## 23. Development Phases

The sequence differs from the generic template because of three dependencies in 01–04: (1) the release model feeds Home, the OS page and Downloads, so it is built **before** product pages; (2) enquiry infrastructure has the longest vendor lead time, so it **starts in Phase 0 in parallel**; (3) hardening is partly continuous (CI gates from Phase 0), not only a final phase.

| Phase | Name | Goal | Tickets |
|---|---|---|---|
| **0** | Foundation and long-lead items | Repo, CI, environments, hosting, content/schema layer; start vendor and legal lead-time items | OPS-001..004, CORE-004, OPS-005 (basic), SEC-001, SEC-005, SEC-006 |
| **1** | Design system and shell | Tokens, theme, primitives, patterns, layout, navigation, error pages, media pipeline, base SEO | CORE-001..003, CORE-005..007, NAV-001..003, SEO-001, SEO-002, A11Y-001 |
| **2** | Release and product model | Release data model/repository, product model, hub, product template | DOWN-001, PROD-001, PROD-002, OS-002 |
| **3** | Flagship, downloads, homepage | HENU OS page, downloads (or honest state), homepage | OS-001, DOWN-002..004, HOME-001, HOME-002, OPS-006 and DOWN-005 (if public release), PROD-003 (if confirmed) |
| **4** | Services and company pages | Services hub/pages, Technology, About, FAQ, case studies if real | SERV-001..003, PAGE-001..003, PROJ-001 (conditional) |
| **5** | Documentation | MDX pipeline, shell, components, essentials | DOC-001..005 |
| **6** | Enquiries integration | Forms on top of infrastructure started in Phase 0 | FORM-001..008, SEC-003, SEC-004 (infrastructure begins in Phase 0 and runs in parallel from Phase 1) |
| **7** | Hardening and launch readiness | Security tests, CSP enforcement, privacy and legal pages, performance and accessibility audits, cross-browser, backups, rehearsals | SEC-002, SEC-007..010, PAGE-004, PERF-001, PERF-002, A11Y-002, TEST-001..004, OPS-007, OPS-008, SEO-003 |
| **8** | V1.1 | Admin, release pages, integrity monitoring, blog, support intake, expansion | ADMIN-001..004, REL-001..003, BLOG-001, FORM-009, SEC-010 (if not already V1), additional product/service pages |

Notes:

- Phase 7 tasks that depend on stable pages (full-site audits) run last, but their **CI gates are introduced earlier** (PERF-001 budgets, A11Y-001 checks, SEC-002 Report-Only CSP start in Phase 1).
- If admin is mandatory at launch (OQ-04), ADMIN-001..003 move into Phase 6 and add roughly one phase of work; the rest of the plan is unchanged.

---

## 24. Dependency Graph

### 24.1 Primary chain

```text
Design tokens + theme (CORE-001)
    ↓
UI primitives (CORE-002)
    ↓
Patterns / layout / sections (CORE-003)
    ↓
Navigation + footer (NAV-001..003)        Content layer (CORE-004) ──► Site config + status model (CORE-005)
    ↓                                           ↓
Page templates ◄───────────────────────────────┘
    ↓
Product / service / technology pages
    ↓
Release data (DOWN-001) ──► Homepage, HENU OS, Downloads
    ↓
Documentation (DOC-*)
    ↓
Enquiry forms integrated with pages (FORM-006)
    ↓
Admin (V1.1)
```

### 24.2 Cross-cutting dependencies

| Cross-cutting concern | Needed by | Blocker if missing |
|---|---|---|
| Hosting + environments (OPS-002, OPS-004) | Everything deployed | No preview/staging |
| Database (FORM-001, SEC-003) | Enquiry forms, waitlist, admin | No persistence of leads |
| Authentication | Admin (V1.1) only; operators use platform MFA in V1 | None for V1 pages |
| Storage / artifact origin (OPS-006, DOWN-005) | Public download | Download panel stays in "no release" state |
| Release system (DOWN-001) | Home, OS, Downloads, docs references | Version inconsistencies |
| Forms (FORM-*) | Contact, services, waitlist | No conversion path |
| Rate-limit store (SEC-004) | FORM-004, ADMIN-001 | Controls that look real but are not |
| Email provider/domain (FORM-005) | Notifications | Leads stored but nobody informed |
| SEO (SEO-001/002) | All indexable pages | Duplicate or missing metadata |
| Analytics (OPS-008) | PRD §27 metrics | Cannot measure launch success |
| CSP + theme script (SEC-002 ↔ CORE-001) | Public pages | Flash of wrong theme or blocked script |
| Legal review (PAGE-004) | Forms going live | Cannot collect personal data legally `[REQUIRES CONFIRMATION]` |
| Deployment (OPS-004) | Launch | No production |

### 24.3 Blockers (genuine)

1. OQ-01 public HENU OS release at launch — determines whether the artifact pipeline and origin are on the critical path.
2. OQ-03 launch-ready products and statuses — determines product pages and ecosystem claims.
3. OQ-12 brand architecture — determines navigation naming and URLs.
4. OQ-07 rate-limit store and OQ-17 email/bot providers — block FORM-004/005.
5. OQ-10 legal review path — blocks go-live of forms.
6. Content from HENU (Section 26) — blocks pages even when templates are complete.

---

## 25. Parallel Workstreams

```text
 Stream A: Frontend foundation            Stream B: Data + platform             Stream C: Content preparation       Stream D: Security + operations
 (CORE-001..003, NAV, A11Y-001)           (CORE-004, DOWN-001, FORM-001)         (HENU supplies; Section 26)         (SEC-001, SEC-005, SEC-006, OPS-001..005)
            │                                        │                                    │                                    │
            └─────────────────┬──────────────────────┴─────────────────┬──────────────────┴──────────────────┬─────────────────┘
                              ▼                                        ▼                                     ▼
                         Page templates  ───────────────►  Pages with real content  ──────────────►  Integration and hardening
```

| Can run at the same time | Why it is independent |
|---|---|
| Design tokens/primitives (A) and content schemas (B) | Different directories; connected only through types |
| Enquiry table, RLS and intake path (B) and page templates (A) | Forms are integrated later |
| Vendor decisions (rate-limit store, email, hosting) and all development | Decisions take calendar time |
| Content writing/collection (C) and everything else | Content has the longest lead time; templates use labelled fixtures |
| Artifact pipeline (OPS-006) and website pages | Pipeline needs only the release schema |
| Documentation authoring and docs shell | Authors write MDX against the agreed frontmatter |
| Legal review of Privacy/Terms and form implementation | Review needs actual data practices, which are known from the FORM tickets |

Avoided sequential dependencies: security configuration, CI gates and content preparation do not wait for page completion; case studies and PA/AI/IDE pages do not wait for the OS page.

---

## 26. Content Requirements

All content is supplied or approved by HENU. Nothing is invented. "Status" is the current state of delivery.

| # | Content item | Owner (role) | Dependency | Required before V1? | Placeholder acceptable? | Status |
|---|---|---|---|---|---|---|
| 1 | Brand architecture (HENU vs HENU OS), approved name usage, taglines and roles | Brand owner / leadership | OQ-12 | **Yes** | No — blocks navigation naming | Awaiting HENU |
| 2 | Official logos, wordmark, brand assets, palette/typeface approval | Brand owner | DS §41 items 1–2 | **Yes** | Temporary wordmark text on staging only | Awaiting HENU |
| 3 | Product list, status labels and descriptions (OS, PA, AI, IDE) | Product owner | OQ-03 | **Yes** | No for published pages; omit unconfirmed products | Awaiting HENU |
| 4 | Confirmed ecosystem relationships (what depends on what) | Product / engineering | OQ-03 | **Yes** if the map is shown | No — map hides unconfirmed edges | Awaiting HENU |
| 5 | HENU OS system requirements, supported architectures | Engineering | Release readiness | **Yes** (OS page, Downloads) | No; module hidden if absent | Awaiting HENU |
| 6 | Current release information: version, date, channel, notes | Release owner | OQ-01, OQ-18 | Yes if public release; else status copy | No | Awaiting HENU |
| 7 | Download artifacts and SHA-256 checksums | Release owner | OPS-006 | Yes if public release | No | Awaiting HENU |
| 8 | Real screenshots, recordings, demos (light/dark variants if needed) | Product owner | DS §41 item 6 | Preferred; pages omit modules without them | Illustration allowed **only** if labelled as such | Awaiting HENU |
| 9 | Installation, verification, troubleshooting documentation | Engineering | DOC-005 | **Yes** if a public release exists | No | Awaiting HENU |
| 10 | Service definitions (problem, solution, deliverables, ideal customer, process, proof, CTA) | Business / delivery lead | OQ-05 | **Yes** for services listed | No | Awaiting HENU |
| 11 | Decision on listing Legal Service, Funding Solution, Graphic Design, Digital Marketing & Ads | Business owner | OQ-05 | **Yes** (decision) | n/a | Awaiting HENU |
| 12 | HENU's real delivery process | Delivery lead | OQ-20 | No; process section omitted if absent | No | Awaiting HENU |
| 13 | Case studies with client permissions and evidence | Business owner | OQ-19 | No; Work area omitted if none | No | Awaiting HENU |
| 14 | Verified metrics with source, owner, as-of date | Content owner | PRD §19.4 | No; proof strip omitted if none | No | Awaiting HENU |
| 15 | Technology page facts (capabilities, stack actually used, engineering practice) | Engineering | OQ-21 | **Yes** | No | Awaiting HENU |
| 16 | About content: company statement, verified timeline, team/expertise, location | Leadership | — | **Yes** (statement); others optional | No | Awaiting HENU |
| 17 | Contact details: enquiry recipient, alternative contact email, media contact | Operations owner | FORM-008 | **Yes** | No | Awaiting HENU |
| 18 | Support model and any response-time commitment | Operations owner | OQ-11 | Decision yes; commitments optional | n/a | Awaiting HENU |
| 19 | Legal entity name, address, copyright line | Leadership | OQ-10 | **Yes** | No | Awaiting HENU |
| 20 | Privacy Policy and Terms (legally reviewed) | Legal reviewer | OQ-10 | **Yes** before forms go live | Draft on staging only | Awaiting HENU |
| 21 | Social/community/repository links; open-source status | Leadership / engineering | OQ-21 | No; links omitted if unconfirmed | No | Awaiting HENU |
| 22 | FAQ real questions and answers | Product / support | — | Compact set yes | No | Awaiting HENU |
| 23 | OG/share images for key pages | Brand / design | SEO-001 | Preferred | Generated fallback allowed | Awaiting HENU |
| 24 | Security disclosure contact and policy | Security owner | SEC-010 | Yes if public OS release | No | Awaiting HENU |

Labelled fixtures allow all templates to be built before real content arrives; fixtures are blocked from production by CORE-004.

---

## 27. Analytics and Observability

### 27.1 Principle

Minimum useful measurement, privacy-respecting, no assumption about a provider. Provider and approach: `[REQUIRES CONFIRMATION: OQ-09]`.

| Area | Need | Source | Phase |
|---|---|---|---|
| Page performance (Core Web Vitals) | Field data on key templates | Platform/real-user monitoring `[REQUIRES CONFIRMATION]` | V1 |
| Errors | Server and client errors with PII scrubbing | Error tracking (OPS-005) | V1 |
| Uptime | Home, health, download origin | Uptime monitor (OPS-005) | V1 |
| Contact submissions | Count by type and success/failure | Application events without content; or database counts | V1 |
| Download clicks | Intent signal | Only if privacy review allows an outbound-click event | V1 (conditional) |
| Download completion | Counts by version | CDN/storage logs | V1.1 |
| Release selection | Which version is viewed | Page views | V1.1 |
| Documentation usage | Getting Started progression | Page views | V1 |
| Search usage | — | — | Future (no search) |
| Conversion events | Project enquiry rate | Counts of enquiry submissions | V1 |

### 27.2 Rules

- No event payload contains name, email, message text or IP address.
- No unconsented third-party scripts; the privacy policy lists exactly what runs.
- A named owner reviews measurements and sets the "to be established" targets in PRD §27 after launch (30/60/90-day review).
- Alerts have a named owner (SEC §28).

---

## 28. Deployment and Production Checklist

### Application
- [ ] Production build succeeds from a clean checkout
- [ ] All environment variables set and validated; no production values in other environments
- [ ] No fixture content in the production build
- [ ] Error pages verified (404, 500) and error handling shows no internals
- [ ] Rollback rehearsed and documented

### Security
- [ ] HTTPS only; HTTP redirects; HSTS staged per decision
- [ ] Security headers verified on public pages, admin (if shipped) and download origin
- [ ] CSP enforced (or Report-Only reviewed with violation handling)
- [ ] Authorisation tests pass (admin, if shipped)
- [ ] Rate limits verified across instances; fail behaviour confirmed
- [ ] CORS restrictive
- [ ] Dependency scan clean or waived with owner
- [ ] Secrets inventory complete; no secrets in repository history; rotation rehearsed
- [ ] MFA verified on every platform account; DNS/registrar locked
- [ ] Supabase configuration review signed

### Performance
- [ ] Images and fonts optimised; no large files in repository or `public/`
- [ ] Caching and CDN rules verified
- [ ] Lab results recorded for Home, HENU OS, Downloads, product page, docs page
- [ ] Core Web Vitals review plan and field monitoring active

### SEO
- [ ] Metadata unique and complete
- [ ] Sitemap correct; robots allow production only
- [ ] Canonical URLs verified; staging noindex
- [ ] Structured data validates

### Accessibility
- [ ] Automated checks clean on key templates
- [ ] Keyboard walkthrough complete
- [ ] Contrast verified in both themes
- [ ] Focus and forms verified
- [ ] Screen-reader review complete

### Data
- [ ] Migrations applied in order to production
- [ ] Backups configured and a restore tested
- [ ] Storage and artifact origin configured (if public release)
- [ ] Release artifacts uploaded, immutable, checksums verified

### Monitoring
- [ ] Error tracking receiving events
- [ ] Uptime checks and alerts tested with the named owner
- [ ] Important events (enquiry failures, email failures, limiter store failure) alert

---

## 29. Definition of Done

A feature is not done because it works locally. A ticket is done when **every applicable** item is true; items genuinely irrelevant to the ticket are marked "n/a" with a reason in the pull request.

| # | Criterion |
|---|---|
| 1 | All Requirements and Acceptance Criteria in the ticket are met and demonstrated |
| 2 | Responsive: works from 320 px to large desktop; no horizontal scrolling except contained code/table regions |
| 3 | Accessibility: keyboard, focus, labels, contrast, reduced motion; automated check passes; manual check for new interaction patterns |
| 4 | Loading, empty, error and success states implemented (Section 20) |
| 5 | Security: server-side validation, authorisation where relevant, no secrets or personal data in logs, rendering of user input is escaped |
| 6 | Tests written at the appropriate layer and passing in CI (unit, component, integration, E2E as relevant) |
| 7 | SEO: metadata, canonical and structured data where the page is indexable |
| 8 | Performance: within budget; no unjustified client JavaScript or third-party script |
| 9 | Content: all text, metrics and claims have an owner; no unsupported superlatives; status labels from data |
| 10 | Code quality: lint, type check and import-boundary rules pass; no dead code or speculative components |
| 11 | Code review approved by someone other than the author; CODEOWNERS review where required |
| 12 | Documentation updated: README, ADR if an architectural decision changed, runbook if operations changed |
| 13 | Verified on the preview/staging environment; production verification after release for production-affecting tickets |

---

## 30. V1 Release Checklist

### Product
- [ ] OQ-01, OQ-03, OQ-05, OQ-12 answered and reflected in content
- [ ] Every published page has a stated purpose and one primary action
- [ ] All statuses and claims signed off by owners
### Design
- [ ] Brand assets approved and applied; both themes reviewed
- [ ] No illustration is passed off as product footage (evidence labels verified)
### Frontend
- [ ] All V1 routes render; navigation shows only enabled areas
- [ ] No placeholder, broken link or "lorem" text
### Backend
- [ ] Enquiry action persists, notifies and handles failures
- [ ] Health endpoint live
### Database
- [ ] Migrations applied; RLS verified; types generated
- [ ] Backup and restore tested
### Security
- [ ] Section 28 security list complete; SEC-009 results recorded; no open high-severity findings
### SEO
- [ ] Section 28 SEO list complete
### Accessibility
- [ ] A11Y-001/002 complete; blocking findings fixed
### Performance
- [ ] Budgets met on key templates; field monitoring active
### Content
- [ ] Section 26 required items delivered and reviewed
### Downloads
- [ ] If public release: artifacts uploaded, checksums match, download works from clean machines, verify guide tested, withdrawal rehearsed
- [ ] If no public release: status panel correct everywhere; no download controls exist
### Documentation
- [ ] Installation, verification, troubleshooting reviewed by someone who followed them
### Forms
- [ ] Each form tested end to end in production-like environment; spam controls active; owner receiving notifications
### Admin
- [ ] V1: operators and dashboard access list reviewed with MFA; or V1.1 admin plan confirmed
### Testing
- [ ] E2E journeys pass on the release candidate; cross-browser pass recorded
### Deployment
- [ ] Production promotion approved; rollback rehearsed; DNS and certificates verified
### Monitoring
- [ ] Alerts tested; owner on point for launch week
### Legal
- [ ] Privacy and Terms approved by legal reviewer; processor list matches policy; consent text matches forms; footer entity details correct

---

## 31. Risk Register

| Risk | Probability | Impact | Mitigation | Owner | Phase |
|---|---|---|---|---|---|
| HENU content (descriptions, requirements, screenshots) not supplied or not verified | High | High | Content gates in Section 26; labelled fixtures; pages omit unverified modules; weekly content review | Product owner | 0–7 |
| Unverified or unsupported claims published | Medium | High | Claims checklist in PR template; metric schema requires source/owner; content reviewer | Content owner | 3–7 |
| Public release readiness unknown, delaying download architecture | Medium | High | Build both states from day one; OPS-006 and DOWN-005 start only on OQ-01 yes; decision date set early | Release owner | 0–3 |
| Oversized downloads cause cost or delivery problems | Medium | Medium | Separate CDN origin; no proxying; egress alert; direct links | Engineering lead | 3 |
| Missing or mismatched release artifacts/checksums | Low | High | Pipeline verification, build-time validation, withdrawal procedure, integrity monitor | Release owner | 3, 8 |
| Poor mobile performance | Medium | High | Static-first, Server Components, budgets in CI, real-device checks | Frontend lead | 1–7 |
| Scope creep (CMS, dashboards, search, chatbot, portals) | High | High | Section 32 list; any addition needs a recorded requirement and owner; change control by product owner | Product owner | All |
| Admin becomes a CMS | Medium | Medium | Section 12 module list is closed; additions require ADR | Engineering lead | 8 |
| Rate limiting ineffective on serverless | Medium | High | SEC-004 verifies across instances; no launch without proof | Security owner | 0–6 |
| Enquiries unanswered or lost | Medium | High | Named owner/backup, notification failure alert, runbook, tabletop test | Operations owner | 6–7 |
| Security misconfiguration (RLS, headers, credentials) | Medium | High | Review checklists, automated tests, SEC-009, MFA | Security owner | 6–7 |
| Legal review delays blocking forms | Medium | High | Start in Phase 0 with actual data practices; forms stay disabled in production until approval | Leadership / legal | 0–7 |
| Poor accessibility discovered late | Low–Medium | Medium | CI checks from Phase 1; manual audit scheduled before freeze | Frontend lead | 1–7 |
| Excessive animation harms performance/accessibility | Low | Medium | CSS-first, motion rules, reduced motion tests | Design lead | 1–7 |
| Third-party dependency failure (email, bot challenge, analytics, CDN) | Medium | Medium | Forms store first and notify second; challenge optional by default; analytics non-blocking; static pages independent | Engineering lead | 6–7 |
| Content inconsistency between pages (versions, statuses) | Medium | Medium | Single sources of truth for releases and status; repo-wide literal check | Engineering lead | 2–3 |
| Brand confusion HENU vs HENU OS | Medium | Medium | Resolve OQ-12 before navigation build | Brand owner | 0–1 |
| Dependency vulnerabilities | Medium | Medium | SEC-006 scanning, update process | Engineering lead | All |

---

## 32. DO NOT BUILD IN V1 UNLESS REQUIRED

| Do not build | Reason | What to do instead |
|---|---|---|
| Microservices or a standalone Node.js API | One site consumer; no queue or second consumer | Next.js server layer; extraction triggers in TA §3.3 |
| Custom CMS or headless CMS | Git content is sufficient; no confirmed non-developer publishing need | MDX/structured files; revisit with OQ-22 |
| Advanced RBAC, permission matrix, multiple admin roles | Single admin role suffices | Single `admin` role; Future |
| Admin dashboards, analytics dashboards, personalised dashboards | No requirement | None |
| Admin modules for products, services, projects, blog, docs, media | Static content | Pull requests |
| File upload features | Not required; SEC forbids in V1 | None |
| Public accounts, sign-up, client portal, community portal, developer API portal | No source requires them | Future |
| Mobile applications | Out of scope of this website | None |
| Real-time systems (WebSockets, live chat) | No live feature | None |
| AI chatbot or website assistant "for decoration" | Future only if it adds genuine value | None |
| Interactive HENU OS preview, 3D, configurator, product telemetry | Future; performance and privacy cost | Static, labelled screenshots |
| Heavy animation libraries and decorative motion | Performance and accessibility | CSS-first motion |
| Documentation search infrastructure; versioned docs platform | Small content set | Browse navigation; revisit when content grows |
| Multilingual/i18n framework or extra script fonts | Not confirmed | Logical CSS only; revisit OQ-13 |
| Custom analytics/telemetry platform; elaborate event taxonomies | Privacy and cost | Minimal off-the-shelf measurement |
| CRM or marketing-automation integration | Not required | Email notification and manual follow-up |
| Download proxying through the application; download gating forms | Cost, trust | Direct CDN links, no email wall |
| Pages for every software item or service | PRD forbids padding | Pages only for confirmed, evidenced items |
| Thin "coming soon" product pages | SEO and trust cost | Status chips on hubs; publish when real |
| Infrastructure as code, Kubernetes, message queues, monorepo tooling | Disproportionate | Managed services, single repo |
| Third-party scripts without measured justification | Performance and privacy | Case-by-case waiver in PR |

---

## 33. Implementation Order

```text
01. Project foundation: repository, CI, environments, hosting (OPS-001..004)
02. Start long-lead items in parallel: legal review kickoff, vendor decisions (OQ-07, OQ-09, OQ-17), content collection, enquiry database (FORM-001), platform security (SEC-001, SEC-005, SEC-006)
03. Content layer, schemas, fixtures (CORE-004), site config and status model (CORE-005)
04. Design tokens and theme engine (CORE-001)
05. UI primitives, patterns, layout (CORE-002, CORE-003)
06. Navigation, footer, error pages, media pipeline (NAV-*, CORE-006, CORE-007)
07. Base SEO, accessibility checks, performance budgets in CI (SEO-001/002, A11Y-001, PERF-001)
08. Release data model and repository (DOWN-001)
09. Products hub, product template (PROD-001, PROD-002, OS-002)
10. HENU OS page and download/status states (OS-001, DOWN-002..004); artifact pipeline and origin if public release (OPS-006, DOWN-005)
11. Homepage (HOME-001, HOME-002)
12. Services (SERV-001..003), Technology, About, FAQ (PAGE-001..003)
13. Documentation (DOC-001..005)
14. Enquiry forms and notifications (FORM-002..008, SEC-004)
15. Case studies and PA/AI/IDE pages if content cleared (PROJ-001, PROD-003)
16. Legal pages and privacy/retention (PAGE-004, SEC-008)
17. Security hardening: headers/CSP enforcement, Supabase review, tests (SEC-002, SEC-003, SEC-007, SEC-009)
18. Performance and accessibility audits, structured data (PERF-002, A11Y-002, SEO-003)
19. Integration, E2E, cross-browser testing (TEST-001..004)
20. Backups, monitoring, rehearsals, measurement (OPS-005, OPS-007, OPS-008)
21. Production deployment and launch checklist (Section 30)
22. V1.1: admin and audit log, release pages, integrity monitoring, blog, support intake (Phase 8)
```

---

## 34. Final Feature Master Table

Status of every item: `Not Started`. Priority and version reflect the ticket definitions above. "(c)" means conditional on the cited open question.

| ID | Feature | Area | Priority | Version | Dependencies | Acceptance Criteria (summary) | Status |
|---|---|---|---|---|---|---|---|
| OPS-001 | Repository, tooling, engineering docs | Platform | P0 | V1 | — | New developer runs site from README; boundary violations fail lint; main protected | Not Started |
| OPS-002 | Environments and config validation | Platform | P0 | V1 | OPS-001 | Build fails on bad config; no server secrets in client; staging noindex | Not Started |
| OPS-003 | CI and pull-request checks | Platform | P0 | V1 | OPS-001 | Required checks block merge; invalid content/secrets fail; preview per PR | Not Started |
| OPS-004 | Hosting, deployment, rollback | Platform | P0 | V1 | OPS-002, OPS-003 | Protected promotion; rollback rehearsed; HTTPS and host redirects | Not Started |
| OPS-005 | Monitoring, error tracking, health | Platform | P1 | V1 | OPS-004 | Forced error and downtime alert the owner; no PII in events | Not Started |
| OPS-006 | Release artifact pipeline | Platform | P0 | V1 (c: OQ-01) | OQ-01, OQ-06, DOWN-001 | Immutable paths; runtime cannot write; mismatch aborts publish | Not Started |
| OPS-007 | Backups and restore test | Platform | P1 | V1 | FORM-001 | Restore reproduces enquiries; access limited | Not Started |
| OPS-008 | Privacy-preserving measurement baseline | Platform | P2 | V1 / V1.1 | OQ-09, PAGE-004 | Policy matches measurement; no PII in events; site works without it | Not Started |
| CORE-001 | Design tokens and theme engine | Frontend | P0 | V1 | OPS-001 | No flash; persistence; AA contrast; static rendering preserved | Not Started |
| CORE-002 | UI primitives | Frontend | P0 | V1 | CORE-001 | All states; keyboard operable; 44 px/24 px targets | Not Started |
| CORE-003 | Patterns, layout, sections | Frontend | P0 | V1 | CORE-002 | Metric requires source/owner; evidence labels as text; no unused components | Not Started |
| CORE-004 | Content layer and schema validation | Platform | P0 | V1 | OPS-001 | Invalid content fails build; fixtures blocked in production; status change propagates | Not Started |
| CORE-005 | Site config and status-label model | Platform | P0 | V1 | CORE-004, CORE-002 | CTA derives from status/release data; chips show text; no placeholder links | Not Started |
| CORE-006 | Error, not-found, loading states | Frontend | P1 | V1 | CORE-003 | Real 404; error page without internals; failing module degrades | Not Started |
| CORE-007 | Media and font pipeline | Frontend | P1 | V1 | CORE-001 | Alt text enforced; hero not lazy; no large files in repo; no layout shift | Not Started |
| NAV-001 | Header and mobile navigation | Frontend | P0 | V1 | CORE-003, CORE-005 | Keyboard complete; focus trap and return; skip link; disabled areas hidden | Not Started |
| NAV-002 | Footer | Frontend | P1 | V1 | CORE-005 | Consistent; no placeholder or broken links | Not Started |
| NAV-003 | Breadcrumbs and product sub-nav | Frontend | P1 | V1 | CORE-003 | Lateral product links; breadcrumbs match URL; `aria-current` | Not Started |
| HOME-001 | Homepage opening | Frontend | P0 | V1 | CORE-003, CORE-005, NAV-001 | Identity, primary action, developer and client routes visible at 390 and 1440 px | Not Started |
| HOME-002 | Homepage body sections | Frontend | P0 | V1 | HOME-001, PROD-001, OS-001, SERV-001 | No unbacked proof; distinct intent CTAs; no literal version | Not Started |
| PROD-001 | Products hub and Ecosystem Map | Frontend | P0 | V1 | CORE-004, CORE-005, NAV-001 | Relationships only if confirmed; text alternative; new product adds a row | Not Started |
| PROD-002 | Product page template | Frontend | P0 | V1 | PROD-001, NAV-003, CORE-007 | Coherent with minimal content; evidence labels; CTA per status | Not Started |
| PROD-003 | PA/AI/IDE pages | Content | P1 | V1 (c: OQ-03) | PROD-002, content | Every claim has an owner; no unsubstantiated superlatives | Not Started |
| OS-001 | HENU OS flagship page | Frontend | P0 | V1 | PROD-002, DOWN-001, OS-002 | CTA reflects real release state; links resolve; truthful media labels | Not Started |
| OS-002 | System requirements and capability modules | Content | P1 | V1 | CORE-003, OQ-18 | One source for requirements; mobile definition list | Not Started |
| SERV-001 | Services model and hub | Frontend | P0 | V1 | CORE-004, CORE-003 | Schema enforces definition fields; Legal/Funding absent unless enabled | Not Started |
| SERV-002 | Service detail template and pages | Frontend | P1 | V1 (c: OQ-05) / V1.1 | SERV-001, FORM-006 | Not a technology list; enquiry preselects service | Not Started |
| SERV-003 | Process component | Frontend | P2 | V1 (c: OQ-20) | SERV-002 | Renders only with real process data | Not Started |
| PROJ-001 | Case-study index and template | Frontend | P2 | V1 (c: OQ-19) / V1.1 | CORE-004, CORE-003 | Permission-gated; works with 0/1/N; area hidden at 0 | Not Started |
| PAGE-001 | Technology page | Content | P1 | V1 | CORE-003, OQ-21 | No unsourced benchmarks; works without optional modules | Not Started |
| PAGE-002 | About page | Content | P1 | V1 | CORE-003 | Only verified facts rendered | Not Started |
| PAGE-003 | FAQ | Content | P2 | V1 | CORE-002 | Keyboard accessible; structured data matches visible content | Not Started |
| PAGE-004 | Privacy and Terms | Content | P0 | V1 | FORM-001, OPS-008, OQ-10 | Legally approved; processors match policy; consent wording matches | Not Started |
| DOWN-001 | Release data model, repository, latest derivation | Data | P0 | V1 | CORE-004, OQ-18 | No literal versions/URLs; single source updates all surfaces; withdrawal and drafts handled | Not Started |
| DOWN-002 | Downloads hub and HENU OS download page | Frontend | P0 | V1 | DOWN-001, CORE-003, OS-002 | Current stable visible without scrolling; full release fields; direct origin link; data-unavailable fallback | Not Started |
| DOWN-003 | Checksum, verification guide, recovery | Frontend | P0 | V1 | DOWN-002, DOC-005 | Approved wording; copy announced; guide tested on a real artifact | Not Started |
| DOWN-004 | No-release status and waitlist state | Frontend | P0 | V1 (waitlist c: OQ-02) | DOWN-001, FORM-007 | No download control when no release; consistent across surfaces | Not Started |
| DOWN-005 | Download origin configuration and hardening | Platform | P0 | V1 (c: OQ-01) | OPS-006, SEC-002 | No cookies; attachment + nosniff; no listing; overwrite rejected; egress alert | Not Started |
| REL-001 | Release history and detail pages | Frontend | P2 | V1.1 (V1 if history) | DOWN-001 | Same data as Downloads; withdrawn banner; text-labelled categories | Not Started |
| REL-002 | Release integrity monitoring | Platform | P2 | V1.1 | OPS-006 | Altered artifact triggers alert; read-only access | Not Started |
| REL-003 | Database-managed releases | Data | P2 | V1.1 (c) | DOWN-001, ADMIN-001, ADMIN-004 | No component changes; revalidation on publish; DB constraints enforce | Not Started |
| DOC-001 | MDX pipeline and allowlist | Platform | P0 | V1 | CORE-004 | Raw HTML and bad links fail build; build-time highlighting | Not Started |
| DOC-002 | Documentation shell and navigation | Frontend | P0 | V1 | DOC-001, NAV-003 | Sidebar from real content; mobile disclosures; prev/next from tree | Not Started |
| DOC-003 | Code blocks, callouts, tabs | Frontend | P1 | V1 | DOC-001, CORE-003 | Focusable scroll; clean copy; callouts distinguishable without colour | Not Started |
| DOC-004 | Version applicability and cross-links | Frontend | P1 | V1 | DOC-002, DOWN-001, PROD-002 | Declared version range; product↔docs links; no literal versions | Not Started |
| DOC-005 | Essential documentation content | Content | P0 | V1 | DOC-002, content | Steps executed by a reviewer; no unverified commands | Not Started |
| BLOG-001 | Insights | Frontend | P2 | V1.1 | CORE-004, DOC-001, OQ-22 | Absent until real content and owner; drafts excluded | Not Started |
| FORM-001 | Enquiry data model and database access | Backend | P0 | V1 | OPS-002, SEC-003 | Public key cannot read; insert-only path; DB constraints | Not Started |
| FORM-002 | Form framework | Frontend | P0 | V1 | FORM-001, CORE-003 | Accessible errors; single creation on double submit; input preserved on failure | Not Started |
| FORM-003 | Contact page, intent selector, forms | Frontend | P0 | V1 | FORM-002 | Technical question shows guidance only; minimal project form; intent preselection | Not Started |
| FORM-004 | Spam protection and rate limiting | Backend | P0 | V1 | FORM-002, SEC-004 | Honeypot silent and hidden; time check; 429 behaviour; works across instances | Not Started |
| FORM-005 | Notification workflow | Backend | P0 | V1 | FORM-001, OQ-17 | Every real enquiry notifies; failures alert; header-injection safe; SPF/DKIM/DMARC pass | Not Started |
| FORM-006 | Service enquiry entry | Frontend | P1 | V1 | SERV-002, FORM-003 | Service preselected and stored; invalid slug ignored | Not Started |
| FORM-007 | Waitlist capture | Frontend/Backend | P1 | V1 (c: OQ-01/02) | FORM-002, DOWN-004 | Email only; deduplicated; hidden when stable release exists | Not Started |
| FORM-008 | Enquiry handling runbook | Operations | P1 | V1 | FORM-005, SEC-001 | Named owner/backup; test enquiry triaged; purge schedule documented | Not Started |
| FORM-009 | Dedicated support intake | Frontend/Backend | P3 | V1.1 | FORM-002, OQ-11 | Exists only after support model confirmed | Not Started |
| ADMIN-001 | Admin auth and guard | Backend | P1 | V1.1 (V1 if OQ-04) | FORM-001, SEC-004 | Anonymous and non-admin denied incl. direct calls; MFA; non-cacheable; noindex | Not Started |
| ADMIN-002 | Enquiries module | Frontend/Backend | P1 | V1.1 | ADMIN-001 | Plain-text rendering; audited status changes; all states | Not Started |
| ADMIN-003 | Audit log | Backend | P1 | V1.1 | ADMIN-001 | One entry per mutation; append-only | Not Started |
| ADMIN-004 | Releases module | Frontend/Backend | P2 | V1.1 (c) | REL-003, ADMIN-001, ADMIN-003 | Validated publish; step-up auth; audited withdraw | Not Started |
| SEO-001 | Metadata framework | Frontend | P0 | V1 | CORE-004 | Unique metadata; self-canonical; useful share previews | Not Started |
| SEO-002 | Sitemap, robots, indexing policy | Platform | P0 | V1 | SEO-001, CORE-004 | Only indexable routes; staging disallowed and noindex | Not Started |
| SEO-003 | Structured data and internal linking | Frontend | P1 | V1 | SEO-001, NAV-003 | Valid and matches visible content; no orphans; disambiguation reviewed | Not Started |
| SEC-001 | Platform and operator account hardening | Security | P0 | V1 | OPS-002 | MFA everywhere; no shared accounts; DNS locked | Not Started |
| SEC-002 | Security headers and CSP | Security | P0 | V1 | CORE-001, OPS-004 | Baseline headers on all origins; theme script runs under CSP | Not Started |
| SEC-003 | Database and Supabase configuration | Security | P0 | V1 | FORM-001 | Review signed; public key reads nothing; no server credentials in client | Not Started |
| SEC-004 | Rate-limiting infrastructure | Security | P0 | V1 | OQ-07 | Counts across instances; spoofed header ignored; outage behaviour per spec | Not Started |
| SEC-005 | Secrets management and scanning | Security | P0 | V1 | OPS-002 | Seeded secret blocked; rotation rehearsed; inventory complete | Not Started |
| SEC-006 | Dependency and supply-chain controls | Security | P1 | V1 | OPS-003 | Vulnerable package fails/raises alert; reasons recorded for new dependencies | Not Started |
| SEC-007 | Safe error handling and logging | Security | P1 | V1 | OPS-005, CORE-006 | No PII/secrets in logs; no internals shown to users | Not Started |
| SEC-008 | Privacy, retention and data handling | Security | P1 | V1 | PAGE-004, FORM-001 | Retention documented, matches policy, enforced; deletion procedure works | Not Started |
| SEC-009 | Pre-launch security testing | Security | P0 | V1 | FORM-004, SEC-002, SEC-003, SEC-004 | All test cases recorded; no open high-severity finding | Not Started |
| SEC-010 | Security disclosure page and `security.txt` | Security | P1 | V1.1 (V1 if OQ-01) | OQ-01, SEC-009 | Monitored contact; every statement owned | Not Started |
| PERF-001 | Performance budgets and automated checks | Performance | P0 | V1 | OPS-003, HOME-001 | Budgets enforced in CI; mid-range-mobile results recorded | Not Started |
| PERF-002 | Caching, revalidation, CDN behaviour | Performance | P1 | V1 | OPS-004, DOWN-001 | Deploys visible without manual steps; cache headers per policy; range requests on origin | Not Started |
| A11Y-001 | Accessibility foundation, automated checks, motion | Frontend | P0 | V1 | CORE-002 | Zero serious/critical automated violations; reduced motion honoured | Not Started |
| A11Y-002 | Manual accessibility audit | QA | P1 | V1 | A11Y-001, V1 pages | Key flows completable by keyboard and screen reader; blockers fixed | Not Started |
| TEST-001 | Unit and content-validation suite | QA | P0 | V1 | OPS-003, CORE-004 | Risk logic covered including failure cases | Not Started |
| TEST-002 | Integration tests | QA | P0 | V1 | FORM-001, FORM-005, DOWN-001 | Broken RLS policy fails tests; synthetic data only | Not Started |
| TEST-003 | End-to-end critical journeys | QA | P0 | V1 | V1 page tickets | All Section 21 journeys pass on preview before promotion | Not Started |
| TEST-004 | Cross-browser and device pass | QA | P1 | V1 | TEST-003 | No blocking defects on matrix; real-device checks | Not Started |

Summary by version: V1 core tickets cover foundation, shell, home, products, OS, downloads, services, docs, enquiries and hardening; V1 (conditional) tickets are OPS-006, DOWN-005, PROD-003, SERV-002/003, PROJ-001, FORM-007; V1.1 tickets are REL-001..003, BLOG-001, FORM-009, ADMIN-001..004, SEC-010 (unless the public-release switch applies).

---

## 35. Contradiction and Open Question Register

Only genuine unresolved items. Resolved items are in Section 1.2.

| ID | Question / Conflict | Related Document | Why It Matters | Recommended Resolution |
|---|---|---|---|---|
| OQ-01 | Is a public HENU OS release available at launch (download vs honest status)? | PRD #8, TA 35.4 #3, SEC #10 | Determines the artifact pipeline, origin, security page timing and the OS page CTA | Decide early; build both states regardless; if "yes", move OPS-006, DOWN-005, REL-002 and SEC-010 into V1 |
| OQ-02 | Does HENU want a waitlist (email-only capture) when no release exists, and how will signups be notified later? | DS §18, TA §7 | Needs a schema amendment and a privacy notice; storing emails with no follow-up plan is poor practice | Recommend waitlist only if an owner commits to using it; otherwise "contact" or "follow" links |
| OQ-03 | Which products are launch-ready, what are their status labels and confirmed relationships? | PRD #3, DS §41 | Determines product pages, map edges and claims | Product owner confirms before Phase 3; unconfirmed products are omitted |
| OQ-04 | Is a custom admin required at launch, and who reviews enquiries in V1 via which MFA-protected access? | PRD #11, TA 12.3, SEC #1 | Adds a phase of work and V1 security controls | Recommend V1.1; V1 uses MFA-protected dashboard + email, named owner |
| OQ-05 | Which services are listed publicly (especially Legal Service, Funding Solution, Graphic Design, Digital Marketing & Ads)? | PRD #4 | Brand coherence and regulatory exposure | Lead with software and AI services; keep Brand & Growth supporting; exclude Legal and Funding unless a deliberate decision is made |
| OQ-06 | Artifact storage/CDN provider and release approval model (single vs two-person) | TA 35.4 #2, SEC #9, #12 | Immutability, cost abuse controls, separation of duties | Choose after verifying provider capabilities (object versioning, retention, logging); single reviewer + CODEOWNERS acceptable for V1 |
| OQ-07 | Rate-limit mechanism and numeric limits | SEC #6 | Without a shared store the limiter is false assurance | Use platform feature or managed key-value store; set provisional limits and tune after launch |
| OQ-08 | Documentation hosted on the main site (route) or separate application/domain | PRD #9, TA 35.4 #8, DS #24 | URLs, SEO, tooling | `/documentation` on main site for V1; keep paths portable |
| OQ-09 | Analytics provider and consent approach | PRD §27, SEC #16 | Success metrics need measurement; privacy and script exposure | Cookieless, minimal; decide before staging |
| OQ-10 | Legal position: Privacy/Terms content, consent wording, theme-preference disclosure, processor agreements, legal entity details | PRD #18, SEC #15, DS #14 | Forms cannot go live without it | Start legal review in Phase 0; keep forms disabled in production until approved |
| OQ-11 | Support model and any response-time commitment | PRD #14 | Contact copy, FORM-009, docs | No commitments in copy unless operations can meet them |
| OQ-12 | Brand architecture (HENU vs HENU OS), navigation label ("Work"/"Projects"), tagline roles | PRD #2, #17 | Header, URLs, SEO | Decide before Phase 1 navigation work; routes stay stable |
| OQ-13 | Multilingual need at launch (font subsets, layout) | PRD #16, TA #15, DS #17 | DS proposes a script companion font; TA says single locale | Single locale; no extra font subsets in V1 unless confirmed |
| OQ-14 | Team and tooling: Git host, CI, package manager, hosting provider, error-tracking vendor, headless and icon libraries | TA #1, #10, #11 | Setup of Phase 0 | Default to TA recommendations (managed Next.js host); confirm in week one |
| OQ-15 | Supabase plan, region, backup/PITR retention, data-residency constraints | TA #12–13, SEC #17 | Recovery and compliance | Pick plan with backups suitable for enquiry data; confirm residency with legal |
| OQ-16 | Video hosting approach and media plan | TA #17 | Cost and performance | Poster + facade; host choice before first video is published |
| OQ-17 | Email provider and sending domain, auto-reply policy, bot-challenge provider | TA #9, SEC #7–8 | Notifications, deliverability, accessibility | Pick an accessible, privacy-conscious challenge used only on risk; no auto-reply until policy is set |
| OQ-18 | HENU OS versioning scheme, channels (stable/beta/nightly), cadence, architectures, signing | PRD §17, TA #4–5, SEC #11 | Release data model, "latest" rules, DB trigger | Define scheme before DOWN-001; signing is V1.1/Future and never claimed until real |
| OQ-19 | Which case studies are permitted for public use | PRD #5 | Work area existence | Omit Work if none |
| OQ-20 | HENU's real delivery process | PRD #12 | Process section | Omit if undefined; do not adopt a default |
| OQ-21 | Open-source status and public repositories | PRD #13, TA #18 | GitHub CTAs, FAQ, Technology | No repository links unless confirmed |
| OQ-22 | Content ownership: who publishes, how often, whether non-developers must publish without engineering | PRD #10, TA #7, SEC #13 | CMS trigger; blog launch | Git-based workflow in V1; revisit CMS only when this answer demands it |
| OQ-23 | Target accessibility level, browser support matrix and performance budgets | PRD #15, TA #16, DS #22 | Quality gates | WCAG 2.2 AA; matrix in Section 22; budgets from baseline |

---

## 36. Final Recommendation

### Recommended V1 scope

Launch a focused, credible site: Home, Products hub with ecosystem map, HENU OS flagship page, Downloads (a real verified download if a public release exists, otherwise an honest status page), Services hub and the validated core engineering/AI service pages, Technology, About, Documentation entry with essentials (Getting Started, Installation, Verify your download, Troubleshooting), Contact with project, general and partnership forms (plus waitlist if chosen), FAQ, Privacy, Terms. Underneath: validated content layer, release data as the single source of truth, hardened enquiry intake, SEO/accessibility/performance baselines, CI/CD, monitoring and backups. Add PA, AI and IDE pages and case studies **only if** their content gates are cleared. No admin UI, CMS or API.

### Recommended V1.1 scope

Minimal admin (enquiries, audit log), release history and detail pages, release integrity monitoring, security disclosure page (earlier if there is a public release), blog/insights (only with an owner and real content), supporting services pages, remaining product pages, dedicated support intake, basic download measurement from CDN logs, documentation expansion, database-managed releases if release cadence justifies them, focused penetration test, release signing if HENU commits to key custody.

### Future scope

Documentation search and versioning, standalone API and public releases endpoint (when a consumer exists), CMS, RBAC, client/community/developer portals, product telemetry, multilingual site, interactive OS preview, AI website assistant, product configurator, personalisation, mirrors and reproducible builds.

### Critical decisions before development

These genuinely block implementation (decide in the first week or before the named phase):

1. OQ-14 — Hosting, Git/CI and core tooling (blocks Phase 0).
2. OQ-12 — Brand architecture and navigation naming (blocks Phase 1 navigation).
3. OQ-01 — Public HENU OS release at launch (blocks release/artifact scheduling; both UI states are built either way).
4. OQ-03 — Launch-ready product list and statuses (blocks Phase 3 content).
5. OQ-18 — Versioning scheme and channels (blocks DOWN-001 schema).
6. OQ-07 and OQ-17 — Rate-limit mechanism, email provider/domain, bot challenge (block FORM-004/005).
7. OQ-10 — Legal review path and timeline (blocks form go-live).
8. OQ-05 — Services to list publicly (blocks service content).
9. OQ-04 — Admin at launch or V1.1 (affects scope and security timeline).

### Non-critical decisions

Can be made during implementation without blocking: icon and headless-primitive libraries (OQ-14 subset), video hosting (OQ-16), analytics provider details beyond the pre-staging pick (OQ-09), error-tracking and uptime vendors, OG image style, release-notes category taxonomy, case-study count at launch, CODEOWNERS granularity, spam-retention period, numeric performance budgets after baseline (OQ-23), whether FAQ is a page or embedded, documentation sidebar grouping details.

---

*End of document. All items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner before the dependent ticket is finalised. Nothing in this roadmap has been implemented; all statuses are `Not Started`.*

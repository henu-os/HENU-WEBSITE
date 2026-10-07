# HENU Website — Feature Specification, Development Roadmap & Acceptance Criteria

| | |
|---|---|
| **Document** | `05-FEATURE-SPECIFICATION-DEVELOPMENT-ROADMAP.md` |
| **Status** | Draft v1 for engineering and product review |
| **Source documents** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md` · `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md` · `03-SECURITY-ARCHITECTURE.md` · `04-FRONTEND-UI-UX-DESIGN-SYSTEM.md` |
| **Audience** | Engineering lead, developers, QA, product owner, AI coding agents |

**Conventions**

- `[REQUIRES CONFIRMATION]` marks a material uncertainty (content, vendor, plan, legal, readiness, team). Nothing marked so may be built against as if it were settled.
- **Priority:** **P0** = launch-blocking · **P1** = important for launch quality, may slip with explicit approval · **P2** = valuable, not needed for launch.
- **Version:** **V1** (launch) · **V1.1** (follows launch) · **Future** (not planned for V1/V1.1).
- **Size** is a *relative* effort estimate (S/M/L/XL). **No calendar durations are given** because team size and capacity are unknown `[REQUIRES CONFIRMATION]`.
- Source-document references use `[01 §n]`, `[02 §n]`, `[03 §n]`, `[04 §n]`.
- This document contains no implementation code and invents no HENU facts.

---

## 1. Source Document Analysis

### 1.1 What each document contributes

| Doc | Authority for |
|-----|---------------|
| **01 PRD** | Purpose, audiences, positioning, evidence/credibility rules, scope philosophy (V1/V1.1/Future), success metrics, open product decisions |
| **02 Architecture** | Next.js App Router + TypeScript + Tailwind; Supabase (Postgres/Auth); service/repository layering; Server Actions vs Route Handlers; rendering and caching model; storage separation; release data model; deployment; CI/CD; testing layers |
| **03 Security** | Threat model, trust boundaries, authentication (Supabase Auth, mandatory MFA, invite-only), authorization (server-side, deny-by-default), headers/CSP, CSRF, XSS, rate limiting, spam, uploads, RLS, secrets, logging, incident response, V1 mandatory controls, test cases |
| **04 UI/UX & Design System** | **Navigation (six items), light-first theming, visual language, tokens, components, responsive behaviour, admin scope and philosophy, dynamic content model, publish gate, page inventory** |

### 1.2 Dependency map (what must exist before what)

```text
Repo/tooling/env ──► Design tokens ──► UI primitives ──► Layout shell ──► Any public page
        │                                      │
        ├──► Database + RLS baseline ──► Service/repository layer ──► Content model & blocks
        │                                                          │
        │                          Media pipeline ◄────────────────┤
        │                                                          ▼
        ├──► Admin auth (MFA) ──► Admin guard/shell ──► Admin UI patterns ──► Domain modules
        │                                                                  (each paired with its public pages)
        ├──► Revalidation + preview ──► Publish workflow (draft → published → public)
        └──► Rate-limit store + email provider ──► Enquiry pipeline ──► Enquiry management
                                           
Release data model (Git) ──► HENU OS release block ──► Download origin (only if a public release exists)
All of the above ──► SEO / A11Y / PERF / SEC hardening ──► Pre-launch review ──► Launch
```

Key consequence: **because public pages read admin-managed content, the content engine (database, blocks, media, revalidation, preview, publish gate) and the admin shell are foundational, not late-stage.** Public pages cannot be completed against real data without them.

### 1.3 Contradictions identified and how they are resolved

Resolution rule: **where doc 04 (the most recent, confirmed-requirement document) conflicts with docs 01–03, doc 04 governs for navigation, content scope, and admin scope.** Docs 02/03 retain authority for architecture and security controls. Items that are not obvious are carried to §31 as open questions.

| # | Conflict | Resolution | Basis |
|---|----------|-----------|-------|
| **C1** | **Navigation/routes:** 01/02 propose a wider route set (Technology, Downloads, Documentation, Blog, FAQ pages); 04 fixes six primary items | **Six primary items only.** `/technology`, `/downloads`, `/documentation`, `/blog`, `/faq` are **not V1 routes**. Their content is absorbed: technology narrative → About/Products; download/release → HENU OS page; FAQ → FAQ blocks inside product/service/contact; docs/blog → Future | [04 §0, §9] explicit |
| **C2** | **Content storage:** 02 classifies products/services/projects/home/about as *static (Git)* in V1; 04 requires dynamic, Admin-managed content | **Database-backed and admin-managed in V1** for Home, Services, Products, Portfolio, About, Site Settings. **Static** remains for legal pages, navigation structure, design tokens, system pages, and release metadata (see C5) | [04 §0, §22] explicit; consistent with 02's repository-interface design |
| **C3** | **Admin timing:** 02/03 default admin UI to V1.1; 04 and this brief require Admin Web foundation in V1 | **Admin is V1.** All 03 admin controls (MFA, server-side authorization, audit, step-up, strict admin CSP) apply to the application at launch | [04 §0] explicit; brief §3 |
| **C4** | **Uploads:** 03 §20 states no uploads in V1; 04 requires media management | **Admin image upload is V1** with 03 §20 controls mandatory (SEC-006). **Public uploads remain out of scope.** Large artifacts are **not** uploaded via admin | [04 §22.7] |
| **C5** | **Release metadata:** 02 says Git-tracked structured data in V1, DB in V1.1; 04/brief list releases as a future admin module | **V1: Git-tracked, schema-validated release data** feeding a release block on the HENU OS page (only if a public release exists). **Admin Releases module = Future/V1.1** | 02 §9.3; brief §13 |
| **C6** | **Admin module list:** Brief lists *media, users, settings* as future modules; 04 places Media Library and Site Settings in V1 | **Media Library (V1)** — necessary for image-bearing content. **Site Settings (V1, minimal)** — needed for Calendly URL, contact details, SEO defaults. **Users & Roles UI = V1.1**; V1 admin provisioning is an **operator procedure** (invite via auth system + `admin_profiles` allowlist record) | Needed for V1 features; keeps scope bounded. Confirm via Q3 |
| **C7** | **Audit log:** 02 puts audit table at V1.1; 03 §28/§39 require auditing for admin writes | With admin at V1, **audit writes are V1**; **audit viewer UI is V1.1** | Follows C3 |
| **C8** | **Products routes:** brief lists `/products/[slug]` and `/products/henu-os` | `/products/henu-os` is a **dedicated static route** (flagship template) and takes precedence over `/products/[slug]`; `henu-os` is a **reserved slug** in admin. HENU AI/PA/IDE render via `/products/[slug]` with product-specific signature-module variants | Framework routing precedence; 04 §11 |
| **C9** | **Contact intents:** 01 lists many intent paths; 04 reduces to Enquiry + Calendly | **Two paths.** Enquiry form has an "interested in" selector (services, products, **General**, **Partnership**). Dedicated support form deferred | [04 §17] |
| **C10** | **Doc 03 §22.2** leaves the public-enquiry database write path undecided (insert-only role vs confined elevated key) | Implement **Pattern A (dedicated insert-only database role)** as default unless platform constraints prevent it; decision recorded in SEC-005. Carried as Q4 | 03 §22.2 recommendation |
| **C11** | **CSP vs static rendering:** 03 prefers nonce-based CSP; 02 prefers static generation (nonces force dynamic rendering) | **Admin: strict nonce CSP (dynamic anyway). Public: pragmatic CSP, Report-Only first, hash-based for the theme pre-paint script, tightened over time** | 03 §16; 04 §27 |
| **C12** | **Theme default:** 04 requires light default irrespective of OS preference | Light default in CSS; stored preference applied pre-paint only for returning dark users | [04 §3, §27] |
| **C13** | **Admin "everything editable" vs design control** | Admin edits **content within fixed templates and an allow-listed block set**; no page builder, no CSS/HTML editing | [04 §22] |
| **C14** | **Success metrics (01 §27) need measurement; 03 minimises analytics; brief §29 warns against unnecessary analytics** | **V1: field Core Web Vitals via platform + enquiry/conversion counts from the database. Product analytics tooling is V1.1 and decision-gated** | Proportionality; Q17 |

### 1.4 Missing implementation requirements identified (not specified in 01–04)

| # | Gap | Addressed by |
|---|-----|--------------|
| **G1** | Draft **preview** mechanism for unpublished content (private, dynamic) | CORE-009 |
| **G2** | **Redirects when admin changes a slug** (SEO/broken links) | CORE-009, SEO-002 |
| **G3** | **Cache revalidation** strategy tied to publish/unpublish/delete | CORE-009 |
| **G4** | **Structured rich-text editor and renderer** selection and safety | CORE-008, ADMIN-003 |
| **G5** | **Initial content seed/migration** so public pages are buildable before editorial entry | OPS-005 |
| **G6** | **Admin provisioning and recovery procedure** (no Users UI in V1) | ADMIN-009 |
| **G7** | **Notification retry/reconciliation** if email fails after enquiry persistence | CONTACT-003 |
| **G8** | **Rate-limit shared store** (serverless-safe) selection | SEC-004 |
| **G9** | **Media variants/derivatives** pipeline specifics (formats, sizes, focal points) | CORE-010 |
| **G10** | **Error tracking, uptime, alert ownership** | OPS-004, SEC-007 |
| **G11** | **Environment-aware robots/indexing** for staging/preview | SEO-002 |
| **G12** | **Content integrity checks** (broken internal links, orphaned media, unpublished references from published pages) | CORE-008, ADMIN-004 |
| **G13** | **Concurrent editing** behaviour for multiple admins | ADMIN-003 (basic), V1.1 conflict handling |
| **G14** | **Legal pages workflow** (static content requiring legal review) | OPS-005, OPS-006 |
| **G15** | **Calendly failure/unavailability behaviour** | CONTACT-004 |
| **G16** | **Content-block versioning/revision history** | V1.1 (Future note in ADMIN-003) |

---

## 2. Scope Summary

### 2.1 Public website (responsive: desktop, tablet, mobile)

Home · Services (+ detail) · Products (hub, HENU OS, HENU AI, HENU PA, HENU IDE) · Portfolio (+ detail) · About Us · Contact Us. Plus legal and system pages. Light theme default; dark optional.

### 2.2 Admin panel (web application only; **no mobile admin app**)

Authenticated management of the content consumed by the public site: Home, Services, Products, Portfolio, About, Enquiries, Media, Site Settings, with a Dashboard. Visual design remains centrally controlled.

### 2.3 Explicitly outside this scope

Service pricing, payment gateway/checkout, custom calendar, mobile admin app, public user accounts, public uploads, documentation platform, blog, client/developer portals, enterprise RBAC (see §26).

---

## 3. Shared Acceptance Baselines

To avoid repeating identical criteria in every ticket, the following baselines are **defined once** and **referenced by name**. A ticket that cites a baseline is not accepted until that baseline is met for the ticket's scope.

### 3.1 RAB — Responsive Acceptance Baseline (public pages and components)

Verified at **360px, 768px, 1024px and ≥1440px widths** (phone, tablet, laptop, large desktop) and in both orientations where relevant:

1. **No horizontal overflow** of the page body (code/tables scroll in their own containers).
2. **No overlapping** of text, controls or media; no clipped content.
3. **Readable typography:** body ≥ 16px on mobile; line length within the specified measure; headings do not break awkwardly.
4. **Correct content order:** reading and tab order matches visual order at every breakpoint; conversion actions are not buried on mobile.
5. **Appropriate spacing** per design tokens and breakpoint spacing tokens.
6. **Usable controls:** interactive targets ≥ 44×44px recommended (never below 24×24px); no hover-only functionality; gestures have visible alternatives.
7. **Responsive imagery:** correct variants served; reserved aspect ratios; no layout shift.
8. **Responsive forms:** single-column on mobile, labels always visible, correct input types/autocomplete, error messages visible without scrolling confusion.
9. **Usable navigation** at each breakpoint (04 §9).
10. **200% zoom / 320px reflow** without loss of content or function.

### 3.2 AB — Accessibility Baseline

Semantic HTML and landmarks; heading hierarchy; fully keyboard-operable; visible two-tone focus never obscured by sticky UI; accessible names/roles/states; contrast ≥ AA in both themes; decorative graphics hidden from assistive tech; informative images with alt text; reduced-motion honoured; errors programmatically associated; automated accessibility check passes; manual keyboard pass performed.

### 3.3 SB — State Baseline

Each data-driven or interactive feature defines and implements: **loading** (skeleton/pending, no layout shift), **empty** (explanatory, with next action), **error** (safe message, retry/alternative path, no internals), and where applicable **success**, **disabled**, **not-found**, and **offline/failed-media** states. States are not conveyed by colour alone.

### 3.4 PB — Performance Baseline

Server Components by default; client JavaScript only for justified islands; images/media through the optimisation pipeline with declared dimensions; below-the-fold media lazy-loaded; no new third-party scripts without approval; no regression against the agreed budgets (PERF-001) once established.

### 3.5 SEOB — SEO Baseline (public pages)

Unique title and description via the metadata system; canonical URL; Open Graph; correct heading semantics; included in sitemap if indexable; excluded and `noindex` if not.

### 3.6 SECB — Security Baseline (any mutation or privileged read)

Server-side schema validation (type, length, enums, unknown fields rejected); server-side authorization for privileged operations (deny-by-default); origin verification for cookie-authenticated mutations; no secrets in client code; safe errors; security-relevant events logged without secrets/PII; rate limiting where abusable; repository-only database access.

### 3.7 DoD — Definition of Done

See §23. Every ticket is subject to the DoD in addition to the baselines it cites.

---

## 4. Data Model Requirements

### 4.1 Classification

| Entity | Storage | Admin-managed | Notes |
|--------|---------|:-------------:|-------|
| **Product** | **Database** | Yes | Structured fields + blocks; reserved slug `henu-os` |
| **Product relationship** | **Database** | Yes | Ecosystem relationships (e.g., "integrates with"), confirmed only |
| **Service** | **Database** | Yes | Structured blocks incl. mandatory disclaimers for sensitive services |
| **Service category** | **Database** | Yes | Orderable |
| **Portfolio Project** | **Database** | Yes | Draft/publish/archive |
| **Project category / Technology (vocabularies)** | **Database** | Yes | Managed lists |
| **Home Content** | **Database** (singleton) | Yes | Named slots + featured selections |
| **About Content** | **Database** (singleton + ordered chapters/timeline) | Yes | Structured blocks |
| **Site Settings** | **Database** (singleton) | Yes | Contact details, social links, Calendly URL, SEO defaults, header CTA label |
| **Enquiry** | **Database** | Status/notes only | Created by public server path |
| **Media asset** | **Database metadata + object storage** | Yes | Alt text, focal point, variants |
| **Admin profile** | **Database** (linked to auth identity) | Operator-provisioned (V1) | `role` column reserved |
| **Audit log entry** | **Database** (append-only) | No (read-only) | Written in V1; viewer V1.1 |
| **Redirect** | **Database** | System-written | Created automatically on slug change |
| **Release / Artifact** | **Static (Git, schema-validated) in V1** | No (V1) | DB + admin in V1.1/Future (C5) |
| **Legal pages (Privacy, Terms)** | **Static (MDX, legally reviewed)** | No | Change via PR |
| **Navigation structure, tokens, system pages** | **Static (code)** | No | Primary six items fixed |
| **Rate-limit counters** | **External shared store (not primary DB)** | No | Ephemeral |

### 4.2 Common fields (all content entities)

`id` · `slug` (where routable; unique; URL-safe) · `status` (`draft` | `published` | `archived`) · `published_at` · `created_at` · `updated_at` · `deleted_at` (soft delete) · `created_by` / `updated_by` · SEO fields (`seo_title`, `seo_description`, `og_media_id`) · `display_order` where orderable.

### 4.3 Entity detail

**Product**

| Field | Required | Notes |
|-------|:--------:|-------|
| `name`, `slug`, `tagline` | Yes | |
| `status_label` | Yes | `available` · `beta` · `in_development` · `coming_soon` `[REQUIRES CONFIRMATION: taxonomy]` |
| `summary`, `description_blocks` | Yes | Structured blocks |
| `capabilities` | Optional | Confirmed only; ordered |
| `media` (cover, gallery) | Optional | Media references |
| `hue_key` | Yes | Maps to product colour token (`os`/`ai`/`pa`/`ide`) |
| `template_variant` / `signature_module` | Yes | Code-defined type (e.g., `os-environment`, `ai-capabilities`, `pa-conversation`, `ide-workflow`) |
| `signature_module_content` | Optional | Editable content slots |
| `primary_cta_type`, `primary_cta_target` | Yes | Validated type: explore / download / waitlist / demo / enquire |
| `ecosystem_relations` | Optional | Via Product relationship |
| `related_projects`, `related_services` | Optional | Links |
| *Future:* `documentation_url`, localization fields |

**Service / Service category**

| Field | Required | Notes |
|-------|:--------:|-------|
| `name`, `slug`, `category_id` | Yes | |
| `summary` | Yes | |
| `problem_block`, `capability_block`, `approach_block`, `solution_block`, `outcome_block` | Optional per catalogue | Omitted sections do not render |
| `capabilities`, `benefits` | Optional | Ordered lists |
| `faq_items` | Optional | |
| `disclaimer_block` | **Required for Legal/Funding (flagged `requires_disclaimer`)** | Blocks publish if empty |
| `media`, `related_projects` | Optional | |
| **Prohibited:** any price/package/plan fields | — | Not modeled (publish gate rejects price-like content) |

**Portfolio Project**

| Field | Required | Notes |
|-------|:--------:|-------|
| `title`, `slug`, `summary` | Yes | |
| `categories` (≥1), `technologies` | Yes / Optional | Vocabularies |
| `project_status` | Optional | live / in development / internal `[REQUIRES CONFIRMATION: taxonomy]` |
| `cover_media` (+ alt) | Yes | |
| `gallery` | Optional | |
| `story_blocks` | Optional | Challenge, Approach, Solution, Technology, Outcome, Evidence; each optional |
| `metrics` | Optional | Each metric requires `source` and `owner`; none otherwise |
| `period/year`, `external_url` | Optional | |
| `related_services`, `related_products` | Optional | |
| `featured` (bool), `display_order` | Optional | |
| `client_permission_status` | Required before publish | Internal field `[REQUIRES CONFIRMATION]` |

**Home Content** — named slots: opening statement, supporting line, CTA labels/targets, ecosystem captions, flagship text, services intro, evidence block, about teaser, closing paths; featured products/projects selections.

**About Content** — ordered chapters (title, blocks, media), optional timeline entries (verified date + text), invitation block.

**Site Settings** — org name, contact email, location/address `[REQUIRES CONFIRMATION]`, social links, **Calendly URL**, header CTA label, footer text, default SEO metadata/OG image, optional announcement banner.

**Enquiry**

| Field | Required | Notes |
|-------|:--------:|-------|
| `name`, `email`, `message` | Yes | Length-limited |
| `interest_type`, `interest_ref` | Optional | Enum (`service`, `product`, `general`, `partnership`) + slug |
| `organisation` | Optional | |
| `status` | System | `new` · `in_progress` · `resolved` · `spam` |
| `internal_notes` | Admin | Plain text |
| `source_page`, `created_at`, `consent_recorded_at` | System | |
| *Not stored by default:* phone, IP, user-agent `[REQUIRES CONFIRMATION]` | | Data minimisation (03 §37) |

**Media asset** — `id`, `storage_key` (random), `original_filename` (metadata only), `media_type`, `byte_size`, `width/height`, `alt_text` (required for informative), `is_decorative`, `focal_point`, `variants`, `uploaded_by`, `usage references` (computed).

**Release / Artifact (static V1)** — product, version, channel `[REQUIRES CONFIRMATION]`, release date, status (draft/published/withdrawn), notes, requirements `[REQUIRES CONFIRMATION]`, artifacts [architecture, filename, size, storage key/URL, SHA-256, optional signature reference].

**Admin profile** — auth identity reference, display name, `role` (single value `admin` in V1), `active`.

**Audit entry** — actor, action, entity type/id, summary (no secrets), timestamp, outcome.

### 4.4 Relationships

```text
ServiceCategory 1──* Service
Product *──* Product (relationship: type, description)
Project *──* ProjectCategory      Project *──* Technology
Project *──* Service              Project *──* Product
Project 1──* ProjectMedia ──► Media
Product/Service/Project/Home/About ──► Media (cover, gallery, OG)
Enquiry *──1 (optional) Service | Product   (by slug reference)
AdminProfile 1──1 AuthIdentity    AuditEntry *──1 AdminProfile
Product 0..* ──► Release (static data, by product slug)
```

### 4.5 Data-model principles

- Referential integrity and uniqueness enforced by database constraints (slugs unique per type; no orphaned join rows).
- Published entities may not reference unpublished/deleted entities (publish gate + integrity check).
- Soft delete by default; permanent purge is a separate privileged action after a recovery window `[REQUIRES CONFIRMATION: window]`.
- **No pricing fields anywhere.**
- Future fields (documentation URLs, localization, revision history) are **not** created now.

---

## 5. API & Data Flow

No public API is required for first-party UI (02 §29). Server Components read; Server Actions mutate; Route Handlers exist only where an external caller needs a URL.

### 5.1 Public read path

```text
Visitor ─► CDN (cached static HTML)
              │ miss/revalidate
              ▼
Next.js Server Component ─► Service layer ─► Repository ─► PostgreSQL (published, non-deleted only)
                                                          └► Release data (Git, V1)
Media: Browser ─► image optimisation/CDN ─► storage (published variants only)
```

### 5.2 Enquiry path

```text
Browser form ─► Server Action
   ├ origin check · size limit
   ├ rate limit (shared store)
   ├ spam checks (honeypot · timing · duplicates)
   ├ schema validation + normalisation
   ├ service layer (business rules)
   ├ repository ─► insert-only DB path ─► enquiries
   └ notification adapter (email; failure isolated) ─► internal recipients only
Admin ─► Enquiry management (authz) ─► review / update status
```

### 5.3 Admin content path

```text
Admin browser ─► Server Component / Server Action
   ├ verify session (auth service) · MFA assurance · admin allowlist
   ├ authorization guard (permission check)
   ├ validation (schema) · publish gate (on publish)
   ├ service layer ─► repository ─► PostgreSQL / Storage
   ├ audit entry written
   └ on publish/unpublish/delete: targeted revalidation (tags/paths) + slug-redirect handling
```

### 5.4 Media upload path

```text
Admin picker ─► Server Action (authz)
   ├ size/type allowlist · content (magic-byte) inspection
   ├ random storage key · metadata strip · variant generation
   ├ store (private until referenced by published content, or public-read bucket for variants) 
   └ media record ─► alt-text prompt ─► usage tracking
```

### 5.5 Release path (V1, conditional)

```text
Release workflow (CI, scoped credentials) ─► build ─► SHA-256 ─► upload to artifact origin ─► verify ─► PR updating release data
Website build validates schema ─► HENU OS release block ─► links to artifact origin (direct CDN download)
```

### 5.6 Endpoint inventory (V1)

| Endpoint | Type | Purpose | Notes |
|----------|------|---------|-------|
| Enquiry submission | Server Action | Public form | SECB; rate-limited |
| Admin mutations (all modules) | Server Actions | Content management | Guard on every action |
| Media upload | Server Action | Admin only | SEC-006 |
| `GET /api/health` | Route Handler | Uptime monitoring | Minimal output |
| Webhook receivers | Route Handlers | **Only if an integration requires** | Signature/replay verification |
| Public releases API | Route Handler | **V1.1/Future**, only with a consumer | 02 §29 |
| `sitemap.xml`, `robots.txt` | File conventions | SEO | Environment-aware |

**No other endpoints are created.** There is no REST API for UI convenience.

---

## 6. Page Implementation Matrix

### 6.1 Public

| Route/Page | Purpose | Audience | Version | Priority | Components | Data Source | Dependencies |
|---|---|---|---|---|---|---|---|
| `/` Home | Establish identity; route visitors to products, services, portfolio, contact | All (P1 product/technical, P2 clients) | V1 | P0 | Header, Opening (Hero), Ecosystem model, Product flagship band, Services index, Portfolio feature, Evidence, About teaser, Closing paths, Footer | DB: Home Content, featured Products/Projects/Services; Site Settings | CORE-003/005/008/009/010, NAV-001..003, HOME-001..003, PROD-001, SERV-001, PORT-001 |
| `/services` | Services catalogue (editorial index + sections) | Business clients | V1 | P0 | Service row/block, category groups, process strip (if confirmed), CTA band | DB: Services, Categories, related Projects | SERV-001, SERV-003, SERV-004 |
| `/services/[slug]` | Deep service page | Business clients | V1 (where content exists) | P0 | Service detail template, FAQ, related projects, CTA | DB: Service | SERV-002 |
| `/products` | Ecosystem and four product presentations | Product users, developers, partners | V1 | P0 | Ecosystem model, Product block (flagship/standard) | DB: Products, relationships | PROD-001, HOME-002 |
| `/products/henu-os` | Flagship product page | Product users, developers | V1 | P0 | Product Story (OS variant), release block (conditional), FAQ, CTA | DB: Product (`henu-os`); Git: release data | OS-001, OS-002, PROD-002 |
| `/products/[slug]` (HENU AI, PA, IDE, future products) | Product pages | Product users, developers | V1 (per readiness) | P0 | Product Story with signature module variant | DB: Product | PROD-002..005 |
| `/portfolio` | Projects built by HENU | Clients, partners | V1 | P0 | Featured area, filter, asymmetric index, Portfolio item | DB: Projects, categories | PORT-001, PORT-002 |
| `/portfolio/[slug]` | Case-study page | Clients, partners | V1 | P0 | Case study template, gallery, story blocks, related items, next/prev | DB: Project | PORT-003 |
| `/about` | HENU story | All, partners | V1 foundation; V1.1 full | P0 | Chapters template, ecosystem model, timeline (if verified) | DB: About Content | ABOUT-001, ABOUT-002 |
| `/contact` | Two conversion paths | All | V1 | P0 | Path chooser, Enquiry form, Calendly panel, contact details | DB: Site Settings; Services/Products for selector | CONTACT-001..004 |
| `/privacy`, `/terms` | Legal | All | V1 | P0 | Content page template | Static MDX (legally reviewed) | OPS-005 `[REQUIRES CONFIRMATION: legal]` |
| `/not-found`, error, maintenance | Safe system states | All | V1 | P0 | System templates | Static | CORE-011 |
| `/sitemap.xml`, `/robots.txt` | SEO | Crawlers | V1 | P0 | n/a | Generated from DB/config | SEO-002 |
| Supporting: documentation, release detail, security/disclosure page | Developer/trust resources | Developers | **V1.1 / Future** `[REQUIRES CONFIRMATION]` | P2 | Content/docs templates | Static/MDX | Out of V1 (C1); security page V1.1 (V1 if OS distributed, per 03 §42) |

### 6.2 Admin (web only)

| Route/Page | Purpose | Audience | Version | Priority | Components | Data Source | Dependencies |
|---|---|---|---|---|---|---|---|
| `/admin/sign-in` | Authenticated entry (MFA) | Admins | V1 | P0 | Sign-in form, MFA challenge | Supabase Auth | ADMIN-001 |
| `/admin` Dashboard | Tasks, new enquiries, drafts, content health | Admins | V1 | P1 | Stat/task panels, activity list | DB (counts, recents) | ADMIN-004 |
| `/admin/home` | Edit Home slots and featured items | Admins | V1 | P0 | Slot editor, featured selector, preview | DB: Home Content | ADMIN-005 |
| `/admin/services` (+ new / edit) | Service and category CRUD | Admins | V1 | P0 | Data table, structured editor, media picker | DB: Services | SERV-003 |
| `/admin/products` (+ new / edit) | Product CRUD | Admins | V1 | P0 | Data table, editor, relationship editor | DB: Products | PROD-006 |
| `/admin/portfolio` (+ new / edit) | Project CRUD, ordering, featuring | Admins | V1 | P0 | Data table, editor, media picker, vocabulary manager | DB: Projects | PORT-001 |
| `/admin/about` | Chapters and timeline editing | Admins | V1 | P0 | Chapter editor, timeline editor | DB: About Content | ABOUT-002 |
| `/admin/enquiries` (+ detail) | Review and manage enquiries | Admins | V1 | P0 | Filterable table, detail, status control | DB: Enquiries | CONTACT-005 |
| `/admin/media` | Media library | Admins | V1 | P0 | Library grid/table, upload, alt-text editor | DB + storage | ADMIN-006 |
| `/admin/settings` | Site settings | Admins | V1 | P0 | Settings form | DB: Site Settings | ADMIN-007 |
| `/admin/audit` | Audit log viewer | Admins | V1.1 | P2 | Log table | DB: Audit | ADMIN-008 (viewer part) |
| `/admin/users` | Users and roles | Admins | V1.1 (RBAC Future) | P2 | User table, role editor | Auth + `admin_profiles` | ADMIN-010 |
| `/admin/releases` | Release management | Admins | Future | P2 | Release editor | DB (future) | ADMIN-011 |

---

## 7. Admin Modules

| Module | V1 | Scope in V1 | Explicitly not in V1 |
|--------|:--:|------------|----------------------|
| **Dashboard** | ✔ (P1) | New/unactioned enquiries, drafts, recently changed, content-health warnings (missing alt text, unpublished references, unconfirmed placeholders) | Vanity metrics, charts without real data |
| **Home Management** | ✔ | Edit slots, CTAs, featured selections, media, preview, publish | Layout editing |
| **Service Management** | ✔ | CRUD for services/categories, structured blocks, ordering, disclaimers, related projects, preview, publish/archive | Pricing |
| **Product Management** | ✔ | CRUD, status labels, capabilities, signature-module slots, relationships, CTA configuration, publish/archive | Creating new template/module types (development task) |
| **Portfolio Management** | ✔ | CRUD, draft/publish/archive/delete, categories, technologies, media, ordering, featured | Public submissions |
| **About Management** | ✔ | Chapters, timeline, media, preview | Scene/3D choreography editing |
| **Enquiry Management** | ✔ | List/filter/search, view, status changes, internal notes | Reply-from-admin email client, exports (unless required) |
| **Media Library** | ✔ (minimal) | Upload, alt text, focal point, usage view, safe delete | Image editing suite, video transcoding |
| **Site Settings** | ✔ (minimal) | Contact details, social links, Calendly URL, SEO defaults, header CTA | Theme/design settings |
| **Audit log** | Write ✔ / Viewer V1.1 | All admin writes logged | Advanced search/export |
| **Users & Roles** | V1.1 | — (operator-provisioned in V1) | Self-service role design |
| **Releases** | Future | — (Git-tracked in V1) | — |
| **Documentation / Blog** | Future | — | — |

---

## 8. Admin Permissions — Planned Architecture vs V1 Implementation

| | **V1 implementation** | **Planned architecture (not built)** |
|---|---|---|
| **Roles** | Single role: `admin` | Admin · Manager · Viewer · Client (03 §10) |
| **Provisioning** | Operator procedure: invite in auth system + `admin_profiles` record (ADMIN-009) | Users & Roles UI (V1.1) |
| **Authorization model** | Central guard checks **permission names** (e.g., `content:write`, `enquiries:update`, `media:upload`); the `admin` role maps to all permissions | Role → permission matrix; RLS mirrors; resource-ownership scoping (Client) |
| **Enforcement** | Server-side on every page, Server Action and handler; RLS as defence-in-depth | Same, plus separation-of-duties for critical actions |
| **MFA** | **Mandatory** for all admin accounts | Same; phishing-resistant factors considered |
| **Step-up re-auth** | For critical actions (e.g., delete/permanent purge, settings that change contact/Calendly destination) | Extended to role changes, release publishing |
| **Not in V1** | Manager/Viewer/Client roles, permission matrix UI, approval workflows | — |

Design rule: **code checks permissions, never role names**, so adding roles later changes data/configuration, not logic.

---

## 9. Content Workflows

### 9.1 Generic content lifecycle (all content entities)

```text
Create ─► Draft ─► Edit/Preview ─► Publish gate ─► Published ─► Update ─► (republish)
                                         │                          │
                                  Blocked with reasons       Archive ─► Soft delete ─► (Purge, privileged)
```

- **Draft:** invisible publicly; visible in admin and preview.
- **Publish gate** (CORE-008) rejects: unconfirmed-placeholder markers, missing required fields, missing alt text on informative images, price-like content in services, metrics without source/owner, missing mandatory disclaimers, references to unpublished/deleted entities, invalid CTA targets.
- **Published:** appears publicly after targeted revalidation.
- **Archive:** hidden publicly; retained; restorable.
- **Delete:** soft delete with recovery window; slug redirects/410 behaviour defined; permanent purge is a separate privileged, audited action.
- **Slug change:** automatic redirect from the old slug.

### 9.2 Portfolio workflow (brief §7)

```text
Create Project ─► Draft ─► Edit ─► Publish ─► Update ─► Archive / Delete
```
No fixed number of projects: all layouts and filters must work for 0, 1, 2 and N projects.

### 9.3 Product workflow (brief §8)

Create/Edit product → structured description, capabilities, media, relationships, CTA → preview → publish. `henu-os` is reserved and uses the flagship template. Statuses are honest labels; CTA type must be consistent with status (e.g., `download` CTA is only valid when a published release exists; otherwise the publish gate blocks it).

### 9.4 Enquiry workflow (brief §6)

```text
Visitor ─► Form ─► Validation ─► Spam protection ─► Server processing ─► Database ─► Notification ─► Admin review
```
Status path: `new` → `in_progress` → `resolved` (or `spam`). Persist first; notification second; failures isolated.

### 9.5 Meeting workflow

Visitor selects **Schedule a meeting** → directed to the configured Calendly destination (link-out baseline; optional on-click embed). No custom calendar.

---

## 10. Feature Tickets

**Ticket format:** *ID · Title · Area · Priority · Version · Size*, followed by **Objective, Requirements, Dependencies, Acceptance Criteria, Testing**. "RAB/AB/SB/PB/SEOB/SECB" refer to §3. All tickets are also subject to the **DoD (§23)**.

---

### 10.1 CORE — Foundation

### CORE-001 — Repository, Tooling & Architectural Boundaries
**Area:** Core · **P0** · **V1** · **Size:** M
**Objective:** Establish the codebase so architecture rules are enforced by tooling, not convention.
**Requirements:**
- Next.js (App Router) + strict TypeScript; Tailwind; the directory structure from [02 §10].
- Lint/format; import-boundary rules (components cannot import `server/*`; only repositories touch the DB/content; only `config/` reads env); `server-only` guard for server modules.
- Lint rules forbid `dangerouslySetInnerHTML` (without annotated exception), raw hex colours, arbitrary spacing values in components [03 §14, 04 §23.9].
- Pinned Node.js and package-manager versions; committed lockfile; engineering README.
**Dependencies:** none (first ticket).
**Acceptance Criteria:**
- Fresh clone installs and builds from lockfile with a frozen install.
- Violating an import boundary or using a forbidden pattern fails lint in CI.
- Importing a server module from a Client Component fails the build.
- README documents setup, scripts and directory responsibilities.
**Testing:** Deliberate-violation fixtures confirm each rule fails; CI run on a clean machine.

### CORE-002 — Environments & Configuration
**Area:** Core/Ops · **P0** · **V1** · **Size:** M
**Objective:** Isolated development, staging and production with validated configuration and no secret leakage.
**Requirements:**
- Separate Supabase projects, secrets, domains and monitoring tags per environment [02 §23, 03 §24].
- Single typed config module validating env at startup; public vs server-only variable separation; example file with names only.
- Staging and previews are access-restricted and `noindex`; never contain production data.
**Dependencies:** CORE-001.
**Acceptance Criteria:**
- Application fails fast with a clear (secret-free) message on missing/invalid config.
- No secret appears under a public prefix; CI bundle scan finds none.
- Staging cannot be indexed; production data is absent from non-production.
**Testing:** Config-validation unit tests; bundle-scan CI job; manual environment audit.

### CORE-003 — Design Tokens & Theming Foundation
**Area:** Core/UI · **P0** · **V1** · **Size:** L
**Objective:** Implement the semantic token system with **light as default** and independently designed dark theme [04 §3, §4, §23, §27].
**Requirements:**
- Semantic CSS variables for colour, type, spacing, radius, border, elevation, motion, z-index, breakpoints, aspect ratios; mapped into Tailwind theme; light and dark sets.
- Light is the default in CSS regardless of OS preference; stored preference applied pre-paint only for returning dark users via a tiny script, with CSP hash support (SEC-002).
- Token lint forbids raw values in components.
- Validate contrast pairs in both themes with tooling `[REQUIRES CONFIRMATION: final palette/brand colours]`.
**Dependencies:** CORE-001; brand assets (OPS-005).
**Acceptance Criteria:**
- First-time visitor always sees light, even with an OS dark preference.
- Switching theme changes tokens only; components contain no theme branching.
- All text/UI pairs meet AA in both themes (documented report).
- No flash of incorrect theme for returning visitors.
**Testing:** Visual checks both themes; automated contrast report; E2E theme persistence (TEST-002).

### CORE-004 — Typography & Font Loading
**Area:** Core/UI · **P0** · **V1** · **Size:** S
**Objective:** Self-hosted, performant typography per [04 §8].
**Requirements:** Display, text, mono families (final selection `[REQUIRES CONFIRMATION]`); limited weights; self-hosted via framework font optimisation; metric-adjusted fallbacks; fluid type scale tokens; Devanagari/multilingual fallback decision recorded.
**Dependencies:** CORE-003.
**Acceptance Criteria:** No third-party font requests; no visible layout shift on font swap; display serif not used for body/UI; body ≥ 16px on mobile.
**Testing:** Network inspection; CLS measurement; visual review.

### CORE-005 — UI Primitives Library
**Area:** Core/UI · **P0** · **V1** · **Size:** XL
**Objective:** Build accessible, token-driven primitives [04 §24.2].
**Requirements:** Button, Link, form controls (Input/Textarea/Select/Checkbox/Radio/Switch), Badge/Status label, Icon, Typography components, Container/Stack/Grid/Section, Dialog, Tabs, Accordion, Toast/Alert, Skeleton, Media wrappers, Skip link/visually-hidden; vetted headless library for complex behaviours `[REQUIRES CONFIRMATION]`; all states per [04 §25].
**Dependencies:** CORE-003, CORE-004.
**Acceptance Criteria:** Every primitive implements default/hover/active/focus/disabled/loading/error as applicable; AB met; no raw colours/values; documented in a component catalogue with do/don't.
**Testing:** Component tests with accessibility assertions; keyboard walkthrough per primitive.

### CORE-006 — Database Foundation & RLS Baseline
**Area:** Core/Data · **P0** · **V1** · **Size:** L
**Objective:** Create schema, migrations and secure-by-default access [02 §7, 03 §22–23].
**Requirements:**
- Version-controlled forward-only migrations; entities per §4; constraints (unique slugs, enums, length checks).
- **RLS enabled on all exposed tables; deny by default; default grants revoked for `anon`/`authenticated`**; exposed schemas restricted.
- Generated DB types committed or generated in CI; seed tooling for development.
- Backup configuration decision recorded (OPS-003).
**Dependencies:** CORE-001, CORE-002.
**Acceptance Criteria:** Migration applies cleanly to a blank database; an unauthenticated Data API request to every application table returns no data; constraints reject invalid data; types regenerate without conflicts.
**Testing:** Migration tests; automated "anon cannot read/write any table" suite (shared with SEC-005).

### CORE-007 — Service/Repository Layering & Validation Framework
**Area:** Core · **P0** · **V1** · **Size:** M
**Objective:** Implement the data-access architecture [02 §13–15].
**Requirements:** `server/services` and `server/repositories` structure; domain types mapped once in repositories; schema-validation helpers (inferred types); standard result/error shapes; no database access outside repositories; content/DB repository interfaces designed for substitution.
**Dependencies:** CORE-001, CORE-006.
**Acceptance Criteria:** Example vertical slice (read + write) demonstrates the layers; UI code never imports repositories; unknown input fields are rejected by validation helpers; errors map to safe user messages.
**Testing:** Unit tests for validation and services; lint verification of boundaries.

### CORE-008 — Structured Content Model, Block Renderer & Publish Gate
**Area:** Core/Content · **P0** · **V1** · **Size:** XL
**Objective:** Implement the allow-listed block system and enforce content authenticity [04 §22, 03 §30].
**Requirements:**
- Block types: heading+text, constrained rich paragraph, image, gallery, video (facade), quote (attributed), key facts (sourced), process steps, capability list, related items, CTA, FAQ, disclaimer.
- Structured storage (not raw HTML); renderer escapes by default; constrained rich-text marks; link validation (allowed schemes).
- **Publish gate:** blocks unconfirmed-placeholder markers, missing alt text, price-like content in services, unsourced metrics, missing mandatory disclaimers, invalid references, invalid CTA targets.
- Content integrity check (broken references, orphaned media) usable by the dashboard.
**Dependencies:** CORE-007.
**Acceptance Criteria:**
- Raw HTML/scripts cannot be stored or rendered; XSS payloads render inert.
- Each publish-gate rule blocks publication with a specific, actionable message.
- Adding a block type requires code and review (not an admin action).
**Testing:** Unit tests per gate rule; XSS payload corpus tests on the renderer; integration test of publish blocked/allowed.

### CORE-009 — Content Delivery: Static Generation, Revalidation, Preview & Redirects
**Area:** Core/Performance · **P0** · **V1** · **Size:** L
**Objective:** Keep admin-managed content fast, fresh and private until published [02 §16–17].
**Requirements:**
- Public content pages statically generated; **tag/path-based on-demand revalidation** on publish/unpublish/edit/delete; explicit caching configuration (do not rely on framework defaults) `[VERIFY per version]`.
- Public queries return only `published` and non-deleted content.
- **Draft preview** for authenticated admins: dynamic, `no-store`, `noindex`, never cached.
- **Automatic redirects** on slug change; deleted content returns a defined 404/410.
**Dependencies:** CORE-007, CORE-008, ADMIN-002.
**Acceptance Criteria:** Published content appears publicly after the publish action without redeploy; unpublished/draft content is unreachable by direct URL for non-admins; preview works only for authenticated admins; old slugs redirect to new ones.
**Testing:** Integration tests for revalidation; E2E draft-not-public; redirect tests.

### CORE-010 — Media Pipeline & Image Component
**Area:** Core/Media · **P0** · **V1** · **Size:** L
**Objective:** Safe, optimised, responsive media [04 §29, 02 §18, 03 §20].
**Requirements:** Processing to responsive widths and modern formats; focal-point-aware crops; declared dimensions; blur/tonal placeholders; alt-text enforcement; storage decision recorded `[REQUIRES CONFIRMATION: provider]`; public image component with `sizes` and priority control for the single LCP image only.
**Dependencies:** CORE-006, SEC-006.
**Acceptance Criteria:** Uploaded images yield responsive variants; no layout shift; informative images cannot be published without alt text; originals are never served unprocessed.
**Testing:** Integration tests for variants; Lighthouse/CLS checks on image-heavy pages.

### CORE-011 — Error, Loading & System Pages
**Area:** Core · **P0** · **V1** · **Size:** S
**Objective:** Consistent, safe system states [02 §22, 03 §27].
**Requirements:** 404, 500, maintenance; route-level loading/error boundaries with layout-matched skeletons; global fallback; no internals leaked; correlation ID on error pages.
**Dependencies:** CORE-005.
**Acceptance Criteria:** Induced errors show safe pages with recovery paths; no stack traces or internal text; SB met.
**Testing:** Forced-error E2E; log/response inspection.

---

### 10.2 NAV — Navigation & Shell

### NAV-001 — Header & Primary Navigation
**Area:** Navigation · **P0** · **V1** · **Size:** L
**Objective:** Implement the six-item navigation across breakpoints [04 §9].
**Requirements:**
- Items: Home · Services · Products · Portfolio · About Us · Contact Us; HENU logo; theme switch; header CTA (label `[REQUIRES CONFIRMATION]`).
- Desktop: sticky, shrinking header; `aria-current` + visible active state; optional Products/Services panels (click-operated, Escape closes).
- Tablet/mobile: menu button; overlay/full-screen panel with focus trap, Escape, focus return, scroll lock.
- Skip link; scroll-padding so focus is never hidden under the header.
**Dependencies:** CORE-005, NAV-002.
**Acceptance Criteria:** RAB, AB; all six links reachable by keyboard in order; active page indicated by more than colour; menu panels do not trap focus after close; header never obscures focused elements.
**Testing:** Component tests; E2E mobile navigation (TEST-002); keyboard and screen-reader passes.

### NAV-002 — Theme Switch
**Area:** Navigation/Theming · **P0** · **V1** · **Size:** S
**Objective:** Accessible light/dark control with persistence [04 §4.4, §20].
**Requirements:** Header control (and mobile menu); accessible name and announced state; keyboard operable; persisted preference; two states (Light/Dark) in V1.
**Dependencies:** CORE-003.
**Acceptance Criteria:** Default light; toggling persists across navigation and reload; state announced to assistive tech; no theme flash on reload for dark users.
**Testing:** E2E theme switch; accessibility assertions.

### NAV-003 — Footer
**Area:** Navigation · **P0** · **V1** · **Size:** M
**Objective:** Designed footer with primary links, product/service links, contact details, legal links.
**Requirements:** Content from Site Settings; collapsible groups on mobile; `tel:`/`mailto:` only for confirmed contacts; supporting links appear only when the target exists.
**Dependencies:** CORE-005, ADMIN-007.
**Acceptance Criteria:** RAB, AB, SB; no broken links; changing Site Settings updates the footer after revalidation.
**Testing:** Link-check; E2E settings → footer.

---

### 10.3 HOME

### HOME-001 — Home Opening & Page Shell
**Area:** Home · **P0** · **V1** · **Size:** L
**Objective:** Build the loudest, fastest-loading moment of the site [04 §10, §6.3].
**Requirements:** Asymmetric `display-xl` statement; static chromatic Spectrum field (optimised image/CSS, not canvas); two CTAs; works without JavaScript/WebGL; statement is a real `h1`.
**Dependencies:** CORE-003/004/005, NAV-001; field artwork (OPS-005); copy `[REQUIRES CONFIRMATION]`.
**Acceptance Criteria:** RAB, AB, PB; LCP element is text/optimised image; field is `aria-hidden`; text contrast met against the worst local colour.
**Testing:** Lighthouse/field CWV; visual review at four widths.

### HOME-002 — Ecosystem Model Component
**Area:** Home/Products · **P0** · **V1** · **Size:** L
**Objective:** Interactive, accessible visualisation of confirmed product relationships [04 §6.2, §10.3].
**Requirements:** Layered model (OS ground; AI/PA/IDE layers); data-driven from products and relationships; keyboard/tap/hover selection revealing role + link; mobile vertical-stack version; no fabricated relationships.
**Dependencies:** CORE-005, PROD-006 (data), relationship confirmation `[REQUIRES CONFIRMATION]`.
**Acceptance Criteria:** RAB, AB (operable without a mouse); renders only published products; works for any count of products; reduced motion respected.
**Testing:** Component/E2E keyboard tests; data-driven rendering test.

### HOME-003 — Home Assembly & Dynamic Slots
**Area:** Home · **P0** · **V1** · **Size:** L
**Objective:** Assemble the full home composition from admin-managed slots [04 §10.3].
**Requirements:** Sections: opening, ecosystem, HENU OS band, services index, portfolio feature, evidence, About teaser, closing dual-path; featured portfolio/product selection from data; hierarchy/loudness map respected; evidence section shows only confirmed facts (no counters).
**Dependencies:** HOME-001/002, PROD-001, SERV-001, PORT-001, CONTACT-001, ADMIN-005.
**Acceptance Criteria:** RAB, AB, SB, SEOB; page remains well-composed with 0/1/N projects or sparse content; no testimonials/metrics unless confirmed and sourced; layout fixed while content slots editable.
**Testing:** E2E homepage navigation; empty/sparse-content tests.

---

### 10.4 PROD — Products

### PROD-001 — Products Hub
**Area:** Products · **P0** · **V1** · **Size:** M
**Objective:** Ecosystem-first products page with four distinct presentations [04 §11.1].
**Requirements:** Ecosystem model; flagship band for HENU OS; distinct blocks for AI/PA/IDE; status labels; CTA per product.
**Dependencies:** HOME-002, PROD-006.
**Acceptance Criteria:** RAB, AB, SB, SEOB; not a uniform card grid; adding a published product appears without code change; unpublished products absent.
**Testing:** E2E products exploration; data-driven tests.

### PROD-002 — Product Story Template & Variants
**Area:** Products · **P0** · **V1** · **Size:** XL
**Objective:** Shared product narrative with per-product signature modules [04 §11.2].
**Requirements:** Blocks: head (status, field tinted by product hue), why it exists, experience (signature module), capabilities, ecosystem relationship, evidence, next action; module types `os-environment`, `ai-capabilities`, `pa-conversation`, `ide-workflow`; sections with no content omitted; state-driven CTA validation.
**Dependencies:** CORE-008, CORE-005, product tokens.
**Acceptance Criteria:** RAB, AB, SB, SEOB; pages related but not visually identical; illustrative visuals labelled as illustration; no invented specifications; CTA consistent with status.
**Testing:** Component tests per variant; accessibility on each module.

### PROD-003 — HENU AI Page
**Area:** Products · **P0** (conditional) · **V1** · **Size:** M
**Objective:** HENU AI page with an accessible capabilities explorer.
**Requirements:** Confirmed capabilities only; ecosystem relationship; status-driven CTA. `[REQUIRES CONFIRMATION: readiness, capabilities, media]`
**Dependencies:** PROD-002, content (OPS-005).
**Acceptance Criteria:** Capabilities explorer operable by keyboard; no model specs or metrics unless confirmed; RAB, AB, SB, SEOB.
**Testing:** E2E; accessibility review.

### PROD-004 — HENU PA Page
**Area:** Products · **P0** (conditional) · **V1** · **Size:** M
**Objective:** HENU PA page with a conversation signature module.
**Requirements:** Scripted voice-interaction depiction **labelled illustrative unless a real recording**; transcript/text alternative; ecosystem relationship. `[REQUIRES CONFIRMATION]`
**Dependencies:** PROD-002.
**Acceptance Criteria:** Module has text equivalent; no autoplay audio; RAB, AB, SB, SEOB.
**Testing:** E2E; screen-reader review of the module.

### PROD-005 — HENU IDE Page
**Area:** Products · **P0** (conditional) · **V1** · **Size:** M
**Objective:** HENU IDE page with a workflow signature module.
**Requirements:** Real screenshots where available; stepwise workflow module; ecosystem relationship. `[REQUIRES CONFIRMATION]`
**Dependencies:** PROD-002.
**Acceptance Criteria:** No fabricated UI presented as real; RAB, AB, SB, SEOB.
**Testing:** E2E; visual review.

### PROD-006 — Product Management Module (Admin)
**Area:** Products/Admin · **P0** · **V1** · **Size:** L
**Objective:** Admins can create, edit, publish, archive and delete products [brief §4, §8].
**Requirements:** Product table; editor for fields in §4.3; capabilities; media picker; relationship editor; CTA configuration validated against status; reserved slug `henu-os`; preview; publish gate; audit.
**Dependencies:** ADMIN-002/003, CORE-008, CORE-010.
**Acceptance Criteria:**
- Admin can create, edit, publish, archive and delete a product; published changes appear publicly without redeploy; drafts are not public.
- Cannot publish a `download` CTA without a published release; cannot reuse `henu-os`.
- Every write creates an audit entry; AB (admin), SB, SECB.
**Testing:** E2E product admin workflow (TEST-002); authorization tests (TEST-003).

---

### 10.5 OS — HENU OS & Releases

### OS-001 — HENU OS Flagship Page
**Area:** OS · **P0** · **V1** · **Size:** L
**Objective:** Flagship experience at `/products/henu-os` [04 §12].
**Requirements:** Stronger visual prominence; product visualisation (real or labelled illustration); voice, developer workflow, AI relationship narrative; state-driven CTA (Download / Join waitlist / Explore); release block when available; **no invented specifications, benchmarks, requirements, counts or certifications**.
**Dependencies:** PROD-002, OS-002 (conditional).
**Acceptance Criteria:** Page is complete and compelling without unconfirmed technical data; RAB, AB, SB, SEOB; CTA reflects real release state.
**Testing:** E2E for each CTA state (release/no release); content audit for prohibited claims.

### OS-002 — Release Metadata Model & Release Block
**Area:** OS/Data · **P1** · **V1 (conditional on a public release)** · **Size:** M
**Objective:** Structured, validated release data as the single source of truth [02 §9, 04 §12.2].
**Requirements:** Git-tracked structured data: product, version, channel, release date, status, notes, requirements, artifacts (architecture, file name, size, storage key, SHA-256, optional signature ref); build-time schema validation (fails on missing/malformed checksum); derived "latest"; release service/repository interface compatible with a future DB implementation; withdrawn status; release block component.
**Dependencies:** CORE-007; release facts `[REQUIRES CONFIRMATION]`.
**Acceptance Criteria:** No component contains a literal download URL or version string; invalid release data fails the build; withdrawing a release removes it from download surfaces without deleting history; wording says "SHA-256 checksum for integrity verification" and makes no signing claim unless implemented [03 §21.3].
**Testing:** Unit tests (latest derivation, validation); build-failure test; E2E release block.

### OS-003 — Download Origin & Release Publishing Workflow
**Area:** OS/Ops · **P1** · **V1 (conditional)** · **Size:** L
**Objective:** Controlled, tamper-resistant artifact distribution [02 §8, 03 §21].
**Requirements:** Dedicated object storage + CDN on a separate cookieless hostname (provider `[REQUIRES CONFIRMATION]`); immutable/versioned objects; scoped short-lived publishing credentials (web app has no write access); checksum computed in workflow and verified after upload; draft artifacts non-public; headers (`nosniff`, attachment disposition, HTTPS/HSTS); range requests; bandwidth/spend alerts; withdrawal procedure.
**Dependencies:** OS-002, SEC-001, OPS-002.
**Acceptance Criteria:** A test artifact publishes via workflow only; overwrite attempts are prevented or recorded; web-app credentials cannot write to the bucket; download resumes via range request; checksum on page matches file.
**Testing:** Workflow dry run; credential-scope test; checksum verification; download failure drill.

### OS-004 — Release Integrity Monitoring & Signing
**Area:** OS/Security · **P2** · **V1.1** · **Size:** M
**Objective:** Detect artifact/metadata drift and add authenticity assurance [03 §21.4].
**Requirements:** Scheduled checksum re-verification and alerting; detached signature scheme and public-key publication `[REQUIRES CONFIRMATION]`; key custody procedure.
**Dependencies:** OS-003.
**Acceptance Criteria:** Tampered test artifact triggers an alert; signing claimed only once implemented and documented.
**Testing:** Tamper simulation.

---

### 10.6 SERV — Services

### SERV-001 — Services Index (`/services`)
**Area:** Services · **P0** · **V1** · **Size:** L
**Objective:** Editorial, category-grouped index with per-service sections [04 §14.5].
**Requirements:** Intro; numbered ledger rows grouped by category; sections following Problem → Capability → Approach → Solution → Outcome using catalogue content (omit missing parts); related projects; contextual CTA pre-selecting the enquiry interest; **no price/package/payment UI anywhere**.
**Dependencies:** CORE-008, SERV-003/004.
**Acceptance Criteria:** RAB, AB, SB, SEOB; adding a service/category requires no code change; page works for 1 or N services; no price-like text on the page.
**Testing:** E2E services; automated scan for currency/price patterns on public pages.

### SERV-002 — Service Detail Template (`/services/[slug]`)
**Area:** Services · **P0** · **V1** · **Size:** M
**Objective:** Deeper service pages built from the same structured content.
**Requirements:** Structure per [04 §14.6]; FAQ and disclaimer blocks; related projects; CTA with service pre-selection.
**Dependencies:** SERV-001.
**Acceptance Criteria:** RAB, AB, SB, SEOB; required disclaimers render for flagged services; unpublished services return 404.
**Testing:** Integration/E2E.

### SERV-003 — Service Management Module (Admin)
**Area:** Services/Admin · **P0** · **V1** · **Size:** L
**Objective:** Admins manage service categories and services.
**Requirements:** CRUD with structured blocks; ordering (keyboard-accessible); disclaimers; related projects; preview; publish gate (including price-content blocker); archive/delete; audit.
**Dependencies:** ADMIN-002/003, CORE-008/010.
**Acceptance Criteria:** Admin can create/edit/delete/reorder services and categories; published changes appear publicly; services flagged `requires_disclaimer` cannot publish without one; drafts not public; AB, SB, SECB.
**Testing:** E2E service admin workflow; gate tests.

### SERV-004 — Service Content Onboarding & Sensitive-Service Governance
**Area:** Services/Content · **P0** · **V1** · **Size:** M
**Objective:** Load the supplied catalogue accurately and control risk for Legal/Funding/Documentation services [04 §14.4].
**Requirements:** Transcribe catalogue (categories, descriptions, capabilities, benefits, outcomes) `[REQUIRES CONFIRMATION: catalogue supplied]`; category grouping approval; mandatory disclaimers and expectation-setting wording for Legal Services and Funding Solutions; no outcome guarantees; legal review sign-off recorded.
**Dependencies:** OPS-005.
**Acceptance Criteria:** All published services trace to catalogue content; Legal/Funding pages contain approved disclaimers; no price/guarantee language.
**Testing:** Content audit checklist; legal sign-off artefact.

---

### 10.7 PORT — Portfolio

### PORT-001 — Dynamic Portfolio Management
**Area:** Portfolio + Admin · **P0** · **V1** · **Size:** XL
**Objective:** Allow administrators to create, edit, publish, archive and delete portfolio projects, with the public portfolio reflecting them.
**Requirements:**
- Project fields per §4.3 (title, description, media, category, technologies, status, ordering, publication state, related services/products, optional confirmed outcomes with source/owner).
- Admin: project table (sort/filter/search), editor, media picker, vocabulary management (categories, technologies), featured flag, ordering with keyboard-accessible reordering, preview, publish gate, archive, soft delete, audit.
- Public: only published, non-deleted projects; layout independent of project count.
**Dependencies:** ADMIN-002/003/006, CORE-008/009/010.
**Acceptance Criteria:**
- Admin can create a project; edit an existing project; archive or delete a project.
- Published projects appear on the public Portfolio page; draft and archived projects are not publicly visible (including by direct URL).
- Portfolio remains functional and well-composed with 0, 1, 2 and many projects.
- No outcome/metric can be published without `source` and `owner`; client-permission field required before publish.
- Public portfolio meets RAB (mobile presentation remains responsive); admin meets AB, SB, SECB.
**Testing:** E2E portfolio admin workflow (TEST-002); authorization tests; count-variation visual tests.

### PORT-002 — Portfolio Index Experience & Filtering
**Area:** Portfolio · **P0** · **V1** · **Size:** L
**Objective:** Asymmetric, image-led index with category filtering [04 §15.3].
**Requirements:** Featured area; slot-pattern layout assigned automatically by order (admins do not place pixels); accessible category filter reflected in URL; empty-category state; pagination or "load more"; hover/focus/tap previews; progressive enhancement.
**Dependencies:** PORT-001.
**Acceptance Criteria:** RAB, AB, SB, SEOB; filter works without JavaScript where practical and is keyboard-operable; not a uniform three-column grid; layout holds for any count.
**Testing:** E2E filter; visual tests at four widths.

### PORT-003 — Portfolio Detail / Case Study (`/portfolio/[slug]`)
**Area:** Portfolio · **P0** · **V1** · **Size:** M
**Objective:** Case-study storytelling page.
**Requirements:** Cover, summary, optional Challenge→Approach→Solution→Technology→Outcome→Evidence blocks (omitted when absent), gallery with visible controls, related service/product, next/previous; no fabricated outcomes.
**Dependencies:** PORT-001.
**Acceptance Criteria:** RAB, AB, SB, SEOB; gallery operable by keyboard and touch with visible buttons; absent blocks leave no empty sections.
**Testing:** E2E; accessibility review.

### PORT-004 — Advanced Portfolio Interactions
**Area:** Portfolio · **P2** · **V1.1** · **Size:** M
**Objective:** Technology filters, shared-element transitions, richer previews [04 §26.3].
**Requirements:** As listed; reduced-motion variants; performance review.
**Dependencies:** PORT-002/003, MOTION-003.
**Acceptance Criteria:** No regression to PB/AB; transitions disabled under reduced motion.
**Testing:** Motion and performance review.

---

### 10.8 ABOUT

### ABOUT-001 — About Foundation (`/about`)
**Area:** About · **P0** · **V1** · **Size:** L
**Objective:** A distinctive, complete, static-capable storytelling page [04 §16].
**Requirements:** Chapter template (origin, ecosystem, how HENU builds, services, verified timeline, people/values if desired, invitation); ecosystem model reuse; content from About Content; **no critical content only in a canvas**; structure ready for the 3D/scroll layer; unverified milestones omitted.
**Dependencies:** CORE-008, HOME-002, content `[REQUIRES CONFIRMATION]`.
**Acceptance Criteria:** RAB, AB, SB, SEOB; page is fully readable without JavaScript motion; no generic Mission/Vision/Team template; timeline absent unless verified.
**Testing:** E2E; content audit.

### ABOUT-002 — About Management Module (Admin)
**Area:** About/Admin · **P0** · **V1** · **Size:** M
**Objective:** Admins edit chapters, timeline entries and media.
**Requirements:** Ordered chapter editor, timeline editor (verified dates), media picker, preview, publish gate, audit; scene/animation logic remains code-defined.
**Dependencies:** ADMIN-002/003, ABOUT-001.
**Acceptance Criteria:** Admin can add/edit/reorder/remove chapters and timeline entries; changes appear after publish; drafts private; AB, SB, SECB.
**Testing:** E2E about admin workflow.

### ABOUT-003 — Scroll Storytelling & 3D/GLB Experience
**Area:** About/Motion · **P2** · **V1.1** · **Size:** XL
**Objective:** Meaningful 3D and scroll storytelling [04 §16.3, §31].
**Requirements:** Lazy-loaded, feature-detected WebGL; static poster/fallback always available; mobile: poster + explicit "View in 3D" or simplified model; reduced-motion: static or user-controlled only; byte budgets `[REQUIRES CONFIRMATION: GLB assets]`; library decision per dependency policy; CSP/same-origin hosting.
**Dependencies:** ABOUT-001, PERF-001, GLB assets.
**Acceptance Criteria:** Site fully functional with WebGL disabled; 3D does not affect initial load or LCP; keyboard-accessible controls with no focus trap; meets agreed byte/performance budgets.
**Testing:** WebGL-off tests; low-end device profiling; reduced-motion tests.

---

### 10.9 CONTACT

### CONTACT-001 — Contact Page & Path Chooser
**Area:** Contact · **P0** · **V1** · **Size:** M
**Objective:** Two clear conversion paths [04 §17].
**Requirements:** Framing statement; path chooser on tablet/mobile; enquiry panel (primary) + meeting panel (secondary); contact details from settings; "interested in" pre-selection from validated URL parameter against known slugs.
**Dependencies:** CORE-005, ADMIN-007, CONTACT-002/004.
**Acceptance Criteria:** RAB, AB, SB, SEOB; the two paths are understandable at a glance; invalid pre-selection parameters are ignored safely.
**Testing:** E2E contact page; parameter tampering test.

### CONTACT-002 — Enquiry Submission Pipeline
**Area:** Contact/Security · **P0** · **V1** · **Size:** XL
**Objective:** Secure end-to-end enquiry capture [brief §6, 03 §38].
**Requirements:**
- Fields per §4.3 (no pricing/budget fields; phone only if confirmed); inline accessible validation; preserved input on error; success and failure states with alternative contact method.
- Server-side pipeline: origin check → size limit → rate limit → spam checks (honeypot (accessible), timing token, duplicates) → schema validation/normalisation → service rules → **insert-only database path** → notification.
- Generic responses; no CAPTCHA by default (adaptive challenge hook only).
**Dependencies:** CORE-006/007, SEC-003/004/005, CONTACT-003.
**Acceptance Criteria:**
- Valid enquiry is persisted and an owner notified; invalid input yields field-level errors; spam signals classify as `spam` without notification.
- Public role cannot read/update/delete enquiries; duplicate submissions deduplicated.
- Rate limit holds across serverless instances; persistence failure shows safe message and preserved input.
- RAB, AB, SB, SECB.
**Testing:** Integration tests for each stage; security cases 8–10, 12, 16–18 from [03 §41]; E2E submission.

### CONTACT-003 — Notification Email Delivery & Reconciliation
**Area:** Contact/Ops · **P0** · **V1** · **Size:** M
**Objective:** Reliable, safe notifications; no lost enquiries [03 §38, 02 §6.3].
**Requirements:** Provider adapter `[REQUIRES CONFIRMATION: provider]`; fixed authenticated sender; recipients only internal; plain-text/escaped bodies; header-injection protection; global send cap; failure isolation (persist first); retry/alert path and reconciliation view of un-notified enquiries; SPF/DKIM/DMARC (OPS-002).
**Dependencies:** CONTACT-002, OPS-002.
**Acceptance Criteria:** CR/LF and `Bcc:` payloads cannot add headers/recipients; notification failure never loses or hides the enquiry and raises an alert; visitor-supplied address is never an email recipient.
**Testing:** Injection tests; provider-failure simulation.

### CONTACT-004 — Calendly Integration
**Area:** Contact · **P0** · **V1** · **Size:** S
**Objective:** "Schedule a meeting" opens the configured Calendly destination.
**Requirements:** URL from Site Settings (validated `https`, allowlisted host `[REQUIRES CONFIRMATION: URL]`); link-out baseline; optional on-click embed loading the third-party script only after the user clicks; plain-link fallback; no custom calendar.
**Dependencies:** ADMIN-007, SEC-002 (CSP allowance if embed used).
**Acceptance Criteria:** Action opens the configured destination; no Calendly script loads on page load; unavailable/blocked embed falls back to the link; invalid configured URL cannot be saved.
**Testing:** E2E Calendly action; network inspection.

### CONTACT-005 — Enquiry Management Module (Admin)
**Area:** Contact/Admin · **P0** · **V1** · **Size:** M
**Objective:** Admins review and manage enquiries [brief §4].
**Requirements:** Filterable/searchable table (status, type, date); detail view; status changes; internal notes; plain-text rendering under strict CSP; reconciliation indicator for failed notifications; audit of status changes; no export unless required.
**Dependencies:** ADMIN-002/003, CONTACT-002.
**Acceptance Criteria:** Admin can view and update status; stored XSS payloads render inert; non-admin cannot access; AB, SB, SECB.
**Testing:** E2E; XSS payload test; authorization tests.

---

### 10.10 ADMIN — Admin Web Foundation

### ADMIN-001 — Admin Authentication
**Area:** Admin/Security · **P0** · **V1** · **Size:** L
**Objective:** Strong, managed authentication [03 §6–8].
**Requirements:** Supabase Auth only; **public sign-up disabled; invite-only**; sign-in method per decision `[REQUIRES CONFIRMATION: IdP vs password + MFA]`; **mandatory MFA enforced server-side**; refresh-token rotation/reuse detection; exact redirect allowlist; server-side session handling (no browser Supabase client for sessions); HttpOnly/Secure/SameSite host-only cookies; session time-box/inactivity per plan capability `[VERIFY]`; login rate limiting; uniform error responses; sign-out and sign-out-all.
**Dependencies:** CORE-006, SEC-004.
**Acceptance Criteria:** Unauthenticated users cannot reach admin; single-factor sessions cannot perform admin operations; tokens never appear in browser storage or URLs; sign-in failures do not reveal account existence; revoked session cannot perform critical actions.
**Testing:** Auth test suite; cases 1, 5–7, 14–15, 34 of [03 §41]; verify cookie attributes in running app.

### ADMIN-002 — Admin Shell, Authorization Guard & Isolation
**Area:** Admin/Security · **P0** · **V1** · **Size:** L
**Objective:** Isolated admin area with centralised, deny-by-default authorization [03 §9, 02 §12.4].
**Requirements:** Separate route group/layout; central guard (verify identity → load admin record → check permission → proceed); **every page, Server Action and handler authorizes independently (no middleware-only checks)**; permission-name checks with `admin` mapped to all; strict nonce CSP, `no-referrer`, `frame-ancestors 'none'`, `no-store`; `noindex`, excluded from sitemap; no third-party scripts; shell: sidebar, top bar, breadcrumbs, environment indicator.
**Dependencies:** ADMIN-001, SEC-002.
**Acceptance Criteria:** Direct HTTP calls to any admin action without a valid admin session are denied; a valid non-admin identity is denied; admin pages are never cached; new routes denied by default until a permission is declared.
**Testing:** Authorization matrix tests (TEST-003); direct-action call tests.

### ADMIN-003 — Admin UI Pattern Library
**Area:** Admin/UI · **P0** · **V1** · **Size:** XL
**Objective:** Dense, accessible admin patterns [04 §21.5].
**Requirements:** Data table (sort/filter/search/select/paginate); form patterns (sectioned, inline validation, unsaved-changes warning); **constrained structured editor** (no raw HTML) with renderer parity; media picker; status badges (icon + text); confirm dialogs; toasts; reorder with drag **and** keyboard alternative; preview launcher; publish-blocked panel listing gate reasons; basic edit-conflict warning ("edited by X").
**Dependencies:** CORE-005/008, ADMIN-002.
**Acceptance Criteria:** AB (including WCAG 2.2 dragging alternative, target size, accessible authentication); SB for each pattern; editor cannot produce unsafe markup; destructive actions require confirmation.
**Testing:** Component tests; keyboard-only content-editing walkthrough; XSS payload tests via editor.

### ADMIN-004 — Dashboard
**Area:** Admin · **P1** · **V1** · **Size:** M
**Objective:** Operational overview [04 §21.4].
**Requirements:** New/unactioned enquiries; drafts awaiting publish; recent changes; content-health warnings (missing alt text, unpublished references, unconfirmed placeholders); no vanity metrics.
**Dependencies:** ADMIN-002/003, CORE-008, CONTACT-005.
**Acceptance Criteria:** Numbers match underlying data; warnings link to the offending item; empty states designed; AB, SB.
**Testing:** Integration tests against seeded data.

### ADMIN-005 — Home Management
**Area:** Admin/Home · **P0** · **V1** · **Size:** M
**Objective:** Admin edits Home slots, CTAs, featured selections, media [brief §4].
**Requirements:** Slot editor; featured product/project selectors (published only); CTA validation; preview; publish gate; audit.
**Dependencies:** ADMIN-002/003, HOME-003.
**Acceptance Criteria:** Changes appear after publish without redeploy; cannot feature unpublished items; layout cannot be altered; AB, SB, SECB.
**Testing:** E2E home admin; gate tests.

### ADMIN-006 — Media Library
**Area:** Admin/Media · **P0** · **V1** · **Size:** L
**Objective:** Safe media management [04 §21.4, 03 §20].
**Requirements:** Upload (SEC-006 controls), library browse/search, alt text and decorative flag, focal point, usage references, safe delete (blocked while in use by published content), size/quota limits.
**Dependencies:** ADMIN-002/003, CORE-010, SEC-006.
**Acceptance Criteria:** Informative images require alt text before use in published content; in-use media cannot be deleted; AB, SB, SECB.
**Testing:** Upload security cases 19–20 of [03 §41]; E2E media upload.

### ADMIN-007 — Site Settings
**Area:** Admin · **P0** · **V1** · **Size:** M
**Objective:** Central minimal site configuration.
**Requirements:** Contact details, social links, Calendly URL (validated), SEO defaults/OG image, header CTA label, footer text; critical changes (contact email, Calendly destination) use step-up re-authentication; audit.
**Dependencies:** ADMIN-002/003.
**Acceptance Criteria:** Settings changes propagate to header/footer/contact after revalidation; invalid URLs rejected; critical changes require recent re-auth; SECB.
**Testing:** E2E settings; step-up test.

### ADMIN-008 — Audit Logging (Write V1, Viewer V1.1)
**Area:** Admin/Security · **P0 (write) / P2 (viewer)** · **V1 / V1.1** · **Size:** M
**Objective:** Append-only record of admin actions [03 §28, §39].
**Requirements:** Entries for sign-in events (via auth logs), content create/update/publish/archive/delete/purge, settings changes, enquiry status changes, media deletes; no secrets/PII bodies; append-only to the application role; viewer page V1.1.
**Dependencies:** ADMIN-002, CORE-006.
**Acceptance Criteria:** Every admin mutation produces an entry with actor/time/target/summary; application role cannot alter or delete entries.
**Testing:** Integration tests; privilege test on the audit table.

### ADMIN-009 — Admin Provisioning Procedure (V1, Operator-Run)
**Area:** Admin/Ops · **P0** · **V1** · **Size:** S
**Objective:** Create/disable admins and recover access safely without a Users UI [03 §8].
**Requirements:** Documented procedure: invite → MFA enrolment → `admin_profiles` allowlist entry; offboarding (revoke sessions, disable, remove profile, rotate shared secrets); MFA reset requiring out-of-band verification; operator accounts (Supabase, hosting, Git, CI, registrar, email, storage) inventory with MFA.
**Dependencies:** ADMIN-001.
**Acceptance Criteria:** A new admin can be onboarded and offboarded following the runbook alone; an identity without an allowlist record cannot access admin.
**Testing:** Runbook dry run.

### ADMIN-010 — Users & Roles (RBAC Foundation)
**Area:** Admin/Security · **P2** · **V1.1** · **Size:** L
**Objective:** UI for user management and roles when a second role is required.
**Requirements:** User table, invite/disable, role assignment (Admin/Manager/Viewer), permission matrix, role-change audit and session termination, RLS parity. `Client` role only with a dedicated portal review.
**Dependencies:** ADMIN-002/008.
**Acceptance Criteria:** Permission changes take effect server-side without code changes; least privilege defaults; isolation tests pass before any Client role.
**Testing:** Full authorization matrix; IDOR tests.

### ADMIN-011 — Release Management Module
**Area:** Admin/OS · **P2** · **Future** · **Size:** L
**Objective:** Move release metadata to the database with admin publishing [02 §9.3 V1.1].
**Requirements:** Release/artifact editor, critical-action step-up, audit, revalidation, same repository interface as OS-002.
**Dependencies:** OS-002, ADMIN-008/010.
**Acceptance Criteria:** UI unchanged by the data-source switch; publishing/withdrawal audited.
**Testing:** Repository-contract tests against both implementations.

---

### 10.11 MOTION — Motion & Loading

### MOTION-001 — V1 Motion Set (Restrained)
**Area:** Motion · **P1** · **V1** · **Size:** M
**Objective:** Polished hover states, restrained transitions, essential motion [brief §17, 04 §26.2].
**Requirements:** Motion tokens only; section reveals (opacity/translate), hover/focus feedback, menu/panel transitions, theme cross-fade, ecosystem selection transitions; optional very slow field drift (CSS) disabled under reduced motion; transform/opacity only; no animation library.
**Dependencies:** CORE-003/005.
**Acceptance Criteria:** `prefers-reduced-motion` removes parallax/drift/scroll-linked effects; no motion-only information; no layout-affecting animation; CLS unaffected.
**Testing:** Reduced-motion tests; performance profiling.

### MOTION-002 — Loading Foundation
**Area:** Motion/Core · **P1** · **V1** · **Size:** S
**Objective:** Skeleton and loader-slot foundation [04 §28].
**Requirements:** Layout-matched skeletons; reserved media space; token-driven loader slot with `aria-busy` and reduced-motion handling; 3D/media loading states defined; no generic spinners on public pages.
**Dependencies:** CORE-005/011.
**Acceptance Criteria:** No layout shift during loading; skeleton shimmer disabled under reduced motion.
**Testing:** CLS checks; slow-network tests.

### MOTION-003 — Page & Shared-Element Transitions
**Area:** Motion · **P2** · **V1.1** · **Size:** M
**Requirements:** Route transitions (View Transitions API or equivalent `[VERIFY]`), portfolio shared-element transitions; progressive enhancement.
**Dependencies:** MOTION-001, PORT-003.
**Acceptance Criteria/Testing:** Works where supported, degrades gracefully, respects reduced motion; no navigation delay.

### MOTION-004 — HENU-Specific Loader & Richer Product Interactions
**Area:** Motion · **P2** · **V1.1** · **Size:** L
**Requirements:** Designed loading treatment filling the loader slot; richer product module interactions; reduced-motion variants; must never block content.
**Dependencies:** MOTION-002, PROD-002.
**Acceptance Criteria/Testing:** No increase in time-to-interactive beyond budget; accessibility and performance review.

---

### 10.12 SEO

### SEO-001 — Metadata System
**Area:** SEO · **P0** · **V1** · **Size:** M
**Objective:** Unique metadata for every page [brief §18].
**Requirements:** Title templates; descriptions; Open Graph/social (default + per-item image); canonical from a single site-URL config; dynamic metadata from content; admin SEO fields; fallbacks from Site Settings; content schema requires title/description.
**Dependencies:** CORE-008, ADMIN-007.
**Acceptance Criteria:** Every public page has unique title/description/canonical/OG; pages missing SEO fields cannot publish; share previews render correctly.
**Testing:** Automated metadata check across routes; share-preview validation.

### SEO-002 — Sitemap, Robots, Redirects & Indexing Rules
**Area:** SEO · **P0** · **V1** · **Size:** M
**Requirements:** Sitemap generated from published content; **robots environment-aware** (production allows; staging/preview blocks); admin and preview `noindex` and excluded; redirects on slug change (CORE-009); host/trailing-slash policy; 404/410 semantics.
**Dependencies:** CORE-009, ADMIN-002.
**Acceptance Criteria:** New published content appears in the sitemap automatically; drafts/archived/admin never appear; staging blocked; old URLs redirect.
**Testing:** Sitemap/robots tests per environment; redirect tests.

### SEO-003 — Structured Data, Semantic Headings & Internal Linking
**Area:** SEO/Content · **P1** · **V1** · **Size:** M
**Requirements:** JSON-LD where justified (Organization, SoftwareApplication for products, project/CreativeWork, Service) **only when it matches visible content**; heading hierarchy enforced; image alt text enforced via publish gate; generated related-content links (product ↔ service ↔ project); no keyword stuffing.
**Dependencies:** CORE-008, SEO-001.
**Acceptance Criteria:** Structured data validates and mirrors visible content; one `h1` per page; related links generated from relationships; no orphaned public pages.
**Testing:** Structured-data validation; heading-hierarchy lint; link crawl.

---

### 10.13 A11Y — Accessibility

### A11Y-001 — Accessibility Foundations
**Area:** A11Y · **P0** · **V1** · **Size:** M
**Requirements:** Landmarks, skip link, heading rules, two-tone focus system not obscured by sticky UI (WCAG 2.2 Focus Not Obscured), contrast verification both themes, decorative handling for fields/art, `lang`.
**Dependencies:** CORE-003/005.
**Acceptance Criteria:** AB met across shell and primitives; automated checks run in CI.
**Testing:** Automated accessibility checks; manual keyboard pass.

### A11Y-002 — Forms, Errors, Dialogs & Menus
**Area:** A11Y · **P0** · **V1** · **Size:** M
**Requirements:** Persistent labels; programmatic hint/error association; error summary with focus management; autocomplete attributes; redundant-entry avoidance; dialogs/menus with focus trap, Escape, focus return; accessible authentication (paste/password manager, no cognitive tests); consistent help location.
**Dependencies:** CORE-005, CONTACT-002, ADMIN-001.
**Acceptance Criteria:** Enquiry form and admin sign-in fully operable by keyboard and screen reader; errors announced and focus moved correctly.
**Testing:** Screen-reader walkthroughs (enquiry, sign-in, mobile menu).

### A11Y-003 — Reduced Motion, Target Size & Reflow
**Area:** A11Y · **P0** · **V1** · **Size:** S
**Requirements:** Reduced-motion handling site-wide (`motion-scale`); targets ≥ 24px minimum / 44px recommended; 200% zoom and 320px reflow; no hover-only content; pausable motion > 5s.
**Dependencies:** MOTION-001, RAB.
**Acceptance Criteria:** Verified on key templates; no loss of content/function at 200% zoom.
**Testing:** Manual zoom/reflow tests; reduced-motion toggle tests.

### A11Y-004 — Accessibility Audit & Remediation
**Area:** A11Y · **P0** · **V1** · **Size:** M
**Requirements:** Pre-launch automated + manual audit of public templates and admin critical flows; findings tracked to closure; documented known gaps with owners.
**Dependencies:** All public features.
**Acceptance Criteria:** No open critical/serious findings at launch; remaining items documented and scheduled.
**Testing:** Audit report.

---

### 10.14 PERF — Performance

### PERF-001 — Performance Budgets & Measurement Baseline
**Area:** Performance · **P0** · **V1** · **Size:** M
**Requirements:** Establish baseline on staging; define per-route JavaScript, image weight and Core Web Vitals thresholds from the baseline and published standards `[REQUIRES CONFIRMATION]`; enforce in CI; field monitoring (platform real-user metrics); mid-range mobile as reference.
**Dependencies:** First deployable pages (end of Phase 1).
**Acceptance Criteria:** Documented budgets; CI fails on regression beyond budget; field data collection active before launch.
**Testing:** CI budget checks; lab + field comparison.

### PERF-002 — Image & Media Optimisation
**Area:** Performance · **P0** · **V1** · **Size:** M
**Requirements:** Responsive images/formats via pipeline; single priority LCP image per page; lazy loading elsewhere; video facades; no background video in base design; media size budgets.
**Dependencies:** CORE-010.
**Acceptance Criteria:** No unoptimised original served; below-the-fold media lazy; CLS from media = 0 on key pages.
**Testing:** Lighthouse; network audit.

### PERF-003 — Client JavaScript Minimisation & Code Splitting
**Area:** Performance · **P0** · **V1** · **Size:** M
**Requirements:** Client islands limited to: theme switch, mobile menu/panels, portfolio filter, enquiry form, ecosystem interactivity, optional on-click Calendly/3D loaders; dynamic imports for heavy widgets; dependency review for any new client library.
**Dependencies:** CORE-005.
**Acceptance Criteria:** Informational pages ship no unnecessary client JS; bundle report reviewed at each phase gate.
**Testing:** Bundle analysis in CI.

### PERF-004 — Caching & CDN Configuration
**Area:** Performance/Ops · **P0** · **V1** · **Size:** M
**Requirements:** Explicit caching configuration; hashed assets immutable; tag-based revalidation verified; admin/preview `no-store`; download origin cache rules (OS-003); header policy per hostname.
**Dependencies:** CORE-009, OPS-002.
**Acceptance Criteria:** Cache headers verified per route class; published change visible within the agreed revalidation behaviour; admin never cached.
**Testing:** Header inspection; revalidation tests.

### PERF-005 — Pre-Launch Core Web Vitals & Motion Performance Verification
**Area:** Performance · **P0** · **V1** · **Size:** M
**Requirements:** Verify budgets on production-like environment; animation profiling (transform/opacity only); low-end mobile checks; fix or formally accept deviations.
**Dependencies:** PERF-001..004, MOTION-001.
**Acceptance Criteria:** Budgets met or documented exceptions approved by the product owner.
**Testing:** Lab/field report.

---

### 10.15 SEC — Security

### SEC-001 — Secrets & Configuration Hygiene
**Area:** Security · **P0** · **V1** · **Size:** M
**Requirements:** Secrets only in platform/CI stores; per-environment secrets; secret scanning with push protection (repo + CI); bundle/source-map leak scan; rotation procedure documented and rehearsed once; secrets/access inventory.
**Dependencies:** CORE-002.
**Acceptance Criteria:** Seeded test secret is blocked by push protection/CI; no secret in client bundle or logs; rotation rehearsal recorded.
**Testing:** Scanning drills; case 24 of [03 §41].

### SEC-002 — Security Headers & CSP
**Area:** Security · **P0** · **V1** · **Size:** M
**Requirements:** HSTS (staged), `nosniff`, Referrer-Policy, Permissions-Policy, frame protection; CSP **Report-Only → enforce** for public (hash for theme script, allowlist only required origins); strict nonce CSP for admin; separate policies for site, admin, download origin; header checks in CI.
**Dependencies:** CORE-003, ADMIN-002, OPS-002.
**Acceptance Criteria:** Headers present per hostname; admin has no inline-script allowance beyond nonce; CSP violations monitored; no functional breakage (theme, Calendly if embedded).
**Testing:** Header test suite; manual functionality pass.

### SEC-003 — Validation, CSRF/Origin Verification & XSS Controls
**Area:** Security · **P0** · **V1** · **Size:** L
**Requirements:** Schema validation at every action/handler boundary; Origin verification on all cookie-authenticated mutations (framework protections verified for the version `[VERIFY]`; explicit checks for Route Handlers); no state change on GET; escaped rendering; sanitisation only where unavoidable; lint rules for unsafe sinks; safe URL handling; open-redirect allowlists.
**Dependencies:** CORE-007/008.
**Acceptance Criteria:** Forged cross-origin mutation requests are rejected; XSS payloads inert in every render path; unknown fields rejected; no raw-HTML rendering outside approved exceptions.
**Testing:** Cases 8–13, 30 of [03 §41].

### SEC-004 — Rate Limiting & Anti-Abuse Infrastructure
**Area:** Security · **P0** · **V1** · **Size:** M
**Requirements:** **Shared-store** limiter (serverless-safe; provider `[REQUIRES CONFIRMATION]`) for admin sign-in/recovery and enquiry; edge/platform baseline rules; progressive backoff (no permanent lockout); client IP only from trusted proxy header; defined fail-open/closed behaviour; limits calibrated from baseline (none invented); monitoring of triggers.
**Dependencies:** CORE-002, OPS-002.
**Acceptance Criteria:** Limits hold across multiple instances; auth endpoints fail closed; enquiry degrades safely; legitimate users unaffected under normal use.
**Testing:** Multi-instance load tests; cases 14, 16, 40.

### SEC-005 — Supabase Configuration & RLS Verification
**Area:** Security/Data · **P0** · **V1** · **Size:** M
**Requirements:** Sign-ups disabled; MFA enabled; token rotation/reuse detection; redirect allowlist; exposed schemas minimised; grants revoked; **enquiry write path decision implemented (insert-only role preferred)**; storage buckets private by default; elevated key confined to specific server functions; automated anon-access test suite; configuration review checklist signed off.
**Dependencies:** CORE-006, ADMIN-001.
**Acceptance Criteria:** Anon/authenticated roles cannot read or write any application table or private bucket; public intake cannot read enquiries; documented review completed pre-launch and after schema/auth changes.
**Testing:** Cases 24–26 of [03 §41]; automated suite in CI.

### SEC-006 — File Upload Security (Admin Media)
**Area:** Security · **P0** · **V1** · **Size:** M
**Requirements:** Type allowlist by content inspection (images only in V1; SVG excluded/sanitised); size limits and quotas; random storage keys; discard client filename for storage; path-traversal prevention; metadata stripping; decompression-bomb limits; separate cookieless origin with `nosniff`; authorization on upload and read; rate limits; malware scanning only if non-image/untrusted uploads are ever introduced.
**Dependencies:** CORE-010, ADMIN-002.
**Acceptance Criteria:** Disguised executables/HTML/SVG-with-script rejected; traversal strings have no effect; unauthorised upload attempts denied; served media cannot execute in the app origin.
**Testing:** Cases 19–20 of [03 §41]; fuzz uploads.

### SEC-007 — Logging, Redaction & Alerting
**Area:** Security/Ops · **P0** · **V1** · **Size:** M
**Requirements:** Structured logs with correlation IDs; redaction helper (passwords, tokens, cookies, keys, message bodies, full emails); security-event alerts (admin-auth failure bursts, refresh-token reuse, authorization-denial spikes, rate-limit triggers, enquiry pipeline failures, secret-scan hits); named alert owner `[REQUIRES CONFIRMATION]`; retention defined `[REQUIRES CONFIRMATION]`; error-tracking scrubbing.
**Dependencies:** OPS-004.
**Acceptance Criteria:** Logs contain no secrets/PII bodies (verified by test); alerts reach the owner; error reports omit cookies/headers/bodies.
**Testing:** Log redaction tests; alert drill.

### SEC-008 — Dependency, Source & CI Security
**Area:** Security/Ops · **P0** · **V1** · **Size:** M
**Requirements:** Dependency scanning on PR and schedule; severity-based response policy; lockfile enforcement; branch protection, required reviews, CODEOWNERS on sensitive paths; MFA on all repository/CI/hosting accounts; CI default permissions read-only, production secrets unavailable to PR builds; third-party CI actions pinned; manual production approval; scoped migration credential; static analysis (pattern lint + code scanner where practical).
**Dependencies:** OPS-001.
**Acceptance Criteria:** A vulnerable dependency PR is blocked per policy; direct pushes to `main` are impossible; PR builds cannot read production secrets.
**Testing:** Pipeline policy tests; case 36–37.

### SEC-009 — Pre-Launch Security Review & Incident Readiness
**Area:** Security · **P0** · **V1** · **Size:** M
**Requirements:** Execute the security test cases in [03 §41] that apply to V1; complete the production checklist [03 §47]; DNS/registrar hardening confirmed; incident contacts/roles, release-withdrawal procedure and advisory template, rollback/rotation rehearsals; disclosure contact decision `[REQUIRES CONFIRMATION]`; findings tracked to closure.
**Dependencies:** All V1 security tickets.
**Acceptance Criteria:** No open critical/high findings; checklist items for V1 marked complete with evidence; rehearsals recorded.
**Testing:** Review report.

---

### 10.16 TEST

### TEST-001 — Test Infrastructure, Unit & Integration Suites
**Area:** Testing · **P0** · **V1** · **Size:** L
**Requirements:** Unit runner; component tests with accessibility assertions; integration tests against a local/ephemeral Supabase/Postgres; synthetic test data only; mocks for email/anti-bot; suites for validation schemas, publish gate, release derivation/validation, services, slug-redirects, revalidation, enquiry pipeline stages.
**Dependencies:** CORE-001/006/007.
**Acceptance Criteria:** Suites run in CI on every PR; flaky tests are fixed or removed; no production data used.
**Testing:** (is itself the test infrastructure) CI evidence.

### TEST-002 — End-to-End Journeys
**Area:** Testing · **P0** · **V1** · **Size:** L
**Requirements:** Automated E2E (real browser) for: (1) homepage navigation; (2) products; (3) services; (4) portfolio; (5) portfolio admin workflow; (6) product admin workflow; (7) service admin workflow; (8) enquiry submission (valid, invalid, failure); (9) Calendly action; (10) theme switch/persistence; (11) responsive mobile navigation; (12) admin authentication (incl. MFA and denial paths); plus draft-not-public, slug redirect, sitemap/robots per environment, 404/error pages.
**Dependencies:** Relevant feature tickets.
**Acceptance Criteria:** All journeys pass against preview/staging; run on every PR (critical subset) and before release (full).
**Testing:** CI reports.

### TEST-003 — Authorization & Security Test Suite
**Area:** Testing/Security · **P0** · **V1** · **Size:** M
**Requirements:** Authorization matrix tests for every admin entry point (direct action calls, unauthenticated, non-admin, single-factor, expired/revoked session); RLS/anon tests; injection/XSS/CSRF/rate-limit regression tests; upload abuse tests.
**Dependencies:** ADMIN-002, SEC-003..006.
**Acceptance Criteria:** Every admin Server Action/handler is covered by a negative test; the suite blocks merge on failure.
**Testing:** CI.

### TEST-004 — Responsive & Cross-Browser QA Matrix
**Area:** Testing/QA · **P0** · **V1** · **Size:** M
**Requirements:** RAB executed per page template at 360/768/1024/1440+; real-device checks on representative phones/tablets `[REQUIRES CONFIRMATION: device list]`; supported browser matrix `[REQUIRES CONFIRMATION]`; automated visual regression **V1.1**; mobile verified at each phase, **not only at the end**.
**Dependencies:** Each page ticket.
**Acceptance Criteria:** RAB signed off per template per phase; no known overflow/overlap defects at launch.
**Testing:** QA report.

---

### 10.17 OPS

### OPS-001 — CI Pipeline
**Area:** Ops · **P0** · **V1** · **Size:** M
**Requirements:** PR checks: lint, type check, unit/integration, content/release validation, build, bundle secret scan, dependency scan, accessibility checks; preview deployment per PR; E2E on preview; staging on merge; manual production promotion; migration step with scoped credential.
**Dependencies:** CORE-001/002.
**Acceptance Criteria:** All checks required to merge; previews use staging-class backends; production deploy requires approval and is attributable.
**Testing:** Pipeline dry runs.

### OPS-002 — Hosting, Domains, TLS, DNS & Email DNS
**Area:** Ops · **P0** · **V1** · **Size:** M
**Requirements:** Hosting decision (Vercel recommended; `[REQUIRES CONFIRMATION]`); apex domain and subdomains (artifact/media origin as needed); HTTPS-only with HTTP redirect; managed certificates with expiry monitoring; registrar MFA and lock; DNS access restricted; SPF/DKIM/DMARC; dangling records removed; budget/spend alerts on usage-based services.
**Dependencies:** Decisions Q2, Q7.
**Acceptance Criteria:** All hostnames HTTPS-only with HSTS per SEC-002; email authentication passes; DNS/registrar access reviewed.
**Testing:** TLS/header scans; email authentication test.

### OPS-003 — Backups & Restore Drill
**Area:** Ops · **P0** · **V1** · **Size:** S
**Requirements:** Database backup plan/PITR decision `[REQUIRES CONFIRMATION: plan, RPO/RTO]`; repository mirror; second copy of media masters and release artifacts; restore test into an isolated environment **before launch**; runbooks (DB restore, app rollback, DNS recovery, secret rotation).
**Dependencies:** CORE-006, OPS-002.
**Acceptance Criteria:** Restore completed and verified with recorded time; runbooks exist; backup failure alerts configured.
**Testing:** Restore drill.

### OPS-004 — Monitoring & Alerting
**Area:** Ops · **P0** · **V1** · **Size:** M
**Requirements:** Error tracking (provider `[REQUIRES CONFIRMATION]`) with PII scrubbing; uptime/synthetic checks (key routes, enquiry flow, artifact origin if public); real-user Core Web Vitals; DB/CDN metrics; certificate expiry; alert routing to a named owner.
**Dependencies:** OPS-002.
**Acceptance Criteria:** A forced error and a forced downtime both alert the owner; dashboards reachable by the team.
**Testing:** Alert drills.

### OPS-005 — Content Preparation, Seed & Migration
**Area:** Ops/Content · **P0** · **V1** · **Size:** L
**Objective:** Ensure real content exists in the system before launch (§25).
**Requirements:** Collect and verify content inputs (§25); seed scripts for initial content via the same services as the admin (so validation/gates apply); legal pages through legal review; brand assets (logos light/dark, colours) integrated; media prepared and uploaded with alt text; placeholders resolved or content omitted.
**Dependencies:** Inputs from HENU.
**Acceptance Criteria:** No `[REQUIRES CONFIRMATION]` marker remains in published content; every published claim traces to a source; legal pages reviewed.
**Testing:** Content audit checklist signed by owners.

### OPS-006 — Launch Readiness, Runbooks & Go-Live
**Area:** Ops · **P0** · **V1** · **Size:** M
**Requirements:** Launch checklist (§24 DoD, security checklist, accessibility, performance, SEO, content, backups); production smoke tests; DNS cutover plan; rollback plan; hypercare monitoring period; post-launch review.
**Dependencies:** All V1 tickets.
**Acceptance Criteria:** Go/no-go criteria met and recorded; production behaviour verified (§23); rollback rehearsed.
**Testing:** Smoke tests in production; post-launch review.

---

## 11. Motion / 3D Roadmap (Separation of Phases)

| Phase | Included | Tickets |
|-------|---------|---------|
| **V1** | Polished hover/focus states; restrained section reveals; menu/panel transitions; theme cross-fade; ecosystem selection transitions; skeleton and basic loading states; optional CSS-only field drift; reduced-motion support | MOTION-001, MOTION-002, A11Y-003 |
| **V1.1 / Refinement** | Page and shared-element transitions; richer scroll storytelling; 3D/GLB experiences; advanced portfolio transitions and filters; HENU-specific loader; richer product interactions | MOTION-003, MOTION-004, ABOUT-003, PORT-004 |
| **Future** | Interactive HENU OS preview; advanced product visualisation; further 3D | Unticketed |

**Rule:** no V1.1 visual item may delay V1. Foundation hooks (loader slot, skeletons, About structure, ecosystem component) are built in V1 so refinement does not require restructuring.

---

## 12. UI/UX Refinement During Development

The design specification is the **foundation**. During build, the team **may refine**: spacing, visual balance, animation timing, image treatment, section composition, mobile layouts, 3D placement, page transitions, loaders, micro-interactions.

**Refinement process:** changes within tokens/templates need design-lead approval in the pull request; changes to foundational decisions (below) need product-owner approval and a note in the decision log.

**Foundational (do not change casually):** light-first default; six-item navigation; ecosystem positioning; responsive public website; web-only Admin; dynamic-content architecture with central design control; no service pricing; Products/Services/Portfolio separation; accessibility and performance constraints; content authenticity rules.

---

## 13. Mobile Public Website Requirements

- **Every public ticket cites RAB** and is verified at 360/768/1024/1440+ **within its own phase** (TEST-004), not as a final QA step.
- Mobile-specific designs required before build: navigation panel, home opening, ecosystem stack, product blocks, services index, portfolio list and gallery, About chapters (3D deferred), contact path selector and form, footer.
- Mobile is the **primary performance reference** (PERF-001/005).
- Gestures always have visible alternatives; no hover-dependent function.
- **No mobile Admin application** is planned; Admin is optimised for desktop-class screens and remains functional on tablets.

---

## 14. Security-to-Task Translation (Index)

| Security requirement [03] | Ticket(s) |
|---------------------------|-----------|
| Authentication, MFA, sessions, cookies (§6–8) | ADMIN-001 |
| Authorization (§9–10) | ADMIN-002, ADMIN-010 (future) |
| Input validation, SQLi, XSS, CSRF (§12–15) | CORE-007/008, SEC-003 |
| Headers/HTTPS (§16–17) | SEC-002, OPS-002 |
| Rate limiting & spam (§18–19, §38) | SEC-004, CONTACT-002 |
| File uploads (§20) | SEC-006, ADMIN-006, CORE-010 |
| HENU OS download security (§21) | OS-002, OS-003, OS-004 |
| Database & Supabase (§22–23) | CORE-006, SEC-005 |
| Secrets (§24) | SEC-001, CORE-002 |
| API/CORS/errors (§25–27) | CORE-011, SEC-003 (no public API in V1) |
| Logging & auditing (§28, §39) | SEC-007, ADMIN-008 |
| Content security (§30) | CORE-008 |
| Third parties (§31) | CONTACT-003/004, OPS-002/004 |
| Dependencies, source, CI (§32–34) | SEC-008, OPS-001 |
| Backup & recovery (§35) | OPS-003 |
| DoS/availability (§36) | PERF-004, SEC-004, OPS-002 |
| Privacy (§37) | CONTACT-002, OPS-005 |
| Admin actions (§39) | ADMIN-002/007/008 |
| Testing & incident response (§40–42) | TEST-003, SEC-009 |

---

## 15. Implementation Notes: Alignment of Documents

- **Routes** follow doc 02 conventions: lowercase, hyphenated, stable slugs; dynamic routes only for content collections; admin in an isolated route group.
- **Directory placement** follows doc 02 §10 (`components/ui|layout|features`, `server/services|repositories|db|auth|integrations`, `content/` for static content such as legal pages and release data, `supabase/` migrations).
- **Repository interfaces** allow Release data to move from Git to the database without UI change (OS-002 → ADMIN-011).
- **Design tokens** are the only source of visual values (CORE-003).
- **No public API** is created without a consumer (02 §29).

---

## 16. Phased Development Roadmap

### 16.1 Phase ordering and rationale

The recommended structure was **reordered** where dependencies require it:

1. **Content engine and admin shell move early** (Phase 1) because every public page reads admin-managed content.
2. **Each domain's admin module is delivered with its public pages** (vertical slices) because the content schema and editor are tightly coupled; the final admin phase completes the remaining modules.
3. **Home is split:** the opening is built early; the full assembly happens after the domain pages exist.
4. **Security, accessibility, performance and responsive checks occur continuously** and are *verified* in Phase 7 rather than introduced there.

Relative sizing only (no durations) `[REQUIRES CONFIRMATION: team size, capacity]`.

### 16.2 Phases

| Phase | Name | Scope (tickets) | Exit criteria | Relative size |
|-------|------|-----------------|---------------|---------------|
| **0** | **Foundation** | CORE-001, 002, 006, 007; OPS-001; SEC-001; ADMIN-001 (auth foundation incl. MFA configuration, early because of lead time); SEC-005 (initial Supabase config); TEST-001 (infra) | Repo builds with enforced boundaries; environments isolated; migrations + RLS baseline pass anon-access test; CI runs; admin sign-in with MFA works on staging | L |
| **1** | **Public Foundation & Content Engine** | CORE-003, 004, 005, 008, 009, 010, 011; NAV-001..003; HOME-001; ADMIN-002, 003, 006 (media), 007 (settings), 008 (audit write); SEC-002, 006; MOTION-002; PERF-001 (baseline); A11Y-001; OPS-002 (hosting/DNS foundation) | Shell + theme + navigation responsive and accessible; a seeded page renders from the DB; draft/publish/preview/revalidation/redirects work; media upload secure; admin shell guarded and tested | XL |
| **2** | **Products** | PROD-001..006; HOME-002; OS-001; OS-002; (OS-003 if public release) | Four product pages render from admin-managed data; Product admin workflow E2E passes; HENU OS page complete without unconfirmed specs | XL |
| **3** | **Services** | SERV-001..004 | Services index + detail from catalogue; sensitive-service governance complete; no price content; Service admin workflow E2E passes | L |
| **4** | **Portfolio** | PORT-001..003 | Dynamic portfolio verified at 0/1/N projects; draft/archived never public; Portfolio admin workflow E2E passes | L |
| **5** | **About + Contact** | ABOUT-001, 002; CONTACT-001..005; SEC-003, 004 (full); A11Y-002 | Enquiry end-to-end secure and reconciled; Calendly works; About foundation complete; Enquiry management usable | XL |
| **6** | **Home Assembly & Admin Completion** | HOME-003; ADMIN-004, 005, 009; MOTION-001; SEO-001, 003 (content-driven parts) | Home fully dynamic and composed at all widths; Dashboard and Home management complete; admin provisioning runbook tested | M |
| **7** | **Hardening & Launch Readiness** | SEO-002; A11Y-003, 004; PERF-002..005; SEC-007, 008, 009; TEST-002, 003, 004 (full); OPS-003, 004, 005, 006 | All V1 DoD items met; security review complete; accessibility audit closed; budgets met; restore drill done; content audited; go-live executed | L |
| **8** | **Visual Refinement & V1.1** (post-launch) | MOTION-003, 004; ABOUT-003; PORT-004; OS-004; ADMIN-010; ADMIN-008 (viewer); visual regression; analytics decision; supporting content | Enhancements delivered without regressions to AB/PB/SECB | L–XL |

*Content preparation (OPS-005) runs **in parallel from Phase 0** and is on the critical path for Phases 2–5.*

### 16.3 Milestones

| Milestone | Reached when |
|-----------|--------------|
| **M0 — Walking skeleton** | A seeded page is served from the DB through the layered architecture on staging, behind CI |
| **M1 — Content engine live** | Admin can draft, preview, publish, and revalidate content with media on staging |
| **M2 — Ecosystem complete** | Products and HENU OS complete, with Product admin |
| **M3 — Commercial surface complete** | Services and Portfolio complete with admin modules |
| **M4 — Conversion complete** | About, Contact, enquiry pipeline and Enquiry management complete |
| **M5 — Feature complete** | Home assembled; Admin V1 modules complete |
| **M6 — Launch candidate** | Hardening exit criteria and DoD met |
| **M7 — Launch** | Go-live criteria met, production verified |

### 16.4 Critical path

`CORE-006/007 → CORE-008 → CORE-009/010 → ADMIN-001/002/003 → domain modules + public pages → CONTACT pipeline → hardening → launch`, with **content readiness (OPS-005)** and **legal review** as external gating dependencies.

### 16.5 Risks to the roadmap

| Risk | Mitigation |
|------|-----------|
| Content not ready (catalogue, product facts, projects, assets) | Start OPS-005 immediately; design empty/sparse states; publish gate prevents placeholders going live; omit rather than invent |
| Admin scope creep toward a CMS | Fixed templates + allow-listed blocks; new block types are dev tasks; scope control (§26) |
| Late discovery of platform limits (Supabase plan features, rate-limit store, CSP vs static) | Resolve Q-items before Phase 1 exit; spike CSP + theme script early |
| Visual ambition delaying V1 | V1.1 separation (§11); foundation hooks only |
| Mobile fixes at the end | RAB per ticket and per phase |
| Security work deferred | Security tickets embedded in phases; SECB in DoD |
| Product readiness uncertainty (AI/PA/IDE/OS release) | Product pages data-driven with honest status; conditional tickets |
| Small team capacity unknown | Relative sizing; phase gates allow descoping P1/P2 |

---

## 17. Testing Strategy

| Layer | Scope | Tickets |
|-------|-------|---------|
| **Static analysis** | Types, lint, import boundaries, token lint, unsafe-sink rules | CORE-001 |
| **Unit** | Validation schemas, publish-gate rules, release derivation/validation, slug/redirect logic, authorization guard, redaction helper, rate-limit logic | TEST-001 |
| **Component** | Primitives and patterns with accessibility assertions; states per [04 §25] | CORE-005, TEST-001 |
| **Integration** | Services + repositories + DB (local Postgres/Supabase): enquiry pipeline, content CRUD + publish/revalidate, RLS/anon denial, audit writes, media validation | TEST-001, TEST-003 |
| **E2E (real browser)** | The twelve required journeys + draft-not-public, redirects, sitemap/robots, error pages | TEST-002 |
| **Security** | Authorization matrix, injection/XSS/CSRF/rate-limit/upload abuse, secrets leakage | TEST-003, SEC-009 |
| **Accessibility** | Automated in CI + manual keyboard/screen-reader on critical flows | A11Y-001..004 |
| **Responsive/cross-browser** | RAB at four widths, real devices | TEST-004 |
| **Performance** | Budgets in CI; lab + field CWV | PERF-001, 005 |
| **Content** | Content audit (no placeholders, sources, no price text) | OPS-005 |

**Required E2E journeys (12):** (1) homepage navigation; (2) products; (3) services; (4) portfolio; (5) portfolio admin workflow; (6) product admin workflow; (7) service admin workflow; (8) enquiry submission; (9) Calendly action; (10) theme switch; (11) responsive mobile navigation; (12) admin authentication.

**Principles:** synthetic test data only; third-party services mocked in automation; critical-subset E2E on every PR, full suite pre-release; flaky tests fixed or removed; coverage is a signal, not a target.

---

## 18. Definition of Done

A feature is **done** only when all applicable items are true:

| # | Criterion |
|---|-----------|
| 1 | **Requirements work** as specified; acceptance criteria demonstrated |
| 2 | **Responsive behaviour** meets RAB on all four widths |
| 3 | **Accessibility** meets AB; automated checks pass; manual keyboard pass done |
| 4 | **Loading, error and empty states** exist (SB) |
| 5 | **Security** requirements met (SECB), including authorization tests for any privileged operation |
| 6 | **Tests** written and passing (unit/component/integration/E2E as applicable) |
| 7 | **SEO** handled (SEOB) for public pages |
| 8 | **Performance** acceptable (PB; budgets once defined) |
| 9 | **Content integrity:** no placeholders, no invented facts, publish gate rules satisfied |
| 10 | **Both themes** verified (light default, dark parity) |
| 11 | **Code reviewed** per branch protection; no new lint/type errors; dependencies justified |
| 12 | **Documentation** updated (component catalogue, runbooks, README) as applicable |
| 13 | **Deployed to staging** and verified; **production behaviour verified** after release (smoke test) |

---

## 19. V1 Scope

### 19.1 V1 required

- Responsive public website (desktop, tablet, mobile), **light default**, dark optional with switch.
- Home, Services (+ detail), Products (hub, HENU OS, AI, PA, IDE per readiness), Portfolio (+ detail), About, Contact.
- **Dynamic content** for Home, Services, Products, Portfolio, About, Site Settings.
- **Dynamic portfolio** with draft/publish/archive/delete.
- Enquiry pipeline (validation, spam protection, persistence, notification, admin review).
- Calendly meeting action.
- **Admin Web foundation:** auth + mandatory MFA, guarded shell, dashboard, Home/Services/Products/Portfolio/About/Enquiry management, media library, site settings, audit writes.
- HENU OS release block and download origin **only if a public release exists at launch**; otherwise an honest status state.
- Security controls (§14), SEO, accessibility (WCAG 2.2 AA where practical), performance budgets, monitoring, backups, restore drill.

### 19.2 V1.1

Page/shared-element transitions; richer scroll storytelling and 3D/GLB; HENU-specific loader; advanced portfolio filters/interactions; audit-log viewer; Users & Roles UI (RBAC foundation); release integrity monitoring and signing; edit-conflict handling and content revision history; automated visual regression; privacy-preserving analytics (decision-gated); supporting content pages (documentation entry, release detail, security/disclosure page); dedicated support intake; additional products/services/projects.

### 19.3 Future

Payment gateway; client/developer/community portals; Admin Releases module; documentation platform and blog; advanced 3D/interactive OS preview; sophisticated loaders and advanced animation; advanced content systems (page builder is **not** planned); multilingual website `[REQUIRES CONFIRMATION]`; standalone Node.js API and ecosystem integrations (on documented extraction triggers); enterprise RBAC and separation-of-duties approvals.

---

## 20. Scope Control — What Not to Build in V1

| Do not build | Reason | Revisit when |
|--------------|--------|-------------|
| Mobile Admin application | Out of scope; Admin is web-only | Never without a confirmed requirement |
| Payment gateway, checkout, pricing tables/packages | No public pricing; payment is a future phase | Business decision |
| Custom calendar/booking system | Calendly is the destination | Calendly insufficient |
| Enterprise RBAC / permission matrix UI | Single role; permissions-by-name architecture suffices | Second privileged role confirmed |
| Page builder / CSS or HTML editing | Design is centrally controlled; allow-listed blocks only | Never as free-form |
| Microservices, Kubernetes, queues, event buses | No requirement; managed hosting | Documented extraction triggers (02 §3.3) |
| Public API / GraphQL | No consumer | A confirmed external consumer |
| Real-time features (WebSockets, live updates) | No requirement | Concrete live feature |
| Complex analytics platform, tracking, heatmaps | Privacy/scope; use platform field metrics | Decision Q17 |
| Decorative AI chatbot / website assistant | No confirmed value | Future with clear purpose |
| Public file uploads | Out of scope; security surface | Confirmed requirement + security review |
| Documentation platform, blog, community portal | Not in primary navigation or V1 | Phase after launch |
| Unnecessary third-party integrations/scripts | Performance, privacy, CSP | Justified request |
| Excessive animation, heavy WebGL on initial load | Performance, accessibility | V1.1 with budgets |
| Custom CMS framework / headless CMS adoption | Admin modules cover needs | Editorial volume justifies |
| Multilingual/i18n framework | Not confirmed | Confirmed requirement |
| Release management UI, signing infrastructure | Git-tracked in V1; signing later | V1.1/Future |
| Fabricated testimonials, metrics, counters, specifications | Content authenticity | Only with verified sources |

---

## 21. Content Preparation Checklist (Pre-Development)

Content gathering **starts immediately** (OPS-005). Each item needs an **owner** and **approval**. If missing at the time it is needed: `[REQUIRES CONFIRMATION]` — build with sparse/omitted states; do not invent.

| # | Content / asset | Needed for | Owner `[REQUIRES CONFIRMATION]` | Status |
|---|----------------|-----------|-------------------------------|--------|
| 1 | **Official product descriptions** (HENU OS, AI, PA, IDE): what it is, who it is for, problem addressed, confirmed capabilities, ecosystem relationships | Products, Home, About | | Not provided |
| 2 | **Product status** (available/beta/in development/coming soon) and CTA for each | Products, OS | | Not provided |
| 3 | **Product media:** real screenshots/recordings, any GLB, approved illustrations | Products, About | | Not provided |
| 4 | **HENU OS release information** (if public): versions, channels, architectures, requirements, artifacts, checksums, release notes | OS-002/003 | | Not provided |
| 5 | **Service catalogue:** categories, descriptions, capabilities, benefits, outcomes, supporting information | Services | | Supplied to HENU's team; to be transcribed |
| 6 | **Disclaimers/expectation wording** for Legal Services, Funding Solutions, Documentation & Startup Services | Services | | Not provided |
| 7 | **Portfolio projects** (HENU Housing Accounting ERP, HENU WhatsApp Automation, HENU Mail, others): descriptions, categories, technologies, images, status, permissions, any verified outcomes | Portfolio | | Not provided |
| 8 | **About content:** origin, how HENU builds, verified timeline, people/values if desired | About | | Not provided |
| 9 | **GLB 3D assets** with subject, licence and size | About/3D (V1.1) | | Provided to design team? `[REQUIRES CONFIRMATION]` |
| 10 | **Official logo files** (light/dark variants, SVG), brand colours, any brand guidelines | Brand, tokens | | Not provided |
| 11 | **Contact information:** email, location/address, social links | Contact, footer | | Not provided |
| 12 | **Calendly URL** | Contact | | Not provided |
| 13 | **Legal content:** Privacy Policy, Terms, consent wording; legal review | Legal pages, enquiry form | | Not provided |
| 14 | **Homepage statement and header CTA label** | Home, header | | Not provided |
| 15 | **Evidence statements** that HENU can verify (no numbers without source and owner) | Home evidence, About | | Not provided |
| 16 | **Notification recipients** and response expectations | Contact | | Not provided |
| 17 | **Vendor/account decisions:** hosting, email provider, error tracking, rate-limit store, object storage | OPS | | Not decided |
| 18 | **Domain registrar/DNS access** and ownership | OPS-002 | | Not provided |

---

## 22. Master Feature Table

Status for all items: **Not Started**.

| ID | Feature | Area | Priority | Version | Dependencies | Acceptance Criteria (summary) | Status |
|---|---|---|---|---|---|---|---|
| CORE-001 | Repository, tooling & architectural boundaries | Core | P0 | V1 | — | Clean frozen install; boundary/lint violations fail CI; README | Not Started |
| CORE-002 | Environments & configuration | Core/Ops | P0 | V1 | CORE-001 | Env validation fails fast; no public-prefixed secrets; staging noindex | Not Started |
| CORE-003 | Design tokens & theming (light default) | Core/UI | P0 | V1 | CORE-001 | Light default; token-only styling; AA contrast both themes; no theme flash | Not Started |
| CORE-004 | Typography & font loading | Core/UI | P0 | V1 | CORE-003 | Self-hosted; no CLS; display font not for body | Not Started |
| CORE-005 | UI primitives library | Core/UI | P0 | V1 | CORE-003/004 | All states; AB met; documented | Not Started |
| CORE-006 | Database foundation & RLS baseline | Core/Data | P0 | V1 | CORE-001/002 | Migrations clean; anon denied everywhere; constraints enforced | Not Started |
| CORE-007 | Service/repository layering & validation | Core | P0 | V1 | CORE-001/006 | Layers demonstrated; unknown fields rejected; DB access only in repositories | Not Started |
| CORE-008 | Structured content model, renderer & publish gate | Core/Content | P0 | V1 | CORE-007 | No raw HTML; each gate rule blocks with message | Not Started |
| CORE-009 | Static generation, revalidation, preview, redirects | Core/Perf | P0 | V1 | CORE-007/008, ADMIN-002 | Publish appears without redeploy; drafts private; slug redirects | Not Started |
| CORE-010 | Media pipeline & image component | Core/Media | P0 | V1 | CORE-006, SEC-006 | Responsive variants; no CLS; alt text enforced | Not Started |
| CORE-011 | Error, loading & system pages | Core | P0 | V1 | CORE-005 | Safe error pages; no internals; SB met | Not Started |
| NAV-001 | Header & primary navigation | Navigation | P0 | V1 | CORE-005, NAV-002 | Six items; RAB/AB; focus never obscured | Not Started |
| NAV-002 | Theme switch | Navigation | P0 | V1 | CORE-003 | Persisted; state announced; default light | Not Started |
| NAV-003 | Footer | Navigation | P0 | V1 | CORE-005, ADMIN-007 | Settings-driven; no broken links; RAB/AB | Not Started |
| HOME-001 | Home opening & shell | Home | P0 | V1 | CORE-003..005, NAV-001 | Static field; fast LCP; RAB/AB/PB | Not Started |
| HOME-002 | Ecosystem model component | Home/Products | P0 | V1 | CORE-005, PROD-006 | Data-driven; keyboard operable; confirmed relationships only | Not Started |
| HOME-003 | Home assembly & dynamic slots | Home | P0 | V1 | HOME-001/002, PROD-001, SERV-001, PORT-001, CONTACT-001, ADMIN-005 | Dynamic slots; works with sparse content; no unverified metrics | Not Started |
| PROD-001 | Products hub | Products | P0 | V1 | HOME-002, PROD-006 | Ecosystem-first; new product appears without code | Not Started |
| PROD-002 | Product Story template & variants | Products | P0 | V1 | CORE-005/008 | Related not identical; status-consistent CTA; no invented specs | Not Started |
| PROD-003 | HENU AI page | Products | P0* | V1 | PROD-002 | Keyboard-operable explorer; confirmed content only | Not Started |
| PROD-004 | HENU PA page | Products | P0* | V1 | PROD-002 | Text equivalent; illustrative labelling; no autoplay | Not Started |
| PROD-005 | HENU IDE page | Products | P0* | V1 | PROD-002 | Real or labelled visuals; confirmed content only | Not Started |
| PROD-006 | Product management module | Products/Admin | P0 | V1 | ADMIN-002/003, CORE-008/010 | CRUD + publish; reserved slug; CTA validated; audited | Not Started |
| OS-001 | HENU OS flagship page | OS | P0 | V1 | PROD-002, OS-002 | Compelling without unconfirmed specs; CTA matches release state | Not Started |
| OS-002 | Release metadata model & block | OS/Data | P1 | V1† | CORE-007 | Validated at build; no literal links in components; no signing claim | Not Started |
| OS-003 | Download origin & release publishing workflow | OS/Ops | P1 | V1† | OS-002, SEC-001, OPS-002 | Web app cannot write; immutable; checksum verified; resumable | Not Started |
| OS-004 | Integrity monitoring & signing | OS/Security | P2 | V1.1 | OS-003 | Tamper alert; signing claimed only when implemented | Not Started |
| SERV-001 | Services index | Services | P0 | V1 | CORE-008, SERV-003/004 | Editorial index; no price text; scales with services | Not Started |
| SERV-002 | Service detail template | Services | P0 | V1 | SERV-001 | Disclaimers render; unpublished → 404 | Not Started |
| SERV-003 | Service management module | Services/Admin | P0 | V1 | ADMIN-002/003, CORE-008/010 | CRUD/reorder; disclaimer gate; price blocker | Not Started |
| SERV-004 | Service content onboarding & governance | Services/Content | P0 | V1 | OPS-005 | Catalogue-traceable; approved disclaimers; no guarantees | Not Started |
| PORT-001 | Dynamic portfolio management | Portfolio + Admin | P0 | V1 | ADMIN-002/003/006, CORE-008/009/010 | Create/edit/archive/delete; draft not public; works at any count | Not Started |
| PORT-002 | Portfolio index & filtering | Portfolio | P0 | V1 | PORT-001 | Asymmetric layout; accessible filter; any count | Not Started |
| PORT-003 | Portfolio detail / case study | Portfolio | P0 | V1 | PORT-001 | Optional blocks; accessible gallery; no fabricated outcomes | Not Started |
| PORT-004 | Advanced portfolio interactions | Portfolio | P2 | V1.1 | PORT-002/003, MOTION-003 | No AB/PB regression; reduced-motion safe | Not Started |
| ABOUT-001 | About foundation | About | P0 | V1 | CORE-008, HOME-002 | Readable without motion; no generic template; verified timeline only | Not Started |
| ABOUT-002 | About management module | About/Admin | P0 | V1 | ADMIN-002/003, ABOUT-001 | Chapters/timeline editable; draft private | Not Started |
| ABOUT-003 | Scroll storytelling & 3D | About/Motion | P2 | V1.1 | ABOUT-001, PERF-001 | Works with WebGL off; no LCP impact; accessible | Not Started |
| CONTACT-001 | Contact page & path chooser | Contact | P0 | V1 | CORE-005, ADMIN-007 | Two paths clear; safe parameter pre-selection | Not Started |
| CONTACT-002 | Enquiry submission pipeline | Contact/Security | P0 | V1 | CORE-006/007, SEC-003..005 | Persist + notify; spam/rate limited; public cannot read | Not Started |
| CONTACT-003 | Notification email & reconciliation | Contact/Ops | P0 | V1 | CONTACT-002, OPS-002 | No header injection; failure never loses enquiry | Not Started |
| CONTACT-004 | Calendly integration | Contact | P0 | V1 | ADMIN-007, SEC-002 | Opens configured URL; no script on load; fallback link | Not Started |
| CONTACT-005 | Enquiry management module | Contact/Admin | P0 | V1 | ADMIN-002/003, CONTACT-002 | View/status/notes; XSS inert; authz enforced | Not Started |
| ADMIN-001 | Admin authentication | Admin/Security | P0 | V1 | CORE-006, SEC-004 | Invite-only; MFA enforced; secure cookies; no enumeration | Not Started |
| ADMIN-002 | Admin shell, guard & isolation | Admin/Security | P0 | V1 | ADMIN-001, SEC-002 | Per-action authz; deny-by-default; no-store; noindex | Not Started |
| ADMIN-003 | Admin UI pattern library | Admin/UI | P0 | V1 | CORE-005/008, ADMIN-002 | AB incl. WCAG 2.2; safe editor; confirmations | Not Started |
| ADMIN-004 | Dashboard | Admin | P1 | V1 | ADMIN-002/003, CONTACT-005 | Accurate counts; actionable warnings | Not Started |
| ADMIN-005 | Home management | Admin/Home | P0 | V1 | ADMIN-002/003, HOME-003 | Slots editable; featured only published | Not Started |
| ADMIN-006 | Media library | Admin/Media | P0 | V1 | ADMIN-002/003, CORE-010, SEC-006 | Alt text required; in-use delete blocked | Not Started |
| ADMIN-007 | Site settings | Admin | P0 | V1 | ADMIN-002/003 | Validated URLs; step-up for critical changes | Not Started |
| ADMIN-008 | Audit logging (write V1 / viewer V1.1) | Admin/Security | P0/P2 | V1/V1.1 | ADMIN-002, CORE-006 | Every mutation logged; append-only | Not Started |
| ADMIN-009 | Admin provisioning procedure | Admin/Ops | P0 | V1 | ADMIN-001 | Onboard/offboard by runbook; allowlist enforced | Not Started |
| ADMIN-010 | Users & roles (RBAC foundation) | Admin/Security | P2 | V1.1 | ADMIN-002/008 | Permission changes without code; isolation tests | Not Started |
| ADMIN-011 | Release management module | Admin/OS | P2 | Future | OS-002, ADMIN-008/010 | UI unchanged by data-source switch; audited | Not Started |
| MOTION-001 | V1 motion set | Motion | P1 | V1 | CORE-003/005 | Reduced-motion honoured; transform/opacity only | Not Started |
| MOTION-002 | Loading foundation | Motion/Core | P1 | V1 | CORE-005/011 | No layout shift; loader slot defined | Not Started |
| MOTION-003 | Page & shared-element transitions | Motion | P2 | V1.1 | MOTION-001, PORT-003 | Graceful degradation; reduced-motion safe | Not Started |
| MOTION-004 | HENU loader & richer product interactions | Motion | P2 | V1.1 | MOTION-002, PROD-002 | Never blocks content; budgets held | Not Started |
| SEO-001 | Metadata system | SEO | P0 | V1 | CORE-008, ADMIN-007 | Unique metadata everywhere; gate on missing SEO fields | Not Started |
| SEO-002 | Sitemap, robots, redirects, indexing | SEO | P0 | V1 | CORE-009, ADMIN-002 | Auto sitemap; env-aware robots; redirects | Not Started |
| SEO-003 | Structured data, headings, internal linking | SEO/Content | P1 | V1 | CORE-008, SEO-001 | Valid, truthful JSON-LD; one h1; generated related links | Not Started |
| A11Y-001 | Accessibility foundations | A11Y | P0 | V1 | CORE-003/005 | AB across shell/primitives; focus not obscured | Not Started |
| A11Y-002 | Forms, errors, dialogs & menus | A11Y | P0 | V1 | CORE-005, CONTACT-002, ADMIN-001 | Keyboard/screen-reader operable flows | Not Started |
| A11Y-003 | Reduced motion, target size & reflow | A11Y | P0 | V1 | MOTION-001 | 200% zoom/320px reflow; targets sized | Not Started |
| A11Y-004 | Accessibility audit & remediation | A11Y | P0 | V1 | All public features | No open critical/serious findings | Not Started |
| PERF-001 | Budgets & measurement baseline | Performance | P0 | V1 | Phase 1 pages | Budgets documented and enforced in CI | Not Started |
| PERF-002 | Image & media optimisation | Performance | P0 | V1 | CORE-010 | Lazy/responsive; zero media CLS | Not Started |
| PERF-003 | Client JS minimisation & code splitting | Performance | P0 | V1 | CORE-005 | Islands only; bundle reviewed per phase | Not Started |
| PERF-004 | Caching & CDN configuration | Performance/Ops | P0 | V1 | CORE-009, OPS-002 | Cache headers verified; admin never cached | Not Started |
| PERF-005 | Pre-launch CWV & motion verification | Performance | P0 | V1 | PERF-001..004 | Budgets met or exceptions approved | Not Started |
| SEC-001 | Secrets & configuration hygiene | Security | P0 | V1 | CORE-002 | Push protection blocks secrets; rotation rehearsed | Not Started |
| SEC-002 | Security headers & CSP | Security | P0 | V1 | CORE-003, ADMIN-002, OPS-002 | Headers per hostname; strict admin CSP; monitored | Not Started |
| SEC-003 | Validation, CSRF/origin & XSS controls | Security | P0 | V1 | CORE-007/008 | Forged requests rejected; XSS inert | Not Started |
| SEC-004 | Rate limiting & anti-abuse infrastructure | Security | P0 | V1 | CORE-002, OPS-002 | Limits hold across instances; defined fail modes | Not Started |
| SEC-005 | Supabase configuration & RLS verification | Security/Data | P0 | V1 | CORE-006, ADMIN-001 | Anon cannot access tables/buckets; insert-only intake | Not Started |
| SEC-006 | File upload security (admin media) | Security | P0 | V1 | CORE-010, ADMIN-002 | Malicious uploads rejected; isolated media origin | Not Started |
| SEC-007 | Logging, redaction & alerting | Security/Ops | P0 | V1 | OPS-004 | No secrets/PII in logs; alerts reach owner | Not Started |
| SEC-008 | Dependency, source & CI security | Security/Ops | P0 | V1 | OPS-001 | Vulnerable deps blocked; branch protection; PR builds lack prod secrets | Not Started |
| SEC-009 | Pre-launch security review & incident readiness | Security | P0 | V1 | All V1 security tickets | No open critical/high; checklist evidenced; rehearsals recorded | Not Started |
| TEST-001 | Test infrastructure, unit & integration | Testing | P0 | V1 | CORE-001/006/007 | Suites in CI; synthetic data | Not Started |
| TEST-002 | End-to-end journeys | Testing | P0 | V1 | Feature tickets | All 12 journeys + extras pass | Not Started |
| TEST-003 | Authorization & security test suite | Testing/Security | P0 | V1 | ADMIN-002, SEC-003..006 | Every admin entry point has negative tests | Not Started |
| TEST-004 | Responsive & cross-browser QA matrix | Testing/QA | P0 | V1 | Page tickets | RAB signed off per template per phase | Not Started |
| OPS-001 | CI pipeline | Ops | P0 | V1 | CORE-001/002 | Required checks; previews; manual prod approval | Not Started |
| OPS-002 | Hosting, domains, TLS, DNS & email DNS | Ops | P0 | V1 | Decisions Q2, Q7 | HTTPS-only; email auth passes; registrar secured | Not Started |
| OPS-003 | Backups & restore drill | Ops | P0 | V1 | CORE-006, OPS-002 | Restore verified and timed; runbooks exist | Not Started |
| OPS-004 | Monitoring & alerting | Ops | P0 | V1 | OPS-002 | Forced error/downtime alert the owner | Not Started |
| OPS-005 | Content preparation, seed & migration | Ops/Content | P0 | V1 | HENU inputs | No placeholders; claims sourced; legal reviewed | Not Started |
| OPS-006 | Launch readiness & go-live | Ops | P0 | V1 | All V1 tickets | Go/no-go recorded; production verified; rollback rehearsed | Not Started |

\* Conditional on product readiness `[REQUIRES CONFIRMATION]`; if a product is not ready it launches with an honest status label or is omitted until ready.
† Conditional on a public HENU OS release existing at launch; otherwise a status/waitlist state is shown and these tickets move to V1.1.

---

## 23. Open Questions

Only genuine unresolved decisions are listed. **Recommended resolutions** are defaults the team can proceed on until confirmed.

| ID | Question | Why It Matters | Recommended Resolution |
|----|----------|----------------|------------------------|
| **Q1** | What is the team size/capacity and target launch date? | Roadmap has relative sizing only; phase scoping and descoping decisions need capacity | Confirm at kickoff; keep P1/P2 items as the descoping buffer |
| **Q2** | Hosting platform, regions and budget model (Vercel recommended in doc 02) | Determines CSP/caching behaviour, rate-limit options, costs | Adopt Vercel for V1 unless an organisational constraint exists; avoid platform-proprietary APIs |
| **Q3** | Is operator-run admin provisioning acceptable in V1 (Users UI deferred to V1.1)? | Affects ADMIN-009/010 scope | Yes — invite + allowlist runbook; Users UI in V1.1 |
| **Q4** | Enquiry database write path: insert-only role (preferred) vs confined elevated key | Blast radius of the public intake path | Insert-only role (Pattern A) unless pooling/platform constraints block it |
| **Q5** | Admin media storage: Supabase Storage for images vs dedicated object storage | Cost, limits, origin isolation, optimisation pipeline | Supabase Storage for admin images (small/medium) with processed variants; dedicated object storage for videos and artifacts; verify plan limits |
| **Q6** | Which structured rich-text editor/renderer and headless UI primitive library? | Admin safety and accessibility | Select a maintained editor that outputs structured JSON with a constrained mark set; evaluate against SEC-003 and A11Y-002 in a short spike in Phase 1 |
| **Q7** | Email provider and sending domain; who receives enquiries | CONTACT-003, deliverability, privacy | Reputable transactional provider; fixed sender on HENU's domain; recipients are internal addresses only |
| **Q8** | Rate-limit shared store provider | Serverless correctness | Use the hosting platform's rate-limit capability or a managed key-value store; avoid in-memory counters |
| **Q9** | Is a public HENU OS release available at launch? | OS-002/003 are V1 or V1.1; HENU OS CTA | If not, ship the status/waitlist state and move OS-002/003 to V1.1 (keep the data model ready) |
| **Q10** | Which of HENU AI/PA/IDE are ready to present publicly and with what media? | PROD-003..005 are conditional | Launch only products with confirmed content and honest status labels; others as "coming soon" or omitted |
| **Q11** | Final service catalogue content, category grouping and disclaimer wording for Legal/Funding/Documentation services | SERV-001..004; legal exposure | Adopt the proposed four categories; require legal sign-off before publishing the sensitive services |
| **Q12** | Which portfolio projects are public, with what images/permissions and statuses? | PORT-001..003; evidence on Home | Publish only permissioned projects; omit outcomes unless verified |
| **Q13** | Brand assets: logo files, existing brand colours, final typefaces | CORE-003/004 and palette acceptance | Provide assets in Phase 0; validate palette against real logos before token freeze |
| **Q14** | Calendly URL and embed preference | CONTACT-004; CSP/privacy | Link-out baseline; on-click embed optional |
| **Q15** | Enquiry form fields (phone? consent text) and retention periods | Data minimisation, legal | No phone by default; consent/notice from legal review; define retention before launch |
| **Q16** | Admin sign-in method (IdP vs password + MFA) and MFA factor policy | ADMIN-001 | Managed IdP with enforced MFA if HENU uses a managed workspace; otherwise password + mandatory TOTP |
| **Q17** | Analytics/measurement approach for PRD success metrics | Metrics vs privacy/performance | V1: platform field Core Web Vitals + database enquiry counts; evaluate cookieless analytics for V1.1 |
| **Q18** | Plan tiers (Supabase backups/PITR/session controls; hosting), RPO/RTO | OPS-003, ADMIN-001 | Decide RPO/RTO from business tolerance, then select the plan to meet it |
| **Q19** | Performance budgets and browser/device support matrix | PERF-001, TEST-004 | Establish from the Phase 1 baseline and published CWV thresholds; define the matrix from the audience `[REQUIRES CONFIRMATION]` |
| **Q20** | Incident roles, alert owner, disclosure contact | SEC-007/009 | Name owners before Phase 7; publish a disclosure contact if software is publicly distributed |
| **Q21** | Is Hindi/Devanagari or another script required at launch? | Font fallbacks, layout tolerances; i18n scope | Not in V1; keep font fallbacks and layouts script-tolerant |
| **Q22** | Who edits content after launch and how often (training, approval workflow)? | Admin UX, publish workflow, second-reviewer need | Single-publisher model in V1; consider approval workflow with RBAC in V1.1 |

---

## 24. Final Implementation Principle

The objective is **not** to build the largest possible website. It is to deliver:

> **A distinctive, fast, responsive, secure, maintainable HENU website with a properly structured Admin Web application.**

The architecture supports future growth — more products, releases, documentation, portals, roles and integrations — through clean boundaries (service/repository layering, structured content, separate artifact origin, permission-based authorization, isolated admin) **without forcing future complexity into V1**.

---

*End of document. Items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner before dependent work is finalised; items marked `[VERIFY]` must be checked against current vendor documentation for the versions and plans in use. Roadmap sizing is relative and contains no calendar commitments.*

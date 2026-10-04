# HENU Website — Technical Architecture & Technology Stack

| | |
|---|---|
| **Document** | `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md` |
| **Status** | Draft v1 for technical review |
| **Depends on** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md` |
| **Feeds** | `03-SECURITY-ARCHITECTURE.md`, design system, delivery plan |

**Conventions**

- `[REQUIRES CONFIRMATION]` marks any decision that depends on information not yet confirmed (infrastructure, team, budget, traffic, vendors, product readiness). No traffic numbers, user counts, performance targets or operational constraints are assumed anywhere in this document.
- `[SECURITY BOUNDARY]` marks a place where a security-sensitive boundary exists. These are consolidated in Section 30 and are the input to `03-SECURITY-ARCHITECTURE.md`. This document does not define security policy in depth.
- Version numbers are deliberately not pinned here. The project should adopt the current stable major version of each tool at kickoff and pin exact versions in the lockfile.
- No application code is included. Directory layouts, conceptual schemas and diagrams are structural guidance only.

---

## 1. Executive Technical Summary

The HENU website is, at launch, a **content-led, performance-sensitive company and product website** with two small pieces of genuinely dynamic behaviour: **enquiry capture** and **release/download metadata**. It must also be built so it can grow into a broader HENU platform (more products, releases, documentation, APIs, admin tooling) without a rewrite.

**Recommended architecture in one paragraph**

A single **Next.js (App Router) + TypeScript** application, styled with **Tailwind CSS on top of semantic design tokens**, deployed to a managed Next.js-compatible host. Public pages are **statically generated or cached server-rendered pages** with **React Server Components by default** and minimal client JavaScript. Structured, low-churn content (products, services, case studies, documentation, releases) is **source-controlled and schema-validated in V1**, and sits behind a **content/repository interface** so it can move to the database later without touching UI components. **PostgreSQL on Supabase** holds data that genuinely needs persistence and querying: **enquiries in V1**, and admin-managed content from V1.1 onward. **Supabase Auth** is the only authentication mechanism for the admin area. **Large artifacts (HENU OS ISOs, installers, large media) never live in the application bundle or `public/`**; they are served from **dedicated object storage behind a CDN**, described by release metadata that is the single source of truth. **No separate Node.js backend service is deployed in V1**; Next.js server capabilities cover all V1 server logic, with explicit, documented triggers for extracting a standalone API later.

**Guiding principle:** *Simple where HENU only needs a website. Structured where HENU needs a platform. Extensible where the ecosystem is expected to grow.*

---

## 2. Architectural Principles

Each principle is stated with its operational consequence for this project.

| # | Principle | Consequence in this architecture |
|---|-----------|----------------------------------|
| 1 | Simplicity before unnecessary complexity | One deployable application in V1; no microservices; static-first content |
| 2 | Strong separation of concerns | Layered server code (UI → service → repository); content, product, services and admin data are separate domains |
| 3 | Type safety wherever practical | Strict TypeScript; DB-generated types; schema-inferred form/content types |
| 4 | Reusable components and services | Shared UI primitives; service layer reused by pages, actions and (later) APIs |
| 5 | Server-side operations for sensitive logic | All writes, secrets, and privileged reads run server-side only |
| 6 | Public and administrative functionality are clearly separated | Separate route group, separate guard, separate data-access policy for `/admin` |
| 7 | Performance is an architectural requirement | Server Components by default; static generation; CDN; strict media rules |
| 8 | Accessibility and SEO are supported by architecture | Semantic layout primitives, metadata API, sitemap, structured data helpers built in |
| 9 | Infrastructure scales without a rewrite | Managed services; extraction points defined (Section 31) |
| 10 | No dependency without a concrete reason | Dependency policy (Section 27) |
| 11 | Prefer mature, well-supported technologies | Next.js, Postgres, Supabase, widely adopted tooling |
| 12 | Avoid custom infrastructure where managed is appropriate | Managed auth, DB, hosting, CDN, object storage |
| 13 | Future-proof through clean boundaries, not premature features | Repository interface and storage separation now; portals/RBAC later |
| 14 | Product, services, content and admin data are logically separated | Separate modules, separate types, separate tables |
| 15 | Large downloadable assets are not ordinary web assets | Dedicated storage/CDN, immutable artifacts, checksum metadata |

---

## 3. Technology Stack

### 3.1 Stack summary

| Layer | Choice | Status |
|-------|--------|--------|
| Application framework | **Next.js** (App Router) | V1 |
| Language | **TypeScript** (strict mode) | V1 |
| UI library | **React** (Server Components by default) | V1 |
| Styling | **Tailwind CSS** + CSS custom properties (semantic design tokens) | V1 |
| Backend runtime | **Node.js** (via Next.js server runtime) | V1 |
| Standalone Node.js API service | Not deployed in V1; extraction criteria defined | Future |
| Database | **PostgreSQL via Supabase** | V1 |
| Authentication | **Supabase Auth** (admin only) | V1.1 (or V1 if admin is required at launch) |
| App storage | **Supabase Storage** (small/medium admin-uploaded assets, if needed) | V1.1 |
| Large artifact storage + CDN | **Dedicated object storage with CDN** (provider `[REQUIRES CONFIRMATION]`) | V1 if a public release exists |
| Validation | **Schema validation library** (recommended: Zod) | V1 |
| Testing | Unit/integration runner + browser E2E + automated accessibility checks | V1 |
| Hosting (app) | Managed Next.js-compatible platform (recommended: Vercel; see Section 24) | V1 |
| CI/CD | Git-host-native CI (e.g., GitHub Actions) `[REQUIRES CONFIRMATION: Git host]` | V1 |
| Error monitoring | Hosted error tracking (provider `[REQUIRES CONFIRMATION]`) | V1 |

### 3.2 Why this stack fits

- **Next.js + React Server Components** matches the site's profile: mostly read-heavy marketing and technical content where server rendering and static generation provide good SEO and low client JavaScript. It also provides routing, metadata, image/font optimisation and server mutation primitives in one framework, avoiding assembly of separate tools.
- **TypeScript** provides a single type system from content schemas through service layer to components, which is especially valuable for AI-assisted and multi-developer work.
- **Tailwind + design tokens** allows consistent, fast UI construction while keeping the visual language centrally controlled by tokens (colours, spacing, typography, radii, motion), which the later design-system document will define. Tailwind is the utility layer; **semantic tokens are the contract**.
- **PostgreSQL** is a strong fit for structured, relational HENU data (see Section 7).
- **Supabase** provides managed Postgres, authentication and storage without building or operating those systems.

### 3.3 Backend boundary: Next.js server vs. separate Node.js service

This is the most consequential structural decision. The recommendation is explicit:

> **In V1, all server-side logic runs inside the Next.js application. No separate Node.js backend service is deployed.**

**Belongs in Next.js (V1 and beyond)**

| Capability | Mechanism |
|-----------|-----------|
| Server-rendered and static pages | Server Components, static generation |
| Page-level data fetching (products, services, releases, docs) | Server Components calling the service layer |
| Simple first-party mutations (contact and service enquiries, admin edits) | Server Actions |
| Webhook receivers and small integration endpoints | Route Handlers |
| Admin pages and admin mutations | Server Components + Server Actions behind the admin guard |
| Sitemap, robots, metadata, OG image generation | Next.js file conventions / Route Handlers |

**Belongs in a separate Node.js/API service (Future; only when a trigger is met)**

| Trigger | Reason |
|---------|--------|
| A second consumer of the same logic exists (mobile app, HENU OS component, HENU PA/AI/IDE, partner integration) | Needs a stable, versioned API contract independent of the website's release cycle |
| Long-running, scheduled or queue-based work (for example processing uploads, building artifact indexes, batch jobs) | Serverless/edge request lifecycles are a poor fit |
| Heavy or specialised business logic with its own scaling profile | Independent scaling and deployment |
| Persistent connections, streaming pipelines or WebSocket needs | Different runtime model |
| Compliance or isolation need for a sensitive subsystem | Separate trust boundary `[REQUIRES CONFIRMATION]` |

**Rule of thumb:** *If the only consumer is this website and the work completes within a normal request, it lives in Next.js. If anything else needs to call it, or it outlives a request, extract it.*

**Preparing for extraction without building the service now:** all business logic lives in a framework-independent service layer (Section 13). Server Actions and Route Handlers are thin adapters over that layer. Extraction later means mounting the same services behind a standalone Node.js HTTP server rather than rewriting logic.

### 3.4 What is deliberately not in the stack

An ORM or query-builder decision is **deferred**: the V1 data surface is small (a few tables). The repository layer may use the Supabase client with generated types, or a lightweight typed query layer. This is revisited if query complexity grows. `[REQUIRES CONFIRMATION: team preference]`

State management libraries, CSS-in-JS runtimes, GraphQL, headless CMS platforms and animation libraries are **not** part of the baseline stack and require a documented reason to be added (Section 27).

---

## 4. System Architecture

### 4.1 Refined conceptual architecture

The supplied conceptual model is retained in spirit and refined in three ways: (1) the browser never talks to the database directly in V1; (2) the "API Layer" is a *logical* layer inside Next.js in V1, not a deployed service; (3) large files are served from a **separate download origin**, not through the application.

```text
                         ┌─────────────────────────┐
                         │         Browser         │
                         └──────┬─────────────┬────┘
                                │             │
              pages, forms,     │             │  large downloads,
              admin UI          │             │  media (direct)
                                ▼             ▼
                ┌──────────────────────┐   ┌──────────────────────────┐
                │ Edge / CDN (app)     │   │ Download & media origin  │
                │ cached HTML & assets │   │ Object storage + CDN     │
                └──────────┬───────────┘   │ (separate hostname)      │
                           │               └────────────▲─────────────┘
                           ▼                            │ upload / publish
        ┌────────────────────────────────────┐          │ (release workflow)
        │        Next.js application         │          │
        │  App Router · React Server Comps   │          │
        │                                    │          │
        │  Public routes     Admin routes    │          │
        │        │                 │ [guard] │          │
        │        ▼                 ▼         │          │
        │  Server Components / Server Actions│          │
        │  / Route Handlers (thin adapters)  │          │
        │                │                   │          │
        │                ▼                   │          │
        │        Service layer               │          │
        │   (business rules, validation)     │          │
        │                │                   │          │
        │                ▼                   │          │
        │   Repository / content layer ──────┼──┐       │
        └────────────────┬───────────────────┘  │       │
                         │                       ▼       │
                         │            Source-controlled content
                         │            (MDX / structured data, V1)
                         ▼
              ┌────────────────────────┐
              │   Supabase             │
              │  PostgreSQL · Auth     │
              │  (Storage, optional)   │
              └────────────────────────┘

      (Future, not built in V1)
      ┌────────────────────────────┐
      │ Standalone Node.js API     │──► same service layer / same Supabase
      │ for external consumers     │
      └────────────────────────────┘
```

### 4.2 Request paths

| Scenario | Path |
|----------|------|
| Visitor opens a product page | Browser → CDN (cached static/ISR HTML) → (cache miss) Next.js → content layer → render |
| Visitor submits an enquiry | Browser → Server Action → validation → service → repository → Supabase Postgres → notification |
| Visitor downloads HENU OS | Browser reads release metadata on the page → clicks → **direct to download origin (CDN)**, bypassing the application |
| Admin reviews enquiries | Browser → admin route → guard (Supabase Auth session) → service → repository → Postgres |
| Release published | Release workflow uploads artifact to object storage → metadata updated (V1: Git-tracked data; V1.1: admin-managed DB) → revalidation of affected pages |

### 4.3 Architecture classification

- **Rendering:** hybrid; static-first with selective on-demand revalidation. Fully dynamic rendering is the exception.
- **Data:** content in files (V1) + relational DB for persistence.
- **Deployment:** one application deployable, one database project per environment, one storage/CDN origin for artifacts.

---

## 5. Frontend Architecture

### 5.1 Rendering model

| Page type | Rendering approach | Rationale |
|-----------|-------------------|-----------|
| Home, About, Technology, Products, Services, Case studies, FAQ, legal | **Static generation** | Content changes infrequently; best performance and SEO |
| Product/service/case-study detail | **Static generation** with generated params from content | Content-driven dynamic routes |
| Documentation | **Static generation** from MDX | Deterministic, fast, SEO-friendly |
| Downloads & releases | **Static generation with on-demand revalidation** when release metadata changes | Must update promptly without full redeploy once releases are DB-managed |
| Blog/insights (V1.1) | **Static generation** with revalidation | Same as docs |
| Contact/enquiry pages | Static shell; mutation via Server Action | Form is the only dynamic part |
| Admin | **Dynamic, uncached, per-user** | Authenticated, private data |

### 5.2 Component strategy

- **Server Components by default.** A component becomes a Client Component only when it needs browser state, effects, event handlers or browser-only APIs.
- **Push client boundaries to the leaves.** Interactive widgets (mobile navigation, tabs, copy-checksum button, form controls) are small client islands inside server-rendered pages.
- **Three component tiers**
  1. **UI primitives**: accessible, token-driven, product-agnostic (button, link, input, dialog, disclosure, tabs).
  2. **Layout and pattern components**: page shell, section containers, hero patterns, ecosystem diagram container.
  3. **Feature components**: domain-aware (ProductSummary, ReleaseTable, EnquiryForm) that receive typed data via props, never fetch it themselves.
- **Data flows downward as props.** Presentational components never import repositories or the database client.

### 5.3 Styling architecture

- **Semantic design tokens** defined as CSS custom properties (colour roles, surfaces, borders, spacing scale, radius, typography roles, motion durations/easings, elevation). Tokens are named by **role** (for example `surface-raised`, `text-muted`, `accent-primary`), not by value (not `purple-500`).
- **Tailwind is configured to consume tokens**, so utility classes resolve to semantic roles. Changing the visual system means changing tokens, not editing components.
- **Theme support** (for example light/dark) is a token remap, not duplicated component styles. Whether multiple themes ship in V1 is a design decision. `[REQUIRES CONFIRMATION]`
- **No design values are fixed in this document.** Fonts, palette, spacing and motion language are defined by the design-system document.

### 5.4 Client-side JavaScript policy

- Default to zero client JavaScript for informational pages beyond the framework baseline and necessary islands.
- Animation and motion libraries are **not** in the baseline; CSS-first, with a dependency added only for a demonstrated need and with `prefers-reduced-motion` support.
- Third-party scripts (analytics, chat, embeds) require justification and a measured performance cost.

### 5.5 Forms

Forms are progressive-enhancement-friendly: they work as standard form submissions and are enhanced client-side for validation feedback and pending states. Server-side validation is authoritative (Section 15).

---

## 6. Backend Architecture

### 6.1 V1 backend = Next.js server layer

There is no separately deployed backend in V1. The "backend" consists of:

1. **Service layer**: business rules, orchestration, validation invocation, notification dispatch.
2. **Repository / content layer**: the only code that talks to Postgres, Supabase Storage or content files.
3. **Adapters**: Server Actions, Route Handlers and Server Components that call services.
4. **Integrations**: email delivery, bot protection, monitoring (Section 30).

### 6.2 Adapter selection

| Need | Use | Why |
|------|-----|-----|
| Read data for rendering a page | Server Component → service | No network hop; no public API needed |
| Submit contact/service enquiry | **Server Action** | First-party form mutation; progressive enhancement; no API surface to maintain |
| Admin mutations | **Server Action** | First-party and guarded |
| Webhooks, third-party callbacks | **Route Handler** | External caller needs a URL |
| Public machine-readable data (e.g., latest release metadata) | **Route Handler** (V1.1) | A stable read-only contract for non-browser consumers |
| Anything needed by non-web consumers with a stable contract | Versioned API (Section 29), initially as Route Handlers over the same services | Extractable later |

### 6.3 Notification and email

Enquiry submission must notify a human owner. An **email delivery provider** is needed (transactional email service) `[REQUIRES CONFIRMATION: provider and sending domain]`. Delivery is part of the service layer and must not block or break the user's submission: the enquiry is **persisted first**, notification second, and a notification failure is logged and retried or surfaced to operators rather than shown as a user error.

### 6.4 Background work

V1 has no queue or worker. Notification is sent inline after persistence, with failure isolation. If retries, scheduled jobs or batch processing are later required, that is an extraction trigger (Section 3.3), not a reason to build a job system now.

---

## 7. Database Architecture

### 7.1 Why PostgreSQL

| Reason | Relevance to HENU |
|--------|------------------|
| Strong relational model | Products → releases → artifacts → checksums is naturally relational with integrity constraints |
| Constraints and transactions | Prevents orphaned artifacts, duplicate versions, inconsistent "latest" pointers |
| Rich types (enums, JSONB, arrays, timestamps) | Release channels, flexible system-requirement blocks, structured metadata |
| Full-text search | Possible future search over articles/docs without new infrastructure |
| Mature ecosystem | Tooling, migrations, backups, hosting options, portability (no hard vendor lock-in beyond Supabase-specific features) |
| Row Level Security | Defence-in-depth for admin and future role-based access |

Using PostgreSQL does **not** mean every piece of content should be dynamic. The database holds data that needs persistence, querying, or non-developer editing.

### 7.2 Data classification

| Data domain | V1 | Classification | Reasoning |
|------------|----|----------------|-----------|
| Contact enquiries | Yes | **Database-backed** | User-generated; must persist reliably and be reviewable |
| Service enquiries | Yes | **Database-backed** (same table as enquiries, with a type) | Same workflow; differentiated by enquiry type |
| Products | Yes | **Static** (typed, validated content files) | Few items; infrequent change; benefits from code review and Git history |
| Services | Yes | **Static** | Same |
| Projects / case studies | Yes (if available) | **Static** (MDX + frontmatter) | Editorial content; low volume |
| Documentation | Yes | **Static** (MDX) | Versioned with code; metadata derived from files |
| Documentation metadata (index, nav) | Yes | **Static, derived at build** | No separate store |
| Releases | Yes | **Static structured data in V1** → **Admin-managed DB in V1.1** | Highest consistency risk; behind a repository interface so the switch is invisible to the UI |
| Download metadata (artifacts, checksums) | Yes | Same as releases | Part of the release aggregate |
| Blog / content metadata | V1.1 | **Static (MDX)**, DB-backed only if non-developer publishing is required | Content tooling decision deferred |
| Testimonials | Conditional | **Static** | Only legitimate, permissioned items; low volume |
| Site configuration | Yes | **Static** (config module + environment) | Rarely changes |
| Administrative users | V1.1 | **Managed by Supabase Auth**, plus an application-level admin/role record | No custom credential storage |
| Audit log | V1.1 | **Database-backed** (lightweight) | Admin write traceability |
| Analytics / telemetry | No | **Future / external** | Not built into the application database |

### 7.3 Conceptual V1 relational model

This is a conceptual outline, not final DDL.

**`enquiries`** (V1)

| Field | Notes |
|-------|-------|
| `id` | Unique identifier |
| `type` | Enumerated: `general`, `project`, `service`, `partnership`, `technical`, `support` (final set follows PRD contact intents) |
| `name`, `email` | Required |
| `organisation` | Optional |
| `message` | Required, length-bounded |
| `service_interest` | Optional reference to a static service slug |
| `status` | `new`, `in_progress`, `resolved`, `spam` |
| `source_page`, `created_at` | Context and audit |
| `consent_recorded_at` | Records privacy-notice acknowledgement `[REQUIRES CONFIRMATION: legal wording]` |
| Technical metadata | Only what is necessary (see security document; avoid collecting unneeded personal data) |

**Release aggregate** (V1 as static structured data; V1.1 as tables)

| Entity | Purpose | Key attributes |
|--------|--------|----------------|
| `products` (reference) | Which product a release belongs to | `slug`, display metadata (content-owned) |
| `releases` | A published version | `product`, `version`, `channel` (stable/beta/nightly `[REQUIRES CONFIRMATION]`), `release_date`, `status` (draft/published/withdrawn), `release_notes` reference, `is_latest_for_channel` (derived, not hand-set), `requirements` block, `docs_links` |
| `release_artifacts` | One downloadable file | `release`, `architecture`, `file_name`, `file_size_bytes`, `storage_key`, `download_url` (derived), `sha256`, `signature_ref` (optional), `media_type` |

**`admin_profiles`** (V1.1): links an authenticated Supabase user to an application role. V1 role set is a single `admin`; the column exists to allow RBAC later (Section 12).

**`audit_log`** (V1.1): actor, action, entity, entity id, timestamp, summary.

### 7.4 Database principles

- **Migrations are version-controlled, forward-only and reviewed.** Schema changes follow an expand-and-contract approach to keep rollbacks safe.
- **One Supabase project per environment** (development, staging, production). Data is never shared across environments.
- **Generated types** from the schema are the source of truth for DB entity types (Section 14).
- **Constraints enforce invariants** (unique `(product, version, channel)`, unique `(release, architecture, file_name)`, `sha256` format check, non-negative sizes).
- **Backups and point-in-time recovery** are provided by the managed plan; the required retention and plan tier `[REQUIRES CONFIRMATION]`.
- **Data minimisation:** store only what the product needs. Enquiry data is personal data and its handling is defined by the privacy policy and the security document.

---

## 8. Storage Architecture

### 8.1 Three storage classes

| Class | Examples | Where it lives | Why |
|-------|---------|---------------|-----|
| **Normal site assets** | Logos, icons, UI imagery, small/medium images, fonts | **In the repository / application build**, processed by the framework's image and font optimisation. `public/` only for assets that must be served as-is (favicons, manifest, verification files). | Versioned with code, optimised at build, cached via the app CDN |
| **Media** | Promotional videos, product demonstration videos, large imagery | **Object storage + CDN** (or a managed video platform) referenced by URL from content; **not** committed to Git | Avoids repository bloat and application bundle weight; supports streaming/range requests |
| **Product downloads** | HENU OS ISOs, installers, release packages, future software | **Dedicated object storage behind a CDN on a separate hostname** | Large, immutable, bandwidth-heavy; needs integrity metadata and independent scaling |

### 8.2 Rules for large files

> **Large artifacts must never be placed in the application's `public/` directory, committed to the repository, or served through application request handlers.**

Reasons: build and deploy size, serverless function and bandwidth limits, cache behaviour, cost and the need for independent lifecycle management.

### 8.3 Evaluation: where to store and serve large artifacts

Evaluated against: cost predictability (especially **egress**), CDN integration, large-object and range-request support, access control, lifecycle/versioning, operational complexity and regional performance.

| Option | Strengths | Concerns |
|--------|----------|----------|
| **S3-compatible object storage with no/low egress fees** (e.g., Cloudflare R2 or similar) | Egress cost predictability, S3-compatible tooling, integrates with a CDN | Vendor-specific operational details; verify current terms |
| **AWS S3 + CloudFront** | Mature, extensive tooling, fine-grained controls | Egress costs for large ISOs can be significant at scale; more configuration |
| **Supabase Storage** | Already present in the stack; simple for small/medium admin-managed assets | Not the recommended home for multi-gigabyte ISOs: plan limits, egress and file-size constraints must be verified against the chosen plan, and mixing bulk distribution with the DB platform couples unrelated concerns |
| **Hosting provider's blob/storage product** | Simple integration with the app host | Check egress pricing, file-size limits and portability |
| **Source-repository release assets (e.g., GitHub Releases)** | Free-looking, developer-familiar, good as a *secondary* channel | Dependency on a third party's policies/availability; poor control over branding and analytics; best as a mirror, not the sole origin |
| **Torrent / community mirrors** | Resilience and cost reduction at scale | Future-ready; requires checksum/signature integrity and operational process |

**Recommendation:** Use **dedicated S3-compatible object storage with CDN delivery on a separate hostname** (for example `downloads.<domain>`) as the primary origin. Provider selection is `[REQUIRES CONFIRMATION]` and should be decided on verified current pricing, egress terms and regional performance for HENU's actual audience geography `[REQUIRES CONFIRMATION]`. Treat repository release assets and mirrors as **future/secondary distribution channels**.

**Why a separate hostname:** independent caching rules, ability to change provider without changing page code, isolation of cookies and security policy from the application origin `[SECURITY BOUNDARY]`.

### 8.4 Artifact handling requirements

| Concern | Requirement |
|---------|-------------|
| **Versioning** | Artifacts are **immutable and uniquely named by product, version, architecture and channel** (for example, a name pattern encoding these). A published artifact is never overwritten; a correction ships as a new version or a documented republish procedure. |
| **"Latest"** | Never a physical file; "latest" is a **metadata pointer** resolved by the release model. An optional stable "latest" redirect may be provided by metadata, not by overwriting. |
| **Checksums** | SHA-256 computed **at publish time by the release workflow**, stored in release metadata, and displayed on the download page. Optional detached signatures `[REQUIRES CONFIRMATION]`. |
| **Caching** | Immutable artifacts allow long-lived cache headers; metadata pages use short cache with on-demand revalidation. |
| **Range/resumable downloads** | Storage + CDN must support HTTP range requests so clients can resume interrupted downloads. |
| **Integrity** | The checksum page must work independently of the file host so users can verify what they downloaded. |
| **Bandwidth** | Egress cost and rate-abuse behaviour must be modelled before launch of a large public ISO `[REQUIRES CONFIRMATION: expected audience size; none assumed]`. Hotlink/abuse protection at the CDN layer `[SECURITY BOUNDARY]`. |
| **Access** | Public artifacts are public-read; drafts/unpublished artifacts live in a **non-public location or prefix** until published `[SECURITY BOUNDARY]`. |
| **Lifecycle** | Retention policy for old releases defined by product decision `[REQUIRES CONFIRMATION]`. |
| **Upload path** | Artifacts are published through an **operator/release workflow** (CLI or CI job with scoped credentials), **not** through the website's admin UI in V1. |

### 8.5 Supabase Storage usage

Used only if needed for small admin-uploaded assets (for example case-study images uploaded by an admin in V1.1), with bucket-level access rules. Not used for ISOs or large media. If admin uploads are unnecessary because assets are repository-managed, Supabase Storage is not used at all in V1.

---

## 9. Download & Release Architecture

### 9.1 Model

```text
Product
  └── Release            (version, channel, date, status, notes, requirements)
        └── Architecture
              └── Download Artifact   (file name, size, storage key, URL)
                    └── Checksum      (SHA-256, optional signature)
```

In practice `Architecture` is an attribute of an artifact rather than a separate table: a release has one or more artifacts, each for an architecture.

### 9.2 Principles

1. **Metadata, not hardcoded links.** No component contains a literal download URL or version string. Every display (home, product page, downloads page, docs "latest version" references) reads the same release data via the release service.
2. **Single source of truth.** One release record drives the download button, version label, date, checksums, release notes and requirements everywhere. The UI cannot disagree with itself.
3. **Publishing a release changes data, not components.** Adding a release must not require editing React components.
4. **Derived, not hand-set, "latest".** The latest release per product per channel is computed from published releases (by date/version rules), preventing human error.
5. **Withdrawal is first-class.** A release can be marked withdrawn (kept in history, hidden from download) without deleting records.

### 9.3 Data source by phase

| Phase | Source of truth | Reasoning |
|-------|----------------|-----------|
| **V1** | **Git-tracked structured data files**, validated against a schema at build time (build fails on invalid/missing checksum, malformed version, etc.) | Releases are infrequent; review + history via pull requests; no admin UI required; zero runtime dependency |
| **V1.1** | **PostgreSQL tables** managed through a minimal admin interface, with on-demand revalidation | Allows publishing without a code deploy when release cadence justifies it |

Both implement the **same repository interface** (`getLatestRelease`, `listReleases`, `getRelease`, `getArtifacts`), so the switch does not alter UI components or routes. `[REQUIRES CONFIRMATION: expected release cadence]`

### 9.4 Release publishing workflow (conceptual)

```text
Build artifact
   ↓
Compute SHA-256 (release workflow)
   ↓
Upload to object storage (immutable path)
   ↓
Verify upload (size + checksum round-trip)
   ↓
Create/update release metadata (draft)
   ↓
Review → Publish
   ↓
Revalidate downloads/product/home pages
```

The workflow is automated or scripted, with scoped credentials, and is separate from the website's request path `[SECURITY BOUNDARY]`.

### 9.5 Download page behaviour (architectural expectations)

- The page is statically generated from release metadata and revalidated on change.
- The download action links **directly to the artifact on the download origin**; it does not stream through the application.
- Checksums, file size, architecture and requirements are rendered from metadata; a "how to verify" explanation is static content.
- Failure behaviour: if metadata cannot be read, the page shows a safe, informative fallback rather than a broken or empty download; if the artifact host is unreachable, the user sees recovery guidance and (if available) an alternative source.
- Download event measurement is `V1.1/Future` and privacy-reviewed. A redirect-through-app pattern for counting is **not** adopted by default because it puts the application in the bandwidth path or adds a hop; CDN logs and storage analytics are the preferred measurement source `[REQUIRES CONFIRMATION]`.

### 9.6 Status when no public release exists

If HENU OS has no public release at launch, the same architecture renders a **status state** (for example "In development", "Join waitlist") driven by the product/release data, rather than a dead link or removed page. `[REQUIRES CONFIRMATION: release readiness]`

---

## 10. Application Structure

### 10.1 Repository layout (single application, V1)

A single repository containing a single Next.js application. A monorepo tool is **not** introduced in V1; if a second deployable (for example a standalone API) appears, restructuring into a workspace is a planned migration.

```text
henu-website/
├── src/
│   ├── app/                 # Routes, layouts, loading/error/not-found, route groups
│   │   ├── (public)/        # Public marketing, product, service, docs, downloads routes
│   │   ├── (admin)/         # Admin routes (guarded), separate layout
│   │   └── api/             # Route Handlers (webhooks, public machine-readable endpoints)
│   ├── components/
│   │   ├── ui/              # Accessible, token-driven primitives
│   │   ├── layout/          # Shell, navigation, footer, section containers
│   │   └── features/        # Domain components (products, services, releases, enquiry, docs)
│   ├── content/             # Source-controlled content (MDX + validated structured data)
│   │   ├── products/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── docs/
│   │   ├── releases/
│   │   └── blog/            # V1.1
│   ├── server/              # Server-only code (guarded from client import)
│   │   ├── services/        # Business logic / use cases
│   │   ├── repositories/    # Content and database access (the only DB touchpoint)
│   │   ├── db/              # Client factories, generated DB types
│   │   ├── auth/            # Session helpers, admin guard
│   │   └── integrations/    # Email, bot protection, external services
│   ├── lib/                 # Framework-independent, side-effect-free utilities
│   ├── config/              # Site config, navigation model, feature flags, env schema
│   ├── types/               # Shared domain types not derivable elsewhere
│   └── hooks/               # Client-side hooks (only if genuinely needed)
├── public/                  # Only assets that must be served verbatim
├── supabase/                # Migrations, seed data, local-dev config
├── tests/                   # unit / integration / e2e
├── scripts/                 # Release workflow, content validation, maintenance scripts
├── docs/                    # Engineering docs, ADRs
└── (tooling config files)
```

### 10.2 Responsibilities and rules

| Directory | Responsibility | Rules |
|-----------|---------------|-------|
| `app/` | Routing, layouts, page composition, metadata, loading/error boundaries | Pages are thin: fetch via services, compose components. No business logic, no direct DB calls. |
| `components/ui` | Generic accessible primitives | No domain knowledge; no data fetching |
| `components/layout` | Site shell and structural patterns | No data fetching beyond configuration |
| `components/features` | Domain-specific UI | Receive typed props; no repository imports |
| `content/` | Authoritative source-controlled content | Validated at build against schemas; the only place product/service/release copy lives |
| `server/services` | Use cases and business rules | Framework-independent where possible; callable from actions, handlers, and a future API |
| `server/repositories` | Data access (files and DB) | The **only** layer that imports the DB client or reads content files |
| `server/db` | Client creation, generated types | Server-only |
| `server/auth` | Session retrieval, admin guard | Server-only |
| `server/integrations` | Third-party adapters | Isolated so providers are replaceable |
| `lib/` | Pure utilities (formatting, slugs, validation helpers) | No server secrets, no framework state |
| `config/` | Centralised configuration, validated environment schema | Single place to read env; no `process.env` scattered through code |
| `types/` | Shared domain types | Prefer derived types (DB-generated, schema-inferred) over hand-written duplicates |
| `public/` | Verbatim static assets | No large media or downloads |
| `tests/` | Unit, integration, e2e | Organised per layer (Section 26) |

**Deviation from the suggested starter structure:** the proposed top-level `services/` is placed under `server/services` and grouped with other server-only code, so that "server-only" is a **directory-level guarantee** enforced by tooling, not a convention. `src/` is used to keep configuration files separate from application code. Directories without a clear responsibility (for example a generic `utils` or `helpers` beyond `lib/`) are intentionally omitted.

### 10.3 Import boundary rules (enforced by lint/tooling)

- `components/*` and `app/*` Client Components **must not** import from `server/*`.
- Only `server/repositories` imports DB clients or reads `content/`.
- Only `config/` reads environment variables.
- `server/*` modules carry a server-only guard so an accidental client import fails the build `[SECURITY BOUNDARY]`.
- Feature modules do not import each other's internals; they communicate through services and typed contracts.

---

## 11. Route Architecture

### 11.1 Public routes

| Route | Type | Phase | Notes |
|-------|------|-------|-------|
| `/` | Static | **V1** | Home |
| `/products` | Static | **V1** | Ecosystem hub |
| `/products/henu-os` | Static | **V1** | Flagship page; also an instance of the dynamic product route |
| `/products/[slug]` | Static (generated params) | **V1** for launch-ready products; others V1.1 | HENU PA, HENU AI, HENU IDE, others, driven by content |
| `/services` | Static | **V1** | Services hub |
| `/services/[service]` | Static (generated params) | **V1** for validated services | Content-driven |
| `/technology` | Static | **V1** | |
| `/projects` | Static | **V1** if real work exists, else V1.1 | Case-study index |
| `/projects/[project]` | Static (generated params) | Same | |
| `/downloads` | Static + revalidation | **V1** (or honest status state) | Downloads hub |
| `/downloads/henu-os` | Static + revalidation | **V1** | Release data driven |
| `/releases` | Static + revalidation | **V1.1** (V1 if release history exists at launch) | Release history |
| `/releases/[version]` | Static + revalidation | **V1.1** | Per-release notes |
| `/documentation` | Static | **V1** (entry) | |
| `/documentation/[...slug]` | Static (generated params) | **V1** essentials; expanded V1.1 | MDX-driven; catch-all matches docs tree |
| `/blog`, `/blog/[slug]` | Static + revalidation | **V1.1** | Only with real content and an owner |
| `/about` | Static | **V1** | |
| `/contact` | Static shell + Server Action | **V1** | Intent-based |
| `/faq` | Static | **V1** | May be embedded rather than a standalone page |
| `/privacy`, `/terms` | Static | **V1** | Legal review `[REQUIRES CONFIRMATION]` |
| `/security` (disclosure page) | Static | **V1.1** (V1 if OS publicly distributed) | |
| Not-found / error | Framework conventions | **V1** | |
| `/sitemap.xml`, `/robots.txt` | Generated | **V1** | |

### 11.2 Admin and API routes

| Route | Phase | Notes |
|-------|-------|-------|
| `/admin` (login/redirect) | **V1.1** (V1 only if admin required at launch) | `noindex`, not linked from public navigation |
| `/admin/enquiries` | **V1.1** | First admin module |
| `/admin/releases` | **V1.1** | Only when releases move to DB |
| `/admin/...` other modules | **Future** | Per Section 12 |
| `/api/v1/releases/latest` (and similar) | **V1.1 / Future** | Public read-only machine-readable contract if a consumer exists |
| `/api/webhooks/*` | As needed | Route Handlers for external callbacks |

### 11.3 Route design rules

- URLs are **lowercase, hyphenated, human-readable and stable**. Slugs come from content, not IDs.
- **Dynamic routes** exist only where content is naturally collection-based (products, services, projects, docs, releases, blog).
- `generateStaticParams`-style enumeration is derived from the content layer so adding a content file adds a route.
- Product slugs and download slugs must stay consistent (`henu-os` appears in `/products` and `/downloads`).
- Admin lives in an **isolated route group with its own layout and guard**; public layouts never render admin chrome.
- Documentation route structure mirrors the docs content tree. If documentation later moves to a separate application/domain, redirects preserve URLs `[REQUIRES CONFIRMATION: PRD documentation hosting decision]`.
- Locale prefixes are **not** present in V1 URLs (Section 21).

---

## 12. Admin Architecture

### 12.1 Posture

The admin area is a **small, purpose-built operations surface**, not a CMS platform. It exists to manage data that is (a) persisted in the database and (b) needs non-developer or no-deploy changes. Everything else stays in Git.

### 12.2 Per-area decision

| Area | V1 | Needs DB persistence | Needs admin UI | Static source-controlled sufficient? |
|------|----|---------------------|----------------|--------------------------------------|
| Contact enquiries | Yes (capture) | **Yes** | **V1.1** (V1: review via Supabase dashboard + email notification) | No |
| Service enquiries | Yes (capture) | **Yes** (same table) | V1.1 | No |
| Releases | Yes (display) | V1.1 | V1.1, only when release cadence justifies | **Yes in V1** |
| Download metadata | Yes (display) | V1.1 (with releases) | V1.1 (with releases) | **Yes in V1** |
| Products | Yes (display) | No | No | **Yes** |
| Services | Yes (display) | No | No | **Yes** |
| Projects / case studies | Conditional | No (V1) | No (V1) | **Yes** |
| Blog posts | V1.1 | Only if non-developer publishing is required | Future | **Yes initially** |
| Testimonials | Conditional | No | No | **Yes** |
| Documentation metadata | Yes | No | No | **Yes (derived from files)** |
| Site configuration | Yes | No | No | **Yes** |

### 12.3 Recommended phasing

- **V1:** No custom admin UI. Enquiries are persisted, an email notification reaches an owner, and the database is reviewed through the managed Supabase dashboard by authorised operators `[SECURITY BOUNDARY]`. This satisfies the requirement without building and securing an admin surface prematurely.
- **V1.1:** A minimal admin with an **enquiries module** (list, view, change status) and, if the release cadence warrants, a **releases module**.
- **Future:** Further modules only when a concrete need appears.

`[REQUIRES CONFIRMATION: whether an admin dashboard is mandatory at launch — see PRD Open Product Decision]`. If it is mandatory, the V1.1 enquiries module moves into V1; the architecture is unchanged.

### 12.4 Admin structural rules

- **Modular:** each admin area is a self-contained module (routes, components, actions, service functions). Adding or removing a module does not touch others.
- **Authenticated by Supabase Auth**; authorisation enforced **server-side on every admin page and every mutation**, not only in navigation or middleware `[SECURITY BOUNDARY]`.
- **No admin logic in public routes**, and no public code importing admin modules.
- **Admin data access** uses a distinct access policy from public flows (Section 13.4).
- **Audit trail** for admin writes from V1.1 (lightweight).
- Admin routes are `noindex`, excluded from sitemap, and not discoverable via public navigation.

---

## 13. Data Access Architecture

### 13.1 Layering

```text
UI (Server Component / Client Component)
        │  props / form submission
        ▼
Adapter  (Server Component data call │ Server Action │ Route Handler)
        ▼
Service layer      (business rules, orchestration, validation)
        ▼
Repository         (content files │ PostgreSQL via Supabase)
        ▼
Data store
```

### 13.2 Responsibilities

| Layer | Does | Does not |
|-------|------|----------|
| **UI** | Renders typed data, handles interaction | Query the database, read secrets, contain business rules |
| **Adapter** | Receives input, invokes validation and service, shapes the response (redirect, error state, JSON) | Contain business logic |
| **Service** | Enforces rules (for example "a release cannot be published without a checksum"), composes repositories, triggers notifications | Know about HTTP, cookies or React |
| **Repository** | Reads/writes data, maps rows/files to domain types | Contain business rules or UI formatting |

### 13.3 Rules

1. **No database access outside `server/repositories`.** Enforced through import restrictions and review.
2. **No repository calls from Client Components.** Client Components receive data via props or call Server Actions.
3. **Repositories expose domain-oriented methods** (for example `getLatestRelease(product, channel)`), not generic query passthroughs.
4. **Content and database repositories implement the same interfaces** where a domain moves between them (releases).
5. **No custom ORM or database-abstraction framework** is built (Section 34).

### 13.3.1 Browser-to-database access

In V1 the browser **does not query Supabase directly** (no client-side database or storage calls for application data). All reads and writes go through server code. This keeps validation, rate limiting and secrets on the server and removes the need to rely on browser-exposed keys for data operations `[SECURITY BOUNDARY]`.

### 13.4 Credential and privilege model (structural)

| Context | Privilege level | Notes |
|---------|-----------------|-------|
| Public enquiry creation | Server-side, **narrowly scoped** (insert-only operation) | Never exposes elevated credentials to the browser |
| Admin reads/writes | Authenticated user context with role check; RLS as defence-in-depth | Prefer user-scoped access over blanket elevated credentials |
| Elevated (service-role-class) credentials | **Server-only, minimal usage, confined to specific repository functions** | Never imported by client code; never prefixed for browser exposure `[SECURITY BOUNDARY]` |
| Release publishing automation | Separate scoped credentials outside the web application | `[SECURITY BOUNDARY]` |

RLS is enabled on every table in the exposed schema. Default policy is **deny**; policies grant only what a defined role needs. Detailed policy design belongs to `03-SECURITY-ARCHITECTURE.md`.

---

## 14. Type Safety

### 14.1 Principles

- TypeScript **strict mode**; no implicit `any`; explicit handling of nullability.
- **One source of truth per type.** Types are derived from the authoritative definition rather than re-declared.
- Type checking is a **required CI gate**.

### 14.2 Type sources by category

| Category | Source of truth | Notes |
|----------|-----------------|-------|
| **Database entities** | **Generated types** from the Supabase/Postgres schema | Regenerated after each migration; committed or generated in CI; conflicts are compile errors, not runtime surprises |
| **Form data / user input** | **Validation schemas**, with TypeScript types **inferred from the schema** | The schema validates at runtime; the inferred type guarantees compile-time consistency |
| **Content (products, services, case studies, releases)** | **Content schemas** validated at build; types inferred | Missing or malformed content fails the build |
| **Product / service / release domain types** | Derived from content schemas (V1) or DB types (V1.1) behind the repository interface | UI depends on the domain type, not on its storage |
| **API responses** | Explicit response types per endpoint, derived from domain types | Versioned if public (Section 29) |
| **User / session data** | Types from the auth library, narrowed into an application `AdminSession` type | Client never receives more session data than it needs |
| **Component props** | Declared at component level using domain/derived types | Avoid duplicating domain shapes in props |
| **Environment variables** | **Schema-validated at startup**; typed accessors from `config/` | Application fails fast on missing/invalid configuration |

### 14.3 Anti-duplication rules

- Do not hand-maintain a TypeScript interface that mirrors a DB table or a validation schema.
- Map DB rows to domain types **once**, in the repository; the rest of the app uses domain types.
- Public-facing types must not expose internal fields (internal IDs, audit fields, storage keys) unless intended.

---

## 15. Validation Architecture

### 15.1 Boundaries

```text
User input / external data
        ↓
Boundary validation  (schema parse: shape, types, lengths, formats)
        ↓
Business validation  (rules in the service layer)
        ↓
Persistence constraints (database constraints as the last line of defence)
```

### 15.2 Rules

- **Client-side validation improves UX; server-side validation protects the system.** Both use the **same schema definition** where practical so rules cannot drift.
- **Every Server Action, Route Handler and externally supplied data path validates input with a schema before any logic runs.** Unvalidated input is never passed to services.
- **Output is shaped deliberately.** Responses return only intended fields.
- **Normalisation** (trimming, case-folding emails) occurs at the boundary.
- **Database constraints mirror critical invariants** so correctness does not depend on application code alone.
- **Content files are validated at build time** with the same schema approach, so invalid content cannot deploy.
- **Error reporting to users is field-level and accessible**; internal validation details are not leaked.

### 15.3 Library recommendation

Recommended: **Zod** (mature, TypeScript-inferred types, wide ecosystem adoption, usable on both client and server). Alternatives considered: Valibot (smaller bundle, comparable), ArkType, Yup. Zod is recommended for ecosystem familiarity and tooling support; bundle size on the client is a measured consideration, and the choice is revisited if form islands become a measurable weight. `[REQUIRES CONFIRMATION: final library after team review]`

---

## 16. Data Fetching Strategy

### 16.1 Decision table

| Situation | Mechanism | Examples |
|-----------|----------|----------|
| Content that changes infrequently | **Static / pre-rendered** at build | Products, services, about, docs, case studies |
| Content that changes without code deploys (V1.1 DB releases, blog) | **Static with on-demand revalidation (tag/path-based)** | Downloads, releases |
| Data that must be fetched securely before render and is private | **Server-side dynamic fetch** | Admin lists, session-dependent views |
| Browser interactivity that genuinely needs live data | **Client-side fetching**, narrowly scoped | Rare in V1; e.g., a future live status widget |
| First-party mutations | **Server Actions** | Enquiry submission, admin status updates |
| Reusable, externally-consumable boundary | **API endpoint (Route Handler → later standalone)** | Public release metadata endpoint |

### 16.2 Rules

- **Default is Server Components fetching through the service layer.** No client-side data fetching library is included by default.
- **No waterfalls:** fetch independent data in parallel at the server; avoid sequential round-trips.
- **Colocate data requirements with the page**, pass typed props down.
- **Client fetching must be justified** per use case. A page that becomes a client-side application is a design failure for this site.
- **Mutations return structured results** (success, field errors, safe failure message) and trigger targeted revalidation of affected content.
- **Do not create REST endpoints for first-party UI use** where a Server Component or Server Action suffices.

---

## 17. Caching & Performance

### 17.1 Strategy

> Use the simplest rendering model that satisfies each page's requirements. Static first; revalidate when data changes; dynamic only when data is per-user or must be real-time.

### 17.2 Layers

| Layer | Strategy |
|-------|----------|
| **Rendering** | Static generation for content pages; on-demand revalidation for data-driven pages; dynamic only for admin and per-request cases |
| **Server Components** | Default; reduces shipped JavaScript and enables server-side data access |
| **CDN (application)** | Static HTML and assets cached at the edge; hashed assets with long-lived immutable caching |
| **Data/route caching** | Tag-based revalidation for releases and similar data; explicit rather than implicit. **Caching defaults differ between framework versions; the chosen version's behaviour must be verified and caching must be configured explicitly rather than relied upon implicitly.** |
| **Download origin** | Long-lived caching for immutable artifacts; separate rules from the application |
| **Images** | Framework image optimisation, modern formats, responsive sizes |
| **Fonts** | Self-hosted via framework font optimisation; limited families/weights; swap behaviour chosen deliberately `[design-system dependent]` |
| **Code splitting** | Route-level by default; dynamic imports for heavy client-only widgets |
| **Lazy loading** | Below-the-fold images, embeds and videos |
| **Client JavaScript** | Budgeted; tracked in CI (Section 25); third-party scripts require justification |

### 17.3 Performance as an architectural requirement

- **Budgets** are established and enforced: JavaScript per route, image weight above the fold, Core Web Vitals thresholds. Numeric budgets are **to be established** from a measured baseline and published thresholds, not invented here. `[REQUIRES CONFIRMATION]`
- **SSR is not a performance guarantee.** Server rendering moves work to the server; poorly cached or slow-data pages can be slower than static ones. Pages are therefore static by default and measured.
- **Field measurement** (real-user Core Web Vitals) supplements lab tests.
- **Regional performance** depends on the audience's geography `[REQUIRES CONFIRMATION]`; app region, database region and CDN edge coverage should be chosen together.
- **Database latency:** pages do not call the database at request time unless dynamic; static generation and revalidation shield visitors from DB latency.

---

## 18. Media Architecture

### 18.1 Rules by media type

| Media | Handling |
|-------|---------|
| **Product screenshots** | Source stored in repo (if reasonably sized) or storage; served through the image optimisation pipeline; modern formats with fallbacks; **real screenshots only for real product states** (PRD evidence principle) |
| **Hero media** | The single largest above-the-fold image is **prioritised** (not lazy) with explicit dimensions to avoid layout shift; no more than one priority media element per view |
| **UI illustrations** | Prefer **vector (SVG)** for diagrams and icons, optimised and accessible; inline only when small or needing styling control |
| **Promotional / demonstration videos** | Hosted on **object storage + CDN or a managed video platform** `[REQUIRES CONFIRMATION]`; multiple encodes and a poster image; never committed to the repository |
| **Background videos** | Allowed only if short, muted, looped, compressed, **disabled for reduced-motion** and constrained on small/low-power connections; must never block LCP; decorative ones carry no essential information |
| **3D assets (future)** | Loaded lazily and on demand, behind an explicit interaction or viewport trigger; not in V1 baseline; require a performance review before adoption |
| **Responsive images** | Multiple widths/formats via the framework pipeline; correct `sizes` attributes |

### 18.2 General requirements

- **Formats:** modern compressed formats (such as AVIF/WebP) with fallbacks where the pipeline requires; SVG for vector; MP4/WebM for video. Exact codec policy decided at implementation.
- **Compression:** every asset is compressed before commit; a size budget per asset class is enforced by CI where feasible `[REQUIRES CONFIRMATION: thresholds]`.
- **Dimensions:** width/height always specified to prevent layout shift.
- **Lazy loading:** default for non-critical media; **above-the-fold media is never lazy-loaded.**
- **Video behaviour:** no autoplay with sound; `preload` minimal for non-hero video; user-initiated play for demonstrations; use a poster/facade for heavy embeds so third-party players load only on interaction.
- **Accessibility:** meaningful `alt` text for informative images; empty `alt` for decorative ones; captions and transcripts for demonstration videos; motion respects reduced-motion preference.
- **Provenance:** media metadata (source, rights, date) tracked for assets that require permission (customer screenshots, logos) `[REQUIRES CONFIRMATION: usage rights]`.
- **Rule:** large media must never degrade Core Web Vitals; a media addition that does is rejected or deferred.

---

## 19. SEO Architecture

| Concern | Technical approach |
|---------|-------------------|
| **Page metadata** | Framework metadata API; every route defines title and description; defaults come from site config |
| **Dynamic metadata** | Metadata generated from content/release data for dynamic routes (products, services, projects, docs, releases, posts) |
| **Canonical URLs** | Explicit canonical per page, derived from a single site URL config; consistent trailing-slash and host policy |
| **Sitemap** | Generated from the content and route layers so new content appears automatically; excludes admin and noindex pages |
| **Robots** | Generated; **production allows crawling, non-production blocks everything**; admin disallowed `[SECURITY BOUNDARY]` |
| **Open Graph / social** | Per-page title/description/image; shared defaults; programmatically generated share images where valuable |
| **Structured data** | JSON-LD helpers for Organization, WebSite, SoftwareApplication (products/releases), Article (posts), BreadcrumbList, FAQPage (only where content matches visible FAQ); never markup that doesn't match visible content |
| **Semantic URLs** | Human-readable, stable slugs; redirects maintained when slugs change |
| **Indexing rules** | Indexable: public content pages. `noindex`: admin, thin/placeholder pages, search/result variants, staging environments |
| **Internal linking** | Content model includes relationships (product ↔ docs ↔ releases ↔ services ↔ case studies) so related links are generated, not hand-maintained |
| **Rendering for crawlers** | All meaningful content is present in server-rendered/static HTML; no critical content that depends on client-side fetching |
| **Redirects** | Centralised redirect config for renamed routes and future docs relocation |
| **Brand disambiguation** | Organization structured data and consistent naming support entity recognition for "HENU" `[REQUIRES CONFIRMATION: search landscape]` |
| **Hreflang (future)** | Only added if internationalisation is adopted |

Unique metadata is a **content requirement enforced by validation**: content schemas require title and description fields so pages cannot ship without them.

---

## 20. Accessibility Architecture

Accessibility is implemented at **component and layout level**, with verification in CI and manual checks.

| Area | Architectural provision |
|------|------------------------|
| **Semantic HTML** | Layout primitives render correct landmarks (header, nav, main, footer); a single `main`; heading hierarchy rules; lists, tables and buttons use native elements |
| **Keyboard navigation** | All interactive primitives are keyboard-operable; skip-to-content link in the shell; logical focus order; no keyboard traps |
| **Accessible forms** | Form primitives bind labels, descriptions and errors programmatically; validation errors identify the field and are announced; required/optional clearly indicated |
| **Focus management** | Visible focus tokens in the design system; focus moves intentionally after route changes, dialogs and form submission results |
| **Screen readers** | Accessible names on all controls; live regions for asynchronous status (form result, copy-to-clipboard confirmation); meaningful link text (not generic "learn more") |
| **Colour contrast** | Colour tokens validated against contrast requirements in every theme/state as part of the design-system process |
| **Reduced motion** | Motion tokens respect `prefers-reduced-motion`; essential information is never conveyed by animation alone |
| **Interactive controls** | Disclosure, tabs, dialogs and menus use well-established accessible patterns, from a vetted headless/primitive library if needed rather than hand-rolled `[REQUIRES CONFIRMATION: library choice]` |
| **Alternative text** | Content schema supports alt text for images; informative images require it |
| **Media** | Captions/transcripts for video; no auto-playing audio |
| **Technical content** | Code blocks, tables and checksums are keyboard-focusable/scrollable and readable on small screens; copy controls are labelled |
| **Testing** | Automated checks in component/E2E tests, plus manual keyboard and screen-reader spot checks on critical journeys; target conformance level follows the PRD `[REQUIRES CONFIRMATION]` |

---

## 21. Internationalization

| Aspect | Classification |
|--------|---------------|
| Full multilingual website | **Not currently required** `[REQUIRES CONFIRMATION: PRD multilingual decision]` |
| Single-locale launch (one primary language) | **V1** |
| Architecture able to add locales later without rebuilding pages | **Future-ready (V1 design constraint)** |

**Future-ready provisions (low cost, no i18n framework in V1)**

- **No user-facing copy hardcoded in logic or deeply embedded in components** where it can be avoided; structured copy lives in content files and configuration.
- **Content files are language-addressable**: content is organised so a locale dimension can be added (for example per-locale content folders) without restructuring.
- **Dates, numbers and sizes use locale-aware formatting utilities** from `lib/` rather than ad hoc string building.
- **Layouts tolerate text expansion and different scripts/directions** (use logical CSS properties where practical; avoid fixed-width text containers).
- **Routing** can adopt a locale segment later; internal links go through a link helper so adding prefixes is a single change.
- **Metadata and structured data** are generated from content, so adding hreflang later is localised work.

**Not done in V1:** locale routing, translation workflow, translation management systems, RTL support, locale-specific SEO. Introducing these is a project, not a flag. The chosen i18n library, if adopted, is evaluated at that time.

---

## 22. Error Handling & Observability

### 22.1 Separation of concerns

| Audience | Behaviour |
|----------|-----------|
| **User-facing** | Safe, human, actionable messages with recovery paths; never stack traces, SQL errors, internal identifiers or secrets |
| **Developer diagnostics** | Structured logs and error-tracking events with correlation context, severity and sufficient detail to debug; sensitive fields redacted |

### 22.2 Failure handling matrix

| Failure | User experience | Diagnostics |
|---------|----------------|-------------|
| **Unexpected application error** | Route-level error boundary with friendly message and retry/home path; global fallback exists | Captured in error tracking with route and release tag |
| **404** | Helpful not-found page with navigation to likely destinations | Logged at low severity; track recurring 404s for redirects |
| **500 / server failure** | Generic safe error page | Alert on elevated rate |
| **Database failure on a dynamic path** | Safe degraded state (for example "unable to load, try again") | High-severity alert |
| **Database failure on static pages** | None; pages are pre-rendered | n/a |
| **Enquiry form failure (validation)** | Field-level accessible errors; input preserved | Not alerted (expected) |
| **Enquiry form failure (persistence)** | Clear failure message, preserved input, alternative contact method | Alert; capture reason |
| **Enquiry persisted but notification failed** | User sees success (data is safe) | Alert/retry; operator reconciliation path |
| **Release metadata invalid or unavailable** | Build fails (V1) / safe fallback (V1.1) rather than a broken download | Alert |
| **Download failure (host unreachable/corrupt file)** | Recovery guidance, checksum verification help, alternative source if available | Monitor artifact availability and CDN error rates |
| **Third-party service outage (email, bot protection, analytics)** | Graceful degradation; core site unaffected | Alert on integration failures |
| **Admin errors** | More detailed, but still safe, messages | Full diagnostics |

### 22.3 Observability components

| Capability | Approach | Phase |
|-----------|---------|-------|
| **Error tracking** | Hosted error tracking for server and client, tagged by environment and release `[REQUIRES CONFIRMATION: provider]` | V1 |
| **Structured logging** | Consistent structured logs from the server layer; **no secrets or unnecessary personal data in logs** `[SECURITY BOUNDARY]` | V1 |
| **Uptime / synthetic monitoring** | External checks on key routes, the download origin, and the enquiry flow | V1 |
| **Performance monitoring** | Real-user Core Web Vitals from the host/analytics + lab checks in CI | V1 |
| **Database monitoring** | Managed platform metrics and alerts | V1 |
| **Download origin monitoring** | CDN/storage error and bandwidth metrics | V1 if downloads public |
| **Alerting** | Routed to a named owner `[REQUIRES CONFIRMATION: on-call/ownership model]` | V1 |
| **Tracing / APM** | Not required | Future |

Alert thresholds are **to be established** after a baseline exists; none are invented here.

---

## 23. Environment Configuration

### 23.1 Environments

| Environment | Purpose | Data | Indexing |
|-------------|---------|------|---------|
| **Development** | Local work | Local or dedicated dev Supabase project; seed data only | n/a |
| **Staging** (and per-PR previews) | Pre-production validation | Dedicated staging Supabase project; **never production data** | Blocked from indexing; access-restricted where appropriate |
| **Production** | Live site | Production Supabase project | Indexable |

Each environment has **its own** database project, storage bucket/prefix, secrets, domain and monitoring tag.

### 23.2 Configuration categories

| Category | Definition | Examples |
|----------|-----------|----------|
| **Public configuration** | May safely reach the browser; must carry the framework's public-exposure prefix **only** when intentionally public | Site URL, public analytics identifier, public Supabase URL and public/anon key (if browser-side Supabase is used at all), feature flags that are not sensitive |
| **Server-only secrets** | Must never reach the browser | Database connection credentials, **service-role-class keys**, auth secrets, OAuth client secrets, email provider keys, bot-protection secret keys, storage/CDN write credentials, webhook signing secrets, monitoring auth tokens |
| **Build/CI-only secrets** | Used only in pipelines | Deployment tokens, release-publishing credentials (scoped to storage) |

### 23.3 Rules

1. **Never hardcode secrets in source. Never commit secrets to Git.** Secret scanning is enabled on the repository and in CI.
2. **Only `config/` reads environment variables.** Application code consumes typed, validated config.
3. **Schema-validate environment variables at startup/build**; missing or malformed values fail fast with clear errors (without printing secret values).
4. **Public-prefixed variables are reviewed in pull requests**; a secret must never be given a public prefix.
5. **Secrets are stored in the hosting platform/CI secret store**, scoped per environment, and rotatable.
6. **Different credentials per environment**; compromise of one does not affect the others.
7. **A documented example file** lists required variable *names* (no values) for onboarding.
8. **Least privilege:** credentials carry only the permissions their purpose needs (for example, release-publishing credentials cannot access the production database).

Secrets management policy, rotation and incident handling are covered in `03-SECURITY-ARCHITECTURE.md`.

---

## 24. Deployment Architecture

### 24.1 Three distinct infrastructure concerns

| Concern | Provides | V1 recommendation |
|---------|---------|------------------|
| **Application deployment** | Runs Next.js, serves pages, executes Server Actions/Route Handlers | Managed Next.js-compatible platform |
| **Database infrastructure** | PostgreSQL, Auth | Supabase (one project per environment) |
| **Large-file/media distribution** | Artifacts and large media | Dedicated object storage + CDN, separate hostname |

These are provisioned, scaled, billed and secured independently.

### 24.2 Application hosting options

| Option | Next.js compatibility | Node.js support | CDN | Simplicity | Cost behaviour | Scalability | Operational load |
|--------|----------------------|----------------|-----|-----------|----------------|-------------|------------------|
| **Vercel** | Strongest (framework developer's platform); all framework features first-class | Yes | Built-in global | Highest: Git-push deploys, previews, rollbacks | Usage-based; **verify limits and pricing for bandwidth, function usage and team seats**; keep large files off it | Strong, automatic | Lowest |
| **Cloudflare (Workers/Pages) with Next.js adapter** | Good but runs on a different runtime; some Node.js APIs and framework features may differ; verify feature parity for the chosen version | Partial/compat-based | Built-in global, strong | Moderate | Often favourable; pairs naturally with R2 | Strong | Moderate (compatibility testing) |
| **Netlify** | Good via adapter | Yes | Built-in | High | Usage-based | Strong | Low |
| **Self-managed Node.js on a VM/container platform (e.g., a container service or VPS) behind a CDN** | Full (Node server) | Full | Add separately | Lowest: you own build, TLS, scaling, patching, rollbacks | Predictable for steady load | Manual or platform-assisted | **Highest** |
| **AWS (Amplify/ECS/other)** | Good with configuration | Yes | Add CloudFront | Moderate–low | Variable | Strong | Moderate–high |

### 24.3 Recommendation

**V1: deploy the Next.js application on Vercel (managed, Next.js-native), with the database on Supabase and large artifacts on dedicated object storage + CDN.**

**Reasoning**

- The site's profile (mostly static content with light server logic) is the case managed Next.js platforms handle best, with preview deployments, atomic deploys and instant rollback that suit a small team.
- It minimises operational burden, aligning with the principle of avoiding custom infrastructure.
- **Large-file cost and limit risk is avoided structurally** by keeping artifacts and heavy media off the application host.

**Caveats and revisit conditions**

- **Vendor coupling and cost scaling:** usage-based pricing should be modelled against expected traffic `[REQUIRES CONFIRMATION: no traffic assumptions are made]`. Application code should avoid platform-proprietary APIs where equivalent standard approaches exist, keeping a path to self-hosted Node.js or another host.
- **Regional performance and data residency** `[REQUIRES CONFIRMATION]`: if HENU's audience is concentrated in a region where the managed platform's edge/function regions perform poorly, or if data-residency requirements exist, reconsider hosting or choose function and database regions together.
- **Organisational constraints** `[REQUIRES CONFIRMATION]`: if HENU requires self-hosting, cost control through fixed-cost infrastructure, or avoids specific vendors, a containerised Next.js deployment on a managed container service behind a CDN is the primary alternative. The architecture supports this because no V1 feature depends on a platform-exclusive capability.

### 24.4 Supporting infrastructure

| Item | Approach |
|------|---------|
| **Domain / DNS** | Single apex domain `[REQUIRES CONFIRMATION]`; subdomains for download/media origin (and docs if separated); DNS with a reliable provider, low TTLs during launch, DNS records documented in the repo's engineering docs |
| **TLS** | Managed certificates (automatic issuance/renewal) on all hostnames; HTTPS enforced; HSTS policy defined in the security document `[SECURITY BOUNDARY]` |
| **Email DNS** | SPF/DKIM/DMARC for the sending domain (required for enquiry notification deliverability) |
| **Supabase** | Managed; region chosen with the application region in mind; plan tier selected for backups and limits `[REQUIRES CONFIRMATION]` |
| **Object storage + CDN** | Per Section 8; separate hostname; access logs enabled |
| **Preview/staging protection** | Access-restricted and `noindex` |
| **Infrastructure as code** | Not required in V1 beyond versioned Supabase migrations and documented configuration; introduce IaC when infrastructure has more than a handful of managed resources `[Future]` |

---

## 25. CI/CD

### 25.1 Pipeline

```text
Developer branch
      ↓
Pull Request
      ↓
Automated checks (parallel where possible):
   · Lint
   · Type check
   · Unit & integration tests
   · Content/schema validation (content, releases)
   · Build
   · Dependency & secret scanning
   · Accessibility checks (automated)
      ↓
Preview deployment (per PR)
      ↓
E2E tests against the preview (critical journeys)
      ↓
Review & approval
      ↓
Merge to main
      ↓
Staging deployment  (automatic)
      ↓
Smoke tests
      ↓
Production deployment (promotion; manual approval in V1)
```

### 25.2 Branch strategy

**Trunk-based with short-lived branches.** `main` is always deployable. Feature branches are short-lived and merged through reviewed pull requests. No long-lived `develop` branch. This is practical for a small team; if the team grows or release trains emerge, release branches can be introduced. `[REQUIRES CONFIRMATION: team size and review policy]`

### 25.3 Pull request checks (required to merge)

Lint, type check, tests, content validation, build success, dependency/secret scanning, and at least one reviewer approval. Bundle/size and basic performance budget checks are added once a baseline exists.

### 25.4 Deployment strategy

| Aspect | Approach |
|--------|----------|
| **Preview** | Every PR gets an isolated preview using the staging-class backend (never production data) |
| **Staging** | Updated on merge to `main`; used for integration verification and release candidates |
| **Production** | Promoted from a verified build, with **manual approval in V1**; automated promotion considered later when test confidence is high |
| **Database migrations** | Applied through a controlled step before/with deployment; forward-only, expand-and-contract; reviewed with the code that depends on them |
| **Environment separation** | Different secrets, databases, domains and monitoring tags per environment (Section 23) |
| **Release artifacts (HENU OS)** | Published through a **separate release workflow** (Section 9.4), not by the website pipeline |

### 25.5 Rollback

| Layer | Strategy |
|-------|---------|
| **Application** | Redeploy/promote the previous known-good deployment (immutable deployments make this fast) |
| **Database** | Forward-fix preferred; migrations designed to be backward compatible with the previous app version so an application rollback does not break; restore from backup/PITR only for data-level disasters |
| **Content** | Git revert |
| **Release metadata** | Mark a release withdrawn; do not delete |
| **DNS/domain** | Documented procedure; low TTL during sensitive changes |

### 25.6 Practicality constraint

No pipeline stage exists without a purpose. No custom CI infrastructure, self-hosted runners or multi-stage approval chains are introduced in V1.

---

## 26. Testing Strategy

### 26.1 Layers and priorities

Testing effort follows **risk**: the highest risk is in enquiry capture, release/download correctness, admin authorisation and build-time content validity, not in visual details of marketing pages.

| Layer | Scope | Tools (category) | Priority targets |
|-------|-------|------------------|------------------|
| **Static analysis** | Type checking, lint, import-boundary rules | TypeScript, linter | All code; enforces architecture rules |
| **Unit** | Isolated logic | Unit test runner | Validation schemas, release "latest" derivation, version/channel sorting, checksum formatting, content mappers, utilities |
| **Content/schema validation** | Content integrity | Build-time schema parse | Products, services, releases (checksum format, required metadata), docs frontmatter, SEO fields |
| **Component** | UI primitives and key features | Component test + accessibility assertions | Form components, navigation, disclosure/tabs, release table |
| **Integration** | Service + repository + database | Test runner against a **local/ephemeral Supabase/Postgres** | Enquiry creation, constraint enforcement, RLS behaviour, admin guard, revalidation triggers |
| **End-to-end** | Critical user journeys in a real browser | Browser E2E tool | See 26.2 |
| **Accessibility** | Automated and manual | Automated a11y engine in E2E/CI + manual checks | Key templates and forms |
| **Performance** | Budgets and Core Web Vitals | Lab auditing in CI/preview + field monitoring | Home, product, downloads |
| **Visual regression** | Optional | Deferred | Future, once the design system is stable |

### 26.2 Critical journeys (E2E)

1. **Homepage navigation:** load, navigate to products, services, documentation, contact; primary CTA works.
2. **Product exploration:** home → products hub → HENU OS → related product links work.
3. **HENU OS download:** downloads page shows the correct latest version, size, checksum; the download link targets the artifact origin; docs/installation links resolve. If no release: status state renders correctly.
4. **Contact form submission:** valid submission persists and shows success; invalid shows accessible errors; backend failure shows safe fallback and preserved input.
5. **Service enquiry:** service page → enquiry flow → persisted with the correct type/service.
6. **Admin authentication (when admin exists):** unauthenticated access to admin is rejected; authorised user can view and update enquiries; non-admin user cannot.
7. **SEO/technical hygiene:** sitemap and robots correct per environment; canonical and metadata present on key pages.
8. **Error pages:** 404 and error boundaries render safely.

### 26.3 Principles

- Tests run in CI on every pull request; E2E runs against the preview.
- Test data is synthetic; no production data in any test environment.
- Third-party services (email, bot protection) are **mocked or sandboxed** in automated tests.
- Flaky tests are fixed or removed, not ignored.
- Coverage is a signal, not a target; there is no arbitrary percentage requirement `[REQUIRES CONFIRMATION: team policy]`.

---

## 27. Dependency Management

### 27.1 Adding a dependency

A new dependency requires, in the pull request description:

1. The **problem** it solves that the platform/framework or existing dependencies cannot.
2. **Alternatives considered**, including writing a small amount of code instead.
3. **Maintenance health:** release activity, maintainers, adoption, open security issues, licence compatibility.
4. **Cost:** bundle impact (client), install footprint, transitive dependency count.
5. **Boundary:** which layer uses it, and whether it can be isolated behind an internal interface (for providers).

Major dependencies are recorded as lightweight decision records (Section 32).

### 27.2 Standards

| Concern | Standard |
|---------|----------|
| **Lockfile** | Exactly one package manager and one committed lockfile; CI installs from the lockfile with a frozen install; the package manager and Node.js version are pinned `[REQUIRES CONFIRMATION: package manager]` |
| **Updates** | Automated update PRs (dependency bot) on a regular cadence; security updates prioritised; framework major upgrades planned as work, not auto-merged |
| **Vulnerability auditing** | Automated audit in CI and on a schedule; known-vulnerable direct dependencies block merge based on severity policy defined in the security document |
| **Unused packages** | Periodic detection and removal; removal is part of normal PR hygiene |
| **Licence compliance** | Licence check for new dependencies; permissive licences preferred; copyleft requires review (HENU's products may have specific licensing considerations `[REQUIRES CONFIRMATION]`) |
| **Supply chain hygiene** | Avoid unmaintained or single-maintainer packages for critical paths; avoid install scripts where possible; pin and review changes to lifecycle scripts `[SECURITY BOUNDARY]` |
| **Client bundle** | Client-side additions are tracked against the JavaScript budget |
| **Provider isolation** | Third-party services (email, monitoring, bot protection) sit behind `server/integrations` interfaces so replacing a vendor is local |

### 27.3 Preference order

1. Platform/framework capability. 2. A few lines of well-tested own code. 3. A small, focused, well-maintained library. 4. A large framework-like dependency (requires explicit justification).

---

## 28. Content & Versioning Model

### 28.1 Principles

- **Single source of truth per entity.** Product names, descriptions, status labels, release versions and service definitions exist in exactly one place; components reference them.
- **Structured content is schema-validated.** Invalid or incomplete content fails the build.
- **Relationships are explicit** (product ↔ releases ↔ docs ↔ services ↔ case studies) so cross-links and navigation are generated.
- **Content storage is hidden behind repositories.** Moving a domain from files to the database (or a CMS later) does not change components.

### 28.2 Entities

| Entity | Key fields (conceptual) | V1 storage | Relationships |
|--------|------------------------|------------|---------------|
| **Product** | `slug`, name, tagline, summary, **status label** (available / beta / in development / coming soon), audience, capabilities, ecosystem relations, evidence references, primary CTA type, SEO fields | Typed content files (frontmatter + MDX body) | Has releases, docs, related products, related case studies |
| **Product version / Release** | `product`, `version`, `channel`, `release_date`, `status`, notes, requirements, links | Structured data files (V1) → DB (V1.1) | Belongs to a product; has artifacts |
| **Download artifact** | `architecture`, file name, size, storage key/URL, SHA-256, optional signature | Part of the release record | Belongs to a release |
| **Service** | `slug`, category, customer problem, approach, deliverables, ideal customer, technology/capabilities, process reference, proof references, CTA type, SEO fields | Typed content files | Related case studies |
| **Project / case study** | `slug`, title, challenge, context, approach, solution, technology, outcome, **evidence** (with source), permission status | MDX + frontmatter | Related services/products |
| **Article (blog/insight)** | `slug`, title, date, author, type, body, related products | MDX (V1.1) | Related product/docs |
| **Documentation page** | path (derived), title, product, version applicability, order, body | MDX tree | Related product/release |
| **Process definition** | Stages and descriptions (HENU's *actual* process) | Structured data file | Referenced by services |
| **Site config / navigation** | Site metadata, navigation model, social links | Config module | Used by layouts, sitemap |

### 28.3 Versioning rules

- **Product versions follow a documented scheme** (for example semantic or date-based) `[REQUIRES CONFIRMATION: HENU OS versioning scheme]`; sort and "latest" logic is implemented once, in `lib/` or the release service, and unit-tested.
- **Documentation declares which product version(s) it applies to**; multi-version documentation is a Future capability.
- **Content changes are code-reviewed** (Git history is the audit trail for static content).
- **Metrics and claims** in content carry a `source` and `owner` field in the schema so unsourced numbers cannot be added (PRD requirement). A content field typed as a "metric" requires both.
- **Status labels are data**, so a product moving from "In development" to "Available" updates every surface consistently.

---

## 29. API Architecture

### 29.1 Posture

> **Do not build an API for every frontend component.** First-party UI uses Server Components and Server Actions. A public, versioned API exists only where a non-browser or independently released consumer needs a stable contract.

### 29.2 V1 API surface

| Endpoint | Purpose | Phase |
|----------|--------|-------|
| None required for first-party UI | Server Components/Actions suffice | V1 |
| `/api/webhooks/*` | Inbound callbacks from external services, only if integrations require them | As needed |
| `/api/v1/releases/latest`, `/api/v1/releases` | Read-only, cacheable machine-readable release metadata for HENU OS components, scripts or partners | **V1.1 / Future, only when a consumer exists** `[REQUIRES CONFIRMATION]` |
| Health endpoint | Uptime monitoring | V1 |

### 29.3 API conventions (apply when any public API exists)

| Concern | Convention |
|---------|-----------|
| **Style** | **REST over HTTP/JSON**; resource-oriented URLs; GraphQL not adopted (no concrete requirement) |
| **Versioning** | **URL-path major versioning** (`/api/v1/...`); additive changes within a version; breaking changes require a new major version with a deprecation period |
| **Request/response** | JSON; consistent envelope or direct resources chosen once and applied everywhere; ISO-8601 timestamps; explicit nullability; pagination for collections (cursor or limit/offset decided when first needed) |
| **Error format** | A **single, consistent error shape** (a problem-details style structure: machine-readable code, human message, optional field errors, correlation identifier); no internal details leaked |
| **Validation** | Schema validation on every input (Section 15) |
| **Authentication boundary** | Public read-only endpoints are unauthenticated; any non-public endpoint requires authentication and explicit authorisation; no endpoint is "authenticated by obscurity" `[SECURITY BOUNDARY]` |
| **Rate limiting boundary** | Applied at the **edge/CDN/platform layer** where possible, plus application-level limits for sensitive actions such as enquiry submission `[SECURITY BOUNDARY]`; specific limits to be defined in the security document |
| **Caching** | Read endpoints return cache headers; release data revalidated on change |
| **Logging** | Structured request logs with correlation IDs; no secrets or unnecessary personal data |
| **Documentation** | A machine-readable description (for example OpenAPI) maintained alongside the code **once a public API exists**; none is produced speculatively |
| **CORS** | Restrictive by default; explicitly allow only known consumers `[SECURITY BOUNDARY]` |
| **Idempotency** | Considered for mutating public endpoints if any are introduced |

### 29.4 Server Actions vs. Route Handlers

Server Actions are for **first-party form and admin mutations** invoked by this application's own UI. They are **not** a public API and must not be treated as a stable contract. Anything an outside consumer will call is a Route Handler (V1/V1.1) or, once extraction criteria are met, part of the standalone Node.js API.

---

## 30. Architectural Boundaries

### 30.1 Boundary map

| Boundary | What lives there | What is allowed | What is not allowed | Security-sensitive points `[SECURITY BOUNDARY]` |
|----------|-----------------|-----------------|---------------------|-----------------------------------------------|
| **Public frontend (browser)** | Rendered HTML, client islands, public configuration | Display public content; submit forms to server actions; link to download origin | Secrets, privileged keys, direct DB access, business logic that enforces rules | Public-prefixed env variables; third-party scripts; CSP; cookies; form abuse (spam, injection, enumeration) |
| **Server/application layer (Next.js)** | Server Components, Server Actions, Route Handlers, services, repositories | Validation, business logic, DB access, notifications, revalidation | Trusting client input; leaking internal errors; logging secrets/PII | Input validation; CSRF/origin handling for mutations; rate limiting; secret handling; error output |
| **Backend/API (future standalone Node.js)** | Reusable business/API logic for external consumers | Versioned APIs, long-running jobs | Duplicating website-only logic; becoming a dumping ground | Authentication of non-browser clients; API keys/tokens; CORS; versioning and deprecation |
| **Database (Supabase PostgreSQL)** | Enquiries, admin profiles, (V1.1) releases, audit log | Access via repositories only; RLS enforced; constraints | Direct browser access in V1; unscoped elevated access; storing secrets | RLS policies; service-role credential exposure; backups; PII retention; migration privileges |
| **Authentication (Supabase Auth)** | Admin identities and sessions | Admin sign-in; session verification server-side | Custom credential storage; trusting client-side role claims | MFA policy; session lifetime; account recovery; admin provisioning; allowlist |
| **Storage / CDN** | Large artifacts, media, (optional) small admin-uploaded assets | Public-read of published artifacts; scoped write via release workflow | Unpublished drafts publicly readable; overwriting published artifacts; app-held broad write keys | Bucket/prefix permissions; write credentials; hotlink/abuse protection; artifact integrity (checksums/signatures); supply-chain trust of the ISO |
| **Admin** | Privileged operations (enquiries, later releases) | Authorised, audited mutations | Public discoverability; admin code in public bundles; blanket elevated database access | AuthZ on every action; audit log; session hardening; IP/device controls if required |
| **External services** | Email, bot protection, monitoring, analytics, DNS, hosting | Accessed only through `server/integrations` adapters | Direct calls from components; unvetted scripts in the browser | API key storage; data shared with third parties (privacy); third-party script risk; webhook verification |
| **Build/CI and release pipeline** | Build, tests, deployments, artifact publishing | Scoped credentials, reviewed changes | Production data in CI; broad long-lived tokens; unreviewed deploys | Pipeline secrets; branch protection; dependency supply chain; signing |

### 30.2 Consolidated hand-off to `03-SECURITY-ARCHITECTURE.md`

The security document should build on at least these structural facts:

1. Browser never accesses the database directly in V1; all data operations are server-side.
2. Elevated database credentials are server-only and confined to specific repository functions.
3. RLS is deny-by-default on every exposed table.
4. Admin authentication is Supabase Auth only; authorisation is enforced server-side per action; V1 has a single admin role with an extensible role column.
5. Large artifacts are served from a separate origin; integrity (checksums, optional signatures) and write-path security are first-class concerns.
6. Public enquiry submission is the main untrusted-input surface (spam, injection, abuse, PII).
7. Environment separation with distinct secrets; secret scanning; public/server config categories.
8. Security headers/CSP, CORS, cookie policy, rate limiting layers, logging redaction, dependency/supply-chain policy, incident handling, and responsible-disclosure process.

---

## 31. Scalability Strategy

### 31.1 Evolution path

| Stage | Description | Architecture |
|-------|-------------|-------------|
| **V1** | High-performance company/product website with enquiry capture and release metadata | Single Next.js app; static-first; Supabase for enquiries; artifact origin for downloads |
| **V1.1** | Content and operations maturity | Minimal admin (enquiries, releases); releases in DB; blog; expanded docs; optional public read-only releases endpoint |
| **Growth** | More products, releases, docs, traffic | Same architecture scales horizontally via CDN/static generation; add caching tuning, more storage lifecycle policy, DB indexes/read optimisation |
| **Platform** | APIs for HENU ecosystem consumers; portals; more admin; roles | Extract standalone Node.js API from the existing service layer; introduce RBAC; consider a workspace/monorepo; separate documentation application if justified |

### 31.2 Clean boundaries that make growth possible (built in V1)

| Boundary | Enables |
|----------|---------|
| **Service layer independent of the web framework** | Mounting the same logic behind a standalone API later |
| **Repository interfaces over content and DB** | Moving domains between files, DB or a CMS without UI changes |
| **Release model as metadata** | More products, architectures, channels and mirrors without UI work |
| **Separate download/media origin** | Independent scaling, provider changes, mirrors/torrents |
| **Isolated admin route group and modules** | Adding portals/modules without touching public code |
| **Role column and server-side authorisation checks** | RBAC without rewriting guard logic |
| **Typed, schema-validated content** | Many more content entries without regression risk |
| **Environment/config separation** | Additional environments or regions |
| **Provider adapters** | Swapping email, monitoring or storage vendors |
| **URL stability and central redirects** | Moving documentation or restructuring without losing SEO |

### 31.3 Future capability mapping (not built now)

| Future capability | Where it fits when needed |
|------------------|--------------------------|
| Client portal | Separate authenticated route group (or app) using the same auth and service layer; introduces Client role |
| Developer portal / API keys | Standalone API + dedicated auth model; developer console as a separate module |
| Community portal | Separate application or third-party platform; link-integrate first |
| Advanced documentation platform | Dedicated docs application/domain consuming the same content sources |
| Download analytics | CDN/storage analytics first; a lightweight, privacy-respecting event pipeline only if required |
| Multi-region / larger traffic | CDN-first; static-heavy design already scales; database read replicas or caching only when measured need appears |
| Search | PostgreSQL full-text search first; dedicated search service only if demonstrably insufficient |
| Interactive HENU OS preview, 3D | Lazy-loaded client modules with performance review |
| Ecosystem integrations (PA/AI/IDE) | Extracted API with versioned contracts |

Scaling decisions are **triggered by measured need**, not assumed. No traffic projections are made here.

---

## 32. Architecture Decisions

Each record uses: **Decision · Reason · Alternatives considered · Why rejected · Consequences · Revisit when.**

### ADR-001 — Next.js as the application framework

- **Decision:** Use Next.js for the website application.
- **Reason:** One framework covering routing, static generation, server rendering, metadata/SEO, image/font optimisation and server mutations; the largest React ecosystem; strong fit for a content-led site with light server logic.
- **Alternatives:** Astro; Remix/React Router framework; SvelteKit/Nuxt; plain React SPA; a CMS-bundled site generator.
- **Why rejected:** *Astro* is excellent for content sites and would be a strong candidate, but the planned admin area, interactive product experiences and React-component reuse favour one React-based application; *Remix/React Router* is capable but offers less built-in static/metadata/image tooling for this profile; *SvelteKit/Nuxt* diverge from the planned React/TypeScript direction and ecosystem familiarity; *SPA* fails SEO/performance goals.
- **Consequences:** Framework upgrade cadence must be managed; caching/rendering semantics must be verified per version; some platform coupling to Next.js-optimised hosts.
- **Revisit when:** the site becomes almost entirely static content with minimal interactivity (reconsider Astro for the marketing/docs layer), or framework changes materially harm maintainability.

### ADR-002 — TypeScript (strict)

- **Decision:** TypeScript throughout, strict mode.
- **Reason:** Shared types from content and DB to UI; safer refactoring; better AI-agent and multi-developer reliability.
- **Alternatives:** JavaScript with JSDoc; mixed adoption.
- **Why rejected:** Weaker guarantees and tooling; mixed adoption creates inconsistent boundaries.
- **Consequences:** Slightly more upfront rigour; build-time type checking required in CI.
- **Revisit when:** not expected.

### ADR-003 — Tailwind CSS over semantic design tokens

- **Decision:** Tailwind CSS as the utility layer, driven by CSS custom properties as semantic tokens.
- **Reason:** Fast, consistent UI construction with small CSS output; tokens give a single control point for the future design system and theming.
- **Alternatives:** CSS Modules; CSS-in-JS runtime libraries; a prebuilt component library (e.g., Material-style kits); vanilla CSS with custom conventions.
- **Why rejected:** *CSS-in-JS runtimes* add client cost and conflict with Server Components; *prebuilt component kits* impose a recognisable look, conflicting with the PRD originality requirement; *CSS Modules/vanilla* are viable but slower for a small team and harder to keep consistent without strong discipline.
- **Consequences:** Class-heavy markup mitigated through component abstraction; utilities must reference semantic tokens, not raw values.
- **Revisit when:** the design system demands patterns the utility model fights.

### ADR-004 — Node.js runtime; no separate backend in V1

- **Decision:** Node.js via the Next.js server runtime; do not deploy a standalone Node.js backend in V1.
- **Reason:** V1 server logic is small and first-party; a separate service would add deployment, auth, versioning, networking and operations cost without consumers.
- **Alternatives:** Standalone Node.js (Express/Fastify/NestJS) API from day one; BaaS-only with client-side calls; serverless functions per feature.
- **Why rejected:** *Day-one separate API* is premature (no second consumer); *client-side direct BaaS calls* expose more surface to the browser and scatter business logic; *per-feature functions* fragment logic.
- **Consequences:** Business logic must stay framework-independent in `server/services` to keep extraction cheap.
- **Revisit when:** any extraction trigger in Section 3.3 occurs.

### ADR-005 — PostgreSQL as the relational store

- **Decision:** PostgreSQL for persistent structured data.
- **Reason:** Relational integrity for releases/artifacts, strong constraints, JSONB flexibility, mature tooling, portability, RLS.
- **Alternatives:** NoSQL document store; SQLite/edge database; headless CMS database; no database (static only).
- **Why rejected:** *Document stores* weaken integrity for the release model; *SQLite/edge DB* adds operational variance for a small need and complicates admin/auth integration; *CMS database* introduces a platform before need; *no database* fails enquiry persistence.
- **Consequences:** Requires migrations discipline and backup planning.
- **Revisit when:** not expected within the planned scope.

### ADR-006 — Supabase as the managed platform (Postgres, Auth, optional Storage)

- **Decision:** Use Supabase for managed PostgreSQL and authentication; use Storage only for small/medium assets if needed.
- **Reason:** Managed Postgres plus mature auth avoids building and operating either; reasonable developer experience and type generation.
- **Alternatives:** Self-managed PostgreSQL; another managed Postgres plus a separate auth provider (e.g., Auth0, Clerk); a custom auth system.
- **Why rejected:** *Self-managed Postgres* adds operations burden; *separate auth provider* adds another vendor/integration when Supabase Auth suffices for a small admin population; *custom auth* is explicitly rejected (security risk, no benefit).
- **Consequences:** Some Supabase-specific coupling (Auth, RLS patterns); plan limits and pricing must be verified; Postgres remains portable.
- **Revisit when:** auth requirements outgrow Supabase Auth (enterprise SSO, client portal complexity), or plan limits/cost/regional issues arise.

### ADR-007 — Storage strategy: separate classes, dedicated origin for large artifacts

- **Decision:** Normal assets in the build; media and downloads in dedicated object storage + CDN on a separate hostname; checksums in metadata.
- **Reason:** Large files are not web assets (build size, bandwidth, caching, cost, integrity).
- **Alternatives:** `public/` directory; Supabase Storage for everything; host-provided blob storage for everything; third-party release hosting only.
- **Why rejected:** *`public/`* breaks build/deploy and bandwidth assumptions; *Supabase Storage for everything* couples bulk distribution with the DB platform and risks plan/egress limits; *host blob storage* ties artifacts to the app host; *third-party release hosting only* reduces control (retained as secondary channel).
- **Consequences:** An additional provider and hostname to manage; release workflow required.
- **Revisit when:** provider pricing/terms change, audience geography demands multi-CDN/mirrors, or distribution volume warrants torrent/mirror strategy.

### ADR-008 — App Router

- **Decision:** Use the Next.js App Router.
- **Reason:** Server Components, nested layouts, route groups (clean public/admin separation), streaming and error/loading boundaries, and current framework direction.
- **Alternatives:** Pages Router.
- **Why rejected:** Legacy direction; weaker server-first model; less natural route-group isolation.
- **Consequences:** More conceptual surface (server/client boundary, caching semantics); team needs fluency.
- **Revisit when:** not expected.

### ADR-009 — Server Components by default; client islands

- **Decision:** Default to Server Components; Client Components only at interaction leaves.
- **Reason:** Minimal client JavaScript, server-side secure data access, better performance and SEO.
- **Alternatives:** Client-side rendering with data-fetching libraries; broad use of client components.
- **Why rejected:** Larger bundles, slower pages, more exposure of data logic to the browser, harder SEO.
- **Consequences:** Developers must manage the server/client boundary carefully; some libraries require client wrappers.
- **Revisit when:** a feature is inherently highly interactive (consider isolating it as its own client-heavy route or app).

### ADR-010 — API boundary: Server Actions for first-party; versioned REST only when a consumer exists

- **Decision:** Server Components and Server Actions for the website's own UI; Route Handlers for webhooks and (later) public read-only endpoints; extract a standalone API on defined triggers; REST/JSON with URL-path versioning when a public API exists.
- **Reason:** Avoids maintaining an API nobody calls while preserving a path to a stable contract.
- **Alternatives:** REST API for everything; GraphQL; tRPC.
- **Why rejected:** *REST-for-everything* duplicates what Server Components do and adds surface; *GraphQL* has no concrete need and adds complexity; *tRPC* couples to TypeScript clients and does not serve non-TS ecosystem consumers (a likely future need for HENU OS components).
- **Consequences:** Server Actions are not a public contract; external consumers wait for a deliberate API.
- **Revisit when:** a non-web consumer is confirmed.

### ADR-011 — Admin architecture: minimal, modular, Supabase Auth, V1.1 by default

- **Decision:** No custom admin UI in V1 (enquiries via notification + managed dashboard); minimal modular admin in V1.1 (enquiries, then releases); single admin role with a reserved role column; no CMS platform.
- **Reason:** Avoid building and securing an admin surface before it is needed; keep static content in Git.
- **Alternatives:** Full custom CMS; headless CMS (Sanity, Contentful, Strapi, Payload, etc.); admin from day one; database-for-everything.
- **Why rejected:** *Custom CMS* is explicitly an anti-goal; *headless CMS* adds a vendor/platform and a content-sync layer before editorial volume requires it; *admin from day one* increases V1 scope and security surface; *database-for-everything* removes code review for content and adds failure modes.
- **Consequences:** Non-developers cannot publish content without engineering help in V1; acceptable per current scope `[REQUIRES CONFIRMATION]`.
- **Revisit when:** non-developers must publish frequently, blog volume grows, or release cadence makes deploy-based publishing impractical → adopt a headless CMS or extend the admin deliberately.

### ADR-012 — Deployment: managed Next.js host + Supabase + separate artifact origin

- **Decision:** Vercel (recommended) for the application, Supabase for DB/Auth, dedicated object storage + CDN for artifacts and large media.
- **Reason:** Lowest operational burden and best framework compatibility for a small team; large-file risk isolated.
- **Alternatives:** Cloudflare adapter; Netlify; self-hosted Node.js containers/VPS; AWS-centric stack.
- **Why rejected:** *Cloudflare adapter* has runtime differences requiring compatibility verification; *Netlify* viable but with less first-class framework integration; *self-hosting* maximises operational load for no V1 benefit; *AWS-centric* adds configuration overhead.
- **Consequences:** Usage-based pricing and platform coupling must be monitored; avoid proprietary-only APIs.
- **Revisit when:** costs scale unfavourably, data-residency/regional needs emerge, or organisation mandates self-hosting.

### ADR-013 — Content in source control (V1) behind repository interfaces

- **Decision:** Products, services, case studies, docs, and initial release data live in schema-validated source-controlled files, accessed through repositories.
- **Reason:** Low volume, high review value, zero runtime dependency, fastest pages, simple versioning.
- **Alternatives:** Database for all content; headless CMS from day one.
- **Why rejected:** Added moving parts and failure modes without a V1 editorial need.
- **Consequences:** Content edits require a pull request and deploy.
- **Revisit when:** see ADR-011.

### ADR-014 — Validation: schema-first at every boundary

- **Decision:** Schema validation (recommended: Zod) at all input boundaries and for content at build time; types inferred from schemas.
- **Reason:** One definition for runtime validation and static types; consistent client/server rules.
- **Alternatives:** Hand-written validation; form-library-only validation; DB-only validation.
- **Why rejected:** Drift, duplication, or insufficient protection.
- **Consequences:** Library dependency on both client and server for form schemas.
- **Revisit when:** bundle impact or ecosystem shifts justify alternatives.

---

## 33. V1 Technical Scope

### 33.1 Required for V1

| Area | Included |
|------|---------|
| **Application** | Next.js (App Router) + strict TypeScript; Tailwind with semantic tokens; shared UI primitives and layout |
| **Rendering** | Static generation for content pages; revalidation mechanism in place for data-driven pages |
| **Content** | Validated, source-controlled content for products, services, case studies (if real), documentation essentials, FAQ, legal pages, site config and navigation |
| **Release/download** | Release data model, repository interface, build-time validation; downloads page driven by metadata; checksum display; separate artifact origin if a public release exists, otherwise status state |
| **Enquiries** | Server-side validated enquiry capture (general, project/service, partnership) persisted in PostgreSQL via Supabase; email notification; spam/abuse protection; accessible success/failure states |
| **Data access** | Service layer + repository layer with enforced import boundaries; RLS deny-by-default |
| **Types/validation** | Generated DB types; schema-inferred types; environment validation |
| **SEO** | Metadata, canonical, sitemap, robots (environment-aware), Open Graph, structured data helpers |
| **Accessibility** | Accessible primitives, forms, focus management, reduced-motion support; automated checks |
| **Performance** | Budgets defined from baseline; image/font optimisation; media rules; field measurement |
| **Error handling/observability** | Error boundaries, 404/500 pages, error tracking, structured logging, uptime monitoring |
| **Environments** | Development, staging, production with isolated Supabase projects and secrets; secret scanning |
| **CI/CD** | PR checks, preview deployments, staging, manual production promotion, rollback procedure |
| **Testing** | Unit, content validation, integration for enquiry/release logic, E2E for critical journeys, automated accessibility checks |
| **Documentation** | Engineering README, environment setup, release publishing procedure, ADRs |

### 33.2 V1.1

Minimal admin (enquiries module; releases module if warranted); Supabase Auth admin sign-in; audit log; releases moved to database (if cadence demands); `/releases` history and per-release pages; blog/insights; expanded documentation; public read-only releases endpoint (if a consumer exists); basic download measurement; dedicated support intake; additional product/service pages.

### 33.3 Future-ready (architecture accommodates, not built)

RBAC beyond a single admin role; standalone Node.js API; headless CMS or richer admin; client/developer/community portals; advanced docs platform with versioning/search; analytics pipeline; internationalisation; interactive previews and 3D; mirrors/torrent distribution; monorepo/workspaces; infrastructure as code.

### 33.4 Conditional on confirmation

| Item | Dependency |
|------|-----------|
| Admin at launch | PRD decision on admin dashboard |
| Public download at launch | Release readiness |
| Case studies | Permissioned real work |
| Documentation hosted on main site | PRD documentation decision |
| Multilingual | PRD multilingual decision |

---

## 34. What Not to Build

Unless a concrete requirement appears, **do not build**:

| Do not build | Why | Revisit trigger |
|--------------|-----|----------------|
| **Microservices / a separate service per feature** | No independent scaling or ownership need; adds networking, deployment, observability and consistency cost | Section 3.3 triggers with measured need |
| **Kubernetes / container orchestration** | Managed hosting covers the need; operational overhead is disproportionate | Self-hosting mandate or scale beyond managed platform |
| **Complex event-driven architecture / message brokers / queues** | No asynchronous workload beyond a notification email | Retry/batch/long-running jobs appear |
| **Custom authentication system or custom JWT infrastructure** | Security risk with no benefit; Supabase Auth suffices | Requirements exceed Supabase Auth |
| **Full enterprise RBAC / permission matrix** | Single admin role suffices | Multiple privileged roles confirmed |
| **Multi-tenant architecture** | No tenancy requirement | Client portal with tenant isolation |
| **Custom CMS framework** | Git-based content + minimal admin is enough; mature CMS exists if needed | Frequent non-developer publishing |
| **Custom ORM / database abstraction framework** | Small data surface; repositories suffice | Query complexity justifies a mature library |
| **GraphQL layer / API gateway** | No consumers or federation need | External API consumers with varied queries |
| **A public API "for completeness"** | Unused surface is maintenance and attack surface | A real consumer exists |
| **Real-time infrastructure (WebSockets, subscriptions)** | No real-time feature | A concrete live feature |
| **Custom analytics/telemetry platform** | Use privacy-conscious off-the-shelf measurement; avoid collecting more data than needed | Measured product need |
| **Download proxying through the application** | Burns bandwidth and function limits; direct CDN is superior | Never as default |
| **Large files in the repository or `public/`** | Bloat, slow builds, poor delivery | Never |
| **Client-side data fetching frameworks as default** | Server Components cover the need | Genuinely interactive live data |
| **Heavy animation/3D libraries in baseline** | Performance and accessibility cost | Specific feature with performance review |
| **Infrastructure as code for a handful of resources** | Overhead exceeds benefit | Resource count/team growth |
| **Monorepo tooling** | One deployable | Second deployable appears |
| **Internationalisation framework** | Not required in V1 | Multilingual confirmed |
| **Search service** | Small content set; Postgres FTS or client-side index suffices later | Demonstrated insufficiency |
| **Over-abstracted generic "framework" layers** | Abstraction without a second use case adds cost | Rule of three |

---

## 35. Final Recommended Architecture

### 35.1 Diagram

```text
                                  ┌──────────────┐
                                  │   Visitors   │
                                  └──────┬───────┘
                                         │
                       ┌─────────────────┴──────────────────┐
                       ▼                                    ▼
             ┌───────────────────┐               ┌───────────────────────┐
             │ www.<domain>      │               │ downloads.<domain>    │
             │ Edge CDN          │               │ CDN                   │
             │ (static HTML,     │               │   ▲                   │
             │  hashed assets)   │               │   │ immutable files   │
             └─────────┬─────────┘               │ Object storage        │
                       │ cache miss / dynamic    │ (ISOs, installers,    │
                       ▼                         │  large media)         │
   ┌──────────────────────────────────────┐      └───────────▲───────────┘
   │ Next.js app  (App Router, TypeScript)│                  │ scoped credentials
   │                                      │                  │
   │  (public) routes     (admin) routes  │          ┌───────┴───────────┐
   │   Server Components   guarded, V1.1  │          │ Release workflow  │
   │   Server Actions      Server Actions │          │ (hash → upload →  │
   │   Route Handlers                     │          │  publish metadata)│
   │            │                │        │          └───────────────────┘
   │            ▼                ▼        │
   │         Service layer (rules)        │
   │            │                         │
   │            ▼                         │
   │   Repository layer ──► content/ (validated MDX & data, V1)
   │            │                         │
   └────────────┼─────────────────────────┘
                ▼
     ┌──────────────────────────┐        ┌────────────────────────────┐
     │ Supabase                 │        │ External services          │
     │  PostgreSQL (enquiries;  │        │  Email · Bot protection ·  │
     │   V1.1: releases, audit) │        │  Error tracking · Uptime   │
     │  Auth (admin, V1.1)      │        └────────────────────────────┘
     │  RLS deny-by-default     │
     └──────────────────────────┘

   (Future, not built)  Standalone Node.js API ──► same service layer / DB
```

### 35.2 Component summary

| Component | Recommendation |
|-----------|---------------|
| **Frontend** | Next.js App Router, React Server Components default, Tailwind over semantic tokens, small client islands, strict TypeScript |
| **Application/server layer** | Next.js server runtime: Server Components for reads, Server Actions for first-party mutations, Route Handlers for webhooks and future read-only public endpoints |
| **Backend/API** | No separate service in V1; framework-independent service layer ready for extraction; REST/JSON `/api/v1` only when a consumer exists |
| **Database** | PostgreSQL on Supabase; enquiries in V1; releases/audit/admin data in V1.1; RLS deny-by-default; generated types; forward-only migrations |
| **Authentication** | Supabase Auth for admin only (V1.1 or V1 if admin required); server-side authorisation; single admin role with an extensible role column |
| **Storage** | Normal assets in the build; large artifacts and heavy media in dedicated object storage; Supabase Storage only for small admin-uploaded assets if needed |
| **CDN** | Application CDN via the host; separate CDN-fronted download origin on its own hostname with range support and immutable caching |
| **Deployment** | Managed Next.js host (recommended Vercel), Supabase per environment, separate artifact origin; DNS/TLS managed |
| **CI/CD** | Trunk-based; PR checks (lint, types, tests, content validation, build, scans); previews; staging; manual promotion to production; rollback by redeploy; separate release-artifact workflow |
| **Monitoring** | Error tracking, structured logs, uptime/synthetic checks, real-user Core Web Vitals, platform DB and CDN metrics, named alert owner |
| **Content** | Source-controlled, schema-validated, accessed through repositories; releases as metadata with a single source of truth |

### 35.3 Classification

**Required for V1**

- Next.js + TypeScript + Tailwind with tokens; Server-Component-first static architecture.
- Service and repository layers with enforced boundaries.
- Schema-validated content and release metadata; downloads page driven by metadata.
- PostgreSQL (Supabase) for enquiries; server-side validation; notification; abuse protection.
- Separate artifact origin if a public release exists (status state otherwise).
- Environment separation, secret hygiene, CI/CD with previews and rollback.
- SEO, accessibility and performance foundations; error handling and monitoring.

**Future-ready (accommodated by boundaries, not built)**

- Admin module set and database-managed releases (V1.1).
- Standalone Node.js API, RBAC, client/developer portals, advanced documentation platform, headless CMS.
- Internationalisation, download analytics, mirrors/torrent distribution, interactive previews/3D, monorepo/workspaces, infrastructure as code.

**Not required unless a future requirement appears**

- Microservices, Kubernetes, message brokers, custom auth, enterprise RBAC, multi-tenancy, custom CMS or ORM, GraphQL/API gateway, real-time infrastructure, custom analytics platform, download proxying through the app.

### 35.4 Open technical decisions

These require confirmation before or during implementation. They do not block the architecture, but they determine specifics.

| # | Decision | Depends on |
|---|----------|-----------|
| 1 | Application hosting provider (Vercel recommended) | Budget, regional audience, self-hosting policy, vendor constraints |
| 2 | Object storage + CDN provider for artifacts and media | Verified pricing/egress terms, audience geography |
| 3 | Is a public HENU OS release available at launch (download vs. status state)? | Product readiness (PRD) |
| 4 | Release cadence and versioning scheme; channels offered (stable/beta/nightly) | HENU OS release plan |
| 5 | Artifact signing (beyond SHA-256) | Security/release policy |
| 6 | Admin at launch (V1) vs. V1.1; who operates it | PRD decision |
| 7 | Who publishes content, and whether non-developers need to without engineering help (CMS trigger) | Content ownership |
| 8 | Documentation hosted in the main site vs. separate application/domain | PRD decision |
| 9 | Email provider and sending domain; bot-protection provider | Vendor/privacy preferences |
| 10 | Error-tracking and uptime-monitoring providers; alert ownership | Operations model |
| 11 | Git hosting platform and CI provider; package manager; team size and review policy | Team |
| 12 | Supabase plan tier, region, backup/PITR retention | Compliance and budget |
| 13 | Data-residency or compliance constraints on enquiry data | Legal review |
| 14 | Validation library final selection (Zod recommended) | Team review |
| 15 | Multilingual requirement | PRD decision |
| 16 | Performance budgets and alert thresholds | Baseline measurement |
| 17 | Video hosting approach (self-hosted on object storage vs. managed video platform) | Media plan and budget |
| 18 | Licence constraints affecting dependencies or open-source publication of repositories | HENU licensing decisions |

### 35.5 Closing statement

The recommended architecture is **one Next.js application, one managed Postgres/Auth platform, and one dedicated artifact origin**, connected by a framework-independent service and repository layer. It is deliberately modest in V1 (a fast, static-first website with reliable enquiry capture and a metadata-driven download model) and deliberately **structured** where HENU will become a platform: releases as data, large files off the application, admin and API as isolated modules, and business logic that can be lifted into a standalone service the day a second consumer appears.

> **Simple where HENU only needs a website. Structured where HENU needs a platform. Extensible where the ecosystem is expected to grow.**

---

*End of document. Security-sensitive boundaries identified here are the structural input to `03-SECURITY-ARCHITECTURE.md`. All items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner before the dependent implementation work begins.*

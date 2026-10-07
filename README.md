# HENU Official Website

The official website for the **HENU Ecosystem** (HENU OS, HENU AI, HENU PA, and HENU IDE).

---

## 1. Primary Specifications (Source of Truth)

All architectural, product, security, design, and roadmap decisions strictly adhere to the five governing documents in [`DOCS/`](./DOCS):

1. **[`01-PRODUCT-REQUIREMENT-DOCUMENT.md`](./DOCS/01-PRODUCT-REQUIREMENT-DOCUMENT.md)** — Purpose, positioning, audiences, and credibility rules.
2. **[`02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md`](./DOCS/02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md)** — Next.js App Router, TypeScript, layered architecture, and repository pattern.
3. **[`03-SECURITY-ARCHITECTURE.md`](./DOCS/03-SECURITY-ARCHITECTURE.md)** — Threat model, trust boundaries, MFA, server-side authorization, and RLS.
4. **[`04-FRONTEND-UI-UX-DESIGN-SYSTEM.md`](./DOCS/04-FRONTEND-UI-UX-DESIGN-SYSTEM.md)** — Light-first default theme, 6-item primary navigation, and semantic tokens.
5. **[`05-FEATURE-SPECIFICATION-DEVELOPMENT-ROADMAP.md`](./DOCS/05-FEATURE-SPECIFICATION-DEVELOPMENT-ROADMAP.md)** — Phased roadmap, acceptance criteria, and tickets.

---

## 2. Core Architecture & Stack

- **Framework:** Next.js 15 (App Router, React Server Components by default)
- **Language:** TypeScript 5 (Strict Mode, `noImplicitAny`, `noUncheckedIndexedAccess`)
- **Styling:** Tailwind CSS + Semantic Design Tokens (`globals.css`)
- **Theme:** **Light theme is the absolute default**. Dark mode ("warm graphite") is an optional user-selected alternate.
- **Database & Auth:** PostgreSQL via Supabase, with Row-Level Security (RLS) enabled on 100% of tables. Admin-only Supabase Auth with mandatory Multi-Factor Authentication (MFA).
- **Navigation:** Strictly 6 canonical items:
  `Home` · `Services` · `Products` · `Portfolio` · `About Us` · `Contact Us`

---

## 3. Directory Layout

```text
henu-website/
├── .github/workflows/       # CI/CD pipelines
├── DOCS/                    # Canonical project specification documents
├── src/
│   ├── app/                 # Next.js App Router (public and guarded admin route groups)
│   │   ├── (public)/        # Public routes (Home, Services, Products, Portfolio, About, Contact)
│   │   ├── (admin)/         # Guarded administrative web application
│   │   └── api/             # Minimal Route Handlers (health, webhooks)
│   ├── components/
│   │   ├── ui/              # Token-driven accessible UI primitives
│   │   ├── layout/          # Shell, header, navigation, footer
│   │   └── features/        # Domain feature modules
│   ├── config/              # Centralized environment validation and site configuration
│   ├── lib/                 # Framework-independent pure utilities (errors, result)
│   ├── server/              # Strictly server-only logic (guarded with 'server-only')
│   │   ├── db/              # Typed Supabase client factories
│   │   ├── auth/            # Session, MFA verification, and audit logging
│   │   ├── repositories/    # Database queries (the only DB touchpoint)
│   │   └── services/        # Business logic and use cases
│   └── types/               # Database and domain types
├── supabase/
│   ├── migrations/          # Version-controlled forward-only SQL migrations
│   └── seed/                # Development and test seed data
├── tests/
│   ├── unit/                # Unit tests for configuration and validation
│   └── security/            # Security boundary and RLS assertions
└── vitest.config.ts         # Test runner configuration
```

---

## 4. Architectural Boundary Rules

1. **Import Boundaries:** Client components in `src/components/` and `src/app/` must NEVER import from `src/server/*`. Server-only modules are protected by `import "server-only"`.
2. **Database Isolation:** Only classes in `src/server/repositories/` may access the database. UI and service components interact via services.
3. **Secret Isolation:** Environment variables are strictly validated in `src/config/env.ts`. Server secrets must never use the `NEXT_PUBLIC_` prefix and are never shipped to client bundles.
4. **Deny-by-Default RLS:** All database tables have RLS enabled. Anonymous access is limited to reading published content and inserting public enquiries.

---

## 5. Development & Verification

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run typecheck
npm run typecheck

# Run linting
npm run lint

# Run unit & security tests
npm test

# Build for production
npm run build
```

# HENU Digital Portal — Visual Regression Strategy & Test Specification
**Document ID**: VR-SPEC-010  
**Phase**: Phase 8 (V1.1 Visual Refinement)  
**Standard**: Responsive Architecture Baseline (RAB §4.2)  

---

## 1. Executive Summary & Purpose

The HENU visual regression strategy establishes an automated, deterministic baseline to guarantee that styling refinements, theme switches, motion updates, and content mutations never cause unintended visual drift, layout instability (CLS), or typography regressions across public and admin interfaces.

---

## 2. Tested Routes & Surface Matrix

Visual regression captures and verifies full-page baselines across two primary surface tiers:

### Public Tier
1. **Home (`/`)**: Hero typography, ecosystem pillar grid, signature highlights, sparse layout.
2. **Services (`/services`)**: Institutional advisory grid, zero-pricing compliance, consultation pathways.
3. **Products (`/products`)**: Flagship ecosystem cards, development badges, product specs.
4. **Portfolio (`/portfolio`)**: Sovereign ledger grid, asymmetric editorial rhythm, quick preview drawer.
5. **About Us (`/about`)**: Narrative timeline, chapter index, ecosystem 3D visualizer projection.
6. **Contact (`/contact`)**: Form alignment, privacy disclaimer, verified submission state.
7. **Flagship Product Detail (`/products/henu-os`)**: Architecture stack module, cryptographic release verifier.
8. **Flagship Portfolio Detail (`/portfolio/distributed-ledger`)**: Technical narrative, metadata ledger, return transition.

### Admin Tier (Restricted Authorization)
1. **Admin Control Plane (`/admin/home`)**: Metric cards, system status, quick navigation.
2. **Users & Roles (`/admin/users`)**: RBAC table, role pills, invite modal trigger.
3. **Audit Log Ledger (`/admin/audit-logs`)**: Redacted log stream, action filters, payload modal.
4. **Site Settings (`/admin/settings`)**: Design control toggles, dark mode preview, maintenance switch.

---

## 3. Responsive Viewport Matrix (RAB §4.2)

Every route is evaluated against four canonical responsive breakpoints:

| Breakpoint | Width (px) | Height (px) | Device Target | Verification Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile Narrow** | 360 | 640 | Compact Android / iOS | Navigation drawer, touch targets (≥44px), reflow |
| **Tablet** | 768 | 1024 | iPad Mini / Portrait Tablet | Two-column grid reflow, table responsiveness |
| **Desktop Compact**| 1024 | 768 | Small Laptops / Landscape Tablet | Sidebars, split columns, header alignment |
| **Desktop Standard**| 1440 | 900 | High-DPI Displays / Workstations | Max-width constraints (`1280px`), spacing rhythm |

---

## 4. Theme & Motion Variant Testing

### Color Scheme Matrices
- **Light Theme (Default)**: Canonical ivory/pine/ink palette (`#FBFBF9`, `#2A3F32`, `#1E2522`).
- **Dark Theme (Optional)**: Deep charcoal/spectral emerald palette (`#121614`, `#1B221E`, `#34D399`).

### Motion Modes
- **Default Motion**: Native CSS transitions, `@view-transition` page fading, 3D vector rotation.
- **Prefers-Reduced-Motion**: Instant page switches, stationary 3D vector blueprint, zero ambient pulses.

---

## 5. Tooling Architecture & Variance Thresholds

### Execution Engine
- **Engine**: Playwright Test Runner + Chromium Headless.
- **Diff Tool**: Pixelmatch / Structural Layout Geometry Asserter.
- **Anti-Flake Safeguards**:
  - `page.emulateMedia({ reducedMotion: 'reduce' })` during visual snapshotting.
  - Web fonts pre-loaded with `font-display: swap` stabilization.
  - Dynamic timestamps masked via CSS attribute selectors (`[data-timestamp]`).
  - Animation frames halted prior to screenshot capture (`animations: 'disabled'`).

### Tolerance Budget
- **Public Typography & Grid**: Maximum **0.1%** pixel discrepancy threshold (`threshold: 0.1`).
- **Dynamic Canvases (3D Visualizer)**: Verified via bounding-box structural dimensions rather than raw pixel diffs to account for GPU driver variations.
- **Admin Tables**: Maximum **0.2%** pixel discrepancy threshold.

---

## 6. Baseline Maintenance & CI Workflow

1. **Local Validation**:
   ```bash
   npx playwright test --project=visual
   ```
2. **Update Baselines** (upon intentional design changes):
   ```bash
   npx playwright test --project=visual --update-snapshots
   ```
3. **Pull Request Quality Gate**:
   - Any visual change exceeding 0.2% variance fails the build unless accompanied by an explicit visual snapshot commit.
   - All visual diff artifacts are exported to `.playwright/visual-diffs` for engineering review.

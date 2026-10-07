# HENU Sovereign Portal — Telemetry & Analytics Architecture Decision Record
**Decision Record ID**: ADR-2026-08  
**Phase**: Phase 8 (Visual Refinement & V1.1)  
**Status**: APPROVED & CODIFIED  
**Subject**: Public Web Analytics, User Tracking, and Telemetry Stance  

---

## 1. Context & Business Need

The Phase 8 development roadmap explicitly schedules an architectural decision regarding web analytics. As an independent sovereign computing collective building zero-telemetry foundational operating systems (HENU OS), local intelligence pipelines (HENU AI), and private infrastructure, any external analytics deployment carries profound reputational, architectural, and legal implications.

We evaluated three potential pathways:
- **Option A**: Implement third-party hosted analytics (e.g., Google Analytics 4, PostHog Cloud).
- **Option B**: Completely defer analytics, capturing zero usage data beyond edge infrastructure logs.
- **Option C**: Deploy privacy-preserving, cookieless, server-side measurement without cross-site tracking.

---

## 2. Evaluation Matrix

| Criterion | Third-Party SaaS (GA4 / Cloud) | Self-Hosted Privacy Tool (Plausible / Umami) | Zero-Telemetry Sovereign Model (Adopted) |
| :--- | :--- | :--- | :--- |
| **Sovereignty & Trust** | **Violated**: Transmits visitor telemetry to external surveillance networks. | **Neutral**: Data stored on private VPS, but still records visitor events. | **Maximized**: Demonstrates authentic alignment with HENU OS zero-telemetry charter. |
| **Privacy Regulations** | Requires invasive cookie consent banners (GDPR/ePrivacy, CCPA). | Minimal consent required if IP hashing is salt-rotated. | **Zero Cookie Banners Needed**: No cookies, no storage, no trackers deployed. |
| **Performance Impact** | +45KB to +90KB JS bundle, +150ms TTI/INP latency regression. | +3KB to +8KB JS bundle, minor network call. | **0 KB JS overhead**, zero blocking requests, pristine 100 Lighthouse score. |
| **Security Risk** | Third-party script injection vulnerability (Supply Chain risk). | Additional database and maintenance attack surface. | **Zero Attack Surface**: No external script execution allowed by CSP. |
| **Business Alignment** | Misaligned with enterprise institutional advisory positioning. | Acceptable if aggregate counts are required. | **Optimal**: HENU measures success via qualified bilateral contact enquiries, not aggregate pageview vanity metrics. |

---

## 3. Formal Architectural Decision: Zero-Telemetry Sovereign Stance

**HENU adopts a Cookieless, Zero-Client-Telemetry Architecture for the V1.1 release.**

### Key Directives:
1. **Zero Client-Side Analytics Scripts**:
   - No tracking tags, beacons, session replays, or analytics bundles shall be injected into public route trees.
   - The Content Security Policy (`script-src 'self'`) remains strictly enforced, forbidding external script origin loading.

2. **No Cookie Banners**:
   - Because the public portal utilizes zero persistent tracking cookies or local storage identifiers, no intrusive GDPR/ePrivacy cookie banner is necessary. This preserves a pristine, editorial reading experience.

3. **Edge Server Aggregate Hygiene**:
   - Server-level edge access logs (HTTP status, URL route, anonymized IP for DoS mitigation) are handled at the CDN/infrastructure layer and automatically purged on a 7-day rolling window.
   - No IP addresses are joined with contact enquiry submissions or browsing behavior.

4. **Future Re-evaluation Trigger**:
   - If institutional demands require aggregate bandwidth or documentation traffic monitoring in future releases (V1.2+), any measurement tool must be self-hosted in a sovereign private cluster, strictly cookieless, open-source audited, and cryptographically isolated from user identities.

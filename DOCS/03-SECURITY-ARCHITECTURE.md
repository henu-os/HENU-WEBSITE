# HENU Website — Security Architecture

| | |
|---|---|
| **Document** | `03-SECURITY-ARCHITECTURE.md` |
| **Status** | Draft v1 for security and technical review |
| **Depends on** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md`, `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md` |
| **Audience** | Developers, AI coding agents, reviewers, operators |

**Conventions**

- `[REQUIRES CONFIRMATION]` marks a decision that depends on information HENU has not yet confirmed (vendors, plan tiers, legal position, team structure, targets). No compliance certification, legal obligation, recovery target, rate-limit number or performance figure is invented here.
- `[VERIFY]` marks a statement about third-party product behaviour (Supabase, Next.js, hosting, CDN) that changes over time and **must be checked against current official documentation for the exact version/plan in use** before implementation.
- This document defines **controls and requirements**, not code. Its purpose is to be a security contract: *what must be protected → what can be trusted → what cannot be trusted → where validation occurs → who can access what → how credentials are protected → how attacks are mitigated → how incidents are handled.*
- Likelihood and impact ratings are **qualitative judgements for a small-to-mid-profile technology company website**, not measured data. They should be revisited after launch using real telemetry.
- HENU is **not** asserted to be compliant with GDPR, ISO 27001, SOC 2 or any other standard. Nothing here is legal advice.

**Alignment with the architecture document**

This document inherits these structural facts from `02-TECHNICAL-ARCHITECTURE-AND-TECH-STACK.md` and builds on them:

1. One Next.js application; no separately deployed backend in V1; all server logic runs in the Next.js server runtime behind a service/repository layer.
2. The browser never queries the database or Supabase Storage directly for application data in V1.
3. Supabase provides PostgreSQL and (for admin) Authentication. Admin UI is V1.1 by default (V1 only if confirmed required); in V1 enquiries are persisted, emailed to an owner, and reviewed through the managed Supabase dashboard.
4. Large artifacts (HENU OS ISOs, installers, heavy media) are served from a **separate object-storage + CDN origin on its own hostname**; the web application never holds write access to it.
5. Release metadata is a single source of truth (Git-tracked, schema-validated in V1; database-backed in V1.1).
6. V1 has no file-upload feature, no user accounts for the public, and no payments.

---

## 1. Security Objective

> Build a website that protects HENU, its users, administrative accounts, customer information, product data, credentials, infrastructure and downloadable assets, while maintaining a fast and usable experience.

### 1.1 What is protected

| Asset | Why it matters | Primary concern |
|-------|---------------|-----------------|
| **HENU OS release artifacts and release metadata** | Users will boot and install them; compromise is the highest-impact event for HENU's reputation and for users | Integrity |
| **Administrative accounts and sessions** | Gateway to privileged operations and personal data | Confidentiality, integrity |
| **Enquiry / customer information** | Personal and commercially sensitive data | Confidentiality, availability of handling |
| **Application and infrastructure secrets** | Compromise cascades to everything else | Confidentiality |
| **Database (PostgreSQL/Supabase)** | Persistent data and access policy | Confidentiality, integrity, availability |
| **Object storage / CDN** | Distribution of large artifacts | Integrity, availability, cost |
| **Source repository and CI/CD pipeline** | Path to production | Integrity |
| **Public website content** | Defacement or malicious injection harms trust and visitors | Integrity |
| **Public visitors** | Must not be attacked through HENU's site (XSS, malicious scripts, malicious downloads) | Safety |
| **Product and service data** | Largely public, but unreleased/draft data is internal | Integrity (and confidentiality of drafts) |

### 1.2 Security posture in one paragraph

Because V1 is mostly a static-first public website with one untrusted-input surface (enquiry forms), one high-value integrity surface (release artifacts) and a small privileged surface (admin/operator access), the security effort is concentrated there: **strong admin identity, server-side authorisation, hardened enquiry intake, secret isolation, tamper-resistant release publishing, and disciplined supply-chain/CI controls.** Heavy enterprise machinery is not required.

---

## 2. Security Principles

Each principle includes its concrete consequence for this project.

| # | Principle | Consequence |
|---|-----------|-------------|
| 1 | **Never trust client-side input** | Everything from the browser (form fields, headers, cookies, query strings, IDs) is attacker-controlled |
| 2 | **Least privilege by default** | Credentials, roles, tokens, CI jobs and database roles get only the permissions their purpose needs |
| 3 | **Deny unless explicitly authorised** | Database RLS deny-by-default; admin routes deny without a verified session and role; storage buckets private unless published |
| 4 | **Server-side authorisation is mandatory** | Every admin page, Server Action and Route Handler checks authorisation itself |
| 5 | **Sensitive operations execute server-side** | No privileged logic or privileged credentials in the browser |
| 6 | **Secrets never reach the browser** | Strict public/server configuration split; build checks for leakage |
| 7 | **Authentication ≠ authorisation** | "Verified identity" is never treated as "permitted action" |
| 8 | **Validate input at trust boundaries** | Schema validation at every boundary; database constraints as a last line |
| 9 | **Encode output by context** | Framework escaping by default; no raw HTML injection without sanitisation |
| 10 | **Minimise stored personal information** | Collect only fields with a stated purpose; define retention |
| 11 | **Minimise permissions** | Narrow tokens, scoped credentials, short-lived where possible |
| 12 | **Minimise exposed APIs** | No endpoint exists without a consumer (aligned with the architecture document) |
| 13 | **Keep dependencies maintained** | Scanning, updates, review of additions |
| 14 | **Log security events without logging secrets** | Redaction by design |
| 15 | **Fail securely** | On error, deny; do not fall back to a more permissive path |
| 16 | **Do not expose internals through errors** | Safe user messages; detailed diagnostics only in protected logs |
| 17 | **Security must not unnecessarily damage usability** | No login for public information; no CAPTCHA by default; no friction on downloads |
| 18 | **Future needs handled through boundaries, not premature complexity** | Role column, adapter layers, isolated admin module — not an IAM platform |

Two additional project-specific principles:

| # | Principle | Consequence |
|---|-----------|-------------|
| 19 | **Integrity of releases outranks convenience of publishing** | Release publishing is a controlled, reviewed, auditable process separate from the website's request path |
| 20 | **Be honest about what each control protects against** | No document, page or UI may claim protection (for example "signed", "verified", "secure") that is not actually implemented |

---

## 3. Threat Model

### 3.1 Method and scope

Informal STRIDE-style reasoning applied to the architecture in document 02. The model focuses on **realistic** threats to a public technology/product website with a software-distribution function. Nation-state-level adversaries are **out of scope** as a design driver `[REQUIRES CONFIRMATION: revisit if HENU OS adoption, user base or customer profile creates such a risk]`; however, the release-integrity controls are designed so that stronger measures (signing, reproducibility, transparency) can be added later.

### 3.2 Threat actors

| Actor | Motivation | Capability | Relevance |
|-------|-----------|-----------|-----------|
| **Automated bots / scanners** | Opportunistic discovery of vulnerable endpoints, exposed secrets, misconfiguration | Low skill, high volume | Certain to occur |
| **Spam / bot operators** | Fill forms with spam/links, abuse email delivery | Low skill, scripted | Certain for public forms |
| **Credential attackers** | Account takeover via stuffing, brute force, phishing | Moderate | Targets admin sign-in and any operator accounts |
| **Opportunistic attackers** | Deface, host malware/phishing, steal data | Low–moderate | Possible |
| **Malicious users / abusers** | Abuse downloads (bandwidth cost), probe APIs, inject payloads | Low–moderate | Possible |
| **Attackers targeting admin accounts** | Reach privileged functions | Moderate | Targeted, plausible once admin exists |
| **Dependency / supply-chain attackers** | Compromise via malicious or vulnerable packages, build tools | Moderate–high reach | Plausible for any JavaScript project |
| **Secret hunters** | Find committed or leaked secrets | Automated | Certain to be scanned for |
| **Release manipulators** | Replace/alter artifacts or metadata to distribute malware | Moderate–high | **Highest-impact scenario** |
| **Insider error (accidental)** | Misconfiguration, leaked key, wrong deploy | n/a | Likely over time; a major real-world cause |

### 3.3 Threat register

Ratings: **L** = Low, **M** = Medium, **H** = High (qualitative).

| ID | Threat (vector) | Asset | Likelihood | Impact | Mitigation (summary; detail in referenced sections) | Detection | Recovery |
|----|----------------|-------|:---:|:---:|-----------------------------------------------|-----------|----------|
| **T1** | **Release artifact tampering**: malicious file replaces/appends to an official ISO via compromised storage credentials, CI, or website metadata | Artifacts, users | L–M | **H** | Separation of write path from website; immutable objects/versioning; scoped short-lived publishing credentials; reviewed metadata changes; checksum published; signing roadmap (§21, §34) | Periodic integrity verification of published artifacts vs. metadata; storage access/audit logs; alerts on unexpected writes | Withdraw release; restore known-good artifact from versioned/offline copy; rotate credentials; public notice (§42) |
| **T2** | **Release metadata tampering**: altered checksum/URL points users to attacker file | Release data | L–M | **H** | Metadata in Git with branch protection and review; build-time schema validation; (V1.1) admin changes audited with re-authentication (§21, §39) | Diff review; audit log; integrity monitor | Revert commit/record; redeploy; notify |
| **T3** | **Admin account takeover** (phishing, credential stuffing, weak password, session theft) | Admin accounts, data | M | **H** | Managed auth, invite-only, mandatory MFA, rate limiting, secure cookies, short sessions, no shared accounts (§6–§8, §29) | Failed-login alerts; new-session/IP anomalies; audit log | Revoke sessions; reset credentials; review audit log (§42) |
| **T4** | **Authorisation bypass** (missing server-side check on an action/route; reliance on UI hiding or middleware alone) | Admin functions, data | M | H | Per-action server-side authorisation; deny-by-default; central guard; tests for every admin entry point (§9, §29, §41) | Authorisation tests in CI; audit log; anomaly review | Patch; assess affected data; rotate if necessary |
| **T5** | **Secret exposure** (committed to Git, bundled to browser, logged, leaked via error output) | All backends | M | **H** | Secrets policy; public/server config split; secret scanning; log redaction; rotation (§24, §33) | Secret scanning alerts; bundle inspection in CI; provider-side key-use alerts | Treat as compromised; rotate immediately; review usage logs (§42) |
| **T6** | **Service-role / privileged DB credential misuse or exposure** | Database | L–M | **H** | Server-only; confined to specific repository functions; never public-prefixed; least-privilege roles; restricted exposed schemas (§22, §23) | Secret scanning; DB logs; unusual query patterns | Rotate keys; audit access; restore from backup if integrity affected |
| **T7** | **Injection** (SQL injection, HTML/header injection via forms) | Database, email, admin viewer | M | H | Parameterised access; schema validation; output encoding; email header safety; strict types (§12–§14, §38) | WAF/log anomalies; error-rate spikes | Patch; assess data impact |
| **T8** | **Stored XSS** via enquiry content rendered in admin viewer, or via admin-authored rich content | Admin sessions, visitors | M | H | Escaped rendering by default; no raw HTML; sanitisation if rich HTML needed; CSP; admin pages use stricter CSP (§14, §30) | CSP violation reports; review | Remove content; invalidate sessions if admin exposed |
| **T9** | **CSRF / cross-site request forgery** on admin mutations or auth-related operations | Admin state | L–M | M–H | SameSite cookies, Origin verification, framework protections, token where needed (§15) | Origin-mismatch logs | Patch; review affected actions |
| **T10** | **Form spam and abuse** (bots, link spam, email-relay abuse, notification flooding) | Enquiry pipeline, email reputation, operator time | **H** | L–M | Honeypot, timing checks, rate limiting, server validation, adaptive challenge, duplicate detection (§18, §19, §38) | Submission-rate monitoring; spam-status ratio; email provider alerts | Block/adjust rules; purge spam; address email-reputation damage |
| **T11** | **Brute-force / credential stuffing** on admin sign-in | Admin accounts | M–H (attempts) | H (if success) | Provider rate limits + app limits; MFA; progressive backoff; no account enumeration (§8, §18) | Failed-login metrics and alerts | Lock/reset; rotate |
| **T12** | **Vulnerable or malicious dependency** (known CVE or supply-chain compromise, malicious install script) | Application, build | M | M–H | Lockfile; scanning; update cadence; review of new packages; minimal dependencies; no auto-merge of majors (§32, §34) | Automated advisories; CI scan | Patch/pin/remove; rebuild; rotate secrets if exfiltration possible |
| **T13** | **Download abuse / bandwidth exhaustion / hotlinking** | Cost, availability | M | M | CDN protections, caching, rate/bandwidth controls at CDN, spend alerts, hotlink controls (§36) | Bandwidth/cost alerts | Tighten rules; provider-level blocking |
| **T14** | **Denial of service against the site** (volumetric or application-level) | Availability | M | L–M | CDN/static-first architecture; platform protections; request size limits; endpoint rate limits (§36) | Uptime monitoring; platform metrics | Platform mitigations; temporary rules |
| **T15** | **Misconfigured Supabase access** (RLS disabled, exposed schema, public bucket, leaked service key) | Database/Storage | **M** (common real-world failure) | **H** | RLS on every table; revoke default grants; restrict exposed schemas; configuration review checklist; automated policy tests (§22, §23) | Supabase advisor/lint checks; periodic review; anon-access tests | Fix policy; assess access logs; rotate keys |
| **T16** | **Third-party script / service compromise** (analytics, CAPTCHA, embeds) | Visitors, forms | L–M | M–H | Minimise third parties; CSP allowlist; Subresource Integrity where feasible; no third-party scripts on admin (§31) | CSP reports; review | Remove integration; assess exposure |
| **T17** | **Compromised developer workstation or repository access** | Source, CI, secrets | L–M | H | MFA on Git/hosting/Supabase accounts; branch protection; signed/verified commits (recommended); least-privilege CI; no secrets locally beyond dev (§33, §34) | Account-activity alerts; audit logs | Revoke tokens; rotate; review commits/deployments |
| **T18** | **Domain/DNS/registrar hijack or expired certificate** | Entire site and email | L | **H** | Registrar MFA and lock; restricted DNS access; certificate automation and monitoring; DNS change alerts (§17) | DNS monitoring; certificate expiry alerts | Regain control with registrar; reissue certificates |
| **T19** | **Personal data over-collection or improper retention/disclosure** | Enquiry data, privacy | M | M | Data minimisation, retention schedule, restricted access, privacy documentation (§37) | Periodic review; access audit | Purge/limit; notify as legally required `[REQUIRES CONFIRMATION]` |
| **T20** | **Information leakage through errors, logs, source maps, or verbose responses** | Internals, PII, secrets | M | M | Safe error handling; log redaction; no production source maps exposure policy `[VERIFY]`; header hygiene (§27, §28) | Log review; automated bundle checks | Patch; rotate if secrets were exposed |
| **T21** | **Open redirect / link manipulation / phishing via site** | Visitors | L–M | M | Allowlisted redirect targets; never redirect on user-supplied URLs unvalidated | Review/testing | Patch |
| **T22** | **Accidental misconfiguration at deploy** (wrong environment secrets, indexing staging, public draft artifacts) | Various | M | M–H | Environment isolation; protected production deployment; pre-launch checklist; draft artifacts non-public (§23, §34, §47) | Smoke tests; configuration checks | Roll back; correct config |

### 3.4 Residual risks accepted for V1

| Residual risk | Rationale |
|---------------|-----------|
| Checksums alone cannot protect against a compromised website that serves both the file link and the checksum | Signing is the stronger control; recommended for V1.1/Future (§21). V1 must therefore **not** overclaim. |
| Reliance on managed vendors (hosting, Supabase, CDN, email) | Mitigated by least privilege, backups, and adapters; replacing them is a future option |
| No dedicated security team or 24/7 response | Controls are designed for a small team; incident process is realistic (§42) |

---

## 4. Trust Boundaries

### 4.1 Boundary map

```text
 ┌──────────────┐   B1    ┌───────────────────────┐   B2    ┌─────────────────────────┐
 │ Public       │────────►│ CDN / Edge + Next.js  │────────►│ Server/application layer │
 │ Browser      │◄────────│ (HTTPS)               │◄────────│ (actions, handlers,      │
 └──────────────┘         └───────────────────────┘         │  services, repositories)  │
                                                            └───────┬─────────┬────────┘
 ┌──────────────┐   B3 (admin: auth required)                      │ B5      │ B6
 │ Admin        │───────────────────────────────────────────────►   │         │
 │ Browser      │                                                   ▼         ▼
 └──────────────┘                                          ┌──────────────┐ ┌──────────────────┐
                                                            │ Supabase     │ │ Third-party      │
 ┌──────────────┐   B4 (direct, public, read-only)         │ Postgres/Auth│ │ services (email, │
 │ Public       │─────────────────────────────►            └──────────────┘ │ anti-bot, mon.)  │
 │ Browser      │        ┌──────────────────────────┐                        └──────────────────┘
 └──────────────┘        │ Download origin          │
                         │ Object storage + CDN     │◄── B7 (release workflow, scoped write)
                         └──────────────────────────┘

 B8: CI/CD ──► production        B9: Developer workstation ──► source repository
 (Future, not built) B10: Standalone Node.js API ◄── external consumers
```

### 4.2 Per-boundary trust definition

| Boundary | Must be trusted | Must NOT be trusted | Key controls |
|----------|----------------|---------------------|--------------|
| **B1 Public browser → Next.js** | TLS channel integrity (when HTTPS) | Everything in the request: body, query, headers (including `Host`, `Origin`, `X-Forwarded-*` unless set by the trusted platform), cookies, file names, "client-side validated" status, any user-agent/IP claim | Server validation; rate limiting; output encoding; CSP; security headers |
| **B2 Next.js → server/service layer** | Code in this repository once type-checked and reviewed | Data from B1 until validated; framework-supplied identity until verified against the auth service | Schema validation; per-action authorisation; import boundaries (`server-only`) |
| **B3 Admin browser → admin application** | A *verified* session, and only for what the verified role permits | Cookie contents without server-side verification; UI state; role claims supplied by the client; URL secrecy | MFA; secure cookies; server-side authz on every action; stricter CSP; no-store caching; audit |
| **B4 Browser → download origin** | The CDN/object-store as the *delivery* mechanism | The origin's content as "safe" by default — integrity must be verifiable; the website's claims about it are only as strong as the controls on its metadata | Immutable artifacts; checksums; (future) signatures; cookieless hostname |
| **B5 Application → Supabase** | Supabase as a managed platform within its documented guarantees | Query parameters, tenant of origin of identifiers; any assumption that default settings are secure | RLS deny-by-default; least-privilege role; server-only elevated keys; no browser DB access; restricted exposed schemas |
| **B6 Application → third parties** | Contractual/provider security within limits | Third-party responses (validate), webhook callers (verify signatures), third-party scripts (minimise, constrain) | Adapters in `server/integrations`; webhook signature verification; timeouts; failure isolation; minimal data sharing |
| **B7 Release workflow → object storage** | The release workflow identity (scoped, short-lived) | Build inputs until reviewed; the website runtime (it must have **no** write access) | Separate credentials; protected branches/environments; checksum generation and round-trip verification |
| **B8 CI/CD → production** | Reviewed code on protected branches; the CI platform (within its documented model) | Pull-request code from untrusted contributors with access to secrets; third-party actions/plugins unless pinned | Branch protection; secret isolation per environment; pinned actions; manual production promotion |
| **B9 Developer workstation → repository** | Authenticated, MFA-protected developer identity | The workstation's security posture; unsigned commits; locally stored secrets | MFA; secret scanning (including pre-commit); review requirements; no production secrets on laptops |
| **B10 (future) External consumers → standalone API** | Authenticated clients within scope | All client input; client-claimed identity | Defined at extraction time (§25, §26) |

### 4.3 Server Actions and Route Handlers are public HTTP endpoints

A critical implication of the architecture: **every Server Action and Route Handler can be invoked by any HTTP client**, regardless of whether the UI exposes it. Therefore each one must independently validate input, authenticate/authorise (when privileged), and rate-limit (when abusable). "The button is only on the admin page" is not a control.

---

## 5. Data Classification

### 5.1 Classes

| Class | Definition | Examples in this project |
|-------|-----------|--------------------------|
| **Public** | Intended for anyone; harm only from tampering | Product/service pages, public docs, public release metadata, published blog, published artifacts |
| **Internal** | Not public; low harm if disclosed but should not be exposed | Draft content, unpublished release metadata/artifacts, internal configuration, operational metadata, non-sensitive logs |
| **Confidential** | Disclosure causes harm to individuals or HENU | Enquiry content (names, emails, messages, organisation), project/commercial information, admin user list, audit logs, security-relevant logs |
| **Highly sensitive / secret** | Compromise grants access to systems or accounts | Passwords (managed by auth provider), session/refresh tokens, API keys, OAuth secrets, DB credentials, service-role/secret keys, webhook secrets, signing keys, storage write credentials, CI tokens |

### 5.2 Handling matrix

| | **Public** | **Internal** | **Confidential** | **Highly sensitive / secret** |
|---|---|---|---|---|
| **Storage** | Git, CDN, public bucket; integrity-controlled | Git (private repo), private bucket/prefix, platform config | PostgreSQL with RLS deny-by-default; encrypted at rest by platform `[VERIFY]`; no copies in email beyond the notification | Platform secret stores / CI secret stores only; **never** in Git, client bundles, logs or tickets. Signing keys: offline/hardware-backed where feasible `[REQUIRES CONFIRMATION]` |
| **Transmission** | HTTPS | HTTPS | HTTPS/TLS only; limited in email notifications (see below) | TLS only; passed server-to-server; never in URLs or query strings |
| **Logging** | Allowed | Allowed (no secrets) | **Minimise**; never log message bodies or full emails; log IDs and event types | **Never** logged, in whole or part (beyond a non-sensitive identifier such as a key label) |
| **Access** | Anyone | Developers/operators, least privilege | Named admins/operators on need-to-know; auditable | Smallest possible set; service identities rather than humans where possible; no shared credentials |
| **Deletion** | By content lifecycle | By content lifecycle | Per retention schedule `[REQUIRES CONFIRMATION]`; deletion also covers backups on their own schedule; honour lawful deletion requests `[REQUIRES CONFIRMATION]` | Revoke and rotate on exposure, role change or departure; destroy decommissioned secrets |

### 5.3 Notification email handling

Enquiry notification emails contain confidential data in transit through an email provider and operator mailboxes. Requirements:

- Send only what the operator needs (typically type, name, email, message), not technical metadata.
- Use a transactional email provider over TLS; operator mailboxes require MFA.
- Do not forward enquiries to personal accounts.
- The database record, not the email, is the system of record; the email may be treated as a convenience copy subject to the same retention rules.

---

## 6. Authentication

### 6.1 Scope

**Authentication applies only to administrative/operator access.** The public site has **no user accounts** in V1 and must not require login to view information or download public software (see §43). Future client or developer portals would reuse the same authentication system with different roles.

### 6.2 Options evaluated

| Option | Strengths | Weaknesses | Verdict |
|--------|----------|-----------|---------|
| **Supabase Auth (managed)** | Already in the stack; mature sign-in flows, MFA, session handling, token issuance and rotation handled by the platform; avoids custom credential storage | Tied to Supabase; correct configuration is required; some behaviours are plan-dependent `[VERIFY]` | **Recommended** |
| **OAuth 2.0 / OIDC with an external identity provider (e.g., Google Workspace sign-in via Supabase Auth)** | Offloads credentials and MFA to a provider that HENU staff already secure; reduces password handling | Requires HENU to use a suitable IdP; domain restriction hints are not enforcement; account recovery depends on the IdP | **Recommended as the sign-in method if HENU staff use a managed workspace** `[REQUIRES CONFIRMATION]` |
| **Email + password (via Supabase Auth)** | Works without an IdP | Password risks (reuse, phishing, stuffing) — must be paired with mandatory MFA | Acceptable fallback **only with mandatory MFA** |
| **Magic-link / OTP email** | No passwords | Security equals the security of the mailbox; link interception risk; less suited to high-value accounts without MFA | Not recommended as the sole factor for admin |
| **Custom-built auth / custom JWT issuance** | None for this project | High risk, high maintenance, no differentiation | **Rejected** |

### 6.3 Recommended approach

1. **Supabase Auth** is the only authentication system.
2. **Sign-up is disabled for the public.** Admin users are created by invitation or manual provisioning only. An open sign-up endpoint on an admin-only system is a vulnerability.
3. **Sign-in method:** Google (or another managed IdP) sign-in with the organisation's enforced MFA **if available**, otherwise email + password **with mandatory TOTP MFA**. `[REQUIRES CONFIRMATION]`
4. **Domain/identity restriction is enforced by the application, not by the IdP hint.** A "hosted-domain" parameter in an OAuth request is a UX hint; the server must verify the authenticated identity against an **application-level admin allowlist** (the `admin_profiles` record in document 02) before granting any privilege. Authenticating successfully with the provider does **not** make someone an admin.
5. **Authentication results in an identity; authorisation is a separate step** (§9).

### 6.4 Token model (Supabase Auth issues JWTs)

Supabase Auth uses a short-lived signed **access token (JWT)** and a longer-lived **refresh token** `[VERIFY]`. HENU does not implement its own JWT issuance. The requirements are about **how the tokens are used and handled**:

| Aspect | Requirement |
|--------|------------|
| **Access token lifetime** | Keep at or below the provider default (commonly 1 hour) and prefer the shortest practical value for admin use; exact value and allowed range `[VERIFY]` / `[REQUIRES CONFIRMATION]`. Do not lengthen it for convenience. |
| **Refresh mechanism** | Refresh tokens are exchanged server-side for new access tokens. Refresh-token rotation (single-use with reuse detection) must be **enabled** `[VERIFY]`. |
| **Token storage** | Tokens live in **HTTP-only, Secure, SameSite cookies** managed server-side. **No tokens in `localStorage`, `sessionStorage`, or URLs.** Because some Supabase SSR helper configurations create cookies readable by browser JavaScript so the browser client can use them, the admin implementation must **not use the browser-side Supabase client for authentication/session handling**; session handling is server-only, and the resulting cookie attributes must be **verified in the running application** `[VERIFY]`. |
| **Token validation** | The server must **verify** the user on every privileged request, either by validating the JWT signature/claims against the provider's keys or by asking the auth service to confirm the user. It must never trust cookie contents or decoded-but-unverified claims. For high-impact actions (§39), confirm against the auth service rather than relying only on a locally validated, possibly stale token. |
| **Revocation / session termination** | Sign-out invalidates the refresh token server-side; an already-issued access token remains valid until it expires unless the server checks with the auth service. This is why access tokens are short-lived and why high-impact actions use a live check. Admin removal = delete/disable the user **and** remove the admin profile **and** terminate sessions. |
| **JWT secret / signing keys** | Managed by the provider; never copied into application code or the repository; rotation follows the provider's process `[VERIFY]` |
| **Custom claims** | Roles/permissions are **not** trusted solely because they appear in a token a client holds; authorisation reads the server-controlled admin record (§9). If role data is placed in token metadata, it must be one that the user cannot modify (for example provider-controlled app metadata, not user-editable metadata) `[VERIFY]`. |

> **Important:** a JWT is a signed assertion, not a security feature by itself. It is only as safe as its storage, lifetime, verification and revocation behaviour, which the points above define.

---

## 7. Session Security

### 7.1 Cookie requirements

| Attribute | Requirement | Purpose / limit of protection |
|-----------|------------|-------------------------------|
| **HttpOnly** | Required for session/refresh credentials | Prevents JavaScript from reading the cookie, so a script-injection flaw cannot trivially exfiltrate the token. **It does not stop XSS from acting as the user in the browser (making authenticated requests), and it does not prevent CSRF.** |
| **Secure** | Required in all non-local environments | Cookie is sent only over HTTPS |
| **SameSite** | `Lax` as the default; `Strict` for admin if usability permits | Reduces cross-site request forgery; not a complete CSRF defence (§15). `SameSite=None` must not be used for session cookies |
| **Scope (Domain)** | **Host-only** (no `Domain` attribute) so the session cookie is **not** sent to sibling hostnames such as the download origin or docs subdomain | Prevents credential leakage to other subdomains and reduces subdomain-takeover impact |
| **Path** | As narrow as practical (e.g., admin path) where the framework allows without breaking sessions | Limits exposure |
| **Prefix** | Use the `__Host-` prefix where compatible with the auth library `[VERIFY]` | Browser-enforced Secure/host-only/path constraints |
| **Expiry** | Session cookies for admin; no "remember me for months" | Limits theft window |

### 7.2 Session lifecycle

| Concern | Requirement |
|---------|------------|
| **Expiration** | Absolute lifetime (time-box) and inactivity timeout for admin sessions, using the platform's session controls where available `[VERIFY: plan-dependent]`; otherwise enforce through short token lifetimes and required re-authentication. Values `[REQUIRES CONFIRMATION]` |
| **Rotation** | Refresh-token rotation enabled; session identifiers/cookies regenerated on sign-in, on privilege change, and after MFA completion |
| **Logout** | Server-side invalidation (revoke session/refresh token), cookie cleared; logout is a state-changing request and protected accordingly (§15) |
| **Refresh-token protection** | Server-side only; never exposed to client JavaScript; reuse detection treated as a security event (revoke the session family and alert) |
| **Concurrent sessions** | Allowed for a small admin team (multiple devices) but visible to the account holder `[REQUIRES CONFIRMATION]`; "sign out other sessions" is available; new-session events are logged |
| **Password/MFA change** | Terminates other sessions |
| **Session theft considerations** | Cookie theft can occur through malware, malicious extensions, XSS-assisted actions or network interception. Mitigations: HTTPS/HSTS, CSP, short lifetimes, step-up re-authentication for high-impact actions, anomaly detection where practical, no third-party scripts on admin pages |
| **Caching** | Admin responses use `Cache-Control: no-store` and are never cached by CDN/shared caches |

### 7.3 What HttpOnly does and does not do

State this plainly to developers: **HttpOnly reduces token theft via script access. It does not eliminate XSS (the injected script can still trigger authenticated actions) and it does not eliminate CSRF.** Therefore XSS prevention (§14), CSRF defences (§15) and CSP are separate, mandatory controls.

---

## 8. Admin Authentication

Admin access is a high-value surface and receives stronger controls than any public interaction.

### 8.1 Requirements

| Control | Requirement |
|---------|------------|
| **Provisioning** | Invite-only. Public sign-up disabled. Admin allowlist (application record) is required in addition to a valid provider identity |
| **Strong authentication** | Managed IdP sign-in with enforced MFA, or password + TOTP MFA |
| **MFA** | **Mandatory for all admin and operator accounts** (a risk-based decision: small population, high privilege). Not required of public visitors, who have no accounts. Supported factor: TOTP authenticator apps at minimum; hardware/passkey options as supported `[VERIFY]` |
| **MFA enforcement** | Enforced server-side — an admin session at "single-factor assurance" must not be able to perform admin operations. Enrolment is required before an account becomes usable. `[VERIFY: assurance-level checks]` |
| **Login rate limiting** | Provider rate limits enabled and verified; additional application-level limit on the admin sign-in path; progressive backoff; limits keyed by both IP and account identifier (§18) |
| **Brute-force protection** | As above, plus generic error messages that do not reveal whether an account exists |
| **Session timeout** | Per §7 |
| **Suspicious-login detection (practical level)** | Log every sign-in (success/failure, time, coarse location/IP, user agent class); alert the account holder/owner on new device/location sign-in where the provider supports it or via simple application logic; alert on bursts of failures. No behavioural-AI platform is required |
| **Account recovery** | Recovery must not bypass MFA. Process: recovery via the IdP (if used) or a controlled out-of-band procedure verified by another admin; no "security questions"; recovery events are logged and notified; MFA reset is a privileged, audited manual action |
| **Admin session invalidation** | Ability to revoke all sessions for a user (on suspected compromise, role change, offboarding) |
| **Credential rotation** | Passwords changed on suspected compromise and on offboarding of anyone who knew shared secrets (there should be none); MFA factors reset on device loss; service credentials follow §24 |
| **No shared accounts** | One identity per person; no generic "admin@" login |
| **Least number of admins** | Keep the admin list minimal; review it periodically |
| **Operator accounts outside the website** | Accounts for Supabase, hosting, registrar, CDN/storage, email provider, and Git hosting require MFA and are inventoried; the V1 enquiry-review workflow depends on Supabase dashboard access, so **Supabase organisation access is treated as admin-equivalent** |

### 8.2 When there is no admin UI (V1 default)

If the custom admin UI ships in V1.1, the **controls above apply immediately to the V1 equivalents**: Supabase dashboard users, hosting/CI/registrar accounts, and the person(s) receiving enquiry email. Specifically: MFA on every such account, minimal membership, role-limited dashboard access (read-only where possible), and no shared logins.

### 8.3 Public users

Public visitors are not required to authenticate, create accounts, or complete MFA.

---

## 9. Authorization

### 9.1 Authentication vs. authorisation

| Concept | Question | Where decided |
|---------|----------|---------------|
| **Authentication** | Who are you? | Supabase Auth (managed), verified server-side |
| **Authorisation** | What are you allowed to do, on which resource? | Application server layer (and database RLS as defence-in-depth), based on server-controlled records |

### 9.2 Requirements

1. **Authorisation is enforced server-side, at the point of action.** Every admin page render, every Server Action, every Route Handler touching privileged data performs: *verify identity → load server-side admin/role record → check permission for this operation (and resource where relevant) → proceed or deny.*
2. **Centralised guard.** A single, tested authorisation module is used by all admin entry points; ad hoc checks scattered across code are not acceptable.
3. **Deny by default.** No matching permission = deny. New routes/actions are denied until they declare their required permission.
4. **Do not rely on:**

| Not a control | Why |
|---------------|-----|
| Hidden or removed UI buttons | The endpoint remains callable |
| Client-side route guards | Client code is attacker-controlled |
| Client-side state or claims | Forgeable |
| URL obscurity (`/admin` is hard to guess) | Discoverable; not authorisation |
| Middleware/proxy checks **alone** | Middleware bypass vulnerabilities have been publicly disclosed in Next.js in the past; middleware may be used for early redirection and header handling, but **each handler must authorise independently** |

5. **Resource-level checks (future-proofing).** Where a user may only access certain resources (client portal), the check includes ownership/scoping, not just role. This prevents insecure direct object reference (IDOR) issues.
6. **Database defence-in-depth.** RLS policies mirror intended access so a bug in application code does not automatically expose data (§22).
7. **Authorisation failures** return generic denials (no information about resource existence) and are logged (§28).
8. **Authorisation tests are mandatory** for every admin entry point (§41).

### 9.3 V1/V1.1 authorisation model

A single **`admin`** role with full admin capability, backed by an `admin_profiles` record containing a `role` column (so future roles can be added without redesign). Authorisation code reads **permissions**, not role names (see §10), even if V1.1 maps `admin` to "all permissions".

---

## 10. Future RBAC

### 10.1 Status

**Not a V1 requirement.** RBAC is future scope unless a confirmed requirement (for example multiple staff with different privileges, or a client portal) demands it. V1/V1.1 ships with one privileged role and an extensible structure.

### 10.2 Conceptual roles (future)

| Role | Intent | Example scope |
|------|--------|---------------|
| **Admin** | Full administration | All areas including user management, release publishing, configuration |
| **Manager** | Manage permitted business/content areas | Review/update enquiries, edit content areas they are assigned; no user management or security configuration |
| **Viewer** | Read-only | View enquiries/reports; no mutations |
| **Client** | Access only explicitly authorised client resources | Own project status/documents only; strict ownership scoping |

### 10.3 Principles for introducing RBAC

1. **Permissions are explicit; roles are bundles of permissions.** A role name alone must never be the authorisation logic (e.g., not `if role == "manager"` scattered across code). Code checks permissions such as `enquiries:read`, `enquiries:update`, `releases:publish`, `users:manage`.
2. **Least privilege.** New roles start with nothing and are granted the minimum permissions.
3. **Server-side evaluation and database enforcement** via RLS for data-level rules.
4. **Role changes are privileged, audited actions** that terminate the target user's sessions.
5. **Separation of duties for high-risk actions** (for example, release publishing may require a second approver) `[REQUIRES CONFIRMATION]`.
6. **Client role isolation:** a Client must never be able to see another client's data; resource-ownership checks and RLS are both required. Introducing Client users is a **significant security change** requiring a dedicated review (public account creation, password/MFA policy for non-staff, support/recovery processes, data isolation testing).
7. **Role definitions live in controlled data/configuration**, reviewed via pull request or an audited admin action.

---

## 11. Password Security

Applies **only if** password-based sign-in is used (Supabase Auth email/password). Passwords are not required if Google/managed-IdP sign-in is used.

| Requirement | Detail |
|-------------|--------|
| **Never store plaintext** | Passwords are handled and hashed by the auth provider; the HENU application never receives, stores or logs them outside the provider's sign-in interaction |
| **Never log passwords** | Including in error reports, debugging output, request logs and analytics; redact `password`-like fields by name pattern in all logging |
| **Hashing** | Handled by the managed provider using a modern, trusted algorithm `[VERIFY]`; **no custom hashing implementation** |
| **Password requirements** | Length-first policy (long passphrases), minimum length per current guidance `[REQUIRES CONFIRMATION]`; check against known-breached passwords if the provider supports it `[VERIFY]`; no arbitrary composition rules or forced periodic rotation (rotate on suspicion of compromise); password manager use encouraged; **MFA mandatory for admin regardless of password strength** |
| **Reset flows** | Time-limited, single-use reset links sent to the verified email; reset does not bypass MFA; reset invalidates existing sessions; the generic response is the same whether or not the account exists; reset-request endpoints rate-limited; reset events logged and the account holder notified |
| **Account enumeration** | Sign-in, reset and invitation flows return uniform responses and similar timing where practical |
| **Rate limiting** | Per §18 |
| **Credential stuffing resistance** | MFA, rate limiting, breached-password checks where available |
| **Transport** | Sign-in only over HTTPS; credentials are never placed in URLs |
| **Service passwords** | Database and service credentials are generated, long, random, stored in secret managers (§24), never reused across environments |

---

## 12. Input Validation

### 12.1 Principle

All untrusted input is hostile. **Server-side validation is the security boundary; client-side validation is UX only.**

### 12.2 Input surface inventory (V1)

| Input | Source | Phase | Notes |
|-------|--------|-------|-------|
| Contact / general enquiry | Public form | V1 | Primary untrusted-input surface |
| Service / project enquiry | Public form | V1 | |
| Partnership / technical / support enquiry | Public form | V1 | May share one form with a type selector |
| URL path params (slugs, versions) | Visitors | V1 | Validated against known content; unknown → 404 |
| Query parameters | Visitors | V1 | Only those explicitly supported; ignore others |
| HTTP headers, cookies | Clients | V1 | Treated as hostile |
| Search queries | Visitors | Future (no server search endpoint in V1) | If introduced, treat per §18 |
| Admin forms (status changes, notes) | Admins | V1.1 | Validated identically to public input |
| Product/service/project metadata and MDX content | Git (reviewed) | V1 | Validated by schema at build; reviewed; not runtime user input |
| Blog/doc content | Git or admin | V1.1 | See §30 |
| File uploads | — | **Out of scope in V1** | See §20 |
| Webhook payloads | Third parties | As needed | Signature-verified before parsing |

### 12.3 Validation requirements

| Check | Requirement |
|-------|------------|
| **Type** | Parsed against a schema; unexpected types rejected (not coerced silently) |
| **Format** | Email, URL (allowed schemes only: `https`, optionally `http`; never `javascript:` or `data:`), slugs and versions by strict pattern |
| **Length** | Maximum length on **every** string field; minimum where meaningful; total request size capped |
| **Allowed values** | Enumerations (enquiry type, status) validated against a closed set; unknown values rejected |
| **Required fields** | Enforced server-side |
| **Maximum sizes** | Request body size limits at the platform and application level (§25) |
| **Unexpected fields** | Stripped/rejected — no mass-assignment of arbitrary fields into database writes |
| **Normalisation** | Trim, normalise Unicode and case where appropriate (e.g., emails) before validation and storage; reject control characters and CR/LF in header-bound fields (§38) |
| **Business rules** | Applied in the service layer after schema validation (e.g., a release cannot be published without a valid SHA-256) |
| **Defence in depth** | Database constraints (NOT NULL, length, CHECK, enums, uniqueness) mirror critical rules |
| **Error handling** | Field-level, safe messages; no echoing of raw input in a way that creates injection; no stack traces |
| **Allowlists over denylists** | Validate what is allowed rather than trying to detect "bad" patterns |

Validation does **not** replace output encoding or parameterised queries; each addresses a different failure mode.

---

## 13. SQL Injection Protection

| Requirement | Detail |
|-------------|--------|
| **Parameterised access only** | All database access uses the Supabase client's query builders or parameterised/prepared statements. **No string concatenation or template interpolation of untrusted data into SQL text, ever.** |
| **Centralised access** | Only `server/repositories` talks to the database (document 02). UI components, pages and Client Components never run queries |
| **Dynamic identifiers** | If a column/table/order-by must be dynamic, it is mapped from a closed allowlist, never taken from user input |
| **Database functions** | Any SQL functions/RPCs that accept user input use parameters and are reviewed; `SECURITY DEFINER` functions require explicit review (set a safe search path; avoid exposing them via the public API unnecessarily) |
| **Validated inputs** | Schema validation precedes repository calls |
| **Least privilege** | The database identity used for public intake can only perform the narrow operations needed (insert enquiry), so even a hypothetical injection has limited blast radius (§22) |
| **No raw-query escape hatches in feature code** | Raw SQL, if required for migrations/reporting, lives in migrations or clearly reviewed repository functions |
| **Error output** | Database errors are never returned to clients (§27) |
| **Testing** | Injection payload tests against every input path (§41) |

Note: the Supabase query builder (PostgREST) is not "automatically injection-proof" if filter strings are built from user input (for example, composing `or(...)` filter expressions from raw text). **Untrusted values must be passed as values, not spliced into filter syntax.** `[VERIFY]`

---

## 14. XSS Protection

### 14.1 Threat types and controls

| Type | Description | Controls |
|------|------------|----------|
| **Stored XSS** | Malicious content saved (e.g., an enquiry message) and later rendered — **especially in the admin viewer**, which is the highest-risk place | React's default escaping for all dynamic text; admin views render enquiry content as **plain text**; no auto-linking of untrusted content unless sanitised and `rel`-hardened; no `dangerouslySetInnerHTML` with untrusted data; strict CSP on admin pages |
| **Reflected XSS** | Request data echoed into a response | Never inject query/path values into HTML or script contexts without framework escaping; error pages don't echo raw input; 404s use generic text |
| **DOM-based XSS** | Unsafe browser-side use of data in sinks (`innerHTML`, `document.write`, `eval`, `location` assignments, unsanitised URL building) | Avoid unsafe sinks entirely; lint rules forbid them; validate URLs before assigning to `href`/`src` (allow `https:`, `mailto:` as needed; block `javascript:`/`data:`); no inline event handler strings |

### 14.2 Requirements

1. **Output encoding by context** (HTML text, attribute, URL, JavaScript, CSS). Rely on the framework's escaping; never build HTML strings manually.
2. **`dangerouslySetInnerHTML` is prohibited by default.** Permitted only for content that is (a) generated by trusted build-time processing (e.g., compiled MDX from the repository) or (b) sanitised with a vetted sanitiser configured with a strict allowlist. Each use requires a code comment, review, and a test.
3. **Sanitisation is a last resort, not the plan.** Prefer structured content (§30). Do not rely solely on input sanitisation; encode on output and constrain with CSP.
4. **Content Security Policy** as a defence layer (§16): the aim is to prevent inline-script injection from executing and to restrict script origins.
5. **No untrusted third-party scripts** on admin pages; minimal on public pages.
6. **JSON in HTML:** if data is serialised into the page, it is serialised safely (escaping `<`), never concatenated.
7. **MDX/Markdown from the repository** is trusted only insofar as it is reviewed; components exposed to MDX are an explicit allowlist; raw HTML in MDX is disabled or sanitised where content authors may include untrusted contributions `[REQUIRES CONFIRMATION: who may author content]`.
8. **Email and notification templates** HTML-escape all user-supplied values (§38).
9. **Open-redirect and URL-parameter handling** (§12): never redirect to a user-supplied URL without allowlist validation.
10. **Dependency hygiene:** UI/rich-text/markdown libraries are kept current (§32).
11. **Testing:** XSS payload tests against forms, admin viewers and any rendering of stored data (§41).

---

## 15. CSRF Protection

### 15.1 Assessment

| State-changing surface | CSRF relevance | Protection |
|------------------------|---------------|-----------|
| **Admin mutations** (Server Actions) | **High** — cookie-authenticated, state-changing | Framework Origin/Host verification for Server Actions `[VERIFY: behaviour and configuration for the exact Next.js version, including any allowed-origin settings behind proxies]`; SameSite=Lax/Strict session cookie; POST-only; no state change on GET; explicit Origin/Sec-Fetch-Site checks for Route Handlers |
| **Sign-in / sign-out / auth operations** | Medium (login CSRF, forced logout) | Provider/library protections; Origin checks; SameSite |
| **Public enquiry submission** | Low for session-based CSRF (no session), but cross-site form posts can be used for spam | Rate limiting, anti-bot checks, Origin verification as a signal (§19) — not a replacement for those |
| **Account/password/MFA changes** | High | Re-authentication + Origin checks + SameSite |
| **State-changing API Route Handlers** | High if cookie-authenticated | Explicit Origin/Referer allowlist and/or CSRF token; require a custom header (non-simple CORS request) or bearer token not auto-sent by browsers |
| **Release publishing / config changes (V1.1+)** | High impact | All of the above + step-up re-authentication (§39) |

### 15.2 Requirements

1. **No state changes on GET/HEAD.** Mutations use POST/PUT/PATCH/DELETE (Server Actions use POST).
2. **SameSite cookies** (Lax at minimum; Strict where UX allows) — *reduces* but does not eliminate CSRF (for example, same-site subdomain attackers, browser inconsistencies, older browsers, GET-based mistakes).
3. **Origin verification** on every mutating endpoint: compare `Origin` (fall back to `Referer`/`Sec-Fetch-Site`) to the trusted site origin(s); reject missing/mismatched on cookie-authenticated routes.
4. **CSRF tokens (synchroniser or double-submit) where framework protection does not cover** a mutating endpoint (custom Route Handlers).
5. **Do not claim HTTP-only cookies prevent CSRF.** Browsers attach HttpOnly cookies automatically to cross-site requests where SameSite rules allow, so cookies stay vulnerable to CSRF unless the controls above exist.
6. **CORS is not CSRF protection.** CORS restricts reading responses cross-origin; it does not stop simple cross-site requests from being sent (§26).
7. **Clickjacking** (UI redress) is addressed separately with `frame-ancestors` / `X-Frame-Options` (§16).
8. **Testing:** cross-origin forged request tests against each admin mutation (§41).

---

## 16. Security Headers

### 16.1 Strategy

Set a consistent baseline for all responses, with stricter policies for admin responses. Headers are **defence-in-depth**, not substitutes for secure code. Roll out CSP in **Report-Only** first, monitor violations, then enforce.

### 16.2 Header table

| Header | Recommended value (intent) | Protects against | Compatibility / notes |
|--------|---------------------------|------------------|-----------------------|
| **Strict-Transport-Security** | Long `max-age`, `includeSubDomains` once **all** subdomains are confirmed HTTPS-only; **`preload` only as a deliberate, hard-to-reverse decision** | Protocol downgrade, cookie interception on first HTTP hit after first visit | Staged rollout: begin with a short max-age, increase after verification. `includeSubDomains` can break non-HTTPS subdomains; `preload` is effectively permanent `[REQUIRES CONFIRMATION]` |
| **Content-Security-Policy** | `default-src 'self'`; `script-src` restricted (nonce/hash-based where feasible); `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'`; `form-action 'self'`; `img-src`/`media-src`/`connect-src` allowlisting only required origins (including the download/media origin); `upgrade-insecure-requests` | XSS impact reduction, injection of third-party scripts, clickjacking, base-tag and form hijacking | **Tradeoff:** nonce-based CSP in Next.js requires dynamically rendered pages and can conflict with static generation/CDN caching; hash-based or carefully scoped policies may be used for static pages. Style handling (inline styles from the framework) may need `style-src` allowances. Adopt a **strict nonce policy for admin (dynamic anyway)** and a **pragmatic, progressively tightened policy for public static pages**, validated in Report-Only. `[VERIFY: current Next.js CSP guidance]` |
| **X-Content-Type-Options** | `nosniff` | MIME-type sniffing attacks (important for downloads/uploads) | Safe; no known compatibility problems. Mandatory on download origin |
| **Referrer-Policy** | `strict-origin-when-cross-origin` (or stricter) | Leakage of paths/query strings to other sites | Admin: `no-referrer` or `same-origin` |
| **Permissions-Policy** | Disable unused features (camera, microphone, geolocation, payment, USB, etc.) | Abuse of powerful browser features by injected/third-party content | **Voice features:** if a future HENU PA browser demo needs the microphone, allow it only on that route `[REQUIRES CONFIRMATION]` |
| **Frame protection** | CSP `frame-ancestors 'none'` plus legacy `X-Frame-Options: DENY` | Clickjacking | If HENU intentionally embeds its pages elsewhere, relax narrowly |
| **Cache-Control (sensitive)** | `no-store` on admin pages and authenticated/API responses containing private data | Sensitive data retained in browser/proxy caches | Do not apply `no-store` to public static pages (hurts performance) |
| **Cross-Origin-Opener-Policy** | `same-origin` for admin where feasible | Cross-window attacks | Test with any OAuth popup flows `[VERIFY]` |
| **Cross-Origin-Resource-Policy** | `same-site`/`cross-origin` as appropriate; download origin may need `cross-origin` | Cross-origin resource leaks | Don't break legitimate embedding of media |
| **Cross-Origin-Embedder-Policy** | Not required in V1 | n/a | Adds complexity; only if a feature needs cross-origin isolation |
| **Content-Disposition** (download origin) | `attachment` for ISOs/installers | Browser rendering of served files | Set on the object/CDN |
| **Server / X-Powered-By** | Remove/minimise technology disclosure | Minor information leakage | Low priority; don't rely on it |
| **CORS headers** | Per §26 | Unintended cross-origin reads | n/a |

### 16.3 Operational rules

- Headers are defined **centrally** (framework configuration/middleware or platform config), not ad hoc per page.
- **Public site, admin area, and download origin have separate header policies.**
- A header test runs in CI/pre-production (verify presence on key routes).
- CSP changes are tested against real pages (analytics, fonts, media, embeds) to avoid breaking functionality; **Report-Only → enforce** is the rollout path.
- Third-party allowances in CSP are minimal and documented (§31).

---

## 17. HTTPS / TLS

| Requirement | Detail |
|-------------|--------|
| **HTTPS-only** | All production hostnames (site, download origin, docs, admin) serve over HTTPS only |
| **HTTP → HTTPS redirect** | Permanent redirect at the edge for every hostname |
| **Secure cookies** | `Secure` attribute on all session cookies (§7) |
| **TLS configuration** | Use the managed platform/CDN's modern TLS defaults: TLS 1.2 minimum, TLS 1.3 enabled, modern cipher suites, no legacy protocols `[VERIFY: provider defaults and configurability]` |
| **HSTS** | Per §16, staged rollout; applied to the site and download origin |
| **Certificate management** | Managed, automatically renewed certificates; expiry monitoring and alerting even when automated; CAA DNS records restricting issuance `[REQUIRES CONFIRMATION]`; certificate transparency monitoring is optional |
| **Internal/service connections** | TLS for all connections to Supabase, email, storage and monitoring; **TLS certificate verification is never disabled** (not even in development scripts committed to the repo) |
| **Mixed content** | None; enforced with CSP `upgrade-insecure-requests` and by linting URLs |
| **DNS and registrar security** | Registrar account with MFA and registrar lock; limited DNS editors; DNSSEC where the registrar/provider supports it `[REQUIRES CONFIRMATION]`; DNS change alerts; stale/dangling DNS records removed (subdomain takeover prevention) |
| **Email domain authentication** | SPF, DKIM and DMARC for the sending domain (reduces spoofing of HENU email and improves enquiry-notification deliverability) |

Remember: HTTPS protects the channel. It does **not** make the application secure and does not prevent injection, authorisation flaws or malicious content.

---

## 18. Rate Limiting

### 18.1 Principle

Rate-limit **abusable and sensitive** operations, not every request. Static pages served from the CDN are cached and are protected by the CDN/platform rather than by application rate limiting.

### 18.2 Priority endpoints

| Endpoint | Key | Intent |
|----------|-----|--------|
| **Admin sign-in / auth endpoints** | IP + account identifier | Brute-force and credential-stuffing defence |
| **Password reset / invite / MFA challenge** | IP + account identifier | Prevent enumeration, email flooding and code guessing |
| **Enquiry forms (contact/service/partnership)** | IP + fingerprint-lite (e.g., IP + email) + global ceiling | Spam and notification flooding |
| **Public APIs (V1.1+, e.g., releases metadata)** | IP (and API key if introduced) | Scraping/abuse; read endpoints are cacheable so limits are generous |
| **Search endpoints (future)** | IP | Abuse of expensive queries |
| **Download-related endpoints (if any app endpoints exist)** | IP | Abuse of redirects/metadata (the file itself is protected at the CDN) |
| **Webhook receivers** | Signature verification + source allowlist where possible | Spoofing/flooding |
| **Admin mutations** | Account | Abuse of a compromised session; bulk operations |

### 18.3 Design guidance

| Concern | Guidance |
|---------|----------|
| **Where to enforce** | Layered: (1) **edge/CDN/platform rules** for coarse IP-level protection; (2) **auth provider limits** for sign-in flows (enable and verify, `[VERIFY]`); (3) **application-level limits** for form and admin actions |
| **Serverless caveat** | In serverless/multi-instance deployments, in-memory counters do **not** work across instances. Application-level limits require a **shared store** (a managed key-value/Redis-style service or the platform's rate-limit feature) `[REQUIRES CONFIRMATION: provider]`. A limiter that silently doesn't limit is worse than none because it creates false confidence |
| **Keying** | IP (taking the real client IP only from the trusted proxy header configured for the platform — never from a header the client can set), account identifier for auth, and combined keys for forms. Account-keyed limits protect accounts targeted from many IPs; IP-keyed limits protect against broad abuse. Beware shared IPs (offices, mobile carriers, universities) |
| **Progressive backoff** | Increasing delays/lockout durations after repeated failures; temporary, not permanent, lockout (permanent lockout enables denial-of-service against admins) |
| **Response** | `429` with a generic message and `Retry-After` where relevant; no information about which limit/key triggered |
| **Avoid false positives** | Limits sized from observed legitimate behaviour (no limits are specified here because none have been measured `[REQUIRES CONFIRMATION]`); allowances for retries after validation errors; legitimate users are not forced through CAPTCHA by default |
| **Fail behaviour** | If the limiter store is unavailable: **sensitive auth endpoints fail closed**; public enquiry fails open to a degraded-but-safe path (e.g., stricter honeypot/time checks, queued review) so outages don't block legitimate enquiries `[REQUIRES CONFIRMATION]` |
| **Observability** | Rate-limit events are logged (counts, keys hashed) and monitored |
| **Testing** | Per §41 |

---

## 19. Spam Protection

### 19.1 Layered approach (cheapest and least intrusive first)

| Layer | Mechanism | Notes |
|-------|----------|-------|
| 1 | **Server-side validation** | Length limits, format checks, closed enums; reject oversized or malformed submissions |
| 2 | **Honeypot field** | A hidden field humans leave empty; filled → treat as spam (silent success or low-key rejection to avoid teaching bots). Must be hidden **accessibly** (not exposed to screen readers or keyboard focus) so legitimate assistive-technology users are not trapped |
| 3 | **Time-to-submit check** | Submissions faster than a human could plausibly complete are treated as suspect; token signed server-side to prevent trivial forging |
| 4 | **Rate limiting** | §18 |
| 5 | **Duplicate detection** | Same content/email in a short window is deduplicated, avoiding repeated notifications |
| 6 | **Content heuristics** | Flag (not necessarily reject) submissions with excessive links, known spam patterns, or foreign-script mismatches; route to `spam` status for review rather than silently discarding legitimate enquiries `[REQUIRES CONFIRMATION]` |
| 7 | **Adaptive challenge** | A privacy-respecting bot challenge (Cloudflare Turnstile, hCaptcha, reCAPTCHA-class, or similar) invoked **only** when risk signals are present (suspicious rate/behaviour), not for every visitor. Provider choice weighs privacy, accessibility, cost and third-party script exposure `[REQUIRES CONFIRMATION]` |
| 8 | **Email-side protections** | Notification emails are rate-capped (global ceiling) so a spam flood cannot exhaust the email quota or damage domain reputation |

### 19.2 Principles

- **Do not force CAPTCHA on every user by default.** It harms accessibility and conversion, and it is not a complete anti-abuse system: it stops many automated bots but not determined human-assisted abuse, and it can be bypassed by solver services.
- **Keep a path for legitimate users to reach HENU** even if the form is temporarily degraded (visible alternative contact email).
- **Spam status is data:** spam-classified items are retained briefly for tuning and purged on a short schedule `[REQUIRES CONFIRMATION]`.
- **Challenge-provider tokens are verified server-side** with the provider's secret key (server-only), never trusted from the client.

---

## 20. File Upload Security

### 20.1 V1 scope statement

> **File uploads are out of scope for V1.** Public forms accept text fields only. Administrators do not upload files through the application in V1 (assets are managed through the repository; release artifacts are published through the separate release workflow, not through the website).

No upload endpoint may exist in V1. If one is proposed, it requires a security review against the controls below **before** implementation.

### 20.2 Requirements if uploads are introduced later (V1.1+ admin assets, or any public upload)

| Control | Requirement |
|---------|------------|
| **Allowed types** | Strict allowlist by purpose (e.g., images: PNG/JPEG/WebP; documents only if necessary). No executables, scripts, archives or HTML/SVG from untrusted sources (SVG can carry script; sanitise or avoid) |
| **Size limits** | Per-file and per-request limits enforced at the edge and application; storage quotas |
| **Type validation** | Validate by **content inspection (magic bytes)** and re-encode images where possible, **not** by file extension or browser-supplied MIME type. **Never trust the filename or `Content-Type` from the client** |
| **Filename handling** | Discard the user's filename for storage; generate a **random, unguessable identifier**; keep the sanitised original name only as metadata and never use it in paths |
| **Path traversal** | Never build file system or object-key paths from user input; normalise and reject `..`, absolute paths, null bytes |
| **Storage location** | Dedicated bucket/prefix **separate from application code and from public static assets**; never in an executable/served-as-code location |
| **Served content** | Served from a **separate, cookieless origin** with `Content-Disposition` and `X-Content-Type-Options: nosniff` so uploaded content cannot execute in the application's origin |
| **Authorisation** | Upload permission and **download/read permission** are checked server-side; private files are served via short-lived signed URLs or an authorising handler |
| **Malware scanning** | Required for uploads that may be opened by staff or other users, particularly documents from the public `[REQUIRES CONFIRMATION: tooling]`; justified by risk — not required for admin-only image uploads from trusted staff |
| **Prevent executable uploads** | Reject by type; no execute permission; no server-side processing that interprets content as code |
| **Image processing** | Use maintained libraries, strip metadata (EXIF location) unless needed, constrain dimensions/decode limits (decompression-bomb protection) |
| **Rate limiting & abuse** | Per §18; storage quotas to prevent cost exhaustion |
| **Logging/audit** | Who uploaded what, when; deletions tracked |

---

## 21. HENU OS Download Security

### 21.1 Why this is special

HENU OS is software people will install on their machines. A compromised artifact is more damaging than a defaced web page. The release path must therefore be **more controlled than the rest of the site**.

### 21.2 Required controls (V1, when a public release exists)

| Control | Requirement |
|---------|------------|
| **Official release process** | Artifacts originate **only** from the controlled release workflow (reproducible/CI-built where feasible), never from an engineer's ad hoc upload to the public bucket |
| **Separate write path** | The website runtime has **no write credentials** to artifact storage. Release publishing uses a **dedicated, scoped credential** (preferably short-lived, identity-federated from CI) permitted to write only to the release prefix |
| **Immutability** | Published artifacts are **never overwritten**. New builds = new version/name. Enable object versioning and, where available, retention/object-lock to prevent silent replacement `[VERIFY: provider capability]` |
| **No silent changes** | A change to the artifact or its checksum/URL requires a visible new release or an explicit, audited "republish" procedure with a public note |
| **Checksum (SHA-256)** | Computed at build/publish time by the release workflow, stored in release metadata, displayed on the download page, and re-verified after upload (download and compare) before publishing |
| **Metadata integrity** | Release metadata (V1: Git-tracked) changes only via protected-branch pull request with required review and (recommended) CODEOWNERS covering the releases directory; schema validation fails the build on a missing/malformed checksum |
| **Traceability** | Every published artifact maps to a release record: version, channel, date, architecture, size, checksum, and a reference to the build/source revision `[REQUIRES CONFIRMATION]` |
| **Draft/unpublished artifacts** | Stored in a **non-public location**; promoted to public only at publish time |
| **Download origin hardening** | Separate hostname; no cookies; `nosniff`; `Content-Disposition: attachment`; HTTPS only; no directory listing; restricted CORS; hotlink/abuse controls at the CDN |
| **Integrity monitoring** | A scheduled job recomputes checksums of published artifacts (or compares provider-supplied ETags/checksums where reliable) against metadata and alerts on mismatch (V1.1 if not feasible at launch) |
| **Withdrawal** | A release can be withdrawn (hidden from download, retained in history with a notice) without deleting evidence |
| **Verification guidance** | The page explains how users verify the checksum |

### 21.3 Honest limits of checksums

> A checksum published **on the same website that links the file** protects users against corruption and against some partial compromises (e.g., a storage bucket altered without altering the website). **It does not protect against an attacker who controls both the website and the file**, because they can change both. Therefore:
>
> - V1 copy must describe it as **"SHA-256 checksum for integrity verification"**, not as proof of authenticity.
> - The website must **not claim** the artifact is "signed" or "verified authentic" unless signing is actually implemented and documented.

### 21.4 Signing roadmap (recommended, not claimed in V1)

| Option | Notes | Phase |
|--------|-------|-------|
| **Detached signature (e.g., OpenPGP or minisign-style) over the checksum file/artifact** | Users verify against a **public key published through multiple independent channels** (website, repository, documentation, social/official accounts); protects against website/storage compromise as long as the private key is safe | **V1.1 / Future** `[REQUIRES CONFIRMATION]` |
| **Signing key custody** | Offline or hardware-backed key; not stored in the web application, repository or general CI secrets; documented key-rotation and revocation process | Required **before** claiming signing |
| **Secure boot/shim signing (OS-level)** | Distribution-level concern outside the website; relevant to the HENU OS engineering team | Future / out of scope here |
| **Reproducible builds / transparency logs** | Strong supply-chain assurances | Future |
| **Mirrors** | Additional mirrors multiply integrity risk; require signatures/checksums users can verify independently | Future |

### 21.5 Abuse and availability

Bandwidth abuse, hotlinking and cost exhaustion are handled in §36. Public software downloads **do not require login** (§43).

---

## 22. Database Security

### 22.1 Requirements

| Control | Requirement |
|---------|------------|
| **Least-privilege access** | Application database identities are limited to the operations they need. The public enquiry path can **only insert** into the enquiries table; it cannot read, update or delete it |
| **Separation of public and privileged access** | Distinct credentials/paths for (a) public intake, (b) admin operations, (c) migrations/ownership, (d) automation. No single credential used everywhere |
| **Server-only elevated credentials** | Credentials that bypass RLS (service-role/secret-class keys) exist **only** in server environment variables, are used in a small number of repository functions, and are **never** importable by client code (`server-only` guard) or given a public prefix |
| **Row Level Security** | **Enabled on every table in any schema exposed via the Supabase Data API**, with **no permissive policies** for `anon`/`authenticated` unless a specific need is documented. Default is deny |
| **Limit exposure** | Restrict which schemas the Data API exposes; keep application tables out of exposed schemas or **revoke default table privileges** from `anon` and `authenticated`; remember that RLS applies to requests that use the public/authenticated roles but **service-role/secret keys and direct privileged connections bypass RLS** `[VERIFY]` |
| **Secure connections** | TLS enforced to the database; certificate verification on; connection strings secret; connection pooling configured with limited roles |
| **Network exposure** | Direct database access restricted (network restrictions/allowlist where the plan supports it) `[VERIFY]` `[REQUIRES CONFIRMATION]` |
| **Administrative access** | Supabase organisation/project members: minimal, MFA-protected, least-privileged roles, reviewed periodically (§8) |
| **Migrations** | Schema changes only through version-controlled migrations, reviewed in pull requests; applied by CI/controlled process with a migration-only credential; no ad hoc production schema edits; destructive migrations require explicit review and a verified backup |
| **Constraints** | NOT NULL, CHECK, length, enumerations and unique constraints enforce invariants (document 02) |
| **Functions/RPC** | Reviewed; `SECURITY DEFINER` used sparingly with fixed search path; not exposed to anon unless intended |
| **Backups & recovery** | §35 |
| **Data minimisation** | §37 |
| **Auditing** | Admin writes logged (V1.1); database/platform logs retained within plan limits |
| **Separate environments** | Separate projects per environment; no production data in dev/staging (§24) |
| **Extensions** | Only those required |

### 22.2 Access path decision for public enquiry intake

Because the browser does **not** use Supabase directly in V1, there are two safe patterns for the server to write enquiries. One must be chosen `[REQUIRES CONFIRMATION]`:

| Pattern | Description | Assessment |
|---------|------------|------------|
| **A. Direct server connection with a dedicated, insert-only database role** | The server uses a restricted Postgres role/connection string that can only insert into the enquiries table | Strongest least-privilege; keeps the service-role key out of the public intake path entirely. **Preferred** where the team can manage a pooled connection securely |
| **B. Supabase client with the elevated key, confined to one repository function** | The server uses the service-role/secret key only inside the enquiry repository function | Simpler but the key bypasses RLS and has full access; acceptable only with strict confinement, no logging of the client, and secret-scanning |
| **C. Public/anon key with an insert-only RLS policy** | Browser-capable key used server-side | **Not recommended**: anyone with the (public) key could call the Data API directly and bypass validation, rate limiting and spam checks |

Whichever is chosen, the **enquiries table must not be directly writable or readable by `anon`/`authenticated` roles through the public Data API**, so that the validated server path is the only path.

---

## 23. Supabase Security

### 23.1 Credential separation

| Credential class | Examples | Where allowed | Notes |
|------------------|---------|---------------|-------|
| **Public / client-safe** | Project URL; public "anon"/"publishable" key `[VERIFY: current key naming]` | May appear in browser code **if** browser access is used; designed to be public but only safe when RLS/grants are correct | **V1 does not require shipping a Supabase key to the browser at all.** If none is shipped, none can be abused from the bundle |
| **Privileged / server-only** | **Service-role / secret-class key**, database passwords, JWT signing secrets, management API tokens | Server environment variables, secret stores only | **Never** in the browser, repository, logs, error messages, source maps, issue trackers or screenshots |

> **Mandatory:** The Supabase service-role (or equivalent secret) key must never be exposed to the browser. It bypasses RLS, so exposure equals unrestricted database access.

### 23.2 Configuration requirements

| Area | Requirement |
|------|------------|
| **RLS** | Enabled on all exposed tables; verified by automated test (an unauthenticated Data API request to every table must return no data or be denied) |
| **Data API exposure** | Only necessary schemas exposed; unused API surface disabled/limited `[VERIFY]` |
| **Auth settings** | Public sign-ups **disabled**; email confirmation required where applicable; MFA enabled; refresh-token rotation and reuse detection enabled; JWT expiry set deliberately; password policy configured (if passwords); redirect URL allowlist (only exact production/staging callback URLs; no wildcards to unrelated domains); rate limits reviewed; OAuth provider secrets stored server-side; SMTP for auth emails configured with a reputable sender `[VERIFY]` |
| **Storage buckets** | Private by default; any public bucket reviewed and limited to public assets; **no ISO distribution from Supabase Storage** (document 02); storage policies are explicit allowlists |
| **Edge Functions/Realtime/other features** | Not used in V1; disabled or unused features do not exist as attack surface |
| **Project access** | Organisation members minimal; MFA enforced; production project restricted `[VERIFY]` |
| **Platform advisories** | Platform security/performance advisors reviewed regularly and before launch |
| **Environment isolation** | Separate projects for dev/staging/prod; keys never reused |
| **Key rotation** | Procedure documented and rehearsed (§24) |
| **Monitoring** | Platform logs, auth logs and alerts reviewed per plan capability |
| **Do not assume** | Supabase is **not** automatically secure: its defaults require correct RLS, grants, auth settings and key handling. Hidden UI elements provide **no** database security — the database itself must enforce access |

### 23.3 Verification

A pre-launch **Supabase security review** (§47) confirms RLS, grants, exposed schemas, auth settings, redirect URLs, bucket policies and key usage, and is repeated after any schema or auth-configuration change.

---

## 24. Secrets Management

### 24.1 Rules (mandatory)

Secrets must never be:

- Hardcoded in source code.
- Committed to Git (including history, `.env` files, scripts, notebooks, test fixtures, screenshots, documentation).
- Included in client bundles or exposed via public-prefixed variables.
- Written to logs, analytics, error trackers or error messages.
- Embedded in downloadable frontend assets, source maps or build output.
- Shared through chat, email or tickets.

### 24.2 Secret inventory (examples; final list during implementation)

| Secret | Class | Used by | Exposure target |
|--------|-------|---------|-----------------|
| `DATABASE_URL` / database role credentials | Server-only | Server layer, migration job (separate credential) | Never browser |
| `SUPABASE_SERVICE_ROLE_KEY` (or newer secret-class key) | Server-only | Specific repository functions | Never browser |
| Auth/JWT secrets, OAuth client secrets | Server-only / provider-managed | Auth configuration | Never browser |
| Email provider API key | Server-only | `server/integrations` | Never browser |
| Anti-bot **secret** key | Server-only | Server verification | Never browser |
| Webhook signing secrets | Server-only | Route Handlers | Never browser |
| Storage/CDN **write** credentials (release publishing) | CI/release-only | Release workflow | **Never in the web application** |
| Error-monitoring auth/upload tokens | Build/CI-only | CI | Never browser |
| Encryption keys (if field-level encryption is ever used) | Server-only | Service layer | Never browser |
| Signing keys (future) | Highest sensitivity | Release signing | Offline/hardware, not in CI by default |
| Public-prefixed configuration (site URL, public analytics ID, anti-bot **site** key) | **Public — not secrets** | Browser | Intentional |

### 24.3 Public vs. server-only variables

| Rule | Detail |
|------|--------|
| **Naming discipline** | Only variables explicitly intended for the browser carry the framework's public prefix. A secret must never be given a public prefix |
| **Single access point** | Only `config/` reads environment variables, validated by schema at startup; code consumes typed config |
| **Build-time protection** | CI inspects the built client bundle and static output for secret patterns and known secret values (or their prefixes) and fails the build on a match |
| **Server-only guard** | Server modules are marked so importing them from client code fails the build |

### 24.4 Storage and environments

| Concern | Requirement |
|---------|------------|
| **Storage** | Hosting platform's encrypted environment/secret store and CI secret store; a dedicated secret manager is **not required in V1** but adopted if the number of secrets/teams grows `[REQUIRES CONFIRMATION]` |
| **Local development** | `.env.local`-style files are git-ignored; developers use **development-only credentials**; production secrets are never on developer machines |
| **Environment separation** | Distinct values per environment (development, staging, production); preview deployments use staging-class credentials |
| **Example file** | A committed template lists variable **names** only |
| **Access** | Platform project/CI secrets are visible only to those who need them; changes audited |

### 24.5 Rotation

| Trigger | Action |
|---------|--------|
| **Suspected or confirmed exposure** | **Immediate** rotation and revocation; treat as compromised (§33, §42) |
| **Personnel change** (someone with access leaves) | Rotate secrets they could access |
| **Scheduled** | Periodic rotation for long-lived secrets on a defined cadence `[REQUIRES CONFIRMATION]`; prefer short-lived credentials (OIDC-federated CI, expiring tokens) over long-lived ones |
| **Procedure** | Documented, rehearsed once before launch: create new secret → deploy → verify → revoke old → confirm no usage → record |
| **Zero-downtime** | Where possible, support overlap (two valid keys) during rotation |

### 24.6 Detection

Repository secret scanning (platform + pre-commit/CI), provider-side key-misuse alerts, bundle scanning, and periodic review of secret inventory.

---

## 25. API Security

### 25.1 Context

V1 has **no public API required for first-party UI** (document 02). Attack surface exists as Server Actions and Route Handlers (which are HTTP endpoints). If a read-only public API (e.g., latest-release metadata) is added, or a standalone API is later extracted, the same requirements apply.

### 25.2 Per-endpoint requirements

| Concern | Requirement |
|---------|------------|
| **Authentication** | Required for every non-public endpoint; public endpoints are explicitly declared public, read-only, and non-sensitive |
| **Authorisation** | Per-operation permission check server-side (§9); resource-level checks where applicable |
| **Input validation** | Schema validation before logic (§12); reject unknown fields |
| **Rate limiting** | Per §18, tailored per endpoint |
| **Request size limits** | Body size caps at the platform and application level; reject oversize early; cap JSON depth/array lengths |
| **Error handling** | Consistent safe error shape (document 02): machine-readable code, human message, correlation ID; no internals (§27) |
| **Logging** | Structured request logs with correlation IDs; no secrets/PII bodies (§28) |
| **CORS** | Explicit allowlist per §26 |
| **CSRF** | Applicable to cookie-authenticated mutation endpoints (§15); token-based/header-authenticated APIs are less exposed but still validated |
| **Response data minimisation** | Return only fields the consumer needs; map database rows to explicit response types; never serialise raw database records or internal IDs/audit fields unless intended |
| **HTTP method discipline** | Only the intended methods are accepted; others return `405` |
| **Content-type enforcement** | Require the expected `Content-Type`; reject others |
| **Idempotency** | Considered for mutating public endpoints to avoid duplicate side effects |
| **Versioning & deprecation** | URL-versioned (document 02); old versions retired deliberately |
| **Do not expose internals** | No endpoint mirrors database tables; no generic "query anything" interfaces |
| **Webhooks** | Verify signatures and timestamps (replay protection) before parsing; allowlist sources where possible; idempotent handlers |
| **Health endpoint** | Returns minimal status, no version/dependency/environment details |
| **API keys (future)** | Hashed at rest, scoped, revocable, rotatable, rate-limited per key; shown once at creation |
| **SSRF** | Any server-side fetch of user-supplied URLs is prohibited by default; if ever required, use allowlists and block internal address ranges |

---

## 26. CORS

### 26.1 Strategy

| Surface | Policy |
|---------|--------|
| **Public pages** | No CORS headers needed (same-origin) |
| **Public read-only API (future/V1.1)** | `Access-Control-Allow-Origin: *` is acceptable **only** if the endpoint is genuinely public, unauthenticated, read-only, non-sensitive and sends no credentials (e.g., release metadata). Never combine wildcard origins with credentials |
| **Internal APIs / Server Actions** | Same-origin only; **no CORS headers** (cross-origin browser access is not intended) |
| **Administrative endpoints** | **No CORS**; same-origin only; additional Origin verification (§15) |
| **Authenticated/private APIs (future)** | Explicit **allowlist of trusted origins**, exact-match (no reflective echo of the request `Origin`, no loose regex such as suffix matches, no `null` origin), credentials allowed only for allowlisted origins |
| **Download/media origin** | CORS only if the site needs cross-origin fetches of media (e.g., a media player or checksum fetch); restrict to the site's origins; plain downloads via link/navigation need no CORS |

### 26.2 Principles

- **CORS is a browser read-permission mechanism. It is not authentication, not authorisation and not CSRF protection.** A non-browser client ignores CORS completely.
- Preflight handling is explicit; allowed methods and headers are minimal; `Vary: Origin` is set where origins vary.
- Trusted origins are configured per environment (production list differs from staging/dev).
- Open CORS must not be added to "make something work" without review.

---

## 27. Error Handling

### 27.1 User-facing vs. diagnostic

| Audience | Gets |
|----------|------|
| **User** | Safe, understandable message, recovery path, optional correlation/reference ID |
| **Developer/operator** | Detailed diagnostics in protected logs/monitoring: stack, route, release version, correlation ID — with secrets and sensitive data redacted |

### 27.2 Production must never reveal

Stack traces; SQL statements or database error text; table/column names; internal file paths; environment details; secret values or partial secrets; authentication internals (whether an account exists, token contents, which factor failed); infrastructure details (internal hostnames, IPs, provider specifics); framework/debug pages; verbose validation internals beyond field-level guidance.

### 27.3 Requirements

| Concern | Requirement |
|---------|------------|
| **Debug modes** | Disabled in production; verbose error pages disabled |
| **Error boundaries and global handlers** | Present at route and application level (document 02) |
| **Fail securely** | If authorisation or a security dependency (rate-limit store, auth service) fails, the privileged operation is denied rather than allowed |
| **Uniform auth responses** | Same message/timing class for "unknown user" vs. "wrong password/code" |
| **Not-found semantics** | `404` for non-existent and for resources the user may not know exist (where disclosure matters); `403` only where it does not leak |
| **Validation errors** | Field-level and helpful but not echoing raw payloads or revealing internal constraints |
| **Source maps** | Not served publicly in production, or uploaded privately to the error-tracking provider instead `[VERIFY]` |
| **Error-tracking hygiene** | Scrub PII, cookies, authorisation headers, request bodies containing form data; sample/limit data sent to third-party trackers |
| **Third-party error responses** | Not passed through to users |
| **Download failures** | Recovery guidance without exposing storage internals |

---

## 28. Logging & Auditing

### 28.1 Security-relevant events

| Event | Logged | Phase |
|-------|:------:|-------|
| Admin sign-in success / failure; MFA challenge outcome | ✔ | V1.1 (admin) |
| Logout; session revocation; refresh-token reuse detection | ✔ | V1.1 |
| Password reset / MFA reset / account recovery | ✔ | V1.1 |
| Admin provisioning, role or permission changes | ✔ | V1.1 |
| Authorisation denials | ✔ | V1.1 |
| Enquiry status changes, deletions, exports | ✔ | V1.1 |
| Content changes (admin-managed) | ✔ | V1.1 |
| **Release/download metadata changes** | ✔ | V1 (via Git history + CI logs); V1.1 (audit table) |
| Release publish/withdraw actions and artifact writes | ✔ | V1 (release workflow logs + storage logs) |
| Security configuration changes (headers, auth settings, RLS) | ✔ | V1 (via Git/migrations/platform audit) |
| Rate-limit triggers; spam/honeypot hits (aggregate) | ✔ | V1 |
| Webhook verification failures | ✔ | As needed |
| Suspicious API activity (bursts, malformed requests) | ✔ | V1 |
| Secret-scanning, dependency-alert and CI security events | ✔ | V1 |
| Platform admin activity (Supabase, hosting, registrar, storage) | ✔ | V1 via provider audit logs `[VERIFY: plan availability]` |

### 28.2 Log content rules

| Always include | Never include |
|----------------|--------------|
| Timestamp, event type, severity, environment, app/release version, correlation ID, actor identifier (internal ID), resource identifier, outcome, coarse source (IP handled per privacy decisions) | **Passwords; access or refresh tokens; session cookies; API keys; secret values or fragments; full authorisation headers; full enquiry messages or other confidential content; full email addresses unless necessary** (prefer IDs or hashed values); payment data (n/a) |

### 28.3 Management requirements

| Concern | Requirement |
|---------|------------|
| **Redaction by design** | A logging helper strips known sensitive fields by key name and pattern; secrets scanning also covers logs |
| **Integrity and access** | Logs readable by a small group; admins cannot edit/delete audit logs via the application; audit table is append-only to the application role |
| **Retention** | Defined per log class (security/audit longer, operational shorter) `[REQUIRES CONFIRMATION]`; limited by plan and privacy minimisation |
| **Time synchronisation** | Consistent UTC timestamps |
| **Alerting** | Alerts on: admin-auth failure bursts, refresh-token reuse, authorisation-denial spikes, unexpected release/artifact writes, secret-scanning hits, error-rate spikes, enquiry-pipeline failures; routed to a named owner `[REQUIRES CONFIRMATION]` |
| **Monitoring is not optional** | Logs nobody reads do not detect incidents; weekly review cadence for V1 `[REQUIRES CONFIRMATION]` |

---

## 29. Admin Security

### 29.1 Posture

The admin area (V1.1 by default) is a **high-value attack surface**. Obscurity (`/admin` is unlinked) is never treated as security.

### 29.2 Requirements

| Domain | Requirement |
|--------|------------|
| **Strong authentication** | §6, §8: managed auth, invite-only, mandatory MFA |
| **Authorisation** | §9: server-side per action; centralised guard; deny by default |
| **Session management** | §7: HttpOnly/Secure/SameSite host-only cookies; short lifetimes; revocation; `no-store` |
| **Rate limiting** | §18 on sign-in, recovery and mutations |
| **Audit logging** | §28 for all admin writes and auth events |
| **Secure forms** | Server-side validation; plain-text rendering of untrusted data; no raw HTML; accessible, clear error handling |
| **CSRF protection** | §15 on every mutation |
| **Security headers** | Strictest CSP (nonce-based), `frame-ancestors 'none'`, `no-referrer`, `no-store`, COOP where compatible; **no third-party scripts, analytics, or chat widgets** on admin pages |
| **Sensitive action confirmation** | §39: confirmations for destructive actions; **step-up re-authentication** for the highest-impact actions |
| **Safe errors** | §27 |
| **Privileged credential protection** | Admin sessions never expose service keys to the browser; privileged operations execute server-side only |
| **Separation** | Admin code in an isolated route group/module with its own layout and guard; public code cannot import admin modules; admin routes are `noindex`, excluded from the sitemap and `robots`-disallowed (note: `robots` is not a security control, merely hygiene) |
| **Environment** | Staging admin uses staging identities and data only; production admin reachable only over HTTPS on the production hostname |
| **Optional hardening (consider by risk)** | IP allowlisting or an identity-aware access layer in front of `/admin` (e.g., platform access-control product) `[REQUIRES CONFIRMATION]`; hostname separation (e.g., an admin subdomain with host-only cookies) |
| **Least privilege inside admin** | Admin modules request the minimum data; list views avoid loading full confidential payloads where unnecessary |
| **Admin data minimisation** | Export features are not built unless required; if built, exports are audited and access-controlled |
| **Offboarding** | Immediate revocation of admin profile, sessions, platform memberships and secrets |
| **Periodic review** | Quarterly (or as defined) review of admin users and platform access `[REQUIRES CONFIRMATION]` |

---

## 30. Content Security

### 30.1 Posture

> **Prefer structured content over unrestricted raw HTML.**

### 30.2 Content sources and risks

| Content | Source (V1) | Source (V1.1+) | Risk |
|---------|-------------|---------------|------|
| Product / service copy, case studies, documentation, FAQ | Repository (MDX/structured data), reviewed via PR | Possibly admin-authored | Injected script, malicious links, defacement via compromised repo or admin |
| Blog / insights | — | Repository or admin | Same |
| Enquiry content | **Public visitors** | Public visitors | **Untrusted by definition**; displayed to admins |

### 30.3 Requirements

| Control | Requirement |
|---------|------------|
| **Structured content** | Content model with defined fields (title, summary, sections, images with alt text, links) rendered by trusted components. Free-form HTML is not a content type |
| **MDX/Markdown** | Rendered via an allowlisted component set; raw HTML in Markdown **disabled** by default; embedded scripts/iframes disallowed; links validated and external links use `rel="noopener noreferrer"` where relevant; images only from allowed origins |
| **If HTML is genuinely required** | Sanitise with a **trusted, maintained sanitiser** configured with an explicit allowlist of tags/attributes/URL schemes; sanitise **on write and on render** (or at a single trusted boundary), test with known payload corpora; strip event handlers, `javascript:` URLs, `style` abuse, `<iframe>`, `<object>`, `<form>` and SVG script |
| **Admin-authored ≠ trusted** | Content entered by an administrator is **not** automatically safe, given the potential for compromised admin accounts and for multiple admins with different trust levels. The same rendering safety applies |
| **Enquiry content** | Always rendered as escaped plain text; never rendered as HTML or Markdown |
| **Embeds** | Third-party embeds (video, social) load only on interaction (facades) and from allowlisted origins in CSP; `sandbox` attributes for iframes |
| **Link integrity** | Outbound links to download/artifact hosts use the controlled release metadata, not free-text URLs in content (prevents "someone edited the download link in a blog post") |
| **Provenance & review** | Content changes reviewed by a second person where practical; Git history is the audit trail (V1) |
| **Images** | Alt text required for informative images; avoid user-supplied SVG; strip metadata where relevant |
| **Defacement resilience** | Branch protection, protected deployments, and monitoring for unexpected content/deploy changes |
| **Claims integrity** | Security/credibility claims (certifications, "signed", metrics) require a source and owner field in the content schema (aligned with the PRD evidence rule) so false security claims cannot be published inadvertently |

---

## 31. Third-Party Services

### 31.1 Principle

Every third party is a potential data recipient, a possible point of failure and a supply-chain risk. **Do not add third-party scripts or services unnecessarily.** Each must be justified, minimal, isolated behind an adapter, and documented.

### 31.2 Assessment matrix

| Integration | Data shared | Credentials | Browser exposure | Server exposure | Failure behaviour | Dependency risk | Privacy implications | Controls |
|------------|-------------|-------------|------------------|-----------------|-------------------|-----------------|----------------------|----------|
| **Hosting platform** | All app traffic and server-side data in transit/processing | Platform tokens, env secrets | Serves site | Runs server code | Outage = site outage; rollback | High (single provider) | Processing location `[REQUIRES CONFIRMATION]` | MFA, least-privilege team roles, audit logs, protected production |
| **Supabase** | Enquiries, admin identities | Server-only keys, auth config | None required (V1) | DB/auth | DB outage: public static pages unaffected; enquiries degrade safely | High | Region, DPA `[REQUIRES CONFIRMATION]` | §22–§23 |
| **Object storage/CDN (downloads/media)** | Public artifacts; access logs (IP addresses) | **Write credentials (release workflow only)** | Direct downloads | None (no app write access) | Download failure guidance | High for integrity | Download IPs in provider logs `[REQUIRES CONFIRMATION]` | §21, §36 |
| **Email provider** | Enquiry notifications (confidential) | API key (server-only) | None | Outbound | Persist first, notify second; retry/alert | Medium | Contains personal data; processor agreement `[REQUIRES CONFIRMATION]` | SPF/DKIM/DMARC, minimal content, key scoping, rate caps |
| **Anti-bot provider** | IP, behavioural signals, tokens | **Secret key (server-only)**, site key (public) | Third-party script on forms only | Verification call | Fail open to degraded checks (§18) | Medium | Tracking/privacy considerations; consent/disclosure `[REQUIRES CONFIRMATION]` | Load only on form routes; CSP allowlist; evaluate privacy-preserving options |
| **OAuth / IdP (Google, etc.)** | Admin identity attributes | Client secret (server-only) | Redirect flow | Token exchange | If IdP down, admin sign-in unavailable (acceptable) | Medium | Admin-only | Exact redirect URIs, state/PKCE, application allowlist |
| **Analytics** | Page views, events, possibly identifiers | Public ID (often) | **Third-party/first-party script** | Optional | Must not break site | Medium | **Highest privacy sensitivity**; consent requirements vary `[REQUIRES CONFIRMATION]` | Prefer privacy-preserving, cookieless, first-party-hosted options; no admin pages; no PII; justified by the PRD success metrics |
| **Error monitoring** | Stack traces, request metadata (risk of PII) | Upload/auth token (CI), DSN (often public) | Optional client SDK | Server SDK | Must not break site | Medium | Scrubbing required | PII scrubbing; no cookies/headers/bodies; sampling |
| **Fonts / media embeds / video platform** | IP and request data to the provider | None | Third-party requests | None | Fallback fonts/poster | Low–medium | Third-party requests leak IP | Self-host fonts (document 02); facades for embeds |
| **Git host / CI** | Source, secrets in CI | Tokens | None | Builds and deploys | Pipeline outage delays deploys | High for integrity | n/a | §33, §34 |
| **Domain registrar / DNS** | Domain control | Account credentials | None | None | Outage = site/email outage | Critical | n/a | MFA, lock, limited access |
| **Payment systems (future)** | Payment data | Provider keys | Provider-hosted fields | Webhooks | n/a | High | PCI scope | **Out of scope; requires a dedicated security review before introduction** |

### 31.3 Rules

1. **Adapters:** third-party calls go through `server/integrations` with timeouts, retries and error isolation, so provider failures do not break core pages.
2. **Browser scripts:** third-party scripts are loaded only where needed, from CSP-allowlisted origins, with Subresource Integrity where the provider supports stable versioned files, and **never on admin pages**.
3. **Data minimisation:** share the minimum data with each provider.
4. **Contracts and privacy:** processor/DPA review for providers handling personal data `[REQUIRES CONFIRMATION]`.
5. **Inventory:** maintain a living list of third parties, data shared, owners and credentials.
6. **Vendor offboarding:** a documented process to revoke credentials and remove integrations.
7. **Webhooks:** signature verification and replay protection.

---

## 32. Dependency Security

| Control | Requirement |
|---------|------------|
| **Single package manager, committed lockfile** | CI installs from the lockfile with a frozen install; lockfile changes reviewed |
| **Pin tooling versions** | Node.js and package manager versions pinned |
| **Regular updates** | Automated update PRs on a regular cadence; framework/major upgrades planned, tested and not auto-merged |
| **Vulnerability scanning** | Automated audit in CI on every PR and on a schedule against the lockfile; results triaged |
| **Severity-based response** | Prioritise by **actual risk** (reachable code path, exposure, exploit availability), not raw score: critical/exploited issues affecting production — immediate (target within days; exact targets `[REQUIRES CONFIRMATION]`); high — planned within a short window; medium/low — batch with normal updates. Document accepted risks and their expiry |
| **Review of new packages** | Per document 02: justification, maintenance health, licence, transitive footprint, install scripts, ownership changes |
| **Avoid abandoned/unknown packages** | No unmaintained or single-anonymous-maintainer packages on critical paths (auth, crypto, parsing, sanitisation) |
| **Remove unused dependencies** | Periodic detection and removal |
| **Supply-chain hygiene** | Prefer packages with provenance/attestations where available; restrict or review lifecycle/install scripts; do not pull from unvetted registries or Git URLs; beware typosquatting; consider delayed adoption of brand-new releases of critical packages (cooldown) `[REQUIRES CONFIRMATION]` |
| **Do not vendor secrets via dependencies** | Build-time plugins and CI actions are pinned (commit SHA for third-party CI actions) |
| **Monitoring** | Security advisory subscriptions/alerts for the framework and critical libraries (framework, auth client, sanitiser, MDX pipeline, image libraries) |
| **SBOM** | Generated at build time for traceability (Future/V1.1) |
| **Container/runtime base images** | Not applicable on the managed host; if self-hosted later, scan and pin images |

---

## 33. Source Code Security

| Control | Requirement |
|---------|------------|
| **Account security** | MFA required for every repository member; no shared accounts; SSH/commit-signing keys protected; access reviewed |
| **Branch protection** | Protect `main`: no direct pushes, no force-pushes, no deletion; require PRs, passing checks, and at least one reviewer; restrict who can merge; stale approvals dismissed on new commits |
| **Pull-request review** | Security-sensitive paths (`server/auth`, `server/repositories`, migrations, headers/CSP configuration, `content/releases`, CI workflows, dependency manifests) require review by a designated reviewer (CODEOWNERS) |
| **Signed commits** | Recommended (`[REQUIRES CONFIRMATION]`), especially for release-affecting changes |
| **Secret scanning** | Enabled on the repository host (including push protection where available) **and** in CI **and** optionally pre-commit; custom patterns for HENU-specific key formats |
| **Dependency scanning** | §32 |
| **Static analysis** | Lint rules for dangerous patterns (raw HTML injection, `eval`, unsafe URL assignment, direct DB access outside repositories, public-prefix misuse); a code-scanning tool (e.g., a semantic analysis scanner) in CI where practical |
| **Environment separation** | No production secrets in the repository or developer workstations; per-environment configuration |
| **No secrets in commits** | Includes `.env` files, keys in tests/fixtures, tokens in scripts, screenshots with secrets, config files |
| **`.gitignore` hygiene** | Environment files, local databases and key material are ignored; template files committed |
| **Forks and external contributions** | If the repository becomes public/open source, CI for forked PRs runs **without secrets**; review process strengthened `[REQUIRES CONFIRMATION: open-source status]` |
| **Repository visibility** | Private by default; making anything public requires a secret/history review |
| **CI/CD credentials** | §34 |
| **Protected production deployment** | §34 |
| **Offboarding** | Immediate access removal |

### 33.1 If a secret is accidentally committed

> **Removing it from the file is not sufficient.** It remains in Git history, forks, clones, CI caches, pull-request diffs and possibly scraping bots' archives. **The secret must be considered compromised and rotated.**

Procedure: (1) **revoke/rotate immediately** at the issuing provider; (2) review provider usage logs for abuse; (3) remove from the working tree and, as hygiene, from history (history rewriting is optional and does **not** replace rotation); (4) notify the owner and record the incident; (5) add or tighten scanning rules to prevent recurrence.

---

## 34. CI/CD Security

| Control | Requirement |
|---------|------------|
| **Protected branches/environments** | Production deployment only from protected `main`/approved builds; production environment requires **manual approval** (V1) from authorised people |
| **Trusted build environments** | Use the CI provider's hosted runners; self-hosted runners avoided in V1; if used, hardened and ephemeral |
| **Secret isolation** | Secrets scoped **per environment**; production secrets unavailable to PR builds, forked PRs and non-protected branches; build logs masked and checked for leakage |
| **Minimal CI permissions** | Tokens issued with least privilege and short lifetimes; **workflow default permissions read-only**; elevated permissions granted per job; prefer **OIDC-based, short-lived cloud credentials** over long-lived keys `[VERIFY: provider support]` |
| **Third-party actions/plugins** | Pinned to immutable versions (commit SHA); reviewed; limited to necessary ones; restrict allowed actions where the platform supports it |
| **Pipeline-as-code review** | Changes to workflow definitions require review by a designated owner (they can exfiltrate secrets) |
| **Dependency scanning & static analysis** | Gated in CI (§32, §33) |
| **Build verification** | Type check, lint, tests, content/schema validation, build, **bundle secret scan**, header/config checks |
| **Reproducibility** | Frozen lockfile installs; pinned toolchain |
| **Preview environments** | Use staging-class credentials and non-production data; access-restricted and `noindex`; do not expose secrets to untrusted PR code |
| **Production deployment authorisation** | Manual approval gate in V1; deployments attributed to a person/identity |
| **Database migrations** | Run through a controlled step with a **migration-scoped credential**; reviewed; backup verified before destructive migrations |
| **Release artifact pipeline** | Separate workflow with scoped storage-write identity, restricted to protected tags/branches and a protected environment; produces checksums; verifies upload; records provenance; separate from website deployment (§21) |
| **Audit trail** | CI/deployment logs retained; who approved what, when |
| **Rollback** | Fast, tested rollback to the previous known-good deployment (document 02); rollback procedure rehearsed before launch |
| **Supply-chain monitoring** | Alerts for changes in CI actions/dependencies used in privileged jobs |
| **Hosting-platform tokens** | Stored in CI secrets; scoped to the project; rotated on personnel change |

---

## 35. Backup & Recovery

### 35.1 Scope of recoverable assets

| Asset | Primary protection | Recovery source |
|-------|--------------------|-----------------|
| **PostgreSQL (enquiries; V1.1 admin, releases, audit)** | Managed backups; point-in-time recovery if the plan supports it `[VERIFY / REQUIRES CONFIRMATION: plan, retention, PITR]` | Provider restore; optional independent periodic export held securely |
| **Source code, content, release metadata (V1)** | Git with branch protection and a second remote/mirror copy `[REQUIRES CONFIRMATION]` | Repository clone/mirror |
| **Release artifacts** | Object versioning/retention; **a second copy** in a separate account/provider or offline media | Secondary copy; rebuild from tagged source where reproducible |
| **Release signing keys (future)** | Offline backups with documented custody and recovery | Key escrow procedure |
| **Configuration and infrastructure settings** | Documented in the repository (headers, auth settings, DNS records, bucket policies) | Rebuild from documentation/migrations |
| **Secrets** | Held in the platform/CI secret stores; a recoverable inventory of **which** secrets exist and where used (not their values); regenerate rather than restore | Rotate/recreate |
| **DNS records** | Exported/documented | Re-create at DNS provider |
| **Media and large assets** | Source masters retained by the owners; object storage versioning | Source masters |

### 35.2 Requirements

| Requirement | Detail |
|-------------|--------|
| **Test restores** | A backup that has never been restored is **not** a proven recovery strategy. A restore test into an isolated environment occurs **before launch** and on a recurring schedule `[REQUIRES CONFIRMATION: cadence]` |
| **Backup security** | Backups carry the same confidentiality as production data; encrypted; access limited; restored copies are not left in lower-trust environments; never restore production data into dev/staging without anonymisation |
| **Retention** | Defined and aligned with privacy retention (deleted data eventually ages out of backups) `[REQUIRES CONFIRMATION]` |
| **Recovery procedures** | Written runbooks for: database restore, application rollback, DNS recovery, artifact restoration, secret rotation, and re-provisioning a project |
| **Ownership** | Named owner for backup monitoring; alerts on backup failure |
| **Release metadata recovery** | In V1, Git history is the metadata backup; in V1.1 (DB-backed), exports to Git/storage on publish make metadata reconstructable |

### 35.3 Recovery objectives

| Objective | Value |
|-----------|-------|
| **RPO (acceptable data loss) for enquiries** | `[REQUIRES CONFIRMATION]` — depends on business tolerance and plan capability. No value is assumed here |
| **RTO (acceptable downtime) for the public site** | `[REQUIRES CONFIRMATION]` — static-first architecture means public pages are largely independent of the database, so recovery of database features need not block the site |
| **RTO for admin/enquiry review** | `[REQUIRES CONFIRMATION]` |
| **RPO/RTO for release artifacts** | `[REQUIRES CONFIRMATION]` |

Targets are set **after** the business confirms its tolerance; they then drive plan selection (backup frequency, PITR) rather than the reverse.

---

## 36. Availability & DoS Considerations

### 36.1 Approach

Rely on **architecture and managed protections** rather than bespoke DDoS infrastructure. The site is static-first with CDN-served assets, which is inherently resilient to ordinary traffic spikes and abuse. A complex DDoS architecture is **not** justified without an actual risk or requirement `[REQUIRES CONFIRMATION]`.

### 36.2 Controls

| Area | Control |
|------|--------|
| **CDN and caching** | Static HTML and assets cached at the edge; downloads on a CDN-fronted origin; long cache TTLs for immutable artifacts |
| **Platform protections** | Use the hosting/CDN's built-in DDoS mitigation and basic WAF/firewall rules `[VERIFY: plan features]`; managed bot-protection features if available |
| **Application rate limiting** | §18 for sensitive endpoints |
| **Request limits** | Maximum request body size, header size, URL length; timeouts on server operations and outbound calls |
| **Dynamic-path protection** | Few dynamic endpoints exist (enquiry, admin); they are rate-limited and cheap to reject; **expensive work is never unauthenticated** |
| **Form abuse** | §19; email send caps; queue/backpressure on notifications |
| **Download abuse** | CDN-level rate/bandwidth controls, hotlink restrictions, cache offloading, spend/bandwidth alerts and caps/budgets configured **before launch**; consider requiring no cookies (cacheability); mirror/torrent distribution as a future cost/resilience measure |
| **Cost-based DoS ("denial of wallet")** | Usage-based hosting/CDN/storage can be driven up by abuse: set budget alerts and hard limits where available; keep large files off the application host (document 02) |
| **Database protection** | Public traffic does not hit the database for page views; intake endpoint is rate-limited; connection limits; avoid unbounded queries in admin |
| **Graceful degradation** | If the database or an integration fails, public content remains available; forms show a safe fallback and alternate contact method; download page shows safe states (document 02) |
| **Dependency availability** | Third-party outages must not take down core pages (adapters, timeouts, no blocking third-party scripts) |
| **Monitoring** | Uptime checks, traffic/bandwidth anomalies, error-rate alerts |
| **Incident levers** | Ability to enable stricter CDN rules, temporarily disable the enquiry form (with fallback contact), or pause downloads (serve status page) |
| **Capacity planning** | No traffic assumptions are made `[REQUIRES CONFIRMATION]`; revisit after launch data |

---

## 37. Privacy & Data Minimization

> This section defines technical and process principles. It is **not legal advice**, and HENU is **not** asserted to be compliant with any privacy regulation. A qualified legal review determines HENU's obligations `[REQUIRES CONFIRMATION]`.

### 37.1 Principles

1. **Collect only what is needed**, each field with a stated purpose.
2. **Store only what is needed**, for only as long as needed.
3. **Restrict access** to those who need it.
4. **Be transparent**: a privacy policy that accurately describes real behaviour.
5. **Avoid unnecessary tracking.**

### 37.2 Enquiry form data justification (V1)

| Field | Purpose | Required? | Notes |
|-------|---------|:--------:|-------|
| Name | Address the person | Yes | |
| Email | Reply | Yes | Primary identifier; validated |
| Message / description | Understand the request | Yes | Length-limited; may contain anything the user writes (treat as confidential) |
| Enquiry type | Route to the correct owner | Yes (selected/inferred) | Closed set |
| Organisation | Business context | Optional | Marked optional |
| Service interest | Route project enquiries | Optional | Slug from content |
| Phone | Alternate contact | **Not collected by default** | Add only if the business process requires it |
| Source page | Context of the enquiry | System | Non-personal |
| Privacy-notice acknowledgement timestamp | Evidence of notice | System | Wording from legal review |
| IP address / user agent | Abuse prevention | **Not stored by default**; used transiently for rate limiting; if stored for spam analysis, store minimal/hashed with short retention | `[REQUIRES CONFIRMATION]` |

Do not request fields "just in case" (budget, address, ID numbers, etc.) unless there is a defined purpose.

### 37.3 Requirements

| Concern | Requirement |
|---------|------------|
| **Retention** | Define retention per class `[REQUIRES CONFIRMATION]`: e.g., spam purged quickly; resolved enquiries retained for a defined business period then deleted/anonymised; backups age out per policy |
| **Deletion and correction** | A manual process exists to locate and delete/correct an individual's enquiry records on request `[REQUIRES CONFIRMATION: legal basis]` |
| **Access** | Enquiries are visible only to named operators; dashboard/admin access audited (V1.1) |
| **Third-party sharing** | Minimise; documented processors (§31) |
| **Analytics** | Prefer privacy-preserving, cookieless analytics without personal identifiers; avoid fingerprinting; collect only what the PRD success metrics require; **consent mechanisms (cookie banners) are required only if technologies and jurisdictions demand it** `[REQUIRES CONFIRMATION]` |
| **Cookies** | The public site sets no non-essential cookies by default (no accounts); the only cookies are essential (admin session, anti-abuse if used) |
| **Logs** | Avoid personal data (§28); short retention for IP-bearing logs |
| **Email notifications** | Minimal content (§5.3) |
| **International transfers** | Hosting/Supabase/email regions known and documented `[REQUIRES CONFIRMATION]` |
| **Legal documentation before production** | Privacy Policy and Terms (PRD: V1) **must be reviewed and published before** the site collects personal data in production; they must match real data flows |
| **Children** | The site is not directed at children; no collection of data known to be from children `[REQUIRES CONFIRMATION]` |
| **Breach handling** | Incident procedure (§42) includes assessing whether personal-data notification obligations apply `[REQUIRES CONFIRMATION: legal]` |
| **Do not claim compliance** | No page, document or sales material states or implies GDPR/ISO/SOC 2/other compliance or certification unless it has genuinely been established and is owned by someone accountable |

---

## 38. Form Security

### 38.1 Pipeline

```text
Browser
  ↓  (user input; honeypot + timing token present)
Client UX validation              ← usability only, never trusted
  ↓  HTTPS
Origin check + request size limit
  ↓
Rate limiting (edge + app, shared store)
  ↓
Spam protection (honeypot, timing, heuristics; adaptive challenge if risky)
  ↓
Server schema validation + normalisation
  ↓
Business validation (service layer)
  ↓
Persist to PostgreSQL (restricted insert-only path, parameterised)
  ↓
Notification (templated, escaped, header-safe)  ← failure isolated from persistence
  ↓
Safe, generic response to the user
```

### 38.2 Requirements

| Threat | Control |
|--------|--------|
| **Raw unvalidated data reaching email/database** | Nothing from the form reaches the database or email layer before server validation; no field is interpolated into templates without escaping |
| **Email header injection** | Reject or strip CR/LF and control characters in any value that could reach an email header (subject, `Reply-To`, name display fields); use the email provider's structured API (separate fields) rather than hand-built MIME; **do not set the visitor's address as the `From`** — set a fixed, authenticated sender and use `Reply-To` carefully |
| **HTML injection in notifications** | Use plain-text email bodies where possible; if HTML is used, HTML-escape every user-supplied value; do not render Markdown from visitors |
| **Malicious URLs** | Do not auto-link URLs in notifications or admin views; if links are displayed, validate scheme (`https`/`http`), show the real destination and `rel="noopener noreferrer nofollow"`; consider flagging submissions with many links as spam |
| **Excessive payloads** | Field length limits, total body size cap, reject unexpected fields; limit number of submissions per window |
| **Spam** | §19 |
| **Duplicate submissions** | Idempotency token/hash + short-window deduplication; UI disables the button after submit and handles double-click/retry |
| **Open relay / abuse of notification** | Notifications go **only** to HENU's configured internal recipients, never to an address supplied by the visitor |
| **Auto-reply abuse** | If an auto-acknowledgement to the visitor is sent, it must be rate-limited and must not include the visitor's raw message (prevents the form being used to send arbitrary content to third parties) `[REQUIRES CONFIRMATION]` |
| **CSRF/Origin** | §15 |
| **Information disclosure** | Success/failure responses are generic; no echo of other users' data; no enumeration of existing enquiries |
| **Failure behaviour** | Persist first; notification failure does not lose the enquiry; user sees a safe message and an alternative contact path (document 02 error-handling matrix) |
| **Accessibility of security controls** | Honeypot hidden from assistive technology; challenge (if used) has accessible alternatives; errors are announced |
| **Privacy** | Consent/notice text near the submit control per legal review; no pre-ticked marketing opt-ins `[REQUIRES CONFIRMATION]` |
| **Admin viewing** | Enquiry content rendered as escaped plain text under the strict admin CSP (§14) |

---

## 39. Admin Action Security

### 39.1 High-impact actions

| Action | Risk | Phase |
|--------|------|-------|
| **Publish / withdraw a release** | Distribution of tampered software; user harm | V1.1 (if DB-managed); V1 equivalent: protected PR + release workflow approval |
| **Change an artifact URL, checksum or metadata** | Redirects users to malicious files | V1.1 / V1 PR |
| **Delete enquiries / content / projects** | Data loss | V1.1 |
| **Change administrator access, roles, MFA** | Privilege escalation, account takeover | V1.1 |
| **Modify critical site configuration (redirects, headers, domains, integrations)** | Site compromise, phishing redirects | V1 via code review; V1.1 if admin-managed |
| **Bulk operations / exports of enquiries** | Mass disclosure | Not built unless required |
| **Change authentication settings or secrets** | Security regression | Operator process outside the site |

### 39.2 Controls by tier

| Tier | Examples | Controls |
|------|---------|---------|
| **Standard** | Update enquiry status | Authorisation, CSRF protection, audit log |
| **Sensitive** | Delete content, edit project/product content in DB | + explicit confirmation step; **soft-delete** with recovery window; audit with before/after summary |
| **Critical** | Publish/withdraw release, change artifact URL/checksum, change admin access | + **step-up re-authentication** (recent MFA/re-sign-in within a short window, verified server-side against the auth service); + audit log; + notification to other admins; + (future) **two-person approval** `[REQUIRES CONFIRMATION]`; + automatic cache revalidation recorded |

### 39.3 Requirements

1. **Server-side authorisation and re-verification** at the time of action, not at page load.
2. **Re-authentication (step-up)** for critical actions, enforced server-side (a client-claimed "recently authenticated" flag is not trusted).
3. **Audit log** entries are written for every sensitive/critical action, including actor, time, target, before/after summary (not secrets), and outcome; logs are append-only to the application role.
4. **Soft delete and recovery** by default: deleted records are marked and retained for a recovery period before permanent purge `[REQUIRES CONFIRMATION]`; avoid irreversible destructive operations unless genuinely required (and then with explicit confirmation and verified backup).
5. **No wildcard/destructive bulk endpoints** (e.g., "delete all") without strong confirmation; none in V1.
6. **Confirmation dialogs are used sparingly** (security vs usability, §43) — only for sensitive/critical actions, with clear consequence statements.
7. **Release actions** cannot alter published artifact bytes or checksums in place; they create/withdraw releases (immutability, §21).
8. **Notification of critical changes** to other admins by email.
9. **Rate limits** on mutations (§18).
10. **Idempotency** for publish actions to avoid duplicate publication.

---

## 40. Security Testing

### 40.1 Strategy by stage

| Stage | Activities | Notes |
|-------|-----------|-------|
| **Development** | Unit tests for validation schemas (boundary, malformed, oversized, injection-style inputs); authorisation tests for every admin entry point (positive and negative); authentication tests (session handling, MFA assurance enforcement); import-boundary and lint rules; local dependency audit; review checklist in pull requests | Tests accompany features; security-relevant PRs are labelled |
| **CI/CD** | **Secret scanning**; **dependency vulnerability scanning**; **static analysis** (lint rules for unsafe patterns; code-scanning tool where practical); bundle secret-leak check; header/config checks on preview; content/schema validation; accessibility checks (also reduce hidden-control issues) | Fail the build per severity policy |
| **Pre-production (staging/pre-launch)** | **Authentication testing** (sign-in, MFA, recovery, invite-only, disabled sign-up); **authorisation testing** (role/permission matrix, IDOR attempts); **API testing** (all Server Actions/Route Handlers: method, content-type, size, unknown fields); **XSS testing** (stored/reflected/DOM, including admin viewer); **CSRF testing** (forged cross-origin requests); **injection testing** (SQL/NoSQL/header/command-style payloads); **rate-limit testing** (admin sign-in, forms) with realistic multi-instance conditions; **Supabase configuration review** (RLS, grants, exposed schemas, bucket policies); **headers/TLS checks**; **dynamic scanning** of staging with a baseline DAST scan; **release-integrity test** (tamper detection, checksum mismatch alerting) | A focused manual review by a security-capable engineer **before launch** |
| **Production** | Monitoring and alerting (§28); dependency alerts and scheduled scans; scheduled integrity checks of artifacts; periodic configuration review; uptime/certificate monitoring; periodic review of access (admins, platform members); post-incident test additions | Responsible-disclosure channel (security contact/`security.txt`) published `[REQUIRES CONFIRMATION]` |

### 40.2 Proportionality

- **Penetration test:** not required for every minor release. Recommended **once before or shortly after launch of the admin area / public software distribution**, and after major architectural changes (auth model, new portals, new public APIs), if budget allows `[REQUIRES CONFIRMATION]`.
- Prefer many cheap automated checks continuously over a single expensive test.
- Use only authorised targets; never test against production data or third-party systems without permission.
- Findings are tracked with severity, owner and due date; accepted risks are documented with an expiry.

---

## 41. Security Test Cases

Expected results define pass conditions. "Denied" means the operation does not execute **and** no sensitive information is disclosed.

| # | Scenario | Expected result |
|---|----------|----------------|
| 1 | **Unauthenticated user** requests an admin page | Redirected to sign-in or denied; no admin data/markup disclosed; `no-store` |
| 2 | **Unauthenticated user** calls an admin Server Action/Route Handler directly (crafted HTTP request) | Denied (401/403 equivalent); no side effects |
| 3 | **Authenticated user without admin allowlist record** (valid IdP account that isn't an admin) attempts admin access | Denied; event logged |
| 4 | **Authenticated user attempts an unauthorised action** (or, post-RBAC, a Viewer attempts to update) | Denied server-side regardless of UI; audit/denial log entry |
| 5 | **Expired session / expired access token** attempts a privileged action | Denied; session refresh only via valid refresh token; otherwise re-authentication |
| 6 | **Revoked/signed-out session** replays an old cookie | Denied after access-token expiry or live check; for critical actions, denied immediately (live verification) |
| 7 | **Single-factor session** attempts admin operation when MFA is mandatory | Denied; MFA required |
| 8 | **Malicious input in contact form** (oversized fields, control characters, Unicode tricks, unexpected fields) | Rejected/normalised with safe field errors; nothing stored beyond allowed fields |
| 9 | **SQL injection payloads** in every text field, slug and query parameter | No error leakage; treated as data; no query manipulation; consistent behaviour |
| 10 | **XSS payloads** (script tags, event handlers, `javascript:` URLs, SVG, HTML entities) submitted via form and viewed in admin | Rendered inert as text; no script execution; CSP violation reports (if any) examined |
| 11 | **Reflected XSS** via URL path/query parameters and 404 page | Not reflected unescaped; no execution |
| 12 | **Email header injection** (`\r\n`, `Bcc:` in name/email/subject-bound fields) | Rejected/sanitised; no extra headers or recipients in the sent email |
| 13 | **CSRF attempt**: forged cross-origin POST to admin mutation and to logout | Rejected via Origin/SameSite/token; no state change |
| 14 | **Excessive login attempts** (single account; many accounts from one IP; distributed) | Rate-limited/backed-off; generic errors; alerts raised; legitimate user can recover later |
| 15 | **Account enumeration** via sign-in, reset and invite flows | Uniform responses and similar timing |
| 16 | **Excessive contact form submissions** (burst; sustained; many IPs) | Rate-limited; spam flagged; email cap holds; legitimate submission still possible under normal use |
| 17 | **Honeypot / too-fast submission** | Classified as spam; no notification email sent |
| 18 | **Oversized request** (large body, deep JSON, huge headers) | Rejected early (413/400); no resource exhaustion |
| 19 | **Unauthorised file upload attempt** (any upload endpoint probe in V1) | No upload endpoint exists in V1; requests to guessed endpoints return 404/405; if uploads exist later: type, size, content and authorisation checks enforced |
| 20 | **Path traversal** (`../`, encoded variants, null bytes) in slugs, doc paths, file parameters | Rejected/404; no file system or object-store access outside allowed scope |
| 21 | **Unauthorised release modification**: attempt to change artifact URL/checksum via direct request, direct DB write by public role, or unreviewed commit | Denied; CI/branch protection blocks unreviewed metadata change; RLS/grants block DB write; alert generated |
| 22 | **Attempt to overwrite a published artifact** | Storage immutability/versioning prevents or records; website runtime has no write credentials |
| 23 | **Checksum mismatch** (tampered artifact vs. metadata) | Integrity monitor alerts; build/publish check fails |
| 24 | **Attempt to expose service-role credentials**: search client bundles, source maps, HTML, API responses, logs and error messages for secret patterns/known values; attempt to import server modules in a client component | None found; client import fails the build; secrets scanning clean |
| 25 | **Public/anon access to Supabase Data API** with the public key (if present): read/write all tables and storage | Denied for all application tables (RLS/grants); no data returned |
| 26 | **Insert into enquiries bypassing the server path** via Data API | Denied |
| 27 | **Access another user's private information** (post-portal: Client A accesses Client B's resource by changing IDs) | Denied; ownership checks + RLS; no existence leakage — **mandatory test before any Client role launches** |
| 28 | **Tamper with a public API response/params** (V1.1 releases endpoint): unsupported methods, parameters, content types | `405`/`400`; minimal fields returned; no internals |
| 29 | **CORS probing** from an untrusted origin on admin/private endpoints | No permissive CORS headers; browser cannot read responses cross-origin |
| 30 | **Open redirect** attempts via `next`/`redirect` parameters | Only allowlisted internal destinations accepted |
| 31 | **Clickjacking**: frame the site and admin in a hostile page | Framing blocked (`frame-ancestors`) |
| 32 | **Downgrade attempt**: request over HTTP; mixed content | Redirect to HTTPS; HSTS present; no mixed content |
| 33 | **Cache exposure**: authenticated admin response retrieved via shared cache or back button after logout | `no-store`; sensitive content not retrievable after logout |
| 34 | **Session fixation / cookie scope**: verify cookie attributes; check that session cookie is not sent to the download origin or other subdomains | HttpOnly, Secure, SameSite set; host-only; not sent to sibling hostnames |
| 35 | **Staging indexing / environment leakage**: crawl staging; check robots/noindex; verify no production secrets/data in staging | Staging not indexable; isolated data and secrets |
| 36 | **Dependency with known vulnerability** introduced in PR | CI fails per severity policy |
| 37 | **Secret committed in PR** (test token pattern) | Push protection/CI scan blocks; rotation procedure triggered in drill |
| 38 | **Third-party webhook with invalid signature/replayed timestamp** | Rejected; logged |
| 39 | **Backup restore drill** | Database restored to an isolated environment; data integrity verified; time recorded |
| 40 | **Disabled/unavailable dependency (rate-limit store, anti-bot provider, email)** | Defined fail-open/closed behaviour observed (§18); no data loss; alert raised |

---

## 42. Incident Response

### 42.1 Realism statement

HENU may not have a dedicated security team or 24/7 on-call. This procedure assumes a **small team with named roles** and aims to be executable by them. It is not an enterprise incident-response programme. Roles `[REQUIRES CONFIRMATION]`:

| Role | Responsibility |
|------|---------------|
| **Incident lead** | Coordinates, decides containment, keeps a timeline |
| **Technical responder(s)** | Investigate and fix |
| **Communications owner** | Internal/external messaging |
| **Executive/business owner** | Decisions on disclosure, legal and customer impact |
| **Legal/privacy advisor (external if none)** | Notification obligations `[REQUIRES CONFIRMATION]` |

### 42.2 Standard phases

1. **Detect** — alert, report (including via the disclosure contact), or discovery. Record the time and source.
2. **Contain** — stop the bleeding: disable affected accounts/sessions, block abuse, pause the affected feature (e.g., disable the form, pause downloads/withdraw release), restrict access, isolate the affected environment.
3. **Revoke / rotate credentials** — rotate anything potentially exposed (keys, tokens, passwords); revoke sessions.
4. **Investigate** — scope: what, when, how, which data/systems, whether still active; preserve evidence (logs, snapshots) before cleaning up.
5. **Recover** — restore from known-good state (rollback, backup, rebuilt artifacts), verify integrity, re-enable features gradually.
6. **Patch** — fix the root cause; add tests/controls; update dependencies/configuration.
7. **Review** — blameless post-incident review within a short time frame `[REQUIRES CONFIRMATION]`; update this document, runbooks and tests.
8. **Document** — timeline, impact, decisions, actions, lessons; retain securely.

Throughout: **communicate** appropriately (internal first; external when facts are verified), and **assess legal notification duties** for personal-data impact `[REQUIRES CONFIRMATION]`.

### 42.3 Scenario playbooks (first actions)

| Scenario | Containment | Credential action | Investigation focus | Recovery / follow-up |
|----------|-------------|-------------------|--------------------|----------------------|
| **Admin account compromised** | Revoke all sessions; disable the account; reset MFA/credentials through verified out-of-band process; temporarily restrict admin access | Rotate the account's credentials; review any secrets it could view; rotate integration keys if exposed | Audit log: what the account did; new sessions/devices; what data was viewed/changed; how it was compromised (phishing, reuse, malware) | Restore altered content/releases from history; notify affected parties if data exposed; tighten MFA (phishing-resistant factors), review allowlist |
| **API key leaked** (e.g., email provider, anti-bot, monitoring) | Revoke key at the provider immediately | Issue new key; update secret stores; redeploy | Provider usage logs for abuse; how leaked (repo, logs, bundle, chat) | Add scanning rule; clean source; check email reputation/spam; review related accounts |
| **Database credentials exposed** (including service-role key) | **Rotate immediately**; temporarily restrict network/API access if possible; consider pausing writes | Rotate DB passwords, service keys, and any dependent secrets; invalidate sessions if JWT secret exposed `[VERIFY]` | DB/auth/API logs for unauthorised access; data accessed or altered; RLS bypass use | Restore from backup if integrity is questionable; assess personal-data notification; review all places the key was used |
| **Malicious content published** (defacement, injected script/link) | Revert to last known-good deployment/content; disable the editing path if admin-originated; invalidate sessions if admin compromised | Rotate repository/admin credentials as warranted | Source: compromised account, malicious dependency, or CI; scope across pages | Purge CDN caches; scan for injected content; notify visitors if they may have been exposed; strengthen branch protection/content review |
| **Vulnerable dependency discovered** | Assess exposure/reachability; apply mitigations (config, WAF rule, disable feature) if a patch isn't immediately available | Rotate secrets if exploitation may have exposed them (e.g., build-time package compromise) | Whether exploited; production and CI exposure | Patch/pin/remove; rebuild and redeploy; add detection; document |
| **Release artifact compromised (or suspected)** | **Withdraw the release immediately**; replace download links with a notice; freeze publishing; preserve the suspect artifact for analysis | Rotate storage write credentials, CI tokens; rotate and (if signing exists) assess signing-key exposure | Compare artifact with a trusted rebuild; storage/CDN access logs; CI logs; metadata history; who/what wrote the object; how many downloads occurred (from CDN logs) | Publish a corrected release with new version; **public security advisory** with verification instructions and affected versions; notify users through available channels; post-incident hardening (signing, immutability, approvals) |
| **Database data accessed improperly** | Contain the access path (disable endpoint/account/key); preserve logs | Rotate relevant credentials | Which records, which actor, time window, whether exfiltration occurred | Notify affected individuals/regulators **if legally required** `[REQUIRES CONFIRMATION]`; fix RLS/grants/authorisation; add tests |
| **Spam/abuse flood** | Tighten rate limits/challenge; temporarily disable the form with a fallback contact method | n/a | Attack pattern, source | Update rules; purge spam; check email reputation |
| **Domain/DNS compromise** | Contact registrar immediately; lock account; revert DNS | Rotate registrar/DNS credentials and MFA | DNS change history; email security (MFA bypass vector) | Verify certificates; notify users if traffic was redirected; consider DNSSEC and registry lock |

### 42.4 Preparation (V1 minimum)

- Maintain an **incident contact list** and a documented **escalation path**.
- Maintain a **secrets and access inventory** (what exists, where used, who can rotate).
- Pre-write the **release-withdrawal procedure** and a **security-advisory template**.
- Publish a **security contact** / responsible-disclosure page (V1.1; V1 if software is publicly distributed) `[REQUIRES CONFIRMATION]`.
- Rehearse a **secret rotation** and a **rollback** before launch.
- Ensure logs are retained long enough to investigate (§28).

---

## 43. Security vs Usability

Security controls must be **proportional** to risk and must not damage the core HENU experience.

### 43.1 Principles

| Do not | Instead |
|--------|---------|
| Add CAPTCHA everywhere | Use layered invisible checks; challenge only on risk signals (§19) |
| Require accounts for public information | Public content and downloads require no login |
| Require login (or email) to download public software | Direct download with integrity information; any optional notification sign-up is separate |
| Add excessive confirmation dialogs | Confirm only sensitive/critical admin actions (§39) |
| Block legitimate users unnecessarily | Calibrate rate limits with real data; provide recovery paths; avoid permanent lockouts |
| Force frequent password rotation or arbitrary complexity rules | Length-based policy, MFA, breach checks |
| Break accessibility for security (inaccessible CAPTCHAs, hidden honeypots exposed to screen readers) | Accessible implementations and alternatives |
| Slow the site with heavy security tooling in the request path | Edge-level protections; static-first; asynchronous checks |
| Hide basic information behind forms ("gating") for security reasons | Gate only where there is a business reason, not a security one |
| Over-restrict CSP in ways that break features | Report-Only first; staged enforcement |

### 43.2 Where friction is justified

Admin sign-in (MFA), critical admin actions (step-up), and abuse detection on forms **under suspicion**. These affect staff or suspicious traffic, not the general public.

---

## 44. V1 Security Requirements

> **Applicability note:** If the custom admin UI ships in V1.1 (default in document 02), the *admin-specific* mandatory controls apply to the **V1 operator surface** (Supabase dashboard, hosting, CI, registrar, email, storage accounts) at launch and to the admin application as soon as it is released. If the admin UI is required at launch `[REQUIRES CONFIRMATION]`, all admin controls become V1-mandatory unchanged.

### 44.1 Mandatory for V1

| # | Requirement | Section |
|---|-------------|---------|
| 1 | HTTPS-only on all hostnames; HTTP→HTTPS redirect; HSTS (staged); managed certificates with expiry monitoring | §17 |
| 2 | Managed authentication (Supabase Auth) for all privileged access; **no custom auth/JWT**; public sign-up disabled; **mandatory MFA** for admin/operator accounts | §6, §8 |
| 3 | **Server-side authorisation** on every privileged operation; deny-by-default | §9 |
| 4 | Secure session cookies (HttpOnly, Secure, SameSite, host-only); tokens never in browser storage | §7 |
| 5 | **Server-side input validation** for all inputs; length/size limits; closed enums | §12 |
| 6 | **SQL injection protection** (parameterised access; centralised repositories) | §13 |
| 7 | **XSS protection** (escaped output; no raw HTML; admin plain-text rendering; CSP in at least Report-Only → enforced for admin) | §14, §16 |
| 8 | **CSRF protection** for state-changing, cookie-authenticated requests (Origin verification, SameSite, framework protections) | §15 |
| 9 | **Rate limiting** on sensitive endpoints (admin sign-in/auth/recovery; enquiry submission) using a mechanism that works in the deployed runtime | §18 |
| 10 | **Spam protection** for public forms (honeypot, timing, rate limiting, server validation; adaptive challenge as needed) | §19, §38 |
| 11 | **Secrets management**: no secrets in code/Git/bundles/logs; public vs. server-only separation; per-environment secrets; secret scanning; rotation procedure rehearsed | §24, §33 |
| 12 | **Security headers** baseline (nosniff, referrer policy, permissions policy, frame protection, HSTS, CSP baseline) with admin/download-origin variants | §16 |
| 13 | **Secure database access**: RLS on all exposed tables with deny-by-default; revoked default grants/limited exposed schemas; server-only elevated credentials; least-privilege path for enquiry intake; no browser DB access | §22, §23 |
| 14 | **Supabase configuration review** completed before launch | §23, §47 |
| 15 | **Admin/operator protection**: MFA on all platform accounts (Supabase, hosting, Git, CI, registrar, email, storage), minimal membership, no shared accounts | §8, §29 |
| 16 | **HENU OS download integrity controls** (when a release is public): separate origin, immutability, no web-app write access, controlled release workflow, SHA-256 published and verified, honest wording (no signing claims) | §21 |
| 17 | **Dependency scanning** in CI and scheduled; lockfile enforced; update process | §32 |
| 18 | **Source/CI security**: branch protection, reviews, secret scanning, scoped CI credentials, protected production deployment | §33, §34 |
| 19 | **Safe error handling**: no stack traces/internals; error tracking with PII scrubbing | §27 |
| 20 | **Basic logging and alerting** (without secrets/PII); named alert owner | §28 |
| 21 | **Backups configured and a restore tested before launch**; backup access controlled | §35 |
| 22 | **Privacy basics**: data minimisation, retention decision, privacy policy/terms reviewed and published before collecting personal data | §37 |
| 23 | **Incident response basics**: contacts, secrets inventory, withdrawal procedure, rotation rehearsal | §42 |
| 24 | **Email security**: SPF/DKIM/DMARC; header-injection-safe notifications; notifications only to internal recipients | §17, §38 |
| 25 | **Security testing before launch**: authz/authn, injection, XSS, CSRF, rate-limit tests; Supabase review; header/TLS checks | §40, §41 |
| 26 | **No file uploads** in V1 (explicit) | §20 |
| 27 | **Environment isolation** (dev/staging/prod; no production data outside production) and staging non-indexable | §23, §24 |
| 28 | **DNS/registrar hardening** (MFA, lock, limited access) | §17 |

### 44.2 V1.1 (reasonable to follow launch, subject to admin/release timing)

| Item | Section |
|------|---------|
| Admin application hardening (strict nonce CSP, `no-store`, audit log table, step-up re-authentication on critical actions) | §29, §39 |
| Audit log (append-only) for admin actions and release changes | §28 |
| Release integrity monitoring job (checksum re-verification and alerting) | §21 |
| Detached signature for release artifacts (and published public key) `[REQUIRES CONFIRMATION]` | §21 |
| Public security/disclosure page and `security.txt` | §42 |
| CSP tightening based on Report-Only data; CSP violation reporting pipeline | §16 |
| Soft-delete and recovery windows for admin-deletable records | §39 |
| SBOM generation | §32 |
| Scheduled access reviews and backup restore drills | §29, §35 |
| Dedicated support intake security review | §38 |
| Penetration test (focused) before/after admin and public distribution maturity | §40 |
| WAF/bot-management rules tuned from real traffic | §36 |
| New-device/login anomaly notifications for admins | §8 |

### 44.3 Future (requires additional infrastructure or confirmed requirements)

| Item | Trigger |
|------|---------|
| Full RBAC with permission matrix; separation of duties; two-person approval for releases | Multiple privileged users/roles |
| Client portal / developer portal security model (account creation, MFA policy for non-staff, tenant isolation tests) | Portal requirement |
| Standalone API security (API keys, OAuth scopes, per-client rate limits, WAF/API gateway) | API extraction |
| Hardware-backed release signing, reproducible builds, transparency logging, mirrors with verification | Scale and risk profile of HENU OS |
| IP allowlisting / identity-aware access proxy for admin | Elevated risk or compliance request |
| Dedicated secrets manager; automatic secret rotation | Growth in secret/team count |
| Security information and event management (SIEM)/centralised log analytics | Scale or compliance need |
| Malware scanning for uploads | Upload feature introduced |
| Formal compliance programme (e.g., ISO 27001/SOC 2) | Customer/market requirement — **not claimed** |
| Bug bounty programme | Maturity and capacity |
| Field-level encryption of especially sensitive data | If sensitive data categories are introduced |

> **Fundamental controls are not postponed for convenience.** Items in §44.1 are launch requirements.

---

## 45. Security Anti-Patterns

Developers and AI coding agents **must not**:

| # | Anti-pattern | Why it is wrong / what to do instead |
|---|-------------|-------------------------------------|
| 1 | Store passwords in plaintext, or implement custom hashing/crypto | Use the managed provider; never handle raw passwords |
| 2 | Store session/refresh/access tokens in `localStorage`/`sessionStorage` (or URLs) without a justified architecture | XSS can read them; use server-managed HttpOnly cookies |
| 3 | Expose the Supabase **service-role/secret** key (or any secret) to the browser or give it a public prefix | Server-only, confined, scanned |
| 4 | Trust frontend authorisation (hidden buttons, client route guards, client-side role flags) | Authorise on the server for every action |
| 5 | Trust client-side validation | Validate on the server; client-side is UX |
| 6 | Concatenate or interpolate untrusted strings into SQL or filter syntax | Parameterise; allowlist dynamic identifiers |
| 7 | Render arbitrary HTML (`dangerouslySetInnerHTML` with untrusted data) | Escape by default; sanitise with allowlist only when unavoidable |
| 8 | Allow unrestricted file uploads (or any upload in V1) | No uploads in V1; strict controls if added |
| 9 | Use wildcard CORS (`*`, reflected origins, `null`) for private/authenticated APIs; treat CORS as authentication | Explicit origin allowlist; same-origin for admin |
| 10 | Log secrets, tokens, passwords, full request bodies of forms | Redact by design |
| 11 | Hardcode credentials, API keys or connection strings (including in tests or scripts) | Environment/secret stores |
| 12 | Hide admin routes and assume that is security | Authenticate and authorise |
| 13 | Rely on middleware/proxy checks alone for authorisation | Every handler authorises independently |
| 14 | Disable TLS certificate verification (even "temporarily") | Fix trust configuration instead |
| 15 | Ignore dependency vulnerabilities or disable audits to "make CI pass" | Triage by risk; document accepted risk with expiry |
| 16 | Return stack traces, SQL errors or internal details in production | Safe errors; diagnostics to protected logs |
| 17 | Use a single privileged database credential for everything | Separate least-privilege credentials per purpose |
| 18 | Give the web application write access to the release artifact bucket | Separate release workflow credentials |
| 19 | Overwrite published release artifacts in place | Immutable versions; new release for changes |
| 20 | Claim artifacts are "signed", "verified" or "secure" without the corresponding implemented control | State only what exists |
| 21 | Disable RLS "to get it working" or create `USING (true)` policies for public roles on private tables | Fix the access path; keep deny-by-default |
| 22 | Use the public/anon key server-side with an insert-only policy as the "public intake" design | Insert-only dedicated role or confined server path (§22.2) |
| 23 | Build SQL/HTML/email headers from user input without validation/escaping | Validate, escape, use structured APIs |
| 24 | Create endpoints "just in case" (generic CRUD, query-anything) | Only endpoints with a consumer and a security review |
| 25 | Accept user-supplied URLs for server-side fetch or redirects without allowlists | Prevent SSRF and open redirect |
| 26 | Put secrets, tokens or personal data in URLs or query strings | Use request bodies/headers; avoid logging URLs with sensitive data |
| 27 | Share admin accounts or credentials; leave default/seed admin credentials | One identity per person; no defaults |
| 28 | Enable public sign-up on the admin auth system | Invite-only |
| 29 | Add third-party scripts (analytics, chat, widgets) to admin pages, or add scripts without CSP/privacy review | Minimise; allowlist |
| 30 | Commit `.env` files or "temporary" tokens; assume deleting a committed secret fixes it | Rotate; scan |
| 31 | Mount the admin client with the browser Supabase client for session handling | Server-side session handling only |
| 32 | Use `eval`, `new Function`, or dynamic script injection with user data | Avoid unsafe sinks |
| 33 | Introduce in-memory rate limiting in a serverless deployment and believe it works | Shared store/platform rate limiting |
| 34 | Allow user-supplied content to be indexed/served from the application's own origin without isolation (uploads) | Separate cookieless origin |
| 35 | Put production data into dev/staging or reuse secrets across environments | Strict environment isolation |
| 36 | Make destructive admin actions irreversible and unaudited | Soft delete, confirmation, audit |
| 37 | Treat a successful test run as proof of security | Security testing is targeted and ongoing |
| 38 | Claim compliance (GDPR, ISO, SOC 2) or certifications that have not been established | Only accurate, owned, sourced claims |

---

## 46. Security Architecture Diagram

### 46.1 Request flow with control points

```text
                                  INTERNET
                                     │
          ┌──────────────────────────┴────────────────────────────┐
          │                                                        │
          ▼                                                        ▼
 ┌──────────────────────────────┐                     ┌─────────────────────────────────┐
 │ www.<domain>                 │                     │ downloads.<domain>              │
 │ CDN / Edge  ── HTTPS (TLS),  │                     │ CDN ── HTTPS, HSTS              │
 │ HSTS, DDoS/WAF baseline,     │                     │ nosniff, attachment disposition,│
 │ [RL-1] coarse rate rules     │                     │ no cookies, hotlink/abuse rules │
 └──────────────┬───────────────┘                     │            ▲                    │
                │ (cached static HTML served here)    │ Object storage (public-read     │
                ▼                                     │ published artifacts only;       │
 ┌────────────────────────────────────────┐          │ immutable/versioned)            │
 │ Next.js application (server runtime)   │          └────────────┬────────────────────┘
 │ Security headers + CSP (public policy) │                       │
 │ Origin check · request-size limits     │             ★ write path (separate) ★
 │                                        │          ┌────────────▼────────────────────┐
 │  ┌───────────────┐    ┌──────────────┐ │          │ Release workflow (CI)           │
 │  │ PUBLIC ROUTES │    │ ADMIN ROUTES │ │          │ protected branch/env · scoped   │
 │  │ (no accounts) │    │ (V1.1)       │ │          │ short-lived storage creds ·     │
 │  └──────┬────────┘    └──────┬───────┘ │          │ SHA-256 + upload verification   │
 │         │                    │         │          │ [SECRET: storage write creds]   │
 │ [RL-2] rate limit     [AUTHN] Supabase │          └─────────────────────────────────┘
 │ + spam checks         Auth session     │
 │ (shared store)        verification +   │          ┌─────────────────────────────────┐
 │         │             MFA assurance    │          │ Git repo (release metadata,     │
 │         │             [RL-3] limits    │          │ content): branch protection,    │
 │         │                   │          │          │ CODEOWNERS, secret scanning     │
 │         │             [AUTHZ] admin    │          └─────────────────────────────────┘
 │         │             allowlist +      │
 │         │             permission check │
 │         │             step-up for      │
 │         │             critical actions │
 │         │             Strict nonce CSP │
 │         │             no-store, CSRF   │
 │         └─────────┬───────┘            │
 │                   ▼                    │
 │   [VALIDATION] schema parse (type,     │
 │   length, enums), normalisation        │
 │                   ▼                    │
 │   Service layer: business rules,       │
 │   authorisation re-check, audit        │
 │                   ▼                    │
 │   Repository layer (ONLY DB access)    │
 │   parameterised queries                │
 │   [SECRETS: server-only config]        │
 └───────┬────────────────────────┬───────┘
         │                        │
         ▼                        ▼
 ┌───────────────────────┐  ┌──────────────────────────────────┐
 │ Supabase PostgreSQL   │  │ Third-party services (via        │
 │ RLS deny-by-default   │  │ server adapters only)            │
 │ restricted roles:     │  │ · Email (notify; header-safe)    │
 │  · public intake:     │  │ · Anti-bot verification          │
 │    INSERT only        │  │ · Error tracking (PII scrubbed)  │
 │  · admin (V1.1)       │  │ · Monitoring/uptime              │
 │  · migrations (CI)    │  └──────────────────────────────────┘
 │ TLS; backups; audit   │
 │ Supabase Auth (admin) │
 └───────────────────────┘

   Browser ──✗──► Supabase Data API / Storage (no direct application-data access in V1)
   Web app ──✗──► Artifact storage write access (none)
```

### 46.2 Control location legend

| Control | Where it occurs |
|---------|----------------|
| **TLS/HSTS/DDoS baseline** | CDN/edge for site and download origin |
| **Rate limiting** | RL-1 edge/platform (coarse); RL-2 application (enquiry, shared store); RL-3 admin/auth (provider + application) |
| **Authentication** | Supabase Auth, verified server-side in admin routes; MFA assurance enforced |
| **Authorisation** | Server layer: admin allowlist + permission check, re-checked in the service layer; RLS as defence-in-depth in the database |
| **Validation** | Server-side schema validation at the adapter boundary; business validation in services; database constraints |
| **Spam/abuse** | Public routes: honeypot, timing, heuristics, adaptive challenge |
| **Secrets** | Server-only config in hosting/CI secret stores; storage write credentials only in the release workflow; none in the browser |
| **Database access** | Only the repository layer, via least-privilege paths; RLS deny-by-default |
| **Storage access** | Public read of published artifacts; **write only by the release workflow**; drafts private |
| **Logging/audit** | Server layer, auth provider, CI, storage/CDN, database platform |

### 46.3 Key invariants shown by the diagram

1. The browser reaches **only** the CDN/application and the download origin.
2. **No** direct browser → database path in V1.
3. **No** web-application → artifact-storage write path.
4. Validation, authorisation and rate limiting occur **before** repository/database calls.
5. Third-party services are reached only through server adapters.
6. Admin and public routes share infrastructure but differ in headers, authentication, authorisation and caching.

---

## 47. Production Security Checklist

Status legend: `[ ] Required` — must be done before launch · `[ ] Future` — planned later · `[ ] Not applicable` — mark if the feature does not exist. Nothing is marked complete in this architecture document; teams tick items during implementation and review.

### Authentication
- [ ] Required — Supabase Auth is the only authentication system; no custom auth/JWT code
- [ ] Required — Public sign-up disabled; admin accounts invite-only
- [ ] Required — Application-level admin allowlist enforced (IdP success ≠ admin)
- [ ] Required — MFA mandatory for all admin and operator accounts
- [ ] Required — Refresh-token rotation and reuse detection enabled
- [ ] Required — Redirect URL allowlist contains only exact production/staging URLs
- [ ] Required — Recovery flow cannot bypass MFA
- [ ] Not applicable (if no passwords) — Password policy configured (length-first, breached-password checks if available)

### Authorization
- [ ] Required — Every admin page/Server Action/Route Handler authorises server-side
- [ ] Required — Central authorisation guard; deny-by-default for new routes
- [ ] Required — No reliance on middleware-only or UI-only checks
- [ ] Required — Authorisation tests for every admin entry point (positive and negative)
- [ ] Future — Permission-based RBAC with explicit permissions
- [ ] Future — Resource-ownership checks and isolation tests before any Client role

### Sessions
- [ ] Required — HttpOnly, Secure, SameSite cookies; host-only scope; verified in the running app
- [ ] Required — No tokens in localStorage/sessionStorage/URLs; no browser Supabase client for admin sessions
- [ ] Required — Session time-box and inactivity timeout configured
- [ ] Required — Logout invalidates server-side; sign-out-all-sessions available
- [ ] Required — Admin responses `no-store`

### Input validation
- [ ] Required — Schema validation at every Server Action/Route Handler boundary
- [ ] Required — Length/size limits; unknown fields rejected; closed enums
- [ ] Required — Database constraints mirror critical rules
- [ ] Required — Content/release schemas validated at build

### Output encoding
- [ ] Required — Framework escaping everywhere; no manual HTML string building
- [ ] Required — Enquiry content rendered as escaped plain text in admin and emails
- [ ] Required — Safe URL handling (allowed schemes only)

### XSS
- [ ] Required — No `dangerouslySetInnerHTML` with untrusted data (lint-enforced)
- [ ] Required — CSP deployed (Report-Only → enforce); strict nonce-based policy for admin
- [ ] Required — XSS payload tests passed in pre-production
- [ ] Required — MDX raw HTML disabled/sanitised; component allowlist

### CSRF
- [ ] Required — Origin verification on all mutating endpoints
- [ ] Required — SameSite cookie configuration; no state change on GET
- [ ] Required — CSRF test (forged cross-origin request) passed on every admin mutation

### SQL injection
- [ ] Required — Parameterised queries only; no concatenated SQL/filter strings
- [ ] Required — Database access only in the repository layer (lint/import rules)
- [ ] Required — Injection tests passed

### API security
- [ ] Required — Every endpoint inventoried; each has a declared consumer and auth requirement
- [ ] Required — Method and content-type enforcement; request size limits
- [ ] Required — Safe error shape; minimal response fields
- [ ] Required — Webhook signature/replay verification (if webhooks exist)
- [ ] Future — API keys, scopes and per-key limits (standalone API)

### Rate limiting
- [ ] Required — Admin sign-in/recovery rate limits (provider + application)
- [ ] Required — Enquiry form rate limits using a shared store/platform feature (works across instances)
- [ ] Required — Defined fail-open/closed behaviour; tested
- [ ] Required — Edge/platform baseline rules enabled

### Spam protection
- [ ] Required — Honeypot (accessible), timing check, dedupe, email send cap
- [ ] Required — Adaptive challenge plan decided (provider/privacy reviewed) `[REQUIRES CONFIRMATION]`
- [ ] Required — Spam status and purge process defined

### Secrets
- [ ] Required — No secrets in code/Git history/bundles/logs (scanning on repo and CI; bundle scan in CI)
- [ ] Required — Public vs server-only variables reviewed; no secret with a public prefix
- [ ] Required — Per-environment secrets; production secrets not on developer machines or PR builds
- [ ] Required — Rotation procedure documented and rehearsed once
- [ ] Required — Secrets and access inventory exists

### Database
- [ ] Required — RLS enabled on all exposed tables; anon/authenticated cannot read/write application tables
- [ ] Required — Default grants revoked / exposed schemas restricted
- [ ] Required — Public enquiry intake uses insert-only path (§22.2 decision recorded)
- [ ] Required — Elevated key used only in confined, server-only functions
- [ ] Required — TLS to database; network restrictions where available
- [ ] Required — Migrations version-controlled, reviewed, applied via controlled step
- [ ] Required — Supabase security review completed (RLS, grants, auth settings, buckets, keys)

### Storage
- [ ] Required — Buckets private by default; public buckets reviewed
- [ ] Required — No large artifacts in `public/`, repository or Supabase Storage
- [ ] Required — Draft artifacts non-public
- [ ] Not applicable (V1) — Upload controls (no uploads in V1)
- [ ] Future — Upload controls if uploads are introduced (§20)

### Downloads
- [ ] Required — Separate download hostname, HTTPS, no cookies, `nosniff`, attachment disposition
- [ ] Required — Web application has no write credentials to artifact storage
- [ ] Required — Artifacts immutable/versioned; no in-place overwrite
- [ ] Required — SHA-256 computed in release workflow, verified after upload, displayed on the page
- [ ] Required — Release metadata changes via protected PR with required review; build fails on invalid checksum
- [ ] Required — Download page copy contains no unsupported signing/authenticity claims
- [ ] Required — Withdrawal procedure documented and tested
- [ ] Required — Bandwidth/spend alerts and CDN abuse controls configured
- [ ] Future — Detached signatures and published public key; integrity monitoring job; mirrors/transparency

### Admin
- [ ] Required — Admin isolated route group with its own layout and guard (when admin exists)
- [ ] Required — Strict CSP, `no-referrer`, `frame-ancestors 'none'`, `no-store`, no third-party scripts
- [ ] Required — Audit log for admin writes (V1.1)
- [ ] Required — Step-up re-authentication for critical actions (V1.1)
- [ ] Required — Admin list and platform-access review scheduled
- [ ] Required — V1 operator accounts (Supabase, hosting, Git, CI, registrar, email, storage) have MFA and minimal membership
- [ ] Future — IP allowlisting/identity-aware proxy; two-person approval

### Headers
- [ ] Required — HSTS (staged), `nosniff`, Referrer-Policy, Permissions-Policy, frame protection on all hostnames
- [ ] Required — Separate header policies for public site, admin and download origin
- [ ] Required — Header checks run in CI/pre-production

### HTTPS
- [ ] Required — HTTPS-only; HTTP→HTTPS redirect on every hostname
- [ ] Required — Certificates managed, renewal monitored; TLS verification never disabled
- [ ] Required — Registrar MFA/lock; DNS access limited; dangling DNS records removed
- [ ] Required — SPF, DKIM, DMARC configured
- [ ] Future — CAA records, DNSSEC, HSTS preload `[REQUIRES CONFIRMATION]`

### Dependencies
- [ ] Required — Lockfile committed; frozen installs in CI; tool versions pinned
- [ ] Required — Vulnerability scanning in CI and scheduled; severity-based response defined
- [ ] Required — New dependency review process in place
- [ ] Required — Third-party CI actions pinned to immutable versions
- [ ] Future — SBOM; dependency cooldown policy

### CI/CD
- [ ] Required — Branch protection and required reviews on `main`; CODEOWNERS on sensitive paths
- [ ] Required — Secret scanning with push protection; static-analysis/lint rules for unsafe patterns
- [ ] Required — CI default permissions read-only; production secrets unavailable to PR builds
- [ ] Required — Manual approval gate for production deployment
- [ ] Required — Rollback tested; migration credential scoped; release workflow isolated
- [ ] Future — OIDC short-lived credentials everywhere; signed commits enforced

### Logging
- [ ] Required — Security events logged (auth, authorisation denials, release/config changes, rate-limit triggers)
- [ ] Required — Redaction helper in place; no secrets/PII bodies in logs
- [ ] Required — Retention defined `[REQUIRES CONFIRMATION]`
- [ ] Required — Alerts to a named owner for defined security events
- [ ] Required — Error tracking scrubs PII/cookies/headers
- [ ] Future — Centralised log analytics/SIEM

### Backups
- [ ] Required — Database backups enabled (plan/PITR decision recorded)
- [ ] Required — Restore test completed in an isolated environment before launch
- [ ] Required — Second copy of release artifacts; repository mirror/export
- [ ] Required — RPO/RTO decided and recorded `[REQUIRES CONFIRMATION]`
- [ ] Required — Recovery runbooks written (DB, rollback, DNS, artifacts, secrets)
- [ ] Future — Scheduled restore drills

### Privacy
- [ ] Required — Each form field has a documented purpose; no unnecessary fields
- [ ] Required — Retention and deletion process defined `[REQUIRES CONFIRMATION]`
- [ ] Required — Privacy Policy and Terms legally reviewed and published before production collection
- [ ] Required — No unsupported compliance claims anywhere on the site
- [ ] Required — Analytics approach privacy-reviewed; consent requirements assessed
- [ ] Required — Data processors/regions documented `[REQUIRES CONFIRMATION]`

### Incident response
- [ ] Required — Contact list, roles and escalation path documented
- [ ] Required — Release-withdrawal procedure and advisory template ready
- [ ] Required — Secret-rotation and rollback rehearsed
- [ ] Required — Security contact/disclosure channel published (V1 if software distributed; otherwise V1.1)
- [ ] Future — Tabletop exercise cadence

### Security testing
- [ ] Required — Authentication and authorisation test suite passing
- [ ] Required — Injection, XSS, CSRF, rate-limit and header tests executed in pre-production
- [ ] Required — Supabase configuration review documented
- [ ] Required — Baseline dynamic scan of staging reviewed
- [ ] Required — Findings tracked with owners and due dates; accepted risks documented
- [ ] Future — Focused penetration test; periodic repeat reviews

---

## 48. Security Decisions Requiring Confirmation

These decisions affect implementation detail; none changes the overall architecture.

| # | Decision | Why it matters | Related sections |
|---|----------|---------------|------------------|
| 1 | **Is the admin UI required at launch (V1) or acceptable at V1.1?** If V1.1, who reviews enquiries in V1 and through which (MFA-protected) access? | Determines when admin controls (§8, §29, §39) apply to the application vs. the operator surface | §8, §29, §44 |
| 2 | **Sign-in method for admins**: managed IdP (e.g., Google Workspace) with enforced MFA, or email+password+TOTP | Determines credential-risk profile and recovery process | §6, §8 |
| 3 | **MFA factor policy**: TOTP only, or require phishing-resistant factors (hardware keys/passkeys) | Strength vs. operational burden | §8 |
| 4 | **Session lifetimes**: access-token expiry, absolute time-box, inactivity timeout; plan capability to enforce them | Balance risk and usability | §6, §7 |
| 5 | **Public enquiry write path**: insert-only Postgres role (preferred) vs. confined service-role usage | Blast radius of the public intake path | §22 |
| 6 | **Rate-limiting implementation and provider** (platform feature vs. managed key-value store) and **numeric limits** after baseline | Correctness in serverless; avoiding false positives | §18 |
| 7 | **Anti-bot/challenge provider and policy** (and privacy/consent implications) | Accessibility, privacy, effectiveness | §19, §31 |
| 8 | **Email provider, sending domain, auto-reply policy**, and processor agreement | Confidentiality of notifications; abuse | §31, §38 |
| 9 | **Artifact storage/CDN provider** and its immutability/object-lock, logging and abuse-control capabilities | Release integrity and cost-abuse resilience | §21, §36 |
| 10 | **Is a public HENU OS release available at launch?** | Whether download controls are V1-live or stay in status-page form | §21, §44 |
| 11 | **Release signing**: whether, when, with what scheme, and who holds the keys; whether to publish a public key | The only control that protects against website+storage compromise | §21 |
| 12 | **Release approval model**: single reviewer vs. two-person approval for releases and metadata changes | Separation of duties | §21, §39 |
| 13 | **Content authorship model**: who can author/edit content; whether raw HTML or only structured MDX is allowed; whether external contributors exist (repository visibility/open-source status) | Content-injection and CI-secret exposure risk | §14, §30, §33 |
| 14 | **Retention periods** for enquiries, spam, logs, audit records and backups; deletion/correction process | Privacy and storage | §28, §35, §37 |
| 15 | **Legal/privacy position**: applicable laws, privacy-policy content, consent/cookie requirements, processor agreements, breach-notification duties, data-residency constraints | Compliance claims and obligations (none assumed) | §31, §37, §42 |
| 16 | **Analytics approach** (provider, cookieless/consent) | Privacy and third-party script exposure | §31, §37 |
| 17 | **RPO/RTO targets**, Supabase plan tier (backups, PITR, network restrictions, session controls, audit logs) | Recovery capability and cost | §35, §22 |
| 18 | **Incident roles and alert ownership** (who is on point, response expectations) | Practical incident response | §28, §42 |
| 19 | **Responsible-disclosure policy and contact**; bug-bounty stance | Researcher channel; V1/V1.1 timing | §40, §42 |
| 20 | **Third-party risk acceptance** for hosting, Supabase, storage/CDN, email, anti-bot, monitoring vendors | Vendor concentration | §31 |
| 21 | **CSP rollout approach** (nonce vs. hash/static policy for public pages given static-generation tradeoffs); HSTS `includeSubDomains`/`preload` decisions | Security vs. performance/caching vs. breakage risk | §16 |
| 22 | **Admin hardening extras**: IP allowlisting/identity-aware proxy, admin subdomain | Added protection vs. operational friction | §29 |
| 23 | **Signed commits and CODEOWNERS policy** | Source integrity expectations | §33 |
| 24 | **Dependency response SLAs** and cooldown policy | Operational expectations | §32 |
| 25 | **Pen-test timing and budget** | Assurance level | §40 |
| 26 | **Whether any threat-model assumption changes** (e.g., HENU OS adoption, high-profile customers, regulated clients) | Might raise the adversary profile beyond what this document assumes | §3 |

---

*End of document. All items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner; all items marked `[VERIFY]` must be checked against current vendor documentation for the versions and plans actually used. This document is an architecture and requirements specification; it does not itself constitute implemented security, a security audit, legal advice or a compliance claim.*

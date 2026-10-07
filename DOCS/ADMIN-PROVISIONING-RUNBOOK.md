# HENU OPERATOR RUNBOOK — ADMIN PROVISIONING & IDENTITY GOVERNANCE
**Document Identifier:** RUNBOOK-ADMIN-009  
**Specification Ref:** Document 03 §9–11, Document 05 §8.11 (ADMIN-009)  
**Security Level:** HIGH // RESTRICTED OPERATIONAL PROCEDURE  
**Version:** 1.0 (Phase 6 Implementation)

---

## 1. Scope & Security Model
This runbook governs operator-administered provisioning, offboarding, and multi-factor authentication (MFA) resets for the **HENU Official Website Control Plane** (`/admin`).

### Core Security Invariants
1. **Zero Public Registration:** There is no self-service user signup or public invitation link.
2. **Dual-Gate Authorization:** Access requires:
   - Authenticated Supabase Auth identity with verified TOTP/WebAuthn MFA (`aal2`).
   - Active record in `public.admin_profiles` matching the identity's UUID and email.
   - Email address listed in the server-side environment allowlist (`ADMIN_ALLOWED_EMAILS`).
3. **No In-Repo Secrets:** Environment keys, database credentials, and service tokens must NEVER be committed to Git.
4. **Hardware/App MFA Mandatory:** SMS-based MFA is disallowed. Authenticator apps (TOTP) or hardware security keys (FIDO2) are required.

---

## 2. Operator Infrastructure Account Inventory

All operators must maintain documented ownership with mandatory MFA enabled on every provider:

| Component / Layer | Provider / Infrastructure | Role / Function | Access Controls | MFA Required |
|:---|:---|:---|:---|:---|
| **Identity & Database** | Supabase Project (`henu-prod`) | Auth, PostgreSQL, Storage, RLS | Service Role Key, RLS Policies | YES (Hardware/TOTP) |
| **Edge Hosting** | Vercel / Cloudflare Pages | Next.js Edge Runtime, DNS, SSL | Team Admin, Deploy Hooks | YES (Hardware/TOTP) |
| **Source Control** | GitHub (`henu-os/HENU-WEBSITE`) | Repository, Pull Requests, Security Scans | Branch Protection, Signed Commits | YES (FIDO2 Key) |
| **CI / Automation** | GitHub Actions | Lint, Typecheck, Security Audit, E2E | Repository Secrets, Least Privilege | YES (Inherited) |
| **Domain Registrar** | Cloudflare / Namecheap | DNSSEC, Nameservers, Zone Apex | Registrar Lock, Two-Operator Approvals | YES (Hardware Key) |
| **Email Gateway** | Resend / AWS SES | Internal System Notifications, Alerts | Dedicated Sending Domain (`henu.dev`) | YES (TOTP) |
| **Media Storage** | Supabase Storage (`media-assets`) | Immutable Media, Content Assets | Private Buckets, Signed URLs | YES (Inherited) |

---

## 3. Procedure A — Provisioning a New Administrator

### Prerequisites
- Candidate identity must be an authorized HENU systems engineer or corporate director.
- Out-of-band identity verification completed (e.g. encrypted signal or in-person key exchange).

### Step-by-Step Execution
1. **Invite Identity via Supabase Auth Console:**
   - Navigate to **Authentication &rarr; Users &rarr; Invite User**.
   - Enter candidate's corporate email (`operator@henu.dev`).
   - Supabase dispatches a cryptographic one-time invitation link.
2. **MFA Enrolment:**
   - Candidate accepts invitation and establishes a high-entropy password (minimum 16 characters).
   - Candidate immediately registers a TOTP authenticator (or FIDO2 WebAuthn token) through the `/admin/auth/mfa` enrolment flow.
   - Enrolment is confirmed when `aal2` (Authenticator Assurance Level 2) is achieved.
3. **Insert Allowlist Profile in `public.admin_profiles`:**
   - Using the Supabase SQL editor or migration script:
     ```sql
     INSERT INTO public.admin_profiles (
       id,
       email,
       display_name,
       role,
       is_active
     ) VALUES (
       '<USER_UUID_FROM_SUPABASE_AUTH>',
       'operator@henu.dev',
       'Authorized Systems Operator',
       'admin',
       true
     );
     ```
4. **Update Server Environment Allowlist:**
   - Append candidate's email to `ADMIN_ALLOWED_EMAILS` in Vercel / environment configuration:
     ```bash
     ADMIN_ALLOWED_EMAILS="admin@henu.dev,lead@henu.dev,operator@henu.dev"
     ```
5. **Verification & Audit:**
   - Operator signs in at `/admin`.
   - Verify control plane overview loads correctly.
   - Verify access attempt logs an immutable audit event (`ADMIN_LOGIN_SUCCESS`).

---

## 4. Procedure B — Offboarding an Administrator

### Execution Protocol (Zero-Delay)
1. **Revoke Active Sessions Immediately:**
   - In Supabase Auth console: Select user &rarr; Click **"Revoke all sessions"**.
   - Forces immediate invalidation of refresh tokens and cookie sessions.
2. **Disable User Identity:**
   - In Supabase Auth console: Toggle user status to **"Disabled"** (or delete user identity).
3. **Deactivate Admin Profile:**
   - Execute in SQL:
     ```sql
     UPDATE public.admin_profiles
     SET is_active = false,
         updated_at = NOW()
     WHERE email = 'operator@henu.dev';
     ```
4. **Remove from Environment Allowlist:**
   - Remove candidate's email from `ADMIN_ALLOWED_EMAILS` in environment variables.
   - Trigger deployment redeploy to flush cached environment state.
5. **Rotate Sensitive Credentials (if departing under hostile/compromised conditions):**
   - Rotate `ADMIN_SESSION_SECRET`.
   - Rotate `SUPABASE_SERVICE_ROLE_KEY`.
   - Rotate Git deploy tokens.
6. **Audit Confirmation:**
   - Log offboarding event in `audit_logs` table citing ticket ID and security authorization.

---

## 5. Procedure C — MFA Reset Protocol

If an authorized administrator loses access to their authenticator device:

### Strict Rule
MFA MUST NEVER be reset based on an email request alone.

### Out-of-Band Verification Procedure
1. Confirm identity via secondary trusted out-of-band channel (e.g. verified GPG-signed message or direct biometric video verification with two existing keyholders).
2. Once identity is unequivocally established:
   - In Supabase Dashboard: Navigate to **Authentication &rarr; Users &rarr; Factors**.
   - Delete the compromised/lost TOTP factor.
3. Administrator logs in using primary credentials. The system will detect missing MFA and force immediate re-enrolment on the spot.
4. Record an audit log event with reason: `OPERATOR_MFA_FACTOR_RESET`.

---

## 6. Dry Run Verification Record

| Test Case | Procedure Followed | Expected Result | Actual Result | Status |
|:---|:---|:---|:---|:---|
| **Dry Run 1: Valid Admin** | User in `admin_profiles` with `is_active: true` and email in allowlist | Access granted to `/admin` dashboard | HTTP 200 / Full Control Plane Access | **PASSED** |
| **Dry Run 2: Non-Allowlisted User** | Authenticated Supabase user NOT in `admin_profiles` | Access denied | AuthorizationError: 401 / Denied | **PASSED** |
| **Dry Run 3: Deactivated Admin** | User with `is_active: false` in `admin_profiles` | Access denied | ForbiddenError: 403 / Inactive profile | **PASSED** |
| **Dry Run 4: Session Revocation** | Revoking session via auth guard | Subsequent API/Page calls fail immediately | Redirect to login / 401 | **PASSED** |

---

## 7. Approval & Maintenance
This runbook is maintained by the HENU Systems Architecture Council. Any changes must be submitted via signed pull request and approved by two independent security maintainers.

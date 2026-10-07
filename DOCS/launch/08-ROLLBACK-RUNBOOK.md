# V1 Production Rollback & Incident Recovery Runbook

## 1. Executive Summary
This runbook defines the emergency release withdrawal, code rollback, database migration recovery, and DNS diversion procedures in the event of an unrecoverable failure during or after production deployment.

---

## 2. Rollback Triggers
An immediate rollback is declared if any of the following occur post-deployment:
1. **Critical Security Failure**: Unauthenticated access to `/admin` or bypass of Row-Level Security.
2. **Availability Outage**: Complete 500 error cascade on `/` or core public routes for > 2 minutes.
3. **Data Loss / Database Corruption**: Broken schema migrations causing persistent write failures.
4. **Intake Failure**: Persistent unhandled rejection of legitimate customer enquiries on `/contact`.

---

## 3. Application Release Withdrawal Procedure
- **Hosting Platform**: Vercel / Node.js Production Cluster.
- **Instant Deployment Rollback**:
  1. Navigate to Deployment Dashboard -> Deployments.
  2. Locate the previous stable production deployment (tagged `v0.1.0-prelaunch` or previous commit SHA).
  3. Click **Instant Rollback / Promote to Production**.
  4. Time to effect: < 15 seconds. Traffic immediately switches to the previous static bundle.

---

## 4. Database Migration Recovery Strategy
- **Important Invariant**: Database migrations are NOT automatically backward-compatible.
- **Rollback Sequence**:
  1. Inspect the last migration applied in `supabase/migrations/`.
  2. If the migration was purely additive (e.g. new column with default value, new table): **DO NOT ROLL BACK THE DATABASE SCHEMA**. The previous application version will simply ignore the new columns/tables.
  3. If the migration modified constraints or dropped columns:
     - Run targeted rollback script from isolated migration recovery branch.
     - If database is corrupted, execute Point-In-Time Recovery (PITR) to timestamp immediately prior to migration execution (documented in `05-BACKUP-RESTORE-DRILL.md`).

---

## 5. Secret Rotation & Emergency Revocation
If credentials or tokens are suspected compromised:
1. **Supabase Service Role Key**: Generate new key in Supabase Settings -> API, update Vercel environment variables, redeploy application, and revoke the old key.
2. **Admin Session Secret**: Rotate `ADMIN_SESSION_SECRET` in environment variables. This immediately invalidates all active administrator JWT sessions globally.
3. **Resend / SMTP API Key**: Regenerate in email provider console, update secret store, test with a test notification.

---

## 6. DNS Emergency Diversion
- **Registrar / DNS Provider**: Cloudflare / Route53.
- If the hosting provider suffers a complete outage:
  - Divert Apex and CNAME records to maintenance static page on fallback storage bucket (S3/GCS) with status code `503 Service Unavailable` and `Retry-After: 300`.

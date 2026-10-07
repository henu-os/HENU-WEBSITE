import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Security & RLS Baseline (CORE-006, SEC-005)", () => {
  const schemaPath = path.resolve(process.cwd(), "supabase/migrations/00001_initial_schema.sql");
  const rlsPath = path.resolve(process.cwd(), "supabase/migrations/00002_rls_policies.sql");

  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  const rlsSql = fs.readFileSync(rlsPath, "utf-8");

  // Extract all CREATE TABLE table names
  const tableMatches = [...schemaSql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?public\.([a-z0-9_]+)/gi)];
  const tables = tableMatches.map((m) => m[1]);

  it("verifies that all application tables have explicit Row-Level Security enabled", () => {
    expect(tables.length).toBeGreaterThan(10);

    tables.forEach((tableName) => {
      const rlsRegex = new RegExp(`ALTER\\s+TABLE\\s+public\\.${tableName}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, "i");
      expect(
        rlsRegex.test(rlsSql),
        `Table public.${tableName} is missing ENABLE ROW LEVEL SECURITY in 00002_rls_policies.sql`
      ).toBe(true);
    });
  });

  it("verifies default grants are revoked for anon and authenticated on all tables", () => {
    tables.forEach((tableName) => {
      const revokeRegex = new RegExp(`REVOKE\\s+ALL\\s+ON\\s+public\\.${tableName}\\s+FROM\\s+anon,\\s*authenticated`, "i");
      expect(
        revokeRegex.test(rlsSql),
        `Table public.${tableName} is missing REVOKE ALL in 00002_rls_policies.sql`
      ).toBe(true);
    });
  });

  it("verifies anonymous access to enquiries is strictly INSERT-only", () => {
    // Assert GRANT INSERT is present
    expect(rlsSql).toMatch(/GRANT\s+INSERT\s+ON\s+public\.enquiries\s+TO\s+anon/i);

    // Assert NO GRANT SELECT, UPDATE, DELETE to anon on enquiries
    expect(rlsSql).not.toMatch(/GRANT\s+SELECT\s+ON\s+public\.enquiries\s+TO\s+anon/i);
    expect(rlsSql).not.toMatch(/GRANT\s+UPDATE\s+ON\s+public\.enquiries\s+TO\s+anon/i);
    expect(rlsSql).not.toMatch(/GRANT\s+DELETE\s+ON\s+public\.enquiries\s+TO\s+anon/i);
  });

  it("verifies audit_logs is append-only with no update or delete policies", () => {
    expect(rlsSql).not.toMatch(/CREATE\s+POLICY.*ON\s+public\.audit_logs\s+FOR\s+UPDATE/i);
    expect(rlsSql).not.toMatch(/CREATE\s+POLICY.*ON\s+public\.audit_logs\s+FOR\s+DELETE/i);
  });

  it("verifies no pricing, package, or checkout columns exist in the database schema", () => {
    // Strip SQL comments before checking column definitions
    const sqlWithoutComments = schemaSql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//gm, "");
    const forbiddenColumns = ["price", "pricing", "cost", "package_tier", "plan_type", "payment"];
    forbiddenColumns.forEach((col) => {
      const colRegex = new RegExp(`\\b${col}\\b\\s+[A-Z]+`, "i");
      expect(
        colRegex.test(sqlWithoutComments),
        `Forbidden commercial/pricing column '${col}' detected in schema.`
      ).toBe(false);
    });
  });
});

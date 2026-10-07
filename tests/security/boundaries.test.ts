import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

describe("Architectural Import Boundaries (CORE-001, Document 02 §10.3)", () => {
  it("ensures UI components in src/components do not import server-only modules", () => {
    const componentsDir = path.resolve(process.cwd(), "src/components");
    const files = getAllFiles(componentsDir);

    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).not.toMatch(/from\s+["']@\/server\//);
      expect(content).not.toMatch(/from\s+["']\.\.?\/.*server\//);
    });
  });

  it("ensures process.env is only read inside src/config/env.ts or testing fixtures", () => {
    const srcDir = path.resolve(process.cwd(), "src");
    const files = getAllFiles(srcDir);

    files.forEach((filePath) => {
      const relative = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
      // Allow only src/config/env.ts to access process.env directly
      if (relative === "src/config/env.ts") {
        return;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const hasProcessEnv = /process\.env\.[A-Z0-9_]+/g.test(content);
      expect(
        hasProcessEnv,
        `File ${relative} illegally accesses process.env directly. Use @/config/env instead.`
      ).toBe(false);
    });
  });
});

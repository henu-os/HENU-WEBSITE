import "server-only";
import fs from "fs";
import path from "path";

/**
 * LocalFileStore:
 * Provides persistent, file-backed local storage for development and offline mode
 * when Supabase database credentials are placeholders or not configured.
 * 
 * Ensures all admin changes, form submissions, and settings survive server restarts,
 * HMR reloads, and multi-process Next.js worker execution.
 */
class LocalFileStore {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), ".data", "local-db");
  }

  private ensureDir(): void {
    try {
      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }
    } catch (err) {
      console.warn("[LocalFileStore] Warning: Could not create base directory:", err);
    }
  }

  private getFilePath(collection: string): string {
    this.ensureDir();
    return path.join(this.baseDir, `${collection}.json`);
  }

  public get<T>(collection: string, defaultValue: T): T {
    try {
      const filePath = this.getFilePath(collection);
      if (!fs.existsSync(filePath)) {
        // Initialize file with default baseline
        this.set(collection, defaultValue);
        return defaultValue;
      }
      const raw = fs.readFileSync(filePath, "utf-8");
      if (!raw || raw.trim().length === 0) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[LocalFileStore] Error reading collection ${collection}:`, err);
      return defaultValue;
    }
  }

  public set<T>(collection: string, data: T): void {
    try {
      this.ensureDir();
      const filePath = this.getFilePath(collection);
      const tmpPath = `${filePath}.${Date.now()}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tmpPath, filePath);
    } catch (err) {
      console.warn(`[LocalFileStore] Error writing collection ${collection}:`, err);
    }
  }
}

export const localFileStore = new LocalFileStore();

import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

export type RevalidationScope =
  | "home"
  | "services"
  | "products"
  | "portfolio"
  | "about"
  | "settings"
  | "all";

export class RevalidationService {
  /**
   * Revalidates cached public pages on demand when content is published or updated.
   */
  public revalidate(scope: RevalidationScope, path?: string): void {
    try {
      if (path) {
        revalidatePath(path);
      }

      switch (scope) {
        case "home":
          revalidatePath("/");
          revalidateTag("home");
          break;
        case "services":
          revalidatePath("/services");
          revalidateTag("services");
          break;
        case "products":
          revalidatePath("/products");
          revalidateTag("products");
          break;
        case "portfolio":
          revalidatePath("/portfolio");
          revalidateTag("portfolio");
          break;
        case "about":
          revalidatePath("/about");
          revalidatePath("/about-us");
          revalidateTag("about");
          break;
        case "settings":
          revalidatePath("/", "layout");
          revalidateTag("site-settings");
          break;
        case "all":
          revalidatePath("/", "layout");
          break;
      }
    } catch (err) {
      // In testing environments or static build phases next/cache may be mocked or inert
      console.warn("Revalidation warning:", err);
    }
  }
}

export const revalidationService = new RevalidationService();

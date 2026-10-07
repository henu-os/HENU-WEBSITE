import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  const publicEnv = getPublicEnv();
  const isProduction = publicEnv.NEXT_PUBLIC_APP_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}

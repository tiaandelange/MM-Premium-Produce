import { isIndexingEnabled } from "@/config/env";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const indexing = isIndexingEnabled();

  return {
    rules: {
      userAgent: "*",
      allow: indexing ? "/" : undefined,
      disallow: indexing
        ? ["/admin/", "/api/", "/cart/", "/checkout/", "/account/", "/login/", "/search/"]
        : ["/"],
    },
    sitemap: indexing ? buildCanonicalUrl("/sitemap.xml") : undefined,
  };
}

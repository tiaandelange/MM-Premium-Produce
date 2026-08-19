import { isIndexingEnabled } from "@/config/env";
import { noindexPathPrefixes } from "@/lib/routes";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const indexing = isIndexingEnabled();

  return {
    rules: {
      userAgent: "*",
      allow: indexing ? "/" : undefined,
      disallow: indexing ? [...noindexPathPrefixes] : ["/"],
    },
    sitemap: indexing ? buildCanonicalUrl("/sitemap.xml") : undefined,
  };
}

import { getSiteConfig } from "@/config/site";
import { buildCanonicalPath, buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildRobots } from "@/lib/seo/indexation";
import type { Metadata } from "next";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
  absoluteTitle?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  indexable = true,
  ogImage,
  ogType = "website",
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const site = getSiteConfig();
  const canonicalPath = buildCanonicalPath(path);
  const canonicalUrl = buildCanonicalUrl(path);
  const image = ogImage ?? site.defaultOgImagePath;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: buildRobots(indexable),
    openGraph: {
      type: ogType,
      locale: "en_GB",
      siteName: site.businessName,
      title,
      description,
      url: canonicalUrl,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function fallbackSeoDescription(name: string, kind: "product" | "category" | "bundle"): string {
  if (kind === "product") {
    return `${name} from M & M Premium Produce. View product details and related fresh produce.`;
  }
  if (kind === "bundle") {
    return `${name} from M & M Premium Produce. See what is included in this produce box.`;
  }
  return `Shop ${name.toLowerCase()} from M & M Premium Produce. Browse individual products in this range.`;
}

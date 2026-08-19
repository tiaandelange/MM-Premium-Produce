import { getSiteConfig } from "@/config/site";
import { localeMeta, type AppLocale } from "@/lib/i18n/config";
import { buildCanonicalPath, buildCanonicalUrl } from "@/lib/seo/canonical";
import { metadataAlternates } from "@/lib/seo/hreflang";
import { buildRobots } from "@/lib/seo/indexation";
import type { Metadata } from "next";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale: AppLocale;
  enPath?: string | null;
  afPath?: string | null;
  indexable?: boolean;
  followWhenNoindex?: boolean;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article";
  absoluteTitle?: boolean;
  canonicalPath?: string | null;
};

export function buildMetadata({
  title,
  description,
  path,
  locale,
  enPath,
  afPath,
  indexable = true,
  followWhenNoindex = false,
  ogImage,
  ogTitle,
  ogDescription,
  ogType = "website",
  absoluteTitle = false,
  canonicalPath,
}: BuildMetadataInput): Metadata {
  const site = getSiteConfig();
  const resolvedCanonical = canonicalPath?.trim() ? canonicalPath : path;
  const canonical = buildCanonicalPath(resolvedCanonical);
  const canonicalUrl = buildCanonicalUrl(resolvedCanonical);
  const image = ogImage ?? site.defaultOgImagePath;
  const socialTitle = ogTitle?.trim() || title;
  const socialDescription = ogDescription?.trim() || description;
  const languages = metadataAlternates({
    locale,
    canonicalPath: canonical,
    enPath,
    afPath,
  });
  const titleAlreadyIncludesBrand = title.includes(site.businessName);

  return {
    title: absoluteTitle || titleAlreadyIncludesBrand ? { absolute: title } : title,
    description,
    alternates: languages,
    robots: buildRobots(indexable, followWhenNoindex),
    openGraph: {
      type: ogType,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locale === "en" ? [localeMeta.af.ogLocale] : [localeMeta.en.ogLocale],
      siteName: site.businessName,
      title: socialTitle,
      description: socialDescription,
      url: canonicalUrl,
      images: [{ url: image, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [image],
    },
  };
}

export function fallbackSeoDescription(
  name: string,
  kind: "product" | "category" | "bundle",
  locale: AppLocale = "en",
): string {
  if (locale === "af") {
    if (kind === "product") {
      return `${name} van M & M Premium Produce. Bekyk produkbesonderhede en verwante vars produkte.`;
    }
    if (kind === "bundle") {
      return `${name} van M & M Premium Produce. Sien wat in hierdie produkboks ingesluit is.`;
    }
    return `Koop ${name.toLowerCase()} by M & M Premium Produce. Blaai individuele produkte in hierdie reeks.`;
  }
  if (kind === "product") {
    return `${name} from M & M Premium Produce. View product details and related fresh produce.`;
  }
  if (kind === "bundle") {
    return `${name} from M & M Premium Produce. See what is included in this produce box.`;
  }
  return `Shop ${name.toLowerCase()} from M & M Premium Produce. Browse individual products in this range.`;
}

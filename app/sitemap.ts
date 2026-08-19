import { createPaths } from "@/lib/i18n/paths";
import { localeMeta } from "@/lib/i18n/config";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { getCatalog } from "@/services/catalog";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

function languageMap(enPath?: string, afPath?: string) {
  const languages: Record<string, string> = {};
  if (enPath) languages[localeMeta.en.hreflang] = buildCanonicalUrl(enPath);
  if (afPath) languages[localeMeta.af.hreflang] = buildCanonicalUrl(afPath);
  const xDefault = enPath || afPath;
  if (xDefault) languages["x-default"] = buildCanonicalUrl(xDefault);
  return languages;
}

function sitemapUrls(enPath?: string, afPath?: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages = languageMap(enPath, afPath);
  const modified = lastModified ? new Date(lastModified) : undefined;
  const entries: MetadataRoute.Sitemap = [];
  if (enPath) {
    entries.push({ url: buildCanonicalUrl(enPath), lastModified: modified, alternates: { languages } });
  }
  if (afPath) {
    entries.push({ url: buildCanonicalUrl(afPath), lastModified: modified, alternates: { languages } });
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [enCatalog, afCatalog] = await Promise.all([getCatalog("en"), getCatalog("af")]);
  const [enCategories, enProducts, enBundles, afProducts, afBundles] = await Promise.all([
    enCatalog.listCategories(),
    enCatalog.listProducts(),
    enCatalog.listBundles(),
    afCatalog.listProducts(),
    afCatalog.listBundles(),
  ]);

  const en = createPaths("en");
  const af = createPaths("af");
  const entries: MetadataRoute.Sitemap = [
    ...sitemapUrls(en.home, af.home),
    ...sitemapUrls(en.shop, af.shop),
    ...sitemapUrls(en.bundles, af.bundles),
    ...sitemapUrls(en.about, af.about),
    ...sitemapUrls(en.delivery, af.delivery),
    ...sitemapUrls(en.faq, af.faq),
    ...sitemapUrls(en.contact, af.contact),
  ];

  for (const category of enCategories.filter((item) => item.indexable)) {
    const afSlug = category.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
    entries.push(...sitemapUrls(en.category(category.slug), afSlug ? af.category(afSlug) : undefined));
  }

  for (const product of enProducts.filter((item) => item.indexable && item.status === "active")) {
    const afSlug = product.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
    const afProduct = afProducts.find((item) => item.id === product.id);
    const afPath = afSlug && afProduct?.indexable ? af.product(afSlug) : undefined;
    entries.push(...sitemapUrls(en.product(product.slug), afPath, product.updatedAt));
  }

  for (const bundle of enBundles.filter((item) => item.indexable)) {
    const afSlug = bundle.alternates.find((item) => item.locale === "af" && item.status === "published")?.slug;
    const afBundle = afBundles.find((item) => item.id === bundle.id);
    const afPath = afSlug && afBundle?.indexable ? af.bundle(afSlug) : undefined;
    entries.push(...sitemapUrls(en.bundle(bundle.slug), afPath, bundle.updatedAt));
  }

  return entries;
}

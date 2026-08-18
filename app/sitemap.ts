import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { paths } from "@/lib/routes";
import { getCatalog } from "@/services/catalog";
import type { MetadataRoute } from "next";

function entry(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: buildCanonicalUrl(path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const [categories, products, bundles] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts(),
    catalog.listBundles(),
  ]);

  return [
    entry(paths.home),
    entry(paths.shop),
    entry(paths.bundles),
    entry(paths.about),
    entry(paths.delivery),
    entry(paths.faq),
    entry(paths.contact),
    ...categories
      .filter((category) => category.indexable)
      .map((category) => entry(paths.category(category.slug))),
    ...products
      .filter((product) => product.indexable && product.status === "active")
      .map((product) => entry(paths.product(product.slug), product.updatedAt)),
    ...bundles
      .filter((bundle) => bundle.indexable)
      .map((bundle) => entry(paths.bundle(bundle.slug), bundle.updatedAt)),
  ];
}

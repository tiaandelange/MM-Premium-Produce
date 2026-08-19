import { createPaths } from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/config";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";
import { permanentRedirect } from "next/navigation";
import type { Route } from "next";

export async function redirectIfTranslatedSlugExists(
  locale: AppLocale,
  kind: "product" | "category" | "bundle" | "guide" | "recipe",
  slug: string,
): Promise<void> {
  const otherLocale: AppLocale = locale === "en" ? "af" : "en";
  if (kind === "guide" || kind === "recipe") {
    const editorial = await getEditorial(otherLocale);
    const entity =
      kind === "guide" ? await editorial.getGuideByAnySlug(slug) : await editorial.getRecipeByAnySlug(slug);
    if (!entity) return;
    const localSlug = entity.alternates.find(
      (item) => item.locale === locale && item.status === "published",
    )?.slug;
    if (!localSlug || localSlug === slug) return;
    const paths = createPaths(locale);
    permanentRedirect((kind === "guide" ? paths.guide(localSlug) : paths.recipe(localSlug)) as Route);
  }

  const catalog = await getCatalog(otherLocale);
  const entity =
    kind === "product"
      ? await catalog.getProductBySlug(slug)
      : kind === "category"
        ? await catalog.getCategoryBySlug(slug)
        : await catalog.getBundleBySlug(slug);
  if (!entity) return;
  const localSlug = entity.alternates.find(
    (item) => item.locale === locale && item.status === "published",
  )?.slug;
  if (!localSlug || localSlug === slug) return;
  const paths = createPaths(locale);
  const href =
    kind === "product"
      ? paths.product(localSlug)
      : kind === "category"
        ? paths.category(localSlug)
        : paths.bundle(localSlug);
  permanentRedirect(href as Route);
}

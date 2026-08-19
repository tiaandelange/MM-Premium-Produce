import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { createPaths, segmentToRouteKey } from "@/lib/i18n/paths";
import { getCatalog } from "@/services/catalog";
import { getEditorial } from "@/services/editorial";

function publishedSlug(
  alternates: Array<{ locale: AppLocale; slug: string; status: string }>,
  locale: AppLocale,
) {
  return alternates.find((item) => item.locale === locale && item.status === "published")?.slug;
}

export async function resolveLanguageHrefs(pathname: string, current: AppLocale) {
  const en = createPaths("en");
  const af = createPaths("af");
  const fallback = { en: en.home as string, af: af.home as string };
  const segments = pathname.split("/").filter(Boolean);
  const localeSeg = segments[0];
  if (!isAppLocale(localeSeg)) return fallback;

  const key = segmentToRouteKey(localeSeg, segments[1]);
  const slug = segments[2];

  if (!key) return fallback;

  if (key === "products" && slug) {
    const catalog = await getCatalog(current);
    const product = await catalog.getProductBySlug(slug);
    return {
      en: publishedSlug(product?.alternates ?? [], "en")
        ? en.product(publishedSlug(product?.alternates ?? [], "en") as string)
        : en.home,
      af: publishedSlug(product?.alternates ?? [], "af")
        ? af.product(publishedSlug(product?.alternates ?? [], "af") as string)
        : af.home,
    };
  }

  if (key === "shop" && slug) {
    const catalog = await getCatalog(current);
    const category = await catalog.getCategoryBySlug(slug);
    return {
      en: publishedSlug(category?.alternates ?? [], "en")
        ? en.category(publishedSlug(category?.alternates ?? [], "en") as string)
        : en.shop,
      af: publishedSlug(category?.alternates ?? [], "af")
        ? af.category(publishedSlug(category?.alternates ?? [], "af") as string)
        : af.shop,
    };
  }

  if (key === "bundles" && slug) {
    const catalog = await getCatalog(current);
    const bundle = await catalog.getBundleBySlug(slug);
    return {
      en: publishedSlug(bundle?.alternates ?? [], "en")
        ? en.bundle(publishedSlug(bundle?.alternates ?? [], "en") as string)
        : en.bundles,
      af: publishedSlug(bundle?.alternates ?? [], "af")
        ? af.bundle(publishedSlug(bundle?.alternates ?? [], "af") as string)
        : af.bundles,
    };
  }

  if (key === "guides" && slug) {
    const editorial = await getEditorial(current);
    const guide = await editorial.getGuideBySlug(slug);
    const enSlug = publishedSlug(guide?.alternates ?? [], "en");
    const afSlug = publishedSlug(guide?.alternates ?? [], "af");
    return {
      en: enSlug ? en.guide(enSlug) : en.guides,
      af: afSlug ? af.guide(afSlug) : af.guides,
    };
  }

  if (key === "recipes" && slug) {
    const editorial = await getEditorial(current);
    const recipe = await editorial.getRecipeBySlug(slug);
    const enSlug = publishedSlug(recipe?.alternates ?? [], "en");
    const afSlug = publishedSlug(recipe?.alternates ?? [], "af");
    return {
      en: enSlug ? en.recipe(enSlug) : en.recipes,
      af: afSlug ? af.recipe(afSlug) : af.recipes,
    };
  }

  const pathFor = (locale: AppLocale) => {
    const paths = createPaths(locale);
    switch (key) {
      case "shop":
        return paths.shop;
      case "bundles":
        return paths.bundles;
      case "about":
        return paths.about;
      case "delivery":
        return paths.delivery;
      case "contact":
        return paths.contact;
      case "faq":
        return paths.faq;
      case "guides":
        return paths.guides;
      case "recipes":
        return paths.recipes;
      case "cart":
        return paths.cart;
      case "checkout":
        return paths.checkout;
      case "orderConfirmation":
        return slug ? paths.orderConfirmation(slug) : paths.cart;
      default:
        return paths.home;
    }
  };

  return { en: pathFor("en"), af: pathFor("af") };
}

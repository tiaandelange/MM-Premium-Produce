import { createPaths } from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/config";
import type { LocaleAlternate } from "@/types/catalog";

export function editorialLocalePaths(
  kind: "guide" | "recipe",
  alternates: LocaleAlternate[],
  localeIndexable: Partial<Record<AppLocale, boolean>>,
) {
  const enAlt = alternates.find((item) => item.locale === "en" && item.status === "published");
  const afAlt = alternates.find((item) => item.locale === "af" && item.status === "published");
  const en = createPaths("en");
  const af = createPaths("af");
  const make = (locale: "en" | "af", slug: string) =>
    kind === "guide"
      ? locale === "en"
        ? en.guide(slug)
        : af.guide(slug)
      : locale === "en"
        ? en.recipe(slug)
        : af.recipe(slug);

  return {
    enPath: enAlt ? make("en", enAlt.slug) : undefined,
    afPath: afAlt && localeIndexable.af ? make("af", afAlt.slug) : undefined,
    enSwitch: enAlt ? make("en", enAlt.slug) : undefined,
    afSwitch: afAlt ? make("af", afAlt.slug) : undefined,
  };
}

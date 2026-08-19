import { localeMeta, type AppLocale } from "@/lib/i18n/config";

export type OrderLocaleTag = "en-ZA" | "af-ZA";

export function localeTagFromAppLocale(locale: AppLocale): OrderLocaleTag {
  return localeMeta[locale].htmlLang as OrderLocaleTag;
}

export function appLocaleFromTag(tag: string | null | undefined): AppLocale {
  return tag === "af-ZA" || tag === "af" ? "af" : "en";
}

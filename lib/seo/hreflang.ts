import { localeMeta, type AppLocale } from "@/lib/i18n/config";
import { createPaths } from "@/lib/i18n/paths";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

export type HrefLangAlternates = {
  en: string;
  af: string;
  "x-default": string;
};

export function buildHrefLangAlternates(paths: { en: string; af: string }): HrefLangAlternates {
  return {
    en: buildCanonicalUrl(paths.en),
    af: buildCanonicalUrl(paths.af),
    "x-default": buildCanonicalUrl(paths.en),
  };
}

export function metadataAlternates(input: {
  locale: AppLocale;
  canonicalPath: string;
  enPath?: string | null;
  afPath?: string | null;
}) {
  const languages: Record<string, string> = {};
  if (input.enPath) {
    languages[localeMeta.en.hreflang] = buildCanonicalUrl(input.enPath);
  }
  if (input.afPath) {
    languages[localeMeta.af.hreflang] = buildCanonicalUrl(input.afPath);
  }
  const xDefault = input.enPath || input.afPath;
  if (xDefault) {
    languages["x-default"] = buildCanonicalUrl(xDefault);
  }
  return {
    canonical: input.canonicalPath,
    languages,
  };
}

export function defaultLocaleHomePaths() {
  const en = createPaths("en");
  const af = createPaths("af");
  return { en: en.home, af: af.home };
}

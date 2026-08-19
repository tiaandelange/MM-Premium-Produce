export const locales = ["en", "af"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeCookieName = "mm-locale";

export const localeMeta: Record<
  AppLocale,
  { htmlLang: string; ogLocale: string; hreflang: string; label: string; shortLabel: string }
> = {
  en: {
    htmlLang: "en-ZA",
    ogLocale: "en_ZA",
    hreflang: "en-ZA",
    label: "English",
    shortLabel: "EN",
  },
  af: {
    htmlLang: "af-ZA",
    ogLocale: "af_ZA",
    hreflang: "af-ZA",
    label: "Afrikaans",
    shortLabel: "AF",
  },
};

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "af";
}

export function parseAppLocale(value?: string | null): AppLocale {
  return isAppLocale(value) ? value : defaultLocale;
}

export function localeCookie(value: AppLocale): string {
  return `${localeCookieName}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export const translationStatuses = ["draft", "ready", "published"] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

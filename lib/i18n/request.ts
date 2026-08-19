import { headers } from "next/headers";
import { defaultLocale, isAppLocale, parseAppLocale, type AppLocale } from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<AppLocale> {
  const headerList = await headers();
  const fromHeader = headerList.get("x-mm-locale");
  if (isAppLocale(fromHeader)) return fromHeader;
  return defaultLocale;
}

export async function getRequestPathname(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-mm-pathname") ?? "/";
}

export function localeFromParams(locale: string | undefined): AppLocale {
  if (!isAppLocale(locale)) return parseAppLocale(locale);
  return locale;
}

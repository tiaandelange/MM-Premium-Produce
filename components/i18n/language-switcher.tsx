"use client";

import Link from "next/link";
import { localeCookie, type AppLocale } from "@/lib/i18n/config";
import type { Route } from "next";

export function LanguageSwitcher({
  locale,
  enHref,
  afHref,
}: {
  locale: AppLocale;
  enHref: string;
  afHref: string;
}) {
  return (
    <nav aria-label="Language" className="language-switcher">
      <Link
        href={enHref as Route}
        hrefLang="en-ZA"
        lang="en-ZA"
        aria-current={locale === "en" ? "true" : undefined}
        className="language-switcher-option"
        onClick={() => {
          document.cookie = localeCookie("en");
        }}
      >
        EN
      </Link>
      <Link
        href={afHref as Route}
        hrefLang="af-ZA"
        lang="af-ZA"
        aria-current={locale === "af" ? "true" : undefined}
        className="language-switcher-option"
        onClick={() => {
          document.cookie = localeCookie("af");
        }}
      >
        AF
      </Link>
    </nav>
  );
}

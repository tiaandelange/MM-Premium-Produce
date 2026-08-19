"use client";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeOptions } from "@/components/theme/theme-switcher";
import { PreferencesIcon } from "@/components/layout/icons";
import type { AppLocale } from "@/lib/i18n/config";
import type { ThemePreference } from "@/lib/theme";

type UtilityProps = {
  locale: AppLocale;
  enHref: string;
  afHref: string;
  theme: ThemePreference;
  preferencesLabel: string;
  languageLabel: string;
  appearanceLabel: string;
  themeLabels: Record<ThemePreference, string>;
};

export function UtilityPanel({
  locale,
  enHref,
  afHref,
  theme,
  languageLabel,
  appearanceLabel,
  themeLabels,
}: Omit<UtilityProps, "preferencesLabel">) {
  return (
    <div className="utility-body">
      <p className="utility-label">{languageLabel}</p>
      <LanguageSwitcher locale={locale} enHref={enHref} afHref={afHref} />
      <p className="utility-label">{appearanceLabel}</p>
      <ThemeOptions theme={theme} labels={themeLabels} groupLabel={appearanceLabel} />
    </div>
  );
}

export function HeaderUtilities(props: UtilityProps) {
  return (
    <details className="utility-menu">
      <summary className="btn-icon" aria-label={props.preferencesLabel}>
        <PreferencesIcon />
      </summary>
      <div className="utility-panel">
        <UtilityPanel {...props} />
      </div>
    </details>
  );
}

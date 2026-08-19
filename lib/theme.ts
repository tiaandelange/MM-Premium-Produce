export const THEME_COOKIE = "mm-theme";

export const themePreferences = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof themePreferences)[number];

export function parseThemePreference(value?: string | null): ThemePreference {
  if (value === "dark" || value === "light" || value === "system") return value;
  return "system";
}

export function themeCookie(value: ThemePreference): string {
  return `${THEME_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

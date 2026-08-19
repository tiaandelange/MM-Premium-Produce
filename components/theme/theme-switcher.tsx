"use client";

import { useState } from "react";
import { themeCookie, type ThemePreference } from "@/lib/theme";

function applyTheme(theme: ThemePreference) {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = themeCookie(theme);
}

const options: ThemePreference[] = ["light", "dark", "system"];

export function ThemeOptions({
  theme,
  labels,
  groupLabel,
}: {
  theme: ThemePreference;
  labels: Record<ThemePreference, string>;
  groupLabel: string;
}) {
  const [current, setCurrent] = useState(theme);

  return (
    <div className="theme-options" role="group" aria-label={groupLabel}>
      {options.map((value) => (
        <button
          key={value}
          type="button"
          className="theme-option"
          aria-pressed={current === value}
          onClick={() => {
            setCurrent(value);
            applyTheme(value);
          }}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}

export function ThemeSwitcher({ theme }: { theme: ThemePreference }) {
  return (
    <ThemeOptions
      theme={theme}
      groupLabel="Appearance"
      labels={{ light: "Light", dark: "Dark", system: "System" }}
    />
  );
}

"use client";

import { useState } from "react";

export function LocaleTabs({
  english,
  afrikaans,
}: {
  english: React.ReactNode;
  afrikaans: React.ReactNode;
}) {
  const [locale, setLocale] = useState<"en" | "af">("en");

  return (
    <div>
      <div role="tablist" aria-label="Translation language" className="locale-tabs">
        <button
          type="button"
          role="tab"
          aria-selected={locale === "en"}
          className="locale-tab"
          onClick={() => setLocale("en")}
        >
          English
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={locale === "af"}
          className="locale-tab"
          onClick={() => setLocale("af")}
        >
          Afrikaans
        </button>
      </div>
      <div hidden={locale !== "en"}>{english}</div>
      <div hidden={locale !== "af"}>{afrikaans}</div>
    </div>
  );
}

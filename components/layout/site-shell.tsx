import { SiteFooter } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import type { AppLocale } from "@/lib/i18n/config";

export function SiteShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: AppLocale;
}) {
  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

import { cookies } from "next/headers";
import { SiteFooter } from "@/components/layout/footer";
import { SiteHeader } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { AnalyticsRoot } from "@/components/analytics/analytics-root";
import { ANALYTICS_CONSENT_COOKIE } from "@/lib/analytics/events";
import type { AppLocale } from "@/lib/i18n/config";

export async function SiteShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: AppLocale;
}) {
  const consentValue = (await cookies()).get(ANALYTICS_CONSENT_COOKIE)?.value;
  const consent = consentValue === "granted" || consentValue === "denied" ? consentValue : null;

  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <AnalyticsRoot locale={locale} consent={consent} />
    </>
  );
}

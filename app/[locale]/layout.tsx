import { SiteShell } from "@/components/layout/site-shell";
import { requireLocale } from "@/lib/i18n/locale";
import { locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return <SiteShell locale={requireLocale(locale)}>{children}</SiteShell>;
}

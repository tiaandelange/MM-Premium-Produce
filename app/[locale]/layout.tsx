import { SiteShell } from "@/components/layout/site-shell";
import { requireLocale } from "@/lib/i18n/locale";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return <SiteShell locale={requireLocale(locale)}>{children}</SiteShell>;
}

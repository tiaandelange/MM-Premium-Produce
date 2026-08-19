import { requireLocale } from "@/lib/i18n/locale";
import { createPaths } from "@/lib/i18n/paths";
import { permanentRedirect } from "next/navigation";
import type { Route } from "next";

export const dynamic = "force-dynamic";

export default async function ProductsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  permanentRedirect(createPaths(locale).shop as Route);
}

import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export function requireLocale(value: string | undefined): AppLocale {
  if (!isAppLocale(value)) notFound();
  return value;
}

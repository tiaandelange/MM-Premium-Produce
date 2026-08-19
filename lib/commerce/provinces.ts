import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";

const provinceKeys = [
  "saProvinceEasternCape",
  "saProvinceFreeState",
  "saProvinceGauteng",
  "saProvinceKwaZuluNatal",
  "saProvinceLimpopo",
  "saProvinceMpumalanga",
  "saProvinceNorthernCape",
  "saProvinceNorthWest",
  "saProvinceWesternCape",
] as const;

export function saProvinceOptions(locale: AppLocale): string[] {
  const messages = getMessages(locale);
  return provinceKeys.map((key) => messages[key]);
}

import { confirmedValue, getSiteConfig } from "@/config/site";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";
import type { DeliveryScope } from "@/types/site";

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

const gautengOnlyKeys = ["saProvinceGauteng"] as const;

export function saProvinceOptions(
  locale: AppLocale,
  scope: DeliveryScope | null = confirmedValue(getSiteConfig().deliveryScope),
): string[] {
  const messages = getMessages(locale);
  const keys = scope === "gauteng" ? gautengOnlyKeys : provinceKeys;
  return keys.map((key) => messages[key]);
}

/** Accepts localised Gauteng label or common English/abbreviation forms. */
export function isAllowedDeliveryProvince(
  value: string | null | undefined,
  locale: AppLocale,
  scope: DeliveryScope | null = confirmedValue(getSiteConfig().deliveryScope),
): boolean {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return false;
  if (scope !== "gauteng") return true;
  const gauteng = getMessages(locale).saProvinceGauteng.toLowerCase();
  const normalized = trimmed.toLowerCase();
  return normalized === gauteng || normalized === "gauteng" || normalized === "gp";
}

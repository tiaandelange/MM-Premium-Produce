import { getMessages, interpolate, type Messages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";
import { COMMERCE_ERROR_KEYS, type CommerceErrorKey } from "@/lib/commerce/status";

export function isCommerceErrorKey(value: string | undefined | null): value is CommerceErrorKey {
  return Boolean(value && COMMERCE_ERROR_KEYS.includes(value as CommerceErrorKey));
}

export function commerceErrorText(
  locale: AppLocale,
  key: CommerceErrorKey,
  values?: Record<string, string>,
): string {
  const messages = getMessages(locale);
  const template = messages[key as keyof Messages];
  if (typeof template !== "string") return messages.cartError;
  return values ? interpolate(template, values) : template;
}

export function resolveCommerceNotice(locale: AppLocale, value: string | null | undefined): string | null {
  if (!value) return null;
  if (value === "addedToCart") return getMessages(locale).addedToCart;
  if (value === "validation") return getMessages(locale).requiredField;
  if (isCommerceErrorKey(value)) return commerceErrorText(locale, value);
  return getMessages(locale).cartError;
}

import { resolveCommerceNotice } from "@/lib/commerce/errors";
import { readCartNotice } from "@/lib/commerce/cart-notice";
import type { AppLocale } from "@/lib/i18n/config";

export async function CartNotice({ locale }: { locale: AppLocale }) {
  const value = await readCartNotice();
  const notice = resolveCommerceNotice(locale, value);
  if (!notice) return null;
  return (
    <p className={value === "addedToCart" ? "text-sm text-leaf" : "text-sm text-danger"} role="status">
      {notice}
    </p>
  );
}

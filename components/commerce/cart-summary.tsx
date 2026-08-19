import Link from "next/link";
import { PriceDisplay } from "@/components/commerce/price-display";
import { createPaths } from "@/lib/i18n/paths";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";
import type { HydratedCart } from "@/types/commerce";

export function CartSummary({
  cart,
  locale,
  checkout = true,
}: {
  cart: HydratedCart;
  locale: AppLocale;
  checkout?: boolean;
}) {
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="font-heading text-section-title text-ink">
        {messages.subtotal}: {cart.subtotal ? <PriceDisplay price={cart.subtotal} locale={locale} /> : null}
      </p>
      <div className="flex gap-3">
        <Link href={paths.shop} className="btn-secondary">
          {messages.continueShopping}
        </Link>
        {checkout ? (
          cart.hasErrors ? (
            <p className="btn-disabled inline-flex" aria-disabled="true">
              {messages.fixCartBeforeCheckout}
            </p>
          ) : (
            <Link href={paths.checkout} className="btn-primary">
              {messages.proceedToCheckout}
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}

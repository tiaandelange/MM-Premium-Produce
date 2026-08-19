import Link from "next/link";
import { CartItem } from "@/components/commerce/cart-item";
import { CartSummary } from "@/components/commerce/cart-summary";
import { createPaths } from "@/lib/i18n/paths";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";
import type { HydratedCart } from "@/types/commerce";

export function CartContents({
  cart,
  locale,
  showCheckout = true,
}: {
  cart: HydratedCart;
  locale: AppLocale;
  showCheckout?: boolean;
}) {
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  if (!cart.items.length) {
    return (
      <div className="space-y-4">
        <p className="text-muted">{messages.emptyCart}</p>
        <Link href={paths.shop} className="btn-primary">
          {messages.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {cart.items.map((item) => (
          <CartItem key={item.key} item={item} locale={locale} />
        ))}
      </ul>
      <CartSummary cart={cart} locale={locale} checkout={showCheckout} />
    </div>
  );
}

export const CartPanel = CartContents;

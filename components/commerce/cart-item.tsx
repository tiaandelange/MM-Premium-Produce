import Link from "next/link";
import { CatalogMedia } from "@/components/commerce/catalog-media";
import { PriceDisplay } from "@/components/commerce/price-display";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { RemoveFromCartForm } from "@/components/commerce/remove-from-cart-form";
import { createPaths } from "@/lib/i18n/paths";
import { commerceErrorText } from "@/lib/commerce/errors";
import { analyticsItemFromCartLine } from "@/lib/analytics/items";
import { getMessages } from "@/lib/i18n/messages";
import { formatMoney } from "@/lib/utils/format";
import type { AppLocale } from "@/lib/i18n/config";
import type { HydratedCartLine } from "@/types/commerce";

export function CartItem({ item, locale }: { item: HydratedCartLine; locale: AppLocale }) {
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const name = item.name || messages.itemNoLongerAvailable;
  const error = item.errorKey ? commerceErrorText(locale, item.errorKey, item.errorValues) : null;

  return (
    <li className="grid gap-4 p-4 sm:grid-cols-[80px_minmax(0,1fr)_auto]">
      <div className="relative h-20 w-20 overflow-hidden rounded-sm bg-sand">
        <CatalogMedia image={item.image} className="object-contain p-1" />
      </div>
      <div>
        {item.slug ? (
          <Link href={paths.product(item.slug)} className="font-heading text-card-title text-ink">
            {name}
          </Link>
        ) : (
          <p className="font-heading text-card-title text-ink">{name}</p>
        )}
        {item.variantName ? <p className="text-sm text-muted">{item.variantName}</p> : null}
        {error ? <p className="mt-1 text-sm text-danger">{error}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-3">
                <form action="/api/cart" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="intent" value="update" />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="productId" value={item.productId} />
            <input type="hidden" name="variantId" value={item.variantId ?? ""} />
            <QuantitySelector
              label={messages.quantity}
              max={item.maxQuantity || 1}
              defaultValue={item.quantity}
            />
            <button type="submit" className="text-sm font-medium text-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf">
              {messages.update}
            </button>
          </form>
          <RemoveFromCartForm
            locale={locale}
            productId={item.productId}
            variantId={item.variantId}
            label={messages.remove}
            currency={item.unitPrice?.currency ?? "ZAR"}
            value={item.lineTotal?.amount}
            item={analyticsItemFromCartLine(item)}
          />

        </div>
      </div>
      <div className="text-right">
        {item.unitPrice ? (
          <PriceDisplay price={item.unitPrice} compact locale={locale} unit={item.priceUnit} />
        ) : null}
        {item.lineTotal && item.quantity > 1 ? (
          <p className="mt-1 text-sm text-muted">{formatMoney(item.lineTotal, locale)}</p>
        ) : null}
      </div>
    </li>
  );
}

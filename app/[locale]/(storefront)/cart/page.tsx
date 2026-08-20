import { CartContents } from "@/components/commerce/cart-contents";
import { PageHeader } from "@/components/layout/page-header";
import { PageIntro, PageSection } from "@/components/layout/page-intro";
import { requireLocale } from "@/lib/i18n/locale";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { resolveCommerceNotice } from "@/lib/commerce/errors";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHydratedCart } from "@/services/cart";
import { TrackViewCart } from "@/components/analytics/track-event";
import { analyticsItemsFromCart, analyticsValue } from "@/lib/analytics/items";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return buildMetadata({
    title: messages.yourCart,
    description: messages.emptyCart,
    path: paths.cart,
    locale,
    enPath: createPaths("en").cart,
    afPath: createPaths("af").cart,
    indexable: false,
    followWhenNoindex: true,
  });
}

export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = requireLocale((await params).locale);
  const query = await searchParams;
  const messages = getMessages(locale);
  const cart = await getHydratedCart(locale);
  const error = resolveCommerceNotice(locale, typeof query.error === "string" ? query.error : null);
  const added = query.added === "1";

  return (
    <div className="commerce-page">
      <PageIntro>
        <PageHeader title={messages.yourCart} />
      </PageIntro>
      <PageSection>
        <TrackViewCart
          items={analyticsItemsFromCart(cart)}
          value={analyticsValue(analyticsItemsFromCart(cart))}
          currency={cart.currency}
        />
        {added ? <p className="mb-4 text-sm text-leaf">{messages.addedToCart}</p> : null}
        {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
        <CartContents cart={cart} locale={locale} />
      </PageSection>
    </div>
  );
}

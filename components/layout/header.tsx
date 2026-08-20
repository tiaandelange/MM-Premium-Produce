import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { ComingSoonNavLink } from "@/components/layout/coming-soon-nav-link";
import { HeaderUtilities, UtilityPanel } from "@/components/layout/header-utilities";
import { MenuIcon } from "@/components/layout/icons";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CartContents } from "@/components/commerce/cart-contents";
import type { AppLocale } from "@/lib/i18n/config";
import { getMessages, interpolate } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { resolveLanguageHrefs } from "@/lib/i18n/switch";
import { getRequestPathname } from "@/lib/i18n/request";
import { getThemePreference } from "@/lib/theme-server";
import { getCatalog } from "@/services/catalog";
import { getHydratedCart } from "@/services/cart";
import { analyticsItemsFromCart } from "@/lib/analytics/items";
import type { Route } from "next";

type NavItem =
  | { href: Route; label: string; comingSoon?: undefined }
  | { href: Route; label: string; comingSoon: string };

export async function SiteHeader({ locale }: { locale: AppLocale }) {
  const theme = await getThemePreference();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const pathname = await getRequestPathname();
  const alternates = await resolveLanguageHrefs(pathname, locale);
  const catalog = await getCatalog(locale);
  const [categories, cart] = await Promise.all([catalog.listCategories(), getHydratedCart(locale)]);
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const vegetables = categories.find((category) => category.id === "cat_vegetables");

  const nav: Array<NavItem | null> = [
    { href: paths.shop, label: messages.shop },
    fruit ? { href: paths.category(fruit.slug), label: fruit.name } : null,
    vegetables ? { href: paths.category(vegetables.slug), label: vegetables.name } : null,
    { href: paths.bundles, label: messages.produceBoxes, comingSoon: messages.comingSoon },
    { href: paths.about, label: messages.ourStory },
  ];
  const primaryNav = nav.filter((item): item is NavItem => Boolean(item));

  const utilityProps = {
    locale,
    enHref: alternates.en,
    afHref: alternates.af,
    theme,
    preferencesLabel: messages.preferences,
    languageLabel: messages.language,
    appearanceLabel: messages.appearance,
    themeLabels: {
      light: messages.themeLight,
      dark: messages.themeDark,
      system: messages.themeSystem,
    },
  };

  const cartControl = (
    <CartDrawer
      label={messages.cart}
      countLabel={interpolate(messages.itemsInCart, { count: String(cart.itemCount) })}
      count={cart.itemCount}
      closeLabel={messages.close}
      cartItems={analyticsItemsFromCart(cart)}
      cartValue={cart.subtotal?.amount}
      cartCurrency={cart.currency}
    >
      <CartContents cart={cart} locale={locale} />
    </CartDrawer>
  );

  function renderNavLink(item: NavItem) {
    if (item.comingSoon) {
      return (
        <ComingSoonNavLink
          href={item.href}
          label={item.label}
          status={item.comingSoon}
          current={pathname === item.href}
        />
      );
    }
    return (
      <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <details className="mobile-nav lg:hidden">
          <summary className="btn-icon" aria-label={messages.menu}>
            <MenuIcon />
          </summary>
          <div className="mobile-nav-panel">
            <nav aria-label="Primary mobile">
              <ul>
                {primaryNav.map((item) => (
                  <li key={item.href}>{renderNavLink(item)}</li>
                ))}
                <li>
                  <Link href={paths.delivery}>{messages.delivery}</Link>
                </li>
                <li>
                  <Link href={paths.contact}>{messages.contact}</Link>
                </li>
              </ul>
            </nav>
            <div className="mobile-nav-utilities">
              <UtilityPanel {...utilityProps} />
            </div>
          </div>
        </details>

        <Link href={paths.home} className="site-logo text-ink hover:text-ink">
          <Wordmark compact />
        </Link>

        <nav aria-label="Primary" className="site-nav">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>{renderNavLink(item)}</li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          {cartControl}
          <div className="hidden lg:block">
            <HeaderUtilities {...utilityProps} />
          </div>
        </div>
      </div>
    </header>
  );
}

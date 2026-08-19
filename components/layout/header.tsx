import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
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

  const nav = [
    { href: paths.shop, label: messages.shop },
    fruit ? { href: paths.category(fruit.slug), label: fruit.name } : null,
    vegetables ? { href: paths.category(vegetables.slug), label: vegetables.name } : null,
    { href: paths.bundles, label: messages.produceBoxes },
    { href: paths.about, label: messages.ourStory },
  ].filter((item): item is { href: typeof paths.shop; label: string } => Boolean(item));

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
    >
      <CartContents cart={cart} locale={locale} />
    </CartDrawer>
  );

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
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
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
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
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

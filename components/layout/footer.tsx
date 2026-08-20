import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { getSiteConfig } from "@/config/site";
import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getCatalog } from "@/services/catalog";

export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const { businessName } = getSiteConfig();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const catalog = await getCatalog(locale);
  const categories = await catalog.listCategories();
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const footerNav = [
    { href: paths.shop, label: messages.shop },
    fruit ? { href: paths.category(fruit.slug), label: fruit.name } : null,
    vegetables ? { href: paths.category(vegetables.slug), label: vegetables.name } : null,
    { href: paths.bundles, label: `${messages.produceBoxes} · ${messages.comingSoon}` },
    { href: paths.about, label: messages.about },
    { href: paths.delivery, label: messages.delivery },
    { href: paths.faq, label: messages.faq },
    { href: paths.guides, label: messages.guides },
    { href: paths.recipes, label: messages.recipes },
    { href: paths.contact, label: messages.contact },
    { href: paths.privacy, label: messages.privacy },
    { href: paths.terms, label: messages.termsOfSale },
    { href: paths.returns, label: messages.deliveryAndReturns },
  ].filter((item): item is { href: typeof paths.shop; label: string } => Boolean(item));

  return (
    <footer className="site-footer band-ink mt-auto">
      <div className="site-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Wordmark inverse />
          <p className="mt-4 max-w-sm text-sm text-inverse-muted">{messages.footerTagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-label font-semibold uppercase tracking-[0.16em] text-inverse-muted">
            {messages.shop}
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-label font-semibold uppercase tracking-[0.16em] text-inverse-muted">
            {messages.contact}
          </p>
          <p className="mt-4 text-sm text-inverse-muted">
            {messages.footerContactNote}{" "}
            <Link href={paths.contact}>{messages.openContactPage}</Link>. {messages.legalFollow}
          </p>
        </div>
      </div>
      <div className="border-t border-line-strong/30">
        <p className="site-container py-4 text-sm text-inverse-muted">
          © {new Date().getFullYear()} {businessName}
        </p>
      </div>
    </footer>
  );
}

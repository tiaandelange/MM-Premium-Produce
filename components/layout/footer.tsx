import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { ComingSoonNavLink } from "@/components/layout/coming-soon-nav-link";
import { confirmedValue, getSiteConfig } from "@/config/site";
import type { AppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getCatalog } from "@/services/catalog";
import type { Route } from "next";

type FooterNavItem =
  | { href: Route; label: string; comingSoon?: undefined }
  | { href: Route; label: string; comingSoon: string };

export async function SiteFooter({ locale }: { locale: AppLocale }) {
  const site = getSiteConfig();
  const { businessName } = site;
  const email = confirmedValue(site.email);
  const whatsapp = confirmedValue(site.whatsapp);
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  const catalog = await getCatalog(locale);
  const categories = await catalog.listCategories();
  const fruit = categories.find((category) => category.id === "cat_fruit");
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const footerNav: Array<FooterNavItem | null> = [
    { href: paths.shop, label: messages.shop },
    fruit ? { href: paths.category(fruit.slug), label: fruit.name } : null,
    vegetables ? { href: paths.category(vegetables.slug), label: vegetables.name } : null,
    { href: paths.bundles, label: messages.produceBoxes, comingSoon: messages.comingSoon },
    { href: paths.about, label: messages.about },
    { href: paths.delivery, label: messages.delivery },
    { href: paths.faq, label: messages.faq },
    { href: paths.guides, label: messages.guides },
    { href: paths.recipes, label: messages.recipes },
    { href: paths.contact, label: messages.contact },
    { href: paths.privacy, label: messages.privacy },
    { href: paths.terms, label: messages.termsOfSale },
    { href: paths.returns, label: messages.deliveryAndReturns },
  ];
  const links = footerNav.filter((item): item is FooterNavItem => Boolean(item));

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
            {links.map((item) => (
              <li key={item.href}>
                {item.comingSoon ? (
                  <ComingSoonNavLink href={item.href} label={item.label} status={item.comingSoon} />
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-label font-semibold uppercase tracking-[0.16em] text-inverse-muted">
            {messages.contact}
          </p>
          <div className="mt-4 space-y-2 text-sm text-inverse-muted">
            {email ? (
              <p>
                <a href={`mailto:${email}`}>{email}</a>
              </p>
            ) : null}
            {whatsapp ? (
              <p>
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} rel="noopener noreferrer" target="_blank">
                  {messages.whatsapp}: {whatsapp}
                </a>
              </p>
            ) : null}
            <p>
              {messages.footerContactNote}{" "}
              <Link href={paths.contact} className="underline underline-offset-2">
                {messages.openContactPage}
              </Link>
              . {messages.legalFollow}
            </p>
          </div>
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

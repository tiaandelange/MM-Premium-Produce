import Link from "next/link";
import { categories } from "@/data/categories";
import { pageCopy } from "@/lib/i18n/pages";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/config";

export function HomeHero({ locale }: { locale: AppLocale }) {
  const messages = getMessages(locale);
  const copy = pageCopy[locale].home;
  const paths = createPaths(locale);
  const lines = copy.heroLines;
  const vegetables = categories.find((category) => category.id === "cat_vegetables");
  const vegetablesSlug =
    vegetables?.alternates.find((item) => item.locale === locale && item.status === "published")?.slug ??
    vegetables?.slug ??
    "vegetables";

  return (
    <section className="hero" aria-labelledby="home-hero-heading">
      <div className="hero-media">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/hero1-828.webp" type="image/webp" />
          <source media="(max-width: 1280px)" srcSet="/images/hero/hero1-1280.webp" type="image/webp" />
          <img
            src="/images/hero/hero1-1920.webp"
            srcSet="/images/hero/hero1-828.webp 828w, /images/hero/hero1-1280.webp 1280w, /images/hero/hero1-1920.webp 1920w"
            sizes="100vw"
            width={1920}
            height={1080}
            alt={messages.heroImageAlt}
            fetchPriority="high"
            decoding="async"
            className="hero-image"
          />
        </picture>
      </div>
      <div className="hero-fade" aria-hidden="true" />
      <div className="hero-copy-wrap site-container">
        <div className="hero-copy">
          <h1 id="home-hero-heading" className="hero-title">
            {lines?.length ? (
              lines.map((line, index) => (
                <span key={`${line.text}-${index}`} className={`hero-line hero-line-${line.tone}`}>
                  {line.text}
                </span>
              ))
            ) : (
              copy.h1
            )}
          </h1>
          <p className="hero-intro">{copy.intro}</p>
          <div className="hero-actions">
            <Link href={paths.shop} className="btn-hero-primary">
              {messages.shopFreshProduce}
            </Link>
            <Link href={paths.category(vegetablesSlug)} className="btn-hero-secondary">
              {messages.shopVegetables}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

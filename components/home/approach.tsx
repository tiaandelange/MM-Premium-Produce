import { DeliveryVanIcon } from "@/components/layout/icons";
import { pageCopy } from "@/lib/i18n/pages";
import type { AppLocale } from "@/lib/i18n/config";

export function HomeApproach({ locale }: { locale: AppLocale }) {
  const copy = pageCopy[locale].home.approach;

  if (!copy) {
    return null;
  }

  return (
    <section className="home-approach" aria-labelledby="home-approach-heading">
      <div className="site-container home-approach-inner">
        <div className="home-approach-story">
          <p className="home-approach-eyebrow">{copy.eyebrow}</p>
          <h2 id="home-approach-heading" className="home-approach-title">
            <span className="home-approach-title-main">{copy.heading}</span>
            <span className="home-approach-title-accent">{copy.headingAccent}</span>
          </h2>
          <p className="home-approach-body">{copy.body}</p>
        </div>

        <aside className="home-approach-delivery" aria-labelledby="home-delivery-heading">
          <DeliveryVanIcon />
          <p className="home-approach-delivery-eyebrow">{copy.delivery.eyebrow}</p>
          <h3 id="home-delivery-heading" className="home-approach-delivery-title">
            {copy.delivery.title}
          </h3>
          <p className="home-approach-delivery-body">{copy.delivery.body}</p>
        </aside>

        <ul className="home-approach-points">
          {copy.points.map((point) => (
            <li key={point.title} className="home-approach-point">
              <p className="home-approach-point-title">{point.title}</p>
              <p className="home-approach-point-body">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

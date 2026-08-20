import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

export function HomeCatalogue({
  heading,
  shopHref,
  shopLabel,
  children,
}: {
  heading: string;
  shopHref: Route;
  shopLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="home-catalogue" aria-labelledby="home-catalogue-heading">
      <div className="site-container">
        <div className="home-catalogue-heading">
          <h2 id="home-catalogue-heading" className="text-section-title">
            {heading}
          </h2>
          <Link href={shopHref} className="home-catalogue-shop-link text-sm font-medium">
            {shopLabel}
          </Link>
        </div>
        <div className="home-catalogue-grid">{children}</div>
      </div>
    </section>
  );
}

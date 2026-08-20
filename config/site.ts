import { getSiteUrl } from "@/config/env";
import type { ConfigurableField, SiteConfig } from "@/types/site";

function todo<T>(note: string): ConfigurableField<T> {
  return { status: "todo", value: null, note };
}

function confirmed<T>(value: T, note?: string): ConfigurableField<T> {
  return { status: "confirmed", value, note };
}

export function getSiteConfig(): SiteConfig {
  return {
    businessName: "M & M Premium Produce",
    legalName: todo("Confirm the registered legal entity name."),
    siteUrl: getSiteUrl(),
    defaultTitle: "M & M Premium Produce",
    defaultDescription:
      "Shop personally handpicked fresh fruit and vegetables from M & M Premium Produce. Quality does matter.",
    locale: "en",
    country: todo("Confirm country of operation before using local business or geo copy."),
    currency: confirmed("ZAR", "Shopify store currency."),
    email: todo("Confirm a public contact email before displaying it."),
    phone: todo("Confirm a public phone number before displaying it."),
    address: todo("Confirm a public address before using LocalBusiness schema or map copy."),
    deliveryScope: confirmed("nationwide", "Nationwide delivery across South Africa is confirmed."),
    deliveryAreas: todo("Confirm delivery or collection areas before publishing them."),
    socialProfiles: todo("Confirm official social profile URLs before adding sameAs markup."),
    logoPath: "/brand/mm-premium-produce-logo.png",
    defaultOgImagePath: "/opengraph-image",
  };
}

export function confirmedValue<T>(field: ConfigurableField<T>): T | null {
  return field.status === "confirmed" ? field.value : null;
}

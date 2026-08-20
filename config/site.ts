import { getSiteUrl } from "@/config/env";
import type { ConfigurableField, SiteConfig } from "@/types/site";

function todo<T>(note: string): ConfigurableField<T> {
  return { status: "todo", value: null, note };
}

function confirmed<T>(value: T, note?: string): ConfigurableField<T> {
  return { status: "confirmed", value, note };
}

/**
 * Central business details. Confirm fields once here — storefront pages read
 * only `confirmed` values and never invent missing contact data.
 */
export function getSiteConfig(): SiteConfig {
  return {
    businessName: "M & M Premium Produce",
    legalName: todo("Confirm the registered legal entity name."),
    tradingName: confirmed("M & M Premium Produce", "Public trading name."),
    siteUrl: getSiteUrl(),
    defaultTitle: "M & M Premium Produce",
    defaultDescription:
      "Shop personally handpicked fresh fruit and vegetables from M & M Premium Produce. Quality does matter.",
    locale: "en",
    country: todo("Confirm country of operation before using local business or geo copy."),
    currency: confirmed("ZAR", "Store currency."),
    email: todo("Confirm a monitored public contact email before displaying it."),
    phone: todo("Confirm a public phone number before displaying it."),
    whatsapp: todo("Confirm a public WhatsApp number before displaying it."),
    address: todo("Confirm a public address before using LocalBusiness schema or map copy."),
    supportHours: todo("Confirm customer-support hours before publishing them."),
    deliveryScope: confirmed("nationwide", "Nationwide delivery across South Africa is confirmed."),
    deliveryAreas: todo("Confirm delivery or collection areas and fees before publishing them."),
    socialProfiles: todo("Confirm official social profile URLs before adding sameAs markup."),
    logoPath: "/brand/mm-premium-produce-logo.png",
    defaultOgImagePath: "/opengraph-image",
  };
}

export function confirmedValue<T>(field: ConfigurableField<T>): T | null {
  return field.status === "confirmed" ? field.value : null;
}

export function ownerDetailsStillRequired(): string[] {
  const site = getSiteConfig();
  const required: Array<[string, ConfigurableField<unknown>]> = [
    ["Registered legal name", site.legalName],
    ["Public email", site.email],
    ["Public phone", site.phone],
    ["WhatsApp", site.whatsapp],
    ["Public address", site.address],
    ["Support hours", site.supportHours],
    ["Country", site.country],
    ["Delivery areas / fees", site.deliveryAreas],
    ["Social profile URLs", site.socialProfiles],
  ];
  return required.filter(([, field]) => field.status === "todo").map(([label, field]) => `${label}: ${field.note}`);
}

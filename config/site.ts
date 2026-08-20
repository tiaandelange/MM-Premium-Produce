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
    legalName: confirmed("Beloofdeland Vervoer", "Registered legal entity."),
    tradingName: confirmed("M&M Premium Produce", "Public trading name."),
    founders: confirmed(
      "Meagan Pelzer and Marthinus Erasmus",
      "Owner-operators building a family business together.",
    ),
    siteUrl: getSiteUrl(),
    defaultTitle: "M & M Premium Produce",
    defaultDescription:
      "Shop personally handpicked fresh fruit and vegetables from M & M Premium Produce. Owner delivery across Gauteng. Quality does matter.",
    locale: "en",
    country: confirmed("South Africa", "Country of operation."),
    currency: confirmed("ZAR", "Store currency."),
    email: confirmed("hello@mmpp.co.za", "Monitored public contact email."),
    phone: confirmed("+27 82 603 8288", "Public phone number."),
    whatsapp: confirmed("+27 82 603 8288", "Public WhatsApp number."),
    publishPublicAddress: false,
    address: todo("Owner decision: do not display a physical address publicly."),
    supportHours: todo("Confirm published support hours if customers should see them."),
    deliveryScope: confirmed("gauteng", "Owner delivery within Gauteng."),
    deliveryPolicy: confirmed(
      {
        coverage: "Gauteng",
        method: "Owner delivery",
        timeframe: "1–3 business days",
        feeZar: 35,
        freeDeliveryThresholdZar: 500,
        exclusions: "Outside Gauteng",
        maxDistanceKm: 100,
      },
      "Confirmed Gauteng delivery terms.",
    ),
    deliveryAreas: confirmed(["Gauteng"], "Service area for owner delivery."),
    paymentPolicy: confirmed(
      {
        currentMethods: ["eft"],
        onlineCardStatus: "planned",
        note: "Orders are confirmed with manual EFT. Online card payments may be added later.",
      },
      "Manual EFT for now; card payments planned later.",
    ),
    returnsPolicy: confirmed(
      {
        cancellationWindowHours: 6,
        damagedOrIncorrect: "Report damaged or incorrect produce promptly so we can arrange a return or replacement.",
        wrongOrderRemedy: "Wrong orders are remedied with a refund or replacement.",
        nonReturnable:
          "Fresh produce that arrives in good condition is non-refundable because of its perishable nature.",
      },
      "Owner-provided cancellation and returns approach for fresh produce.",
    ),
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
    ["Support hours", site.supportHours],
    ["Social profile URLs", site.socialProfiles],
  ];
  if (site.publishPublicAddress) {
    required.unshift(["Public address", site.address]);
  }
  return required.filter(([, field]) => field.status === "todo").map(([label, field]) => `${label}: ${field.note}`);
}

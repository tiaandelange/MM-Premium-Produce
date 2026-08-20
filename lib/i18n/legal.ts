import type { AppLocale } from "@/lib/i18n/config";

export type LegalPageKey = "privacy" | "terms" | "returns";

export type LegalPageCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{ heading: string; body: string[]; reviewRequired?: boolean }>;
};

/**
 * Draft legal shells only. Owner/legal review required before treating as published policy.
 */
export const legalCopy: Record<AppLocale, Record<LegalPageKey, LegalPageCopy>> = {
  en: {
    privacy: {
      title: "Privacy",
      description: "Draft privacy information for M & M Premium Produce.",
      h1: "Privacy",
      intro: "How we intend to handle personal information when orders and contact details are collected.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "When you place an order we collect the contact and delivery details you submit so we can fulfil that order.",
            "Optional analytics may run only after consent. Analytics do not include your name, email, phone or address.",
          ],
          reviewRequired: true,
        },
        {
          heading: "POPIA contact",
          body: [
            "Once a public privacy contact is confirmed, it will be listed here for POPIA-related requests.",
          ],
          reviewRequired: true,
        },
      ],
    },
    terms: {
      title: "Terms of sale",
      description: "Draft terms of sale for M & M Premium Produce.",
      h1: "Terms of sale",
      intro: "These draft clauses describe how orders are intended to work. They require owner or legal review before publication as final terms.",
      sections: [
        {
          heading: "Orders",
          body: [
            "Orders are recorded through the website and confirmed manually until online payment is configured.",
            "Availability and pack sizes are as shown on each product page at the time of order.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Pricing",
          body: [
            "Selling prices are shown in South African rand. Pack size is shown separately from any comparison rate.",
            "Products without a confirmed selling price cannot be purchased.",
          ],
          reviewRequired: true,
        },
      ],
    },
    returns: {
      title: "Delivery and returns",
      description: "Draft delivery and returns information for M & M Premium Produce.",
      h1: "Delivery and returns",
      intro: "Nationwide delivery is offered across South Africa. Detailed areas, fees and return handling still need owner confirmation.",
      sections: [
        {
          heading: "Delivery",
          body: [
            "We offer delivery across South Africa. Published areas, timing and fees will appear on the delivery page once confirmed.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Returns and refunds",
          body: [
            "Fresh produce returns and refund handling must be confirmed by the owner before this section is treated as final policy.",
          ],
          reviewRequired: true,
        },
      ],
    },
  },
  af: {
    privacy: {
      title: "Privaatheid",
      description: "Konsep-privaatheidinligting vir M & M Premium Produce.",
      h1: "Privaatheid",
      intro: "Hoe ons van plan is om persoonlike inligting te hanteer wanneer bestellings en kontakbesonderhede ingesamel word.",
      sections: [
        {
          heading: "Wat ons versamel",
          body: [
            "Wanneer jy ’n bestelling plaas, versamel ons die kontak- en afleweringsbesonderhede wat jy indien sodat ons die bestelling kan uitvoer.",
            "Opsionele ontleding loop slegs ná toestemming. Ontleding sluit nie jou naam, e-pos, telefoon of adres in nie.",
          ],
          reviewRequired: true,
        },
        {
          heading: "POPIA-kontak",
          body: [
            "Sodra ’n openbare privaatheidskontak bevestig is, sal dit hier verskyn vir POPIA-versoeke.",
          ],
          reviewRequired: true,
        },
      ],
    },
    terms: {
      title: "Verkoopvoorwaardes",
      description: "Konsep-verkoopvoorwaardes vir M & M Premium Produce.",
      h1: "Verkoopvoorwaardes",
      intro: "Hierdie konsepklousules beskryf hoe bestellings bedoel is om te werk. Eienaar- of regshersiening word vereis voor finale publikasie.",
      sections: [
        {
          heading: "Bestellings",
          body: [
            "Bestellings word deur die webwerf aangeteken en handmatig bevestig totdat aanlyn betaling opgestel is.",
            "Beskikbaarheid en verpakkingsgroottes is soos op elke produkblad ten tyde van die bestelling.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Pryse",
          body: [
            "Verkooppryse word in Suid-Afrikaanse rand gewys. Verpakkingsgrootte word apart van enige vergelykingskoers gewys.",
            "Produkte sonder ’n bevestigde verkoopprys kan nie gekoop word nie.",
          ],
          reviewRequired: true,
        },
      ],
    },
    returns: {
      title: "Aflewering en terugsendings",
      description: "Konsep-aflewering en terugsendings vir M & M Premium Produce.",
      h1: "Aflewering en terugsendings",
      intro: "Landswye aflewering word regoor Suid-Afrika aangebied. Gedetailleerde areas, fooie en terugsendinghantering moet nog deur die eienaar bevestig word.",
      sections: [
        {
          heading: "Aflewering",
          body: [
            "Ons bied aflewering regoor Suid-Afrika. Gepubliseerde areas, tydsberekening en fooie verskyn op die afleweringsblad sodra dit bevestig is.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Terugsendings en terugbetalings",
          body: [
            "Terugsendings en terugbetalings vir vars produkte moet deur die eienaar bevestig word voordat hierdie afdeling as finale beleid beskou word.",
          ],
          reviewRequired: true,
        },
      ],
    },
  },
};

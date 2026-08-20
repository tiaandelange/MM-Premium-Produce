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
      intro:
        "How Beloofdeland Vervoer trading as M&M Premium Produce intends to handle personal information for orders and enquiries. This page remains a draft pending owner or legal review.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "When you place an order we collect the contact and delivery details you submit so we can fulfil that order and arrange owner delivery within Gauteng.",
            "Optional analytics may run only after consent. Analytics do not include your name, email, phone or address.",
          ],
          reviewRequired: true,
        },
        {
          heading: "How we use it",
          body: [
            "We use your details to confirm orders, arrange EFT payment instructions, schedule delivery, and respond to WhatsApp, phone or email enquiries.",
            "We do not sell personal information. We do not publish a public street address for the business.",
          ],
          reviewRequired: true,
        },
        {
          heading: "POPIA contact",
          body: [
            "For privacy requests, contact hello@mmpp.co.za or WhatsApp +27 82 603 8288.",
          ],
          reviewRequired: true,
        },
      ],
    },
    terms: {
      title: "Terms of sale",
      description: "Draft terms of sale for M & M Premium Produce.",
      h1: "Terms of sale",
      intro:
        "These draft clauses describe how orders work for fresh produce sold by Beloofdeland Vervoer trading as M&M Premium Produce. They require owner or legal review before publication as final terms.",
      sections: [
        {
          heading: "Orders",
          body: [
            "Orders are recorded through the website and confirmed manually. Payment is by manual EFT after confirmation. Online card payments may be added later.",
            "Availability and pack sizes are as shown on each product page at the time of order.",
            "You may cancel an order within 6 hours of placing it, provided the order has not already been packed or dispatched.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Pricing and payment",
          body: [
            "Selling prices are shown in South African rand. Pack size is shown separately from any comparison rate.",
            "Products without a confirmed selling price cannot be purchased.",
            "Banking details for EFT are shared after we accept your order.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Delivery",
          body: [
            "We deliver ourselves across Gauteng within 1–3 business days, subject to a 100 km fresh-produce limit. Outside Gauteng is not covered.",
            "Standard delivery is R35. Orders of R500 or more qualify for free delivery.",
          ],
          reviewRequired: true,
        },
      ],
    },
    returns: {
      title: "Delivery and returns",
      description: "Draft delivery and returns information for M & M Premium Produce.",
      h1: "Delivery and returns",
      intro:
        "Owner delivery across Gauteng, with perishable-produce return rules. This page is a draft pending owner or legal review.",
      sections: [
        {
          heading: "Delivery",
          body: [
            "Method: owner delivery. Coverage: Gauteng. Timeframe: 1–3 business days.",
            "Fee: R35, or free from R500. Exclusions: outside Gauteng. Fresh-produce deliveries are limited to within 100 km.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Cancellation",
          body: [
            "Cancel within 6 hours of placing an order if the order has not already been packed or dispatched.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Damaged, incorrect or wrong orders",
          body: [
            "Report damaged or incorrect produce promptly so we can arrange a return or replacement.",
            "Wrong orders are remedied with a refund or replacement.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Non-returnable produce",
          body: [
            "Fresh produce that arrives in good condition is non-refundable because of its perishable nature.",
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
      intro:
        "Hoe Beloofdeland Vervoer handelende as M&M Premium Produce van plan is om persoonlike inligting vir bestellings en navrae te hanteer. Hierdie bladsy bly ’n konsep hangende eienaar- of regshersiening.",
      sections: [
        {
          heading: "Wat ons versamel",
          body: [
            "Wanneer jy ’n bestelling plaas, versamel ons die kontak- en afleweringsbesonderhede wat jy indien sodat ons die bestelling kan uitvoer en eienaar-aflewering binne Gauteng kan reël.",
            "Opsionele ontleding loop slegs ná toestemming. Ontleding sluit nie jou naam, e-pos, telefoon of adres in nie.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Hoe ons dit gebruik",
          body: [
            "Ons gebruik jou besonderhede om bestellings te bevestig, EFT-betalingsinstruksies te reël, aflewering te skeduleer, en op WhatsApp-, telefoon- of e-posnavrae te reageer.",
            "Ons verkoop nie persoonlike inligting nie. Ons publiseer nie ’n openbare straatadres vir die besigheid nie.",
          ],
          reviewRequired: true,
        },
        {
          heading: "POPIA-kontak",
          body: [
            "Vir privaatheidsversoeke, kontak hello@mmpp.co.za of WhatsApp +27 82 603 8288.",
          ],
          reviewRequired: true,
        },
      ],
    },
    terms: {
      title: "Verkoopvoorwaardes",
      description: "Konsep-verkoopvoorwaardes vir M & M Premium Produce.",
      h1: "Verkoopvoorwaardes",
      intro:
        "Hierdie konsepklousules beskryf hoe bestellings werk vir vars produkte verkoop deur Beloofdeland Vervoer handelende as M&M Premium Produce. Eienaar- of regshersiening word vereis voor finale publikasie.",
      sections: [
        {
          heading: "Bestellings",
          body: [
            "Bestellings word deur die webwerf aangeteken en handmatig bevestig. Betaling is per handmatige EFT ná bevestiging. Aanlyn kaartbetalings kan later bygevoeg word.",
            "Beskikbaarheid en verpakkingsgroottes is soos op elke produkblad ten tyde van die bestelling.",
            "Jy mag ’n bestelling binne 6 uur ná plasing kanselleer, mits die bestelling nog nie gepak of gestuur is nie.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Pryse en betaling",
          body: [
            "Verkooppryse word in Suid-Afrikaanse rand gewys. Verpakkingsgrootte word apart van enige vergelykingskoers gewys.",
            "Produkte sonder ’n bevestigde verkoopprys kan nie gekoop word nie.",
            "Bankbesonderhede vir EFT word gedeel nadat ons jou bestelling aanvaar.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Aflewering",
          body: [
            "Ons lewer self regoor Gauteng af binne 1–3 werksdae, onderworpe aan ’n 100 km-varsproduklimiet. Buite Gauteng word nie gedek nie.",
            "Standaard-aflewering is R35. Bestellings van R500 of meer kwalifiseer vir gratis aflewering.",
          ],
          reviewRequired: true,
        },
      ],
    },
    returns: {
      title: "Aflewering en terugsendings",
      description: "Konsep-aflewering en terugsendings vir M & M Premium Produce.",
      h1: "Aflewering en terugsendings",
      intro:
        "Eienaar-aflewering regoor Gauteng, met terugstuurreëls vir bederfbare produkte. Hierdie bladsy is ’n konsep hangende eienaar- of regshersiening.",
      sections: [
        {
          heading: "Aflewering",
          body: [
            "Metode: eienaar-aflewering. Dekking: Gauteng. Tydraamwerk: 1–3 werksdae.",
            "Fooi: R35, of gratis vanaf R500. Uitsluitings: buite Gauteng. Varsproduk-aflewerings is beperk tot binne 100 km.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Kansellasie",
          body: [
            "Kanselleer binne 6 uur ná die bestelling as die bestelling nog nie gepak of gestuur is nie.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Beskadigde, verkeerde of foutiewe bestellings",
          body: [
            "Meld beskadigde of verkeerde produkte gou aan sodat ons ’n terugsending of vervanging kan reël.",
            "Verkeerde bestellings word met ’n terugbetaling of vervanging reggestel.",
          ],
          reviewRequired: true,
        },
        {
          heading: "Nie-terugbetaalbare produkte",
          body: [
            "Vars produkte wat in goeie toestand aankom, is nie terugbetaalbaar nie omdat dit bederfbaar is.",
          ],
          reviewRequired: true,
        },
      ],
    },
  },
};

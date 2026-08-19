import type { AppLocale } from "@/lib/i18n/config";

export type HeroLine = {
  text: string;
  tone: "primary" | "accent";
};

export type ApproachCopy = {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  body: string;
  points: Array<{ title: string; body: string }>;
};

export type PageCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  heroLines?: HeroLine[];
  approach?: ApproachCopy;
  sections: Array<{ heading: string; body: string[] }>;
};

export const pageCopy: Record<AppLocale, Record<"home" | "about" | "delivery" | "contact" | "faq" | "shop" | "bundles", PageCopy>> = {
  en: {
    home: {
      title: "Fresh Fruit & Vegetables | M & M Premium Produce",
      description:
        "Shop personally handpicked fresh fruit and vegetables from M & M Premium Produce. Quality does matter.",
      h1: "Premium Fresh Fruit, Vegetables & Produce",
      heroLines: [
        { text: "Premium Fresh", tone: "primary" },
        { text: "Fruit, Vegetables", tone: "accent" },
        { text: "& Produce", tone: "primary" },
      ],
      intro:
        "Personally handpicked fruit, vegetables and produce. Shop the catalogue, or start with a produce box.",
      approach: {
        eyebrow: "Our approach",
        heading: "Personally Handpicked.",
        headingAccent: "Quality Comes First.",
        body: "We select fresh fruit, fresh vegetables and everyday fresh produce with care, focusing on quality and freshness — the carefully selected produce we would be happy to take home ourselves.",
        points: [
          {
            title: "Carefully Selected",
            body: "Produce chosen with attention to quality and condition.",
          },
          {
            title: "Fresh Produce",
            body: "A growing range of fruit, vegetables and everyday fresh-produce essentials.",
          },
          {
            title: "Personal Approach",
            body: "A hands-on business built around good produce and personal service.",
          },
        ],
      },
      sections: [
        {
          heading: "Quality you can trust",
          body: [
            "Every item is personally handpicked.",
            "Fruit and vegetables are sold as individual products with their own pages.",
            "Prices are shown in South African rand where a selling price is listed.",
          ],
        },
        {
          heading: "Shop fresh produce online",
          body: [
            "Move from the fresh produce shop into vegetables or fruit, then open a specific item. Delivery areas will be published on the delivery page once they are confirmed.",
          ],
        },
      ],
    },
    shop: {
      title: "Fresh Produce Shop",
      description:
        "Shop fresh fruit and vegetables from M & M Premium Produce. Browse categories and open any product from a crawlable catalogue page.",
      h1: "Fresh Produce Shop",
      intro:
        "Browse fruit and vegetables from this catalogue page. Category links are the indexable way to filter the range.",
      sections: [
        {
          heading: "All products",
          body: [
            "Every product below is linked with a standard URL. Sorting and availability filters, when added, will stay on this same canonical shop page.",
          ],
        },
      ],
    },
    bundles: {
      title: "Produce Boxes & Bundles",
      description:
        "Produce boxes from M & M Premium Produce will be listed here when a box is confirmed for sale. Until then, shop fruit and vegetables as individual products.",
      h1: "Produce Boxes & Bundles",
      intro:
        "Produce boxes will be catalogue items in their own right, with links to the fruit and vegetables inside them.",
      sections: [
        {
          heading: "Current boxes",
          body: [
            "No produce boxes are listed for sale yet. When a box is confirmed, it will appear here with its own page. Until then, shop fruit and vegetables as individual products.",
          ],
        },
      ],
    },
    about: {
      title: "About M & M Premium Produce",
      description:
        "M & M Premium Produce is a couple-run fresh produce shop. Every item is personally handpicked. Quality does matter.",
      h1: "About M & M Premium Produce",
      intro: "Quality does matter.",
      sections: [
        {
          heading: "Our story",
          body: [
            "M & M Premium Produce is more than a fresh produce business — it is our shared journey as a couple building a future together. We work to offer high-quality fruit and vegetables at prices meant to be accessible.",
            "Every item is personally handpicked by us. That hands-on care is how we make sure customers receive freshness, flavour and value they can trust. Our belief is simple: quality does matter.",
            "Each purchase supports the growth of this business and the life we are building together, including our wedding. We stay close to what customers need so the experience stays reliable and personal.",
          ],
        },
        {
          heading: "What you can shop for",
          body: [
            "Browse the fresh produce shop, vegetables or fruit. Produce boxes will appear under bundles when a box is confirmed. Delivery information will be published on the delivery page once it is confirmed.",
          ],
        },
      ],
    },
    delivery: {
      title: "Delivery Information",
      description:
        "Delivery areas, times and fees for M & M Premium Produce will be published here once they are confirmed.",
      h1: "Delivery information",
      intro:
        "This page will hold delivery areas, times and any collection options. Those details are not public yet.",
      sections: [
        {
          heading: "Current status",
          body: [
            "Delivery areas and time slots have not been confirmed, so they are not shown here. When they are available, this page will be the canonical place to read them.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact M & M Premium Produce",
      description:
        "Public contact details for M & M Premium Produce will appear here once they are confirmed.",
      h1: "Contact",
      intro:
        "Use this page for confirmed public contact details. A message form and order support will be added in a later phase.",
      sections: [
        {
          heading: "Public details",
          body: [
            "While contact details are being confirmed, you can still browse fresh produce and read frequently asked questions.",
          ],
        },
      ],
    },
    faq: {
      title: "Fresh Produce FAQ",
      description: "Answers about shopping fresh fruit and vegetables from M & M Premium Produce.",
      h1: "Frequently asked questions",
      intro: "Only questions we can answer with confirmed information are listed here.",
      sections: [
        {
          heading: "What can I shop for?",
          body: [
            "The shop is organised into fresh fruit, fresh vegetables and produce boxes. Each product has its own page.",
          ],
        },
        {
          heading: "Do you deliver?",
          body: [
            "Delivery areas and times have not been confirmed yet. They will be published on the delivery page when they are available.",
          ],
        },
        {
          heading: "How is pricing shown?",
          body: [
            "Prices are shown in South African rand where a selling price is listed. If a product has no selling price yet, the page says so instead of inventing a figure. Availability is taken from the current catalogue.",
          ],
        },
      ],
    },
  },
  af: {
    home: {
      title: "Vars vrugte en groente | M & M Premium Produce",
      description:
        "Koop persoonlik uitgesoekte vars vrugte en groente by M & M Premium Produce. Kwaliteit maak saak.",
      h1: "Vars Vrugte, Groente & Produkte",
      heroLines: [
        { text: "Vars Vrugte,", tone: "primary" },
        { text: "Groente", tone: "accent" },
        { text: "& Produkte", tone: "primary" },
      ],
      intro:
        "Persoonlik uitgesoekte vrugte, groente en produkte. Koop in die katalogus, of begin met ’n produkboks.",
      approach: {
        eyebrow: "Ons benadering",
        heading: "Persoonlik uitgesoek.",
        headingAccent: "Kwaliteit kom eerste.",
        body: "Ons kies vars vrugte, vars groente en alledaagse vars produkte met sorg, met kwaliteit en varsheid voorop — die uitgesoekte produkte wat ons self graag huis toe sou neem.",
        points: [
          {
            title: "Sorgvuldig uitgesoek",
            body: "Produkte gekies vir gehalte en toestand.",
          },
          {
            title: "Vars produkte",
            body: "’n Groeiende reeks vrugte, groente en alledaagse varsprodukte.",
          },
          {
            title: "Persoonlike benadering",
            body: "’n Hands-on besigheid gebou rondom goeie produkte en persoonlike diens.",
          },
        ],
      },
      sections: [
        {
          heading: "Kwaliteit waarop jy kan staatmaak",
          body: [
            "Elke item word persoonlik deur ons uitgesoek.",
            "Vrugte en groente word as afsonderlike produkte met eie bladsye verkoop.",
            "Pryse word in Suid-Afrikaanse rand gewys waar ’n verkoopprys gelys is.",
          ],
        },
        {
          heading: "Koop vars produkte aanlyn",
          body: [
            "Begin by die winkel, kies groente of vrugte, en maak dan ’n spesifieke item oop. Afleweringsareas word op die afleweringsblad gepubliseer sodra dit bevestig is.",
          ],
        },
      ],
    },
    shop: {
      title: "Varsproduk-winkel",
      description:
        "Koop vars vrugte en groente by M & M Premium Produce. Blaai kategorieë en maak enige produk vanaf ’n deursoekbare katalogusblad oop.",
      h1: "Varsproduk-winkel",
      intro:
        "Blaai vrugte en groente vanaf hierdie katalogusblad. Kategorie-skakels is die indekseerbare manier om die reeks te filter.",
      sections: [
        {
          heading: "Alle produkte",
          body: [
            "Elke produk hieronder het ’n standaard-URL. Sortering en beskikbaarheidsfilters, wanneer dit bykom, bly op hierdie selfde kanonieke winkelblad.",
          ],
        },
      ],
    },
    bundles: {
      title: "Produkbokse",
      description:
        "Produkbokse van M & M Premium Produce word hier gelys wanneer ’n boks vir verkoop bevestig is. Tot dan, koop vrugte en groente as afsonderlike produkte.",
      h1: "Produkbokse",
      intro:
        "Produkbokse sal katalogusitems in eie reg wees, met skakels na die vrugte en groente daarin.",
      sections: [
        {
          heading: "Huidige bokse",
          body: [
            "Geen produkbokse is nog te koop nie. Wanneer ’n boks bevestig is, verskyn dit hier met sy eie blad. Tot dan, koop vrugte en groente as afsonderlike produkte.",
          ],
        },
      ],
    },
    about: {
      title: "Oor M & M Premium Produce",
      description:
        "M & M Premium Produce is ’n varsproduk-winkel wat deur ’n paartjie bestuur word. Elke item word persoonlik uitgesoek. Kwaliteit maak saak.",
      h1: "Oor M & M Premium Produce",
      intro: "Kwaliteit maak saak.",
      sections: [
        {
          heading: "Ons storie",
          body: [
            "M & M Premium Produce is meer as ’n varsprodukbesigheid — dit is ons gedeelde reis as ’n paartjie wat saam ’n toekoms bou. Ons werk om vrugte en groente van hoë gehalte teen toeganklike pryse te bied.",
            "Elke item word persoonlik deur ons uitgesoek. Daardie hands-on sorg is hoe ons seker maak kliënte kry varsheid, geur en waarde waarop hulle kan staatmaak. Ons oortuiging is eenvoudig: kwaliteit maak saak.",
            "Elke aankoop ondersteun die groei van hierdie besigheid en die lewe wat ons saam bou, insluitend ons troue. Ons bly naby aan wat kliënte nodig het sodat die ervaring betroubaar en persoonlik bly.",
          ],
        },
        {
          heading: "Waarvoor jy kan koop",
          body: [
            "Blaai die varsproduk-winkel, groente of vrugte. Produkbokse verskyn onder bokse wanneer ’n boks bevestig is. Afleweringsinligting word op die afleweringsblad gepubliseer sodra dit bevestig is.",
          ],
        },
      ],
    },
    delivery: {
      title: "Afleweringsinligting",
      description:
        "Afleweringsareas, tye en fooie vir M & M Premium Produce word hier gepubliseer sodra dit bevestig is.",
      h1: "Afleweringsinligting",
      intro:
        "Hierdie blad sal afleweringsareas, tye en enige afhaalopsies hou. Daardie besonderhede is nog nie openbaar nie.",
      sections: [
        {
          heading: "Huidige status",
          body: [
            "Afleweringsareas en tydgleuwe is nog nie bevestig nie, daarom word dit nie hier gewys nie. Wanneer dit beskikbaar is, is hierdie blad die kanonieke plek om dit te lees.",
          ],
        },
      ],
    },
    contact: {
      title: "Kontak M & M Premium Produce",
      description:
        "Openbare kontakbesonderhede vir M & M Premium Produce verskyn hier sodra dit bevestig is.",
      h1: "Kontak",
      intro:
        "Gebruik hierdie blad vir bevestigde openbare kontakbesonderhede. ’n Boodskapvorm en bestellingsondersteuning kom in ’n later fase.",
      sections: [
        {
          heading: "Openbare besonderhede",
          body: [
            "Terwyl kontakbesonderhede bevestig word, kan jy steeds vars produkte bekyk en gereelde vrae lees.",
          ],
        },
      ],
    },
    faq: {
      title: "Gereelde vrae oor vars produkte",
      description: "Antwoorde oor die koop van vars vrugte en groente by M & M Premium Produce.",
      h1: "Gereelde vrae",
      intro: "Slegs vrae wat ons met bevestigde inligting kan beantwoord, word hier gelys.",
      sections: [
        {
          heading: "Waarvoor kan ek koop?",
          body: [
            "Die winkel is ingedeel in vars vrugte, vars groente en produkbokse. Elke produk het sy eie blad.",
          ],
        },
        {
          heading: "Lewer julle af?",
          body: [
            "Afleweringsareas en tye is nog nie bevestig nie. Dit word op die afleweringsblad gepubliseer wanneer dit beskikbaar is.",
          ],
        },
        {
          heading: "Hoe word pryse gewys?",
          body: [
            "Pryse word in Suid-Afrikaanse rand gewys waar ’n verkoopprys gelys is. As ’n produk nog nie ’n verkoopprys het nie, sê die blad so — ons maak nie ’n syfer op nie. Beskikbaarheid kom uit die huidige katalogus.",
          ],
        },
      ],
    },
  },
};

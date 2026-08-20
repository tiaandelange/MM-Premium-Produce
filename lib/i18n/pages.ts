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
  delivery: {
    eyebrow: string;
    title: string;
    body: string;
  };
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

type PageKey = "home" | "about" | "delivery" | "contact" | "faq" | "shop" | "bundles" | "guides" | "recipes";

export const pageCopy: Record<AppLocale, Record<PageKey, PageCopy>> = {
  en: {
    home: {
      title: "M & M Premium Produce | Personally Handpicked Fruit & Vegetables",
      description:
        "Personally handpicked fruit and vegetables from M & M Premium Produce. Shop the catalogue, then open vegetables, fruit or a named product. Owner delivery across Gauteng.",
      h1: "Premium Fresh Fruit, Vegetables & Produce",
      heroLines: [
        { text: "Premium Fresh", tone: "primary" },
        { text: "Fruit, Vegetables", tone: "accent" },
        { text: "& Produce", tone: "primary" },
      ],
      intro:
        "Personally handpicked fruit and vegetables. Open the full catalogue, or start with vegetables.",
      approach: {
        eyebrow: "Our approach",
        heading: "Personally Handpicked.",
        headingAccent: "Quality Comes First.",
        body: "We carefully select the fruit, vegetables and fresh produce we offer, with quality and freshness at the centre of every choice.",
        delivery: {
          eyebrow: "Delivery",
          title: "Gauteng Delivery",
          body: "Owner delivery across Gauteng within 1–3 business days.",
        },
        points: [
          {
            title: "Carefully Selected",
            body: "Produce chosen with attention to quality and condition.",
          },
          {
            title: "Fresh Produce",
            body: "Fruit, vegetables and everyday fresh produce essentials.",
          },
          {
            title: "Personal Approach",
            body: "A hands-on business focused on quality and personal service.",
          },
        ],
      },
      sections: [
        {
          heading: "Quality you can trust",
          body: [
            "Every item is personally selected with care.",
            "Pack sizes and pricing are shown clearly on each product page.",
            "Availability is listed honestly — what you see is what we currently offer.",
            "Fresh produce is delivered by us across Gauteng.",
            "Email or WhatsApp us — we respond promptly to customer questions.",
          ],
        },
        {
          heading: "Shop fresh produce online",
          body: [
            "Browse the full shop, or go straight into vegetables or fruit and choose a product. We deliver ourselves across Gauteng; fees, timing and exclusions are on the delivery page.",
            "Practical guides on storing staples and using leftovers are in the produce guides — written for everyday kitchen use.",
          ],
        },
      ],
    },
    shop: {
      title: "All Fresh Produce",
      description:
        "The full M & M Premium Produce catalogue: every fruit and vegetable currently listed, each on its own page. Use Vegetables or Fruit when you want one aisle.",
      h1: "All produce",
      intro:
        "Browse our complete selection of personally chosen fruit and vegetables, or explore each fresh-produce aisle separately.",
      sections: [
        {
          heading: "All products",
          body: [
            "Every product below has its own page with pack details and pricing. Prefer one aisle? Open Vegetables or Fruit to browse just that selection.",
          ],
        },
      ],
    },
    bundles: {
      title: "Produce Boxes & Bundles",
      description:
        "Produce boxes from M & M Premium Produce — coming soon. Shop fruit and vegetables as individual products in the meantime.",
      h1: "Produce Boxes & Bundles",
      intro:
        "Produce boxes are coming soon. Each box will list the fruit and vegetables inside so you know exactly what you are getting.",
      sections: [
        {
          heading: "Current boxes",
          body: [
            "Coming soon — no produce boxes are listed for sale yet. When a box is ready, it will appear here. Until then, shop fruit and vegetables as individual products.",
          ],
        },
      ],
    },
    about: {
      title: "About M & M Premium Produce",
      description:
        "M & M Premium Produce is run by Meagan Pelzer and Marthinus Erasmus. Every item is personally handpicked. Quality does matter.",
      h1: "About M & M Premium Produce",
      intro: "Quality does matter.",
      sections: [
        {
          heading: "Our story",
          body: [
            "M & M Premium Produce is the shared journey of Meagan Pelzer and Marthinus Erasmus — a couple building a fresh-produce business while we save toward the future we are building together, including marriage. We work to offer high-quality fruit and vegetables at prices meant to be accessible.",
            "Every item is personally handpicked by us. That hands-on care is how we make sure customers receive freshness, flavour and value they can trust. Our belief is simple: quality does matter.",
            "We trade as M&M Premium Produce under Beloofdeland Vervoer. We stay close to what customers need so the experience stays reliable and personal.",
          ],
        },
        {
          heading: "What you can shop for",
          body: [
            "Browse the full catalogue, vegetables or fruit. Produce boxes are coming soon. We deliver ourselves across Gauteng; areas, fees and timing are on the delivery page.",
          ],
        },
      ],
    },
    delivery: {
      title: "Gauteng Delivery",
      description:
        "M & M Premium Produce delivers fresh produce across Gauteng by owner delivery within 1–3 business days. R35 delivery, free from R500.",
      h1: "Gauteng Delivery",
      intro:
        "Owner delivery across Gauteng within 1–3 business days. Outside Gauteng and routes farther than 100 km are not covered.",
      sections: [
        {
          heading: "Current status",
          body: [
            "Standard delivery is R35, or free on orders of R500 or more. We deliver ourselves — confirm your suburb when you order.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact M & M Premium Produce",
      description:
        "Email hello@mmpp.co.za or WhatsApp +27 82 603 8288. Owner delivery across Gauteng.",
      h1: "Contact",
      intro:
        "Reach Meagan and Marthinus for orders and enquiries. We do not publish a street address.",
      sections: [
        {
          heading: "Public details",
          body: [
            "Use the email, phone or WhatsApp details on this page. Trading as M&M Premium Produce under Beloofdeland Vervoer.",
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
            "Browse vegetables, fruit, or the full shop. Produce boxes are coming soon. Each product has its own page with pack details.",
          ],
        },
        {
          heading: "Do you deliver?",
          body: [
            "Yes — we deliver ourselves across Gauteng within 1–3 business days. Delivery is R35, or free from R500. We do not deliver outside Gauteng or farther than 100 km.",
          ],
        },
        {
          heading: "How do I pay?",
          body: [
            "Orders are paid by manual EFT after we confirm them. Online card payments are planned for later.",
          ],
        },
        {
          heading: "Can I cancel or return an order?",
          body: [
            "You may cancel within 6 hours of placing an order. Damaged or incorrect produce should be reported promptly for a return or replacement. Wrong orders are remedied with a refund or replacement. Fresh produce that arrives in good condition is non-refundable because it is perishable.",
          ],
        },
        {
          heading: "How is pricing shown?",
          body: [
            "Where a price is set, it is shown clearly in South African rand. If a product is not yet priced, the page says so. Availability reflects what we currently offer.",
          ],
        },
        {
          heading: "How should I store what I buy?",
          body: [
            "Short storage notes sit on some product pages. Longer household guides for potatoes, onions, spinach, lettuce, carrots, apples and leftovers are in the produce guides.",
          ],
        },
      ],
    },
    guides: {
      title: "Produce Guides",
      description:
        "Household guides for storing and choosing fresh produce from the M & M Premium Produce shop. Written to be useful in the kitchen.",
      h1: "Produce guides",
      intro:
        "Practical household guidance on storing produce, choosing between similar packs, and making the most of leftovers.",
      sections: [
        {
          heading: "What is here",
          body: [
            "Each guide links to the shop products it covers, so you can go straight from advice to the pack you need.",
          ],
        },
      ],
    },
    recipes: {
      title: "Household Recipes",
      description:
        "A small set of household recipes that use produce from the M & M Premium Produce shop. Cook by doneness for reliable results at home.",
      h1: "Household recipes",
      intro:
        "Simple weekday methods using produce from the shop: roast potatoes with onion, and a pan of carrots and onions.",
      sections: [
        {
          heading: "What is here",
          body: [
            "Ingredients and steps are written for a home kitchen — clear, practical, and easy to follow.",
          ],
        },
      ],
    },
  },
  af: {
    home: {
      title: "M & M Premium Produce | Persoonlik uitgesoekte vrugte en groente",
      description:
        "Persoonlik uitgesoekte vrugte en groente by M & M Premium Produce. Blaai die katalogus, of begin by groente of vrugte. Eienaar-aflewering regoor Gauteng.",
      h1: "Vars Vrugte, Groente & Produkte",
      heroLines: [
        { text: "Vars Vrugte,", tone: "primary" },
        { text: "Groente", tone: "accent" },
        { text: "& Produkte", tone: "primary" },
      ],
      intro:
        "Persoonlik uitgesoekte vrugte en groente. Maak die volle katalogus oop, of begin by groente.",
      approach: {
        eyebrow: "Ons benadering",
        heading: "Persoonlik Uitgesoek.",
        headingAccent: "Kwaliteit Kom Eerste.",
        body: "Ons kies die vrugte, groente en vars produkte wat ons bied met sorg, met kwaliteit en varsheid in die middel van elke keuse.",
        delivery: {
          eyebrow: "Aflewering",
          title: "Gauteng-aflewering",
          body: "Eienaar-aflewering regoor Gauteng binne 1–3 werksdae.",
        },
        points: [
          {
            title: "Sorgvuldig Uitgesoek",
            body: "Produkte gekies met aandag aan kwaliteit en toestand.",
          },
          {
            title: "Vars Produkte",
            body: "Vrugte, groente en alledaagse varsprodukte.",
          },
          {
            title: "Persoonlike Benadering",
            body: "’n Besigheid wat self die werk doen, gerig op kwaliteit en persoonlike diens.",
          },
        ],
      },
      sections: [
        {
          heading: "Kwaliteit waarop jy kan staatmaak",
          body: [
            "Elke item word persoonlik met sorg uitgesoek.",
            "Pakgroottes en pryse word duidelik op elke produkblad gewys.",
            "Beskikbaarheid word eerlik gelys — wat jy sien, is wat ons tans bied.",
            "Vars produkte word deur ons regoor Gauteng afgelewer.",
            "E-pos of WhatsApp ons — ons reageer gou op kliëntevrae.",
          ],
        },
        {
          heading: "Koop vars produkte aanlyn",
          body: [
            "Blaai die volle winkel, of gaan direk na groente of vrugte en kies ’n produk. Ons lewer self regoor Gauteng af; fooie, tydsberekening en uitsluitings staan op die afleweringsblad.",
            "Praktiese gidse oor die berg van stapels en die gebruik van oorskiet is by die produk-gidse — geskryf vir alledaagse kombuisgebruik.",
          ],
        },
      ],
    },
    shop: {
      title: "Hele katalogus",
      description:
        "Die volle M & M Premium Produce-katalogus: elke vrug en groente wat tans gelys is, elkeen op sy eie blad. Gebruik Groente of Vrugte as jy een gang wil hê.",
      h1: "Alle produkte",
      intro:
        "Blaai ons volledige keuse van persoonlik uitgesoekte vrugte en groente, of verken elke varsproduk-gang afsonderlik.",
      sections: [
        {
          heading: "Alle produkte",
          body: [
            "Elke produk hieronder het sy eie blad met pakbesonderhede en pryse. Wil jy net een gang? Maak Groente of Vrugte oop om net daardie keuse te bekyk.",
          ],
        },
      ],
    },
    bundles: {
      title: "Produktebokse",
      description:
        "Produktebokse van M & M Premium Produce — binnekort beskikbaar. Koop intussen vrugte en groente as afsonderlike produkte.",
      h1: "Produktebokse",
      intro:
        "Produktebokse kom binnekort. Elke boks sal die vrugte en groente daarin lys sodat jy presies weet wat jy kry.",
      sections: [
        {
          heading: "Huidige bokse",
          body: [
            "Binnekort beskikbaar — geen produktebokse is nog te koop nie. Wanneer ’n boks gereed is, verskyn dit hier. Tot dan, koop vrugte en groente as afsonderlike produkte.",
          ],
        },
      ],
    },
    about: {
      title: "Oor M & M Premium Produce",
      description:
        "M & M Premium Produce word deur Meagan Pelzer en Marthinus Erasmus bestuur. Elke item word persoonlik uitgesoek. Kwaliteit maak saak.",
      h1: "Oor M & M Premium Produce",
      intro: "Kwaliteit maak saak.",
      sections: [
        {
          heading: "Ons storie",
          body: [
            "M & M Premium Produce is die gedeelde reis van Meagan Pelzer en Marthinus Erasmus — ’n paartjie wat ’n varsprodukbesigheid bou terwyl ons spaar vir die toekoms wat ons saam bou, insluitend die huwelik. Ons werk om vrugte en groente van hoë gehalte teen toeganklike pryse te bied.",
            "Elke item word persoonlik deur ons uitgesoek. Daardie hands-on sorg is hoe ons seker maak kliënte kry varsheid, geur en waarde waarop hulle kan staatmaak. Ons oortuiging is eenvoudig: kwaliteit maak saak.",
            "Ons handel as M&M Premium Produce onder Beloofdeland Vervoer. Ons bly naby aan wat kliënte nodig het sodat die ervaring betroubaar en persoonlik bly.",
          ],
        },
        {
          heading: "Waarvoor jy kan koop",
          body: [
            "Blaai die volle katalogus, groente of vrugte. Produkbokse kom binnekort. Ons lewer self regoor Gauteng af; areas, fooie en tydsberekening staan op die afleweringsblad.",
          ],
        },
      ],
    },
    delivery: {
      title: "Gauteng-aflewering",
      description:
        "M & M Premium Produce lewer vars produkte regoor Gauteng per eienaar-aflewering binne 1–3 werksdae. R35-aflewering, gratis vanaf R500.",
      h1: "Gauteng-aflewering",
      intro:
        "Eienaar-aflewering regoor Gauteng binne 1–3 werksdae. Buite Gauteng en roetes verder as 100 km word nie gedek nie.",
      sections: [
        {
          heading: "Huidige status",
          body: [
            "Standaard-aflewering is R35, of gratis op bestellings van R500 of meer. Ons lewer self — bevestig jou voorstad wanneer jy bestel.",
          ],
        },
      ],
    },
    contact: {
      title: "Kontak M & M Premium Produce",
      description:
        "E-pos hello@mmpp.co.za of WhatsApp +27 82 603 8288. Eienaar-aflewering regoor Gauteng.",
      h1: "Kontak",
      intro:
        "Kontak Meagan en Marthinus vir bestellings en navrae. Ons publiseer nie ’n straatadres nie.",
      sections: [
        {
          heading: "Openbare besonderhede",
          body: [
            "Gebruik die e-pos-, telefoon- of WhatsApp-besonderhede op hierdie blad. Handel as M&M Premium Produce onder Beloofdeland Vervoer.",
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
            "Blaai groente, vrugte of die volle winkel. Produkbokse kom binnekort. Elke produk het sy eie blad met pakbesonderhede.",
          ],
        },
        {
          heading: "Lewer julle af?",
          body: [
            "Ja — ons lewer self regoor Gauteng af binne 1–3 werksdae. Aflewering is R35, of gratis vanaf R500. Ons lewer nie buite Gauteng of verder as 100 km af nie.",
          ],
        },
        {
          heading: "Hoe betaal ek?",
          body: [
            "Bestellings word per handmatige EFT betaal nadat ons dit bevestig. Aanlyn kaartbetalings word later beplan.",
          ],
        },
        {
          heading: "Kan ek ’n bestelling kanselleer of terugstuur?",
          body: [
            "Jy mag binne 6 uur ná die bestelling kanselleer. Beskadigde of verkeerde produkte moet gou aangemeld word vir ’n terugsending of vervanging. Verkeerde bestellings word met ’n terugbetaling of vervanging reggestel. Vars produkte wat in goeie toestand aankom, is nie terugbetaalbaar nie omdat dit bederfbaar is.",
          ],
        },
        {
          heading: "Hoe word pryse gewys?",
          body: [
            "Waar ’n prys gestel is, word dit duidelik in Suid-Afrikaanse rand gewys. As ’n produk nog nie geprys is nie, sê die blad so. Beskikbaarheid weerspieël wat ons tans bied.",
          ],
        },
        {
          heading: "Hoe berg ek wat ek koop?",
          body: [
            "Kort bergingsnotas sit op sommige produkbladsye. Langer huishoudelike gidse vir aartappels, uie, spinasie, slaai, wortels, appels en oorskiet is by die produk-gidse.",
          ],
        },
      ],
    },
    guides: {
      title: "Produk-gidse",
      description:
        "Huishoudelike gidse vir die berg en kies van vars produkte uit die M & M Premium Produce-winkel. Geskryf om in die kombuis nuttig te wees.",
      h1: "Produk-gidse",
      intro:
        "Praktiese huishoudelike leiding oor die berg van produkte, die keuse tussen soortgelyke pakke, en die beste gebruik van oorskiet.",
      sections: [
        {
          heading: "Wat is hier",
          body: [
            "Elke gids skakel na die winkelprodukte wat dit dek, sodat jy direk van raad na die pak kan gaan wat jy nodig het.",
          ],
        },
      ],
    },
    recipes: {
      title: "Huishoudelike resepte",
      description:
        "’n Klein stel huishoudelike resepte wat produkte uit die M & M Premium Produce-winkel gebruik. Kook tot gaar vir betroubare resultate by die huis.",
      h1: "Huishoudelike resepte",
      intro:
        "Eenvoudige weeksdae-metodes met produkte uit die winkel: gebraaide aartappels met ui, en ’n pan wortels en uie.",
      sections: [
        {
          heading: "Wat is hier",
          body: [
            "Bestanddele en stappe is vir ’n huiskombuis geskryf — duidelik, prakties en maklik om te volg.",
          ],
        },
      ],
    },
  },
};

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
        "Personally handpicked fruit and vegetables from M & M Premium Produce. Shop the catalogue, then open vegetables, fruit or a named product. Fresh produce delivered across South Africa.",
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
          title: "Nationwide Delivery",
          body: "Fresh produce delivered across South Africa.",
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
            "Fresh produce is delivered nationwide across South Africa.",
            "When our contact details are published, we respond promptly to customer questions.",
          ],
        },
        {
          heading: "Shop fresh produce online",
          body: [
            "Browse the full shop, or go straight into vegetables or fruit and choose a product. We deliver nationwide across South Africa; delivery areas, time slots and fees appear on the delivery page when published.",
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
        "M & M Premium Produce is a couple-run fresh produce shop. Every item is personally handpicked. Quality does matter.",
      h1: "About M & M Premium Produce",
      intro: "Quality does matter.",
      sections: [
        {
          heading: "Our story",
          body: [
            "M & M Premium Produce is more than a fresh produce business — it is our shared journey as a couple building a future together. We work to offer high-quality fruit and vegetables at prices meant to be accessible.",
            "Every item is personally handpicked by us. That hands-on care is how we make sure customers receive freshness, flavour and value they can trust. Our belief is simple: quality does matter.",
            "M & M Premium Produce is a family-run business built around careful selection, honest service and a shared future. We stay close to what customers need so the experience stays reliable and personal.",
          ],
        },
        {
          heading: "What you can shop for",
          body: [
            "Browse the full catalogue, vegetables or fruit. Produce boxes will appear under bundles when a box is confirmed. We offer nationwide delivery across South Africa; areas, time slots and fees are published on the delivery page when they are confirmed.",
          ],
        },
      ],
    },
    delivery: {
      title: "Nationwide Delivery",
      description:
        "M & M Premium Produce offers delivery across South Africa. Detailed delivery areas, fees and delivery timing will be published once confirmed.",
      h1: "Nationwide Delivery",
      intro:
        "Fresh produce delivered across South Africa. Detailed delivery areas, fees and delivery timing will be published once confirmed.",
      sections: [
        {
          heading: "Current status",
          body: [
            "M & M Premium Produce offers delivery across South Africa. Detailed delivery areas, fees and delivery timing will be published once confirmed. Shop fruit and vegetables in the meantime.",
          ],
        },
      ],
    },
    contact: {
      title: "Contact M & M Premium Produce",
      description:
        "Reach M & M Premium Produce. Contact details will be listed here as soon as they are ready.",
      h1: "Contact",
      intro:
        "We are putting our public contact details in place. In the meantime, you are welcome to browse the shop and read the FAQ.",
      sections: [
        {
          heading: "Public details",
          body: [
            "Contact details for orders and enquiries will be published on this page shortly. Until then, explore our fresh produce and guides at your own pace.",
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
            "Browse vegetables, fruit, or the full shop. Produce boxes will appear when available. Each product has its own page with pack details.",
          ],
        },
        {
          heading: "Do you deliver?",
          body: [
            "Yes — we offer nationwide delivery across South Africa. Areas, time slots and fees are not published yet. The delivery page is the place for those details when they are confirmed.",
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
        "Persoonlik uitgesoekte vrugte en groente by M & M Premium Produce. Blaai die katalogus, of begin by groente of vrugte. Vars produkte word regoor Suid-Afrika afgelewer.",
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
          title: "Landswye Aflewering",
          body: "Vars produkte word regoor Suid-Afrika afgelewer.",
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
            "Vars produkte word landswyd regoor Suid-Afrika afgelewer.",
            "Wanneer ons kontakbesonderhede gepubliseer is, reageer ons gou op kliëntevrae.",
          ],
        },
        {
          heading: "Koop vars produkte aanlyn",
          body: [
            "Blaai die volle winkel, of gaan direk na groente of vrugte en kies ’n produk. Ons lewer landswyd regoor Suid-Afrika af; afleweringsgebiede, tydgleuwe en fooie verskyn op die afleweringsblad wanneer dit gepubliseer is.",
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
      title: "Produkbokse",
      description:
        "Produkbokse van M & M Premium Produce — binnekort beskikbaar. Koop intussen vrugte en groente as afsonderlike produkte.",
      h1: "Produkbokse",
      intro:
        "Produkbokse kom binnekort. Elke boks sal die vrugte en groente daarin lys sodat jy presies weet wat jy kry.",
      sections: [
        {
          heading: "Huidige bokse",
          body: [
            "Binnekort beskikbaar — geen produkbokse is nog te koop nie. Wanneer ’n boks gereed is, verskyn dit hier. Tot dan, koop vrugte en groente as afsonderlike produkte.",
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
            "M & M Premium Produce is ’n familiebesigheid gebou rondom sorgvuldige keuse, eerlike diens en ’n gedeelde toekoms. Ons bly naby aan wat kliënte nodig het sodat die ervaring betroubaar en persoonlik bly.",
          ],
        },
        {
          heading: "Waarvoor jy kan koop",
          body: [
            "Blaai die volle katalogus, groente of vrugte. Produkbokse verskyn onder bokse wanneer ’n boks bevestig is. Ons bied landswye aflewering regoor Suid-Afrika; areas, tydgleuwe en fooie staan op die afleweringsblad wanneer dit bevestig is.",
          ],
        },
      ],
    },
    delivery: {
      title: "Landswye Aflewering",
      description:
        "M & M Premium Produce bied aflewering regoor Suid-Afrika. Besonderhede oor afleweringsgebiede, fooie en afleweringstye sal gepubliseer word sodra dit bevestig is.",
      h1: "Landswye Aflewering",
      intro:
        "Vars produkte word regoor Suid-Afrika afgelewer. Besonderhede oor afleweringsgebiede, fooie en afleweringstye sal gepubliseer word sodra dit bevestig is.",
      sections: [
        {
          heading: "Huidige status",
          body: [
            "M & M Premium Produce bied aflewering regoor Suid-Afrika. Besonderhede oor afleweringsgebiede, fooie en afleweringstye sal gepubliseer word sodra dit bevestig is. Koop intussen vrugte en groente.",
          ],
        },
      ],
    },
    contact: {
      title: "Kontak M & M Premium Produce",
      description:
        "Kontak M & M Premium Produce. Kontakbesonderhede word hier gelys sodra dit gereed is.",
      h1: "Kontak",
      intro:
        "Ons is besig om ons openbare kontakbesonderhede in plek te sit. Intussen is jy welkom om die winkel te bekyk en die gereelde vrae te lees.",
      sections: [
        {
          heading: "Openbare besonderhede",
          body: [
            "Kontakbesonderhede vir bestellings en navrae word binnekort op hierdie blad gepubliseer. Tot dan, verken ons vars produkte en gidse op jou eie tempo.",
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
            "Blaai groente, vrugte of die volle winkel. Produkbokse verskyn wanneer beskikbaar. Elke produk het sy eie blad met pakbesonderhede.",
          ],
        },
        {
          heading: "Lewer julle af?",
          body: [
            "Ja — ons bied landswye aflewering regoor Suid-Afrika. Areas, tydgleuwe en fooie is nog nie gepubliseer nie. Die afleweringsblad is die plek vir daardie besonderhede wanneer dit bevestig is.",
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

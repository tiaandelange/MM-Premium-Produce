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
            "Every item is personally handpicked.",
            "Fruit and vegetables are sold as individual products with their own pages.",
            "Prices are shown in South African rand where a selling price is listed.",
          ],
        },
        {
          heading: "Shop fresh produce online",
          body: [
            "Open the full catalogue, or go straight into vegetables or fruit, then choose a named product. We offer nationwide delivery across South Africa; areas, time slots and fees are listed on the delivery page when they are published.",
            "Guides on storing staples and using leftovers sit in the produce guides. They are written to be useful in the kitchen, not as a content farm.",
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
        "This is the complete catalogue index — not a second vegetables page. Open Vegetables or Fruit to shop one aisle, or stay here to scan every listed item.",
      sections: [
        {
          heading: "All products",
          body: [
            "Every product below has its own URL. Vegetables and fruit each have a separate aisle page so those searches do not compete with this catalogue index.",
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
            "The catalogue is organised into vegetables, fruit and the full shop index. Produce boxes will appear when a box is listed for sale. Each product has its own page.",
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
            "Prices are shown in South African rand where a selling price is listed. If a product has no selling price yet, the page says so instead of inventing a figure. Availability is taken from the current catalogue.",
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
        "These pages cover storage, choosing between similar packs, and using leftovers. They are not a magazine, a farm tour, or medical advice.",
      sections: [
        {
          heading: "What is here",
          body: [
            "Each guide links to the shop products it is about. If you only need the pack in front of you, open the product page instead.",
          ],
        },
      ],
    },
    recipes: {
      title: "Household Recipes",
      description:
        "A small set of household recipes that use produce from the M & M Premium Produce shop. Cook by doneness, not invented timers.",
      h1: "Household recipes",
      intro:
        "Two weekday methods only: roast potatoes with onion, and a pan of carrots and onions. This is not a recipe magazine.",
      sections: [
        {
          heading: "What is here",
          body: [
            "Ingredients and steps are written for a home kitchen. There are no fabricated ratings, nutrition panels or cook times.",
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
            "Elke item word persoonlik deur ons uitgesoek.",
            "Vrugte en groente word as afsonderlike produkte met eie bladsye verkoop.",
            "Pryse word in Suid-Afrikaanse rand gewys waar ’n verkoopprys gelys is.",
          ],
        },
        {
          heading: "Koop vars produkte aanlyn",
          body: [
            "Maak die volle katalogus oop, of gaan direk na groente of vrugte, en kies dan ’n genoemde produk. Ons bied landswye aflewering regoor Suid-Afrika; areas, tydgleuwe en fooie staan op die afleweringsblad wanneer dit gepubliseer is.",
            "Gidse oor die berg van stapels en die gebruik van oorskiet sit by die produk-gidse. Hulle is vir die kombuis geskryf, nie as ’n inhoudsplaas nie.",
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
        "Hierdie is die volledige katalogusindeks — nie ’n tweede groenteblad nie. Maak Groente of Vrugte oop vir een gang, of bly hier om elke gelyste item te sien.",
      sections: [
        {
          heading: "Alle produkte",
          body: [
            "Elke produk hieronder het sy eie URL. Groente en vrugte het elk ’n aparte gangblad sodat daardie soektogte nie met hierdie katalogusindeks kompeteer nie.",
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
            "Die katalogus is ingedeel in groente, vrugte en die volle winkelindeks. Produkbokse verskyn wanneer ’n boks te koop gelys is. Elke produk het sy eie blad.",
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
            "Pryse word in Suid-Afrikaanse rand gewys waar ’n verkoopprys gelys is. As ’n produk nog nie ’n verkoopprys het nie, sê die blad so — ons maak nie ’n syfer op nie. Beskikbaarheid kom uit die huidige katalogus.",
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
        "Hierdie bladsye dek berging, die keuse tussen soortgelyke pakke, en die gebruik van oorskiet. Dit is nie ’n tydskrif, ’n plaastoer of mediese raad nie.",
      sections: [
        {
          heading: "Wat is hier",
          body: [
            "Elke gids skakel na die winkelprodukte waaroor dit gaan. As jy net die pak voor jou nodig het, maak liewer die produkblad oop.",
          ],
        },
      ],
    },
    recipes: {
      title: "Huishoudelike resepte",
      description:
        "’n Klein stel huishoudelike resepte wat produkte uit die M & M Premium Produce-winkel gebruik. Kook tot gaar, nie volgens verdigte timers nie.",
      h1: "Huishoudelike resepte",
      intro:
        "Net twee weeksdae-metodes: gebraaide aartappels met ui, en ’n pan wortels en uie. Dit is nie ’n resepte-tydskrif nie.",
      sections: [
        {
          heading: "Wat is hier",
          body: [
            "Bestanddele en stappe is vir ’n huiskombuis geskryf. Daar is geen verdigte graderings, voedingstabelle of kooktye nie.",
          ],
        },
      ],
    },
  },
};

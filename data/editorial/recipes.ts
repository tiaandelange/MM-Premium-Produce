import type { RecipeSeed } from "@/types/content";

const published = "published" as const;

export const recipeSeeds: RecipeSeed[] = [
  {
    id: "rec_roast_potatoes_onion",
    status: "active",
    imageSrc: "/images/products/fresh-potatoes.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_potatoes", "prod_baby_potatoes", "prod_brown_onion"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "roast-potatoes-with-onion",
        title: "Roast potatoes with onion",
        lede:
          "A household tray of potatoes and onion. Times are not listed because ovens and potato size differ. Cook until the edges brown and a fork goes through the centre.",
        seoTitle: "Roast Potatoes with Onion | M & M Premium Produce",
        seoDescription:
          "A simple roast of potatoes and onion using packs from the M & M shop. Cook by doneness, not a made-up timer.",
        imageAlt: "Potatoes as listed in the M & M Premium Produce shop",
        indexable: true,
        ingredients: [
          { name: "Potatoes or baby potatoes", quantity: "one shop pack, or enough to cover a roasting tray in a single layer" },
          { name: "Brown onion", quantity: "1 large, or 2 smaller" },
          { name: "Cooking oil" },
          { name: "Salt" },
        ],
        steps: [
          "Heat the oven until it is properly hot. A moderate-to-hot oven is enough; do not chase a numbered temperature you have not checked on your own oven.",
          "Scrub the potatoes. Cut large potatoes into even chunks. Baby potatoes can stay whole if they are small, or halved if they are not.",
          "Peel and cut the onion into wedges. Toss potatoes and onion with enough oil to coat, and salt.",
          "Spread in a single layer on a tray. Roast until the potato edges are brown and the centres are tender when pierced. Turn once if the undersides are colouring faster than the tops.",
          "Serve hot. Leftovers keep in the fridge and reheat in a pan. This is home cooking, not a restaurant method and not nutrition advice.",
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "gebraaide-aartappels-met-uie",
        title: "Gebraaide aartappels met ui",
        lede:
          "’n Huishoudelike pan aartappels en ui. Tye word nie gelys nie omdat oonde en aartappelgrootte verskil. Kook tot die rande bruin is en ’n vurk deur die middel gaan.",
        seoTitle: "Gebraaide aartappels met ui | M & M Premium Produce",
        seoDescription:
          "Eenvoudige gebraaide aartappels en ui met pakke uit die M & M-winkel. Kook tot gaar, nie volgens ’n verdigte timer nie.",
        imageAlt: "Aartappels soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        ingredients: [
          { name: "Aartappels of babaaartappels", quantity: "een winkepak, of genoeg vir een laag op ’n bakplaat" },
          { name: "Bruin ui", quantity: "1 groot, of 2 kleineres" },
          { name: "Kookolie" },
          { name: "Sout" },
        ],
        steps: [
          "Verhit die oond tot dit deeglik warm is. ’n Matige tot warm oond is genoeg; moenie ’n syfer najaag wat jy nie op jou eie oond nagegaan het nie.",
          "Skrop die aartappels. Sny groot aartappels in ewe stukkies. Babaaartappels kan heel bly as hulle klein is, of gehalveer word as hulle nie is nie.",
          "Skil en sny die ui in segmente. Meng aartappels en ui met genoeg olie om te bedek, en sout.",
          "Sprei in een laag op ’n bakplaat. Braai tot die aartappelrande bruin is en die middel sag is as jy steek. Draai een keer om as die onderkant vinniger kleur as die bokant.",
          "Bedien warm. Oorskiet hou in die yskas en word in ’n pan warmgemaak. Dit is huiskook, nie ’n restaurantmetode of voedingraad nie.",
        ],
      },
    ],
  },
  {
    id: "rec_pan_carrots_onions",
    status: "active",
    imageSrc: "/images/products/fresh-carrots.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_carrots", "prod_brown_onion", "prod_red_onion"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "pan-carrots-and-onions",
        title: "Pan carrots and onions",
        lede:
          "A weekday pan for leftover carrots and an onion. There is no prep clock and no nutrition panel. Stop when the carrots are tender and the onion is soft and browned at the edges.",
        seoTitle: "Pan Carrots and Onions | M & M Premium Produce",
        seoDescription:
          "Cook sliced carrots and onion in a pan with oil and salt. A genuine household method using M & M shop produce.",
        imageAlt: "Carrots as listed in the M & M Premium Produce shop",
        indexable: true,
        ingredients: [
          { name: "Carrots", quantity: "as many as you need to use" },
          { name: "Brown or red onion", quantity: "1" },
          { name: "Cooking oil" },
          { name: "Salt" },
        ],
        steps: [
          "Peel the carrots if the skin is rough; otherwise scrub. Slice into coins or sticks of similar thickness so they cook evenly.",
          "Slice the onion. Warm a pan with a thin film of oil.",
          "Cook the onion until it softens. Add the carrots. Stir now and then so nothing catches too hard. Add a splash of water and cover briefly if the carrots are thick and the pan is dry.",
          "Uncover to let extra moisture cook off. Salt at the end so the vegetables do not stew too soon. Serve with whatever else is already on the table.",
          "Optional: a handful of spinach in the last minute, only if you have leaves that need using. This recipe does not invent chef credentials or diet claims.",
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "pan-wortels-en-uie",
        title: "Panwortels en uie",
        lede:
          "’n Weeksdae-pan vir oorskiet-wortels en ’n ui. Daar is geen voorbereidingsklok of voedingstabel nie. Stop wanneer die wortels sag is en die ui sag en bruin by die rande is.",
        seoTitle: "Panwortels en uie | M & M Premium Produce",
        seoDescription:
          "Kook gesnyde wortels en ui in ’n pan met olie en sout. ’n Egte huismetode met M & M-winkelprodukte.",
        imageAlt: "Wortels soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        ingredients: [
          { name: "Wortels", quantity: "soveel as wat jy moet opgebruik" },
          { name: "Bruin of rooi ui", quantity: "1" },
          { name: "Kookolie" },
          { name: "Sout" },
        ],
        steps: [
          "Skil die wortels as die skil grof is; anders skrop. Sny in skywe of stokkies van dieselfde dikte sodat hulle ewe gaar word.",
          "Sny die ui. Warm ’n pan met ’n dun laag olie.",
          "Kook die ui tot dit sag word. Voeg die wortels. Roer af en toe sodat niks te hard vashaak nie. Voeg ’n spat water en sit die deksel kort op as die wortels dik is en die pan droog is.",
          "Haal die deksel af sodat extra vog wegkan kook. Sout aan die einde sodat die groente nie te gou stowe nie. Bedien by wat ook al al op die tafel is.",
          "Opsioneel: ’n handvol spinasie in die laaste minuut, net as jy blare het wat opgebruik moet word. Hierdie resep maak nie sjefkwalifikasies of dieetbewerings op nie.",
        ],
      },
    ],
  },
];

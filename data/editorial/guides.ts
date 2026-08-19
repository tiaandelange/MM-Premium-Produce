import type { ArticleSeed } from "@/types/content";

const published = "published" as const;

export const guideSeeds: ArticleSeed[] = [
  {
    id: "art_store_potatoes_onions",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-potatoes.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_potatoes", "prod_baby_potatoes", "prod_brown_onion", "prod_red_onion"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "store-potatoes-and-onions",
        title: "How to store potatoes and onions",
        lede:
          "Potatoes and onions keep well at home if they stay dry, dark and apart from each other. This is household storage, not a farm or packing-room process.",
        seoTitle: "How to Store Potatoes and Onions | M & M Premium Produce",
        seoDescription:
          "Keep potatoes and onions in a cool, dry, dark place, and store them separately. Practical home storage for packs from the M & M Premium Produce shop.",
        imageAlt: "Potatoes as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Keep them separate",
            body: [
              "Do not store potatoes and onions in the same bag or bowl. Onions give off moisture and gases that make potatoes sprout and spoil sooner. Give each a tray, paper bag or crate with some airflow.",
              "If you bought both in one order, unpack them as soon as you get home. Leave supermarket plastic open or move the produce into something that can breathe.",
            ],
          },
          {
            heading: "Potatoes: cool, dark and dry",
            body: [
              "A cupboard, pantry or garage that stays cool and out of direct sun is better than the kitchen counter. Light turns potatoes green; warmth speeds sprouting.",
              "Do not refrigerate everyday potatoes. The fridge can change the texture and make them taste sweeter when cooked. Use damaged or sprouting potatoes first, and cut away green patches before cooking.",
              "Baby potatoes are the same plant, just smaller. They still want dark and dry storage, and they are often used sooner because the pack is smaller.",
            ],
          },
          {
            heading: "Onions: dry air, not a sealed bag",
            body: [
              "Brown and red onions keep longest in a dry place with air around them. A mesh bag, basket or open crate works. A closed plastic bag traps moisture and encourages mould.",
              "Once an onion is cut, wrap the unused piece and keep it in the fridge. Use it within a couple of days. Whole onions that feel soft, smell strongly of rot, or show black mould should be discarded.",
            ],
          },
          {
            heading: "What this guide is not",
            body: [
              "This is everyday kitchen advice for produce you buy by the pack. It is not medical or diet advice, and it does not describe how M & M stores stock before it is listed in the shop.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "berg-aartappels-en-uie",
        title: "Hoe om aartappels en uie te berg",
        lede:
          "Aartappels en uie hou by die huis as hulle droog, donker en uitmekaar bly. Dit is huishoudelike berging, nie ’n plaas- of pakproses nie.",
        seoTitle: "Hoe om aartappels en uie te berg | M & M Premium Produce",
        seoDescription:
          "Berg aartappels en uie koel, droog en donker, en hou hulle uitmekaar. Praktiese tuisberging vir pakke uit die M & M Premium Produce-winkel.",
        imageAlt: "Aartappels soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Hou hulle uitmekaar",
            body: [
              "Moenie aartappels en uie in dieselfde sak of bak sit nie. Uie gee vog en gasse af wat aartappels vinniger laat spruit en bederf. Gee elkeen ’n skinkbord, papiersak of krat met lugvloei.",
              "As jy albei in een bestelling gekry het, pak hulle oop sodra jy tuis is. Maak winkelplastiek oop of skuif die produkte in iets wat kan asemhaal.",
            ],
          },
          {
            heading: "Aartappels: koel, donker en droog",
            body: [
              "’n Kas, spens of motorhuis wat koel bly en uit direkte son is, is beter as die kombuistoonbank. Lig maak aartappels groen; hitte laat hulle vinniger spruit.",
              "Moenie alledaagse aartappels in die yskas sit nie. Die yskas kan die tekstuur verander en hulle soeter laat smaak wanneer jy kook. Gebruik beskadigde of spruitende aartappels eerste, en sny groen kolle weg voor jy kook.",
              "Babaaartappels is dieselfde plant, net kleiner. Hulle wil ook donker en droog berg, en word dikwels gouer gebruik omdat die pak kleiner is.",
            ],
          },
          {
            heading: "Uie: droë lug, nie ’n verseëlde sak nie",
            body: [
              "Bruin en rooi uie hou die langste in ’n droë plek met lug om hulle. ’n Netsak, mandjie of oop krat werk. ’n Toe plastieksak vang vog en help skimmel.",
              "Sodra ’n ui gesny is, draai die oorblywende stuk in en hou dit in die yskas. Gebruik dit binne ’n paar dae. Heel uie wat sag voel, sleg ruik of swart skimmel toon, moet weggegooi word.",
            ],
          },
          {
            heading: "Wat hierdie gids nie is nie",
            body: [
              "Dit is alledaagse kombuisraad vir produkte wat jy per pak koop. Dit is nie mediese of dieetraad nie, en dit beskryf nie hoe M & M voorraad berg voordat dit in die winkel gelys word nie.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_store_spinach_lettuce",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-baby-spinach.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_baby_spinach", "prod_spinach", "prod_iceberg_lettuce", "prod_cos_lettuce"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "store-spinach-and-lettuce",
        title: "How to store spinach and lettuce",
        lede:
          "Leafy greens wilt when they sit wet or warm. A cold fridge, dry leaves and a container that is not sealed soaking-wet will usually buy you extra days.",
        seoTitle: "How to Store Spinach and Lettuce | M & M Premium Produce",
        seoDescription:
          "Fridge storage for baby spinach, bunch spinach, iceberg and cos lettuce. Keep leaves dry and cold, and wash just before you eat.",
        imageAlt: "Baby spinach as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Fridge first",
            body: [
              "Spinach and lettuce belong in the fridge, not on the counter. The crisper drawer is useful because it is a little more humid than the rest of the fridge, but wet leaves still rot.",
              "Do not freeze these greens for salad. Freezing breaks the cells; the leaves turn limp when they thaw. Frozen spinach is a different product, for cooking, and is not what this shop lists.",
            ],
          },
          {
            heading: "Wash when you use it",
            body: [
              "If the pack is already washed, you can still rinse it before eating. Extra washing days before you need it leaves water in the bag and speeds slime.",
              "If you do wash a bunch of spinach or a head of lettuce ahead of time, dry it well. A clean tea towel or salad spinner, then a loosely closed container with a dry paper towel, works better than a dripping bag.",
            ],
          },
          {
            heading: "Baby spinach, bunch spinach, iceberg and cos",
            body: [
              "Baby spinach in a sealed bag should stay in that bag in the fridge until you open it. Squeeze the air out after each use if you can. Once it smells sour or the leaves are slimy, it is past using.",
              "Bunch spinach often has thicker stems. Stand the stems in a jar with a little water in the fridge only if the leaves stay dry; otherwise treat it like other greens and keep it dry and cold.",
              "Iceberg and cos last longer than spinach if the head stays whole. Keep the outer leaves on until you need them. Cut lettuce browns at the cut surface; cover it and use it soon.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "berg-spinasie-en-slaai",
        title: "Hoe om spinasie en slaai te berg",
        lede:
          "Blaargroente verlep as dit nat of warm staan. ’n Koue yskas, droë blare en ’n houer wat nie deurnat verseël is nie, koop gewoonlik ekstra dae.",
        seoTitle: "Hoe om spinasie en slaai te berg | M & M Premium Produce",
        seoDescription:
          "Yskasberging vir babaspinasie, bondelspinasie, ysberg- en cos-slaai. Hou blare droog en koud, en was net voor jy eet.",
        imageAlt: "Babaspinasie soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Eers die yskas",
            body: [
              "Spinasie en slaai hoort in die yskas, nie op die toonbank nie. Die groentelade help omdat dit ’n bietjie natter is as die res van die yskas, maar nat blare vrot steeds.",
              "Moenie hierdie groente vries vir slaai nie. Vries breek die selle; die blare word slap as hulle ontdooi. Bevrore spinasie is ’n ander produk, vir kook, en is nie wat hierdie winkel lys nie.",
            ],
          },
          {
            heading: "Was wanneer jy dit gebruik",
            body: [
              "As die pak al gewas is, kan jy dit steeds spoel voor jy eet. Extra wasdae voor jy dit nodig het, laat water in die sak en maak slym vinniger.",
              "As jy ’n bondel spinasie of ’n kop slaai vooruit was, droog dit deeglik. ’n Skoon teedoek of slaaidraaier, dan ’n los toegemaakte houer met ’n droë papierhanddoek, werk beter as ’n druppende sak.",
            ],
          },
          {
            heading: "Babaspinasie, bondelspinasie, ysberg en cos",
            body: [
              "Babaspinasie in ’n verseëlde sak moet in daardie sak in die yskas bly tot jy dit oopmaak. Druk die lug uit ná elke gebruik as jy kan. As dit suur ruik of die blare slymerig is, is dit verby.",
              "Bondelspinasie het dikwels dikker stingels. Sit die stingels in ’n fles met ’n bietjie water in die yskas net as die blare droog bly; anders behandel dit soos ander groente: droog en koud.",
              "Ysberg en cos hou langer as spinasie as die kop heel bly. Hou die buitenste blare aan tot jy hulle nodig het. Gesnyde slaai verbruin by die snykant; bedek dit en gebruik dit gou.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_store_carrots",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-carrots.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_carrots"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "store-carrots",
        title: "How to store carrots",
        lede:
          "Carrots last in the fridge if they stay cold and do not dry out. A sealed bag or container in the crisper is enough for most household packs.",
        seoTitle: "How to Store Carrots | M & M Premium Produce",
        seoDescription:
          "Fridge storage for carrots: keep them cold, covered, and away from apples if you can. Practical advice for packs from the shop.",
        imageAlt: "Carrots as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Fridge, covered",
            body: [
              "Leave carrots in their shop bag if it is intact, or move them into a container or reusable bag in the crisper. Uncovered carrots wrinkle as they lose moisture.",
              "If the carrots still have leafy tops, twist the tops off before storage. The leaves pull water out of the roots. This shop’s carrot packs are usually sold as roots only.",
            ],
          },
          {
            heading: "Soft, white or slimy",
            body: [
              "A little white blush on the surface is often dehydration, not mould. Trim it and cook as usual if the carrot is still firm. Soft, wet or smelly carrots should not be used.",
              "Cut carrot sticks dry out faster. Keep them in a closed container and use them within a few days. You can add a slightly damp paper towel if they look thirsty; do not leave them sitting in a pool of water.",
            ],
          },
          {
            heading: "Near fruit",
            body: [
              "Apples and some other fruit give off ethylene, which can make carrots taste bitter over time. If your fridge is small, a closed carrot bag still helps. This is ordinary kitchen storage, not a claim about commercial ripening rooms.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "berg-wortels",
        title: "Hoe om wortels te berg",
        lede:
          "Wortels hou in die yskas as hulle koud bly en nie uitdroog nie. ’n Toe sak of houer in die groentelade is genoeg vir die meeste huishoudelike pakke.",
        seoTitle: "Hoe om wortels te berg | M & M Premium Produce",
        seoDescription:
          "Yskasberging vir wortels: hou hulle koud, toegemaak, en weg van appels as jy kan. Praktiese raad vir winkepakke.",
        imageAlt: "Wortels soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Yskas, toegemaak",
            body: [
              "Laat wortels in hul winkelsak as dit heel is, of skuif hulle in ’n houer of herbruikbare sak in die groentelade. Oop wortels kreukel as hulle vog verloor.",
              "As die wortels nog blare het, draai die blare af voor berging. Die blare trek water uit die wortels. Hierdie winkel se wortelpakke word gewoonlik net as wortels verkoop.",
            ],
          },
          {
            heading: "Sag, wit of slymerig",
            body: [
              "’n Bietjie wit waas op die oppervlak is dikwels uitdroging, nie skimmel nie. Sny dit af en kook soos gewoonlik as die wortel nog ferm is. Sagte, nat of stinkende wortels moet nie gebruik word nie.",
              "Gesnyde wortelstokkies droog vinniger uit. Hou hulle in ’n toe houer en gebruik hulle binne ’n paar dae. Jy kan ’n effens klam papierhanddoek bysit as hulle dors lyk; moenie hulle in ’n poel water laat sit nie.",
            ],
          },
          {
            heading: "Naby vrugte",
            body: [
              "Appels en sommige ander vrugte gee etileen af, wat wortels mettertyd bitter kan laat smaak. As jou yskas klein is, help ’n toe wortelsak steeds. Dit is gewone kombuisberging, nie ’n bewering oor kommersiële rypkamers nie.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_keep_salad_fresh",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-cucumber.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_iceberg_lettuce", "prod_cos_lettuce", "prod_cucumber", "prod_cherry_tomatoes"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "keep-salad-produce-fresh",
        title: "How to keep salad produce fresh",
        lede:
          "Lettuce, cucumber and cherry tomatoes do not all want the same treatment. Split the fridge jobs so the salad you planned for Thursday still looks like salad.",
        seoTitle: "Keep Salad Produce Fresh | M & M Premium Produce",
        seoDescription:
          "Practical fridge and counter tips for lettuce, cucumber and cherry tomatoes so a mixed salad shop lasts more than one night.",
        imageAlt: "Cucumber as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Lettuce stays whole until you need it",
            body: [
              "Keep iceberg or cos as a head in the fridge. Once you shred it, the cut edges brown. Mix dressing only on the portion you will eat; leftover dressed salad collapses.",
            ],
          },
          {
            heading: "Cucumber: cold, not wet",
            body: [
              "Cucumber belongs in the fridge. Leave the skin on until you slice it. Cut cucumber should be covered. Soft, slippery or hollow cucumbers are past their best.",
            ],
          },
          {
            heading: "Cherry tomatoes: ripen, then chill soon",
            body: [
              "Firm, pale cherry tomatoes can sit in a bowl out of direct sun until they colour and smell like tomato. Once they are ripe, the fridge slows them down. Cold tomatoes taste duller; bring them out shortly before you eat if you care about flavour.",
              "Do not store tomatoes in a sealed wet bag with lettuce. The moisture and gases work against both. Keep salad fruit and salad leaves in separate containers.",
            ],
          },
          {
            heading: "Build the salad when you eat",
            body: [
              "Wash and dry leaves, slice cucumber, and halve tomatoes just before serving. That is more useful than any trick that claims a mixed bowl will last a week.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "hou-slaai-vars",
        title: "Hoe om slaai-produkte vars te hou",
        lede:
          "Slaai, komkommer en kersietamaties wil nie almal dieselfde behandeling hê nie. Verdeel die yskastake sodat die slaai wat jy vir Donderdag beplan het, nog soos slaai lyk.",
        seoTitle: "Hou slaai-produkte vars | M & M Premium Produce",
        seoDescription:
          "Praktiese yskas- en toonbankwenke vir slaai, komkommer en kersietamaties sodat ’n gemengde slaai-inkopie langer as een nag hou.",
        imageAlt: "Komkommer soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Slaai bly heel tot jy dit nodig het",
            body: [
              "Hou ysberg of cos as ’n kop in die yskas. Sodra jy dit fyn sny, verbruin die snykante. Meng dressing net op die porsie wat jy gaan eet; oorskiet-aangemaakte slaai sak inmekaar.",
            ],
          },
          {
            heading: "Komkommer: koud, nie nat nie",
            body: [
              "Komkommer hoort in die yskas. Los die skil tot jy sny. Gesnyde komkommer moet toegemaak word. Sagte, glibberige of hol komkommers is verby hul beste.",
            ],
          },
          {
            heading: "Kersietamaties: ryp, dan gou koud",
            body: [
              "Ferm, ligte kersietamaties kan in ’n bak uit direkte son sit tot hulle kleur en soos tamatie ruik. Sodra hulle ryp is, vertraag die yskas hulle. Kou tamaties smaak dowwer; haal hulle kort voor jy eet uit as smaak vir jou saak maak.",
              "Moenie tamaties in ’n nat, toe sak saam met slaai berg nie. Die vog en gasse werk teen albei. Hou slaai-vrugte en slaai-blare in aparte houers.",
            ],
          },
          {
            heading: "Maak die slaai wanneer jy eet",
            body: [
              "Was en droog blare, sny komkommer, en halveer tamaties net voor jy opdien. Dit help meer as enige truuk wat beweer ’n gemengde bak hou ’n week.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_store_apples",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-apples.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_apples"],
    categoryIds: ["cat_fruit"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "store-apples",
        title: "How to store apples",
        lede:
          "Apples keep longer in the fridge than in a fruit bowl. A cool drawer also keeps them from speeding up other produce nearby.",
        seoTitle: "How to Store Apples | M & M Premium Produce",
        seoDescription:
          "Store apples in the fridge for longer keeping, and keep bruised fruit separate. Household advice for packs from the M & M shop.",
        imageAlt: "Apples as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Bowl for a few days, fridge for longer",
            body: [
              "A bowl on the counter is fine if you will eat the apples this week and the room is not hot. For a 1.5 kg pack, the fridge is the safer default in a South African kitchen.",
              "Keep them in a bag or drawer so they do not pick up fridge smells. Do not wash until you eat; extra water in the pack encourages rot at the stem.",
            ],
          },
          {
            heading: "Bruises spread",
            body: [
              "Check the pack when it arrives. Eat or cook bruised apples first. One rotting apple will take neighbours with it.",
              "The shop lists more than one apple type (for example Granny Smith, Fuji, Crisp Pink). Storage is the same. Flavour and how long they stay crisp still vary by type and how ripe they were when packed.",
            ],
          },
          {
            heading: "Away from leafy greens",
            body: [
              "Apples give off ethylene. If lettuce or carrots share a small fridge, keep apples in their own bag. That is ordinary produce chemistry, not a health claim.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "berg-appels",
        title: "Hoe om appels te berg",
        lede:
          "Appels hou langer in die yskas as in ’n vrugtebak. ’n Kou laai hou hulle ook daarvan om ander produkte naby vinniger ryp te maak.",
        seoTitle: "Hoe om appels te berg | M & M Premium Produce",
        seoDescription:
          "Berg appels in die yskas vir langer hou, en hou gekneusde vrugte uitmekaar. Huishoudelike raad vir pakke uit die M & M-winkel.",
        imageAlt: "Appels soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Bak vir ’n paar dae, yskas vir langer",
            body: [
              "’n Bak op die toonbank is reg as jy die appels hierdie week eet en die kamer nie warm is nie. Vir ’n 1,5 kg-pak is die yskas die veiliger keuse in ’n Suid-Afrikaanse kombuis.",
              "Hou hulle in ’n sak of laai sodat hulle nie yskasreuke optel nie. Moenie was tot jy eet nie; extra water in die pak help vrot by die stingel.",
            ],
          },
          {
            heading: "Kneusplekke versprei",
            body: [
              "Kyk die pak wanneer dit aankom. Eet of kook gekneusde appels eerste. Een vrot appel vat bure saam.",
              "Die winkel lys meer as een appelsoort (byvoorbeeld Granny Smith, Fuji, Crisp Pink). Berging is dieselfde. Smaak en hoe lank hulle ferm bly, verskil steeds per soort en hoe ryp hulle was toe hulle gepak is.",
            ],
          },
          {
            heading: "Weg van blaargroente",
            body: [
              "Appels gee etileen af. As slaai of wortels ’n klein yskas deel, hou appels in hul eie sak. Dit is gewone produkchemie, nie ’n gesondheidsbewering nie.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_baby_vs_bunch_spinach",
    kind: "guide",
    status: "active",
    imageSrc: "/images/products/fresh-baby-spinach.webp",
    imageWidth: 1200,
    imageHeight: 1286,
    productIds: ["prod_baby_spinach", "prod_spinach"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "baby-spinach-or-bunch-spinach",
        title: "Baby spinach or bunch spinach?",
        lede:
          "Both are spinach. The difference is leaf size, stem, and how you usually cook them. Choose from the two products in the shop, not from a generic “spinach” search that mixes packs.",
        seoTitle: "Baby Spinach or Bunch Spinach? | M & M Premium Produce",
        seoDescription:
          "How baby spinach and bunch spinach differ in the M & M shop: tender bags for salad versus thicker bunches for cooking.",
        imageAlt: "Baby spinach as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Baby spinach",
            body: [
              "The shop lists baby spinach as a packed leafy product. The leaves are small and tender. It is the usual choice for salads, sandwiches and a quick wilt in a pan. Use the bag while the leaves are dry and green; once they clump and smell off, they are done.",
            ],
          },
          {
            heading: "Bunch spinach",
            body: [
              "Bunch spinach is sold as a bundle with more stem. The leaves are larger and stand up to longer cooking — soup, stew, a pan with onion, or creamed spinach in the South African sense. Strip thick stems if they are tough, or cook them a little longer than the leaves.",
            ],
          },
          {
            heading: "You can substitute, with judgement",
            body: [
              "Baby spinach can go in a cooked dish; it shrinks a lot and can turn very soft. Bunch spinach can be sliced raw into a salad if the leaves are young, but older bunches are better cooked.",
              "Pack weights differ. Check the product page for the current size. This is a buying guide, not nutrition or medical advice.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "babaspinasie-of-bondel-spinasie",
        title: "Babaspinasie of bondelspinasie?",
        lede:
          "Albei is spinasie. Die verskil is blaargrootte, stingel, en hoe jy dit gewoonlik kook. Kies tussen die twee produkte in die winkel, nie uit ’n algemene “spinasie”-soektog wat pakke meng nie.",
        seoTitle: "Babaspinasie of bondelspinasie? | M & M Premium Produce",
        seoDescription:
          "Hoe babaspinasie en bondelspinasie in die M & M-winkel verskil: sagte sakke vir slaai teenoor dikker bondels vir kook.",
        imageAlt: "Babaspinasie soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Babaspinasie",
            body: [
              "Die winkel lys babaspinasie as ’n verpakte blaarproduk. Die blare is klein en sag. Dit is die gewone keuse vir slaai, toebroodjies en ’n vinnige slink in ’n pan. Gebruik die sak terwyl die blare droog en groen is; sodra hulle klont en sleg ruik, is hulle klaar.",
            ],
          },
          {
            heading: "Bondelspinasie",
            body: [
              "Bondelspinasie word as ’n bondel met meer stingel verkoop. Die blare is groter en hou by langer kook — sop, bredie, ’n pan met ui, of roomspinasie. Trek dik stingels af as hulle taai is, of kook hulle ’n bietjie langer as die blare.",
            ],
          },
          {
            heading: "Jy kan ruil, met oordeel",
            body: [
              "Babaspinasie kan in ’n gaar gereg; dit krimp baie en kan baie sag word. Bondelspinasie kan rou in ’n slaai as die blare jonk is, maar ouer bondels is beter gaar.",
              "Pakgewigte verskil. Kyk die produkblad vir die huidige grootte. Dit is ’n koopgids, nie voeding- of mediese raad nie.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "art_use_leftover_vegetables",
    kind: "guide",
    status: "active",
    imageSrc: "/images/categories/vegetables.webp",
    imageWidth: 1600,
    imageHeight: 1067,
    productIds: ["prod_potatoes", "prod_carrots", "prod_brown_onion", "prod_spinach", "prod_cabbage"],
    categoryIds: ["cat_vegetables"],
    translations: [
      {
        locale: "en",
        status: published,
        slug: "use-leftover-vegetables",
        title: "Use leftover vegetables before they spoil",
        lede:
          "A mixed vegetable order often leaves odds and ends. Cook the tired pieces first. This is waste reduction at home, not a claim about M & M’s packing rooms.",
        seoTitle: "Use Leftover Vegetables | M & M Premium Produce",
        seoDescription:
          "Practical ways to use leftover potatoes, carrots, onions, spinach and cabbage from a fresh-produce order before they spoil.",
        imageAlt: "Vegetables as listed in the M & M Premium Produce shop",
        indexable: true,
        sections: [
          {
            heading: "Sort when the order arrives",
            body: [
              "Put leafy greens in the fridge the same day. Potatoes and onions go to a cool, dry place, separately. Carrots go in the fridge covered. Apples, if you bought fruit, should not share an open bowl with greens.",
            ],
          },
          {
            heading: "Cook what will fail first",
            body: [
              "Spinach and salad leaves go first. Then cucumber and cut vegetables. Whole cabbage, carrots, potatoes and onions last longer.",
              "A pan of onion and carrot, or roast potatoes, uses the staples without needing a special occasion. Soft herbs and dressings are optional; salt, oil and heat are enough.",
            ],
          },
          {
            heading: "What still counts as usable",
            body: [
              "Wilted spinach can still go in a hot pan. Limp carrots can still be sliced for cooking. Potatoes with small sprouts can be used if you cut the sprouts away and the potato is firm. Throw out mould, slime, or a rotten smell.",
              "This page does not give food-safety certification or medical advice. When you are unsure, discard the item.",
            ],
          },
        ],
      },
      {
        locale: "af",
        status: published,
        slug: "gebruik-oorskiet-groente",
        title: "Gebruik oorskiet-groente voor dit bederf",
        lede:
          "’n Gemengde groente-bestelling laat dikwels stukkies oor. Kook eers die moeg stukke. Dit is vermorsing beperk by die huis, nie ’n bewering oor M & M se pakkamers nie.",
        seoTitle: "Gebruik oorskiet-groente | M & M Premium Produce",
        seoDescription:
          "Praktiese maniere om oorskiet-aartappels, wortels, uie, spinasie en kool uit ’n varsproduk-bestelling te gebruik voor dit bederf.",
        imageAlt: "Groente soos in die M & M Premium Produce-winkel gelys",
        indexable: true,
        sections: [
          {
            heading: "Sorteer wanneer die bestelling aankom",
            body: [
              "Sit blaargroente dieselfde dag in die yskas. Aartappels en uie gaan na ’n koel, droë plek, uitmekaar. Wortels gaan toegemaak in die yskas. Appels, as jy vrugte gekoop het, moet nie ’n oop bak met groente deel nie.",
            ],
          },
          {
            heading: "Kook eers wat eerste sal faal",
            body: [
              "Spinasie en slaai-blare eerste. Dan komkommer en gesnyde groente. Heel kool, wortels, aartappels en uie hou langer.",
              "’n Pan ui en wortel, of gebraaide aartappels, gebruik die stapels sonder ’n spesiale geleentheid. Sagte kruie en dressings is opsioneel; sout, olie en hitte is genoeg.",
            ],
          },
          {
            heading: "Wat nog bruikbaar is",
            body: [
              "Verlepte spinasie kan nog in ’n warm pan. Slap wortels kan nog vir kook gesny word. Aartappels met klein spruite kan gebruik word as jy die spruite wegsny en die aartappel ferm is. Gooi skimmel, slym of ’n vrot reuk weg.",
              "Hierdie blad gee nie voedselsertifisering of mediese raad nie. As jy onseker is, gooi die item weg.",
            ],
          },
        ],
      },
    ],
  },
];

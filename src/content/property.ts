import { z } from "zod";

// ---------------------------------------------------------------------------
// Dynamic zone sub-schemas
// ---------------------------------------------------------------------------

const lienExterneSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const elementChecklistSchema = z.object({
  texte: z.string(),
});

const elementDropdownSchema = z.object({
  titre: z.string(),
  description: z.string(),
  // Images optionnelles par entrée d'accordéon (retour cliente 2026-07-07 :
  // section Logement « il manque les images »). Tableau d'URLs déjà extraites.
  // Optionnel dans le type (le mock n'en a pas) ; le transform réel remplit
  // toujours un tableau.
  images: z.array(z.string()).optional(),
});

// ---------------------------------------------------------------------------
// Dynamic zone component schemas (discriminated union on __component)
// ---------------------------------------------------------------------------

const blocSchema = z.object({
  __component: z.literal("guide.bloc"),
  id: z.number(),
  titre: z.string().optional(),
  surtitre: z.string().optional(),
  contenu: z.string().optional(),
  images: z.array(z.string()),
  liens: z.array(lienExterneSchema).optional(),
  misEnAvant: z.boolean(),
  centrerBouton: z.boolean().optional(),
});

const noteSchema = z.object({
  __component: z.literal("guide.note"),
  id: z.number(),
  surtitre: z.string().optional(),
  titre: z.string().optional(),
  contenu: z.string(),
  centre: z.boolean().optional(),
});

const checklistSchema = z.object({
  __component: z.literal("guide.checklist"),
  id: z.number(),
  titre: z.string(),
  elements: z.array(elementChecklistSchema),
});

const dropdownSchema = z.object({
  __component: z.literal("guide.dropdown"),
  id: z.number(),
  elements: z.array(elementDropdownSchema),
});

const adresseAccesSchema = z.object({
  __component: z.literal("guide.adresse-acces"),
  id: z.number(),
  note: z.string().optional(),
});

// Le composant `guide.contenu-reutilisable-ref` n'apparaît jamais comme bloc
// final côté frontend — il est résolu et aplati en blocs concrets dans
// `transformDynamicZone` (api/guide.ts). Le voyageur ne le voit jamais.
export const dynamicZoneBlockSchema = z.discriminatedUnion("__component", [
  blocSchema,
  noteSchema,
  checklistSchema,
  dropdownSchema,
  adresseAccesSchema,
]);

export type DynamicZoneBlock = z.infer<typeof dynamicZoneBlockSchema>;
export type BlocBlock = z.infer<typeof blocSchema>;
export type NoteBlock = z.infer<typeof noteSchema>;
export type ChecklistBlock = z.infer<typeof checklistSchema>;
export type DropdownBlock = z.infer<typeof dropdownSchema>;
export type AdresseAccesBlock = z.infer<typeof adresseAccesSchema>;

// ---------------------------------------------------------------------------
// Pages personnalisées (retour cliente 2026-07-07) : pages illimitées ajoutées
// par logement (Jacuzzi, Piscine…), avec leur icône de nav et leurs blocs.
// ---------------------------------------------------------------------------

// Valeurs d'icône = enum côté Strapi (guide-page.icone). Mappées vers un
// composant lucide dans GuideHome (ICON_MAP). `.catch` → repli défensif si une
// nouvelle valeur d'enum arrive avant la mise à jour du mapping.
export const customPageIconSchema = z
  .enum([
    "jacuzzi",
    "piscine",
    "sport",
    "sauna",
    "jeux",
    "recharge",
    "tennis",
    "wifi",
    "television",
    "cuisine",
    "cheminee",
    "montagne",
    "etoile",
    "autre",
  ])
  .catch("autre");

export type CustomPageIcon = z.infer<typeof customPageIconSchema>;

export const customPageSchema = z.object({
  id: z.number(),
  titre: z.string(),
  icone: customPageIconSchema,
  ordre: z.number().default(0),
  contenu: z.array(dynamicZoneBlockSchema),
});

export type CustomPage = z.infer<typeof customPageSchema>;

/** Slug lisible depuis un titre : « Salle de sport » → « salle-de-sport ». */
export function slugifyTitle(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les accents décomposés (NFD)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Repli/compat : ancienne clé de route `p-<id>`. */
export const customPageFallbackKey = (id: number) => `p-${id}`;

/**
 * Clé de route d'une page perso, dérivée du titre pour une URL lisible
 * (`/guide/jacuzzi`). Repli sur `p-<id>` si le titre ne donne pas de slug.
 * L'unicité n'a besoin d'être vraie qu'au sein d'un guide (l'URL est préfixée
 * par le slug du guide) — GuideSection accepte aussi l'ancienne clé `p-<id>`.
 */
export const customPageRouteKey = (page: { titre: string; id: number }): string =>
  slugifyTitle(page.titre) || customPageFallbackKey(page.id);

// ---------------------------------------------------------------------------
// Property schema
// ---------------------------------------------------------------------------

export const propertySchema = z.object({
  nom: z.string(),
  slug: z.string(),
  imagePrincipale: z.string().optional(),
  destination: z.string().optional(),
  localisation: z.object({
    address: z.string(),
    mapsUrl: z.string(),
  }),
  whatsapp: z.string(),

  infos: z.object({
    heureArrivee: z.string(),
    codeImmeuble: z.string().optional(),
    codeBoiteACles: z.string().optional(),
    codesSupplementaires: z.array(z.object({ nom: z.string(), valeur: z.string() })).default([]),
    heureDepart: z.string(),
    noteGenerale: z.string().optional(),
  }),

  wifi: z.object({
    nomReseau: z.string(),
    motDePasse: z.string(),
  }),

  arriveeContenu: z.array(dynamicZoneBlockSchema),
  departContenu: z.array(dynamicZoneBlockSchema),
  parkingContenu: z.array(dynamicZoneBlockSchema),
  logementContenu: z.array(dynamicZoneBlockSchema),
  dechetsContenu: z.array(dynamicZoneBlockSchema),
  regionContenu: z.array(dynamicZoneBlockSchema),
  reglesContenu: z.array(dynamicZoneBlockSchema),

  // Optionnel dans le type (le mock n'en a pas) ; le transform réel remplit
  // toujours un tableau (trié par `ordre`).
  pagesPersonnalisees: z.array(customPageSchema).optional(),
});

export type Property = z.infer<typeof propertySchema>;

// ---------------------------------------------------------------------------
// Section key → contenu field mapping
// ---------------------------------------------------------------------------

export const SECTION_CONTENU_KEYS = {
  "check-in": "arriveeContenu",
  "check-out": "departContenu",
  parking: "parkingContenu",
  property: "logementContenu",
  "waste-recycling": "dechetsContenu",
  area: "regionContenu",
  rules: "reglesContenu",
} as const satisfies Record<string, keyof Property>;

export type SectionKey = keyof typeof SECTION_CONTENU_KEYS;

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const property: Property = {
  nom: "Le Saint Georges",
  slug: "le-saint-georges",
  imagePrincipale: undefined,
  destination: undefined,
  localisation: {
    address: "Le Saint Georges — [Adresse complète], Valais",
    mapsUrl: "https://maps.google.com/?q=Le+Saint+Georges,+Valais,+Suisse",
  },
  whatsapp: "+41791234567",

  infos: {
    heureArrivee: "Dès 17h00",
    codeImmeuble: "4521",
    codeBoiteACles: "137617",
    codesSupplementaires: [],
    heureDepart: "Avant 11h00",
  },

  wifi: {
    nomReseau: "Netplus-d17347",
    motDePasse: "9mXmxffe",
  },

  arriveeContenu: [
    {
      __component: "guide.note",
      id: 1,
      contenu: "💡 La clé ouvre également le local à ski au sous-sol.",
    },
    {
      __component: "guide.bloc",
      id: 2,
      titre: "Récupérez la clé",
      contenu: "La boîte à clé se trouve à l'entrée du bâtiment. Code : 137617.",
      images: ["Photo boîte à clé"],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 3,
      titre: "Entrez dans l'immeuble",
      contenu: "Composez le code du bâtiment sur le digicode : 4521.",
      images: ["Photo entrée immeuble", "Photo digicode", "Photo hall d'entrée"],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 4,
      titre: "Montez au 2ème étage",
      contenu: "Par les escaliers ou l'ascenseur.",
      images: ["Photo couloir / ascenseur"],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 5,
      titre: "Ouvrez l'appartement",
      contenu: "La même clé ouvre votre porte d'entrée.",
      images: ["Photo porte appartement"],
      misEnAvant: false,
    },
  ],

  departContenu: [
    {
      __component: "guide.note",
      id: 10,
      contenu:
        "Merci de laisser l'appartement dans un état correct. Un supplément pourra être facturé en cas de ménage excessif.",
    },
    {
      __component: "guide.checklist",
      id: 11,
      titre: "Checklist de départ",
      elements: [
        { texte: "Lancez un cycle de lave-vaisselle si nécessaire." },
        { texte: "Videz les poubelles dans les containers à l'arrière du bâtiment." },
        { texte: "Fermez toutes les fenêtres et éteignez les lumières." },
        { texte: "Laissez le thermostat sur 18°C." },
        { texte: "Vérifiez que rien n'a été oublié (placards, réfrigérateur, salle de bain)." },
        { texte: "Replacez la clé dans la boîte à clé à l'entrée du bâtiment." },
      ],
    },
  ],

  parkingContenu: [
    {
      __component: "guide.note",
      id: 20,
      contenu: "❄️ En hiver, merci de ne pas bloquer l'accès au déneigement.",
    },
    {
      __component: "guide.bloc",
      id: 21,
      titre: "Parking privé",
      contenu:
        "Une place de parking est disponible devant le bâtiment. La télécommande du garage se trouve dans le tiroir de l'entrée.",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 22,
      titre: "Parking public",
      contenu:
        "Pour les véhicules de grande taille, un parking public gratuit se trouve à 200m en direction du centre.",
      images: [],
      misEnAvant: false,
    },
  ],

  logementContenu: [
    {
      __component: "guide.bloc",
      id: 30,
      titre: "",
      contenu:
        "Voici les informations pratiques pour profiter de votre logement. N'hésitez pas à nous contacter si vous avez la moindre question.",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.dropdown",
      id: 31,
      elements: [
        {
          titre: "Cuisine",
          description:
            "Machine Nespresso (capsules fournies), lave-vaisselle, four, micro-ondes. Ustensiles et vaisselle dans les placards.",
        },
        {
          titre: "Salle de bain",
          description:
            "Serviettes fournies. Des serviettes supplémentaires sont disponibles dans l'armoire du couloir. Sèche-cheveux sous le lavabo.",
        },
        {
          titre: "Chauffage & Thermostat",
          description:
            "Le thermostat se trouve dans le couloir. Merci de le laisser sur 18°C à votre départ.",
        },
        {
          titre: "TV & WiFi",
          description:
            "Chaînes internationales disponibles. Le WiFi couvre l'ensemble de l'appartement. Identifiants affichés sur la page d'accueil du guide.",
        },
        {
          titre: "Buanderie",
          description:
            "Machine à laver et sèche-linge au sous-sol. Lessive disponible sur place. Étendoir dans le placard de l'entrée.",
        },
        {
          titre: "Local à ski",
          description:
            "Situé au sous-sol, accessible avec la même clé que l'appartement. Suivez le couloir jusqu'au fond.",
        },
      ],
    },
  ],

  dechetsContenu: [
    {
      __component: "guide.bloc",
      id: 40,
      titre: "Sacs poubelle taxés",
      contenu:
        "<p>En Suisse, les déchets ménagers doivent être jetés dans des <strong>sacs poubelle officiels (taxés)</strong>. Ces sacs sont obligatoires et payants — c'est la taxe au sac, qui finance le traitement des déchets.</p><p>Vous pouvez les acheter en <strong>caisse dans tous les supermarchés</strong> (Migros, Coop, Denner). Demandez simplement des « sacs taxés » à la caissière. Ils existent en 17L, 35L et 60L.</p><p>Quelques sacs sont mis à disposition sous l'évier de la cuisine pour le début de votre séjour.</p>",
      images: [],
      misEnAvant: true,
    },
    {
      __component: "guide.bloc",
      id: 41,
      titre: "Containers du bâtiment",
      contenu:
        "Les poubelles principales se trouvent à l'arrière du bâtiment. Utilisez la porte de service au rez-de-chaussée.",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 42,
      titre: "Point de collecte verre & PET",
      contenu:
        "Un point de collecte pour le verre et le PET se trouve à 50m, sur le parking communal. La déchetterie communale est ouverte le samedi matin pour les encombrants et déchets spéciaux.",
      images: [],
      misEnAvant: false,
    },
  ],

  regionContenu: [
    {
      __component: "guide.bloc",
      id: 50,
      titre: "Commerces",
      contenu:
        "Vous trouverez à proximité un supermarché Migros (5 min à pied) et un Coop (8 min à pied) pour vos courses alimentaires et articles ménagers. Les sacs taxés sont disponibles en caisse. Une boulangerie artisanale se situe à 3 minutes à pied, ainsi qu'une pharmacie à 10 minutes.",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 51,
      titre: "Activités — Hiver",
      contenu:
        "Le domaine skiable se trouve à 8 minutes en voiture, avec plus de 100 km de pistes. Les forfaits sont disponibles en ligne (recommandé pour éviter les files d'attente). Un centre thermal avec spa et espace détente est accessible en 15 minutes. Plusieurs sentiers raquettes balisés partent directement du village.",
      images: [],
      liens: [{ label: "Domaine skiable — Forfaits en ligne", url: "https://example.com/ski" }],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 52,
      titre: "Activités — Été",
      contenu:
        "La région offre un réseau de sentiers de randonnée balisés. Des cartes sont disponibles à l'office du tourisme. La location de vélos électriques est possible au village. La piscine municipale est ouverte de juin à septembre (10 min à pied).",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 53,
      titre: "Restaurants",
      contenu:
        "Plusieurs restaurants sont accessibles à pied : Le Carrefour (cuisine locale, 5 min), Pizzeria Da Luigi (pizzas au feu de bois, 3 min), ainsi qu'un restaurant d'altitude accessible par les remontées mécaniques avec vue panoramique.",
      images: [],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 54,
      titre: "Bus et transports",
      contenu:
        "Un arrêt de bus se trouve à 2 minutes à pied avec des lignes vers Sion et les stations voisines. La gare CFF la plus proche est à 15 minutes en voiture. Consultez les horaires en ligne.",
      images: [],
      liens: [{ label: "CFF — Horaires en ligne", url: "https://www.sbb.ch" }],
      misEnAvant: false,
    },
    {
      __component: "guide.bloc",
      id: 55,
      titre: "Offices du tourisme",
      contenu:
        "L'office du tourisme local propose des informations, des cartes et un programme d'événements et d'activités. Le portail Valais Tourisme centralise l'ensemble des offres de la région.",
      images: [],
      liens: [
        { label: "Office du tourisme local", url: "https://example.com/tourisme" },
        { label: "Valais Tourisme", url: "https://www.valais.ch" },
      ],
      misEnAvant: false,
    },
  ],

  reglesContenu: [
    {
      __component: "guide.dropdown",
      id: 60,
      elements: [
        {
          titre: "Bruit",
          description:
            "Respect du voisinage : pas de bruit après 22h00. L'immeuble est habité par des résidents permanents.",
        },
        {
          titre: "Tabac",
          description:
            "Interdiction de fumer à l'intérieur de l'appartement. Un cendrier est disponible sur le balcon.",
        },
        {
          titre: "Animaux",
          description: "Animaux non autorisés sauf accord préalable avec le concierge.",
        },
        {
          titre: "Occupants",
          description:
            "Le nombre maximum d'occupants correspond à celui indiqué dans votre réservation. Aucun visiteur supplémentaire n'est autorisé à dormir sur place.",
        },
        {
          titre: "Dommages",
          description:
            "Tout dommage doit être signalé immédiatement au concierge. Une caution pourra être retenue en cas de dégât non déclaré.",
        },
        {
          titre: "Ménage",
          description:
            "Merci de laisser l'appartement dans un état correct au départ. Un supplément de nettoyage pourra être facturé si nécessaire.",
        },
        {
          titre: "Clés",
          description:
            "En cas de perte de clé, des frais de remplacement de CHF 150.- seront facturés.",
        },
        {
          titre: "Énergie",
          description:
            "Merci d'éteindre les lumières et de fermer les fenêtres lorsque vous quittez l'appartement, même temporairement.",
        },
      ],
    },
  ],
};

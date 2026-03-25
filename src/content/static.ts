import { z } from "zod"

const ctaSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

const stepSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
})

const sectionBlockSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const logementItemSchema = sectionBlockSchema.extend({
  images: z.array(z.string()),
})

const ruleSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const staticContentSchema = z.object({
  login: z.object({
    title: z.string(),
    description: z.string(),
    codeLabel: z.string(),
    codePlaceholder: z.string(),
    submit: z.string(),
    noCodePrefix: z.string(),
    noCodeLink: z.string(),
    noCodeWhatsapp: z.string(),
    error: z.string(),
  }),

  nav: z.object({
    home: z.string(),
    rules: z.string(),
    contact: z.string(),
    route: z.string(),
  }),

  home: z.object({
    welcome: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    accessCodes: z.string(),
    wifi: z.string(),
    keyNote: z.string(),
  }),

  sections: z.object({
    arrivee: z.string(),
    depart: z.string(),
    parking: z.string(),
    logement: z.string(),
    dechets: z.string(),
    region: z.string(),
    regles: z.string(),
  }),

  section: z.object({
    back: z.string(),
    notFound: z.string(),
    openMaps: z.string(),
    stepLabel: z.string(),
  }),

  notFound: z.object({
    title: z.string(),
    message: z.string(),
    link: z.string(),
  }),

  alt: z.object({
    brand: z.string(),
  }),

  format: z.object({
    building: z.string(),
    keyBox: z.string(),
    password: z.string(),
  }),

  arrivee: z.object({
    tip: z.string(),
    steps: z.array(stepSchema),
  }),

  depart: z.object({
    checkoutLabel: z.string(),
    checkoutMessage: z.string(),
    checklistTitle: z.string(),
    items: z.array(z.string()),
  }),

  parking: z.object({
    winterNote: z.string(),
    private: sectionBlockSchema,
    public: sectionBlockSchema,
  }),

  placeholders: z.object({
    parkingGarage: z.string(),
    sacsTaxes: z.string(),
    containers: z.string(),
    collecte: z.string(),
    commerces: z.string(),
    skiDomain: z.string(),
    hiking: z.string(),
    restaurant: z.string(),
    busStation: z.string(),
  }),

  logement: z.object({
    intro: z.string(),
    items: z.array(logementItemSchema),
  }),

  dechets: z.object({
    sacsTaxes: z.object({
      title: z.string(),
      paragraphs: z.array(z.string()),
    }),
    containers: sectionBlockSchema,
    collecte: sectionBlockSchema,
  }),

  region: z.object({
    commerces: sectionBlockSchema,
    hiver: sectionBlockSchema.extend({ cta: ctaSchema }),
    ete: sectionBlockSchema,
    restaurants: sectionBlockSchema,
    transports: sectionBlockSchema.extend({ cta: ctaSchema }),
    tourisme: sectionBlockSchema.extend({ ctas: z.array(ctaSchema) }),
  }),

  regles: z.object({
    items: z.array(ruleSchema),
  }),
})

export type StaticContent = z.infer<typeof staticContentSchema>

export const staticContent: StaticContent = {
  login: {
    title: "Guide de séjour",
    description:
      "Entrez le code d'accès fourni dans votre confirmation de réservation pour accéder au guide de votre logement.",
    codeLabel: "Code d'accès",
    codePlaceholder: "Entrez votre code",
    submit: "Accéder au guide",
    noCodePrefix: "Vous n'avez pas reçu de code ?",
    noCodeLink: "Contactez votre concierge",
    noCodeWhatsapp: "+41791234567",
    error: "Veuillez entrer votre code d'accès",
  },

  nav: {
    home: "Accueil",
    rules: "Règlement",
    contact: "Contact",
    route: "Itinéraire",
  },

  home: {
    welcome: "Bienvenue",
    checkIn: "Check-in",
    checkOut: "Check-out",
    accessCodes: "Codes d'accès",
    wifi: "WiFi",
    keyNote: "La clé ouvre la porte de l'immeuble, l'appartement et le local à ski.",
  },

  sections: {
    arrivee: "Arrivée",
    depart: "Départ",
    parking: "Parking",
    logement: "Le Logement",
    dechets: "Déchets",
    region: "Région",
    regles: "Règles",
  },

  section: {
    back: "Retour au guide",
    notFound: "Section introuvable",
    openMaps: "Ouvrir dans Google Maps ↗",
    stepLabel: "Étape",
  },

  notFound: {
    title: "404",
    message: "Page introuvable",
    link: "Retour à l'accueil",
  },

  alt: {
    brand: "CosyHome Conciergerie",
  },

  format: {
    building: "Bâtiment : {value}",
    keyBox: "Boîte à clé : {value}",
    password: "MDP : {value}",
  },

  arrivee: {
    tip: "💡 La clé ouvre également le local à ski au sous-sol.",
    steps: [
      {
        title: "Récupérez la clé",
        description: "La boîte à clé se trouve à l'entrée du bâtiment. Code : 137617.",
        images: ["Photo boîte à clé"],
      },
      {
        title: "Entrez dans l'immeuble",
        description: "Composez le code du bâtiment sur le digicode : 4521.",
        images: ["Photo entrée immeuble", "Photo digicode", "Photo hall d'entrée"],
      },
      {
        title: "Montez au 2ème étage",
        description: "Par les escaliers ou l'ascenseur.",
        images: ["Photo couloir / ascenseur"],
      },
      {
        title: "Ouvrez l'appartement",
        description: "La même clé ouvre votre porte d'entrée.",
        images: ["Photo porte appartement"],
      },
    ],
  },

  depart: {
    checkoutLabel: "Check-out",
    checkoutMessage:
      "Merci de laisser l'appartement dans un état correct. Un supplément pourra être facturé en cas de ménage excessif.",
    checklistTitle: "Checklist de départ",
    items: [
      "Lancez un cycle de lave-vaisselle si nécessaire.",
      "Videz les poubelles dans les containers à l'arrière du bâtiment.",
      "Fermez toutes les fenêtres et éteignez les lumières.",
      "Laissez le thermostat sur 18°C.",
      "Vérifiez que rien n'a été oublié (placards, réfrigérateur, salle de bain).",
      "Replacez la clé dans la boîte à clé à l'entrée du bâtiment.",
    ],
  },

  parking: {
    winterNote: "❄️ En hiver, merci de ne pas bloquer l'accès au déneigement.",
    private: {
      title: "Parking privé",
      description:
        "Une place de parking est disponible devant le bâtiment. La télécommande du garage se trouve dans le tiroir de l'entrée.",
    },
    public: {
      title: "Parking public",
      description:
        "Pour les véhicules de grande taille, un parking public gratuit se trouve à 200m en direction du centre.",
    },
  },

  logement: {
    intro:
      "Voici les informations pratiques pour profiter de votre logement. N'hésitez pas à nous contacter si vous avez la moindre question.",
    items: [
      {
        title: "Cuisine",
        description:
          "Machine Nespresso (capsules fournies), lave-vaisselle, four, micro-ondes. Ustensiles et vaisselle dans les placards.",
        images: ["Photo cuisine vue 1", "Photo cuisine vue 2"],
      },
      {
        title: "Salle de bain",
        description:
          "Serviettes fournies. Des serviettes supplémentaires sont disponibles dans l'armoire du couloir. Sèche-cheveux sous le lavabo.",
        images: ["Photo salle de bain"],
      },
      {
        title: "Chauffage & Thermostat",
        description:
          "Le thermostat se trouve dans le couloir. Merci de le laisser sur 18°C à votre départ.",
        images: ["Photo thermostat"],
      },
      {
        title: "TV & WiFi",
        description:
          "Chaînes internationales disponibles. Le WiFi couvre l'ensemble de l'appartement. Identifiants affichés sur la page d'accueil du guide.",
        images: ["Photo salon / TV"],
      },
      {
        title: "Buanderie",
        description:
          "Machine à laver et sèche-linge au sous-sol. Lessive disponible sur place. Étendoir dans le placard de l'entrée.",
        images: ["Photo buanderie vue 1", "Photo buanderie vue 2"],
      },
      {
        title: "Local à ski",
        description:
          "Situé au sous-sol, accessible avec la même clé que l'appartement. Suivez le couloir jusqu'au fond.",
        images: [
          "Photo porte local à ski",
          "Photo couloir sous-sol",
          "Photo intérieur local",
          "Photo racks à ski",
          "Photo casiers",
          "Photo accès depuis entrée",
        ],
      },
    ],
  },

  dechets: {
    sacsTaxes: {
      title: "Sacs poubelle taxés",
      paragraphs: [
        "En Suisse, les déchets ménagers doivent être jetés dans des <strong>sacs poubelle officiels (taxés)</strong>. Ces sacs sont obligatoires et payants — c'est la taxe au sac, qui finance le traitement des déchets.",
        "Vous pouvez les acheter en <strong>caisse dans tous les supermarchés</strong> (Migros, Coop, Denner). Demandez simplement des « sacs taxés » à la caissière. Ils existent en 17L, 35L et 60L.",
        "Quelques sacs sont mis à disposition sous l'évier de la cuisine pour le début de votre séjour.",
      ],
    },
    containers: {
      title: "Containers du bâtiment",
      description:
        "Les poubelles principales se trouvent à l'arrière du bâtiment. Utilisez la porte de service au rez-de-chaussée.",
    },
    collecte: {
      title: "Point de collecte verre & PET",
      description:
        "Un point de collecte pour le verre et le PET se trouve à 50m, sur le parking communal. La déchetterie communale est ouverte le samedi matin pour les encombrants et déchets spéciaux.",
    },
  },

  region: {
    commerces: {
      title: "Commerces",
      description:
        "Vous trouverez à proximité un supermarché Migros (5 min à pied) et un Coop (8 min à pied) pour vos courses alimentaires et articles ménagers. Les sacs taxés sont disponibles en caisse. Une boulangerie artisanale se situe à 3 minutes à pied, ainsi qu'une pharmacie à 10 minutes.",
    },
    hiver: {
      title: "Activités — Hiver",
      description:
        "Le domaine skiable se trouve à 8 minutes en voiture, avec plus de 100 km de pistes. Les forfaits sont disponibles en ligne (recommandé pour éviter les files d'attente). Un centre thermal avec spa et espace détente est accessible en 15 minutes. Plusieurs sentiers raquettes balisés partent directement du village.",
      cta: { label: "Domaine skiable — Forfaits en ligne", url: "https://example.com/ski" },
    },
    ete: {
      title: "Activités — Été",
      description:
        "La région offre un réseau de sentiers de randonnée balisés. Des cartes sont disponibles à l'office du tourisme. La location de vélos électriques est possible au village. La piscine municipale est ouverte de juin à septembre (10 min à pied).",
    },
    restaurants: {
      title: "Restaurants",
      description:
        "Plusieurs restaurants sont accessibles à pied : Le Carrefour (cuisine locale, 5 min), Pizzeria Da Luigi (pizzas au feu de bois, 3 min), ainsi qu'un restaurant d'altitude accessible par les remontées mécaniques avec vue panoramique.",
    },
    transports: {
      title: "Bus et transports",
      description:
        "Un arrêt de bus se trouve à 2 minutes à pied avec des lignes vers Sion et les stations voisines. La gare CFF la plus proche est à 15 minutes en voiture. Consultez les horaires en ligne.",
      cta: { label: "CFF — Horaires en ligne", url: "https://www.sbb.ch" },
    },
    tourisme: {
      title: "Offices du tourisme",
      description:
        "L'office du tourisme local propose des informations, des cartes et un programme d'événements et d'activités. Le portail Valais Tourisme centralise l'ensemble des offres de la région.",
      ctas: [
        { label: "Office du tourisme local", url: "https://example.com/tourisme" },
        { label: "Valais Tourisme", url: "https://www.valais.ch" },
      ],
    },
  },

  regles: {
    items: [
      {
        title: "Bruit",
        content:
          "Respect du voisinage : pas de bruit après 22h00. L'immeuble est habité par des résidents permanents.",
      },
      {
        title: "Tabac",
        content:
          "Interdiction de fumer à l'intérieur de l'appartement. Un cendrier est disponible sur le balcon.",
      },
      {
        title: "Animaux",
        content: "Animaux non autorisés sauf accord préalable avec le concierge.",
      },
      {
        title: "Occupants",
        content:
          "Le nombre maximum d'occupants correspond à celui indiqué dans votre réservation. Aucun visiteur supplémentaire n'est autorisé à dormir sur place.",
      },
      {
        title: "Dommages",
        content:
          "Tout dommage doit être signalé immédiatement au concierge. Une caution pourra être retenue en cas de dégât non déclaré.",
      },
      {
        title: "Ménage",
        content:
          "Merci de laisser l'appartement dans un état correct au départ. Un supplément de nettoyage pourra être facturé si nécessaire.",
      },
      {
        title: "Clés",
        content: "En cas de perte de clé, des frais de remplacement de CHF 150.- seront facturés.",
      },
      {
        title: "Énergie",
        content:
          "Merci d'éteindre les lumières et de fermer les fenêtres lorsque vous quittez l'appartement, même temporairement.",
      },
    ],
  },

  placeholders: {
    parkingGarage: "Photo parking / garage",
    sacsTaxes: "Photo sac taxé officiel",
    containers: "Photo emplacement containers arrière",
    collecte: "Photo point de collecte verre/PET",
    commerces: "Photo commerces du village",
    skiDomain: "Photo domaine skiable / pistes",
    hiking: "Photo randonnée / paysage été",
    restaurant: "Photo restaurant local",
    busStation: "Photo arrêt de bus / gare",
  },
}

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

const checklistItemSchema = z.object({
  text: z.string(),
})

const logementItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
})

const parkingBlockSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
})

const dechetsBlockSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
})

const regionBlockSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  ctas: z.array(ctaSchema).optional(),
})

const ruleSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const propertySchema = z.object({
  nom: z.string(),
  slug: z.string(),
  address: z.string(),
  mapsUrl: z.string().url(),
  imagePrincipale: z.string().optional(),

  arrivee: z.object({
    heureArrivee: z.string(),
    codeImmeuble: z.string(),
    codeBoiteACles: z.string(),
    noteCle: z.string().optional(),
    conseilArrivee: z.string().optional(),
    etapesArrivee: z.array(stepSchema),
  }),

  depart: z.object({
    heureDepart: z.string(),
    messageDepart: z.string(),
    checklist: z.array(checklistItemSchema),
  }),

  wifi: z.object({
    nomReseau: z.string(),
    motDePasse: z.string(),
  }),

  parking: z.object({
    noteHiver: z.string().optional(),
    blocs: z.array(parkingBlockSchema),
  }),

  logement: z.object({
    introduction: z.string().optional(),
    elements: z.array(logementItemSchema),
  }),

  urgences: z.object({
    urgencesLabel: z.string(),
    urgencesTel: z.string(),
    policeLabel: z.string(),
    policeTel: z.string(),
    pompiersLabel: z.string(),
    pompiersTel: z.string(),
  }),

  whatsapp: z.string(),

  blocsDechets: z.array(dechetsBlockSchema),
  blocsRegion: z.array(regionBlockSchema),
  regles: z.array(ruleSchema),
})

export type Property = z.infer<typeof propertySchema>

export const property: Property = {
  nom: "Le Saint Georges",
  slug: "le-saint-georges",
  address: "Le Saint Georges — [Adresse complète], Valais",
  mapsUrl: "https://maps.google.com/?q=Le+Saint+Georges,+Valais,+Suisse",

  arrivee: {
    heureArrivee: "Dès 17h00",
    codeImmeuble: "4521",
    codeBoiteACles: "137617",
    noteCle: "La clé ouvre la porte de l'immeuble, l'appartement et le local à ski.",
    conseilArrivee: "💡 La clé ouvre également le local à ski au sous-sol.",
    etapesArrivee: [
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
    heureDepart: "Avant 11h00",
    messageDepart:
      "Merci de laisser l'appartement dans un état correct. Un supplément pourra être facturé en cas de ménage excessif.",
    checklist: [
      { text: "Lancez un cycle de lave-vaisselle si nécessaire." },
      { text: "Videz les poubelles dans les containers à l'arrière du bâtiment." },
      { text: "Fermez toutes les fenêtres et éteignez les lumières." },
      { text: "Laissez le thermostat sur 18°C." },
      { text: "Vérifiez que rien n'a été oublié (placards, réfrigérateur, salle de bain)." },
      { text: "Replacez la clé dans la boîte à clé à l'entrée du bâtiment." },
    ],
  },

  wifi: {
    nomReseau: "Netplus-d17347",
    motDePasse: "9mXmxffe",
  },

  parking: {
    noteHiver: "❄️ En hiver, merci de ne pas bloquer l'accès au déneigement.",
    blocs: [
      {
        title: "Parking privé",
        description:
          "Une place de parking est disponible devant le bâtiment. La télécommande du garage se trouve dans le tiroir de l'entrée.",
      },
      {
        title: "Parking public",
        description:
          "Pour les véhicules de grande taille, un parking public gratuit se trouve à 200m en direction du centre.",
      },
    ],
  },

  logement: {
    introduction:
      "Voici les informations pratiques pour profiter de votre logement. N'hésitez pas à nous contacter si vous avez la moindre question.",
    elements: [
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

  urgences: {
    urgencesLabel: "Urgences 144",
    urgencesTel: "+41144",
    policeLabel: "Police 117",
    policeTel: "+41117",
    pompiersLabel: "Pompiers 118",
    pompiersTel: "+41118",
  },

  whatsapp: "+41791234567",

  blocsDechets: [
    {
      title: "Sacs poubelle taxés",
      description:
        "<p>En Suisse, les déchets ménagers doivent être jetés dans des <strong>sacs poubelle officiels (taxés)</strong>. Ces sacs sont obligatoires et payants — c'est la taxe au sac, qui finance le traitement des déchets.</p><p>Vous pouvez les acheter en <strong>caisse dans tous les supermarchés</strong> (Migros, Coop, Denner). Demandez simplement des « sacs taxés » à la caissière. Ils existent en 17L, 35L et 60L.</p><p>Quelques sacs sont mis à disposition sous l'évier de la cuisine pour le début de votre séjour.</p>",
    },
    {
      title: "Containers du bâtiment",
      description:
        "Les poubelles principales se trouvent à l'arrière du bâtiment. Utilisez la porte de service au rez-de-chaussée.",
    },
    {
      title: "Point de collecte verre & PET",
      description:
        "Un point de collecte pour le verre et le PET se trouve à 50m, sur le parking communal. La déchetterie communale est ouverte le samedi matin pour les encombrants et déchets spéciaux.",
    },
  ],

  blocsRegion: [
    {
      title: "Commerces",
      description:
        "Vous trouverez à proximité un supermarché Migros (5 min à pied) et un Coop (8 min à pied) pour vos courses alimentaires et articles ménagers. Les sacs taxés sont disponibles en caisse. Une boulangerie artisanale se situe à 3 minutes à pied, ainsi qu'une pharmacie à 10 minutes.",
    },
    {
      title: "Activités — Hiver",
      description:
        "Le domaine skiable se trouve à 8 minutes en voiture, avec plus de 100 km de pistes. Les forfaits sont disponibles en ligne (recommandé pour éviter les files d'attente). Un centre thermal avec spa et espace détente est accessible en 15 minutes. Plusieurs sentiers raquettes balisés partent directement du village.",
      ctas: [{ label: "Domaine skiable — Forfaits en ligne", url: "https://example.com/ski" }],
    },
    {
      title: "Activités — Été",
      description:
        "La région offre un réseau de sentiers de randonnée balisés. Des cartes sont disponibles à l'office du tourisme. La location de vélos électriques est possible au village. La piscine municipale est ouverte de juin à septembre (10 min à pied).",
    },
    {
      title: "Restaurants",
      description:
        "Plusieurs restaurants sont accessibles à pied : Le Carrefour (cuisine locale, 5 min), Pizzeria Da Luigi (pizzas au feu de bois, 3 min), ainsi qu'un restaurant d'altitude accessible par les remontées mécaniques avec vue panoramique.",
    },
    {
      title: "Bus et transports",
      description:
        "Un arrêt de bus se trouve à 2 minutes à pied avec des lignes vers Sion et les stations voisines. La gare CFF la plus proche est à 15 minutes en voiture. Consultez les horaires en ligne.",
      ctas: [{ label: "CFF — Horaires en ligne", url: "https://www.sbb.ch" }],
    },
    {
      title: "Offices du tourisme",
      description:
        "L'office du tourisme local propose des informations, des cartes et un programme d'événements et d'activités. Le portail Valais Tourisme centralise l'ensemble des offres de la région.",
      ctas: [
        { label: "Office du tourisme local", url: "https://example.com/tourisme" },
        { label: "Valais Tourisme", url: "https://www.valais.ch" },
      ],
    },
  ],

  regles: [
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
    { title: "Animaux", content: "Animaux non autorisés sauf accord préalable avec le concierge." },
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
}

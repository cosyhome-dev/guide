import { z } from "zod"

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

  depart: z.object({
    checkoutLabel: z.string(),
    checklistTitle: z.string(),
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

  urgences: z.object({
    urgencesLabel: z.string(),
    urgencesTel: z.string(),
    policeLabel: z.string(),
    policeTel: z.string(),
    pompiersLabel: z.string(),
    pompiersTel: z.string(),
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

  depart: {
    checkoutLabel: "Check-out",
    checklistTitle: "Checklist de départ",
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

  urgences: {
    urgencesLabel: "Urgences 144",
    urgencesTel: "+41144",
    policeLabel: "Police 117",
    policeTel: "+41117",
    pompiersLabel: "Pompiers 118",
    pompiersTel: "+41118",
  },
}

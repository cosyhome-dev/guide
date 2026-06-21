import { z } from "zod";

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
    "check-in": z.string(),
    "check-out": z.string(),
    parking: z.string(),
    property: z.string(),
    "waste-recycling": z.string(),
    area: z.string(),
    rules: z.string(),
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
});

export type StaticContent = z.infer<typeof staticContentSchema>;
export type SupportedLocale = "fr" | "en" | "it" | "de";

const FR_STATIC: StaticContent = {
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
  nav: { home: "Accueil", rules: "Règlement", contact: "Contact", route: "Itinéraire" },
  home: { welcome: "Bienvenue", checkIn: "Check-in", checkOut: "Check-out", accessCodes: "Codes d'accès", wifi: "WiFi" },
  sections: {
    "check-in": "Arrivée", "check-out": "Départ", parking: "Parking", property: "Le Logement",
    "waste-recycling": "Déchets", area: "Région", rules: "Règles",
  },
  section: { back: "Retour au guide", notFound: "Section introuvable", openMaps: "Ouvrir dans Google Maps ↗", stepLabel: "Étape" },
  depart: { checkoutLabel: "Check-out", checklistTitle: "Checklist de départ" },
  notFound: { title: "404", message: "Page introuvable", link: "Retour à l'accueil" },
  alt: { brand: "CosyHome Conciergerie" },
  format: { building: "Bâtiment : {value}", keyBox: "Boîte à clé : {value}", password: "MDP : {value}" },
  urgences: {
    urgencesLabel: "Urgences 144", urgencesTel: "+41144",
    policeLabel: "Police 117", policeTel: "+41117",
    pompiersLabel: "Pompiers 118", pompiersTel: "+41118",
  },
};

const EN_STATIC: StaticContent = {
  login: {
    title: "Stay guide",
    description: "Enter the access code provided in your booking confirmation to access your property guide.",
    codeLabel: "Access code", codePlaceholder: "Enter your code", submit: "Access guide",
    noCodePrefix: "Didn't receive a code?", noCodeLink: "Contact your concierge",
    noCodeWhatsapp: "+41791234567", error: "Please enter your access code",
  },
  nav: { home: "Home", rules: "Rules", contact: "Contact", route: "Directions" },
  home: { welcome: "Welcome", checkIn: "Check-in", checkOut: "Check-out", accessCodes: "Access codes", wifi: "Wi-Fi" },
  sections: {
    "check-in": "Arrival", "check-out": "Departure", parking: "Parking", property: "The property",
    "waste-recycling": "Waste", area: "Area", rules: "House rules",
  },
  section: { back: "Back to guide", notFound: "Section not found", openMaps: "Open in Google Maps ↗", stepLabel: "Step" },
  depart: { checkoutLabel: "Check-out", checklistTitle: "Departure checklist" },
  notFound: { title: "404", message: "Page not found", link: "Back to home" },
  alt: { brand: "CosyHome Conciergerie" },
  format: { building: "Building: {value}", keyBox: "Key box: {value}", password: "Pwd: {value}" },
  urgences: {
    urgencesLabel: "Emergency 144", urgencesTel: "+41144",
    policeLabel: "Police 117", policeTel: "+41117",
    pompiersLabel: "Fire 118", pompiersTel: "+41118",
  },
};

const IT_STATIC: StaticContent = {
  login: {
    title: "Guida di soggiorno",
    description: "Inserisca il codice d'accesso fornito nella conferma di prenotazione per accedere alla guida del suo alloggio.",
    codeLabel: "Codice d'accesso", codePlaceholder: "Inserisca il codice", submit: "Accedi alla guida",
    noCodePrefix: "Non ha ricevuto un codice?", noCodeLink: "Contatti il concierge",
    noCodeWhatsapp: "+41791234567", error: "Inserisca il codice d'accesso",
  },
  nav: { home: "Home", rules: "Regolamento", contact: "Contatto", route: "Indicazioni" },
  home: { welcome: "Benvenuto", checkIn: "Check-in", checkOut: "Check-out", accessCodes: "Codici d'accesso", wifi: "Wi-Fi" },
  sections: {
    "check-in": "Arrivo", "check-out": "Partenza", parking: "Parcheggio", property: "L'alloggio",
    "waste-recycling": "Rifiuti", area: "Regione", rules: "Regole",
  },
  section: { back: "Torna alla guida", notFound: "Sezione non trovata", openMaps: "Apri in Google Maps ↗", stepLabel: "Tappa" },
  depart: { checkoutLabel: "Check-out", checklistTitle: "Checklist di partenza" },
  notFound: { title: "404", message: "Pagina non trovata", link: "Torna alla home" },
  alt: { brand: "CosyHome Conciergerie" },
  format: { building: "Edificio: {value}", keyBox: "Cassetta chiavi: {value}", password: "Pwd: {value}" },
  urgences: {
    urgencesLabel: "Emergenza 144", urgencesTel: "+41144",
    policeLabel: "Polizia 117", policeTel: "+41117",
    pompiersLabel: "Pompieri 118", pompiersTel: "+41118",
  },
};

const DE_STATIC: StaticContent = {
  login: {
    title: "Aufenthaltsleitfaden",
    description: "Geben Sie den in Ihrer Buchungsbestätigung erhaltenen Zugangscode ein, um auf den Leitfaden Ihrer Unterkunft zuzugreifen.",
    codeLabel: "Zugangscode", codePlaceholder: "Code eingeben", submit: "Zum Leitfaden",
    noCodePrefix: "Keinen Code erhalten?", noCodeLink: "Concierge kontaktieren",
    noCodeWhatsapp: "+41791234567", error: "Bitte geben Sie Ihren Zugangscode ein",
  },
  nav: { home: "Startseite", rules: "Hausregeln", contact: "Kontakt", route: "Anfahrt" },
  home: { welcome: "Willkommen", checkIn: "Check-in", checkOut: "Check-out", accessCodes: "Zugangscodes", wifi: "WLAN" },
  sections: {
    "check-in": "Ankunft", "check-out": "Abreise", parking: "Parken", property: "Die Unterkunft",
    "waste-recycling": "Abfall", area: "Region", rules: "Hausregeln",
  },
  section: { back: "Zurück zum Leitfaden", notFound: "Abschnitt nicht gefunden", openMaps: "In Google Maps öffnen ↗", stepLabel: "Schritt" },
  depart: { checkoutLabel: "Check-out", checklistTitle: "Abreise-Checkliste" },
  notFound: { title: "404", message: "Seite nicht gefunden", link: "Zurück zur Startseite" },
  alt: { brand: "CosyHome Conciergerie" },
  format: { building: "Gebäude: {value}", keyBox: "Schlüsselbox: {value}", password: "Pwd: {value}" },
  urgences: {
    urgencesLabel: "Notruf 144", urgencesTel: "+41144",
    policeLabel: "Polizei 117", policeTel: "+41117",
    pompiersLabel: "Feuerwehr 118", pompiersTel: "+41118",
  },
};

const LOCALE_FALLBACKS: Record<SupportedLocale, StaticContent> = {
  fr: FR_STATIC,
  en: EN_STATIC,
  it: IT_STATIC,
  de: DE_STATIC,
};

export function getStaticContentFallback(locale: string): StaticContent {
  return LOCALE_FALLBACKS[(locale as SupportedLocale) in LOCALE_FALLBACKS ? (locale as SupportedLocale) : "fr"];
}

/** @deprecated Compat — utiliser getStaticContentFallback(locale) à la place. */
export const staticContent: StaticContent = FR_STATIC;

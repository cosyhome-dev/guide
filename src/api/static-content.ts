import { z } from "zod";
import { staticContentSchema, type StaticContent, getStaticContentFallback } from "@/content/static";
import { delay } from "./mock";
import { USE_MOCK, strapiFetch, strapiImageSchema } from "./strapi";

// ---------------------------------------------------------------------------
// Strapi v5 response schema
//
// Tous les champs sont optionnels (la cliente peut remplir uniquement les
// libellés qu'elle veut customiser). Les champs vides sont remplacés par
// la valeur par défaut localisée du frontend dans transformStaticContent.
// ---------------------------------------------------------------------------

const optStr = z.string().nullable().optional();

const strapiStaticDataSchema = z.object({
  id: z.number(),
  documentId: z.string(),

  loginTitle: optStr,
  loginDescription: optStr,
  loginCodeLabel: optStr,
  loginCodePlaceholder: optStr,
  loginSubmit: optStr,
  loginNoCodePrefix: optStr,
  loginNoCodeLink: optStr,
  loginNoCodeWhatsapp: optStr,
  loginError: optStr,

  navHome: optStr,
  navRules: optStr,
  navContact: optStr,
  navRoute: optStr,

  homeWelcome: optStr,
  homeCheckIn: optStr,
  homeCheckOut: optStr,
  homeAccessCodes: optStr,
  homeWifi: optStr,

  sectionBack: optStr,
  sectionNotFound: optStr,
  sectionOpenMaps: optStr,
  sectionStepLabel: optStr,
  sectionArrivee: optStr,
  sectionDepart: optStr,
  sectionParking: optStr,
  sectionLogement: optStr,
  sectionDechets: optStr,
  sectionRegion: optStr,
  sectionRegles: optStr,

  departCheckoutLabel: optStr,
  departChecklistTitle: optStr,

  notFoundTitle: optStr,
  notFoundMessage: optStr,
  notFoundLink: optStr,

  altBrand: optStr,

  formatBuilding: optStr,
  formatKeyBox: optStr,
  formatPassword: optStr,

  urgencesLabel: optStr,
  urgencesTel: optStr,
  policeLabel: optStr,
  policeTel: optStr,
  pompiersLabel: optStr,
  pompiersTel: optStr,

  logoLight: strapiImageSchema.optional(),
  logoDark: strapiImageSchema.optional(),
  logoCircle: strapiImageSchema.optional(),
  logoCopyright: strapiImageSchema.optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  locale: z.string(),
});

const strapiStaticResponseSchema = z.object({
  data: strapiStaticDataSchema,
  meta: z.object({}).passthrough(),
});

// ---------------------------------------------------------------------------
// Transformer: Strapi flat → StaticContent nested
// Merge per-field avec le fallback localisé : chaque champ vide / null côté
// Strapi prend la valeur par défaut du code (FR/EN/IT/DE). Ainsi la cliente
// peut ne customiser que 1 ou 2 libellés, tout le reste reste sur les
// valeurs par défaut.
// ---------------------------------------------------------------------------

type StrapiStaticData = z.infer<typeof strapiStaticDataSchema>;

const pick = (v: string | null | undefined, fallback: string): string =>
  v && v.trim() !== "" ? v : fallback;

function transformStaticContent(d: StrapiStaticData, locale: string): StaticContent {
  const fb = getStaticContentFallback(locale);
  return staticContentSchema.parse({
    login: {
      title: pick(d.loginTitle, fb.login.title),
      description: pick(d.loginDescription, fb.login.description),
      codeLabel: pick(d.loginCodeLabel, fb.login.codeLabel),
      codePlaceholder: pick(d.loginCodePlaceholder, fb.login.codePlaceholder),
      submit: pick(d.loginSubmit, fb.login.submit),
      noCodePrefix: pick(d.loginNoCodePrefix, fb.login.noCodePrefix),
      noCodeLink: pick(d.loginNoCodeLink, fb.login.noCodeLink),
      noCodeWhatsapp: pick(d.loginNoCodeWhatsapp, fb.login.noCodeWhatsapp),
      error: pick(d.loginError, fb.login.error),
    },
    nav: {
      home: pick(d.navHome, fb.nav.home),
      rules: pick(d.navRules, fb.nav.rules),
      contact: pick(d.navContact, fb.nav.contact),
      route: pick(d.navRoute, fb.nav.route),
    },
    home: {
      welcome: pick(d.homeWelcome, fb.home.welcome),
      checkIn: pick(d.homeCheckIn, fb.home.checkIn),
      checkOut: pick(d.homeCheckOut, fb.home.checkOut),
      accessCodes: pick(d.homeAccessCodes, fb.home.accessCodes),
      wifi: pick(d.homeWifi, fb.home.wifi),
    },
    sections: {
      "check-in": pick(d.sectionArrivee, fb.sections["check-in"]),
      "check-out": pick(d.sectionDepart, fb.sections["check-out"]),
      parking: pick(d.sectionParking, fb.sections.parking),
      property: pick(d.sectionLogement, fb.sections.property),
      "waste-recycling": pick(d.sectionDechets, fb.sections["waste-recycling"]),
      area: pick(d.sectionRegion, fb.sections.area),
      rules: pick(d.sectionRegles, fb.sections.rules),
    },
    section: {
      back: pick(d.sectionBack, fb.section.back),
      notFound: pick(d.sectionNotFound, fb.section.notFound),
      openMaps: pick(d.sectionOpenMaps, fb.section.openMaps),
      stepLabel: pick(d.sectionStepLabel, fb.section.stepLabel),
    },
    depart: {
      checkoutLabel: pick(d.departCheckoutLabel, fb.depart.checkoutLabel),
      checklistTitle: pick(d.departChecklistTitle, fb.depart.checklistTitle),
    },
    notFound: {
      title: pick(d.notFoundTitle, fb.notFound.title),
      message: pick(d.notFoundMessage, fb.notFound.message),
      link: pick(d.notFoundLink, fb.notFound.link),
    },
    alt: {
      brand: pick(d.altBrand, fb.alt.brand),
    },
    format: {
      building: pick(d.formatBuilding, fb.format.building),
      keyBox: pick(d.formatKeyBox, fb.format.keyBox),
      password: pick(d.formatPassword, fb.format.password),
    },
    urgences: {
      urgencesLabel: pick(d.urgencesLabel, fb.urgences.urgencesLabel),
      urgencesTel: pick(d.urgencesTel, fb.urgences.urgencesTel),
      policeLabel: pick(d.policeLabel, fb.urgences.policeLabel),
      policeTel: pick(d.policeTel, fb.urgences.policeTel),
      pompiersLabel: pick(d.pompiersLabel, fb.urgences.pompiersLabel),
      pompiersTel: pick(d.pompiersTel, fb.urgences.pompiersTel),
    },
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const STATIC_POPULATE = [
  "populate[logoLight][fields][0]=url",
  "populate[logoDark][fields][0]=url",
  "populate[logoCircle][fields][0]=url",
  "populate[logoCopyright][fields][0]=url",
].join("&");

export async function fetchStaticContent(locale: string): Promise<StaticContent> {
  if (USE_MOCK) {
    await delay();
    return getStaticContentFallback(locale);
  }

  // Si la cliente n'a pas (encore) saisi le contenu Strapi du singleType
  // ou n'a pas activé la permission `find` publique, Strapi retourne 404.
  // On fallback sur le mock LOCALISÉ (FR/EN/IT/DE) pour ne pas casser le
  // guide — la cliente pourra customiser les textes UI plus tard via Strapi.
  try {
    const raw = await strapiFetch(`/guide-static-content?locale=${locale}&${STATIC_POPULATE}`);
    const response = strapiStaticResponseSchema.parse(raw);
    return transformStaticContent(response.data, locale);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[fetchStaticContent] fallback sur mock —", err instanceof Error ? err.message : err);
    return getStaticContentFallback(locale);
  }
}

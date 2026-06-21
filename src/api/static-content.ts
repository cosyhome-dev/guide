import { z } from "zod";
import { staticContentSchema, type StaticContent } from "@/content/static";
import { staticContent as mockData } from "@/content/static";
import { delay } from "./mock";
import { USE_MOCK, strapiFetch, strapiImageSchema } from "./strapi";

// ---------------------------------------------------------------------------
// Strapi v5 response schema (fields directly on data, no attributes wrapper)
// ---------------------------------------------------------------------------

const strapiStaticDataSchema = z.object({
  id: z.number(),
  documentId: z.string(),

  loginTitle: z.string(),
  loginDescription: z.string(),
  loginCodeLabel: z.string(),
  loginCodePlaceholder: z.string(),
  loginSubmit: z.string(),
  loginNoCodePrefix: z.string(),
  loginNoCodeLink: z.string(),
  loginNoCodeWhatsapp: z.string(),
  loginError: z.string(),

  navHome: z.string(),
  navRules: z.string(),
  navContact: z.string(),
  navRoute: z.string(),

  homeWelcome: z.string(),
  homeCheckIn: z.string(),
  homeCheckOut: z.string(),
  homeAccessCodes: z.string(),
  homeWifi: z.string(),

  sectionBack: z.string(),
  sectionNotFound: z.string(),
  sectionOpenMaps: z.string(),
  sectionStepLabel: z.string(),
  sectionArrivee: z.string(),
  sectionDepart: z.string(),
  sectionParking: z.string(),
  sectionLogement: z.string(),
  sectionDechets: z.string(),
  sectionRegion: z.string(),
  sectionRegles: z.string(),

  departCheckoutLabel: z.string(),
  departChecklistTitle: z.string(),

  notFoundTitle: z.string(),
  notFoundMessage: z.string(),
  notFoundLink: z.string(),

  altBrand: z.string(),

  formatBuilding: z.string(),
  formatKeyBox: z.string(),
  formatPassword: z.string(),

  urgencesLabel: z.string(),
  urgencesTel: z.string(),
  policeLabel: z.string(),
  policeTel: z.string(),
  pompiersLabel: z.string(),
  pompiersTel: z.string(),

  logoLight: strapiImageSchema,
  logoDark: strapiImageSchema,
  logoCircle: strapiImageSchema,
  logoCopyright: strapiImageSchema,

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
// ---------------------------------------------------------------------------

type StrapiStaticData = z.infer<typeof strapiStaticDataSchema>;

function transformStaticContent(d: StrapiStaticData): StaticContent {
  return staticContentSchema.parse({
    login: {
      title: d.loginTitle,
      description: d.loginDescription,
      codeLabel: d.loginCodeLabel,
      codePlaceholder: d.loginCodePlaceholder,
      submit: d.loginSubmit,
      noCodePrefix: d.loginNoCodePrefix,
      noCodeLink: d.loginNoCodeLink,
      noCodeWhatsapp: d.loginNoCodeWhatsapp,
      error: d.loginError,
    },
    nav: {
      home: d.navHome,
      rules: d.navRules,
      contact: d.navContact,
      route: d.navRoute,
    },
    home: {
      welcome: d.homeWelcome,
      checkIn: d.homeCheckIn,
      checkOut: d.homeCheckOut,
      accessCodes: d.homeAccessCodes,
      wifi: d.homeWifi,
    },
    sections: {
      "check-in": d.sectionArrivee,
      "check-out": d.sectionDepart,
      parking: d.sectionParking,
      property: d.sectionLogement,
      "waste-recycling": d.sectionDechets,
      area: d.sectionRegion,
      rules: d.sectionRegles,
    },
    section: {
      back: d.sectionBack,
      notFound: d.sectionNotFound,
      openMaps: d.sectionOpenMaps,
      stepLabel: d.sectionStepLabel,
    },
    depart: {
      checkoutLabel: d.departCheckoutLabel,
      checklistTitle: d.departChecklistTitle,
    },
    notFound: {
      title: d.notFoundTitle,
      message: d.notFoundMessage,
      link: d.notFoundLink,
    },
    alt: {
      brand: d.altBrand,
    },
    format: {
      building: d.formatBuilding,
      keyBox: d.formatKeyBox,
      password: d.formatPassword,
    },
    urgences: {
      urgencesLabel: d.urgencesLabel,
      urgencesTel: d.urgencesTel,
      policeLabel: d.policeLabel,
      policeTel: d.policeTel,
      pompiersLabel: d.pompiersLabel,
      pompiersTel: d.pompiersTel,
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
    return staticContentSchema.parse(mockData);
  }

  // Si la cliente n'a pas (encore) saisi le contenu Strapi du singleType
  // ou n'a pas activé la permission `find` publique, Strapi retourne 404.
  // On fallback sur le mock pour ne pas casser tout le guide — la cliente
  // pourra customiser les textes UI plus tard.
  try {
    const raw = await strapiFetch(`/guide-static-content?locale=${locale}&${STATIC_POPULATE}`);
    const response = strapiStaticResponseSchema.parse(raw);
    return transformStaticContent(response.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[fetchStaticContent] fallback sur mock —", err instanceof Error ? err.message : err);
    return staticContentSchema.parse(mockData);
  }
}

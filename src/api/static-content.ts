import { z } from "zod"
import { staticContentSchema, type StaticContent } from "@/content/static"
import { staticContent as mockData } from "@/content/static"
import { delay } from "./mock"
import { USE_MOCK, strapiFetch, strapiImageSchema } from "./strapi"

// ---------------------------------------------------------------------------
// Strapi response schema
// ---------------------------------------------------------------------------

const strapiStaticAttributesSchema = z.object({
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

  logoLight: strapiImageSchema,
  logoDark: strapiImageSchema,
  logoCircle: strapiImageSchema,
  logoCopyright: strapiImageSchema,

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  locale: z.string(),
})

const strapiStaticResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: strapiStaticAttributesSchema,
  }),
  meta: z.object({}).passthrough(),
})

// ---------------------------------------------------------------------------
// Transformer: Strapi flat → StaticContent nested
// ---------------------------------------------------------------------------

type StrapiStaticAttributes = z.infer<typeof strapiStaticAttributesSchema>

function transformStaticContent(attrs: StrapiStaticAttributes): StaticContent {
  return staticContentSchema.parse({
    login: {
      title: attrs.loginTitle,
      description: attrs.loginDescription,
      codeLabel: attrs.loginCodeLabel,
      codePlaceholder: attrs.loginCodePlaceholder,
      submit: attrs.loginSubmit,
      noCodePrefix: attrs.loginNoCodePrefix,
      noCodeLink: attrs.loginNoCodeLink,
      noCodeWhatsapp: attrs.loginNoCodeWhatsapp,
      error: attrs.loginError,
    },
    nav: {
      home: attrs.navHome,
      rules: attrs.navRules,
      contact: attrs.navContact,
      route: attrs.navRoute,
    },
    home: {
      welcome: attrs.homeWelcome,
      checkIn: attrs.homeCheckIn,
      checkOut: attrs.homeCheckOut,
      accessCodes: attrs.homeAccessCodes,
      wifi: attrs.homeWifi,
    },
    sections: {
      arrivee: attrs.sectionArrivee,
      depart: attrs.sectionDepart,
      parking: attrs.sectionParking,
      logement: attrs.sectionLogement,
      dechets: attrs.sectionDechets,
      region: attrs.sectionRegion,
      regles: attrs.sectionRegles,
    },
    section: {
      back: attrs.sectionBack,
      notFound: attrs.sectionNotFound,
      openMaps: attrs.sectionOpenMaps,
      stepLabel: attrs.sectionStepLabel,
    },
    depart: {
      checkoutLabel: attrs.departCheckoutLabel,
      checklistTitle: attrs.departChecklistTitle,
    },
    notFound: {
      title: attrs.notFoundTitle,
      message: attrs.notFoundMessage,
      link: attrs.notFoundLink,
    },
    alt: {
      brand: attrs.altBrand,
    },
    format: {
      building: attrs.formatBuilding,
      keyBox: attrs.formatKeyBox,
      password: attrs.formatPassword,
    },
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const STATIC_POPULATE =
  "populate[logoLight]=*&populate[logoDark]=*&populate[logoCircle]=*&populate[logoCopyright]=*"

export async function fetchStaticContent(locale: string): Promise<StaticContent> {
  if (USE_MOCK) {
    await delay()
    return staticContentSchema.parse(mockData)
  }

  const raw = await strapiFetch(`/guide-static-content?locale=${locale}&${STATIC_POPULATE}`)
  const response = strapiStaticResponseSchema.parse(raw)
  return transformStaticContent(response.data.attributes)
}

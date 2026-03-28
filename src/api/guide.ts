import { z } from "zod"
import { propertySchema, type Property } from "@/content/property"
import { property as mockData } from "@/content/property"
import { delay } from "./mock"
import {
  USE_MOCK,
  strapiFetch,
  strapiPost,
  strapiImageSchema,
  strapiImagesSchema,
  extractImageUrl,
  extractImageUrls,
} from "./strapi"

// ---------------------------------------------------------------------------
// Strapi response schemas
// ---------------------------------------------------------------------------

const strapiGuideAttributesSchema = z.object({
  name: z.string(),
  slug: z.string(),
  address: z.string(),
  mapsUrl: z.string(),
  heroImage: strapiImageSchema,
  checkIn: z.string(),
  checkOut: z.string(),
  codeBuilding: z.string(),
  codeKeyBox: z.string(),
  wifiSsid: z.string().nullable(),
  wifiPassword: z.string().nullable(),
  keyNote: z.string().nullable(),

  gestionnaire: z.object({
    data: z
      .object({
        id: z.number(),
        attributes: z.object({
          firstName: z.string(),
          lastName: z.string(),
          phone: z.string(),
        }),
      })
      .nullable(),
  }),

  arriveeTip: z.string().nullable(),
  arriveeSteps: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      images: strapiImagesSchema,
    }),
  ),

  departCheckoutMessage: z.string().nullable(),
  departChecklist: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    }),
  ),

  parkingWinterNote: z.string().nullable(),
  parkingBlocks: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      image: strapiImageSchema,
    }),
  ),

  logementIntro: z.string().nullable(),
  logementItems: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      images: strapiImagesSchema,
    }),
  ),

  dechetsBlocks: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      image: strapiImageSchema,
    }),
  ),

  regionBlocks: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      image: strapiImageSchema,
      ctas: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          }),
        )
        .nullable(),
    }),
  ),

  regles: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      content: z.string(),
    }),
  ),

  emergencyUrgences: z.string(),
  emergencyUrgencesTel: z.string(),
  emergencyPolice: z.string(),
  emergencyPoliceTel: z.string(),
  emergencyPompiers: z.string(),
  emergencyPompiersTel: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  locale: z.string(),
})

const strapiGuideResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: strapiGuideAttributesSchema,
    }),
  ),
  meta: z.object({}).passthrough(),
})

const accessResponseSchema = z.object({
  slug: z.string(),
})

// ---------------------------------------------------------------------------
// Transformer: Strapi → Property
// ---------------------------------------------------------------------------

type StrapiGuideAttributes = z.infer<typeof strapiGuideAttributesSchema>

function transformGuide(attrs: StrapiGuideAttributes): Property {
  return propertySchema.parse({
    name: attrs.name,
    slug: attrs.slug,
    address: attrs.address,
    mapsUrl: attrs.mapsUrl,
    heroImage: extractImageUrl(attrs.heroImage),
    checkIn: attrs.checkIn,
    checkOut: attrs.checkOut,
    codes: {
      building: attrs.codeBuilding,
      keyBox: attrs.codeKeyBox,
    },
    wifi: {
      ssid: attrs.wifiSsid ?? "",
      password: attrs.wifiPassword ?? "",
    },
    keyNote: attrs.keyNote ?? undefined,
    whatsapp: attrs.gestionnaire.data?.attributes.phone ?? "",
    emergency: {
      urgences: { label: attrs.emergencyUrgences, tel: attrs.emergencyUrgencesTel },
      police: { label: attrs.emergencyPolice, tel: attrs.emergencyPoliceTel },
      pompiers: { label: attrs.emergencyPompiers, tel: attrs.emergencyPompiersTel },
    },
    arriveeTip: attrs.arriveeTip ?? undefined,
    arriveeSteps: attrs.arriveeSteps.map((s) => ({
      title: s.title,
      description: s.description ?? "",
      images: extractImageUrls(s.images),
    })),
    departCheckoutMessage: attrs.departCheckoutMessage ?? "",
    departChecklist: attrs.departChecklist.map((item) => ({ text: item.text })),
    parkingWinterNote: attrs.parkingWinterNote ?? undefined,
    parkingBlocks: attrs.parkingBlocks.map((block) => ({
      title: block.title,
      description: block.description ?? "",
      image: extractImageUrl(block.image),
    })),
    logementIntro: attrs.logementIntro ?? undefined,
    logementItems: attrs.logementItems.map((item) => ({
      title: item.title,
      description: item.description,
      images: extractImageUrls(item.images),
    })),
    dechetsBlocks: attrs.dechetsBlocks.map((block) => ({
      title: block.title,
      description: block.description ?? "",
      image: extractImageUrl(block.image),
    })),
    regionBlocks: attrs.regionBlocks.map((block) => ({
      title: block.title,
      description: block.description,
      image: extractImageUrl(block.image),
      ctas: block.ctas?.map((cta) => ({ label: cta.label, url: cta.url })),
    })),
    regles: attrs.regles.map((rule) => ({
      title: rule.title,
      content: rule.content,
    })),
  })
}

// ---------------------------------------------------------------------------
// Populate query for nested components
// ---------------------------------------------------------------------------

const GUIDE_POPULATE = [
  "populate[heroImage]=*",
  "populate[gestionnaire][fields][0]=firstName",
  "populate[gestionnaire][fields][1]=lastName",
  "populate[gestionnaire][fields][2]=phone",
  "populate[arriveeSteps][populate]=*",
  "populate[departChecklist]=*",
  "populate[parkingBlocks][populate]=*",
  "populate[logementItems][populate]=*",
  "populate[dechetsBlocks][populate]=*",
  "populate[regionBlocks]=*",
  "populate[regles]=*",
].join("&")

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function validateCode(code: string): Promise<{ slug: string }> {
  if (USE_MOCK) {
    await delay(200)
    if (!code.trim()) throw new Error("CODE_REQUIRED")
    return { slug: "le-saint-georges" }
  }

  const raw = await strapiPost("/guide-sejours/access", { code })
  return accessResponseSchema.parse(raw)
}

export async function fetchGuide(slug: string, locale: string): Promise<Property> {
  if (USE_MOCK) {
    await delay()
    return propertySchema.parse(mockData)
  }

  const raw = await strapiFetch(
    `/guide-sejours?filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${locale}&${GUIDE_POPULATE}`,
  )
  const response = strapiGuideResponseSchema.parse(raw)
  const guide = response.data[0]
  if (!guide) throw new Error("GUIDE_NOT_FOUND")
  return transformGuide(guide.attributes)
}

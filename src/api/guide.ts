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

const strapiArriveeSchema = z.object({
  heureArrivee: z.string(),
  codeImmeuble: z.string(),
  codeBoiteACles: z.string(),
  noteCle: z.string().nullable(),
  conseilArrivee: z.string().nullable(),
  etapesArrivee: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      images: strapiImagesSchema,
    }),
  ),
})

const strapiDepartSchema = z.object({
  heureDepart: z.string(),
  messageDepart: z.string().nullable(),
  checklist: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    }),
  ),
})

const strapiWifiSchema = z.object({
  nomReseau: z.string().nullable(),
  motDePasse: z.string().nullable(),
})

const strapiParkingSchema = z.object({
  noteHiver: z.string().nullable(),
  blocs: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      image: strapiImageSchema,
    }),
  ),
})

const strapiLogementSchema = z.object({
  introduction: z.string().nullable(),
  elements: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      images: strapiImagesSchema,
    }),
  ),
})

const strapiUrgencesSchema = z.object({
  urgencesLabel: z.string(),
  urgencesTel: z.string(),
  policeLabel: z.string(),
  policeTel: z.string(),
  pompiersLabel: z.string(),
  pompiersTel: z.string(),
})

const strapiGuideAttributesSchema = z.object({
  nom: z.string(),
  slug: z.string(),
  address: z.string(),
  mapsUrl: z.string(),
  imagePrincipale: strapiImageSchema,

  arrivee: strapiArriveeSchema,
  depart: strapiDepartSchema,
  wifi: strapiWifiSchema,
  parking: strapiParkingSchema,
  logement: strapiLogementSchema,
  urgences: strapiUrgencesSchema,

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

  blocsDechets: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      image: strapiImageSchema,
    }),
  ),

  blocsRegion: z.array(
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
    nom: attrs.nom,
    slug: attrs.slug,
    address: attrs.address,
    mapsUrl: attrs.mapsUrl,
    imagePrincipale: extractImageUrl(attrs.imagePrincipale),
    arrivee: {
      heureArrivee: attrs.arrivee.heureArrivee,
      codeImmeuble: attrs.arrivee.codeImmeuble,
      codeBoiteACles: attrs.arrivee.codeBoiteACles,
      noteCle: attrs.arrivee.noteCle ?? undefined,
      conseilArrivee: attrs.arrivee.conseilArrivee ?? undefined,
      etapesArrivee: attrs.arrivee.etapesArrivee.map((s) => ({
        title: s.title,
        description: s.description ?? "",
        images: extractImageUrls(s.images),
      })),
    },
    depart: {
      heureDepart: attrs.depart.heureDepart,
      messageDepart: attrs.depart.messageDepart ?? "",
      checklist: attrs.depart.checklist.map((item) => ({ text: item.text })),
    },
    wifi: {
      nomReseau: attrs.wifi.nomReseau ?? "",
      motDePasse: attrs.wifi.motDePasse ?? "",
    },
    parking: {
      noteHiver: attrs.parking.noteHiver ?? undefined,
      blocs: attrs.parking.blocs.map((block) => ({
        title: block.title,
        description: block.description ?? "",
        image: extractImageUrl(block.image),
      })),
    },
    logement: {
      introduction: attrs.logement.introduction ?? undefined,
      elements: attrs.logement.elements.map((item) => ({
        title: item.title,
        description: item.description,
        images: extractImageUrls(item.images),
      })),
    },
    urgences: {
      urgencesLabel: attrs.urgences.urgencesLabel,
      urgencesTel: attrs.urgences.urgencesTel,
      policeLabel: attrs.urgences.policeLabel,
      policeTel: attrs.urgences.policeTel,
      pompiersLabel: attrs.urgences.pompiersLabel,
      pompiersTel: attrs.urgences.pompiersTel,
    },
    whatsapp: attrs.gestionnaire.data?.attributes.phone ?? "",
    blocsDechets: attrs.blocsDechets.map((block) => ({
      title: block.title,
      description: block.description ?? "",
      image: extractImageUrl(block.image),
    })),
    blocsRegion: attrs.blocsRegion.map((block) => ({
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
  "populate[imagePrincipale]=*",
  "populate[gestionnaire][fields][0]=firstName",
  "populate[gestionnaire][fields][1]=lastName",
  "populate[gestionnaire][fields][2]=phone",
  "populate[arrivee][populate]=*",
  "populate[depart][populate]=*",
  "populate[wifi]=*",
  "populate[parking][populate]=*",
  "populate[logement][populate]=*",
  "populate[urgences]=*",
  "populate[blocsDechets][populate]=*",
  "populate[blocsRegion]=*",
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

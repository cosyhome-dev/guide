import qs from "qs"
import { z } from "zod"
import {
  propertySchema,
  dynamicZoneBlockSchema,
  type Property,
  type DynamicZoneBlock,
  type ContenusReutilisablesKey,
} from "@/content/property"
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
// Strapi v5 dynamic zone schemas
// ---------------------------------------------------------------------------

const strapiLienExterneSchema = z.object({
  id: z.number(),
  label: z.string(),
  url: z.string(),
})

const strapiElementChecklistSchema = z.object({
  id: z.number(),
  texte: z.string(),
})

const strapiElementDropdownSchema = z.object({
  id: z.number(),
  titre: z.string(),
  description: z.string(),
})

const strapiBlocSchema = z.object({
  __component: z.literal("guide.bloc"),
  id: z.number(),
  titre: z.string(),
  surtitre: z.string().nullable().optional(),
  contenu: z.string().nullable(),
  images: strapiImagesSchema.default([]),
  liens: z.array(strapiLienExterneSchema).default([]),
  misEnAvant: z.boolean(),
  centrerBouton: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? false),
})

const strapiNoteSchema = z.object({
  __component: z.literal("guide.note"),
  id: z.number(),
  surtitre: z.string().nullable().optional(),
  titre: z.string().nullable().optional(),
  contenu: z.string(),
  centre: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? false),
})

const strapiChecklistSchema = z.object({
  __component: z.literal("guide.checklist"),
  id: z.number(),
  titre: z.string(),
  elements: z.array(strapiElementChecklistSchema),
})

const strapiDropdownSchema = z.object({
  __component: z.literal("guide.dropdown"),
  id: z.number(),
  elements: z.array(strapiElementDropdownSchema),
})

const strapiAffichageRegionSchema = z.object({
  __component: z.literal("guide.affichage-region"),
  id: z.number(),
  afficher: z.boolean(),
})

const strapiDynamicZoneSchema = z.discriminatedUnion("__component", [
  strapiBlocSchema,
  strapiNoteSchema,
  strapiChecklistSchema,
  strapiDropdownSchema,
  strapiAffichageRegionSchema,
])

type StrapiDynamicZoneBlock = z.infer<typeof strapiDynamicZoneSchema>

// ---------------------------------------------------------------------------
// Strapi v5 guide response schema (fields directly on data, no attributes)
// ---------------------------------------------------------------------------

const strapiLocalisationSchema = z.object({
  id: z.number().optional(),
  value: z.object({
    address: z.string().optional(),
    geohash: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
})

const strapiGestionnaireSchema = z
  .object({
    id: z.number(),
    documentId: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
  })
  .nullable()

const strapiCustomPageSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  titre: z.string(),
  slug: z.string(),
  ordre: z.number().default(0),
  icone: z.string().nullable().optional(),
  contenu: z.array(strapiDynamicZoneSchema).default([]),
})

const strapiDestinationSchema = z
  .object({
    id: z.number(),
    title: z.string(),
  })
  .nullable()
  .optional()

const strapiContenuReutilisableSchema = z.object({
  id: z.number(),
  nom: z.string(),
  pageDestinee: z.string(),
  ordre: z.number().default(0),
  contenu: z.array(strapiDynamicZoneSchema).default([]),
})

const strapiContenusReutilisablesSchema = z
  .object({
    arrivee: z.array(strapiContenuReutilisableSchema).default([]),
    depart: z.array(strapiContenuReutilisableSchema).default([]),
    parking: z.array(strapiContenuReutilisableSchema).default([]),
    logement: z.array(strapiContenuReutilisableSchema).default([]),
    dechets: z.array(strapiContenuReutilisableSchema).default([]),
    region: z.array(strapiContenuReutilisableSchema).default([]),
    reglement: z.array(strapiContenuReutilisableSchema).default([]),
  })
  .default({
    arrivee: [],
    depart: [],
    parking: [],
    logement: [],
    dechets: [],
    region: [],
    reglement: [],
  })

const strapiGuideDataSchema = z.object({
  id: z.number(),
  documentId: z.string(),

  nom: z.string(),
  slug: z.string(),
  imagePrincipale: strapiImageSchema,
  localisation: strapiLocalisationSchema,
  destination: strapiDestinationSchema,

  infos: z.object({
    id: z.number().optional(),
    heureArrivee: z.string(),
    codeImmeuble: z.string(),
    codeBoiteACles: z.string(),
    heureDepart: z.string(),
    noteGenerale: z.string().nullable().optional(),
  }),

  wifi: z.object({
    id: z.number().optional(),
    nomReseau: z.string().nullable(),
    motDePasse: z.string().nullable(),
  }),

  gestionnaire: strapiGestionnaireSchema,

  arriveeContenu: z.array(strapiDynamicZoneSchema).default([]),
  departContenu: z.array(strapiDynamicZoneSchema).default([]),
  parkingContenu: z.array(strapiDynamicZoneSchema).default([]),
  logementContenu: z.array(strapiDynamicZoneSchema).default([]),
  dechetsContenu: z.array(strapiDynamicZoneSchema).default([]),
  regionContenu: z.array(strapiDynamicZoneSchema).default([]),
  reglesContenu: z.array(strapiDynamicZoneSchema).default([]),

  contenusReutilisables: strapiContenusReutilisablesSchema,

  customPages: z
    .array(strapiCustomPageSchema)
    .nullable()
    .optional()
    .transform((v) => v ?? []),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  locale: z.string(),
})

const strapiGuideResponseSchema = z.object({
  data: z.array(strapiGuideDataSchema),
  meta: z.object({}).passthrough(),
})

const accessResponseSchema = z.object({
  slug: z.string(),
})

// ---------------------------------------------------------------------------
// Transformer: Strapi v5 → Property
// ---------------------------------------------------------------------------

type StrapiGuideData = z.infer<typeof strapiGuideDataSchema>

function transformDynamicZoneBlock(block: StrapiDynamicZoneBlock): DynamicZoneBlock {
  switch (block.__component) {
    case "guide.bloc":
      return dynamicZoneBlockSchema.parse({
        __component: "guide.bloc",
        id: block.id,
        titre: block.titre,
        surtitre: block.surtitre ?? undefined,
        contenu: block.contenu ?? undefined,
        images: extractImageUrls(block.images),
        liens: block.liens?.map((l) => ({ label: l.label, url: l.url })),
        misEnAvant: block.misEnAvant,
        centrerBouton: block.centrerBouton,
      })
    case "guide.note":
      return {
        __component: "guide.note",
        id: block.id,
        surtitre: block.surtitre ?? undefined,
        titre: block.titre ?? undefined,
        contenu: block.contenu,
        centre: block.centre,
      }
    case "guide.checklist":
      return {
        __component: "guide.checklist",
        id: block.id,
        titre: block.titre,
        elements: block.elements.map((e) => ({ texte: e.texte })),
      }
    case "guide.dropdown":
      return {
        __component: "guide.dropdown",
        id: block.id,
        elements: block.elements.map((e) => ({ titre: e.titre, description: e.description })),
      }
    case "guide.affichage-region":
      return { __component: "guide.affichage-region", id: block.id, afficher: block.afficher }
  }
}

function transformLocalisation(loc: z.infer<typeof strapiLocalisationSchema>) {
  const { lat, lng } = loc.value.coordinates
  return {
    address: loc.value.address ?? "",
    mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
  }
}

function transformContenusReutilisables(cr: z.infer<typeof strapiContenusReutilisablesSchema>) {
  const transformZone = (blocks: StrapiDynamicZoneBlock[]) => blocks.map(transformDynamicZoneBlock)

  const result: Record<string, DynamicZoneBlock[][]> = {}
  for (const key of Object.keys(cr) as ContenusReutilisablesKey[]) {
    result[key] = cr[key].map((entry) => transformZone(entry.contenu))
  }
  return result
}

function transformGuide(d: StrapiGuideData): Property {
  const transformZone = (blocks: StrapiDynamicZoneBlock[]) => blocks.map(transformDynamicZoneBlock)

  return propertySchema.parse({
    nom: d.nom,
    slug: d.slug,
    imagePrincipale: extractImageUrl(d.imagePrincipale),
    destination: d.destination?.title ?? undefined,
    localisation: transformLocalisation(d.localisation),
    whatsapp: d.gestionnaire?.phone ?? "",
    infos: {
      heureArrivee: d.infos.heureArrivee,
      codeImmeuble: d.infos.codeImmeuble,
      codeBoiteACles: d.infos.codeBoiteACles,
      heureDepart: d.infos.heureDepart,
      noteGenerale: d.infos.noteGenerale ?? undefined,
    },
    wifi: {
      nomReseau: d.wifi.nomReseau ?? "",
      motDePasse: d.wifi.motDePasse ?? "",
    },
    arriveeContenu: transformZone(d.arriveeContenu),
    departContenu: transformZone(d.departContenu),
    parkingContenu: transformZone(d.parkingContenu),
    logementContenu: transformZone(d.logementContenu),
    dechetsContenu: transformZone(d.dechetsContenu),
    regionContenu: transformZone(d.regionContenu),
    reglesContenu: transformZone(d.reglesContenu),
    contenusReutilisables: transformContenusReutilisables(d.contenusReutilisables),
    customPages: d.customPages
      .sort((a, b) => a.ordre - b.ordre)
      .map((cp) => ({
        titre: cp.titre,
        slug: cp.slug,
        ordre: cp.ordre,
        icone: cp.icone ?? undefined,
        contenu: transformZone(cp.contenu),
      })),
  })
}

// ---------------------------------------------------------------------------
// Populate query — Strapi v5 syntax with [on] for dynamic zones
// ---------------------------------------------------------------------------

const dynamicZonePopulate = {
  on: {
    "guide.bloc": {
      populate: {
        images: { fields: ["url", "alternativeText"] },
        liens: { populate: "*" },
      },
    },
    "guide.note": { populate: "*" },
    "guide.checklist": { populate: { elements: { populate: "*" } } },
    "guide.dropdown": { populate: { elements: { populate: "*" } } },
    "guide.affichage-region": { populate: "*" },
  },
}

function buildGuideQuery(slug: string, locale: string): string {
  return qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      locale,
      populate: {
        imagePrincipale: { fields: ["url", "alternativeText"] },
        localisation: { populate: "*" },
        gestionnaire: { fields: ["firstName", "lastName", "phone"] },
        destination: { fields: ["id", "title"] },
        wifi: { populate: "*" },
        infos: { populate: "*" },
        arriveeContenu: dynamicZonePopulate,
        departContenu: dynamicZonePopulate,
        parkingContenu: dynamicZonePopulate,
        logementContenu: dynamicZonePopulate,
        dechetsContenu: dynamicZonePopulate,
        regionContenu: dynamicZonePopulate,
        reglesContenu: dynamicZonePopulate,
        customPages: {
          populate: {
            contenu: dynamicZonePopulate,
          },
        },
      },
    },
    { encodeValuesOnly: true },
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function validateCode(code: string): Promise<{ slug: string }> {
  if (USE_MOCK) {
    await delay(200)
    if (!code.trim()) throw new Error("CODE_REQUIRED")
    return { slug: "le-saint-georges" }
  }

  const raw = await strapiPost("/guides/access", { code })
  return accessResponseSchema.parse(raw)
}

export async function fetchGuide(slug: string, locale: string): Promise<Property> {
  if (USE_MOCK) {
    await delay()
    return propertySchema.parse(mockData)
  }

  const raw = await strapiFetch(`/guides?${buildGuideQuery(slug, locale)}`)
  console.log("[fetchGuide] raw response:", JSON.stringify(raw, null, 2))
  try {
    const response = strapiGuideResponseSchema.parse(raw)
    const guide = response.data[0]
    if (!guide) throw new Error("GUIDE_NOT_FOUND")
    const result = transformGuide(guide)
    console.log("[fetchGuide] transform OK")
    return result
  } catch (err) {
    console.error("[fetchGuide] parse/transform error:", err)
    throw err
  }
}

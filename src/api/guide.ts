import qs from "qs";
import { z } from "zod";
import {
  propertySchema,
  dynamicZoneBlockSchema,
  type Property,
  type DynamicZoneBlock,
  type ContenusReutilisablesKey,
} from "@/content/property";
import { property as mockData } from "@/content/property";
import { delay } from "./mock";
import {
  USE_MOCK,
  strapiFetch,
  strapiPost,
  strapiImageSchema,
  strapiImagesSchema,
  extractImageUrl,
  extractImageUrls,
} from "./strapi";

// ---------------------------------------------------------------------------
// Strapi v5 dynamic zone schemas
// ---------------------------------------------------------------------------

const strapiLienExterneSchema = z.object({
  id: z.number(),
  label: z.string(),
  url: z.string(),
});

const strapiElementChecklistSchema = z.object({
  id: z.number(),
  texte: z.string(),
});

const strapiElementDropdownSchema = z.object({
  id: z.number(),
  titre: z.string(),
  description: z.string(),
});

const strapiBlocSchema = z.object({
  __component: z.literal("guide.bloc"),
  id: z.number(),
  titre: z.string(),
  surtitre: z.string().nullable().optional(),
  contenu: z.string().nullable(),
  images: strapiImagesSchema.nullable().optional().transform((v) => v ?? []),
  liens: z.array(strapiLienExterneSchema).nullable().optional().transform((v) => v ?? []),
  misEnAvant: z.boolean(),
  centrerBouton: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? false),
});

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
});

const strapiChecklistSchema = z.object({
  __component: z.literal("guide.checklist"),
  id: z.number(),
  titre: z.string(),
  elements: z.array(strapiElementChecklistSchema),
});

const strapiDropdownSchema = z.object({
  __component: z.literal("guide.dropdown"),
  id: z.number(),
  elements: z.array(strapiElementDropdownSchema),
});

const strapiDynamicZoneSchema = z.discriminatedUnion("__component", [
  strapiBlocSchema,
  strapiNoteSchema,
  strapiChecklistSchema,
  strapiDropdownSchema,
]);

type StrapiDynamicZoneBlock = z.infer<typeof strapiDynamicZoneSchema>;

// ---------------------------------------------------------------------------
// Strapi v5 guide response schema (fields directly on data, no attributes)
// ---------------------------------------------------------------------------

const strapiLocalisationSchema = z.object({
  id: z.number().optional(),
  address: z.string(),
  // Tolérant : si la cliente n'a pas saisi les coordonnées, on fallback
  // sur l'adresse dans le lien Maps (Google accepte une adresse texte en
  // query). Évite de crasher tout le guide pour ce seul champ manquant.
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
});

const strapiGestionnaireSchema = z
  .object({
    id: z.number(),
    documentId: z.string().optional(),
    firstName: z.string(),
    lastName: z.string().nullable().optional(),
    phone: z.string(),
  })
  .nullable();

const strapiCustomPageSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  titre: z.string(),
  slug: z.string(),
  ordre: z.number().nullable().optional().transform((v) => v ?? 0),
  icone: z.string().nullable().optional(),
  contenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
});

// Aligné sur api::destination.destination du backend principal CosyHome :
// champ `nom` (FR) et non `title`.
const strapiDestinationSchema = z
  .object({
    id: z.number(),
    nom: z.string(),
  })
  .nullable()
  .optional();

const REUSABLE_KEYS = [
  "arrivee",
  "depart",
  "parking",
  "logement",
  "dechets",
  "region",
  "reglement",
] as const;
type ReusableKey = (typeof REUSABLE_KEYS)[number];

const strapiContenuReutilisableSchema = z.object({
  id: z.number(),
  nom: z.string(),
  pageDestinee: z.enum(REUSABLE_KEYS),
  ordre: z.number().nullable().optional().transform((v) => v ?? 100),
  contenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
});

// Strapi renvoie la relation manyToMany sous forme de tableau plat.
// On le groupe par pageDestinee côté client pour matcher la structure
// attendue par GuideSection (un array par section).
const strapiContenusReutilisablesSchema = z
  .array(strapiContenuReutilisableSchema)
  .nullable()
  .optional()
  .transform((arr) => arr ?? []);

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
    codeImmeuble: z.string().nullable().optional(),
    codeBoiteACles: z.string().nullable().optional(),
    codesSupplementaires: z
      .array(z.object({ id: z.number().optional(), nom: z.string(), valeur: z.string() }))
      .nullable()
      .optional()
      .transform((v) => v ?? []),
    heureDepart: z.string(),
    noteGenerale: z.string().nullable().optional(),
  }),

  wifi: z.object({
    id: z.number().optional(),
    nomReseau: z.string().nullable(),
    motDePasse: z.string().nullable(),
  }),

  gestionnaire: strapiGestionnaireSchema,

  arriveeContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  departContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  parkingContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  logementContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  dechetsContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  regionContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),
  reglesContenu: z.array(strapiDynamicZoneSchema).nullable().optional().transform((v) => v ?? []),

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
});

const strapiGuideResponseSchema = z.object({
  data: z.array(strapiGuideDataSchema),
  meta: z.object({}).passthrough(),
});

const accessResponseSchema = z.object({
  slug: z.string(),
});

// ---------------------------------------------------------------------------
// Transformer: Strapi v5 → Property
// ---------------------------------------------------------------------------

type StrapiGuideData = z.infer<typeof strapiGuideDataSchema>;

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
      });
    case "guide.note":
      return {
        __component: "guide.note",
        id: block.id,
        surtitre: block.surtitre ?? undefined,
        titre: block.titre ?? undefined,
        contenu: block.contenu,
        centre: block.centre,
      };
    case "guide.checklist":
      return {
        __component: "guide.checklist",
        id: block.id,
        titre: block.titre,
        elements: block.elements.map((e) => ({ texte: e.texte })),
      };
    case "guide.dropdown":
      return {
        __component: "guide.dropdown",
        id: block.id,
        elements: block.elements.map((e) => ({ titre: e.titre, description: e.description })),
      };
  }
}

function transformLocalisation(loc: z.infer<typeof strapiLocalisationSchema>) {
  const hasCoords = loc.latitude != null && loc.longitude != null;
  const mapsQuery = hasCoords
    ? `${loc.latitude},${loc.longitude}`
    : encodeURIComponent(loc.address);
  return {
    address: loc.address,
    mapsUrl: `https://www.google.com/maps?q=${mapsQuery}`,
  };
}

function transformContenusReutilisables(cr: z.infer<typeof strapiContenusReutilisablesSchema>) {
  const transformZone = (blocks: StrapiDynamicZoneBlock[]) => blocks.map(transformDynamicZoneBlock);

  // Initialise les 7 sections vides puis répartit les contenus selon
  // leur pageDestinee, triés par ordre croissant (ordre=100 par défaut).
  const result: Record<ReusableKey, DynamicZoneBlock[][]> = {
    arrivee: [],
    depart: [],
    parking: [],
    logement: [],
    dechets: [],
    region: [],
    reglement: [],
  };
  const sorted = [...cr].sort((a, b) => a.ordre - b.ordre);
  for (const entry of sorted) {
    result[entry.pageDestinee].push(transformZone(entry.contenu));
  }
  return result as Record<ContenusReutilisablesKey, DynamicZoneBlock[][]>;
}

function transformGuide(d: StrapiGuideData): Property {
  const transformZone = (blocks: StrapiDynamicZoneBlock[]) => blocks.map(transformDynamicZoneBlock);

  return propertySchema.parse({
    nom: d.nom,
    slug: d.slug,
    imagePrincipale: extractImageUrl(d.imagePrincipale),
    destination: d.destination?.nom ?? undefined,
    localisation: transformLocalisation(d.localisation),
    whatsapp: d.gestionnaire?.phone ?? "",
    infos: {
      heureArrivee: d.infos.heureArrivee,
      codeImmeuble: d.infos.codeImmeuble ?? undefined,
      codeBoiteACles: d.infos.codeBoiteACles ?? undefined,
      codesSupplementaires: d.infos.codesSupplementaires.map((c) => ({
        nom: c.nom,
        valeur: c.valeur,
      })),
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
  });
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
  },
};

function buildGuideQuery(slug: string, locale: string): string {
  return qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      locale,
      populate: {
        imagePrincipale: { fields: ["url", "alternativeText"] },
        localisation: { populate: "*" },
        gestionnaire: { populate: "*" },
        destination: { fields: ["id", "nom"] },
        wifi: { populate: "*" },
        infos: { populate: "*" },
        arriveeContenu: dynamicZonePopulate,
        departContenu: dynamicZonePopulate,
        parkingContenu: dynamicZonePopulate,
        logementContenu: dynamicZonePopulate,
        dechetsContenu: dynamicZonePopulate,
        regionContenu: dynamicZonePopulate,
        reglesContenu: dynamicZonePopulate,
        contenusReutilisables: {
          fields: ["id", "nom", "pageDestinee", "ordre"],
          populate: { contenu: dynamicZonePopulate },
        },
      },
    },
    { encodeValuesOnly: true },
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function validateCode(code: string): Promise<{ slug: string }> {
  if (USE_MOCK) {
    await delay(200);
    if (!code.trim()) throw new Error("CODE_REQUIRED");
    return { slug: "le-saint-georges" };
  }

  const raw = await strapiPost("/guides/access", { code });
  return accessResponseSchema.parse(raw);
}

export async function fetchGuide(slug: string, locale: string): Promise<Property> {
  if (USE_MOCK) {
    await delay();
    return propertySchema.parse(mockData);
  }

  const raw = await strapiFetch(`/guides?${buildGuideQuery(slug, locale)}`);
  const isDev = import.meta.env.DEV;
  if (isDev) console.log("[fetchGuide] raw response:", JSON.stringify(raw, null, 2));
  try {
    const response = strapiGuideResponseSchema.parse(raw);
    const guide = response.data[0];
    if (!guide) throw new Error("GUIDE_NOT_FOUND");
    const result = transformGuide(guide);
    if (isDev) console.log("[fetchGuide] transform OK");
    return result;
  } catch (err) {
    // L'erreur de parse Strapi est utile en prod (visible dans la console
    // du voyageur si la cliente sauvegarde un schema cassé) — on garde.
    console.error("[fetchGuide] parse/transform error:", err);
    throw err;
  }
}

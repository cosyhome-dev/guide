import { z } from "zod";
import {
  propertySchema,
  dynamicZoneBlockSchema,
  customPageSchema,
  type Property,
  type DynamicZoneBlock,
  type CustomPage,
} from "@/content/property";
import { property as mockData } from "@/content/property";
import { delay } from "./mock";
import { USE_MOCK, strapiFetch, strapiPost, strapiImageSchema, extractImageUrl } from "./strapi";
import { getToken, clearSlug } from "@/hooks/useAccessCode";

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
  // Images par entrée d'accordéon (retour cliente 2026-07-07). Champ média
  // multiple Strapi → tableau de médias.
  images: z
    .array(strapiImageSchema)
    .nullable()
    .optional()
    .transform((v) => v ?? []),
});

const strapiBlocSchema = z.object({
  __component: z.literal("guide.bloc"),
  id: z.number(),
  // titre OPTIONNEL côté Strapi (« laisser vide pour un bloc sans titre »,
  // ex. un règlement = juste du texte). Le front doit être aussi permissif,
  // sinon le bloc échoue la validation et est ignoré (retour cliente 2026-07-05).
  titre: z.string().nullable().optional(),
  surtitre: z.string().nullable().optional(),
  contenu: z.string().nullable(),
  // `images` = champ média multiple Strapi (avant : composant bloc-image) →
  // tableau de médias direct.
  images: z
    .array(strapiImageSchema)
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  liens: z
    .array(strapiLienExterneSchema)
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  misEnAvant: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? false),
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

const strapiAdresseAccesSchema = z.object({
  __component: z.literal("guide.adresse-acces"),
  id: z.number(),
  note: z.string().nullable().optional(),
});

// Les "blocs concrets" qu'on peut trouver dans une DZ ou dans la DZ d'un
// contenu réutilisable (i.e. sans le composant -ref pour éviter la récursion).
const strapiInlineBlockSchema = z.discriminatedUnion("__component", [
  strapiBlocSchema,
  strapiNoteSchema,
  strapiChecklistSchema,
  strapiDropdownSchema,
  strapiAdresseAccesSchema,
]);

type StrapiInlineBlock = z.infer<typeof strapiInlineBlockSchema>;

// Composant « insérer un contenu réutilisable » — résolu et aplati côté
// frontend (le voyageur ne le voit jamais en tant que tel). Sa DZ `contenu`
// est dépliée à la position du ref dans la DZ parente.
const strapiContenuReutilisableRefSchema = z.object({
  __component: z.literal("guide.contenu-reutilisable-ref"),
  id: z.number(),
  contenu: z
    .object({
      id: z.number(),
      // Tolérant : on accepte n'importe quel bloc ici et on valide chaque
      // bloc UN PAR UN dans transformDynamicZone (safeParse). Ainsi un seul
      // sous-bloc mal formé (champ requis vide côté Strapi) n'invalide pas
      // tout le contenu réutilisable — et surtout pas tout le guide.
      contenu: z.array(z.unknown()).nullable().optional(),
    })
    .nullable()
    .optional(),
  // Surcharge par logement (retours cliente 2026-07-07) : en plus du contenu
  // réutilisable mutualisé, la cliente peut ajouter un texte + des photos perso
  // à CE logement. Champ vide = non affiché (pas de toggle). Ces éléments sont
  // FUSIONNÉS dans le dernier bloc du contenu réutilisable (même bloc, avant le
  // séparateur) — voir transformDynamicZone.
  texteSupplementaire: z.string().nullable().optional(),
  photosSupplementaires: z.array(strapiImageSchema).nullable().optional(),
});

// Page personnalisée (retour cliente 2026-07-07) — content-type relié
// `api::guide-page.guide-page`. Tolérant : `contenu` en z.unknown() validé
// bloc par bloc dans transformDynamicZone.
const strapiCustomPageSchema = z.object({
  id: z.number(),
  titre: z.string(),
  icone: z.string().nullable().optional(),
  ordre: z.number().nullable().optional(),
  contenu: z.array(z.unknown()).nullable().optional(),
});

// Une DZ Guide peut contenir des blocs inline OU un ref vers un contenu
// réutilisable. Côté admin, la cliente choisit lequel ajouter ; côté front
// on aplatit les refs avant de rendre.
//
// ⚠️ Résilience : les DZ sont typées `z.unknown()` au niveau du schéma guide
// (voir strapiGuideDataSchema) et chaque bloc est validé UN PAR UN dans
// transformDynamicZone. Un bloc invalide (champ requis laissé vide par la
// cliente) est ignoré + loggé au lieu de faire échouer TOUT le guide — ce
// qui provoquait une redirection perçue comme une déconnexion.

// ---------------------------------------------------------------------------
// Strapi v5 guide response schema (fields directly on data, no attributes)
// ---------------------------------------------------------------------------

const strapiLocalisationSchema = z.object({
  id: z.number().optional(),
  address: z.string(),
  // Champ GPS unique : la cliente colle « 46.30855, 7.48218 » tel que
  // Google Maps le donne — parsé côté guide, ordre indifférent. Si vide,
  // le lien Maps retombe sur l'adresse texte (Google accepte une adresse
  // en query) — évite de crasher le guide pour ce seul champ optionnel.
  gps: z.string().nullable().optional(),
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

// Aligné sur api::destination.destination du backend principal CosyHome :
// champ `nom` (FR) et non `title`.
const strapiDestinationSchema = z
  .object({
    id: z.number(),
    nom: z.string(),
  })
  .nullable()
  .optional();

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

  arriveeContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  departContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  parkingContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  logementContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  dechetsContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  regionContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),
  reglesContenu: z
    .array(z.unknown())
    .nullable()
    .optional()
    .transform((v) => v ?? []),

  pagesPersonnalisees: z
    .array(z.unknown())
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

// Réponse de POST /guides/access : jeton signé HMAC (10 jours) à présenter
// en Bearer sur GET /guides/access/:slug. `expiresAt` (ms epoch) fait FOI :
// le guide le stocke comme expiry de sa session locale (voir setAccess) pour
// que celle-ci expire exactement en même temps que le jeton signé.
const accessResponseSchema = z.object({
  slug: z.string(),
  token: z.string(),
  expiresAt: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Transformer: Strapi v5 → Property
// ---------------------------------------------------------------------------

type StrapiGuideData = z.infer<typeof strapiGuideDataSchema>;

function transformInlineBlock(block: StrapiInlineBlock): DynamicZoneBlock {
  switch (block.__component) {
    case "guide.bloc":
      return dynamicZoneBlockSchema.parse({
        __component: "guide.bloc",
        id: block.id,
        titre: block.titre ?? undefined,
        surtitre: block.surtitre ?? undefined,
        contenu: block.contenu ?? undefined,
        // `images` = champ média multiple → on extrait l'URL de chaque
        // média (et on skip ceux dont l'URL manque).
        images: block.images
          .map((img) => extractImageUrl(img))
          .filter((url): url is string => Boolean(url)),
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
        elements: block.elements.map((e) => ({
          titre: e.titre,
          description: e.description,
          images: e.images
            .map((img) => extractImageUrl(img))
            .filter((url): url is string => Boolean(url)),
        })),
      };
    case "guide.adresse-acces":
      return {
        __component: "guide.adresse-acces",
        id: block.id,
        note: block.note ?? undefined,
      };
  }
}

/**
 * Aplatit une DZ Strapi en blocs frontend :
 *   - Bloc inline → transformé tel quel
 *   - Ref contenu réutilisable → dépliée in-place avec ses blocs concrets
 *
 * Si le ref pointe vers un contenu supprimé/dépublié OU si la permission
 * `find` n'est pas activée sur `contenu-reutilisable`, le populate renvoie
 * `contenu: null` → log warning + skip silencieux (pas de crash).
 *
 * Pas de dédup ici : la cliente peut légitimement vouloir insérer le même
 * contenu réutilisable plusieurs fois dans une section (ex. rappel d'un
 * tip à 2 endroits). L'architecture oneToOne du ref garantit qu'il n'y a
 * pas de duplication parasite Strapi-side.
 */
function transformDynamicZone(blocks: unknown[]): DynamicZoneBlock[] {
  const out: DynamicZoneBlock[] = [];
  const isDev = import.meta.env.DEV;

  // Valide + transforme UN bloc inline. En cas d'échec (champ requis laissé
  // vide dans l'admin, __component inconnu, transform qui lève) : on ignore
  // ce seul bloc + warning, au lieu de faire planter tout le guide.
  const pushInline = (raw: unknown, ctx: string) => {
    const parsed = strapiInlineBlockSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn(
        `[transformDynamicZone] ${ctx} : bloc ignoré (validation Strapi échouée — un champ requis est probablement vide).`,
        isDev ? parsed.error.issues : "",
      );
      return;
    }
    try {
      out.push(transformInlineBlock(parsed.data));
    } catch (err) {
      console.warn(`[transformDynamicZone] ${ctx} : bloc ignoré (transform échoué).`, err);
    }
  };

  for (const raw of blocks) {
    // 1) Ref vers un contenu réutilisable → on déplie ses blocs concrets.
    const ref = strapiContenuReutilisableRefSchema.safeParse(raw);
    if (ref.success) {
      // La relation `contenu` (vers le contenu réutilisable) peut être NULLE :
      // contenu supprimé/dépublié, permission, OU — cas i18n fréquent — la
      // relation n'a pas été recopiée à la traduction (retour cliente : sections
      // vides/blanches en DE). On NE skippe PLUS le ref : on continue pour
      // afficher au moins la surcharge texte/photos propre au logement.
      const reusable = ref.data.contenu;
      if (!reusable && isDev) {
        console.warn(
          `[transformDynamicZone] ref #${ref.data.id} : contenu réutilisable non résolu (relation nulle — supprimé/dépublié, permission, ou relation non recopiée à la traduction). Seule la surcharge éventuelle est affichée.`,
        );
      }
      const startLen = out.length;
      const nested = reusable?.contenu ?? [];
      for (const b of nested) pushInline(b, `contenu réutilisable #${reusable?.id ?? "?"}`);

      // Surcharge par logement (retours cliente 2026-07-07) : texte + photos
      // perso propres à CE logement. Champ vide = ignoré (plus de toggle). On
      // les FUSIONNE dans le MÊME bloc que le contenu réutilisable — pas de bloc
      // séparé, donc pas de séparateur au milieu. Bloc.tsx rend `contenu` puis
      // `ImageGrid(images)`, donc l'ordre voulu est respecté : texte réutilisable
      // → texte perso → photos réutilisables → photos perso. Les photos perso
      // héritent de la lightbox de galerie.
      const texteSupp = ref.data.texteSupplementaire?.trim() ?? "";
      const photosSupp = (ref.data.photosSupplementaires ?? [])
        .map((img) => extractImageUrl(img))
        .filter((url): url is string => Boolean(url));

      if (texteSupp.length > 0 || photosSupp.length > 0) {
        // Cible = dernier bloc issu de CE contenu réutilisable, si c'est un
        // guide.bloc (fusion in-place, objet local non partagé). Sinon fallback
        // sur un guide.bloc synthétique.
        const target = out
          .slice(startLen)
          .reverse()
          .find((b) => b.__component === "guide.bloc");
        if (target && target.__component === "guide.bloc") {
          if (texteSupp.length > 0) target.contenu = `${target.contenu ?? ""}${texteSupp}`;
          if (photosSupp.length > 0) target.images = [...target.images, ...photosSupp];
        } else {
          try {
            out.push(
              dynamicZoneBlockSchema.parse({
                __component: "guide.bloc",
                // Espace d'id dédié : les ids de composants Strapi se recouvrent
                // entre tables → offset pour éviter une collision de clé React.
                id: 1_000_000_000 + ref.data.id,
                contenu: texteSupp.length > 0 ? texteSupp : undefined,
                images: photosSupp,
                liens: [],
                misEnAvant: false,
                centrerBouton: false,
              }),
            );
          } catch (err) {
            console.warn(
              `[transformDynamicZone] surcharge du ref #${ref.data.id} ignorée (transform échoué).`,
              isDev ? err : "",
            );
          }
        }
      }
      continue;
    }
    // 2) Sinon : bloc inline direct posé dans la DZ.
    pushInline(raw, "bloc de section");
  }

  return out;
}

/**
 * Corrige une saisie lat/lng inversée (retour cliente 2026-07-04 : le lien
 * « Itinéraire » envoyait en Éthiopie). Google Maps donne « 46.299, 7.455 »
 * d'un bloc — facile de coller les deux nombres dans les mauvais champs.
 * En Suisse la latitude est toujours ~45.5–48 et la longitude ~5.5–11 :
 * l'inversion est détectable sans ambiguïté, on la répare silencieusement.
 */
function normalizeSwissCoords(lat: number, lng: number): [number, number] {
  const isSwissLat = (n: number) => n >= 45.5 && n <= 48;
  const isSwissLng = (n: number) => n >= 5.5 && n <= 11;
  if (!isSwissLat(lat) && isSwissLng(lat) && isSwissLat(lng)) return [lng, lat];
  return [lat, lng];
}

/**
 * Parse le champ GPS unique (« 46.30855, 7.48218 » collé tel quel depuis
 * Google Maps). Séparateur libre (virgule/espace/point-virgule), ordre
 * indifférent (normalisé via normalizeSwissCoords). Null si illisible.
 */
function parseGps(gps: string): [number, number] | null {
  const nums = gps.match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 2) return null;
  const a = Number(nums[0]);
  const b = Number(nums[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return normalizeSwissCoords(a, b);
}

function transformLocalisation(loc: z.infer<typeof strapiLocalisationSchema>) {
  // Priorité : champ GPS unique → sinon adresse texte (Google Maps accepte
  // une adresse en query).
  const coords = loc.gps ? parseGps(loc.gps) : null;
  const mapsQuery = coords ? coords.join(",") : encodeURIComponent(loc.address);
  return {
    address: loc.address,
    mapsUrl: `https://www.google.com/maps?q=${mapsQuery}`,
  };
}

function transformCustomPages(raw: unknown[]): CustomPage[] {
  const isDev = import.meta.env.DEV;
  const pages: CustomPage[] = [];
  for (const item of raw) {
    const parsed = strapiCustomPageSchema.safeParse(item);
    if (!parsed.success) {
      if (isDev)
        console.warn(
          "[transformCustomPages] page personnalisée ignorée (validation Strapi échouée).",
          parsed.error.issues,
        );
      continue;
    }
    try {
      pages.push(
        customPageSchema.parse({
          id: parsed.data.id,
          titre: parsed.data.titre,
          icone: parsed.data.icone ?? "autre",
          ordre: parsed.data.ordre ?? 0,
          contenu: transformDynamicZone(parsed.data.contenu ?? []),
        }),
      );
    } catch (err) {
      if (isDev)
        console.warn("[transformCustomPages] page personnalisée ignorée (transform échoué).", err);
    }
  }
  // Tri par `ordre` croissant, puis par id pour départager (tri stable).
  return pages.sort((a, b) => a.ordre - b.ordre || a.id - b.id);
}

function transformGuide(d: StrapiGuideData): Property {
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
    arriveeContenu: transformDynamicZone(d.arriveeContenu),
    departContenu: transformDynamicZone(d.departContenu),
    parkingContenu: transformDynamicZone(d.parkingContenu),
    logementContenu: transformDynamicZone(d.logementContenu),
    dechetsContenu: transformDynamicZone(d.dechetsContenu),
    regionContenu: transformDynamicZone(d.regionContenu),
    reglesContenu: transformDynamicZone(d.reglesContenu),
    pagesPersonnalisees: transformCustomPages(d.pagesPersonnalisees),
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * POST /guides/access — valide le couple (slug, code) et retourne le jeton
 * signé. Le populate du guide est désormais FIXÉ CÔTÉ SERVEUR (endpoint
 * protégé GET /guides/access/:slug) : plus aucune query publique.
 *
 * Le backend répond 404 générique que le slug soit inconnu ou le code
 * invalide — l'existence d'un guide ne se vérifie QUE via cet appel.
 */
export async function validateCode(
  slug: string,
  code: string,
): Promise<{ slug: string; token: string; expiresAt?: number }> {
  if (USE_MOCK) {
    await delay(200);
    if (!code.trim()) throw new Error("CODE_REQUIRED");
    return { slug: slug || "le-saint-georges", token: "mock-token" };
  }

  const raw = await strapiPost("/guides/access", { slug, code });
  return accessResponseSchema.parse(raw);
}

export async function fetchGuide(slug: string, locale: string): Promise<Property> {
  if (USE_MOCK) {
    await delay();
    return propertySchema.parse(mockData);
  }

  const token = getToken();
  if (!token) throw new Error("UNAUTHORIZED");

  let raw: unknown;
  try {
    // Endpoint protégé : jeton signé en Bearer, populate défini côté serveur
    // (même shape de réponse que l'ancien GET /guides?filters[slug]=…).
    raw = await strapiFetch(
      `/guides/access/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
      { token },
    );
  } catch (err) {
    // Jeton expiré/invalide côté serveur → on purge la session locale pour
    // que GuideProvider redirige vers le login du bien.
    if (err instanceof Error && err.message === "UNAUTHORIZED") clearSlug();
    throw err;
  }

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

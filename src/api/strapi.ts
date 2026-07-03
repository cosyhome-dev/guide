import { z } from "zod";

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
export const USE_MOCK = !API_URL;

// ---------------------------------------------------------------------------
// Strapi v5 media schemas (flat objects, no data.attributes wrapper)
// ---------------------------------------------------------------------------

export const strapiImageSchema = z
  .object({
    id: z.number(),
    documentId: z.string().optional(),
    url: z.string(),
    alternativeText: z.string().nullable().optional(),
  })
  .nullable();

export const strapiImagesSchema = z
  .array(
    z.object({
      id: z.number(),
      documentId: z.string().optional(),
      url: z.string(),
      alternativeText: z.string().nullable().optional(),
    }),
  )
  .nullable();

export type StrapiImage = z.infer<typeof strapiImageSchema>;
export type StrapiImages = z.infer<typeof strapiImagesSchema>;

// ---------------------------------------------------------------------------
// Image extraction helpers
// ---------------------------------------------------------------------------

function resolveUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_URL.replace(/\/api$/, "")}${url}`;
}

export function extractImageUrl(media: StrapiImage | undefined): string | undefined {
  if (!media) return undefined;
  return resolveUrl(media.url);
}

export function extractImageUrls(media: StrapiImages | undefined): string[] {
  if (!media) return [];
  // Filter out entries with missing/empty url — défensif contre une éventuelle
  // entrée Strapi dégradée (référence orpheline, upload S3 échoué…). Sinon
  // resolveUrl("") produirait une URL bidon qui afficherait une 404 image.
  return media
    .filter((item) => item.url && item.url.trim() !== "")
    .map((item) => resolveUrl(item.url));
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

export async function strapiFetch<T>(
  path: string,
  options?: { token?: string },
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options?.token) headers.Authorization = `Bearer ${options.token}`;
  const res = await fetch(`${API_URL}${path}`, { headers });
  if (!res.ok) {
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error(`API_ERROR_${res.status}`);
  }
  return res.json();
}

export async function strapiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // 404 générique côté backend : slug inconnu OU code invalide (anti-énumération)
    if (res.status === 404) throw new Error("INVALID_CODE");
    if (res.status === 400) throw new Error("BAD_REQUEST");
    if (res.status === 429) throw new Error("RATE_LIMITED");
    throw new Error(`API_ERROR_${res.status}`);
  }
  return res.json();
}

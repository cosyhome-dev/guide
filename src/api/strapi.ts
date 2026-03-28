import { z } from "zod"

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ""
export const USE_MOCK = !API_URL

// ---------------------------------------------------------------------------
// Strapi media schemas
// ---------------------------------------------------------------------------

const strapiImageAttributesSchema = z.object({
  url: z.string(),
  alternativeText: z.string().nullable(),
  width: z.number(),
  height: z.number(),
  formats: z
    .object({
      thumbnail: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
      small: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
      medium: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
      large: z.object({ url: z.string(), width: z.number(), height: z.number() }).optional(),
    })
    .nullable(),
})

export const strapiImageSchema = z.object({
  data: z
    .object({
      id: z.number(),
      attributes: strapiImageAttributesSchema,
    })
    .nullable(),
})

export const strapiImagesSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.number(),
        attributes: strapiImageAttributesSchema,
      }),
    )
    .nullable(),
})

export type StrapiImage = z.infer<typeof strapiImageSchema>
export type StrapiImages = z.infer<typeof strapiImagesSchema>

// ---------------------------------------------------------------------------
// Image extraction helpers
// ---------------------------------------------------------------------------

export function extractImageUrl(media: StrapiImage | undefined): string | undefined {
  const attrs = media?.data?.attributes
  if (!attrs) return undefined
  return attrs.formats?.medium?.url ?? attrs.url
}

export function extractImageUrls(media: StrapiImages | undefined): string[] {
  if (!media?.data) return []
  return media.data.map((item) => item.attributes.formats?.medium?.url ?? item.attributes.url)
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

export async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error("NOT_FOUND")
    throw new Error(`API_ERROR_${res.status}`)
  }
  return res.json()
}

export async function strapiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error("INVALID_CODE")
    if (res.status === 400) throw new Error("BAD_REQUEST")
    throw new Error(`API_ERROR_${res.status}`)
  }
  return res.json()
}

import { staticContentSchema, type StaticContent } from "@/content/static"
import { staticContent as mockData } from "@/content/static"
import { delay } from "./mock"

/**
 * Fetch static content (UI labels, section text).
 * Mock: returns local data.
 * Strapi: GET /api/static-content
 */
export async function fetchStaticContent(): Promise<StaticContent> {
  await delay()
  return staticContentSchema.parse(mockData)
}

import { propertySchema, type Property } from "@/content/property"
import { property as mockData } from "@/content/property"
import { delay } from "./mock"

/**
 * Fetch guide/property data by access code.
 * Mock: returns local data for any valid code.
 * Strapi: GET /api/guides?filters[accessCode][$eq]=xxx&populate=*
 */
export async function fetchGuide(code: string): Promise<Property> {
  await delay()

  if (!code.trim()) {
    throw new Error("CODE_REQUIRED")
  }

  // Mock: accept any non-empty code
  // Strapi: will filter by accessCode and return 404 if not found
  return propertySchema.parse(mockData)
}

/**
 * Validate an access code.
 * Mock: any non-empty code is valid.
 * Strapi: GET /api/guides?filters[accessCode][$eq]=xxx&fields[0]=id
 */
export async function validateCode(code: string): Promise<{ valid: boolean; slug: string }> {
  await delay(200)

  if (!code.trim()) {
    return { valid: false, slug: "" }
  }

  // Mock: always valid
  // Strapi: check if a guide exists with this code
  return { valid: true, slug: "le-saint-georges" }
}

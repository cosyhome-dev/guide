import { z } from "zod"

const emergencyContactSchema = z.object({
  label: z.string(),
  tel: z.string(),
})

export const propertySchema = z.object({
  name: z.string(),
  address: z.string(),
  mapsUrl: z.string().url(),

  checkIn: z.string(),
  checkOut: z.string(),

  codes: z.object({
    building: z.string(),
    keyBox: z.string(),
  }),

  wifi: z.object({
    ssid: z.string(),
    password: z.string(),
  }),

  whatsapp: z.string(),

  emergency: z.object({
    urgences: emergencyContactSchema,
    police: emergencyContactSchema,
    pompiers: emergencyContactSchema,
  }),

  languages: z.array(z.string()),
})

export type Property = z.infer<typeof propertySchema>

export const property: Property = {
  name: "Le Saint Georges",
  address: "Le Saint Georges — [Adresse complète], Valais",
  mapsUrl: "https://maps.google.com/?q=Le+Saint+Georges,+Valais,+Suisse",

  checkIn: "Dès 17h00",
  checkOut: "Avant 11h00",

  codes: {
    building: "4521",
    keyBox: "137617",
  },

  wifi: {
    ssid: "Netplus-d17347",
    password: "9mXmxffe",
  },

  whatsapp: "+41791234567",

  emergency: {
    urgences: { label: "Urgences 144", tel: "+41144" },
    police: { label: "Police 117", tel: "+41117" },
    pompiers: { label: "Pompiers 118", tel: "+41118" },
  },

  languages: ["FR", "EN", "DE", "IT"],
}

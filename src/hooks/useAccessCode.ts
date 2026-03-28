const STORAGE_KEY = "cosyhome-slug"
const EXPIRY_KEY = "cosyhome-slug-expiry"
const TTL_MS = 3 * 24 * 60 * 60 * 1000 // 3 days

export function getSlug(): string {
  const expiry = localStorage.getItem(EXPIRY_KEY)
  if (expiry && Date.now() > Number(expiry)) {
    clearSlug()
    return ""
  }
  return localStorage.getItem(STORAGE_KEY) ?? ""
}

export function setSlug(slug: string) {
  localStorage.setItem(STORAGE_KEY, slug)
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + TTL_MS))
}

export function clearSlug() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(EXPIRY_KEY)
}

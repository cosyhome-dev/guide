const STORAGE_KEY = "cosyhome-slug"

export function getSlug(): string {
  return sessionStorage.getItem(STORAGE_KEY) ?? ""
}

export function setSlug(slug: string) {
  sessionStorage.setItem(STORAGE_KEY, slug)
}

export function clearSlug() {
  sessionStorage.removeItem(STORAGE_KEY)
}

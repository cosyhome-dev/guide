const STORAGE_KEY = "cosyhome-access-code"

export function getAccessCode(): string {
  return sessionStorage.getItem(STORAGE_KEY) ?? ""
}

export function setAccessCode(code: string) {
  sessionStorage.setItem(STORAGE_KEY, code)
}

export function clearAccessCode() {
  sessionStorage.removeItem(STORAGE_KEY)
}

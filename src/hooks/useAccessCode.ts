const STORAGE_KEY = "cosyhome-slug";
const TOKEN_KEY = "cosyhome-token";
const EXPIRY_KEY = "cosyhome-slug-expiry";
// 3 jours — aligné sur l'expiry du jeton signé émis par POST /guides/access.
const TTL_MS = 3 * 24 * 60 * 60 * 1000;

function expireIfNeeded(): boolean {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (expiry && Date.now() > Number(expiry)) {
    clearSlug();
    return true;
  }
  return false;
}

export function getSlug(): string {
  if (expireIfNeeded()) return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

/** Jeton signé (Bearer) émis par le backend — exigé par GET /guides/access/:slug. */
export function getToken(): string {
  if (expireIfNeeded()) return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

/** Stocke la session d'accès complète (slug + jeton) avec le TTL partagé. */
export function setAccess(slug: string, token: string) {
  localStorage.setItem(STORAGE_KEY, slug);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + TTL_MS));
}

export function clearSlug() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

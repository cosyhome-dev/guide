const STORAGE_KEY = "cosyhome-slug";
const TOKEN_KEY = "cosyhome-token";
const EXPIRY_KEY = "cosyhome-slug-expiry";
// Fallback si le backend ne renvoie pas d'`expiresAt` (mode mock). En prod on
// stocke l'`expiresAt` du jeton signé (source de vérité) — voir setAccess.
const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 jours

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

/**
 * Vrai si une session valide (jeton signé non expiré) existe pour CE slug.
 * Test UNIQUE partagé par GuideProvider (guide → login si absente) et Login
 * (login → guide si présente). Les deux DOIVENT s'appuyer sur exactement la
 * même logique : sinon ils se renvoient la balle en boucle de redirection.
 */
export function hasSessionFor(slug: string | undefined): boolean {
  return Boolean(slug && getSlug() === slug && getToken());
}

/**
 * Stocke la session d'accès complète (slug + jeton) avec son expiry.
 * `expiresAt` (ms epoch) vient du backend et fait FOI : la session locale
 * expire EXACTEMENT quand le jeton signé expire — pas de désalignement qui
 * provoquerait une reconnexion prématurée ou un 401 surprise. Fallback sur le
 * TTL local uniquement si l'expiry serveur est absent (mode mock).
 */
export function setAccess(slug: string, token: string, expiresAt?: number) {
  localStorage.setItem(STORAGE_KEY, slug);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, String(expiresAt ?? Date.now() + TTL_MS));
}

export function clearSlug() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

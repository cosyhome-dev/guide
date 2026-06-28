import { Link, useLocation } from "react-router-dom";
import { useLocale, type Locale, LOCALES, LOCALE_LABELS } from "@/hooks";
import logoRect from "@/assets/logo-cosyhome-rect-dark.png";
import { cn } from "@/lib";

/**
 * Page 404 — port pixel-perfect de reference-design-guide/NotFound.tsx :
 * pleine page centrée avec titre, description, CTA "Retour à l'accueil",
 * puis Footer avec logo + copyright + sélecteur de langue.
 *
 * Fallback i18n inline FR/EN/IT/DE pour fonctionner même sans Strapi
 * (page atteinte par définition hors flow normal).
 */

const COPY: Record<Locale, { title: string; description: string; back: string; brand: string }> = {
  fr: {
    title: "Page introuvable",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    back: "Retour à l'accueil",
    brand: "CosyHome Conciergerie",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist or has been moved.",
    back: "Back to home",
    brand: "CosyHome Conciergerie",
  },
  it: {
    title: "Pagina non trovata",
    description: "La pagina che cerca non esiste o è stata spostata.",
    back: "Torna alla home",
    brand: "CosyHome Conciergerie",
  },
  de: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    back: "Zurück zur Startseite",
    brand: "CosyHome Conciergerie",
  },
};

export default function NotFound() {
  const { locale, setLocale } = useLocale();
  const location = useLocation();
  const t = COPY[locale] ?? COPY.fr;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn("[404]", location.pathname);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-0">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-4 text-foreground text-4xl">
            {t.title} <i>404</i>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{t.description}</p>
          <Link
            to={`/${locale}`}
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 text-xs font-light uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            {t.back}
          </Link>
        </div>
      </div>

      {/* Footer (port ref Lovable : logo + copyright + sélecteur langue) */}
      <footer className="border-t border-border bg-[hsl(30,17%,91%)]">
        <div className="px-4 py-8 md:px-8 max-w-6xl mx-auto flex flex-col items-center gap-4">
          <a href="https://www.cosyhomeconciergerie.ch" target="_blank" rel="noopener noreferrer">
            <img
              src={logoRect}
              alt={t.brand}
              className="h-24 brightness-0 opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>
          <p
            className="text-muted-foreground/80 uppercase"
            style={{ fontSize: "10px", fontWeight: 300, letterSpacing: "1.2px" }}
          >
            © {new Date().getFullYear()} {t.brand}. Tous droits réservés.
          </p>
          <div className="flex items-center justify-center gap-3 py-3 text-xs">
            {LOCALES.map((lang, idx) => (
              <span key={lang} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLocale(lang)}
                  className={cn(
                    "uppercase tracking-wider transition-colors hover:text-foreground",
                    lang === locale
                      ? "font-semibold underline text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-current={lang === locale ? "true" : undefined}
                >
                  {LOCALE_LABELS[lang]}
                </button>
                {idx < LOCALES.length - 1 && (
                  <span className="text-muted-foreground/40">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

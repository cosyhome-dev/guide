import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocale, type Locale } from "@/hooks";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

/**
 * Page 404 — port pixel-perfect de reference-design-guide/NotFound.tsx.
 * Layout pleine page centré + Footer logo/copyright/langue (composant).
 *
 * Fallback i18n inline FR/EN/IT/DE (la 404 est par définition hors flow
 * Strapi, doit fonctionner même sans API).
 */

const COPY: Record<Locale, { title: string; description: string; back: string }> = {
  fr: {
    title: "Page introuvable",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    back: "Retour à l'accueil",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist or has been moved.",
    back: "Back to home",
  },
  it: {
    title: "Pagina non trovata",
    description: "La pagina che cerca non esiste o è stata spostata.",
    back: "Torna alla home",
  },
  de: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    back: "Zurück zur Startseite",
  },
};

export default function NotFound() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const t = COPY[locale] ?? COPY.fr;

  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-0">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-4 text-foreground text-4xl">
            {t.title} <i>404</i>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{t.description}</p>
          <Button
            onClick={() => navigate(`/${locale}`)}
            className="text-xs font-light uppercase tracking-wider"
          >
            {t.back}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { useLocale, type Locale } from "@/hooks";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

const COPY: Record<Locale, { title: string; description: string; back: string; brand: string }> = {
  fr: {
    title: "Page introuvable",
    description: "Le lien demandé n'existe pas ou a été déplacé. Votre guide de séjour est accessible à tout moment via le lien communiqué par votre concierge.",
    back: "Retour à l'accueil",
    brand: "CosyHome Conciergerie",
  },
  en: {
    title: "Page not found",
    description: "The link you followed doesn't exist or has been moved. Your stay guide is accessible at any time through the link provided by your concierge.",
    back: "Back to home",
    brand: "CosyHome Conciergerie",
  },
  it: {
    title: "Pagina non trovata",
    description: "Il link richiesto non esiste o è stato spostato. La sua guida di soggiorno è accessibile in qualsiasi momento tramite il link comunicato dal concierge.",
    back: "Torna alla home",
    brand: "CosyHome Conciergerie",
  },
  de: {
    title: "Seite nicht gefunden",
    description: "Der angeforderte Link existiert nicht oder wurde verschoben. Ihr Aufenthaltsleitfaden ist jederzeit über den von Ihrem Concierge mitgeteilten Link zugänglich.",
    back: "Zurück zur Startseite",
    brand: "CosyHome Conciergerie",
  },
};

export default function NotFound() {
  const { locale } = useLocale();
  const location = useLocation();
  const t = COPY[locale] ?? COPY.fr;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn("[404]", location.pathname);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — Hero image (cohérent avec Login) */}
      <div className="relative h-[40vh] md:h-screen md:w-1/2">
        <img src={heroImage} alt={t.brand} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <img src={cosyhomeLogo} alt="" className="w-[250px] md:w-[320px] h-auto" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logoCopyright} alt={t.brand} className="h-[100px] md:h-[150px] w-auto" />
        </div>
      </div>

      {/* Right — Message + CTA */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-sm text-center md:text-left">
          <h1 className="text-2xl mb-3">
            {t.title} <i className="text-muted-foreground">404</i>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{t.description}</p>
          <Link
            to={`/${locale}`}
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}

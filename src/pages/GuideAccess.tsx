import { useLocale, type Locale } from "@/hooks";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

/**
 * Page d'entrée /fr/ — message d'attente sans formulaire de connexion.
 * Port pixel-perfect de reference-design-guide/src/pages/GuideAccess.tsx.
 *
 * Sécurité : le login (saisie code) n'est accessible QUE via l'URL
 * /fr/[slug]/ — l'attaquant doit connaître à la fois le nom du logement
 * et le code d'accès pour entrer.
 *
 * Fallback i18n inline FR/EN/IT/DE (page hors flow Strapi).
 */

const COPY: Record<Locale, { title: string; message: string; brand: string }> = {
  fr: {
    title: "Guide de séjour",
    message:
      "Votre guide de séjour est accessible à tout moment via le lien communiqué par votre concierge.",
    brand: "CosyHome Conciergerie",
  },
  en: {
    title: "Stay guide",
    message:
      "Your stay guide is accessible at any time through the link provided by your concierge.",
    brand: "CosyHome Conciergerie",
  },
  it: {
    title: "Guida di soggiorno",
    message:
      "La sua guida di soggiorno è accessibile in qualsiasi momento tramite il link comunicato dal concierge.",
    brand: "CosyHome Conciergerie",
  },
  de: {
    title: "Aufenthaltsleitfaden",
    message:
      "Ihr Aufenthaltsleitfaden ist jederzeit über den von Ihrem Concierge mitgeteilten Link zugänglich.",
    brand: "CosyHome Conciergerie",
  },
};

export default function GuideAccess() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.fr;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left - Image */}
      <div className="relative h-[40vh] md:h-screen md:w-1/2">
        <img src={heroImage} alt={t.brand} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.25]">
          <img src={cosyhomeLogo} alt="" className="w-[250px] md:w-[320px] h-auto" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logoCopyright}
            alt={t.brand}
            className="h-[100px] md:h-[150px] w-auto"
          />
        </div>
      </div>

      {/* Right - Content */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="mb-3 text-foreground">{t.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

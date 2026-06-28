import { useLocale, LOCALES, LOCALE_LABELS } from "@/hooks";
import { cn } from "@/lib";
import logoRect from "@/assets/logo-rectangle.png";

/**
 * Footer — port pixel-perfect de reference-design-guide/Footer.tsx :
 * logo rect noir + copyright + sélecteur de langue.
 *
 * Branchement à notre hook useLocale (au lieu du localStorage statique ref)
 * pour intégrer le routing i18n du guide.
 */
export default function Footer() {
  const { locale, setLocale } = useLocale();

  return (
    <footer className="border-t border-border mt-12 bg-[hsl(30,17%,91%)]">
      <div className="px-4 py-8 md:px-8 max-w-6xl mx-auto flex flex-col items-center gap-4">
        <a href="https://www.cosyhomeconciergerie.ch" target="_blank" rel="noopener noreferrer">
          <img
            src={logoRect}
            alt="CosyHome Conciergerie"
            className="h-24 brightness-0 opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
        <p
          className="text-muted-foreground/80 uppercase"
          style={{ fontSize: "10px", fontWeight: 300, letterSpacing: "1.2px" }}
        >
          © {new Date().getFullYear()} CosyHome Conciergerie. Tous droits réservés.
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
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { useStaticContent, useValidateCode, useLocale, setSlug, type Locale } from "@/hooks";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

/**
 * Fallback i18n minimal — utilisé si Strapi n'a pas encore répondu
 * (network lent, instance qui redémarre, etc.) afin que la page ne
 * reste jamais blanche. Le copy principal vient de Strapi (login.*),
 * ce dictionnaire est juste un filet de sécurité.
 */
const FALLBACK_COPY: Record<Locale, {
  title: string;
  waitingMessage: string;
  haveCodeToggle: string;
  codeLabel: string;
  codePlaceholder: string;
  submit: string;
  noCodePrefix: string;
  noCodeLink: string;
  noCodeWhatsapp: string;
  error: string;
  brand: string;
}> = {
  fr: {
    title: "Votre guide de séjour",
    waitingMessage: "Votre guide de séjour est accessible à tout moment via le lien communiqué par votre concierge.",
    haveCodeToggle: "Vous avez reçu un code d'accès ?",
    codeLabel: "Code d'accès",
    codePlaceholder: "Entrez votre code",
    submit: "Accéder au guide",
    noCodePrefix: "Vous n'avez pas reçu de code ?",
    noCodeLink: "Contactez votre concierge",
    noCodeWhatsapp: "+41791234567",
    error: "Veuillez entrer votre code d'accès",
    brand: "CosyHome Conciergerie",
  },
  en: {
    title: "Your stay guide",
    waitingMessage: "Your stay guide is accessible at any time through the link provided by your concierge.",
    haveCodeToggle: "Did you receive an access code?",
    codeLabel: "Access code",
    codePlaceholder: "Enter your code",
    submit: "Access guide",
    noCodePrefix: "Didn't receive a code?",
    noCodeLink: "Contact your concierge",
    noCodeWhatsapp: "+41791234567",
    error: "Please enter your access code",
    brand: "CosyHome Conciergerie",
  },
  it: {
    title: "La sua guida di soggiorno",
    waitingMessage: "La sua guida di soggiorno è accessibile in qualsiasi momento tramite il link comunicato dal concierge.",
    haveCodeToggle: "Ha ricevuto un codice d'accesso?",
    codeLabel: "Codice d'accesso",
    codePlaceholder: "Inserisca il suo codice",
    submit: "Accedi alla guida",
    noCodePrefix: "Non ha ricevuto un codice?",
    noCodeLink: "Contatti il suo concierge",
    noCodeWhatsapp: "+41791234567",
    error: "La preghiamo di inserire il suo codice",
    brand: "CosyHome Conciergerie",
  },
  de: {
    title: "Ihr Aufenthaltsleitfaden",
    waitingMessage: "Ihr Aufenthaltsleitfaden ist jederzeit über den von Ihrem Concierge mitgeteilten Link zugänglich.",
    haveCodeToggle: "Haben Sie einen Zugangscode erhalten?",
    codeLabel: "Zugangscode",
    codePlaceholder: "Geben Sie Ihren Code ein",
    submit: "Zum Leitfaden",
    noCodePrefix: "Keinen Code erhalten?",
    noCodeLink: "Kontaktieren Sie Ihren Concierge",
    noCodeWhatsapp: "+41791234567",
    error: "Bitte geben Sie Ihren Zugangscode ein",
    brand: "CosyHome Conciergerie",
  },
};

export default function Login() {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [codeFormOpen, setCodeFormOpen] = React.useState(false);
  const navigate = useNavigate();

  const { locale } = useLocale();
  const { data: content } = useStaticContent();
  const validateCode = useValidateCode();

  // Copy : Strapi en priorité, fallback i18n inline si pas encore chargé
  // (évite la page blanche quand l'API met du temps à répondre).
  const fb = FALLBACK_COPY[locale] ?? FALLBACK_COPY.fr;
  const t = {
    title: fb.title,
    waitingMessage: fb.waitingMessage,
    haveCodeToggle: fb.haveCodeToggle,
    codeLabel: content?.login.codeLabel ?? fb.codeLabel,
    codePlaceholder: content?.login.codePlaceholder ?? fb.codePlaceholder,
    submit: content?.login.submit ?? fb.submit,
    noCodePrefix: content?.login.noCodePrefix ?? fb.noCodePrefix,
    noCodeLink: content?.login.noCodeLink ?? fb.noCodeLink,
    noCodeWhatsapp: content?.login.noCodeWhatsapp ?? fb.noCodeWhatsapp,
    error: content?.login.error ?? fb.error,
    brand: content?.alt.brand ?? fb.brand,
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError(t.error);
      return;
    }

    validateCode.mutate(code, {
      onSuccess: (result) => {
        setSlug(result.slug);
        navigate(`/${locale}/guide/${result.slug}`);
      },
      onError: () => {
        setError(t.error);
      },
    });
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — Hero image */}
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

      {/* Right — Welcome message + (optional) code form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl mb-3">{t.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t.waitingMessage}</p>
          </div>

          {!codeFormOpen ? (
            <button
              type="button"
              onClick={() => setCodeFormOpen(true)}
              className="text-small text-accent underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {t.haveCodeToggle}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-upper mb-1.5 block">{t.codeLabel}</label>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={t.codePlaceholder}
                  autoFocus
                  className="w-full bg-card border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {error && <p className="text-destructive text-small mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={validateCode.isPending}
                className="w-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {validateCode.isPending ? "..." : t.submit}
              </button>
            </form>
          )}

          <p className="text-small text-muted-foreground mt-8 text-center">
            {t.noCodePrefix}{" "}
            <a
              href={`https://wa.me/${t.noCodeWhatsapp.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {t.noCodeLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

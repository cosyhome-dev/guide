import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStaticContent, useValidateCode, useLocale, setAccess, type Locale } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

/**
 * Page Login — port pixel-perfect de reference-design-guide/Login.tsx.
 * Layout split (hero gauche / form droite), form visible direct.
 *
 * Fallback i18n inline FR/EN/IT/DE pour fonctionner même si Strapi
 * static-content est down ou pas saisi.
 */

const FALLBACK_COPY: Record<Locale, {
  title: string;
  description: string;
  codeLabel: string;
  codePlaceholder: string;
  submit: string;
  noCodeLine: string;
  error: string;
  rateLimited: string;
  brand: string;
}> = {
  fr: {
    title: "Guide de séjour",
    description:
      "Entrez le code d'accès fourni dans votre confirmation de réservation pour accéder au guide de votre logement.",
    codeLabel: "Code d'accès",
    codePlaceholder: "Entrez votre code",
    submit: "Accéder au guide",
    noCodeLine: "Vous n'avez pas reçu de code ? Contactez votre concierge.",
    error: "Veuillez entrer votre code d'accès",
    rateLimited: "Trop de tentatives — réessayez dans quelques minutes.",
    brand: "CosyHome Conciergerie",
  },
  en: {
    title: "Stay guide",
    description:
      "Enter the access code provided in your booking confirmation to access your property guide.",
    codeLabel: "Access code",
    codePlaceholder: "Enter your code",
    submit: "Access guide",
    noCodeLine: "Didn't receive a code? Contact your concierge.",
    error: "Please enter your access code",
    rateLimited: "Too many attempts — please try again in a few minutes.",
    brand: "CosyHome Conciergerie",
  },
  it: {
    title: "Guida di soggiorno",
    description:
      "Inserisca il codice d'accesso fornito nella conferma di prenotazione per accedere alla guida del suo alloggio.",
    codeLabel: "Codice d'accesso",
    codePlaceholder: "Inserisca il codice",
    submit: "Accedi alla guida",
    noCodeLine: "Non ha ricevuto un codice? Contatti il suo concierge.",
    error: "Inserisca il codice d'accesso",
    rateLimited: "Troppi tentativi — riprovi tra qualche minuto.",
    brand: "CosyHome Conciergerie",
  },
  de: {
    title: "Aufenthaltsleitfaden",
    description:
      "Geben Sie den in Ihrer Buchungsbestätigung erhaltenen Zugangscode ein, um auf den Leitfaden Ihrer Unterkunft zuzugreifen.",
    codeLabel: "Zugangscode",
    codePlaceholder: "Code eingeben",
    submit: "Zum Leitfaden",
    noCodeLine: "Keinen Code erhalten? Kontaktieren Sie Ihren Concierge.",
    error: "Bitte geben Sie Ihren Zugangscode ein",
    rateLimited: "Zu viele Versuche — bitte versuchen Sie es in einigen Minuten erneut.",
    brand: "CosyHome Conciergerie",
  },
};

export default function Login() {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const { slug: slugFromUrl } = useParams<{ slug: string }>();

  const { locale } = useLocale();
  const { data: content } = useStaticContent();
  const validateCode = useValidateCode();

  // Copy : Strapi en priorité, fallback i18n inline si pas encore chargé
  const fb = FALLBACK_COPY[locale] ?? FALLBACK_COPY.fr;
  const t = {
    title: content?.login.title ?? fb.title,
    description: content?.login.description ?? fb.description,
    codeLabel: content?.login.codeLabel ?? fb.codeLabel,
    codePlaceholder: content?.login.codePlaceholder ?? fb.codePlaceholder,
    submit: content?.login.submit ?? fb.submit,
    noCodeLine: fb.noCodeLine,
    error: content?.login.error ?? fb.error,
    rateLimited: fb.rateLimited,
    brand: content?.alt.brand ?? fb.brand,
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !slugFromUrl) {
      setError(t.error);
      return;
    }
    // Sécurité : la validation slug + code est faite CÔTÉ SERVEUR (réponse
    // générique anti-énumération) et le jeton signé retourné est lié au
    // slug — un code valide pour un AUTRE bien ne donne jamais accès.
    validateCode.mutate(
      { slug: slugFromUrl, code },
      {
        onSuccess: (result) => {
          setAccess(result.slug, result.token);
          navigate(`/${locale}/${result.slug}/guide/`);
        },
        onError: (err) =>
          setError(err instanceof Error && err.message === "RATE_LIMITED" ? t.rateLimited : t.error),
      },
    );
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — Hero image */}
      <div className="relative h-[40vh] md:h-screen md:w-1/2">
        <img src={heroImage} alt={t.brand} fetchPriority="high" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.25]">
          <img src={cosyhomeLogo} alt="" className="w-[250px] md:w-[320px] h-auto" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logoCopyright} alt={t.brand} className="h-[100px] md:h-[150px] w-auto" />
        </div>
      </div>

      {/* Right — Login form (visible direct, comme la ref Lovable) */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="mb-3 text-foreground">{t.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {t.codeLabel}
              </label>
              <Input
                value={code}
                onChange={handleCodeChange}
                placeholder={t.codePlaceholder}
                className="bg-white border-border"
              />
              {error && <p className="text-destructive text-small mt-1.5">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={validateCode.isPending}
              className="w-full text-xs font-light uppercase tracking-wider"
            >
              {validateCode.isPending ? "..." : t.submit}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-8 text-left">{t.noCodeLine}</p>
        </div>
      </div>
    </div>
  );
}

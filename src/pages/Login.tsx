import React from "react";
import { useNavigate } from "react-router-dom";
import { useStaticContent, useValidateCode, useLocale, setSlug } from "@/hooks";
import heroImage from "@/assets/hero-guide.jpg";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";
import logoCopyright from "@/assets/logo-copyright-blanc.png";

export default function Login() {
  // States
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  // Hooks
  const { locale } = useLocale();
  const { data: content } = useStaticContent();
  const validateCode = useValidateCode();

  const t = content?.login;
  const alt = content?.alt;

  // Handlers
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError(t?.error ?? "");
      return;
    }

    validateCode.mutate(code, {
      onSuccess: (result) => {
        setSlug(result.slug);
        navigate(`/${locale}/guide/${result.slug}`);
      },
      onError: () => {
        setError(t?.error ?? "");
      },
    });
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  // Render
  if (!content) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — Hero image */}
      <div className="relative h-[40vh] md:h-screen md:w-1/2">
        <img src={heroImage} alt={alt?.brand} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <img src={cosyhomeLogo} alt="" className="w-[250px] md:w-[320px] h-auto" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logoCopyright} alt={alt?.brand} className="h-[100px] md:h-[150px] w-auto" />
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-2xl mb-3">{t?.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{t?.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-upper mb-1.5 block">{t?.codeLabel}</label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder={t?.codePlaceholder}
                className="w-full bg-card border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {error && <p className="text-destructive text-small mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={validateCode.isPending}
              className="w-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {validateCode.isPending ? "..." : t?.submit}
            </button>
          </form>

          <p className="text-small text-muted-foreground mt-8 text-center">
            {t?.noCodePrefix}{" "}
            <a
              href={`https://wa.me/${t?.noCodeWhatsapp.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {t?.noCodeLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

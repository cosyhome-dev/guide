import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Phone, MapPin, Shield, Globe, LogOut } from "lucide-react";
import { cn } from "@/lib";
import { useGuideContext, useLocale, LOCALES, LOCALE_LABELS } from "@/hooks";
import { clearSlug } from "@/hooks/useAccessCode";
import type { Locale } from "@/hooks";
import logoRectDark from "@/assets/logo-cosyhome-rect-dark.png";

interface GuideLayoutProps {
  children: React.ReactNode;
  hideEmergency?: boolean;
  /**
   * Si true → header en overlay sur le hero image (absolute, gradient
   * black/40 → transparent, logo blanc, texts blancs). Utilisé sur
   * GuideHome (ref Lovable pattern : image hero qui passe sous le header).
   */
  overlayHeader?: boolean;
}

export default function GuideLayout({
  children,
  hideEmergency = false,
  overlayHeader = false,
}: GuideLayoutProps) {
  // Hooks
  const { content, property } = useGuideContext();
  const { locale, setLocale } = useLocale();
  const navigate = useNavigate();

  // States
  const location = useLocation();
  const [langOpen, setLangOpen] = React.useState(false);

  // Derived
  const basePath = `/${locale}/${property.slug}/guide`;
  const navItems = [
    { icon: Home, label: content.nav.home, to: basePath },
    { icon: Shield, label: content.nav.rules, to: `${basePath}/rules` },
    {
      icon: Phone,
      label: content.nav.contact,
      // wa.me exige des CHIFFRES uniquement (indicatif inclus, sans + ni
      // espaces). On strippe tout non-chiffre — le numéro saisi côté Strapi peut
      // être humanisé, ex. « +41 79 915 85 00 » → « 41799158500 » (retour cliente
      // 2026-07-07 : espaces dans l'URL → lien cassé).
      href: `https://wa.me/${property.whatsapp.replace(/\D/g, "")}`,
    },
    { icon: MapPin, label: content.nav.route, href: property.localisation.mapsUrl },
  ] as const;

  const urgences = content.urgences;

  // Handlers
  function handleLangSelect(lang: Locale) {
    setLocale(lang);
    setLangOpen(false);
  }

  function handleLogout() {
    clearSlug();
    navigate(`/${locale}`);
  }

  // Render
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header (sticky par défaut, overlay sur hero si overlayHeader=true) */}
      <header
        className={cn(
          "z-50",
          overlayHeader
            ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent"
            : "border-b bg-card/80 backdrop-blur-sm sticky top-0",
        )}
      >
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to={basePath}>
            <img
              src={logoRectDark}
              alt={content.alt.brand}
              className={cn(
                "h-[40px] w-auto object-contain",
                overlayHeader && "brightness-0 invert",
              )}
            />
          </Link>

          <div className="flex items-center gap-4">
            <span
              className={cn(
                "hidden sm:block",
                overlayHeader ? "text-white/90" : "text-muted-foreground",
              )}
              style={{
                fontFamily: "'ivyora-display', ui-serif, Georgia, serif",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              {property.nom}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={cn(
                "transition-colors p-1",
                overlayHeader
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] tracking-wider uppercase px-2 py-1 rounded-sm border transition-colors",
                  overlayHeader
                    ? "text-white/80 hover:text-white border-white/20 hover:border-white/40"
                    : "text-muted-foreground hover:text-foreground border-transparent hover:border-border",
                )}
              >
                <Globe size={14} strokeWidth={1.5} />
                <span>{LOCALE_LABELS[locale]}</span>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-card border rounded-sm shadow-lg z-50 overflow-hidden">
                    {LOCALES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLangSelect(lang)}
                        className={cn(
                          "block w-full text-left px-4 py-2 text-[11px] tracking-wider uppercase transition-colors",
                          lang === locale
                            ? "text-accent bg-accent/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {LOCALE_LABELS[lang]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Emergency footer */}
      {!hideEmergency && (
        <div className="border-t bg-card/50 py-3">
          <div className="mx-auto max-w-5xl px-4 flex justify-center gap-6 label-upper text-muted-foreground">
            {[
              { label: urgences.urgencesLabel, tel: urgences.urgencesTel },
              { label: urgences.policeLabel, tel: urgences.policeTel },
              { label: urgences.pompiersLabel, tel: urgences.pompiersTel },
            ].map((item) => (
              <a
                key={item.tel}
                href={`tel:${item.tel}`}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="border-t bg-[hsl(30,17%,91%)] sticky bottom-0 z-50">
        <div className="mx-auto max-w-5xl px-2">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const itemClass = cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-sm transition-colors",
                "to" in item && location.pathname === item.to
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground",
              );

              if ("href" in item) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={itemClass}
                  >
                    <item.icon size={20} strokeWidth={1.5} />
                    <span className="label-upper">{item.label}</span>
                  </a>
                );
              }

              return (
                <Link key={item.to} to={item.to} className={itemClass}>
                  <item.icon size={20} strokeWidth={1.5} />
                  <span className="label-upper">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

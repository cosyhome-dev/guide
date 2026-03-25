import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Phone, MapPin, Shield, Globe } from "lucide-react";
import logoRectDark from "@/assets/logo-cosyhome-rect-dark.png";

const navItems = [
  { icon: Home, label: "Accueil", path: "/guide" },
  { icon: Shield, label: "Règlement", path: "/guide/regles" },
  { icon: Phone, label: "Contact", path: "/guide/contact" },
  { icon: MapPin, label: "Itinéraire", path: "/guide/itineraire" },
];

const languages = ["FR", "EN", "DE", "IT"] as const;

interface GuideLayoutProps {
  children: React.ReactNode;
  propertyName?: string;
  hideEmergency?: boolean;
}

const GuideLayout = ({ children, propertyName = "Le Saint Georges", hideEmergency = false }: GuideLayoutProps) => {
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState<string>("FR");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/guide">
            <img src={logoRectDark} alt="CosyHome Conciergerie" className="h-[40px] w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden sm:block" style={{ fontFamily: "'DM Serif Text', serif", fontSize: '15px' }}>{propertyName}</span>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-sm border border-transparent hover:border-border"
              >
                <Globe size={14} strokeWidth={1.5} />
                <span>{currentLang}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-card border rounded-sm shadow-lg z-50 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-[11px] tracking-wider uppercase transition-colors ${
                          lang === currentLang
                            ? "text-accent bg-accent/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {lang}
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

      {/* Emergency footer — hidden on home */}
      {!hideEmergency && (
        <div className="border-t bg-card/50 py-3">
          <div className="container max-w-5xl mx-auto px-4 flex justify-center gap-6 text-[10px] tracking-wider uppercase text-muted-foreground">
            <a href="tel:+41144" className="hover:text-foreground transition-colors">Urgences 144</a>
            <a href="tel:+41117" className="hover:text-foreground transition-colors">Police 117</a>
            <a href="tel:+41118" className="hover:text-foreground transition-colors">Pompiers 118</a>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="border-t bg-card/90 backdrop-blur-sm sticky bottom-0 z-50">
        <div className="container max-w-5xl mx-auto px-2">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-sm transition-colors ${
                    isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon size={20} strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GuideLayout;

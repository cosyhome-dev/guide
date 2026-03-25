import GuideLayout from "@/components/GuideLayout";
import heroImage from "@/assets/hero-guide.jpg";
import logoRectDark from "@/assets/logo-cosyhome-rect-dark.png";
import {
  LogIn,
  LogOut,
  Car,
  Home,
  Trash2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import cosyhomeLogo from "@/assets/logo-cosyhome.png";

const sections = [
  { icon: LogIn, label: "Arrivée", path: "/guide/arrivee" },
  { icon: LogOut, label: "Départ", path: "/guide/depart" },
  { icon: Car, label: "Parking", path: "/guide/parking" },
  { icon: Home, label: "Le Logement", path: "/guide/logement" },
  { icon: Trash2, label: "Déchets", path: "/guide/dechets" },
  { icon: MapPin, label: "Région", path: "/guide/region" },
];

const GuideHome = () => {
  return (
    <GuideLayout hideEmergency>
      {/* Hero — Version SANS logo */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img
          src={heroImage}
          alt="Le Saint Georges"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/15" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] md:px-8 md:pb-[calc(2rem+10px)] text-center">
          <h1 className="text-primary-foreground text-3xl md:text-4xl mb-1">Bienvenue</h1>
          <p className="text-primary-foreground/80 tracking-[2px] uppercase text-[11px]">Le Saint Georges</p>
        </div>
      </div>



      <div className="container max-w-5xl mx-auto px-4">

      {/* Quick info — Desktop: ligne compacte / Mobile: bandeau épuré */}
        <div className="my-6">
          {/* Desktop / Tablet — Example 1 style */}
          <div className="hidden md:block">
            <div className="flex items-stretch divide-x divide-border rounded-sm border overflow-hidden bg-card">
              <div className="flex-1 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-in</p>
                <p className="font-medium text-sm text-foreground mt-0.5">Dès 17h00</p>
              </div>
              <div className="flex-1 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-out</p>
                <p className="font-medium text-sm text-foreground mt-0.5">Avant 11h00</p>
              </div>
              <div className="flex-1 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Codes d'accès</p>
                <p className="font-medium text-sm text-foreground mt-0.5">Bâtiment : 4521</p>
                <p className="font-medium text-sm text-foreground">Boîte à clé : 137617</p>
              </div>
              <div className="flex-1 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">WiFi</p>
                <p className="font-medium text-sm text-foreground mt-0.5">Netplus-d17347</p>
                <p className="font-medium text-sm text-foreground">MDP : 9mXmxffe</p>
              </div>
            </div>
          </div>

          {/* Mobile — Example 3 style */}
          <div className="md:hidden">
            <div className="bg-card border rounded-sm p-5 space-y-4">
              <div className="flex justify-center gap-8">
                <div className="flex-1 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-in</p>
                  <p className="font-medium text-foreground mt-1">Dès 17h00</p>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-out</p>
                  <p className="font-medium text-foreground mt-1">Avant 11h00</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-center gap-8">
                <div className="flex-1 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Codes d'accès</p>
                  <p className="font-medium text-foreground mt-1">Bâtiment : 4521</p>
                  <p className="font-medium text-foreground">Boîte à clé : 137617</p>
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">WiFi</p>
                  <p className="font-medium text-foreground mt-1">Netplus-d17347</p>
                  <p className="font-medium text-foreground">MDP : 9mXmxffe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-small text-muted-foreground text-center mb-8">
          La clé ouvre la porte de l'immeuble, l'appartement et le local à ski.
        </p>

        {/* Section Grid — increased margins */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-[20px] pb-[50px]">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="bg-card border rounded-sm p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-sm transition-all group"
            >
              <section.icon
                size={26}
                strokeWidth={1.2}
                className="text-muted-foreground group-hover:text-accent transition-colors"
              />
              <span className="text-[11px] tracking-wider uppercase text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </GuideLayout>
  );
};

export default GuideHome;

import { LogIn, LogOut, Car, Home, Trash2, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import GuideLayout from "@/components/GuideLayout"
import { staticContent, property } from "@/content"
import heroImage from "@/assets/hero-guide.jpg"

const t = staticContent.home
const s = staticContent.sections

const sections = [
  { icon: LogIn, label: s.arrivee, path: "/guide/arrivee" },
  { icon: LogOut, label: s.depart, path: "/guide/depart" },
  { icon: Car, label: s.parking, path: "/guide/parking" },
  { icon: Home, label: s.logement, path: "/guide/logement" },
  { icon: Trash2, label: s.dechets, path: "/guide/dechets" },
  { icon: MapPin, label: s.region, path: "/guide/region" },
] as const

export default function GuideHome() {
  return (
    <GuideLayout hideEmergency>
      {/* Hero */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img src={heroImage} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/40 to-primary/15" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] md:px-8 md:pb-[calc(2rem+10px)] text-center">
          <h1 className="text-primary-foreground text-3xl md:text-4xl mb-1">{t.welcome}</h1>
          <p className="text-primary-foreground/80 tracking-[2px] uppercase text-[11px]">
            {property.name}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Quick info */}
        <div className="my-6">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="flex items-stretch divide-x divide-border border overflow-hidden bg-card">
              <QuickInfoCell label={t.checkIn} value={property.checkIn} />
              <QuickInfoCell label={t.checkOut} value={property.checkOut} />
              <QuickInfoCell
                label={t.accessCodes}
                value={`Bâtiment : ${property.codes.building}`}
                extra={`Boîte à clé : ${property.codes.keyBox}`}
              />
              <QuickInfoCell
                label={t.wifi}
                value={property.wifi.ssid}
                extra={`MDP : ${property.wifi.password}`}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="bg-card border p-5 space-y-4">
              <div className="flex justify-center gap-8">
                <QuickInfoCell label={t.checkIn} value={property.checkIn} />
                <div className="w-px bg-border" />
                <QuickInfoCell label={t.checkOut} value={property.checkOut} />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-center gap-8">
                <QuickInfoCell
                  label={t.accessCodes}
                  value={`Bâtiment : ${property.codes.building}`}
                  extra={`Boîte à clé : ${property.codes.keyBox}`}
                />
                <div className="w-px bg-border" />
                <QuickInfoCell
                  label={t.wifi}
                  value={property.wifi.ssid}
                  extra={`MDP : ${property.wifi.password}`}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-small text-muted-foreground text-center mb-8">{t.keyNote}</p>

        {/* Section grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-5 pb-12">
          {sections.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="bg-card border p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-xs transition-all group"
            >
              <section.icon
                size={26}
                strokeWidth={1.2}
                className="text-muted-foreground group-hover:text-accent transition-colors"
              />
              <span className="label-upper text-center group-hover:text-foreground transition-colors">
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </GuideLayout>
  )
}

function QuickInfoCell({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div className="flex-1 p-3 text-center">
      <p className="label-upper">{label}</p>
      <p className="font-medium text-sm text-foreground mt-0.5">{value}</p>
      {extra && <p className="font-medium text-sm text-foreground">{extra}</p>}
    </div>
  )
}

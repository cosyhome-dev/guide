import { LogIn, LogOut, Car, Home, Trash2, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import GuideLayout from "@/components/GuideLayout"
import { useGuideContext } from "@/hooks"
import { fmt } from "@/lib"
import heroImage from "@/assets/hero-guide.jpg"

const sectionKeys = ["arrivee", "depart", "parking", "logement", "dechets", "region"] as const

const sectionIcons: Record<(typeof sectionKeys)[number], typeof LogIn> = {
  arrivee: LogIn,
  depart: LogOut,
  parking: Car,
  logement: Home,
  dechets: Trash2,
  region: MapPin,
}

export default function GuideHome() {
  const { content, property } = useGuideContext()
  const t = content.home
  const f = content.format
  const s = content.sections

  return (
    <GuideLayout hideEmergency>
      {/* Hero */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img src={heroImage} alt={property.nom} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/40 to-primary/15" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] md:px-8 md:pb-[calc(2rem+10px)] text-center">
          <h1 className="text-primary-foreground text-3xl md:text-4xl mb-1">{t.welcome}</h1>
          <p className="text-primary-foreground/80 tracking-[2px] uppercase text-[11px]">
            {property.nom}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Quick info */}
        <div className="my-6">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="flex items-stretch divide-x divide-border border overflow-hidden bg-card">
              <QuickInfoCell label={t.checkIn} value={property.infos.heureArrivee} />
              <QuickInfoCell label={t.checkOut} value={property.infos.heureDepart} />
              <QuickInfoCell
                label={t.accessCodes}
                value={fmt(f.building, property.infos.codeImmeuble)}
                extra={fmt(f.keyBox, property.infos.codeBoiteACles)}
              />
              <QuickInfoCell
                label={t.wifi}
                value={property.wifi.nomReseau}
                extra={fmt(f.password, property.wifi.motDePasse)}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="bg-card border p-5 space-y-4">
              <div className="flex justify-center gap-8">
                <QuickInfoCell label={t.checkIn} value={property.infos.heureArrivee} />
                <div className="w-px bg-border" />
                <QuickInfoCell label={t.checkOut} value={property.infos.heureDepart} />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-center gap-8">
                <QuickInfoCell
                  label={t.accessCodes}
                  value={fmt(f.building, property.infos.codeImmeuble)}
                  extra={fmt(f.keyBox, property.infos.codeBoiteACles)}
                />
                <div className="w-px bg-border" />
                <QuickInfoCell
                  label={t.wifi}
                  value={property.wifi.nomReseau}
                  extra={fmt(f.password, property.wifi.motDePasse)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-5 pb-12">
          {sectionKeys.map((key) => {
            const Icon = sectionIcons[key]
            return (
              <Link
                key={key}
                to={`/guide/${property.slug}/${key}`}
                className="bg-card border p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-xs transition-all group"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span className="label-upper text-center group-hover:text-foreground transition-colors">
                  {s[key]}
                </span>
              </Link>
            )
          })}
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

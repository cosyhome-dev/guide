import { MapPin } from "lucide-react"
import { staticContent, property } from "@/content"
import { PlaceholderImg } from "@/components/guide"

const t = staticContent.parking

export default function SectionParking() {
  return (
    <div className="space-y-6">
      {/* Address card */}
      <a
        href={property.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 bg-card border p-5 hover:border-accent/50 transition-colors text-center"
      >
        <MapPin size={16} className="text-accent" strokeWidth={1.5} />
        <p className="text-sm text-foreground font-medium">{property.address}</p>
        <p className="text-[11px] text-accent">{staticContent.section.openMaps}</p>
      </a>

      {/* Winter note */}
      <div className="bg-accent/10 border border-accent/20 p-4">
        <p className="text-sm text-foreground">{t.winterNote}</p>
      </div>

      {/* Private parking */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.private.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.private.description}</p>
        <PlaceholderImg label="Photo parking / garage" />
      </div>

      {/* Public parking */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.public.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.public.description}</p>
      </div>
    </div>
  )
}

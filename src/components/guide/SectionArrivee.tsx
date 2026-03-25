import { MapPin } from "lucide-react"
import { staticContent, property } from "@/content"
import { ImageGrid } from "@/components/guide"

const t = staticContent.arrivee

export default function SectionArrivee() {
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

      {/* Tip */}
      <div className="bg-accent/10 border border-accent/20 p-4">
        <p className="text-sm text-foreground">{t.tip}</p>
      </div>

      {/* Steps */}
      {t.steps.map((step, i) => (
        <div key={i} className="space-y-3">
          <div className="space-y-1">
            <p className="label-upper">Étape {i + 1}</p>
            <h2 className="text-left">{step.title}</h2>
          </div>
          {step.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          )}
          <ImageGrid labels={step.images} />
        </div>
      ))}
    </div>
  )
}

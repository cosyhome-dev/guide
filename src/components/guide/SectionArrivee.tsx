import { MapPin } from "lucide-react"
import { useGuideContext } from "@/hooks"
import { ImageGrid } from "@/components/guide"

export default function SectionArrivee() {
  const { content, property } = useGuideContext()
  const sec = content.section

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
        <p className="text-[11px] text-accent">{sec.openMaps}</p>
      </a>

      {/* Tip */}
      {property.arriveeTip && (
        <div className="bg-accent/10 border border-accent/20 p-4">
          <p className="text-sm text-foreground">{property.arriveeTip}</p>
        </div>
      )}

      {/* Steps */}
      {property.arriveeSteps.map((step, i) => (
        <div key={i} className="space-y-3">
          <div className="space-y-1">
            <p className="label-upper">
              {sec.stepLabel} {i + 1}
            </p>
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

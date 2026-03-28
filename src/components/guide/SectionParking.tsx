import { MapPin } from "lucide-react"
import { useGuideContext } from "@/hooks"
import { PlaceholderImg } from "@/components/guide"

export default function SectionParking() {
  const { content, property } = useGuideContext()

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
        <p className="text-[11px] text-accent">{content.section.openMaps}</p>
      </a>

      {/* Winter note */}
      {property.parkingWinterNote && (
        <div className="bg-accent/10 border border-accent/20 p-4">
          <p className="text-sm text-foreground">{property.parkingWinterNote}</p>
        </div>
      )}

      {/* Parking blocks */}
      {property.parkingBlocks.map((block, i) => (
        <div key={i} className="space-y-3">
          <h2 className="text-foreground">{block.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
          {block.image && <PlaceholderImg label={block.image} />}
        </div>
      ))}
    </div>
  )
}

import { MapPin } from "lucide-react";
import type { AffichageRegionBlock } from "@/content/property";
import { useGuideContext } from "@/hooks";

interface AffichageRegionProps {
  data: AffichageRegionBlock;
}

export default function AffichageRegion({ data }: AffichageRegionProps) {
  const { content, property } = useGuideContext();

  if (!data.afficher) return null;

  return (
    <a
      href={property.localisation.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 bg-card border p-5 hover:border-accent/50 transition-colors text-center"
    >
      <MapPin size={16} className="text-accent" strokeWidth={1.5} />
      <p className="text-sm text-foreground font-medium">{property.localisation.address}</p>
      <p className="text-[11px] text-accent">{content.section.openMaps}</p>
    </a>
  );
}

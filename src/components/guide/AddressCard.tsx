import { MapPin, ArrowUpRight } from "lucide-react";
import type { AdresseAccesBlock } from "@/content/property";
import { useGuideContext } from "@/hooks";

interface AddressCardProps {
  data: AdresseAccesBlock;
}

/**
 * Adresse & accès — carte cliquable pixel-perfect ref Lovable
 * (cf. reference-design-guide/SectionArrivee.tsx).
 * Adresse + lien Maps lus depuis property.localisation ; note optionnelle
 * saisie dans le composant Strapi.
 */
export default function AddressCard({ data }: AddressCardProps) {
  const { property } = useGuideContext();
  const { address, mapsUrl } = property.localisation;
  const prefix = property.nom ? `${property.nom} — ` : "";

  return (
    <div className="space-y-3">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-2 bg-card border rounded-sm p-5 hover:border-accent/50 transition-all duration-150 active:scale-[0.97] active:bg-secondary/30 text-center"
      >
        <MapPin size={16} className="text-accent" strokeWidth={1.5} />
        <p className="text-sm text-foreground font-medium">
          {prefix}
          {address}
        </p>
        <p className="text-[11px] text-accent inline-flex items-center gap-0.5">
          Ouvrir dans Google Maps
          <ArrowUpRight
            size={12}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </a>
      {data.note && (
        <p className="text-sm text-muted-foreground leading-relaxed">{data.note}</p>
      )}
    </div>
  );
}

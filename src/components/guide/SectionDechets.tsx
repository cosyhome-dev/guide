import { staticContent } from "@/content"
import { PlaceholderImg } from "@/components/guide"

const t = staticContent.dechets

export default function SectionDechets() {
  return (
    <div className="space-y-6">
      {/* Sacs taxés */}
      <div className="bg-card border p-4 space-y-3">
        <h2 className="text-foreground">{t.sacsTaxes.title}</h2>
        {t.sacsTaxes.paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-sm text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
        <PlaceholderImg label="Photo sac taxé officiel" />
      </div>

      {/* Containers */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.containers.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.containers.description}</p>
        <PlaceholderImg label="Photo emplacement containers arrière" />
      </div>

      {/* Collecte */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.collecte.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.collecte.description}</p>
        <PlaceholderImg label="Photo point de collecte verre/PET" />
      </div>
    </div>
  )
}

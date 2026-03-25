import { useGuideContext } from "@/hooks"
import { PlaceholderImg } from "@/components/guide"

export default function SectionDechets() {
  const { content } = useGuideContext()
  const t = content.dechets
  const ph = content.placeholders

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
        <PlaceholderImg label={ph.sacsTaxes} />
      </div>

      {/* Containers */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.containers.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.containers.description}</p>
        <PlaceholderImg label={ph.containers} />
      </div>

      {/* Collecte */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.collecte.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.collecte.description}</p>
        <PlaceholderImg label={ph.collecte} />
      </div>
    </div>
  )
}

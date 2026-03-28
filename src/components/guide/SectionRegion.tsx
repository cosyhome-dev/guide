import { useGuideContext } from "@/hooks"
import { PlaceholderImg, LinkButton } from "@/components/guide"

export default function SectionRegion() {
  const { property } = useGuideContext()

  return (
    <div className="space-y-10">
      {property.blocsRegion.map((block, i) => (
        <div key={i} className="space-y-3">
          <h2 className="text-foreground">{block.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
          {block.ctas && block.ctas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {block.ctas.map((cta) => (
                <LinkButton key={cta.url} title={cta.label} url={cta.url} />
              ))}
            </div>
          )}
          {block.image && <PlaceholderImg label={block.image} />}
        </div>
      ))}
    </div>
  )
}

import { useGuideContext } from "@/hooks"
import { Accordion, ImageGrid } from "@/components/guide"

export default function SectionLogement() {
  const { content } = useGuideContext()
  const t = content.logement

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">{t.intro}</p>

      <Accordion
        items={t.items.map((item) => ({
          title: item.title,
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              <ImageGrid labels={item.images} />
            </div>
          ),
        }))}
      />
    </div>
  )
}

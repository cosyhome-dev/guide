import { staticContent } from "@/content"
import { Accordion, ImageGrid } from "@/components/guide"

const t = staticContent.logement

export default function SectionLogement() {
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

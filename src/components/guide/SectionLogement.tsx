import { useGuideContext } from "@/hooks"
import { Accordion, ImageGrid } from "@/components/guide"

export default function SectionLogement() {
  const { property } = useGuideContext()

  return (
    <div className="space-y-6">
      {property.logement.introduction && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {property.logement.introduction}
        </p>
      )}

      <Accordion
        items={property.logement.elements.map((item) => ({
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

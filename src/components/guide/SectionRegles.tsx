import { useGuideContext } from "@/hooks"
import { Accordion } from "@/components/guide"

export default function SectionRegles() {
  const { property } = useGuideContext()

  return (
    <Accordion
      items={property.regles.map((rule) => ({
        title: rule.title,
        content: <p className="text-sm text-muted-foreground leading-relaxed">{rule.content}</p>,
      }))}
    />
  )
}

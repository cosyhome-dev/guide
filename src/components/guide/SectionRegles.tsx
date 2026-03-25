import { useGuideContext } from "@/hooks"
import { Accordion } from "@/components/guide"

export default function SectionRegles() {
  const { content } = useGuideContext()
  const t = content.regles

  return (
    <Accordion
      items={t.items.map((rule) => ({
        title: rule.title,
        content: <p className="text-sm text-muted-foreground leading-relaxed">{rule.content}</p>,
      }))}
    />
  )
}

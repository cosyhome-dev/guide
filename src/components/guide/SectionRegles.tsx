import { staticContent } from "@/content"
import { Accordion } from "@/components/guide"

const t = staticContent.regles

export default function SectionRegles() {
  return (
    <Accordion
      items={t.items.map((rule) => ({
        title: rule.title,
        content: <p className="text-sm text-muted-foreground leading-relaxed">{rule.content}</p>,
      }))}
    />
  )
}

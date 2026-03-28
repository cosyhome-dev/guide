import { useGuideContext } from "@/hooks"
import { PlaceholderImg } from "@/components/guide"

export default function SectionDechets() {
  const { property } = useGuideContext()

  return (
    <div className="space-y-6">
      {property.blocsDechets.map((block, i) => (
        <div key={i} className={i === 0 ? "bg-card border p-4 space-y-3" : "space-y-3"}>
          <h2 className="text-foreground">{block.title}</h2>
          <div
            className="text-sm text-muted-foreground leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: block.description }}
          />
          {block.image && <PlaceholderImg label={block.image} />}
        </div>
      ))}
    </div>
  )
}
